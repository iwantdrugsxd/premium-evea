'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function CommunityPage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const stories = [
    { id: 1, user: "Your Story", avatar: "user", isLive: false },
    { id: 2, user: "Priya's Wedding", avatar: "wedding", isLive: true },
    { id: 3, user: "Corporate Event", avatar: "corporate", isLive: false },
    { id: 4, user: "Birthday Bash", avatar: "birthday", isLive: false },
    { id: 5, user: "Anniversary", avatar: "anniversary", isLive: false }
  ];

  const posts = [
    {
      id: 1,
      user: "The Sharma Wedding",
      avatar: "wedding",
      verified: true,
      time: "2 hours ago",
      location: "Mumbai",
      content: "Our dream wedding became reality with EVEA! From the stunning decoration to the perfect coordination, every moment was magical. Thank you to the amazing team who made it happen! 💕",
      tags: ["#DreamWedding", "#EVEAPremium", "#MumbaiWedding"],
      stats: { guests: 500, venue: "Grand Ballroom", package: "Premium" },
      likes: 234,
      comments: 45,
      isLiked: false
    },
    {
      id: 2,
      user: "Tech Summit 2024",
      avatar: "corporate",
      verified: false,
      time: "1 day ago",
      location: "Bangalore",
      content: "Successfully hosted 1000+ attendees at our annual tech summit! The EVEA team's professional approach and attention to detail made this our best event yet. Live streaming setup was flawless! 🚀",
      tags: ["#CorporateEvent", "#TechSummit", "#LiveStreaming"],
      stats: { guests: 1000, venue: "Live Streamed", package: "Professional" },
      likes: 189,
      comments: 23,
      isLiked: true
    }
  ];

  const trendingEvents = [
    { id: 1, name: "#WinterWeddings", posts: "2.3k", period: "this week" },
    { id: 2, name: "#CorporateParties", posts: "1.8k", period: "this week" },
    { id: 3, name: "#BirthdayBash", posts: "1.2k", period: "this week" }
  ];

  const popularVendors = [
    { id: 1, name: "Royal Feast Catering", events: 45, avatar: "catering" },
    { id: 2, name: "Cinematic Moments", events: 38, avatar: "photography" },
    { id: 3, name: "Dream Decorators", events: 32, avatar: "decoration" }
  ];

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  return (
    <div className="min-h-screen">
      {/* Clean background without rectangular overlays */}
      <div className="fixed inset-0 -z-20 bg-black"></div>
      <div className="fixed inset-0 -z-10 bg-black"></div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
                      className="hero-title"
        >
          Share Your<br />
          <span className="gradient-text">Celebrations</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Connect with our community. Share your event stories, get inspired, and celebrate together.
        </motion.p>
      </section>





      {/* Feed Section */}
      <section className="px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="lg:col-span-2 space-y-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden card-hover"
              >
                {/* Post Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full relative">
                        {post.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white">
                            ✓
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{post.user}</h4>
                        <p className="text-sm text-gray-400">{post.time} • {post.location}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Event Stats */}
                  <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-4 mb-4">
                    <div className="flex gap-6 text-sm">
                      <span>👥 {post.stats.guests} Guests</span>
                      <span>📍 {post.stats.venue}</span>
                      <span>⭐ {post.stats.package} Package</span>
                    </div>
                  </div>
                </div>

                {/* Post Media */}
                <div className="h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Post Actions */}
                <div className="p-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <Plus />
      </motion.button>
    </div>
  );
}
