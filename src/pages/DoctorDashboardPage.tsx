import DashboardLayout from "@/components/layouts/DashboardLayout";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";

const DoctorDashboardPage = () => {
  return (
    <DashboardLayout userType="doctor">
      <DoctorDashboard />
    </DashboardLayout>
  );
};

export default DoctorDashboardPage;