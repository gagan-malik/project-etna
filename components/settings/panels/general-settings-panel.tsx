"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Gem, Sun, Moon, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import { Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const KEYBOARD_SHORTCUTS: { category: string; shortcuts: { key: string; action: string }[] }[] = [
  {
    category: "Global",
    shortcuts: [
      { key: "⌘K", action: "Open command palette" },
      { key: "⌘/", action: "Toggle AI chat panel" },
      { key: "⌘,", action: "Open settings" },
      { key: "⌘⇧P", action: "Open keyboard shortcuts" },
      { key: "Esc", action: "Close modal / Cancel" },
    ],
  },
  {
    category: "Modes",
    shortcuts: [
      { key: "⌘.", action: "Open mode switcher" },
      { key: "⌘. A", action: "Switch to Ask mode" },
      { key: "⌘. G", action: "Switch to Agent mode" },
      { key: "⌘. D", action: "Switch to Debug mode" },
      { key: "⌘. M", action: "Switch to Manual mode" },
    ],
  },
  {
    category: "Voice",
    shortcuts: [
      { key: "⌘⇧V", action: "Start voice input (push-to-talk)" },
      { key: "V (in chat)", action: "Quick voice input" },
      { key: "Esc", action: "Cancel voice recording" },
    ],
  },
  {
    category: "Navigation",
    shortcuts: [
      { key: "⌘1", action: "Go to Chat" },
      { key: "⌘2", action: "Go to Sessions" },
      { key: "⌘3", action: "Go to Files" },
      { key: "⌘[", action: "Go back" },
      { key: "⌘]", action: "Go forward" },
    ],
  },
  {
    category: "AI Actions",
    shortcuts: [
      { key: "⌘Enter", action: "Send message" },
      { key: "⌘E", action: "Explain selection" },
      { key: "⌘D", action: "Debug selection" },
      { key: "⌘G", action: "Generate testbench" },
      { key: "⌘⇧C", action: "Copy AI response" },
    ],
  },
  {
    category: "File Actions",
    shortcuts: [
      { key: "⌘N", action: "New session" },
      { key: "⌘U", action: "Upload file" },
      { key: "⌘S", action: "Save (where applicable)" },
      { key: "⌘W", action: "Close tab/panel" },
    ],
  },
  {
    category: "Waveform",
    shortcuts: [
      { key: "← / →", action: "Pan waveform" },
      { key: "+ / -", action: "Zoom in/out" },
      { key: "F", action: "Fit to view" },
      { key: "Space", action: "Toggle measurement cursor" },
    ],
  },
];

export function GeneralSettingsPanel() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { preferences, plan, isLoading, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
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
      {/* Preferences */}
      <SettingsSection title="Preferences" list>
          <div className="flex items-center justify-between gap-2.5 !pt-2">
            <div>
              <Label className="text-xs font-medium text-foreground">Theme</Label>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Light, dark, or follow system
              </p>
            </div>
            <div
              className="inline-flex h-10 rounded-md bg-muted p-1 gap-0.5"
              role="tablist"
              aria-label="Theme"
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
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
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
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
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0 rounded focus-visible:ring-0 focus-visible:ring-offset-0",
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
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <Label className="text-xs font-medium text-foreground">Keyboard Shortcuts</Label>
              <p className="text-[11px] text-muted-foreground leading-snug">
                View all keyboard shortcuts
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShortcutsOpen(true)}
              aria-label="Keyboard Shortcuts"
            >
              Open
            </Button>
          </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" list>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <Label className="text-xs font-medium text-foreground">System Notifications</Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Show system notifications when Agent completes or needs attention
            </p>
          </div>
          <Switch
            checked={preferences.systemNotifications === true}
            onCheckedChange={(v) => updatePreference({ systemNotifications: v })}
            disabled={saving}
          />
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <Label className="text-xs font-medium text-foreground">Email Notifications</Label>
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
            <Label className="text-xs font-medium text-foreground">Push Notifications</Label>
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
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Privacy Mode
              </Label>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                Your code data will not be trained on or used to improve the product. Code may be stored to provide features such as Background Agent.
              </p>
            </div>
            <Select
              value={
                typeof preferences.privacyMode === "string" &&
                ["off", "standard", "strict"].includes(preferences.privacyMode)
                  ? preferences.privacyMode
                  : "off"
              }
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

      {/* Keyboard shortcuts modal */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg grid-rows-[auto_1fr]" aria-describedby="keyboard-shortcuts-desc">
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription id="keyboard-shortcuts-desc">
              Use Ctrl instead of ⌘ on Windows and Linux.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto -mx-1 pl-1 pr-3 scrollbar-thin-light" role="region" aria-label="Shortcut list">
            <Table className="[&_tr]:border-b-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Action</TableHead>
                  <TableHead className="text-right">Shortcut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {KEYBOARD_SHORTCUTS.map(({ category, shortcuts }) => (
                  <React.Fragment key={category}>
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={2} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-1.5 pt-3 first:pt-3">
                        {category}
                      </TableCell>
                    </TableRow>
                    {shortcuts.map(({ key: k, action }) => (
                      <TableRow
                        key={`${category}-${k}-${action}`}
                        className="hover:bg-muted"
                      >
                        <TableCell className="text-sm text-foreground">{action}</TableCell>
                        <TableCell className="text-right">
                          <kbd className="inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                            {k}
                          </kbd>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
