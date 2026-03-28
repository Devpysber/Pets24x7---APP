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
  Filter,
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
import { StatCard } from '../components/StatCard';
import { LeadCard } from '../components/LeadCard';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { FlatList } from '../components/FlatList';
import { SubscriptionModal } from '../components/SubscriptionModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function VendorDashboardScreen() {
  const { user, services, inquiries, subscription, updateSubscription, cancelSubscription, addService, updateService, deleteService, updateInquiryStatus, leadCredits, fetchVendorStats } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'subscription'>('overview');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  
  React.useEffect(() => {
    if (user?.id) {
      // In a real app, we'd use the vendor ID associated with the user
      // For now, we use 'v1' as a mock vendor ID
      fetchVendorStats('v1');
    }
  }, [user?.id, fetchVendorStats]);
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
  const [leadFilters, setLeadFilters] = useState<InquiryStatus[]>([]);
  const [isLeadFilterOpen, setIsLeadFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Filter services owned by this vendor
  const myServices = services.filter(s => s.vendorId === user?.id); 
  const myLeads = inquiries.filter(i => myServices.some(s => s.id === i.serviceId));

  const filteredLeads = leadFilters.length === 0 
    ? myLeads 
    : myLeads.filter(l => leadFilters.includes(l.status));

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
                <StatCard 
                  key={idx}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.bg + " " + stat.color}
                  onClick={stat.action}
                  className={cn(stat.action && "hover:border-amber-200")}
                />
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
                      <Badge variant={lead.status === 'new' ? 'primary' : lead.status === 'contacted' ? 'accent' : 'secondary'} className="text-[8px]">
                        {lead.status}
                      </Badge>
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
                      {subscription.plan !== 'FREE' && <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />}
                    </div>
                  </div>
                  <CreditCard className="w-8 h-8 text-indigo-200 opacity-50" />
                </div>
                <p className="text-indigo-50 text-sm mb-6 max-w-[200px]">
                  {subscription.plan !== 'FREE' 
                    ? 'You are enjoying all premium benefits. Your visibility is boosted!'
                    : 'Upgrade to a Premium plan to get more leads and priority placement.'}
                </p>
                <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  {subscription.plan !== 'FREE' ? 'Manage Subscription' : 'Upgrade Now'}
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
                <span>Add Pet</span>
              </button>
            </div>

            <div className="space-y-4">
              <DataTable 
                data={myServices}
                columns={[
                  {
                    header: 'Service',
                    accessor: (service) => (
                      <div className="flex items-center gap-3">
                        <img src={service.image} alt={service.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{service.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">{service.category}</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Status',
                    accessor: (service) => (
                      <Badge variant={service.isPremium ? 'accent' : 'primary'} className="text-[8px]">
                        {service.isPremium ? 'Premium' : 'Free'}
                      </Badge>
                    )
                  },
                  {
                    header: 'Rating',
                    accessor: (service) => (
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={12} className="fill-current" />
                        {service.rating}
                      </div>
                    )
                  },
                  {
                    header: 'Price',
                    accessor: (service) => (
                      <div className="font-bold text-slate-900">
                        {service.price || 'N/A'}
                      </div>
                    )
                  },
                  {
                    header: 'Actions',
                    accessor: (service) => (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            window.location.href = `tel:${service.phone}`; 
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Call Vendor"
                        >
                          <Phone size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingService(service); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteService(service.id); }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ),
                    className: "text-right"
                  }
                ]}
                onRowClick={(service) => navigate(`/service/${service.id}`)}
              />
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
              <div className="relative">
                <button 
                  onClick={() => setIsLeadFilterOpen(!isLeadFilterOpen)}
                  className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <Filter className="w-3 h-3" />
                  <span>Filter ({leadFilters.length || 'All'})</span>
                  <ChevronRight className={cn("w-3 h-3 transition-transform", isLeadFilterOpen ? "rotate-90" : "")} />
                </button>

                {isLeadFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    {(['new', 'contacted', 'closed'] as InquiryStatus[]).map(status => (
                      <label 
                        key={status}
                        className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input 
                          type="checkbox"
                          checked={leadFilters.includes(status)}
                          onChange={() => {
                            setLeadFilters(prev => 
                              prev.includes(status) 
                                ? prev.filter(s => s !== status) 
                                : [...prev, status]
                            );
                          }}
                          className="w-3 h-3 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                        />
                        <span className="text-[10px] font-bold uppercase text-slate-600">{status}</span>
                      </label>
                    ))}
                    {leadFilters.length > 0 && (
                      <button 
                        onClick={() => setLeadFilters([])}
                        className="w-full text-center py-2 text-[9px] font-black text-rose-500 border-t border-slate-50 hover:bg-rose-50 transition-colors uppercase tracking-widest"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FlatList
                data={filteredLeads}
                renderItem={(lead) => (
                  <div className="mb-4">
                    <LeadCard 
                      lead={lead} 
                      onAction={(type) => {
                        if (type === 'call') window.location.href = `tel:${lead.userPhone}`;
                        if (type === 'whatsapp') window.open(`https://wa.me/${lead.userPhone.replace(/\D/g, '')}`, '_blank');
                      }}
                    />
                  </div>
                )}
                ListEmptyComponent={<NoLeadsState onAction={() => navigate('/vendor/dashboard')} />}
              />
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
                    {subscription.plan !== 'FREE' && <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  subscription.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                )}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {subscription.plan !== 'FREE' && (
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900">{subscription.plan} Active</h3>
                      {subscription.expiryDate && (
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Renewing on {new Date(subscription.expiryDate).toLocaleDateString()}</p>
                      )}
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

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Manage Subscription</h3>
                <p className="text-sm text-slate-500">
                  Upgrade your plan to get more visibility, lead credits, and premium features.
                </p>
                <Button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100"
                >
                  {subscription.plan === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                </Button>
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
                      onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    >
                      <option value="Grooming">Grooming</option>
                      <option value="Daycare">Daycare</option>
                      <option value="Vet Clinics">Vet Clinics</option>
                      <option value="Trainers">Trainers</option>
                      <option value="Boarding">Boarding</option>
                      <option value="Pet Shops">Pet Shops</option>
                      <option value="Pet Hotels">Pet Hotels</option>
                      <option value="Events">Events</option>
                      <option value="Walking">Walking</option>
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

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)} 
      />

      <LeadPurchaseModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </div>
  );
}
