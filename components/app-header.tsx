"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Bell, ChevronDown } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "next-auth/react";

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide header on auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/auth") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left side - Project/Workspace selector */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-semibold">P</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">Personal</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-sm text-muted-foreground">Default project</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <UserMenu
            name={session?.user?.name || session?.user?.email || "User"}
            email={session?.user?.email || undefined}
            image={session?.user?.image || undefined}
          />
        </div>
      </div>
    </header>
  );
}

