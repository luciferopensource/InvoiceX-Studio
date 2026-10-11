import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { HeartHandshake, Calendar, MapPin, Sparkles } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const ElegantWeddingTemplate: React.FC<Props> = ({ document: doc }) => {
  const cfg = doc.templateConfig || {};
  const accent = cfg.accentColor || '#C5A059'; // Champagne Gold

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 relative overflow-hidden"
      style={{
        backgroundColor: '#fffdfa',
        fontFamily: 'Playfair Display, Georgia, serif',
      }}
    >
      {/* Delicate Filigree Top Border */}
      <div className="border-b-2 pb-6 flex justify-between items-end" style={{ borderColor: accent }}>
        <div>
          <span className="text-[11px] uppercase tracking-widest text-amber-700 font-sans block mb-1">
            Luxury Nuptials & Bespoke Celebrations
          </span>
          <h1 className="text-3xl font-bold tracking-wide text-slate-900 font-serif">
            {doc.businessName}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-sm font-sans">{doc.businessAddress}</p>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {doc.businessPhone} • {doc.businessEmail}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold tracking-widest uppercase font-sans text-amber-800">
            {doc.documentType.replace('_', ' ')}
          </p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {doc.documentNumber}
          </p>
          <p className="text-xs text-slate-600 font-sans mt-1">
            Date: {formatDate(doc.issueDate)}
          </p>
          {doc.dueDate && (
            <p className="text-xs text-slate-500 font-sans">
              Due: {formatDate(doc.dueDate)}
            </p>
          )}
        </div>
      </div>

      {/* Romantic Bride & Groom Banner */}
      {doc.weddingDetails && (
        <div
          className="my-6 p-6 rounded-xl text-center relative"
          style={{
            backgroundColor: '#fcf8f2',
            border: `1px solid ${accent}40`,
          }}
        >
          <div className="flex items-center justify-center gap-2 text-amber-700 text-xs tracking-widest uppercase font-sans mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honoring The Union Of</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 my-2 tracking-wide">
            {doc.weddingDetails.brideName || 'Bride'} & {doc.weddingDetails.groomName || 'Groom'}
          </h2>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 font-sans mt-2">
            {doc.weddingDetails.weddingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                {formatDate(doc.weddingDetails.weddingDate)}
              </span>
            )}
            {doc.weddingDetails.venueName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                {doc.weddingDetails.venueName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Client & Event Info */}
      <div className="grid grid-cols-2 gap-8 my-6 text-xs font-sans">
        <div className="p-4 rounded-lg bg-white border border-amber-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
            Presented To
          </span>
          <p className="text-sm font-bold text-slate-900 font-serif mt-1">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-600 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 mt-1 whitespace-pre-line">{doc.customerBillingAddress}</p>
          {doc.customerPhone && <p className="mt-1 text-slate-700">Phone: {doc.customerPhone}</p>}
          {doc.customerEmail && <p className="text-slate-700">Email: {doc.customerEmail}</p>}
          {doc.customerGstin && <p className="mt-1 font-mono text-slate-900">GSTIN: {doc.customerGstin}</p>}
        </div>

        <div className="p-4 rounded-lg bg-white border border-amber-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
            Event Coordination & Venue
          </span>
          <p className="text-xs text-slate-800 font-medium mt-1">
            {doc.weddingDetails?.venueAddress || doc.customerShippingAddress || 'Main Celebration Venue'}
          </p>
          {doc.weddingDetails?.coordinatorName && (
            <p className="mt-2 text-slate-600">
              Coordinator: <strong className="text-slate-900">{doc.weddingDetails.coordinatorName}</strong>
              {doc.weddingDetails.coordinatorPhone && ` (${doc.weddingDetails.coordinatorPhone})`}
            </p>
          )}
          {doc.placeOfSupply && (
            <p className="mt-1 text-slate-600 font-mono">
              Place of Supply: <span className="text-slate-900 font-semibold">{doc.placeOfSupply}</span>
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left font-sans text-xs border-collapse my-6">
        <thead>
          <tr className="border-b-2 text-slate-900 font-serif text-xs uppercase tracking-wider" style={{ borderColor: accent }}>
            <th className="py-2.5 px-2">Item</th>
            <th className="py-2.5 px-2 text-center">HSN/SAC</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Price</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100/80">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-amber-50/30">
              <td className="py-3 px-2">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center text-slate-700">
                {item.quantity} {item.unit}
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-amber-700">
                  {item.discount > 0 ? (item.discountType === 'PERCENT' ? `${item.discount}%` : formatDocCurrency(item.discount, doc.currency)) : '-'}
                </td>
              )}
              <td className="py-3 px-2 text-center font-mono text-slate-600">{item.taxRate}%</td>
              <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                {formatDocCurrency(item.totalAmount, doc.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Milestone Payments Breakdown (If wedding milestones present) */}
      {doc.weddingDetails?.milestones && doc.weddingDetails.milestones.length > 0 && (
        <div className="my-6 p-4 rounded-lg bg-amber-50/50 border border-amber-200/60 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase text-[11px] mb-2">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <span>Agreed Payment Milestones</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {doc.weddingDetails.milestones.map((ms) => (
              <div key={ms.id} className="p-2.5 rounded bg-white border border-amber-100 shadow-2xs">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-900">{ms.title}</span>
                  {ms.paid && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">PAID</span>}
                </div>
                <p className="text-sm font-bold text-amber-900 font-mono mt-1">{formatDocCurrency(ms.amount, doc.currency)}</p>
                {ms.dueDate && <p className="text-[10px] text-slate-500 mt-0.5">Due: {formatDate(ms.dueDate)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-8 my-6 font-sans text-xs">
        <div>
          <div className="p-3 rounded bg-white border border-amber-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-1 italic font-serif">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded bg-white border border-amber-100 text-xs text-slate-600 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">Direct Bank Deposit</span>
              <p><strong className="text-slate-800">Bank:</strong> {doc.bankDetails.bankName}</p>
              <p><strong className="text-slate-800">A/C:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.ifsc})</p>
              {doc.bankDetails.upiId && <p><strong className="text-slate-800">UPI:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-amber-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Savings / Discount:</span>
              <span className="font-mono">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Taxes (GST):</span>
              <span className="font-mono">{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-slate-900 p-2.5 rounded bg-amber-50 border border-amber-200">
            <span className="font-serif">Grand Total:</span>
            <span className="font-mono text-amber-900">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Advance Paid:</span>
              <span className="font-mono text-emerald-700">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-amber-200">
            <span>Balance Payable:</span>
            <span className="font-mono text-rose-700">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Sign-off */}
      <div className="mt-8 pt-4 border-t border-amber-200 flex justify-between items-end font-sans text-xs">
        <p className="text-[11px] text-slate-500 italic max-w-sm">
          {doc.notes || 'Wishing the esteemed couple boundless joy, laughter, and timeless celebrations.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-amber-300 pt-1 w-44">
            <p className="font-bold text-slate-800">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
