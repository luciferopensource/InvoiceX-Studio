import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { Flower2, Heart, Calendar, MapPin } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const FloralWeddingTemplate: React.FC<Props> = ({ document: doc }) => {
  const cfg = doc.templateConfig || {};
  const floralRose = cfg.accentColor || '#C25975'; // Soft Botanical Rose

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 relative overflow-hidden font-serif"
      style={{ backgroundColor: '#fffbfb' }}
    >
      {/* Botanical Header */}
      <div className="flex justify-between items-start pb-6 border-b-2" style={{ borderColor: `${floralRose}30` }}>
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-full bg-rose-50 border border-rose-200">
            <Flower2 className="w-8 h-8" style={{ color: floralRose }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-slate-900 font-serif">
              {doc.businessName}
            </h1>
            <p className="text-xs text-slate-600 font-sans mt-0.5">{doc.businessAddress}</p>
            <p className="text-xs text-rose-800 font-sans mt-1">
              {doc.businessEmail} • {doc.businessPhone}
            </p>
          </div>
        </div>

        <div className="text-right font-sans">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs"
            style={{ backgroundColor: floralRose }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1.5">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Date: {formatDate(doc.issueDate)}</p>
          {doc.dueDate && <p className="text-xs text-slate-500">Due: {formatDate(doc.dueDate)}</p>}
        </div>
      </div>

      {/* Romantic Floral Couple Card */}
      {doc.weddingDetails && (
        <div className="my-6 p-5 rounded-2xl bg-rose-50/70 border border-rose-200/60 text-center relative">
          <div className="flex items-center justify-center gap-2 text-rose-800 text-xs font-sans uppercase tracking-widest mb-1">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Celebrating The Wedding Of</span>
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 my-2 font-serif">
            {doc.weddingDetails.brideName || 'Bride'} &amp; {doc.weddingDetails.groomName || 'Groom'}
          </h2>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 font-sans mt-2">
            {doc.weddingDetails.weddingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-700" />
                {formatDate(doc.weddingDetails.weddingDate)}
              </span>
            )}
            {doc.weddingDetails.venueName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-700" />
                {doc.weddingDetails.venueName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Billed To & Events Grid */}
      <div className="grid grid-cols-2 gap-6 my-6 font-sans text-xs">
        <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: floralRose }}>
            Client Details
          </span>
          <p className="text-sm font-bold text-slate-900 font-serif mt-1">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-600 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 mt-1 whitespace-pre-line">{doc.customerBillingAddress}</p>
          {doc.customerPhone && <p className="text-slate-700 mt-1">Tel: {doc.customerPhone}</p>}
          {doc.customerGstin && <p className="font-mono text-slate-800">GSTIN: {doc.customerGstin}</p>}
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: floralRose }}>
            Venue &amp; Service Schedule
          </span>
          <p className="text-xs text-slate-800 font-medium mt-1">
            {doc.weddingDetails?.venueAddress || doc.customerShippingAddress || 'Wedding Venue'}
          </p>
          {doc.weddingDetails?.events && doc.weddingDetails.events.length > 0 && (
            <div className="mt-2 space-y-1">
              {doc.weddingDetails.events.slice(0, 3).map(ev => (
                <div key={ev.id} className="flex justify-between text-slate-600 text-[11px]">
                  <span>{ev.name}</span>
                  <span className="font-medium text-slate-800">{formatDate(ev.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left font-sans text-xs border-collapse my-6">
        <thead>
          <tr className="border-b-2 text-rose-950 font-serif text-xs uppercase" style={{ borderColor: floralRose }}>
            <th className="py-2.5 px-3">Service / Deliverable</th>
            <th className="py-2.5 px-2 text-center">HSN/SAC</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-100">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-rose-50/20">
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-rose-700">
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

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-8 my-6 font-sans text-xs">
        <div>
          <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-900">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-1 italic font-serif">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded-lg bg-white border border-rose-100 text-slate-600 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-900">Banking Details</span>
              <p><strong className="text-slate-800">A/C:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.bankName})</p>
              <p><strong className="text-slate-800">IFSC:</strong> {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p><strong className="text-slate-800">UPI:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-rose-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-rose-700">
              <span>Discount:</span>
              <span className="font-mono">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Taxes (GST):</span>
              <span className="font-mono">{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-rose-950 p-2.5 rounded-lg bg-rose-100/60 border border-rose-300">
            <span>Grand Total:</span>
            <span className="font-mono text-rose-900 font-bold">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Advance Paid:</span>
              <span className="font-mono text-emerald-700 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-rose-200">
            <span>Balance Due:</span>
            <span className="font-mono text-rose-700 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Sign-off */}
      <div className="mt-8 pt-4 border-t border-rose-200 flex justify-between items-end font-sans text-xs">
        <p className="text-[11px] text-slate-500 italic max-w-sm">
          {doc.terms || 'Wishing you a blissful union and memories to cherish for eternity.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-rose-300 pt-1 w-44">
            <p className="font-bold text-slate-800">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
