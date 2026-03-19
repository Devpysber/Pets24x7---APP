import React, { useState, useMemo, useCallback } from 'react';
import { useServices } from '../hooks/useServices';
import { ListingCard } from '../components/ListingCard';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../utils/theme';
import { motion, AnimatePresence } from 'motion/react';

const PET_TYPES = ['Dogs', 'Cats', 'Birds', 'Exotic'];

export const ExploreScreen: React.FC = () => {
  const { services, isLoading, error, refresh } = useServices();
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Top Rated');

  // Filter and Sort Logic
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedPetType) {
      result = result.filter(s => s.category.includes(selectedPetType));
    }

    // Sort: Premium first, then by rating
    result.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      
      if (sortBy === 'Top Rated') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return result;
  }, [services, searchQuery, sortBy, selectedPetType]);

  const toggleView = useCallback(() => {
    setViewType(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sticky Header Section */}
      <div className="sticky top-[60px] z-30 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex flex-col gap-3">
        {/* Search and Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-black/5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={toggleView}
            className="p-2 rounded-xl bg-white border border-black/5 shadow-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {viewType === 'grid' ? <List className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
          </button>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold whitespace-nowrap">
            <SlidersHorizontal className="h-3 w-3" />
            Filters
          </button>
          
          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          {PET_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedPetType(selectedPetType === type ? null : type)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all",
                selectedPetType === type 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                  : "bg-white border-black/5 text-gray-600"
              )}
            >
              {type}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-black/5 text-gray-600 text-xs font-medium whitespace-nowrap">
            {sortBy}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4">
        {isLoading ? (
          <LoadingSpinner message="Searching for services..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refresh} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {filteredServices.length} Results Found
              </span>
            </div>

            <motion.div 
              layout
              className={cn(
                "grid gap-4",
                viewType === 'grid' ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListingCard service={service} viewType={viewType} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredServices.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <p className="text-sm font-bold text-gray-900">No services found</p>
                <p className="text-xs text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}

            {filteredServices.length > 0 && (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="h-1 w-12 rounded-full bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  End of Results
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
