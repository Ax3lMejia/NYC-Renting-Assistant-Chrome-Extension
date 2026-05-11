export function parsePriceText(text: string): number | null {
  if (!text.includes('$')) return null;
  const cleaned = text
    .replace(/\/month\b.*/i, '')
    .replace(/\/mo\b.*/i, '')
    .replace(/[$,\s]/g, '')
    .trim();

  const num = parseInt(cleaned, 10);
  return isNaN(num) || num <= 0 ? null : num;
}
