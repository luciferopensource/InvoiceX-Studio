import React from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { formatDocCurrency, formatDate } from './templateUtils';
import { Crown, Heart, Calendar, MapPin, Sparkles } from 'lucide-react';

interface Props {
  document: InvoiceDocument;
}

export const RoyalBlackGoldTemplate: React.FC<Props> = ({ document: doc }) => {
  const cfg = doc.templateConfig || {};
  const accent = cfg.accentColor || '#D4AF37';

  return (
    <div
      className="invoice-page-sheet p-10 font-serif text-slate-900 relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: cfg.fontFamily === 'Cinzel' ? 'Cinzel, Georgia, serif' : 'Playfair Display, Georgia, serif',
      }}
    >
      {/* Watermark */}
      {cfg.showWatermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          style={{ opacity: cfg.watermarkOpacity || 0.04 }}
        >
          <span className="text-8xl font-black uppercase tracking-widest text-slate-950 rotate-[-30deg]">
            {cfg.watermarkText || 'LUCIFER ROYAL'}
          </span>
        </div>
      )}

      {/* Top Regal Border Accent */}
      <div className="h-3 w-full mb-8 rounded-full" style={{ background: `linear-gradient(90deg, #111827 0%, ${accent} 50%, #111827 100%)` }} />

      {/* Header Block */}
      <div className="flex justify-between items-start pb-6 border-b-2" style={{ borderColor: accent }}>
        <div className="max-w-md">
          {doc.businessLogoUrl ? (
            <img src={doc.businessLogoUrl} alt="Logo" className="h-16 object-contain mb-3" />
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-8 h-8" style={{ color: accent }} />
              <h1 className="text-2xl font-bold tracking-wider text-slate-900 uppercase">
                {doc.businessName}
              </h1>
            </div>
          )}
          <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
            {doc.businessAddress}
          </p>
          <div className="mt-2 text-xs text-slate-700 font-sans space-y-0.5">
            {doc.businessGstin && <p><strong className="font-semibold text-slate-900">GSTIN:</strong> {doc.businessGstin}</p>}
            {doc.businessPhone && <p><strong className="font-semibold text-slate-900">Phone:</strong> {doc.businessPhone}</p>}
            {doc.businessEmail && <p><strong className="font-semibold text-slate-900">Email:</strong> {doc.businessEmail}</p>}
          </div>
        </div>

        <div className="text-right">
          <div
            className="inline-block px-4 py-1.5 rounded text-xs tracking-widest font-bold uppercase text-white shadow-sm mb-3"
            style={{ backgroundColor: '#111827', border: `1px solid ${accent}` }}
          >
            {doc.documentType.replace('_', ' ')}
          </div>
          <p className="text-xl font-bold tracking-wider text-slate-900 font-mono">
            #{doc.documentNumber}
          </p>
          <div className="mt-3 text-xs text-slate-600 font-sans space-y-1">
            <p><strong className="text-slate-800">Date:</strong> {formatDate(doc.issueDate)}</p>
            {doc.dueDate && <p><strong className="text-slate-800">Due Date:</strong> {formatDate(doc.dueDate)}</p>}
            {doc.placeOfSupply && <p><strong className="text-slate-800">Place of Supply:</strong> {doc.placeOfSupply}</p>}
          </div>
        </div>
      </div>

      {/* Wedding Banner (If wedding details present) */}
      {doc.weddingDetails && (
        <div
          className="my-6 p-4 rounded-lg text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            border: `1px solid ${accent}`,
          }}
        >
          <div className="flex items-center justify-center gap-3 text-white mb-1">
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
            <h2 className="text-lg tracking-widest font-semibold uppercase" style={{ color: accent }}>
              Royal Wedding Celebration
            </h2>
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
          </div>
          <p className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-3 my-2">
            <span>{doc.weddingDetails.brideName || 'Bride'}</span>
            <Heart className="w-5 h-5 fill-current text-rose-400 inline" />
            <span>{doc.weddingDetails.groomName || 'Groom'}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-sans mt-2">
            {doc.weddingDetails.weddingDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {formatDate(doc.weddingDetails.weddingDate)}
              </span>
            )}
            {doc.weddingDetails.venueName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {doc.weddingDetails.venueName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Client / Bill To Info */}
      <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-lg border border-slate-200 font-sans text-xs">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider" style={{ color: accent }}>
            Billed To
          </span>
          <h3 className="text-sm font-bold text-slate-900 mt-1 font-serif">{doc.customerName}</h3>
          {doc.customerCompany && <p className="text-slate-700 font-semibold">{doc.customerCompany}</p>}
          <p className="text-slate-600 mt-1 whitespace-pre-line">{doc.customerBillingAddress}</p>
          {doc.customerGstin && <p className="mt-1.5"><strong className="text-slate-900">GSTIN:</strong> {doc.customerGstin}</p>}
          {doc.customerPhone && <p><strong className="text-slate-900">Phone:</strong> {doc.customerPhone}</p>}
          {doc.customerEmail && <p><strong className="text-slate-900">Email:</strong> {doc.customerEmail}</p>}
        </div>

        {doc.customerShippingAddress ? (
          <div>
            <span className="text-xs uppercase font-bold tracking-wider" style={{ color: accent }}>
              Event / Delivery Venue
            </span>
            <p className="text-slate-700 mt-1 whitespace-pre-line leading-relaxed">{doc.customerShippingAddress}</p>
          </div>
        ) : doc.weddingDetails?.events?.length ? (
          <div>
            <span className="text-xs uppercase font-bold tracking-wider" style={{ color: accent }}>
              Event Itinerary Highlights
            </span>
            <div className="mt-2 space-y-1.5">
              {doc.weddingDetails.events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="text-xs text-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-900">{ev.name}</span>
                  <span className="text-slate-500">{formatDate(ev.date)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Line Items Table */}
      <table className="w-full text-left font-sans text-xs border-collapse my-6">
        <thead>
          <tr className="text-white uppercase tracking-wider text-[11px]" style={{ backgroundColor: '#111827' }}>
            <th className="py-2.5 px-3 rounded-l">#</th>
            <th className="py-2.5 px-3">Description</th>
            <th className="py-2.5 px-2 text-center">HSN/SAC</th>
            <th className="py-2.5 px-2 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Rate</th>
            {doc.items.some(i => i.discount > 0) && <th className="py-2.5 px-2 text-right">Disc</th>}
            <th className="py-2.5 px-2 text-center">Tax</th>
            <th className="py-2.5 px-3 text-right rounded-r">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {doc.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
              <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
              <td className="py-3 px-3">
                <p className="font-semibold text-slate-900">{item.description}</p>
                {item.detailedSpecs && <p className="text-[11px] text-slate-500 mt-0.5">{item.detailedSpecs}</p>}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 font-mono text-[11px]">{item.hsnSac || '-'}</td>
              <td className="py-3 px-2 text-center text-slate-800 font-medium">
                {item.quantity} <span className="text-[10px] text-slate-500">{item.unit}</span>
              </td>
              <td className="py-3 px-3 text-right text-slate-800 font-mono">{formatDocCurrency(item.unitPrice, doc.currency)}</td>
              {doc.items.some(i => i.discount > 0) && (
                <td className="py-3 px-2 text-right text-amber-600 font-mono">
                  {item.discount > 0 ? (item.discountType === 'PERCENT' ? `${item.discount}%` : formatDocCurrency(item.discount, doc.currency)) : '-'}
                </td>
              )}
              <td className="py-3 px-2 text-center text-slate-600 text-[11px] font-mono">{item.taxRate}%</td>
              <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                {formatDocCurrency(item.totalAmount, doc.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary & Totals */}
      <div className="grid grid-cols-2 gap-8 my-6 font-sans">
        <div className="space-y-4">
          {/* Amount in Words */}
          <div className="p-3 bg-amber-50/60 rounded border border-amber-200/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900">Total in Words</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 italic">{doc.amountInWords}</p>
          </div>

          {/* Bank & Payment Details */}
          {doc.bankDetails?.accountNumber && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: accent }}>
                Payment & Banking Details
              </span>
              <p><strong className="text-slate-900">Bank:</strong> {doc.bankDetails.bankName}</p>
              <p><strong className="text-slate-900">A/C Name:</strong> {doc.bankDetails.accountName}</p>
              <p><strong className="text-slate-900 font-mono">A/C No:</strong> {doc.bankDetails.accountNumber}</p>
              <p><strong className="text-slate-900 font-mono">IFSC:</strong> {doc.bankDetails.ifsc}</p>
              {doc.bankDetails.upiId && <p><strong className="text-slate-900">UPI ID:</strong> {doc.bankDetails.upiId}</p>}
            </div>
          )}
        </div>

        {/* Calculation Totals */}
        <div className="text-xs space-y-2 border-t pt-2 border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono font-medium">{formatDocCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Total Discount:</span>
              <span className="font-mono font-medium">-{formatDocCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {(doc.additionalCharges || []).map(chg => (
            <div key={chg.id} className="flex justify-between text-slate-600">
              <span>{chg.title}:</span>
              <span className="font-mono font-medium">{formatDocCurrency(chg.amount, doc.currency)}</span>
            </div>
          ))}

          {doc.isInterState ? (
            <div className="flex justify-between text-slate-600">
              <span>IGST:</span>
              <span className="font-mono font-medium">{formatDocCurrency(doc.totalIgst, doc.currency)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-slate-600">
                <span>CGST:</span>
                <span className="font-mono font-medium">{formatDocCurrency(doc.totalCgst, doc.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST:</span>
                <span className="font-mono font-medium">{formatDocCurrency(doc.totalSgst, doc.currency)}</span>
              </div>
            </>
          )}

          {doc.roundOff !== 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Round Off:</span>
              <span className="font-mono font-medium">{formatDocCurrency(doc.roundOff, doc.currency)}</span>
            </div>
          )}

          <div
            className="flex justify-between text-sm font-bold text-white p-3 rounded mt-2 shadow-sm"
            style={{ backgroundColor: '#111827', border: `1px solid ${accent}` }}
          >
            <span>Grand Total:</span>
            <span className="font-mono" style={{ color: accent }}>{formatDocCurrency(doc.grandTotal, doc.currency)}</span>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Advance / Paid:</span>
              <span className="font-mono text-emerald-600 font-semibold">-{formatDocCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-900 font-bold border-t pt-1 border-slate-300">
            <span>Balance Due:</span>
            <span className="font-mono text-rose-600 font-bold">{formatDocCurrency(doc.outstandingBalance, doc.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer Notes & Signatures */}
      <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 items-end font-sans text-xs">
        <div>
          {doc.terms && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Terms & Conditions</span>
              <p className="text-slate-600 mt-1 whitespace-pre-line text-[11px] leading-relaxed">{doc.terms}</p>
            </div>
          )}
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="h-16 flex items-end justify-center mb-1">
            {doc.businessSignatureUrl && (
              <img src={doc.businessSignatureUrl} alt="Signature" className="h-12 object-contain" />
            )}
          </div>
          <div className="w-48 border-t border-slate-400 pt-1">
            <p className="text-xs font-bold text-slate-900">Authorized Signatory</p>
            <p className="text-[10px] text-slate-500">{doc.businessName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
