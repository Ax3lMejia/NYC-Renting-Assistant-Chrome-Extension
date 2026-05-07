export function isStreetEasyListingPage(): boolean {
    const path = window.location.pathname;
    return window.location.hostname.includes('streeteasy.com') &&
      (path.includes('/building/') ||
       path.includes('/for-rent/') ||
       path.includes('/rental/') ||
       path.includes('/sale/'));
  }
  
  function extractBoroughFromPath(): string | null {
    const path = window.location.pathname;
    const slug = path.match(/\/building\/([^\/]+)/)?.[1] ?? '';
    const boroughs: Record<string, string> = {
      brooklyn: 'Brooklyn',
      manhattan: 'Manhattan',
      queens: 'Queens',
      bronx: 'Bronx',
      'staten-island': 'Staten Island',
    };
    const key = Object.keys(boroughs).find(b => slug.includes(b));
    return key ? boroughs[key] : null;
  }

  export function getStreetEasyAddress(): string | null {
    const borough = extractBoroughFromPath();

    const selectors = [
      'h1[data-testid="address"]',
      '[data-testid="homeAddress"]',
      '[data-testid*="address"]',
      'h1',
      'h1.building-title',
      '[class*="BuildingInfo"] h1',
      '.details-title h1',
      '[class*="address"]',
      '.Breadcrumb li:last-child',
    ];
  
    const appendBorough = (addr: string) =>
      borough && !addr.toLowerCase().includes(borough.toLowerCase())
        ? `${addr}, ${borough}`
        : addr;

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const text = el?.textContent?.trim();
      if (text && looksLikeAddress(text)) {
        const addr = extractAddressFromText(text) ?? cleanAddress(text);
        if (import.meta.env.DEV) {
          console.log('[StreetEasy] selector:', selector, 'addr:', addr, 'borough:', borough);
        }
        return addr ? appendBorough(addr) : null;
      }
    }

    const metaTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const metaContent = metaTitle?.content?.trim();
    if (metaContent) {
      const maybeAddress = extractAddressFromText(metaContent);
      if (maybeAddress) return appendBorough(maybeAddress);
    }

    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of jsonLdScripts) {
      const text = script.textContent?.trim();
      if (!text) continue;

      const maybeAddress = extractAddressFromText(text);
      if (maybeAddress) return appendBorough(maybeAddress);
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