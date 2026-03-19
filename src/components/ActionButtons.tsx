import React, { memo, useCallback } from 'react';
import { Button } from './Button';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { cn } from '../utils/theme';

interface ActionButtonsProps {
  phone: string;
  whatsapp: string;
  onInquiry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showInquiry?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = memo(({ 
  phone, 
  whatsapp, 
  onInquiry, 
  className, 
  size = 'md',
  showInquiry = true
}) => {
  const handleCall = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  }, [phone]);

  const handleWhatsapp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  }, [whatsapp]);

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
        className={cn(buttonSizeClass, "bg-indigo-600 hover:bg-indigo-700 shadow-sm")}
      >
        <Phone size={iconSize} />
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleWhatsapp}
        className={cn(buttonSizeClass, "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm")}
      >
        <MessageCircle size={iconSize} />
      </Button>
      {showInquiry && onInquiry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onInquiry();
          }}
          className={cn(
            size === 'sm' ? "h-8 px-3" : size === 'md' ? "h-10 px-4" : "h-12 px-6",
            "flex-1 font-bold text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50"
          )}
        >
          <Send size={iconSize - 4} className="mr-2" />
          Inquiry
        </Button>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
