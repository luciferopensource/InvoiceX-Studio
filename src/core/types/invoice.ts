export type DocumentType = 
  | 'INVOICE'
  | 'QUOTATION'
  | 'PROFORMA'
  | 'RECEIPT'
  | 'CREDIT_NOTE'
  | 'DEBIT_NOTE'
  | 'PURCHASE_ORDER'
  | 'DELIVERY_NOTE';

export type PaymentStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type IndustryType = 
  | 'WEDDING'
  | 'PHOTOGRAPHY'
  | 'CATERING'
  | 'EVENT_MANAGEMENT'
  | 'DECORATION'
  | 'FREELANCE'
  | 'RETAIL'
  | 'CONTRACTOR'
  | 'CREATIVE_AGENCY'
  | 'GENERAL';

export type TemplateId = 
  | 'royal-black-gold'
  | 'elegant-wedding'
  | 'luxury-wedding'
  | 'floral-wedding'
  | 'minimal-white'
  | 'modern-corporate'
  | 'indian-gst'
  | 'photography-studio'
  | 'catering-services'
  | 'event-management'
  | 'decoration-services'
  | 'freelance-services'
  | 'retail-products'
  | 'contractor-services'
  | 'creative-agency';

export type PaymentMethod = 
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'UPI'
  | 'CHEQUE'
  | 'CARD'
  | 'ONLINE';

export interface WeddingEvent {
  id: string;
  name: string; // e.g. 'Haldi Ceremony', 'Sangeet Night', 'Muhurtham', 'Grand Reception'
  date: string;
  time: string;
  venue: string;
  notes?: string;
}

export interface WeddingDeliverable {
  id: string;
  title: string;
  specs?: string;
  expectedDate: string;
  delivered: boolean;
}

export interface WeddingMilestone {
  id: string;
  title: string; // e.g. 'Advance Booking Token (20%)'
  percentage: number;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface WeddingDetails {
  brideName: string;
  groomName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  coordinatorName?: string;
  coordinatorPhone?: string;
  events: WeddingEvent[];
  photographyPackage?: {
    traditionalPhotographers: number;
    candidPhotographers: number;
    cinematographers: number;
    dronePilots: number;
    albumCount: number;
    albumSheetCount: number;
    teaserDuration: string;
    fullVideoDuration: string;
    rawFootageIncluded: boolean;
    droneIncluded: boolean;
  };
  cateringDetails?: {
    guestCount: number;
    plateRate: number;
    tier: 'Silver' | 'Gold' | 'Platinum' | 'Custom';
    sessions: string[];
    liveCounters?: string[];
  };
  deliverables: WeddingDeliverable[];
  milestones: WeddingMilestone[];
  cancellationPolicy?: string;
  specialRequests?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  detailedSpecs?: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'PERCENT' | 'FLAT';
  taxRate: number; // e.g., 0, 5, 12, 18, 28
  taxInclusive: boolean;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  shippingAddress?: string;
  gstin?: string;
  pan?: string;
  stateCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  tagline?: string;
  logoUrl?: string;
  signatureUrl?: string;
  stampUrl?: string;
  watermarkUrl?: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin?: string;
  pan?: string;
  cin?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBranch?: string;
  upiId?: string;
  upiQrCodeUrl?: string;
  defaultCurrency: string; // 'INR', 'USD', 'EUR', etc.
  defaultTemplate: TemplateId;
  termsAndConditions: string;
  defaultNotes: string;
  isDefault: boolean;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface TemplateConfig {
  accentColor?: string;
  fontFamily?: string;
  fontSize?: 'compact' | 'normal' | 'relaxed';
  spacing?: 'compact' | 'normal' | 'relaxed';
  showWatermark?: boolean;
  watermarkText?: string;
  watermarkOpacity?: number;
  showSignature?: boolean;
  showStamp?: boolean;
  showQrCode?: boolean;
  logoPosition?: 'left' | 'right' | 'center';
  customCss?: string;
}

export interface InvoiceDocument {
  id: string;
  documentNumber: string;
  seriesPrefix: string;
  documentType: DocumentType;
  industryType: IndustryType;
  templateId: TemplateId;
  templateConfig: TemplateConfig;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  placeOfSupply: string;
  isInterState: boolean;
  reverseCharge: boolean;
  
  // Business Snapshot
  businessProfileId: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessGstin?: string;
  businessPan?: string;
  businessLogoUrl?: string;
  businessSignatureUrl?: string;
  businessStampUrl?: string;
  bankDetails?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    branch?: string;
    upiId?: string;
  };

  // Customer Snapshot
  customerId?: string;
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  customerPhone: string;
  customerBillingAddress: string;
  customerShippingAddress?: string;
  customerGstin?: string;
  customerPan?: string;
  customerStateCode?: string;

  // Wedding-Specific Fields
  weddingDetails?: WeddingDetails;

  // Items
  items: InvoiceLineItem[];

  // Calculation Breakdown
  subtotal: number;
  totalDiscount: number;
  additionalCharges: Array<{
    id: string;
    title: string;
    amount: number;
  }>;
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;

  // Payments Ledger
  payments: PaymentRecord[];
  totalPaid: number;
  outstandingBalance: number;

  // Meta & Notes
  notes: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
}
