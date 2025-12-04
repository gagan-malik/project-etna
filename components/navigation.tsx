"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, History } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation({ currentPage = "chat" }: { currentPage?: "chat" | "activity" | "settings" }) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 4V12M4 8H12" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground">Workspace Name</span>
        </div>
        <Link 
          href="/chat" 
          className={`text-sm font-semibold transition-colors ${
            currentPage === "chat" 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Chat
        </Link>
        <Link 
          href="/activity" 
          className={`text-sm font-semibold transition-colors ${
            currentPage === "activity" 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </Link>
        <Link 
          href="/settings" 
          className={`text-sm font-semibold transition-colors ${
            currentPage === "settings" 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Settings
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <History className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <div className="w-10 h-10 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}
