"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Gem, Sun, Moon, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { useSettingsModal } from "@/components/settings-modal-context";
import { cn } from "@/lib/utils";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import { Lock } from "lucide-react";

export function GeneralSettingsPanel() {
  const { toast } = useToast();
  const { openSettings } = useSettingsModal();
  const { theme, setTheme } = useTheme();
  const { preferences, plan, isLoading, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleThemeChange = async (value: "light" | "dark" | "system") => {
    setTheme(value);
    await updatePreference({ theme: value });
  };

  const updatePreference = async (updates: Record<string, unknown>) => {
    setSaving(true);
    const result = await updatePreferences(updates);
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved", description: "Your preferences have been updated." });
    } else {
      toast({
        title: "Error",
        description: result.error ?? "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const paid = isPaidPlan(plan);

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <p className="text-xs text-muted-foreground">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      {/* Account */}
      <SettingsSection title="Account">
        <p className="text-xs text-muted-foreground mb-2">
          Profile, password, theme, notifications, and security
        </p>
        <Button variant="outline" size="xs" onClick={() => openSettings("account")}>
          Open Account
        </Button>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences" list>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-xs font-medium">Theme</Label>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Light, dark, or follow system
              </p>
            </div>
            <div
              className="inline-flex h-8 rounded-md bg-muted p-0.5 gap-0.5"
              role="tablist"
              aria-label="Theme"
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
                  theme === "light" &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
                onClick={() => handleThemeChange("light")}
                disabled={saving}
                title="Light mode"
                aria-label="Light mode"
                aria-pressed={theme === "light"}
                role="tab"
              >
                <Sun className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
                  theme === "dark" &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
                onClick={() => handleThemeChange("dark")}
                disabled={saving}
                title="Dark mode"
                aria-label="Dark mode"
                aria-pressed={theme === "dark"}
                role="tab"
              >
                <Moon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
                  theme === "system" &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
                onClick={() => handleThemeChange("system")}
                disabled={saving}
                title="Follow system"
                aria-label="Follow system"
                aria-pressed={theme === "system"}
                role="tab"
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Editor Settings</Label>
                {!paid && (
                  <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Configure font, formatting, minimap and more
              </p>
            </div>
            <Switch checked={false} disabled aria-label="Editor Settings" />
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Keyboard Shortcuts</Label>
                {!paid && (
                  <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Configure keyboard shortcuts
              </p>
            </div>
            <Switch checked={false} disabled aria-label="Keyboard Shortcuts" />
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Import Settings from VS Code</Label>
                {!paid && (
                  <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Import settings, extensions, and keybindings from VS Code
              </p>
            </div>
            <Switch checked={false} disabled aria-label="Import from VS Code" />
          </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" list>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <Label className="text-xs font-medium">System Notifications</Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
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
            <Label className="text-xs font-medium">Email Notifications</Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <Label className="text-xs font-medium">Push Notifications</Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
      </SettingsSection>

      {/* Privacy — paid only */}
      {paid && (
        <SettingsSection title="Privacy">
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Privacy Mode
              </Label>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
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

    </div>
  );
}
