import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getVendorStats = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    
    const [totalLeads, newLeads, totalListings, vendor] = await Promise.all([
      prisma.lead.count({ where: { vendorId } }),
      prisma.lead.count({ where: { vendorId, status: 'NEW' } }),
      prisma.listing.count({ where: { vendorId } }),
      prisma.vendor.findUnique({
        where: { id: vendorId },
        include: {
          subscriptions: {
            orderBy: { startDate: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    const sub = vendor?.subscriptions[0];
    const subscription = sub ? {
      ...sub,
      expiryDate: sub.endDate?.toISOString(),
    } : { plan: 'FREE', isActive: true };

    res.json({
      totalLeads,
      newLeads,
      totalListings,
      leadCredits: vendor?.leadCredits || 0,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor stats' });
  }
};

export const getVendorDashboard = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    
    const [totalLeads, newLeads, totalListings, vendor, recentLeads] = await Promise.all([
      prisma.lead.count({ where: { vendorId } }),
      prisma.lead.count({ where: { vendorId, status: 'NEW' } }),
      prisma.listing.count({ where: { vendorId } }),
      prisma.vendor.findUnique({
        where: { id: vendorId },
        include: {
          subscriptions: {
            orderBy: { startDate: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.lead.findMany({
        where: { vendorId },
        include: {
          user: true,
          listing: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ]);

    const sub = vendor?.subscriptions[0];
    const subscription = sub ? {
      plan: sub.plan,
      expiresAt: sub.endDate?.toISOString(),
      isActive: sub.isActive,
    } : { plan: 'FREE', isActive: true };

    const mappedLeads = recentLeads.map(lead => ({
      id: lead.id,
      userName: lead.user?.name || 'Guest User',
      listingTitle: lead.listing?.title || 'Unknown Service',
      type: lead.actionType.toLowerCase(),
      status: lead.status.toLowerCase(),
      createdAt: lead.createdAt.toISOString(),
    }));

    res.json({
      stats: {
        totalLeads,
        newLeads,
        totalListings,
        leadCredits: vendor?.leadCredits || 0,
      },
      subscription,
      recentLeads: mappedLeads,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor dashboard' });
  }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { businessName, description, city, address, phone, website } = req.body;

    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        businessName,
        description,
        city,
        address,
        website,
      },
    });

    // If phone is provided, we might want to update the associated User's phone too
    if (phone) {
      await prisma.user.update({
        where: { id: vendor.userId },
        data: { phone },
      });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
};

export const getVendorLeads = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const leads = await prisma.lead.findMany({
      where: { vendorId },
      include: {
        user: true,
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedLeads = leads.map(lead => {
      let images = [];
      try {
        images = JSON.parse(lead.listing?.images || '[]');
      } catch (e) {
        images = [];
      }

      return {
        id: lead.id,
        serviceId: lead.listingId,
        vendorId: lead.vendorId,
        serviceName: lead.listing?.title || 'Unknown Service',
        serviceImage: images[0] || '',
        userName: lead.user?.name || 'Guest User',
        userPhone: lead.user?.phone || lead.user?.email || '',
        message: lead.message,
        status: lead.status.toLowerCase(),
        createdAt: lead.createdAt.toISOString(),
        type: lead.actionType.toLowerCase(),
      };
    });

    res.json({ leads: mappedLeads });
  } catch (error) {
    console.error('Fetch vendor leads error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor leads' });
  }
};
