import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPatientView from '../facility/FacilityPatientView'

const DoctorPatientViewss = () => {
  return (
    <div>
      <DashboardLayout userType="doctor">
      < FacilityPatientView/>
    </DashboardLayout>
    </div>
  )
}

export default DoctorPatientViewss