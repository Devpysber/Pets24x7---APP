import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPosts = posts.map(post => ({
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userImage: post.user.avatar,
      category: post.category,
      content: post.content,
      image: post.image,
      likes: post.likes.map(like => like.userId),
      comments: post.comments.map(comment => ({
        id: comment.id,
        userId: comment.userId,
        userName: comment.user.name,
        userImage: comment.user.avatar,
        text: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
      createdAt: post.createdAt.toISOString(),
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { userId, category, content, image } = req.body;
  try {
    const post = await prisma.communityPost.create({
      data: {
        userId,
        category,
        content,
        image,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const formattedPost = {
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userImage: post.user.avatar,
      category: post.category,
      content: post.content,
      image: post.image,
      likes: [],
      comments: [],
      createdAt: post.createdAt.toISOString(),
    };

    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Failed to create community post' });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body; // In a real app, this would come from auth middleware

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    const updatedLikes = await prisma.like.findMany({
      where: { postId },
      select: { userId: true },
    });

    res.json({ likes: updatedLikes.map(l => l.userId) });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content: text,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const formattedComment = {
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name,
      userImage: comment.user.avatar,
      text: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
