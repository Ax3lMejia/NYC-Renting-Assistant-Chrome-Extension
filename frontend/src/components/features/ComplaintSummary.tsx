import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';

interface ComplaintSummaryProps {
  complaints: number | null;
  severity: 'low' | 'medium' | 'high' | null;
  dobComplaints: number | null;
  openDobComplaints: number | null;
  serviceRequests: number | null;
  openServiceRequests: number | null;
  isLoading: boolean;
  bbl: string | null;
  address: string | null;
}

function buildAugrentedUrl(bbl: string | null, address: string | null): string | null {
  if (!bbl || !address) return null;
  const slug = address
    .replace(/,?\s*(apt\.?|apartment|unit|#|ste\.?|suite|fl\.?|floor)\s*[^,]*/gi, '')
    .replace(/,?\s*NY\s*\d{5}.*/i, '')
    .replace(/[^a-z0-9\s-]/gi, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  return `https://augrented.com/nyc/${bbl}-${slug}`;
}

export const ComplaintSummary: React.FC<ComplaintSummaryProps> = ({
  complaints, severity, dobComplaints, openDobComplaints,
  serviceRequests, openServiceRequests, isLoading, bbl, address,
}) => {
  const augrentedUrl = buildAugrentedUrl(bbl, address);
  const isEmpty = complaints === null && dobComplaints === null && serviceRequests === null;

  // Map API 'medium' → SectionCard 'med'; default null → 'low'
  const cardSeverity: 'low' | 'med' | 'high' =
    severity === 'high' ? 'high' : severity === 'medium' ? 'med' : 'low';

  const total = (complaints ?? 0) + (dobComplaints ?? 0) + (serviceRequests ?? 0);
  const headline = isEmpty
    ? 'No complaint records found'
    : total === 0
    ? '0 complaints on record'
    : `${total} total complaint${total === 1 ? '' : 's'}`;

  return (
    <SectionCard
      emoji="🔔"
      subjectName="Quietude"
      headline={headline}
      severity={cardSeverity}
      isLoading={isLoading}
    >
      {isEmpty ? (
        <EmptyState
          message="No complaint records found"
          submessage="HPD, DOB, and 311 returned no data for this address"
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className="text-xl font-bold font-serif text-primary-950 tabular-nums">{complaints ?? '—'}</div>
              <div className="text-xs text-primary-400 mt-0.5">HPD</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className="text-xl font-bold font-serif text-primary-950 tabular-nums">{dobComplaints ?? '—'}</div>
              <div className="text-xs text-primary-400 mt-0.5">DOB</div>
            </div>
            <div className="bg-primary-50/70 rounded-lg py-2.5">
              <div className="text-xl font-bold font-serif text-primary-950 tabular-nums">{serviceRequests ?? '—'}</div>
              <div className="text-xs text-primary-400 mt-0.5">311</div>
            </div>
          </div>

          {((openDobComplaints ?? 0) > 0 || (openServiceRequests ?? 0) > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(openDobComplaints ?? 0) > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-medium">
                  {openDobComplaints} DOB open
                </span>
              )}
              {(openServiceRequests ?? 0) > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-medium">
                  {openServiceRequests} 311 open
                </span>
              )}
            </div>
          )}

          {augrentedUrl ? (
            <a
              href={augrentedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Augrented
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg border border-primary-100 bg-primary-50 text-primary-300 cursor-not-allowed"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Augrented
            </button>
          )}
        </>
      )}
    </SectionCard>
  );
};
