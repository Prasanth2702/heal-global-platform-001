import DashboardLayout from "@/components/layouts/DashboardLayout";;
import ViewFacility from "./ViewFacility";

const ViewFacilityPage = () => {
  return (
    <DashboardLayout userType="facility">
      <ViewFacility />
    </DashboardLayout>
  );
};

export default ViewFacilityPage;