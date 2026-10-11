/**
 * Decimal-safe arithmetic helpers to prevent JavaScript floating point errors.
 * (e.g. 0.1 + 0.2 !== 0.30000000000000004)
 */

export class DecimalUtils {
  private static readonly SCALE = 100; // 2 decimal places for currency

  /**
   * Rounds a number to specified decimal places safely.
   */
  static round(val: number, decimals: number = 2): number {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  }

  /**
   * Safely adds multiple numbers.
   */
  static add(...nums: number[]): number {
    const sumCents = nums.reduce((acc, curr) => {
      const safe = isNaN(curr) ? 0 : curr;
      return acc + Math.round(safe * DecimalUtils.SCALE);
    }, 0);
    return sumCents / DecimalUtils.SCALE;
  }

  /**
   * Safely subtracts b from a (a - b).
   */
  static subtract(a: number, b: number): number {
    const aCents = Math.round((isNaN(a) ? 0 : a) * DecimalUtils.SCALE);
    const bCents = Math.round((isNaN(b) ? 0 : b) * DecimalUtils.SCALE);
    return (aCents - bCents) / DecimalUtils.SCALE;
  }

  /**
   * Safely multiplies two numbers with proper precision.
   */
  static multiply(a: number, b: number, decimals: number = 2): number {
    const safeA = isNaN(a) ? 0 : a;
    const safeB = isNaN(b) ? 0 : b;
    return DecimalUtils.round(safeA * safeB, decimals);
  }

  /**
   * Safely divides a by b with fallback to 0 if b is 0.
   */
  static divide(a: number, b: number, decimals: number = 2): number {
    if (!b || isNaN(b) || isNaN(a)) return 0;
    return DecimalUtils.round(a / b, decimals);
  }

  /**
   * Format number as currency string
   */
  static formatCurrency(amount: number, currency: string = 'INR'): string {
    const safe = DecimalUtils.round(amount, 2);
    try {
      if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(safe);
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(safe);
    } catch {
      return `${currency} ${safe.toFixed(2)}`;
    }
  }
}
