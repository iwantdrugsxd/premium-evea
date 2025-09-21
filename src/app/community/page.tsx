'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ShareStoryForm from '@/components/community/ShareStoryForm';
import StoryCard from '@/components/community/StoryCard';
import AuthGuard from '@/components/AuthGuard';
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

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  readingTime: string;
  tags: string[];
  coverImage?: File;
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
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Article form state
  const [articleFormData, setArticleFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    category: '',
    readingTime: '',
    tags: [],
    coverImage: undefined
  });

  // Fetch event types from database
  const fetchEventTypes = async () => {
    try {
      const response = await fetch('/api/event-types');
      const data = await response.json();
      if (data.success) {
        setEventTypes(data.data);
      }
    } catch (error) {
      console.error('Error fetching event types:', error);
      // Fallback to default event types if API fails
      setEventTypes([
        { name: 'Wedding', count: 247 },
        { name: 'Birthday', count: 156 },
        { name: 'Corporate', count: 183 },
        { name: 'Anniversary', count: 92 },
        { name: 'Cultural Event', count: 78 },
        { name: 'Custom Event', count: 45 }
      ]);
    }
  };

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
      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('content', storyData.content);
      formData.append('eventType', storyData.eventType);
      formData.append('location', storyData.location || '');
      formData.append('date', storyData.date || '');
      formData.append('tags', JSON.stringify(storyData.tags));
      formData.append('userId', currentUser?.id || 'anonymous');
      
      // Append images
      if (storyData.images && storyData.images.length > 0) {
        storyData.images.forEach((image: File, index: number) => {
          formData.append('images', image);
        });
      }

      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh stories list
        await fetchStories();
        alert('Story shared successfully!');
        setShowCreatePostModal(false); // Close modal on success
      } else {
        throw new Error(data.error || 'Failed to share story');
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      throw error;
    }
  };

  // Handle article submission
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', articleFormData.title);
      formData.append('summary', articleFormData.summary);
      formData.append('content', articleFormData.content);
      formData.append('category', articleFormData.category);
      formData.append('readingTime', articleFormData.readingTime);
      formData.append('tags', JSON.stringify(articleFormData.tags));
      formData.append('userId', currentUser?.id || 'anonymous');
      
      if (articleFormData.coverImage) {
        formData.append('coverImage', articleFormData.coverImage);
      }

      // For now, just log the data - you'll need to create an /api/articles endpoint
      alert('Article functionality coming soon!');
      setShowWriteArticleModal(false);
      
      // Reset form
      setArticleFormData({
        title: '',
        summary: '',
        content: '',
        category: '',
        readingTime: '',
        tags: [],
        coverImage: undefined
      });
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Failed to submit article. Please try again.');
    }
  };

  // Handle article form input changes
  const handleArticleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticleFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle article cover image upload
  const handleArticleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image file size must be less than 5MB.');
        return;
      }
      setArticleFormData(prev => ({ ...prev, coverImage: file }));
    }
  };

  // Handle article tags
  const handleArticleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setArticleFormData(prev => ({ ...prev, tags }));
  };

  // Handle story like
  const handleStoryLike = (storyId: string) => {
    // This will be handled by the StoryCard component
  };

  // Handle story comment
  const handleStoryComment = (storyId: string, content: string) => {
    // This will be handled by the StoryCard component
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      // Since you're already logged in via Passport.js, set your user info directly
      setCurrentUser({ 
        id: 'vishnu-nair', 
        name: 'Vishnu Nair', 
        email: 'vnair0795@gmail.com' 
      });
    } catch (error) {
      console.log('Setting default user info');
      setCurrentUser({ 
        id: 'vishnu-nair', 
        name: 'Vishnu Nair', 
        email: 'vnair0795@gmail.com' 
      });
    }
  };

  // Load stories and user info on component mount
  useEffect(() => {
    fetchStories();
    fetchCurrentUser();
    fetchEventTypes(); // Call fetchEventTypes here
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
      

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-8 lg:pb-12 flex justify-center gap-3 sm:gap-5 flex-wrap">
        {['All Posts', 'Event Stories', 'Vendor Reviews', 'Planning Tips', 'Featured Blogs'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 sm:px-7 py-2 sm:py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-32 relative flex justify-center">
        {/* Left Sidebar */}
        <aside className="lg:fixed lg:top-24 lg:left-4 lg:z-20 h-fit order-2 lg:order-1 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:w-[280px]">
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Event Categories</h3>
            <div className="space-y-3">
              {eventTypes.map((eventType, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 h-20"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(/event-images/${eventType.name.toLowerCase().replace(/\s+/g, '-')}.png)` }}
                  />
                  
                  {/* Dark Overlay for Better Text Readability */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Event Type Name */}
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg tracking-wide">
                      {eventType.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Popular Tags</h3>
            {popularTags.map((tag, index) => (
              <div key={index} className="py-3 text-gray-400 hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                        {tag}
              </div>
                    ))}
                  </div>
        </aside>

        {/* Main Feed */}
        <main className="flex flex-col gap-6 lg:gap-8 order-1 lg:order-2 lg:ml-[320px] lg:mr-[360px] lg:max-w-4xl">
          {/* Featured Blog Post */}
          <article className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <span className="absolute top-5 right-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Featured Blog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
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
                currentUserId={currentUser?.id}
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
        <aside className="lg:fixed lg:top-24 lg:right-4 lg:z-20 h-fit order-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:w-[320px]">
          {/* Live Stream */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/30 rounded-2xl p-4 sm:p-6 mb-6 relative overflow-hidden">
            <span className="absolute top-5 right-5 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
              LIVE
            </span>
            <h3 className="text-lg font-bold mb-2.5">Wedding Planning Masterclass</h3>
            <p className="text-gray-400 text-sm mb-5">Join our experts discussing 2025 wedding trends</p>
            <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 border-none rounded-xl text-white font-bold hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition-all">
              Watch on YouTube
                      </button>
                    </div>

          {/* Trending Topics */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-5">Trending Topics</h3>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={topic.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {topic.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{topic.title}</div>
                    <div className="text-xs text-gray-400">{topic.interactions} interactions</div>
                  </div>
                </div>
            ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 sm:p-6">
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
        </aside>
      </div>

      {/* Modals */}
      {showCreatePostModal && (
        <AuthGuard formName="Share Your Story" onAuthComplete={() => {}}>
          <ShareStoryForm
            onClose={() => setShowCreatePostModal(false)}
            onSubmit={handleStorySubmit}
          />
        </AuthGuard>
      )}

      {showWriteArticleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Write Article
              </h2>
              <button
                onClick={() => setShowWriteArticleModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={articleFormData.title}
                    onChange={handleArticleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter article title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Category *</label>
                  <select
                    name="category"
                    value={articleFormData.category}
                    onChange={handleArticleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="Trend Analysis">Trend Analysis</option>
                    <option value="Vendor Reviews">Vendor Reviews</option>
                    <option value="Planning Tips">Planning Tips</option>
                    <option value="Event Stories">Event Stories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Summary *</label>
                <textarea
                  name="summary"
                  value={articleFormData.summary}
                  onChange={handleArticleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Brief summary of your article..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Content *</label>
                <textarea
                  name="content"
                  value={articleFormData.content}
                  onChange={handleArticleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Reading Time</label>
                  <input
                    type="text"
                    name="readingTime"
                    value={articleFormData.readingTime}
                    onChange={handleArticleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., 5 min read"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={articleFormData.tags.join(', ')}
                    onChange={handleArticleTagsChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., wedding, mumbai, trends"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArticleCoverImageUpload}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWriteArticleModal(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  ✍️ Publish Article
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom CSS for Aurora Animation */}
      <style jsx>{`
        @keyframes aurora {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}