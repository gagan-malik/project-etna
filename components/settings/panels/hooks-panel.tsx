"use client";

import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SettingsSection } from "../settings-section";

export function HooksPanel() {
  const [configuredOpen, setConfiguredOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(true);

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Configured Hooks">
        <p className="text-sm text-muted-foreground mb-3">
          Configure and manage Etna hooks.
        </p>
        <Collapsible open={configuredOpen} onOpenChange={setConfiguredOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="xs" className="w-full justify-between px-0">
              <span className="text-sm font-medium">Configured Hooks (0)</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center mt-2">
              <p className="text-sm text-muted-foreground">No hooks configured</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SettingsSection>

      <SettingsSection title="Execution Log">
        <div className="flex justify-end mb-2">
          <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Pro</Badge>
        </div>
        <Collapsible open={logOpen} onOpenChange={setLogOpen}>
          <CollapsibleContent>
            <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">No hook executions yet</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SettingsSection>
    </div>
  );
}
