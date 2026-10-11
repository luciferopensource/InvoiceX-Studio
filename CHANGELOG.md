# Changelog

All notable changes to **Lucifer Invoice Studio** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-12

### Added
- **First-Class Wedding Billing & Event Suite**:
  - Dedicated wedding details with bride/groom names, venue, coordinator contact, and custom packages.
  - Multi-day wedding event itinerary management (Haldi, Mehendi, Sangeet, Muhurtham, Imperial Reception).
  - Per-plate catering calculator with guest headcount and dynamic tax calculations.
  - Photography crew, gear specs, drone pilot assignment, and album deliverable milestone tracking.
  - Advance booking token, event-day payments, milestone installments, and cancellation policy terms.
- **15 Distinct Print-Ready Invoice Templates**:
  - Royal Black & Gold (Signature Luxury serif with monogram)
  - Elegant Wedding (Champagne gold & blush calligraphy)
  - Luxury Wedding (Deep emerald & satin gold)
  - Floral Wedding (Lavender botanical pastel)
  - Minimal White (Swiss typographic grid)
  - Modern Corporate (Navy & cobalt executive layout with QR block)
  - Indian GST Statutory Invoice (Dual Consignor/Consignee boxes, State Code, HSN tax table, Reverse Charge)
  - Photography Studio (Dark slate with equipment breakdown and copyright licensing)
  - Catering Services (Per-plate buffet calculator and meal sessions)
  - Event Management (Production timeline milestone progression)
  - Decoration Services (Plum & copper with decor category breakdown)
  - Freelance & Consultant (Teal milestone deliverables and instant UPI QR)
  - Retail & Products (POS format with SKU, barcode, and warranty clause)
  - Contractor & Engineering (Blueprint slate with scope and materials vs labor)
  - Creative Agency (Avant-garde layout with intellectual property release)
- **Financial & Monetary Engine**:
  - Arbitrary-precision decimal arithmetic avoiding floating-point calculation errors.
  - Indian GST compliance engine supporting 15-character GSTIN regex validation and all 38 Indian states & union territories.
  - Automated Inter-State (IGST) versus Intra-State (CGST + SGST) tax routing based on business place of supply and customer state.
  - Dual Amount in Words generator: Indian numbering (Crores, Lakhs, Thousands, Paise) and International format (Millions, Billions, Cents).
- **Offline-First Persistence**:
  - Embedded SQLite WASM engine bundled locally without any internet dependency.
  - Electron disk synchronization storing data at `userData/lucifer_invoices.sqlite`.
  - In-browser IndexedDB persistence fallback.
  - Full database backup export and JSON restore with integrity checks.
- **Windows Desktop Experience**:
  - Modern frameless title bar with window drag region, minimize, maximize/restore, and close buttons.
  - Responsive layouts with 4 application appearance themes: Royal Gold, Midnight Blue, Graphite, and Minimal Light.
  - Global keyboard shortcuts: `Ctrl+N` (New Document), `Ctrl+F` (Global Search), `Escape` (Close modals).
  - Real-time print preview, direct thermal/laser printing, and PDF export via Chromium engine.
  - Automated packaging targeting Windows 64-bit NSIS installer and portable executable.
