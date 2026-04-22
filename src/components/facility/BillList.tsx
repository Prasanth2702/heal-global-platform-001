// components/BillList.tsx
import React, { useState, useEffect } from 'react'
import { billingService, Bill, BillItem, PaymentDetail } from '@/services/billingService'
import { generateBillPDF } from '@/utils/pdfGenerator'
import { EditBillModal } from './EditBillModal'
import { PaymentModal } from './PaymentModal'
import { BillDetailsModal } from './BillDetailsModal'
import { toast, useToast } from '@/hooks/use-toast'

interface BillListProps {
  facilityId: string
  userId: string
userRole: string | null
}

export const BillList: React.FC<BillListProps> = ({ facilityId, userId , userRole}) => {
  const { toast } = useToast()
    const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'partial'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
const [role, setRole] = useState<string | null>(null);
//   useEffect(() => {
//     loadBills()
//   }, [facilityId])
useEffect(() => {
  if (facilityId && userRole) {
    loadBills()
  }
}, [facilityId, userRole])
//   const loadBills = async () => {
//     setLoading(true)
//     try {
//       const data = await billingService.getBills(facilityId)
//       setBills(data)
//     } catch (error) {
//     console.error('Error loading bills:', error)

//     // toast({
//     //   title: "Error Loading Bills",
//     //   description: error?.message || "Failed to load bills",
//     //   variant: "destructive"
//     // })
//     } finally {
//       setLoading(false)
//     }
//   }
const loadBills = async () => {
  setLoading(true)

  try {
    let data

    if (userRole === 'hospital_staff') {
      data = await billingService.getBillsStaff(
        facilityId,
        userId,
        userRole
      )
    } else {
      data = await billingService.getBills(facilityId)
    }

    setBills(data)
  } catch (error) {
    console.error('Error loading bills:', error)
  } finally {
    setLoading(false)
  }
}
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '?'
      case 'unpaid': return '?'
      case 'partial': return '?'
      default: return '?'
    }
  }

  const handleGeneratePDF = async (bill: Bill) => {
    try {
      await generateBillPDF(bill, bill.facility_info, bill.patient_info)
    } catch (error) {
      console.error('Error generating PDF:', error)

    toast({
      title: "PDF Error",
      description: error?.message || "Failed to generate PDF",
      variant: "destructive"
    })
    }
  }

  const filteredBills = bills.filter(bill => {
    if (filter !== 'all' && bill.payment_status !== filter) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        bill.bill_number.toLowerCase().includes(searchLower) ||
        bill.patient_info?.first_name?.toLowerCase().includes(searchLower) ||
        bill.patient_info?.last_name?.toLowerCase().includes(searchLower) ||
        bill.patient_id.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading bills...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by bill number, patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'paid'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'unpaid'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unpaid
          </button>
          <button
            onClick={() => setFilter('partial')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'partial'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Partial
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No bills found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredBills.map((bill) => (
              <li key={bill.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {bill.bill_number}
                        </p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bill.payment_status)}`}>
                          ₹ {bill.payment_status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          {bill.patient_info?.first_name} {bill.patient_info?.last_name}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {bill.patient_info?.email}
                        </p>
                        {/* <p className="text-sm text-gray-500">
                          Patient ID: {bill.patient_id.substring(0, 8)}...
                        </p> */}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Date:</span>
                          {new Date(bill.bill_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Items:</span>
                          {bill.items?.length || 0}
                        </div>
                        {bill.discount_amount > 0 && (
                          <div className="flex items-center text-green-600">
                            <span className="font-medium mr-1">Discount:</span>
                            ₹{bill.discount_amount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{bill.total_amount.toFixed(2)}</p>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBill(bill)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBill(bill)
                            setShowPaymentModal(true)
                          }}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Payment
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(bill)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                          View
                        </button>
                      </div>
                    </div> */}
                    <div className="text-right">
  <p className="text-lg font-bold text-gray-900">
    ₹{bill.total_amount.toFixed(2)}
  </p>

  <div className="mt-2 flex space-x-2 justify-end">
{bill.payment_status === 'unpaid' && (
    <button
      onClick={() => {
        setSelectedBill(bill)
        setShowEditModal(true)
      }}
      className="px-2 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-xs"
    >
      Edit
    </button>
)}
{bill.payment_status === 'paid' && (
    <p>This bill is already paid. Editing is not allowed.</p>
)}
    <button
      onClick={() => {
        setSelectedBill(bill)
        setShowPaymentModal(true)
      }}
      className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
    >
      Payment
    </button>

    <button
      onClick={() => handleGeneratePDF(bill)}
      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
    >
      PDF
    </button>

    <button
      onClick={() => setSelectedBill(bill)}
      className="px-2 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs"
    >
      View
    </button>

  </div>
</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bill Details Modal */}
      {selectedBill && !showEditModal && !showPaymentModal && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          onEdit={() => {
            setShowEditModal(true)
          }}
          onPayment={() => {
            setShowPaymentModal(true)
          }}
          onPDF={() => handleGeneratePDF(selectedBill)}
          onRefresh={loadBills}
        />
      )}

      {/* Edit Bill Modal */}
      {showEditModal && selectedBill && (
        <EditBillModal
          bill={selectedBill}
          facilityId={facilityId}
          userId={userId}
          onClose={() => {
            setShowEditModal(false)
            setSelectedBill(null)
          }}
          onUpdate={() => {
            loadBills()
            setShowEditModal(false)
            setSelectedBill(null)
          }}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <PaymentModal
          bill={selectedBill}
          userId={userId}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedBill(null)
          }}
          onUpdate={() => {
            loadBills()
            setShowPaymentModal(false)
            setSelectedBill(null)
          }}
        />
      )}
    </div>
  )
}