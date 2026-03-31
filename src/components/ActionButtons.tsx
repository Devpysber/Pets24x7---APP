import React, { memo, useCallback } from 'react';
import { Button } from './Button';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { cn } from '../utils/theme';
import { useAppStore } from '../store/useAppStore';

interface ActionButtonsProps {
  serviceId: string;
  vendorId: string;
  serviceName: string;
  serviceImage: string;
  phone: string;
  whatsapp: string;
  onInquiry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showInquiry?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = memo(({ 
  serviceId,
  vendorId,
  serviceName,
  serviceImage,
  phone, 
  whatsapp, 
  onInquiry, 
  className, 
  size = 'md',
  showInquiry = true
}) => {
  const { createLead, openInquiryModal } = useAppStore();

  const handleCall = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    createLead({
      vendorId,
      listingId: serviceId,
      actionType: 'CALL',
      message: `User clicked Call for ${serviceName}`
    });
    window.location.href = `tel:${phone}`;
  }, [phone, createLead, vendorId, serviceId, serviceName]);

  const handleWhatsapp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    createLead({
      vendorId,
      listingId: serviceId,
      actionType: 'WHATSAPP',
      message: `User clicked WhatsApp for ${serviceName}`
    });
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  }, [whatsapp, createLead, vendorId, serviceId, serviceName]);

  const handleInquiryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    openInquiryModal({ id: serviceId, vendorId, name: serviceName });
  }, [openInquiryModal, serviceId, vendorId, serviceName]);

  const buttonSizeClass = cn(
    size === 'sm' ? "h-8 w-8 p-0" : size === 'md' ? "h-10 w-10 p-0" : "h-12 w-12 p-0"
  );

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 20;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="primary" 
        size="sm" 
        onClick={handleCall}
        className={cn(
          buttonSizeClass, 
          "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-90 flex items-center justify-center gap-2",
          size === 'lg' && "flex-1"
        )}
        title="Call Now"
      >
        <Phone size={iconSize} className="fill-current" />
        {size === 'lg' && <span className="text-xs font-bold uppercase tracking-wider">Call Now</span>}
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleWhatsapp}
        className={cn(
          buttonSizeClass, 
          "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-100 transition-all active:scale-90 flex items-center justify-center gap-2",
          size === 'lg' && "flex-1"
        )}
        title="WhatsApp"
      >
        <MessageCircle size={iconSize} className="fill-current" />
        {size === 'lg' && <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>}
      </Button>
      {showInquiry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleInquiryClick}
          className={cn(
            size === 'sm' ? "h-8 px-3" : size === 'md' ? "h-10 px-4" : "h-12 px-6",
            "flex-1 font-bold text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          )}
        >
          <Send size={iconSize - 4} className="mr-1" />
          <span className={cn(size === 'sm' ? "text-[8px]" : "text-[10px]", "uppercase tracking-wider")}>Inquiry</span>
        </Button>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
