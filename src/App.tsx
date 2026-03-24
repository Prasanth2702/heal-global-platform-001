import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientRegistration from "./components/auth/PatientRegistration";
import DoctorRegistration from "./components/auth/DoctorRegistration";
import FacilityRegistration from "./components/auth/FacilityRegistration";
import LoginForm from "./components/auth/LoginForm";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import HospitalDashboardPage from "./pages/HospitalDashboardPage";
import SuperAdminDashboardPage from "./pages/SuperAdminDashboardPage";
import SubAdminDashboardPage from "./pages/SubAdminDashboardPage";
import AppointmentSystemPage from "./pages/AppointmentSystemPage";
import DocumentVaultPage from "./pages/DocumentVaultPage";
import SecureViewPage from "./pages/SecureViewPage";
import PaymentSystemPage from "./pages/PaymentSystemPage";
import ApiSetupPage from "./pages/ApiSetupPage";
import QATestingPage from "./pages/QATestingPage";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import InstallPrompt from "./components/pwa/InstallPrompt";
import MaintenancePage from "./pages/MaintenancePage";
import { PopupProvider } from "@/contexts/popup-context";
import DoctorProfile from "./components/doctor/DoctorProfile";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import AppointmentBooking from "./components/appointments/AppointmentBooking";
import DoctorAppointmentCard from "./components/doctor/DoctorAppointmentCard";
import WardBedManagement from "./components/ward-management/WardBedManagement";
import PatientBookBedPage from "./pages/patient/PatientBookBedPage";
import WardDashboardPage from "./pages/WardDashboardPage";
import BedBookingView from "./components/bedbooking/BedBookingView";
import PatientFacilities from "./pages/patient/PatientFacilities";
import ViewBedBooking from "./pages/patient/ViewBedBooking";
import BedBookingRegister from "./pages/patient/BedBookingRegister";
import PatientDetailsPage from "./pages/patient/PatientDetailsPage";
import ViewFacility from "./pages/facility/ViewFacility";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorHospitals from "./components/patient/DoctorHospitals";
import HomeLogin from "./components/patient/HomeLogin";
import DepartmentDetails from "./components/patient/DepartmentDetails";
import Departments from "./components/facility/Departments";
import DashboardLayoutPatient from "./pages/patient/DashboardLayoutPatient"
import DoctorSchedulePage from "./components/doctor/DoctorSchedulePage";
import CookiePopup from "./pages/Affiliate/CookiePopup";
import AboutPage from "./components/basicspage/AboutPage";
import Contact from "./components/basicspage/Contact";
import PrivacyPolicy from "./components/basicspage/PrivacyPolicy";
import RefundPolicy from "./components/basicspage/RefundPolicy";
import TermsOfService from "./components/basicspage/TermsOfService";
import ArticlesAndGuides from "./components/basicspage/ArticlesAndGuides";
import CookiePolicy from "./components/basicspage/CookiePolicy";
import Blog from "./components/basicspage/Blog";
import DoctorPage from "./components/basicspage/DoctorPage";
import HospitalsPage from "./components/basicspage/HospitalsPage";
import BookAppointment from "./components/basicspage/BookAppointment";
import FacilityAppointmentManagementPage from "./components/facility/FacilityAppointmentManagement";
import FacilityAppointmentManagement from "./components/facility/FacilityAppointmentManagement";
import Location from "./pages/Location/Location";
import ForgotPassword from "./components/auth/ForgotPassword";
import HomeLoginPage from "./pages/Location/HomeLoginPage";
import DoctorHospitalsDetails from "./components/patient/DoctorHospitalsDetails";
import DepartmentDetailsFacility from "./components/patient/DepartmentDetailsFacility";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import ViewFacilityStaff from "./pages/facility/ViewFacilityStaff";
import ViewFacilityPage from "./pages/facility/ViewFacilityPage";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();
const MAINTENANCE = false;

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const loginTime = localStorage.getItem("loginTime");

      if (!loginTime) return;

      const diff = Date.now() - Number(loginTime);

      if (diff > 5 * 60 * 60 * 1000) {
        await supabase.auth.signOut();

        localStorage.clear();

        alert("Session expired");

        navigate("/login/patient");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [navigate]);
};
const AutoLogoutWrapper = () => {
  useAutoLogout();
  return null;
};
// 🔥ADDED
const DoctorProfilePage = () => {
  const navigate = useNavigate();
  return <DoctorProfile onBack={() => navigate(-1)} />;
};

// const DoctorSchedulePage = () => {
//   return (
//     <DoctorAppointmentCard
//       appointment={null}
//       onRefresh={() => {}}
//       onJoinVideo={() => {
//         console.log("Joining video call...");
//       }}
//     />
//   );
// };

const App = () => {
  if (MAINTENANCE) {
    return <MaintenancePage></MaintenancePage>;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <PopupProvider>
        <HelmetProvider>
          <ApiKeyProvider>
            <TooltipProvider>
              {/* <CookiePopup /> */}
              <Toaster />
              <Sonner />
              {/* <InstallPrompt /> */}
              <BrowserRouter>
              <AutoLogoutWrapper/>
              {/* <Location/> */}
                <Routes>
                  <Route path="/" element={<Index />} />

                  {/* Authentication Routes */}
                  <Route
                    path="/register/patient"
                    element={<PatientRegistration />}
                  />
                  <Route
                    path="/register/doctor"
                    element={<DoctorRegistration />}
                  />
                  <Route
                    path="/register/facility"
                    element={<FacilityRegistration />}
                  />
                  <Route path="/login/:userType" element={<LoginForm />} />
                  <Route path="/forgot-password/:userType" element={<ForgotPassword />} />

                  {/* Onboarding Routes */}
                  <Route
                    path="/onboarding/:userType"
                    element={<OnboardingWizard />}
                  />

                  {/* Dashboard Routes */}
                  <Route
                    path="/dashboard/patient"
                    element={<PatientDashboardPage />}
                  />
                  <Route
                    path="/dashboard/patient/*"
                    element={<PatientDashboardPage />}
                  />
                  <Route
                    path="/dashboard/patient/book/patient-facilities"
                    element={<DashboardLayoutPatient />}
                  />
                  {/* <Route
                    path="/dashboard/patient/my_bed_bookings"
                    element={<PatientDetailsPage />}
                  /> */}

                  {/* ✅ FIXED: Removed duplicate /dashboard/patient/book route */}
                  <Route
                    path="/dashboard/patient/book/:facilityId"
                    element={<PatientBookBedPage />}
                  />
                  <Route
                    path="/dashboard/patient/booking/:facilityId"
                    element={<ViewBedBooking />}
                  />
                  <Route
                    path="/dashboard/patient/bookregister/:facilityId/:wardId/:bedId"
                    element={<BedBookingRegister />}
                  />
                  <Route
                    path="/dashboard/patient/book/:slug/:facilityId"
                    element={<PatientBookBedPage />}
                  />
                  <Route
                    path="/dashboard/patient/booking/:slug/:facilityId"
                    element={<ViewBedBooking />}
                  />
                  <Route
                    path="/dashboard/patient/bookregister/:slug/:facilityId/:wardId/:bedId"
                    element={<BedBookingRegister />}
                  />

                  <Route
                    path="/dashboard/doctor"
                    element={<DoctorDashboardPage />}
                  />
                  <Route
                    path="/dashboard/doctor/*"
                    element={<DoctorDashboardPage />}
                  />
                  <Route
                    path="/dashboard/hospital"
                    element={<HospitalDashboardPage />}
                  />
                  <Route
                    path="/dashboard/hospital/*"
                    element={<HospitalDashboardPage />}
                  />
                  <Route
                    path="/dashboard/facility"
                    element={<HospitalDashboardPage />}
                  />
                  <Route
                    path="/dashboard/facility/*"
                    element={<HospitalDashboardPage />}
                  />
                  <Route
                    path="/dashboard/staff"
                    element={<StaffDashboardPage />}
                  />
                  <Route
                    path="/dashboard/staff/*"
                    element={<StaffDashboardPage />}
                  />
                  <Route
                    path="/dashboard/facility/booking_bed"
                    element={<ViewFacilityPage />}
                  />
                  <Route
                    path="/dashboard/facility/ward-management"
                    element={<WardDashboardPage />}
                  />
                  <Route path="/dashboard/staff/booking_bed" element={<ViewFacilityStaff />} />
                  {/* <Route
                    path="/dashboard/facility/departments"
                    element={<Departments />}
                  /> */}
                  {/* <Route
                    path="/dashboard/facility/bed-management"
                    element={< BedBookingView/>}
                  /> */}
                  {/* <Route
                    path="/dashboard/facility/appointments"
                    element={< FacilityAppointmentManagement/>}
                  /> */}
                  {/* <Route
                    path="/dashboard/facility/appointments"
                    element={< FacilityAppointmentManagement/>}
                  /> */}
                  <Route
                    path="/dashboard/super-admin"
                    element={<SuperAdminDashboardPage />}
                  />
                  <Route
                    path="/dashboard/super-admin/*"
                    element={<SuperAdminDashboardPage />}
                  />
                  <Route
                    path="/dashboard/sub-admin"
                    element={<SubAdminDashboardPage />}
                  />
                  <Route
                    path="/dashboard/sub-admin/*"
                    element={<SubAdminDashboardPage />}
                  />
                  <Route
                    path="/dashboard/admin"
                    element={<SuperAdminDashboardPage />}
                  />
                  <Route
                    path="/dashboard/admin/*"
                    element={<SuperAdminDashboardPage />}
                  />

                  {/* Other Feature Routes */}
                  <Route
                    path="/appointments"
                    element={<AppointmentSystemPage />}
                  />
                  <Route path="/vault" element={<DocumentVaultPage />} />
                  <Route
                    path="/secure-view/:token"
                    element={<SecureViewPage />}
                  />
                  <Route path="/payments" element={<PaymentSystemPage />} />
                  <Route path="/api-setup" element={<ApiSetupPage />} />
                  <Route path="/qa-testing" element={<QATestingPage />} />

                  {/* Doctor Related Routes */}
                  <Route path="/doctor/:id" element={<DoctorProfilePage />} />
                  <Route path="/doctor/:slug/:id" element={<DoctorProfilePage />} />
                  <Route
                    path="/book-appointment"
                    element={<AppointmentBooking />}
                  />
                  {/* <Route
                    path="/dashboard/doctor/schedule"
                    element={<DoctorSchedulePage />}
                  /> */}
<Route path="/dashboard/patient/doctor/:id" element={<DoctorHospitals />} />
<Route path="/dashboard/patient/facility/:id" element={<DoctorHospitals />} />
      <Route path="/dashboard/patient/doctor/:slug/:id" element={<DoctorHospitals />} />
      <Route path="/dashboard/patient/facility/:slug/:id" element={<DoctorHospitals />} />
{/* <Route path="/homelogin" element={<HomeLogin />} /> */}

<Route path="/appointment/doctorprofile/doctor/:id" element={<DoctorHospitalsDetails />} />
<Route path="/appointment/facilityprofile/facility/:id" element={<DoctorHospitalsDetails  />} />
      <Route path="/appointment/doctorprofile/doctor/:slug/:id" element={<DoctorHospitalsDetails />} />
      <Route path="/appointment/facilityprofile/facility/:slug/:id" element={<DoctorHospitalsDetails  />} />

<Route  path="/dashboard/patient/department/:id"  element={<DepartmentDetails />}/>
<Route  path="/dashboard/patient/department/:slug/:id"  element={<DepartmentDetails />}/>
<Route  path="/appointment/facilityprofile/department/:id"  element={<DepartmentDetailsFacility />}/>
<Route  path="/appointment/facilityprofile/department/:slug/:id"  element={<DepartmentDetailsFacility />}/>
<Route path="/dashboard/patient/booking/:facilityId" element={<PatientFacilities  view="beds" />} />
<Route path="/dashboard/patient/booking/:slug/:facilityId" element={<PatientFacilities  view="beds" />} />

<Route path="/about" element={<AboutPage />} />
<Route path="/contact" element={<Contact />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="/faqs" element={<ArticlesAndGuides />} />
<Route path="/cookies" element={<CookiePolicy />} />
<Route path="/blog" element={<Blog />} />
<Route path="/doctors" element={<DoctorPage />} />
<Route path="/hospitals" element={<HospitalsPage />} />
{/* <Route path="/appointment" element={<BookAppointment />} /> */}
{/* <Route path="/appointment" element={<HomeLogin />} /> */}
<Route path="/appointment" element={<HomeLoginPage />} />
<Route path="/appointment/:view" element={<HomeLoginPage />} />
{/* <Route path="/dashboard/facility/staffId" element={<StaffManagementDetails/>}/> */}


                  {/* ✅ ADD THIS ROUTE FOR BedBookingView IF NEEDED SEPARATELY */}
                  {/* If you want to access BedBookingView directly (not through PatientBookBedPage) */}
                  {/* <Route path="/bed-booking/:facilityId/:patientId" element={<BedBookingView />} /> */}

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ApiKeyProvider>
        </HelmetProvider>
      </PopupProvider>
    </QueryClientProvider>
  );
};

export default App;



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
// import { HelmetProvider } from "react-helmet-async";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import PatientRegistration from "./components/auth/PatientRegistration";
// import DoctorRegistration from "./components/auth/DoctorRegistration";
// import FacilityRegistration from "./components/auth/FacilityRegistration";
// import LoginForm from "./components/auth/LoginForm";
// import PatientDashboardPage from "./pages/PatientDashboardPage";
// import DoctorDashboardPage from "./pages/DoctorDashboardPage";
// import HospitalDashboardPage from "./pages/HospitalDashboardPage";
// import SuperAdminDashboardPage from "./pages/SuperAdminDashboardPage";
// import SubAdminDashboardPage from "./pages/SubAdminDashboardPage";
// import AppointmentSystemPage from "./pages/AppointmentSystemPage";
// import DocumentVaultPage from "./pages/DocumentVaultPage";
// import SecureViewPage from "./pages/SecureViewPage";
// import PaymentSystemPage from "./pages/PaymentSystemPage";
// import ApiSetupPage from "./pages/ApiSetupPage";
// import QATestingPage from "./pages/QATestingPage";
// import OnboardingWizard from "./components/onboarding/OnboardingWizard";
// import InstallPrompt from "./components/pwa/InstallPrompt";
// import MaintenancePage from "./pages/MaintenancePage";
// import { PopupProvider } from "@/contexts/popup-context";
// import DoctorProfile from "./components/doctor/DoctorProfile";
// import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import AppointmentBooking from "./components/appointments/AppointmentBooking";
// import DoctorAppointmentCard from "./components/doctor/DoctorAppointmentCard";
// import WardBedManagement from "./components/ward-management/WardBedManagement";
// import PatientBookBedPage from "./pages/patient/PatientBookBedPage";
// import WardDashboardPage from "./pages/WardDashboardPage";
// import BedBookingView from "./components/bedbooking/BedBookingView";
// import PatientFacilities from "./pages/patient/PatientFacilities";
// import ViewBedBooking from "./pages/patient/ViewBedBooking";
// import BedBookingRegister from "./pages/patient/BedBookingRegister";
// import PatientDetailsPage from "./pages/patient/PatientDetailsPage";
// import ViewFacility from "./pages/facility/ViewFacility";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DoctorHospitals from "./components/patient/DoctorHospitals";
// import HomeLogin from "./components/patient/HomeLogin";
// import DepartmentDetails from "./components/patient/DepartmentDetails";
// import Departments from "./components/facility/Departments";
// import DashboardLayoutPatient from "./pages/patient/DashboardLayoutPatient"
// import DoctorSchedulePage from "./components/doctor/DoctorSchedulePage";
// import CookiePopup from "./pages/Affiliate/CookiePopup";
// import AboutPage from "./components/basicspage/AboutPage";
// import Contact from "./components/basicspage/Contact";
// import PrivacyPolicy from "./components/basicspage/PrivacyPolicy";
// import RefundPolicy from "./components/basicspage/RefundPolicy";
// import TermsOfService from "./components/basicspage/TermsOfService";
// import ArticlesAndGuides from "./components/basicspage/ArticlesAndGuides";
// import CookiePolicy from "./components/basicspage/CookiePolicy";
// import Blog from "./components/basicspage/Blog";
// import DoctorPage from "./components/basicspage/DoctorPage";
// import HospitalsPage from "./components/basicspage/HospitalsPage";
// import BookAppointment from "./components/basicspage/BookAppointment";
// import FacilityAppointmentManagement from "./components/facility/FacilityAppointmentManagement";
// import Location from "./pages/Location/Location";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import HomeLoginPage from "./pages/Location/HomeLoginPage";
// import DoctorHospitalsDetails from "./components/patient/DoctorHospitalsDetails";
// import DepartmentDetailsFacility from "./components/patient/DepartmentDetailsFacility";
// import StaffDashboardPage from "./pages/StaffDashboardPage";
// import { useEffect } from "react";
// import ViewFacilityPage from "./pages/facility/ViewFacilityPage";
// import ViewFacilityStaff from "./pages/facility/ViewFacilityStaff";

// const queryClient = new QueryClient();
// const MAINTENANCE = false;

// // DoctorProfile wrapper component
// const DoctorProfilePage = () => {
//   const navigate = useNavigate();
//   return <DoctorProfile onBack={() => navigate(-1)} />;
// };

// // Session checker component
// const SessionChecker = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = () => {
//       const loginTime = localStorage.getItem("loginTime");
//       const isLoggedIn = localStorage.getItem("isLoggedIn");

//       if (loginTime && isLoggedIn === "true") {
//         const currentTime = new Date().getTime();
//         const diff = currentTime - parseInt(loginTime);
//         const twelveHours = 12 * 60 * 60 * 1000;

//         if (diff > twelveHours) {
//           localStorage.removeItem("loginTime");
//           localStorage.removeItem("isLoggedIn");
//           alert("Session expired. Please login again.");
//           navigate("/login/patient"); // Redirect to login
//         }
//       }
//     };

//     checkSession();
//     const interval = setInterval(checkSession, 60000);
//     return () => clearInterval(interval);
//   }, [navigate]);

//   return children;
// };

// // Main App Content with Routes
// const AppContent = () => {
//   if (MAINTENANCE) {
//     return <MaintenancePage />;
//   }

//   return (
//     <SessionChecker>
//       <Routes>
//         <Route path="/" element={<Index />} />

//         {/* Authentication Routes */}
//         <Route path="/register/patient" element={<PatientRegistration />} />
//         <Route path="/register/doctor" element={<DoctorRegistration />} />
//         <Route path="/register/facility" element={<FacilityRegistration />} />
//         <Route path="/login/:userType" element={<LoginForm />} />
//         <Route path="/forgot-password/:userType" element={<ForgotPassword />} />

//         {/* Onboarding Routes */}
//         <Route path="/onboarding/:userType" element={<OnboardingWizard />} />

//         {/* Dashboard Routes */}
//         <Route path="/dashboard/patient/*" element={<PatientDashboardPage />} />
//         <Route path="/dashboard/doctor/*" element={<DoctorDashboardPage />} />
//         <Route path="/dashboard/hospital/*" element={<HospitalDashboardPage />} />
//         <Route path="/dashboard/facility/*" element={<HospitalDashboardPage />} />
//         <Route path="/dashboard/staff/*" element={<StaffDashboardPage />} />
//         <Route path="/dashboard/super-admin/*" element={<SuperAdminDashboardPage />} />
//         <Route path="/dashboard/sub-admin/*" element={<SubAdminDashboardPage />} />
//         <Route path="/dashboard/admin/*" element={<SuperAdminDashboardPage />} />
// <Route
//                     path="/dashboard/patient/book/patient-facilities"
//                     element={<DashboardLayoutPatient />}
//                   />
//         {/* Patient Specific Routes */}
//         <Route path="/dashboard/patient/book/:facilityId" element={<PatientBookBedPage />} />
//         <Route path="/dashboard/patient/booking/:facilityId" element={<ViewBedBooking />} />
//         <Route path="/dashboard/patient/bookregister/:facilityId/:wardId/:bedId" element={<BedBookingRegister />} />
//         <Route path="/dashboard/patient/book/:slug/:facilityId" element={<PatientBookBedPage />} />
//         <Route path="/dashboard/patient/booking/:slug/:facilityId" element={<ViewBedBooking />} />
//         <Route path="/dashboard/patient/bookregister/:slug/:facilityId/:wardId/:bedId" element={<BedBookingRegister />} />
//         <Route path="/dashboard/patient/doctor/:id" element={<DoctorHospitals />} />
//         <Route path="/dashboard/patient/facility/:id" element={<DoctorHospitals />} />
//         <Route path="/dashboard/patient/doctor/:slug/:id" element={<DoctorHospitals />} />
//         <Route path="/dashboard/patient/facility/:slug/:id" element={<DoctorHospitals />} />
//         <Route path="/dashboard/patient/department/:id" element={<DepartmentDetails />} />
//         <Route path="/dashboard/patient/department/:slug/:id" element={<DepartmentDetails />} />
//         <Route path="/dashboard/patient/booking/:facilityId" element={<PatientFacilities view="beds" />} />
//         <Route path="/dashboard/patient/booking/:slug/:facilityId" element={<PatientFacilities view="beds" />} />

//         {/* Facility Routes */}
//         <Route path="/dashboard/facility/booking_bed" element={<ViewFacilityPage />} />
//         <Route path="/dashboard/facility/ward-management" element={<WardDashboardPage />} />
//         {/* <Route path="/dashboard/facility/appointments" element={<FacilityAppointmentManagement />} /> */}
//         <Route path="/dashboard/staff/booking_bed" element={<ViewFacilityStaff />} />
//         {/* <Route path="/dashboard/staff/appointments" element={<FacilityAppointmentManagement />} /> */}

//         {/* Appointment Routes */}
//         <Route path="/appointment/doctorprofile/doctor/:id" element={<DoctorHospitalsDetails />} />
//         <Route path="/appointment/facilityprofile/facility/:id" element={<DoctorHospitalsDetails />} />
//         <Route path="/appointment/doctorprofile/doctor/:slug/:id" element={<DoctorHospitalsDetails />} />
//         <Route path="/appointment/facilityprofile/facility/:slug/:id" element={<DoctorHospitalsDetails />} />
//         <Route path="/appointment/facilityprofile/department/:id" element={<DepartmentDetailsFacility />} />
//         <Route path="/appointment/facilityprofile/department/:slug/:id" element={<DepartmentDetailsFacility />} />
//         <Route path="/appointment" element={<HomeLoginPage />} />
//         <Route path="/appointment/:view" element={<HomeLoginPage />} />

//         {/* Doctor Routes */}
//         <Route path="/doctor/:id" element={<DoctorProfilePage />} />
//         <Route path="/doctor/:slug/:id" element={<DoctorProfilePage />} />
//         <Route path="/book-appointment" element={<AppointmentBooking />} />

//         {/* Other Feature Routes */}
//         <Route path="/appointments" element={<AppointmentSystemPage />} />
//         <Route path="/vault" element={<DocumentVaultPage />} />
//         <Route path="/secure-view/:token" element={<SecureViewPage />} />
//         <Route path="/payments" element={<PaymentSystemPage />} />
//         <Route path="/api-setup" element={<ApiSetupPage />} />
//         <Route path="/qa-testing" element={<QATestingPage />} />

//         {/* Static Pages */}
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/privacy" element={<PrivacyPolicy />} />
//         <Route path="/refund-policy" element={<RefundPolicy />} />
//         <Route path="/terms" element={<TermsOfService />} />
//         <Route path="/faqs" element={<ArticlesAndGuides />} />
//         <Route path="/cookies" element={<CookiePolicy />} />
//         <Route path="/blog" element={<Blog />} />
//         <Route path="/doctors" element={<DoctorPage />} />
//         <Route path="/hospitals" element={<HospitalsPage />} />

//         {/* 404 Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </SessionChecker>
//   );
// };

// // Main App Component
// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <PopupProvider>
//         <HelmetProvider>
//           <ApiKeyProvider>
//             <TooltipProvider>
//               <BrowserRouter>
//                 <AppContent />
//               </BrowserRouter>
//               <Toaster />
//               <Sonner />
//               {/* <InstallPrompt /> */}
//               <CookiePopup />
//             </TooltipProvider>
//           </ApiKeyProvider>
//         </HelmetProvider>
//       </PopupProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;