import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PatientViewFacilityAppiontment from './PatientViewFacilityAppiontment'

const PatientViewsFacility = () => {
  return (
    <div>
       <DashboardLayout userType="patient">
      < PatientViewFacilityAppiontment/>
    </DashboardLayout>
    </div>
  )
}

export default PatientViewsFacility
