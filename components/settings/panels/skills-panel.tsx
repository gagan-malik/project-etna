"use client";

import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "../settings-section";

export function SkillsPanel() {
  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Skills">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Skills are specialized capabilities that help the agent accomplish specific tasks. Skills will be invoked by the agent when relevant or can be triggered manually with / in chat.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Skills Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Skills help the agent accomplish specific tasks</p>
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
      </SettingsSection>
    </div>
  );
}
