import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Share2, MessageCircle, MessageSquare } from 'lucide-react';
import { LostFoundPost } from '../types';
import { Badge } from './Badge';
import { Card } from './Card';
import { formatDistanceToNow } from 'date-fns';

interface LostFoundPostCardProps {
  post: LostFoundPost;
}

export const LostFoundPostCard: React.FC<LostFoundPostCardProps> = ({ post }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: `${post.type.toUpperCase()}: ${post.petCategory} - ${post.petType}`,
          text: post.description,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      } finally {
        setIsSharing(false);
      }
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
          <button className="text-gray-700 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <MessageCircle size={22} />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-700 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
          >
            <Share2 size={22} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${post.contactInfo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full shadow-sm active:scale-95 transition-transform"
            title="WhatsApp"
          >
            <MessageSquare size={18} />
          </a>
          <a
            href={`tel:${post.contactInfo}`}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-indigo-100 active:scale-95 transition-transform"
          >
            <Phone size={14} />
            Call
          </a>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-900">
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 border-none">
            {post.petCategory}
          </Badge>
          <span className="font-bold text-sm">{post.petName || 'Unnamed'}</span>
          <span className="text-xs text-gray-500">• {post.breed || post.petType}</span>
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
