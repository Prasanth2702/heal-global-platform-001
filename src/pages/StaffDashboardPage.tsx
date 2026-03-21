import DashboardLayout from "@/components/layouts/DashboardLayout";
import StaffDashboard from "@/components/dashboards/StaffDashboard";

const StaffDashboardPage = () => {
  return (
    <DashboardLayout userType="hospital_staff">
      <StaffDashboard />
    </DashboardLayout>
  );
};

export default StaffDashboardPage;