"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SETTINGS_SECTIONS,
  getSectionById,
  type SettingsSectionDef,
} from "./settings-config";
import { cn } from "@/lib/utils";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface SettingsLayoutProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
  children: React.ReactNode;
  /** Optional: search is shown when true (default true) */
  showSearch?: boolean;
  /** Optional: user block is shown when true (default true) */
  showUserBlock?: boolean;
  /** Base path for internal section links (e.g. /settings for full page) */
  basePath?: string;
  /** When provided (e.g. from modal parent), use this instead of useSession() so portaled content shows correct auth state */
  sessionOverride?: Session | null;
  statusOverride?: SessionStatus;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
}

export function SettingsLayout({
  activeSection,
  setActiveSection,
  children,
  showSearch = true,
  showUserBlock = true,
  basePath = "/settings",
  sessionOverride,
  statusOverride,
}: SettingsLayoutProps) {
  const sessionFromHook = useSession();
  const session = sessionOverride !== undefined ? sessionOverride : sessionFromHook.data;
  const status = statusOverride !== undefined ? statusOverride : sessionFromHook.status;
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // ⌘F / Ctrl+F: focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          '[data-settings-search="true"]'
        );
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return SETTINGS_SECTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleNavClick = useCallback(
    (section: SettingsSectionDef) => {
      if (section.external) {
        // Docs: open external or /docs
        window.open("/docs", "_blank");
        return;
      }
      setActiveSection(section.id);
    },
    [setActiveSection]
  );

  const planLabel = session?.user?.plan ?? "free";
  const planDisplay =
    planLabel === "free"
      ? "Free Plan"
      : planLabel === "pro"
        ? "Pro Plan"
        : planLabel === "enterprise"
          ? "Enterprise"
          : `${planLabel.charAt(0).toUpperCase()}${planLabel.slice(1)} Plan`;

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1">
      {/* Left column: search (aligned with page title), user block, nav */}
      <aside
        className={cn(
          "flex w-[240px] shrink-0 flex-col bg-muted/30",
          "hidden md:flex"
        )}
      >
        {showUserBlock && (
          <div className="flex items-center gap-2 px-3 pt-4 pb-4">
            <Avatar className="h-12 w-12 rounded-full">
              {isAuthenticated && session?.user ? (
                <>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="rounded-full text-base">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="rounded-full text-base">
                  {status === "loading" ? "…" : "G"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              {isAuthenticated && session?.user ? (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    {session.user.name ?? session.user.email ?? "User"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email ?? "No email"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {planDisplay}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-1 h-7 w-full text-xs"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    Sign out
                  </Button>
                </>
              ) : status === "loading" ? (
                <>
                  <p className="truncate text-sm font-medium text-muted-foreground">
                    Loading…
                  </p>
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    Guest user
                  </p>
                  <Button variant="secondary" size="sm" className="mt-1 h-7 w-full text-xs" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search row: below user block */}
        {showSearch && (
          <div className="px-2 py-4">
            <Input
              data-settings-search="true"
              placeholder="Search settings ⌘F"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 bg-background text-sm"
              aria-label="Search settings"
            />
          </div>
        )}

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
          {SETTINGS_SECTIONS.map((section) => {
            const isFilteredOut =
              filteredSections.find((s) => s.id === section.id) == null;
            if (isFilteredOut) return null;

            const Icon = section.icon;
            const isActive = activeSection === section.id && !section.external;

            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(section)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    section.external && "text-muted-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{section.label}</span>
                  {section.external && (
                    <span className="ml-auto shrink-0" aria-hidden>
                      ↗
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Right column: content (full width) */}
      <main className="min-w-0 flex-1 overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );
}

export function SettingsPageTitle({ sectionId }: { sectionId: string }) {
  const section = getSectionById(sectionId);
  return (
    <div className="sticky top-0 z-10 bg-background px-[96px] py-4">
      <h1 className="text-xl font-semibold text-foreground">
        {section?.label ?? "Settings"}
      </h1>
    </div>
  );
}
