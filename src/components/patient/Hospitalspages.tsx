import HomeLoginPage from "@/pages/Location/HomeLoginPage";
import DoctorSearch from "./DoctorSearch";
import PatientFacilities from "@/pages/patient/PatientFacilities";

const HospitalsPages = () => {
  return (
    <HomeLoginPage>
      <DoctorSearch view="hospitals" />
    </HomeLoginPage>
  );
};

export default HospitalsPages;