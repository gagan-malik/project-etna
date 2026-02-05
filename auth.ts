/**
 * Auth entrypoint: re-exports from lib/auth (Clerk + Prisma session).
 * API routes that import { auth } from "@/auth" get session with session.user.id = Prisma user id.
 */
export { auth, getSession } from "@/lib/auth";
export type { Session, SessionUser } from "@/lib/auth";
