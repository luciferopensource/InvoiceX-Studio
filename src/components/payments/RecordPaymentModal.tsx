import React, { useState } from 'react';
import { InvoiceDocument, PaymentMethod, PaymentRecord } from '../../core/types/invoice';
import { DecimalUtils } from '../../core/calculations/decimal';
import { CreditCard, X, Check, AlertCircle } from 'lucide-react';

interface Props {
  invoice: InvoiceDocument;
  onClose: () => void;
  onRecord: (updatedInvoice: InvoiceDocument) => void;
}

export const RecordPaymentModal: React.FC<Props> = ({
  invoice,
  onClose,
  onRecord,
}) => {
  const [amount, setAmount] = useState<number>(invoice.outstandingBalance);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('Payment received with thanks.');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }

    if (amount > invoice.outstandingBalance + 0.01) {
      setError(`Payment amount cannot exceed outstanding balance of ${DecimalUtils.formatCurrency(invoice.outstandingBalance, invoice.currency)}.`);
      return;
    }

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      invoiceId: invoice.id,
      paymentDate,
      amount: DecimalUtils.round(amount, 2),
      paymentMethod,
      referenceNumber: referenceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      receiptNumber: `REC-${invoice.documentNumber.replace(/^[A-Z]+-/, '')}`,
      createdAt: new Date().toISOString(),
    };

    const newPayments = [...(invoice.payments || []), newPayment];
    const newTotalPaid = DecimalUtils.add(invoice.totalPaid || 0, newPayment.amount);
    const newOutstanding = Math.max(0, DecimalUtils.subtract(invoice.grandTotal, newTotalPaid));
    const newStatus = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const updatedInvoice: InvoiceDocument = {
      ...invoice,
      payments: newPayments,
      totalPaid: newTotalPaid,
      outstandingBalance: newOutstanding,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    onRecord(updatedInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-md rounded-2xl p-6 border text-xs space-y-4 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Record Payment / Advance</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Invoice:</span>
            <span className="text-amber-400 font-bold">{invoice.documentNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Client:</span>
            <span className="text-white">{invoice.customerName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Grand Total:</span>
            <span className="text-white">{DecimalUtils.formatCurrency(invoice.grandTotal, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Already Received:</span>
            <span className="text-emerald-400">{DecimalUtils.formatCurrency(invoice.totalPaid, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-1 border-t border-white/10 font-bold">
            <span className="text-white font-sans">Current Balance:</span>
            <span className="text-rose-400 text-sm">
              {DecimalUtils.formatCurrency(invoice.outstandingBalance, invoice.currency)}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Payment Amount ({invoice.currency}) *
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(parseFloat(e.target.value) || 0);
                setError(null);
              }}
              className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono font-bold text-base focus:border-amber-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="BANK_TRANSFER">Bank Wire / NEFT / IMPS</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="ONLINE">Online Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              UTR / Transaction / Reference No.
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. HDFCR52026101500098"
              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or receipt remarks"
              className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold text-white shadow-md transition-all"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
              }}
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
