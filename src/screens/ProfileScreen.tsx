import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ListingCard } from '../components/ListingCard';
import { LostFoundPostCard } from '../components/LostFoundPostCard';
import { LoginModal } from '../components/LoginModal';
import { Badge } from '../components/Badge';
import { useAuth } from '../hooks/useAuth';
import { 
  Settings, 
  LogOut, 
  Heart, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/theme';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type ProfileTab = 'saved' | 'inquiries' | 'posts';

export const ProfileScreen: React.FC = () => {
  const { user, services, favorites, inquiries, lostFoundPosts, userRole } = useAppStore();
  const { logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('saved');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const savedServices = services.filter(s => favorites.includes(s.id));
  const myPosts = lostFoundPosts.filter(p => p.userName === user?.name || p.userName === 'You');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <UserIcon className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Pets24x7</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs">
          Login to save your favorite services, track inquiries, and post lost & found alerts.
        </p>
        <Button 
          onClick={() => setIsLoginOpen(true)}
          className="w-full max-w-xs h-14 bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
        >
          Login / Sign Up
        </Button>
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Profile Header */}
      <section className="px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button className="p-2 rounded-full bg-gray-100 text-gray-500">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <Card className="p-6 border-none shadow-xl shadow-indigo-50/50 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl border-4 border-white/20 overflow-hidden bg-white/10">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
                <Phone className="h-3 w-3" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-lg font-bold">{favorites.length}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Saved</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-lg font-bold">{inquiries.length}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Leads</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{myPosts.length}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Posts</p>
            </div>
          </div>
        </Card>

        {/* Admin/Vendor Dashboard Link */}
        <Link 
          to="/leads"
          className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100 shadow-sm shadow-emerald-100/50"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            <span>My Inquiries & Leads</span>
          </div>
          <ChevronRight className="h-5 w-5 opacity-50" />
        </Link>

        {(userRole === 'admin' || userRole === 'vendor') && (
          <Link 
            to={userRole === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
            className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 shadow-sm shadow-indigo-100/50"
          >
            <div className="flex items-center gap-3">
              {userRole === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
              <span>{userRole === 'admin' ? 'Admin Control Panel' : 'Vendor Dashboard'}</span>
            </div>
            <ChevronRight className="h-5 w-5 opacity-50" />
          </Link>
        )}
      </section>

      {/* Tabs */}
      <section className="px-4">
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('saved')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === 'saved' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
            )}
          >
            <Heart className={cn("h-4 w-4", activeTab === 'saved' && "fill-current")} />
            Saved
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === 'inquiries' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === 'posts' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
            )}
          >
            <FileText className="h-4 w-4" />
            Posts
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'saved' && (
              <div className="flex flex-col gap-4">
                {savedServices.length > 0 ? (
                  savedServices.map(service => (
                    <ListingCard key={service.id} service={service} viewType="list" />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400">No saved listings yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="flex flex-col gap-4">
                {inquiries.length > 0 ? (
                  inquiries.map(inquiry => (
                    <Card key={inquiry.id} className="p-4 border border-black/5 hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <img 
                            src={inquiry.serviceImage} 
                            alt={inquiry.serviceName} 
                            className="h-12 w-12 rounded-xl object-cover shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <div className="bg-indigo-600 rounded-full p-1">
                              <MessageSquare className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate">{inquiry.serviceName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <span className="text-[10px] text-gray-300">•</span>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Inquiry</span>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[9px] px-2 py-0.5 rounded-full">Sent</Badge>
                      </div>
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          <span className="text-indigo-300 mr-1">"</span>
                          {inquiry.message}
                          <span className="text-indigo-300 ml-1">"</span>
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-[10px] text-gray-400">
                          Status: <span className="text-emerald-600 font-bold uppercase">Pending Response</span>
                        </div>
                        <button className="text-[10px] font-bold text-indigo-600 hover:underline">
                          View Details
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-200" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">No inquiries yet</h3>
                    <p className="text-xs text-gray-400 mt-1">Your inquiry history will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="flex flex-col gap-4">
                {myPosts.length > 0 ? (
                  myPosts.map(post => (
                    <LostFoundPostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400">You haven't posted anything yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Logout & Role Switcher */}
      <section className="px-4 mt-4 space-y-3">
        <div className="flex gap-2">
          {(['user', 'vendor', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all",
                userRole === role ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>
      </section>
    </div>
  );
};
