/**
 * Normalizes a user-inputted URL string.
 * If URL does not start with http:// or https://, prepends https://.
 * If empty or whitespace, returns empty string.
 */
export function normalizeUrl(url: string): string {
  if (!url || !url.trim()) {
    return '';
  }

  const trimmed = url.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
