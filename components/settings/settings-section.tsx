"use client";

import { cn } from "@/lib/utils";

export interface SettingsSectionProps {
  /** Optional section heading (string or node for e.g. icon + text) */
  title?: React.ReactNode;
  /** Optional badge rendered right next to the title (e.g. "Paid" for pro-only sections) */
  titleBadge?: React.ReactNode;
  children: React.ReactNode;
  /** Extra class for the outer section wrapper */
  className?: string;
  /** If true, content area uses list styling: divide-y and row padding (for multi-row sections like Preferences) */
  list?: boolean;
  /** Extra class for the inner card (e.g. p-4 for 16px padding) */
  contentClassName?: string;
}

/**
 * Muted section block for settings panels (shadcn muted-small style).
 * Use for each logical section so all tabs have consistent muted, rounded blocks.
 */
export function SettingsSection({
  title,
  titleBadge,
  children,
  className,
  list = false,
  contentClassName,
}: SettingsSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || titleBadge) && (
        <div className="flex items-center justify-between gap-4">
          {title && (
            <h2 className="text-xs font-medium text-foreground leading-none">{title}</h2>
          )}
          {titleBadge}
        </div>
      )}
      <div
        className={cn(
          "rounded-[var(--radius)] bg-gray-100 dark:bg-card p-4",
          list &&
            "divide-y divide-border/50 [&>div]:px-4 [&>div]:py-2 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
