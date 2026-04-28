// import { supabase } from '@/integrations/supabase/client';
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';

// const PaymentSuccess: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
//   const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
//   const sessionId = searchParams.get('session_id');

//   useEffect(() => {
//     const verifyPayment = async () => {
//       if (!sessionId) {
//         navigate('/dashboard/patient');
//         return;
//       }

//       try {
//         // Fetch payment and appointment details
//         const { data: payment, error: paymentError } = await supabase
//           .from('payments')
//           .select(`
//             *,
//             appointments!appointment_id (
//               id,
//               appointment_date,
//               type,
//               medical_professionals!doctor_id (
//                 profiles!user_id (
//                   first_name,
//                   last_name,
//                   medical_speciality
//                 )
//               )
//             )
//           `)
//           .eq('stripe_session_id', sessionId)
//           .eq('status', 'completed')
//           .single();

//         if (paymentError || !payment) {
//           // Check if still processing
//           const { data: pendingPayment } = await supabase
//             .from('payments')
//             .select('status')
//             .eq('stripe_session_id', sessionId)
//             .single();

//           if (pendingPayment?.status === 'pending') {
//             // Wait a bit and retry
//             setTimeout(() => {
//               verifyPayment();
//             }, 3000);
//             return;
//           }
          
//           throw new Error('Payment not found or not completed');
//         }

//         setAppointmentDetails(payment.appointments);
//         setStatus('success');

//         // Log frontend confirmation
//         await supabase.functions.invoke('log-audit-event', {
//           body: {
//             action_type: 'payment_success_page_viewed',
//             table_name: 'payments',
//             record_id: payment.id,
//             notes: 'User viewed payment success page'
//           }
//         });

//         // Auto-redirect after 5 seconds
//         setTimeout(() => {
//           navigate(`/appointments/${payment.appointment_id}/confirmation`);
//         }, 5000);

//       } catch (err) {
//         console.error('Payment verification error:', err);
//         setStatus('error');
//       }
//     };

//     verifyPayment();
//   }, [sessionId, navigate]);

//   if (status === 'verifying') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <h2 className="mt-4 text-xl font-semibold">Verifying Payment...</h2>
//           <p className="mt-2 text-gray-600">Please wait while we confirm your payment and send the confirmation email.</p>
//           <div className="mt-4 text-sm text-gray-500">
//             <p>Check your email for appointment details</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (status === 'error') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//             <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Verification Failed</h2>
//           <p className="mt-2 text-gray-600">We couldn't verify your payment status. Please check your email for confirmation.</p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
//             <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
//           <p className="mt-2 text-gray-600">Your appointment has been confirmed.</p>
//           <p className="text-sm text-gray-500 mt-1">A confirmation email has been sent to your registered email address.</p>
//         </div>

//         {appointmentDetails && (
//           <div className="mt-8 border-t pt-6">
//             <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Doctor:</span>
//                 <span className="font-medium">
//                   {appointmentDetails.medical_professionals?.profiles?.first_name} {appointmentDetails.medical_professionals?.profiles?.last_name}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Specialty:</span>
//                 <span className="font-medium">{appointmentDetails.medical_professionals?.medical_speciality}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Date & Time:</span>
//                 <span className="font-medium">
//                   {new Date(appointmentDetails.appointment_date).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Type:</span>
//                 <span className="font-medium">{appointmentDetails.type?.replace('_', ' ').toUpperCase()}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mt-8 flex gap-4">
//           <button
//             onClick={() => navigate('/dashboard/patient/appointments')}
//             className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             View My Appointments
//           </button>
//           <button
//             onClick={() => navigate('/dashboard/patient')}
//             className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//           >
//             Go to Dashboard
//           </button>
//         </div>

//         <div className="mt-6 text-center text-sm text-gray-500">
//           <img 
//             src="https://www.cloudhospitals.ai/assets/image-Bi3hJeSg.png" 
//             alt="CloudHospitals" 
//             className="h-8 mx-auto mb-2 opacity-50"
//           />
//           <p>Need help? Contact support@cloudhospitals.ai</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { supabase } from '@/integrations/supabase/client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get('session_id');
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000;

  useEffect(() => {
    // const verifyPayment = async () => {
    // //   if (!sessionId) {
    // //     navigate('/dashboard/patient');
    // //     return;
    // //   }

    //   try {
    //     // Fetch payment and appointment details
    //     const { data: payment, error: paymentError } = await supabase
    //       .from('payments')
    //       .select(`
    //         *,
    //         appointments!appointment_id (
    //           id,
    //           appointment_date,
    //           type,
    //           medical_professionals!doctor_id (
    //             profiles!user_id (
    //               first_name,
    //               last_name,
    //               medical_speciality
    //             )
    //           )
    //         )
    //       `)
    //       .eq('stripe_session_id', sessionId)
    //       .eq('status', 'completed')
    //       .single();

    //     if (paymentError || !payment) {
    //       // Check if still processing
    //       const { data: pendingPayment } = await supabase
    //         .from('payments')
    //         .select('status')
    //         .eq('stripe_session_id', sessionId)
    //         .single();

    //       if (pendingPayment?.status === 'pending' && retryCountRef.current < MAX_RETRIES) {
    //         retryCountRef.current += 1;
    //         timeoutRef.current = setTimeout(verifyPayment, RETRY_DELAY);
    //         return;
    //       }
          
    //       throw new Error('Payment not found or not completed after maximum retries');
    //     }

    //     setAppointmentDetails(payment.appointments);
    //     setStatus('success');

    //     // Log audit event – non‑blocking, errors ignored
    //     try {
    //       await supabase.functions.invoke('log-audit-event', {
    //         body: {
    //           action_type: 'payment_success_page_viewed',
    //           table_name: 'payments',
    //           record_id: payment.id,
    //           notes: 'User viewed payment success page'
    //         }
    //       });
    //     } catch (auditErr) {
    //       console.warn('Audit log failed:', auditErr);
    //     }

    //     // Countdown and auto‑redirect
    //     let seconds = 5;
    //     const interval = setInterval(() => {
    //       seconds -= 1;
    //       setCountdown(seconds);
    //       if (seconds <= 0) {
    //         clearInterval(interval);
    //         navigate(`/appointments/${payment.appointment_id}/confirmation`);
    //       }
    //     }, 1000);

    //     redirectTimeoutRef.current = setTimeout(() => {
    //       clearInterval(interval);
    //     }, 5000);

    //   } catch (err) {
    //     console.error('Payment verification error:', err);
    //     setStatus('error');
    //   }
    // };
const verifyPayment = async () => {
  try {

    // 1️⃣ Get Payment
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .eq("status", "completed")
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    // 2️⃣ Get Appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", payment.appointment_id)
      .single();

    if (appointmentError || !appointment) {
      throw new Error("Appointment not found");
    }

    // 3️⃣ Get Doctor
    const { data: doctor, error: doctorError } = await supabase
      .from("medical_professionals")
      .select("*")
      .eq("user_id", appointment.doctor_id) // change if professional_id
      .single();

    if (doctorError || !doctor) {
      throw new Error("Doctor not found");
    }

    // 4️⃣ Get Profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", doctor.user_id)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found");
    }

    // Combine Data
    const fullAppointment = {
      ...appointment,
      medical_professionals: {
        ...doctor,
        profiles: profile,
      },
    };

    setAppointmentDetails(fullAppointment);
    setStatus("success");

  } catch (error) {
    console.error("Payment verification error:", error);
    setStatus("error");
  }
};
    verifyPayment();

    // Cleanup timeouts on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, [sessionId, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">Verifying Payment...</h2>
          <p className="mt-2 text-gray-600">
            {retryCountRef.current > 0 
              ? `Still processing (attempt ${retryCountRef.current}/${MAX_RETRIES})...` 
              : 'Please wait while we confirm your payment.'}
          </p>
          <p className="mt-2 text-sm text-gray-500">Check your email for appointment details.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Verification Failed</h2>
          <p className="mt-2 text-gray-600">
            We couldn't verify your payment status. Please check your email for confirmation.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">Your appointment has been confirmed.</p>
          <p className="text-sm text-gray-500 mt-1">A confirmation email has been sent to your registered email address.</p>
        </div>

        {appointmentDetails && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">
                  {appointmentDetails.medical_professionals?.profiles?.first_name} {appointmentDetails.medical_professionals?.profiles?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty:</span>
                <span className="font-medium">{appointmentDetails.medical_professionals?.medical_speciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(appointmentDetails.appointment_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{appointmentDetails.type?.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/patient/appointment-doctor/${appointmentDetails.doctor_id}/${appointmentDetails.id}`)}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View My Appointments
          </button>
          <button
            onClick={() => navigate('/dashboard/patient')}
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Redirecting to appointment confirmation in {countdown} seconds...</p>
          <img 
            src="https://www.cloudhospitals.ai/assets/image-Bi3hJeSg.png" 
            alt="PMHS Smart Health" 
            className="h-8 mx-auto my-2 opacity-50"
          />
          <p>Need help? Contact support@pmhssmarthealth.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;