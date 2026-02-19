"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";

const DEFAULT_MCP_SERVERS = [{ id: "shadcn", name: "shadcn", enabled: false }];

type McpServer = { id: string; name: string; enabled: boolean };

export function ToolsMcpPanel() {
  const { toast } = useToast();
  const { preferences, plan, isLoading, updatePreferences } = useUserSettings();
  const paid = isPaidPlan(plan);
  const [saving, setSaving] = useState(false);

  const browserTab = (preferences.browserAutomationTab as string) ?? "none";
  const showLocalhostLinks = (preferences.showLocalhostLinks as boolean) ?? true;
  const mcpServers: McpServer[] =
    (preferences.mcpServers as McpServer[] | undefined) ?? DEFAULT_MCP_SERVERS;

  const update = async (updates: Record<string, unknown>) => {
    setSaving(true);
    const result = await updatePreferences(updates);
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({ title: "Error", description: result.error ?? "Failed to save", variant: "destructive" });
    }
  };

  const toggleMcp = (id: string, enabled: boolean) => {
    const next = mcpServers.map((m) => (m.id === id ? { ...m, enabled } : m));
    void update({ mcpServers: next });
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 pt-16 pb-5 space-y-6">
      <SettingsSection title="Browser">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Browser Automation</Label>
              <p className="text-xs text-muted-foreground">Connected to Browser Tab</p>
            </div>
            <Select
              value={browserTab}
              onValueChange={(v) => update({ browserAutomationTab: v })}
              disabled={saving}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Browser Tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="current">Current Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Show Localhost Links in Browser</Label>
              <p className="text-xs text-muted-foreground">
                Automatically open localhost links in the Browser Tab
              </p>
            </div>
            <Switch
              checked={showLocalhostLinks}
              onCheckedChange={(v) => update({ showLocalhostLinks: v })}
              disabled={saving}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Installed MCP Servers">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Installed MCP Servers</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Installed MCP Servers" />
        </div>
        <div className="space-y-3">
          {mcpServers.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4">
              <span className="text-sm">{m.name}</span>
              <Switch
                checked={m.enabled}
                onCheckedChange={(v) => toggleMcp(m.id, v)}
                disabled={saving || !paid}
              />
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
