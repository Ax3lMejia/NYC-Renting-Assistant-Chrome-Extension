import { describe, it, expect } from 'vitest';
import { pickComparisonWinner, getWorstIndex } from '../comparisonHelpers';

describe('pickComparisonWinner', () => {
  it('returns index of lowest value when lower is better', () => {
    expect(pickComparisonWinner([10, 3, 7], false)).toBe(1);
  });

  it('returns index of highest value when higher is better', () => {
    expect(pickComparisonWinner([50, 80, 65], true)).toBe(1);
  });

  it('returns null when all values are equal', () => {
    expect(pickComparisonWinner([5, 5, 5], false)).toBeNull();
  });

  it('returns null when all values are null', () => {
    expect(pickComparisonWinner([null, null], false)).toBeNull();
  });

  it('returns null when fewer than 2 defined values', () => {
    expect(pickComparisonWinner([null, 5], false)).toBeNull();
  });

  it('ignores null values when finding winner', () => {
    expect(pickComparisonWinner([2, null, 8], false)).toBe(0);
  });

  it('returns null when two values tie for best', () => {
    expect(pickComparisonWinner([3, 3, 8], false)).toBeNull();
  });
});

describe('getWorstIndex', () => {
  it('returns index of highest value when lower is better', () => {
    expect(getWorstIndex([10, 3, 7], false)).toBe(0);
  });

  it('returns index of lowest value when higher is better', () => {
    expect(getWorstIndex([50, 80, 65], true)).toBe(0);
  });

  it('returns null when all values are equal', () => {
    expect(getWorstIndex([5, 5, 5], false)).toBeNull();
  });

  it('returns null when fewer than 2 defined values', () => {
    expect(getWorstIndex([null, 5], false)).toBeNull();
  });
});
