import DashboardLayout from '@/components/layouts/DashboardLayout'
import React from 'react'
import WardDashboardPage from './WardDashboardPage'

const WardDashboardPageStaff = () => {
  return (
    <div>
      <DashboardLayout userType="hospital_staff">
        <WardDashboardPage/>
      </DashboardLayout>
    </div>
  )
}

export default WardDashboardPageStaff
