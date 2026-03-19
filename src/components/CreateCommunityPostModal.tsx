import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Send, Smile, MapPin, Globe } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import { cn } from '../utils/theme';

interface CreateCommunityPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommunityPostModal: React.FC<CreateCommunityPostModalProps> = ({ isOpen, onClose }) => {
  const { addCommunityPost, user } = useAppStore();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Tips' | 'Adoption' | 'Stories'>('Tips');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      addCommunityPost({
        content,
        category,
        image: image || undefined,
      });
      setIsLoading(false);
      setContent('');
      setImage('');
      onClose();
    }, 1000);
  };

  const categories: ('Tips' | 'Adoption' | 'Stories')[] = ['Tips', 'Adoption', 'Stories'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={user?.avatar || 'https://picsum.photos/seed/guest/100/100'} 
                    alt="Your avatar" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{user?.name || 'Guest User'}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Globe size={10} />
                    <span>Public</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Category</label>
                  <div className="flex gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          category === cat 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                            : "bg-gray-50 text-gray-500 border-black/5"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea 
                    required
                    rows={4}
                    placeholder="What's on your mind? Share tips, stories, or adoption alerts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Image URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Paste image URL here..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="flex items-center gap-4 text-gray-400">
                    <button type="button" className="hover:text-indigo-600 transition-colors">
                      <ImageIcon size={20} />
                    </button>
                    <button type="button" className="hover:text-indigo-600 transition-colors">
                      <Smile size={20} />
                    </button>
                    <button type="button" className="hover:text-indigo-600 transition-colors">
                      <MapPin size={20} />
                    </button>
                  </div>
                  <Button 
                    type="submit" 
                    className="h-12 px-8 bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
                    disabled={isLoading || !content.trim()}
                  >
                    {isLoading ? 'Posting...' : 'Post Now'}
                    {!isLoading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
