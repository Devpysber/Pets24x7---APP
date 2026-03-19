import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Share2, MessageCircle } from 'lucide-react';
import { LostFoundPost } from '../types';
import { Badge } from './Badge';
import { Card } from './Card';
import { formatDistanceToNow } from 'date-fns';

interface LostFoundPostCardProps {
  post: LostFoundPost;
}

export const LostFoundPostCard: React.FC<LostFoundPostCardProps> = ({ post }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.type.toUpperCase()}: ${post.petType}`,
        text: post.description,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-100 last:border-0"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.userImage}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div>
            <h4 className="text-sm font-bold text-gray-900">{post.userName}</h4>
            <p className="text-[10px] text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge variant={post.type === 'lost' ? 'danger' : 'success'} className="uppercase text-[10px] tracking-wider">
          {post.type}
        </Badge>
      </div>

      {/* Post Image */}
      <div className="aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={post.image}
          alt={post.petType}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-indigo-600 transition-colors">
            <MessageCircle size={24} />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <Share2 size={24} />
          </button>
        </div>
        <a
          href={`tel:${post.contactInfo}`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform"
        >
          <Phone size={14} />
          Contact
        </a>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center gap-1 text-gray-900">
          <span className="font-bold text-sm">{post.petType}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {post.description}
        </p>
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin size={12} />
          <span className="text-[11px] font-medium">{post.location}</span>
        </div>
      </div>
    </motion.div>
  );
};
