import React, { useState, useEffect } from 'react'
import { Bill, billingService, FacilityItem } from '@/services/billingService'
import { BillForm } from './BillForm'
import { ItemManager } from './ItemManager'
import { BillList } from './BillList'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'



export const BillingSystem  = () => {
 const { toast } = useToast()
    const [activeTab, setActiveTab] = useState<'bills' | 'create' | 'items'>('bills')
    const [role, setRole] = useState<string | null>(null)
  const [items, setItems] = useState<FacilityItem[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(false)
const [facilityId, setFacilityId] = useState<string | null>(null)
const [userId, setUserId] = useState<string | null>(null)
useEffect(() => {
  getUserAndFacility()
}, [])
const [departmentId, setDepartmentId] = useState<string | null>(null)
const [position, setPosition] = useState<string | null>(null)
// const getUserAndFacility = async () => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) return

//     setUserId(user.id)

//     const { data: facility } = await supabase
//       .from("facilities")
//       .select("id")
//       .eq("admin_user_id", user.id)
//       .single()

//     if (facility) {
//       setFacilityId(facility.id)
//     }

//   } catch (error) {
//     console.error("Error fetching facility:", error)
//   }
// }
const getUserAndFacility = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    setUserId(user.id)

    // Get Role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profile) {
      setRole(profile.role)
    }

    // If Admin → Get Facility from facilities
    if (profile?.role === "hospital_admin") {
      const { data: facility } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .single()

      if (facility) {
        setFacilityId(facility.id)
      }
    }

    // If Staff → Get Facility from staff table
    if (profile?.role === "hospital_staff") {
      const { data: staff } = await supabase
        .from("staff")
        .select("facility_id, department_id, position")
        .eq("user_id", user.id)
        .single()

      if (staff) {
        setFacilityId(staff.facility_id)

        console.log("Staff Department:", staff.department_id)
        console.log("Staff Position:", staff.position)
      }
    }

  } catch (error) {
    console.error("Error fetching facility:", error)
  }
}
//   useEffect(() => {
//     loadBills()
//   }, [facilityId])
useEffect(() => {
  if (facilityId && role) {
    loadBills()
  }
}, [facilityId, role])

  useEffect(() => {
    loadItems()
    loadBills()
  }, [facilityId])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await billingService.getItems(facilityId)
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
     toast({
  title: 'Error',
  description: 'Failed to load items',
  variant: 'destructive',
})
    } finally {
      setLoading(false)
    }
  }

  

//   const loadBills = async () => {
//       const data = await billingService.getBills(facilityId)
//       setBills(data)
//   }
 const loadBills = async () => {
  setLoading(true)

  try {
    let data

    if (role === 'hospital_staff') {
      data = await billingService.getBillsStaff(
        facilityId,
        userId,
        role
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
  const handleCreateBill = async (billData: any) => {
    setLoading(true)
    try {
      await billingService.createBill({
        ...billData,
        facility_id: facilityId,
        created_by: userId
      })
      toast({
  title: 'Success',
  description: 'Bill created successfully!',
})
      setActiveTab('bills')
      loadBills()
    } catch (error: any) {
      console.error('Error creating bill:', error)
      toast({
  title: 'Error Creating Bill',
  description: error?.message ?? 'Unable to create bill. Please try again.',
  variant: 'destructive',
})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            {/* <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bills')}
                className={`${
                  activeTab === 'bills'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                View Bills
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create New Bill
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`${
                  activeTab === 'items'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Manage Items
              </button>
            </nav> */}
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">

<button
  onClick={() => setActiveTab('bills')}
  className={`${activeTab === 'bills'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
>
  View Bills
</button>

{/* Admin + Staff */}
<button
  onClick={() => setActiveTab('create')}
  className={`${activeTab === 'create'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
>
  Create New Bill
</button>

{/* Only Admin */}
{role === 'hospital_admin' && (
<button
  onClick={() => setActiveTab('items')}
  className={`${activeTab === 'items'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
>
  Manage Items
</button>
)}

</nav>
          </div>

          <div className="p-6">
            {activeTab === 'bills' && <BillList facilityId={facilityId} userId={userId}  userRole={role}/>}
            {activeTab === 'create' && (
            //   <BillForm 
            //     items={items} 
            //     onSubmit={handleCreateBill} 
            //     loading={loading}
            //   />
            <BillForm
    facilityId={facilityId}
    userId={userId}
    onSuccess={() => {
      loadBills()
      setActiveTab('bills')
    }}
    onCancel={() => setActiveTab('bills')}
    // loading={loading}
    />
            )}
            {activeTab === 'items' && (
              <ItemManager 
                facilityId={facilityId} 
                items={items} 
                onItemsChange={loadItems} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}