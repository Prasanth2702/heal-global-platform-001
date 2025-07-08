import DashboardLayout from "@/components/layouts/DashboardLayout";
import PatientDashboard from "@/components/dashboards/PatientDashboard";

const PatientDashboardPage = () => {
  return (
    <DashboardLayout userType="patient">
      <PatientDashboard />
    </DashboardLayout>
  );
};

export default PatientDashboardPage;