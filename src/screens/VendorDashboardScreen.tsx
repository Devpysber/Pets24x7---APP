import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Crown,
  Image as ImageIcon,
  Camera,
  Save,
  X,
  Phone,
  MapPin,
  Check,
  Clock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PetService, Inquiry, InquiryStatus } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router-dom';
import { LeadPurchaseModal } from '../components/LeadPurchaseModal';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { NoLeadsState } from '../components/EmptyState';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function VendorDashboardScreen() {
  const { user, services, inquiries, subscription, updateSubscription, cancelSubscription, addService, updateService, deleteService, updateInquiryStatus, leadCredits } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'subscription'>('overview');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<PetService | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<PetService>>({
    name: '',
    category: 'Grooming',
    location: '',
    phone: '',
    whatsapp: '',
    description: '',
    price: '',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    reviewCount: 0,
    isVerified: false,
    isPremium: false
  });
  const [leadFilter, setLeadFilter] = useState<InquiryStatus | 'all'>('all');
  const navigate = useNavigate();

  // Filter services owned by this vendor
  const myServices = services.filter(s => s.vendorId === user?.id); 
  const myLeads = inquiries.filter(i => myServices.some(s => s.id === i.serviceId));

  const filteredLeads = leadFilter === 'all' 
    ? myLeads 
    : myLeads.filter(l => l.status === leadFilter);

  const stats = [
    { label: 'Total Listings', value: myServices.length, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Leads', value: myLeads.filter(l => l.status === 'new').length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lead Credits', value: leadCredits, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', action: () => setIsLeadModalOpen(true) },
    { label: 'Profile Views', value: '1.2k', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      addService({
        ...newService as PetService,
        vendorId: user.id,
      });
      setIsAddingService(false);
      setNewService({
        name: '',
        category: 'Grooming',
        location: '',
        phone: '',
        whatsapp: '',
        description: '',
        price: '',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
        rating: 5.0,
        reviewCount: 0,
        isVerified: false,
        isPremium: false
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isEditing && editingService) {
        setEditingService({ ...editingService, image: url });
      } else {
        setNewService({ ...newService, image: url });
      }
    }
  };

  const handleStatusChange = (leadId: string, status: InquiryStatus) => {
    updateInquiryStatus(leadId, status);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6 sticky top-0 z-40">
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

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {lead.userName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{lead.userName}</div>
                          <div className="text-[10px] text-slate-500">{lead.serviceType || lead.type}</div>
                        </div>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        lead.status === 'new' ? "bg-blue-50 text-blue-600" :
                        lead.status === 'contacted' ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-600"
                      )}>
                        {lead.status}
                      </div>
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
                  onClick={() => setActiveTab('subscription')}
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
              <button 
                onClick={() => setIsAddingService(true)}
                className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>

            <div className="space-y-4">
              {myServices.map((service) => (
                <div key={service.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex space-x-4">
                  <div className="relative group">
                    <img src={service.image} alt={service.name} className="w-24 h-24 rounded-xl object-cover" />
                    <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white">
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 truncate">{service.name}</h3>
                        <p className="text-xs text-slate-500">{service.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingService(service)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
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
                      {service.isPremium && (
                        <div className="flex items-center text-indigo-600 text-[10px] font-bold uppercase">
                          <Crown className="w-3 h-3 mr-0.5" />
                          Premium
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        Manage Photos
                      </button>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
                        View Public
                      </button>
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Customer Leads</h2>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {(['all', 'new', 'contacted', 'closed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setLeadFilter(status)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-all",
                      leadFilter === status ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {lead.userName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{lead.userName}</div>
                          <div className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as InquiryStatus)}
                        className={cn(
                          "text-[10px] font-bold uppercase px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none",
                          lead.status === 'new' ? "bg-blue-50 text-blue-600" :
                          lead.status === 'contacted' ? "bg-amber-50 text-amber-600" :
                          "bg-gray-50 text-gray-600"
                        )}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                        <Zap className="h-3 w-3 text-indigo-500" />
                        <span className="font-bold uppercase">{lead.serviceType || 'General'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                        <Clock className="h-3 w-3 text-indigo-500" />
                        <span className="font-bold uppercase">{lead.preferredTime || 'Anytime'}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 bg-indigo-50/30 p-3 rounded-xl italic mb-3">
                      "{lead.message}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${lead.userPhone}`} 
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold active:scale-95 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call
                        </a>
                        <a 
                          href={`https://wa.me/${lead.userPhone}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold active:scale-95 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                        Via {lead.type}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <NoLeadsState onAction={() => navigate('/vendor/dashboard')} />
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
            {/* Current Plan Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Subscription Status</h2>
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl mb-6">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Current Active Plan</div>
                  <div className="text-2xl font-bold text-slate-900 capitalize flex items-center gap-2">
                    {subscription.plan}
                    {subscription.plan === 'premium' && <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  subscription.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                )}>
                  {subscription.status === 'none' ? 'Inactive' : subscription.status}
                </div>
              </div>

              {subscription.plan === 'premium' && (
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900">Premium Active</h3>
                      <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Renewing on {new Date(subscription.expiryDate!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-700 leading-relaxed mb-4">
                    Your business is currently appearing in top search results and has the verified badge.
                  </p>
                  <div className="flex items-center justify-between">
                    <button className="text-xs font-bold text-indigo-600 hover:underline">
                      Manage Billing & Invoices
                    </button>
                    <button 
                      onClick={() => cancelSubscription()}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Plan Comparison</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className={cn(
                    "p-5 rounded-3xl border-2 transition-all",
                    subscription.plan === 'free' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 bg-white"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900">Free Starter</h4>
                      <div className="text-lg font-bold text-slate-900">₹0<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {['Basic Listing', 'Limited Leads', 'Standard Support'].map((f, i) => (
                        <li key={i} className="flex items-center text-xs text-slate-600">
                          <Check className="w-4 h-4 mr-2 text-slate-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {subscription.plan !== 'free' && (
                      <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600">Downgrade</Button>
                    )}
                  </div>

                  <div className={cn(
                    "p-5 rounded-3xl border-2 transition-all relative overflow-hidden",
                    subscription.plan === 'premium' ? "border-indigo-600 bg-indigo-50/30" : "border-amber-200 bg-amber-50/30"
                  )}>
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl">Recommended</div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        Premium Pro
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </h4>
                      <div className="text-lg font-bold text-slate-900">₹999<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {[
                        'Top Search Placement',
                        'Verified Business Badge',
                        'Unlimited Leads',
                        'Featured on Homepage',
                        'Priority Support 24/7'
                      ].map((f, i) => (
                        <li key={i} className="flex items-center text-xs text-slate-900 font-medium">
                          <Check className="w-4 h-4 mr-2 text-indigo-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {subscription.plan !== 'premium' ? (
                      <Button 
                        onClick={() => updateSubscription('premium')}
                        className="w-full rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100"
                      >
                        Upgrade Now
                      </Button>
                    ) : (
                      <div className="text-center text-xs font-bold text-indigo-600 uppercase tracking-wider">Current Active Plan</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Listing Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Edit Business</h2>
                  <button onClick={() => setEditingService(null)} className="p-2 rounded-full bg-slate-100 text-slate-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateService} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Business Name</label>
                    <input 
                      required
                      type="text" 
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        value={editingService.location}
                        onChange={(e) => setEditingService({ ...editingService, location: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Phone</label>
                      <input 
                        required
                        type="tel" 
                        value={editingService.phone}
                        onChange={(e) => setEditingService({ ...editingService, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">WhatsApp</label>
                      <input 
                        required
                        type="tel" 
                        value={editingService.whatsapp}
                        onChange={(e) => setEditingService({ ...editingService, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Business Image</label>
                    <div className="flex items-center gap-4">
                      <img src={editingService.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-black/5" />
                      <label className="flex-1 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer">
                        <Camera className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase">Change Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, true)}
                        />
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 mt-2 bg-indigo-600 shadow-lg shadow-indigo-100">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {isAddingService && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingService(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Add New Listing</h2>
                  <button onClick={() => setIsAddingService(false)} className="p-2 rounded-full bg-slate-100 text-slate-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Business Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Pawsome Grooming"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Category</label>
                    <select 
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    >
                      <option value="Grooming">Grooming</option>
                      <option value="Daycare">Daycare</option>
                      <option value="Vet">Vet</option>
                      <option value="Training">Training</option>
                      <option value="Boarding">Boarding</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Bandra, Mumbai"
                        value={newService.location}
                        onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Phone</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="Phone number"
                        value={newService.phone}
                        onChange={(e) => setNewService({ ...newService, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">WhatsApp</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="WhatsApp number"
                        value={newService.whatsapp}
                        onChange={(e) => setNewService({ ...newService, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Tell customers about your business..."
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Business Image</label>
                    <div className="flex items-center gap-4">
                      <img src={newService.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-black/5" />
                      <label className="flex-1 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer">
                        <Camera className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase">Upload Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, false)}
                        />
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 mt-2 bg-emerald-600 shadow-lg shadow-emerald-100">
                    <Save className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LeadPurchaseModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </div>
  );
}
