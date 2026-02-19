"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OnboardingStatus {
  completed: boolean;
  steps: { hasSpace: boolean; hasConversation: boolean };
}

export function OnboardingWizard() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/onboarding/status", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setOpen(!data.completed);
      }
    } catch {
      setStatus(null);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const complete = async () => {
    setCompleting(true);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setStatus((prev) => (prev ? { ...prev, completed: true } : null));
        setOpen(false);
      }
    } finally {
      setCompleting(false);
    }
  };

  const goToChat = () => {
    setOpen(false);
    router.push("/chat");
    complete();
  };

  if (loading || !isSignedIn || !status || status.completed) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" aria-describedby="onboarding-desc">
        <DialogHeader>
          <DialogTitle>Welcome to Etna</DialogTitle>
          <DialogDescription id="onboarding-desc">
            Complete these steps to get started, or skip and explore on your own.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
            {status.steps.hasSpace ? (
              <span className="text-sm text-muted-foreground">You have at least one space.</span>
            ) : (
              <>
                <span className="text-sm flex-1">Create a space to organize conversations.</span>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/overview">Create space</Link>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
            {status.steps.hasConversation ? (
              <span className="text-sm text-muted-foreground">You have started a conversation.</span>
            ) : (
              <>
                <span className="text-sm flex-1">Start chatting with the AI.</span>
                <Button variant="default" size="sm" onClick={goToChat}>
                  Go to Chat
                </Button>
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={complete} disabled={completing}>
            {completing ? "Saving…" : "I'm done, don't show again"}
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              complete();
            }}
            disabled={completing}
          >
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
