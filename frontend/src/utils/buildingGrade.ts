import { BuildingData } from '../types/api';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface GradeResult {
  grade: Grade;
  label: string;
  points: number;
}

export function calculateBuildingGrade(data: BuildingData | null): GradeResult | null {
  if (!data) return null;

  const hasAnyData =
    data.violations !== null || data.dobViolations !== null ||
    data.ecbViolations !== null || data.complaints !== null ||
    data.bedbugReports !== null;
  if (!hasAnyData) return null;

  let points = 0;

  // HPD Violations (maintenance)
  const v = data.violations ?? 0;
  if (v > 15) points += 3;
  else if (v > 8) points += 2;
  else if (v > 3) points += 1;

  // DOB Violations (structural/safety — more severe)
  const dob = data.dobViolations ?? 0;
  if (dob > 5) points += 3;
  else if (dob > 2) points += 2;
  else if (dob > 0) points += 1;

  // ECB Violations (penalty fines — most serious)
  const ecb = data.ecbViolations ?? 0;
  if (ecb > 5) points += 4;
  else if (ecb > 2) points += 3;
  else if (ecb > 0) points += 2;

  // Open ECB = unresolved legal violations
  const openEcb = data.openEcbViolations ?? 0;
  if (openEcb > 2) points += 5;
  else if (openEcb > 0) points += 3;

  // HPD Complaints
  const complaints = data.complaints ?? 0;
  if (complaints > 30) points += 2;
  else if (complaints > 15) points += 1;

  // DOB Complaints
  const dobC = data.dobComplaints ?? 0;
  if (dobC > 8) points += 2;
  else if (dobC > 4) points += 1;

  // Bedbug Reports
  const bugs = data.bedbugReports ?? 0;
  if (bugs > 3) points += 4;
  else if (bugs > 1) points += 3;
  else if (bugs > 0) points += 2;

  // Rodent Failure Rate
  if (data.rodentInspections && data.rodentInspections > 0) {
    const rate = (data.rodentFailures ?? 0) / data.rodentInspections;
    if (rate > 0.5) points += 3;
    else if (rate > 0.2) points += 2;
    else if (rate > 0) points += 1;
  }

  const grade: Grade =
    points <= 2 ? 'A' :
    points <= 6 ? 'B' :
    points <= 11 ? 'C' :
    points <= 16 ? 'D' : 'F';

  const label: Record<Grade, string> = {
    A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Failing',
  };

  return { grade, label: label[grade], points };
}
