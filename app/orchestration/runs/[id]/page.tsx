"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, GitBranch, Loader2, CheckCircle, XCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";

interface AgentTask {
  id: string;
  agentId: string;
  orderIndex: number;
  status: string;
  input: string;
  output: string | null;
}

interface RunDetail {
  id: string;
  status: string;
  intent: string;
  input: string;
  finalOutput: string | null;
  createdAt: string;
  updatedAt: string;
  agent_tasks: AgentTask[];
}

export default function OrchestrationRunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [run, setRun] = useState<RunDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const response = await fetch(`/api/orchestration/runs/${id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setRun(data.data?.run ?? null);
        } else {
          setRun(null);
        }
      } catch {
        setRun(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const statusConfig: Record<string, { label: string; icon: typeof CheckCircle }> = {
    completed: { label: "Completed", icon: CheckCircle },
    failed: { label: "Failed", icon: XCircle },
    running: { label: "Running", icon: Loader2 },
    pending: { label: "Pending", icon: Loader2 },
  };
  const statusInfo = run ? (statusConfig[run.status] ?? statusConfig.completed) : null;

  if (loading) {
    return (
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!run) {
    return (
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-foreground mb-2">Run not found</p>
          <Button variant="outline" onClick={() => router.push("/activity")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activity
          </Button>
        </div>
      </main>
    );
  }

  const StatusIcon = statusInfo?.icon ?? CheckCircle;

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/activity")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {run.intent}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo?.label ?? run.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(run.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-4">
          <h2 className="text-sm font-medium text-foreground mb-2">Input</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {run.input}
          </p>
        </Card>

        {run.agent_tasks && run.agent_tasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-foreground">Tasks</h2>
            <div className="flex flex-col gap-3">
              {run.agent_tasks
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.agentId}
                      </Badge>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "outline"
                            : task.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.status}
                      </Badge>
                    </div>
                    {task.output && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Output</p>
                        <p className="text-sm whitespace-pre-wrap line-clamp-6">
                          {task.output}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        )}

        {run.finalOutput && (
          <Card className="p-4">
            <h2 className="text-sm font-medium text-foreground mb-2">
              Final Output
            </h2>
            <ScrollArea className="max-h-[400px]">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {run.finalOutput}
              </p>
            </ScrollArea>
          </Card>
        )}
      </div>
    </main>
  );
}
