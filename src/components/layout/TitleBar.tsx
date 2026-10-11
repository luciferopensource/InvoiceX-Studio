import React, { useEffect, useState } from 'react';
import { Minus, Square, Copy, X, Crown, Sparkles, Moon, Sun, Palette, Search } from 'lucide-react';

interface Props {
  onSearchClick?: () => void;
  activeBusinessName?: string;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const TitleBar: React.FC<Props> = ({
  onSearchClick,
  activeBusinessName,
  currentTheme,
  onThemeChange,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.isMaximized) {
      window.electronAPI.isMaximized().then(setIsMaximized);
    }

    if (window.electronAPI?.onMaximizedChange) {
      const cleanup = window.electronAPI.onMaximizedChange((isMax: boolean) => {
        setIsMaximized(isMax);
      });
      return cleanup;
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.minimize?.();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximize?.();
  };

  const handleClose = () => {
    window.electronAPI?.close?.();
  };

  const handleDoubleClick = () => {
    window.electronAPI?.maximize?.();
  };

  const themes = [
    { id: 'royal-black-gold', name: 'Royal Black & Gold', accent: '#D4AF37' },
    { id: 'midnight-blue', name: 'Midnight Blue', accent: '#38BDF8' },
    { id: 'graphite', name: 'Graphite Dark', accent: '#E4E4E7' },
    { id: 'minimal', name: 'Minimal Obsidian', accent: '#FAFAFA' },
    { id: 'light', name: 'Clean Light', accent: '#B45309' },
  ];

  return (
    <header
      onDoubleClick={handleDoubleClick}
      className="window-drag-region h-10 w-full flex items-center justify-between px-3 select-none z-50 border-b transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      {/* App Brand & Identity */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-xs tracking-wider uppercase font-serif text-amber-400">
            Lucifer Invoice Studio
          </span>
        </div>

        {activeBusinessName && (
          <span className="hidden sm:inline-block text-[11px] text-slate-400 truncate max-w-xs px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {activeBusinessName}
          </span>
        )}
      </div>

      {/* Center Search Shortcut */}
      <div className="window-no-drag hidden md:flex items-center">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-all border hover:border-amber-500/40"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
          title="Search documents and clients (Ctrl+F)"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search invoices, brides, clients...</span>
          <kbd className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-mono text-slate-400">Ctrl+F</kbd>
        </button>
      </div>

      {/* Right Actions: Theme Selector & Windows Controls */}
      <div className="window-no-drag flex items-center gap-2">
        {/* Theme Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-slate-300"
            title="Appearance Theme"
          >
            <Palette className="w-4 h-4 text-amber-400" />
          </button>

          {themeDropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-48 rounded-lg shadow-2xl py-1 text-xs border z-50 animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
                UI Appearance Theme
              </div>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setThemeDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/10 transition-colors"
                  style={{
                    fontWeight: currentTheme === t.id ? 'bold' : 'normal',
                    color: currentTheme === t.id ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                    <span>{t.name}</span>
                  </div>
                  {currentTheme === t.id && <Sparkles className="w-3 h-3 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Windows Standard Controls */}
        <div className="flex items-center ml-1">
          <button
            onClick={handleMinimize}
            className="w-9 h-7 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-9 h-7 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            className="w-9 h-7 flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
