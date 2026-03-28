import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';
import axiosInstance from '../api/axiosInstance';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        const response = await axiosInstance.post('/auth/register', { email, password, name });
        const { user, token } = response.data;
        localStorage.setItem('auth_token', token);
        // We might need to update the store here, but login() does it.
        // For simplicity, let's just login after registration or handle it here.
        await login(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {mode === 'login' 
                  ? 'Enter your credentials to continue' 
                  : 'Join Pets24x7 community today'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              )}
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
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-sm text-indigo-600 font-bold hover:underline"
              >
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>

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
