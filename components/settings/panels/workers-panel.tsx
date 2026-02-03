"use client";

import { Button } from "@/components/ui/button";
import { SettingsSection } from "../settings-section";

export function WorkersPanel() {
  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Workers">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="xs">+ New</Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create specialized agents for complex tasks. Workers can be invoked by the agent to handle focused work in parallel.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Workers Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Create specialized agents to handle focused tasks</p>
          <Button size="xs">New Worker</Button>
        </div>
      </SettingsSection>
    </div>
  );
}
