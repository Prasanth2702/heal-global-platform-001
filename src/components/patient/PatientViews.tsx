import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPatientView from '../facility/FacilityPatientView'

const PatientViews = () => {
  return (
    <div>
      
          <DashboardLayout userType="patient">
      < FacilityPatientView/>
    </DashboardLayout>
    </div>
  )
}

export default PatientViews
