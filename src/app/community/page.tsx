'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ShareStoryForm from '@/components/community/ShareStoryForm';
import StoryCard from '@/components/community/StoryCard';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  ArrowRight,
  Camera,
  Video,
  Link,
  Bold,
  Italic,
  List,
  Quote,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';

interface Post {
  id: number;
  user: string;
  avatar: string;
  verified: boolean;
  time: string;
  location: string;
  content: string;
  tags: string[];
  stats: { guests: number; venue: string; package: string };
  likes: number;
  comments: number;
  isLiked: boolean;
  type: 'story' | 'article';
  image?: string;
  instagramLink?: string;
  youtubeLink?: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readingTime: string;
  coverImage?: string;
  tags: string[];
  author: string;
  publishedAt: string;
}

export default function CommunityPage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState('All Posts');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showWriteArticleModal, setShowWriteArticleModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch stories from API
  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      if (data.success) {
        setStories(data.data);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle story submission
  const handleStorySubmit = async (storyData: any) => {
    try {
      console.log('=== STORY SUBMISSION START ===');
      console.log('Story data received:', storyData);
      console.log('Images in storyData:', storyData.images);
      console.log('Images length:', storyData.images?.length || 0);
      
      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('content', storyData.content);
      formData.append('eventType', storyData.eventType);
      formData.append('location', storyData.location || '');
      formData.append('date', storyData.date || '');
      formData.append('tags', JSON.stringify(storyData.tags));
      formData.append('userId', currentUserId || 'anonymous');
      
      // Append images
      if (storyData.images && storyData.images.length > 0) {
        console.log('Appending images to FormData...');
        storyData.images.forEach((image: File, index: number) => {
          console.log(`Appending image ${index}:`, image.name, image.size, image.type);
          formData.append('images', image);
        });
        console.log('Images appended to FormData');
      } else {
        console.log('No images to append');
      }

      console.log('FormData prepared, sending to API...');
      
      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('API response:', data);
      
      if (data.success) {
        // Refresh stories list
        fetchStories();
        alert('Story shared successfully!');
      } else {
        throw new Error(data.error || 'Failed to share story');
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      throw error;
    }
  };

  // Handle story like
  const handleStoryLike = (storyId: string) => {
    // This will be handled by the StoryCard component
  };

  // Handle story comment
  const handleStoryComment = (storyId: string, content: string) => {
    // This will be handled by the StoryCard component
  };

  // Load stories on component mount
  useEffect(() => {
    fetchStories();
    // For now, set a dummy user ID - in real app, get from auth
    setCurrentUserId('user-123');
  }, []);

  const posts: Post[] = [
    {
      id: 1,
      user: "Rajesh Kumar",
      avatar: "RK",
      verified: true,
      time: "2 hours ago",
      location: "Mumbai",
      content: "Can't thank EVEA enough for making our special day absolutely perfect! The Premium package was worth every penny. The team of 10 coordinators ensured everything ran smoothly...",
      tags: ["#LuxuryWedding", "#EVEAPremium", "#MumbaiWedding"],
      stats: { guests: 500, venue: "The Taj", package: "Premium" },
      likes: 342,
      comments: 28,
      isLiked: false,
      type: 'story',
      instagramLink: "https://instagram.com/stories/rajesh_wedding"
    },
    {
      id: 2,
      user: "Priya Sharma",
      avatar: "PS",
      verified: false,
      time: "5 hours ago",
      location: "Bangalore",
      content: "Successfully hosted 500+ attendees at our annual summit. EVEA's Professional package handled everything from vendor management to live streaming setup. The feedback has been incredible!",
      tags: ["#CorporateEvent", "#TechSummit", "#LiveStreaming"],
      stats: { guests: 500, venue: "Live Streamed", package: "Professional" },
      likes: 189,
      comments: 15,
      isLiked: true,
      type: 'story',
      youtubeLink: "https://youtube.com/watch?v=techsummit2025"
    },
    {
      id: 3,
      user: "Anita Mehta",
      avatar: "AM",
      verified: false,
      time: "Yesterday",
      location: "Delhi",
      content: "The Basic package exceeded our expectations! Even with the starter package, EVEA's team of 5 made sure every detail was perfect. The decoration and vendor coordination were flawless.",
      tags: ["#BirthdayParty", "#EVEABasic", "#DelhiEvents"],
      stats: { guests: 50, venue: "Home", package: "Basic" },
      likes: 127,
      comments: 9,
      isLiked: false,
      type: 'story'
    }
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: "10 Trends Shaping Mumbai's Event Scene in 2025",
      excerpt: "Discover the latest innovations in event planning, from immersive AR experiences to sustainable celebration practices that are transforming how we create memorable moments...",
      content: "Full article content here...",
      category: "Trend Analysis",
      readingTime: "8 min read",
      tags: ["#Trends", "#Mumbai", "#2025"],
      author: "EVEA Team",
      publishedAt: "2 days ago"
    },
    {
      id: 2,
      title: "Vendor Spotlight: Mumbai's Top Caterers",
      excerpt: "We've curated a list of the most exceptional catering services in Mumbai, featuring authentic cuisines and innovative menu options that will elevate your event...",
      content: "Full article content here...",
      category: "Vendor Reviews",
      readingTime: "6 min read",
      tags: ["#Catering", "#Mumbai", "#Vendors"],
      author: "EVEA Team",
      publishedAt: "1 week ago"
    }
  ];

  const trendingTopics = [
    { id: 1, title: "Sustainable Wedding Ideas", interactions: 245, rank: 1 },
    { id: 2, title: "Tech-Enabled Corporate Events", interactions: 189, rank: 2 },
    { id: 3, title: "Traditional Meets Modern", interactions: 156, rank: 3 },
    { id: 4, title: "Budget-Friendly Celebrations", interactions: 142, rank: 4 }
  ];

  const eventCategories = [
    { name: "Weddings", count: 247 },
    { name: "Corporate Events", count: 183 },
    { name: "Birthday Parties", count: 156 },
    { name: "Anniversaries", count: 92 },
    { name: "Cultural Events", count: 78 }
  ];

  const popularTags = [
    "#LuxuryWedding",
    "#MumbaiEvents", 
    "#EVEAExperience",
    "#PremiumPackage"
  ];

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleCreatePost = async (formData: FormData) => {
    // Implementation for creating a post
    console.log('Creating post:', formData);
    setShowCreatePostModal(false);
  };

  const handleWriteArticle = async (formData: FormData) => {
    // Implementation for writing an article
    console.log('Writing article:', formData);
    setShowWriteArticleModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Navigation */}
      <Navigation />

      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent via-pink-500/30 to-transparent animate-spin" 
             style={{ animation: 'aurora 15s linear infinite' }}></div>
      </div>

      {/* Custom Cursor */}
      <div 
        className="fixed w-2.5 h-2.5 bg-purple-500 rounded-full pointer-events-none z-[9999] transition-transform duration-150 mix-blend-screen"
        style={{ 
          left: cursorPosition.x, 
          top: cursorPosition.y,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      ></div>
      <div 
        className="fixed w-8 h-8 border-2 border-purple-500/50 rounded-full pointer-events-none z-[9998] transition-all duration-150"
        style={{ 
          left: cursorPosition.x - 15, 
          top: cursorPosition.y - 15,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)'
        }}
      ></div>
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-12 text-center">
        <div className="inline-block px-5 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs uppercase tracking-wider text-purple-500 mb-8 animate-pulse">
          Community Hub
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-tight mb-5 tracking-tight">
          Share Your<br />
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Event Stories
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Connect with fellow event creators, share experiences, and get inspired for your next celebration.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => setShowWriteArticleModal(true)}
            className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full text-purple-500 font-bold hover:bg-purple-500 hover:text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 text-lg"
          >
            ✍️ Write Article
          </button>
          <button 
            onClick={() => setShowCreatePostModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-full text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all text-lg"
          >
            + Share Your Story
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-12 mb-12 flex justify-center gap-5 flex-wrap">
        {['All Posts', 'Event Stories', 'Vendor Reviews', 'Planning Tips', 'Featured Blogs'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-7 py-3 rounded-full font-semibold transition-all ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-white'
            }`}
          >
            {filter}
                    </button>
        ))}
                </div>

      {/* Community Grid */}
      <div className="max-w-7xl mx-auto px-12 pb-32 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8">
        {/* Left Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white/2 border border-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Event Categories</h3>
            {eventCategories.map((category, index) => (
              <div key={index} className="py-3 flex justify-between items-center text-gray-400 hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                <span>{category.name}</span>
                <span className="bg-purple-500/20 px-2.5 py-1 rounded-full text-xs text-purple-500">
                  {category.count}
                      </span>
              </div>
                    ))}
                  </div>

          <div className="bg-white/2 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Popular Tags</h3>
            {popularTags.map((tag, index) => (
              <div key={index} className="py-3 text-gray-400 hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                {tag}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex flex-col gap-8">
          {/* Featured Blog Post */}
          <article className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden">
            <span className="absolute top-5 right-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Featured Blog
            </span>
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              {articles[0].title}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              {articles[0].excerpt}
            </p>
            <a href="#" className="inline-flex items-center gap-2.5 text-purple-500 font-bold hover:text-white hover:gap-4 transition-all">
              Read Full Article →
            </a>
          </article>

          {/* Real Stories from API */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 animate-spin text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-gray-400">Loading stories...</p>
            </div>
          ) : stories.length > 0 ? (
            stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                currentUserId={currentUserId}
                onLike={handleStoryLike}
                onComment={handleStoryComment}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-lg mb-2">No stories yet</p>
              <p className="text-sm">Be the first to share your event story!</p>
            </div>
          )}

          {/* User Posts */}
          {posts.map((post, index) => (
            <article key={post.id} className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-400">
              {/* Post Header */}
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-lg">
                  {post.avatar}
                    </div>
                <div className="flex-1">
                  <div className="font-bold">{post.user}</div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span className="bg-purple-500/20 px-2.5 py-1 rounded-full text-purple-500">
                      {post.stats.package}
                    </span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>

              {/* Post Image */}
              <div className="h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>

              {/* Post Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{post.content.split('.')[0]}...</h3>
                <p className="text-gray-400 leading-relaxed mb-5">{post.content}</p>
                </div>

              {/* Post Stats */}
              <div className="px-6 py-5 border-t border-white/5 flex gap-8">
                      <button 
                        onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 transition-all hover:-translate-y-0.5 ${
                          likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  {post.likes} Likes
                      </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:-translate-y-0.5">
                        <MessageCircle className="w-5 h-5" />
                  {post.comments} Comments
                </button>
                {post.instagramLink && (
                  <button 
                    onClick={() => window.open(post.instagramLink, '_blank')}
                    className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-all hover:-translate-y-0.5"
                  >
                    <Camera className="w-5 h-5" />
                    View Instagram Story
                  </button>
                )}
                {post.youtubeLink && (
                  <button 
                    onClick={() => window.open(post.youtubeLink, '_blank')}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all hover:-translate-y-0.5"
                  >
                    <Video className="w-5 h-5" />
                    Watch on YouTube
                  </button>
                )}
              </div>
            </article>
          ))}

          {/* Blog Post */}
          <article className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              {articles[1].title}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              {articles[1].excerpt}
            </p>
            <a href="#" className="inline-flex items-center gap-2.5 text-purple-500 font-bold hover:text-white hover:gap-4 transition-all">
              Continue Reading →
            </a>
          </article>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit">
          {/* Live Stream */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/30 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <span className="absolute top-5 right-5 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
              LIVE
            </span>
            <h3 className="text-lg font-bold mb-2.5">Wedding Planning Masterclass</h3>
            <p className="text-gray-400 text-sm mb-5">Join our experts discussing 2025 wedding trends</p>
            <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 border-none rounded-xl text-white font-bold hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition-all">
              Watch on YouTube
            </button>
          </div>

          {/* Social Links */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Follow Our Stories</h3>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-4 p-4 bg-white/3 border border-white/5 rounded-xl text-white hover:translate-x-1 hover:border-purple-500/30 transition-all">
                <span className="text-lg">📷</span>
                <div>
                  <div className="font-semibold">Instagram</div>
                  <div className="text-sm text-gray-400">@evea.events</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 bg-white/3 border border-white/5 rounded-xl text-white hover:translate-x-1 hover:border-red-500/30 transition-all">
                <span className="text-lg">▶️</span>
                <div>
                  <div className="font-semibold">YouTube</div>
                  <div className="text-sm text-gray-400">EVEA Events</div>
                </div>
              </a>
            </div>
          </div>

          {/* Trending */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Trending This Week</h3>
            {trendingTopics.map((topic) => (
              <div key={topic.id} className="py-4 border-b border-white/5 last:border-0 hover:translate-x-1 transition-all cursor-pointer">
                <div className="text-2xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-1">
                  #{topic.rank}
                </div>
                <div className="font-semibold mb-1">{topic.title}</div>
                <div className="text-sm text-gray-400">{topic.interactions} interactions</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-10 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Share Your Event Story
            </h2>
            <form className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 font-semibold">Event Type</label>
                <select className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                  <option>Wedding</option>
                  <option>Corporate Event</option>
                  <option>Birthday Party</option>
                  <option>Anniversary</option>
                  <option>Cultural Event</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Title</label>
                <input 
                  type="text" 
                  placeholder="Give your story a title..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Your Experience</label>
                <textarea 
                  rows={6} 
                  placeholder="Share your event experience..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-vertical"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Add Photos</label>
                <div className="p-10 bg-white/2 border-2 border-dashed border-white/10 rounded-xl text-center cursor-pointer hover:border-purple-500/30 transition-colors">
                  <div className="text-4xl mb-2.5">📸</div>
                  <div className="text-gray-400">Click to upload images</div>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Instagram Story Link (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://instagram.com/stories/..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">YouTube Video Link (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/watch?v=..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-4 mt-5">
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                >
                  Post Story
                      </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                      </button>
                    </div>
            </form>
          </div>
        </div>
      )}

      {/* Write Article Modal */}
      {showWriteArticleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-10 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Write an Article
            </h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold">Article Category</label>
                  <select className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                    <option>Planning Tips</option>
                    <option>Vendor Reviews</option>
                    <option>Trend Analysis</option>
                    <option>Success Stories</option>
                    <option>Budget Guides</option>
                    <option>Expert Advice</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Reading Time</label>
                  <select className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                    <option>3-5 min read</option>
                    <option>5-10 min read</option>
                    <option>10-15 min read</option>
                    <option>15+ min read</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Article Title</label>
                <input 
                  type="text" 
                  placeholder="Enter a compelling title for your article..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Article Summary</label>
                <textarea 
                  rows={3} 
                  placeholder="Write a brief summary that will appear as excerpt..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-vertical"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Article Content</label>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex gap-2.5 mb-4 pb-4 border-b border-white/10">
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      H1
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      H2
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <Link className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <List className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2.5 bg-white/10 border-none rounded text-white hover:bg-white/20 transition-all">
                      <Quote className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea 
                    rows={15} 
                    placeholder="Start writing your article here..." 
                    className="w-full p-0 bg-transparent border-none text-white resize-vertical text-base leading-relaxed"
                  ></textarea>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Cover Image</label>
                <div className="p-10 bg-white/2 border-2 border-dashed border-white/10 rounded-xl text-center cursor-pointer hover:border-purple-500/30 transition-colors">
                  <div className="text-4xl mb-2.5">🖼️</div>
                  <div className="text-gray-400">Click to upload cover image (Recommended: 1200x630px)</div>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="wedding, planning tips, mumbai events..." 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-4 mt-5">
                <button 
                  type="button" 
                  className="px-8 py-4 bg-purple-500/20 border border-purple-500 rounded-xl text-purple-500 font-bold hover:bg-purple-500/30 transition-all"
                >
                  Save as Draft
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                >
                  Publish Article
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowWriteArticleModal(false)}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Story Form Modal */}
      {showCreatePostModal && (
        <ShareStoryForm
          onClose={() => setShowCreatePostModal(false)}
          onSubmit={handleStorySubmit}
        />
      )}

      <style jsx>{`
        @keyframes aurora {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}