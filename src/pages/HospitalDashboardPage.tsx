import DashboardLayout from "@/components/layouts/DashboardLayout";
import HospitalDashboard from "@/components/dashboards/HospitalDashboard";

const HospitalDashboardPage = () => {
  return (
    <DashboardLayout userType="facility">
      <HospitalDashboard />
    </DashboardLayout>
  );
};

export default HospitalDashboardPage;