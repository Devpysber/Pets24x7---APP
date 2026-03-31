import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useServices } from '../hooks/useServices';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ListingCard } from '../components/ListingCard';
import { InquiryModal } from '../components/InquiryModal';
import { PremiumBadge } from '../components/PremiumBadge';
import { ActionButtons } from '../components/ActionButtons';
import { LoadingSpinner, ErrorMessage } from '../components/Feedback';
import { Badge } from '../components/Badge';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { 
  PetService, 
  OperatingHours 
} from '../types';
import { 
  ChevronLeft, 
  ChevronRight,
  Star, 
  MapPin, 
  Navigation, 
  Share2, 
  Heart,
  CheckCircle2,
  Clock,
  Crown,
  Phone,
  MessageCircle,
  Twitter,
  X,
  Maximize2
} from 'lucide-react';
import { cn } from '../utils/theme';

import { leadsApi } from '../api/leads.api';

export const ServiceDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, services, toggleFavorite, isFavorite: checkFavorite, isLoading, error, refresh } = useServices();
  const { openInquiryModal, user } = useAppStore();
  
  const service = getServiceById(id || '');
  const isFavorite = checkFavorite(id || '');
  const similarServices = services.filter(s => s.id !== id && s.category === service?.category).slice(0, 3);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  const gallery = service?.gallery || (service?.image ? [service.image] : []);
  const captions = service?.galleryCaptions || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleShare = async () => {
    if (!service || isSharing) return;
    
    const shareData = {
      title: service.name,
      text: `Check out ${service.name} on PetConnect! ${service.description?.slice(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      setIsSharing(true);
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Fallback for browsers that don't support share API
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleWhatsAppShare = () => {
    if (!service) return;
    const text = `Check out ${service.name} on PetConnect! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTwitterShare = () => {
    if (!service) return;
    const text = `Check out ${service.name} on PetConnect!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCall = async () => {
    if (!service) return;
    
    // Create lead in background
    try {
      await leadsApi.createLead({
        vendorId: service.vendorId,
        listingId: service.id,
        actionType: 'CALL',
        message: `User clicked Call for ${service.name}`
      });
    } catch (err) {
      console.error('Failed to create call lead:', err);
    }

    openInquiryModal({ id: service.id, vendorId: service.vendorId, name: service.name, initialType: 'Call Request' });
    window.location.href = `tel:${service.phone}`;
  };

  const handleWhatsAppClick = async () => {
    if (!service) return;

    // Create lead in background
    try {
      await leadsApi.createLead({
        vendorId: service.vendorId,
        listingId: service.id,
        actionType: 'WHATSAPP',
        message: `User clicked WhatsApp for ${service.name}`
      });
    } catch (err) {
      console.error('Failed to create WhatsApp lead:', err);
    }

    window.open(`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`, '_blank');
  };

  const isCurrentlyOpen = useCallback(() => {
    if (!service?.operatingHours) return true;
    
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()] as keyof OperatingHours;
    const hours = service.operatingHours[currentDay];
    
    if (hours.closed) return false;
    
    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseTime(hours.open);
    const closeTime = parseTime(hours.close);
    
    return currentTime >= openTime && currentTime <= closeTime;
  }, [service]);

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
      <div className={cn(
        "relative h-80 w-full overflow-hidden bg-gray-900",
        service.isPremium && "ring-4 ring-amber-400 ring-inset"
      )}>
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            src={gallery[currentImageIndex]} 
            alt={`${service.name} - ${currentImageIndex + 1}`} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover cursor-grab active:cursor-grabbing"
            referrerPolicy="no-referrer"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) prevImage();
              else if (info.offset.x < -100) nextImage();
            }}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleWhatsAppShare}
              className={cn(
                "h-10 w-10 rounded-full backdrop-blur-md flex items-center justify-center text-white border transition-transform active:scale-90",
                service.whatsapp 
                  ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20" 
                  : "bg-black/20 border-white/20"
              )}
              title="Share on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button 
              onClick={handleTwitterShare}
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform active:scale-90"
              title="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </button>
            <button 
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform active:scale-90"
              title="More Share Options"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => toggleFavorite(service.id)}
              className={cn(
                "h-10 w-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all",
                isFavorite 
                  ? "bg-rose-500 text-white border-rose-500" 
                  : "bg-black/20 text-white border-white/20"
              )}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Gallery Navigation */}
        {gallery.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {gallery.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Floating Badges */}
        <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-2 z-10">
          {service.isPremium && (
            <div className="flex items-center gap-2">
              <PremiumBadge size="md" className="w-fit" />
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm">Verified Partner</Badge>
            </div>
          )}
          <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{service.name}</h1>
          <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
            <MapPin className="h-3 w-3" />
            <span>{service.location}</span>
          </div>
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
            <Clock className={cn("h-4 w-4", isCurrentlyOpen() ? "text-emerald-600" : "text-rose-600")} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              isCurrentlyOpen() ? "text-emerald-600" : "text-rose-600"
            )}>
              {isCurrentlyOpen() ? 'Open Now' : 'Closed Now'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">2.4 KM</span>
          </div>
        </div>

        {/* Description */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">About Business</h2>
            {service.isPremium && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse-slow">
                <Crown size={10} className="fill-current" />
                Premium Partner
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {service.description} We provide top-notch care for your beloved pets. Our team of professionals is dedicated to ensuring the comfort and safety of every animal that visits us.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            {service.phone && (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleCall}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 transition-all"
              >
                <Phone className="h-5 w-5 fill-current" />
                <span className="text-sm">Call Now</span>
              </motion.button>
            )}
            {service.whatsapp && (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-100 transition-all"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span className="text-sm">WhatsApp</span>
              </motion.button>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Gallery</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setGalleryIndex(prev => (prev - 1 + gallery.length) % gallery.length)}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setGalleryIndex(prev => (prev + 1) % gallery.length)}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
              <div className="relative aspect-video">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={galleryIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 cursor-zoom-in"
                    onClick={() => setZoomedImage(gallery[galleryIndex])}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 50) setGalleryIndex(prev => (prev - 1 + gallery.length) % gallery.length);
                      else if (info.offset.x < -50) setGalleryIndex(prev => (prev + 1) % gallery.length);
                    }}
                  >
                    <img 
                      src={gallery[galleryIndex]} 
                      alt={`${service.name} gallery ${galleryIndex + 1}`} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Maximize2 className="text-white h-8 w-8 drop-shadow-lg" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Caption */}
              {captions[galleryIndex] && (
                <div className="px-4 py-3 bg-white border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 italic">
                    {captions[galleryIndex]}
                  </p>
                </div>
              )}

              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === galleryIndex ? "w-4 bg-indigo-600" : "w-1.5 bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-3 text-center font-medium uppercase tracking-widest">
              Swipe or use arrows to explore {gallery.length} images
            </p>
          </section>
        )}

        {/* Zoomed Image Overlay */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 overflow-hidden"
              onClick={() => setZoomedImage(null)}
            >
              <button 
                className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 z-[110]"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(null);
                }}
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="relative w-full h-full flex items-center justify-center overflow-auto scrollbar-hide">
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileTap={{ scale: 1.5 }}
                  src={zoomedImage} 
                  alt="Zoomed view"
                  className="max-w-full max-h-full object-contain rounded-lg cursor-zoom-in transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/60 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                  Tap and hold to zoom
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Us Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
            <div className="h-px bg-gray-100 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {service.phone && (
              <button 
                onClick={handleCall}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-[0.98] group"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-gray-900">Call Now</span>
              </button>
            )}
            
            {service.whatsapp && (
              <button 
                onClick={handleWhatsAppClick}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 transition-all active:scale-[0.98] group"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-gray-900">WhatsApp</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleWhatsAppShare}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-colors border",
                service.whatsapp
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </button>
            <button 
              onClick={handleTwitterShare}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-100 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </button>
            <button 
              onClick={handleShare}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors"
              title="More Share Options"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
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

        {/* Why Choose Us? Section */}
        <WhyChooseUs 
          serviceName={service.name} 
          category={service.category} 
          description={service.description} 
        />

        {/* Operating Hours */}
        {service.operatingHours && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Operating Hours</h2>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                isCurrentlyOpen() ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                <div className={cn("h-1.5 w-1.5 rounded-full", isCurrentlyOpen() ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                {isCurrentlyOpen() ? 'Open Now' : 'Closed Now'}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Current Day Summary (Always Visible) */}
              {!isHoursExpanded && (
                <div className="flex items-center justify-between px-4 py-4 bg-indigo-50/30">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-indigo-600 capitalize">
                      {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()]}
                    </span>
                    <span className="text-[8px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Today</span>
                  </div>
                  {(() => {
                    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    const today = days[new Date().getDay()] as keyof OperatingHours;
                    const hours = service.operatingHours[today];
                    return hours.closed ? (
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Closed</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-700">{hours.open}</span>
                        <span className="text-gray-300">—</span>
                        <span className="text-xs font-bold text-gray-700">{hours.close}</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              <AnimatePresence initial={false}>
                {isHoursExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {(Object.entries(service.operatingHours) as [keyof typeof service.operatingHours, any][]).map(([day, hours], idx) => {
                      const now = new Date();
                      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                      const isToday = days[now.getDay()] === day;
                      
                      return (
                        <div 
                          key={day} 
                          className={cn(
                            "flex items-center justify-between px-4 py-4 border-b border-gray-50 last:border-0",
                            isToday && "bg-indigo-50/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-sm font-bold capitalize",
                              isToday ? "text-indigo-600" : "text-gray-700"
                            )}>
                              {day}
                            </span>
                            {isToday && <span className="text-[8px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Today</span>}
                          </div>
                          
                          {hours.closed ? (
                            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Closed</span>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-700">{hours.open}</span>
                              <span className="text-gray-300">—</span>
                              <span className="text-xs font-bold text-gray-700">{hours.close}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => setIsHoursExpanded(!isHoursExpanded)}
                className="w-full py-3 bg-gray-50 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:bg-gray-100 transition-colors border-t border-gray-100"
              >
                {isHoursExpanded ? 'Show Less' : 'See Full Hours'}
                <motion.div animate={{ rotate: isHoursExpanded ? 180 : 0 }}>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </motion.div>
              </button>
            </div>
          </section>
        )}

        {/* Location Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Location</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-600 p-0 h-auto"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.location)}`, '_blank')}
            >
              Open in Maps
            </Button>
          </div>
          <Card className="p-0 overflow-hidden border border-black/5">
            <div 
              className="h-40 bg-gray-200 relative cursor-pointer"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.location)}`, '_blank')}
            >
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
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-bold text-gray-500 border border-black/5 uppercase tracking-tighter">
                Tap to expand
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-gray-900">User Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.floor(service.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-600">{service.rating} ({service.reviewCount} reviews)</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-indigo-600 border-indigo-100 bg-indigo-50/50"
              onClick={() => alert('Review feature coming soon!')}
            >
              Write a Review
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { name: 'Rahul Sharma', rating: 5, date: '2 days ago', comment: 'Absolutely amazing service! My dog was so happy and looked great after the grooming session. Highly recommend to everyone.' },
              { name: 'Priya Patel', rating: 4, date: '1 week ago', comment: 'Very professional staff and clean facilities. A bit on the expensive side but worth it for the quality of care provided.' },
              { name: 'Amit Verma', rating: 5, date: '2 weeks ago', comment: 'The best pet shop in the area. They have everything you need and the staff is very knowledgeable about different breeds.' },
              { name: 'Suresh Raina', rating: 5, date: '3 weeks ago', comment: 'Great experience! The trainers are very patient and my pet learned a lot in just a few sessions.' },
              { name: 'Deepika Padukone', rating: 4, date: '1 month ago', comment: 'Good service, but the waiting time was a bit long. Overall satisfied.' }
            ].slice(0, showAllReviews ? undefined : 2).map((review, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{review.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-white px-2 py-1 rounded-lg border border-black/5 shadow-sm">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-gray-700">{review.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-600 font-bold text-xs w-full py-3 bg-gray-50/50"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Show Less' : `View All ${service.reviewCount} Reviews`}
            </Button>
          </div>
        </section>

        {/* Similar Listings */}
        {similarServices.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Similar Listings</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Based on {service.category}</span>
            </div>
            <div className="flex flex-col gap-4">
              {similarServices.map((s) => (
                <ListingCard key={s.id} service={s} viewType="list" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Call Button */}
      <motion.button
        onClick={handleCall}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 right-6 z-[60] h-16 w-16 rounded-full bg-indigo-600 text-white shadow-2xl flex items-center justify-center border-4 border-white group"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20 group-hover:hidden" />
        <Phone className="h-7 w-7 fill-current" />
        <div className="absolute -top-10 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call Provider
        </div>
      </motion.button>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/5 px-4 py-4 backdrop-blur-xl bg-white/90 pb-safe">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <div className="flex gap-2">
            <ActionButtons 
              serviceId={service.id}
              vendorId={service.vendorId}
              serviceName={service.name}
              serviceImage={service.image}
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
            onClick={() => openInquiryModal({ id: service.id, vendorId: service.vendorId, name: service.name })}
            className="flex-1 h-12 bg-indigo-600 shadow-lg shadow-indigo-100 font-bold"
          >
            Send Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};
