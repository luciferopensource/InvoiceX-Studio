import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { Laptop, Clock, CheckCircle } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const FreelanceServicesTemplate: React.FC<Props> = ({ document: doc }) => {
  const teal = '#0D9488';

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 bg-white font-sans text-xs relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Laptop className="w-6 h-6" style={{ color: teal }} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {doc.businessName}
            </h1>
          </div>
          <p className="text-xs text-slate-500">{doc.businessAddress}</p>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            {doc.businessEmail} • {doc.businessPhone}
          </p>
        </div>

        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white mb-1.5"
            style={{ backgroundColor: teal }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Invoice Date: {formatDate(doc.issueDate)}</p>
          {doc.dueDate && <p className="text-xs text-slate-500">Payment Due: {formatDate(doc.dueDate)}</p>}
        </div>
      </div>

      {/* Client Strip */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-lg bg-teal-50/40 border border-teal-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: teal }}>
            Billed To Client
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-600 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 whitespace-pre-line mt-0.5">{doc.customerBillingAddress}</p>
          {doc.customerEmail && <p className="text-slate-700 mt-1">E: {doc.customerEmail}</p>}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: teal }}>
            Project &amp; Milestone Scope
          </span>
          <p className="text-xs text-slate-800 font-medium mt-0.5">
            {doc.customerShippingAddress || 'Sprint Deliverables & Technical Services'}
          </p>
          <div className="mt-2 text-[11px] text-teal-800 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Code &amp; Assets Delivered / Repository Merged</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse my-6">
        <thead>
          <tr className="text-white text-xs uppercase" style={{ backgroundColor: teal }}>
            <th className="py-2.5 px-3 rounded-l">Deliverable / Milestone Task</th>
            <th className="py-2.5 px-2 text-center">SAC Code</th>
            <th className="py-2.5 px-2 text-center">Hours / Units</th>
            <th className="py-2.5 px-3 text-right">Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-teal-100">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-teal-50/20' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '998314'}</td>
              <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-teal-700">
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
          <div className="p-3 rounded-md bg-teal-50/60 border border-teal-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-900">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Fast Payment (UPI / Bank)</span>
              <p><strong>A/C:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.bankName})</p>
              <p><strong>IFSC:</strong> {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p><strong>UPI:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-teal-700">
              <span>Discount:</span>
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
            className="flex justify-between text-sm font-bold text-white p-3 rounded-md mt-2 shadow-sm"
            style={{ backgroundColor: teal }}
          >
            <span>Total Payable:</span>
            <span className="font-mono text-teal-100">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Retainer Paid:</span>
              <span className="font-mono text-emerald-600 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-slate-300">
            <span>Balance Due:</span>
            <span className="font-mono text-rose-600 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Sign-off */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
        <p className="text-[11px] text-slate-500 max-w-sm">
          {doc.terms || 'Full intellectual property rights transferred upon receipt of final settlement.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-slate-400 pt-1 w-44">
            <p className="font-bold text-slate-900">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Independent Professional</p>
          </div>
        </div>
      </div>
    </div>
  );
};
