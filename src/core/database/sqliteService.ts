import initSqlJs, { Database } from 'sql.js';
import { InvoiceDocument, BusinessProfile, Customer, PaymentRecord } from '../types/invoice';

declare global {
  interface Window {
    electronAPI?: any;
  }
}

export interface ProductItem {
  id: string;
  title: string;
  description?: string;
  hsnSac: string;
  unit: string;
  unitPrice: number;
  taxRate: number;
  category?: string;
}

export interface WeddingPackageItem {
  id: string;
  title: string;
  tier: 'Silver' | 'Gold' | 'Diamond' | 'Royal' | 'Custom';
  description: string;
  price: number;
  includedServices: string[];
  suggestedItems: Array<{
    description: string;
    hsnSac: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate: number;
  }>;
}

export class SQLiteService {
  private static instance: SQLiteService;
  private db: Database | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `./${file}`,
      });

      // Try loading existing database from Electron or IndexedDB
      let existingData: Uint8Array | null = null;
      if (window.electronAPI?.loadDb) {
        existingData = await window.electronAPI.loadDb();
      }

      if (!existingData) {
        existingData = await this.loadFromIndexedDB();
      }

      if (existingData && existingData.length > 0) {
        this.db = new SQL.Database(existingData);
      } else {
        this.db = new SQL.Database();
      }

      this.migrateSchema();
      this.isInitialized = true;
      await this.persist();
    } catch (err) {
      console.error('Failed to initialize SQLite database:', err);
      // Fallback in-memory with local WASM
      const SQL = await initSqlJs({
        locateFile: (file) => `./${file}`,
      });
      this.db = new SQL.Database();
      this.migrateSchema();
      this.isInitialized = true;
    }
  }

  private migrateSchema(): void {
    if (!this.db) return;

    this.db.run(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS business_profiles (
        id TEXT PRIMARY KEY,
        is_default INTEGER DEFAULT 0,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        hsn_sac TEXT,
        unit_price REAL DEFAULT 0,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wedding_packages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price REAL DEFAULT 0,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        document_number TEXT NOT NULL,
        document_type TEXT NOT NULL,
        status TEXT NOT NULL,
        business_id TEXT,
        customer_id TEXT,
        issue_date TEXT NOT NULL,
        grand_total REAL NOT NULL,
        outstanding_balance REAL NOT NULL,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        invoice_id TEXT NOT NULL,
        amount REAL NOT NULL,
        payment_date TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  async persist(): Promise<void> {
    if (!this.db) return;
    try {
      const binary = this.db.export();
      if (window.electronAPI?.saveDb) {
        await window.electronAPI.saveDb(binary);
      }
      await this.saveToIndexedDB(binary);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // IndexedDB backup storage
  private async saveToIndexedDB(data: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LuciferInvoiceStudioDB', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('sqlite')) {
          db.createObjectStore('sqlite');
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('sqlite', 'readwrite');
        const store = tx.objectStore('sqlite');
        store.put(data, 'main_db');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open('LuciferInvoiceStudioDB', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('sqlite')) {
          db.createObjectStore('sqlite');
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('sqlite', 'readonly');
        const store = tx.objectStore('sqlite');
        const getReq = store.get('main_db');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  }

  // --- Invoices Operations ---
  async getInvoices(): Promise<InvoiceDocument[]> {
    if (!this.db) await this.init();
    const res = this.db!.exec(`SELECT data FROM invoices ORDER BY updated_at DESC`);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  async getInvoiceById(id: string): Promise<InvoiceDocument | null> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`SELECT data FROM invoices WHERE id = :id`);
    stmt.bind({ ':id': id });
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return JSON.parse(row.data as string);
    }
    stmt.free();
    return null;
  }

  async saveInvoice(doc: InvoiceDocument): Promise<void> {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    doc.updatedAt = now;
    const jsonStr = JSON.stringify(doc);

    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO invoices (
        id, document_number, document_type, status, business_id, customer_id, issue_date, grand_total, outstanding_balance, data, updated_at
      ) VALUES (
        :id, :document_number, :document_type, :status, :business_id, :customer_id, :issue_date, :grand_total, :outstanding_balance, :data, :updated_at
      )
    `);

    stmt.bind({
      ':id': doc.id,
      ':document_number': doc.documentNumber,
      ':document_type': doc.documentType,
      ':status': doc.status,
      ':business_id': doc.businessProfileId || '',
      ':customer_id': doc.customerId || '',
      ':issue_date': doc.issueDate,
      ':grand_total': doc.grandTotal,
      ':outstanding_balance': doc.outstandingBalance,
      ':data': jsonStr,
      ':updated_at': now,
    });
    stmt.step();
    stmt.free();

    await this.persist();
  }

  async deleteInvoice(id: string): Promise<void> {
    if (!this.db) await this.init();
    this.db!.run(`DELETE FROM invoices WHERE id = ?`, [id]);
    this.db!.run(`DELETE FROM payments WHERE invoice_id = ?`, [id]);
    await this.persist();
  }

  // --- Business Profiles ---
  async getBusinessProfiles(): Promise<BusinessProfile[]> {
    if (!this.db) await this.init();
    const res = this.db!.exec(`SELECT data FROM business_profiles ORDER BY is_default DESC, updated_at DESC`);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  async saveBusinessProfile(profile: BusinessProfile): Promise<void> {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    if (profile.isDefault) {
      this.db!.run(`UPDATE business_profiles SET is_default = 0`);
    }

    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO business_profiles (id, is_default, data, updated_at)
      VALUES (:id, :is_default, :data, :updated_at)
    `);
    stmt.bind({
      ':id': profile.id,
      ':is_default': profile.isDefault ? 1 : 0,
      ':data': JSON.stringify(profile),
      ':updated_at': now,
    });
    stmt.step();
    stmt.free();
    await this.persist();
  }

  // --- Customers ---
  async getCustomers(): Promise<Customer[]> {
    if (!this.db) await this.init();
    const res = this.db!.exec(`SELECT data FROM customers ORDER BY name ASC`);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  async saveCustomer(customer: Customer): Promise<void> {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    customer.updatedAt = now;
    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO customers (id, name, email, phone, data, updated_at)
      VALUES (:id, :name, :email, :phone, :data, :updated_at)
    `);
    stmt.bind({
      ':id': customer.id,
      ':name': customer.name,
      ':email': customer.email || '',
      ':phone': customer.phone || '',
      ':data': JSON.stringify(customer),
      ':updated_at': now,
    });
    stmt.step();
    stmt.free();
    await this.persist();
  }

  async deleteCustomer(id: string): Promise<void> {
    if (!this.db) await this.init();
    this.db!.run(`DELETE FROM customers WHERE id = ?`, [id]);
    await this.persist();
  }

  // --- Products ---
  async getProducts(): Promise<ProductItem[]> {
    if (!this.db) await this.init();
    const res = this.db!.exec(`SELECT data FROM products ORDER BY title ASC`);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  async saveProduct(product: ProductItem): Promise<void> {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO products (id, title, hsn_sac, unit_price, data, updated_at)
      VALUES (:id, :title, :hsn_sac, :unit_price, :data, :updated_at)
    `);
    stmt.bind({
      ':id': product.id,
      ':title': product.title,
      ':hsn_sac': product.hsnSac || '',
      ':unit_price': product.unitPrice || 0,
      ':data': JSON.stringify(product),
      ':updated_at': now,
    });
    stmt.step();
    stmt.free();
    await this.persist();
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) await this.init();
    this.db!.run(`DELETE FROM products WHERE id = ?`, [id]);
    await this.persist();
  }

  // --- Wedding Packages ---
  async getWeddingPackages(): Promise<WeddingPackageItem[]> {
    if (!this.db) await this.init();
    const res = this.db!.exec(`SELECT data FROM wedding_packages ORDER BY price ASC`);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map((row) => JSON.parse(row[0] as string));
  }

  async saveWeddingPackage(pkg: WeddingPackageItem): Promise<void> {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO wedding_packages (id, title, price, data, updated_at)
      VALUES (:id, :title, :price, :data, :updated_at)
    `);
    stmt.bind({
      ':id': pkg.id,
      ':title': pkg.title,
      ':price': pkg.price || 0,
      ':data': JSON.stringify(pkg),
      ':updated_at': now,
    });
    stmt.step();
    stmt.free();
    await this.persist();
  }

  // --- Settings ---
  async getSetting(key: string): Promise<string | null> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`SELECT value FROM app_settings WHERE key = :key`);
    stmt.bind({ ':key': key });
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row.value as string;
    }
    stmt.free();
    return null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    if (!this.db) await this.init();
    this.db!.run(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`, [key, value]);
    await this.persist();
  }

  // --- Full Backup and Restore ---
  async exportFullBackupJson(): Promise<string> {
    const invoices = await this.getInvoices();
    const businesses = await this.getBusinessProfiles();
    const customers = await this.getCustomers();
    const products = await this.getProducts();
    const weddingPackages = await this.getWeddingPackages();

    const backupData = {
      app: 'Lucifer Invoice Studio',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        invoices,
        businesses,
        customers,
        products,
        weddingPackages,
      },
    };
    return JSON.stringify(backupData, null, 2);
  }

  async importFullBackupJson(jsonString: string): Promise<{ success: boolean; message: string; counts?: any }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) {
        return { success: false, message: 'Invalid backup file structure: missing data key' };
      }

      const { invoices = [], businesses = [], customers = [], products = [], weddingPackages = [] } = parsed.data;

      for (const b of businesses) await this.saveBusinessProfile(b);
      for (const c of customers) await this.saveCustomer(c);
      for (const p of products) await this.saveProduct(p);
      for (const w of weddingPackages) await this.saveWeddingPackage(w);
      for (const inv of invoices) await this.saveInvoice(inv);

      await this.persist();

      return {
        success: true,
        message: 'Backup imported successfully!',
        counts: {
          invoices: invoices.length,
          businesses: businesses.length,
          customers: customers.length,
          products: products.length,
          weddingPackages: weddingPackages.length,
        },
      };
    } catch (err: any) {
      return { success: false, message: `Backup restoration failed: ${err.message}` };
    }
  }
}
