import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilitySubscriptionPlans from './FacilitySubscriptionPlans'

const FacilitySubscriptionPlansView = () => {
  return (
    <div>
      <DashboardLayout userType='facility'>
        <FacilitySubscriptionPlans/>
      </DashboardLayout>
    </div>
  )
}

export default FacilitySubscriptionPlansView