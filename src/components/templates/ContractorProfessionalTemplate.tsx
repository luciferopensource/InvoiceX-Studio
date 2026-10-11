import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { HardHat, Ruler, ShieldAlert } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const ContractorProfessionalTemplate: React.FC<Props> = ({ document: doc }) => {
  const slate = '#334155';
  const blue = '#0284C7';

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 bg-white font-sans text-xs relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b-2" style={{ borderColor: slate }}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg text-white shadow-sm" style={{ backgroundColor: slate }}>
            <HardHat className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {doc.businessName}
            </h1>
            <p className="text-xs text-slate-500">{doc.businessAddress}</p>
            <p className="text-xs text-slate-700 font-mono mt-0.5">
              License / Reg: {doc.businessPan || 'Licensed General Contractor'} • Tel: {doc.businessPhone}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white mb-1.5"
            style={{ backgroundColor: slate }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Valuation Date: {formatDate(doc.issueDate)}</p>
          {doc.dueDate && <p className="text-xs text-slate-500">Progress Due: {formatDate(doc.dueDate)}</p>}
        </div>
      </div>

      {/* Project Site & Client Strip */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Client / Project Owner
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-600 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 whitespace-pre-line mt-0.5 leading-relaxed">{doc.customerBillingAddress}</p>
          {doc.customerPhone && <p className="text-slate-700 mt-1">Phone: {doc.customerPhone}</p>}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Job Site &amp; Scope Reference
          </span>
          <p className="text-xs text-slate-800 font-medium mt-0.5">
            {doc.customerShippingAddress || 'Project Construction & Finishing Site'}
          </p>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5 font-mono">
            <Ruler className="w-3.5 h-3.5 text-sky-600" />
            <span>Progress Billing Certificate / Site Execution</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse my-6">
        <thead>
          <tr className="text-white text-xs uppercase" style={{ backgroundColor: slate }}>
            <th className="py-2.5 px-3 rounded-l">Scope Item / Trade Work</th>
            <th className="py-2.5 px-2 text-center">HSN/SAC</th>
            <th className="py-2.5 px-2 text-center">Qty / Units</th>
            <th className="py-2.5 px-3 text-right">Unit Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '995411'}</td>
              <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-sky-600">
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
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Valuation in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Commercial Account Wire</span>
              <p><strong>A/C:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.bankName})</p>
              <p><strong>IFSC:</strong> {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p><strong>UPI ID:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Progress Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-sky-700">
              <span>Negotiated Adjustment:</span>
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
            style={{ backgroundColor: slate }}
          >
            <span>Certified Payable:</span>
            <span className="font-mono text-amber-300">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
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
          {doc.terms || 'Work executed as per sanctioned drawings, site specifications, and quality benchmarks.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-slate-400 pt-1 w-44">
            <p className="font-bold text-slate-900">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Project Engineer / Contractor</p>
          </div>
        </div>
      </div>
    </div>
  );
};
