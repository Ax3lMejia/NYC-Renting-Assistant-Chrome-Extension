import { useState, useEffect } from 'react';
import { BuildingData, ExtensionMessage, ExtensionResponse } from '../types/api';

export function useExtensionData(address: string | null) {
  const [data, setData] = useState<BuildingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setData(null);
      setError('Could not detect the listing address on this page.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const message: ExtensionMessage = {
      type: 'GET_BUILDING_DATA',
      address
    };

    // if we're not running as an extension, mock the response
    if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      console.warn('Chrome runtime not available, using mock data.');
      setTimeout(() => {
        setData({
          address,
          bbl: '1008370001',
          complaints: 14,
          complaintSeverity: 'medium',
          dobComplaints: 6,
          openDobComplaints: 2,
          serviceRequests: 22,
          openServiceRequests: 4,
          violations: 8,
          dobViolations: 3,
          ecbViolations: 5,
          openEcbViolations: 1,
          permits: 12,
          activePermits: 2,
          bedbugReports: 3,
          bedbugDetails: [
            { year: 2023, infested: 2, eradicated: 2 },
            { year: 2021, infested: 1, eradicated: 1 },
          ],
          rodentInspections: 5,
          rodentFailures: 2,
          rentEstimate: null,
          lastUpdated: Date.now()
        });
        setIsLoading(false);
      }, 1500);
      return;
    }

    chrome.runtime.sendMessage(message, (response: ExtensionResponse) => {
      // check for chrome.runtime.lastError to handle context invalidation
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message || 'Failed to communicate with background script.');
        setIsLoading(false);
        return;
      }

      if (response && response.data) {
        setData(response.data);
      }

      if (response && response.status === 'error') {
        setError(response.errors?.[0]?.message || 'Failed to fetch data.');
      }

      setIsLoading(false);
    });

  }, [address]);

  return { data, isLoading, error };
}
