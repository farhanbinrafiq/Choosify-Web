import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendEmiMessage, type EmiChatMessage } from '../services/emiApi';
import { searchEmiCatalog } from '../lib/emiCatalogSearch';
import { useGlobalState } from '../context/GlobalStateContext';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'choosify_emi_chat_v1';

const WELCOME: EmiChatMessage = {
  id: 'emi-welcome',
  role: 'assistant',
  content:
    "Hi, I'm **Emi** — your Choosify shopping guide. Ask me about products, brands, deals, or what to compare. I'll stick to real listings on Choosify.",
  createdAt: new Date().toISOString(),
};

function loadHistory(): EmiChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw) as EmiChatMessage[];
    return parsed.length ? parsed : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export function useEmiChat() {
  const location = useLocation();
  const { allProducts, allBrands, allDeals } = useGlobalState();
  const [messages, setMessages] = useState<EmiChatMessage[]>(loadHistory);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  const pageContext = useMemo(
    () => ({
      pathname: location.pathname,
      title: typeof document !== 'undefined' ? document.title : undefined,
    }),
    [location.pathname],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: EmiChatMessage = {
        id: `emi-u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setIsLoading(true);

      try {
        const localPicks = searchEmiCatalog(trimmed, {
          products: allProducts,
          brands: allBrands,
          deals: allDeals,
        });

        const { reply, picks } = await sendEmiMessage({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          pageContext,
        });

        const assistantMsg: EmiChatMessage = {
          id: `emi-a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          picks: picks.length ? picks : localPicks,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const localPicks = searchEmiCatalog(trimmed, {
          products: allProducts,
          brands: allBrands,
          deals: allDeals,
        });
        const fallback =
          localPicks.length > 0
            ? `I found a few matches on Choosify for "${trimmed}". Tap a card below — I'm having trouble reaching my AI brain right now.`
            : "I'm having trouble connecting right now. Try browsing [Products](/products) or [Deals](/deals), or ask again in a moment.";

        setMessages((prev) => [
          ...prev,
          {
            id: `emi-a-${Date.now()}`,
            role: 'assistant',
            content: fallback,
            picks: localPicks,
            createdAt: new Date().toISOString(),
          },
        ]);
        toast.error(err instanceof Error ? err.message : 'Emi is unavailable');
      } finally {
        setIsLoading(false);
      }
    },
    [allBrands, allDeals, allProducts, isLoading, messages, pageContext],
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
