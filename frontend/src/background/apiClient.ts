import { BuildingData, BedbugReport, ApiError } from '../types/api';
import { RateLimiter } from './rateLimiter';

const GEOCLIENT_DOMAIN = 'api.nyc.gov';
const AUGRENTED_DOMAIN = 'augrented.com';

const ENDPOINTS = {
  geoclientAddress: 'https://api.nyc.gov/geoclient/v2/address',
  augrentedSearch: 'https://augrented.com/api/nyc/nyc/building/search',
  augrentedBedbug: 'https://augrented.com/api/nyc/nyc/building/bedbug-reports',
  augrentedDobComplaints: 'https://augrented.com/api/nyc/nyc/building/dob-complaints',
  augrentedEcbViolations: 'https://augrented.com/api/nyc/nyc/building/ecb-violations',
  augrentedPermits: 'https://augrented.com/api/nyc/nyc/building/permits',
  augrentedServiceRequests: 'https://augrented.com/api/nyc/nyc/building/service-requests',
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

    // split on commas: ["441 63rd St", "Brooklyn", "NY 11220"]
    const parts = stripped.split(',').map(p => p.trim()).filter(Boolean);

    // first part must be "houseNumber street"
    const streetMatch = parts[0]?.match(/^(\d+(?:-\d+)?)\s+(.+)/);
    if (!streetMatch) return null;

    const houseNumber = streetMatch[1].trim();
    const street = streetMatch[2].trim();

    // zip is anywhere in the remaining parts
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
      dobComplaints: null,
      openDobComplaints: null,
      serviceRequests: null,
      openServiceRequests: null,
      violations: null,
      dobViolations: null,
      ecbViolations: null,
      openEcbViolations: null,
      permits: null,
      activePermits: null,
      bedbugReports: null,
      bedbugDetails: null,
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

    const { bbl, bin } = geocoded;

    const searchParams = new URLSearchParams({
      bbl, bin,
      include_housing_complaints: 'true',
      include_housing_violations: 'true',
      include_dob_violations: 'true',
      include_rodent_inspections: 'true',
      limit_per_category: '100',
    });

    const [
      searchResult,
      bedbugResult,
      dobComplaintsResult,
      ecbResult,
      permitsResult,
      serviceRequestsResult,
    ] = await Promise.allSettled([
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedSearch}?${searchParams}`)
      ),
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedBedbug}?${new URLSearchParams({ bbl, limit: '50' })}`)
      ),
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedDobComplaints}?${new URLSearchParams({ bin, limit: '100', status: 'ALL' })}`)
      ),
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedEcbViolations}?${new URLSearchParams({ bbl, limit: '100', status: 'ALL' })}`)
      ),
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedPermits}?${new URLSearchParams({ bin, limit: '50' })}`)
      ),
      RateLimiter.enqueue(AUGRENTED_DOMAIN, () =>
        this.fetchJson(`${ENDPOINTS.augrentedServiceRequests}?${new URLSearchParams({ bbl, limit: '100', status: 'ALL' })}`)
      ),
    ]);

    // Search (housing complaints, HPD violations, DOB violations, rodent inspections)
    if (searchResult.status === 'fulfilled') {
      const data = searchResult.value;

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
      if (Array.isArray(data.rodent_inspections)) {
        result.rodentInspections = data.rodent_inspections.length;
        result.rodentFailures = data.rodent_inspections.filter(
          (r: any) => typeof r.result === 'string' && r.result.toUpperCase().includes('FAIL')
        ).length;
      }
    } else {
      errors.push({ source: 'Augrented', message: searchResult.reason?.message || 'Failed to fetch building data.' });
    }

    // Bedbug reports
    if (bedbugResult.status === 'fulfilled') {
      const records = this.toArray(bedbugResult.value);
      result.bedbugReports = records.length;
      result.bedbugDetails = this.parseBedbugReports(records);
    } else {
      errors.push({ source: 'Bedbug Reports', message: bedbugResult.reason?.message || 'Failed to fetch bedbug data.' });
    }

    // DOB complaints
    if (dobComplaintsResult.status === 'fulfilled') {
      const records = this.toArray(dobComplaintsResult.value);
      result.dobComplaints = records.length;
      result.openDobComplaints = records.filter(
        (r: any) => this.isOpen(r.status ?? r.complaint_status ?? '')
      ).length;
    } else {
      errors.push({ source: 'DOB Complaints', message: dobComplaintsResult.reason?.message || 'Failed to fetch DOB complaints.' });
    }

    // ECB violations
    if (ecbResult.status === 'fulfilled') {
      const records = this.toArray(ecbResult.value);
      result.ecbViolations = records.length;
      result.openEcbViolations = records.filter(
        (r: any) => !this.isResolved(r.ecb_violation_status ?? r.status ?? '')
      ).length;
    } else {
      errors.push({ source: 'ECB Violations', message: ecbResult.reason?.message || 'Failed to fetch ECB violations.' });
    }

    // Permits
    if (permitsResult.status === 'fulfilled') {
      const records = this.toArray(permitsResult.value);
      result.permits = records.length;
      result.activePermits = records.filter(
        (r: any) => this.isActivePermit(r.permit_status ?? r.status ?? '')
      ).length;
    } else {
      errors.push({ source: 'Permits', message: permitsResult.reason?.message || 'Failed to fetch permits.' });
    }

    // Service requests
    if (serviceRequestsResult.status === 'fulfilled') {
      const records = this.toArray(serviceRequestsResult.value);
      result.serviceRequests = records.length;
      result.openServiceRequests = records.filter(
        (r: any) => this.isOpen(r.status ?? r.resolution_action_updated_date == null ? 'open' : 'closed')
      ).length;
    } else {
      errors.push({ source: 'Service Requests', message: serviceRequestsResult.reason?.message || 'Failed to fetch service requests.' });
    }

    return { data: result, errors };
  }

  private static toArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.results)) return value.results;
    if (Array.isArray(value?.data)) return value.data;
    return [];
  }

  private static isOpen(status: string): boolean {
    const s = status.toUpperCase();
    return s.includes('OPEN') || s.includes('ACTIVE') || s.includes('PENDING') || s === 'A';
  }

  private static isResolved(status: string): boolean {
    const s = status.toUpperCase();
    return s.includes('RESOLVE') || s.includes('CLOSED') || s.includes('DISMISS');
  }

  private static isActivePermit(status: string): boolean {
    const s = status.toUpperCase();
    return s.includes('ISSUED') || s.includes('ACTIVE') || s.includes('RENEWAL');
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

  private static parseBedbugReports(records: any[]): BedbugReport[] {
    const byYear = new Map<number, { infested: number; eradicated: number }>();

    for (const r of records) {
      const rawDate: string = r.filing_date ?? r.filingdate ?? r.date ?? '';
      const year = rawDate ? new Date(rawDate).getFullYear() : NaN;
      if (isNaN(year)) continue;

      const infested = Number(r.infested_dwelling_unit_count ?? r.infested ?? 0);
      const eradicated = Number(r.eradicated_unit_count ?? r.eradicated ?? 0);

      const existing = byYear.get(year) ?? { infested: 0, eradicated: 0 };
      byYear.set(year, {
        infested: existing.infested + infested,
        eradicated: existing.eradicated + eradicated,
      });
    }

    return Array.from(byYear.entries())
      .map(([year, counts]) => ({ year, ...counts }))
      .sort((a, b) => b.year - a.year);
  }

  private static calculateSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count < 5) return 'low';
    if (count < 15) return 'medium';
    return 'high';
  }
}
