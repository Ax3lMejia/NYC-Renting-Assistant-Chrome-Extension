import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';

interface AddressTrackerProps {
  address: string | null;
  isLoading: boolean;
}

export const AddressTracker: React.FC<AddressTrackerProps> = ({ address, isLoading }) => {
  return (
    <Card className="bg-primary-50/50 border-primary-100/50">
      <CardContent className="flex items-start space-x-3">
        <div className="mt-1 p-2 bg-white rounded-lg shadow-elegant border border-primary-100">
          <MapPin className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1 space-y-1">
          <Heading level={4} className="text-primary-900">Current Listing</Heading>
          {isLoading ? (
            <div className="h-5 w-48 bg-primary-200/50 animate-pulse rounded" />
          ) : (
            <Text weight="medium" className="text-primary-800 leading-tight">
              {address || "Searching for address..."}
            </Text>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
