/** Virtual, system-owned Inbox channel id — never persisted as a real conversation.
 *  Content is a live projection of the canonical notification store (see
 *  services/notificationApi.ts), not a duplicated/fabricated message history. */
export const NOTIFICATIONS_THREAD_ID = 'thread-notifications';
export const NOTIFICATIONS_THREAD_TITLE = 'Notifications';
export const NOTIFICATIONS_THREAD_AVATAR =
  'https://ui-avatars.com/api/?name=Choosify+Notifications&background=1A1A2E&color=fff&size=128&bold=true';
