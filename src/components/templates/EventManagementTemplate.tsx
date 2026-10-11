import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { CalendarRange, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const EventManagementTemplate: React.FC<Props> = ({ document: doc }) => {
  const indigo = '#4F46E5';

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 bg-white font-sans text-xs relative overflow-hidden"
    >
      {/* Top Banner */}
      <div className="h-2 w-full mb-6 rounded-full" style={{ backgroundColor: indigo }} />

      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl text-white shadow-sm" style={{ backgroundColor: indigo }}>
            <CalendarRange className="w-8 h-8 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {doc.businessName}
            </h1>
            <p className="text-xs text-slate-500">{doc.businessAddress}</p>
            <p className="text-xs text-indigo-700 font-mono mt-0.5">
              GSTIN: {doc.businessGstin || 'Reg. Event Production'} • {doc.businessPhone}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-1.5"
            style={{ backgroundColor: indigo }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Date: {formatDate(doc.issueDate)}</p>
          {doc.dueDate && <p className="text-xs text-slate-500">Milestone Due: {formatDate(doc.dueDate)}</p>}
        </div>
      </div>

      {/* Client & Production Strip */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-indigo-50/40 border border-indigo-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: indigo }}>
            Host / Organizing Client
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-600 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 whitespace-pre-line mt-0.5">{doc.customerBillingAddress}</p>
          {doc.customerPhone && <p className="text-slate-700 mt-1">Phone: {doc.customerPhone}</p>}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: indigo }}>
            Event Scope &amp; Production Venue
          </span>
          <p className="text-xs text-slate-800 font-medium mt-0.5">
            {doc.weddingDetails?.venueName || doc.customerShippingAddress || 'Main Venue Production'}
          </p>
          {doc.weddingDetails?.coordinatorName && (
            <p className="text-xs text-indigo-900 mt-1.5">
              Director: <strong>{doc.weddingDetails.coordinatorName}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Event Timeline Progression if present */}
      {doc.weddingDetails?.events && doc.weddingDetails.events.length > 0 && (
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Production Schedule &amp; Execution Timeline
          </span>
          <div className="grid grid-cols-3 gap-3">
            {doc.weddingDetails.events.map(ev => (
              <div key={ev.id} className="p-2.5 rounded-lg bg-white border border-slate-200">
                <p className="font-semibold text-slate-900">{ev.name}</p>
                <p className="text-[11px] text-indigo-600 font-medium mt-0.5">{formatDate(ev.date)} • {ev.time}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{ev.venue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse my-6">
        <thead>
          <tr className="text-white text-xs uppercase" style={{ backgroundColor: indigo }}>
            <th className="py-2.5 px-3 rounded-l">Production Service / Element</th>
            <th className="py-2.5 px-2 text-center">SAC</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Fee</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-100">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-indigo-50/20' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '998596'}</td>
              <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-indigo-600">
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

      {/* Totals */}
      <div className="grid grid-cols-2 gap-8 my-6">
        <div>
          <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Direct Wire Transfer</span>
              <p><strong>A/C:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.bankName})</p>
              <p><strong>IFSC:</strong> {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p><strong>UPI:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Production Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-indigo-700">
              <span>Client Privilege Discount:</span>
              <span className="font-mono">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>GST Total:</span>
              <span className="font-mono">{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div
            className="flex justify-between text-sm font-bold text-white p-3 rounded-lg mt-2 shadow-sm"
            style={{ backgroundColor: indigo }}
          >
            <span>Grand Total:</span>
            <span className="font-mono text-indigo-100">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Advance Paid:</span>
              <span className="font-mono text-emerald-600 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-slate-300">
            <span>Outstanding Balance:</span>
            <span className="font-mono text-rose-600 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Sign-off */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
        <p className="text-[11px] text-slate-500 max-w-sm">
          {doc.terms || 'All production permits, safety clearances, and venue liaison included.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-slate-400 pt-1 w-44">
            <p className="font-bold text-slate-900">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Event Producer</p>
          </div>
        </div>
      </div>
    </div>
  );
};
