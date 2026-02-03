"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/components/user-settings-provider";
import { isPaidPlan } from "../settings-config";
import { SettingsSection } from "../settings-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ExternalLink, Gem, Info } from "lucide-react";

const INCLUDED_PERIOD = "27 Jan 2026 - 27 Feb 2026";
const ON_DEMAND_PERIOD = "27 Jan 2026 - 27 Feb 2026";

const INCLUDED_ROWS = [
  { item: "claude-4.5-opus-high (Included in Pro Plus)", tokens: "205.6M tokens", cost: "US$192.58 Included" },
  { item: "Auto", tokens: "213.1M tokens", cost: "US$73.04 Included" },
  { item: "gpt-5.2", tokens: "1.7M tokens", cost: "US$0.57 Included" },
];
const INCLUDED_TOTAL = { tokens: "420.4M", cost: "US$266.18 Included" };

const ON_DEMAND_ROWS = [
  { type: "non-max-claude-4.5-opus-high", tokens: "79.1M", cost: "US$0.09", qty: "756", total: "US$68.19" },
  { type: "Mid-month usage paid for cycle starting January 27, 2026", tokens: "—", cost: "-US$62.90", qty: "1", total: "-US$62.90" },
];
const ON_DEMAND_SUBTOTAL = "US$5.29";
const ON_DEMAND_SUMMARY = "US$68.19 / US$100.00";
const SHOW_UNPAID_WARNING = true;

const INVOICE_ROWS = [
  { date: "28 Jan 2026", description: "", status: "Void", amount: "0.00 USD", viewHref: "#" },
  { date: "28 Jan 2026", description: "Cursor Usage for cycle starting January 27, 2026 (Mid-Month Invoice)", status: "Open", amount: "42.53 USD", viewHref: "#" },
  { date: "28 Jan 2026", description: "Cursor Usage for cycle starting January 27, 2026 (Mid-Month Invoice)", status: "Paid", amount: "20.37 USD", viewHref: "#" },
  { date: "28 Jan 2026", description: "", status: "Void", amount: "0.00 USD", viewHref: "#" },
  { date: "27 Jan 2026", description: "", status: "Paid", amount: "39.66 USD", viewHref: "#" },
  { date: "27 Jan 2026", description: "", status: "Paid", amount: "20.00 USD", viewHref: "#" },
  { date: "16 Jan 2026", description: "", status: "Uncollectible", amount: "0.00 USD", viewHref: "#" },
  { date: "09 Jan 2026", description: "", status: "Paid", amount: "30.88 USD", viewHref: "#" },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      data-status={status.toLowerCase()}
    >
      {status}
    </span>
  );
}

export function BillingInvoicesPanel() {
  const { plan } = useUserSettings();
  const hasPremiumAccess = isPaidPlan(plan);
  const [cycle, setCycle] = useState("27 Jan 2026");
  const [month, setMonth] = useState("January 2026");

  return (
    <div className="w-full px-8 py-5 space-y-6">
      {/* Top right: Upgrade (Free) or Manage subscription (Pro/Ultra) */}
      <div className="flex justify-end">
        {hasPremiumAccess ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Manage subscription
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Manage in Stripe
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Downgrade plan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" size="sm" asChild>
            <Link href="/overview">Upgrade to Pro</Link>
          </Button>
        )}
      </div>

      {/* Included Usage */}
      <SettingsSection title="Included Usage" className="space-y-2">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Included Usage</span>
            {!hasPremiumAccess && (
              <Badge variant="upgrade" className="gap-1"><Gem className="h-3 w-3" />Paid</Badge>
            )}
          </div>
          <Switch checked={false} disabled={!hasPremiumAccess} aria-label="Included Usage" />
        </div>
        <p className="text-xs text-muted-foreground">{INCLUDED_PERIOD}</p>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Item</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Tokens</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Cost</th>
              </tr>
            </thead>
            <tbody>
              {INCLUDED_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="text-sm px-2.5 py-1.5">{row.item}</td>
                  <td className="text-sm text-muted-foreground px-2.5 py-1.5">{row.tokens}</td>
                  <td className="text-sm px-2.5 py-1.5">{row.cost}</td>
                </tr>
              ))}
              <tr className="border-border/50 font-medium">
                <td className="text-sm px-2.5 py-1.5">Total</td>
                <td className="text-sm px-2.5 py-1.5">{INCLUDED_TOTAL.tokens}</td>
                <td className="text-sm px-2.5 py-1.5">{INCLUDED_TOTAL.cost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SettingsSection>

      {/* On-Demand Usage */}
      <SettingsSection
        title="On-Demand Usage"
        className="space-y-2"
      >
        <p className="text-xs text-muted-foreground">{ON_DEMAND_PERIOD}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={cycle} onValueChange={setCycle}>
            <SelectTrigger className="w-[220px] h-8 text-sm">
              <SelectValue placeholder="Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="27 Jan 2026">Cycle starting 27 Jan 2026</SelectItem>
              <SelectItem value="27 Dec 2025">Cycle starting 27 Dec 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">{ON_DEMAND_SUMMARY}</span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Info about on-demand credit"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Type</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Tokens</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Cost</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Qty</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {ON_DEMAND_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="text-sm px-2.5 py-1.5">{row.type}</td>
                  <td className="text-sm text-muted-foreground px-2.5 py-1.5">{row.tokens}</td>
                  <td className="text-sm px-2.5 py-1.5">{row.cost}</td>
                  <td className="text-sm px-2.5 py-1.5">{row.qty}</td>
                  <td className="text-sm px-2.5 py-1.5">{row.total}</td>
                </tr>
              ))}
              <tr className="border-border/50 font-medium">
                <td colSpan={4} className="text-sm px-2.5 py-1.5 text-right">Subtotal:</td>
                <td className="text-sm px-2.5 py-1.5">{ON_DEMAND_SUBTOTAL}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {SHOW_UNPAID_WARNING && (
          <Alert variant="destructive" className="mt-3 border-destructive/50 bg-destructive/10">
            <AlertDescription>
              You may have an unpaid invoice. Please check your billing settings.
            </AlertDescription>
          </Alert>
        )}
      </SettingsSection>

      {/* Invoices */}
      <SettingsSection
        title="Invoices"
        className="space-y-2"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January 2026">January 2026</SelectItem>
              <SelectItem value="December 2025">December 2025</SelectItem>
              <SelectItem value="November 2025">November 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Date</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Description</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Status</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Amount</th>
                <th className="text-xs font-medium text-muted-foreground px-2.5 py-1.5">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {INVOICE_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="text-sm px-2.5 py-1.5">{row.date}</td>
                  <td className="text-sm text-muted-foreground px-2.5 py-1.5 max-w-[240px] truncate">{row.description || "—"}</td>
                  <td className="text-sm px-2.5 py-1.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="text-sm px-2.5 py-1.5">{row.amount}</td>
                  <td className="text-sm px-2.5 py-1.5">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs font-normal" asChild>
                      <Link href={row.viewHref} target="_blank" rel="noopener noreferrer" className="gap-1">
                        View
                        <ExternalLink className="h-3 w-3 inline" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}
