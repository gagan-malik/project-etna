"use client";

import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

export function WorkersPanel() {
  const { plan } = useUserSettings();
  const paid = isPaidPlan(plan);
  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Workers">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Workers</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Workers" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create specialized agents for complex tasks. Workers can be invoked by the agent to handle focused work in parallel.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Workers Yet</p>
          <p className="text-xs text-muted-foreground">Create specialized agents to handle focused tasks</p>
        </div>
      </SettingsSection>
    </div>
  );
}
