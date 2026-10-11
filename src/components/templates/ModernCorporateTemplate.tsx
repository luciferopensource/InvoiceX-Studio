import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { Building2, QrCode } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const ModernCorporateTemplate: React.FC<Props> = ({ document: doc }) => {
  const cfg = doc.templateConfig || {};
  const navy = '#0f172a';
  const blue = cfg.accentColor || '#2563eb';

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 bg-white font-sans text-xs relative overflow-hidden"
    >
      {/* Top Banner Accent */}
      <div className="h-2 w-full mb-6 rounded" style={{ backgroundColor: blue }} />

      {/* Corporate Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="w-6 h-6" style={{ color: blue }} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {doc.businessName}
            </h1>
          </div>
          <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed max-w-sm">{doc.businessAddress}</p>
          <div className="mt-2 text-xs text-slate-600 font-mono space-y-0.5">
            {doc.businessGstin && <p>GSTIN: <span className="text-slate-900 font-semibold">{doc.businessGstin}</span></p>}
            <p>E: {doc.businessEmail} | T: {doc.businessPhone}</p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white mb-2"
            style={{ backgroundColor: navy }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <div className="mt-2 space-y-0.5 text-xs text-slate-500">
            <p>Date: <strong className="text-slate-800">{formatDate(doc.issueDate)}</strong></p>
            {doc.dueDate && <p>Due: <strong className="text-slate-800">{formatDate(doc.dueDate)}</strong></p>}
          </div>
        </div>
      </div>

      {/* Billing & Client Strip */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: blue }}>
            Client / Account
          </span>
          <p className="text-sm font-bold text-slate-900 mt-1">{doc.customerName}</p>
          {doc.customerCompany && <p className="font-semibold text-slate-700">{doc.customerCompany}</p>}
          <p className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">{doc.customerBillingAddress}</p>
          {doc.customerGstin && <p className="mt-1 font-mono text-slate-800">GSTIN: {doc.customerGstin}</p>}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: blue }}>
            Delivery Location / Project
          </span>
          <p className="text-slate-700 mt-1 leading-relaxed">
            {doc.customerShippingAddress || doc.customerBillingAddress}
          </p>
          {doc.placeOfSupply && (
            <p className="mt-2 text-slate-600 font-mono text-[11px]">
              Place of Supply: <strong className="text-slate-900">{doc.placeOfSupply}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse my-6">
        <thead>
          <tr className="text-white text-xs uppercase" style={{ backgroundColor: navy }}>
            <th className="py-2.5 px-3 rounded-l">Item &amp; Description</th>
            <th className="py-2.5 px-2 text-center">HSN/SAC</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-blue-600">
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

      {/* Summary Block */}
      <div className="grid grid-cols-2 gap-8 my-6">
        <div>
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded bg-blue-50/40 border border-blue-100 flex items-start gap-4">
              <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
              <div className="text-xs text-slate-700 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: blue }}>Payment Channel</span>
                <p><strong>Bank:</strong> {doc.bankDetails.bankName}</p>
                <p><strong>A/C No:</strong> {doc.bankDetails.accountNumber}</p>
                <p><strong>IFSC:</strong> {doc.bankDetails.ifsc}</p>
                {doc.bankDetails.upiId && <p><strong>UPI:</strong> {doc.bankDetails.upiId}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Total Discount:</span>
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
            className="flex justify-between text-sm font-bold text-white p-3 rounded mt-2 shadow-sm"
            style={{ backgroundColor: navy }}
          >
            <span>Grand Total:</span>
            <span className="font-mono text-cyan-300">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Paid / Credited:</span>
              <span className="font-mono text-emerald-600 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-slate-300">
            <span>Total Outstanding:</span>
            <span className="font-mono text-rose-600 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
        <p className="text-[11px] text-slate-500 max-w-sm">
          {doc.terms || 'Standard corporate payment terms apply. Interest applicable on delayed disbursements.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-slate-400 pt-1 w-44">
            <p className="font-bold text-slate-900">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Corporate Finance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
