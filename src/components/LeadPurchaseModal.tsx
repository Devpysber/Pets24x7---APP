import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface LeadPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadPurchaseModal: React.FC<LeadPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { buyLeads, leadCredits } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const leadPlans = [
    { id: 0, amount: 10, price: 199, label: 'Starter Pack', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 1, amount: 50, price: 799, label: 'Growth Pack', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', popular: true },
    { id: 2, amount: 150, price: 1999, label: 'Enterprise Pack', icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      buyLeads(leadPlans[selectedPlan].amount);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Buy Lead Credits</h2>
                  <p className="text-xs text-slate-500">Current Balance: {leadCredits} Credits</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!isSuccess ? (
                <>
                  <div className="space-y-3">
                    {leadPlans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left relative",
                          selectedPlan === plan.id 
                            ? "border-indigo-600 bg-indigo-50/30" 
                            : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 right-4 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Most Popular
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", plan.bg)}>
                            <plan.icon className={cn("w-6 h-6", plan.color)} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{plan.label}</div>
                            <div className="text-xs text-slate-500">{plan.amount} Lead Credits</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-slate-900">₹{plan.price}</div>
                          <div className="text-[10px] text-slate-400 font-medium">One-time</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lead credits allow you to view customer contact details and respond to inquiries. 1 Credit = 1 Customer Lead.
                    </p>
                  </div>

                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-100 rounded-2xl flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ₹{leadPlans[selectedPlan].price}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Purchase Successful!</h3>
                  <p className="text-slate-500">
                    {leadPlans[selectedPlan].amount} credits have been added to your account.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Secure Transaction · Instant Credit
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
