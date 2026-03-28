import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.query; // In a real app, this would come from auth middleware
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

export const clearAll = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    await prisma.notification.deleteMany({
      where: { userId: userId as string },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};
