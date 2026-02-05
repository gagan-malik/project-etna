"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEV_TIER_PROFILES } from "@/lib/dev-profiles";
import { cn } from "@/lib/utils";

const devSecret = process.env.NEXT_PUBLIC_DEV_PROFILE_SECRET;
const isDev = process.env.NODE_ENV === "development";

const DEMO_VALUE = "__demo__";
const OTHER_VALUE = "__other__";

export function DevProfileSwitcher() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!isDev) {
    return null;
  }

  // Close when window loses focus so Cursor's "Select element" tool isn't blocked
  useEffect(() => {
    const handleBlur = () => setOpen(false);
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  const currentEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const currentProfile = DEV_TIER_PROFILES.find((p) => p.email === currentEmail);
  const isAuthenticated = !!user;

  const selectValue = currentProfile
    ? currentProfile.email
    : isAuthenticated
      ? OTHER_VALUE
      : DEMO_VALUE;

  async function handleChange(value: string) {
    if (value === selectValue) return;
    if (value === OTHER_VALUE) return;

    if (value === DEMO_VALUE) {
      try {
        await signOut();
        const target = pathname ?? "/";
        setTimeout(() => {
          window.location.href = target;
        }, 50);
      } catch (err) {
        console.error("Dev profile switch (sign out) error:", err);
      }
      return;
    }

    // With Clerk, switching to another dev profile requires signing in via Clerk UI
    window.location.href = "/login";
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="dev-profile-select" className="sr-only">
        Switch dev user or demo (development only)
      </label>
      <Select
        value={selectValue}
        onValueChange={handleChange}
        open={open}
        onOpenChange={setOpen}
        disabled={!devSecret && isAuthenticated}
      >
        <SelectTrigger
          id="dev-profile-select"
          className={cn(
            "h-8 w-[10rem]",
            !devSecret && isAuthenticated && "opacity-60",
          )}
          aria-label="Switch dev user or demo (development only)"
        >
          <SelectValue placeholder="Dev profile">
            {!devSecret ? "Set NEXT_PUBLIC_DEV_PROFILE_SECRET" : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEMO_VALUE}>
            Demo – signed out
          </SelectItem>
          {isAuthenticated && !currentProfile && (
            <SelectItem value={OTHER_VALUE}>
              Dev profile
            </SelectItem>
          )}
          {DEV_TIER_PROFILES.map((profile) => (
            <SelectItem key={profile.email} value={profile.email}>
              {profile.plan} – {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
