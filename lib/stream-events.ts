/**
 * SSE stream event payloads for /api/messages/stream.
 * Backward compatible: clients can ignore `type` and only use `content`/`done`/`error`.
 */

export type StreamContentEvent = {
  content: string;
  done?: false;
  type?: "content";
};

export type StreamToolStartEvent = {
  type: "tool_start";
  name: string;
  id?: string;
};

export type StreamToolResultEvent = {
  type: "tool_result";
  id: string;
  result: unknown;
};

export type StreamBlockEvent = {
  type: "block";
  kind: "code" | "waveform" | "text";
  content: string | object;
};

export type StreamDoneEvent = {
  type?: "done";
  done: true;
};

export type StreamErrorEvent = {
  type?: "error";
  error: string;
  done: true;
};

export type StreamEvent =
  | StreamContentEvent
  | StreamToolStartEvent
  | StreamToolResultEvent
  | StreamBlockEvent
  | StreamDoneEvent
  | StreamErrorEvent;

/**
 * Encode a stream event as a single SSE data line and enqueue it to the controller.
 */
export function enqueueStreamEvent(
  controller: ReadableStreamDefaultController<Uint8Array>,
  payload: StreamEvent
): void {
  const line = `data: ${JSON.stringify(payload)}\n\n`;
  controller.enqueue(new TextEncoder().encode(line));
}
