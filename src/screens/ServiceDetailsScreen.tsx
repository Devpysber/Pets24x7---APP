import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ListingCard } from '../components/ListingCard';
import { InquiryModal } from '../components/InquiryModal';
import { PremiumBadge } from '../components/PremiumBadge';
import { ActionButtons } from '../components/ActionButtons';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Navigation, 
  Share2, 
  Heart,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../utils/theme';

export const ServiceDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, services, toggleFavorite, isFavorite: checkFavorite, isLoading, error, refresh } = useServices();
  const { addInquiry } = useAppStore();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  
  const service = getServiceById(id || '');
  const isFavorite = checkFavorite(id || '');
  const similarServices = services.filter(s => s.id !== id && s.category === service?.category).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleInquirySubmit = useCallback((inquiryData: { name: string; phone: string; requirement: string }) => {
    if (!service) return;
    addInquiry({
      serviceId: service.id,
      serviceName: service.name,
      serviceImage: service.image,
      userName: inquiryData.name,
      userPhone: inquiryData.phone,
      message: inquiryData.requirement
    });
    setIsInquiryOpen(false);
  }, [service, addInquiry]);

  if (isLoading) {
    return <div className="pt-20"><LoadingSpinner message="Loading service details..." /></div>;
  }

  if (error) {
    return <div className="pt-20"><ErrorMessage message={error} onRetry={refresh} /></div>;
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Hero Image Gallery */}
      <div className="relative h-72 w-full overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => toggleFavorite(service.id)}
              className={cn(
                "h-10 w-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all",
                isFavorite 
                  ? "bg-rose-500 text-white border-rose-500" 
                  : "bg-white/20 text-white border-white/20"
              )}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          {service.isPremium && (
            <PremiumBadge size="md" className="w-fit" />
          )}
          <h1 className="text-2xl font-bold text-white leading-tight">{service.name}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-6 flex flex-col gap-8">
        {/* Quick Stats */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-black/5">
          <div className="flex flex-col items-center gap-1 border-r border-gray-200 flex-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="text-base font-bold text-gray-900">{service.rating}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{service.reviewCount} Reviews</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-gray-200 flex-1">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Open Now</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">2.4 KM</span>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">About Business</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {service.description} We provide top-notch care for your beloved pets. Our team of professionals is dedicated to ensuring the comfort and safety of every animal that visits us.
          </p>
        </section>

        {/* Services Offered */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h2>
          <div className="grid grid-cols-2 gap-3">
            {['Expert Consultation', 'Emergency Care', 'Home Visits', 'Pet Pharmacy', 'Lab Tests', 'Vaccination'].map((item) => (
              <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Location</h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 p-0 h-auto">
              Open in Maps
            </Button>
          </div>
          <Card className="p-0 overflow-hidden border border-black/5">
            <div className="h-40 bg-gray-200 relative">
              <img 
                src={`https://picsum.photos/seed/${service.id}map/600/300`} 
                alt="Map" 
                className="h-full w-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl animate-bounce">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
          </Card>
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 p-0 h-auto">
              Write a Review
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">User {i}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Excellent service! The staff was very friendly and took great care of my dog. Highly recommended for all pet owners in the area.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Listings */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Listings</h2>
          <div className="flex flex-col gap-4">
            {similarServices.map((s) => (
              <ListingCard key={s.id} service={s} viewType="list" />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/5 px-4 py-4 backdrop-blur-xl bg-white/90 pb-safe">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <div className="flex gap-2">
            <ActionButtons 
              phone={service.phone} 
              whatsapp={service.whatsapp} 
              size="lg"
              showInquiry={false}
            />
            <Button variant="secondary" className="h-12 w-12 p-0 bg-blue-50 text-blue-600 border border-blue-100">
              <Navigation className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            onClick={() => setIsInquiryOpen(true)}
            className="flex-1 h-12 bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
          >
            Send Inquiry
          </Button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        serviceName={service.name} 
        onSubmit={handleInquirySubmit}
      />
    </div>
  );
};
