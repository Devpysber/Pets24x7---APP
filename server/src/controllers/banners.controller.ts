import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};
