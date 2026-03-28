import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Star, Zap, Crown, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: 'SILVER',
    name: 'Silver',
    price: '₹999',
    period: '/month',
    icon: Star,
    color: 'text-slate-400',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    features: [
      'Priority in search results',
      'Silver badge on listings',
      '20 Lead credits included',
      'Basic analytics'
    ]
  },
  {
    id: 'GOLD',
    name: 'Gold',
    price: '₹2,499',
    period: '/month',
    icon: Crown,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    recommended: true,
    features: [
      'Top priority in search',
      'Gold badge on listings',
      '50 Lead credits included',
      'Advanced analytics',
      'Featured in category home'
    ]
  },
  {
    id: 'PLATINUM',
    name: 'Platinum',
    price: '₹4,999',
    period: '/month',
    icon: Zap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    features: [
      'Highest priority ranking',
      'Platinum badge on listings',
      '100 Lead credits included',
      'Full analytics suite',
      'Dedicated account manager',
      'Home screen feature'
    ]
  }
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { updateSubscription, subscription, isLoading } = useAppStore();

  const handleUpgrade = async (planId: any) => {
    await updateSubscription(planId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
              <div>
                <h2 className="text-2xl font-bold">Upgrade Your Presence</h2>
                <p className="text-indigo-100 text-sm mt-1">Choose a plan to get more leads and visibility</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                  const Icon = plan.icon;
                  const isCurrent = subscription.plan === plan.id;

                  return (
                    <div 
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col p-6 rounded-3xl border-2 transition-all",
                        plan.recommended ? "border-indigo-600 shadow-xl shadow-indigo-100" : plan.borderColor,
                        plan.bgColor
                      )}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                          Most Popular
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn("p-2 rounded-xl bg-white shadow-sm", plan.color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      </div>

                      <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 text-sm">{plan.period}</span>
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading || isCurrent}
                        className={cn(
                          "w-full h-12 rounded-xl font-bold text-sm",
                          isCurrent 
                            ? "bg-gray-100 text-gray-400 cursor-default" 
                            : plan.recommended 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                              : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Secure Payment & Instant Activation</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Your listings will be prioritized immediately after upgrade.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
