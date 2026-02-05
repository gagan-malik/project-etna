"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

type Worker = {
  id: string;
  name: string;
  slug: string;
  systemPrompt: string;
  modelId: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Demo workers added for the current user when they click "Add demo workers" */
const DEMO_WORKERS = [
  { name: "CDC checker", slug: "worker-cdc", systemPrompt: "You are a clock domain crossing (CDC) verification expert. Analyze the design or code the user provides for CDC issues: unsynchronized signals crossing clock domains, missing synchronizers, metastability risks, and recommend fixes. Be concise and list issues by severity.", modelId: undefined as string | undefined },
  { name: "Summarizer", slug: "worker-summarize", systemPrompt: "You are a summarization assistant. Summarize the user's input clearly and concisely. Use bullet points for long content. Preserve key facts and decisions.", modelId: undefined as string | undefined },
];

export function WorkersPanel() {
  const { toast } = useToast();
  const { isLoading, isAuthenticated } = useUserSettings();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSystemPrompt, setFormSystemPrompt] = useState("");
  const [formModelId, setFormModelId] = useState("");

  const loadWorkers = async () => {
    try {
      const res = await fetch("/api/workers", { credentials: "include" });
      const data = await res.json();
      setWorkers(Array.isArray(data.workers) ? data.workers : []);
    } catch {
      setWorkers([]);
    } finally {
      setWorkersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadWorkers();
    else setWorkersLoading(false);
  }, [isAuthenticated]);

  const openNewWorker = () => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormSystemPrompt("");
    setFormModelId("");
    setWorkerDialogOpen(true);
  };

  const openEditWorker = (w: Worker) => {
    setEditingId(w.id);
    setFormName(w.name);
    setFormSlug(w.slug);
    setFormSystemPrompt(w.systemPrompt);
    setFormModelId(w.modelId ?? "");
    setWorkerDialogOpen(true);
  };

  const saveWorker = async () => {
    const slug = formSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!formName.trim() || !slug || !formSystemPrompt.trim()) {
      toast({ title: "Missing fields", description: "Name, slug, and system prompt are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/workers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            slug,
            systemPrompt: formSystemPrompt.trim(),
            modelId: formModelId.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to update");
        }
        toast({ title: "Worker updated" });
      } else {
        const res = await fetch("/api/workers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formName.trim(),
            slug,
            systemPrompt: formSystemPrompt.trim(),
            modelId: formModelId.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to create");
        }
        toast({ title: "Worker created" });
      }
      setWorkerDialogOpen(false);
      loadWorkers();
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save worker",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteWorker = async (id: string) => {
    if (!confirm("Delete this worker?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/workers/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Worker deleted" });
      loadWorkers();
    } catch {
      toast({ title: "Error", description: "Failed to delete worker", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addDemoWorkers = async () => {
    setSaving(true);
    try {
      let added = 0;
      for (const w of DEMO_WORKERS) {
        const res = await fetch("/api/workers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: w.name,
            slug: w.slug,
            systemPrompt: w.systemPrompt,
            modelId: w.modelId,
          }),
        });
        if (res.ok) added += 1;
      }
      if (added > 0) {
        toast({ title: "Demo workers added", description: `${added} worker(s) added. Use /worker-cdc or /worker-summarize in chat, or the Run worker menu.` });
        loadWorkers();
      } else {
        toast({ title: "Demo workers", description: "You already have these workers.", variant: "secondary" });
      }
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to add demo workers", variant: "destructive" });
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
    <div className="w-full px-8 py-5 space-y-6">
      <SettingsSection title="Workers">
        <p className="text-xs text-muted-foreground mb-4">
          Workers are subagents with their own system prompt. Invoke them in chat with <code className="text-[10px] bg-muted px-1 rounded">/slug</code> or from the worker menu. Optionally set a model ID to override the default for that worker.
        </p>
        {workersLoading ? (
          <p className="text-sm text-muted-foreground">Loading workers…</p>
        ) : workers.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">No workers yet</p>
            <p className="text-xs text-muted-foreground mb-3">Create a worker to use /slug in chat</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={addDemoWorkers} disabled={saving}>
                {saving ? "Adding…" : "Add demo workers"}
              </Button>
              <Button variant="outline" size="sm" onClick={openNewWorker}>
                New worker
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {workers.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm">/{w.slug}</span>
                  <span className="text-muted-foreground text-sm ml-2">{w.name}</span>
                  {w.modelId && (
                    <span className="text-xs text-muted-foreground ml-2">({w.modelId})</span>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditWorker(w)} aria-label="Edit worker">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteWorker(w.id)}
                    aria-label="Delete worker"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={openNewWorker}>
                New worker
              </Button>
              <Button variant="outline" size="sm" onClick={addDemoWorkers} disabled={saving}>
                {saving ? "Adding…" : "Add demo workers"}
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>

      <Dialog open={workerDialogOpen} onOpenChange={setWorkerDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="worker-form-desc">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit worker" : "New worker"}</DialogTitle>
            <DialogDescription id="worker-form-desc">
              Use this worker in chat by typing /slug. The system prompt defines how this subagent behaves.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="worker-name">Name</Label>
              <Input
                id="worker-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. CDC checker"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="worker-slug">Slug (used as /slug in chat)</Label>
              <Input
                id="worker-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. worker-cdc"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="worker-prompt">System prompt</Label>
              <textarea
                id="worker-prompt"
                value={formSystemPrompt}
                onChange={(e) => setFormSystemPrompt(e.target.value)}
                placeholder="e.g. You are a CDC (clock domain crossing) verification expert. Analyze the design for CDC issues."
                className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="worker-model">Model ID (optional)</Label>
              <Input
                id="worker-model"
                value={formModelId}
                onChange={(e) => setFormModelId(e.target.value)}
                placeholder="e.g. gpt-4o or leave blank for default"
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setWorkerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveWorker} disabled={saving}>
              {editingId ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
