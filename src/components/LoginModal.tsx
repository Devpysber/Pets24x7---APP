import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setUser({
        id: 'u1',
        name: email.split('@')[0],
        email: email,
        avatar: `https://picsum.photos/seed/${email}/100/100`,
        role: 'user',
      });
      onClose();
    }, 1500);
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
            className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'email' ? 'Welcome Back' : 'Verify Email'}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {step === 'email' 
                  ? 'Enter your email to continue' 
                  : `We've sent a code to ${email}`}
              </p>
            </div>

            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Continue'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <input
                      key={i}
                      required
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 text-center text-xl font-bold rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={otp[i-1] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 1) {
                          setOtp(prev => {
                            const newOtp = prev.split('');
                            newOtp[i-1] = val;
                            return newOtp.join('');
                          });
                        }
                      }}
                    />
                  ))}
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                  {!isLoading && <CheckCircle2 className="ml-2 h-4 w-4" />}
                </Button>
                <button 
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-indigo-600 font-bold mt-2"
                >
                  Change Email
                </button>
              </form>
            )}

            <p className="text-center text-[11px] text-gray-400 mt-8">
              By continuing, you agree to Pets24x7's <br />
              <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
