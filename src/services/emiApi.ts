import type { EmiCatalogPick } from '../lib/emiCatalogSearch';

export type EmiChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  picks?: EmiCatalogPick[];
  createdAt: string;
};

export type EmiPageContext = {
  pathname: string;
  title?: string;
};

const EMI_API =
  ((import.meta as { env?: Record<string, string> }).env?.VITE_EMI_API_URL as string | undefined) ||
  '/api/emi/chat';

export async function sendEmiMessage(options: {
  messages: { role: 'user' | 'assistant'; content: string }[];
  pageContext?: EmiPageContext;
}): Promise<{ reply: string; picks: EmiCatalogPick[]; mode?: string }> {
  const response = await fetch(EMI_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string' ? data.error : `Emi request failed (${response.status})`,
    );
  }

  return {
    reply: data.reply || 'Sorry, I could not respond right now.',
    picks: Array.isArray(data.picks) ? data.picks : [],
    mode: data.mode,
  };
}
