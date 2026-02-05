/**
 * Auth layer using Clerk + Prisma.
 * Exposes a session compatible with existing API routes (session.user.id = Prisma user id).
 */

import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  plan?: string;
}

export interface Session {
  user: SessionUser;
}

/**
 * Get current session for API routes and server components.
 * Returns session with Prisma user (session.user.id = our DB user id).
 * Creates Prisma user on first Clerk sign-in if not exists.
 */
export async function getSession(): Promise<Session | null> {
  const { userId: clerkUserId } = await clerkAuth();
  if (!clerkUserId) return null;

  let user = await prisma.users.findUnique({
    where: { clerkId: clerkUserId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      plan: true,
    },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return null;

    const existingByEmail = await prisma.users.findUnique({
      where: { email: primaryEmail },
    });
    if (existingByEmail) {
      await prisma.users.update({
        where: { id: existingByEmail.id },
        data: { clerkId: clerkUserId, name: clerkUser.fullName ?? existingByEmail.name, image: clerkUser.imageUrl ?? existingByEmail.image },
      });
      user = await prisma.users.findUnique({
        where: { id: existingByEmail.id },
        select: { id: true, email: true, name: true, image: true, plan: true },
      });
    } else {
      user = await prisma.users.create({
        data: {
          clerkId: clerkUserId,
          email: primaryEmail,
          name: clerkUser.fullName ?? null,
          image: clerkUser.imageUrl ?? null,
        },
        select: { id: true, email: true, name: true, image: true, plan: true },
      });
      await prisma.spaces.create({
        data: {
          name: `${user.name || user.email}'s Workspace`,
          slug: `workspace-${user.id}`,
          ownerId: user.id,
        },
      });
    }
  }

  if (!user) return null;
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      plan: user.plan ?? "free",
    },
  };
}

/**
 * Alias for getSession() so existing `import { auth } from "@/auth"` keeps working.
 */
export async function auth(): Promise<Session | null> {
  return getSession();
}
