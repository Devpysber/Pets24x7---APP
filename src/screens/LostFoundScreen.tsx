import React, { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useLostFound } from '../hooks/useLostFound';
import { LostFoundPostCard } from '../components/LostFoundPostCard';
import { CreateLostFoundPostModal } from '../components/CreateLostFoundPostModal';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { cn } from '../utils/theme';
import { motion, AnimatePresence } from 'motion/react';

export const LostFoundScreen: React.FC = () => {
  const { posts, isLoading, error, refresh } = useLostFound();
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((post) => post.type === filter);
  }, [posts, filter]);

  return (
    <div className="relative min-h-screen pb-24 bg-gray-50">
      {/* Sticky Header with Filters */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex p-1 bg-gray-100 rounded-xl flex-1 max-w-xs">
            {(['all', 'lost', 'found'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all',
                  filter === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
                )}
              >
                {type}
              </button>
            ))}
          </div>
          <button className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-xl mx-auto">
        {isLoading ? (
          <LoadingSpinner message="Fetching latest posts..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refresh} />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              <div className="flex flex-col">
                {filteredPosts.map((post) => (
                  <LostFoundPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No posts yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to post a lost or found pet in your area.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-colors"
      >
        <Plus size={28} />
      </motion.button>

      {/* Create Post Modal */}
      <CreateLostFoundPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
