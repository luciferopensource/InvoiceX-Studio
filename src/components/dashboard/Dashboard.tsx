import React, { useState } from 'react';
import { InvoiceDocument } from '../../core/types/invoice';
import { DecimalUtils } from '../../core/calculations/decimal';
import { formatDate } from '../templates/templateUtils';
import { 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Plus, 
  Download, 
  Eye, 
  Edit3, 
  Copy, 
  CreditCard,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Props {
  invoices: InvoiceDocument[];
  onNewInvoice: () => void;
  onNewWeddingInvoice: () => void;
  onViewInvoice: (invoice: InvoiceDocument) => void;
  onEditInvoice: (invoice: InvoiceDocument) => void;
  onDuplicateInvoice: (invoice: InvoiceDocument) => void;
  onDeleteInvoice: (id: string) => void;
  onRecordPayment: (invoice: InvoiceDocument) => void;
  onExportCsv: () => void;
}

export const Dashboard: React.FC<Props> = ({
  invoices,
  onNewInvoice,
  onNewWeddingInvoice,
  onViewInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onRecordPayment,
  onExportCsv,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  // Dashboard Aggregates calculated from actual stored records
  const activeInvoices = invoices.filter(inv => inv.status !== 'CANCELLED');
  const totalInvoiced = activeInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.grandTotal || 0), 0);
  const totalReceived = activeInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.totalPaid || 0), 0);
  const totalOutstanding = activeInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.outstandingBalance || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const overdueList = activeInvoices.filter(inv => inv.dueDate && inv.dueDate < today && inv.outstandingBalance > 0);
  const totalOverdue = overdueList.reduce((acc, inv) => DecimalUtils.add(acc, inv.outstandingBalance || 0), 0);

  const weddingInvoicesCount = invoices.filter(inv => inv.industryType === 'WEDDING').length;

  // Filtered recent invoices
  const filteredInvoices = invoices.filter(inv => {
    if (filterType === 'ALL') return true;
    if (filterType === 'WEDDING') return inv.industryType === 'WEDDING';
    if (filterType === 'OVERDUE') return inv.status === 'OVERDUE' || (inv.dueDate && inv.dueDate < today && inv.outstandingBalance > 0);
    if (filterType === 'UNPAID') return inv.outstandingBalance > 0;
    if (filterType === 'PAID') return inv.status === 'PAID';
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-serif">
            <span>Executive Studio Command</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time billing, wedding production contracts, and payment settlement tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-white/5"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewWeddingInvoice}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-md transition-all border"
            style={{
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
              borderColor: '#f59e0b',
              color: '#ffffff',
            }}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-amber-200" />
            <span>New Wedding</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all border hover:bg-amber-600/20"
            style={{
              backgroundColor: 'var(--accent-gold-dim)',
              borderColor: 'var(--accent-gold)',
              color: 'var(--accent-gold)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div
          className="p-4 rounded-xl border relative overflow-hidden transition-all duration-200 hover:border-amber-500/40"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Invoiced</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {DecimalUtils.formatCurrency(totalInvoiced, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across {activeInvoices.length} active documents</p>
        </div>

        {/* Total Received */}
        <div
          className="p-4 rounded-xl border relative overflow-hidden transition-all duration-200 hover:border-emerald-500/40"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Amount Received</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            {DecimalUtils.formatCurrency(totalReceived, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cleared deposits &amp; milestones</p>
        </div>

        {/* Total Outstanding */}
        <div
          className="p-4 rounded-xl border relative overflow-hidden transition-all duration-200 hover:border-amber-500/40"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Outstanding</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {DecimalUtils.formatCurrency(totalOutstanding, 'INR')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting client clearance</p>
        </div>

        {/* Overdue Alerts */}
        <div
          className="p-4 rounded-xl border relative overflow-hidden transition-all duration-200 hover:border-rose-500/40"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Overdue Payments</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-2">
            {DecimalUtils.formatCurrency(totalOverdue, 'INR')}
          </p>
          <p className="text-[11px] text-rose-300/80 mt-1">{overdueList.length} invoices past due date</p>
        </div>
      </div>

      {/* Filter Chips & Table Header */}
      <div
        className="p-5 rounded-xl border space-y-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Recent Invoices &amp; Production Documents</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Track, edit, print, or collect payments on documents.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['ALL', 'WEDDING', 'UNPAID', 'OVERDUE', 'PAID'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterType === tab ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: filterType === tab ? 'var(--accent-gold-dim)' : 'transparent',
                  border: filterType === tab ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
                  color: filterType === tab ? 'var(--accent-gold)' : undefined,
                }}
              >
                {tab === 'ALL' ? 'All Documents' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices List Table */}
        {filteredInvoices.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No invoices match the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Document #</th>
                  <th className="py-3 px-3">Client / Event</th>
                  <th className="py-3 px-2 text-center">Type</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Date / Due</th>
                  <th className="py-3 px-3 text-right">Total</th>
                  <th className="py-3 px-3 text-right">Balance</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => {
                  const isOverdue = inv.dueDate && inv.dueDate < today && inv.outstandingBalance > 0;
                  
                  return (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {inv.documentNumber}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{inv.customerName}</p>
                        {inv.weddingDetails ? (
                          <p className="text-[11px] text-amber-300/80 flex items-center gap-1 mt-0.5">
                            <Heart className="w-3 h-3 text-rose-400 fill-current" />
                            <span>{inv.weddingDetails.brideName} &amp; {inv.weddingDetails.groomName}</span>
                          </p>
                        ) : inv.customerCompany ? (
                          <p className="text-[11px] text-slate-400">{inv.customerCompany}</p>
                        ) : null}
                      </td>

                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-white/5 text-slate-300 border border-white/5">
                          {inv.documentType}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : inv.status === 'PARTIALLY_PAID'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : isOverdue
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isOverdue && inv.status !== 'PAID' ? 'OVERDUE' : inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                        <p>{formatDate(inv.issueDate)}</p>
                        {inv.dueDate && (
                          <p className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                            Due: {formatDate(inv.dueDate)}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {DecimalUtils.formatCurrency(inv.grandTotal, inv.currency)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {inv.outstandingBalance > 0 ? (
                          <span className="text-rose-400">
                            {DecimalUtils.formatCurrency(inv.outstandingBalance, inv.currency)}
                          </span>
                        ) : (
                          <span className="text-emerald-400">Settled</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Preview / Print / PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Edit Document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {inv.outstandingBalance > 0 && (
                            <button
                              onClick={() => onRecordPayment(inv)}
                              className="p-1.5 rounded hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Record Payment / Advance"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteInvoice(inv.id)}
                            className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
