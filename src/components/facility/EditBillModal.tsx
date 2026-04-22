// components/EditBillModal.tsx
import React, { useState, useEffect } from 'react'
import { billingService, Bill, FacilityItem, BillItem } from '@/services/billingService'
import { useToast } from '@/hooks/use-toast'

interface EditBillModalProps {
  bill: Bill
  facilityId: string
  userId: string
  onClose: () => void
  onUpdate: () => void
}

export const EditBillModal: React.FC<EditBillModalProps> = ({
  bill,
  facilityId,
  userId,
  onClose,
  onUpdate
}) => {
      const { toast } = useToast()
  const [items, setItems] = useState<FacilityItem[]>([])
  const [selectedItems, setSelectedItems] = useState<BillItem[]>(bill.items || [])
  const [discountPercentage, setDiscountPercentage] = useState(bill.discount_percentage)
  const [discountApproverName, setDiscountApproverName] = useState(bill.discount_approver_name || '')
  const [discountReason, setDiscountReason] = useState(bill.discount_reason || '')
  const [notes, setNotes] = useState(bill.notes || '')
  const [loading, setLoading] = useState(false)
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    loadItems()
  }, [facilityId])

  const loadItems = async () => {
    setLoadingItems(true)
    try {
      const data = await billingService.getItems(facilityId)
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoadingItems(false)
    }
  }

  const addItem = (item: FacilityItem) => {
    const existingItem = selectedItems.find(i => i.item_id === item.id)
    if (existingItem) {
      setSelectedItems(selectedItems.map(i => 
        i.item_id === item.id 
          ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * i.unit_price }
          : i
      ))
    } else {
      setSelectedItems([...selectedItems, {
        item_id: item.id,
        item_name: item.name,
        quantity: 1,
        unit_price: item.price,
        total_price: item.price
      }])
    }
  }

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.item_id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    const item = selectedItems.find(i => i.item_id === itemId)
    if (item) {
      setSelectedItems(selectedItems.map(i =>
        i.item_id === itemId
          ? { ...i, quantity, total_price: quantity * i.unit_price }
          : i
      ))
    }
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.total_price, 0)
  const discountAmount = (subtotal * discountPercentage) / 100
  const total = subtotal - discountAmount

  const handleUpdate = async () => {
    if (selectedItems.length === 0) {
        toast({
  title: "Items Required",
  description: "Please add at least one item to the bill",
  variant: "destructive"
})
      return
    }

    setLoading(true)
    try {
      await billingService.updateBill({
        bill_id: bill.id,
        items: selectedItems.map(({ item_id, quantity, unit_price }) => ({
          item_id,
          quantity,
          unit_price
        })),
        discount_percentage: discountPercentage,
        discount_approver_name: discountApproverName,
        discount_reason: discountReason,
        notes,
        updated_by: userId
      })

      toast({
  title: "Success",
  description: "Bill updated successfully!",
  variant: "default", // or "success" if you have custom variants
});

      onUpdate()
    } catch (error: any) {
      console.error('Error updating bill:', error)
      toast({
  title: "Error",
  description: `Failed to update bill: ${error.message}`,
  variant: "destructive"
})
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (hardDelete: boolean = false) => {
    if (window.confirm(`Are you sure you want to ${hardDelete ? 'permanently delete' : 'archive'} this bill?`)) {
      setLoading(true)
      try {
        await billingService.deleteBill(bill.id, userId, hardDelete, 'Deleted by user')
        toast({
  title: "Bill Deleted",
  description: `Bill ${bill.bill_number} has been deleted.`,
  className: "bg-yellow-500 text-white", // custom style
  duration: 4000,
});
        onUpdate()
      } catch (error: any) {
        console.error('Error deleting bill:', error)
        toast({
  title: "Error",
  description: `Failed to delete bill: ${error.message}`,
  className: "bg-red-500 text-white",
});
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Edit Bill</h3>
            <p className="text-sm text-gray-500">{bill.bill_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl">
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Items Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Items *
            </label>
            <select
              onChange={(e) => {
                const item = items.find(i => i.id === e.target.value)
                if (item) addItem(item)
                e.target.value = ''
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              value=""
              disabled={loadingItems}
            >
              <option value="">{loadingItems ? 'Loading items...' : 'Add an item...'}</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - ₹{item.price}
                </option>
              ))}
            </select>

            {selectedItems.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedItems.map((item) => (
                      <tr key={item.item_id}>
                        <td className="px-3 py-2 text-sm">{item.item_name}</td>
                        <td className="px-3 py-2 text-sm">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.item_id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm">₹{item.unit_price}</td>
                        <td className="px-3 py-2 text-sm font-medium">₹{item.total_price}</td>
                        <td className="px-3 py-2 text-sm">
                          <button
                            onClick={() => removeItem(item.item_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Discount
              </label>
              <textarea
                rows={2}
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount ({discountPercentage}%):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {/* <div>
              <button
                onClick={() => handleDelete(false)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Archive Bill
              </button>
              <button
                onClick={() => handleDelete(true)}
                className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div> */}
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || selectedItems.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? 'Updating...' : 'Update Bill'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}