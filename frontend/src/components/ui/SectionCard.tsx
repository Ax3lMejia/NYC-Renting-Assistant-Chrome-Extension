import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  summary?: React.ReactNode;
  defaultOpen?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  summary,
  defaultOpen = true,
  isLoading = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/75 backdrop-blur-sm rounded-xl border border-primary-200/60 shadow-section overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-3 hover:bg-primary-100/40 transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="shrink-0">{icon}</span>
          <span className="text-sm font-serif font-medium text-primary-800">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isLoading ? (
            <span className="h-4 w-12 bg-primary-100/80 animate-pulse rounded-full" />
          ) : (
            !open && summary
          )}
          <ChevronDown className={cn(
            "h-3.5 w-3.5 text-primary-300 transition-transform duration-200",
            open && "rotate-180"
          )} />
        </div>
      </button>

      {open && (
        <div className="border-t border-primary-50 px-3 py-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-full bg-primary-50 animate-pulse rounded-lg" />
              <div className="h-8 w-full bg-primary-50 animate-pulse rounded-lg" />
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};
