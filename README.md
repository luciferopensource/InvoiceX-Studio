# Lucifer Invoice Studio

<div align="center">

![Lucifer Invoice Studio](https://raw.githubusercontent.com/luciferopensource/InvoiceX-Studio/main/assets/banner.png)

**A World-Class, Offline-First Windows Desktop Invoicing & Billing Studio**  
*Tailored for Wedding Planners, Photographers, Caterers, Decorators, Agencies, and Modern Commercial Enterprises.*

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20x64-blue.svg)]()
[![Electron](https://img.shields.io/badge/Electron-34.x-47848F.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Offline%20WASM-003B57.svg)](https://sql.js.org/)
[![Vitest](https://img.shields.io/badge/Vitest-100%25%20Passing-green.svg)](https://vitest.dev/)

[Features](#-key-features) • [Wedding Suite](#-first-class-wedding-billing-suite) • [Templates](#-15-distinct-invoice-templates) • [GST Engine](#-indian-gst-engine) • [Installation](#-installation--download) • [Architecture](#-architecture)

</div>

---

## 🌟 Executive Summary

**Lucifer Invoice Studio** (repository: `InvoiceX-Studio`) is a desktop billing application engineered for the wedding and service industry. Unlike generic invoicing tools, Lucifer Invoice Studio combines **first-class wedding and event management** (couple names, multi-day itinerary cards, per-plate catering formulas, and photography deliverables) with an **offline-first local SQLite engine**, precision decimal arithmetic, Indian GST statutory compliance, and **15 print-ready invoice templates**.

The application operates **100% offline** without requiring external subscriptions, paid cloud servers, or active internet connections.

---

## ✨ Key Features

- 💍 **First-Class Wedding Billing:** Couple registry, multi-day function schedules (Haldi, Mehendi, Sangeet, Muhurtham, Reception), per-plate catering calculations, and album deliverables.
- 🎨 **15 Distinct Invoice Templates:** Genuinely unique visual layouts covering Royal Luxury, Romantic Floral, Swiss Minimal, Corporate Executive, Indian GST, Studio Photography, Catering, and Trade Contractors.
- ⚡ **Precision Decimal Financial Engine:** Floating-point-safe arithmetic preventing rounding errors in discounts, taxes, and settlements.
- 🇮🇳 **Indian GST Compliance:** 15-character GSTIN validation, all 38 Indian States & UTs, automatic Inter-State (IGST) vs Intra-State (CGST + SGST) routing, HSN/SAC codes, and reverse charge.
- 🔤 **Dual Amount in Words:** Converts invoice totals into words in both Indian format (*Crores, Lakhs, Thousands, Paise*) and International format (*Millions, Billions, Cents*).
- 💾 **Offline-First Persistence:** Embedded SQLite WASM database automatically persisted to Windows user data (`%APPDATA%/lucifer_invoices.sqlite`) with JSON backup/restore.
- 🖥️ **Modern Windows Experience:** Custom frameless title bar with window drag region, minimize, maximize/restore, close, 4 UI themes (Royal Gold, Midnight Blue, Graphite, Minimal Light), and keyboard shortcuts (`Ctrl+N`, `Ctrl+F`).
- 🖨️ **Print & PDF Generation:** Direct hardware printing and PDF rendering via Chromium engine.
- 📦 **Windows Distribution:** NSIS installer (`.exe`) and portable single-file executable.

---

## 💍 First-Class Wedding Billing Suite

Wedding billing is a core, first-class feature of Lucifer Invoice Studio:

1. **Couple & Event Metadata:** Record Bride & Groom names, primary wedding date, venue, and on-ground coordinator contacts.
2. **Multi-Day Itinerary Tracking:** Add distinct ceremonies with specific dates, times, venues, and notes (e.g., Sangeet, Phere, Reception banquet).
3. **Photography & Cinematography Crew Allocation:** Track candid photographers, cinematographers, drone pilots, and live streaming units.
4. **Deliverables Milestone Schedule:** Set expected completion dates for 4K teasers, raw photo drives, and handcrafted Italian leather albums.
5. **Catering Per-Plate Calculator:** Calculate guest headcount multiplied by per-plate rates with automatic GST breakdowns.
6. **Payment Milestones & Advance Deposits:** Track booking tokens (e.g. 20%), event-day installments (50%), and final delivery settlements (30%) with overpayment prevention.

---

## 🎨 15 Distinct Invoice Templates

Lucifer Invoice Studio provides 15 print-ready templates:

| # | Template Name | Category | Primary Focus & Visual Style |
|---|---------------|----------|------------------------------|
| 1 | **Royal Black & Gold** | Wedding | Regal 24K gold foil accent, Cinzel serif typography, luxury monogram crest |
| 2 | **Elegant Wedding** | Wedding | Champagne gold & blush rose calligraphy, couple focus, milestone payment progress |
| 3 | **Luxury Wedding** | Wedding | Royal emerald & satin gold, destination venue cards, crew breakdown |
| 4 | **Floral Wedding** | Wedding | Lavender & rose botanical pastel borders, romantic script, soft typography |
| 5 | **Minimal White** | Corporate | Swiss International typographic grid, high-contrast monochrome, ultra-clean |
| 6 | **Modern Corporate** | Corporate | Executive cobalt & slate blue, purchase order bar, structured summary block |
| 7 | **Indian GST Statutory** | Statutory | Consignor & Consignee boxes, State Code, HSN summary table, Reverse Charge |
| 8 | **Photography Studio** | Creative | Dark slate & tungsten amber, shoot specs, gear breakdown, licensing rights |
| 9 | **Catering Services** | Specialized | Burgundy & saffron, per-plate buffet calculator, banquet meal sessions |
| 10 | **Event Management** | Specialized | Deep indigo & violet, production timeline progress, vendor deliverables |
| 11 | **Decoration Services** | Specialized | Royal plum & copper, decor element breakdown, setup/teardown hours |
| 12 | **Freelance Services** | Creative | Modern teal & graphite, hourly milestones, instant UPI QR block |
| 13 | **Retail & Products** | Specialized | Store layout, SKU & Barcode column, warranty & return policy badge |
| 14 | **Contractor Services** | Specialized | Blueprint slate, scope of work breakdown, materials vs labor, site sign-off |
| 15 | **Creative Agency** | Creative | Avant-garde agency design, deliverable matrix, intellectual property release |

---

## 🇮🇳 Indian GST Engine

- **GSTIN Format Validation:** Validates standard 15-character structure: `[State Code 2d] + [PAN 10c] + [Entity 1c] + Z + [Checksum 1c]`.
- **38 States & Territories:** Accurate state lookup across all Indian states and Union Territories (e.g., `29-Karnataka`, `27-Maharashtra`, `07-Delhi`).
- **Automated Tax Determination:** Compares business supply origin and customer place of supply to route automatically:
  - Intra-State: **CGST** (e.g., 9%) + **SGST** (e.g., 9%)
  - Inter-State: **IGST** (e.g., 18%)
- **HSN/SAC Code Support:** Display mandatory codes for goods and service classifications.
- **Tax Inclusive vs Exclusive:** Toggle tax-inclusive pricing per line item with auto-calculation of taxable values.

---

## 📦 Installation & Download

### Download Executable

1. Navigate to the [Releases](https://github.com/luciferopensource/InvoiceX-Studio/releases) tab.
2. Download the latest installer:
   - **Installer (.exe):** `Lucifer Invoice Studio Setup 1.0.0.exe` (NSIS setup with Desktop and Start Menu shortcuts)
   - **Portable (.exe):** `Lucifer Invoice Studio 1.0.0.exe` (Runs immediately without installation)
3. Launch the application.

---

## 🛠️ Development & Building from Source

### Prerequisites
- [Node.js](https://nodejs.org/) v20.x or higher
- npm v10.x or higher
- Windows 10/11 x64

### 1. Clone & Install
```bash
git clone https://github.com/luciferopensource/InvoiceX-Studio.git
cd InvoiceX-Studio
npm install
```

### 2. Run in Development Mode
```bash
# Web browser development preview
npm run dev

# Native Windows Electron desktop mode
npm run build:electron
npm run electron:dev
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all unit tests covering decimal math, financial line items, GST routing, amount in words, and template registries.*

### 4. Build Windows Desktop Installer
```bash
npm run electron:build
```
*Builds production bundles and outputs `Lucifer Invoice Studio Setup 1.0.0.exe` into the `release/` directory.*

---

## 🏗️ Architecture

```text
InvoiceX Studio/
├── electron/                   # Native Windows desktop integration
│   ├── main.ts                 # Window management, frameless controls, IPC handlers
│   └── preload.ts              # Secure contextBridge API exposing native functions
├── src/
│   ├── core/
│   │   ├── calculations/       # Decimal arithmetic, GST validation, Amount-in-words
│   │   ├── database/           # SQLite WASM engine, migrations, sample seed data
│   │   └── types/              # Domain models (Invoice, Customer, Wedding, Payments)
│   └── components/
│       ├── layout/             # Frameless TitleBar, Sidebar, App theme management
│       ├── templates/          # All 15 print-ready invoice templates & master renderer
│       ├── modals/             # Preview & PDF export, Record Payment, Customer selector
│       └── views/              # Dashboard, Document Editor, Wedding Suite, Customers, Catalog
├── tests/                      # Automated Vitest test suites (100% passing)
├── release/                    # Built Windows NSIS installers and executables
└── package.json
```

---

## 🛡️ Security & Privacy

- **Offline-First:** All customer details, financial data, and invoice records remain strictly on the user's computer.
- **Sandboxed Electron Architecture:** Renderer operates with `nodeIntegration: false` and `contextIsolation: true`.
- **Zero Telemetry:** No user analytics or tracking code.

See [SECURITY.md](SECURITY.md) for vulnerability disclosure policies.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2026 **Lucifer Open Source**.
