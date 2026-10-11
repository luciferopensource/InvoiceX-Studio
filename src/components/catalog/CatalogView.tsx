import React, { useState } from 'react';
import { ProductItem } from '../../core/database/sqliteService';
import { DecimalUtils } from '../../core/calculations/decimal';
import { Package, Plus, Search, Edit3, Trash2, Tag, X } from 'lucide-react';

interface Props {
  products: ProductItem[];
  onSaveProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
}

export const CatalogView: React.FC<Props> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.hsnSac && p.hsnSac.includes(searchTerm)) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      title: '',
      description: '',
      hsnSac: '998381',
      unit: 'nos',
      unitPrice: 0,
      taxRate: 18,
      category: 'Photography',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;
    onSaveProduct(editingProduct);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Services &amp; Item Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard rate cards, HSN/SAC codes, and GST rates for instant 1-click invoice addition.
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
          <span>Add New Service / Item</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/10 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, HSN/SAC, category..."
          className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(prod => (
          <div
            key={prod.id}
            className="p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-all duration-200 hover:border-amber-500/40"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {prod.category || 'Service'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mt-2">{prod.title}</h3>
              {prod.description && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{prod.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">HSN/SAC: {prod.hsnSac || '-'}</span>
                <span className="text-[10px] text-emerald-400 font-mono">GST {prod.taxRate}%</span>
              </div>
              <div className="text-right">
                <p className="font-bold font-mono text-white text-base">
                  {DecimalUtils.formatCurrency(prod.unitPrice, 'INR')}
                </p>
                <span className="text-[10px] text-slate-500">per {prod.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
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
                {editingProduct.title ? 'Edit Service / Item' : 'Add New Service / Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Item / Service Title *</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  placeholder="e.g. Candid Wedding Photography (Per Day)"
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={2}
                  placeholder="Details, deliverable count, gear included..."
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={editingProduct.hsnSac}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hsnSac: e.target.value })}
                    placeholder="998381"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="Photography, Catering, Decor..."
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Rate / Price (₹) *</label>
                  <input
                    type="number"
                    value={editingProduct.unitPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    placeholder="days, plates, nos..."
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Default GST Rate</label>
                  <select
                    value={editingProduct.taxRate}
                    onChange={(e) => setEditingProduct({ ...editingProduct, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
