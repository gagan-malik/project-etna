"use client";

import { useState, useEffect } from "react";
import { Gem, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type Command = {
  id: string;
  name: string;
  slug: string;
  promptTemplate: string;
  showAsQuickAction: boolean;
};

/** Demo commands added for the current user when they click "Add demo commands" */
const DEMO_COMMANDS = [
  { name: "Debug RTL", slug: "debug-rtl", promptTemplate: "Analyze this RTL for bugs, timing issues, and best practices. Focus on: {{user_input}}", showAsQuickAction: true },
  { name: "Review code", slug: "review-code", promptTemplate: "Review the following code for correctness, style, and potential bugs. Context: {{user_input}}", showAsQuickAction: false },
  { name: "Explain", slug: "explain", promptTemplate: "Explain the following in simple terms, step by step: {{user_input}}", showAsQuickAction: true },
];

export function RulesPanel() {
  const { toast } = useToast();
  const { preferences, plan, isLoading, isAuthenticated, updatePreferences } = useUserSettings();
  const [saving, setSaving] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [commandsLoading, setCommandsLoading] = useState(true);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formQuickAction, setFormQuickAction] = useState(false);
  const paid = isPaidPlan(plan);

  const includeThirdParty = (preferences.includeThirdPartyConfig as boolean) ?? true;

  const loadCommands = async () => {
    try {
      const res = await fetch("/api/commands", { credentials: "include" });
      const data = await res.json();
      setCommands(Array.isArray(data.commands) ? data.commands : []);
    } catch {
      setCommands([]);
    } finally {
      setCommandsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadCommands();
    else setCommandsLoading(false);
  }, [isAuthenticated]);

  const updateIncludeThirdParty = async (value: boolean) => {
    setSaving(true);
    const result = await updatePreferences({ includeThirdPartyConfig: value });
    setSaving(false);
    if (result.success) {
      toast({ title: "Settings saved" });
    } else {
      toast({ title: "Error", description: result.error ?? "Failed to save", variant: "destructive" });
    }
  };

  const openNewCommand = () => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormPrompt("");
    setFormQuickAction(false);
    setCommandDialogOpen(true);
  };

  const openEditCommand = (cmd: Command) => {
    setEditingId(cmd.id);
    setFormName(cmd.name);
    setFormSlug(cmd.slug);
    setFormPrompt(cmd.promptTemplate);
    setFormQuickAction(cmd.showAsQuickAction);
    setCommandDialogOpen(true);
  };

  const saveCommand = async () => {
    const slug = formSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!formName.trim() || !slug || !formPrompt.trim()) {
      toast({ title: "Missing fields", description: "Name, slug, and prompt are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/commands/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            slug,
            promptTemplate: formPrompt.trim(),
            showAsQuickAction: formQuickAction,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to update");
        }
        toast({ title: "Command updated" });
      } else {
        const res = await fetch("/api/commands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            slug,
            promptTemplate: formPrompt.trim(),
            showAsQuickAction: formQuickAction,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to create");
        }
        toast({ title: "Command created" });
      }
      setCommandDialogOpen(false);
      loadCommands();
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save command",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteCommand = async (id: string) => {
    if (!confirm("Delete this command?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/commands/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Command deleted" });
      loadCommands();
    } catch {
      toast({ title: "Error", description: "Failed to delete command", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addDemoCommands = async () => {
    setSaving(true);
    try {
      let added = 0;
      for (const c of DEMO_COMMANDS) {
        const res = await fetch("/api/commands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: c.name,
            slug: c.slug,
            promptTemplate: c.promptTemplate,
            showAsQuickAction: c.showAsQuickAction,
          }),
        });
        if (res.ok) added += 1;
        // 409 = slug already exists, skip
      }
      if (added > 0) {
        toast({ title: "Demo commands added", description: `${added} command(s) added. Use /debug-rtl, /review-code, /explain in chat.` });
        loadCommands();
      } else {
        toast({ title: "Demo commands", description: "You already have these commands." });
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to add demo commands", variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
      <SettingsSection title="Context">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1">
              <Label className="text-sm">Include third-party skills, workers, and other configs</Label>
              {!paid && (
                <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically apply agent configs from other tools
            </p>
          </div>
          <Switch
            checked={includeThirdParty}
            onCheckedChange={updateIncludeThirdParty}
            disabled={saving || !paid}
            aria-label="Include third-party configs"
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Rules">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">Rules</Label>
            {!paid && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!paid} aria-label="Rules" />
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
        <p className="text-xs text-muted-foreground mb-3">
          Create reusable workflows triggered with / prefix in chat. Use <code className="text-[10px] bg-muted px-1 rounded">{"{{user_input}}"}</code> in the prompt to insert what the user types after the command.
        </p>
        {commandsLoading ? (
          <p className="text-sm text-muted-foreground">Loading commands…</p>
        ) : commands.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">No commands yet</p>
            <p className="text-xs text-muted-foreground mb-3">Create a command to use /slug in chat</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={addDemoCommands} disabled={saving}>
                {saving ? "Adding…" : "Add demo commands"}
              </Button>
              <Button variant="outline" size="sm" onClick={openNewCommand}>
                New command
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {commands.map((cmd) => (
              <div
                key={cmd.id}
                className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm">/{cmd.slug}</span>
                  <span className="text-muted-foreground text-sm ml-2">{cmd.name}</span>
                  {cmd.showAsQuickAction && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">Quick action</Badge>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCommand(cmd)} aria-label="Edit command">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteCommand(cmd.id)} aria-label="Delete command">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={openNewCommand}>
                New command
              </Button>
              <Button variant="outline" size="sm" onClick={addDemoCommands} disabled={saving}>
                {saving ? "Adding…" : "Add demo commands"}
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>

      <Dialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="command-form-desc">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit command" : "New command"}</DialogTitle>
            <DialogDescription id="command-form-desc">
              Use <code className="text-[10px] bg-muted px-1 rounded">{"{{user_input}}"}</code> in the prompt to insert text the user types after /slug.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="cmd-name">Name</Label>
              <Input
                id="cmd-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Debug RTL"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cmd-slug">Slug (used as /slug in chat)</Label>
              <Input
                id="cmd-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. debug-rtl"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="cmd-prompt">Prompt template</Label>
              <textarea
                id="cmd-prompt"
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                placeholder="e.g. Analyze this RTL for bugs. Focus on: {{user_input}}"
                className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cmd-quick"
                checked={formQuickAction}
                onCheckedChange={(v) => setFormQuickAction(v === true)}
              />
              <Label htmlFor="cmd-quick" className="text-sm font-normal cursor-pointer">
                Show as quick action button in chat
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCommandDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCommand} disabled={saving}>
              {editingId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
