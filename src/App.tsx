import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar, ActiveView } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { DocumentEditor } from './components/editor/DocumentEditor';
import { PreviewModal } from './components/preview/PreviewModal';
import { RecordPaymentModal } from './components/payments/RecordPaymentModal';
import { WeddingSuiteView } from './components/wedding/WeddingSuiteView';
import { CustomerListView } from './components/customers/CustomerListView';
import { CatalogView } from './components/catalog/CatalogView';
import { SettingsView } from './components/settings/SettingsView';

import { InvoiceDocument, BusinessProfile, Customer, TemplateId } from './core/types/invoice';
import { SQLiteService, ProductItem, WeddingPackageItem } from './core/database/sqliteService';
import { 
  SAMPLE_BUSINESS_PROFILE, 
  SAMPLE_WEDDING_INVOICE, 
  SAMPLE_CUSTOMERS, 
  SAMPLE_PRODUCTS, 
  SAMPLE_WEDDING_PACKAGES 
} from './core/database/sampleData';
import { ExportService } from './core/pdf/pdfService';
import { Search, X, Heart, FileText, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [currentTheme, setCurrentTheme] = useState<string>('royal-black-gold');
  
  // Data States
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [weddingPackages, setWeddingPackages] = useState<WeddingPackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Navigation Targets
  const [editingInvoice, setEditingInvoice] = useState<InvoiceDocument | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceDocument | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceDocument | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply Theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Load database on mount
  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    setIsLoading(true);
    try {
      const db = SQLiteService.getInstance();
      await db.init();

      let loadedInvoices = await db.getInvoices();
      let loadedProfiles = await db.getBusinessProfiles();
      let loadedCustomers = await db.getCustomers();
      let loadedProducts = await db.getProducts();
      let loadedPackages = await db.getWeddingPackages();

      // Seed sample data if fresh database
      if (loadedProfiles.length === 0) {
        await db.saveBusinessProfile(SAMPLE_BUSINESS_PROFILE);
        loadedProfiles = [SAMPLE_BUSINESS_PROFILE];
      }

      if (loadedInvoices.length === 0) {
        await db.saveInvoice(SAMPLE_WEDDING_INVOICE);
        loadedInvoices = [SAMPLE_WEDDING_INVOICE];
      }

      if (loadedCustomers.length === 0) {
        for (const c of SAMPLE_CUSTOMERS) await db.saveCustomer(c);
        loadedCustomers = SAMPLE_CUSTOMERS;
      }

      if (loadedProducts.length === 0) {
        for (const p of SAMPLE_PRODUCTS) await db.saveProduct(p);
        loadedProducts = SAMPLE_PRODUCTS;
      }

      if (loadedPackages.length === 0) {
        for (const pkg of SAMPLE_WEDDING_PACKAGES) await db.saveWeddingPackage(pkg);
        loadedPackages = SAMPLE_WEDDING_PACKAGES;
      }

      setInvoices(loadedInvoices);
      setBusinessProfiles(loadedProfiles);
      setCustomers(loadedCustomers);
      setProducts(loadedProducts);
      setWeddingPackages(loadedPackages);
    } catch (err) {
      console.error('Error loading database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard Shortcuts (Ctrl+N, Ctrl+F, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNewInvoice();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setPreviewInvoice(null);
        setPaymentInvoice(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoices, businessProfiles]);

  // Create Standard Invoice
  const handleCreateNewInvoice = () => {
    const defaultBiz = businessProfiles.find(b => b.isDefault) || businessProfiles[0] || SAMPLE_BUSINESS_PROFILE;
    const count = invoices.length + 1;
    const docNum = `INV-2026-${count.toString().padStart(4, '0')}`;

    const newDoc: InvoiceDocument = {
      id: `inv_${Date.now()}`,
      documentNumber: docNum,
      seriesPrefix: 'INV-2026-',
      documentType: 'INVOICE',
      industryType: 'GENERAL',
      templateId: defaultBiz.defaultTemplate || 'modern-corporate',
      templateConfig: {
        accentColor: '#2563EB',
        fontFamily: 'Inter',
        fontSize: 'normal',
        spacing: 'normal',
        showWatermark: false,
        showSignature: true,
        showStamp: true,
        showQrCode: true,
        logoPosition: 'left',
      },
      status: 'DRAFT',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      currency: defaultBiz.defaultCurrency || 'INR',
      placeOfSupply: `${defaultBiz.state || 'Karnataka'}`,
      isInterState: false,
      reverseCharge: false,

      businessProfileId: defaultBiz.id,
      businessName: defaultBiz.businessName,
      businessAddress: defaultBiz.address,
      businessEmail: defaultBiz.email,
      businessPhone: defaultBiz.phone,
      businessGstin: defaultBiz.gstin,
      businessPan: defaultBiz.pan,
      bankDetails: {
        bankName: defaultBiz.bankName,
        accountName: defaultBiz.bankAccountName,
        accountNumber: defaultBiz.bankAccountNumber,
        ifsc: defaultBiz.bankIfsc,
        branch: defaultBiz.bankBranch,
        upiId: defaultBiz.upiId,
      },

      customerName: '',
      customerBillingAddress: '',
      customerEmail: '',
      customerPhone: '',

      items: [
        {
          id: `item_${Date.now()}`,
          description: 'Consultation & Professional Services',
          hsnSac: '998314',
          quantity: 1,
          unit: 'hrs',
          unitPrice: 5000,
          discount: 0,
          discountType: 'FLAT',
          taxRate: 18,
          taxInclusive: false,
          taxableAmount: 5000,
          cgstRate: 9,
          cgstAmount: 450,
          sgstRate: 9,
          sgstAmount: 450,
          igstRate: 0,
          igstAmount: 0,
          totalAmount: 5900,
        }
      ],
      subtotal: 5000,
      totalDiscount: 0,
      additionalCharges: [],
      taxableAmount: 5000,
      totalCgst: 450,
      totalSgst: 450,
      totalIgst: 0,
      totalTax: 900,
      roundOff: 0,
      grandTotal: 5900,
      amountInWords: 'Rupees Five Thousand Nine Hundred Only',
      payments: [],
      totalPaid: 0,
      outstandingBalance: 5900,
      notes: defaultBiz.defaultNotes || 'Thank you for your business!',
      terms: defaultBiz.termsAndConditions || 'Payment due within 15 days.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(newDoc);
    setActiveView('editor');
  };

  // Create Wedding Invoice
  const handleCreateNewWeddingInvoice = () => {
    const defaultBiz = businessProfiles.find(b => b.isDefault) || businessProfiles[0] || SAMPLE_BUSINESS_PROFILE;
    const count = invoices.filter(i => i.industryType === 'WEDDING').length + 1;
    const docNum = `WED-2026-${count.toString().padStart(4, '0')}`;

    const newDoc: InvoiceDocument = {
      id: `inv_wedding_${Date.now()}`,
      documentNumber: docNum,
      seriesPrefix: 'WED-2026-',
      documentType: 'INVOICE',
      industryType: 'WEDDING',
      templateId: 'royal-black-gold',
      templateConfig: {
        accentColor: '#D4AF37',
        fontFamily: 'Cinzel',
        fontSize: 'normal',
        spacing: 'normal',
        showWatermark: true,
        watermarkText: 'LUCIFER ROYAL',
        watermarkOpacity: 0.04,
        showSignature: true,
        showStamp: true,
        showQrCode: true,
        logoPosition: 'left',
      },
      status: 'DRAFT',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currency: 'INR',
      placeOfSupply: `${defaultBiz.state || 'Karnataka'}`,
      isInterState: false,
      reverseCharge: false,

      businessProfileId: defaultBiz.id,
      businessName: defaultBiz.businessName,
      businessAddress: defaultBiz.address,
      businessEmail: defaultBiz.email,
      businessPhone: defaultBiz.phone,
      businessGstin: defaultBiz.gstin,
      businessPan: defaultBiz.pan,
      bankDetails: {
        bankName: defaultBiz.bankName,
        accountName: defaultBiz.bankAccountName,
        accountNumber: defaultBiz.bankAccountNumber,
        ifsc: defaultBiz.bankIfsc,
        branch: defaultBiz.bankBranch,
        upiId: defaultBiz.upiId,
      },

      customerName: 'Groom & Bride',
      customerBillingAddress: '',
      customerEmail: '',
      customerPhone: '',

      weddingDetails: {
        brideName: '',
        groomName: '',
        weddingDate: '',
        venueName: '',
        venueAddress: '',
        coordinatorName: '',
        coordinatorPhone: '',
        events: [
          {
            id: `ev_${Date.now()}_1`,
            name: 'Sangeet & Cocktail Night',
            date: '',
            time: '07:00 PM',
            venue: '',
          },
          {
            id: `ev_${Date.now()}_2`,
            name: 'Vedic Muhurtham & Phere',
            date: '',
            time: '09:00 AM',
            venue: '',
          },
          {
            id: `ev_${Date.now()}_3`,
            name: 'Grand Wedding Reception',
            date: '',
            time: '07:30 PM',
            venue: '',
          }
        ],
        photographyPackage: {
          traditionalPhotographers: 2,
          candidPhotographers: 2,
          cinematographers: 2,
          dronePilots: 1,
          albumCount: 2,
          albumSheetCount: 50,
          teaserDuration: '3-5 mins',
          fullVideoDuration: '60 mins',
          rawFootageIncluded: true,
          droneIncluded: true,
        },
        deliverables: [
          { id: `del_${Date.now()}_1`, title: '4K Cinematic Teaser', expectedDate: '', delivered: false },
          { id: `del_${Date.now()}_2`, title: '2 Leather Flushmount Albums', expectedDate: '', delivered: false },
        ],
        milestones: [
          { id: `ms_${Date.now()}_1`, title: 'Advance Booking Token (30%)', percentage: 30, amount: 0, dueDate: '', paid: false },
          { id: `ms_${Date.now()}_2`, title: 'Wedding Day Payment (50%)', percentage: 50, amount: 0, dueDate: '', paid: false },
          { id: `ms_${Date.now()}_3`, title: 'Final Balance on Album Delivery (20%)', percentage: 20, amount: 0, dueDate: '', paid: false },
        ],
        cancellationPolicy: 'Advance is non-refundable upon cancellation within 30 days of event.',
      },

      items: [
        {
          id: `item_${Date.now()}`,
          description: 'The Royal Sovereign 3-Day Wedding Photography & Cinematography Suite',
          detailedSpecs: '2 Candid Photographers + 2 Traditional Photographers + 2 Cinematographers + 4K Drone Pilot',
          hsnSac: '998381',
          quantity: 1,
          unit: 'pkg',
          unitPrice: 250000,
          discount: 0,
          discountType: 'FLAT',
          taxRate: 18,
          taxInclusive: false,
          taxableAmount: 250000,
          cgstRate: 9,
          cgstAmount: 22500,
          sgstRate: 9,
          sgstAmount: 22500,
          igstRate: 0,
          igstAmount: 0,
          totalAmount: 295000,
        }
      ],
      subtotal: 250000,
      totalDiscount: 0,
      additionalCharges: [],
      taxableAmount: 250000,
      totalCgst: 22500,
      totalSgst: 22500,
      totalIgst: 0,
      totalTax: 45000,
      roundOff: 0,
      grandTotal: 295000,
      amountInWords: 'Rupees Two Lakh Ninety-Five Thousand Only',
      payments: [],
      totalPaid: 0,
      outstandingBalance: 295000,
      notes: defaultBiz.defaultNotes || 'Honored to capture your timeless legacy.',
      terms: defaultBiz.termsAndConditions || 'Payment in 3 milestones.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(newDoc);
    setActiveView('editor');
  };

  // Save Document to SQLite Database
  const handleSaveInvoice = async (doc: InvoiceDocument) => {
    try {
      const db = SQLiteService.getInstance();
      await db.saveInvoice(doc);

      setInvoices(prev => {
        const idx = prev.findIndex(i => i.id === doc.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = doc;
          return next;
        }
        return [doc, ...prev];
      });

      setEditingInvoice(null);
      setActiveView('invoices');
    } catch (err) {
      console.error('Error saving invoice:', err);
    }
  };

  // Delete Document
  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document? This action is permanent.')) {
      return;
    }

    try {
      const db = SQLiteService.getInstance();
      await db.deleteInvoice(id);
      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  // Duplicate Document
  const handleDuplicateInvoice = async (doc: InvoiceDocument) => {
    const count = invoices.length + 1;
    const newDoc: InvoiceDocument = {
      ...doc,
      id: `inv_${Date.now()}`,
      documentNumber: `${doc.seriesPrefix || 'INV-2026-'}${count.toString().padStart(4, '0')}`,
      status: 'DRAFT',
      payments: [],
      totalPaid: 0,
      outstandingBalance: doc.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await handleSaveInvoice(newDoc);
  };

  // Save Business Profile
  const handleSaveProfile = async (profile: BusinessProfile) => {
    try {
      const db = SQLiteService.getInstance();
      await db.saveBusinessProfile(profile);
      setBusinessProfiles(prev => {
        const idx = prev.findIndex(b => b.id === profile.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = profile;
          return next;
        }
        return [profile, ...prev];
      });
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  // Save Customer
  const handleSaveCustomer = async (cust: Customer) => {
    try {
      const db = SQLiteService.getInstance();
      await db.saveCustomer(cust);
      setCustomers(prev => {
        const idx = prev.findIndex(c => c.id === cust.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = cust;
          return next;
        }
        return [cust, ...prev];
      });
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      const db = SQLiteService.getInstance();
      await db.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  // Save Product
  const handleSaveProduct = async (prod: ProductItem) => {
    try {
      const db = SQLiteService.getInstance();
      await db.saveProduct(prod);
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === prod.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = prod;
          return next;
        }
        return [prod, ...prev];
      });
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this service/item?')) return;
    try {
      const db = SQLiteService.getInstance();
      await db.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Global search filtering
  const searchResults = invoices.filter(inv =>
    inv.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.weddingDetails?.brideName && inv.weddingDetails.brideName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (inv.weddingDetails?.groomName && inv.weddingDetails.groomName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeBiz = businessProfiles.find(b => b.isDefault) || businessProfiles[0];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Title Bar (with Windows drag, maximize, minimize, close controls) */}
      <TitleBar
        onSearchClick={() => setSearchModalOpen(true)}
        activeBusinessName={activeBiz?.businessName}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onNewInvoice={handleCreateNewInvoice}
          onNewWeddingInvoice={handleCreateNewWeddingInvoice}
          invoiceCount={invoices.length}
        />

        {/* View Content Area */}
        <main
          className="flex-1 overflow-hidden transition-colors"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-amber-400 font-mono animate-pulse">
              Initializing Lucifer SQLite Engine...
            </div>
          ) : activeView === 'editor' && editingInvoice ? (
            <DocumentEditor
              initialDocument={editingInvoice}
              businessProfiles={businessProfiles}
              customers={customers}
              products={products}
              weddingPackages={weddingPackages}
              onSave={handleSaveInvoice}
              onPreview={(doc) => setPreviewInvoice(doc)}
              onCancel={() => {
                setEditingInvoice(null);
                setActiveView('dashboard');
              }}
            />
          ) : activeView === 'wedding' ? (
            <WeddingSuiteView
              invoices={invoices}
              weddingPackages={weddingPackages}
              onNewWeddingInvoice={handleCreateNewWeddingInvoice}
              onViewInvoice={(doc) => setPreviewInvoice(doc)}
              onEditInvoice={(doc) => {
                setEditingInvoice(doc);
                setActiveView('editor');
              }}
              onSavePackage={async (pkg) => {
                const db = SQLiteService.getInstance();
                await db.saveWeddingPackage(pkg);
                loadDatabase();
              }}
            />
          ) : activeView === 'customers' ? (
            <CustomerListView
              customers={customers}
              invoices={invoices}
              onSaveCustomer={handleSaveCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onCreateInvoiceForCustomer={(cust) => {
                handleCreateNewInvoice();
              }}
            />
          ) : activeView === 'catalog' ? (
            <CatalogView
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          ) : activeView === 'settings' ? (
            <SettingsView
              businessProfiles={businessProfiles}
              onSaveProfile={handleSaveProfile}
              onRefreshData={loadDatabase}
            />
          ) : (
            <Dashboard
              invoices={invoices}
              onNewInvoice={handleCreateNewInvoice}
              onNewWeddingInvoice={handleCreateNewWeddingInvoice}
              onViewInvoice={(doc) => setPreviewInvoice(doc)}
              onEditInvoice={(doc) => {
                setEditingInvoice(doc);
                setActiveView('editor');
              }}
              onDuplicateInvoice={handleDuplicateInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onRecordPayment={(doc) => setPaymentInvoice(doc)}
              onExportCsv={() => ExportService.exportInvoicesToCsv(invoices)}
            />
          )}
        </main>
      </div>

      {/* Global Preview Modal */}
      {previewInvoice && (
        <PreviewModal
          document={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          onTemplateChange={(templateId) => {
            setPreviewInvoice(prev => prev ? { ...prev, templateId } : null);
          }}
        />
      )}

      {/* Record Payment Modal */}
      {paymentInvoice && (
        <RecordPaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onRecord={async (updated) => {
            await handleSaveInvoice(updated);
          }}
        />
      )}

      {/* Global Search Modal (Ctrl+F) */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center pt-24 p-4 z-50 animate-fade-in">
          <div
            className="w-full max-w-xl rounded-2xl p-4 border text-xs space-y-3 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Search className="w-4 h-4 text-amber-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all invoices, brides, grooms, and clients..."
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none placeholder-slate-500"
              />
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1">
              {searchQuery.trim() === '' ? (
                <p className="text-slate-500 text-center py-6">Type to search invoices, amounts, and weddings...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No matching documents found.</p>
              ) : (
                searchResults.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setPreviewInvoice(inv);
                      setSearchModalOpen(false);
                    }}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors border border-white/5"
                  >
                    <div>
                      <span className="font-mono text-amber-400 font-bold">{inv.documentNumber}</span>
                      <p className="font-semibold text-white mt-0.5">{inv.customerName}</p>
                      {inv.weddingDetails && (
                        <p className="text-[11px] text-amber-300 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400 fill-current" />
                          <span>{inv.weddingDetails.brideName} &amp; {inv.weddingDetails.groomName}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-mono font-bold text-white">
                        {inv.currency} {inv.grandTotal.toLocaleString()}
                      </p>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
