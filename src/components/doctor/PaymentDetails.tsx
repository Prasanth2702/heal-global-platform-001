import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_session_id: string | null;
  created_at: string;
  patient_name: string;
  appointment: {
    id: string;
    appointment_date: string;
    type: string;
  };
}

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');

  useEffect(() => {
    fetchDoctorPayments();
    fetchDoctorName();
  }, []);

  const fetchDoctorName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single();
      if (profile) {
        setDoctorName(`Dr. ${profile.first_name} ${profile.last_name}`);
      }
    } catch (err) {
      console.error('Error fetching doctor name:', err);
    }
  };

  const fetchDoctorPayments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Get medical professional record for this user
      const { data: medicalProfessional, error: mpError } = await supabase
        .from('medical_professionals')
        .select('id, user_id')
        .eq('user_id', user.id)
        .single();

      if (mpError || !medicalProfessional) {
        throw new Error('Doctor profile not found');
      }

      // 2. Get all appointments where doctor_id = medicalProfessional.user_id (or id? depends on schema)
      // Assuming appointments.doctor_id references medical_professionals.user_id (the profile user_id)
      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('id, appointment_date, type, patient_id')
        .eq('doctor_id', medicalProfessional.user_id) // or medicalProfessional.id? Use user_id as per earlier logic
        .order('appointment_date', { ascending: false });

      if (aptError) throw aptError;
      if (!appointments?.length) {
        setPayments([]);
        setLoading(false);
        return;
      }

      const appointmentIds = appointments.map(a => a.id);

      // 3. Fetch payments for those appointments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('id, amount, status, stripe_session_id, created_at, appointment_id')
        .in('appointment_id', appointmentIds)
        .eq('status', 'completed') // Only show completed payments
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;
      if (!paymentsData?.length) {
        setPayments([]);
        setLoading(false);
        return;
      }

      // 4. Fetch patient names
const patientIds = appointments.map(a => a.patient_id);
const { data: patients, error: patientsError } = await supabase
  .from('patients')
  .select('user_id')
  .in('user_id', patientIds);  // ✅ filter by patients.id
if (patientsError) throw patientsError;

const patientUserIds = patients.map(p => p.user_id);
const { data: profiles, error: profilesError } = await supabase
  .from('profiles')
  .select('user_id, first_name, last_name')
  .in('user_id', patientUserIds);
if (profilesError) throw profilesError;

// Create lookup maps
const patientNameMap: Record<string, string> = {};
patients.forEach(patient => {
  const profile = profiles.find(p => p.user_id === patient.user_id);
  if (profile) {
    // Use patient.user_id as key because appointment.patient_id likely holds the user_id
    patientNameMap[patient.user_id] = `${profile.first_name} ${profile.last_name}`;
  }
});

      const appointmentMap: Record<string, any> = {};
      appointments.forEach(apt => {
        appointmentMap[apt.id] = apt;
      });

      // 5. Merge data
      const transformedPayments: Payment[] = paymentsData.map(payment => {
        const appointment = appointmentMap[payment.appointment_id];
        const patientId = appointment?.patient_id;
        const patientName = patientNameMap[patientId] || 'Unknown Patient';
        return {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          stripe_session_id: payment.stripe_session_id,
          created_at: payment.created_at,
          patient_name: patientName,
          appointment: {
            id: appointment?.id || '',
            appointment_date: appointment?.appointment_date || '',
            type: appointment?.type || '',
          },
        };
      });

      setPayments(transformedPayments);
    } catch (err: any) {
      console.error('Error fetching doctor payments:', err);
      setError(err.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ReceiptModal = () => {
    if (!selectedReceipt) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Payment Receipt</h2>
            <button onClick={() => setSelectedReceipt(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-semibold">Payment Confirmation</h3>
              <p className="text-sm text-gray-500">Receipt #{selectedReceipt.id.slice(0, 8)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Date:</span><span>{formatDate(selectedReceipt.created_at)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-bold">{formatCurrency(selectedReceipt.amount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status:</span>{getStatusBadge(selectedReceipt.status)}</div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Patient:</span><span>{selectedReceipt.patient_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span>{new Date(selectedReceipt.appointment.appointment_date).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Type:</span><span>{selectedReceipt.appointment.type.replace('_', ' ')}</span></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-3 text-center text-xs text-gray-500 mt-4">
              This is a system generated receipt. For any queries, contact support@pmhssmarthealth.com
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end">
            <button onClick={() => setSelectedReceipt(null)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error: {error}</p>
        <button onClick={fetchDoctorPayments} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Retry</button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No payments received</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't received any payments yet.</p>
        <Button onClick={() => navigate(-1)} className="mt-6">Go Back</Button>
      </div>
    );
  }

  // Desktop/Tablet view
  const TableView = () => (
    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.created_at)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.patient_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(payment.appointment.appointment_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.appointment.type.replace('_', ' ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {payment.stripe_session_id && (
                  <button onClick={() => setSelectedReceipt(payment)} className="text-blue-600 hover:text-blue-800">View</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile view (cards)
  const CardView = () => (
    <div className="md:hidden space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500">{formatDate(payment.created_at)}</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
            </div>
            {getStatusBadge(payment.status)}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Patient:</span><span className="font-medium">{payment.patient_name}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-gray-500">Appointment:</span><span>{new Date(payment.appointment.appointment_date).toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-gray-500">Type:</span><span>{payment.appointment.type.replace('_', ' ')}</span></div>
          </div>
          {payment.stripe_session_id && (
            <div className="mt-3 text-right">
              <button onClick={() => setSelectedReceipt(payment)} className="text-sm text-blue-600 hover:underline">View Receipt →</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">← Back</Button>
        <h1 className="text-2xl font-bold text-gray-900">Payments Received</h1>
        <p className="text-gray-600">{doctorName || 'Doctor'}</p>
      </div>
      <TableView />
      <CardView />
      <ReceiptModal />
    </div>
  );
};

export default PaymentDetails;