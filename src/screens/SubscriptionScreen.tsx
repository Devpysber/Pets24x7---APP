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

      <div className="px-6 -mt-12 relative z-20">
        {/* Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100 border border-indigo-50 text-center"
        >
          <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Best Value
          </div>
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-slate-400 mr-1">₹</span>
            <span className="text-5xl font-black text-slate-900">999</span>
            <span className="text-slate-400 font-medium ml-1">/month</span>
          </div>
          <p className="text-slate-500 text-sm mb-8">Cancel anytime. No hidden fees.</p>
          
          <Button 
            onClick={handleUpgrade}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 rounded-2xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Upgrade Now
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            Secure payment via Razorpay
          </div>
        </motion.div>

        {/* Benefits List */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 px-2">Why Premium?</h2>
          <div className="grid gap-4">
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", benefit.bg)}>
                  <benefit.icon className={cn("w-6 h-6", benefit.color)} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
          </div>
          <p className="text-slate-700 text-sm italic mb-4">
            "Since upgrading to Premium, my grooming business has seen a 300% increase in monthly inquiries. The featured placement really works!"
          </p>
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/seed/vendor1/100/100" alt="Vendor" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-xs font-bold text-slate-900">Rajesh Kumar</div>
              <div className="text-[10px] text-slate-500">Paws & Claws Grooming</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
