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
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Eye,
  XCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PetService, LostFoundPost } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboardScreen() {
  const { services, lostFoundPosts, deleteService, approveService, deleteLostFoundPost } = useAppStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings' | 'lostfound' | 'users'>('analytics');

  const pendingServices = services.filter(s => !s.isVerified);
  const activeServices = services.filter(s => s.isVerified);

  const stats = [
    { label: 'Total Users', value: '12.4k', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: services.length, icon: LayoutDashboard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Revenue (MTD)', value: '₹45k', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Lost/Found', value: lostFoundPosts.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-8 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-xs text-slate-400">System Overview & Management</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl">
          {(['analytics', 'listings', 'lostfound', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all",
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-md" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mock Charts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-900">User Growth</h2>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-40 flex items-end justify-between space-x-2">
                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group">
                    <div 
                      style={{ height: `${h}%` }} 
                      className="bg-blue-500 rounded-t-lg w-full transition-all group-hover:bg-blue-600"
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">M{i+1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900">Categories</h2>
                  <PieChart className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Grooming', val: '45%', color: 'bg-blue-500' },
                    { label: 'Vets', val: '30%', color: 'bg-emerald-500' },
                    { label: 'Training', val: '25%', color: 'bg-amber-500' },
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center">
                        <div className={cn("w-2 h-2 rounded-full mr-2", cat.color)} />
                        <span className="text-slate-600">{cat.label}</span>
                      </div>
                      <span className="font-bold text-slate-900">{cat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900">System Status</h2>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">CPU Load</span>
                    <span className="font-bold text-emerald-600">12%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">Memory</span>
                    <span className="font-bold text-emerald-600">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">Storage</span>
                    <span className="font-bold text-emerald-600">2.1GB</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'listings' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Pending Approvals */}
            {pendingServices.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-amber-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Pending Approvals ({pendingServices.length})
                </h2>
                {pendingServices.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-sm">
                    <div className="flex space-x-4">
                      <img src={service.image} alt={service.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{service.name}</h3>
                        <p className="text-xs text-slate-500">{service.category}</p>
                        <div className="mt-3 flex space-x-2">
                          <button 
                            onClick={() => approveService(service.id)}
                            className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-bold py-2 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Manage Listings</h2>
                <div className="flex space-x-2">
                  <button className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Search className="w-4 h-4 text-slate-500" />
                  </button>
                  <button className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Filter className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
                    <img src={service.image} alt={service.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{service.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-500">{service.category}</span>
                        {service.isVerified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </div>
                    <button className="p-2 text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'lostfound' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">Lost & Found Moderation</h2>
            <div className="space-y-4">
              {lostFoundPosts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        post.type === 'lost' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {post.type}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => deleteLostFoundPost(post.id)}
                      className="text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <img src={post.image} alt={post.petName} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{post.petName}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{post.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">User Management</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {[
                  { name: 'Antriksh Shah', email: 'shah.antriksh@gmail.com', role: 'Admin', status: 'Active' },
                  { name: 'Priya Patel', email: 'priya@example.com', role: 'Vendor', status: 'Active' },
                  { name: 'Rahul Kumar', email: 'rahul@example.com', role: 'User', status: 'Banned' },
                  { name: 'Sneha Gupta', email: 'sneha@example.com', role: 'User', status: 'Active' },
                ].map((user, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-[10px] font-bold uppercase",
                        user.role === 'Admin' ? "text-purple-600" : user.role === 'Vendor' ? "text-blue-600" : "text-slate-500"
                      )}>
                        {user.role}
                      </div>
                      <div className={cn(
                        "text-[10px] font-bold",
                        user.status === 'Active' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {user.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md">
              Export User Data (CSV)
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
