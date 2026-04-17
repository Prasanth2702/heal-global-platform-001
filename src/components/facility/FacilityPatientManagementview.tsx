import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPatientManagement from './FacilityPatientManagement'

const FacilityPatientManagementview = () => {
  return (
    <div>
       <DashboardLayout userType="facility">
        <FacilityPatientManagement/>
      </DashboardLayout>
    </div>
  )
}

export default FacilityPatientManagementview
