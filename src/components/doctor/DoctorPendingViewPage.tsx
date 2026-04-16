import React from 'react'
import DoctorPendingView from './DoctorPendingView'
import DashboardLayout from '../layouts/DashboardLayout'

const DoctorPendingViewPage = () => {
  return (
    <div>
      <DashboardLayout userType="doctor">
        <DoctorPendingView/>
      </DashboardLayout>
    </div>
  )
}

export default DoctorPendingViewPage
