import React from 'react'
import DashboardLayout from "@/components/layouts/DashboardLayout";
import PatientFacilities from './PatientFacilities';

const DashboardLayoutPatient = () => {
  return (
    <div>
       <DashboardLayout userType="patient">
<PatientFacilities/>
       </DashboardLayout>
    </div>
  )
}

export default DashboardLayoutPatient
