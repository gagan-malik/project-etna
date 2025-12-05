"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  GraduationCap,
  Newspaper,
  DollarSign,
  Folder,
  FileText,
  Settings,
  ChevronRight,
  Github,
  Mail,
  HardDrive,
  Link as LinkIcon,
} from "lucide-react";

export type SourceType =
  | "web"
  | "academic"
  | "news"
  | "finance"
  | "org_files"
  | "my_files"
  | "github"
  | "gmail"
  | "google_drive"
  | "slack"
  | "confluence"
  | "microsoft_graph";

export interface Source {
  id: SourceType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "builtin" | "third_party";
  hasSettings?: boolean;
}

const BUILTIN_SOURCES: Source[] = [
  {
    id: "web",
    name: "Web",
    description: "Search the web",
    icon: Globe,
    category: "builtin",
  },
  {
    id: "academic",
    name: "Academic Research Papers",
    description: "Search academic papers",
    icon: GraduationCap,
    category: "builtin",
  },
  {
    id: "news",
    name: "News",
    description: "Latest news articles",
    icon: Newspaper,
    category: "builtin",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Search SEC filings",
    icon: DollarSign,
    category: "builtin",
  },
  {
    id: "org_files",
    name: "Org files",
    description: "Search files from your organization",
    icon: Folder,
    category: "builtin",
  },
  {
    id: "my_files",
    name: "My files",
    description: "Search my files",
    icon: FileText,
    category: "builtin",
    hasSettings: true,
  },
];

const THIRD_PARTY_SOURCES: Source[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Search GitHub repositories",
    icon: Github,
    category: "third_party",
  },
  {
    id: "gmail",
    name: "Gmail with Calendar",
    description: "Search Gmail and Calendar",
    icon: Mail,
    category: "third_party",
  },
  {
    id: "google_drive",
    name: "Google Drive",
    description: "Search Google Drive files",
    icon: HardDrive,
    category: "third_party",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Search Slack messages",
    icon: LinkIcon,
    category: "third_party",
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Search Confluence pages",
    icon: FileText,
    category: "third_party",
  },
  {
    id: "microsoft_graph",
    name: "Microsoft Graph",
    description: "Search Microsoft 365",
    icon: LinkIcon,
    category: "third_party",
  },
];

interface SourceSelectorProps {
  selectedSources: SourceType[];
  onSourcesChange: (sources: SourceType[]) => void;
}

export function SourceSelector({
  selectedSources,
  onSourcesChange,
}: SourceSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleSource = (sourceId: SourceType) => {
    if (selectedSources.includes(sourceId)) {
      onSourcesChange(selectedSources.filter((id) => id !== sourceId));
    } else {
      onSourcesChange([...selectedSources, sourceId]);
    }
  };

  const getSourceById = (id: SourceType): Source | undefined => {
    return [...BUILTIN_SOURCES, ...THIRD_PARTY_SOURCES].find((s) => s.id === id);
  };

  const enabledBuiltinSources = BUILTIN_SOURCES.filter((s) =>
    selectedSources.includes(s.id)
  );
  const enabledThirdPartySources = THIRD_PARTY_SOURCES.filter((s) =>
    selectedSources.includes(s.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          <Globe className="h-4 w-4" />
          {selectedSources.length > 0 ? (
            <span className="hidden sm:inline">
              {selectedSources.length} source{selectedSources.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="hidden sm:inline">Set sources</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        side="top"
        sideOffset={8}
      >
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Connectors
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Select data sources to search
          </p>

          {/* Built-in Sources */}
          <div className="space-y-2 mb-4">
            {BUILTIN_SOURCES.map((source) => {
              const Icon = source.icon;
              const isEnabled = selectedSources.includes(source.id);
              return (
                <div
                  key={source.id}
                  className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`source-${source.id}`}
                          className="text-sm font-medium text-foreground cursor-pointer"
                        >
                          {source.name}
                        </Label>
                        {source.hasSettings && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open settings for this source
                            }}
                          >
                            <Settings className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {source.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`source-${source.id}`}
                    checked={isEnabled}
                    onCheckedChange={() => toggleSource(source.id)}
                    className="ml-2 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Third-party Sources */}
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Third-party Apps
            </h4>
            {THIRD_PARTY_SOURCES.map((source) => {
              const Icon = source.icon;
              const isEnabled = selectedSources.includes(source.id);
              return (
                <div
                  key={source.id}
                  className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={`source-${source.id}`}
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        {source.name}
                      </Label>
                      <p className="text-xs text-muted-foreground truncate">
                        {source.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`source-${source.id}`}
                    checked={isEnabled}
                    onCheckedChange={() => toggleSource(source.id)}
                    className="ml-2 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>

          {/* More Connectors Link */}
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                // TODO: Navigate to integrations page or show more connectors
                window.location.href = "/integrations";
              }}
            >
              <span>More connectors</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

