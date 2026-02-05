"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useUserSettings } from "@/components/user-settings-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "../settings-section";
import {
  MessageSquare,
  FolderOpen,
  FileCode,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationSummary {
  id: string;
  title?: string | null;
  updatedAt: Date;
  messages?: { id: string }[];
}

export function OverviewSettingsPanel() {
  const { isSignedIn } = useAuth();
  const { plan } = useUserSettings();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const planLabel = plan ?? "free";
  const planDisplay =
    planLabel === "pro"
      ? "Pro+"
      : planLabel === "ultra"
        ? "Ultra"
        : planLabel === "enterprise"
          ? "Enterprise"
          : planLabel === "free"
            ? "Free"
            : `${planLabel.charAt(0).toUpperCase()}${planLabel.slice(1)}`;

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/conversations", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { conversations: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.conversations)) {
          setConversations(
            data.conversations.slice(0, 5).map((c: { id: string; title?: string | null; updatedAt: string; messages?: { id: string }[] }) => ({
              id: c.id,
              title: c.title ?? null,
              updatedAt: new Date(c.updatedAt),
              messages: c.messages,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) setConversations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  function formatRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      {/* Quick actions — match UX_MASTER_FILE Dashboard */}
      <SettingsSection title="Quick actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button variant="outline" className="h-auto justify-start gap-3 py-3 px-3" asChild>
            <Link href="/chat">
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>New chat</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 py-3 px-3" asChild>
            <Link href="/sessions">
              <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Debug sessions</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 py-3 px-3" asChild>
            <Link href="/files">
              <FileCode className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Design files</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 py-3 px-3" asChild>
            <Link href="/waveforms">
              <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Waveforms</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>
          </Button>
        </div>
      </SettingsSection>

      {/* Recent conversations */}
      <SettingsSection title="Recent conversations">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No conversations yet. Start a chat to debug RTL, waveforms, or design files.
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/chat?conversation=${c.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground",
                    "hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 truncate flex-1">
                    {c.title || "Untitled conversation"}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelative(c.updatedAt)}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!loading && conversations.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2" asChild>
            <Link href="/chat">View all</Link>
          </Button>
        )}
      </SettingsSection>

      {/* Current plan + upgrade CTA */}
      <SettingsSection title={planDisplay}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {planLabel === "ultra" ? "$200/mo." : planLabel === "pro" ? "$60/mo." : planLabel === "free" ? "$0" : "Custom"}
            </span>
            {planLabel !== "free" && (
              <Badge variant="secondary" className="text-xs">
                Current
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {planLabel === "ultra"
              ? "Maximum usage limits and early access to advanced features."
              : planLabel === "pro"
                ? "MAX Mode, multiple models, higher usage limits, FST waveform support."
                : planLabel === "free"
                  ? "Perfect for getting started. Upgrade for more queries and features."
                  : "For teams and organizations."}
          </p>
          {planLabel === "free" && (
            <Button size="sm" asChild>
              <Link href="/overview" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Upgrade for more
              </Link>
            </Button>
          )}
          {planLabel !== "free" && (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/overview">Manage plan</Link>
            </Button>
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
