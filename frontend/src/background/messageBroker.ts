import { ExtensionMessage, ExtensionResponse } from '../types/api';
import { CacheManager } from './cacheManager';
import { ApiClient } from './apiClient';
import { AuthHandler } from './authHandler';
import { BookmarkHandler } from './bookmarkHandler';

export class MessageBroker {
  static init() {
    chrome.runtime.onMessage.addListener((
      request: ExtensionMessage,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => {
      console.log('Background received message:', request.type);

      if (request.type === 'GET_BUILDING_DATA') {
        this.handleGetBuildingData(request.address).then(sendResponse);
        return true;
      }

      if (request.type === 'SIGN_IN_EMAIL') {
        AuthHandler.signInEmail(request.email, request.password).then(sendResponse);
        return true;
      }

      if (request.type === 'SIGN_UP_EMAIL') {
        AuthHandler.signUp(request.email, request.password).then(sendResponse);
        return true;
      }

      if (request.type === 'SIGN_IN_GOOGLE') {
        AuthHandler.signInGoogle().then(sendResponse);
        return true;
      }

      if (request.type === 'SIGN_OUT') {
        AuthHandler.signOut().then(sendResponse);
        return true;
      }

      if (request.type === 'GET_AUTH_STATE') {
        AuthHandler.getAuthState().then(sendResponse);
        return true;
      }

      if (request.type === 'ADD_BOOKMARK') {
        BookmarkHandler.addBookmark(
          request.address,
          request.listingUrl,
          request.buildingData,
          request.notes,
          request.listedPrice ?? null
        ).then(sendResponse);
        return true;
      }

      if (request.type === 'REMOVE_BOOKMARK') {
        BookmarkHandler.removeBookmark(request.bookmarkId).then(sendResponse);
        return true;
      }

      if (request.type === 'GET_BOOKMARKS') {
        BookmarkHandler.getBookmarks().then(sendResponse);
        return true;
      }

      if (request.type === 'UPDATE_BOOKMARK_NOTES') {
        BookmarkHandler.updateNotes(request.bookmarkId, request.notes).then(sendResponse);
        return true;
      }

      return false;
    });
  }

  private static async handleGetBuildingData(address: string): Promise<ExtensionResponse> {
    try {
      const cachedData = await CacheManager.get(address);
      if (cachedData) {
        console.log('Cache hit for:', address);
        return { status: 'success', data: cachedData };
      }

      console.log('Cache miss for:', address, 'Fetching from APIs...');
      const { data, errors } = await ApiClient.fetchBuildingData(address);
      await CacheManager.set(address, data);

      if (errors.length > 0) {
        console.warn('API Errors encountered:', errors);
        const hasAnyData = data.complaints !== null || data.violations !== null ||
          data.dobViolations !== null || data.ecbViolations !== null ||
          data.dobComplaints !== null || data.serviceRequests !== null ||
          data.bedbugReports !== null || data.rodentInspections !== null;
        return {
          status: hasAnyData ? 'partial' : 'error',
          data,
          errors,
        };
      }

      return { status: 'success', data };
    } catch (err: any) {
      console.error('Unhandled error in MessageBroker:', err);
      return {
        status: 'error',
        errors: [{ source: 'Background Worker', message: err.message || 'Internal processing error' }],
      };
    }
  }
}
