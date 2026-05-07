import DashboardLayout from '@/components/layouts/DashboardLayout'
import React from 'react'
import WardDashboardPage from './WardDashboardPage'

const WardDashboardPageView = () => {
  return (
    <div>
      <DashboardLayout userType="facility">
        <WardDashboardPage/>
      </DashboardLayout>
    </div>
  )
}

export default WardDashboardPageView
