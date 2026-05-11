import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import PatientChatHistory from './PatientChatHistory'

const PatientChatHistoryView = () => {
  return (
    <div>
      <DashboardLayout userType='patient'>
        <PatientChatHistory/>
      </DashboardLayout>
    </div>
  )
}

export default PatientChatHistoryView