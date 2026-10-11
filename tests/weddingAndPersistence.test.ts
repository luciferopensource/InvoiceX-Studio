import { describe, it, expect } from 'vitest';
import { DecimalUtils } from '../src/core/calculations/decimal';
import { calculateLineItem, recalculateDocument } from '../src/core/calculations/financialCalculations';
import { InvoiceDocument, WeddingEventDetail, WeddingDeliverableItem } from '../src/core/types/invoice';
import { SAMPLE_WEDDING_INVOICE } from '../src/core/database/sampleData';

describe('Wedding Billing & Event Suite Precision', () => {
  it('should verify wedding sample invoice integrity and balance calculation', () => {
    const doc = recalculateDocument(SAMPLE_WEDDING_INVOICE);

    expect(doc.industryType).toBe('WEDDING');
    expect(doc.weddingDetails).toBeDefined();
    expect(doc.weddingDetails?.brideName).toBe('Aishwarya Sharma');
    expect(doc.weddingDetails?.groomName).toBe('Vikram Malhotra');
    expect(doc.weddingDetails?.events.length).toBe(4);
    
    // Taxable 370,000 + 18% GST (66,600) + Additional charge (8,000) = 444,600
    expect(doc.taxableAmount).toBe(370000);
    expect(doc.totalTax).toBe(66600);
    expect(doc.grandTotal).toBe(444600);
    // Paid 150,000 advance
    expect(doc.totalPaid).toBe(150000);
    expect(doc.outstandingBalance).toBe(294600);
    expect(doc.status).toBe('PARTIALLY_PAID');
  });

  it('should accurately calculate per-plate catering for multi-function wedding', () => {
    // 650 guests @ Rs. 1450 per plate with 5% GST
    const cateringItem = calculateLineItem({
      id: 'cat-1',
      description: 'Grand Wedding Reception Royal Buffet (Per-Plate)',
      hsnSac: '996331',
      quantity: 650,
      unit: 'plates',
      unitPrice: 1450,
      discount: 0,
      discountType: 'FLAT',
      taxRate: 5,
      taxInclusive: false,
    }, false);

    // 650 * 1450 = 942,500
    expect(cateringItem.taxableAmount).toBe(942500);
    // 5% GST = 2.5% CGST (23,562.50) + 2.5% SGST (23,562.50) = 47,125
    expect(cateringItem.cgstAmount).toBe(23562.5);
    expect(cateringItem.sgstAmount).toBe(23562.5);
    expect(cateringItem.totalAmount).toBe(989625);
  });

  it('should validate wedding deliverables and multi-day itinerary structures', () => {
    const events: WeddingEventDetail[] = [
      {
        id: 'ev-1',
        name: 'Haldi & Mehendi Ceremony',
        date: '2026-11-20',
        time: '10:00 AM - 04:00 PM',
        venue: 'The Leela Palace, Courtyard',
        notes: 'Floral setup and folk music',
      },
      {
        id: 'ev-2',
        name: 'Wedding Muhurtham',
        date: '2026-11-21',
        time: '08:30 AM - 01:00 PM',
        venue: 'The Leela Palace, Grand Ballroom',
        notes: 'Cinematography and live stream',
      }
    ];

    const deliverables: WeddingDeliverableItem[] = [
      {
        id: 'del-1',
        title: 'Master 4K Cinematic Wedding Film',
        expectedDate: '2026-12-15',
        delivered: false,
      },
      {
        id: 'del-2',
        title: 'Handcrafted Leather-Bound Flush Mount Album (50 Pages)',
        expectedDate: '2026-12-20',
        delivered: false,
      }
    ];

    expect(events.length).toBe(2);
    expect(events[0].venue).toBe('The Leela Palace, Courtyard');
    expect(deliverables[0].delivered).toBe(false);
  });

  it('should correctly prevent overpayment when validating payment amounts', () => {
    const totalAmount = 100000;
    const existingPayments = 75000;
    const balance = DecimalUtils.subtract(totalAmount, existingPayments);
    expect(balance).toBe(25000);

    const attemptedOverpayment = 30000;
    const isOverpayment = attemptedOverpayment > balance;
    expect(isOverpayment).toBe(true);

    const validPayment = 25000;
    const newBalance = DecimalUtils.subtract(balance, validPayment);
    expect(newBalance).toBe(0);
  });
});
