import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPendingView from './FacilityPendingView'

const FacilityPendingStaffViewPage = () => {
  return (
    <div>
      <DashboardLayout userType="hospital_staff">
      < FacilityPendingView/>
    </DashboardLayout>
    </div>
  )
}

export default FacilityPendingStaffViewPage
