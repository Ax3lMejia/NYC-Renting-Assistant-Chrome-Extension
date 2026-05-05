import React from 'react';
import { MessageSquareWarning, ExternalLink } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';

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

const severityColor = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  high: 'text-red-600 bg-red-50 border-red-200',
};

const severityLabel = { low: 'Low', medium: 'Moderate', high: 'High' };

export const ComplaintSummary: React.FC<ComplaintSummaryProps> = ({
  complaints,
  severity,
  dobComplaints,
  openDobComplaints,
  serviceRequests,
  openServiceRequests,
  isLoading,
  bbl,
  address,
}) => {
  const augrentedUrl = buildAugrentedUrl(bbl, address);

  const summary = severity ? (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${severityColor[severity]}`}>
      {severityLabel[severity]}
    </span>
  ) : complaints !== null ? (
    <span className="text-xs font-bold text-primary-600">{complaints}</span>
  ) : undefined;

  return (
    <SectionCard
      icon={<MessageSquareWarning className="h-4 w-4 text-amber-500" />}
      title="Complaints"
      summary={summary}
      isLoading={isLoading}
    >
      {/* 3-stat grid */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-primary-50 rounded-lg py-2">
          <div className="text-base font-bold font-serif text-primary-950">{complaints ?? '—'}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">HPD</div>
        </div>
        <div className="bg-primary-50 rounded-lg py-2">
          <div className="text-base font-bold font-serif text-primary-950">{dobComplaints ?? '—'}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">DOB</div>
        </div>
        <div className="bg-primary-50 rounded-lg py-2">
          <div className="text-base font-bold font-serif text-primary-950">{serviceRequests ?? '—'}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">311</div>
        </div>
      </div>

      {/* Open counts */}
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
          className="flex items-center justify-center gap-1.5 w-full text-[11px] font-medium h-7 px-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View on Augrented
        </a>
      ) : (
        <button
          disabled
          className="flex items-center justify-center gap-1.5 w-full text-[11px] font-medium h-7 px-3 rounded-lg border border-primary-100 bg-primary-50 text-primary-300 cursor-not-allowed"
        >
          <ExternalLink className="h-3 w-3" />
          View on Augrented
        </button>
      )}
    </SectionCard>
  );
};
