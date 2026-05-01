export function isApartmentsListingPage(): boolean {
  return window.location.hostname.includes('apartments.com');
}

export function getApartmentsAddress(): string | null {
  const selectors = [
    '[data-testid*="address"]',
    '[itemprop="streetAddress"]',
    'address',
    'main h1 + div',
    'main h1 + p',
    'main h1 + address',
    'h1[property="name"]',
    'h1[data-testid*="propertyName"]',
    'h1[data-testid*="address"]',
    '.propertyName',
    '.propertyAddress',
    '[class*="propertyAddress"]',
    '[class*="address"]',
  ];

  for (const selector of selectors) {
    const elements = Array.from(document.querySelectorAll(selector));

    for (const el of elements) {
      const text = el.textContent?.trim();
      if (!text) continue;

      const maybeAddress = extractAddressFromText(text);
      if (maybeAddress) return maybeAddress;
    }
  }

  const heading = document.querySelector('main h1');
  const headingContainerText = heading?.parentElement?.textContent?.trim();
  if (headingContainerText) {
    const maybeAddress = extractAddressFromText(headingContainerText);
    if (maybeAddress) return maybeAddress;
  }

  const metaTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  const metaContent = metaTitle?.content?.trim();
  if (metaContent) {
    const maybeAddress = extractAddressFromText(metaContent);
    if (maybeAddress) return maybeAddress;
  }

  const metaAddress = document.querySelector('meta[property="og:street-address"]') as HTMLMetaElement | null;
  const streetAddress = metaAddress?.content?.trim();
  if (streetAddress) {
    return cleanAddress(streetAddress);
  }

  const allTextCandidates = Array.from(document.querySelectorAll('main div, main p, main span'))
    .map(el => el.textContent?.trim())
    .filter((text): text is string => Boolean(text) && text.length <= 120);

  for (const text of allTextCandidates) {
    const maybeAddress = extractAddressFromText(text);
    if (maybeAddress) return maybeAddress;
  }

  const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of jsonLdScripts) {
    const text = script.textContent?.trim();
    if (!text) continue;

    const maybeAddress = extractAddressFromJsonLd(text);
    if (maybeAddress) return maybeAddress;
  }

  return null;
}

function extractAddressFromJsonLd(text: string): string | null {
  try {
    const parsed = JSON.parse(text);
    const nodes = flattenJsonNodes(parsed);

    for (const node of nodes) {
      const addressNode = node?.address;
      if (addressNode?.streetAddress && typeof addressNode.streetAddress === 'string') {
        return cleanAddress(addressNode.streetAddress);
      }
    }
  } catch {
    return extractAddressFromText(text);
  }

  return extractAddressFromText(text);
}

function flattenJsonNodes(input: unknown): Array<Record<string, any>> {
  if (!input || typeof input !== 'object') return [];

  const list = Array.isArray(input) ? input : [input];
  const results: Array<Record<string, any>> = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;

    results.push(item as Record<string, any>);

    const graph = (item as Record<string, any>)['@graph'];
    if (Array.isArray(graph)) {
      results.push(...flattenJsonNodes(graph));
    }
  }

  return results;
}

function extractAddressFromText(text: string): string | null {
  const cleaned = cleanAddress(text);

  const fullMatch = cleaned.match(
    /\d+(?:-\d+)?\s+[^,\|\n#]+?(?:Street|Avenue|Boulevard|Road|Place|Drive|Lane|Way|Court|Terrace|Parkway|Blvd|Ave|St|Rd|Pl|Dr|Ln|Ct|Ter|Pkwy)\b(?:,\s*[^,\n]+,\s*[A-Z]{2}\s*\d{5})?/i
  );
  if (fullMatch) {
    return cleanAddress(fullMatch[0]);
  }

  const match = cleaned.match(
    /\d+(?:-\d+)?\s+[^,\|\n#]+?(?:Street|Avenue|Boulevard|Road|Place|Drive|Lane|Way|Court|Terrace|Parkway|Blvd|Ave|St|Rd|Pl|Dr|Ln|Ct|Ter|Pkwy)\b/i
  );

  return match ? cleanAddress(match[0]) : null;
}

function cleanAddress(raw: string): string {
  return raw
    .replace(/\s*[|\-–—]\s*(Apartments\.com|Zillow|StreetEasy|Trulia).*$/i, '')
    .replace(/\s+#\w+\b.*$/i, '')
    .replace(/\s+(?:apt|apartment|unit|suite|ste|fl|floor)\s+[a-z0-9-]+\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}
