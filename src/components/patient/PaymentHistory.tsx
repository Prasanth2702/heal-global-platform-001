import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_session_id: string | null;
  created_at: string;
  appointment: {
    id: string;
    appointment_date: string;
    type: string;
    doctor: {
      first_name: string;
      last_name: string;
      medical_speciality: string;
    };
  };
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

 const fetchPaymentHistory = async () => {
  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Fetch payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select('id, amount, status, stripe_session_id, created_at, appointment_id')
      .eq('payer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (paymentsError) throw paymentsError;
    if (!paymentsData?.length) {
      setPayments([]);
      setLoading(false);
      return;
    }

    // 2. Fetch appointments (with doctor_id)
    const appointmentIds = paymentsData.map(p => p.appointment_id);
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id, appointment_date, type, doctor_id')
      .in('id', appointmentIds);

    if (appointmentsError) throw appointmentsError;

    // 3. Fetch medical professionals & profiles
    const doctorIds = appointmentsData.map(a => a.doctor_id);
    const { data: doctorsData, error: doctorsError } = await supabase
      .from('medical_professionals')
      .select(`
        id,
        user_id,
        medical_speciality,
        profiles!user_id (
          first_name,
          last_name
        )
      `)
      .in('user_id', doctorIds);

    if (doctorsError) throw doctorsError;

    // 4. Merge data
    const transformedPayments: Payment[] = paymentsData.map(payment => {
      const appointment = appointmentsData?.find(a => a.id === payment.appointment_id);
  const doctor = doctorsData?.find(d => d.user_id === appointment?.doctor_id);  // ✅ match by user_id
      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        stripe_session_id: payment.stripe_session_id,
        created_at: payment.created_at,
        appointment: {
          id: appointment?.id || '',
          appointment_date: appointment?.appointment_date || '',
          type: appointment?.type || '',
          doctor: {
            first_name: doctor?.profiles?.first_name || 'N/A',
            last_name: doctor?.profiles?.last_name || '',
            medical_speciality: doctor?.medical_speciality || 'General',
          },
        },
      };
    });

    setPayments(transformedPayments);
  } catch (err: any) {
    console.error('Error fetching payment history:', err);
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
          <button
            onClick={() => setSelectedReceipt(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="text-lg font-semibold">Payment Confirmation</h3>
            <p className="text-sm text-gray-500">Receipt #{selectedReceipt.id.slice(0, 8)}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(selectedReceipt.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold">{formatCurrency(selectedReceipt.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              {getStatusBadge(selectedReceipt.status)}
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Session ID:</span>
              <span className="text-sm font-mono">{selectedReceipt.stripe_session_id?.slice(-8) || 'N/A'}</span>
            </div> */}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Appointment Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span>Dr. {selectedReceipt.appointment.doctor.first_name} {selectedReceipt.appointment.doctor.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty:</span>
                <span>{selectedReceipt.appointment.doctor.medical_speciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(selectedReceipt.appointment.appointment_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span>{selectedReceipt.appointment.type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-3 text-center text-xs text-gray-500 mt-4">
            This is a system generated receipt. For any queries, contact support@cloudhospitals.ai
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
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
        <button
          onClick={fetchPaymentHistory}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't made any payments yet.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard/patient/appointments')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Book an Appointment
          </button>
        </div>
      </div>
    );
  }

  // Desktop/Tablet view (visible on md screens and up)
  const TableView = () => (
    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(payment.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Dr. {payment.appointment.doctor.first_name} {payment.appointment.doctor.last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.appointment.doctor.medical_speciality}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(payment.appointment.appointment_date).toLocaleDateString()}
                <br />
                <span className="text-xs text-gray-400">{payment.appointment.type.replace('_', ' ')}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(payment.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {payment.stripe_session_id && (
                  <button
  onClick={() => setSelectedReceipt(payment)}  // ← change to open modal
  className="text-blue-600 hover:text-blue-800"
>
  View
</button>
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Doctor:</span>
              <span className="font-medium">Dr. {payment.appointment.doctor.first_name} {payment.appointment.doctor.last_name}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Specialty:</span>
              <span>{payment.appointment.doctor.medical_speciality}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Appointment:</span>
              <span>{new Date(payment.appointment.appointment_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Type:</span>
              <span>{payment.appointment.type.replace('_', ' ')}</span>
            </div>
          </div>
          {payment.stripe_session_id && (
            <div className="mt-3 text-right">
              <button
  onClick={() => setSelectedReceipt(payment)}  // ← change to open modal
  className="text-sm text-blue-600 hover:underline"
>
  View Receipt →
</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600">View all your past payments and receipts.</p>
      </div>

      <TableView />
      <CardView />
      <ReceiptModal />
    </div>
  );
};

export default PaymentHistory;