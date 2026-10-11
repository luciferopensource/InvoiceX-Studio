import { describe, it, expect } from 'vitest';
import { DecimalUtils } from '../src/core/calculations/decimal';
import { calculateLineItem, recalculateDocument } from '../src/core/calculations/financialCalculations';
import { InvoiceDocument, InvoiceLineItem } from '../src/core/types/invoice';

describe('Decimal Calculations & Financial Accuracy', () => {
  it('should accurately add decimals without floating point inaccuracy (0.1 + 0.2 === 0.3)', () => {
    const result = DecimalUtils.add(0.1, 0.2);
    expect(result).toBe(0.3);
  });

  it('should accurately subtract decimals', () => {
    const result = DecimalUtils.subtract(100.55, 30.25);
    expect(result).toBe(70.30);
  });

  it('should round numbers to 2 decimals accurately', () => {
    expect(DecimalUtils.round(123.456, 2)).toBe(123.46);
    expect(DecimalUtils.round(123.454, 2)).toBe(123.45);
  });

  it('should calculate tax-exclusive line items correctly (intra-state)', () => {
    const rawItem: Omit<InvoiceLineItem, 'taxableAmount' | 'cgstAmount' | 'sgstAmount' | 'igstAmount' | 'totalAmount' | 'cgstRate' | 'sgstRate' | 'igstRate'> = {
      id: '1',
      description: 'Wedding Photography',
      hsnSac: '998381',
      quantity: 2,
      unit: 'days',
      unitPrice: 50000,
      discount: 10,
      discountType: 'PERCENT', // 10% off of 100,000 = 10,000 off -> 90,000 net
      taxRate: 18,
      taxInclusive: false,
    };

    const calculated = calculateLineItem(rawItem, false);

    expect(calculated.taxableAmount).toBe(90000);
    expect(calculated.cgstRate).toBe(9);
    expect(calculated.sgstRate).toBe(9);
    expect(calculated.cgstAmount).toBe(8100);
    expect(calculated.sgstAmount).toBe(8100);
    expect(calculated.igstAmount).toBe(0);
    expect(calculated.totalAmount).toBe(106200);
  });

  it('should calculate tax-inclusive line items correctly (intra-state)', () => {
    const rawItem: Omit<InvoiceLineItem, 'taxableAmount' | 'cgstAmount' | 'sgstAmount' | 'igstAmount' | 'totalAmount' | 'cgstRate' | 'sgstRate' | 'igstRate'> = {
      id: '2',
      description: 'Catering Buffet',
      hsnSac: '996331',
      quantity: 100,
      unit: 'plates',
      unitPrice: 1050, // Total 105,000 inclusive of 5% tax
      discount: 0,
      discountType: 'FLAT',
      taxRate: 5,
      taxInclusive: true,
    };

    const calculated = calculateLineItem(rawItem, false);

    expect(calculated.taxableAmount).toBe(100000);
    expect(calculated.cgstAmount + calculated.sgstAmount).toBe(5000);
    expect(calculated.totalAmount).toBe(105000);
  });

  it('should calculate inter-state (IGST) correctly', () => {
    const rawItem: Omit<InvoiceLineItem, 'taxableAmount' | 'cgstAmount' | 'sgstAmount' | 'igstAmount' | 'totalAmount' | 'cgstRate' | 'sgstRate' | 'igstRate'> = {
      id: '3',
      description: 'Inter-State Wedding Production',
      hsnSac: '998381',
      quantity: 1,
      unit: 'pkg',
      unitPrice: 200000,
      discount: 0,
      discountType: 'FLAT',
      taxRate: 18,
      taxInclusive: false,
    };

    const calculated = calculateLineItem(rawItem, true);

    expect(calculated.taxableAmount).toBe(200000);
    expect(calculated.cgstAmount).toBe(0);
    expect(calculated.sgstAmount).toBe(0);
    expect(calculated.igstRate).toBe(18);
    expect(calculated.igstAmount).toBe(36000);
    expect(calculated.totalAmount).toBe(236000);
  });
});

describe('Document Totals and Payment Balance State Machine', () => {
  it('should correctly calculate status as PAID when outstanding balance is zero', () => {
    const doc: InvoiceDocument = {
      id: 'inv_test_1',
      documentNumber: 'INV-001',
      seriesPrefix: 'INV-',
      documentType: 'INVOICE',
      industryType: 'GENERAL',
      templateId: 'modern-corporate',
      templateConfig: {},
      status: 'ISSUED',
      issueDate: '2026-10-01',
      dueDate: '2026-10-15',
      currency: 'INR',
      placeOfSupply: '29-Karnataka',
      isInterState: false,
      reverseCharge: false,
      businessProfileId: 'b1',
      businessName: 'Lucifer Studio',
      businessAddress: 'MG Road',
      businessEmail: 'info@lucifer.com',
      businessPhone: '9876543210',
      customerName: 'Test Client',
      customerBillingAddress: 'Indiranagar',
      customerEmail: 'test@client.com',
      customerPhone: '9999999999',
      items: [
        {
          id: 'i1',
          description: 'Consultation',
          hsnSac: '998314',
          quantity: 1,
          unit: 'hrs',
          unitPrice: 10000,
          discount: 0,
          discountType: 'FLAT',
          taxRate: 18,
          taxInclusive: false,
          taxableAmount: 0,
          cgstRate: 0,
          cgstAmount: 0,
          sgstRate: 0,
          sgstAmount: 0,
          igstRate: 0,
          igstAmount: 0,
          totalAmount: 0,
        }
      ],
      subtotal: 0,
      totalDiscount: 0,
      additionalCharges: [],
      taxableAmount: 0,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      totalTax: 0,
      roundOff: 0,
      grandTotal: 0,
      amountInWords: '',
      payments: [
        {
          id: 'p1',
          invoiceId: 'inv_test_1',
          paymentDate: '2026-10-05',
          amount: 11800,
          paymentMethod: 'BANK_TRANSFER',
          createdAt: '2026-10-05',
        }
      ],
      totalPaid: 11800,
      outstandingBalance: 0,
      notes: '',
      terms: '',
      createdAt: '',
      updatedAt: '',
    };

    const recalculated = recalculateDocument(doc);
    expect(recalculated.grandTotal).toBe(11800);
    expect(recalculated.totalPaid).toBe(11800);
    expect(recalculated.outstandingBalance).toBe(0);
    expect(recalculated.status).toBe('PAID');
  });

  it('should set status to PARTIALLY_PAID when advance is received', () => {
    const doc: InvoiceDocument = {
      id: 'inv_test_2',
      documentNumber: 'INV-002',
      seriesPrefix: 'INV-',
      documentType: 'INVOICE',
      industryType: 'GENERAL',
      templateId: 'modern-corporate',
      templateConfig: {},
      status: 'ISSUED',
      issueDate: '2026-10-01',
      dueDate: '2026-10-30',
      currency: 'INR',
      placeOfSupply: '29-Karnataka',
      isInterState: false,
      reverseCharge: false,
      businessProfileId: 'b1',
      businessName: 'Lucifer Studio',
      businessAddress: 'MG Road',
      businessEmail: 'info@lucifer.com',
      businessPhone: '9876543210',
      customerName: 'Test Client',
      customerBillingAddress: 'Indiranagar',
      customerEmail: 'test@client.com',
      customerPhone: '9999999999',
      items: [
        {
          id: 'i1',
          description: 'Consultation',
          hsnSac: '998314',
          quantity: 1,
          unit: 'hrs',
          unitPrice: 10000,
          discount: 0,
          discountType: 'FLAT',
          taxRate: 18,
          taxInclusive: false,
          taxableAmount: 0,
          cgstRate: 0,
          cgstAmount: 0,
          sgstRate: 0,
          sgstAmount: 0,
          igstRate: 0,
          igstAmount: 0,
          totalAmount: 0,
        }
      ],
      subtotal: 0,
      totalDiscount: 0,
      additionalCharges: [],
      taxableAmount: 0,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      totalTax: 0,
      roundOff: 0,
      grandTotal: 0,
      amountInWords: '',
      payments: [
        {
          id: 'p1',
          invoiceId: 'inv_test_2',
          paymentDate: '2026-10-02',
          amount: 5000,
          paymentMethod: 'UPI',
          createdAt: '2026-10-02',
        }
      ],
      totalPaid: 5000,
      outstandingBalance: 6800,
      notes: '',
      terms: '',
      createdAt: '',
      updatedAt: '',
    };

    const recalculated = recalculateDocument(doc);
    expect(recalculated.grandTotal).toBe(11800);
    expect(recalculated.totalPaid).toBe(5000);
    expect(recalculated.outstandingBalance).toBe(6800);
    expect(recalculated.status).toBe('PARTIALLY_PAID');
  });
});
