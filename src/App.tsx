import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { HelmetProvider } from 'react-helmet-async';
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
import { PopupProvider } from '@/contexts/popup-context';
import DoctorProfile from "./components/doctor/DoctorProfile";   // 🔥 ADDED
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // 🔥 ADDED
import AppointmentBooking from "./components/appointments/AppointmentBooking";

const queryClient = new QueryClient();
const MAINTENANCE = false;
// 🔥ADDED
 const DoctorProfilePage = () => {
  const navigate = useNavigate();
  return <DoctorProfile onBack={() => navigate(-1)} />;
};


const App = () => {
  if (MAINTENANCE) {
    return  <MaintenancePage></MaintenancePage>
  }
  return (
  <QueryClientProvider client={queryClient}>
   <PopupProvider>
    <HelmetProvider>
      <ApiKeyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Authentication Routes */}
          <Route path="/register/patient" element={<PatientRegistration />} />
          <Route path="/register/doctor" element={<DoctorRegistration />} />
          <Route path="/register/facility" element={<FacilityRegistration />} />
          <Route path="/login/:userType" element={<LoginForm />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/:userType" element={<OnboardingWizard />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/patient" element={<PatientDashboardPage />} />
          <Route path="/dashboard/patient/*" element={<PatientDashboardPage />} />
          <Route path="/dashboard/doctor" element={<DoctorDashboardPage />} />
          <Route path="/dashboard/doctor/*" element={<DoctorDashboardPage />} />
          <Route path="/dashboard/hospital" element={<HospitalDashboardPage />} />
          <Route path="/dashboard/hospital/*" element={<HospitalDashboardPage />} />
          <Route path="/dashboard/facility" element={<HospitalDashboardPage />} />
          <Route path="/dashboard/facility/*" element={<HospitalDashboardPage />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboardPage />} />
          <Route path="/dashboard/super-admin/*" element={<SuperAdminDashboardPage />} />
          <Route path="/dashboard/sub-admin" element={<SubAdminDashboardPage />} />
          <Route path="/dashboard/sub-admin/*" element={<SubAdminDashboardPage />} />
          <Route path="/dashboard/admin" element={<SuperAdminDashboardPage />} />
          <Route path="/dashboard/admin/*" element={<SuperAdminDashboardPage />} />
          <Route path="/appointments" element={<AppointmentSystemPage />} />
          <Route path="/vault" element={<DocumentVaultPage />} />
          <Route path="/secure-view/:token" element={<SecureViewPage />} />
          <Route path="/payments" element={<PaymentSystemPage />} />
          <Route path="/api-setup" element={<ApiSetupPage />} />
          <Route path="/qa-testing" element={<QATestingPage />} />

          {/* 🔥 Dynamic doctor profile page */}
       <Route path="/doctor/:id" element={<DoctorProfilePage />} />
       <Route path="/book-appointment" element={<AppointmentBooking />} />

          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ApiKeyProvider>
    </HelmetProvider>
    </PopupProvider>
  </QueryClientProvider>  
  )
};

export default App;