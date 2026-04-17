import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { CashFlowReports } from './CashFlowReports'

const CashFlowReportsView = () => {
  return (
    <div>
      <DashboardLayout userType='facility'>
        <CashFlowReports/>
      </DashboardLayout>
    </div>
  )
}

export default CashFlowReportsView
