import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { Gem, Calendar, MapPin, Camera, Video, Award } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const LuxuryWeddingTemplate: React.FC<Props> = ({ document: doc }) => {
  const cfg = doc.templateConfig || {};
  const emerald = '#1B4D3E';
  const gold = cfg.accentColor || '#C5A059';

  return (
    <div
      className="invoice-page-sheet p-10 text-slate-900 relative overflow-hidden font-serif"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Royal Crest Monogram Header */}
      <div className="flex justify-between items-center border-b-2 pb-6" style={{ borderColor: emerald }}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2"
            style={{ backgroundColor: emerald, borderColor: gold }}
          >
            <Gem className="w-8 h-8" style={{ color: gold }} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-widest font-bold block" style={{ color: gold }}>
              High-End Luxury Production
            </span>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
              {doc.businessName}
            </h1>
            <p className="text-xs text-slate-600 font-sans mt-0.5">{doc.businessAddress}</p>
          </div>
        </div>

        <div className="text-right font-sans">
          <span
            className="inline-block px-3 py-1 rounded text-[11px] font-bold uppercase text-white tracking-widest mb-1.5"
            style={{ backgroundColor: emerald }}
          >
            {doc.documentType.replace('_', ' ')}
          </span>
          <p className="text-xl font-bold font-mono text-slate-900">#{doc.documentNumber}</p>
          <p className="text-xs text-slate-500 mt-1">Issue: {formatDate(doc.issueDate)}</p>
          {doc.dueDate && <p className="text-xs text-slate-500">Settlement: {formatDate(doc.dueDate)}</p>}
        </div>
      </div>

      {/* Couple Luxury Showcase */}
      {doc.weddingDetails && (
        <div
          className="my-6 p-5 rounded-lg text-white text-center relative shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${emerald} 0%, #0d2820 100%)`,
            border: `1px solid ${gold}60`,
          }}
        >
          <span className="text-[11px] tracking-widest uppercase font-sans font-semibold block" style={{ color: gold }}>
            The Royal Destination Celebration
          </span>
          <h2 className="text-2xl md:text-3xl font-bold my-2 tracking-wide font-serif">
            {doc.weddingDetails.brideName || 'Bride'} &amp; {doc.weddingDetails.groomName || 'Groom'}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-200 font-sans mt-2">
            {doc.weddingDetails.weddingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: gold }} />
                {formatDate(doc.weddingDetails.weddingDate)}
              </span>
            )}
            {doc.weddingDetails.venueName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: gold }} />
                {doc.weddingDetails.venueName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* VIP Client & Shoot Package Details */}
      <div className="grid grid-cols-2 gap-6 my-6 font-sans text-xs">
        <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-100">
          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: emerald }}>
            Distinguished Client
          </span>
          <p className="text-sm font-bold text-slate-900 font-serif mt-1">{doc.customerName}</p>
          {doc.customerCompany && <p className="text-slate-700 font-medium">{doc.customerCompany}</p>}
          <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{doc.customerBillingAddress}</p>
          {doc.customerGstin && <p className="mt-1 font-mono text-slate-800">GSTIN: {doc.customerGstin}</p>}
          {doc.customerPhone && <p className="text-slate-700">Tel: {doc.customerPhone}</p>}
        </div>

        {/* Photography & Cinematography Crew Breakdown */}
        {doc.weddingDetails?.photographyPackage ? (
          <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: emerald }}>
              Dedicated Crew &amp; Gear Deployment
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-700">
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-800" />
                <span>Candid: {doc.weddingDetails.photographyPackage.candidPhotographers}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-800" />
                <span>Traditional: {doc.weddingDetails.photographyPackage.traditionalPhotographers}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-800" />
                <span>Cinema: {doc.weddingDetails.photographyPackage.cinematographers}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-800" />
                <span>Drone: {doc.weddingDetails.photographyPackage.dronePilots}</span>
              </div>
            </div>
            {doc.weddingDetails.photographyPackage.teaserDuration && (
              <p className="text-[11px] text-slate-600 mt-2">
                Deliverables: {doc.weddingDetails.photographyPackage.albumCount} Flushmount Albums • {doc.weddingDetails.photographyPackage.teaserDuration} Film
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Destination Location</span>
            <p className="text-slate-700 mt-1">{doc.customerShippingAddress || doc.businessAddress}</p>
          </div>
        )}
      </div>

      {/* Items Table */}
      <table className="w-full text-left font-sans text-xs border-collapse my-6">
        <thead>
          <tr className="text-white text-xs uppercase tracking-wider" style={{ backgroundColor: emerald }}>
            <th className="py-2.5 px-3 rounded-l">Item Description</th>
            <th className="py-2.5 px-2 text-center">HSN</th>
            <th className="py-2.5 px-2 text-center">Quantity</th>
            <th className="py-2.5 px-3 text-right">Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">GST</th>
            <th className="py-2.5 px-3 text-right rounded-r">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'}>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center text-slate-700 font-medium">
                {item.quantity} {item.unit}
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-800">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right font-mono text-emerald-800">
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

      {/* Totals & Financial Summary */}
      <div className="grid grid-cols-2 gap-8 my-6 font-sans text-xs">
        <div>
          <div className="p-3 rounded bg-emerald-50/50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-900">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-1 italic font-serif">{doc.amountInWords}</p>
          </div>

          {doc.bankDetails?.accountNumber && (
            <div className="mt-3 p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: emerald }}>
                Bank Wire Instructions
              </span>
              <p><strong className="text-slate-800">Beneficiary:</strong> {doc.bankDetails.accountName || doc.businessName}</p>
              <p><strong className="text-slate-800">Account:</strong> {doc.bankDetails.accountNumber} ({doc.bankDetails.bankName})</p>
              <p><strong className="text-slate-800">IFSC / Code:</strong> {doc.bankDetails.ifsc}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Privilege Courtesy:</span>
              <span className="font-mono">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.totalTax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>GST Component:</span>
              <span className="font-mono">{formatDocCurrency(doc.totalTax, doc.currency)}</span>
            </div>
          )}

          <div
            className="flex justify-between text-sm font-bold text-white p-3 rounded mt-2 shadow-sm"
            style={{ backgroundColor: emerald, border: `1px solid ${gold}` }}
          >
            <span>Grand Total:</span>
            <span className="font-mono" style={{ color: gold }}>{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Advances Received:</span>
              <span className="font-mono text-emerald-700 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-slate-300">
            <span>Outstanding Balance:</span>
            <span className="font-mono text-rose-700 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Sign-off */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end font-sans text-xs">
        <p className="text-[11px] text-slate-500 italic max-w-sm">
          {doc.terms || 'All copyright & master media licenses granted upon final settlement.'}
        </p>
        <div className="text-right">
          <div className="h-12 flex items-end justify-end mb-1">
            {doc.businessSignatureUrl && <img src={doc.businessSignatureUrl} alt="Signature" className="h-10" />}
          </div>
          <div className="border-t border-emerald-800 pt-1 w-44">
            <p className="font-bold text-slate-800">{doc.businessName}</p>
            <p className="text-[10px] text-slate-500">Executive Director</p>
          </div>
        </div>
      </div>
    </div>
  );
};
