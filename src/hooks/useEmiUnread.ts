import { useCallback, useEffect, useState } from 'react';

const CHAT_STORAGE_KEY = 'choosify_emi_chat_v1';
const READ_AT_KEY = 'choosify_emi_read_at';

type StoredEmiMessage = {
  role: 'user' | 'assistant';
  createdAt?: string;
};

function getLatestAssistantTimestamp(): string | null {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return new Date().toISOString();
    const parsed = JSON.parse(raw) as StoredEmiMessage[];
    const assistants = parsed.filter((m) => m.role === 'assistant');
    const latest = assistants[assistants.length - 1];
    return latest?.createdAt ?? null;
  } catch {
    return new Date().toISOString();
  }
}

function computeUnread(): boolean {
  const latest = getLatestAssistantTimestamp();
  if (!latest) return false;
  const readAt = localStorage.getItem(READ_AT_KEY);
  if (!readAt) return true;
  return new Date(latest).getTime() > new Date(readAt).getTime();
}

export function markEmiMessagesRead() {
  localStorage.setItem(READ_AT_KEY, new Date().toISOString());
  window.dispatchEvent(new CustomEvent('choosify:emi-read'));
}

export function notifyEmiUnread() {
  window.dispatchEvent(new CustomEvent('choosify:emi-unread'));
}

/** True when Emi has an assistant message newer than the last time the user opened the chat. */
export function useEmiUnread() {
  const [hasUnread, setHasUnread] = useState(computeUnread);

  const refresh = useCallback(() => {
    setHasUnread(computeUnread());
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHAT_STORAGE_KEY || e.key === READ_AT_KEY) refresh();
    };
    const onRead = () => refresh();
    const onUnread = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('choosify:emi-read', onRead);
    window.addEventListener('choosify:emi-unread', onUnread);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('choosify:emi-read', onRead);
      window.removeEventListener('choosify:emi-unread', onUnread);
    };
  }, [refresh]);

  return { hasUnread, markRead: markEmiMessagesRead, refresh };
}
