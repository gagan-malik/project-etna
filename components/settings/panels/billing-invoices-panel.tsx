"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Sparkles, CreditCard, AlertCircle } from "lucide-react";

// Placeholder until billing API is connected — use generic copy so we don't imply live data

function BillingRow({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <Label className="text-xs font-medium text-foreground">{label}</Label>
        <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{value}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function BillingInvoicesPanel() {
  const { plan } = useUserSettings();
  const hasPremiumAccess = isPaidPlan(plan);
  const [comparePlansOpen, setComparePlansOpen] = useState(false);
  const [cancelPlanOpen, setCancelPlanOpen] = useState(false);
  const [compareTab, setCompareTab] = useState<"pro" | "business">("pro");

  const planLabel =
    plan === "pro"
      ? "Pro"
      : plan === "ultra"
        ? "Ultra"
        : plan === "enterprise"
          ? "Enterprise"
          : "Free";

  return (
    <div className="w-full px-8 pt-16 pb-5 space-y-6">
      <SettingsSection title="Billing" list>
        <BillingRow
          label="Your plan"
          value={`You're on the ${planLabel} plan.`}
          action={
            <Button variant="secondary" size="sm" onClick={() => setComparePlansOpen(true)}>
              Compare plans
            </Button>
          }
        />
        <BillingRow
          label="AI credits"
          value={hasPremiumAccess ? "View and top up from the overview page when billing is connected." : "Upgrade to get AI credits and usage-based options."}
          action={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/overview">Top up credits</Link>
            </Button>
          }
        />
        <BillingRow
          label="Billing"
          value={
            hasPremiumAccess
              ? "Your plan renews monthly. Manage payment and invoices when billing is connected."
              : "Upgrade to manage billing and payment."
          }
          action={
            hasPremiumAccess ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="gap-1.5">
                  Manage payment
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" size="sm" asChild>
                <Link href="/overview">Upgrade</Link>
              </Button>
            )
          }
        />
        {hasPremiumAccess && (
          <BillingRow
            label="Cancel your plan"
            value="You will lose access to all paid features."
            action={
              <Button
                variant="secondary"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setCancelPlanOpen(true)}
              >
                Cancel plan
              </Button>
            }
          />
        )}
      </SettingsSection>

      <p className="text-sm">
        <Link
          href="/overview"
          className="text-primary underline underline-offset-4 hover:no-underline"
        >
          Need help with billing?
        </Link>
      </p>

      {/* Compare plans modal */}
      <Dialog open={comparePlansOpen} onOpenChange={setComparePlansOpen}>
        <DialogContent className="sm:max-w-[540px]" aria-describedby="compare-plans-description">
          <DialogHeader>
            <DialogTitle>Compare plans</DialogTitle>
            <DialogDescription id="compare-plans-description">
              Choose the plan that fits your usage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex rounded-lg bg-muted/50 p-0.5">
              <button
                type="button"
                onClick={() => setCompareTab("pro")}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  compareTab === "pro"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Pro
              </button>
              <button
                type="button"
                onClick={() => setCompareTab("business")}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  compareTab === "business"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Business
              </button>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Everything in Free, plus:
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                {compareTab === "pro" ? (
                  <>
                    <li className="flex items-center gap-2">• Separate tracks & exports</li>
                    <li className="flex items-center gap-2">• AI credits</li>
                    <li className="flex items-center gap-2">• Priority support</li>
                    <li className="flex items-center gap-2">• Advanced models</li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">• Everything in Pro</li>
                    <li className="flex items-center gap-2">• Team seats & SSO</li>
                    <li className="flex items-center gap-2">• Usage-based billing</li>
                    <li className="flex items-center gap-2">• Dedicated support</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button asChild>
              <Link href="/overview">See pricing</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel plan modal */}
      <Dialog open={cancelPlanOpen} onOpenChange={setCancelPlanOpen}>
        <DialogContent className="sm:max-w-[440px]" aria-describedby="cancel-plan-description">
          <DialogHeader>
            <DialogTitle>Canceling means losing access to the following</DialogTitle>
            <DialogDescription id="cancel-plan-description">
              Your access to these features will be lost at the end of the month.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-4 py-2">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium">Saved conversations & history</p>
                <p className="text-xs text-muted-foreground">
                  Your chat history and exported data may no longer be available.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium">Unused AI credits</p>
                <p className="text-xs text-muted-foreground">
                  Any remaining credits will be forfeited.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium">Paid features</p>
                <p className="text-xs text-muted-foreground">
                  Pro models, priority support, and other paid features.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium">Integrations & workspace settings</p>
                <p className="text-xs text-muted-foreground">
                  Some connected apps and team settings may be limited.
                </p>
              </div>
            </li>
          </ul>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="secondary" onClick={() => setCancelPlanOpen(false)}>
              Don&apos;t cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setCancelPlanOpen(false);
                // TODO: wire to cancellation API when billing is connected
              }}
            >
              Continue to cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
