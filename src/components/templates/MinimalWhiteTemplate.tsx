import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';

interface Props {
  document: InvoiceDocument;
}

export const MinimalWhiteTemplate: React.FC<Props> = ({ document: doc }) => {
  return (
    <div
      className="invoice-page-sheet p-12 text-black bg-white font-sans text-xs relative overflow-hidden"
      style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
    >
      {/* Top Meta Bar */}
      <div className="flex justify-between items-baseline border-b-2 border-black pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
            {doc.businessName}
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">{doc.businessEmail} • {doc.businessPhone}</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            {doc.documentType}
          </span>
          <p className="text-xl font-mono font-bold text-black">
            #{doc.documentNumber}
          </p>
        </div>
      </div>

      {/* Grid: Seller, Buyer, Dates */}
      <div className="grid grid-cols-3 gap-8 py-4 border-b border-neutral-200 mb-8 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">From</span>
          <p className="font-semibold text-neutral-900">{doc.businessName}</p>
          <p className="text-neutral-500 whitespace-pre-line leading-relaxed">{doc.businessAddress}</p>
          {doc.businessGstin && <p className="font-mono text-neutral-600 mt-1">GSTIN: {doc.businessGstin}</p>}
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">To</span>
          <p className="font-semibold text-neutral-900">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-neutral-600">{doc.customerCompany}</p>}
          <p className="text-neutral-500 whitespace-pre-line leading-relaxed">{doc.customerBillingAddress}</p>
          {doc.customerGstin && <p className="font-mono text-neutral-600 mt-1">GSTIN: {doc.customerGstin}</p>}
        </div>

        <div className="text-right space-y-1 font-mono">
          <div>
            <span className="text-[10px] uppercase text-neutral-400 block">Issue Date</span>
            <span className="font-semibold text-neutral-900">{formatDate(doc.issueDate)}</span>
          </div>
          {doc.dueDate && (
            <div>
              <span className="text-[10px] uppercase text-neutral-400 block">Payment Due</span>
              <span className="font-semibold text-neutral-900">{formatDate(doc.dueDate)}</span>
            </div>
          )}
          {doc.placeOfSupply && (
            <div>
              <span className="text-[10px] uppercase text-neutral-400 block">Supply State</span>
              <span className="text-neutral-700">{doc.placeOfSupply}</span>
            </div>
          )}
        </div>
      </div>

      {/* Wedding Header if applicable */}
      {doc.weddingDetails && (
        <div className="mb-6 p-4 border border-black bg-neutral-50 text-xs">
          <span className="font-mono uppercase text-[10px] tracking-widest text-neutral-500 block mb-1">
            Event Engagement
          </span>
          <p className="text-base font-bold text-black">
            {doc.weddingDetails.brideName} + {doc.weddingDetails.groomName}
          </p>
          <p className="text-neutral-600 font-mono mt-0.5">
            {formatDate(doc.weddingDetails.weddingDate)} — {doc.weddingDetails.venueName}
          </p>
        </div>
      )}

      {/* Clean Grid Table */}
      <table className="w-full text-left text-xs border-collapse mb-8">
        <thead>
          <tr className="border-b-2 border-black font-mono text-[11px] uppercase tracking-wider">
            <th className="py-2 px-1">Item</th>
            <th className="py-2 px-2 text-center">HSN</th>
            <th className="py-2 px-2 text-center">Qty</th>
            <th className="py-2 px-3 text-right">Unit Price</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2 px-2 text-right">Disc</th>}
            <th className="py-2 px-2 text-center">Tax</th>
            <th className="py-2 px-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {doc.items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 px-1">
                <p className="font-medium text-black">{item.description}</p>
                {item.detailedSpecs && <p className="text-[10px] text-neutral-400 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-neutral-500">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center font-mono text-neutral-800">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-neutral-800">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-neutral-500">
                  {item.discount > 0 ? (item.discountType === 'PERCENT' ? `${item.discount}%` : formatDocCurrency(item.discount, doc.currency)) : '-'}
                </td>
              )}
              <td className="py-3 px-2 text-center font-mono text-neutral-500">{item.taxRate}%</td>
              <td className="py-3 px-1 text-right font-mono font-bold text-black">
                {formatDocCurrency(item.totalAmount, doc.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Minimalist Summary */}
      <div className="grid grid-cols-2 gap-12 border-t border-black pt-6">
        <div className="space-y-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-neutral-400 block mb-0.5">Amount in Words</span>
            <p className="text-xs font-medium text-neutral-800">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="font-mono text-[11px] text-neutral-600 space-y-0.5">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">Settlement Details</span>
              <p>Bank: {doc.bankDetails.bankName}</p>
              <p>Account: {doc.bankDetails.accountNumber}</p>
              <p>IFSC: {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p>UPI: {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="font-mono text-xs space-y-2">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Discount</span>
              <span>-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Tax (GST)</span>
              <span>{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-black border-t-2 border-black pt-2">
            <span>Total</span>
            <span>{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Paid to Date</span>
              <span>-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-300 pt-1">
            <span>Balance Due</span>
            <span>{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-end text-neutral-400 text-[11px]">
        <p className="max-w-xs">{doc.terms || 'Payment expected within the stated terms.'}</p>
        <div className="text-right">
          <div className="h-10 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-8 grayscale" />}
          </div>
          <div className="border-t border-black pt-1 w-36">
            <p className="text-black font-bold">{doc.businessName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
