"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SignIn, useAuth } from "@clerk/nextjs";
import { DEV_TIER_PROFILES } from "@/lib/dev-profiles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEMO_PASSWORD = "TierDevPassword1!";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Full-page redirect so the next request sends the session cookie; client nav can miss it
      window.location.href = "/chat";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-8">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-8">
        <p className="text-muted-foreground">Redirecting to chat…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4 md:p-8">
      <Card className="w-full max-w-md border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-2 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Auth is bypassed. &quot;Demo – signed out&quot; in the header means you’re not signed in with Clerk; use the app as a guest or sign in below.
          </p>
          <Button asChild variant="default">
            <Link href="/chat">Go to Chat</Link>
          </Button>
        </CardContent>
      </Card>
      <SignIn
        signUpUrl="/signup"
        forceRedirectUrl="/chat"
        signUpFallbackRedirectUrl="/chat"
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
      />
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Demo users</h2>
          <p className="text-xs text-muted-foreground">
            Password for all: <code className="rounded bg-muted px-1">{DEMO_PASSWORD}</code>
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-sm">
            {DEV_TIER_PROFILES.map((p) => (
              <li
                key={p.email}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-background/50 px-3 py-2"
              >
                <span className="font-medium">{p.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {p.plan}
                </Badge>
                <span className="w-full truncate text-muted-foreground" title={p.email}>
                  {p.email}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
