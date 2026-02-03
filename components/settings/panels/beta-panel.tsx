"use client";

import { useEffect, useState } from "react";
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
import { SettingsSection } from "../settings-section";

export function BetaPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updateAccess, setUpdateAccess] = useState<"stable" | "early">("stable");
  const [agentAutocomplete, setAgentAutocomplete] = useState(true);

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { preferences: {} })
      .then((d) => {
        const p = d.preferences ?? {};
        setUpdateAccess(p.updateAccess === "early" ? "early" : "stable");
        setAgentAutocomplete(p.agentAutocomplete ?? true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = async (updates: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="px-6 py-8"><p className="text-sm text-muted-foreground">Loading…</p></div>;
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Update Access">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm">Update channel</Label>
            <p className="text-xs text-muted-foreground">
              By default, get notifications for stable updates. In Early Access, pre-release builds may be unstable for production work.
            </p>
          </div>
          <Select
            value={updateAccess}
            onValueChange={(v: "stable" | "early") => {
              setUpdateAccess(v);
              update({ updateAccess: v });
            }}
            disabled={saving}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="early">Early Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsSection>

      <SettingsSection title="Agent Autocomplete">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm">Agent Autocomplete</Label>
            <p className="text-xs text-muted-foreground">
              Contextual suggestions while prompting Agent
            </p>
          </div>
          <Switch
            checked={agentAutocomplete}
            onCheckedChange={(v) => {
              setAgentAutocomplete(v);
              update({ agentAutocomplete: v });
            }}
            disabled={saving}
          />
        </div>
      </SettingsSection>
    </div>
  );
}
