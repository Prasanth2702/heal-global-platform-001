import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { BillingSystem } from './BillingSystem'

const BillingSystemView = () => {
  return (
    <div>
         <DashboardLayout userType="facility">
        <BillingSystem/>
      </DashboardLayout>
    </div>
  )
}

export default BillingSystemView
