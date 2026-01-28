"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bug,
  Play,
  Pause,
  StopCircle,
  FileCode,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  GitBranch,
  Zap,
  FileCheck,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QUICK_PROMPTS } from "@/lib/ai/prompts/silicon-debug";

interface DebugSession {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "failed";
  designFileId?: string;
  designFileName?: string;
  createdAt: string;
  updatedAt: string;
  findings?: Array<{
    type: "bug" | "warning" | "info";
    title: string;
    description: string;
    line?: number;
  }>;
}

interface DesignFile {
  id: string;
  name: string;
  type: string;
  format: string;
}

interface DebugSessionPanelProps {
  session?: DebugSession | null;
  designFiles?: DesignFile[];
  onSelectDesignFile?: (fileId: string) => void;
  onQuickPrompt?: (prompt: string) => void;
  onStatusChange?: (status: "active" | "completed" | "failed") => void;
  className?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: Play,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

const findingTypeConfig = {
  bug: {
    icon: Bug,
    color: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  info: {
    icon: HelpCircle,
    color: "text-primary",
  },
};

// Map icon names to components
const iconMap: Record<string, any> = {
  Search: Search,
  AlertTriangle: AlertTriangle,
  Clock: Clock,
  CheckSquare: FileCheck,
  GitBranch: GitBranch,
  FileCode: FileCode,
  HelpCircle: HelpCircle,
  Zap: Zap,
};

export function DebugSessionPanel({
  session,
  designFiles = [],
  onSelectDesignFile,
  onQuickPrompt,
  onStatusChange,
  className,
}: DebugSessionPanelProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  if (!session) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bug className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Debug Session</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start a new debug session to analyze your design files.
          </p>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = statusConfig[session.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bug className="h-5 w-5" />
            {session.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn("flex items-center gap-1", statusInfo.color, statusInfo.bgColor)}
          >
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
        {session.description && (
          <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Started: {formatTimestamp(session.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duration: {formatDuration(session.createdAt)}</span>
          </div>
        </div>

        {/* Design File */}
        {session.designFileName && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium text-sm">{session.designFileName}</div>
              <div className="text-xs text-muted-foreground">Associated design file</div>
            </div>
            {onSelectDesignFile && session.designFileId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectDesignFile(session.designFileId!)}
              >
                View
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}

        <Separator />

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3">Quick Debug Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.slice(0, 6).map((prompt) => {
              const IconComponent = iconMap[prompt.icon] || HelpCircle;
              return (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => onQuickPrompt?.(prompt.prompt)}
                >
                  <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs truncate">{prompt.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Findings */}
        {session.findings && session.findings.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">
                Findings ({session.findings.length})
              </h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {session.findings.map((finding, index) => {
                    const config = findingTypeConfig[finding.type];
                    const FindingIcon = config.icon;
                    return (
                      <div
                        key={index}
                        className="p-3 bg-muted rounded-lg space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <FindingIcon className={cn("h-4 w-4", config.color)} />
                          <span className="font-medium text-sm">{finding.title}</span>
                          {finding.line && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              Line {finding.line}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          {finding.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Session Controls */}
        {session.status === "active" && onStatusChange && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onStatusChange("completed")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive"
                onClick={() => onStatusChange("failed")}
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        )}

        {/* Available Design Files */}
        {designFiles.length > 0 && !session.designFileId && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">Attach Design File</h4>
              <ScrollArea className="h-[120px]">
                <div className="space-y-1">
                  {designFiles.map((file) => (
                    <Button
                      key={file.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onSelectDesignFile?.(file.id)}
                    >
                      <FileCode className="h-4 w-4 mr-2" />
                      <span className="truncate">{file.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {file.format}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
