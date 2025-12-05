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
import { Brain, Search, X, Check, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
}

interface ModelSelectorProps {
  models: Model[];
  selected: Model | null;
  onSelect: (model: Model) => void;
  hasPremiumAccess: boolean;
  autoMode: boolean;
  maxMode: boolean;
  useMultipleModels: boolean;
  onAutoModeChange: (enabled: boolean) => void;
  onMaxModeChange: (enabled: boolean) => void;
  onUseMultipleModelsChange: (enabled: boolean) => void;
}

export function ModelSelector({
  models,
  selected,
  onSelect,
  hasPremiumAccess,
  autoMode,
  maxMode,
  useMultipleModels,
  onAutoModeChange,
  onMaxModeChange,
  onUseMultipleModelsChange,
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

  const handleMultipleModelsToggle = (enabled: boolean) => {
    if (!enabled || hasPremiumAccess) {
      onUseMultipleModelsChange(enabled);
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
        <DialogContent className="sm:max-w-[500px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Select Model</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 pb-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models..."
                className="pl-9"
              />
            </div>

            {/* Toggle Switches */}
            <div className="space-y-4 mb-4">
              {/* Auto Mode */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="auto-mode" className="text-sm font-medium cursor-pointer">
                    Auto
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatically selects the best model based on query type.
                  </p>
                </div>
                <Switch
                  id="auto-mode"
                  checked={autoMode}
                  onCheckedChange={onAutoModeChange}
                />
              </div>

              <Separator />

              {/* MAX Mode */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="max-mode" className="text-sm font-medium cursor-pointer">
                      MAX Mode
                    </Label>
                    {!hasPremiumAccess && (
                      <Link href="/overview">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uses the highest quality/most capable model available.
                  </p>
                </div>
                <Switch
                  id="max-mode"
                  checked={maxMode}
                  onCheckedChange={handleMaxModeToggle}
                  disabled={!hasPremiumAccess && !maxMode}
                />
              </div>

              <Separator />

              {/* Use Multiple Models */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="multiple-models" className="text-sm font-medium cursor-pointer">
                      Use Multiple Models
                    </Label>
                    {!hasPremiumAccess && (
                      <Link href="/overview">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enables multi-model responses.
                  </p>
                </div>
                <Switch
                  id="multiple-models"
                  checked={useMultipleModels}
                  onCheckedChange={handleMultipleModelsToggle}
                  disabled={!hasPremiumAccess && !useMultipleModels}
                />
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Model List */}
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-1">
                {filteredModels.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No models found
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelect(model);
                        if (!autoMode) {
                          setOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center justify-between ${
                        selected?.id === model.id
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Brain className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {model.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {model.provider}
                          </div>
                        </div>
                      </div>
                      {selected?.id === model.id && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Manage Models Button */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => {
                  // TODO: Navigate to manage models page
                  setOpen(false);
                }}
              >
                Manage Models
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

