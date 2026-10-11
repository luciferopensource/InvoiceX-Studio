/**
 * Converts numeric amounts to readable words.
 * Supports both Indian numbering format (Lakhs, Crores) and International format (Millions, Billions).
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) {
    const unit = n % 10;
    return TENS[Math.floor(n / 10)] + (unit ? ' ' + ONES[unit] : '');
  }
  const rem = n % 100;
  return ONES[Math.floor(n / 100)] + ' Hundred' + (rem ? ' and ' + convertLessThanThousand(rem) : '');
}

/**
 * Converts amount in Indian Numbering System (Crore, Lakh, Thousand)
 */
export function amountToIndianWords(amount: number, currencyName: string = 'Rupees', minorUnitName: string = 'Paisa'): string {
  const rounded = Math.round((Math.abs(amount) + Number.EPSILON) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) {
    return `Zero ${currencyName} Only`;
  }

  let words = '';
  let num = integerPart;

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundredAndBelow = num;

  if (crore > 0) {
    words += convertLessThanThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertLessThanThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertLessThanThousand(thousand) + ' Thousand ';
  }
  if (hundredAndBelow > 0) {
    words += convertLessThanThousand(hundredAndBelow) + ' ';
  }

  words = words.trim();
  let result = words ? `${currencyName} ${words}` : '';

  if (decimalPart > 0) {
    const decimalWords = convertLessThanThousand(decimalPart);
    result = result ? `${result} and ${decimalWords} ${minorUnitName}` : `${decimalWords} ${minorUnitName}`;
  }

  return (result + ' Only').trim();
}

/**
 * Converts amount in International System (Billions, Millions, Thousands)
 */
export function amountToInternationalWords(amount: number, currencyName: string = 'Dollars', minorUnitName: string = 'Cents'): string {
  const rounded = Math.round((Math.abs(amount) + Number.EPSILON) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) {
    return `Zero ${currencyName} Only`;
  }

  let words = '';
  let num = integerPart;

  const billions = Math.floor(num / 1000000000);
  num %= 1000000000;

  const millions = Math.floor(num / 1000000);
  num %= 1000000;

  const thousands = Math.floor(num / 1000);
  num %= 1000;

  const remainder = num;

  if (billions > 0) {
    words += convertLessThanThousand(billions) + ' Billion ';
  }
  if (millions > 0) {
    words += convertLessThanThousand(millions) + ' Million ';
  }
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertLessThanThousand(remainder) + ' ';
  }

  words = words.trim();
  let result = words ? `${words} ${currencyName}` : '';

  if (decimalPart > 0) {
    const decimalWords = convertLessThanThousand(decimalPart);
    result = result ? `${result} and ${decimalWords} ${minorUnitName}` : `${decimalWords} ${minorUnitName}`;
  }

  return (result + ' Only').trim();
}

/**
 * Unified entry point choosing appropriate currency format
 */
export function formatAmountInWords(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return amountToIndianWords(amount, 'Rupees', 'Paise');
  } else if (currency === 'USD') {
    return amountToInternationalWords(amount, 'Dollars', 'Cents');
  } else if (currency === 'EUR') {
    return amountToInternationalWords(amount, 'Euros', 'Cents');
  } else if (currency === 'GBP') {
    return amountToInternationalWords(amount, 'Pounds', 'Pence');
  } else if (currency === 'AED') {
    return amountToInternationalWords(amount, 'Dirhams', 'Fils');
  }
  return amountToInternationalWords(amount, currency, 'Units');
}
