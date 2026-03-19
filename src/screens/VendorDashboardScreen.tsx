import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Plus, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ChevronRight, 
  MessageSquare, 
  Star,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap,
  Crown
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PetService } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router-dom';
import { LeadPurchaseModal } from '../components/LeadPurchaseModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function VendorDashboardScreen() {
  const { user, services, inquiries, subscription, updateSubscription, deleteService, leadCredits } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'subscription'>('overview');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter services owned by this vendor (mocking by checking if it's not verified or just all for now)
  const myServices = services.filter(s => s.id === 's1'); // Mocking s1 as vendor's listing
  const myLeads = inquiries.filter(i => i.serviceId === 's1');

  const stats = [
    { label: 'Total Listings', value: myServices.length, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Leads', value: myLeads.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lead Credits', value: leadCredits, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', action: () => setIsLeadModalOpen(true) },
    { label: 'Profile Views', value: '1.2k', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
            <p className="text-sm text-slate-500">Manage your pet business</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          {(['overview', 'listings', 'leads', 'subscription'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-xs font-medium rounded-md capitalize transition-all",
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  onClick={stat.action}
                  className={cn(
                    "bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all",
                    stat.action && "cursor-pointer active:scale-95 hover:border-amber-200"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    {stat.action && <Plus className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Recent Leads</h2>
                <button onClick={() => setActiveTab('leads')} className="text-xs text-emerald-600 font-medium">View All</button>
              </div>
              <div className="divide-y divide-slate-50">
                {myLeads.length > 0 ? (
                  myLeads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{lead.userName}</div>
                        <div className="text-xs text-slate-500">{lead.message.slice(0, 30)}...</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No leads yet</div>
                )}
              </div>
            </div>

            {/* Subscription Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Current Plan</div>
                    <div className="text-2xl font-bold capitalize flex items-center gap-2">
                      {subscription.plan} Plan
                      {subscription.plan === 'premium' && <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />}
                    </div>
                  </div>
                  <CreditCard className="w-8 h-8 text-indigo-200 opacity-50" />
                </div>
                <p className="text-indigo-50 text-sm mb-6 max-w-[200px]">
                  {subscription.plan === 'premium' 
                    ? 'You are enjoying all premium benefits. Your visibility is boosted!'
                    : 'Upgrade to Premium to get 5x more leads and featured placement.'}
                </p>
                <button 
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  {subscription.plan === 'premium' ? 'View Plan Details' : 'Upgrade to Premium'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'listings' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Listings</h2>
              <button className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>

            <div className="space-y-4">
              {myServices.map((service) => (
                <div key={service.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex space-x-4">
                  <img src={service.image} alt={service.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 truncate">{service.name}</h3>
                        <p className="text-xs text-slate-500">{service.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteService(service.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {service.rating}
                      </div>
                      <div className="text-xs text-slate-400">{service.reviewCount} reviews</div>
                      {service.isVerified && (
                        <div className="flex items-center text-emerald-600 text-[10px] font-bold uppercase">
                          <CheckCircle className="w-3 h-3 mr-0.5" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">Customer Leads</h2>
            <div className="space-y-4">
              {myLeads.length > 0 ? (
                myLeads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {lead.userName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{lead.userName}</div>
                          <div className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <button className="text-xs text-emerald-600 font-bold px-3 py-1 border border-emerald-100 rounded-full bg-emerald-50">
                        Reply
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                      "{lead.message}"
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {lead.userPhone}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold">No leads yet</h3>
                  <p className="text-slate-500 text-sm">When customers inquire about your services, they will appear here.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'subscription' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Subscription Status</h2>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-6">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current Plan</div>
                  <div className="text-xl font-bold text-slate-900 capitalize">{subscription.plan}</div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  subscription.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                )}>
                  {subscription.status === 'none' ? 'Inactive' : subscription.status}
                </div>
              </div>

              {subscription.plan === 'free' && (
                <div className="space-y-4">
                  <div className="p-4 border-2 border-emerald-100 rounded-2xl bg-emerald-50/30">
                    <h3 className="font-bold text-emerald-900 mb-2">Upgrade to Premium</h3>
                    <ul className="space-y-2 mb-6">
                      {[
                        'Priority listing in search results',
                        'Verified badge on profile',
                        'Unlimited customer leads',
                        'Detailed performance analytics',
                        'Featured placement on homepage'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-emerald-800">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => updateSubscription('premium')}
                      className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                    >
                      Upgrade for ₹999/month
                    </button>
                  </div>
                </div>
              )}

              {subscription.plan === 'premium' && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">Premium Active</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Your premium subscription is active until {new Date(subscription.expiryDate!).toLocaleDateString()}.
                  </p>
                  <button className="text-sm font-bold text-blue-600 hover:underline">
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <LeadPurchaseModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </div>
  );
}
