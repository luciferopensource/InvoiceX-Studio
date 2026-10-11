import React, { useState } from 'react';
import { InvoiceDocument, TemplateId } from '../../core/types/invoice';
import { TemplateRenderer, TEMPLATE_DEFINITIONS } from '../templates/TemplateRenderer';
import { ExportService } from '../../core/pdf/pdfService';
import { 
  X, 
  Download, 
  Printer, 
  Image, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface Props {
  document: InvoiceDocument;
  onClose: () => void;
  onTemplateChange: (templateId: TemplateId) => void;
}

export const PreviewModal: React.FC<Props> = ({
  document: doc,
  onClose,
  onTemplateChange,
}) => {
  const [scale, setScale] = useState(0.9);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExportPdf = async () => {
    setIsExporting(true);
    setStatusMessage('Generating PDF...');
    const res = await ExportService.exportPdf('invoice-printable-area', doc.documentNumber);
    setStatusMessage(res.message);
    setIsExporting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handlePrint = () => {
    ExportService.printDirect();
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    setStatusMessage('Rendering PNG...');
    const res = await ExportService.exportPng('invoice-printable-area', doc.documentNumber);
    setStatusMessage(res.message);
    setIsExporting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
      {/* Top Floating Control Bar */}
      <div
        className="h-14 w-full flex items-center justify-between px-6 border-b shrink-0 select-none z-10"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white font-mono">
            #{doc.documentNumber}
          </span>
          <span className="text-xs text-slate-400">({doc.customerName})</span>

          {/* Template Switcher on the Fly */}
          <div className="relative ml-4">
            <select
              value={doc.templateId}
              onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
              className="p-1.5 px-3 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-amber-300 focus:border-amber-400 focus:outline-none"
            >
              {TEMPLATE_DEFINITIONS.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  Template: {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 px-2 select-none">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(s => Math.min(1.5, s + 0.1))}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(0.9)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons: Print, PDF, PNG, Close */}
        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-xs text-amber-400 font-medium animate-pulse mr-2">
              {statusMessage}
            </span>
          )}

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
          >
            <Image className="w-3.5 h-3.5 text-slate-400" />
            <span>PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all border"
            style={{
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
              borderColor: '#f59e0b',
              color: '#ffffff',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white ml-2"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-950/90">
        <TemplateRenderer document={doc} scale={scale} />
      </div>
    </div>
  );
};
