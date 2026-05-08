export interface BedbugReport {
  year: number;
  infested: number;
  eradicated: number;
}

export interface CrimeData {
  felony: number;
  misdemeanor: number;
  violation: number;
}

export interface BuildingData {
  address: string;
  bbl: string | null;
  // HPD housing complaints
  complaints: number | null;
  complaintSeverity: 'low' | 'medium' | 'high' | null;
  // DOB complaints (311-style filed with Dept of Buildings)
  dobComplaints: number | null;
  openDobComplaints: number | null;
  // 311 service requests
  serviceRequests: number | null;
  openServiceRequests: number | null;
  // HPD maintenance code violations
  violations: number | null;
  // DOB structural/safety violations
  dobViolations: number | null;
  // ECB penalty violations
  ecbViolations: number | null;
  openEcbViolations: number | null;
  // Pest
  bedbugReports: number | null;
  bedbugDetails: BedbugReport[] | null;
  rodentInspections: number | null;
  rodentFailures: number | null;
  rentEstimate: number | null;
  // Neighborhood safety
  crimeData: CrimeData | null;
  safetyScore: number | null;
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
