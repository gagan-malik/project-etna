"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Legacy signup form: redirects to Clerk sign-up at /signup.
 * Auth is now handled by Clerk; use the /signup page for sign-up.
 */
export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signup");
  }, [router]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <p className="text-muted-foreground">Redirecting to sign up…</p>
    </div>
  );
}
