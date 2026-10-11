# Product Roadmap — Lucifer Invoice Studio

This roadmap outlines the development milestones, feature releases, and architectural trajectory of **Lucifer Invoice Studio**.

---

## 🎯 Release Horizons

### Phase 1: v1.0.0 — Production Release (Completed)
- [x] **Wedding Billing Suite:** First-class couples, events, deliverables, and catering calculators.
- [x] **15 Distinct Templates:** Tailored across weddings, corporate, freelance, trade, and retail.
- [x] **Monetary Precision:** Decimal-safe arithmetic eliminating IEEE 754 floating-point inaccuracies.
- [x] **Indian GST Engine:** State code validation (38 states/UTs), IGST vs CGST+SGST, and HSN/SAC lookups.
- [x] **Dual Number to Words:** Comprehensive Indian (Lakhs/Crores) and International (Millions/Billions) word conversion.
- [x] **Offline-First Persistence:** Local SQLite WASM storage synced to Windows AppData with zero network dependency.
- [x] **Modern Windows Experience:** Custom frameless title bar, window snapping, keyboard shortcuts (`Ctrl+N`, `Ctrl+F`), and 4 UI themes.
- [x] **Export & Print:** High-fidelity PDF generation via Chromium print-to-PDF, direct printer integration, and JSON backup/restore.
- [x] **Windows Packaging:** Distributable 64-bit NSIS installer and portable executable.

---

### Phase 2: v1.1.0 — Print & Workflow Enhancements (Near-Term)
- [ ] **Direct Thermal Printing (ESC/POS):** Native USB and network thermal receipt printer communication for retail POS receipts.
- [ ] **Batch PDF Export:** Bulk export of filtered invoices into a timestamped zip archive.
- [ ] **Custom Font Loading:** Local import of custom branding fonts (`.woff2`, `.ttf`) for personalized typography.
- [ ] **Audit Trail & Revision History:** Lightweight change tracking for issued invoices and quotations.
- [ ] **Automated Daily Backups:** Configurable local folder backup schedule with automatic rotation.

---

### Phase 3: v1.2.0 — Extended Commercial Operations (Mid-Term)
- [ ] **Vendor & Subcontractor Expenses:** Purchase orders and expense logging linked to specific wedding and event projects.
- [ ] **Delivery Notes & Packing Slips:** One-click conversion of retail and product invoices into shipping delivery notes.
- [ ] **Multi-Business Consolidated Tax Summaries:** Aggregate GSTR-1 preparation reports across multiple registered business profiles.
- [ ] **Standalone Client Offline Packets:** Single-file self-contained HTML invoice bundle for friction-free client viewing.

---

### Phase 4: v2.0.0 — Next-Generation Architectural Evolution (Future)
- [ ] **Local Network Peer-to-Peer Sync:** Encrypted LAN synchronization between front-desk and back-office machines without external cloud servers.
- [ ] **Visual Drag-and-Drop Template Designer:** Visual canvas allowing businesses to craft custom layout configurations visually.
- [ ] **Cross-Platform Parity:** Linux AppImage and macOS universal binary packages.

---

## 💡 Submitting Roadmap Feedback

We value real-world business feedback! If you run an event management, photography, catering, or commercial business and need specific functionality:
- Open a feature request via [GitHub Issues](https://github.com/luciferopensource/InvoiceX-Studio/issues).
- Discuss suggestions in [SUPPORT.md](SUPPORT.md).
