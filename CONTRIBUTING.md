# Contributing to Lucifer Invoice Studio

Thank you for your interest in contributing to **Lucifer Invoice Studio**! We welcome contributions from developers, designers, and testers worldwide.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations to [ailuciferbaba@gmail.com](mailto:ailuciferbaba@gmail.com).

## Architecture Overview

Lucifer Invoice Studio is structured as an offline-first Windows desktop application:
- **Runtime:** Electron 34 with secure IPC (`contextBridge`)
- **Frontend:** React 18 + TypeScript + Vite 6
- **Database:** Local SQLite via `sql.js` WASM, persisted to `%APPDATA%/lucifer_invoices.sqlite`
- **Calculations:** Decimal precision arithmetic engine (`src/core/calculations/decimal.ts`)
- **Document Rendering & Export:** 15 custom print-ready templates + Chromium `printToPDF` and jsPDF
- **Test Runner:** Vitest

## Getting Started

### Prerequisites

- **Node.js:** v20.x or higher (tested on Node v26)
- **npm:** v10.x or higher
- **Git**

### Installation

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/luciferopensource/InvoiceX-Studio.git
   cd InvoiceX-Studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

- **Web Browser Preview:**
  ```bash
  npm run dev
  ```
  Opens Vite live reload server at `http://localhost:5173`.

- **Desktop Electron Application (Full Native Mode):**
  ```bash
  npm run build:electron
  npm run electron:dev
  ```

### Running Tests

All mathematical, financial, GST, and template logic is verified using automated unit tests:
```bash
npm test
```

Please ensure all tests pass and add new tests when modifying calculation logic or adding templates.

### Building for Production

- **Bundle Web & Electron:**
  ```bash
  npm run build
  npm run build:electron
  ```

- **Build Windows Executable & Installer:**
  ```bash
  npm run electron:build
  ```
  Generates the NSIS installer (`.exe`) and portable executable in the `release/` directory.

## Contribution Guidelines

1. **Branch Naming:**
   - Features: `feature/your-feature-name`
   - Bug fixes: `fix/issue-description`
   - Documentation: `docs/update-description`

2. **Commit Conventions:**
   Use clear, descriptive commit messages:
   - `feat: add photography studio deliverable contracts`
   - `fix: correct CGST calculation on tax-inclusive buffet line items`
   - `test: add multi-day wedding schedule validation tests`

3. **Invariants to Preserve:**
   - **Offline-First:** Core functionality must never require internet access or remote servers.
   - **Decimal Accuracy:** Never use raw floating-point arithmetic (`0.1 + 0.2`) for financial calculations; always use `DecimalUtils`.
   - **Template Independence:** All 15 templates must remain printable and distinct in layout.

4. **Submitting a Pull Request:**
   - Ensure `npm test` passes 100%.
   - Ensure `npm run build` succeeds with 0 TypeScript or bundler errors.
   - Describe the changes clearly in the PR description.

## Questions & Support

For questions or discussions, please review [SUPPORT.md](SUPPORT.md) or open an issue on GitHub.
