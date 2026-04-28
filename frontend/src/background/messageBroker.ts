import { ExtensionMessage, ExtensionResponse } from '../types/api';
import { CacheManager } from './cacheManager';
import { ApiClient } from './apiClient';

export class MessageBroker {
  private static hasUsableData(data: ExtensionResponse['data']): boolean {
    if (!data) return false;

    return data.complaints !== null || data.violations !== null ||
      data.dobViolations !== null || data.bedbugReports !== null || data.rodentInspections !== null;
  }

  static init() {
    chrome.runtime.onMessage.addListener((
      request: ExtensionMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: ExtensionResponse) => void
    ) => {
      console.log('Background received message:', request);

      if (request.type === 'GET_BUILDING_DATA') {
        this.handleGetBuildingData(request.address).then(sendResponse);
        return true; // keep the message channel open for async response
      }

      return false; // not handled
    });
  }

  private static async handleGetBuildingData(address: string): Promise<ExtensionResponse> {
    try {
      // 1. check cache first
      const cachedData = await CacheManager.get(address);
      if (cachedData) {
        console.log('Cache hit for:', address);
        return { status: 'success', data: cachedData };
      }

      console.log('Cache miss for:', address, 'Fetching from APIs...');

      // 2. fetch from apis
      const { data, errors } = await ApiClient.fetchBuildingData(address);

      // 3. cache only usable responses so stale empty/error payloads do not stick around
      if (this.hasUsableData(data)) {
        await CacheManager.set(address, data);
      }

      // 4. return result
      if (errors.length > 0) {
        console.warn('API Errors encountered:', errors);
        const hasAnyData = data.complaints !== null || data.violations !== null ||
          data.dobViolations !== null || data.bedbugReports !== null || data.rodentInspections !== null;
        return {
          status: hasAnyData ? 'partial' : 'error',
          data,
          errors
        };
      }

      return { status: 'success', data };

    } catch (err: any) {
      console.error('Unhandled error in MessageBroker:', err);
      return {
        status: 'error',
        errors: [{ source: 'Background Worker', message: err.message || 'Internal processing error' }]
      };
    }
  }
}
