/**
 * Subscription utility functions
 * Handles user subscription and premium access checks
 */

import { prisma } from "@/lib/prisma";

export type Plan = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "canceled" | "expired" | null;

/**
 * Check if user has premium access
 * Premium plans: "pro" or "enterprise" with active subscription
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });

    if (!user) {
      return false;
    }

    // Check if user has a premium plan
    const isPremiumPlan = user.plan === "pro" || user.plan === "enterprise";

    if (!isPremiumPlan) {
      return false;
    }

    // Check if subscription is active
    if (user.subscriptionStatus !== "active") {
      return false;
    }

    // Check if subscription hasn't expired
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      // Update status to expired
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: "expired" },
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking premium access:", error);
    return false;
  }
}

/**
 * Get user's current plan
 */
export async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    return (user?.plan as Plan) || "free";
  } catch (error) {
    console.error("Error getting user plan:", error);
    return "free";
  }
}

/**
 * Get user's subscription status
 */
export async function getUserSubscriptionStatus(
  userId: string
): Promise<SubscriptionStatus> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });

    if (!user) {
      return null;
    }

    // Check if subscription has expired
    if (
      user.subscriptionStatus === "active" &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt < new Date()
    ) {
      // Update status to expired
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: "expired" },
      });
      return "expired";
    }

    return (user.subscriptionStatus as SubscriptionStatus) || null;
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return null;
  }
}

