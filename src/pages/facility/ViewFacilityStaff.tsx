import DashboardLayout from '@/components/layouts/DashboardLayout'
import React from 'react'
import ViewFacility from './ViewFacility'

const ViewFacilityStaff = () => {
  return (
    <div>
      <DashboardLayout userType="hospital_staff">
      <ViewFacility />
    </DashboardLayout>
    </div>
  )
}

export default ViewFacilityStaff
