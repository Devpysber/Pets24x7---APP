import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const createLead = async (req: any, res: Response) => {
  try {
    const { 
      vendorId, 
      listingId,
      actionType,
      message
    } = req.body;

    const userId = req.user?.id;

    if (!vendorId || !actionType) {
      return res.status(400).json({ error: 'vendorId and actionType are required' });
    }

    // Map frontend action types to backend enum
    let mappedActionType: string = actionType.toUpperCase();
    if (actionType === 'call_click') mappedActionType = 'CALL';
    if (actionType === 'whatsapp_click') mappedActionType = 'WHATSAPP';
    if (actionType === 'inquiry_submit') mappedActionType = 'INQUIRY';

    // Anti-spam: Check for duplicate leads in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingLead = await prisma.lead.findFirst({
      where: {
        userId,
        vendorId,
        listingId: listingId || null,
        actionType: mappedActionType as any,
        createdAt: {
          gte: fiveMinutesAgo
        }
      }
    });

    if (existingLead) {
      return res.status(429).json({ 
        error: 'Duplicate lead detected. Please wait a few minutes before trying again.',
        leadId: existingLead.id 
      });
    }

    const lead = await prisma.lead.create({
      data: {
        userId,
        vendorId,
        listingId,
        actionType: mappedActionType as any,
        message: message || `User initiated ${mappedActionType.toLowerCase()} contact`,
        status: 'NEW',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            category: true
          }
        },
        vendor: {
          select: {
            userId: true
          }
        }
      }
    });

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: lead.vendor.userId,
        type: 'lead',
        title: `New ${mappedActionType.toLowerCase()} lead!`,
        message: `A user initiated a ${mappedActionType.toLowerCase()} contact for "${lead.listing?.title || 'General Inquiry'}".`,
        link: '/vendor/dashboard'
      }
    });

    let images = [];
    try {
      images = JSON.parse(lead.listing?.images || '[]');
    } catch (e) {
      images = [];
    }

    const mappedLead = {
      id: lead.id,
      userId: lead.userId,
      userName: lead.user.name,
      userPhone: lead.user.phone || '',
      serviceId: lead.listingId,
      serviceName: lead.listing?.title || 'General Inquiry',
      serviceImage: images[0] || 'https://picsum.photos/seed/service/400/400',
      type: lead.actionType.toLowerCase(),
      message: lead.message,
      status: lead.status.toLowerCase(),
      createdAt: lead.createdAt.toISOString()
    };

    res.status(201).json(mappedLead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const getUserLeads = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const leads = await prisma.lead.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
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
        userId: lead.userId,
        userName: req.user.name,
        userPhone: req.user.phone || '',
        serviceId: lead.listingId,
        serviceName: lead.listing?.title || 'General Inquiry',
        serviceImage: images[0] || 'https://picsum.photos/seed/service/400/400',
        type: lead.actionType.toLowerCase(),
        message: lead.message,
        status: lead.status.toLowerCase(),
        createdAt: lead.createdAt.toISOString()
      };
    });

    res.json(mappedLeads);
  } catch (error) {
    console.error('Fetch user leads error:', error);
    res.status(500).json({ error: 'Failed to fetch user leads' });
  }
};

export const getVendorLeads = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Find the vendor profile for this user
    const vendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const leads = await prisma.lead.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
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
        userId: lead.userId,
        userName: lead.user.name,
        userPhone: lead.user.phone || '',
        serviceId: lead.listingId,
        serviceName: lead.listing?.title || 'General Inquiry',
        serviceImage: images[0] || 'https://picsum.photos/seed/service/400/400',
        type: lead.actionType.toLowerCase(),
        message: lead.message,
        status: lead.status.toLowerCase(),
        createdAt: lead.createdAt.toISOString()
      };
    });

    res.json(mappedLeads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const getLeadsByVendor = async (req: Request, res: Response) => {
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

    res.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const updateLeadStatus = async (req: any, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const { id: bodyId, status } = req.body;
    const id = paramId || bodyId;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!id) {
      return res.status(400).json({ error: 'Lead ID is required' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { vendor: true }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (userRole === 'VENDOR') {
      if (lead.vendor.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only update status for your own leads' });
      }
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status: status.toUpperCase() as any },
    });
    res.json(updatedLead);
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
};

export const buyLeads = async (req: Request, res: Response) => {
  try {
    const { vendorId, amount } = req.body;
    
    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        leadCredits: {
          increment: amount
        }
      }
    });
    
    res.json({ newBalance: vendor.leadCredits });
  } catch (error) {
    console.error('Buy leads error:', error);
    res.status(500).json({ error: 'Failed to buy leads' });
  }
};
