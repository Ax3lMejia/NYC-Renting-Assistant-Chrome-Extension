import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { AddressTracker } from './components/features/AddressTracker';
import { ComplaintSummary } from './components/features/ComplaintSummary';
import { ViolationSummary } from './components/features/ViolationSummary';
import { SettingsPanel } from './components/features/SettingsPanel';
import { useExtensionData } from './hooks/useExtensionData';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  // hardcode address for now until FR1 (Content Script Address detection) is built
  const [address, setAddress] = useState<string | null>("123 Example St, Brooklyn, NY 11201");
  const { data, isLoading, error } = useExtensionData(address);

  const [settings, setSettings] = useState({
    showComplaints: true,
    showViolations: true,
    showRentEstimate: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sidebar isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
      <AddressTracker address={address} isLoading={isLoading} />

      {settings.showComplaints && (
        <ComplaintSummary
          complaints={data?.complaints ?? null}
          severity={data?.complaintSeverity ?? null}
          isLoading={isLoading}
        />
      )}

      {settings.showViolations && (
        <ViolationSummary
          violations={data?.violations ?? null}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <SettingsPanel settings={settings} onToggle={handleToggle} />
    </Sidebar>
  );
};

export default App;
