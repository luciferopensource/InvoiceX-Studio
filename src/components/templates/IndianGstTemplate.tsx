import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';

interface Props {
  document: InvoiceDocument;
}

export const IndianGstTemplate: React.FC<Props> = ({ document: doc }) => {
  return (
    <div
      className="invoice-page-sheet p-8 text-black bg-white font-sans text-xs border border-slate-300 relative overflow-hidden"
      style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
    >
      {/* Title */}
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <h1 className="text-xl font-bold tracking-wider uppercase text-black">
          TAX INVOICE
        </h1>
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
          (Issued under Section 31 of Central Goods and Services Tax Act, 2017)
        </p>
      </div>

      {/* Top Header: Seller Details & Invoice Meta */}
      <div className="grid grid-cols-2 border border-black mb-3">
        <div className="p-3 border-r border-black">
          <h2 className="text-base font-bold text-black uppercase">{doc.businessName}</h2>
          <p className="text-slate-700 whitespace-pre-line mt-0.5 leading-tight text-[11px]">{doc.businessAddress}</p>
          <div className="mt-2 text-[11px] space-y-0.5 font-mono">
            <p><strong>GSTIN:</strong> {doc.businessGstin || 'URP'}</p>
            {doc.businessPan && <p><strong>PAN:</strong> {doc.businessPan}</p>}
            <p><strong>Phone:</strong> {doc.businessPhone || '-'} | <strong>Email:</strong> {doc.businessEmail}</p>
          </div>
        </div>

        <div className="p-3 text-[11px] font-mono grid grid-cols-2 gap-2 content-start">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Invoice No.</span>
            <strong className="text-sm font-bold text-black">{doc.documentNumber}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Dated</span>
            <strong className="text-black">{formatDate(doc.issueDate)}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Place of Supply</span>
            <strong className="text-black">{doc.placeOfSupply || 'State'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Reverse Charge</span>
            <strong className="text-black">{doc.reverseCharge ? 'YES' : 'NO'}</strong>
          </div>
          {doc.dueDate && (
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Due Date</span>
              <strong className="text-black">{formatDate(doc.dueDate)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Billed To (Buyer) & Shipped To (Consignee) */}
      <div className="grid grid-cols-2 border border-black mb-3">
        <div className="p-3 border-r border-black">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Details of Receiver | Billed To:
          </span>
          <p className="text-sm font-bold text-black">{doc.customerName}</p>
          {doc.customerCompany && <p className="font-semibold text-slate-800">{doc.customerCompany}</p>}
          <p className="text-slate-700 mt-0.5 whitespace-pre-line text-[11px]">{doc.customerBillingAddress}</p>
          <div className="mt-2 text-[11px] font-mono space-y-0.5">
            <p><strong>GSTIN:</strong> {doc.customerGstin || 'Unregistered'}</p>
            {doc.customerPan && <p><strong>PAN:</strong> {doc.customerPan}</p>}
            {doc.customerStateCode && <p><strong>State Code:</strong> {doc.customerStateCode}</p>}
          </div>
        </div>

        <div className="p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Details of Consignee | Shipped To:
          </span>
          <p className="text-sm font-bold text-black">{doc.customerName}</p>
          <p className="text-slate-700 mt-0.5 whitespace-pre-line text-[11px]">
            {doc.customerShippingAddress || doc.customerBillingAddress}
          </p>
          {doc.weddingDetails && (
            <div className="mt-2 text-[10px] font-mono p-1.5 bg-slate-50 border border-slate-200">
              <p><strong>Event:</strong> {doc.weddingDetails.brideName} &amp; {doc.weddingDetails.groomName} Wedding</p>
              <p><strong>Date &amp; Venue:</strong> {formatDate(doc.weddingDetails.weddingDate)} ({doc.weddingDetails.venueName})</p>
            </div>
          )}
        </div>
      </div>

      {/* Statutory GST Line Items Table */}
      <table className="w-full text-left text-[11px] border border-black border-collapse mb-3">
        <thead>
          <tr className="bg-slate-100 border-b border-black text-[10px] uppercase font-bold text-center">
            <th className="p-1.5 border-r border-black w-8">Sl</th>
            <th className="p-1.5 border-r border-black text-left">Description of Goods / Services</th>
            <th className="p-1.5 border-r border-black w-14">HSN/SAC</th>
            <th className="p-1.5 border-r border-black w-12">Qty</th>
            <th className="p-1.5 border-r border-black w-16 text-right">Rate</th>
            <th className="p-1.5 border-r border-black w-18 text-right">Taxable Val</th>
            {doc.isInterState ? (
              <th className="p-1.5 border-r border-black w-20 text-right">IGST</th>
            ) : (
              <>
                <th className="p-1.5 border-r border-black w-16 text-right">CGST</th>
                <th className="p-1.5 border-r border-black w-16 text-right">SGST</th>
              </>
            )}
            <th className="p-1.5 text-right w-20">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/40">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className="align-top">
              <td className="p-1.5 border-r border-black text-center font-mono">{idx + 1}</td>
              <td className="p-1.5 border-r border-black">
                <p className="font-semibold text-black">{item.description}</p>
                {item.detailedSpecs && <p className="text-[10px] text-slate-600">{item.detailedSpecs}</p>}
              </td>
              <td className="p-1.5 border-r border-black text-center font-mono">{item.hsnSac || '-'}</td>
              <td className="p-1.5 border-r border-black text-center font-mono">
                {item.quantity} {item.unit}
              </td>
              <td className="p-1.5 border-r border-black text-right font-mono">
                {formatDocCurrency(item.unitPrice, doc.currency)}
              </td>
              <td className="p-1.5 border-r border-black text-right font-mono font-medium">
                {formatDocCurrency(item.taxableAmount, doc.currency)}
              </td>
              {doc.isInterState ? (
                <td className="p-1.5 border-r border-black text-right font-mono text-[10px]">
                  {formatDocCurrency(item.igstAmount, doc.currency)} ({item.igstRate}%)
                </td>
              ) : (
                <>
                  <td className="p-1.5 border-r border-black text-right font-mono text-[10px]">
                    {formatDocCurrency(item.cgstAmount, doc.currency)} ({item.cgstRate}%)
                  </td>
                  <td className="p-1.5 border-r border-black text-right font-mono text-[10px]">
                    {formatDocCurrency(item.sgstAmount, doc.currency)} ({item.sgstRate}%)
                  </td>
                </>
              )}
              <td className="p-1.5 text-right font-mono font-bold text-black">
                {formatDocCurrency(item.totalAmount, doc.currency)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-bold border-t border-black text-[11px]">
            <td colSpan={5} className="p-1.5 border-r border-black text-right uppercase">Total:</td>
            <td className="p-1.5 border-r border-black text-right font-mono">
              {formatDocCurrency(doc.subtotal, doc.currency)}
            </td>
            {doc.isInterState ? (
              <td className="p-1.5 border-r border-black text-right font-mono">
                {formatDocCurrency(doc.totalIgst, doc.currency)}
              </td>
            ) : (
              <>
                <td className="p-1.5 border-r border-black text-right font-mono">
                  {formatDocCurrency(doc.totalCgst, doc.currency)}
                </td>
                <td className="p-1.5 border-r border-black text-right font-mono">
                  {formatDocCurrency(doc.totalSgst, doc.currency)}
                </td>
              </>
            )}
            <td className="p-1.5 text-right font-mono">
              {formatDocCurrency(doc.grandTotal, doc.currency)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in words & Final Calculation Block */}
      <div className="grid grid-cols-2 border border-black mb-3">
        <div className="p-3 border-r border-black flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-700 block">Total Amount in Words:</span>
            <p className="text-xs font-semibold text-black italic mt-1">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 pt-2 border-t border-slate-300 font-mono text-[11px] space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-700 block font-sans">Bank Details:</span>
              <p>Bank: {doc.bankDetails.bankName}</p>
              <p>A/C: {doc.bankDetails.accountNumber} ({doc.bankDetails.ifsc})</p>
              {doc.bankDetails.upiId && <p>UPI: {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        <div className="p-3 font-mono text-xs space-y-1.5">
          <div className="flex justify-between">
            <span>Total Taxable Value:</span>
            <span>{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>
          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Less Discount:</span>
              <span>-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}
          {doc.isInterState ? (
            <div className="flex justify-between">
              <span>Total IGST:</span>
              <span>{formatDocCurrency(doc.totalIgst, doc.currency)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Total CGST:</span>
                <span>{formatDocCurrency(doc.totalCgst, doc.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total SGST:</span>
                <span>{formatDocCurrency(doc.totalSgst, doc.currency)}</span>
              </div>
            </>
          )}
          {doc.roundOff !== 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Round Off:</span>
              <span>{formatDocCurrency(doc.roundOff, doc.currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm border-t-2 border-black pt-1">
            <span>Invoice Grand Total:</span>
            <span>{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>
          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-emerald-800">
              <span>Less Amount Received:</span>
              <span>-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-slate-400 pt-1 text-rose-800">
            <span>Balance Payable:</span>
            <span>{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Statutory Declarations & Signatures */}
      <div className="grid grid-cols-2 border border-black p-3 text-[10px]">
        <div>
          <span className="font-bold uppercase text-slate-800 block mb-1">Declaration:</span>
          <p className="text-slate-600 leading-tight">
            We declare that this invoice shows the actual price of the goods / services described and that all particulars are true and correct.
          </p>
          {doc.terms && (
            <p className="mt-1 text-slate-500 whitespace-pre-line leading-tight">{doc.terms}</p>
          )}
        </div>

        <div className="text-right flex flex-col justify-between items-end">
          <p className="font-bold text-black uppercase">For {doc.businessName}</p>
          <div className="h-12 flex items-end justify-center">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <p className="font-bold border-t border-black w-40 pt-1 text-center">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};
