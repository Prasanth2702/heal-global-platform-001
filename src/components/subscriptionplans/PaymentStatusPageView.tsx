import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PaymentStatusPage from './PaymentStatusPage'

const PaymentStatusPageView = () => {
  return (
    <div>
      <DashboardLayout userType='doctor'>
        <PaymentStatusPage/>
      </DashboardLayout>
    </div>
  )
}

export default PaymentStatusPageView
