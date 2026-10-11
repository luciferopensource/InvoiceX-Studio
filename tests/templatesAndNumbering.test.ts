import { describe, it, expect } from 'vitest';
import { TEMPLATE_DEFINITIONS } from '../src/components/templates/TemplateRenderer';
import { INDIAN_STATES, validateGSTIN, determineTaxType } from '../src/core/calculations/gstValidator';
import { amountToIndianWords, amountToInternationalWords, formatAmountInWords } from '../src/core/calculations/amountInWords';

describe('15 Distinct Invoice Templates Registry Verification', () => {
  it('should verify all 15 specialized print-ready templates are registered', () => {
    expect(TEMPLATE_DEFINITIONS.length).toBe(15);

    const expectedTemplateIds = [
      'royal-black-gold',
      'elegant-wedding',
      'luxury-wedding',
      'floral-wedding',
      'minimal-white',
      'modern-corporate',
      'indian-gst',
      'photography-studio',
      'catering-services',
      'event-management',
      'decoration-services',
      'freelance-services',
      'retail-products',
      'contractor-services',
      'creative-agency',
    ];

    const actualIds = TEMPLATE_DEFINITIONS.map(t => t.id);
    for (const id of expectedTemplateIds) {
      expect(actualIds).toContain(id);
    }
  });

  it('should verify each template has genuine metadata, name, category, and preview accents', () => {
    for (const t of TEMPLATE_DEFINITIONS) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.defaultAccent).toBeTruthy();
      expect(t.defaultFont).toBeTruthy();
    }
  });
});

describe('Indian GSTIN and State Validation Comprehensive Matrix', () => {
  it('should verify 38 Indian states and union territories', () => {
    expect(INDIAN_STATES.length).toBe(38);
    const karnataka = INDIAN_STATES.find(s => s.code === '29');
    expect(karnataka?.name).toBe('Karnataka');
    const maharashtra = INDIAN_STATES.find(s => s.code === '27');
    expect(maharashtra?.name).toBe('Maharashtra');
    const delhi = INDIAN_STATES.find(s => s.code === '07');
    expect(delhi?.name).toBe('Delhi');
  });

  it('should accurately detect inter-state supply for IGST vs intra-state for CGST+SGST', () => {
    // Karnataka to Maharashtra = Inter-state (IGST)
    expect(determineTaxType('29', '27').isInterState).toBe(true);
    // Karnataka to Karnataka = Intra-state (CGST + SGST)
    expect(determineTaxType('29', '29').isInterState).toBe(false);
    // State names: Karnataka vs Maharashtra
    expect(determineTaxType('Karnataka', 'Maharashtra').isInterState).toBe(true);
    expect(determineTaxType('Karnataka', 'Karnataka').isInterState).toBe(false);
  });

  it('should validate standard 15-character GSTIN format', () => {
    expect(validateGSTIN('29ABCDE1234F1Z5').isValid).toBe(true);
    expect(validateGSTIN('27AABCM9876K1Z2').isValid).toBe(true);
    expect(validateGSTIN('INVALID_GSTIN').isValid).toBe(false);
    expect(validateGSTIN('29ABCDE1234F1Z').isValid).toBe(false); // only 14 chars
    expect(validateGSTIN('').isValid).toBe(false);
  });
});

describe('Currency and High Monetary Amount in Words Precision', () => {
  it('should format multi-crore amounts accurately in Indian numbering system', () => {
    const text = amountToIndianWords(25480500.50);
    // 2,54,80,500.50 = Rupees Two Crore Fifty Four Lakh Eighty Thousand Five Hundred and Fifty Paisa Only
    expect(text).toContain('Two Crore');
    expect(text).toContain('Fifty Four Lakh');
    expect(text).toContain('Eighty Thousand');
    expect(text).toContain('Five Hundred');
    expect(text).toContain('Fifty Paisa Only');
  });

  it('should format zero correctly', () => {
    expect(amountToIndianWords(0)).toBe('Zero Rupees Only');
    expect(amountToInternationalWords(0, 'Dollars')).toBe('Zero Dollars Only');
  });

  it('should format international currencies with cents', () => {
    const usdText = amountToInternationalWords(1450.75, 'Dollars', 'Cents');
    expect(usdText).toContain('One Thousand Four Hundred');
    expect(usdText).toContain('Fifty Dollars');
    expect(usdText).toContain('Seventy Five Cents Only');

    const eurText = formatAmountInWords(500, 'EUR');
    expect(eurText).toBe('Five Hundred Euros Only');
  });
});
