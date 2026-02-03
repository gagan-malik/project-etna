"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SettingsSection } from "../settings-section";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function OverviewSettingsPanel() {
  const { data: session } = useSession();
  const [analyticsRange, setAnalyticsRange] = useState<"D" | "W" | "M">("M");
  const planLabel = (session?.user as { plan?: string })?.plan ?? "free";
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

  return (
    <div className="w-full px-8 py-5 space-y-6">
      {/* Ultra Plan */}
      <SettingsSection title="Ultra">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">$200/mo.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get maximum value with 20x usage limits and early access to advanced features.
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href="/overview">Upgrade to Ultra</Link>
          </Button>
        </div>
      </SettingsSection>

      {/* Pro Plan */}
      <SettingsSection title="Pro">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">$60/mo.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              MAX Mode, multiple models, higher usage limits, and FST waveform support.
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href="/overview">Upgrade to Pro</Link>
          </Button>
        </div>
      </SettingsSection>

      {/* Current Plan (Pro+) */}
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
              ? "Get maximum value with 20x usage limits and early access to advanced features."
              : planLabel === "pro"
                ? "Get 3x more usage than Pro, unlock higher limits on Agent, and more."
                : planLabel === "free"
                  ? "Perfect for getting started."
                  : "For teams and organizations."}
          </p>
          {planLabel !== "free" && (
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          )}
          {(planLabel === "pro" || planLabel === "ultra") && (
            <div className="rounded-[var(--radius)] border bg-muted/50 p-2.5 space-y-1.5 mt-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">$68 / Unlimited</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Edit Limit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                On-Demand Usage this Month (Unlimited)
              </p>
              <Progress value={20} className="h-1.5" />
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Your Analytics */}
      <SettingsSection title="Your Analytics">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <Button variant="outline" size="sm" className="h-6 gap-0.5 text-xs px-2">
              Jan 05 - Feb 03
              <ChevronDown className="h-3 w-3" />
            </Button>
            <div className="flex items-center gap-0.5">
              {(["D", "W", "M"] as const).map((range) => (
                <Button
                  key={range}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 min-w-6 px-1.5 text-[11px] focus-visible:ring-0 focus-visible:ring-offset-0",
                    analyticsRange === range && "bg-muted"
                  )}
                  onClick={() => setAnalyticsRange(range)}
                  title={range === "D" ? "Day" : range === "W" ? "Week" : "Month"}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground">Lines of Agent Edits:</span>
            <span className="font-medium">170,379 / 1,065,295</span>
            <Info className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden />
          </div>
          <div className="h-[140px] rounded border bg-muted/30 flex items-center justify-center">
            <span className="text-[11px] text-muted-foreground">Lines of Agent Edits (chart)</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
