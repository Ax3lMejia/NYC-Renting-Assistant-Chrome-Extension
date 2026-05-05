import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Toggle } from '../ui/Toggle';

interface SettingsPanelProps {
  settings: {
    showComplaints: boolean;
    showViolations: boolean;
    showPestData: boolean;
    showRentEstimate: boolean;
  };
  onToggle: (key: 'showComplaints' | 'showViolations' | 'showPestData' | 'showRentEstimate') => void;
}

const options = [
  { key: 'showComplaints', label: 'Complaints' },
  { key: 'showViolations', label: 'Violations' },
  { key: 'showPestData', label: 'Pest Activity' },
  { key: 'showRentEstimate', label: 'Rent Estimate' },
] as const;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle }) => {
  return (
    <div className="bg-teal-50 rounded-xl border border-teal-100 px-3 py-2.5 space-y-1">
      <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
        Visible Sections
      </p>
      {options.map((option) => (
        <div key={option.key} className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-1.5">
            {settings[option.key] ? (
              <Eye className="h-3 w-3 text-teal-600" />
            ) : (
              <EyeOff className="h-3 w-3 text-primary-400" />
            )}
            <span className="text-xs text-primary-700 font-medium">{option.label}</span>
          </div>
          <Toggle
            checked={settings[option.key]}
            onChange={() => onToggle(option.key)}
          />
        </div>
      ))}
    </div>
  );
};
