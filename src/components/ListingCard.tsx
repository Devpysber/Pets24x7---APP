import React, { memo, useCallback, useMemo } from 'react';
import { PetService } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Star, MapPin, Heart, Zap, Award, TrendingUp } from 'lucide-react';
import { cn } from '../utils/theme';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PremiumBadge } from './PremiumBadge';
import { ActionButtons } from './ActionButtons';

interface ListingCardProps {
  service: PetService;
  viewType: 'grid' | 'list';
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = memo(({ service, viewType, className }) => {
  const isGrid = viewType === 'grid';
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = useMemo(() => favorites.includes(service.id), [favorites, service.id]);

  const handleDetails = useCallback(() => {
    navigate(`/service/${service.id}`);
  }, [navigate, service.id]);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(service.id);
  }, [toggleFavorite, service.id]);

  return (
    <Card 
      onClick={handleDetails}
      className={cn(
        'flex transition-all duration-500 cursor-pointer active:scale-[0.98] relative overflow-hidden group',
        isGrid ? 'flex-col' : 'flex-row p-3 gap-4',
        service.isPremium 
          ? 'border-2 border-amber-400 shadow-[0_10px_30px_rgba(251,191,36,0.15)] ring-1 ring-amber-200 bg-gradient-to-br from-white to-amber-50/30 scale-[1.02] z-10' 
          : 'border border-black/5 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5',
        className
      )}
    >
      {service.isPremium && (
        <>
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/30 transition-colors" />
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Animated Glow Border */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0 bg-[length:200%_100%] animate-shimmer pointer-events-none opacity-50" />
        </>
      )}
      
      <div className={cn(
        'relative overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-105',
        isGrid 
          ? (service.isPremium ? 'h-48 w-full' : 'h-40 w-full') 
          : (service.isPremium ? 'h-32 w-32 rounded-2xl' : 'h-28 w-28 rounded-xl')
      )}>
        <img 
          src={service.image} 
          alt={service.name} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {service.isPremium && <PremiumBadge />}
          {service.isTopRated && (
            <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-lg shadow-emerald-500/20 animate-pulse">
              <Award className="h-2.5 w-2.5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Top Rated</span>
            </div>
          )}
          {service.isMostBooked && (
            <div className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-lg shadow-indigo-600/20">
              <TrendingUp className="h-2.5 w-2.5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Most Booked</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
            <span className="text-[9px] font-bold text-gray-900">{service.rating}</span>
          </div>
          <button 
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm",
              isFavorite ? "bg-rose-500 text-white" : "bg-white/90 text-gray-400"
            )}
          >
            <Heart size={12} className={cn(isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      <div className={cn(
        'flex flex-col flex-1 justify-between',
        isGrid ? 'p-3' : 'py-0.5'
      )}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">{service.category}</span>
            {!isGrid && <span className="text-[9px] text-gray-400">({service.reviewCount} reviews)</span>}
          </div>
          <h3 className={cn(
            'font-bold text-gray-900 leading-tight mb-1',
            isGrid ? 'text-sm line-clamp-1' : 'text-base'
          )}>
            {service.name}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{service.location}</span>
          </div>
        </div>

        <ActionButtons 
          serviceId={service.id}
          serviceName={service.name}
          serviceImage={service.image}
          phone={service.phone} 
          whatsapp={service.whatsapp} 
          size={isGrid ? 'sm' : 'md'}
          showInquiry={true}
          className="mt-1"
        />
      </div>
    </Card>
  );
});

ListingCard.displayName = 'ListingCard';
