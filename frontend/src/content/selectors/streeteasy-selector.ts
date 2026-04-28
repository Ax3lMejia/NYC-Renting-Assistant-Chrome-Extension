export function isStreetEasyListingPage(): boolean {
  return window.location.hostname.includes('streeteasy.com') &&
    (window.location.pathname.includes('/building/') || 
     window.location.pathname.includes('/for-rent/'));
}

export function getStreetEasyAddress(): string | null {
  const selectors = [
    'h1',
    'h1.building-title',
    '[class*="BuildingInfo"] h1',
    '.details-title h1',
    'h1[data-testid="listing-title"]',
    '[data-testid*="address"]',
    '[class*="address"]',
    '.Breadcrumb li:last-child',
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

  const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of jsonLdScripts) {
    const text = script.textContent?.trim();
    if (!text) continue;

    const maybeAddress = extractAddressFromText(text);
    if (maybeAddress) return maybeAddress;
  }

  return null;
}

function looksLikeAddress(text: string): boolean {
  return /\d+/.test(text) && text.length < 100;
}

function extractAddressFromText(text: string): string | null {
  const match = text.match(
    /\d+(?:-\d+)?\s+[^,\|\n#]+?(?:Street|Avenue|Boulevard|Road|Place|Drive|Lane|Way|Court|Terrace|Parkway|Blvd|Ave|St|Rd|Pl|Dr|Ln|Ct|Ter|Pkwy)\b/i
  );
  return match ? cleanAddress(match[0]) : null;
}

function cleanAddress(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/\s+#\w+\b.*$/i, '')
    .replace(/\s+(?:apt|apartment|unit|suite|ste|fl|floor)\s+[a-z0-9-]+\b.*$/i, '')
    .trim();
}
