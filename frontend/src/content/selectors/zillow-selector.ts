import { parsePriceText } from '../../utils/priceParser';

export function isZillowListingPage(): boolean {
  return window.location.hostname.includes('zillow.com');
}

export function getZillowAddress(): string | null {
  const selectors = [
    '[data-test="bdp-building-address"]',
    '[class*="BuildingAddress"]',
    'h2[class*="BuildingAddress"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim();

    if (text && looksLikeAddress(text)) {
      return cleanAddress(text);
    }
  }

  const metaTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  const metaContent = metaTitle?.content?.trim();

  if (metaContent) {
    const maybeAddress = extractAddressFromText(metaContent);
    if (maybeAddress) return maybeAddress;
  }

  return null;
}

function looksLikeAddress(text: string): boolean {
  return /\d+/.test(text) && text.includes(',');
}

function extractAddressFromText(text: string): string | null {
  const cleaned = cleanAddress(text);
  return looksLikeAddress(cleaned) ? cleaned : null;
}

function cleanAddress(raw: string): string {
  return raw
    .replace(/\s*[|\-–—]\s*(Zillow|StreetEasy|Apartments\.com|Trulia).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getZillowPrice(): number | null {
  const selectors = [
    '[data-testid="price"]',
    'span[class*="Price"]',
    '[class*="price-container"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim();
    if (text) {
      const price = parsePriceText(text);
      if (price) return price;
    }
  }

  return null;
}