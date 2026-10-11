import { InvoiceDocument } from '../types/invoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class ExportService {
  /**
   * Generates and downloads/saves PDF
   */
  static async exportPdf(
    elementId: string = 'invoice-printable-area',
    documentNumber: string = 'Invoice'
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. If running inside Electron desktop app with native printToPDF support
      if (window.electronAPI?.printToPDF && window.electronAPI?.showSaveDialog && window.electronAPI?.saveFile) {
        const filePath = await window.electronAPI.showSaveDialog({
          title: 'Save Invoice PDF',
          defaultPath: `${documentNumber}.pdf`,
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
        });

        if (!filePath) {
          return { success: false, message: 'Export cancelled' };
        }

        const res = await window.electronAPI.printToPDF({
          landscape: false,
          pageSize: 'A4',
        });

        if (res.success && res.data) {
          const binary = Uint8Array.from(atob(res.data), c => c.charCodeAt(0));
          await window.electronAPI.saveFile(filePath, binary);
          return { success: true, message: `PDF saved successfully to ${filePath}` };
        }
      }

      // 2. Client-side browser / canvas fallback
      const element = document.getElementById(elementId);
      if (!element) {
        return { success: false, message: 'Printable area not found' };
      }

      const canvas = await html2canvas(element, {
        scale: 2, // 2x retina sharpness
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${documentNumber}.pdf`);
      return { success: true, message: 'PDF generated and downloaded successfully' };
    } catch (err: any) {
      console.error('PDF generation error:', err);
      return { success: false, message: `PDF export failed: ${err.message}` };
    }
  }

  /**
   * Directly triggers printing via OS / browser printer dialog
   */
  static printDirect(): void {
    if (window.electronAPI?.printDirect) {
      window.electronAPI.printDirect();
    } else {
      window.print();
    }
  }

  /**
   * Exports high-resolution PNG image of the invoice
   */
  static async exportPng(
    elementId: string = 'invoice-printable-area',
    documentNumber: string = 'Invoice'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const element = document.getElementById(elementId);
      if (!element) return { success: false, message: 'Printable area not found' };

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${documentNumber}.png`;
      link.click();

      return { success: true, message: 'PNG exported successfully' };
    } catch (err: any) {
      return { success: false, message: `PNG export failed: ${err.message}` };
    }
  }

  /**
   * Exports invoices list or invoice detail to CSV/Excel
   */
  static exportInvoicesToCsv(invoices: InvoiceDocument[]): void {
    const headers = [
      'Document Number',
      'Type',
      'Status',
      'Issue Date',
      'Due Date',
      'Customer Name',
      'Customer GSTIN',
      'Place of Supply',
      'Subtotal',
      'Total Discount',
      'CGST',
      'SGST',
      'IGST',
      'Total Tax',
      'Grand Total',
      'Amount Paid',
      'Outstanding Balance',
      'Currency',
    ];

    const rows = invoices.map(inv => [
      `"${inv.documentNumber}"`,
      `"${inv.documentType}"`,
      `"${inv.status}"`,
      `"${inv.issueDate}"`,
      `"${inv.dueDate || ''}"`,
      `"${(inv.customerName || '').replace(/"/g, '""')}"`,
      `"${inv.customerGstin || ''}"`,
      `"${inv.placeOfSupply || ''}"`,
      inv.subtotal,
      inv.totalDiscount,
      inv.totalCgst,
      inv.totalSgst,
      inv.totalIgst,
      inv.totalTax,
      inv.grandTotal,
      inv.totalPaid,
      inv.outstandingBalance,
      `"${inv.currency}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoices_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
}
