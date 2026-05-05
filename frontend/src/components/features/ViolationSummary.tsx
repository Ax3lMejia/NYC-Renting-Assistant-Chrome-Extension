import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';

interface ViolationSummaryProps {
  violations: number | null;
  dobViolations: number | null;
  ecbViolations: number | null;
  openEcbViolations: number | null;
  isLoading: boolean;
}

export const ViolationSummary: React.FC<ViolationSummaryProps> = ({
  violations,
  dobViolations,
  ecbViolations,
  openEcbViolations,
  isLoading,
}) => {
  const total = (violations ?? 0) + (dobViolations ?? 0) + (ecbViolations ?? 0);
  const isHigh = total > 15;
  const isMedium = total > 5;

  const summary = violations !== null ? (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${
      isHigh
        ? 'text-red-600 bg-red-50 border-red-200'
        : isMedium
          ? 'text-amber-600 bg-amber-50 border-amber-200'
          : 'text-green-600 bg-green-50 border-green-200'
    }`}>
      {total} total
    </span>
  ) : undefined;

  return (
    <SectionCard
      icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
      title="Violations"
      summary={summary}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-3 gap-2 text-center mb-2">
        <div className="bg-primary-50 rounded-lg py-2">
          <div className={`text-base font-bold font-serif ${violations && violations > 10 ? 'text-red-600' : 'text-primary-950'}`}>
            {violations ?? '—'}
          </div>
          <div className="text-[10px] text-primary-400 mt-0.5">HPD</div>
        </div>
        <div className="bg-primary-50 rounded-lg py-2">
          <div className={`text-base font-bold font-serif ${dobViolations && dobViolations > 5 ? 'text-red-600' : 'text-primary-950'}`}>
            {dobViolations ?? '—'}
          </div>
          <div className="text-[10px] text-primary-400 mt-0.5">DOB</div>
        </div>
        <div className="bg-primary-50 rounded-lg py-2">
          <div className={`text-base font-bold font-serif ${ecbViolations && ecbViolations > 5 ? 'text-red-600' : 'text-primary-950'}`}>
            {ecbViolations ?? '—'}
          </div>
          <div className="text-[10px] text-primary-400 mt-0.5">ECB</div>
        </div>
      </div>

      {(openEcbViolations ?? 0) > 0 && (
        <div className="flex gap-1.5">
          <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-md font-medium">
            {openEcbViolations} ECB open
          </span>
        </div>
      )}

      <p className="text-[10px] text-primary-400 mt-2 leading-relaxed">
        HPD: maintenance · DOB: structural/safety · ECB: penalty fines
      </p>
    </SectionCard>
  );
};
