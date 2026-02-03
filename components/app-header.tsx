"use client";

import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();

  // Hide header on auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/auth") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-11 items-center px-3">
        <div className="flex-1" />
      </div>
    </header>
  );
}

