import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../utils/cn';
import { BedbugReport } from '../../types/api';

interface PestSummaryProps {
  bedbugReports: number | null;
  bedbugDetails: BedbugReport[] | null;
  rodentInspections: number | null;
  rodentFailures: number | null;
  isLoading: boolean;
}

export const PestSummary: React.FC<PestSummaryProps> = ({
  bedbugReports,
  bedbugDetails,
  rodentInspections,
  rodentFailures,
  isLoading,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const rodentFailureRate =
    rodentInspections && rodentInspections > 0
      ? Math.round(((rodentFailures ?? 0) / rodentInspections) * 100)
      : 0;

  const hasBedbugDetails = bedbugDetails && bedbugDetails.length > 0;
  const hasBedbugs = (bedbugReports ?? 0) > 0;
  const hasRodentIssues = rodentFailureRate > 20;

  const isEmpty = bedbugReports === null && rodentInspections === null;

  const pestSeverity: 'low' | 'med' | 'high' =
    hasBedbugs && hasRodentIssues ? 'high'
    : hasBedbugs || hasRodentIssues ? 'med'
    : 'low';

  const pestHeadline = isEmpty
    ? 'No pest records found'
    : hasBedbugs
    ? `${bedbugReports} bedbug report${(bedbugReports ?? 0) === 1 ? '' : 's'} on file`
    : hasRodentIssues
    ? `Rodent fail rate: ${rodentFailureRate}%`
    : 'No bedbug filings on record';

  return (
    <SectionCard
      emoji="🐛"
      subjectName="Cleanliness"
      headline={pestHeadline}
      severity={pestSeverity}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-2 text-center mb-2">
        <div className={`rounded-lg py-2.5 ${hasBedbugs ? 'bg-red-50' : 'bg-primary-50/70'}`}>
          <div className={`text-xl font-bold font-serif tabular-nums ${hasBedbugs ? 'text-red-600' : 'text-green-600'}`}>
            {bedbugReports ?? '—'}
          </div>
          <div className="text-xs text-primary-400 mt-0.5">Bedbug reports</div>
        </div>
        <div className={`rounded-lg py-2.5 ${hasRodentIssues ? 'bg-amber-50' : 'bg-primary-50/70'}`}>
          <div className={`text-xl font-bold font-serif tabular-nums ${hasRodentIssues ? 'text-amber-600' : 'text-primary-950'}`}>
            {rodentInspections ? `${rodentFailures ?? 0}/${rodentInspections}` : '—'}
          </div>
          <div className="text-xs text-primary-400 mt-0.5">Rodent fails</div>
        </div>
      </div>

      {rodentInspections !== null && rodentInspections > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex-1 h-1.5 bg-primary-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                rodentFailureRate > 50 ? 'bg-red-500' :
                rodentFailureRate > 20 ? 'bg-amber-400' : 'bg-green-500'
              }`}
              style={{ width: `${rodentFailureRate}%` }}
            />
          </div>
          <span className="text-[10px] text-primary-400 tabular-nums shrink-0">
            {rodentFailureRate}% fail rate
          </span>
        </div>
      )}

      {hasBedbugDetails && (
        <div>
          <button
            onClick={() => setShowBreakdown(v => !v)}
            className="flex items-center gap-1 text-[10px] text-teal-600 hover:text-teal-800 transition-colors font-medium mb-1"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", showBreakdown && "rotate-180")} />
            {showBreakdown ? 'Hide' : 'Show'} year breakdown
          </button>

          {showBreakdown && (
            <div className="rounded-lg border border-primary-100 overflow-hidden">
              <table className="w-full text-[10px]">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="text-left px-2.5 py-1 font-semibold text-primary-500">Year</th>
                    <th className="text-right px-2.5 py-1 font-semibold text-primary-500">Infested</th>
                    <th className="text-right px-2.5 py-1 font-semibold text-primary-500">Eradicated</th>
                  </tr>
                </thead>
                <tbody>
                  {bedbugDetails!.map(row => (
                    <tr key={row.year} className="border-t border-primary-50">
                      <td className="px-2.5 py-1 text-primary-700 font-medium">{row.year}</td>
                      <td className="px-2.5 py-1 text-right text-rose-600 font-bold tabular-nums">{row.infested}</td>
                      <td className="px-2.5 py-1 text-right text-emerald-600 font-bold tabular-nums">{row.eradicated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {bedbugReports === null && rodentInspections === null && (
        <EmptyState
          message="No pest records found"
          submessage="This address has no bedbug or rodent inspection records on file"
        />
      )}
    </SectionCard>
  );
};
