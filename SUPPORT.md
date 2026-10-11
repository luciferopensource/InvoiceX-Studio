# Support Guidelines — Lucifer Invoice Studio

Welcome to the **Lucifer Invoice Studio** support guide. We are committed to ensuring a reliable, smooth experience for all businesses using this software.

---

## 🧭 Support Channels

### 1. GitHub Issue Tracker (Recommended for Bugs & Features)
- **Bug Reports:** If you discover a bug, broken template, or calculation edge-case, please open an issue:
  [https://github.com/luciferopensource/InvoiceX-Studio/issues](https://github.com/luciferopensource/InvoiceX-Studio/issues)
- **Feature Requests:** Share suggestions for new industry templates or workflow features.

### 2. GitLab Repository (Mirrored)
- Issues and contributions are also monitored on GitLab:
  [https://gitlab.com/luciferopensource/invoicex-studio](https://gitlab.com/luciferopensource/invoicex-studio)

### 3. Maintainer Direct Contact
- For enterprise consultation, custom wedding business branding, or private inquiries:
  **Email:** [ailuciferbaba@gmail.com](mailto:ailuciferbaba@gmail.com)

---

## 🛠️ Frequently Encountered Questions & Troubleshooting

### Q1: Where is my invoice and business data stored?
- Lucifer Invoice Studio operates **100% offline**.
- In the desktop application, your SQLite database is saved directly to your Windows User Data folder at:
  ```text
  %APPDATA%\lucifer-invoice-studio\lucifer_invoices.sqlite
  ```
- You can create a complete portable JSON backup anytime from **Settings > Backup Database (JSON)**.

### Q2: How do I export or print an invoice?
1. Open any saved or new invoice document.
2. Click **Preview & Export** in the top navigation or document editor.
3. Choose your desired template from the 15 specialized layouts.
4. Click **Export PDF** to generate an official PDF or **Print Document** for direct printer integration.

### Q3: How do I switch between Inter-State (IGST) and Intra-State (CGST + SGST)?
- The application automatically compares your **Business Profile State** with the customer's **Place of Supply / State**.
- If the states match, CGST (e.g. 9%) + SGST (9%) are applied.
- If the states differ, IGST (18%) is automatically calculated and displayed.
- You can also toggle the **Inter-State Supply (IGST)** checkbox manually inside the Document Editor.

### Q4: My PDF looks clipped or incomplete when printing.
- Ensure the paper size in your print dialog is set to **A4**.
- Enable "Background graphics" in your print options so custom theme colors and gold/emerald accents are preserved.

---

## 📋 Reporting Bugs Effectively

When filing a bug report, please include:
1. **Operating System:** (e.g., Windows 10, Windows 11 x64)
2. **Application Version:** (e.g., v1.0.0)
3. **Template Selected:** (e.g., Royal Black & Gold, Indian GST)
4. **Steps to Reproduce:** Exact steps that triggered the issue
5. **Expected vs Actual Behavior:** What you anticipated versus what occurred
