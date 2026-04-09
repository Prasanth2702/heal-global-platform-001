import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PaymentDetails from './PaymentDetails'

const PaymentDetailsViews = () => {
  return (
    <div>
      <DashboardLayout userType="doctor">
        <PaymentDetails/>
      </DashboardLayout>
    </div>
  )
}

export default PaymentDetailsViews
