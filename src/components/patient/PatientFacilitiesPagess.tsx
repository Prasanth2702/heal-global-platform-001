import HomeLoginPage from '@/pages/Location/HomeLoginPage'
import PatientFacilitiesId from '@/pages/patient/PatientFacilitiesId'
import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'

const PatientFacilitiesPagess = () => {
  return (
    <div>
      <DashboardLayout userType="patient">
      <PatientFacilitiesId/>
    </DashboardLayout>
    </div>
  )
}

export default PatientFacilitiesPagess
