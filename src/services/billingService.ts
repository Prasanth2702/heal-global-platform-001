// // // services/billingService.ts

import { supabase } from "@/integrations/supabase/client"

// // import { supabase } from "@/integrations/supabase/client"

// // // Types
// // export interface Category {
// //   id: string
// //   name: string
// //   description: string
// //   facility_id: string
// //   is_active: boolean
// //   created_at: string
// //   updated_at: string
// //   created_by?: string
// //   updated_by?: string
// // }

// // export interface FacilityItem {
// //   id: string
// //   name: string
// //   description: string
// //   category_id: string
// //   category_name?: string
// //   price: number
// //   facility_id: string
// //   is_active: boolean
// //   created_at: string
// //   updated_at: string
// // }

// // export interface BillItem {
// //   item_id: string
// //   item_name?: string
// //   quantity: number
// //   unit_price: number
// //   total_price: number
// // }

// // export interface PaymentDetail {
// //   payment_method: 'cash' | 'online' | 'card'
// //   amount: number
// //   transaction_id?: string
// //   transaction_details?: any
// //   payment_date?: string
// // }

// // export interface Bill {
// //   id: string
// //   bill_number: string
// //   patient_id: string
// //   facility_id: string
// //   facility_name?: string
// //   bill_date: string
// //   subtotal: number
// //   discount_amount: number
// //   discount_percentage: number
// //   discount_approver_name: string
// //   discount_reason: string
// //   total_amount: number
// //   payment_status: 'paid' | 'unpaid' | 'partial'
// //   notes: string
// //   items: BillItem[]
// //   payments: PaymentDetail[]
// //   created_at: string
// //   updated_at: string
// //   created_by?: string
// //   updated_by?: string
// // }

// // export interface CreateBillInput {
// //   patient_id: string
// //   facility_id: string
// //   items: BillItem[]
// //   discount_percentage?: number
// //   discount_amount?: number
// //   discount_approver_name?: string
// //   discount_reason?: string
// //   payment?: PaymentDetail
// //   notes?: string
// //   created_by: string
// // }

// // export interface UpdatePaymentInput {
// //   bill_id: string
// //   payment_method: 'cash' | 'online' | 'card'
// //   amount: number
// //   transaction_id?: string
// //   transaction_details?: any
// //   created_by: string
// // }

// // // Edge function URLs
// // const CREATE_BILL_FUNCTION = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-bill'
// // const UPDATE_PAYMENT_FUNCTION = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/update-payment'

// // class BillingService {
// //   // Get valid JWT for authenticated user (required for edge functions)
// //   private async getAuthHeaders() {
// //     const { data: { session } } = await supabase.auth.getSession()
// //     if (!session?.access_token) {
// //       throw new Error("User not authenticated. Cannot call edge function.")
// //     }
// //     return {
// //       'Content-Type': 'application/json',
// //       'Authorization': `Bearer ${session.access_token}`
// //     }
// //   }

// //   // Categories (unchanged, correct)
// //   async getCategories(facilityId: string): Promise<Category[]> {
// //     const { data, error } = await supabase
// //       .from('facility_categories')
// //       .select('*')
// //       .eq('facility_id', facilityId)
// //       .eq('is_active', true)
// //       .order('name')
// //     if (error) throw error
// //     return data
// //   }

// //   async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
// //     const { data, error } = await supabase
// //       .from('facility_categories')
// //       .insert(category)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   async updateCategory(id: string, updates: Partial<Category>) {
// //     const { data, error } = await supabase
// //       .from('facility_categories')
// //       .update(updates)
// //       .eq('id', id)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   // Items (unchanged, correct)
// //   async getItems(facilityId: string): Promise<FacilityItem[]> {
// //     const { data, error } = await supabase
// //       .from('facility_items_view')
// //       .select('*')
// //       .eq('facility_id', facilityId)
// //       .eq('is_active', true)
// //       .order('name')
// //     if (error) throw error
// //     return data
// //   }

// //   async getItemById(id: string): Promise<FacilityItem> {
// //     const { data, error } = await supabase
// //       .from('facility_items')
// //       .select('*')
// //       .eq('id', id)
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   async createItem(item: Omit<FacilityItem, 'id' | 'created_at' | 'updated_at' | 'category_name'>) {
// //     const { data, error } = await supabase
// //       .from('facility_items')
// //       .insert(item)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   async updateItem(id: string, updates: Partial<FacilityItem>) {
// //     const { data, error } = await supabase
// //       .from('facility_items')
// //       .update(updates)
// //       .eq('id', id)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   // Bills
// //   async getBills(facilityId: string): Promise<Bill[]> {
// //     const { data, error } = await supabase
// //       .from('facility_bill_details_view')
// //       .select('*')
// //       .eq('facility_id', facilityId)
// //       .order('created_at', { ascending: false })
// //     if (error) throw error
// //     return data
// //   }

// //   async getBillById(id: string): Promise<Bill> {
// //     const { data, error } = await supabase
// //       .from('facility_bill_details_view')
// //       .select('*')
// //       .eq('id', id)
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   async getBillsByPatient(patientId: string, facilityId: string): Promise<Bill[]> {
// //     const { data, error } = await supabase
// //       .from('facility_bill_details_view')
// //       .select('*')
// //       .eq('patient_id', patientId)
// //       .eq('facility_id', facilityId)
// //       .order('created_at', { ascending: false })
// //     if (error) throw error
// //     return data
// //   }

// //   // Create bill using edge function (fixed authentication)
// //   async createBill(billData: CreateBillInput): Promise<any> {
// //     try {
// //       const headers = await this.getAuthHeaders()
// //       const response = await fetch(CREATE_BILL_FUNCTION, {
// //         method: 'POST',
// //         headers,
// //         body: JSON.stringify(billData)
// //       })

// //       if (!response.ok) {
// //         const error = await response.json()
// //         throw new Error(error.message || 'Failed to create bill')
// //       }

// //       const result = await response.json()
// //       return result
// //     } catch (error) {
// //       console.error('Error creating bill:', error)
// //       throw error
// //     }
// //   }

// //   // Update payment using edge function (fixed authentication)
// //   async updatePayment(paymentData: UpdatePaymentInput): Promise<any> {
// //     try {
// //       const headers = await this.getAuthHeaders()
// //       const response = await fetch(UPDATE_PAYMENT_FUNCTION, {
// //         method: 'POST',
// //         headers,
// //         body: JSON.stringify(paymentData)
// //       })

// //       if (!response.ok) {
// //         const error = await response.json()
// //         throw new Error(error.message || 'Failed to update payment')
// //       }

// //       const result = await response.json()
// //       return result
// //     } catch (error) {
// //       console.error('Error updating payment:', error)
// //       throw error
// //     }
// //   }

// //   // Direct bill update without edge function
// //   async updateBillStatus(billId: string, status: 'paid' | 'unpaid' | 'partial', userId: string) {
// //     const { data, error } = await supabase
// //       .from('facility_bills')
// //       .update({ 
// //         payment_status: status,
// //         updated_by: userId,
// //         updated_at: new Date().toISOString()
// //       })
// //       .eq('id', billId)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   async addPaymentToBill(billId: string, payment: PaymentDetail, userId: string) {
// //     const { data, error } = await supabase
// //       .from('facility_payment_details')
// //       .insert({
// //         bill_id: billId,
// //         payment_method: payment.payment_method,
// //         amount: payment.amount,
// //         transaction_id: payment.transaction_id,
// //         transaction_details: payment.transaction_details,
// //         payment_date: payment.payment_date || new Date().toISOString(),
// //         payment_status: 'completed',
// //         created_by: userId
// //       })
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   }

// //   // Audit logs
// //   async getAuditLogs(tableName: string, recordId: string) {
// //     const { data, error } = await supabase
// //       .from('facility_audit_logs')
// //       .select('*')
// //       .eq('table_name', tableName)
// //       .eq('record_id', recordId)
// //       .order('changed_at', { ascending: false })
// //     if (error) throw error
// //     return data
// //   }

// //   // Reports and analytics – fixed date filtering and payment summary
// //   async getPaymentSummary(facilityId: string, startDate?: string, endDate?: string) {
// //     // Note: This relies on facility_payment_summary_view existing and having a last_payment_date column.
// //     let query = supabase
// //       .from('facility_payment_summary_view')
// //       .select('*')
// //       .eq('facility_id', facilityId)
    
// //     if (startDate && endDate) {
// //       query = query.gte('last_payment_date', startDate).lte('last_payment_date', endDate)
// //     }
    
// //     const { data, error } = await query
// //     if (error) throw error
// //     return data
// //   }

// //   // Fixed getDailyRevenue – now joins through facility_bills
// //   async getDailyRevenue(facilityId: string, date: string) {
// //     // Query payments that belong to bills of this facility on the given date
// //     const { data, error } = await supabase
// //       .from('facility_payment_details')
// //       .select(`
// //         amount,
// //         payment_method,
// //         facility_bills!inner (facility_id)
// //       `)
// //       .eq('facility_bills.facility_id', facilityId)
// //       .gte('payment_date', `${date}T00:00:00`)
// //       .lte('payment_date', `${date}T23:59:59`)
// //       .eq('payment_status', 'completed')

// //     if (error) throw error

// //     const total = data.reduce((sum: number, p: any) => sum + p.amount, 0)
// //     const byMethod = data.reduce((acc: Record<string, number>, p: any) => {
// //       acc[p.payment_method] = (acc[p.payment_method] || 0) + p.amount
// //       return acc
// //     }, {})

// //     return { total, byMethod, details: data }
// //   }

// //   // Real-time subscriptions – fixed filter syntax
// //   subscribeToBills(facilityId: string, callback: (bill: Bill) => void) {
// //     const subscription = supabase
// //       .channel('facility_bills_changes')
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'facility_bills',
// //           filter: `facility_id=eq.${facilityId}`  // correct syntax
// //         },
// //         (payload) => {
// //           callback(payload.new as Bill)
// //         }
// //       )
// //       .subscribe()

// //     return subscription
// //   }

// //   subscribeToPayments(billId: string, callback: (payment: PaymentDetail) => void) {
// //     const subscription = supabase
// //       .channel('facility_payments_changes')
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: 'INSERT',
// //           schema: 'public',
// //           table: 'facility_payment_details',
// //           filter: `bill_id=eq.${billId}`  // fixed
// //         },
// //         (payload) => {
// //           callback(payload.new as PaymentDetail)
// //         }
// //       )
// //       .subscribe()

// //     return subscription
// //   }
// // }

// // export const billingService = new BillingService()


// // services/billingService.ts
// import { supabase } from "@/integrations/supabase/client"

// // Types (unchanged)
// export interface Category {
//   id: string
//   name: string
//   description: string
//   facility_id: string
//   is_active: boolean
//   created_at: string
//   updated_at: string
//   created_by?: string
//   updated_by?: string
// }

// export interface FacilityItem {
//   id: string
//   name: string
//   description: string
//   category_id: string
//   category_name?: string
//   price: number
//   facility_id: string
//   is_active: boolean
//   created_at: string
//   updated_at: string
// }

// export interface BillItem {
//   item_id: string
//   item_name?: string
//   quantity: number
//   unit_price: number
//   total_price: number
// }

// export interface PaymentDetail {
//   payment_method: 'cash' | 'online' | 'card'
//   amount: number
//   transaction_id?: string
//   transaction_details?: any
//   payment_date?: string
// }

// export interface Bill {
//   id: string
//   bill_number: string
//   patient_id: string
//   facility_id: string
//   facility_name?: string
//   bill_date: string
//   subtotal: number
//   discount_amount: number
//   discount_percentage: number
//   discount_approver_name: string
//   discount_reason: string
//   total_amount: number
//   payment_status: 'paid' | 'unpaid' | 'partial'
//   notes: string
//   items: BillItem[]
//   payments: PaymentDetail[]
//   created_at: string
//   updated_at: string
//   created_by?: string
//   updated_by?: string
// }

// export interface CreateBillInput {
//   patient_id: string
//   facility_id: string
//   items: BillItem[]
//   discount_percentage?: number
//   discount_amount?: number
//   discount_approver_name?: string
//   discount_reason?: string
//   payment?: PaymentDetail
//   notes?: string
//   created_by: string
// }

// export interface UpdatePaymentInput {
//   bill_id: string
//   payment_method: 'cash' | 'online' | 'card'
//   amount: number
//   transaction_id?: string
//   transaction_details?: any
//   created_by: string
// }

// // Edge function URLs
// const CREATE_BILL_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-bill'
// const UPDATE_PAYMENT_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/update-payment'
// const CREATE_BATCH_BILLS_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-bill-batch'

// class BillingService {
//   // Get valid JWT for authenticated user
//   private async getAuthHeaders() {
//     const { data: { session } } = await supabase.auth.getSession()
//     if (!session?.access_token) {
//       throw new Error("User not authenticated. Cannot call edge function.")
//     }
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${session.access_token}`
//     }
//   }

//   // ==================== Categories ====================
//   async getCategories(facilityId: string): Promise<Category[]> {
//     const { data, error } = await supabase
//       .from('facility_categories')
//       .select('*')
//       .eq('facility_id', facilityId)
//       .eq('is_active', true)
//       .order('name')
//     if (error) throw error
//     return data
//   }

//   async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
//     const { data, error } = await supabase
//       .from('facility_categories')
//       .insert(category)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   async updateCategory(id: string, updates: Partial<Category>) {
//     const { data, error } = await supabase
//       .from('facility_categories')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   // ==================== Items ====================
//   async getItems(facilityId: string): Promise<FacilityItem[]> {
//     const { data, error } = await supabase
//       .from('facility_items_view')
//       .select('*')
//       .eq('facility_id', facilityId)
//       .eq('is_active', true)
//       .order('name')
//     if (error) throw error
//     return data
//   }

//   async getItemById(id: string): Promise<FacilityItem> {
//     const { data, error } = await supabase
//       .from('facility_items')
//       .select('*')
//       .eq('id', id)
//       .single()
//     if (error) throw error
//     return data
//   }

//   async createItem(item: Omit<FacilityItem, 'id' | 'created_at' | 'updated_at' | 'category_name'>) {
//     const { data, error } = await supabase
//       .from('facility_items')
//       .insert(item)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   async updateItem(id: string, updates: Partial<FacilityItem>) {
//     const { data, error } = await supabase
//       .from('facility_items')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   // ==================== Bills (Direct Supabase) ====================
//   async getBills(facilityId: string): Promise<Bill[]> {
//     const { data, error } = await supabase
//       .from('facility_bill_details_view')
//       .select('*')
//       .eq('facility_id', facilityId)
//       .order('created_at', { ascending: false })
//     if (error) throw error
//     return data
//   }

//   async getBillById(id: string): Promise<Bill> {
//     const { data, error } = await supabase
//       .from('facility_bill_details_view')
//       .select('*')
//       .eq('id', id)
//       .single()
//     if (error) throw error
//     return data
//   }

//   async getBillsByPatient(patientId: string, facilityId: string): Promise<Bill[]> {
//     const { data, error } = await supabase
//       .from('facility_bill_details_view')
//       .select('*')
//       .eq('patient_id', patientId)
//       .eq('facility_id', facilityId)
//       .order('created_at', { ascending: false })
//     if (error) throw error
//     return data
//   }

//   // ==================== Edge Functions (Authenticated) ====================
//   async createBill(billData: CreateBillInput): Promise<any> {
//     // Validate items
//     if (!billData.items || billData.items.length === 0) {
//       throw new Error('At least one item is required')
//     }
//     for (const item of billData.items) {
//       if (!item.item_id) {
//         throw new Error('Item ID is required for all items')
//       }
//       if (!item.quantity || item.quantity <= 0) {
//         throw new Error('Quantity must be greater than 0')
//       }
//       if (item.unit_price === undefined || item.unit_price < 0) {
//         throw new Error('Unit price must be a positive number')
//       }
//     }

//     try {
//       const headers = await this.getAuthHeaders()
//       const response = await fetch(CREATE_BILL_URL, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(billData)
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Failed to create bill')
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error('Error creating bill:', error)
//       throw error
//     }
//   }

//   async createMultipleBills(
//     billsData: Array<Omit<CreateBillInput, 'facility_id' | 'created_by'>>,
//     facilityId: string,
//     userId: string
//   ): Promise<any> {
//     try {
//       const headers = await this.getAuthHeaders()
//       const response = await fetch(CREATE_BATCH_BILLS_URL, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           bills: billsData,
//           facility_id: facilityId,
//           created_by: userId
//         })
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Failed to create bills')
//       }

//       return response.json()
//     } catch (error) {
//       console.error('Error creating multiple bills:', error)
//       throw error
//     }
//   }

//   async updatePayment(paymentData: UpdatePaymentInput): Promise<any> {
//     try {
//       const headers = await this.getAuthHeaders()
//       const response = await fetch(UPDATE_PAYMENT_URL, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(paymentData)
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Failed to update payment')
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error('Error updating payment:', error)
//       throw error
//     }
//   }

//   // Direct bill update without edge function
//   async updateBillStatus(billId: string, status: 'paid' | 'unpaid' | 'partial', userId: string) {
//     const { data, error } = await supabase
//       .from('facility_bills')
//       .update({ 
//         payment_status: status,
//         updated_by: userId,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', billId)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   async addPaymentToBill(billId: string, payment: PaymentDetail, userId: string) {
//     const { data, error } = await supabase
//       .from('facility_payment_details')
//       .insert({
//         bill_id: billId,
//         payment_method: payment.payment_method,
//         amount: payment.amount,
//         transaction_id: payment.transaction_id,
//         transaction_details: payment.transaction_details,
//         payment_date: payment.payment_date || new Date().toISOString(),
//         payment_status: 'completed',
//         created_by: userId
//       })
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   }

//   // ==================== Audit & Reports ====================
//   async getAuditLogs(tableName: string, recordId: string) {
//     const { data, error } = await supabase
//       .from('facility_audit_logs')
//       .select('*')
//       .eq('table_name', tableName)
//       .eq('record_id', recordId)
//       .order('changed_at', { ascending: false })
//     if (error) throw error
//     return data
//   }

//   async getPaymentSummary(facilityId: string, startDate?: string, endDate?: string) {
//     let query = supabase
//       .from('facility_payment_summary_view')
//       .select('*')
//       .eq('facility_id', facilityId)
    
//     if (startDate && endDate) {
//       query = query.gte('last_payment_date', startDate).lte('last_payment_date', endDate)
//     }
    
//     const { data, error } = await query
//     if (error) throw error
//     return data
//   }

//   async getDailyRevenue(facilityId: string, date: string) {
//     const { data, error } = await supabase
//       .from('facility_payment_details')
//       .select(`
//         amount,
//         payment_method,
//         facility_bills!inner (facility_id)
//       `)
//       .eq('facility_bills.facility_id', facilityId)
//       .gte('payment_date', `${date}T00:00:00`)
//       .lte('payment_date', `${date}T23:59:59`)
//       .eq('payment_status', 'completed')

//     if (error) throw error

//     const total = data.reduce((sum: number, p: any) => sum + p.amount, 0)
//     const byMethod = data.reduce((acc: Record<string, number>, p: any) => {
//       acc[p.payment_method] = (acc[p.payment_method] || 0) + p.amount
//       return acc
//     }, {})

//     return { total, byMethod, details: data }
//   }

//   // ==================== Real-time Subscriptions ====================
//   subscribeToBills(facilityId: string, callback: (bill: Bill) => void) {
//     const subscription = supabase
//       .channel('facility_bills_changes')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'facility_bills',
//           filter: `facility_id=eq.${facilityId}`
//         },
//         (payload) => {
//           callback(payload.new as Bill)
//         }
//       )
//       .subscribe()

//     return subscription
//   }

//   subscribeToPayments(billId: string, callback: (payment: PaymentDetail) => void) {
//     const subscription = supabase
//       .channel('facility_payments_changes')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'facility_payment_details',
//           filter: `bill_id=eq.${billId}`
//         },
//         (payload) => {
//           callback(payload.new as PaymentDetail)
//         }
//       )
//       .subscribe()

//     return subscription
//   }
// }

// export const billingService = new BillingService()

// services/billingService.ts

export interface Category {
  id: string
  name: string
  description: string
  facility_id: string
  is_active: boolean
}

export interface FacilityItem {
  id: string
  name: string
  description: string
  category_id: string
  category_name?: string
  price: number
  facility_id: string
  is_active: boolean
}

export interface BillItem {
  id?: string
  item_id: string
  item_name?: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface PaymentDetail {
  id?: string
  payment_method: 'cash' | 'online' | 'card'
  amount: number
  transaction_id?: string
  transaction_details?: any
  payment_date?: string
  payment_status?: string
}

export interface PatientInfo {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
  created_at: string
}

export interface FacilityInfo {
  id: string
  facility_name: string
  facility_type: string
  license_number: string
  address: string
  city: string
  state: string
  pincode: number
  phone?: string
  email?: string
  website?: string
}

export interface Bill {
  id: string
  bill_number: string
  patient_id: string
  patient_info?: PatientInfo
  facility_id: string
  facility_info?: FacilityInfo
  bill_date: string
  subtotal: number
  discount_amount: number
  discount_percentage: number
  discount_approver_name: string
  discount_reason: string
  total_amount: number
  payment_status: 'paid' | 'unpaid' | 'partial'
  notes: string
  items: BillItem[]
  payments: PaymentDetail[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface CreateBillInput {
  patient_id: string
  facility_id: string
  items: BillItem[]
  discount_percentage?: number
  discount_amount?: number
  discount_approver_name?: string
  discount_reason?: string
  payment?: PaymentDetail
  notes?: string
  created_by: string
}

const CREATE_BILL_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-bill'
const UPDATE_BILL_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/update-bill'
const UPDATE_PAYMENT_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/update-payment'
const DELETE_BILL_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-bill'

class BillingService {
//   private async callEdgeFunction(url: string, body: any) {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
//       },
//       body: JSON.stringify(body)
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Edge function call failed')
//     }

//     return response.json()
//   }
private async callEdgeFunction(url: string, body: any) {
  const { data: sessionData } = await supabase.auth.getSession()

  const token = sessionData?.session?.access_token

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Edge function call failed')
  }

  return response.json()
}
  async getPatientInfo(patientId: string): Promise<PatientInfo | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', patientId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching patient:', error)
      return null
    }
    return data
  }

  async getFacilityInfo(facilityId: string): Promise<FacilityInfo | null> {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facilityId)
      .single()

      

    if (error) {
      console.error('Error fetching facility:', error)
      return null
    }
    return data
  }

  async getCategories(facilityId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('facility_categories')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data
  }

  async getItems(facilityId: string): Promise<FacilityItem[]> {
    const { data, error } = await supabase
      .from('facility_items_view')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('is_active', true)
      .order('name')
    
    // if (error) throw error
    return data
  }

  async getBills(facilityId: string): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('facility_bill_details_view')
      .select('*')
      .eq('facility_id', facilityId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Enrich bills with patient and facility info
    const enrichedBills = await Promise.all(
      (data || []).map(async (bill) => {
        const [patientInfo, facilityInfo] = await Promise.all([
          this.getPatientInfo(bill.patient_id),
          this.getFacilityInfo(bill.facility_id)
        ])
        return { ...bill, patient_info: patientInfo, facility_info: facilityInfo }
      })
    )
    
    return enrichedBills
  }

  async getBillById(id: string): Promise<Bill> {
    const { data, error } = await supabase
      .from('facility_bill_details_view')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    const [patientInfo, facilityInfo] = await Promise.all([
      this.getPatientInfo(data.patient_id),
      this.getFacilityInfo(data.facility_id)
    ])
    
    return { ...data, patient_info: patientInfo, facility_info: facilityInfo }
  }

//   async getBillsStaff(facilityId: string, userId?: string, userRole?: string): Promise<Bill[]> {
//   let query = supabase
//     .from('facility_bill_details_view')
//     .select('*')
//     .eq('facility_id', facilityId)
//     .order('created_at', { ascending: false });

//   // For hospital staff, only show bills they added
//   if (userRole === 'hospital_staff' && userId) {
//     query = query.eq('created_by', userId);
//   }

//   const { data, error } = await query;
//   if (error) throw error;

//   // Enrich bills with patient and facility info
//   const enrichedBills = await Promise.all(
//     (data || []).map(async (bill) => {
//       const [patientInfo, facilityInfo] = await Promise.all([
//         this.getPatientInfo(bill.patient_id),
//         this.getFacilityInfo(bill.facility_id)
//       ]);
//       return { ...bill, patient_info: patientInfo, facility_info: facilityInfo };
//     })
//   );
//   return enrichedBills;
// }
async getBillsStaff(
  facilityId: string,
  userId?: string,
  userRole?: string
): Promise<Bill[]> {

  let query = supabase
    .from('facility_bill_details_view')
    .select('*')
    .eq('facility_id', facilityId)
    .order('created_at', { ascending: false });

  if (userRole === 'hospital_staff' && userId) {
    query = query.eq('created_by', userId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const enrichedBills = await Promise.all(
    (data || []).map(async (bill) => {
      const [patientInfo, facilityInfo] = await Promise.all([
        this.getPatientInfo(bill.patient_id),
        this.getFacilityInfo(bill.facility_id)
      ]);

      return {
        ...bill,
        patient_info: patientInfo,
        facility_info: facilityInfo
      };
    })
  );

  return enrichedBills;
}
  async searchPatients(searchTerm: string): Promise<PatientInfo[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'patient')
    .limit(10)

  if (searchTerm) {
    query = query.or(
      `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
    )
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

  async createBill(billData: CreateBillInput): Promise<any> {
    return this.callEdgeFunction(CREATE_BILL_URL, billData)
  }

  async updateBill(updateData: any): Promise<any> {
    return this.callEdgeFunction(UPDATE_BILL_URL, updateData)
  }

  async updatePayment(paymentData: any): Promise<any> {
    return this.callEdgeFunction(UPDATE_PAYMENT_URL, paymentData)
  }

  async deleteBill(billId: string, userId: string, hardDelete: boolean = false, reason?: string): Promise<any> {
    return this.callEdgeFunction(DELETE_BILL_URL, {
      bill_id: billId,
      deleted_by: userId,
      hard_delete: hardDelete,
      reason: reason
    })
  }

  async createCategory(category: any) {
    const { data, error } = await supabase
      .from('facility_categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async createItem(item: any) {
    const { data, error } = await supabase
      .from('facility_items')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

    async updateItem(id: string, updates: Partial<FacilityItem>) {
    const { data, error } = await supabase
      .from('facility_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  
}

export const billingService = new BillingService()