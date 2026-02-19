/**
 * Maps Intent to ordered list of AgentIds.
 * Supports multi-step pipelines (e.g. architect → implement).
 */

import type { Intent } from "./types";
import type { AgentId } from "./types";

const ROUTES: Record<Intent, AgentId[]> = {
  research: ["research"],
  architect: ["architect", "implement"],
  implement: ["implement"],
  review: ["review"],
  docs: ["docs"],
  ux_researcher: ["ux_researcher", "ux_designer"],
  ux_designer: ["ux_designer", "implement"],
  usability: ["usability", "accessibility"],
  accessibility: ["accessibility"],
  general: ["research"],
};

/**
 * Route intent to ordered list of agents.
 */
export function routeIntent(intent: Intent): AgentId[] {
  const agents = ROUTES[intent] ?? ["research"];
  return [...agents];
}
