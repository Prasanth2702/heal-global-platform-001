import DashboardLayout from '@/components/layouts/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import InitiatePayment from './InitiatePayment';
import { ArrowLeft, CheckCircle, CreditCard, Calendar as CalendarIcon } from 'lucide-react';

interface AppointmentDetails {
  doctor_name: string;
  medical_specialty: string;
  consultation_fee: number;
  doctor_avatar: string | null;
  appointment_date: string;
}

interface PaymentDetails {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  transaction_id: string | null;
  payment_method: string | null;
}

const PatientPayment = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUserId(user.id);

      if (!appointmentId) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }

      // Fetch appointment with doctor_id
      const { data: apt, error: aptError } = await supabase
        .from('appointments')
        .select('doctor_id, appointment_date, consultation_fee')
        .eq('id', appointmentId)
        .single();

      if (aptError || !apt) {
        setError('Appointment not found');
        setLoading(false);
        return;
      }

      if (!apt.doctor_id) {
        setError('Doctor not associated with this appointment');
        setLoading(false);
        return;
      }

      // Fetch medical_professionals using doctor_id
      const { data: medical } = await supabase
        .from('medical_professionals')
        .select('medical_speciality, consultation_fee')
        .eq('user_id', apt.doctor_id)
        .maybeSingle();

      // Fetch doctor profile (name and avatar)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('user_id', apt.doctor_id)
        .single();

      if (profileError || !profile) {
        setError('Doctor profile not found');
        setLoading(false);
        return;
      }

      const doctorName = `${profile.first_name} ${profile.last_name}`;
      const specialty = medical?.medical_speciality || 'General Physician';
      const fee = apt.consultation_fee || medical?.consultation_fee || 0;

      setAppointmentDetails({
        doctor_name: doctorName,
        medical_specialty: specialty,
        consultation_fee: fee,
        doctor_avatar: profile.avatar_url,
        appointment_date: new Date(apt.appointment_date).toLocaleDateString(),
      });

      // Check for existing completed payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('id, amount, status, paid_at, transaction_id, payment_method')
        .eq('appointment_id', appointmentId)
        .eq('status', 'completed')
        .maybeSingle();

      if (payment && !paymentError) {
        setPaymentDetails({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          paid_at: payment.paid_at,
          transaction_id: payment.transaction_id,
          payment_method: payment.payment_method,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [appointmentId, navigate]);

  const handleBack = () => {
    if (appointmentDetails) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="patient">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !appointmentDetails) {
    return (
      <DashboardLayout userType="patient">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Unable to load appointment details'}
          </div>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} /> Back to Appointments
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isPaymentCompleted = paymentDetails !== null;

  return (
    <DashboardLayout userType="patient">
      <div className="max-w-2xl mx-auto p-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Appointments
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {isPaymentCompleted ? 'Payment Details' : 'Complete Your Payment'}
        </h1>

        {/* Doctor & Payment Details Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-4">
              {appointmentDetails.doctor_avatar ? (
                <img
                  src={appointmentDetails.doctor_avatar}
                  alt={appointmentDetails.doctor_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {appointmentDetails.doctor_name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{appointmentDetails.doctor_name}</h2>
                <p className="text-gray-500">{appointmentDetails.medical_specialty}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Appointment Date</span>
              <span className="font-medium">{appointmentDetails.appointment_date}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-gray-800">Consultation Fee</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{appointmentDetails.consultation_fee  + 150}
                {/* ₹{appointmentDetails.consultation_fee  + 150?.toLocaleString()} */}
              </span>
            </div>
          </div>
        </div>

        {/* Show payment details if completed, otherwise show payment button */}
        {isPaymentCompleted ? (
          <div className="bg-green-50 rounded-xl border border-green-200 p-5">
            <div className="flex items-center gap-2 text-green-700 mb-4">
              <CheckCircle size={24} />
              <h3 className="text-lg font-semibold">Payment Completed</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-2">
                  <CreditCard size={16} /> Amount Paid
                </span>
                <span className="font-semibold">₹{paymentDetails.amount +150}</span>
                {/* <span className="font-semibold">₹{paymentDetails.amount?.toLocaleString()}</span> */}
              </div>
              {paymentDetails.paid_at && (
                <div className="flex justify-between text-gray-700">
                  <span className="flex items-center gap-2">
                    <CalendarIcon size={16} /> Paid On
                  </span>
                  <span>{new Date(paymentDetails.paid_at).toLocaleString()}</span>
                </div>
              )}
              {paymentDetails.transaction_id && (
                <div className="flex justify-between text-gray-700">
                  <span>Transaction ID</span>
                  <span className="text-sm font-mono">{paymentDetails.transaction_id}</span>
                </div>
              )}
              {paymentDetails.payment_method && (
                <div className="flex justify-between text-gray-700">
                  <span>Payment Method</span>
                  <span className="capitalize">{paymentDetails.payment_method}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <InitiatePayment
            appointmentId={appointmentId!}
            userId={userId!}
           
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientPayment;