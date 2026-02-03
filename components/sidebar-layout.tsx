"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide sidebar on auth pages only (settings opens as modal)
  const hideSidebar = pathname === "/login" || pathname === "/signup" || pathname === "/auth";

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

