import { BuildingData, ApiError } from '../types/api';
import { RateLimiter } from './rateLimiter';

const GEOCLIENT_DOMAIN = 'api.nyc.gov';
const AUGRENTED_DOMAIN = 'augrented.com';

const ENDPOINTS = {
  geoclientAddress: 'https://api.nyc.gov/geoclient/v2/address',
  augrentedSearch: 'https://augrented.com/api/nyc/nyc/building/search',
};

export class ApiClient {
  // Parses a full address string into components for the Geoclient V2 address endpoint.
  // Input:  "441 63rd St APT 1R, Brooklyn, NY 11220"
  // Output: { houseNumber: "441", street: "63rd St", borough: "Brooklyn", zip: "11220" }
  private static parseAddressComponents(address: string): {
    houseNumber: string;
    street: string;
    zip?: string;
    borough?: string;
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

    // Zip is anywhere in the remaining parts
    let zip: string | undefined;
    let borough: string | undefined;

    for (let i = 1; i < parts.length; i++) {
      const zipMatch = parts[i].match(/\b(\d{5})\b/);
      if (zipMatch) {
        zip = zipMatch[1];
      } else if (!borough) {
        // first non-zip part after the street is the borough/city
        borough = parts[i].replace(/\b[A-Z]{2}\b/i, '').trim();
      }
    }

    if (import.meta.env.DEV) {
      console.log('[Geoclient parse]', { houseNumber, street, borough, zip });
    }

    return { houseNumber, street, borough, zip };
  }

  // Resolves a street address to a NYC BBL and BIN using the NYC Geoclient V2 API.
  private static async geocodeAddress(address: string): Promise<{ bbl: string; bin: string } | null> {
    const components = this.parseAddressComponents(address);
    if (!components) return null;

    const apiKey = import.meta.env.VITE_NYC_OPENDATA_API_KEY;

    const params = new URLSearchParams({
      houseNumber: components.houseNumber,
      street: components.street,
      ...(components.zip && { zip: components.zip }),
      ...(components.borough && !components.zip && { borough: components.borough }),
    });

    const url = `${ENDPOINTS.geoclientAddress}?${params}`;

    try {
      const data = await RateLimiter.enqueue(GEOCLIENT_DOMAIN, () =>
        this.fetchJson(url, apiKey ? { 'Ocp-Apim-Subscription-Key': apiKey } : {})
      );
      const bbl = data?.address?.bbl;
      const bin = data?.address?.buildingIdentificationNumber ?? data?.address?.bin;
      if (!bbl) return null;
      return { bbl: String(bbl), bin: bin ? String(bin) : String(bbl) };
    } catch {
      return null;
    }
  }

  static async fetchBuildingData(address: string): Promise<{ data: BuildingData; errors: ApiError[] }> {
    const errors: ApiError[] = [];

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

    const geocoded = await this.geocodeAddress(address);
    if (!geocoded) {
      errors.push({ source: 'Geoclient', message: 'Could not resolve address to a NYC building (BBL not found).' });
      return { data: result, errors };
    }

    result.bbl = geocoded.bbl;

    const params = new URLSearchParams({
      bbl: geocoded.bbl,
      bin: geocoded.bin,
      include_housing_complaints: 'true',
      include_housing_violations: 'true',
      include_dob_violations: 'true',
      include_bedbug_reports: 'true',
      include_rodent_inspections: 'true',
      limit_per_category: '100',
    });

    try {
      const data = await RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedSearch}?${params}`)
      );

      if (Array.isArray(data.housing_complaints)) {
        const count = data.housing_complaints.length;
        result.complaints = count;
        result.complaintSeverity = this.calculateSeverity(count);
      }

      if (Array.isArray(data.housing_violations)) {
        result.violations = data.housing_violations.length;
      }

      if (Array.isArray(data.dob_violations)) {
        result.dobViolations = data.dob_violations.length;
      }

      if (Array.isArray(data.bedbug_reports)) {
        result.bedbugReports = data.bedbug_reports.length;
      }

      if (Array.isArray(data.rodent_inspections)) {
        result.rodentInspections = data.rodent_inspections.length;
        result.rodentFailures = data.rodent_inspections.filter(
          (r: any) => typeof r.result === 'string' && r.result.toUpperCase().includes('FAIL')
        ).length;
      }

    } catch (err: any) {
      errors.push({ source: 'Augrented API', message: err.message || 'Failed to fetch building data.' });
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
