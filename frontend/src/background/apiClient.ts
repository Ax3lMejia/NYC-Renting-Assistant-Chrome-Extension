import { BuildingData, ApiError } from '../types/api';
import { RateLimiter } from './rateLimiter';

const NYC_OPEN_DATA_DOMAIN = 'data.cityofnewyork.us';

// socrata APIs (SoQL) endpoints
const ENDPOINTS = {
  hpdViolations: 'https://data.cityofnewyork.us/resource/wvxf-7kdb.json',
};

export class ApiClient {
  // cleans the address to try to match NYC Open Data format.
  // for example "123 Example St, Brooklyn, NY 11201" -> "123 EXAMPLE STREET"
  private static parseAddress(addressString: string): { houseNumber: string, streetName: string, zip?: string } | null {
    // very basic regex to pull the leading number and string before a comma or newline
    const match = addressString.match(/^(\d+(?:-\d+)?)\s+([^,]+)/i);
    if (!match) return null;

    let houseNumber = match[1];
    let streetName = match[2].toUpperCase().trim();

    // standardizes some common street abbreviations
    streetName = streetName.replace(/\bST\b/g, 'STREET')
      .replace(/\bAVE\b/g, 'AVENUE')
      .replace(/\bRD\b/g, 'ROAD')
      .replace(/\bPL\b/g, 'PLACE')
      .replace(/\bBLVD\b/g, 'BOULEVARD');

    return { houseNumber, streetName };
  }

  static async fetchBuildingData(address: string): Promise<{ data: BuildingData, errors: ApiError[] }> {
    const parsedAddress = this.parseAddress(address);
    const errors: ApiError[] = [];

    const result: BuildingData = {
      address,
      complaints: null,
      complaintSeverity: null,
      violations: null,
      rentEstimate: null, // placeholder for future rent comparison API
      lastUpdated: Date.now()
    };

    if (!parsedAddress) {
      errors.push({ source: 'Address Parser', message: 'Could not parse address format for API query.' });
      return { data: result, errors };
    }

    const { houseNumber, streetName } = parsedAddress;

    // SoQL queries
    // HPD Violations API query for open violations at this address
    const hpdQuery = `?housenumber=${encodeURIComponent(houseNumber)}&streetname=${encodeURIComponent(streetName)}&$where=violationstatus='Open'&$select=count(*)`;

    try {
      // handle requests asynchronously using Promise.allSettled
      // currently only fetching HPD Violations API, will research more relevant APIs later
      const [hpdRes] = await Promise.allSettled([
        RateLimiter.enqueue(NYC_OPEN_DATA_DOMAIN, () => this.fetchJson(`${ENDPOINTS.hpdViolations}${hpdQuery}`))
      ]);

      if (hpdRes.status === 'fulfilled') {
        result.violations = parseInt(hpdRes.value[0]?.count || '0', 10);
      } else {
        errors.push({ source: 'HPD Violations API', message: hpdRes.reason?.message || 'Failed to fetch HPD data' });
      }

    } catch (err: any) {
      errors.push({ source: 'API Client', message: err.message || 'Unknown network error' });
    }

    return { data: result, errors };
  }

  private static async fetchJson(url: string) {
    const response = await fetch(url, {
      // add app token if we have one to increase rate limits, but works without it for MVP
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  // calculate severity for when we add complaints back in the future
  private static calculateSeverity(complaints: number): 'low' | 'medium' | 'high' {
    if (complaints < 5) return 'low';
    if (complaints < 15) return 'medium';
    return 'high';
  }
}
