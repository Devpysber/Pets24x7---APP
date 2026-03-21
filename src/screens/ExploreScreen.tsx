import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useServices } from '../hooks/useServices';
import { ListingCard } from '../components/ListingCard';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { ListingSkeleton } from '../components/Skeleton';
import { NoResultsState } from '../components/EmptyState';
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '../utils/theme';
import { motion, AnimatePresence } from 'motion/react';
import { FlatList } from '../components/FlatList';
import { PetService } from '../types';

const SERVICE_CATEGORIES = ['Pet Shops', 'Vet Clinics', 'Grooming', 'Trainers', 'Pet Hotels', 'Daycare', 'Events', 'Boarding', 'Walking'];
const ITEMS_PER_PAGE = 6;

export const ExploreScreen: React.FC = () => {
  const { services, isLoading, error, refresh } = useServices();
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'Top Rated' | 'Most Booked' | 'Price: Low to High' | 'Distance'>('Top Rated');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const requestLocation = useCallback(() => {
    if (locationStatus === 'requesting') return;
    
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [locationStatus]);

  // Get user location for distance sorting
  useEffect(() => {
    if ((sortBy === 'Distance' || maxDistance === 5) && !userLocation && locationStatus === 'idle') {
      requestLocation();
    }
  }, [sortBy, maxDistance, userLocation, locationStatus, requestLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and Sort Logic
  const filteredServices = useMemo(() => {
    let result = services.filter(s => s.isVerified);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Price filter
    if (minPrice > 0 || maxPrice < 5000) {
      result = result.filter(s => {
        const price = parseInt(s.price?.replace(/[^0-9]/g, '') || '0');
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Distance filter (5km radius)
    if (maxDistance && userLocation) {
      result = result.filter(s => {
        if (!s.coordinates) return false;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, s.coordinates.lat, s.coordinates.lng);
        return dist <= maxDistance;
      });
    }

    // Sort: Premium first, then by selected criteria
    result.sort((a, b) => {
      // Premium always first
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      
      if (sortBy === 'Top Rated') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'Most Booked') {
        if (a.isMostBooked && !b.isMostBooked) return -1;
        if (!a.isMostBooked && b.isMostBooked) return 1;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'Price: Low to High') {
        const priceA = parseInt(a.price?.replace(/[^0-9]/g, '') || '0');
        const priceB = parseInt(b.price?.replace(/[^0-9]/g, '') || '0');
        return priceA - priceB;
      }
      if (sortBy === 'Distance' && userLocation) {
        if (!a.coordinates || !b.coordinates) return 0;
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      }
      return 0;
    });

    return result;
  }, [services, searchQuery, sortBy, selectedCategory, userLocation]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return SERVICE_CATEGORIES;
    return SERVICE_CATEGORIES.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount);
  }, [filteredServices, visibleCount]);

  const handleLoadMore = useCallback(() => {
    if (visibleCount < filteredServices.length) {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [visibleCount, filteredServices.length]);

  const toggleView = useCallback(() => {
    setViewType(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  const renderItem = useCallback((service: PetService, index: number) => {
    const isFirstNormal = !service.isPremium && (index === 0 || visibleServices[index - 1]?.isPremium);
    
    return (
      <div className="p-2">
        {isFirstNormal && visibleServices.some(s => s.isPremium) && (
          <div className={cn(
            "py-4 flex items-center gap-4",
            viewType === 'grid' ? "mt-2" : "mt-4"
          )}>
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">All Results</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>
        )}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ListingCard service={service} viewType={viewType} />
        </motion.div>
      </div>
    );
  }, [viewType, visibleServices]);

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
          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold whitespace-nowrap">
              <SlidersHorizontal className="h-3 w-3" />
              Categories
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-7 pr-3 py-1.5 text-[10px] rounded-lg border border-black/5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {filteredCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={cn(
                      "px-2 py-1 rounded-md border text-[10px] font-medium transition-all",
                      selectedCategory === category 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                        : "bg-white border-black/5 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
                {filteredCategories.length === 0 && (
                  <span className="text-[10px] text-gray-400 w-full text-center py-2">No categories found</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          {SERVICE_CATEGORIES.slice(0, 3).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all",
                selectedCategory === category 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                  : "bg-white border-black/5 text-gray-600"
              )}
            >
              {category}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          <button
            onClick={() => {
              if (maxDistance) {
                setMaxDistance(null);
              } else {
                if (locationStatus === 'denied') {
                  // Re-request or show message
                  requestLocation();
                } else if (!userLocation) {
                  requestLocation();
                  setMaxDistance(5);
                } else {
                  setMaxDistance(5);
                }
              }
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
              maxDistance === 5
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-white border-black/5 text-gray-600"
            )}
          >
            {locationStatus === 'requesting' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full"
              />
            )}
            Nearby (&lt; 5km)
          </button>

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          {(selectedCategory || minPrice > 0 || maxPrice < 5000 || maxDistance) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setMinPrice(0);
                setMaxPrice(5000);
                setMaxDistance(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-bold whitespace-nowrap hover:bg-red-100 transition-colors"
            >
              Clear All
            </button>
          )}

          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/5 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
              Price: ₹{minPrice} - ₹{maxPrice === 5000 ? '5000+' : maxPrice}
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Min Price: ₹{minPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={minPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMinPrice(Math.min(val, maxPrice));
                    }}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Max Price: ₹{maxPrice === 5000 ? 'Any' : maxPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMaxPrice(Math.max(val, minPrice));
                    }}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[8px] text-gray-400 font-bold">
                <span>₹0</span>
                <span>₹5000+</span>
              </div>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-black/5 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
              {sortBy}
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {(['Top Rated', 'Most Booked', 'Price: Low to High', 'Distance'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors",
                    sortBy === option ? "text-indigo-600 bg-indigo-50/50" : "text-gray-600"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="p-2">
        <AnimatePresence>
          {locationStatus === 'denied' && maxDistance === 5 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-2 mb-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-red-600">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="text-xs font-bold">Location Permission Required</span>
              </div>
              <p className="text-[10px] text-red-500 leading-relaxed">
                To show services near you, we need access to your location. Please enable location permissions in your browser settings and try again.
              </p>
              <button 
                onClick={requestLocation}
                className="text-[10px] font-bold text-red-600 underline text-left hover:text-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className={cn(
            "grid gap-4 p-2",
            viewType === 'grid' ? "grid-cols-2" : "grid-cols-1"
          )}>
            {[1, 2].map(i => (
              <ListingSkeleton key={`premium-${i}`} viewType={viewType} isPremium={true} />
            ))}
            {[1, 2, 3, 4].map(i => (
              <ListingSkeleton key={`normal-${i}`} viewType={viewType} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={refresh} />
        ) : (
          <FlatList
            data={visibleServices}
            renderItem={renderItem}
            numColumns={viewType === 'grid' ? 2 : 1}
            columnWrapperClassName={cn(
              "grid gap-0",
              viewType === 'grid' ? "grid-cols-2" : "grid-cols-1"
            )}
            onEndReached={handleLoadMore}
            ListHeaderComponent={
              <div className="flex items-center justify-between p-2 mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {filteredServices.length} Results Found
                </span>
              </div>
            }
            ListEmptyComponent={
              <NoResultsState 
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }} 
              />
            }
            ListFooterComponent={
              visibleServices.length > 0 && (
                <div className="py-8 flex flex-col items-center gap-3">
                  {visibleCount < filteredServices.length ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <div className="h-1 w-12 rounded-full bg-gray-200" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        End of Results
                      </span>
                    </>
                  )}
                </div>
              )
            }
          />
        )}
      </div>
    </div>
  );
};
