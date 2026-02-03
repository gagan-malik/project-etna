"use client";

import { cn } from "@/lib/utils";

export interface SettingsSectionProps {
  /** Optional section heading (string or node for e.g. icon + text) */
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Extra class for the outer section wrapper */
  className?: string;
  /** If true, content area uses list styling: divide-y and row padding (for multi-row sections like Preferences) */
  list?: boolean;
}

/**
 * Muted section block for settings panels (shadcn muted-small style).
 * Use for each logical section so all tabs have consistent muted, rounded blocks.
 */
export function SettingsSection({
  title,
  children,
  className,
  list = false,
}: SettingsSectionProps) {
  return (
    <section className={cn("space-y-1.5", className)}>
      {title && (
        <h2 className="text-sm font-medium text-foreground mb-1.5">{title}</h2>
      )}
      <div
        className={cn(
          "rounded-md bg-muted p-3",
          list &&
            "divide-y divide-border/50 [&>div]:px-3 [&>div]:py-2 [&>div:first-child]:pt-3 [&>div:last-child]:pb-3"
        )}
      >
        {children}
      </div>
    </section>
  );
}
