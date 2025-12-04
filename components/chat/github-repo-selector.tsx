"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, ChevronDown, X } from "lucide-react";

interface GitHubRepoSelectorProps {
  selected: string | null;
  onSelect: (repo: string | null) => void;
}

export function GitHubRepoSelector({ selected, onSelect }: GitHubRepoSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [recentRepos, setRecentRepos] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("github-recent-repos");
    if (saved) {
      try {
        setRecentRepos(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent repos:", e);
      }
    }
  }, []);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const repo = inputValue.trim();
    const updated = [repo, ...recentRepos.filter((r) => r !== repo)].slice(0, 5);
    setRecentRepos(updated);
    localStorage.setItem("github-recent-repos", JSON.stringify(updated));
    onSelect(repo);
    setInputValue("");
    setOpen(false);
  };

  const handleSelect = (repo: string) => {
    onSelect(repo);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <FolderOpen className="h-5 w-5" />
          <span>{selected || "Add Repo"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="owner/repository"
          />
        </div>
        <ScrollArea className="max-h-[200px]">
          {recentRepos.length > 0 && (
            <div className="p-1">
              {recentRepos.map((repo, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(repo)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  {repo}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {selected && (
          <div className="p-1 border-t">
            <button
              onClick={handleClear}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
