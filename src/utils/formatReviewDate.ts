function ordinal(day: number): string {
  const v = day % 100;
  if (v >= 11 && v <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** "Monday 14th. July 2025" — used for review posted / purchase dates. */
export function formatReviewDate(iso: string | undefined | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday} ${ordinal(date.getDate())}. ${month} ${date.getFullYear()}`;
}
