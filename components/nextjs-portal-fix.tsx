"use client";

import { useEffect } from "react";

/**
 * Fix nextjs-portal 0x0 size in Cursor/Next dev overlay.
 * Next.js injects the element with inline position:absolute and no dimensions;
 * we set dimensions after mount so accessibility/layout checkers don't flag it.
 * Runs after a short delay so the portal is in the DOM before we patch it.
 */
export function NextjsPortalFix() {
  useEffect(() => {
    const fix = () => {
      const portals = document.querySelectorAll("nextjs-portal");
      portals.forEach((el) => {
        const html = el as HTMLElement;
        if (html.offsetWidth === 0 || html.offsetHeight === 0) {
          html.style.setProperty("display", "block", "important");
          html.style.setProperty("width", "1px", "important");
          html.style.setProperty("height", "1px", "important");
          html.style.setProperty("min-width", "1px", "important");
          html.style.setProperty("min-height", "1px", "important");
        }
      });
    };

    // Run after paint so the portal exists; repeat after short delays for late-injected portals
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const rafId = requestAnimationFrame(() => {
      fix();
      t1 = setTimeout(fix, 100);
      t2 = setTimeout(fix, 500);
    });

    const observer = new MutationObserver(fix);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (t1 != null) clearTimeout(t1);
      if (t2 != null) clearTimeout(t2);
      observer.disconnect();
    };
  }, []);

  return null;
}
