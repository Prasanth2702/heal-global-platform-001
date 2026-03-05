import React, { useState } from 'react';
import { Calendar, User, Clock, Tag, Search, ChevronRight, Heart, MessageCircle, Share2 } from 'lucide-react';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  likes: number;
  comments: number;
  featured?: boolean;
}

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Tips for Maintaining Heart Health During Winter",
      excerpt: "Discover essential tips to keep your heart healthy and strong during the cold winter months...",
      content: "Full content here...",
      author: "Dr. Sarah Johnson",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Cardiology",
      tags: ["Heart Health", "Winter Care", "Prevention"],
      image: "/api/placeholder/800/400",
      likes: 234,
      comments: 45,
      featured: true
    },
    {
      id: 2,
      title: "Understanding Mental Health: A Complete Guide",
      excerpt: "Learn about the importance of mental health and strategies to maintain emotional wellbeing...",
      content: "Full content here...",
      author: "Dr. Michael Chen",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      category: "Mental Health",
      tags: ["Mental Health", "Wellness", "Self-Care"],
      image: "/api/placeholder/800/400",
      likes: 456,
      comments: 78
    },
    {
      id: 3,
      title: "The Role of Nutrition in Disease Prevention",
      excerpt: "Explore how proper nutrition can help prevent various diseases and promote overall health...",
      content: "Full content here...",
      author: "Dr. Emily Rodriguez",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Nutrition",
      tags: ["Nutrition", "Prevention", "Healthy Eating"],
      image: "/api/placeholder/800/400",
      likes: 189,
      comments: 34
    },
    {
      id: 4,
      title: "Managing Diabetes: Modern Approaches and Tips",
      excerpt: "Latest insights into diabetes management, including medication, diet, and lifestyle changes...",
      content: "Full content here...",
      author: "Dr. James Wilson",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Diabetes",
      tags: ["Diabetes", "Management", "Lifestyle"],
      image: "/api/placeholder/800/400",
      likes: 312,
      comments: 56
    },
    {
      id: 5,
      title: "Yoga for Back Pain Relief",
      excerpt: "Simple yoga poses and stretches to alleviate back pain and improve posture...",
      content: "Full content here...",
      author: "Priya Patel",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 5, 2024",
      readTime: "4 min read",
      category: "Wellness",
      tags: ["Yoga", "Back Pain", "Exercise"],
      image: "/api/placeholder/800/400",
      likes: 267,
      comments: 41
    },
    {
      id: 6,
      title: "Children's Vaccination Schedule: What Parents Need to Know",
      excerpt: "Complete guide to childhood vaccinations, including schedule and important information...",
      content: "Full content here...",
      author: "Dr. Lisa Thompson",
      authorAvatar: "/api/placeholder/40/40",
      date: "Dec 3, 2024",
      readTime: "6 min read",
      category: "Pediatrics",
      tags: ["Vaccination", "Children", "Prevention"],
      image: "/api/placeholder/800/400",
      likes: 198,
      comments: 29
    }
  ];

  const categories = [
    'all',
    'Cardiology',
    'Mental Health',
    'Nutrition',
    'Diabetes',
    'Wellness',
    'Pediatrics',
    'Prevention'
  ];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Healthcare Insights Blog</h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert health advice, medical insights, and wellness tips from our healthcare professionals
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search articles by topic, symptom, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Search className="absolute right-4 top-4 text-gray-400" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && searchTerm === '' && selectedCategory === 'all' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={16} />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={featuredPost.authorAvatar} 
                      alt={featuredPost.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.date}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart size={18} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="hover:text-blue-600 transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Subscription */}
      <section className="bg-blue-50 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated with Health Tips</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and get the latest health insights delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default Blog;