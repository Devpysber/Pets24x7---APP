import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// Haversine formula to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      city, 
      isPremium, 
      search, 
      petType, 
      minRating, 
      lat, 
      lng, 
      sortBy,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    // Category filter
    if (category) {
      const categoryMap: Record<string, any> = {
        'Pet Shops': 'PET_SHOP',
        'Vet Clinics': 'VET_CLINIC',
        'Grooming': 'GROOMING',
        'Trainers': 'TRAINER',
        'Pet Hotels': 'PET_HOTEL',
        'Daycare': 'DAYCARE',
        'Events': 'EVENTS',
        'Boarding': 'BOARDING',
        'Walking': 'WALKING'
      };
      where.category = categoryMap[category as string] || category;
    }

    // City filter
    if (city) where.city = { equals: city as string };

    // Premium filter
    if (isPremium === 'true') where.isPremium = true;

    // Rating filter
    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    // Pet Type filter
    if (petType) {
      where.petTypes = { contains: petType as string };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { location: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    // Default sorting: Premium first, then rating
    let orderBy: any[] = [
      { isPremium: 'desc' },
    ];

    if (sortBy === 'rating' || sortBy === 'Top Rated') {
      orderBy.push({ rating: 'desc' });
    } else if (sortBy === 'newest' || sortBy === 'Newest') {
      orderBy.push({ createdAt: 'desc' });
    } else if (sortBy === 'Most Booked') {
      orderBy.push({ totalReviews: 'desc' });
    } else {
      orderBy.push({ rating: 'desc' });
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  phone: true,
                  email: true,
                }
              },
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.listing.count({ where })
    ]);

    let formattedListings = listings.map(listing => {
      let images = [];
      let petTypes = [];
      let tags = [];
      let operatingHours = null;

      try {
        images = JSON.parse(listing.images || '[]');
        petTypes = JSON.parse(listing.petTypes || '[]');
        tags = JSON.parse(listing.tags || '[]');
        operatingHours = listing.operatingHours ? JSON.parse(listing.operatingHours) : null;
      } catch (e) {
        console.error('Error parsing JSON fields for listing:', listing.id);
      }
      
      return {
        id: listing.id,
        vendorId: listing.vendorId,
        vendorName: listing.vendor.businessName,
        name: listing.title,
        title: listing.title,
        category: listing.category,
        rating: listing.rating,
        reviewCount: listing.totalReviews,
        location: listing.location,
        city: listing.city,
        coordinates: {
          lat: listing.latitude,
          lng: listing.longitude,
        },
        image: images[0] || '',
        gallery: images,
        price: listing.priceRange,
        priceRange: listing.priceRange,
        isPremium: listing.isPremium,
        isVerified: listing.isVerified,
        phone: listing.vendor.user?.phone || '',
        whatsapp: listing.vendor.user?.phone || '',
        description: listing.description,
        petTypes,
        tags,
        operatingHours,
        createdAt: listing.createdAt.toISOString(),
      };
    });

    // Distance sorting if lat/lng provided
    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      
      formattedListings = formattedListings.map(l => {
        if (l.coordinates.lat && l.coordinates.lng) {
          const distance = calculateDistance(userLat, userLng, l.coordinates.lat, l.coordinates.lng);
          return { ...l, distance };
        }
        return { ...l, distance: 999999 };
      });

      if (sortBy === 'nearest' || sortBy === 'Distance') {
        formattedListings.sort((a: any, b: any) => {
          if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
          return (a.distance || 0) - (b.distance || 0);
        });
      }
    }

    res.json({ 
      data: formattedListings,
      meta: {
        total,
        page: pageNum,
        lastPage: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const images = JSON.parse(listing.images || '[]');
    const petTypes = JSON.parse(listing.petTypes || '[]');
    const tags = JSON.parse(listing.tags || '[]');
    const operatingHours = listing.operatingHours ? JSON.parse(listing.operatingHours) : undefined;

    const formattedListing = {
      ...listing,
      name: listing.title,
      image: images[0] || '',
      gallery: images,
      price: listing.priceRange,
      reviewCount: listing.totalReviews,
      petTypes,
      tags,
      operatingHours,
      vendorName: listing.vendor.businessName,
      phone: listing.vendor.user?.phone || '',
      whatsapp: listing.vendor.user?.phone || '',
      coordinates: {
        lat: listing.latitude,
        lng: listing.longitude,
      },
    };

    res.json(formattedListing);
  } catch (error) {
    console.error('Fetch listing by id error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const { vendorId, name, category, petTypes, location, city, latitude, longitude, isPremium, image, gallery, tags, price, description, operatingHours } = req.body;
    
    // Map frontend fields back to backend fields if necessary
    const listing = await prisma.listing.create({
      data: {
        vendorId,
        title: name,
        category,
        description,
        petTypes: JSON.stringify(petTypes || []),
        tags: JSON.stringify(tags || []),
        images: JSON.stringify(gallery || (image ? [image] : [])),
        location,
        city: city || 'Unknown',
        latitude,
        longitude,
        isPremium: isPremium || false,
        priceRange: price,
        operatingHours: operatingHours ? JSON.stringify(operatingHours) : undefined,
      },
    });

    const images = JSON.parse(listing.images || '[]');
    const resPetTypes = JSON.parse(listing.petTypes || '[]');
    const resTags = JSON.parse(listing.tags || '[]');
    const resOperatingHours = listing.operatingHours ? JSON.parse(listing.operatingHours) : undefined;

    res.status(201).json({
      ...listing,
      name: listing.title,
      image: images[0] || '',
      gallery: images,
      price: listing.priceRange,
      reviewCount: listing.totalReviews,
      petTypes: resPetTypes,
      tags: resTags,
      operatingHours: resOperatingHours,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};
