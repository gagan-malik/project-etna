"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "../settings-section";

export function ToolsMcpPanel() {
  const [browserTab, setBrowserTab] = useState("none");
  const [showLocalhostLinks, setShowLocalhostLinks] = useState(true);
  const [mcpServers, setMcpServers] = useState<{ id: string; name: string; enabled: boolean }[]>([
    { id: "shadcn", name: "shadcn", enabled: false },
  ]);

  const toggleMcp = (id: string, enabled: boolean) => {
    setMcpServers((s) => s.map((m) => (m.id === id ? { ...m, enabled } : m)));
  };

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Browser">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Browser Automation</Label>
              <p className="text-xs text-muted-foreground">Connected to Browser Tab</p>
            </div>
            <Select value={browserTab} onValueChange={setBrowserTab}>
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
              onCheckedChange={setShowLocalhostLinks}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Installed MCP Servers">
        <div className="space-y-3">
          {mcpServers.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4">
              <span className="text-sm">{m.name}</span>
              <Switch
                checked={m.enabled}
                onCheckedChange={(v) => toggleMcp(m.id, v)}
              />
            </div>
          ))}
        </div>
        <Button variant="outline" size="xs" className="mt-3">
          + Add a Custom MCP Server
        </Button>
      </SettingsSection>
    </div>
  );
}
