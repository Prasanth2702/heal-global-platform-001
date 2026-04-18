import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPatientView from './FacilityPatientView'

const FacilityPatientViewsStaff = () => {
  return (
    <div>
        <DashboardLayout userType="hospital_staff">
      < FacilityPatientView/>
    </DashboardLayout>
    </div>
  )
}

export default FacilityPatientViewsStaff
