import React from 'react';
import { Bug, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';

interface PestSummaryProps {
  bedbugReports: number | null;
  rodentInspections: number | null;
  rodentFailures: number | null;
  isLoading: boolean;
}

export const PestSummary: React.FC<PestSummaryProps> = ({
  bedbugReports,
  rodentInspections,
  rodentFailures,
  isLoading,
}) => {
  const rodentFailureRate =
    rodentInspections && rodentInspections > 0
      ? Math.round(((rodentFailures ?? 0) / rodentInspections) * 100)
      : 0;

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
              <Badge variant={bedbugReports && bedbugReports > 0 ? 'error' : 'success'}>
                {bedbugReports ?? 0}
              </Badge>
            </div>
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
                  No pest data available for this address.
                </Text>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
