"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, History } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation({ currentPage = "chat" }: { currentPage?: "chat" | "activity" | "settings" }) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-[var(--spacing-xl)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <div className="w-8 h-8 rounded-[var(--radius-full)] bg-[var(--colours-background-bg-quaternary)] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 4V12M4 8H12" stroke="var(--colours-text-text-secondary-700)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-[var(--colours-text-text-secondary-700)]">Workspace Name</span>
        </div>
        <Link 
          href="/chat" 
          className={`text-[14px] font-semibold transition-colors ${
            currentPage === "chat" 
              ? "text-[var(--colours-text-text-secondary-700)]" 
              : "text-[var(--colours-text-text-tertiary-600)] hover:text-[var(--colours-text-text-secondary-700)]"
          }`}
        >
          Chat
        </Link>
        <Link 
          href="/activity" 
          className={`text-[14px] font-semibold transition-colors ${
            currentPage === "activity" 
              ? "text-[var(--colours-text-text-secondary-700)]" 
              : "text-[var(--colours-text-text-tertiary-600)] hover:text-[var(--colours-text-text-secondary-700)]"
          }`}
        >
          History
        </Link>
        <Link 
          href="/settings" 
          className={`text-[14px] font-semibold transition-colors ${
            currentPage === "settings" 
              ? "text-[var(--colours-text-text-secondary-700)]" 
              : "text-[var(--colours-text-text-tertiary-600)] hover:text-[var(--colours-text-text-secondary-700)]"
          }`}
        >
          Settings
        </Link>
      </div>
      <div className="flex items-center gap-[var(--spacing-lg)]">
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
        <div className="w-10 h-10 rounded-[var(--radius-full)] bg-[var(--component-colors-utility-gray-utility-gray-200)]"></div>
      </div>
    </div>
  );
}
