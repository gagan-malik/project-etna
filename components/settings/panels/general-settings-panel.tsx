"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import { Lock } from "lucide-react";

type Preferences = {
  theme?: "light" | "dark" | "system";
  syncLayouts?: boolean;
  systemNotifications?: boolean;
  menuBarIcon?: boolean;
  completionSound?: boolean;
  privacyMode?: "off" | "standard" | "strict";
};

export function GeneralSettingsPanel() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({});
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setPreferences(data.preferences ?? {});
          setPlan(data.plan ?? "free");
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updatePreference = async (updates: Partial<Preferences>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update");
      }
      const data = await res.json();
      setPreferences(data.preferences ?? preferences);
      toast({ title: "Settings saved", description: "Your preferences have been updated." });
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const paid = isPaidPlan(plan);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[96px] py-5 space-y-6">
      {/* Manage Account */}
      <SettingsSection title="Manage Account">
        <p className="text-sm text-muted-foreground mb-3">
          Manage your account and billing
        </p>
        <Button variant="outline" size="xs" asChild>
          <Link href="/account">
            Open <span className="ml-1" aria-hidden>↗</span>
          </Link>
        </Button>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences" list>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Sync layouts across windows</Label>
              <p className="text-xs text-muted-foreground">
                When enabled, all windows share the same layout
              </p>
            </div>
            <Switch
              checked={preferences.syncLayouts ?? true}
              onCheckedChange={(v) => updatePreference({ syncLayouts: v })}
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Editor Settings</Label>
              <p className="text-xs text-muted-foreground">
                Configure font, formatting, minimap and more
              </p>
            </div>
            <Button variant="outline" size="xs" asChild>
              <Link href="/settings">Open</Link>
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Keyboard Shortcuts</Label>
              <p className="text-xs text-muted-foreground">
                Configure keyboard shortcuts
              </p>
            </div>
            <Button variant="outline" size="xs">
              Open
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Import Settings from VS Code</Label>
              <p className="text-xs text-muted-foreground">
                Import settings, extensions, and keybindings from VS Code
              </p>
            </div>
            <Button variant="outline" size="xs">
              Import
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Reset &quot;Don&apos;t Ask Again&quot; Dialogs</Label>
              <p className="text-xs text-muted-foreground">
                See warnings and tips that you&apos;ve hidden
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                // Client-only: clear stored dismissals if any
                toast({ title: "Dialogs reset", description: "Hidden dialogs will show again when relevant." });
              }}
            >
              Show
            </Button>
          </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" list>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">System Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show system notifications when Agent completes or needs attention
              </p>
            </div>
            <Switch
              checked={preferences.systemNotifications ?? true}
              onCheckedChange={(v) => updatePreference({ systemNotifications: v })}
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Menu Bar Icon</Label>
              <p className="text-xs text-muted-foreground">
                Show app in menu bar
              </p>
            </div>
            <Switch
              checked={preferences.menuBarIcon ?? true}
              onCheckedChange={(v) => updatePreference({ menuBarIcon: v })}
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm">Completion Sound</Label>
              <p className="text-xs text-muted-foreground">
                Play a sound when Agent finishes responding
              </p>
            </div>
            <Switch
              checked={preferences.completionSound ?? false}
              onCheckedChange={(v) => updatePreference({ completionSound: v })}
              disabled={saving}
            />
          </div>
      </SettingsSection>

      {/* Privacy — paid only */}
      {paid && (
        <SettingsSection title="Privacy">
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-sm flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Privacy Mode
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your code data will not be trained on or used to improve the product. Code may be stored to provide features such as Background Agent.
              </p>
            </div>
            <Select
              value={preferences.privacyMode ?? "off"}
              onValueChange={(v: "off" | "standard" | "strict") =>
                updatePreference({ privacyMode: v })
              }
              disabled={saving}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="strict">Strict</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SettingsSection>
      )}

      {/* Log Out */}
      <section>
        <Button
          variant="ghost"
          size="xs"
          className="text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Log Out
        </Button>
      </section>
    </div>
  );
}
