import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Bookmark as BookmarkType, BookmarkResponse, BuildingData } from '../../types/api';

interface BookmarkButtonProps {
  address: string;
  listingUrl: string;
  buildingData: BuildingData | null;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ address, listingUrl, buildingData }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chrome?.runtime?.sendMessage) return;
    chrome.runtime.sendMessage({ type: 'GET_BOOKMARKS' }, (response: BookmarkResponse) => {
      if (response?.bookmarks) setBookmarks(response.bookmarks);
    });
  }, []);

  const existing = bookmarks.find(b => b.address === address);
  const isSaved = !!existing;

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (isSaved && existing) {
      chrome.runtime.sendMessage({ type: 'REMOVE_BOOKMARK', bookmarkId: existing.id }, () => {
        setBookmarks(prev => prev.filter(b => b.id !== existing.id));
        setIsLoading(false);
      });
    } else {
      chrome.runtime.sendMessage(
        { type: 'ADD_BOOKMARK', address, listingUrl, buildingData },
        (response: BookmarkResponse) => {
          if (response?.status === 'success' && response.bookmark) {
            setBookmarks(prev => [response.bookmark!, ...prev]);
          }
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isSaved ? 'Remove bookmark' : 'Bookmark this listing'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 8,
        background: isSaved ? 'rgba(20,17,13,0.18)' : 'rgba(20,17,13,0.08)',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer',
        color: isSaved ? '#14110D' : 'rgba(20,17,13,0.5)',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'Geist, system-ui, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      {isSaved
        ? <BookmarkCheck style={{ width: 13, height: 13 }} />
        : <Bookmark style={{ width: 13, height: 13 }} />
      }
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
};
