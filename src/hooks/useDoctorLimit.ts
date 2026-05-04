
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const useDoctorLimit = () => {
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState(null);

  const checkLimit = async (user) => {
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_auth_id : user,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to check limits');
      }

      const result = await response.json();
      setLimits(result);

      return result;
    } catch (error) {
      console.error('Error checking limit:', error);
      return { allowed: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const canViewAppointments = async (doctorId) => {
    const result = await checkLimit(doctorId);
    return result?.allowed === true;
  };



  return {
    checkLimit,
    canViewAppointments,
    loading,
    limits,
  };
};