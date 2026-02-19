/**
 * Rule-based intent classifier.
 * Maps user input to Intent using keyword patterns from WORKERS_ENTERPRISE and WORKERS_UX.
 */

import type { Intent } from "./types";

interface IntentRule {
  intent: Intent;
  patterns: RegExp[];
  priority: number; // higher = checked first
}

const RULES: IntentRule[] = [
  {
    intent: "accessibility",
    priority: 100,
    patterns: [
      /\baccessible\b/i,
      /\bkeyboard\b/i,
      /\ba11y\b/i,
      /\bscreen\s*reader\b/i,
      /\baria\b/i,
      /\bfocus\b/i,
      /\bwcag\b/i,
    ],
  },
  {
    intent: "usability",
    priority: 95,
    patterns: [
      /\bform\b.*\busability\b/i,
      /\berror\s*message\b/i,
      /\bfeedback\s*pattern\b/i,
      /\bcheck\s*this\s*form\b/i,
      /\bimprove\s*error\b/i,
      /\bloading\s*feedback\b/i,
    ],
  },
  {
    intent: "ux_designer",
    priority: 90,
    patterns: [
      /\bimprove\s*the\s*layout\b/i,
      /\bdesign\s*the\s*structure\b/i,
      /\bhierarchy\s*clear\b/i,
      /\breview\s*ia\b/i,
      /\bnavigation\b/i,
      /\bbuild\s*the\s*ui\b/i,
      /\blayout\s*of\b/i,
      /\bstructure\s*for\b/i,
    ],
  },
  {
    intent: "ux_researcher",
    priority: 85,
    patterns: [
      /\bflow\s*for\b/i,
      /\bwho\s*is\s*this\s*for\b/i,
      /\bux\s*principles\b/i,
      /\buser\s*needs\b/i,
      /\bdesign\s*the\s*flow\b/i,
      /\bwhat\s*should\s*the\s*flow\b/i,
    ],
  },
  {
    intent: "review",
    priority: 80,
    patterns: [
      /\breview\s*for\s*security\b/i,
      /\bready\s*for\s*production\b/i,
      /\bsuggest\s*improvements\b/i,
      /\breview\s*this\s*code\b/i,
      /\bsecurity\s*review\b/i,
      /\bproduction\s*ready\b/i,
    ],
  },
  {
    intent: "docs",
    priority: 75,
    patterns: [
      /\bdocument\b/i,
      /\bupdate\s*readme\b/i,
      /\brunbook\b/i,
      /\bapi\s*docs\b/i,
      /\badd\s*runbook\b/i,
    ],
  },
  {
    intent: "architect",
    priority: 70,
    patterns: [
      /\bdesign\s*the\s*flow\b/i,
      /\bdesign\s*the\s*api\b/i,
      /\bapi\s*contract\b/i,
      /\bdata\s*model\b/i,
      /\bhow\s*should\s*we\s*split\b/i,
      /\bsplit\s*this\s*service\b/i,
      /\bflow\/api\b/i,
    ],
  },
  {
    intent: "implement",
    priority: 65,
    patterns: [
      /\bimplement\b/i,
      /\badd\s*endpoint\b/i,
      /\bfix\b/i,
      /\brefactor\b/i,
      /\bbuild\b/i,
      /\badd\s*a\s*form\b/i,
      /\bcreate\s*testbench\b/i,
      /\bgenerate\s*testbench\b/i,
    ],
  },
  {
    intent: "research",
    priority: 60,
    patterns: [
      /\bhow\s*does\b/i,
      /\bbest\s*practice\b/i,
      /\bcves?\b/i,
      /\bsecurity\s*advisories\b/i,
      /\bcompatibility\b/i,
      /\brecommended\s*way\b/i,
      /\bwhat's\s*the\s*recommended\b/i,
      /\bexplain\b/i,
      /\bwhat\s*does\b/i,
    ],
  },
];

// Sort by priority descending
const SORTED_RULES = [...RULES].sort((a, b) => b.priority - a.priority);

/**
 * Classify user input to primary intent.
 */
export function classifyIntent(input: string): Intent {
  const trimmed = input.trim();
  if (!trimmed) return "general";

  const lower = trimmed.toLowerCase();

  for (const rule of SORTED_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(lower)) {
        return rule.intent;
      }
    }
  }

  return "general";
}
