"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSettingsModalOptional } from "@/components/settings-modal-context";

interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
  available?: boolean;
}

/** Model IDs or patterns that indicate reasoning / extended thinking capability (e.g. o1, o3). */
function isReasoningModel(modelId: string): boolean {
  const id = modelId.toLowerCase();
  return id.startsWith("o1-") || id.startsWith("o3-") || id === "o1" || id === "o3" || id.includes("reasoning");
}

interface ModelSelectorProps {
  models: Model[];
  selected: Model | null;
  onSelect: (model: Model) => void;
  hasPremiumAccess: boolean;
  autoMode: boolean;
  maxMode: boolean;
  onAutoModeChange: (enabled: boolean) => void;
  onMaxModeChange: (enabled: boolean) => void;
}

export function ModelSelector({
  models,
  selected,
  onSelect,
  hasPremiumAccess,
  autoMode,
  maxMode,
  onAutoModeChange,
  onMaxModeChange,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase()) ||
      model.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleMaxModeToggle = (enabled: boolean) => {
    if (!enabled || hasPremiumAccess) {
      onMaxModeChange(enabled);
    } else {
      // Could show upgrade prompt here
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Brain className="h-5 w-5" />
        <span>{selected?.name || "Select Model"}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-2 pr-12">
            <DialogTitle className="text-base font-semibold">Select Model</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models"
                className="h-8 pl-8 text-sm"
                aria-label="Search models"
              />
            </div>

            {/* Auto, MAX Mode, Use Multiple Models — compact */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="auto-mode" className="text-sm font-medium cursor-pointer">
                    Auto
                  </Label>
                  <p className="text-xs text-muted-foreground truncate">
                    Automatically selects the best model based on query type.
                  </p>
                </div>
                <Switch
                  id="auto-mode"
                  checked={autoMode}
                  onCheckedChange={onAutoModeChange}
                  className="shrink-0"
                />
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Label htmlFor="max-mode" className="text-sm font-medium cursor-pointer">
                      MAX Mode
                    </Label>
                    {!hasPremiumAccess && (
                      <Link href="/overview">
                        <Button variant="outline" size="sm" className="h-5 px-1.5 text-xs" onClick={(e) => e.stopPropagation()}>
                          Pro
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Uses the highest quality/most capable model available.
                  </p>
                </div>
                <Switch
                  id="max-mode"
                  checked={maxMode}
                  onCheckedChange={handleMaxModeToggle}
                  disabled={!hasPremiumAccess && !maxMode}
                  className="shrink-0"
                />
              </div>
            </div>

            {/* Model list — only when Auto is off */}
            {!autoMode && (
              <>
                <Separator className="my-3" />
                <ScrollArea className="max-h-[240px]">
                  <div className="space-y-0.5">
                    {filteredModels.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">No models found</p>
                    ) : (
                      filteredModels.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            if (model.available !== false) {
                              onSelect(model);
                              setOpen(false);
                            }
                          }}
                          disabled={model.available === false}
                          className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex items-center justify-between gap-2 text-sm ${
                            model.available === false
                              ? "opacity-50 cursor-not-allowed"
                              : selected?.id === model.id
                              ? "bg-accent"
                              : "hover:bg-accent/50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <Brain className="h-3 w-3 text-foreground" />
                            </div>
                            <span className="font-medium truncate">{model.name}</span>
                          </div>
                          {selected?.id === model.id && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs h-8"
                    onClick={() => setOpen(false)}
                  >
                    Manage Models
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

