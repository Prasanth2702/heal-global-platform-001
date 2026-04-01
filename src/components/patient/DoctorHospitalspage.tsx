import HomeLoginPage from "@/pages/Location/HomeLoginPage";
import DoctorSearch from "./DoctorSearch";
import PatientFacilities from "@/pages/patient/PatientFacilities";

const DoctorHospitalsPage = () => {
  return (
    <HomeLoginPage>
      <PatientFacilities view="beds" />
    </HomeLoginPage>
  );
};

export default DoctorHospitalsPage;