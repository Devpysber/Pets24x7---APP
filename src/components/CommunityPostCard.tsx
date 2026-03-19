import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { CommunityPost } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Card } from './Card';
import { Badge } from './Badge';
import { cn } from '../utils/theme';
import { formatDistanceToNow } from 'date-fns';

interface CommunityPostCardProps {
  post: CommunityPost;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
  const { user, toggleLikeCommunityPost, addCommunityComment } = useAppStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isLiked = user ? post.likes.includes(user.id) : false;

  const handleLike = () => {
    toggleLikeCommunityPost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommunityComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <Card className="overflow-hidden border-black/5 mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
            <img 
              src={post.userImage} 
              alt={post.userName} 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{post.userName}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              <span className="text-[10px] text-gray-300">•</span>
              <Badge variant="secondary" className="text-[8px] px-1.5 py-0 bg-indigo-50 text-indigo-600 border-none">
                {post.category}
              </Badge>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="w-full aspect-video overflow-hidden bg-gray-100">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-black/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              isLiked ? "text-rose-500" : "text-gray-500"
            )}
          >
            <Heart size={20} className={cn(isLiked && "fill-current")} />
            <span className="text-xs font-bold">{post.likes.length}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-gray-500"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-bold">{post.comments.length}</span>
          </button>
        </div>
        <button className="text-gray-500">
          <Share2 size={20} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 border-t border-black/5"
          >
            <div className="p-4 space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img 
                      src={comment.userImage} 
                      alt={comment.userName} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-black/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">{comment.userName}</span>
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src={user?.avatar || 'https://picsum.photos/seed/guest/100/100'} 
                    alt="Your avatar" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full bg-white border border-black/5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
