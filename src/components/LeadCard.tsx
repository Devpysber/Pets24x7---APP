import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Inquiry } from '../types';
import { cn } from '../utils/theme';
import { Phone, MessageCircle, Send, Clock, User } from 'lucide-react';

interface LeadCardProps {
  lead: Inquiry;
  onAction?: (type: 'call' | 'whatsapp' | 'inquiry') => void;
  className?: string;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onAction, className }) => {
  const statusColors = {
    new: 'bg-blue-50 text-blue-700 border-blue-100',
    contacted: 'bg-amber-50 text-amber-700 border-amber-100',
    closed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const typeIcons = {
    call: <Phone size={12} />,
    whatsapp: <MessageCircle size={12} />,
    inquiry: <Send size={12} />,
  };

  return (
    <Card className={cn("p-4 flex flex-col gap-4 border-slate-100 shadow-sm hover:shadow-md transition-all", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{lead.userName}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <Clock size={10} />
              {new Date(lead.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Badge className={cn("text-[8px]", statusColors[lead.status])}>
          {lead.status}
        </Badge>
      </div>

      <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-600">
            {typeIcons[lead.type]}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.type} Lead</span>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 italic">"{lead.message}"</p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onAction?.('call')}
          className="flex-1 h-9 rounded-xl bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Phone size={12} />
          Call
        </button>
        <button 
          onClick={() => onAction?.('whatsapp')}
          className="flex-1 h-9 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle size={12} />
          WhatsApp
        </button>
      </div>
    </Card>
  );
};
