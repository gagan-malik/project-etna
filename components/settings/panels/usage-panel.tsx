"use client";

import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

export function UsagePanel() {
  const { plan } = useUserSettings();
  const hasPremiumAccess = isPaidPlan(plan);
  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Usage per session">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Usage per session</Label>
            {!hasPremiumAccess && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!hasPremiumAccess} aria-label="Usage per session" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          View usage (requests, tokens, agent runs) broken down by session. Sessions are based on your login and activity window.
        </p>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Session</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Period</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Requests</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Agent runs</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="text-sm px-2.5 py-1.5">Current session</td>
                <td className="text-sm text-muted-foreground px-2.5 py-1.5">Today</td>
                <td className="text-sm px-2.5 py-1.5">—</td>
                <td className="text-sm px-2.5 py-1.5">—</td>
              </tr>
              <tr className="border-border/50">
                <td className="text-sm text-muted-foreground px-2.5 py-1.5">Previous sessions</td>
                <td className="text-sm text-muted-foreground px-2.5 py-1.5">—</td>
                <td className="text-sm text-muted-foreground px-2.5 py-1.5">—</td>
                <td className="text-sm text-muted-foreground px-2.5 py-1.5">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Session usage data will appear here once tracking is enabled and you have activity.
        </p>
      </SettingsSection>
    </div>
  );
}
