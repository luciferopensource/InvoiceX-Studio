import React, { useState } from 'react';
import { BusinessProfile } from '../../core/types/invoice';
import { SQLiteService } from '../../core/database/sqliteService';
import { TEMPLATE_DEFINITIONS } from '../templates/TemplateRenderer';
import { 
  Settings, 
  Building2, 
  Database, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Crown,
  Plus,
  Edit3
} from 'lucide-react';

interface Props {
  businessProfiles: BusinessProfile[];
  onSaveProfile: (profile: BusinessProfile) => void;
  onRefreshData: () => void;
}

export const SettingsView: React.FC<Props> = ({
  businessProfiles,
  onSaveProfile,
  onRefreshData,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile>(
    businessProfiles.find(b => b.isDefault) || businessProfiles[0]
  );
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleProfileFieldChange = (field: keyof BusinessProfile, value: any) => {
    setSelectedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCurrentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(selectedProfile);
    setBackupStatus({ type: 'success', message: 'Business profile saved successfully!' });
    setTimeout(() => setBackupStatus(null), 3000);
  };

  // Full Database JSON Backup Export
  const handleExportBackup = async () => {
    try {
      const sqliteService = SQLiteService.getInstance();
      const json = await sqliteService.exportFullBackupJson();

      if (window.electronAPI?.showSaveDialog && window.electronAPI?.saveFile) {
        const filePath = await window.electronAPI.showSaveDialog({
          title: 'Export Full Database Backup',
          defaultPath: `Lucifer_Invoice_Studio_Backup_${new Date().toISOString().split('T')[0]}.json`,
          filters: [{ name: 'JSON Backup', extensions: ['json'] }],
        });

        if (filePath) {
          await window.electronAPI.saveFile(filePath, json);
          setBackupStatus({ type: 'success', message: `Database backed up to ${filePath}` });
          return;
        }
      }

      // Browser fallback
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lucifer_Invoice_Studio_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      setBackupStatus({ type: 'success', message: 'Full Database Backup JSON downloaded!' });
    } catch (err: any) {
      setBackupStatus({ type: 'error', message: `Backup failed: ${err.message}` });
    }
  };

  // Restore Database Backup
  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const sqliteService = SQLiteService.getInstance();
      const result = await sqliteService.importFullBackupJson(text);

      if (result.success) {
        setBackupStatus({
          type: 'success',
          message: `${result.message} Restored ${result.counts?.invoices || 0} invoices.`,
        });
        onRefreshData();
      } else {
        setBackupStatus({ type: 'error', message: result.message });
      }
    } catch (err: any) {
      setBackupStatus({ type: 'error', message: `Import failed: ${err.message}` });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-40px)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>Business Profiles &amp; Database Backups</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure company branding, GSTIN, bank details, and manage local SQLite backups.
        </p>
      </div>

      {backupStatus && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            backupStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {backupStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{backupStatus.message}</span>
        </div>
      )}

      {/* Grid: Business Profile Form & Backup Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings (Col span 2) */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border text-xs space-y-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-white text-sm">Active Business Profile</h2>
            </div>
            <span className="text-[10px] text-amber-400 font-mono">ID: {selectedProfile.id}</span>
          </div>

          <form onSubmit={handleSaveCurrentProfile} className="space-y-4 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company / Studio Name *</label>
                <input
                  type="text"
                  value={selectedProfile.businessName}
                  onChange={(e) => handleProfileFieldChange('businessName', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-medium focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={selectedProfile.tagline || ''}
                  onChange={(e) => handleProfileFieldChange('tagline', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Business GSTIN</label>
                <input
                  type="text"
                  value={selectedProfile.gstin || ''}
                  onChange={(e) => handleProfileFieldChange('gstin', e.target.value.toUpperCase())}
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PAN Number</label>
                <input
                  type="text"
                  value={selectedProfile.pan || ''}
                  onChange={(e) => handleProfileFieldChange('pan', e.target.value.toUpperCase())}
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">State (Supply Base)</label>
                <input
                  type="text"
                  value={selectedProfile.state}
                  onChange={(e) => handleProfileFieldChange('state', e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={selectedProfile.email}
                  onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={selectedProfile.phone}
                  onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Office / Studio Address</label>
              <textarea
                value={selectedProfile.address}
                onChange={(e) => handleProfileFieldChange('address', e.target.value)}
                rows={2}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Bank & Payment Information */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Bank Wire &amp; UPI Account</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Bank Name</label>
                  <input
                    type="text"
                    value={selectedProfile.bankName || ''}
                    onChange={(e) => handleProfileFieldChange('bankName', e.target.value)}
                    className="w-full p-1.5 rounded bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Account Number</label>
                  <input
                    type="text"
                    value={selectedProfile.bankAccountNumber || ''}
                    onChange={(e) => handleProfileFieldChange('bankAccountNumber', e.target.value)}
                    className="w-full p-1.5 rounded bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">IFSC Code</label>
                  <input
                    type="text"
                    value={selectedProfile.bankIfsc || ''}
                    onChange={(e) => handleProfileFieldChange('bankIfsc', e.target.value.toUpperCase())}
                    className="w-full p-1.5 rounded bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Account Holder Name</label>
                  <input
                    type="text"
                    value={selectedProfile.bankAccountName || ''}
                    onChange={(e) => handleProfileFieldChange('bankAccountName', e.target.value)}
                    className="w-full p-1.5 rounded bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">UPI ID (e.g. business@okhdfcbank)</label>
                  <input
                    type="text"
                    value={selectedProfile.upiId || ''}
                    onChange={(e) => handleProfileFieldChange('upiId', e.target.value)}
                    className="w-full p-1.5 rounded bg-black/40 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Default Template */}
            <div className="pt-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Default Invoice Template</label>
              <select
                value={selectedProfile.defaultTemplate}
                onChange={(e) => handleProfileFieldChange('defaultTemplate', e.target.value)}
                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-amber-300 font-semibold focus:border-amber-400 focus:outline-none"
              >
                {TEMPLATE_DEFINITIONS.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all border"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  borderColor: '#f59e0b',
                }}
              >
                Save Business Profile
              </button>
            </div>
          </form>
        </div>

        {/* Database & Backup Management (Col span 1) */}
        <div className="space-y-4">
          <div
            className="p-6 rounded-2xl border text-xs space-y-4"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Offline Database Engine</h3>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              Lucifer Invoice Studio operates 100% offline using a local embedded SQLite database. No client details or financials are ever sent to external cloud servers without your consent.
            </p>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Engine:</span>
                <span className="text-emerald-400">SQLite 3 (WASM)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Durability:</span>
                <span className="text-white">WAL Persistent File</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-slate-300 truncate max-w-[140px]" title="appData/lucifer_invoices.sqlite">
                  AppData/lucifer_invoices.sqlite
                </span>
              </div>
            </div>

            {/* Backup & Restore Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-xs text-white border transition-colors hover:bg-white/5"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Full JSON Backup</span>
              </button>

              <label
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-xs text-slate-300 border border-dashed border-white/20 hover:border-amber-400/50 cursor-pointer transition-colors bg-white/5 hover:bg-white/10"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Restore Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* App Credits & System Status */}
          <div
            className="p-5 rounded-2xl border text-xs space-y-2 text-slate-400"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-1.5 text-amber-400 font-bold font-serif">
              <Crown className="w-4 h-4" />
              <span>Lucifer Invoice Studio</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Version 1.0.0 (Production Windows Release).
              Engineered by Lucifer Open Source for wedding planners, studios, and high-growth commercial enterprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
