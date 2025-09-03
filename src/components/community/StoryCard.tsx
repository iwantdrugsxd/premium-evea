'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    content: string;
    event_type: string;
    location?: string;
    event_date?: string;
    tags: string[];
    images: string[];
    created_at: string;
    user_id: string;
    likes: { count: number }[];
    comments: { count: number }[];
  };
  currentUserId?: string;
  onLike: (storyId: string) => void;
  onComment: (storyId: string, content: string) => void;
}

export default function StoryCard({ story, currentUserId, onLike, onComment }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes[0]?.count || 0);
  const [commentCount, setCommentCount] = useState(story.comments[0]?.count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Check if user liked this story
  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/stories/${story.id}/like?userId=${currentUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsLiked(data.isLiked);
          }
        })
        .catch(console.error);
    }
  }, [story.id, currentUserId]);

  // Fetch comments when needed
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/stories/${story.id}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!currentUserId) {
      alert('Please log in to like stories');
      return;
    }

    try {
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });

      const data = await response.json();
      if (data.success) {
        setIsLiked(data.action === 'liked');
        setLikeCount(prev => data.action === 'liked' ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/stories/${story.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newComment.trim(),
          userId: currentUserId 
        })
      });

      const data = await response.json();
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setCommentCount(prev => prev + 1);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
          {story.user_id.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-white">User {story.user_id}</h3>
          <p className="text-sm text-gray-400">{formatDate(story.created_at)}</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {story.event_type}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-3">{story.title}</h2>

      {/* Content */}
      <p className="text-gray-300 mb-4 leading-relaxed">{story.content}</p>

      {/* Event Details */}
      {(story.location || story.event_date) && (
        <div className="flex gap-4 mb-4 text-sm text-gray-400">
          {story.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {story.location}
            </span>
          )}
          {story.event_date && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(story.event_date)}
            </span>
          )}
        </div>
      )}

      {/* Images */}
      {story.images && story.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {story.images.slice(0, 6).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Story image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
          {story.images.length > 6 && (
            <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
              +{story.images.length - 6} more
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/5 text-gray-300 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-white/10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
          }`}
        >
          <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {comment.user_id.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">User {comment.user_id}</span>
                      <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
