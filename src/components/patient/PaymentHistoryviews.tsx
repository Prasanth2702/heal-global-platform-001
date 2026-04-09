import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PaymentHistory from './PaymentHistory'

const PaymentHistoryviews = () => {
  return (
    <div>
      <DashboardLayout userType="patient">
        <PaymentHistory/>
      </DashboardLayout>
    </div>
  )
}

export default PaymentHistoryviews
