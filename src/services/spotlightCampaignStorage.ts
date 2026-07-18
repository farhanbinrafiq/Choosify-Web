import type { UniversalMedia } from '../components/media/types/mediaModel';
import type {
  SpotlightCampaignFolder,
  SpotlightCampaignRecord,
  SpotlightCampaignWizardDraft,
} from '../types/spotlight/cms';

const CAMPAIGNS_KEY = 'choosify_spotlight_campaigns';
const MEDIA_KEY = 'choosify_spotlight_media';
const FOLDERS_KEY = 'choosify_spotlight_folders';
const WIZARD_KEY = 'choosify_spotlight_wizard_draft';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function listCampaignRecords(): SpotlightCampaignRecord[] {
  return readJson<SpotlightCampaignRecord[]>(CAMPAIGNS_KEY, []);
}

export function saveCampaignRecords(campaigns: SpotlightCampaignRecord[]) {
  writeJson(CAMPAIGNS_KEY, campaigns);
}

export function getCampaignById(campaignId: string): SpotlightCampaignRecord | undefined {
  return listCampaignRecords().find((c) => c.campaignId === campaignId);
}

export function upsertCampaign(record: SpotlightCampaignRecord): SpotlightCampaignRecord {
  const campaigns = listCampaignRecords();
  const idx = campaigns.findIndex((c) => c.campaignId === record.campaignId);
  const next = { ...record, updatedAt: new Date().toISOString() };
  if (idx === -1) campaigns.push(next);
  else campaigns[idx] = next;
  saveCampaignRecords(campaigns);
  return next;
}

export function deleteCampaign(campaignId: string) {
  saveCampaignRecords(listCampaignRecords().filter((c) => c.campaignId !== campaignId));
}

export function listMediaAssets(): UniversalMedia[] {
  return readJson<UniversalMedia[]>(MEDIA_KEY, []);
}

export function upsertMediaAsset(media: UniversalMedia): UniversalMedia {
  const items = listMediaAssets();
  const idx = items.findIndex((m) => m.mediaId === media.mediaId);
  const next = { ...media, updatedAt: new Date().toISOString() };
  if (idx === -1) items.push(next);
  else items[idx] = next;
  writeJson(MEDIA_KEY, items);
  return next;
}

export function getMediaById(mediaId: string): UniversalMedia | undefined {
  return listMediaAssets().find((m) => m.mediaId === mediaId);
}

export function listCustomFolders(): SpotlightCampaignFolder[] {
  return readJson<SpotlightCampaignFolder[]>(FOLDERS_KEY, []);
}

export function upsertFolder(folder: SpotlightCampaignFolder) {
  const folders = listCustomFolders();
  const idx = folders.findIndex((f) => f.folderId === folder.folderId);
  if (idx === -1) folders.push(folder);
  else folders[idx] = folder;
  writeJson(FOLDERS_KEY, folders);
}

export function saveWizardDraft(draft: SpotlightCampaignWizardDraft) {
  writeJson(WIZARD_KEY, draft);
}

export function loadWizardDraft(): SpotlightCampaignWizardDraft | null {
  return readJson<SpotlightCampaignWizardDraft | null>(WIZARD_KEY, null);
}

export function clearWizardDraft() {
  localStorage.removeItem(WIZARD_KEY);
}

export function slugifyCampaignName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateCampaignId(): string {
  return `camp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateMediaId(): string {
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
