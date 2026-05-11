import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import MyDocuments from './MyDocuments'

const MyDocumentsView = () => {
  return (
    <div>
      <DashboardLayout userType='patient'>
        <MyDocuments/>
      </DashboardLayout>
    </div>
  )
}

export default MyDocumentsView
