import React from 'react';
import { MessageSquareWarning, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ComplaintSummaryProps {
  complaints: number | null;
  severity: 'low' | 'medium' | 'high' | null;
  isLoading: boolean;
}

export const ComplaintSummary: React.FC<ComplaintSummaryProps> = ({ 
  complaints, 
  severity, 
  isLoading 
}) => {
  const severityMap = {
    low: { variant: 'success', label: 'Low Frequency' },
    medium: { variant: 'warning', label: 'Moderate Issues' },
    high: { variant: 'error', label: 'High Alert' },
  } as const;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <MessageSquareWarning className="h-5 w-5 text-primary-600" />
          <Heading level={4}>Building Complaints</Heading>
        </div>
        {!isLoading && severity && (
          <Badge variant={severityMap[severity].variant}>
            {severityMap[severity].label}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full bg-primary-100/50 animate-pulse rounded-lg" />
            <div className="h-4 w-3/4 bg-primary-50/50 animate-pulse rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-bold text-primary-950">
                {complaints ?? 0}
              </span>
              <Text size="sm" className="text-primary-500">Active/Recent Complaints</Text>
            </div>
            <Text size="sm" className="leading-relaxed">
              Based on NYC 311 and HPD service requests filed in the last 12 months.
            </Text>
            <Button variant="outline" size="sm" className="w-full text-xs h-9">
              <ExternalLink className="mr-2 h-3 w-3" />
              View Original HPD Source
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
