import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      vendorId, 
      serviceId, // listingId on frontend is serviceId
      type,      // actionType on frontend is type
      message,
      userName,
      userPhone,
      serviceName,
      serviceImage
    } = req.body;

    const lead = await prisma.lead.create({
      data: {
        userId: userId || 'guest',
        vendorId,
        listingId: serviceId,
        actionType: (type as string).toUpperCase() as any,
        message: message || `User interested in ${serviceName}`,
        status: 'NEW',
      },
      include: {
        user: true,
        listing: true,
      }
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
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

    const mappedLeads = leads.map(lead => ({
      id: lead.id,
      serviceId: lead.listingId,
      vendorId: lead.vendorId,
      serviceName: lead.listing?.title || 'Unknown Service',
      serviceImage: lead.listing?.images[0] || '',
      userName: lead.user?.name || 'Guest User',
      userPhone: lead.user?.phone || lead.user?.email || '',
      message: lead.message,
      status: lead.status.toLowerCase(),
      createdAt: lead.createdAt.toISOString(),
      type: lead.actionType.toLowerCase(),
    }));

    res.json({ leads: mappedLeads });
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: status.toUpperCase() as any },
    });
    res.json(lead);
  } catch (error) {
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
