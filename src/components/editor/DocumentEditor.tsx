import React, { useState, useEffect } from 'react';
import { 
  InvoiceDocument, 
  InvoiceLineItem, 
  DocumentType, 
  IndustryType, 
  TemplateId, 
  Customer, 
  BusinessProfile,
  WeddingEvent,
  WeddingMilestone
} from '../../core/types/invoice';
import { recalculateDocument } from '../../core/calculations/financialCalculations';
import { INDIAN_STATES, determineTaxType, validateGSTIN } from '../../core/calculations/gstValidator';
import { DecimalUtils } from '../../core/calculations/decimal';
import { TEMPLATE_DEFINITIONS } from '../templates/TemplateRenderer';
import { ProductItem, WeddingPackageItem } from '../../core/database/sqliteService';
import { 
  Save, 
  Eye, 
  Printer, 
  Plus, 
  Trash2, 
  Copy, 
  Sparkles, 
  Heart, 
  Building2, 
  User, 
  Package, 
  ArrowLeft,
  Calendar,
  MapPin,
  Check,
  ChevronDown
} from 'lucide-react';

interface Props {
  initialDocument: InvoiceDocument;
  businessProfiles: BusinessProfile[];
  customers: Customer[];
  products: ProductItem[];
  weddingPackages: WeddingPackageItem[];
  onSave: (doc: InvoiceDocument) => void;
  onPreview: (doc: InvoiceDocument) => void;
  onCancel: () => void;
}

export const DocumentEditor: React.FC<Props> = ({
  initialDocument,
  businessProfiles,
  customers,
  products,
  weddingPackages,
  onSave,
  onPreview,
  onCancel,
}) => {
  const [doc, setDoc] = useState<InvoiceDocument>(initialDocument);
  const [autoRoundOff, setAutoRoundOff] = useState(true);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);

  // Recalculate whenever autoRoundOff option toggles
  useEffect(() => {
    setDoc(prev => recalculateDocument(prev, { autoRoundOff }));
  }, [autoRoundOff]);

  const handleUpdate = (updater: (prev: InvoiceDocument) => InvoiceDocument) => {
    setDoc(prev => {
      const next = updater(prev);
      return recalculateDocument(next, { autoRoundOff });
    });
  };

  // Place of Supply change determines whether it's Inter-state (IGST) or Intra-state (CGST+SGST)
  const handlePlaceOfSupplyChange = (place: string) => {
    const currentBiz = businessProfiles.find(b => b.id === doc.businessProfileId) || businessProfiles[0];
    const { isInterState } = determineTaxType(currentBiz?.state || 'Karnataka', place);

    handleUpdate(prev => ({
      ...prev,
      placeOfSupply: place,
      isInterState,
    }));
  };

  // Select customer from saved database
  const handleSelectCustomer = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    handleUpdate(prev => ({
      ...prev,
      customerId: cust.id,
      customerName: cust.name,
      customerCompany: cust.companyName || '',
      customerEmail: cust.email,
      customerPhone: cust.phone,
      customerBillingAddress: cust.billingAddress,
      customerShippingAddress: cust.shippingAddress || cust.billingAddress,
      customerGstin: cust.gstin || '',
      customerPan: cust.pan || '',
      customerStateCode: cust.stateCode || '',
    }));

    if (cust.billingState) {
      handlePlaceOfSupplyChange(cust.billingState);
    }
  };

  // Add new blank line item
  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item_${Date.now()}`,
      description: '',
      detailedSpecs: '',
      hsnSac: doc.industryType === 'WEDDING' ? '998381' : '998314',
      quantity: 1,
      unit: 'nos',
      unitPrice: 0,
      discount: 0,
      discountType: 'FLAT',
      taxRate: 18,
      taxInclusive: false,
      taxableAmount: 0,
      cgstRate: 9,
      cgstAmount: 0,
      sgstRate: 9,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalAmount: 0,
    };

    handleUpdate(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Update line item
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, val: any) => {
    handleUpdate(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: val };
      return { ...prev, items: newItems };
    });
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    handleUpdate(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Duplicate line item
  const handleDuplicateItem = (index: number) => {
    handleUpdate(prev => {
      const itemToDup = { ...prev.items[index], id: `item_${Date.now()}` };
      const newItems = [...prev.items];
      newItems.splice(index + 1, 0, itemToDup);
      return { ...prev, items: newItems };
    });
  };

  // Import catalog product
  const handleImportProduct = (prod: ProductItem) => {
    const newItem: InvoiceLineItem = {
      id: `item_${Date.now()}`,
      description: prod.title,
      detailedSpecs: prod.description || '',
      hsnSac: prod.hsnSac,
      quantity: 1,
      unit: prod.unit,
      unitPrice: prod.unitPrice,
      discount: 0,
      discountType: 'FLAT',
      taxRate: prod.taxRate,
      taxInclusive: false,
      taxableAmount: prod.unitPrice,
      cgstRate: prod.taxRate / 2,
      cgstAmount: 0,
      sgstRate: prod.taxRate / 2,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalAmount: prod.unitPrice,
    };

    handleUpdate(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setShowCatalogModal(false);
  };

  // Import wedding package
  const handleImportWeddingPackage = (pkg: WeddingPackageItem) => {
    const newItems: InvoiceLineItem[] = pkg.suggestedItems.map((item, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      description: item.description,
      hsnSac: item.hsnSac,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      discount: 0,
      discountType: 'FLAT',
      taxRate: item.taxRate,
      taxInclusive: false,
      taxableAmount: item.unitPrice * item.quantity,
      cgstRate: item.taxRate / 2,
      cgstAmount: 0,
      sgstRate: item.taxRate / 2,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalAmount: item.unitPrice * item.quantity,
    }));

    handleUpdate(prev => ({
      ...prev,
      items: [...prev.items, ...newItems],
      weddingDetails: {
        ...(prev.weddingDetails || {
          brideName: '',
          groomName: '',
          weddingDate: '',
          venueName: '',
          venueAddress: '',
          events: [],
          deliverables: [],
          milestones: [],
        }),
      },
    }));
    setShowPackageModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{doc.id ? 'Edit' : 'Create'} {doc.documentType.replace('_', ' ')}</span>
              <span className="font-mono text-amber-400">#{doc.documentNumber}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time calculations with GST and decimal precision.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview(doc)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Preview &amp; PDF</span>
          </button>

          <button
            onClick={() => onSave(doc)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all border"
            style={{
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
              borderColor: '#f59e0b',
              color: '#ffffff',
            }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Document</span>
          </button>
        </div>
      </div>

      {/* Row 1: Document Meta & Template Chooser */}
      <div
        className="p-5 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-4 text-xs"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Document Type</label>
          <select
            value={doc.documentType}
            onChange={(e) => handleUpdate(prev => ({ ...prev, documentType: e.target.value as DocumentType }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
          >
            <option value="INVOICE">Tax Invoice</option>
            <option value="QUOTATION">Quotation / Estimate</option>
            <option value="PROFORMA">Proforma Invoice</option>
            <option value="RECEIPT">Payment Receipt</option>
            <option value="CREDIT_NOTE">Credit Note</option>
            <option value="DEBIT_NOTE">Debit Note</option>
            <option value="PURCHASE_ORDER">Purchase Order</option>
            <option value="DELIVERY_NOTE">Delivery Note</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Industry / Category</label>
          <select
            value={doc.industryType}
            onChange={(e) => handleUpdate(prev => ({ ...prev, industryType: e.target.value as IndustryType }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
          >
            <option value="WEDDING">💍 Wedding &amp; Events</option>
            <option value="PHOTOGRAPHY">📷 Photography &amp; Film</option>
            <option value="CATERING">🍽️ Catering &amp; Banquets</option>
            <option value="EVENT_MANAGEMENT">🎪 Event Production</option>
            <option value="DECORATION">💐 Decoration &amp; Mandap</option>
            <option value="FREELANCE">💻 Freelance &amp; Agency</option>
            <option value="RETAIL">🛍️ Retail &amp; Products</option>
            <option value="CONTRACTOR">🏗️ Contractor &amp; Engineering</option>
            <option value="CREATIVE_AGENCY">🚀 Creative Studio</option>
            <option value="GENERAL">📄 General Business</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Print Template (15 Available)</label>
          <select
            value={doc.templateId}
            onChange={(e) => handleUpdate(prev => ({ ...prev, templateId: e.target.value as TemplateId }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-amber-400 font-semibold focus:border-amber-400 focus:outline-none"
          >
            {TEMPLATE_DEFINITIONS.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Document Number</label>
          <input
            type="text"
            value={doc.documentNumber}
            onChange={(e) => handleUpdate(prev => ({ ...prev, documentNumber: e.target.value }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2: Dates, Currency & Indian GST Place of Supply */}
      <div
        className="p-5 rounded-xl border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Issue Date</label>
          <input
            type="date"
            value={doc.issueDate}
            onChange={(e) => handleUpdate(prev => ({ ...prev, issueDate: e.target.value }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Due Date</label>
          <input
            type="date"
            value={doc.dueDate}
            onChange={(e) => handleUpdate(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Currency</label>
          <select
            value={doc.currency}
            onChange={(e) => handleUpdate(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="INR">INR (₹) - Indian Rupee</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="AED">AED (د.إ) - UAE Dirham</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Place of Supply (GST)</label>
          <select
            value={doc.placeOfSupply}
            onChange={(e) => handlePlaceOfSupplyChange(e.target.value)}
            className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
          >
            {INDIAN_STATES.map(s => (
              <option key={s.code} value={`${s.code}-${s.name}`}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Tax Type: <strong className={doc.isInterState ? 'text-amber-400' : 'text-emerald-400'}>
              {doc.isInterState ? 'Inter-State (IGST 100%)' : 'Intra-State (CGST 50% + SGST 50%)'}
            </strong>
          </span>
        </div>
      </div>

      {/* Row 3: Client / Customer Selector */}
      <div
        className="p-5 rounded-xl border text-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-400" />
            <span>Customer / Billed Client Information</span>
          </span>

          {customers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Load Saved Client:</span>
              <select
                onChange={(e) => handleSelectCustomer(e.target.value)}
                defaultValue=""
                className="p-1.5 rounded bg-black/30 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="" disabled>-- Select Saved Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer / Couple Name *</label>
            <input
              type="text"
              value={doc.customerName}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="e.g. Vikram Malhotra & Aishwarya Sharma"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company / Organization</label>
            <input
              type="text"
              value={doc.customerCompany || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerCompany: e.target.value }))}
              placeholder="Optional company name"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer GSTIN</label>
            <input
              type="text"
              value={doc.customerGstin || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerGstin: e.target.value.toUpperCase() }))}
              placeholder="29ABCDE1234F1Z5"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
            <input
              type="text"
              value={doc.customerPhone}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerPhone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={doc.customerEmail}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerEmail: e.target.value }))}
              placeholder="client@domain.com"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PAN Number</label>
            <input
              type="text"
              value={doc.customerPan || ''}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerPan: e.target.value.toUpperCase() }))}
              placeholder="ABCDE1234F"
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billing Address</label>
            <textarea
              value={doc.customerBillingAddress}
              onChange={(e) => handleUpdate(prev => ({ ...prev, customerBillingAddress: e.target.value }))}
              rows={2}
              placeholder="Full billing address..."
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Row 4: Dedicated Wedding Details Section (Displayed if Wedding industry or weddingDetails exist) */}
      {(doc.industryType === 'WEDDING' || doc.weddingDetails) && (
        <div
          className="p-5 rounded-xl border text-xs space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(49, 46, 129, 0.2) 100%)',
            borderColor: 'rgba(212, 175, 55, 0.4)',
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <span>Wedding Production &amp; Celebration Suite</span>
            </span>

            <button
              onClick={() => setShowPackageModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Import Luxury Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bride's Name</label>
              <input
                type="text"
                value={doc.weddingDetails?.brideName || ''}
                onChange={(e) => handleUpdate(prev => ({
                  ...prev,
                  weddingDetails: {
                    ...(prev.weddingDetails || {
                      brideName: '',
                      groomName: '',
                      weddingDate: '',
                      venueName: '',
                      venueAddress: '',
                      events: [],
                      deliverables: [],
                      milestones: [],
                    }),
                    brideName: e.target.value,
                  }
                }))}
                placeholder="e.g. Aishwarya Sharma"
                className="w-full p-2 rounded-md bg-black/40 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Groom's Name</label>
              <input
                type="text"
                value={doc.weddingDetails?.groomName || ''}
                onChange={(e) => handleUpdate(prev => ({
                  ...prev,
                  weddingDetails: {
                    ...(prev.weddingDetails || {
                      brideName: '',
                      groomName: '',
                      weddingDate: '',
                      venueName: '',
                      venueAddress: '',
                      events: [],
                      deliverables: [],
                      milestones: [],
                    }),
                    groomName: e.target.value,
                  }
                }))}
                placeholder="e.g. Vikram Malhotra"
                className="w-full p-2 rounded-md bg-black/40 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Wedding / Event Date</label>
              <input
                type="date"
                value={doc.weddingDetails?.weddingDate || ''}
                onChange={(e) => handleUpdate(prev => ({
                  ...prev,
                  weddingDetails: {
                    ...(prev.weddingDetails || {
                      brideName: '',
                      groomName: '',
                      weddingDate: '',
                      venueName: '',
                      venueAddress: '',
                      events: [],
                      deliverables: [],
                      milestones: [],
                    }),
                    weddingDate: e.target.value,
                  }
                }))}
                className="w-full p-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Venue Name &amp; Resort Location</label>
              <input
                type="text"
                value={doc.weddingDetails?.venueName || ''}
                onChange={(e) => handleUpdate(prev => ({
                  ...prev,
                  weddingDetails: {
                    ...(prev.weddingDetails || {
                      brideName: '',
                      groomName: '',
                      weddingDate: '',
                      venueName: '',
                      venueAddress: '',
                      events: [],
                      deliverables: [],
                      milestones: [],
                    }),
                    venueName: e.target.value,
                  }
                }))}
                placeholder="e.g. The Leela Palace Bengaluru, Royal Grand Ballroom"
                className="w-full p-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Event Director / Coordinator</label>
              <input
                type="text"
                value={doc.weddingDetails?.coordinatorName || ''}
                onChange={(e) => handleUpdate(prev => ({
                  ...prev,
                  weddingDetails: {
                    ...(prev.weddingDetails || {
                      brideName: '',
                      groomName: '',
                      weddingDate: '',
                      venueName: '',
                      venueAddress: '',
                      events: [],
                      deliverables: [],
                      milestones: [],
                    }),
                    coordinatorName: e.target.value,
                  }
                }))}
                placeholder="Coordinator Name & Phone"
                className="w-full p-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Row 5: Line Items Table */}
      <div
        className="p-5 rounded-xl border text-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Line Items &amp; Services</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs"
            >
              <span>+ Add from Catalog</span>
            </button>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-2">Description</th>
                <th className="py-2.5 px-2 w-24 text-center">HSN/SAC</th>
                <th className="py-2.5 px-2 w-20 text-center">Qty</th>
                <th className="py-2.5 px-2 w-20 text-center">Unit</th>
                <th className="py-2.5 px-2 w-28 text-right">Price</th>
                <th className="py-2.5 px-2 w-24 text-right">Disc</th>
                <th className="py-2.5 px-2 w-20 text-center">GST %</th>
                <th className="py-2.5 px-2 w-28 text-right">Total</th>
                <th className="py-2.5 px-2 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {doc.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Service or product description..."
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.detailedSpecs || ''}
                      onChange={(e) => handleItemChange(idx, 'detailedSpecs', e.target.value)}
                      placeholder="Optional specifications, camera rigs, deliverables..."
                      className="w-full mt-1 p-1 rounded bg-black/20 border border-white/5 text-[11px] text-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="text"
                      value={item.hsnSac}
                      onChange={(e) => handleItemChange(idx, 'hsnSac', e.target.value)}
                      placeholder="HSN/SAC"
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white font-mono text-center text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="any"
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white font-mono text-center text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      placeholder="nos"
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white text-center text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="any"
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white font-mono text-right text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="any"
                      placeholder="0"
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-amber-400 font-mono text-right text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <select
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 rounded bg-black/30 border border-white/10 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>

                  <td className="py-2 px-2 text-right font-mono font-bold text-white text-xs">
                    {DecimalUtils.formatCurrency(item.totalAmount, doc.currency)}
                  </td>

                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleDuplicateItem(idx)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Duplicate Row"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 6: Totals & Summary Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Notes & Terms */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Notes &amp; Appreciation</label>
            <textarea
              value={doc.notes}
              onChange={(e) => handleUpdate(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Thank you for your business..."
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Terms &amp; Conditions</label>
            <textarea
              value={doc.terms}
              onChange={(e) => handleUpdate(prev => ({ ...prev, terms: e.target.value }))}
              rows={4}
              placeholder="1. Advance payment terms..."
              className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-white focus:border-amber-400 focus:outline-none leading-relaxed font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Live Calculation Totals */}
        <div
          className="p-5 rounded-xl border space-y-2.5 font-mono"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between text-slate-400 text-xs">
            <span>Taxable Subtotal:</span>
            <span className="text-white font-medium">{DecimalUtils.formatCurrency(doc.subtotal, doc.currency)}</span>
          </div>

          {doc.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-400 text-xs">
              <span>Total Discounts:</span>
              <span>-{DecimalUtils.formatCurrency(doc.totalDiscount, doc.currency)}</span>
            </div>
          )}

          {doc.isInterState ? (
            <div className="flex justify-between text-slate-400 text-xs">
              <span>Integrated GST (IGST):</span>
              <span className="text-white">{DecimalUtils.formatCurrency(doc.totalIgst, doc.currency)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Central GST (CGST):</span>
                <span className="text-white">{DecimalUtils.formatCurrency(doc.totalCgst, doc.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>State GST (SGST):</span>
                <span className="text-white">{DecimalUtils.formatCurrency(doc.totalSgst, doc.currency)}</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between py-1 border-t border-white/10">
            <label className="flex items-center gap-2 text-[11px] text-slate-400 font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={autoRoundOff}
                onChange={(e) => setAutoRoundOff(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <span>Auto Round-Off</span>
            </label>
            <span className="text-slate-400 text-xs">{DecimalUtils.formatCurrency(doc.roundOff, doc.currency)}</span>
          </div>

          <div
            className="flex justify-between items-center p-3 rounded-lg text-base font-bold text-white border"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--accent-gold)',
            }}
          >
            <span className="font-sans">Grand Total:</span>
            <span className="text-amber-400 text-lg">
              {DecimalUtils.formatCurrency(doc.grandTotal, doc.currency)}
            </span>
          </div>

          <div className="p-2.5 rounded bg-black/30 border border-white/5 font-sans">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount in Words:</span>
            <p className="text-xs text-amber-300 italic mt-0.5">{doc.amountInWords}</p>
          </div>

          {doc.totalPaid > 0 && (
            <div className="flex justify-between text-emerald-400 text-xs pt-1">
              <span>Amount Received / Advances:</span>
              <span>-{DecimalUtils.formatCurrency(doc.totalPaid, doc.currency)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-sm border-t border-white/10 pt-2">
            <span className="font-sans text-white">Balance Due:</span>
            <span className={doc.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}>
              {DecimalUtils.formatCurrency(doc.outstandingBalance, doc.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-xl rounded-xl p-5 border text-xs space-y-4 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-sm">Select Product / Service</h3>
              <button onClick={() => setShowCatalogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleImportProduct(p)}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors border border-white/5"
                >
                  <div>
                    <p className="font-semibold text-white">{p.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{p.description}</p>
                    <span className="text-[10px] text-amber-400 font-mono">SAC: {p.hsnSac} • GST {p.taxRate}%</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-white text-sm">{DecimalUtils.formatCurrency(p.unitPrice, doc.currency)}</p>
                    <span className="text-[10px] text-slate-500">per {p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wedding Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-2xl rounded-xl p-5 border text-xs space-y-4 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Select Luxury Wedding Package</span>
              </h3>
              <button onClick={() => setShowPackageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {weddingPackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => handleImportWeddingPackage(pkg)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-amber-500/30 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300">
                        {pkg.tier} Collection
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{pkg.title}</h4>
                    </div>
                    <p className="font-mono font-bold text-amber-400 text-base">
                      {DecimalUtils.formatCurrency(pkg.price, doc.currency)}
                    </p>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{pkg.description}</p>
                  <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                    {pkg.includedServices.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-black/40 text-slate-300 text-[10px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
