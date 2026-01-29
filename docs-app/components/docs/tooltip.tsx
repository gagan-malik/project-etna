"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  label: string;
  shortcut?: string;
}

export function Tooltip({ children, label, shortcut }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 4,
    });
  }, [visible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="pointer-events-none fixed z-[100] flex -translate-x-1/2 flex-col items-center"
          style={{ left: coords.left, top: coords.top }}
        >
          {/* Caret pointing up */}
          <div
            className="border-b-8 border-l-[6px] border-r-[6px] border-b-popover border-l-transparent border-r-transparent"
            style={{ width: 0, height: 0, marginBottom: -1 }}
          />
          <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-popover-foreground shadow-md">
            <div className="flex items-center gap-2 text-sm">
              <span>{label}</span>
              {shortcut && (
                <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
                  {shortcut}
                </kbd>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
