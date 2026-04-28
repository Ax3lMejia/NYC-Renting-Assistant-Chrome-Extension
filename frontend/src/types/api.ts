export interface BuildingData {
  address: string;
  bbl: string | null;
  complaints: number | null;
  complaintSeverity: 'low' | 'medium' | 'high' | null;
  violations: number | null;
  dobViolations: number | null;
  bedbugReports: number | null;
  rodentInspections: number | null;
  rodentFailures: number | null;
  rentEstimate: number | null;
  lastUpdated: number;
}

export interface ApiError {
  source: string;
  message: string;
}

export interface ExtensionMessage {
  type: 'GET_BUILDING_DATA';
  address: string;
  city?: string;
  zipcode?: string;
}

export interface ExtensionResponse {
  status: 'success' | 'partial' | 'error';
  data?: BuildingData;
  errors?: ApiError[];
}
