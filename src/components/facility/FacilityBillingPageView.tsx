import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityBillingPage from './FacilityBillingPage'

const FacilityBillingPageView = () => {
  return (
    <div>
      <DashboardLayout userType="facility">
        <FacilityBillingPage/>
      </DashboardLayout>
    </div>
  )
}

export default FacilityBillingPageView
