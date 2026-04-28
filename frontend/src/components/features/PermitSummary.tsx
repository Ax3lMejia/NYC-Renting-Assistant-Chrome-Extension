import React from 'react';
import { HardHat, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';

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
  return (
    <Card>
      <CardHeader className="flex items-center space-x-2 py-3">
        <HardHat className="h-5 w-5 text-sky-600" />
        <Heading level={4}>Building Permits</Heading>
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
              <Text weight="medium">Total Permits on File</Text>
              <Text size="sm" className="text-primary-500">{permits ?? 0}</Text>
            </div>
            <div className="flex items-center justify-between">
              <Text weight="medium">Active / Issued Permits</Text>
              <Badge variant={activePermits && activePermits > 0 ? 'warning' : 'success'}>
                {activePermits ?? 0}
              </Badge>
            </div>
            {activePermits !== null && activePermits > 0 && (
              <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <Text size="xs" className="text-amber-700 italic leading-snug">
                  Active permits indicate ongoing construction or renovation work in this building.
                </Text>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
