import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PaymentStatusPage from './PaymentStatusPage'
import PaymentStatusPageFacility from './PaymentStatusPageFacility'

const PaymentStatusPageViewFacility = () => {
  return (
    <div>
      <DashboardLayout userType='facility'>
        <PaymentStatusPageFacility/>
      </DashboardLayout>
    </div>
  )
}

export default PaymentStatusPageViewFacility