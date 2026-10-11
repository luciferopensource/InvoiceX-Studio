import { DecimalUtils } from '../../core/calculations/decimal';

export function formatDocCurrency(amount: number, currency: string = 'INR'): string {
  return DecimalUtils.formatCurrency(amount, currency);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
