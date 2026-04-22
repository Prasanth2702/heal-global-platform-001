// components/PaymentModal.tsx
import React, { useState } from 'react'
import { billingService, Bill } from '@/services/billingService'
import { useToast } from '@/hooks/use-toast'

interface PaymentModalProps {
  bill: Bill
  userId: string
  onClose: () => void
  onUpdate: () => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ bill, userId, onClose, onUpdate }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'card'>('cash')
  const [amount, setAmount] = useState(bill.total_amount - (bill.payments?.reduce((sum, p) => sum + p.amount, 0) || 0))
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)
const { toast } = useToast()
  const remainingAmount = bill.total_amount - (bill.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (amount <= 0) {
//       alert('Please enter a valid amount')
//       return
//     }
    
//     if (amount > remainingAmount) {
//       alert(`Amount cannot exceed remaining balance of ₹${remainingAmount.toFixed(2)}`)
//       return
//     }

//     setLoading(true)
//     try {
//       await billingService.updatePayment({
//         bill_id: bill.id,
//         action: 'add',
//         payment_method: paymentMethod,
//         amount: amount,
//         transaction_id: transactionId || undefined,
//         created_by: userId
//       })

//       alert('Payment added successfully!')
//       onUpdate()
//     } catch (error: any) {
//       console.error('Error adding payment:', error)
//       alert(`Failed to add payment: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (amount <= 0) {
    toast({
      title: "Invalid Amount",
      description: "Please enter a valid amount",
      variant: "destructive"
    })
    return
  }
  
  if (amount > remainingAmount) {
    toast({
      title: "Amount Exceeded",
      description: `Amount cannot exceed remaining balance of ₹${remainingAmount.toFixed(2)}`,
      variant: "destructive"
    })
    return
  }

  setLoading(true)
  try {
    await billingService.updatePayment({
      bill_id: bill.id,
      action: 'add',
      payment_method: paymentMethod,
      amount: amount,
      transaction_id: transactionId || undefined,
      created_by: userId
    })

    toast({
      title: "Payment Added",
      description: "Payment added successfully!",
    })

    onUpdate()

  } catch (error: any) {
    console.error('Error adding payment:', error)

    toast({
      title: "Payment Failed",
      description: `Failed to add payment: ${error.message}`,
      variant: "destructive"
    })

  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Add Payment</h3>
            <p className="text-sm text-gray-500">{bill.bill_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="font-semibold">₹{bill.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Paid Amount:</span>
              <span className="font-semibold text-green-600">
                ₹{(bill.payments?.reduce((sum, p) => sum + p.amount, 0) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-medium">Remaining:</span>
              <span className="font-bold text-indigo-600">₹{remainingAmount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="online">Online (UPI)</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              min="0.01"
              max={remainingAmount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {(paymentMethod === 'online' || paymentMethod === 'card') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || amount <= 0 || amount > remainingAmount}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}