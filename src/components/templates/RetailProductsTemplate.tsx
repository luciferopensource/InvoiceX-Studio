import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { ShoppingBag, Barcode, Shield } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const RetailProductsTemplate: React.FC<Props> = ({ document: doc }) => {
  return (
    <div
      className="invoice-page-sheet p-10 text-slate-800 bg-white font-sans text-xs relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-slate-900 text-white shadow-sm">
            <ShoppingBag className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {doc.businessName}
            </h1>
            <p className="text-xs text-slate-500">{doc.businessAddress}</p>
            <p className="text-xs text-slate-700 font-mono mt-0.5">
              GSTIN: {doc.businessGstin || 'Retail Sales'} • Care: {doc.businessPhone}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white bg-slate-900 mb-1.5">
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Billing Date: {formatDate(doc.issueDate)}</p>
        </div>
      </div>

      {/* Customer & POS Station Strip */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Customer Billing Info
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{doc.customerName}</p>
          <p className="text-slate-600 whitespace-pre-line mt-0.5">{doc.customerBillingAddress}</p>
          {doc.customerPhone && <p className="text-slate-700 mt-1">Mobile: {doc.customerPhone}</p>}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Store Fulfillment &amp; Warranty
          </span>
          <p className="text-xs text-slate-800 font-medium mt-0.5">
            Standard 1-Year Manufacturer Warranty on all serialized goods.
          </p>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>7-Day Return / Exchange with original tag &amp; bill</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse my-6">
        <thead>
          <tr className="bg-slate-900 text-white text-xs uppercase">
            <th className="py-2.5 px-3 rounded-l">Item / SKU Description</th>
            <th className="py-2.5 px-2 text-center">HSN</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">MRP / Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Net Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity} {item.unit}</td>
              <td className="py-3 px-3 text-right font-mono text-slate-700">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-emerald-600">
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
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Amount in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          <div className="mt-3 p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="font-mono text-xs text-slate-600">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Payment Mode</span>
              <p>Cash / UPI / Card / NetBanking</p>
            </div>
            <Barcode className="w-16 h-8 text-slate-800" />
          </div>
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Store Discount:</span>
              <span className="font-mono">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>GST Included / Added:</span>
              <span className="font-mono">{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black text-white p-3 rounded bg-slate-900">
            <span>Bill Amount:</span>
            <span className="font-mono text-amber-400">{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Tender / Paid:</span>
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
          {doc.terms || 'Thank you for shopping with us! Please retain this invoice for warranty claims.'}
        </p>
        <div className="text-right">
          <div className="h-10 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-8" />}
          </div>
          <div className="border-t border-slate-400 pt-1 w-44">
            <p className="font-bold text-slate-900">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Store Cashier / Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};
