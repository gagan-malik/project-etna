"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/ui/page-title";
import { PageSection } from "@/components/ui/page-section";
import { Check, Sparkles, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic AI chat",
      "Auto model selection",
      "Limited conversations",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/month",
    description: "For power users and professionals",
    popular: true,
    features: [
      "Everything in Free",
      "MAX Mode - Highest quality models",
      "Use Multiple Models",
      "Unlimited conversations",
      "Priority support",
      "Advanced integrations",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "Team management",
      "SSO & advanced security",
      "Custom SLA",
    ],
  },
];

export default function OverviewPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/account/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.user?.plan || "free");
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [session]);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") {
      toast({
        title: "Already on Free plan",
        description: "You're currently on the Free plan.",
      });
      return;
    }

    if (planId === "enterprise") {
      toast({
        title: "Contact Sales",
        description: "Please contact sales@example.com for Enterprise plans.",
      });
      return;
    }

    // TODO: Integrate with payment provider (Stripe, etc.)
    toast({
      title: "Upgrade Coming Soon",
      description: `Upgrade to ${planId} plan will be available soon.`,
    });
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-5 space-y-6">
      <PageTitle
        title="Choose Your Plan"
        description="Select the plan that best fits your needs"
      />

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={`relative p-4 flex flex-col ${
                isPopular ? "border-primary border-2" : ""
              }`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan || loading}
              >
                {isCurrentPlan ? "Current Plan" : plan.id === "enterprise" ? "Contact Sales" : "Upgrade"}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Premium Features Section */}
      <PageSection title="Premium Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">MAX Mode</h3>
              <p className="text-sm text-muted-foreground">
                Access the highest quality AI models for the best responses. Perfect for complex tasks and critical work.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Use Multiple Models</h3>
              <p className="text-sm text-muted-foreground">
                Get responses from multiple AI models simultaneously. Compare and combine insights for better results.
              </p>
            </div>
          </div>
        </div>
      </PageSection>
    </main>
  );
}

