import DashboardLayout from "@/components/layouts/DashboardLayout";
import SuperAdminDashboard from "@/components/dashboards/SuperAdminDashboard";

const SuperAdminDashboardPage = () => {
  return (
    <DashboardLayout userType="admin">
      <SuperAdminDashboard />
    </DashboardLayout>
  );
};

export default SuperAdminDashboardPage;