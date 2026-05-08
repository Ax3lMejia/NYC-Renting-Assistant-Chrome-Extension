import { CrimeData } from '../types/api';

export type SafetyGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface SafetyResult {
  score: number;
  grade: SafetyGrade;
  label: string;
}

// Weights: felony=3, misdemeanor=1, violation=0.3
// Score = max(0, 100 - round(weighted * 0.1))
// Calibrated for 400m radius YTD NYPD data.
// Scalar 0.1 may need tuning once real data is observed.
export function calculateSafetyScore(crime: CrimeData): SafetyResult {
  const weighted = crime.felony * 3 + crime.misdemeanor * 1 + crime.violation * 0.3;
  const score = Math.max(0, 100 - Math.round(weighted * 0.1));

  const grade: SafetyGrade =
    score >= 85 ? 'A' :
    score >= 70 ? 'B' :
    score >= 55 ? 'C' :
    score >= 40 ? 'D' : 'F';

  const label: Record<SafetyGrade, string> = {
    A: 'Very Safe', B: 'Safe', C: 'Moderate', D: 'Elevated Risk', F: 'High Risk',
  };

  return { score, grade, label: label[grade] };
}
