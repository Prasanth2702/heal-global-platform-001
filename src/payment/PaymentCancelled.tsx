// PaymentCancelled.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold">Payment Cancelled</h2>
        <p className="mt-2 text-gray-600">
          You cancelled the payment process. No charges have been made.
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard/patient/appointments')}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;