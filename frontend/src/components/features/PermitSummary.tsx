import React from 'react';
import { HardHat } from 'lucide-react';
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
  const summary = permits !== null ? (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${
      (activePermits ?? 0) > 0
        ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-green-600 bg-green-50 border-green-200'
    }`}>
      {activePermits ?? 0} active
    </span>
  ) : undefined;

  return (
    <SectionCard
      icon={<HardHat className="h-4 w-4 text-sky-500" />}
      title="Permits"
      summary={summary}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-primary-50/70 rounded-lg py-2.5">
          <div className="text-xl font-bold font-serif text-primary-950 tabular-nums">{permits ?? '—'}</div>
          <div className="text-xs text-primary-400 mt-0.5">Total on file</div>
        </div>
        <div className="bg-primary-50/70 rounded-lg py-2.5">
          <div className={`text-xl font-bold font-serif tabular-nums ${(activePermits ?? 0) > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {activePermits ?? '—'}
          </div>
          <div className="text-xs text-primary-400 mt-0.5">Active / issued</div>
        </div>
      </div>

      {(activePermits ?? 0) > 0 && (
        <p className="text-xs text-amber-600 mt-2 leading-relaxed">
          Active permits indicate ongoing construction or renovation.
        </p>
      )}
    </SectionCard>
  );
};
