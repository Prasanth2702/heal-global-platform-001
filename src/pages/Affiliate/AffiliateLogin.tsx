// AffiliateLink.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  Zap,
  CheckCircle,
  Copy,
  Share2,
  Users,
  Award,
  Clock,
  Globe,
  Gift,
  BarChart3,
  AlertCircle,
  XCircle,
  Check,
  Loader
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '../alldetails/Header';
import Footer from '../alldetails/Footer';

// Supabase configuration
const SUPABASE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/affiliate-signup`;

const AffiliateLogin = () => {
  const navigate = useNavigate();
  const [affiliateId, setAffiliateId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAffiliate, setIsCreatingAffiliate] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('advantages');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Base URL for affiliate program
  const baseUrl = window.location.origin;

  // Advantages data
  const advantages = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'High Commission Rates',
      description: 'Earn up to 40% recurring commissions on all sales',
      color: 'from-blue-500 to-blue-600',
      features: ['30% average commission', 'Tiered bonus structure', 'Performance incentives']
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '120-Day Cookie Duration',
      description: 'Get credited for sales even if they purchase later',
      color: 'from-green-500 to-green-600',
      features: ['Industry leading cookie life', 'Cross-device tracking', 'Attribution window']
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Dedicated Manager',
      description: 'Personal affiliate manager to help you succeed',
      color: 'from-purple-500 to-purple-600',
      features: ['24/7 priority support', 'Strategy consulting', 'Performance reviews']
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-Time Analytics',
      description: 'Track clicks, conversions, and earnings instantly',
      color: 'from-amber-500 to-amber-600',
      features: ['Live dashboard', 'Custom reports', 'Conversion tracking']
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Program',
      description: 'Promote in over 150 countries worldwide',
      color: 'from-indigo-500 to-indigo-600',
      features: ['Multi-currency', 'Localized tracking', 'International payments']
    }
  ];

  // Disadvantages/Considerations data
  const considerations = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Minimum Payout: $50',
      description: 'Accumulate at least $50 before withdrawing',
      solution: 'Average affiliates reach this in 2-3 weeks',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Regional Restrictions',
      description: 'Program availability varies by country',
      solution: 'Check eligibility list - 150+ countries supported',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Monthly Activity Required',
      description: 'Need at least 1 referral per month',
      solution: 'Email campaigns and content updates help maintain activity',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Approval Process',
      description: 'New affiliates require manual review',
      solution: 'Typically approved within 24-48 hours',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Check authentication status on mount
  useEffect(() => {
    checkAuthAndAffiliateStatus();
  }, []);

  const checkAuthAndAffiliateStatus = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
      }

      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
      }

      // Check URL for affid parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlAffId = urlParams.get('affid') || urlParams.get('ref');
      
      // Check localStorage
      const storedAffId = localStorage.getItem('affiliate_id');
      
      // Check cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      
      const cookieAffId = getCookie('affiliate_id');
      
      // Use the first available affiliate ID
      const existingId = urlAffId || storedAffId || cookieAffId;
      
      if (existingId) {
        // User has affiliate ID - send to dashboard
        setAffiliateId(existingId);
        setSuccess('Affiliate ID found! Redirecting to dashboard...');
        
        // Store in all locations for consistency
        localStorage.setItem('affiliate_id', existingId);
        document.cookie = `affiliate_id=${existingId};path=/;max-age=31536000;SameSite=Lax`;
        
        // Short delay before redirect
        setTimeout(() => {
          navigate('/affiliate-dashboard');
        }, 1500);
      } else {
        // No affiliate ID found - we'll show the signup form
        setAffiliateId('');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error checking affiliate status:', err);
      setError('Error checking affiliate status');
      setIsLoading(false);
    }
  };

  // Handle affiliate signup
  const handleAffiliateSignup = async () => {
    setIsCreatingAffiliate(true);
    setError('');
    setSuccess('');

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (!session) {
        // Redirect to login if not authenticated
        setError('Please log in to join the affiliate program');
        setTimeout(() => {
          navigate('/login', { state: { from: '/affiliate-signup' } });
        }, 2000);
        return;
      }

      const authToken = session.access_token;
      const userId = session.user.id;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };
      console.log('Creating affiliate with user ID:', userId);
      console.log('Auth token:', authToken);

      // Call Supabase function to create affiliate
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          user_id: userId 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Access denied: Invalid permissions');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later');
        }
        
        throw new Error(data.error || data.message || 'Failed to create affiliate account');
      }

     // In handleAffiliateSignup function, update the existing affiliate section:

// Check if user is already an affiliate
if (data.data?.is_existing) {
  const existingAffiliateId = data.data.affiliate_code;
  
  setAffiliateId(existingAffiliateId);
  setSuccess('Welcome back! Redirecting to your affiliate dashboard...');
  
  // Store affiliate data
  localStorage.setItem('affiliate_id', existingAffiliateId);
  localStorage.setItem('isAffiliateAuthenticated', 'true');
  localStorage.setItem('affiliateRegistered', 'true');
  
  // Store affiliate user data
  const affiliateData = {
    id: existingAffiliateId,
    name: data.data.profile?.name || 'Affiliate User',
    tier: 'Premium Partner',
    earnings: 0,
    referrals: 0,
    conversionRate: 0,
    joinedDate: data.data.created_at || new Date().toISOString().split('T')[0],
    email: data.data.profile?.email
  };
  
  localStorage.setItem('affiliateUser', JSON.stringify(affiliateData));
  
  // Redirect to dashboard
  setTimeout(() => {
    navigate('/affiliate-dashboard');
  }, 2000);
  
  return; // Important: stop execution here
}

    } catch (err) {
      console.error('Error creating affiliate:', err);
      
      // Set user-friendly error message
      let errorMessage = 'Failed to create affiliate account. ';
      
      if (err.message.includes('Unauthorized') || err.message.includes('log in')) {
        errorMessage += 'Please log in and try again.';
      } else if (err.message.includes('permission')) {
        errorMessage += 'You do not have permission.';
      } else if (err.message.includes('network')) {
        errorMessage += 'Network error. Please check your connection.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setError(errorMessage);
      
    } finally {
      setIsCreatingAffiliate(false);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/affiliate-signup' } });
  };

  // Handle copy link
  const handleCopyLink = () => {
    if (affiliateId) {
      navigator.clipboard.writeText(`${baseUrl}?affid=${affiliateId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-semibold text-gray-900">Checking Affiliate Status</h2>
            <p className="mt-2 text-gray-600">Looking for your affiliate ID...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show signup page if no affiliate ID
  if (!affiliateId) {
    return (
        <>
        <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Our Affiliate Program
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start earning commissions today with industry-leading rates and dedicated support
            </p>
          </div>

          {/* Authentication Status */}
          {!isAuthenticated && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium">Authentication Required</p>
                  <p className="text-blue-600 text-sm mb-2">You need to be logged in to join the affiliate program.</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Success</p>
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-gray-600 mb-8">
                Join thousands of successful affiliates who are already earning passive income
              </p>
              <button
                onClick={handleAffiliateSignup}
                disabled={isCreatingAffiliate || !isAuthenticated}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingAffiliate ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Account...
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Login Required
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Create Your Affiliate Account
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Free to join • Instant access
              </p>
            </div>
          </div>
                  <h1 className="text-xl font-bold mb-2 ">✅ Advantages</h1>   
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${advantage.color} bg-opacity-10 mb-4`}>
                    <div className="text-white">{advantage.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{advantage.title}</h3>
                  <p className="text-gray-600 mb-4">{advantage.description}</p>
                  <ul className="space-y-2">
                    {advantage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
       
        </div>
      </div>
      <Footer/>
      </>
    );
  }

  // Should not reach here - will redirect
  return null;
};

export default AffiliateLogin;