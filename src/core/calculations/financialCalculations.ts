import { InvoiceDocument, InvoiceLineItem, PaymentRecord } from '../types/invoice';
import { DecimalUtils } from './decimal';
import { formatAmountInWords } from './amountInWords';

export interface CalculationOptions {
  autoRoundOff?: boolean;
}

/**
 * Recalculates line item values with full decimal precision.
 */
export function calculateLineItem(
  item: Omit<InvoiceLineItem, 'taxableAmount' | 'cgstAmount' | 'sgstAmount' | 'igstAmount' | 'totalAmount' | 'cgstRate' | 'sgstRate' | 'igstRate'>,
  isInterState: boolean
): InvoiceLineItem {
  const qty = DecimalUtils.round(Math.max(0, item.quantity || 0), 4);
  const unitPrice = DecimalUtils.round(Math.max(0, item.unitPrice || 0), 2);
  const rawLinePrice = DecimalUtils.multiply(qty, unitPrice);

  // Discount
  let discountAmount = 0;
  if (item.discount > 0) {
    if (item.discountType === 'PERCENT') {
      discountAmount = DecimalUtils.multiply(rawLinePrice, (item.discount / 100));
    } else {
      discountAmount = DecimalUtils.round(Math.min(rawLinePrice, item.discount), 2);
    }
  }
  const netAmount = Math.max(0, DecimalUtils.subtract(rawLinePrice, discountAmount));

  const taxRate = Math.max(0, item.taxRate || 0);
  let taxableAmount = 0;
  let totalTax = 0;

  if (taxRate === 0) {
    taxableAmount = netAmount;
    totalTax = 0;
  } else if (item.taxInclusive) {
    // Taxable = Net / (1 + (Rate / 100))
    taxableAmount = DecimalUtils.round(netAmount / (1 + taxRate / 100), 2);
    totalTax = DecimalUtils.subtract(netAmount, taxableAmount);
  } else {
    // Taxable = Net
    taxableAmount = netAmount;
    totalTax = DecimalUtils.round((taxableAmount * taxRate) / 100, 2);
  }

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstRate = taxRate;
    igstAmount = totalTax;
  } else {
    cgstRate = DecimalUtils.round(taxRate / 2, 2);
    sgstRate = DecimalUtils.round(taxRate / 2, 2);
    // Split totalTax evenly
    cgstAmount = DecimalUtils.round(totalTax / 2, 2);
    sgstAmount = DecimalUtils.subtract(totalTax, cgstAmount);
  }

  const totalAmount = DecimalUtils.add(taxableAmount, totalTax);

  return {
    ...item,
    quantity: qty,
    unitPrice,
    taxableAmount,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalAmount,
  };
}

/**
 * Calculates complete document totals, payment balances, and status
 */
export function recalculateDocument(
  doc: InvoiceDocument,
  options: CalculationOptions = { autoRoundOff: true }
): InvoiceDocument {
  if (!doc) {
    throw new Error('recalculateDocument: doc must be defined');
  }
  const isInterState = doc.isInterState ?? false;

  // Recalculate every line item
  const items = doc.items || [];
  const recalculatedItems = items.map(item => calculateLineItem(item, isInterState));

  // Subtotal (Sum of item taxable amounts)
  const subtotal = recalculatedItems.reduce((acc, curr) => DecimalUtils.add(acc, curr.taxableAmount), 0);

  // Total Item Discounts
  const totalDiscount = recalculatedItems.reduce((acc, curr) => {
    const rawPrice = DecimalUtils.multiply(curr.quantity, curr.unitPrice);
    const itemDisc = curr.discountType === 'PERCENT'
      ? DecimalUtils.multiply(rawPrice, (curr.discount / 100))
      : DecimalUtils.round(curr.discount || 0, 2);
    return DecimalUtils.add(acc, itemDisc);
  }, 0);

  // Additional Charges
  const totalAdditionalCharges = (doc.additionalCharges || []).reduce(
    (acc, curr) => DecimalUtils.add(acc, curr.amount || 0),
    0
  );

  // Taxes
  const totalCgst = recalculatedItems.reduce((acc, curr) => DecimalUtils.add(acc, curr.cgstAmount), 0);
  const totalSgst = recalculatedItems.reduce((acc, curr) => DecimalUtils.add(acc, curr.sgstAmount), 0);
  const totalIgst = recalculatedItems.reduce((acc, curr) => DecimalUtils.add(acc, curr.igstAmount), 0);
  const totalTax = DecimalUtils.add(totalCgst, totalSgst, totalIgst);

  // Raw Total before Round-Off
  const rawTotal = DecimalUtils.add(subtotal, totalAdditionalCharges, totalTax);

  // Round Off calculation
  let roundOff = 0;
  let grandTotal = rawTotal;

  if (options.autoRoundOff) {
    const roundedInt = Math.round(rawTotal);
    roundOff = DecimalUtils.round(roundedInt - rawTotal, 2);
    grandTotal = DecimalUtils.add(rawTotal, roundOff);
  } else {
    roundOff = doc.roundOff || 0;
    grandTotal = DecimalUtils.add(rawTotal, roundOff);
  }

  // Payments & Balance
  const totalPaid = (doc.payments || []).reduce(
    (acc, curr) => DecimalUtils.add(acc, curr.amount || 0),
    0
  );
  const outstandingBalance = Math.max(0, DecimalUtils.subtract(grandTotal, totalPaid));

  // Amount in Words
  const amountInWords = formatAmountInWords(grandTotal, doc.currency || 'INR');

  // Status calculation
  let status = doc.status;
  if (status !== 'DRAFT' && status !== 'CANCELLED') {
    if (grandTotal > 0 && outstandingBalance === 0) {
      status = 'PAID';
    } else if (totalPaid > 0 && outstandingBalance > 0) {
      status = 'PARTIALLY_PAID';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (doc.dueDate && doc.dueDate < today && outstandingBalance > 0) {
        status = 'OVERDUE';
      } else {
        status = 'ISSUED';
      }
    }
  }

  return {
    ...doc,
    items: recalculatedItems,
    subtotal,
    totalDiscount,
    taxableAmount: subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    roundOff,
    grandTotal,
    amountInWords,
    totalPaid,
    outstandingBalance,
    status,
  };
}
