import React, { useState } from 'react';
import { Customer, InvoiceDocument } from '../../core/types/invoice';
import { DecimalUtils } from '../../core/calculations/decimal';
import { Users, Plus, Search, Edit3, Trash2, FileText, Phone, Mail, MapPin, X } from 'lucide-react';

interface Props {
  customers: Customer[];
  invoices: InvoiceDocument[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onCreateInvoiceForCustomer: (customer: Customer) => void;
}

export const CustomerListView: React.FC<Props> = ({
  customers,
  invoices,
  onSaveCustomer,
  onDeleteCustomer,
  onCreateInvoiceForCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingCustomer({
      id: `cust_${Date.now()}`,
      name: '',
      companyName: '',
      email: '',
      phone: '',
      billingAddress: '',
      billingCity: '',
      billingState: 'Karnataka',
      billingPincode: '',
      shippingAddress: '',
      gstin: '',
      pan: '',
      stateCode: '29',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name) return;
    onSaveCustomer(editingCustomer);
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Customer &amp; Client Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage clients, billing addresses, GSTIN credentials &amp; document history.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all border"
          style={{
            background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
            borderColor: '#f59e0b',
            color: '#ffffff',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/10 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, email, company..."
          className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => {
          const custInvoices = invoices.filter(inv => inv.customerId === cust.id || inv.customerName === cust.name);
          const totalSpent = custInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.grandTotal || 0), 0);
          const totalOutstanding = custInvoices.reduce((acc, inv) => DecimalUtils.add(acc, inv.outstandingBalance || 0), 0);

          return (
            <div
              key={cust.id}
              className="p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-all duration-200 hover:border-amber-500/40"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm">{cust.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCustomer(cust);
                        setIsModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCustomer(cust.id)}
                      className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {cust.companyName && (
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{cust.companyName}</p>
                )}

                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  {cust.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{cust.phone}</span>
                    </p>
                  )}
                  {cust.email && (
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{cust.email}</span>
                    </p>
                  )}
                  {cust.billingAddress && (
                    <p className="flex items-start gap-1.5 mt-1 text-[11px] leading-tight text-slate-500 line-clamp-2">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span>{cust.billingAddress}</span>
                    </p>
                  )}
                  {cust.gstin && (
                    <p className="font-mono text-[10px] text-slate-300 pt-1">
                      GSTIN: {cust.gstin}
                    </p>
                  )}
                </div>
              </div>

              {/* Financial Snapshot for Customer */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="text-white font-semibold">{DecimalUtils.formatCurrency(totalSpent, 'INR')}</span>
                </div>
                {totalOutstanding > 0 && (
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-400">Outstanding:</span>
                    <span className="text-rose-400 font-bold">{DecimalUtils.formatCurrency(totalOutstanding, 'INR')}</span>
                  </div>
                )}

                <button
                  onClick={() => onCreateInvoiceForCustomer(cust)}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && editingCustomer && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-lg rounded-2xl p-6 border text-xs space-y-4 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-sm">
                {editingCustomer.name ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer / Couple Name *</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra & Aishwarya Sharma"
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={editingCustomer.companyName || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, companyName: e.target.value })}
                    placeholder="Optional company"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={editingCustomer.gstin || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, gstin: e.target.value.toUpperCase() })}
                    placeholder="29ABCDE1234F1Z5"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billing Address</label>
                <textarea
                  value={editingCustomer.billingAddress}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, billingAddress: e.target.value })}
                  rows={2}
                  placeholder="Address..."
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white shadow-md transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  }}
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
