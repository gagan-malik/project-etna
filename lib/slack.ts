/**
 * Slack Integration
 * Utilities for sending messages to Slack via Incoming Webhooks
 */

export type SlackMessageType = "info" | "success" | "warning" | "error";

export interface SlackMessage {
  text: string;
  type?: SlackMessageType;
  title?: string;
  fields?: Array<{ title: string; value: string; short?: boolean }>;
  timestamp?: boolean;
}

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * Get emoji and color based on message type
 */
function getMessageStyle(type: SlackMessageType): { emoji: string; color: string } {
  switch (type) {
    case "success":
      return { emoji: "✅", color: "#36a64f" };
    case "warning":
      return { emoji: "⚠️", color: "#ffcc00" };
    case "error":
      return { emoji: "🚨", color: "#ff0000" };
    case "info":
    default:
      return { emoji: "ℹ️", color: "#0066cc" };
  }
}

/**
 * Build Slack message blocks for rich formatting
 */
function buildSlackBlocks(message: SlackMessage): SlackBlock[] {
  const style = getMessageStyle(message.type || "info");
  const blocks: SlackBlock[] = [];

  // Header with title
  if (message.title) {
    blocks.push({
      type: "header",
      text: {
        type: "plain_text",
        text: `${style.emoji} ${message.title}`,
        emoji: true,
      },
    });
  }

  // Main message text
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: message.title ? message.text : `${style.emoji} ${message.text}`,
    },
  });

  // Fields (key-value pairs)
  if (message.fields && message.fields.length > 0) {
    blocks.push({
      type: "section",
      fields: message.fields.map((field) => ({
        type: "mrkdwn",
        text: `*${field.title}:*\n${field.value}`,
      })),
    });
  }

  // Timestamp footer
  if (message.timestamp !== false) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `🕐 ${new Date().toISOString()}`,
        },
      ],
    });
  }

  return blocks;
}

/**
 * Send a message to Slack via Incoming Webhook
 * 
 * @param message - The message to send
 * @param webhookUrl - Optional webhook URL override (defaults to SLACK_WEBHOOK_URL env var)
 * @returns Promise<boolean> - true if successful, false otherwise
 * 
 * @example
 * // Simple message
 * await sendSlackMessage({ text: "Cron job completed successfully", type: "success" });
 * 
 * @example
 * // Rich message with fields
 * await sendSlackMessage({
 *   title: "Daily Cleanup Complete",
 *   text: "The scheduled cleanup job has finished.",
 *   type: "success",
 *   fields: [
 *     { title: "Documents Processed", value: "150" },
 *     { title: "Duration", value: "2.3 seconds" },
 *   ],
 * });
 */
export async function sendSlackMessage(
  message: SlackMessage,
  webhookUrl?: string
): Promise<boolean> {
  const url = webhookUrl || process.env.SLACK_WEBHOOK_URL;

  if (!url) {
    console.warn("[Slack] SLACK_WEBHOOK_URL not configured, skipping notification");
    return false;
  }

  try {
    const blocks = buildSlackBlocks(message);
    const style = getMessageStyle(message.type || "info");

    const payload = {
      text: message.title || message.text, // Fallback for notifications
      attachments: [
        {
          color: style.color,
          blocks,
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Slack] Failed to send message:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Slack] Error sending message:", error);
    return false;
  }
}

/**
 * Send a cron job alert to Slack
 * Convenience function for cron job notifications
 */
export async function sendCronAlert(options: {
  jobName: string;
  status: "started" | "completed" | "failed";
  message?: string;
  duration?: number;
  details?: Record<string, string | number>;
}): Promise<boolean> {
  const { jobName, status, message, duration, details } = options;

  const typeMap: Record<string, SlackMessageType> = {
    started: "info",
    completed: "success",
    failed: "error",
  };

  const titleMap: Record<string, string> = {
    started: `Cron Job Started: ${jobName}`,
    completed: `Cron Job Completed: ${jobName}`,
    failed: `Cron Job Failed: ${jobName}`,
  };

  const fields: Array<{ title: string; value: string }> = [];

  if (duration !== undefined) {
    fields.push({ title: "Duration", value: `${duration}ms` });
  }

  if (details) {
    for (const [key, value] of Object.entries(details)) {
      fields.push({ title: key, value: String(value) });
    }
  }

  return sendSlackMessage({
    title: titleMap[status],
    text: message || `The cron job "${jobName}" has ${status}.`,
    type: typeMap[status],
    fields: fields.length > 0 ? fields : undefined,
  });
}

/**
 * Send an error alert to Slack
 * Convenience function for error notifications
 */
export async function sendErrorAlert(options: {
  title: string;
  error: Error | string;
  context?: string;
  additionalInfo?: Record<string, string>;
}): Promise<boolean> {
  const { title, error, context, additionalInfo } = options;

  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const fields: Array<{ title: string; value: string }> = [];

  if (context) {
    fields.push({ title: "Context", value: context });
  }

  if (errorStack) {
    // Truncate stack trace for readability
    const truncatedStack = errorStack.split("\n").slice(0, 5).join("\n");
    fields.push({ title: "Stack Trace", value: `\`\`\`${truncatedStack}\`\`\`` });
  }

  if (additionalInfo) {
    for (const [key, value] of Object.entries(additionalInfo)) {
      fields.push({ title: key, value });
    }
  }

  return sendSlackMessage({
    title,
    text: errorMessage,
    type: "error",
    fields,
  });
}
