import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, MapPin, Phone, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface CreateLostFoundPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLostFoundPostModal: React.FC<CreateLostFoundPostModalProps> = ({ isOpen, onClose }) => {
  const { addLostFoundPost } = useAppStore();
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [petType, setPetType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLostFoundPost({
      type,
      petType,
      description,
      location,
      contactInfo,
      image: image || `https://picsum.photos/seed/${Math.random()}/600/600`,
    });
    onClose();
    // Reset form
    setType('lost');
    setPetType('');
    setDescription('');
    setLocation('');
    setContactInfo('');
    setImage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Type Toggle */}
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                {(['lost', 'found'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all',
                      type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Image Upload Placeholder */}
              <div className="aspect-video w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <Camera size={32} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Upload Pet Photo</span>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    Pet Type
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Golden Retriever, Persian Cat"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details like collar color, name, behavior..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <MapPin size={10} /> Location
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Area, City"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <Phone size={10} /> Contact
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-4 rounded-2xl text-base font-bold shadow-lg shadow-indigo-200"
              >
                Post Now
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
