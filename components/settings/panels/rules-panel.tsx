"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "../settings-section";

export function RulesPanel() {
  const { toast } = useToast();
  const [includeThirdParty, setIncludeThirdParty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setIncludeThirdParty(data.preferences?.includeThirdPartyConfig ?? true);
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateIncludeThirdParty = async (value: boolean) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ includeThirdPartyConfig: value }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setIncludeThirdParty(value);
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      <SettingsSection title="Context">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="outline" size="xs">
            All
          </Button>
          <Button variant="ghost" size="xs">
            User
          </Button>
          <Button variant="ghost" size="xs">
            project-etna
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm">Include third-party skills, workers, and other configs</Label>
            <p className="text-xs text-muted-foreground">
              Automatically apply agent configs from other tools
            </p>
          </div>
          <Switch
            checked={includeThirdParty}
            onCheckedChange={updateIncludeThirdParty}
            disabled={saving}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Rules">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="xs">+ New</Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Use Rules to guide agent behavior, like enforcing best practices or coding standards. Rules can be applied always, by file path, or manually.
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>.cursorrules</li>
          <li>soul-doc</li>
          <li>typescript-standards (**/*.ts)</li>
          <li>react-next (**/*.tsx)</li>
          <li>api-routes (app/api/**/*.ts)</li>
        </ul>
      </SettingsSection>

      <SettingsSection title="Commands">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="xs">+ New</Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Create reusable workflows triggered with / prefix in chat. Use commands to standardize processes and make common tasks more efficient.
        </p>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">No Commands Yet</p>
          <p className="text-xs text-muted-foreground mb-3">Create commands to build reusable workflows</p>
          <Button size="xs">New Command</Button>
        </div>
      </SettingsSection>
    </div>
  );
}
