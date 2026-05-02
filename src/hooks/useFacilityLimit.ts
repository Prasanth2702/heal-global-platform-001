// // hooks/useFacilityLimit.js
// import { supabase } from '@/integrations/supabase/client';
// import { useState } from 'react';

// export const useFacilityLimit = () => {
//   const [loading, setLoading] = useState(false);
//   const [limits, setLimits] = useState(null);

//   const checkLimit = async (facilityId, checkType = 'all') => {
//     setLoading(true);
//     try {
//        const { data } = await supabase.auth.getSession();
//       const token = data.session?.access_token || null;
//       const response = await fetch(
//         `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-facility-limit`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             facility_id: facilityId,
//             check_type: checkType
//           }),
//         }
//       );

//       const result = await response.json();
//       setLimits(result);
//       return result;
//     } catch (error) {
//       console.error('Error checking limit:', error);
//       return { allowed: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const canViewAppointments = async (facilityId) => {
//     const result = await checkLimit(facilityId, 'clinical');
//     return result.allowed === true;
//   };

//   const canViewBedBookings = async (facilityId) => {
//     const result = await checkLimit(facilityId, 'beds');
//     return result.allowed === true;
//   };

//   return { checkLimit, canViewAppointments, canViewBedBookings, loading, limits };
// };

import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const useFacilityLimit = () => {
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState(null);

  const checkLimit = async (facilityId, checkType = 'all') => {
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
        `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-facility-limit`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            facility_id: facilityId,
            check_type: checkType,
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

  const canViewAppointments = async (facilityId) => {
    const result = await checkLimit(facilityId, 'clinical');
    return result?.allowed === true;
  };

  const canViewBedBookings = async (facilityId) => {
    const result = await checkLimit(facilityId, 'beds');
    return result?.allowed === true;
  };

  return {
    checkLimit,
    canViewAppointments,
    canViewBedBookings,
    loading,
    limits,
  };
};