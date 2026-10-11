export interface IndianState {
  code: string;
  name: string;
}

export const INDIAN_STATES: IndianState[] = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh (Old)' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman and Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh (New)' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' },
];

/**
 * Validates 15-digit Indian GSTIN format
 * Structure: 2 digits (State) + 10 chars (PAN) + 1 digit (Entity number) + 'Z' + 1 checksum char
 */
export function validateGSTIN(gstin: string): { isValid: boolean; stateName?: string; stateCode?: string; error?: string } {
  if (!gstin) return { isValid: false, error: 'GSTIN is empty' };
  const cleaned = gstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (cleaned.length !== 15) {
    return { isValid: false, error: 'GSTIN must be exactly 15 alphanumeric characters' };
  }

  if (!gstinRegex.test(cleaned)) {
    return { isValid: false, error: 'Invalid GSTIN structure' };
  }

  const stateCode = cleaned.substring(0, 2);
  const state = INDIAN_STATES.find(s => s.code === stateCode);

  return {
    isValid: true,
    stateCode,
    stateName: state?.name || 'Unknown State',
  };
}

/**
 * Determines whether a transaction is Inter-State (IGST) or Intra-State (CGST + SGST)
 */
export function determineTaxType(
  businessStateCodeOrName: string,
  placeOfSupplyOrCustomerState: string
): { isInterState: boolean } {
  if (!businessStateCodeOrName || !placeOfSupplyOrCustomerState) {
    return { isInterState: false }; // Default intra-state
  }

  const cleanB = businessStateCodeOrName.trim().toLowerCase();
  const cleanP = placeOfSupplyOrCustomerState.trim().toLowerCase();

  // If exact code match or exact name match
  if (cleanB === cleanP) {
    return { isInterState: false };
  }

  // Check state code lookup
  const bState = INDIAN_STATES.find(s => s.code === cleanB || s.name.toLowerCase() === cleanB);
  const pState = INDIAN_STATES.find(s => s.code === cleanP || s.name.toLowerCase() === cleanP);

  if (bState && pState && bState.code === pState.code) {
    return { isInterState: false };
  }

  return { isInterState: true };
}
