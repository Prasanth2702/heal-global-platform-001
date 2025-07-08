import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import OnboardingWizard from "./components/onboarding/OnboardingWizard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="/dashboard/doctor" element={<DoctorDashboardPage />} />
          <Route path="/dashboard/hospital" element={<HospitalDashboardPage />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboardPage />} />
          <Route path="/dashboard/sub-admin" element={<SubAdminDashboardPage />} />
          <Route path="/appointments" element={<AppointmentSystemPage />} />
          <Route path="/vault" element={<DocumentVaultPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
