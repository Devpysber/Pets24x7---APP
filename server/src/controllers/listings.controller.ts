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

const CATEGORY_MAP: Record<string, string> = {
  'Pet Shops': 'PET_SHOP',
  'Vet Clinics': 'VET_CLINIC',
  'Grooming': 'GROOMING',
  'Trainers': 'TRAINER',
  'Pet Hotels': 'PET_HOTEL',
  'Daycare': 'DAYCARE',
  'Boarding': 'BOARDING',
  'Walking': 'WALKING',
  'Events': 'EVENTS',
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      city, 
      search, 
      petType,
      rating,
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
      const mappedCategory = CATEGORY_MAP[category as string] || category;
      where.category = mappedCategory as any;
    }

    // City filter
    if (city) {
      where.city = { equals: city as string };
    }

    // Pet Type filter
    if (petType) {
      where.petTypes = { contains: petType as string };
    }

    // Rating filter
    if (rating) {
      where.rating = { gte: parseFloat(rating as string) };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { location: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    // Sorting
    // Always prioritize premium listings
    let orderBy: any = [
      { isPremium: 'desc' },
    ];

    if (sortBy === 'rating') {
      orderBy.push({ rating: 'desc' });
    } else if (sortBy === 'newest') {
      orderBy.push({ createdAt: 'desc' });
    } else if (sortBy === 'popularity') {
      orderBy.push({ totalReviews: 'desc' });
    } else {
      orderBy.push({ rating: 'desc' }); // Default secondary sort
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          vendor: {
            select: {
              businessName: true,
              isVerified: true
            }
          }
        }
      }),
      prisma.listing.count({ where })
    ]);

    const formattedListings = listings.map(listing => {
      let images = [];
      try {
        images = JSON.parse(listing.images || '[]');
      } catch (e) {
        images = [];
      }
      
      return {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        city: listing.city,
        location: listing.location,
        price: listing.priceRange || 'N/A',
        rating: listing.rating,
        totalReviews: listing.totalReviews,
        image: images[0] || 'https://picsum.photos/seed/pet/400/300',
        isPremium: listing.isPremium,
        isVerified: listing.isVerified,
        vendorName: listing.vendor.businessName
      };
    });

    res.json({ 
      listings: formattedListings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
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
            user: {
              select: {
                phone: true,
                email: true
              }
            },
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

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
      // Fallback
    }

    res.json({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      city: listing.city,
      location: listing.location,
      price: listing.priceRange || 'N/A',
      rating: listing.rating,
      totalReviews: listing.totalReviews,
      image: images[0] || '',
      images: images,
      isPremium: listing.isPremium,
      isVerified: listing.isVerified,
      petTypes,
      tags,
      operatingHours,
      vendor: {
        id: listing.vendor.id,
        businessName: listing.vendor.businessName,
        phone: listing.vendor.user?.phone || '',
        email: listing.vendor.user?.email || ''
      },
      createdAt: listing.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Fetch listing by id error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

export const createListing = async (req: any, res: Response) => {
  try {
    const { 
      title, 
      category, 
      description, 
      price, 
      location, 
      address,
      images, 
      petTypes, 
      tags, 
      operatingHours 
    } = req.body;
    
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Only vendors can create listings' });
    }

    const mappedCategory = CATEGORY_MAP[category as string] || category;

    const listing = await prisma.listing.create({
      data: {
        vendorId: vendor.id,
        title,
        category: mappedCategory as any,
        description,
        priceRange: price,
        location,
        address: address || location,
        city: location.split(',').pop()?.trim() || 'Unknown',
        images: JSON.stringify(images || []),
        petTypes: JSON.stringify(petTypes || []),
        tags: JSON.stringify(tags || []),
        operatingHours: operatingHours ? JSON.stringify(operatingHours) : null,
        isPremium: vendor.isPremium,
        isVerified: vendor.isVerified
      },
    });

    res.status(201).json({
      id: listing.id,
      title: listing.title,
      status: 'active', // Default to active for now
      createdAt: listing.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

export const updateListing = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Only vendors can update listings' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.vendorId !== vendor.id) {
      return res.status(403).json({ error: 'You do not have permission to update this listing' });
    }

    const { 
      title, 
      category, 
      description, 
      price, 
      location, 
      address,
      images, 
      petTypes, 
      tags, 
      operatingHours 
    } = req.body;

    const mappedCategory = category ? (CATEGORY_MAP[category as string] || category) : undefined;

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        category: mappedCategory as any,
        description,
        priceRange: price,
        location,
        address: address || location,
        city: location?.split(',').pop()?.trim(),
        images: images ? JSON.stringify(images) : undefined,
        petTypes: petTypes ? JSON.stringify(petTypes) : undefined,
        tags: tags ? JSON.stringify(tags) : undefined,
        operatingHours: operatingHours ? JSON.stringify(operatingHours) : undefined,
      },
    });

    res.json({
      id: updatedListing.id,
      title: updatedListing.title,
      updatedAt: updatedListing.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

export const deleteListing = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const vendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Only vendors can delete listings' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.vendorId !== vendor.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this listing' });
    }

    await prisma.listing.delete({
      where: { id }
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

export const getVendorListings = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (!vendor) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const listings = await prisma.listing.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' }
    });

    const formattedListings = listings.map(listing => {
      let images = [];
      try {
        images = JSON.parse(listing.images || '[]');
      } catch (e) {
        images = [];
      }
      
      return {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        city: listing.city,
        location: listing.location,
        price: listing.priceRange || 'N/A',
        rating: listing.rating,
        totalReviews: listing.totalReviews,
        image: images[0] || 'https://picsum.photos/seed/pet/400/300',
        isPremium: listing.isPremium,
        isVerified: listing.isVerified,
      };
    });

    res.json({ listings: formattedListings });
  } catch (error) {
    console.error('Fetch vendor listings error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor listings' });
  }
};
