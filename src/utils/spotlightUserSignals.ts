import type { SpotlightFollowRecord } from '../types/spotlight/discovery/follow';
import { SPOTLIGHT_FOLLOWS_KEY } from '../types/spotlight/discovery/follow';
import type { SpotlightSaveRecord } from '../types/spotlight/discovery/save';
import { SPOTLIGHT_SAVES_KEY } from '../types/spotlight/discovery/save';
import type { SpotlightHistoryEntry } from '../types/spotlight/discovery/history';
import { SPOTLIGHT_HISTORY_KEY, SPOTLIGHT_HISTORY_MAX } from '../types/spotlight/discovery/history';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function listFollows(): SpotlightFollowRecord[] {
  return readJson<SpotlightFollowRecord[]>(SPOTLIGHT_FOLLOWS_KEY, []);
}

export function toggleFollow(record: Omit<SpotlightFollowRecord, 'followedAt'>): boolean {
  const list = listFollows();
  const idx = list.findIndex((f) => f.targetKind === record.targetKind && f.targetId === record.targetId);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeJson(SPOTLIGHT_FOLLOWS_KEY, list);
    return false;
  }
  list.push({ ...record, followedAt: new Date().toISOString() });
  writeJson(SPOTLIGHT_FOLLOWS_KEY, list);
  return true;
}

export function isFollowing(targetKind: SpotlightFollowRecord['targetKind'], targetId: string): boolean {
  return listFollows().some((f) => f.targetKind === targetKind && f.targetId === targetId);
}

export function listSaves(): SpotlightSaveRecord[] {
  return readJson<SpotlightSaveRecord[]>(SPOTLIGHT_SAVES_KEY, []);
}

export function toggleSave(record: Omit<SpotlightSaveRecord, 'savedAt'>): boolean {
  const list = listSaves();
  const idx = list.findIndex((s) => s.targetKind === record.targetKind && s.targetId === record.targetId);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeJson(SPOTLIGHT_SAVES_KEY, list);
    return false;
  }
  list.push({ ...record, savedAt: new Date().toISOString() });
  writeJson(SPOTLIGHT_SAVES_KEY, list);
  return true;
}

export function listHistory(): SpotlightHistoryEntry[] {
  return readJson<SpotlightHistoryEntry[]>(SPOTLIGHT_HISTORY_KEY, []);
}

export function pushHistory(entry: Omit<SpotlightHistoryEntry, 'lastSeenAt'>): void {
  const list = listHistory().filter((h) => h.contentId !== entry.contentId);
  list.unshift({ ...entry, lastSeenAt: new Date().toISOString() });
  writeJson(SPOTLIGHT_HISTORY_KEY, list.slice(0, SPOTLIGHT_HISTORY_MAX));
}

export function getContinueWatching(): SpotlightHistoryEntry[] {
  return listHistory().filter((h) => h.kind === 'watch' && (h.progress ?? 0) < 1);
}

export function getContinueReading(): SpotlightHistoryEntry[] {
  return listHistory().filter((h) => h.kind === 'read' && (h.progress ?? 0) < 1);
}

export function getRecentlyViewed(limit = 12): SpotlightHistoryEntry[] {
  return listHistory().filter((h) => h.kind === 'view').slice(0, limit);
}

export function getRecentlySaved(): SpotlightSaveRecord[] {
  return listSaves().slice(0, 12);
}
