"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Bug,
  MoreVertical,
  Trash2,
  Loader2,
  Search,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  FileCode,
  Plus,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/format";

interface DebugSession {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "completed" | "failed";
  designFileId: string | null;
  design_files?: {
    id: string;
    name: string;
    type: string;
    format: string;
  } | null;
  findings: any;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Array<{
    id: string;
    content: string;
    role: string;
    createdAt: string;
  }>;
}

// Combined type for display
interface DisplaySession {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "completed" | "failed";
  type: "debug" | "conversation" | "orchestration";
  designFile?: { name: string; format: string } | null;
  messageCount?: number;
  createdAt: string;
  updatedAt: string;
  findings?: any;
  intent?: string;
  input?: string;
}

interface OrchestrationRun {
  id: string;
  status: string;
  intent: string;
  input: string;
  finalOutput: string | null;
  createdAt: string;
  updatedAt: string;
  agent_tasks?: Array<{ agentId: string; orderIndex: number; status: string }>;
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

export default function DebugSessionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<DisplaySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [orchestrationRuns, setOrchestrationRuns] = useState<OrchestrationRun[]>([]);
  const [orchestrationLoading, setOrchestrationLoading] = useState(false);

  // Load sessions from API
  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (typeFilter === "orchestration") {
      loadOrchestrationRuns();
    }
  }, [typeFilter]);

  const loadOrchestrationRuns = async () => {
    setOrchestrationLoading(true);
    try {
      const response = await fetch("/api/orchestration/runs", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setOrchestrationRuns(data.data?.runs || []);
      }
    } catch {
      setOrchestrationRuns([]);
    } finally {
      setOrchestrationLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      setLoading(true);

      // Load both debug sessions and conversations
      const [debugResponse, convResponse] = await Promise.all([
        fetch("/api/debug-sessions", { credentials: "include" }),
        fetch("/api/conversations", { credentials: "include" }),
      ]);

      const displaySessions: DisplaySession[] = [];

      // Process debug sessions
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        const debugSessions: DebugSession[] = debugData.debugSessions || [];
        
        for (const session of debugSessions) {
          displaySessions.push({
            id: session.id,
            name: session.name,
            description: session.description,
            status: session.status,
            type: "debug",
            designFile: session.design_files
              ? { name: session.design_files.name, format: session.design_files.format }
              : null,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            findings: session.findings,
          });
        }
      }

      // Process conversations as debug sessions
      if (convResponse.ok) {
        const convData = await convResponse.json();
        const conversations: Conversation[] = convData.conversations || [];
        
        for (const conv of conversations) {
          displaySessions.push({
            id: conv.id,
            name: conv.title || "Untitled Debug Session",
            description: null,
            status: "completed", // Conversations are considered completed sessions
            type: "conversation",
            messageCount: conv.messages?.length || 0,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          });
        }
      }

      // Sort by updatedAt
      displaySessions.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setSessions(displaySessions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load debug sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      toast({
        title: "Error",
        description: "Session name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      // Get or create a default space
      const spacesResponse = await fetch("/api/spaces", { credentials: "include" });
      let spaceId: string;
      
      if (spacesResponse.ok) {
        const spacesData = await spacesResponse.json();
        if (spacesData.spaces && spacesData.spaces.length > 0) {
          spaceId = spacesData.spaces[0].id;
        } else {
          // Create a default space
          const createSpaceResponse = await fetch("/api/spaces", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: "Default Workspace",
              slug: `workspace-${Date.now()}`,
            }),
          });
          if (!createSpaceResponse.ok) throw new Error("Failed to create workspace");
          const newSpace = await createSpaceResponse.json();
          spaceId = newSpace.space.id;
        }
      } else {
        throw new Error("Failed to get workspaces");
      }

      const response = await fetch("/api/debug-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newSessionName,
          description: newSessionDescription || null,
          spaceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create session");
      }

      toast({
        title: "Success",
        description: "Debug session created",
      });

      setNewSessionOpen(false);
      setNewSessionName("");
      setNewSessionDescription("");
      loadSessions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (session: DisplaySession) => {
    if (!confirm("Are you sure you want to delete this debug session?")) {
      return;
    }

    try {
      const endpoint =
        session.type === "debug"
          ? `/api/debug-sessions/${session.id}`
          : `/api/conversations/${session.id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      toast({
        title: "Success",
        description: "Debug session deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const handleSessionClick = (session: DisplaySession) => {
    if (session.type === "conversation") {
      router.push(`/chat?conversation=${session.id}`);
    } else {
      // For debug sessions, navigate to the detail page (or chat for now)
      router.push(`/chat?session=${session.id}`);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (typeFilter === "orchestration") return false;
    // Status filter
    if (statusFilter !== "all" && session.status !== statusFilter) return false;
    // Type filter
    if (typeFilter !== "all" && session.type !== typeFilter) return false;
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = session.name.toLowerCase().includes(query);
      const descMatch = session.description?.toLowerCase().includes(query);
      const fileMatch = session.designFile?.name.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !fileMatch) return false;
    }
    return true;
  });

  const filteredOrchestrationRuns = orchestrationRuns.filter((run) => {
    if (statusFilter !== "all" && run.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inputMatch = run.input?.toLowerCase().includes(query);
      const intentMatch = run.intent?.toLowerCase().includes(query);
      if (!inputMatch && !intentMatch) return false;
    }
    return true;
  });

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 space-y-4">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-3 -mx-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debug Sessions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your silicon debugging sessions
          </p>
        </div>
        <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Debug Session</DialogTitle>
              <DialogDescription>
                Start a new silicon debugging session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name</Label>
                <Input
                  id="name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., Debug clock domain crossing issue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newSessionDescription}
                  onChange={(e) => setNewSessionDescription(e.target.value)}
                  placeholder="Describe what you're debugging..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewSessionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession} disabled={creating}>
                {creating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search debug sessions..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">
              <Play className="h-3 w-3 mr-1" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="failed">
              <XCircle className="h-3 w-3 mr-1" />
              Failed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="debug">Debug Sessions</SelectItem>
            <SelectItem value="conversation">Conversations</SelectItem>
            <SelectItem value="orchestration">Orchestration Runs</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">
          {typeFilter === "orchestration"
            ? `${filteredOrchestrationRuns.length} run${filteredOrchestrationRuns.length !== 1 ? "s" : ""}`
            : `${filteredSessions.length} session${filteredSessions.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="h-[calc(100vh-350px)]">
        {typeFilter === "orchestration" ? (
          orchestrationLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOrchestrationRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">
                No orchestration runs yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Enable Orchestration mode in chat to run multi-agent pipelines
              </p>
              <Button onClick={() => router.push("/chat")}>
                Go to Chat
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOrchestrationRuns.map((run) => {
                const statusInfo = statusConfig[run.status as keyof typeof statusConfig] ?? statusConfig.completed;
                const StatusIcon = statusInfo.icon;
                return (
                  <Card
                    key={run.id}
                    className="p-3 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push(`/orchestration/runs/${run.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <GitBranch className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-base font-semibold text-foreground truncate">
                            {run.intent}
                          </span>
                          <Badge
                            variant="outline"
                            className={`${statusInfo.color} ${statusInfo.bgColor}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Orchestration
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {run.input}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(run.updatedAt)}
                          </span>
                          {run.agent_tasks && run.agent_tasks.length > 0 && (
                            <span>
                              {run.agent_tasks.length} task{run.agent_tasks.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bug className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">
              No debug sessions yet
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Start a new debug session to analyze your designs
            </p>
            <Button onClick={() => setNewSessionOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSessions.map((session) => {
              const statusInfo = statusConfig[session.status];
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={session.id}
                  className="p-3 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {session.type === "debug" ? (
                        <Bug className="h-5 w-5 text-foreground" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground truncate">
                          {session.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${statusInfo.color} ${statusInfo.bgColor}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {session.type === "conversation" && (
                          <Badge variant="secondary" className="text-xs">
                            Chat
                          </Badge>
                        )}
                      </div>
                      {session.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {session.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(session.updatedAt)}
                        </span>
                        {session.designFile && (
                          <span className="flex items-center gap-1">
                            <FileCode className="h-3 w-3" />
                            {session.designFile.name}
                          </span>
                        )}
                        {session.messageCount !== undefined && session.messageCount > 0 && (
                          <span>
                            {session.messageCount} message{session.messageCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {session.findings &&
                          Array.isArray(session.findings) &&
                          session.findings.length > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400">
                              {session.findings.length} finding
                              {session.findings.length > 1 ? "s" : ""}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(session);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
