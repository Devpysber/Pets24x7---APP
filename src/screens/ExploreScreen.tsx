import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingsApi } from '../api/listings.api';
import { ListingCard } from '../components/ListingCard';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { ListingSkeleton } from '../components/Skeleton';
import { NoResultsState } from '../components/EmptyState';
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronDown, MapPin, Dog, Star } from 'lucide-react';
import { cn } from '../utils/theme';
import { motion, AnimatePresence } from 'motion/react';
import { FlatList } from '../components/FlatList';
import { PetService } from '../types';

const SERVICE_CATEGORIES = ['Pet Shops', 'Vet Clinics', 'Grooming', 'Trainers', 'Pet Hotels', 'Daycare', 'Events', 'Boarding', 'Walking'];
const PET_TYPES = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish', 'Reptiles'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];
const ITEMS_PER_PAGE = 10;

export const ExploreScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<PetService[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'Top Rated' | 'Most Booked' | 'Distance' | 'Newest'>('Top Rated');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        petType: selectedPetType || undefined,
        city: selectedCity || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy: sortBy === 'Top Rated' ? 'rating' : sortBy === 'Distance' ? 'nearest' : sortBy,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        limit: 100 // Fetch more for local pagination if needed, or just use backend pagination
      };

      const response = await listingsApi.getListings(params);
      setServices(response.listings);
      setTotalResults(response.total);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedPetType, selectedCity, minRating, sortBy, userLocation]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchResults();
      // Update URL params
      const newParams: any = {};
      if (searchQuery) newParams.search = searchQuery;
      if (selectedCategory) newParams.category = selectedCategory;
      setSearchParams(newParams, { replace: true });
    }, 500);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [fetchResults, searchQuery, selectedCategory, setSearchParams]);

  // Get user location for distance sorting
  useEffect(() => {
    if (sortBy === 'Distance' && !userLocation && locationStatus === 'idle') {
      requestLocation();
    }
  }, [sortBy, userLocation, locationStatus, requestLocation]);

  const handleLoadMore = useCallback(() => {
    if (visibleCount < services.length) {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [visibleCount, services.length]);

  const visibleServices = useMemo(() => {
    return services.slice(0, visibleCount);
  }, [services, visibleCount]);

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
          {/* Category Filter */}
          <div className="relative group flex-shrink-0">
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
              selectedCategory ? "bg-indigo-600 text-white" : "bg-white border border-black/5 text-gray-600"
            )}>
              <SlidersHorizontal className="h-3 w-3" />
              {selectedCategory || 'Categories'}
            </button>
            <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {SERVICE_CATEGORIES.map(category => (
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
              </div>
            </div>
          </div>

          {/* Pet Type Filter */}
          <div className="relative group flex-shrink-0">
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
              selectedPetType ? "bg-indigo-600 text-white" : "bg-white border border-black/5 text-gray-600"
            )}>
              <Dog className="h-3 w-3" />
              {selectedPetType || 'Pet Type'}
            </button>
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
              <div className="flex flex-wrap gap-1.5">
                {PET_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedPetType(selectedPetType === type ? null : type)}
                    className={cn(
                      "px-2 py-1 rounded-md border text-[10px] font-medium transition-all",
                      selectedPetType === type 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                        : "bg-white border-black/5 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* City Filter */}
          <div className="relative group flex-shrink-0">
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
              selectedCity ? "bg-indigo-600 text-white" : "bg-white border border-black/5 text-gray-600"
            )}>
              <MapPin className="h-3 w-3" />
              {selectedCity || 'City'}
            </button>
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
              <div className="flex flex-wrap gap-1.5">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                    className={cn(
                      "px-2 py-1 rounded-md border text-[10px] font-medium transition-all",
                      selectedCity === city 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                        : "bg-white border-black/5 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="relative group flex-shrink-0">
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
              minRating > 0 ? "bg-indigo-600 text-white" : "bg-white border border-black/5 text-gray-600"
            )}>
              <Star className="h-3 w-3" />
              {minRating > 0 ? `${minRating}+ Stars` : 'Rating'}
            </button>
            <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3">
              <div className="flex flex-col gap-1">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-[10px] font-medium transition-all",
                      minRating === rating 
                        ? "bg-indigo-50 text-indigo-600" 
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    {rating}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          <button
            onClick={() => {
              if (sortBy === 'Distance') {
                setSortBy('Top Rated');
              } else {
                if (locationStatus === 'denied') {
                  requestLocation();
                } else if (!userLocation) {
                  requestLocation();
                  setSortBy('Distance');
                } else {
                  setSortBy('Distance');
                }
              }
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
              sortBy === 'Distance'
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
            Nearby
          </button>

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          {(selectedCategory || selectedPetType || selectedCity || minRating > 0 || sortBy === 'Distance') && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedPetType(null);
                setSelectedCity(null);
                setMinRating(0);
                setSortBy('Top Rated');
              }}
              className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-bold whitespace-nowrap hover:bg-red-100 transition-colors"
            >
              Clear All
            </button>
          )}

          <div className="h-4 w-[1px] bg-gray-200 flex-shrink-0" />

          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-black/5 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
              Sort: {sortBy}
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {(['Top Rated', 'Most Booked', 'Distance', 'Newest'] as const).map(option => (
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
          {locationStatus === 'denied' && sortBy === 'Distance' && (
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
          <ErrorMessage message={error} onRetry={fetchResults} />
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
                  {totalResults} Results Found
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
                  {visibleCount < services.length ? (
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
