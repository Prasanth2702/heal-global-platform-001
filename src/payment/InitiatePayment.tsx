import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';

interface InitiatePaymentProps {
  appointmentId: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const InitiatePayment: React.FC<InitiatePaymentProps> = ({
  appointmentId,
  userId,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentInitiation = async () => {
  setLoading(true);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("User not authenticated");

    const { data, error } = await supabase.functions.invoke(
      // "initiate-live-payment",
      "initiate-test-payment",
      {
        body: {
          appointment_id: appointmentId,
          user_id: userId,
          success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/payment-cancelled`,
        },
      }
    );

    if (error) throw error;

    if (data.success && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      onSuccess?.();
    } else {
      throw new Error(data.error || "Failed to initiate payment");
    }

  } catch (err) {
    console.error("Payment initiation error:", err);
    onError?.(
      err instanceof Error ? err.message : "Payment initiation failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <button
      onClick={handlePaymentInitiation}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Proceed to Payment'}
    </button>
  );
};

export default InitiatePayment;