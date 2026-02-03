"use client";

import { useEffect } from "react";

/**
 * Fix nextjs-portal 0x0 size in Cursor/Next dev overlay.
 * Next.js injects the element with inline position:absolute and no dimensions;
 * we force dimensions via inline style (wins over injected styles) so layout/accessibility don't flag it.
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
}

export function NextjsPortalFix() {
  useEffect(() => {
    const fix = () => {
      document.querySelectorAll("nextjs-portal").forEach((el) => {
        applyPortalFix(el as HTMLElement);
      });
    };

    fix();
    const rafId = requestAnimationFrame(fix);
    const t1 = setTimeout(fix, 50);
    const t2 = setTimeout(fix, 200);
    const t3 = setTimeout(fix, 1000);
    const intervalId = setInterval(fix, 300);
    const stopInterval = setTimeout(() => clearInterval(intervalId), 3000);

    const observer = new MutationObserver(() => {
      requestAnimationFrame(fix);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(intervalId);
      clearTimeout(stopInterval);
      observer.disconnect();
    };
  }, []);

  return null;
}
