import { describe, it, expect } from 'vitest';
import { amountToIndianWords, amountToInternationalWords, formatAmountInWords } from '../src/core/calculations/amountInWords';

describe('Amount In Words Conversion', () => {
  it('should format Indian Rupee numbers in Lakhs and Crores', () => {
    // 540250 -> 5 Lakh 40 Thousand 2 Hundred and Fifty
    const result = amountToIndianWords(540250);
    expect(result).toBe('Rupees Five Lakh Forty Thousand Two Hundred and Fifty Only');
  });

  it('should format Crores accurately', () => {
    const result = amountToIndianWords(15000000);
    expect(result).toBe('Rupees One Crore Fifty Lakh Only');
  });

  it('should handle paise decimals accurately', () => {
    const result = amountToIndianWords(1250.75);
    expect(result).toBe('Rupees One Thousand Two Hundred and Fifty and Seventy Five Paisa Only');
  });

  it('should format International currency in Millions', () => {
    const result = amountToInternationalWords(1500000);
    expect(result).toBe('One Million Five Hundred Thousand Dollars Only');
  });

  it('should format zero correctly', () => {
    expect(formatAmountInWords(0, 'INR')).toBe('Zero Rupees Only');
  });
});
