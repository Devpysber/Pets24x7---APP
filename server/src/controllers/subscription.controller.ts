import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const upgradeSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    // In a real app, you'd handle payment here.
    // For this app, we'll just update the DB.

    const isPremium = plan !== 'FREE';

    // Update or create subscription
    const subscription = await prisma.subscription.create({
      data: {
        vendorId: vendor.id,
        plan,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Update vendor premium status
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { 
        isPremium,
        // Give some lead credits based on plan
        leadCredits: {
          increment: plan === 'PLATINUM' ? 100 : plan === 'GOLD' ? 50 : plan === 'SILVER' ? 20 : 0
        }
      },
    });

    // Update all listings of this vendor to match premium status
    await prisma.listing.updateMany({
      where: { vendorId: vendor.id },
      data: { isPremium },
    });

    res.json({ 
      message: 'Subscription upgraded successfully', 
      subscription: {
        ...subscription,
        expiryDate: subscription.endDate?.toISOString(),
      }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
};

export const getSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        subscriptions: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const sub = vendor.subscriptions[0];
    if (sub) {
      return res.json({
        ...sub,
        expiryDate: sub.endDate?.toISOString(),
      });
    }

    res.json({ plan: 'FREE', isActive: true });
  } catch (error) {
    console.error('Fetch subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};
