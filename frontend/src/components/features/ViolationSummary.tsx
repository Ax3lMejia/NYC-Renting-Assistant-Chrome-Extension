import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';

interface ViolationSummaryProps {
  violations: number | null;
  isLoading: boolean;
}

export const ViolationSummary: React.FC<ViolationSummaryProps> = ({ 
  violations, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center space-x-2 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <Heading level={4}>Maintenance Violations</Heading>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-12 w-full bg-primary-100/50 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text weight="medium">Open Violations</Text>
              <Badge variant={violations && violations > 10 ? 'error' : 'warning'}>
                {violations ?? 0}
              </Badge>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <Info className="h-4 w-4 text-primary-600 mt-0.5" />
              <Text size="xs" className="text-primary-600 italic leading-snug">
                Violations include hazardous and non-hazardous maintenance code infractions recorded by HPD.
              </Text>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
