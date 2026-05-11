import { useState, useEffect, useCallback } from 'react';
import { Bookmark, BookmarkResponse, BuildingData } from '../types/api';

export function useBookmarks(enabled = true) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!chrome?.runtime?.sendMessage) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    chrome.runtime.sendMessage({ type: 'GET_BOOKMARKS' }, (response: BookmarkResponse) => {
      if (chrome.runtime.lastError || response?.status === 'error') {
        setError(response?.message ?? 'Failed to load bookmarks');
        setIsLoading(false);
        return;
      }
      setBookmarks(response.bookmarks ?? []);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (enabled) load();
    else setIsLoading(false);
  }, [enabled, load]);

  useEffect(() => {
    if (!enabled || !chrome?.storage?.local) return;
    const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if ('NYC_RA_BOOKMARKS_UPDATED' in changes) load();
    };
    chrome.storage.local.onChanged.addListener(listener);
    return () => chrome.storage.local.onChanged.removeListener(listener);
  }, [enabled, load]);

  const addBookmark = useCallback(async (
    address: string,
    listingUrl: string,
    buildingData: BuildingData | null,
    notes?: string
  ): Promise<Bookmark | null> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'ADD_BOOKMARK', address, listingUrl, buildingData, notes },
        (response: BookmarkResponse) => {
          if (response?.status === 'success' && response.bookmark) {
            setBookmarks(prev => [response.bookmark!, ...prev]);
            resolve(response.bookmark);
          } else {
            resolve(null);
          }
        }
      );
    });
  }, []);

  const removeBookmark = useCallback(async (bookmarkId: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'REMOVE_BOOKMARK', bookmarkId }, (response: BookmarkResponse) => {
        if (response?.status === 'success') {
          setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        }
        resolve();
      });
    });
  }, []);

  const updateNotes = useCallback(async (bookmarkId: string, notes: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'UPDATE_BOOKMARK_NOTES', bookmarkId, notes },
        (response: BookmarkResponse) => {
          if (response?.status === 'success' && response.bookmark) {
            setBookmarks(prev => prev.map(b => b.id === bookmarkId ? response.bookmark! : b));
          }
          resolve();
        }
      );
    });
  }, []);

  return { bookmarks, isLoading, error, addBookmark, removeBookmark, updateNotes, reload: load };
}
