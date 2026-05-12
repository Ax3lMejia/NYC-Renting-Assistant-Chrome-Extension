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

export interface Amenity {
  name: string;
  distanceMeters: number;
}

export interface AmenityData {
  grocery: { count: number; nearest: Amenity | null };
  parks:   { count: number; nearest: Amenity | null };
  laundry: { count: number; nearest: Amenity | null };
  subway:  { count: number; nearest: Amenity | null };
}

export interface BuildingData {
  address: string;
  bbl: string | null;
  complaints: number | null;
  complaintSeverity: 'low' | 'medium' | 'high' | null;
  dobComplaints: number | null;
  openDobComplaints: number | null;
  serviceRequests: number | null;
  openServiceRequests: number | null;
  violations: number | null;
  dobViolations: number | null;
  ecbViolations: number | null;
  openEcbViolations: number | null;
  bedbugReports: number | null;
  bedbugDetails: BedbugReport[] | null;
  rodentInspections: number | null;
  rodentFailures: number | null;
  rentEstimate: number | null;
  crimeData: CrimeData | null;
  safetyScore: number | null;
  amenities: AmenityData | null;
  lastUpdated: number;
}

export interface ApiError {
  source: string;
  message: string;
}

// --- Auth types ---

export interface User {
  id: string;
  email: string | null;
}

export interface AuthResponse {
  status: 'success' | 'error';
  user?: User | null;
  message?: string;
}

// --- Bookmark types ---

export interface Bookmark {
  id: string;
  user_id: string;
  address: string;
  listing_url: string;
  building_data: BuildingData | null;
  notes: string | null;
  listed_price: number | null;
  created_at: string;
}

export interface BookmarkResponse {
  status: 'success' | 'error';
  bookmarks?: Bookmark[];
  bookmark?: Bookmark;
  message?: string;
}

// --- Message union ---

export type ExtensionMessage =
  | { type: 'GET_BUILDING_DATA'; address: string; city?: string; zipcode?: string }
  | { type: 'GET_CURRENT_ADDRESS' }
  | { type: 'SIGN_IN_EMAIL'; email: string; password: string }
  | { type: 'SIGN_UP_EMAIL'; email: string; password: string }
  | { type: 'SIGN_IN_GOOGLE' }
  | { type: 'SIGN_OUT' }
  | { type: 'GET_AUTH_STATE' }
  | { type: 'RESET_PASSWORD'; email: string }
  | { type: 'DELETE_ACCOUNT' }
  | { type: 'ADD_BOOKMARK'; address: string; listingUrl: string; buildingData: BuildingData | null; notes?: string; listedPrice?: number | null }
  | { type: 'REMOVE_BOOKMARK'; bookmarkId: string }
  | { type: 'GET_BOOKMARKS' }
  | { type: 'UPDATE_BOOKMARK_NOTES'; bookmarkId: string; notes: string };

export interface ExtensionResponse {
  status: 'success' | 'partial' | 'error';
  data?: BuildingData;
  errors?: ApiError[];
}
