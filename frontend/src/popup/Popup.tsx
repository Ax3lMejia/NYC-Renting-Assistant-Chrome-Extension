import React, { useState, useEffect } from 'react';
import { ExternalLink, Bookmark as BookmarkIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBookmarks } from '../hooks/useBookmarks';
import { AuthPanel } from '../components/features/AuthPanel';
import { BookmarkButton } from '../components/features/BookmarkButton';
import { calculateBuildingGrade } from '../utils/buildingGrade';
import { BuildingData, BookmarkResponse } from '../types/api';

const containerStyle: React.CSSProperties = {
  width: 360,
  background: '#F4EDDD',
  fontFamily: 'Geist, system-ui, sans-serif',
  color: '#14110D',
  minHeight: 200,
};

const Header: React.FC<{ email?: string | null; onSignOut?: () => void }> = ({ email, onSignOut }) => (
  <div style={{ background: '#C49F6D', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
    <BookmarkIcon size={13} style={{ color: '#14110D', opacity: 0.6 }} />
    <span style={{
      fontFamily: 'Geist Mono, monospace',
      fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65, flex: 1,
    }}>
      RENT ASSISTANT
    </span>
    {email && onSignOut && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'rgba(20,17,13,0.6)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email}
        </span>
        <button
          onClick={onSignOut}
          style={{
            fontSize: 10, fontWeight: 600, color: '#14110D',
            background: '#fff', border: '1px solid rgba(20,17,13,0.2)',
            borderRadius: 5, padding: '3px 9px', cursor: 'pointer',
            fontFamily: 'Geist, system-ui, sans-serif', flexShrink: 0,
          }}
        >
          Sign out
        </button>
      </div>
    )}
  </div>
);

export const Popup: React.FC = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks(!authLoading && !!user);
  const [currentTabInfo, setCurrentTabInfo] = useState<{ address: string | null; url: string; isListing: boolean }>({
    address: null, url: '', isListing: false,
  });
  const [tabBuildingData, setTabBuildingData] = useState<BuildingData | null>(null);

  useEffect(() => {
    if (!chrome?.tabs) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url) return;
      const url = tab.url;
      const isListing = ['zillow.com', 'streeteasy.com', 'apartments.com'].some(d => url.includes(d));
      setCurrentTabInfo({ address: null, url, isListing });
      if (isListing && tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_ADDRESS' }, (response) => {
          if (!chrome.runtime.lastError && response?.address) {
            setCurrentTabInfo({ address: response.address, url, isListing });
            chrome.runtime.sendMessage({ type: 'GET_BUILDING_DATA', address: response.address }, (r) => {
              if (r?.data) setTabBuildingData(r.data);
            });
          }
        });
      }
    });
  }, []);

  if (authLoading) {
    return (
      <div style={containerStyle}>
        <Header />
        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#8a8377', fontSize: 12 }}>
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <Header />
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: 11, color: '#3A3530', marginBottom: 12, lineHeight: 1.5 }}>
            Sign in to save listings and access them from any device.
          </div>
          <AuthPanel />
        </div>
      </div>
    );
  }

  const recent = bookmarks.slice(0, 5);

  return (
    <div style={containerStyle}>
      <Header email={user.email} onSignOut={signOut} />

      {currentTabInfo.isListing && currentTabInfo.address && (
        <div style={{ padding: '4px 12px 8px' }}>
          <BookmarkButton
            address={currentTabInfo.address}
            listingUrl={currentTabInfo.url}
            buildingData={tabBuildingData}
          />
        </div>
      )}

      <div style={{ padding: '0 12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, marginTop: 12 }}>
          <span style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 9,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8377',
          }}>
            MY BOOKMARKS
          </span>
          <button
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('bookmarks.html') })}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#E84A1F', fontSize: 11, fontWeight: 600,
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          >
            View All <ExternalLink size={10} />
          </button>
        </div>

        {bookmarksLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 50, background: 'rgba(20,17,13,0.07)', borderRadius: 10 }} />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#8a8377', fontSize: 11 }}>
            No bookmarks yet. Visit a listing and click Save.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map(b => {
              const grade = calculateBuildingGrade(b.building_data);
              const gradeColor = !grade ? '#8a8377'
                : grade.grade === 'A' || grade.grade === 'B' ? '#4D6B47'
                : grade.grade === 'C' ? '#c89e23'
                : '#E84A1F';
              return (
                <a
                  key={b.id}
                  href={b.listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: '#FFFFFF', border: '1px solid rgba(20,17,13,0.10)',
                    borderRadius: 10, padding: '8px 10px', textDecoration: 'none',
                  }}
                >
                  {grade && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: gradeColor,
                      color: grade.grade === 'C' ? '#14110D' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Instrument Serif, Georgia, serif',
                      fontSize: 17, fontStyle: 'italic',
                    }}>
                      {grade.grade}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#14110D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.address.split(',')[0]}
                    </div>
                    <div style={{ fontSize: 10, color: '#8a8377' }}>
                      {new Date(b.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              );
            })}
            {bookmarks.length > 5 && (
              <div style={{ textAlign: 'center', fontSize: 11, color: '#8a8377' }}>
                + {bookmarks.length - 5} more → View All
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
