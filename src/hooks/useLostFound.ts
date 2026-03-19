import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { lostFoundApi } from '../api/lostfound.api';
import { LostFoundPost } from '../types';

export const useLostFound = () => {
  const { lostFoundPosts, setLostFoundPosts, addLostFoundPost, deleteLostFoundPost } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await lostFoundApi.getLostFoundPosts();
      // We need a setLostFoundPosts action in the store
      // For now, we'll just use the store's state if it's already there
      // But let's assume we want to sync with API
      setLostFoundPosts(data);
    } catch (err) {
      setError('Failed to fetch lost & found posts.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setLostFoundPosts]);

  useEffect(() => {
    if (lostFoundPosts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, lostFoundPosts.length]);

  const createPost = useCallback(async (post: Omit<LostFoundPost, 'id' | 'createdAt' | 'userName' | 'userImage'>) => {
    setIsLoading(true);
    try {
      const newPost = await lostFoundApi.createPost(post);
      addLostFoundPost(newPost);
      return newPost;
    } catch (err) {
      setError('Failed to create post.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addLostFoundPost]);

  return {
    posts: lostFoundPosts,
    isLoading,
    error,
    refresh: fetchPosts,
    createPost,
    deletePost: deleteLostFoundPost
  };
};
