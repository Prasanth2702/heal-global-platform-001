import DashboardLayout from '@/components/layouts/DashboardLayout'
import React from 'react'
import FacilityLimitChecker from './FacilityLimitChecker'

const FacilityLimitCheckerView = () => {
  return (
    <div>
      <DashboardLayout userType="facility">
        <FacilityLimitChecker/>
      </DashboardLayout>
    </div>
  )
}

export default FacilityLimitCheckerView
