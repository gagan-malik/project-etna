"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Upload,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SurferViewer } from "./surfer-viewer";

interface WaveformFile {
  id: string;
  name: string;
  url: string;
  format: string;
  size: number;
}

interface WaveformPanelProps {
  /** Debug session ID to link waveforms to */
  sessionId?: string;
  /** Initially selected waveform URL */
  initialWaveformUrl?: string;
  /** Callback when a waveform is selected */
  onWaveformSelect?: (waveform: WaveformFile | null) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function WaveformPanel({
  sessionId,
  initialWaveformUrl,
  onWaveformSelect,
  className,
  collapsible = true,
  defaultCollapsed = true,
}: WaveformPanelProps) {
  const [waveforms, setWaveforms] = useState<WaveformFile[]>([]);
  const [selectedWaveform, setSelectedWaveform] = useState<WaveformFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Fetch available waveforms
  const fetchWaveforms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/waveforms?limit=20", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setWaveforms(data.waveforms || []);

        // Auto-select if initialWaveformUrl matches
        if (initialWaveformUrl) {
          const match = data.waveforms?.find(
            (w: WaveformFile) => w.url === initialWaveformUrl
          );
          if (match) {
            setSelectedWaveform(match);
            onWaveformSelect?.(match);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching waveforms:", error);
    } finally {
      setLoading(false);
    }
  }, [initialWaveformUrl, onWaveformSelect]);

  useEffect(() => {
    fetchWaveforms();
  }, [fetchWaveforms]);

  const handleWaveformChange = useCallback((waveformId: string) => {
    if (waveformId === "none") {
      setSelectedWaveform(null);
      onWaveformSelect?.(null);
      return;
    }

    const waveform = waveforms.find((w) => w.id === waveformId);
    if (waveform) {
      setSelectedWaveform(waveform);
      onWaveformSelect?.(waveform);
      // Auto-expand when a waveform is selected
      setIsCollapsed(false);
    }
  }, [waveforms, onWaveformSelect]);

  const handleClearWaveform = useCallback(() => {
    setSelectedWaveform(null);
    onWaveformSelect?.(null);
  }, [onWaveformSelect]);

  const content = (
    <>
      {/* Waveform Selector */}
      <div className="flex items-center gap-2 p-3 border-b">
        <Select
          value={selectedWaveform?.id || "none"}
          onValueChange={handleWaveformChange}
          disabled={loading}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a waveform file..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No waveform</SelectItem>
            {waveforms.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                <div className="flex items-center gap-2">
                  <span className="truncate">{w.name}</span>
                  <Badge variant="outline" className="text-xs uppercase">
                    {w.format}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(w.size)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedWaveform && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearWaveform}
            title="Clear selection"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/waveforms", "_blank")}
          title="Manage waveforms"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {/* Waveform Viewer */}
      {selectedWaveform ? (
        <SurferViewer
          waveformUrl={selectedWaveform.url}
          fileName={selectedWaveform.name}
          fileFormat={selectedWaveform.format}
          height={350}
          showHeader={false}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
          <Activity className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No waveform selected</p>
          <p className="text-xs mt-1">
            Select a waveform file or{" "}
            <a href="/waveforms" className="text-primary hover:underline">
              upload one
            </a>
          </p>
        </div>
      )}
    </>
  );

  if (!collapsible) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Waveform Viewer</CardTitle>
            {selectedWaveform && (
              <Badge variant="secondary" className="text-xs">
                {selectedWaveform.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">{content}</CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
      <Card className={cn("overflow-hidden", className)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">Waveform Viewer</CardTitle>
                {selectedWaveform && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedWaveform.name}
                  </Badge>
                )}
              </div>
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">{content}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
