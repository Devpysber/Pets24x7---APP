import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CommunityPostCard } from '../components/CommunityPostCard';
import { CreateCommunityPostModal } from '../components/CreateCommunityPostModal';
import { Button } from '../components/Button';
import { Skeleton, PostSkeleton } from '../components/Skeleton';
import { EmptyState, NoPostsState } from '../components/EmptyState';
import { Plus, Search, Filter, MessageSquare, Heart, Share2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/theme';

type CommunityCategory = 'All' | 'Tips' | 'Adoption' | 'Stories';

export const CommunityScreen: React.FC = () => {
  const { communityPosts, user } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<CommunityCategory>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = communityPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: CommunityCategory[] = ['All', 'Tips', 'Adoption', 'Stories'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header & Search */}
      <section className="bg-white px-4 pt-4 pb-6 border-b border-black/5 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search posts, tips, stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center text-gray-500">
            <Filter size={20} />
          </button>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="px-4 py-4 bg-white border-b border-black/5 overflow-x-auto no-scrollbar">
        <div className="flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-gray-50 text-gray-500 border-black/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section (Optional/Retention) */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Trending Today</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {['Puppy Training', 'Summer Care', 'Rescue Stories'].map((tag, i) => (
            <div key={i} className="flex-shrink-0 px-4 py-3 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600">#</span>
              <span className="text-xs font-bold text-gray-700">{tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="px-4">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CommunityPostCard post={post} />
                </motion.div>
              ))
            ) : (
              <NoPostsState onAction={() => setIsCreateModalOpen(true)} />
            )}
          </AnimatePresence>
        )}
      </section>

      {/* Create Post Modal */}
      <CreateCommunityPostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};
