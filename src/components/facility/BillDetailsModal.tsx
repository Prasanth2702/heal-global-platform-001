// components/BillDetailsModal.tsx
import React from 'react'
import { Bill } from '@/services/billingService'

interface BillDetailsModalProps {
  bill: Bill
  onClose: () => void
  onEdit: () => void
  onPayment: () => void
  onPDF: () => void
  onRefresh: () => void
}

export const BillDetailsModal: React.FC<BillDetailsModalProps> = ({
  bill,
  onClose,
  onEdit,
  onPayment,
  onPDF,
  onRefresh
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Bill Details</h3>
            <p className="text-sm text-gray-500">{bill.bill_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl">
            ×
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Hospital Information */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-2">{bill.facility_info?.facility_name}</h4>
            <p className="text-sm text-gray-600">{bill.facility_info?.address}</p>
            <p className="text-sm text-gray-600">
              {bill.facility_info?.city}, {bill.facility_info?.state} - {bill.facility_info?.pincode}
            </p>
            <p className="text-sm text-gray-500">License: {bill.facility_info?.license_number}</p>
          </div>

          {/* Patient Information */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Patient Information</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-sm font-medium w-24">Name:</span>
                  <span className="text-sm">{bill.patient_info?.first_name} {bill.patient_info?.last_name}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium w-24">Patient ID:</span>
                  <span className="text-sm">{bill.patient_id}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium w-24">Email:</span>
                  <span className="text-sm">{bill.patient_info?.email || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium w-24">Phone:</span>
                  <span className="text-sm">{bill.patient_info?.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Bill Information</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-sm font-medium w-24">Bill Date:</span>
                  <span className="text-sm">{new Date(bill.bill_date).toLocaleDateString()}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium w-24">Status:</span>
                  <span className={`px-2 text-xs font-semibold rounded-full ${getStatusColor(bill.payment_status)}`}>
                    {bill.payment_status}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium w-24">Created:</span>
                  <span className="text-sm">{new Date(bill.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bill.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm">{item.item_name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">?{item.unit_price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium">?{item.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount Section */}
          {bill.discount_amount > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Discount Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Percentage:</span> {bill.discount_percentage}%
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span> ?{bill.discount_amount.toFixed(2)}
                </div>
                {bill.discount_approver_name && (
                  <div>
                    <span className="text-gray-500">Approved by:</span> {bill.discount_approver_name}
                  </div>
                )}
                {bill.discount_reason && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Reason:</span> {bill.discount_reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment History */}
          {bill.payments && bill.payments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Payment History</h4>
              <div className="space-y-2">
                {bill.payments.map((payment, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium capitalize">{payment.payment_method}</span>
                        {payment.transaction_id && (
                          <span className="text-xs text-gray-500 ml-2">ID: {payment.transaction_id}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold">?{payment.amount.toFixed(2)}</span>
                        <div className="text-xs text-gray-500">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'Date not available'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-sm">{bill.notes}</p>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>?{bill.subtotal.toFixed(2)}</span>
            </div>
            {bill.discount_amount > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount:</span>
                <span>-?{bill.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
              <span>Total Amount:</span>
              <span>?{bill.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex justify-end space-x-3">
            <button
              onClick={onPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Download PDF
            </button>
            <button
              onClick={onPayment}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Payment
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Bill
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div> */}
          <div className="flex justify-end space-x-3">

  <button
    onClick={onPDF}
    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-medium shadow-sm"
  >
    Download PDF
  </button>

  <button
    onClick={onPayment}
    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition font-medium shadow-sm"
  >
    Add Payment
  </button>

  <button
    onClick={onEdit}
    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition font-medium shadow-sm"
  >
    Edit Bill
  </button>

  <button
    onClick={onClose}
    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium shadow-sm"
  >
    Close
  </button>

</div>
        </div>
      </div>
    </div>
  )
}