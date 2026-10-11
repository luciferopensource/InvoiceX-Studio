# Security Policy — Lucifer Invoice Studio

The Lucifer Open Source team takes the security, data privacy, and integrity of **Lucifer Invoice Studio** seriously.

## Supported Versions

We provide security patches and vulnerability remediation for the following active versions:

| Version | Supported          | Status             |
| ------- | ------------------ | ------------------ |
| 1.0.x   | :white_check_mark: | Current Production |
| < 1.0   | :x:                | Deprecated / Alpha |

---

## Reporting a Vulnerability

If you discover a security vulnerability or sensitive data leakage risk in Lucifer Invoice Studio, please report it privately:

- **Security Email:** [ailuciferbaba@gmail.com](mailto:ailuciferbaba@gmail.com)
- **Response Window:** You will receive an acknowledgment within **48 hours** of report receipt.
- **Remediation & Advisory:** We will validate the issue, prepare a patch, and coordinate responsible disclosure with the reporter before public announcement.

> [!IMPORTANT]
> Please do NOT file public GitHub or GitLab issues for sensitive security vulnerabilities.

---

## Desktop Security & Data Privacy Architecture

Lucifer Invoice Studio is designed with an uncompromising offline-first privacy model:

1. **Local-Only Data Residency:**
   - All client profiles, financial records, invoices, wedding deliverables, and payment histories are stored exclusively on your local machine in an encrypted/managed SQLite database (`%APPDATA%/lucifer_invoices.sqlite`).
   - The application does not collect, phone-home, or transmit commercial or personal invoice records to any external cloud service or tracking server.

2. **Electron Process Isolation:**
   - `contextIsolation: true` is strictly enforced.
   - `nodeIntegration: false` ensures renderer processes have zero arbitrary access to native Node.js APIs.
   - All native interactions (file dialogs, printing, window resizing, database saves) pass through strongly-typed IPC channels validated in `electron/preload.ts` and `electron/main.ts`.

3. **Input Sanitization & Injection Defense:**
   - Parameterized queries and safe SQLite statements are used throughout to prevent SQL injection vulnerabilities.
   - HTML and user-provided notes/terms are rendered with XSS protection during PDF rendering.

4. **Zero Commited Secrets:**
   - The codebase contains zero embedded API tokens, passwords, or production credentials.
