import HomeLoginPage from "@/pages/Location/HomeLoginPage";
import DoctorSearch from "./DoctorSearch";
import PatientFacilities from "@/pages/patient/PatientFacilities";

const DoctorPages = () => {
  return (
    <HomeLoginPage>
      <DoctorSearch view="doctors" />
    </HomeLoginPage>
  );
};

export default DoctorPages;