import React, { useState } from 'react';
import { Bug, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';
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
  const [showBedbugBreakdown, setShowBedbugBreakdown] = useState(false);

  const rodentFailureRate =
    rodentInspections && rodentInspections > 0
      ? Math.round(((rodentFailures ?? 0) / rodentInspections) * 100)
      : 0;

  const hasBedbugDetails = bedbugDetails && bedbugDetails.length > 0;

  return (
    <Card>
      <CardHeader className="flex items-center space-x-2 py-3">
        <Bug className="h-5 w-5 text-rose-600" />
        <Heading level={4}>Pest Activity</Heading>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text weight="medium">Bedbug Reports</Text>
              <div className="flex items-center gap-1">
                <Badge variant={bedbugReports && bedbugReports > 0 ? 'error' : 'success'}>
                  {bedbugReports ?? 0}
                </Badge>
                {hasBedbugDetails && (
                  <button
                    onClick={() => setShowBedbugBreakdown(v => !v)}
                    className="text-primary-400 hover:text-primary-600 transition-colors"
                    aria-label="Toggle bedbug year breakdown"
                  >
                    {showBedbugBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {showBedbugBreakdown && hasBedbugDetails && (
              <div className="rounded-lg border border-primary-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="text-left px-3 py-1.5 font-medium text-primary-600">Year</th>
                      <th className="text-right px-3 py-1.5 font-medium text-primary-600">Infested</th>
                      <th className="text-right px-3 py-1.5 font-medium text-primary-600">Eradicated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bedbugDetails!.map(row => (
                      <tr key={row.year} className="border-t border-primary-50">
                        <td className="px-3 py-1.5 text-primary-700">{row.year}</td>
                        <td className="px-3 py-1.5 text-right text-rose-600 font-medium">{row.infested}</td>
                        <td className="px-3 py-1.5 text-right text-emerald-600 font-medium">{row.eradicated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Text weight="medium">Rodent Inspections</Text>
              <Text size="sm" className="text-primary-500">
                {rodentInspections ?? 0} total
              </Text>
            </div>
            {rodentInspections !== null && rodentInspections > 0 && (
              <div className="flex items-center justify-between">
                <Text weight="medium">Failed Rodent Inspections</Text>
                <Badge variant={rodentFailureRate > 50 ? 'error' : rodentFailureRate > 20 ? 'warning' : 'success'}>
                  {rodentFailures ?? 0} ({rodentFailureRate}%)
                </Badge>
              </div>
            )}
            {(bedbugReports === null && rodentInspections === null) && (
              <div className="flex items-start space-x-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <AlertCircle className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                <Text size="xs" className="text-primary-500 italic leading-snug">
                  Pest datasets are not connected in the backend yet.
                </Text>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
