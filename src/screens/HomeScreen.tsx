import React, { useCallback } from 'react';
import { useServices } from '../hooks/useServices';
import { useAppStore } from '../store/useAppStore';
import { ListingCard } from '../components/ListingCard';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { Search, ShoppingBag, Stethoscope, Scissors, GraduationCap, Hotel, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: '1', name: 'Pet Shops', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { id: '2', name: 'Vet Clinics', icon: Stethoscope, color: 'bg-red-50 text-red-600' },
  { id: '3', name: 'Grooming', icon: Scissors, color: 'bg-emerald-50 text-emerald-600' },
  { id: '4', name: 'Trainers', icon: GraduationCap, color: 'bg-amber-50 text-amber-600' },
  { id: '5', name: 'Pet Hotels', icon: Hotel, color: 'bg-violet-50 text-violet-600' },
  { id: '6', name: 'Events', icon: Calendar, color: 'bg-pink-50 text-pink-600' },
];

export const HomeScreen: React.FC = () => {
  const { premiumServices, services, isLoading, error, refresh } = useServices();
  const { banners, location } = useAppStore();
  const navigate = useNavigate();

  const handleSeeAllFeatured = useCallback(() => {
    navigate('/explore');
  }, [navigate]);

  const handleSeeAllRecommended = useCallback(() => {
    navigate('/explore');
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Search Bar */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for vets, groomers, shops..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="px-4">
        <SectionHeader 
          title={`Pet Services near ${location}`} 
          showSeeAll={false}
          className="mb-3"
        />
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className={`h-14 w-14 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm border border-black/5`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner Section */}
      <section className="px-4">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar snap-x">
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-[300px] h-40 rounded-3xl overflow-hidden relative snap-center shadow-md">
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                <span className="text-white/80 text-xs font-medium">Limited time offer • Tap to view</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isLoading ? (
        <LoadingSpinner message="Finding the best services for you..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : (
        <>
          {/* Featured Listings Carousel */}
          {premiumServices.length > 0 && (
            <section className="px-4">
              <SectionHeader 
                title="Featured Premium Services" 
                subtitle="Top rated partners in your area"
                onSeeAll={handleSeeAllFeatured}
              />
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar snap-x">
                {premiumServices.map((service) => (
                  <div key={service.id} className="min-w-[260px] snap-center">
                    <ListingCard service={service} viewType="grid" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Listings */}
          {services.length > 0 && (
            <section className="px-4">
              <SectionHeader 
                title="Recommended for You" 
                onSeeAll={handleSeeAllRecommended}
              />
              <div className="flex flex-col gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListingCard service={service} viewType="list" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {services.length === 0 && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
              <p className="text-sm font-bold text-gray-900">No services found</p>
              <p className="text-xs text-gray-500">Try changing your location or search query.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
