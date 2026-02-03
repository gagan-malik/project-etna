"use client";

import { cn } from "@/lib/utils";

export interface PageTitleProps {
  /** Page heading */
  title: React.ReactNode;
  /** Optional description below the title */
  description?: React.ReactNode;
  /** Extra class for the wrapper */
  className?: string;
  /** If true, title stays visible on scroll (sticky, with bg and border) */
  sticky?: boolean;
}

/**
 * Page title block. Use sticky on scrollable pages so the title remains visible.
 * Matches settings-style density: py-4, text-xl.
 */
export function PageTitle({
  title,
  description,
  className,
  sticky = true,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "border-b bg-background px-4 py-3",
        sticky && "sticky top-0 z-10",
        className
      )}
    >
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {description != null && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
