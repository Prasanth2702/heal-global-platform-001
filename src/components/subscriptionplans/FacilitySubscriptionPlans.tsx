// pages/FacilitySubscriptionPlans.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Building2, Users, Stethoscope, Bed, CreditCard, BarChart3, AlertCircle, PhoneIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SubscriptionCheckout from './SubscriptionCheckout';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BillingCycle = 'monthly' | 'yearly';

interface SubscriptionTier {
  tier_id: string;
  tier_name: string;
  user_type: string;
  max_free_clinical_consults: number;
  max_tele_consults: number;
  max_staff: number;
  max_departments: number;
  max_beds: number;
  includes_billing: boolean;
  includes_analytics: boolean;
  monthly_price: number;
  yearly_price: number | null;
  tele_consultation_duration: number;
  is_available: boolean;
  description:string;
}

interface ActiveSubscription {
  subscription_id: string;
  tier_id: string;
  facility_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  consults_used_clinical: number;
  consults_used_tele: number;
   tier_name?: string;
}

const FacilitySubscriptionPlans = () => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [facilityID, setFacilityID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<ActiveSubscription | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
const [showLimitMessage, setShowLimitMessage] = useState(true);
const [showContactPopup, setShowContactPopup]  = useState(false);
  // Fetch logged-in doctor's professional ID
  useEffect(() => {
    const fetchProfessional = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('facilities')
          .select('id')
          .eq('admin_user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching professional:', error);
        } else if (data) {
          setFacilityID(data.id);
        }
      }
    };
    fetchProfessional();
  }, []);

  // Fetch current active subscription
  const fetchCurrentSubscription = async () => {
    if (!facilityID) return;
    try {
      const { data, error } = await supabase
        .from('active_subscriptions')
        .select('*,subscription_tiers (tier_name)')
        .eq('facility_id', facilityID)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      
      
     if (data) {
  const formattedData = {
    ...data,
    tier_name: data.subscription_tiers?.tier_name,
  };

  const isExpired =
    formattedData.end_date &&
    new Date(formattedData.end_date) < new Date();

  if (!isExpired) {
    setCurrentSubscription(formattedData);
    setHasActiveSubscription(true);
    return;
  }
}
      setCurrentSubscription(null);
      setHasActiveSubscription(false);
    } catch (err) {
      console.error('Error fetching active subscription:', err);
      setHasActiveSubscription(false);
    }
  };

  // Fetch subscription tiers from database
  useEffect(() => {
    const fetchTiers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('subscription_tiers')
          .select('*')
          .eq('user_type', 'facility')
          .eq('is_available', true)
          .order('monthly_price', { ascending: true });

        if (error) throw error;
        setTiers(data || []);
      } catch (err) {
        console.error('Error fetching tiers:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  // Fetch current subscription when FacilityID is available
  useEffect(() => {
    if (facilityID) {
      fetchCurrentSubscription();
    }
  }, [facilityID]);

  // Build feature list from tier columns
  const getFeatures = (tier: SubscriptionTier) => {
    const features = [];

    if (tier.max_free_clinical_consults > 0) {
      features.push(`${tier.max_free_clinical_consults === 999999 ? 'Unlimited' : tier.max_free_clinical_consults} Clinical Consultations / month`);
    } else if (tier.max_free_clinical_consults === 0) {
      features.push('0 Clinical Consultations (pay per use)');
    }

    if (tier.max_tele_consults > 0) {
      features.push(`${tier.max_tele_consults === 999999 ? 'Unlimited' : tier.max_tele_consults} Tele Consultations / month`);
    } else if (tier.max_tele_consults === 0) {
      features.push('0 Tele Consultations');
    }

    if (tier.tele_consultation_duration > 0) {
      features.push(`${tier.tele_consultation_duration} minutes per Tele session`);
    }

    if (tier.max_staff > 0) {
      features.push(`${tier.max_staff === 999999 ? 'Unlimited' : tier.max_staff} Staff members`);
    } else if (tier.max_staff === 0) {
      features.push('No staff members');
    }

    if (tier.max_departments > 0) {
      features.push(`${tier.max_departments === 999999 ? 'Unlimited' : tier.max_departments} Departments`);
    }

    if (tier.max_beds > 0) {
      features.push(`${tier.max_beds === 999999 ? 'Unlimited' : tier.max_beds} Beds`);
    }

    if (tier.includes_billing) features.push('Billing & Invoicing included');
    if (tier.includes_analytics) features.push('Advanced Analytics Dashboard');

    return features;
  };

  // Helper to determine icon and colour based on tier name/price
  const getTierStyle = (tier: SubscriptionTier, index: number) => {
    const price = tier.monthly_price;
    if (price === 0) {
      return {
        icon: <Sparkles className="h-8 w-8" />,
        color: 'from-blue-500 to-cyan-500',
        badge: 'FREE',
        popular: false,
      };
    }
    if (price <= 1999) {
      return {
        icon: <Stethoscope className="h-8 w-8" />,
        color: 'from-purple-600 to-pink-600',
        badge: index === 1 ? 'POPULAR' : '',
        popular: index === 1,
      };
    }
    return {
      icon: <Building2 className="h-8 w-8" />,
      color: 'from-emerald-500 to-teal-500',
      badge: 'ENTERPRISE',
      popular: false,
    };
  };

  // Update medical_professionals table after successful subscription
  const updateProfessionalAfterSubscription = async () => {
    if (!facilityID) return;
    setUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from('facilities')
        .update({
          subscription_status: 'active',
          profile_visibility: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', facilityID);

      if (error) throw error;
      toast({
        title: 'Subscription Activated',
        description: 'Your profile is now visible and subscription is active.',
      });
      // Refresh the current subscription status
      await fetchCurrentSubscription();
    } catch (err) {
      console.error('Error updating professional after subscription:', err);
      toast({
        title: 'Warning',
        description: 'Subscription created but failed to update profile visibility. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const selectedTier = tiers.find(t => t.tier_id === selectedTierId);
  const currentPrice = selectedTier
    ? billingCycle === 'monthly'
      ? selectedTier.monthly_price
      : selectedTier.yearly_price ?? selectedTier.monthly_price * 12
    : 0;

  // Loading / error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tiers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No subscription plans available at the moment.</p>
      </div>
    );
  }



  return (
    <>
    {hasActiveSubscription && currentSubscription && (
  <div className="max-w-7xl mx-auto mt-3">
    <Card className="border-green-300 shadow-lg bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-6 w-6" />
          Current Active Plan
        </CardTitle>

        <CardDescription className="text-green-700">
          Your subscription is currently active and running successfully.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <p className="text-sm text-gray-500">Current Plan</p>

            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {currentSubscription.tier_name}
            </h3>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <p className="text-sm text-gray-500">Start Date</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {new Date(
                currentSubscription.start_date
              ).toLocaleDateString()}
            </h3>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <p className="text-sm text-gray-500">Renewal Date</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {currentSubscription.end_date
                ? new Date(
                    currentSubscription.end_date
                  ).toLocaleDateString()
                : "Lifetime"}
            </h3>
          </div>
        </div>

      </CardContent>
    </Card>
  </div>
)}

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Subscription Plan
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your practice. Upgrade anytime.
          </p>
        </div>

        {/* Billing Toggle - disabled if already subscribed, but we already blocked above */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly <span className="text-green-500 text-xs ml-1">Save up to 20%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => {
            const style = getTierStyle(tier, idx);
            const price = billingCycle === 'monthly' ? tier.monthly_price : (tier.yearly_price ?? tier.monthly_price * 12);
            const features = getFeatures(tier);

            return (
              <div
                key={tier.tier_id}
                className={`relative rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedTierId === tier.tier_id
                    ? 'ring-4 ring-blue-500 shadow-2xl'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => !hasActiveSubscription && setSelectedTierId(tier.tier_id)}
              >
                {style.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 POPULAR
                    </span>
                  </div>
                )}
                <div className={`bg-white rounded-2xl overflow-hidden border ${
                  selectedTierId === tier.tier_id ? 'border-blue-500' : 'border-gray-200'
                }`}>
                  <div className={`bg-gradient-to-r ${style.color} p-6 text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white/20 rounded-xl">
                        {style.icon}
                      </div>
                      {price === 0 && (
                        <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                          FREE
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mt-4">{tier.tier_name}</h3>
                    <p className="text-white/80 text-sm mt-1">
                      {tier.max_free_clinical_consults > 0 ? 'Includes clinical consults' : 'Pay as you go'}
                    </p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ₹{price}
                      </span>
                      {price > 0 && (
                        <span className="text-white/80 text-sm ml-1">
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
           {showLimitMessage && (
  <div className="mb-8">
    <Card className="border-blue-300 shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-blue-700">
            For Customized subscription plan
          </CardTitle>

          <CardDescription className="mt-1 text-gray-600">
            Contact our support team for assistance.
          </CardDescription>
        </div>

      </CardHeader>

      <CardContent>
        <div className="text-center py-8 space-y-4 border rounded-lg bg-blue-50 border-blue-200">
          <AlertCircle className="h-12 w-12 text-blue-600 mx-auto" />

          <h3 className="text-lg font-semibold text-blue-800">
            Contact Our Support Team
          </h3>

          <p className="text-blue-700 max-w-md mx-auto leading-relaxed">
            We are here to help you manage your subscription, upgrade your
            account, activate advanced features, and resolve any platform-related
            issues quickly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-center justify-center space-x-2 py-6">
          <PhoneIcon className="h-5 w-5 text-primary" />

          <a
            href="tel:+919886499994"
            className="text-xl font-medium text-primary underline"
          >
            +91 98864 99994
          </a>
        </div>
          </div>
        </div>
      </CardContent>
    </Card>

  </div>
)}
        </div>

        {/* Checkout Section */}
        {selectedTier && !hasActiveSubscription && (
          <div className="mt-12 max-w-md mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Complete Subscription</h3>
                <p className="text-gray-500 text-sm mt-1">
                  You have selected <strong>{selectedTier.tier_name}</strong> ({billingCycle})
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan price</span>
                  <span className="font-semibold">₹{currentPrice}</span>
                </div>
                {billingCycle === 'yearly' && selectedTier.yearly_price && selectedTier.monthly_price > 0 && (
                  <div className="flex justify-between text-sm mt-2 text-green-600">
                    <span>You save</span>
                    <span>₹{(selectedTier.monthly_price * 12) - selectedTier.yearly_price}</span>
                  </div>
                )}
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{currentPrice}</span>
                </div>
              </div>
              <SubscriptionCheckout
                tierId={selectedTier.tier_id}
                facilityId={facilityID}
                planName={selectedTier.tier_name}
                billingCycle={billingCycle}
                onSuccess={updateProfessionalAfterSubscription}
              />
            </div>
          </div>
        )}

        {updatingProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Updating your profile...</span>
            </div>
          </div>
        )}
      </div>
{hasActiveSubscription && currentSubscription &&(
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-200">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You already have an active subscription!</h2>
            <p className="text-gray-600 mb-6">
              Your {currentSubscription.tier_id} plan is currently active.
              {currentSubscription.end_date && (
                <span> Renewal date: {new Date(currentSubscription.end_date).toLocaleDateString()}</span>
              )}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/dashboard/facility'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>)}
    </div>
    </>
  );
};

export default FacilitySubscriptionPlans;