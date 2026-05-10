import React from 'react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';

interface ViolationSummaryProps {
  violations: number | null;
  dobViolations: number | null;
  ecbViolations: number | null;
  openEcbViolations: number | null;
  isLoading: boolean;
}

export const ViolationSummary: React.FC<ViolationSummaryProps> = ({
  violations, dobViolations, ecbViolations, openEcbViolations, isLoading,
}) => {
  const total = (violations ?? 0) + (dobViolations ?? 0) + (ecbViolations ?? 0);
  const isHigh = total > 15;
  const isMedium = total > 5;
  const isEmpty = violations === null && dobViolations === null && ecbViolations === null;

  const severity: 'low' | 'med' | 'high' = isHigh ? 'high' : isMedium ? 'med' : 'low';
  const headline = isEmpty
    ? 'No violation records found'
    : total === 0
    ? '0 open violations'
    : `${total} total violation${total === 1 ? '' : 's'}`;

  return (
    <SectionCard
      emoji="📋"
      subjectName="Compliance"
      headline={headline}
      severity={severity}
      isLoading={isLoading}
    >
      {isEmpty ? (
        <EmptyState
          message="No violation records found"
          submessage="HPD, DOB, and ECB returned no violations for this address"
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className={`text-xl font-bold font-serif tabular-nums ${violations && violations > 10 ? 'text-red-600' : 'text-primary-950'}`}>
                {violations ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">HPD</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className={`text-xl font-bold font-serif tabular-nums ${dobViolations && dobViolations > 5 ? 'text-red-600' : 'text-primary-950'}`}>
                {dobViolations ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">DOB</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className={`text-xl font-bold font-serif tabular-nums ${ecbViolations && ecbViolations > 5 ? 'text-red-600' : 'text-primary-950'}`}>
                {ecbViolations ?? '—'}
              </div>
              <div className="text-xs text-primary-400 mt-0.5">ECB</div>
            </div>
          </div>

          {(openEcbViolations ?? 0) > 0 && (
            <div className="flex gap-1.5">
              <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-md font-medium">
                {openEcbViolations} ECB open
              </span>
            </div>
          )}

          <p className="text-xs text-primary-400 mt-2 leading-relaxed">
            HPD: maintenance · DOB: structural/safety · ECB: penalty fines
          </p>
        </>
      )}
    </SectionCard>
  );
};
