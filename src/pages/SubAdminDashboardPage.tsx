import DashboardLayout from "@/components/layouts/DashboardLayout";
import SubAdminDashboard from "@/components/dashboards/SubAdminDashboard";

const SubAdminDashboardPage = () => {
  return (
    <DashboardLayout userType="admin">
      <SubAdminDashboard />
    </DashboardLayout>
  );
};

export default SubAdminDashboardPage;