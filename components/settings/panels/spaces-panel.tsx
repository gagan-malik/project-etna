"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

type Space = {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: { conversations: number };
};

export function SpacesPanel() {
  const { toast } = useToast();
  const { isLoading, isAuthenticated } = useUserSettings();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formInstructions, setFormInstructions] = useState("");

  const loadSpaces = async () => {
    try {
      const res = await fetch("/api/spaces", { credentials: "include" });
      const data = await res.json();
      setSpaces(Array.isArray(data.spaces) ? data.spaces : []);
    } catch {
      setSpaces([]);
    } finally {
      setSpacesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadSpaces();
    else setSpacesLoading(false);
  }, [isAuthenticated]);

  const openEdit = (space: Space) => {
    setEditingSpace(space);
    setFormName(space.name);
    setFormSlug(space.slug);
    setFormInstructions(space.instructions ?? "");
    setEditDialogOpen(true);
  };

  const closeEdit = () => {
    setEditDialogOpen(false);
    setEditingSpace(null);
  };

  const saveSpace = async () => {
    if (!editingSpace) return;
    const name = formName.trim();
    const slug = formSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name || !slug) {
      toast({
        title: "Missing fields",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }
    if (formInstructions.length > 4000) {
      toast({
        title: "Instructions too long",
        description: "Space instructions must be 4000 characters or less",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/spaces/${editingSpace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          slug,
          instructions: formInstructions.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to update");
      }
      toast({ title: "Space updated" });
      closeEdit();
      loadSpaces();
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save space",
        variant: "destructive",
      });
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
      <SettingsSection title="Spaces">
        <p className="text-xs text-muted-foreground mb-4">
          Spaces organize conversations. You can set optional space instructions that are always prepended to the AI system prompt for conversations in this space (e.g. &quot;Always cite signal names&quot;).
        </p>
        {spacesLoading ? (
          <p className="text-sm text-muted-foreground">Loading spaces…</p>
        ) : spaces.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">No spaces yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create a space from the chat or overview page.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {spaces.map((space) => (
              <li
                key={space.id}
                className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm">{space.name}</span>
                  <p className="text-xs text-muted-foreground truncate">
                    /{space.slug}
                    {space._count != null && ` · ${space._count.conversations} conversation(s)`}
                  </p>
                  {space.instructions && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={space.instructions}>
                      {space.instructions}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => openEdit(space)}
                  aria-label={`Edit space ${space.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>

      <Dialog open={editDialogOpen} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-md" aria-describedby="space-edit-desc">
          <DialogHeader>
            <DialogTitle>Edit space</DialogTitle>
            <DialogDescription id="space-edit-desc">
              Name and slug identify the space. Space instructions are prepended to the AI system prompt for all conversations in this space.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="space-name">Name</Label>
              <Input
                id="space-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. My Workspace"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="space-slug">Slug</Label>
              <Input
                id="space-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. my-workspace"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="space-instructions">Space instructions (optional)</Label>
              <textarea
                id="space-instructions"
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                placeholder="e.g. Always cite signal names and stay in RTL scope."
                className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                maxLength={4000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formInstructions.length}/4000 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={saveSpace} disabled={saving}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
