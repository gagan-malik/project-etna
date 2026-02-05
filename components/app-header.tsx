"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAuthPath } from "@/lib/layout";
import { DevProfileSwitcher } from "@/components/dev-profile-switcher";
import { UserMenu } from "@/components/user-menu";

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useUser();

  if (isAuthPath(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-11 items-center justify-end gap-2 px-3">
        <DevProfileSwitcher />
        <UserMenu
          name={user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "User"}
          email={user?.primaryEmailAddress?.emailAddress ?? undefined}
          image={user?.imageUrl ?? undefined}
        />
      </div>
    </header>
  );
}

