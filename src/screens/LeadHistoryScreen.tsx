import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  ChevronLeft, 
  MessageSquare, 
  Phone, 
  Clock, 
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { cn } from '../utils/theme';

export const LeadHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { inquiries, user } = useAppStore();
  
  // Filter inquiries for current user
  const userInquiries = inquiries.filter(inq => inq.userId === user?.id || inq.userId === 'guest');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'inquiry': return <ExternalLink className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'whatsapp': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'inquiry': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Inquiries</h1>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {userInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">No Inquiries Yet</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-[240px]">
              When you contact vendors, your history will appear here.
            </p>
            <Button onClick={() => navigate('/')}>Explore Services</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-0 overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 flex gap-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={inquiry.serviceImage} 
                        alt={inquiry.serviceName} 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{inquiry.serviceName}</h3>
                        <div className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1",
                          getTypeColor(inquiry.type)
                        )}>
                          {getTypeIcon(inquiry.type)}
                          {inquiry.type}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {inquiry.message && (
                        <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded-xl border border-black/5">
                          "{inquiry.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50/50 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Vendor Notified</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 h-auto p-0 text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => navigate(`/service/${inquiry.serviceId}`)}
                    >
                      View Service
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
