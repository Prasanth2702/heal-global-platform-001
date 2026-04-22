// // components/BillForm.tsx
// import { BillItem, FacilityItem } from '@/services/billingService'
// import React, { useState } from 'react'

// interface BillFormProps {
//   items: FacilityItem[]
//   onSubmit: (data: any) => void
//   loading: boolean
// }

// export const BillForm: React.FC<BillFormProps> = ({ items, onSubmit, loading }) => {
//   const [patientId, setPatientId] = useState('')
//   const [selectedItems, setSelectedItems] = useState<BillItem[]>([])
//   const [discountPercentage, setDiscountPercentage] = useState(0)
//   const [discountApproverName, setDiscountApproverName] = useState('')
//   const [discountReason, setDiscountReason] = useState('')
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'card'>('cash')
//   const [transactionId, setTransactionId] = useState('')
//   const [notes, setNotes] = useState('')
//   const [showPayment, setShowPayment] = useState(true)

//   const addItem = (item: FacilityItem) => {
//     const existingItem = selectedItems.find(i => i.item_id === item.id)
//     if (existingItem) {
//       setSelectedItems(selectedItems.map(i => 
//         i.item_id === item.id 
//           ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * i.unit_price }
//           : i
//       ))
//     } else {
//       setSelectedItems([...selectedItems, {
//         item_id: item.id,
//         item_name: item.name,
//         quantity: 1,
//         unit_price: item.price,
//         total_price: item.price
//       }])
//     }
//   }

//   const removeItem = (itemId: string) => {
//     setSelectedItems(selectedItems.filter(i => i.item_id !== itemId))
//   }

//   const updateQuantity = (itemId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(itemId)
//       return
//     }
//     const item = selectedItems.find(i => i.item_id === itemId)
//     if (item) {
//       setSelectedItems(selectedItems.map(i =>
//         i.item_id === itemId
//           ? { ...i, quantity, total_price: quantity * i.unit_price }
//           : i
//       ))
//     }
//   }

//   const subtotal = selectedItems.reduce((sum, item) => sum + item.total_price, 0)
//   const discountAmount = (subtotal * discountPercentage) / 100
//   const total = subtotal - discountAmount

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (selectedItems.length === 0) {
//       alert('Please add at least one item to the bill')
//       return
//     }

//     const billData = {
//       patient_id: patientId,
//       items: selectedItems.map(({ item_id, quantity, unit_price, total_price }) => ({
//         item_id,
//         quantity,
//         unit_price,
//         total_price
//       })),
//       discount_percentage: discountPercentage,
//       discount_approver_name: discountApproverName,
//       discount_reason: discountReason,
//       notes,
//       ...(showPayment && total > 0 && {
//         payment: {
//           method: paymentMethod,
//           amount: total,
//           transaction_id: transactionId || undefined
//         }
//       })
//     }
//     onSubmit(billData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Patient Information */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
//         <div className="grid grid-cols-1 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Patient ID *
//             </label>
//             <input
//               type="text"
//               required
//               value={patientId}
//               onChange={(e) => setPatientId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter patient ID"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Items Selection */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Bill Items</h3>
//         <div className="mb-4">
//           <select
//             onChange={(e) => {
//               const item = items.find(i => i.id === e.target.value)
//               if (item) addItem(item)
//               e.target.value = ''
//             }}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             value=""
//           >
//             <option value="">Add an item...</option>
//             {items.map(item => (
//               <option key={item.id} value={item.id}>
//                 {item.name} - ?{item.price.toFixed(2)}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedItems.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {selectedItems.map((item) => (
//                   <tr key={item.item_id}>
//                     <td className="px-4 py-2 text-sm text-gray-900">{item.item_name}</td>
//                     <td className="px-4 py-2 text-sm text-gray-500">?{item.unit_price.toFixed(2)}</td>
//                     <td className="px-4 py-2">
//                       <input
//                         type="number"
//                         min="1"
//                         value={item.quantity}
//                         onChange={(e) => updateQuantity(item.item_id, parseInt(e.target.value))}
//                         className="w-20 px-2 py-1 border border-gray-300 rounded-md"
//                       />
//                     </td>
//                     <td className="px-4 py-2 text-sm text-gray-500">?{item.total_price.toFixed(2)}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         type="button"
//                         onClick={() => removeItem(item.item_id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Discount Section */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Discount (Optional)</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Discount Percentage
//             </label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               step="0.01"
//               value={discountPercentage}
//               onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Approver Name
//             </label>
//             <input
//               type="text"
//               value={discountApproverName}
//               onChange={(e) => setDiscountApproverName(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Reason for Discount
//             </label>
//             <textarea
//               rows={2}
//               value={discountReason}
//               onChange={(e) => setDiscountReason(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Payment Section */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               checked={showPayment}
//               onChange={(e) => setShowPayment(e.target.checked)}
//               className="mr-2"
//             />
//             <span className="text-sm text-gray-700">Collect payment now</span>
//           </label>
//         </div>

//         {showPayment && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Method
//               </label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value as any)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="cash">Cash</option>
//                 <option value="online">Online (UPI)</option>
//                 <option value="card">Card</option>
//               </select>
//             </div>
//             {(paymentMethod === 'online' || paymentMethod === 'card') && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Transaction ID
//                 </label>
//                 <input
//                   type="text"
//                   value={transactionId}
//                   onChange={(e) => setTransactionId(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   placeholder="Enter transaction ID"
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Notes Section */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
//         <textarea
//           rows={3}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md"
//           placeholder="Any additional notes or comments..."
//         />
//       </div>

//       {/* Summary and Submit */}
//       <div className="bg-indigo-50 rounded-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-gray-600">Subtotal:</span>
//           <span className="text-lg font-semibold">?{subtotal.toFixed(2)}</span>
//         </div>
//         {discountPercentage > 0 && (
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-gray-600">Discount ({discountPercentage}%):</span>
//             <span className="text-lg font-semibold text-green-600">-?{discountAmount.toFixed(2)}</span>
//           </div>
//         )}
//         <div className="flex justify-between items-center pt-4 border-t border-indigo-200">
//           <span className="text-xl font-bold text-gray-900">Total Amount:</span>
//           <span className="text-2xl font-bold text-indigo-600">?{total.toFixed(2)}</span>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           type="submit"
//           disabled={loading || selectedItems.length === 0}
//           className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Creating Bill...' : 'Create Bill'}
//         </button>
//       </div>
//     </form>
//   )
// }

// components/CreateBillForm.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { billingService, FacilityItem, BillItem, PatientInfo } from '@/services/billingService'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

interface CreateBillFormProps {
  facilityId: string
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

export const BillForm: React.FC<CreateBillFormProps> = ({ 
  facilityId, 
  userId, 
  onSuccess, 
  onCancel 
}) => {
  // Form state
  const location = useLocation();
const passedEmail = (location.state as any)?.email;
  const [items, setItems] = useState<FacilityItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  // Bill data
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null)
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [patientSearchResults, setPatientSearchResults] = useState<PatientInfo[]>([])
  const [searchingPatient, setSearchingPatient] = useState(false)
  
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [discountApproverName, setDiscountApproverName] = useState('')
  const [discountReason, setDiscountReason] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'card'>('cash')
  const [transactionId, setTransactionId] = useState('')
  const [collectPayment, setCollectPayment] = useState(false)
  const [notes, setNotes] = useState('')
const [showItemSelector, setShowItemSelector] = useState(false);
const [role, setRole] = useState<string | null>(null)
 const [departmentId, setDepartmentId] = useState<string | null>(null)
const [position, setPosition] = useState<string | null>(null)

useEffect(() => {
  getUserRole()
}, [userId])

const getUserRole = async () => {
  try {
    // Get Profile Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (profile) {
      setRole(profile.role)

      // If Staff → Get Department
      if (profile.role === 'hospital_staff') {
        const { data: staff } = await supabase
          .from('staff')
          .select('department_id, position, facility_id')
          .eq('user_id', userId)
          .single()

        if (staff) {
          setDepartmentId(staff.department_id)
          setPosition(staff.position)
        }
      }
    }

  } catch (error) {
    console.error('Error fetching role:', error)
  }
}

// Load items and categories
  useEffect(() => {
    loadItems()
    loadCategories()
  }, [facilityId])

  // Search patients
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (patientSearch.length > 1) {
        searchPatients()
      } else if (patientSearch.length === 0) {
        setPatientSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [patientSearch])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await billingService.getItems(facilityId)
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
      toast({
  title: 'Error Loading Items',
  description: 'Failed to load items. Please try again.',
  variant: 'destructive',
})
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await billingService.getCategories(facilityId)
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const searchPatients = async () => {
    setSearchingPatient(true)
    try {
      const results = await billingService.searchPatients(patientSearch)
      setPatientSearchResults(results)
      setShowPatientSearch(true)
    } catch (error) {
      console.error('Error searching patients:', error)
    } finally {
      setSearchingPatient(false)
    }
  }

useEffect(() => {
  if (!passedEmail || !facilityId) return

  const autoSelectPatient = async () => {
    try {
      setPatientSearch(passedEmail)

      const results = await billingService.searchPatients(passedEmail)

      if (results?.length > 0) {
        const matched = results.find(
          (p) => p.email?.toLowerCase() === passedEmail.toLowerCase()
        )

        if (matched) {
          setSelectedPatient(matched)
          setPatientSearch(
            `${matched.first_name} ${matched.last_name}`
          )
          setShowPatientSearch(false)
        }
      }
    } catch (error) {
      console.error("Auto select patient error:", error)
    }
  }

  autoSelectPatient()
}, [passedEmail, facilityId])

  const selectPatient = (patient: PatientInfo) => {
    setSelectedPatient(patient)
    setPatientSearch(`${patient.first_name} ${patient.last_name} (${patient.id || patient.user_id.substring(0, 8)})`)
    setShowPatientSearch(false)
  }

  const addItem = (item: FacilityItem) => {
    const existingItem = billItems.find(i => i.item_id === item.id)
    if (existingItem) {
      setBillItems(billItems.map(i => 
        i.item_id === item.id 
          ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * i.unit_price }
          : i
      ))
    } else {
      setBillItems([...billItems, {
        item_id: item.id,
        item_name: item.name,
        quantity: 1,
        unit_price: item.price,
        total_price: item.price
      }])
    }
  }

  const removeItem = (itemId: string) => {
    setBillItems(billItems.filter(i => i.item_id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    const item = billItems.find(i => i.item_id === itemId)
    if (item) {
      setBillItems(billItems.map(i =>
        i.item_id === itemId
          ? { ...i, quantity, total_price: quantity * i.unit_price }
          : i
      ))
    }
  }

  const updateUnitPrice = (itemId: string, unitPrice: number) => {
    if (unitPrice < 0) return
    const item = billItems.find(i => i.item_id === itemId)
    if (item) {
      setBillItems(billItems.map(i =>
        i.item_id === itemId
          ? { ...i, unit_price: unitPrice, total_price: i.quantity * unitPrice }
          : i
      ))
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory)

  const subtotal = billItems.reduce((sum, item) => sum + item.total_price, 0)
  const discountAmount = (subtotal * discountPercentage) / 100
  const total = subtotal - discountAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      toast({
  title: 'Validation Error',
  description: 'Please select a patient',
  variant: 'destructive',
})
      return
    }
    
    if (billItems.length === 0) {
     toast({
  title: 'Validation Error',
  description: 'Please add at least one item to the bill',
  variant: 'destructive',
})
      return
    }

    setSubmitting(true)
    try {
    //   const billData = {
    //     patient_id: selectedPatient.user_id,
    //     facility_id: facilityId,
    //     items: billItems.map(({ item_id, quantity, unit_price }) => ({
    //       item_id,
    //       quantity,
    //       unit_price
    //     })),
    //     discount_percentage: discountPercentage,
    //     discount_approver_name: discountApproverName,
    //     discount_reason: discountReason,
    //     notes,
    //     created_by: userId,
    //     ...(collectPayment && total > 0 && {
    //       payment: {
    //         method: paymentMethod,
    //         amount: total,
    //         transaction_id: transactionId || undefined
    //       }
    //     })
    //   }
    const billData = {
  patient_id: selectedPatient.user_id,
  facility_id: facilityId,
  items: billItems.map(item => ({
    item_id: item.item_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price
  })),
  discount_percentage: discountPercentage,
  discount_approver_name: discountApproverName,
  discount_reason: discountReason,
  notes,
  created_by: userId,
  ...(collectPayment && total > 0 && {
    payment: {
      payment_method: paymentMethod,
      amount: total,
      transaction_id: transactionId || undefined
    }
  })
}

      const result = await billingService.createBill(billData)
      
      if (result.success) {
        // alert(`Bill created successfully!\nBill Number: ${result.data.bill_number}`)
       toast({
  title: 'Bill Created Successfully',
  description: `Bill Number: ${result.data.bill_number}`,
  variant: 'default',
})
        onSuccess()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Error creating bill:', error)
    //   alert(`Failed to create bill: ${error.message}`)
    toast({
  title: 'Error Creating Bill',
  description: error.message,
  variant: 'destructive',
})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    
     {/* Patient Selection Section */}
<div className="bg-white shadow-sm rounded-lg p-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Search Patient *
    </label>
    <div className="relative">
      <input
        type="text"
        value={patientSearch}
        onChange={(e) => setPatientSearch(e.target.value)}
        onFocus={() => patientSearch && setShowPatientSearch(true)}
        placeholder="Search by name, email, or patient ID..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        required
      />
      {searchingPatient && (
        <div className="absolute right-3 top-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>

 {/* Search Results Dropdown */}
{showPatientSearch && !selectedPatient && (
  <div className=" z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
    
    {patientSearchResults.length > 0 ? (
      patientSearchResults.map((patient) => (
        <button
          key={patient.user_id}
          type="button"
          onClick={() => selectPatient(patient)}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          <div className="font-medium">
            {patient.first_name} {patient.last_name}
          </div>
          <div className="text-sm text-gray-500">
            {patient.email} | {patient.phone_number}
          </div>
        </button>
      ))
    ) : (
      <div className="px-4 py-3 text-gray-500 text-sm">
        No patients found
      </div>
    )}

  </div>
)}

{/* Selected Patient */}
{selectedPatient && (
  <div className="mt-3 p-3 bg-green-50 rounded-md">
    <div className="flex justify-between">
      <div>
        <p className="font-medium">
          {selectedPatient.first_name} {selectedPatient.last_name}
        </p>
        <p className="text-sm">{selectedPatient.email}</p>
        <p className="text-sm">{selectedPatient.phone_number}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedPatient(null)
          setPatientSearch('')
          setShowPatientSearch(true)
        }}
        className="text-red-500"
      >
        Change
      </button>

    </div>
  </div>
)}


   
  </div>
</div>

<div className="bg-white shadow-sm rounded-lg p-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">
    Bill Number
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
  <p className="text-sm text-gray-500">
    Eample Bill Number :<span className="text-lg font-medium text-gray-900 mb-4">BILL-202604-000005</span>
  </p>

      <p className="text-sm text-gray-500">
        Bill number will be auto-generated. You can also add manually if needed.
      </p>

    </div>
  </div>
</div>

      {/* Items Selection Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bill Items</h3>
        
         <button
      type="button"
      onClick={() => setShowItemSelector(true)}  // state variable
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
    >
      + Add Item
    </button>
    </div>
        {/* Category Filter */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div> */}

        {/* Item Selector */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Item
          </label>
          <select
            onChange={(e) => {
              const item = items.find(i => i.id === e.target.value)
              if (item) addItem(item)
              e.target.value = ''
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value=""
            disabled={loading}
          >
            <option value="">{loading ? 'Loading items...' : 'Select an item to add...'}</option>
            {filteredItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} - ?{item.price.toFixed(2)} {item.category_name ? `(${item.category_name})` : ''}
              </option>
            ))}
          </select>
        </div> */}

        {/* Items Table */}
        {billItems.length > 0 ? (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billItems.map((item) => (
                  <tr key={item.item_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.item_id, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateUnitPrice(item.item_id, parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{item.total_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        onClick={() => removeItem(item.item_id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            No items added yet. Select items from the dropdown above.
          </div>
        )}
      </div>

      {/* Discount Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Discount (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approver Name
            </label>
            <input
              type="text"
              value={discountApproverName}
              onChange={(e) => setDiscountApproverName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Name of person approving discount"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Discount
            </label>
            <textarea
              rows={2}
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Reason for applying discount..."
            />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={collectPayment}
              onChange={(e) => setCollectPayment(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Collect payment now</span>
          </label>
        </div>

        {collectPayment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="cash">Cash</option>
                <option value="online">Online (UPI)</option>
                <option value="card">Card</option>
              </select>
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
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Any additional notes or comments about this bill..."
        />
      </div>

      {/* Summary Section */}
      <div className="bg-indigo-50 shadow-sm rounded-lg p-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          {discountPercentage > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount ({discountPercentage}%):</span>
              <span className="text-lg font-semibold text-green-600">-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-indigo-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || billItems.length === 0 || !selectedPatient}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Bill...
            </span>
          ) : (
            'Create Bill'
          )}
        </button>
      </div>
      {/* Add Item Dialog */}
<Dialog open={showItemSelector} onOpenChange={setShowItemSelector}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Add Bill Item</DialogTitle>
    </DialogHeader>
    
    {/* Optional: Category filter inside dialog */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>

    {/* Items list */}
    <div className="max-h-96 overflow-y-auto border rounded-md">
      {filteredItems.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No items found</div>
      ) : (
        <ul className="divide-y">
          {filteredItems.map(item => (
            <li key={item.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">₹{item.price.toFixed(2)}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  addItem(item);
                  setShowItemSelector(false);
                }}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="flex justify-end mt-4">
      <button
        onClick={() => setShowItemSelector(false)}
        className="px-4 py-2 border rounded-md"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
    </form>
  )
}