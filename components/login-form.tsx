"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Legacy login form: redirects to Clerk sign-in at /login.
 * Auth is now handled by Clerk; use the /login page for sign-in.
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <p className="text-muted-foreground">Redirecting to sign in…</p>
    </div>
  );
}
