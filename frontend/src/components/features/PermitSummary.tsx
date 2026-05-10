import React from 'react';
import { SectionCard } from '../ui/SectionCard';

interface PermitSummaryProps {
  permits: number | null;
  activePermits: number | null;
  isLoading: boolean;
}

export const PermitSummary: React.FC<PermitSummaryProps> = ({
  permits,
  activePermits,
  isLoading,
}) => {
  const hasActive = (activePermits ?? 0) > 0;
  const severity: 'low' | 'med' | 'high' = hasActive ? 'med' : 'low';
  const headline = permits === null
    ? 'No permit records found'
    : permits === 0
    ? '0 permits on file'
    : `${permits} permit${permits === 1 ? '' : 's'} on file`;

  return (
    <SectionCard
      emoji="🏗"
      subjectName="Permits"
      headline={headline}
      severity={severity}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-primary-50/70 rounded-lg py-2.5">
          <div className="text-xl font-bold font-serif text-primary-950 tabular-nums">{permits ?? '—'}</div>
          <div className="text-xs text-primary-400 mt-0.5">Total on file</div>
        </div>
        <div className="bg-primary-50/70 rounded-lg py-2.5">
          <div className={`text-xl font-bold font-serif tabular-nums ${hasActive ? 'text-amber-600' : 'text-green-600'}`}>
            {activePermits ?? '—'}
          </div>
          <div className="text-xs text-primary-400 mt-0.5">Active / issued</div>
        </div>
      </div>

      {hasActive && (
        <p className="text-xs text-amber-600 mt-2 leading-relaxed">
          Active permits indicate ongoing construction or renovation.
        </p>
      )}
    </SectionCard>
  );
};
