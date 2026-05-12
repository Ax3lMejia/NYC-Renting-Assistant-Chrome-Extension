import { describe, it, expect } from 'vitest';
import { haversineMeters } from '../haversine';

describe('haversineMeters', () => {
  it('returns 0 for identical points', () => {
    expect(haversineMeters(40.748, -73.996, 40.748, -73.996)).toBe(0);
  });

  it('returns ~111195m for 1 degree of latitude', () => {
    const dist = haversineMeters(0, 0, 1, 0);
    expect(dist).toBeGreaterThan(111_000);
    expect(dist).toBeLessThan(111_500);
  });

  it('returns ~800m for two points ~800m apart in NYC', () => {
    // Atlantic Ave & 4th Ave Brooklyn → 800m south on 4th Ave
    const dist = haversineMeters(40.6840, -73.9773, 40.6768, -73.9773);
    expect(dist).toBeGreaterThan(750);
    expect(dist).toBeLessThan(850);
  });

  it('is symmetric', () => {
    const d1 = haversineMeters(40.748, -73.996, 40.752, -73.990);
    const d2 = haversineMeters(40.752, -73.990, 40.748, -73.996);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.01);
  });
});
