"use client";

import { cn } from "@/lib/utils";

export interface PageSectionProps {
  /** Optional section heading */
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Extra class for the outer section wrapper */
  className?: string;
  /** If true, content area uses list styling: divide-y and row padding */
  list?: boolean;
}

/**
 * Muted section block for app pages (same style as settings: rounded, bg-muted).
 * Use for logical sections so pages have consistent muted, rounded blocks.
 */
export function PageSection({
  title,
  children,
  className,
  list = false,
}: PageSectionProps) {
  return (
    <section className={cn("space-y-1.5", className)}>
      {title != null && (
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
