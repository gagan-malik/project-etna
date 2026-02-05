"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/components/user-settings-provider";
import { SettingsSection } from "../settings-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Skill = {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  systemPromptFragment: string;
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
};

export function SkillsPanel() {
  const { toast } = useToast();
  const { preferences, isLoading, isAuthenticated, updatePreferences } = useUserSettings();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [enabledSkillIds, setEnabledSkillIds] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFragment, setFormFragment] = useState("");

  const enabledSet = new Set(enabledSkillIds);

  const loadSkills = async () => {
    try {
      const res = await fetch("/api/skills", { credentials: "include" });
      const data = await res.json();
      setSkills(Array.isArray(data.skills) ? data.skills : []);
      setEnabledSkillIds(Array.isArray(data.enabledSkillIds) ? data.enabledSkillIds : []);
    } catch {
      setSkills([]);
      setEnabledSkillIds([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadSkills();
    else setSkillsLoading(false);
  }, [isAuthenticated]);

  const toggleSkill = async (skillId: string, enabled: boolean) => {
    const next = enabled
      ? [...enabledSkillIds, skillId]
      : enabledSkillIds.filter((id) => id !== skillId);
    setEnabledSkillIds(next);
    setSaving(true);
    const result = await updatePreferences({ enabledSkillIds: next });
    setSaving(false);
    if (result.success) {
      toast({ title: "Skills updated" });
    } else {
      toast({ title: "Error", description: result.error ?? "Failed to save", variant: "destructive" });
      setEnabledSkillIds(enabledSkillIds);
    }
  };

  const openNewSkill = () => {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormFragment("");
    setSkillDialogOpen(true);
  };

  const openEditSkill = (s: Skill) => {
    if (s.isBuiltIn) return;
    setEditingId(s.id);
    setFormName(s.name);
    setFormDescription(s.description ?? "");
    setFormFragment(s.systemPromptFragment);
    setSkillDialogOpen(true);
  };

  const saveSkill = async () => {
    if (!formName.trim() || !formFragment.trim()) {
      toast({ title: "Missing fields", description: "Name and system prompt fragment are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/skills/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            systemPromptFragment: formFragment.trim(),
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to update");
        }
        toast({ title: "Skill updated" });
      } else {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            systemPromptFragment: formFragment.trim(),
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to create");
        }
        toast({ title: "Skill created" });
      }
      setSkillDialogOpen(false);
      loadSkills();
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Skill deleted" });
      setEnabledSkillIds((prev) => prev.filter((x) => x !== id));
      loadSkills();
    } catch {
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const builtIn = skills.filter((s) => s.isBuiltIn);
  const custom = skills.filter((s) => !s.isBuiltIn);

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Skills">
        <p className="text-xs text-muted-foreground mb-4">
          Skills are system-prompt fragments that are appended when enabled. Built-in skills are available to everyone; you can add custom skills and enable or disable any of them.
        </p>
        {skillsLoading ? (
          <p className="text-sm text-muted-foreground">Loading skills…</p>
        ) : (
          <div className="space-y-4">
            {builtIn.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Built-in skills</h4>
                <ul className="space-y-2">
                  {builtIn.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-sm">{s.name}</span>
                        {s.description && (
                          <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                        )}
                      </div>
                      <Switch
                        checked={enabledSet.has(s.id)}
                        onCheckedChange={(v) => toggleSkill(s.id, v)}
                        disabled={saving}
                        aria-label={`Enable ${s.name}`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {custom.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Your custom skills</h4>
                <ul className="space-y-2">
                  {custom.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-sm">{s.name}</span>
                        {s.description && (
                          <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Switch
                          checked={enabledSet.has(s.id)}
                          onCheckedChange={(v) => toggleSkill(s.id, v)}
                          disabled={saving}
                          aria-label={`Enable ${s.name}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditSkill(s)}
                          aria-label="Edit skill"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteSkill(s.id)}
                          aria-label="Delete skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(builtIn.length === 0 && custom.length === 0) && (
              <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">No skills yet</p>
                <p className="text-xs text-muted-foreground mb-3">Add a custom skill to extend the system prompt</p>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={openNewSkill}>
              New skill
            </Button>
          </div>
        )}
      </SettingsSection>

      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="skill-form-desc">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit skill" : "New skill"}</DialogTitle>
            <DialogDescription id="skill-form-desc">
              This text is appended to the system message when the skill is enabled.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="skill-name">Name</Label>
              <Input
                id="skill-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. RTL uninitialized registers"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="skill-desc">Description (optional)</Label>
              <Input
                id="skill-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Short description"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="skill-fragment">System prompt fragment</Label>
              <textarea
                id="skill-fragment"
                value={formFragment}
                onChange={(e) => setFormFragment(e.target.value)}
                placeholder="e.g. Always check for uninitialized registers in RTL."
                className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSkill} disabled={saving}>
              {editingId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
