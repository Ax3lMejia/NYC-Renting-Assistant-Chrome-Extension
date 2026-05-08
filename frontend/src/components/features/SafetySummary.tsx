import React from 'react';
import { Shield } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';
import { CrimeData } from '../../types/api';
import { calculateSafetyScore, SafetyGrade } from '../../utils/neighborhoodSafety';

interface SafetySummaryProps {
  crimeData: CrimeData | null;
  isLoading: boolean;
}

const GRADE_COLORS: Record<SafetyGrade, { bar: string; text: string; badge: string }> = {
  A: { bar: 'bg-green-500', text: 'text-green-700', badge: 'text-green-600 bg-green-50 border-green-200' },
  B: { bar: 'bg-teal-500', text: 'text-teal-700', badge: 'text-teal-600 bg-teal-50 border-teal-200' },
  C: { bar: 'bg-amber-400', text: 'text-amber-700', badge: 'text-amber-600 bg-amber-50 border-amber-200' },
  D: { bar: 'bg-orange-500', text: 'text-orange-700', badge: 'text-orange-600 bg-orange-50 border-orange-200' },
  F: { bar: 'bg-red-500', text: 'text-red-700', badge: 'text-red-600 bg-red-50 border-red-200' },
};

export const SafetySummary: React.FC<SafetySummaryProps> = ({
  crimeData,
  isLoading,
}) => {
  const isEmpty = crimeData === null;
  const result = crimeData ? calculateSafetyScore(crimeData) : null;
  const colors = result ? GRADE_COLORS[result.grade] : null;

  const summary = result ? (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${colors!.badge}`}>
      {result.grade} · {result.label}
    </span>
  ) : undefined;

  return (
    <SectionCard
      icon={<Shield className="h-4 w-4 text-primary-600" />}
      title="Neighborhood Safety"
      summary={summary}
      isLoading={isLoading}
    >
      {isEmpty ? (
        <EmptyState
          message="No crime data available"
          submessage="NYPD data unavailable or coordinates could not be resolved"
        />
      ) : (
        <>
          {/* Score bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold font-serif tabular-nums ${colors!.text}`}>
                {result?.score ?? 0}
              </span>
              <span className="text-[10px] text-primary-400">/ 100</span>
            </div>
            <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${colors!.bar}`}
                style={{ width: `${result?.score ?? 0}%` }}
              />
            </div>
          </div>

          {/* Crime breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className={`text-xl font-bold font-serif tabular-nums ${(crimeData?.felony ?? 0) > 20 ? 'text-red-600' : 'text-primary-950'}`}>
                {crimeData?.felony ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">Felonies</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className={`text-xl font-bold font-serif tabular-nums ${(crimeData?.misdemeanor ?? 0) > 80 ? 'text-amber-600' : 'text-primary-950'}`}>
                {crimeData?.misdemeanor ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">Misd.</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className="text-xl font-bold font-serif tabular-nums text-primary-950">
                {crimeData?.violation ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">Violations</div>
            </div>
          </div>

          <p className="text-xs text-primary-400 mt-2 leading-relaxed">
            NYPD YTD complaints within ~400m · Higher score = safer
          </p>
        </>
      )}
    </SectionCard>
  );
};
