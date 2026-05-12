import { getSupabaseClient } from './supabaseClient';
import { Bookmark, BookmarkResponse, BuildingData } from '../types/api';

const BOOKMARKS_UPDATED_KEY = 'NYC_RA_BOOKMARKS_UPDATED';

function notifyBookmarksChanged() {
  chrome.storage.local.set({ [BOOKMARKS_UPDATED_KEY]: Date.now() });
}

export class BookmarkHandler {
  static async addBookmark(
    address: string,
    listingUrl: string,
    buildingData: BuildingData | null,
    notes?: string,
    listedPrice?: number | null
  ): Promise<BookmarkResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { status: 'error', message: 'Not signed in' };

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          address,
          listing_url: listingUrl,
          building_data: buildingData,
          notes: notes ?? null,
          listed_price: listedPrice ?? null,
        })
        .select()
        .single();

      if (error) return { status: 'error', message: error.message };
      notifyBookmarksChanged();
      return { status: 'success', bookmark: data as Bookmark };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to add bookmark' };
    }
  }

  static async removeBookmark(bookmarkId: string): Promise<BookmarkResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId);
      if (error) return { status: 'error', message: error.message };
      notifyBookmarksChanged();
      return { status: 'success' };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to remove bookmark' };
    }
  }

  static async getBookmarks(): Promise<BookmarkResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { status: 'error', message: error.message };
      return { status: 'success', bookmarks: (data ?? []) as Bookmark[] };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to fetch bookmarks' };
    }
  }

  static async updateNotes(bookmarkId: string, notes: string): Promise<BookmarkResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('bookmarks')
        .update({ notes })
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) return { status: 'error', message: error.message };
      return { status: 'success', bookmark: data as Bookmark };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to update notes' };
    }
  }
}
