import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getLostFoundPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.lostFoundPost.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lost & found posts' });
  }
};

export const createLostFoundPost = async (req: Request, res: Response) => {
  try {
    const { userId, type, petCategory, petType, description, location, contactInfo } = req.body;
    const post = await prisma.lostFoundPost.create({
      data: {
        userId,
        type,
        petCategory: petCategory || 'Other',
        petType,
        description,
        location,
        contactInfo,
      },
      include: {
        user: true,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Create lost/found post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const deleteLostFoundPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lostFoundPost.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
