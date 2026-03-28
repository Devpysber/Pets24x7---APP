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
  const { communityPosts, user, isLoading } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<CommunityCategory>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = communityPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: CommunityCategory[] = ['All', 'Tips', 'Adoption', 'Stories'];

  const getCategoryCount = (cat: CommunityCategory) => {
    if (cat === 'All') return communityPosts.length;
    return communityPosts.filter(p => p.category === cat).length;
  };

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
              className="w-full pl-12 pr-12 py-3 rounded-2xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            )}
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
                "px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2",
                activeCategory === cat 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-gray-50 text-gray-500 border-black/5"
              )}
            >
              {cat}
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[10px]",
                activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
              )}>
                {getCategoryCount(cat)}
              </span>
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
          {['Puppy Training', 'Summer Care', 'Rescue Stories', 'Pet Health'].map((tag, i) => (
            <motion.button 
              key={i} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery(tag)}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-2xl border transition-all flex items-center gap-2",
                searchQuery === tag 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                  : "bg-white border-black/5 text-gray-700 shadow-sm hover:bg-gray-50"
              )}
            >
              <span className={cn("text-xs font-bold", searchQuery === tag ? "text-white/80" : "text-indigo-600")}>#</span>
              <span className="text-xs font-bold">{tag}</span>
            </motion.button>
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
