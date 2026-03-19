import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  MessageSquare, 
  Zap, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  ChevronRight,
  UserPlus,
  ArrowUpCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/theme';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NotificationType } from '../types';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'lead': return <Zap className="h-5 w-5 text-amber-500" />;
    case 'message': return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'lost_found': return <AlertCircle className="h-5 w-5 text-rose-500" />;
    case 'reminder': return <UserPlus className="h-5 w-5 text-indigo-500" />;
    case 'system': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    default: return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getBgColor = (type: NotificationType) => {
  switch (type) {
    case 'lead': return 'bg-amber-50';
    case 'message': return 'bg-blue-50';
    case 'lost_found': return 'bg-rose-50';
    case 'reminder': return 'bg-indigo-50';
    case 'system': return 'bg-emerald-50';
    default: return 'bg-gray-50';
  }
};

export default function NotificationScreen() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useAppStore();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-black/5 px-6 py-6 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {notifications.length > 0 && (
            <button 
              onClick={clearNotifications}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500">
            {unreadCount} Unread
          </span>
          {unreadCount > 0 && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="px-4 py-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              You don't have any new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, idx) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 relative overflow-hidden",
                  notification.isRead 
                    ? "bg-white border-slate-100 opacity-70" 
                    : "bg-white border-indigo-100 shadow-sm shadow-indigo-100/50"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  getBgColor(notification.type)
                )}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn(
                      "text-sm font-bold truncate",
                      notification.isRead ? "text-slate-700" : "text-slate-900"
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>
                </div>

                <div className="flex items-center self-center text-slate-300">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Push Notification Placeholder Prompt */}
      <div className="px-4 mt-8">
        <Card className="p-6 bg-indigo-600 text-white border-none overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Never miss an update</h3>
                <p className="text-xs text-indigo-100">Enable push notifications</p>
              </div>
            </div>
            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold">
              Enable Notifications
            </Button>
          </div>
        </Card>
      </div>

      {/* Reminder Prompts */}
      <div className="px-4 mt-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Reminders</h2>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
            <ArrowUpCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Upgrade to Premium</h4>
            <p className="text-[11px] text-slate-500">Get 5x more visibility and lead priority.</p>
          </div>
          <Button size="sm" className="bg-amber-500 text-white h-8 px-3 text-[10px]" onClick={() => navigate('/subscription')}>
            Upgrade
          </Button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
            <UserPlus className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Complete Profile</h4>
            <p className="text-[11px] text-slate-500">Add images to your business listing.</p>
          </div>
          <Button size="sm" variant="outline" className="h-8 px-3 text-[10px]" onClick={() => navigate('/vendor/dashboard')}>
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white rounded-3xl shadow-sm border border-slate-100", className)}>
      {children}
    </div>
  );
}
