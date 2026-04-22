// // components/ItemManager.tsx
// import { billingService, Category, FacilityItem } from '@/services/billingService'
// import React, { useState, useEffect } from 'react'

// interface ItemManagerProps {
//   facilityId: string
//   items: FacilityItem[]
//   onItemsChange: () => void
// }

// export const ItemManager: React.FC<ItemManagerProps> = ({ facilityId, items, onItemsChange }) => {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [showItemForm, setShowItemForm] = useState(false)
//   const [showCategoryForm, setShowCategoryForm] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState<string>('all')
//   const [newItem, setNewItem] = useState({
//     name: '',
//     description: '',
//     category_id: '',
//     price: 0,
//     facility_id: facilityId,
//     is_active: true
//   })
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     description: '',
//     facility_id: facilityId,
//     is_active: true
//   })

//   useEffect(() => {
//     loadCategories()
//   }, [facilityId])

//   const loadCategories = async () => {
//     try {
//       const data = await billingService.getCategories(facilityId)
//       setCategories(data)
//     } catch (error) {
//       console.error('Error loading categories:', error)
//     }
//   }

//   const handleCreateItem = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newItem.category_id) {
//       alert('Please select a category')
//       return
//     }
//     try {
//       await billingService.createItem(newItem)
//       setShowItemForm(false)
//       setNewItem({ name: '', description: '', category_id: '', price: 0, facility_id: facilityId, is_active: true })
//       onItemsChange()
//       alert('Item created successfully!')
//     } catch (error) {
//       console.error('Error creating item:', error)
//       alert('Failed to create item')
//     }
//   }

//   const handleCreateCategory = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await billingService.createCategory(newCategory)
//       setShowCategoryForm(false)
//       setNewCategory({ name: '', description: '', facility_id: facilityId, is_active: true })
//       loadCategories()
//       alert('Category created successfully!')
//     } catch (error) {
//       console.error('Error creating category:', error)
//       alert('Failed to create category')
//     }
//   }

//   const filteredItems = selectedCategory === 'all' 
//     ? items 
//     : items.filter(item => item.category_id === selectedCategory)

//   return (
//     <div>
//       <div className="flex justify-between mb-6">
//         <div className="space-x-3">
//           <button
//             onClick={() => setShowItemForm(!showItemForm)}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             + Add New Item
//           </button>
//           <button
//             onClick={() => setShowCategoryForm(!showCategoryForm)}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//           >
//             + Add New Category
//           </button>
//         </div>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-md"
//         >
//           <option value="all">All Categories</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//       </div>

//       {/* Category Form */}
//       {showCategoryForm && (
//         <div className="bg-white border rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
//           <form onSubmit={handleCreateCategory} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={newCategory.name}
//                 onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 rows={2}
//                 value={newCategory.description}
//                 onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowCategoryForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//               >
//                 Create Category
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Item Form */}
//       {showItemForm && (
//         <div className="bg-white border rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Item</h3>
//           <form onSubmit={handleCreateItem} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={newItem.name}
//                 onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
//               <select
//                 required
//                 value={newItem.category_id}
//                 onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(cat => (
//                   <option key={cat.id} value={cat.id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 rows={2}
//                 value={newItem.description}
//                 onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price (?) *</label>
//               <input
//                 type="number"
//                 required
//                 min="0"
//                 step="0.01"
//                 value={newItem.price}
//                 onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowItemForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//               >
//                 Create Item
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Items List */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         {filteredItems.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">No items found</div>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {filteredItems.map((item) => (
//               <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-center">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3">
//                       <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
//                       <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
//                         {item.category_name}
//                       </span>
//                     </div>
//                     {item.description && (
//                       <p className="mt-1 text-sm text-gray-500">{item.description}</p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-indigo-600">?{item.price.toFixed(2)}</p>
//                     <span className={`text-xs ${item.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                       {item.is_active ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }

// components/ItemManager.tsx
import { useToast } from '@/hooks/use-toast'
import { billingService, Category, FacilityItem } from '@/services/billingService'
import React, { useState, useEffect } from 'react'

interface ItemManagerProps {
  facilityId: string
  items: FacilityItem[]
  onItemsChange: () => void
}

export const ItemManager: React.FC<ItemManagerProps> = ({ facilityId, items, onItemsChange }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [showItemForm, setShowItemForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()
  // Edit state
  const [editingItem, setEditingItem] = useState<FacilityItem | null>(null)

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    price: 0,
    facility_id: facilityId,
    is_active: true
  })
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    facility_id: facilityId,
    is_active: true
  })

  useEffect(() => {
    loadCategories()
  }, [facilityId])

  const loadCategories = async () => {
    try {
      const data = await billingService.getCategories(facilityId)
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.category_id) {
      toast({
  title: "Category Required",
  description: "Please select a category",
  variant: "destructive"
})
      return
    }
    try {
      await billingService.createItem(newItem)
      setShowItemForm(false)
      setNewItem({ name: '', description: '', category_id: '', price: 0, facility_id: facilityId, is_active: true })
      onItemsChange()
      toast({
  title: "Success",
  description: "Item created successfully!",
})
    } catch (error) {
      console.error('Error creating item:', error)
      toast({
  title: "Error",
  description: "Failed to create item",
  variant: "destructive"
})
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await billingService.createCategory(newCategory)
      setShowCategoryForm(false)
      setNewCategory({ name: '', description: '', facility_id: facilityId, is_active: true })
      loadCategories()
       toast({
    title: "Category Created",
    description: "Category created successfully!",
  })
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
    title: "Error",
    description: "Failed to create category",
    variant: "destructive"
  })
    }
  }

  // ---------- Edit Handlers ----------
  const handleEditItem = (item: FacilityItem) => {
    setEditingItem(item)
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    try {
      // Prepare update payload (only editable fields)
      const updateData = {
        name: editingItem.name,
        description: editingItem.description,
        category_id: editingItem.category_id,
        price: editingItem.price,
        is_active: editingItem.is_active
      }
      await billingService.updateItem(editingItem.id, updateData)
      setEditingItem(null)
      onItemsChange()
      
      toast({
    title: "Item Updated",
    description: "Item updated successfully!",
  })
    } catch (error) {
      console.error('Error updating item:', error)
      toast({
    title: "Update Failed",
    description: "Failed to update item",
    variant: "destructive"
  })
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory)

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="space-x-3">
          <button
            onClick={() => setShowItemForm(!showItemForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            + Add New Item
          </button>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            + Add New Category
          </button>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Category Form (unchanged) */}
      {showCategoryForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Item Create Form (unchanged) */}
      {showItemForm && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Item</h3>
          <form onSubmit={handleCreateItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={newItem.category_id}
                onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowItemForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List with Edit Support */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                {editingItem?.id === item.id ? (
                  // ---------- Edit Form ----------
                  <form onSubmit={handleUpdateItem} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        required
                        value={editingItem.category_id}
                        onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingItem.description || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingItem.is_active}
                          onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Update Item
                      </button>
                    </div>
                  </form>
                ) : (
                  // ---------- Item View ----------
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {item.category_name}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">₹{item.price.toFixed(2)}</p>
                      <span className={`text-xs ${item.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="mt-1">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}