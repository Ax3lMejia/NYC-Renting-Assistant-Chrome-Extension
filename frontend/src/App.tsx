import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ComplaintSummary } from './components/features/ComplaintSummary';
import { ViolationSummary } from './components/features/ViolationSummary';
import { PestSummary } from './components/features/PestSummary';
import { SafetySummary } from './components/features/SafetySummary';
import { SettingsPanel } from './components/features/SettingsPanel';
import { useExtensionData } from './hooks/useExtensionData';
import { calculateBuildingGrade } from './utils/buildingGrade';

type AppProps = {
  scrapedAddress: string | null;
};

function App({ scrapedAddress }: AppProps) {
  const [showSettings, setShowSettings] = useState(false);

  const address = scrapedAddress;

  const { data, isLoading, error } = useExtensionData(address);

  const [settings, setSettings] = useState({
    showComplaints: true,
    showViolations: true,
    showPestData: true,
    showRentEstimate: true,
    showSafety: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const grade = !isLoading && data ? calculateBuildingGrade(data) : null;

  if (!scrapedAddress) return null;

  return (
    <Sidebar
      showSettings={showSettings}
      onToggleSettings={() => setShowSettings(v => !v)}
      address={address}
      isLoading={isLoading}
      grade={grade}
      buildingData={data}
      listingUrl={typeof window !== 'undefined' ? window.location.href : undefined}
    >
      {showSettings && (
        <SettingsPanel settings={settings} onToggle={handleToggle} />
      )}

      {settings.showComplaints && (
        <ComplaintSummary
          complaints={data?.complaints ?? null}
          severity={data?.complaintSeverity ?? null}
          dobComplaints={data?.dobComplaints ?? null}
          openDobComplaints={data?.openDobComplaints ?? null}
          serviceRequests={data?.serviceRequests ?? null}
          openServiceRequests={data?.openServiceRequests ?? null}
          isLoading={isLoading}
          bbl={data?.bbl ?? null}
          address={data?.address ?? null}
        />
      )}

      {settings.showViolations && (
        <ViolationSummary
          violations={data?.violations ?? null}
          dobViolations={data?.dobViolations ?? null}
          ecbViolations={data?.ecbViolations ?? null}
          openEcbViolations={data?.openEcbViolations ?? null}
          isLoading={isLoading}
        />
      )}

      {settings.showPestData && (
        <PestSummary
          bedbugReports={data?.bedbugReports ?? null}
          bedbugDetails={data?.bedbugDetails ?? null}
          rodentInspections={data?.rodentInspections ?? null}
          rodentFailures={data?.rodentFailures ?? null}
          isLoading={isLoading}
        />
      )}

      {settings.showSafety && (
        <SafetySummary
          crimeData={data?.crimeData ?? null}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-xs">
          {error}
        </div>
      )}
    </Sidebar>
  );
}

export default App;
