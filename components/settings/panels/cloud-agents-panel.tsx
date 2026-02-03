"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Cloud, Gem } from "lucide-react";
import { useState } from "react";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

export function CloudAgentsPanel() {
  const { plan } = useUserSettings();
  const paid = isPaidPlan(plan);
  const [personalOpen, setPersonalOpen] = useState(true);

  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Manage Settings">
        <p className="text-xs text-muted-foreground mb-3">
          Connect GitHub, manage team and user settings, and more.
        </p>
        <Button variant="outline" size="xs" asChild>
          <Link href="/integrations">Open ↗</Link>
        </Button>
      </SettingsSection>

      <SettingsSection title="Connect Slack">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Connect Slack</span>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Connect Slack" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Work with Cloud Agents from Slack.
        </p>
      </SettingsSection>

      <SettingsSection title="Workspace Configuration">
        <p className="text-xs text-muted-foreground">
          Configure environment settings and secrets.
        </p>
      </SettingsSection>

      <SettingsSection
        title={
          <span className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Personal Configuration
          </span>
        }
      >
        <p className="text-xs text-muted-foreground mb-3">
          These settings will be used for new cloud agents. For more info, see docs.
        </p>
        <Collapsible open={personalOpen} onOpenChange={setPersonalOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="xs" className="px-0">
              Expand personal configuration
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Sharing:</span> Stored in database
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Usage-Based Pricing:</span> Enabled
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">GitHub Access:</span> Verified
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Base Environment:</span> Using Default Ubuntu
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Runtime Configuration:</span> Nothing configured
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Secrets:</span> Manage in workspace
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SettingsSection>
    </div>
  );
}
