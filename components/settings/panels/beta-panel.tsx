"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";

export function BetaPanel() {
  const { toast } = useToast();
  const { preferences, updateAccess, isEarlyAccess, isLoading, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);
  const [agentAutocomplete, setAgentAutocomplete] = useState(true);
  const [extensionRpcTracer, setExtensionRpcTracer] = useState(false);

  useEffect(() => {
    setAgentAutocomplete((preferences.agentAutocomplete as boolean) ?? true);
    setExtensionRpcTracer((preferences.extensionRpcTracer as boolean) ?? false);
  }, [preferences]);

  const update = async (updates: Record<string, unknown>) => {
    setSaving(true);
    const result = await updatePreferences(updates);
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="px-6 py-8"><p className="text-sm text-muted-foreground">Loading…</p></div>;
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Beta" list>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <Label className="text-sm">Early access</Label>
            <p className="text-xs text-muted-foreground">
              In Early Access, pre-release builds may be unstable for production work.
            </p>
          </div>
          <Switch
            checked={updateAccess === "early"}
            onCheckedChange={(checked) => {
              const v = checked ? "early" : "stable";
              update({ updateAccess: v });
            }}
            disabled={saving}
          />
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <h2 className="text-sm font-medium text-foreground mb-1.5">Agent Autocomplete</h2>
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
        {isEarlyAccess && (
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Extension RPC Tracer</Label>
              <p className="text-xs text-muted-foreground">
                Log extension RPC calls for debugging (early access only)
              </p>
            </div>
            <Switch
              checked={extensionRpcTracer}
              onCheckedChange={(v) => {
                setExtensionRpcTracer(v);
                update({ extensionRpcTracer: v });
              }}
              disabled={saving}
            />
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
