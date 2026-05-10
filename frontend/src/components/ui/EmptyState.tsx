import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  submessage = 'This building may not have records in NYC Open Data',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 gap-1.5">
      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
        <Database className="h-3.5 w-3.5 text-primary-300" />
      </div>
      <p className="text-[11px] text-primary-400 font-medium">{message}</p>
      <p className="text-[10px] text-primary-300 text-center leading-relaxed max-w-[180px]">
        {submessage}
      </p>
    </div>
  );
};
