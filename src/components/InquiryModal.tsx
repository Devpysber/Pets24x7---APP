import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onSubmit?: (data: { name: string; phone: string; requirement: string; preferredTime: string; serviceType: string }) => void;
}

const SERVICE_TYPES = ['General Inquiry', 'Booking', 'Emergency', 'Price Quote', 'Other'];
const TIME_SLOTS = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Anytime'];

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, serviceName, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[3]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, phone, requirement, preferredTime, serviceType });
    }
    setIsSubmitted(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setRequirement('');
      setServiceType(SERVICE_TYPES[0]);
      setPreferredTime(TIME_SLOTS[3]);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Send Inquiry</h2>
                        <p className="text-xs text-gray-500 mt-1">To: <span className="font-bold text-indigo-600">{serviceName}</span></p>
                      </div>
                      <button 
                        onClick={handleClose}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                          <input 
                            required
                            type="tel" 
                            placeholder="Mobile number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Service Type</label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          {SERVICE_TYPES.map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setServiceType(type)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
                                serviceType === type 
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                  : "bg-gray-50 text-gray-500 border-black/5 hover:bg-gray-100"
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Preferred Time</label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setPreferredTime(slot)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
                                preferredTime === slot 
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                  : "bg-gray-50 text-gray-500 border-black/5 hover:bg-gray-100"
                              )}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Requirement</label>
                        <textarea 
                          required
                          rows={3}
                          placeholder="Describe what you're looking for..."
                          value={requirement}
                          onChange={(e) => setRequirement(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium resize-none"
                        />
                      </div>

                      <Button type="submit" className="w-full h-12 mt-2 bg-indigo-600 shadow-lg shadow-indigo-100">
                        <Send className="h-4 w-4 mr-2" />
                        Send Inquiry Now
                      </Button>
                      
                      <p className="text-[10px] text-center text-gray-400 mt-2">
                        By clicking send, you agree to our Terms of Service.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h2>
                    <p className="text-sm text-gray-500 max-w-[240px]">
                      Vendor will contact you shortly on your provided number.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleClose}
                      className="mt-8 border-gray-200 text-gray-600"
                    >
                      Close Window
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
