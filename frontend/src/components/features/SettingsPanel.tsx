import React from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';
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

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle }) => {
  const options = [
    { key: 'showComplaints', label: 'HPD Complaints', description: 'Show housing complaints filed with HPD.' },
    { key: 'showViolations', label: 'Building Violations', description: 'Show HPD maintenance and DOB violations.' },
    { key: 'showPestData', label: 'Pest Activity', description: 'Show bedbug reports and rodent inspection results.' },
    { key: 'showRentEstimate', label: 'Market Rent Comparison', description: 'Compare current price with area averages.' },
  ] as const;

  return (
    <Card className="bg-primary-900 border-none shadow-floating">
      <CardHeader className="flex items-center space-x-2 py-3 border-primary-800">
        <Settings className="h-5 w-5 text-primary-300" />
        <Heading level={4} className="text-white">Extension Settings</Heading>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option) => (
          <div key={option.key} className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center space-x-2">
                {settings[option.key] ? (
                  <Eye className="h-3 w-3 text-primary-400" />
                ) : (
                  <EyeOff className="h-3 w-3 text-primary-600" />
                )}
                <Text size="sm" weight="medium" className="text-primary-100">
                  {option.label}
                </Text>
              </div>
              <Text size="xs" className="text-primary-400 leading-tight">
                {option.description}
              </Text>
            </div>
            <Toggle
              checked={settings[option.key]}
              onChange={() => onToggle(option.key)}
              className="bg-primary-800 border-primary-700"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
