import { auth } from "@/auth"

/**
 * Get the current session server-side
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user server-side
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

