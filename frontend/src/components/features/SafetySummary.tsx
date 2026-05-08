import React from 'react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';
import { CrimeData } from '../../types/api';
import { calculateSafetyScore } from '../../utils/neighborhoodSafety';

interface SafetySummaryProps {
  crimeData: CrimeData | null;
  isLoading: boolean;
}

export const SafetySummary: React.FC<SafetySummaryProps> = ({
  crimeData,
  isLoading,
}) => {
  const isEmpty = crimeData === null;
  const result = crimeData ? calculateSafetyScore(crimeData) : null;

  const safetySeverity: 'low' | 'med' | 'high' =
    !result ? 'low'
    : result.grade === 'A' || result.grade === 'B' ? 'low'
    : result.grade === 'C' ? 'med'
    : 'high';

  const safetyHeadline = isEmpty
    ? 'No crime data available'
    : `Safety score ${result?.score ?? 0} / 100`;

  return (
    <SectionCard
      emoji="🛡"
      subjectName="Safety"
      headline={safetyHeadline}
      severity={safetySeverity}
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
              <span className={`text-2xl font-bold font-serif tabular-nums ${
                safetySeverity === 'low' ? 'text-green-700' : safetySeverity === 'med' ? 'text-amber-700' : 'text-red-700'
              }`}>
                {result?.score ?? 0}
              </span>
              <span className="text-[10px] text-primary-400">/ 100</span>
            </div>
            <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${
                  safetySeverity === 'low' ? 'bg-green-500' : safetySeverity === 'med' ? 'bg-amber-400' : 'bg-red-500'
                }`}
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
