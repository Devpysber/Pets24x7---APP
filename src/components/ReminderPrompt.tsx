import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface ReminderPromptProps {
  type: 'upgrade' | 'profile';
  onClose: () => void;
  onAction: () => void;
}

export const ReminderPrompt: React.FC<ReminderPromptProps> = ({ type, onClose, onAction }) => {
  const isUpgrade = type === 'upgrade';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        "mx-4 p-5 rounded-3xl relative overflow-hidden shadow-xl border-none",
        isUpgrade 
          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" 
          : "bg-gradient-to-r from-indigo-600 to-violet-700 text-white"
      )}
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />
      
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shrink-0">
          {isUpgrade ? <Sparkles className="h-6 w-6" /> : <UserCheck className="h-6 w-6" /> }
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            {isUpgrade ? "Boost Your Business" : "Complete Your Profile"}
          </h3>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {isUpgrade 
              ? "Premium vendors get 10x more leads and featured placement. Upgrade today!" 
              : "A complete profile with images builds 3x more trust with pet owners."}
          </p>
          <Button 
            onClick={onAction}
            className="bg-white text-slate-900 hover:bg-slate-50 font-bold h-10 px-6 rounded-xl text-xs flex items-center gap-2"
          >
            {isUpgrade ? "Upgrade Now" : "Complete Now"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
