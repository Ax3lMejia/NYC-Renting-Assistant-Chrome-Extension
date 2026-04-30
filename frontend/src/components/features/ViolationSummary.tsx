import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';

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
  return (
    <Card>
      <CardHeader className="flex items-center space-x-2 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <Heading level={4}>Building Violations</Heading>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text weight="medium">HPD Maintenance Violations</Text>
              <Badge variant={violations && violations > 10 ? 'error' : 'warning'}>
                {violations ?? 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Text weight="medium">DOB Violations</Text>
              <Badge variant={dobViolations && dobViolations > 5 ? 'error' : 'warning'}>
                {dobViolations ?? 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Text weight="medium">ECB Penalty Violations</Text>
              <div className="flex items-center gap-2">
                {openEcbViolations !== null && openEcbViolations > 0 && (
                  <Badge variant="error">{openEcbViolations} open</Badge>
                )}
                <Badge variant={ecbViolations && ecbViolations > 5 ? 'error' : 'warning'}>
                  {ecbViolations ?? 0}
                </Badge>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <Info className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
              <Text size="xs" className="text-primary-600 italic leading-snug">
                HPD: maintenance code infractions. DOB: structural/safety issues. ECB: penalty violations with fines issued by the Environmental Control Board.
              </Text>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
