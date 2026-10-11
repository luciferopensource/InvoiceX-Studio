import { describe, it, expect } from 'vitest';
import { validateGSTIN, determineTaxType } from '../src/core/calculations/gstValidator';

describe('Indian GST Validation & Rules', () => {
  it('should validate valid 15-digit GSTIN structures', () => {
    const validGstin = '29ABCDE1234F1Z5';
    const result = validateGSTIN(validGstin);
    expect(result.isValid).toBe(true);
    expect(result.stateCode).toBe('29');
    expect(result.stateName).toBe('Karnataka');
  });

  it('should reject invalid GSTIN lengths or invalid characters', () => {
    expect(validateGSTIN('12345').isValid).toBe(false);
    expect(validateGSTIN('29ABCDE1234F1Z').isValid).toBe(false); // 14 chars
    expect(validateGSTIN('99INVALID999999').isValid).toBe(false);
  });

  it('should detect intra-state transactions (same state -> CGST+SGST)', () => {
    const result = determineTaxType('Karnataka', 'Karnataka');
    expect(result.isInterState).toBe(false);
  });

  it('should detect inter-state transactions (different states -> IGST)', () => {
    const result = determineTaxType('Karnataka', 'Maharashtra');
    expect(result.isInterState).toBe(true);
  });
});
