import { useMemo, useCallback, useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PetService } from '../types';
import { listingsApi } from '../api/listings.api';

export const useServices = () => {
  const { services, setServices, favorites, toggleFavorite } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listingsApi.getListings();
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setServices]);

  // Initial fetch
  useEffect(() => {
    if (services.length === 0) {
      fetchServices();
    }
  }, [fetchServices, services.length]);

  const premiumServices = useMemo(() => 
    services.filter(s => s.isPremium), 
    [services]
  );

  const regularServices = useMemo(() => 
    services.filter(s => !s.isPremium), 
    [services]
  );

  const getServicesByCategory = useCallback((category: string) => {
    return services.filter(s => s.category === category);
  }, [services]);

  const getServiceById = useCallback((id: string) => {
    return services.find(s => s.id === id);
  }, [services]);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return {
    services,
    premiumServices,
    regularServices,
    getServicesByCategory,
    getServiceById,
    isFavorite,
    toggleFavorite,
    isLoading,
    error,
    refresh: fetchServices
  };
};
