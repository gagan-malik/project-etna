"use client";

import { useLayoutEffect } from "react";

/**
 * Fix nextjs-portal 0x0 size in Cursor/Next dev overlay.
 * Next.js injects the element with inline position:absolute and no dimensions;
 * we force dimensions via inline style with "important" (wins over injected styles).
 * z-index: -1 so "Select element" (elementFromPoint) hits the page, not this node.
 */
function applyPortalFix(el: HTMLElement) {
  el.style.setProperty("display", "block", "important");
  el.style.setProperty("position", "fixed", "important");
  el.style.setProperty("top", "0", "important");
  el.style.setProperty("left", "0", "important");
  el.style.setProperty("width", "1px", "important");
  el.style.setProperty("height", "1px", "important");
  el.style.setProperty("min-width", "1px", "important");
  el.style.setProperty("min-height", "1px", "important");
  el.style.setProperty("overflow", "hidden", "important");
  el.style.setProperty("clip-path", "inset(100%)", "important");
  el.style.setProperty("pointer-events", "none", "important");
  el.style.setProperty("z-index", "-1", "important");
}

function runFix() {
  if (typeof document === "undefined") return;
  document.querySelectorAll("nextjs-portal").forEach((el) => {
    applyPortalFix(el as HTMLElement);
  });
}

export function NextjsPortalFix() {
  useLayoutEffect(() => {
    runFix();
    const rafId = requestAnimationFrame(runFix);
    const t1 = setTimeout(runFix, 0);
    const t2 = setTimeout(runFix, 50);
    const t3 = setTimeout(runFix, 200);
    const t4 = setTimeout(runFix, 1000);
    // Reapply frequently so we win over Next.js dev overlay re-injecting styles
    const intervalId = setInterval(runFix, 150);

    const observer = new MutationObserver((mutations) => {
      const hasPortal = mutations.some((m) => {
        if (m.type === "childList") {
          return (
            Array.from(m.addedNodes).some(
              (n) => n.nodeName?.toLowerCase() === "nextjs-portal"
            ) ||
            Array.from(m.target.childNodes).some(
              (n) => n.nodeName?.toLowerCase() === "nextjs-portal"
            )
          );
        }
        return m.type === "attributes" && (m.target as Element).nodeName?.toLowerCase() === "nextjs-portal";
      });
      if (hasPortal) runFix();
      else requestAnimationFrame(runFix);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  return null;
}
