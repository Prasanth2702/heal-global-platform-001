import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import BannerDoctor from './BannerDoctor'

const BannerDoctorView = () => {
  return (
    <div>
      <DashboardLayout userType="doctor">
        <BannerDoctor/>
      </DashboardLayout>
    </div>
  )
}

export default BannerDoctorView
