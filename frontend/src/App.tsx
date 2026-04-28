import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { AddressTracker } from './components/features/AddressTracker';
import { ComplaintSummary } from './components/features/ComplaintSummary';
import { ViolationSummary } from './components/features/ViolationSummary';
import { PestSummary } from './components/features/PestSummary';
import { SettingsPanel } from './components/features/SettingsPanel';
import { useExtensionData } from './hooks/useExtensionData';


type AppProps = {
  scrapedAddress: string | null;
};

function App({ scrapedAddress }: AppProps) {
  const [isOpen, setIsOpen] = useState(true);

  const address = scrapedAddress;
  const { data, isLoading, error } = useExtensionData(address);

  const [settings, setSettings] = useState({
    showComplaints: true,
    showViolations: true,
    showPestData: true,
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
          dobViolations={data?.dobViolations ?? null}
          isLoading={isLoading}
        />
      )}

      {settings.showPestData && (
        <PestSummary
          bedbugReports={data?.bedbugReports ?? null}
          rodentInspections={data?.rodentInspections ?? null}
          rodentFailures={data?.rodentFailures ?? null}
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
