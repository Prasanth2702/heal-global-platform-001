// AffiliatePage.tsx
import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Gift,
  Calendar,
  Award,
  Shield,
  Zap,
  CheckCircle,
  Copy,
  Share2,
  ChevronRight,
  Star,
  Briefcase,
  Globe,
  Settings,
  UserCheck,
  CreditCard,
  FileText,
  Link,
  MousePointer,
  ShoppingCart,
  Percent,
  Clock,
  BookOpen,
  Video,
  Users as UsersIcon,
  MapPin,
  Phone,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Search,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { toast } from '@/hooks/use-toast';
import Header from '../alldetails/Header';
import Footer from '../alldetails/Footer';

const AffiliatePage = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);

  // Check if user is authenticated (logged in or registered)
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAffiliateAuthenticated');
      const registered = localStorage.getItem('affiliateRegistered');
      const affiliateId = localStorage.getItem('affiliate_id');
      const storedUser = localStorage.getItem('affiliateUser');
      
      if ((authStatus === 'true' || registered === 'true') && affiliateId) {
        setIsAuthenticated(true);
        
        // Load affiliate data from localStorage
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setAffiliateData({
              id: parsedUser.id || affiliateId,
              name: parsedUser.name || "Affiliate User",
              tier: "single",
              // tier: parsedUser.tier || "single",
              earnings: parsedUser.earnings || 210.5,
              referrals: parsedUser.referrals || 54,
              conversionRate: parsedUser.conversionRate || 1.8,
              joinedDate: parsedUser.joinedDate || "2026-01-15"
            });
          } catch (e) {
            console.error('Error parsing affiliate user data:', e);
            setDefaultAffiliateData(affiliateId);
          }
        } else {
          setDefaultAffiliateData(affiliateId);
        }
      } else {
        // Not authenticated, redirect to login
        navigate('/affiliate-login');
      }
      setIsLoading(false);
    };

    const setDefaultAffiliateData = (affiliateId) => {
      setAffiliateData({
        id: affiliateId || "AFF-2024-7890-XYZ",
        name: "Affiliate User",
        tier: "single",
        earnings: 210.5,
        referrals: 54,
        conversionRate: 1.8,
        joinedDate: "2026-01-15"
      });
    };

    checkAuth();
  }, [navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
  // Clear all cookies
  const cookies = new Cookies();
  cookies.remove('affiliate_id');
  cookies.remove('isAffiliateAuthenticated');
  cookies.remove('affiliateRegistered');
  cookies.remove('affiliateUser');
  
  // Clear localStorage as backup
  localStorage.removeItem('affiliate_id');
  localStorage.removeItem('isAffiliateAuthenticated');
  localStorage.removeItem('affiliateRegistered');
  localStorage.removeItem('affiliateUser');
  
  // Clear any other affiliate-related items
  localStorage.removeItem('affiliateRememberMe');
  localStorage.removeItem('affiliateEmail');
  
  // Optional: Clear session storage if you're using it
  sessionStorage.clear();
  
  // Show logout success message
  toast({
    title: "Logged Out",
    description: "You have been successfully logged out.",
    duration: 3000,
  });
  
  // Redirect to login
  navigate('/affiliate-login');
};

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !affiliateData) {
    return null;
  }

  return (
    <>
    <Header/>
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section with Affiliate Profile */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Affiliate Dashboard</h1>
                  <p className="text-indigo-100 text-lg">Your Complete Affiliate Management Platform</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 text-gray-900 p-3 rounded-full">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Your Affiliate ID</p>
                  <p className="font-mono text-lg font-bold">{affiliateData.id}</p>
                </div>
              </div>
  
            </div>
            {/* Logout Button */}
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Earnings', value: `$${affiliateData.earnings.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
            { label: 'Referrals', value: affiliateData.referrals, icon: Users, color: 'bg-blue-500' },
            { label: 'Conv. Rate', value: `${affiliateData.conversionRate}%`, icon: Target, color: 'bg-purple-500' },
            { label: 'Tier Level', value: affiliateData.tier, icon: Shield, color: 'bg-amber-500' },
            { label: 'Member Since', value: new Date(affiliateData.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Calendar, color: 'bg-indigo-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-5 flex items-center gap-4 border border-gray-100">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-2 flex flex-wrap gap-2">
          {['overview'].map((tab) => (
          // {['overview', 'earnings', 'products', 'Affiliate Events', 'job-portal', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Affiliate Link Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Link className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Unique Affiliate Link</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm break-all">
                      http://cloudhospitals.ai/?affid={affiliateData.id}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(`http://cloudhospitals.ai/?affid=${affiliateData.id}`)}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        )}

       
{activeTab === 'Affiliate Events' && (
  <div className="space-y-6">
    {/* Event Type Filter Tabs */}
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-3 rounded-lg">
          <Calendar className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Medical & Healthcare Affiliate Events</h2>
      </div>
      
      {/* Category Filter Buttons - Updated */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['All Events', 'Conferences', 'Seminars', 'Masterclasses', 'Courses'].map((cat, idx) => (
          <button
            key={idx}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              idx === 0 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid - Updated with Conferences, Seminars, Masterclasses, Courses */}
      <div className="space-y-6">
        {[
          {
            title: 'International Medical Education Summit',
            date: 'September 12-15, 2025',
            location: 'Boston, MA & Virtual',
            speakers: ['Dr. Sarah Chen', 'Prof. Michael Roberts', 'Dr. Amanda Foster'],
            price: '$599',
            type: 'Conference',
            credits: '25 CME Credits',
            affiliateCommission: '15%',
            attendees: '500+',
            category: 'Conference'
          },
          {
            title: 'Advanced Cardiac Life Support Conference',
            date: 'October 18-20, 2025',
            location: 'Cleveland Clinic, OH',
            speakers: ['Dr. James Wilson', 'Dr. Patricia Martinez', 'Dr. Robert Kim'],
            price: '$699',
            type: 'Conference',
            credits: '22 CME Credits',
            affiliateCommission: '15%',
            attendees: '300+',
            category: 'Conference'
          },
          {
            title: 'Minimally Invasive Surgery Masterclass',
            date: 'November 8-10, 2025',
            location: 'Johns Hopkins Hospital, Baltimore',
            speakers: ['Dr. Michael Brown', 'Dr. Jennifer Lee'],
            price: '$899',
            type: 'Masterclass',
            credits: '18 CME Credits',
            affiliateCommission: '20%',
            attendees: '40',
            category: 'Masterclass'
          },
          {
            title: 'Robotic Surgery Techniques Masterclass',
            date: 'December 5-7, 2025',
            location: 'Stanford Medical Center, CA',
            speakers: ['Dr. David Chen', 'Dr. Lisa Wong'],
            price: '$999',
            type: 'Masterclass',
            credits: '20 CME Credits',
            affiliateCommission: '20%',
            attendees: '35',
            category: 'Masterclass'
          },
          {
            title: 'Digital Health & Telemedicine Seminar',
            date: 'November 8, 2025',
            location: 'Virtual Event',
            speakers: ['Dr. Robert Kim', 'Prof. Emily Thompson', 'Dr. David Park'],
            price: '$199',
            type: 'Seminar',
            credits: '6 CME Credits',
            affiliateCommission: '25%',
            attendees: '1000+',
            category: 'Seminar'
          },
          {
            title: 'Healthcare AI Implementation Seminar',
            date: 'January 15, 2026',
            location: 'Virtual Event',
            speakers: ['Dr. Alan Turing', 'Dr. Grace Hopper'],
            price: '$249',
            type: 'Seminar',
            credits: '8 CME Credits',
            affiliateCommission: '25%',
            attendees: '750+',
            category: 'Seminar'
          },
          {
            title: 'Board Review Course: Internal Medicine',
            date: 'February 10-14, 2026',
            location: 'Miami, FL & Virtual',
            speakers: ['Dr. Richard Taylor', 'Dr. Maria Garcia', 'Dr. John Smith'],
            price: '$499',
            type: 'Course',
            credits: '35 CME Credits',
            affiliateCommission: '30%',
            attendees: '2000+',
            category: 'Course'
          },
          {
            title: 'USMLE Step 1 Preparation Course',
            date: 'Ongoing Enrollment',
            location: 'On-Demand',
            speakers: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
            price: '$399',
            type: 'Course',
            credits: '50 CME Credits',
            affiliateCommission: '30%',
            attendees: '5000+',
            category: 'Course'
          }
        ].map((event, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                {/* Event Type Badges - Updated colors */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    event.type === 'Conference' ? 'bg-purple-100 text-purple-700' :
                    event.type === 'Masterclass' ? 'bg-amber-100 text-amber-700' :
                    event.type === 'Seminar' ? 'bg-blue-100 text-blue-700' :
                    event.type === 'Course' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {event.type}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {event.credits}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    👥 {event.attendees}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    <span className="text-sm">{event.speakers.length} Speakers</span>
                  </div>
                </div>
                
                {/* Speakers */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.speakers.map((speaker, sidx) => (
                    <span key={sidx} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
                      🎤 {speaker}
                    </span>
                  ))}
                </div>

                {/* Affiliate Benefits */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Commission: {event.affiliateCommission}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-600 text-sm">45-day cookie</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-600 text-sm">Recurring commissions</span>
                </div>
              </div>
              
              <div className="lg:text-right flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{event.price}</div>
                  <p className="text-xs text-gray-500">Early bird available</p>
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                  Promote Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Affiliate Promotion Stats - Updated */}
    <div className="grid md:grid-cols-4 gap-6">
      {[
        { label: 'Conferences', value: '18+', commission: 'Up to 15%', icon: Award },
        { label: 'Masterclasses', value: '12+', commission: 'Up to 20%', icon: TrendingUp },
        { label: 'Seminars', value: '15+', commission: 'Up to 25%', icon: Users },
        { label: 'Courses', value: '24+', commission: 'Up to 30%', icon: BookOpen }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <stat.icon className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-600">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-green-600 font-medium mt-1">{stat.commission}</p>
        </div>
      ))}
    </div>
  </div>
)}
{activeTab === 'products' && (
  <div className="space-y-6">
    {/* Products Header */}
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Education Products</h2>
          <p className="text-gray-600 mt-1">Promote CME conferences, masterclasses, courses & seminars worldwide</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search medical events..." 
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            All Events
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Conferences', 'Seminars', 'Masterclasses', 'Courses'].map((cat, idx) => (
          <button key={idx} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            idx === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* Product Categories */}
    <div className="grid md:grid-cols-4 gap-6">
      {/* Conferences */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Medical Conferences</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'World Cardiology Summit 2024', commission: '15%', price: 599, sales: 234, rating: 4.9, location: 'Boston, MA & Remote', date: 'Sep 12-15' },
            { name: 'International Neurology Conference', commission: '15%', price: 649, sales: 156, rating: 4.8, location: 'London & Remote', date: 'Oct 5-8' },
            { name: 'Global Pediatrics Congress', commission: '15%', price: 549, sales: 189, rating: 4.7, location: 'Remote Only', date: 'Nov 2-5' },
            { name: 'Advances in Oncology', commission: '15%', price: 699, sales: 212, rating: 4.9, location: 'Chicago & Remote', date: 'Dec 3-6' }
          ].map((product, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {product.location}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {product.commission}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-600">{product.sales} registrations</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Promote
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1">
          View All  <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Masterclasses */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Surgical Masterclasses</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Robotic Surgery Masterclass', commission: '20%', price: 899, sales: 67, rating: 4.9, location: 'Remote Live', date: 'Nov 8-10' },
            { name: 'Advanced Cardiac Surgery', commission: '20%', price: 999, sales: 45, rating: 4.8, location: 'Remote Only', date: 'Dec 5-7' },
            { name: 'Minimally Invasive Techniques', commission: '20%', price: 849, sales: 78, rating: 4.7, location: 'Remote Live', date: 'Jan 15-17' },
            { name: 'Neurosurgery Virtual Workshop', commission: '20%', price: 1099, sales: 34, rating: 4.9, location: 'Remote Only', date: 'Feb 10-12' }
          ].map((product, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Video className="w-3 h-3" /> {product.location}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {product.commission}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-600">{product.sales} seats</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Promote
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1">
          View All Masterclasses <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Courses & Seminars */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Seminars</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Board Review: Internal Medicine', commission: '30%', price: 399, sales: 445, rating: 4.8, location: 'On-Demand', recurring: true },
            { name: 'CME Credit Subscription', commission: '30%', price: 199, sales: 789, rating: 4.7, location: 'Remote', recurring: true },
            { name: 'Telemedicine Seminar Series', commission: '25%', price: 149, sales: 567, rating: 4.6, location: 'Remote Live', recurring: false },
            { name: 'Healthcare AI Implementation', commission: '25%', price: 249, sales: 234, rating: 4.8, location: 'Remote Only', recurring: false }
          ].map((product, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    {product.recurring && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">${product.price}{product.recurring ? '/mo' : ''}</p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {product.location}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {product.commission}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-600">{product.sales} enrolled</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Promote
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1">
          View All Seminar <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Courses </h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Board Review: Internal Medicine', commission: '30%', price: 399, sales: 445, rating: 4.8, location: 'On-Demand', recurring: true },
            { name: 'CME Credit Subscription', commission: '30%', price: 199, sales: 789, rating: 4.7, location: 'Remote', recurring: true },
            { name: 'Telemedicine Seminar Series', commission: '25%', price: 149, sales: 567, rating: 4.6, location: 'Remote Live', recurring: false },
            { name: 'Healthcare AI Implementation', commission: '25%', price: 249, sales: 234, rating: 4.8, location: 'Remote Only', recurring: false }
          ].map((product, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    {product.recurring && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">${product.price}{product.recurring ? '/mo' : ''}</p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {product.location}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {product.commission}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-600">{product.sales} enrolled</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Promote
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1">
          View All Courses <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Top Performing Medical Events */}
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Top Performing Medical Events This Month</h3>
        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          View Performance Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Event Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Commission</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Registrations</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Earnings</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CR</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'World Cardiology Summit', category: 'Conference', commission: '15%', sales: 45, earnings: 26955, cr: '4.8%', location: 'Remote' },
              { name: 'Robotic Surgery Masterclass', category: 'Masterclass', commission: '20%', sales: 38, earnings: 34162, cr: '3.9%', location: 'Remote Live' },
              { name: 'Board Review: Internal Med', category: 'Course', commission: '30%', sales: 52, earnings: 20748, cr: '5.1%', location: 'On-Demand' },
              { name: 'Telemedicine Seminar', category: 'Seminar', commission: '25%', sales: 63, earnings: 9419, cr: '4.2%', location: 'Remote' },
              { name: 'CME Subscription Plan', category: 'Course', commission: '30%', sales: 71, earnings: 4257, cr: '6.3%', location: 'Remote' }
            ].map((product, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{product.commission}</td>
                <td className="px-4 py-3 text-gray-900">{product.sales}</td>
                <td className="px-4 py-3 text-gray-900">${product.earnings.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{product.cr}</td>
                <td className="px-4 py-3">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                    {product.location}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Promote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    
  </div>
)}

      </div>

     <Footer/>
    </div>
    </>
  );
};

export default AffiliatePage;