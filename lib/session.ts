import { getSession } from "@/lib/auth";

/**
 * Get the current session server-side (Clerk + Prisma).
 */
export async function getSessionForApi() {
  return getSession();
}

/**
 * Get the current user server-side.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
