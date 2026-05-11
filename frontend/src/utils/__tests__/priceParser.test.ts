import { describe, it, expect } from 'vitest';
import { parsePriceText } from '../priceParser';

describe('parsePriceText', () => {
  it('parses a plain dollar amount', () => {
    expect(parsePriceText('$2,800')).toBe(2800);
  });

  it('strips /mo suffix', () => {
    expect(parsePriceText('$2,800/mo')).toBe(2800);
  });

  it('strips /month suffix', () => {
    expect(parsePriceText('$3,200/month')).toBe(3200);
  });

  it('handles amounts without commas', () => {
    expect(parsePriceText('$950')).toBe(950);
  });

  it('handles amounts with spaces around the sign', () => {
    expect(parsePriceText('$ 2,500 / mo')).toBe(2500);
  });

  it('returns null for empty string', () => {
    expect(parsePriceText('')).toBeNull();
  });

  it('returns null for non-numeric text', () => {
    expect(parsePriceText('Call for pricing')).toBeNull();
  });

  it('returns null for zero', () => {
    expect(parsePriceText('$0')).toBeNull();
  });

  it('returns null for negative', () => {
    expect(parsePriceText('-100')).toBeNull();
  });

  it('returns null for text without a dollar sign', () => {
    expect(parsePriceText('1500')).toBeNull();
  });

  it('returns null for bedroom/bathroom counts that look numeric', () => {
    expect(parsePriceText('4 floors')).toBeNull();
    expect(parsePriceText('1 bed')).toBeNull();
  });
});
