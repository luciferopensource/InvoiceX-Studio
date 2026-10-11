import React, { useState } from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { WeddingPackageItem } from '../../core/database/sqliteService';
import { DecimalUtils } from '../../core/calculations/decimal';
import { formatDate } from '../templates/templateUtils';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Calendar, 
  MapPin, 
  Camera, 
  Eye, 
  Edit3, 
  Package, 
  CheckCircle2, 
  Users,
  Film
} from 'lucide-react';

interface Props {
  invoices: InvoiceDocument[];
  weddingPackages: WeddingPackageItem[];
  onNewWeddingInvoice: () => void;
  onViewInvoice: (invoice: InvoiceDocument) => void;
  onEditInvoice: (invoice: InvoiceDocument) => void;
  onSavePackage: (pkg: WeddingPackageItem) => void;
}

export const WeddingSuiteView: React.FC<Props> = ({
  invoices,
  weddingPackages,
  onNewWeddingInvoice,
  onViewInvoice,
  onEditInvoice,
  onSavePackage,
}) => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'packages'>('contracts');

  const weddingInvoices = invoices.filter(inv => inv.industryType === 'WEDDING' || Boolean(inv.weddingDetails));
  const totalWeddingValue = weddingInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.grandTotal || 0), 0);
  const totalWeddingReceived = weddingInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.totalPaid || 0), 0);
  const totalWeddingPending = weddingInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.outstandingBalance || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-serif">
            <Heart className="w-6 h-6 text-rose-400 fill-current" />
            <span>Royal Wedding Production Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bespoke billing, multi-function itineraries, photography milestones &amp; luxury packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'contracts' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wedding Contracts ({weddingInvoices.length})
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'packages' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Packages ({weddingPackages.length})
            </button>
          </div>

          <button
            onClick={onNewWeddingInvoice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all border"
            style={{
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
              borderColor: '#f59e0b',
              color: '#ffffff',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Wedding Contract</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Wedding Billings</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {DecimalUtils.formatCurrency(totalWeddingValue, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{weddingInvoices.length} active couples &amp; contracts</p>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Advances &amp; Milestones Cleared</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {DecimalUtils.formatCurrency(totalWeddingReceived, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Booking tokens and event installments</p>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-amber-400 block">Outstanding Deliverables Balance</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {DecimalUtils.formatCurrency(totalWeddingPending, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Due on wedding day or album delivery</p>
        </div>
      </div>

      {/* Tab 1: Wedding Contracts Grid */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {weddingInvoices.length === 0 ? (
            <div className="p-12 text-center text-slate-500 rounded-xl border border-white/5 bg-white/5">
              <Heart className="w-8 h-8 mx-auto text-rose-400/50 mb-2" />
              <p>No wedding contracts created yet.</p>
              <button
                onClick={onNewWeddingInvoice}
                className="mt-3 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30"
              >
                + Create First Wedding Invoice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weddingInvoices.map(inv => {
                const w = inv.weddingDetails;
                return (
                  <div
                    key={inv.id}
                    className="p-5 rounded-2xl border transition-all duration-200 hover:border-amber-500/40 relative overflow-hidden space-y-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                          {inv.documentNumber}
                        </span>
                        <h3 className="text-lg font-bold text-white font-serif mt-1 flex items-center gap-2">
                          <span>{w?.brideName || 'Bride'}</span>
                          <Heart className="w-4 h-4 text-rose-400 fill-current inline" />
                          <span>{w?.groomName || 'Groom'}</span>
                        </h3>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {inv.status}
                        </span>
                        <p className="text-base font-bold font-mono text-white mt-1">
                          {DecimalUtils.formatCurrency(inv.grandTotal, inv.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Venue & Date */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 border-t border-white/5">
                      {w?.weddingDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{formatDate(w.weddingDate)}</span>
                        </span>
                      )}
                      {w?.venueName && (
                        <span className="flex items-center gap-1.5 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{w.venueName}</span>
                        </span>
                      )}
                    </div>

                    {/* Functions Itinerary & Gear Breakdown */}
                    {w?.events && w.events.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {w.events.map(ev => (
                          <span key={ev.id} className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-slate-300 border border-white/5">
                            {ev.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Financial Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Paid: {DecimalUtils.formatCurrency(inv.totalPaid, inv.currency)}</span>
                        <span className="text-rose-400">Due: {DecimalUtils.formatCurrency(inv.outstandingBalance, inv.currency)}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((inv.totalPaid / (inv.grandTotal || 1)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Template: {inv.templateId}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => onEditInvoice(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Master Wedding Packages Catalog */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {weddingPackages.map(pkg => (
            <div
              key={pkg.id}
              className="p-5 rounded-2xl border relative flex flex-col justify-between space-y-4"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pkg.tier} Suite
                  </span>
                  <p className="text-xl font-bold font-mono text-amber-400">
                    {DecimalUtils.formatCurrency(pkg.price, 'INR')}
                  </p>
                </div>
                <h3 className="text-base font-bold text-white font-serif">{pkg.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pkg.description}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Included Services:</span>
                {pkg.includedServices.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onNewWeddingInvoice}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition-colors"
              >
                Create Invoice with this Package
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
