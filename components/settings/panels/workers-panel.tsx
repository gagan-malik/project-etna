"use client";

import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "../settings-section";

export function WorkersPanel() {
  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Workers">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create specialized agents for complex tasks. Workers can be invoked by the agent to handle focused work in parallel.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Workers Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Create specialized agents to handle focused tasks</p>
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>
    </div>
  );
}
