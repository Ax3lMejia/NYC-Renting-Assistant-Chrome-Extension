import { BuildingData, ApiError } from '../types/api';
import { RateLimiter } from './rateLimiter';

const NYC_OPEN_DATA_DOMAIN = 'data.cityofnewyork.us';

const ENDPOINTS = {
  hpdViolations: 'https://data.cityofnewyork.us/resource/wvxf-7kdb.json',
  complaints311: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json',
};

export class ApiClient {
  // Parses a full address string into the house number and street name expected by NYC Open Data.
  private static parseAddressComponents(address: string): {
    houseNumber: string;
    street: string;
  } | null {
    const stripped = address
      .replace(/,?\s*(apt\.?|apartment|unit|#|ste\.?|suite|fl\.?|floor)\s*[^,]*/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Split on commas: ["441 63rd St", "Brooklyn", "NY 11220"]
    const parts = stripped.split(',').map(p => p.trim()).filter(Boolean);

    // First part must be "houseNumber street"
    const streetMatch = parts[0]?.match(/^(\d+(?:-\d+)?)\s+(.+)/);
    if (!streetMatch) return null;

    const houseNumber = streetMatch[1].trim();
    const street = streetMatch[2].trim();

    if (import.meta.env.DEV) {
      console.log('[Address parse]', { houseNumber, street });
    }

    return { houseNumber, street };
  }

  private static async fetchCount(url: string): Promise<number> {
    const data = await RateLimiter.enqueue(NYC_OPEN_DATA_DOMAIN, () => this.fetchJson(url));
    const rawCount = Array.isArray(data) ? data[0]?.count : null;
    const count = Number(rawCount);

    if (!Number.isFinite(count)) {
      throw new Error('Unexpected count response from NYC Open Data.');
    }

    return count;
  }

  static async fetchBuildingData(address: string): Promise<{ data: BuildingData; errors: ApiError[] }> {
    const errors: ApiError[] = [];
    const components = this.parseAddressComponents(address);

    const result: BuildingData = {
      address,
      bbl: null,
      complaints: null,
      complaintSeverity: null,
      violations: null,
      dobViolations: null,
      bedbugReports: null,
      rodentInspections: null,
      rodentFailures: null,
      rentEstimate: null,
      lastUpdated: Date.now(),
    };

    if (!components) {
      errors.push({ source: 'Address Parser', message: 'Could not parse the address into house number and street name.' });
      return { data: result, errors };
    }

    const hpdParams = new URLSearchParams({
      housenumber: components.houseNumber,
      streetname: components.street,
      '$where': "violationstatus='Open'",
      '$select': 'count(*)',
    });

    const complaintsParams = new URLSearchParams({
      incident_address: `${components.houseNumber} ${components.street}`,
      '$select': 'count(*)',
    });

    const [violationsResult, complaintsResult] = await Promise.allSettled([
      this.fetchCount(`${ENDPOINTS.hpdViolations}?${hpdParams}`),
      this.fetchCount(`${ENDPOINTS.complaints311}?${complaintsParams}`),
    ]);

    if (violationsResult.status === 'fulfilled') {
      result.violations = violationsResult.value;
    } else {
      const reason = violationsResult.reason as Error;
      errors.push({ source: 'HPD Open Violations', message: reason.message || 'Failed to fetch HPD violations.' });
    }

    if (complaintsResult.status === 'fulfilled') {
      result.complaints = complaintsResult.value;
      result.complaintSeverity = this.calculateSeverity(complaintsResult.value);
    } else {
      const reason = complaintsResult.reason as Error;
      errors.push({ source: '311 Complaints', message: reason.message || 'Failed to fetch 311 complaints.' });
    }

    return { data: result, errors };
  }

  private static async fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', ...headers },
    });

    if (!response.ok) {
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  private static calculateSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count < 5) return 'low';
    if (count < 15) return 'medium';
    return 'high';
  }
}
