import React from 'react';
import { InvoiceDocument, TemplateId } from '../../core/types/invoice';

import { RoyalBlackGoldTemplate } from './RoyalBlackGoldTemplate';
import { ElegantWeddingTemplate } from './ElegantWeddingTemplate';
import { LuxuryWeddingTemplate } from './LuxuryWeddingTemplate';
import { FloralWeddingTemplate } from './FloralWeddingTemplate';
import { MinimalWhiteTemplate } from './MinimalWhiteTemplate';
import { ModernCorporateTemplate } from './ModernCorporateTemplate';
import { IndianGstTemplate } from './IndianGstTemplate';
import { PhotographyStudioTemplate } from './PhotographyStudioTemplate';
import { CateringServicesTemplate } from './CateringServicesTemplate';
import { EventManagementTemplate } from './EventManagementTemplate';
import { DecorationServicesTemplate } from './DecorationServicesTemplate';
import { FreelanceServicesTemplate } from './FreelanceServicesTemplate';
import { RetailProductsTemplate } from './RetailProductsTemplate';
import { ContractorProfessionalTemplate } from './ContractorProfessionalTemplate';
import { CreativeAgencyTemplate } from './CreativeAgencyTemplate';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'Wedding' | 'Corporate' | 'Specialized' | 'Creative' | 'Statutory';
  description: string;
  defaultAccent: string;
  defaultFont: string;
  badge: string;
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: 'royal-black-gold',
    name: 'Royal Black & Gold',
    category: 'Wedding',
    description: 'Ultra-luxury gold foil & obsidian serif template crafted for high-end royal weddings and VIP celebrations.',
    defaultAccent: '#D4AF37',
    defaultFont: 'Cinzel',
    badge: 'Signature Luxury',
  },
  {
    id: 'elegant-wedding',
    name: 'Elegant Wedding',
    category: 'Wedding',
    description: 'Champagne gold and blush calligraphy aesthetic with milestone payment progress and couple highlights.',
    defaultAccent: '#C5A059',
    defaultFont: 'Playfair Display',
    badge: 'Romantic Classic',
  },
  {
    id: 'luxury-wedding',
    name: 'Luxury Wedding (Emerald)',
    category: 'Wedding',
    description: 'Deep royal emerald and satin gold with photographer crew breakdown and destination itinerary cards.',
    defaultAccent: '#C5A059',
    defaultFont: 'Playfair Display',
    badge: 'Destination Luxe',
  },
  {
    id: 'floral-wedding',
    name: 'Floral Wedding',
    category: 'Wedding',
    description: 'Soft botanical pastel rose aesthetic with romantic couple banners and delicate borders.',
    defaultAccent: '#C25975',
    defaultFont: 'Playfair Display',
    badge: 'Soft Botanical',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    category: 'Corporate',
    description: 'Swiss international typographic style with stark black-and-white grid lines and clean tabular hierarchy.',
    defaultAccent: '#000000',
    defaultFont: 'Inter',
    badge: 'Swiss Grid',
  },
  {
    id: 'modern-corporate',
    name: 'Modern Corporate',
    category: 'Corporate',
    description: 'Executive navy blue and electric cobalt layout with PO tracking, corporate summary, and QR payment block.',
    defaultAccent: '#2563EB',
    defaultFont: 'Inter',
    badge: 'Executive',
  },
  {
    id: 'indian-gst',
    name: 'Indian GST Tax Invoice',
    category: 'Statutory',
    description: 'Official statutory tax invoice with Consignor/Consignee boxes, Place of Supply, and CGST/SGST/IGST tables.',
    defaultAccent: '#0F172A',
    defaultFont: 'Inter',
    badge: 'Govt Compliant',
  },
  {
    id: 'photography-studio',
    name: 'Photography Studio',
    category: 'Creative',
    description: 'Dark slate and tungsten amber with shoot specs, deliverable formats checklist, and copyright terms.',
    defaultAccent: '#F59E0B',
    defaultFont: 'Inter',
    badge: 'Studio Suite',
  },
  {
    id: 'catering-services',
    name: 'Catering & Banquets',
    category: 'Specialized',
    description: 'Warm burgundy & saffron layout with guest count calculator, plate rates, and meal session badges.',
    defaultAccent: '#881337',
    defaultFont: 'Playfair Display',
    badge: 'Banquet Feast',
  },
  {
    id: 'event-management',
    name: 'Event Management',
    category: 'Specialized',
    description: 'Electric indigo with production timeline progression, coordinator contact, and vendor deliverables.',
    defaultAccent: '#4F46E5',
    defaultFont: 'Inter',
    badge: 'Live Production',
  },
  {
    id: 'decoration-services',
    name: 'Decoration Services',
    category: 'Specialized',
    description: 'Deep royal plum and burnished copper with decor element categorization and setup/dismantle timings.',
    defaultAccent: '#581C87',
    defaultFont: 'Playfair Display',
    badge: 'Scenography',
  },
  {
    id: 'freelance-services',
    name: 'Freelance & Consultant',
    category: 'Creative',
    description: 'Modern teal and graphite with hourly rate tracking, milestone sprint scope, and instant UPI payment block.',
    defaultAccent: '#0D9488',
    defaultFont: 'Inter',
    badge: 'Agile Milestone',
  },
  {
    id: 'retail-products',
    name: 'Retail & Products',
    category: 'Specialized',
    description: 'POS retail receipt format with SKU & Barcode column, warranty rules, and return policy badge.',
    defaultAccent: '#0F172A',
    defaultFont: 'Inter',
    badge: 'Store POS',
  },
  {
    id: 'contractor-services',
    name: 'Contractor & Engineering',
    category: 'Specialized',
    description: 'Blueprint slate and steel layout with scope of work breakdown, materials vs labor, and site certifications.',
    defaultAccent: '#334155',
    defaultFont: 'Inter',
    badge: 'Blueprint Trade',
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    category: 'Creative',
    description: 'High-impact avant-garde agency layout with campaign element matrix and intellectual property release.',
    defaultAccent: '#6366F1',
    defaultFont: 'Inter',
    badge: 'Brand Studio',
  },
];

interface TemplateRendererProps {
  document: InvoiceDocument;
  scale?: number;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ document: doc, scale = 1 }) => {
  const templateId = doc.templateId || 'royal-black-gold';

  const renderSelectedTemplate = () => {
    switch (templateId) {
      case 'royal-black-gold':
        return <RoyalBlackGoldTemplate document={doc} />;
      case 'elegant-wedding':
        return <ElegantWeddingTemplate document={doc} />;
      case 'luxury-wedding':
        return <LuxuryWeddingTemplate document={doc} />;
      case 'floral-wedding':
        return <FloralWeddingTemplate document={doc} />;
      case 'minimal-white':
        return <MinimalWhiteTemplate document={doc} />;
      case 'modern-corporate':
        return <ModernCorporateTemplate document={doc} />;
      case 'indian-gst':
        return <IndianGstTemplate document={doc} />;
      case 'photography-studio':
        return <PhotographyStudioTemplate document={doc} />;
      case 'catering-services':
        return <CateringServicesTemplate document={doc} />;
      case 'event-management':
        return <EventManagementTemplate document={doc} />;
      case 'decoration-services':
        return <DecorationServicesTemplate document={doc} />;
      case 'freelance-services':
        return <FreelanceServicesTemplate document={doc} />;
      case 'retail-products':
        return <RetailProductsTemplate document={doc} />;
      case 'contractor-services':
        return <ContractorProfessionalTemplate document={doc} />;
      case 'creative-agency':
        return <CreativeAgencyTemplate document={doc} />;
      default:
        return <RoyalBlackGoldTemplate document={doc} />;
    }
  };

  return (
    <div
      className="invoice-preview-container flex justify-center"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div id="invoice-printable-area">
        {renderSelectedTemplate()}
      </div>
    </div>
  );
};
