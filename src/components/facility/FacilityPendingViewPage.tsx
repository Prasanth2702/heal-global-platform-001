import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPendingView from './FacilityPendingView'

const FacilityPendingViewPage = () => {
  return (
    <div>
      <DashboardLayout userType="facility">
        <FacilityPendingView/>
      </DashboardLayout>
    </div>
  )
}

export default FacilityPendingViewPage