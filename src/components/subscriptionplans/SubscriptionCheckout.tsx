// // components/SubscriptionCheckout.tsx
// import React, { useState } from 'react';
// import { supabase } from '@/integrations/supabase/client';

// interface SubscriptionCheckoutProps {
//   tierId: string;
//   professionalId?: string | null;
//   facilityId?: string | null;
//   planName: string;
//   billingCycle?: 'monthly' | 'yearly';
//   amount?: number;
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({
//   tierId,
//   professionalId,
//   facilityId = null,
//   planName,
//   billingCycle = 'monthly',
//   onSuccess,
//   onError,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

//   // Load Razorpay script dynamically
//   const loadRazorpayScript = (): Promise<boolean> => {
//     return new Promise((resolve) => {
//       if ((window as any).Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleSubscribe = async () => {
//     setLoading(true);
//     setPaymentStatus('creating_subscription');

//     try {
//       // Get current session for auth
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();
//       if (sessionError || !session) throw new Error('Not authenticated');


//       const accessToken = session?.access_token;
//       // 1. Create subscription via Edge Function
//       const { data, error } = await supabase.functions.invoke(
//         'create-test-subscription', // or 'create-live-subscription'
//         {
//           method:'POST',
//             headers: {
//               'Authorization': `Bearer ${accessToken}`
//           },
//           body: {
//   tier_id: tierId,
//   professional_id: professionalId || null,
//   facility_id: facilityId || null,
//   billing_cycle: billingCycle,
// },
//         //   body: {
//         //     tier_id: tierId,
//         //     professional_id: professionalId || null,
//         //     facility_id: facilityId || null,
//         //     billing_cycle: billingCycle,
//         //     payment_method_types: ['card'],
//         //     key_id: "plan_SnyKc1OXn4conb",
//         //     key_secret : "https://mnthjabxkmgmbuquefyy.supabase.co"
//         //   },
//         }
//       );

//       if (error) throw new Error(error.message);
//       if (!data?.success) throw new Error(data?.error || 'Failed to create subscription');

//       setPaymentStatus('redirecting_to_payment');

//       // If redirect_url is provided, use full page redirect
//       if (data.payment?.redirect_url) {
//         window.location.href = data.payment.redirect_url;
//         return;
//       }

//       // Otherwise open Razorpay modal
//       const razorpayLoaded = await loadRazorpayScript();
//       if (!razorpayLoaded) throw new Error('Payment gateway failed to load');

//       const options = {
//         key: data.payment.razorpay_key_id,
//         amount: data.payment.amount * 100,
//         currency: data.payment.currency,
//         name: 'PMHS Smart Health',
//         description: `${planName} (${billingCycle})`,
//         image: 'https://www.pmhssmarthealth.com/assets/pmhs_logo_small-DkS-ds6c.png',
//         order_id: data.payment.order_id,
//         subscription_id: data.subscription.id,
//         handler: async (response: any) => {
//           setPaymentStatus('payment_successful');
//           await handlePaymentVerification(response, data.subscription.id);
//           onSuccess?.();
//         },
//         prefill: {
//           name: data.customer?.name || '',
//           email: data.customer?.email || '',
//           contact: data.customer?.phone || '',
//         },
//         notes: {
//           subscription_id: data.subscription.id,
//           user_type: professionalId ? 'professional' : 'facility',
//         },
//         theme: { color: '#3b82f6' },
//         modal: {
//           ondismiss: () => {
//             setPaymentStatus('payment_cancelled');
//             onError?.('Payment cancelled by user');
//           },
//         },
//       };

//       const razorpay = new (window as any).Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       console.error('Subscription error:', err);
//       setPaymentStatus('payment_failed');
//       onError?.(err instanceof Error ? err.message : 'Payment initiation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentVerification = async (paymentResponse: any, subscriptionId: string) => {
//     try {
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();
//       if (sessionError || !session) throw new Error('Not authenticated');


//       const accessToken = session?.access_token;
//       const { error } = await supabase.functions.invoke('verify-test-payment', {
//          method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`
//         },
//         body: {
//           payment_id: paymentResponse.razorpay_payment_id,
//           order_id: paymentResponse.razorpay_order_id,
//           signature: paymentResponse.razorpay_signature,
//           subscription_id: subscriptionId,
//         },
//       });
//       if (error) console.error('Verification error:', error);
//       else console.log('Payment verified successfully');
//     } catch (err) {
//       console.error('Verification failed:', err);
//     }
//   };

//   const getStatusMessage = () => {
//     switch (paymentStatus) {
//       case 'creating_subscription':
//         return 'Creating your subscription...';
//       case 'redirecting_to_payment':
//         return 'Redirecting to payment gateway...';
//       case 'payment_successful':
//         return 'Payment successful! Redirecting...';
//       case 'payment_failed':
//         return 'Payment failed. Please try again.';
//       case 'payment_cancelled':
//         return 'Payment cancelled.';
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="w-full">
//       {getStatusMessage() && (
//         <div
//           className={`mb-4 p-3 rounded-lg text-center ${
//             paymentStatus === 'payment_successful'
//               ? 'bg-green-100 text-green-800'
//               : paymentStatus === 'payment_failed'
//               ? 'bg-red-100 text-red-800'
//               : paymentStatus === 'payment_cancelled'
//               ? 'bg-yellow-100 text-yellow-800'
//               : 'bg-blue-100 text-blue-800'
//           }`}
//         >
//           {getStatusMessage()}
//         </div>
//       )}

//       <button
//         onClick={handleSubscribe}
//         disabled={loading}
//         className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <span className="flex items-center justify-center gap-2">
//             <svg
//               className="animate-spin h-5 w-5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             Processing...
//           </span>
//         ) : (
//           `Subscribe ${billingCycle === 'yearly' ? 'Annually' : 'Monthly'}`
//         )}
//       </button>
//     </div>
//   );
// };

// export default SubscriptionCheckout;

// components/SubscriptionCheckout.tsx

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SubscriptionCheckoutProps {
  tierId: string;
  professionalId?: string | null;
  facilityId?: string | null;
  planName: string;
  // amount:number;
  billingCycle?: 'monthly' | 'yearly';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({
  tierId,
  professionalId = null,
  facilityId = null,
  planName,
  // amount,
  billingCycle = 'monthly',
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
const navigate = useNavigate();
  // Load Razorpay SDK
  const loadRazorpayScript = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setStatus('Creating subscription...');

      // Get logged-in session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('User not authenticated');
      }

      // IMPORTANT FIX
      // DO NOT add method:'POST'
      // DO NOT stringify body
      // invoke() automatically sends JSON

      const { data, error } = await supabase.functions.invoke(
        'create-live-subscription',
        {
          // method:"POST",
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },

          body: {
            tier_id: tierId,
            professional_id: professionalId,
            facility_id: facilityId,
            billing_cycle: billingCycle,
          },
        }
      );

      console.log('Subscription Response:', data);

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Subscription creation failed');
      }

      setStatus('Loading payment gateway...');

      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Razorpay options
      // const options = {
      //   key: data.payment.razorpay_key_id,

      //   subscription_id: data.payment.subscription_id,

      //   name: 'PMHS Smart Health',

      //   description: `${planName} (${billingCycle})`,

      //   image:
      //     'https://www.pmhssmarthealth.com/assets/pmhs_logo_small-DkS-ds6c.png',

      //   prefill: {
      //     name: data.customer?.name || '',
      //     email: data.customer?.email || '',
      //     contact: data.customer?.phone || '',
      //   },

      //   notes: {
      //     subscription_id: data.subscription.id,
      //     user_type: professionalId ? 'professional' : 'facility',
      //   },

      //   theme: {
      //     color: '#2563eb',
      //   },

      //   handler: async function (response: any) {
      //     console.log('Payment Success:', response);

      //     setStatus('Verifying payment...');

      //     await verifyPayment(response, data.subscription.id);

      //     setStatus('Payment successful');

      //     onSuccess?.();
      //   },

      //   modal: {
      //     ondismiss: function () {
      //       console.log('Payment popup closed');
      //       setStatus('Payment cancelled');
      //       setLoading(false);

      //       onError?.('Payment cancelled');
      //     },
      //   },
      // };
      const options = {
  key: data.razorpay.key_id,

  subscription_id: data.razorpay.subscription_id,

  name: data.razorpay.name,

  description: data.razorpay.description,

  image: data.razorpay.image,

  prefill: data.razorpay.prefill,

  notes: data.razorpay.notes,

  theme: data.razorpay.theme,

  handler: async function (response: any) {
    console.log('Payment Success:', response);

    setStatus('Verifying payment...');

    await verifyPayment(
      response,
      data.subscription.id
    );

    setStatus('Payment successful');

    onSuccess?.();
  },

  modal: {
    ondismiss: function () {
      console.log('Payment popup closed');

      setStatus('Payment cancelled');

      setLoading(false);

      onError?.('Payment cancelled');
    },
  },
};

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err: any) {
      console.error('Subscription Error:', err);

      setStatus('Payment failed');

      onError?.(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Verify Payment
//   const verifyPayment = async (
//     paymentResponse: any,
//     subscriptionId: string
//   ) => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       const { data, error } = await supabase.functions.invoke(
//         'verify-test-payment',
//         {
//           headers: {
//             Authorization: `Bearer ${session?.access_token}`,
//             'Content-Type': 'application/json',
//           },

//           body: {
//             razorpay_payment_id:
//               paymentResponse.razorpay_payment_id,

//             razorpay_subscription_id:
//               paymentResponse.razorpay_subscription_id,

//             razorpay_signature:
//               paymentResponse.razorpay_signature,

//             subscription_id: subscriptionId,
//           },
//         }
//       );

//       console.log('Verify Response:', data);

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (!data?.success) {
//         throw new Error(data?.error || 'Verification failed');
//       }

//       console.log('Payment verified successfully');
//        console.log('Payment verified successfully');
//     // Redirect to success page
//     // window.location.href = `/dashboard/doctor/payment-status?status=success&payment_id=${paymentResponse.razorpay_payment_id}&subscription_id=${subscriptionId}`;
    
//   } catch (err: any) {
//     console.error('Verification Error:', err);
//     // Redirect to error page with message
//     // window.location.href = `/dashboard/doctor/payment-status?status=error&error=${encodeURIComponent(err.message || 'Verification failed')}&payment_id=${paymentResponse.razorpay_payment_id}`;
//   }
//       // Inside verifyPayment, after successful verification
// //       try{
// // if (data?.success) {
// //   console.log('Payment verified successfully');
// //   // Redirect to success page
// //   window.location.href = `/payment-status?status=success&payment_id=${paymentResponse.razorpay_payment_id}&subscription_id=${subscriptionId}`;
// // }

// // // In the catch block for verification error
// // }catch (err) {
// //   console.error('Verification Error:', err);
// //   window.location.href = `/payment-status?status=error&error=${encodeURIComponent(err.message || 'Verification failed')}&payment_id=${paymentResponse.razorpay_payment_id}`;
// // }

// //       window.location.href = '/dashboard?subscription=active';
// //     } catch (err) {
// //       console.error('Verification Error:', err);
// //       onError?.('Payment verification failed');
// //     }
//   };
const verifyPayment = async (
  paymentResponse: any,
  subscriptionId: string
) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("User session not found");
    }

    console.log("Sending Verify Payload:", {
      razorpay_payment_id:
        paymentResponse?.razorpay_payment_id,

      razorpay_subscription_id:
        paymentResponse?.razorpay_subscription_id,

      razorpay_signature:
        paymentResponse?.razorpay_signature,

      subscription_id: subscriptionId,
    });

    const { data, error } = await supabase.functions.invoke(
      "verify-live-payment",
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },

        body: {
          razorpay_payment_id:
            paymentResponse?.razorpay_payment_id,

          razorpay_subscription_id:
            paymentResponse?.razorpay_subscription_id,

          razorpay_signature:
            paymentResponse?.razorpay_signature,

          subscription_id: subscriptionId,
        },
      }
    );

    console.log("Verify Response:", data);
    console.log("Verify Error:", error);

    if (error) {
      throw new Error(
        error.message || "Payment verification failed"
      );
    }

    if (!data?.success) {
      throw new Error(
        data?.error || "Verification failed"
      );
    }

    console.log("Payment verified successfully");

    toast({
      title: "Success",
      description: "Payment verified successfully",
    });

       const successPath = professionalId
      ? "/dashboard/doctor/payment-status"
      : "/dashboard/facility/payment-status";

    navigate(
      `${successPath}?status=success&payment_id=${paymentResponse?.razorpay_payment_id}&subscription_id=${subscriptionId}`
    );
  } catch (err: any) {
    console.error("Verification Error:", err);

    toast({
      title: "Payment Failed",
      description:
        err?.message || "Verification failed",
      variant: "destructive",
    });

      const errorPath = professionalId
      ? "/dashboard/doctor/payment-status"
      : "/dashboard/facility/payment-status";

    navigate(
      `${errorPath}?status=error&error=${encodeURIComponent(
        err?.message || "Verification failed"
      )}`
    );
  }
};
  return (
    <div className="w-full">
      {status && (
        <div className="mb-4 rounded-lg bg-blue-100 p-3 text-center text-blue-800">
          {status}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default SubscriptionCheckout;