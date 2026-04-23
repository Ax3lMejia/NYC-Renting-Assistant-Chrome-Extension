import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { AddressTracker } from './components/features/AddressTracker';
import { ComplaintSummary } from './components/features/ComplaintSummary';
import { ViolationSummary } from './components/features/ViolationSummary';
import { SettingsPanel } from './components/features/SettingsPanel';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [address, setAddress] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<number>(0);
  const [violations, setViolations] = useState<number>(0);

  const [settings, setSettings] = useState({
    showComplaints: true,
    showViolations: true,
    showRentEstimate: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAddress("123 Example St, Brooklyn, NY 11201");
      setComplaints(14);
      setViolations(8);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sidebar isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
      <AddressTracker address={address} isLoading={isLoading} />

      {settings.showComplaints && (
        <ComplaintSummary
          complaints={complaints}
          severity="medium"
          isLoading={isLoading}
        />
      )}

      {settings.showViolations && (
        <ViolationSummary
          violations={violations}
          isLoading={isLoading}
        />
      )}

      <SettingsPanel settings={settings} onToggle={handleToggle} />
    </Sidebar>
  );
};

export default App;
