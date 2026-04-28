import { BuildingData, ApiError } from '../types/api';

const DEFAULT_BACKEND_URL = 'http://127.0.0.1:8787';
const BUILDING_INSIGHTS_PATH = '/api/building-insights';

type BackendSuccessResponse = {
  address: string;
  normalizedAddress: string;
  data: BuildingData;
  errors?: ApiError[];
};

export class ApiClient {
  static async fetchBuildingData(address: string): Promise<{ data: BuildingData; errors: ApiError[] }> {
    const response = await fetch(`${this.getBackendBaseUrl()}${BUILDING_INSIGHTS_PATH}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      const payload = await this.tryReadError(response);
      const error: ApiError = {
        source: 'Insights Backend',
        message: payload?.error || `Backend request failed with status ${response.status}.`,
      };

      return { data: this.createEmptyResult(address), errors: [error] };
    }

    const payload = await response.json() as BackendSuccessResponse;
    return {
      data: payload.data ?? this.createEmptyResult(address),
      errors: payload.errors ?? [],
    };
  }

  private static getBackendBaseUrl(): string {
    return (import.meta.env.VITE_BACKEND_BASE_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, '');
  }

  private static createEmptyResult(address: string): BuildingData {
    return {
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
  }

  private static async tryReadError(response: Response): Promise<{ error?: string } | null> {
    try {
      return await response.json() as { error?: string };
    } catch {
      return null;
    }
  }
}
