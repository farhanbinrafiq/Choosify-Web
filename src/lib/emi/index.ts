export * from './assistantRegistry';
export * from './capabilityRegistry';
export * from './pageRegistry';
export * from './contextRegistry';
export * from './promptRegistry';
export * from './confidenceRegistry';
export * from './recommendationRegistry';
export * from './actionRegistry';
export * from './emiContextEngine';
export * from './emiRecommendationEngine';
export * from './emiMemory';

import { EMI_ASSISTANT_REGISTRY } from './assistantRegistry';
import { EMI_CAPABILITY_REGISTRY } from './capabilityRegistry';
import { EMI_PAGE_REGISTRY } from './pageRegistry';
import { EMI_ACTION_REGISTRY } from './actionRegistry';

export const EMI_PLATFORM_REGISTRY = {
  version: '5.6',
  assistants: EMI_ASSISTANT_REGISTRY,
  capabilities: EMI_CAPABILITY_REGISTRY,
  pages: EMI_PAGE_REGISTRY,
  actions: EMI_ACTION_REGISTRY,
  philosophy: 'Copilot-style contextual intelligence — not a destination chatbot.',
} as const;

/** Dispatch event to open global Emi panel with optional seed prompt */
export function openEmiPanel(prompt?: string) {
  window.dispatchEvent(new CustomEvent('choosify:open-emi', { detail: { prompt } }));
}
