import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Heart, 
  Users, 
  Package, 
  Settings, 
  Database,
  Sparkles
} from 'lucide-react';

export type ActiveView = 
  | 'dashboard'
  | 'invoices'
  | 'editor'
  | 'wedding'
  | 'customers'
  | 'catalog'
  | 'settings';

interface Props {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onNewInvoice: () => void;
  onNewWeddingInvoice: () => void;
  invoiceCount?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeView,
  onViewChange,
  onNewInvoice,
  onNewWeddingInvoice,
  invoiceCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'All Invoices', icon: FileText, count: invoiceCount },
    { id: 'wedding', label: 'Wedding Suite', icon: Heart, highlight: true },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'catalog', label: 'Services & Items', icon: Package },
    { id: 'settings', label: 'Business & Backup', icon: Settings },
  ];

  return (
    <aside
      className="w-60 h-[calc(100vh-40px)] flex flex-col justify-between p-3 border-r select-none transition-colors shrink-0"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="space-y-4">
        {/* Quick Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onNewWeddingInvoice}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-xs tracking-wide shadow-md transition-all duration-200 border group"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              color: '#FDE68A',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>New Wedding Invoice</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs tracking-wide transition-all duration-200 border"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ActiveView)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive ? 'shadow-sm font-semibold' : 'hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-gold-dim)' : 'transparent',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-mono"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {item.count}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div
        className="p-3 rounded-lg text-xs border space-y-1"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Offline SQLite</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Local Database Active" />
        </div>
        <p className="text-[11px] text-slate-500">100% Private &amp; Secure</p>
      </div>
    </aside>
  );
};
