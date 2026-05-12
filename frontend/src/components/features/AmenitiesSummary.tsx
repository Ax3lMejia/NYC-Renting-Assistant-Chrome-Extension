import React from 'react';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';
import { AmenityData } from '../../types/api';

interface AmenitiesSummaryProps {
  amenities: AmenityData | null;
  isLoading: boolean;
}

const CATEGORIES = [
  { key: 'grocery' as const, emoji: '🛒', label: 'Grocery' },
  { key: 'parks'   as const, emoji: '🌳', label: 'Parks' },
  { key: 'laundry' as const, emoji: '🫧', label: 'Laundry' },
  { key: 'subway'  as const, emoji: '🚇', label: 'Subway' },
];

export const AmenitiesSummary: React.FC<AmenitiesSummaryProps> = ({ amenities, isLoading }) => {
  const headline = amenities
    ? CATEGORIES.map(c => `${amenities[c.key].count} ${c.label.toLowerCase()}`).join(' · ')
    : 'No amenity data';

  return (
    <SectionCard
      emoji="📍"
      subjectName="Nearby Amenities"
      headline={headline}
      severity="low"
      isLoading={isLoading}
    >
      {!amenities ? (
        <EmptyState
          message="No amenity data"
          submessage="Overpass API unavailable or coordinates not resolved"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(({ key, emoji, label }) => {
              const cat = amenities[key];
              return (
                <div key={key} className="bg-primary-50/70 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-xs font-bold text-primary-950 ml-auto">{cat.count}</span>
                  </div>
                  {cat.nearest ? (
                    <>
                      <div className="text-[11px] font-medium text-primary-950 truncate">
                        {cat.nearest.name}
                      </div>
                      <div className="text-[10px] text-primary-400">
                        {cat.nearest.distanceMeters}m away
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-primary-400">None found</div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-primary-400 mt-2 leading-relaxed">
            OpenStreetMap · Within 800m walking distance
          </p>
        </>
      )}
    </SectionCard>
  );
};
