"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronDown, Search } from "lucide-react";

interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
}

interface LLMModelSelectorProps {
  models: Model[];
  selected: Model;
  onSelect: (model: Model) => void;
}

export function LLMModelSelector({ models, selected, onSelect }: LLMModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase()) ||
      model.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(models.map((m) => m.category)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <Sparkles className="h-5 w-5" />
          <span>{selected.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models..."
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {categories.map((category) => {
              const categoryModels = filteredModels.filter((m) => m.category === category);
              if (categoryModels.length === 0) return null;
              
              return (
                <div key={category} className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {category}
                  </div>
                  {categoryModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelect(model);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selected.id === model.id
                          ? "bg-accent"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {model.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {model.provider}
                          </div>
                        </div>
                        {selected.id === model.id && (
                          <Badge variant="secondary" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
