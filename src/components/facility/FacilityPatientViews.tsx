import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import FacilityPatientView from './FacilityPatientView'

const FacilityPatientViews = () => {
  return (
    <div>
          <DashboardLayout userType="facility">
      < FacilityPatientView/>
    </DashboardLayout>

    </div>
  )
}

export default FacilityPatientViews
