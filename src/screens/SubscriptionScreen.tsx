import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/theme';

export default function SubscriptionScreen() {
  const { subscription, updateSubscription } = useAppStore();
  const navigate = useNavigate();

  const benefits = [
    {
      title: 'Featured Placement',
      description: 'Appear at the top of search results and category pages.',
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      title: '5x More Visibility',
      description: 'Get your business in front of more pet owners across the city.',
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Lead Priority',
      description: 'Receive customer inquiries before non-premium vendors.',
      icon: Zap,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Verified Badge',
      description: 'Build trust with a premium verification badge on your profile.',
      icon: ShieldCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    }
  ];

  const handleUpgrade = () => {
    updateSubscription('premium');
    // In a real app, this would trigger a payment gateway
    setTimeout(() => {
      navigate('/vendor/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 pt-12 pb-20 px-6 text-white text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
            <Crown className="w-10 h-10 text-amber-300" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Go Premium</h1>
          <p className="text-indigo-100 max-w-xs mx-auto">
            Take your pet business to the next level with our premium growth tools.
          </p>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Plan - Limited */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 opacity-80 grayscale-[0.5] flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Free Plan</h3>
              <p className="text-xs text-slate-500">Basic listing for your business</p>
            </div>
            
            <div className="mb-8">
              <span className="text-3xl font-bold text-slate-900">₹0</span>
              <span className="text-slate-500 ml-1 text-sm">/month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <div className="mt-0.5 text-red-400 font-bold">✕</div>
                <span>Standard search placement (Bottom)</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <div className="mt-0.5 text-red-400 font-bold">✕</div>
                <span>No premium badge or glow</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <div className="mt-0.5 text-red-400 font-bold">✕</div>
                <span>Limited lead visibility</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <div className="mt-0.5 text-emerald-500 font-bold">✓</div>
                <span>1 Business listing</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full cursor-not-allowed border-slate-200 text-slate-400" disabled>
              Current Plan
            </Button>
          </motion.div>

          {/* Premium Plan - Powerful */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-2xl shadow-amber-200/50 relative overflow-hidden ring-4 ring-amber-400/10 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
              Most Popular
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Premium Plan
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
              </h3>
              <p className="text-xs text-slate-500">Get 10x more leads and visibility</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">₹999</span>
              <span className="text-slate-500 ml-1 font-medium">/month</span>
            </div>

            <ul className="space-y-5 mb-8 flex-grow">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={cn("mt-0.5 p-1.5 rounded-lg shrink-0", benefit.bg)}>
                    <benefit.icon className={cn("h-4 w-4", benefit.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{benefit.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 h-14 text-lg font-black group rounded-2xl"
            >
              Get More Leads Now
              <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Secure payment. Cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
          </div>
          <p className="text-slate-700 text-sm italic mb-4 leading-relaxed">
            "Since upgrading to Premium, my grooming business has seen a 300% increase in monthly inquiries. The featured placement really works!"
          </p>
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/seed/vendor1/100/100" alt="Vendor" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div>
              <div className="text-xs font-bold text-slate-900">Rajesh Kumar</div>
              <div className="text-[10px] text-slate-500">Paws & Claws Grooming</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
