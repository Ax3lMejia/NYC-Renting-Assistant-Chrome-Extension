import { BuildingData } from '../types/api';

const CACHE_PREFIX = 'NYC_RA_CACHE_';
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export class CacheManager {
  private static hasUsableData(data: BuildingData): boolean {
    return data.complaints !== null ||
      data.violations !== null ||
      data.dobViolations !== null ||
      data.bedbugReports !== null ||
      data.rodentInspections !== null;
  }

  private static getCacheKey(address: string): string {
    // normalize address for cache key
    const normalized = address.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${CACHE_PREFIX}${normalized}`;
  }

  static async get(address: string): Promise<BuildingData | null> {
    const key = this.getCacheKey(address);
    const result = await chrome.storage.local.get(key);
    const cachedItem = result[key];

    if (!cachedItem) {
      return null;
    }

    const { data, timestamp } = cachedItem;

    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      await this.remove(address);
      return null;
    }

    const cachedData = data as BuildingData;
    if (!this.hasUsableData(cachedData)) {
      await this.remove(address);
      return null;
    }

    return cachedData;
  }

  static async set(address: string, data: BuildingData): Promise<void> {
    const key = this.getCacheKey(address);
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    await chrome.storage.local.set({ [key]: cacheItem });
  }

  static async remove(address: string): Promise<void> {
    const key = this.getCacheKey(address);
    await chrome.storage.local.remove(key);
  }
}
