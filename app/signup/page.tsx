"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUp, useAuth } from "@clerk/nextjs";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/chat");
    }
  }, [isLoaded, isSignedIn, router]);

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
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-8">
      <SignUp
        signInUrl="/login"
        afterSignUpUrl="/chat"
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
      />
    </div>
  );
}
