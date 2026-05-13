import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import DoctorSubscriptionPlans from './DoctorSubscriptionPlans'

const DoctorSubscriptionPlansView = () => {
  return (
    <div>
      <DashboardLayout userType='doctor'>
        <DoctorSubscriptionPlans/>
      </DashboardLayout>
    </div>
  )
}

export default DoctorSubscriptionPlansView
