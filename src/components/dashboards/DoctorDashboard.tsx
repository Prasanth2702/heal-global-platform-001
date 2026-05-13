import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, FileText, TrendingUp,Settings, FileLineChart, Bed, Calendar1, DollarSign, Users, File, IndianRupee, PhoneIcon, Telescope} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorProfile from "../doctor/DoctorProfile";
import AvailabilityManagement from "../doctor/AvailabilityManagement";
import DoctorAppointmentManagement from "../doctor/DoctorAppointmentManagement";
import EarningsAnalytics from "../doctor/EarningsAnalytics";
import DoctorSchedulePage from "../doctor/DoctorSchedulePage";
import { mixpanelInstance } from "@/utils/mixpanel";
import { supabase } from "@/integrations/supabase/client";
import PatientAttendDetails from "../doctor/PatientAttendDetails";
import Loader1 from "../ui/Loader1";
import PaymentDetails from "../doctor/PaymentDetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TeleconsultationPage from "../doctor/TeleconsultationPage";

type UsagePayload = {
  consultation_type: string;
  appointment_id: string;
  professional_id?: string;
  facility_id?: string;
};

const DoctorDashboard = () => {

  const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "patients" | "analytics" | "profile" | "calendar"|"payments"|"schedule" |"tele">("overview");
  // Add these states at the top with your existing useState
const [appointments, setAppointments] = useState([]);
const [patients, setPatients] = useState([]);
const [loading, setLoading] = useState(true);
const [totalEarnings, setTotalEarnings] = useState<number>(0);
const [monthlyPatientsCount, setMonthlyPatientsCount] = useState<number>(0);
const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
const [doctorViews, setDoctorViews] = useState(0);
const [professionalId, setProfessionalId] = useState<string | null>(null);
const [planName, setPlanName] = useState<string | null>(null);
const [profileVisible, setProfileVisible] = useState(true);
const [loadingVisibility, setLoadingVisibility] = useState(true);
const [showTelePopup, setShowTelePopup] = useState(false);
// Add this useEffect to fetch appointments and patients
useEffect(() => {
  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Step 1: Get doctor's medical professional record
      const { data: doctorData, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("id,profile_visibility")
        .eq("user_id", user.id)
        .single();

      if (doctorError || !doctorData) {
        console.error("Error fetching doctor data:", doctorError);
        setLoading(false);
        return;
      }
      setProfileVisible(doctorData?.profile_visibility );

      // Step 2: Fetch appointments separately
      await fetchAppointments(doctorData.id);
      
      // Step 3: Fetch patients separately
      await fetchPatients(doctorData.id);
await fetchTotalEarnings(user.id);   // user.id is the doctor's user_id
await fetchMonthlyStats(user.id);   // <-- add this line
await fetchPlan(doctorData.id);   // <-- add this line
if (doctorData && doctorData.id) {
  setProfessionalId(user.id);
}// <-- add this line to book an appointment


const { data: viewData } = await supabase
  .from("medical_professional_page_views")
  .select("view_count")
  .eq("medical_professional_id", doctorData.id);

const totalViews = viewData?.reduce((sum, v) => sum + v.view_count, 0) || 0;
setDoctorViews(totalViews);

    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
       setLoadingVisibility(false);
    }
  };

  const fetchAppointments = async (doctorId: string) => {
    try {
      const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const { data: { user } } = await supabase.auth.getUser();
      // First get all appointments for today
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", user.id)
        .gte("appointment_date", startOfDay)
      .lte("appointment_date", endOfDay)
        .order("appointment_date", { ascending: true });
        

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        return;
      }

      if (!appointmentsData || appointmentsData.length === 0) {
        setAppointments([]);
        return;
      }

      // Get unique patient IDs from appointments
      const patientIds = [...new Set(appointmentsData
        .map(app => app.patient_id)
        .filter(id => id)
      )];

      if (patientIds.length === 0) {
        // Transform appointments without patient details
        const transformedAppointments = appointmentsData.map(app => ({
          id: app.id,
          patient: "Unknown Patient",
          time: new Date(app.appointment_date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: app.type || "In-person",
          status: app.status || "Confirmed"
        }));
        setAppointments(transformedAppointments);
        return;
      }

      // Fetch patient details separately
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("*")
        .in("user_id", patientIds);


    const { data: patients } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, avatar_url")
      .in("user_id", patientIds);


      if (patientsError) {
        console.error("Error fetching patient details:", patientsError);
        // Return appointments without patient details
        const transformedAppointments = appointmentsData.map(app => ({
          id: app.id,
          patient: "Unknown Patient",
          time: new Date(app.appointment_date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: app.type || "In-person",
          status: app.status || "Confirmed"
        }));
        setAppointments(transformedAppointments);
        return;
      }
const patientMap = new Map();

patients?.forEach(profile => {
  patientMap.set(profile.user_id, profile);
});

const transformedAppointments = appointmentsData.map(app => {
  const patient = patientMap.get(app.patient_id);

  return {
    id: app.id,
    patient: patient
      ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
      : "Unknown Patient",
    avatar: patient?.avatar_url || null,
    time: new Date(app.appointment_date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: app.type || "In-person",
    status: app.status || "Confirmed"
  };
});

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("Error in fetchAppointments:", error);
    }
  };

  const fetchPatients = async (doctorId: string) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // First get all appointments from last 30 days
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId)
        .gte("appointment_date", thirtyDaysAgo.toISOString())
        .order("appointment_date", { ascending: false });

      if (appointmentsError) {
        console.error("Error fetching patient appointments:", appointmentsError);
        return;
      }

      if (!appointmentsData || appointmentsData.length === 0) {
        setPatients([]);
        return;
      }

      // Get unique patient IDs
      const uniquePatientIds = [];
      const seenIds = new Set();
      
      appointmentsData.forEach(item => {
        if (item.patient_id && !seenIds.has(item.patient_id)) {
          seenIds.add(item.patient_id);
          uniquePatientIds.push({
            id: item.patient_id,
            lastVisit: item.appointment_date
          });
        }
      });

      if (uniquePatientIds.length === 0) {
        setPatients([]);
        return;
      }

      // Extract just the IDs for the query
      const patientIds = uniquePatientIds.map(p => p.id);

      // Fetch patient details separately
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("*")
        .in("id", patientIds);

      if (patientsError) {
        console.error("Error fetching patient details:", patientsError);
        setPatients([]);
        return;
      }

      // Create patient details map
      const patientDetailsMap = new Map();
      patientsData?.forEach(patient => {
        patientDetailsMap.set(patient.id, patient);
      });

      // Create last visit map
      const lastVisitMap = new Map();
      uniquePatientIds.forEach(item => {
        lastVisitMap.set(item.id, item.lastVisit);
      });

      // Combine data
      const transformedPatients = uniquePatientIds
        .map(item => {
          const patientDetails = patientDetailsMap.get(item.id);
          if (!patientDetails) return null;
          
          return {
            id: item.id,
            name: `${patientDetails.first_name || ''} ${patientDetails.last_name || ''}`.trim(),
            lastVisit: new Date(item.lastVisit).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            }),
            condition: "Appointment Completed"
          };
        })
        .filter(patient => patient !== null)
        .slice(0, 3);

      setPatients(transformedPatients);
    } catch (error) {
      console.error("Error in fetchPatients:", error);
    }
  };

  fetchDoctorData();
}, []);


 

    const fetchPlan =  async (doctorId: string) => {

      // const { data: doctorData, error: doctorError } = await supabase
      //   .from("medical_professionals")
      //   .select("id")
      //   .eq("id", doctorId)
      //   .single();

      // const patientId = doctorData ? [doctorData.id] : [];

      // 1. Get active subscription for this professional
      const { data: subscription, error: subError } = await supabase
        .from('active_subscriptions')
        .select('tier_id')
        .eq('professional_id', doctorId)
        .eq('is_active', true)
        .single();

      if (subError || !subscription) {
        console.warn('No active subscription');
        setPlanName('No active plan');
        setLoading(false);
        return;
      }

      // 2. Fetch tier name from subscription_tiers
      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('tier_name')
        .eq('tier_id', subscription.tier_id)
        .single();

      if (tierError || !tier) {
        console.error('Tier not found');
        setPlanName('Unknown plan');
      } else {
        setPlanName(tier.tier_name);
      }
      setLoading(false);
    };


    useEffect(() => {
      const path = location.pathname;
        console.log("Navigate to tab:",path);
      if (path.includes('/appointments')) setActiveTab('appointments');
      else if (path.includes('/patients')) setActiveTab('patients');
      else if (path.includes('/analytics')) setActiveTab('analytics');
      else if (path.includes('/profile')) setActiveTab('profile');
      else if (path.includes('/schedule')) setActiveTab('schedule');
      else if (path.includes('/payments')) setActiveTab('payments');
      else if (path.includes('/tele')) setActiveTab('tele');
      else setActiveTab('overview');
    }, [location.pathname]);
  
    const handleTabChange = (tab: typeof activeTab) => {
      console.log("Navigate to tab:",tab);

        mixpanelInstance.track('Doctor Dashboard Tab Change', {
        fromTab: activeTab,
        toTab: tab,
        location: 'dashboard_navigation'
      });

      setActiveTab(tab);
      const basePath = '/dashboard/doctor';
      switch (tab) {
        case 'overview': navigate(basePath); break;
        case 'appointments': navigate(`${basePath}/appointments`); break;
        case 'analytics': navigate(`${basePath}/analytics`); break;
        case 'profile': navigate(`${basePath}/profile`); break;
        case 'schedule': navigate(`${basePath}/schedule`); break;
        case 'patients': navigate(`${basePath}/patients`); break;
        case 'payments': navigate(`${basePath}/payments-details`); break;
        case 'tele': navigate(`${basePath}/tele-consultation-booking`); break;
      }
    };
     const trackButtonClick = (buttonName: string, additionalData = {}) => {
      mixpanelInstance.track('Doctor Dashboard Button Click', {
        buttonName,
        activeTab,
        ...additionalData
      });
    };

// const SubscriptionUsage = ({ professionalId }: { professionalId: string }) => {
//   const [limits, setLimits] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [hasSubscription, setHasSubscription] = useState(true);

//   useEffect(() => {
//     if (!professionalId) return;
//     const fetchLimits = async () => {
//       try {
//         const { data: sessionData } = await supabase.auth.getSession();
//         const token = sessionData.session?.access_token;
        
//         const response = await fetch(
//           "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               user_auth_id: professionalId,
//             })
//           }
//         );
//         const result = await response.json();
//         setLimits(result.limits);
//         setHasSubscription(result.hasActiveSubscription);
//       } catch (err) {
//         console.error('Error fetching subscription limits:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLimits();
//   }, [professionalId]);

//   if (loading) return <div className="text-center py-2">Loading usage...</div>;
  
//   // // Show no‑subscription message
//   // if (!hasSubscription || (limits?.clinical?.max === 0 && limits?.tele?.max === 0)) {
//   //   return (
//   //     <div className="text-center py-4 border rounded-lg bg-amber-50">
//   //       <p className="text-amber-800">⚠️ No active subscription found.</p>
//   //       <p className="text-sm text-gray-600 mt-1">
//   //         Please contact support or upgrade your plan to continue.
//   //       </p>
//   //       <Button 
//   //         variant="outline" 
//   //         size="sm" 
//   //         className="mt-3"
//   //         onClick={() => window.open('/pricing', '_blank')}
//   //       >
//   //         View Plans
//   //       </Button>
//   //     </div>
//   //   );
//   // }

//   // if (!limits) return null;

//   return (
//     <div className="space-y-3">
//       <div>
//         <div className="flex justify-between text-sm">
//           <span>Clinical Consultations</span>
//           <span>{limits.clinical.used} / {limits.clinical.max}</span>
//         </div>
//         <progress 
//           value={limits.clinical.used} 
//           max={limits.clinical.max}
//           className={`w-full h-2 rounded-full ${limits.clinical.remaining < 10 ? 'text-red-500' : 'text-green-500'}`}
//         />
//         <p className="text-xs text-muted-foreground mt-1">
//           {limits.clinical.remaining} remaining this month
//         </p>
//       </div>
//       <div>
//         <div className="flex justify-between text-sm">
//           <span>Tele-Consultations</span>
//           <span>{limits.tele.used} / {limits.tele.max}</span>
//         </div>
//         <progress 
//           value={limits.tele.used} 
//           max={limits.tele.max}
//           className={`w-full h-2 rounded-full ${limits.tele.remaining < 10 ? 'text-red-500' : 'text-green-500'}`}
//         />
//         <p className="text-xs text-muted-foreground mt-1">
//           {limits.tele.remaining} remaining this month
//         </p>
//       </div>
//     </div>
//   );
// };


const SubscriptionUsage = ({ professionalId }: { professionalId: string }) => {
  const [limits, setLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);

  useEffect(() => {
    if (!professionalId) return;
    const fetchLimits = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        
        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user_auth_id: professionalId,
            })
          }
        );
        const result = await response.json();
        
        // 👇 ADD THIS MAPPING (the only change)
        const transformedLimits = {
          clinical: result.limits?.in_person || { used: 0, max: 0, remaining: 0 },
          tele: result.limits?.teleconsultation || { used: 0, max: 0, remaining: 0 }
        };
        
        setLimits(transformedLimits);
        setHasSubscription(result.hasActiveSubscription);
      } catch (err) {
        console.error('Error fetching subscription limits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLimits();
  }, [professionalId]);

  // rest of your component remains exactly the same...
  if (loading) return <div className="text-center py-2">Loading usage...</div>;
  
  if (!hasSubscription || (limits?.clinical?.max === 0 && limits?.tele?.max === 0)) {
    return (
      <div className="text-center py-4 border rounded-lg bg-amber-50">
        <p className="text-amber-800">⚠️ No active subscription found.</p>
        <p className="text-sm text-gray-600 mt-1">
          Please contact support or upgrade your plan to continue.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => window.open('/pricing', '_blank')}
        >
          View Plans
        </Button>
      </div>
    );
  }

  if (!limits) return null;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm">
          <span>Clinical Consultations</span>
          <span>{limits.clinical.used} / {limits.clinical.max}</span>
        </div>
        <progress 
          value={limits.clinical.used} 
          max={limits.clinical.max}
          className={`w-full h-2 rounded-full ${limits.clinical.remaining < 10 ? 'text-red-500' : 'text-green-500'}`}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {limits.clinical.remaining} remaining this month
        </p>
      </div>
      {limits.tele.max > 0 &&(
      <div>
        <div className="flex justify-between text-sm">
          <span>Tele-Consultations</span>
          <span>{limits.tele.used} / {limits.tele.max }</span>
        </div>
        <progress 
          value={limits.tele.used} 
          max={limits.tele.max}
          className={`w-full h-2 rounded-full ${limits.tele.remaining < 10 ? 'text-red-500' : 'text-green-500'}`}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {limits.tele.remaining} remaining this month
        </p>
      </div>
      )}
    </div>
  );
};
  const todayAppointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "9:00 AM",
      type: "In-person",
      status: "Confirmed"
    },
    {
      id: 2,
      patient: "Sarah Wilson",
      time: "10:30 AM", 
      type: "Teleconsultation",
      status: "Confirmed"
    },
    {
      id: 3,
      patient: "Mike Johnson",
      time: "2:00 PM",
      type: "Follow-up",
      status: "Pending"
    }
  ];

  const recentPatients = [
    { id: 1, name: "Emily Davis", lastVisit: "2024-01-12", condition: "Hypertension" },
    { id: 2, name: "Robert Brown", lastVisit: "2024-01-11", condition: "Diabetes Follow-up" },
    { id: 3, name: "Lisa Garcia", lastVisit: "2024-01-10", condition: "Routine Checkup" }
  ];

  const fetchTotalEarnings = async (doctorUserId: string) => {
  try {
    // 1. Get all appointments for this doctor
    const { data: appointments, error: aptError } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorUserId);

    if (aptError || !appointments?.length) {
      setTotalEarnings(0);
      return;
    }

    const appointmentIds = appointments.map(a => a.id);

    // 2. Get completed payments for those appointments
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('amount')
      .in('appointment_id', appointmentIds)
      .eq('status', 'completed');

    if (payError) throw payError;

    // 3. Sum the amounts
    const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    setTotalEarnings(total);
  } catch (err) {
    console.error('Error fetching total earnings:', err);
    setTotalEarnings(0);
  }
};

const fetchMonthlyStats = async (doctorUserId: string) => {
  try {
    // Get first and last day of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const startISO = startOfMonth.toISOString();
    const endISO = endOfMonth.toISOString();

    // 1. Fetch appointments for this doctor within the month
    const { data: appointments, error: aptError } = await supabase
      .from('appointments')
      .select('id, patient_id')
      .eq('doctor_id', doctorUserId)
      .gte('appointment_date', startISO)
      .lte('appointment_date', endISO);

    if (aptError) throw aptError;

    // ✅ Set monthly patients count as TOTAL appointments (not unique patients)
    const totalAppointments = appointments?.length || 0;
    setMonthlyPatientsCount(totalAppointments);

    if (!appointments?.length) {
      setMonthlyRevenue(0);
      return;
    }

    const appointmentIds = appointments.map(a => a.id);

    // 2. Get completed payments for those appointments
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('amount')
      .in('appointment_id', appointmentIds)
      .eq('status', 'completed');

    if (payError) throw payError;

    const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    setMonthlyRevenue(total);
  } catch (err) {
    console.error('Error fetching monthly stats:', err);
    setMonthlyPatientsCount(0);
    setMonthlyRevenue(0);
  }
};
  //  if (activeTab === "profile") {
  //   console.log("Rendering DoctorProfile");
  //     return <DoctorProfile onBack={() => handleTabChange("overview")} />;
  //   }

  if (activeTab === "calendar") {
      console.log("Rendering AvailabilityManagement");
      return <AvailabilityManagement onBack={() => handleTabChange("overview")} />;
    }
    // this added
  //   if (activeTab === "appointments") {
  // console.log("Rendering DoctorAppointmentManagement");
  // return <DoctorAppointmentManagement />;
// }
if (activeTab !== "overview") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("overview"); trackButtonClick("Overview Tab")}}
              className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("appointments"); trackButtonClick("Appointments Tab")}}
              className={activeTab === "appointments" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}
            >
              <FileLineChart className="h-4 w-4 mr-1" />
              Find Appointments
            </Button>
            {/* <Button
              variant={activeTab === "schedule" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("schedule"); trackButtonClick("Schedule Tab")}}
              className={activeTab === "schedule" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <Calendar1 className="h-4 w-4 mr-1" />
             Schedule
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("analytics"); trackButtonClick("Analytics Tab")}}
              className={activeTab === "analytics" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Analytics
            </Button> */}
            {/* <Button
              variant={activeTab === "patients" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("patients"); trackButtonClick("Patients Tab")}}
              className={activeTab === "patients" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"}
            >
              <User className="h-4 w-4 mr-1" />
              Patients
            </Button> */}
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("profile"); trackButtonClick("Profile Tab")}}
              className={activeTab === "profile" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"}
            >
              <FileText className="h-4 w-4 mr-1" />
              My Profile
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("payments"); trackButtonClick("Payments Tab")}}
              className={activeTab === "payments" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <IndianRupee className="h-4 w-4 mr-1" />
              Payments
            </Button>
            <Button
              variant={activeTab === "tele" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("tele"); trackButtonClick("Tele")}}
              className={activeTab === "tele" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <Telescope className="h-4 w-4 mr-1" />
              Tele consultation booking
            </Button>
          </div>
        </div>

  {loadingVisibility ? (
  <div>Loading...</div>
) : profileVisible === false? (
  <div className="w-full p-4 rounded-lg border border-red-200 bg-red-50 text-center mb-4">
    <p className="text-red-600 font-medium">
      Your profile status is Hidden. Hence it is unavailable for new appointment bookings.
    </p>

  </div>
) : null}

         {activeTab === "appointments" && <DoctorAppointmentManagement />}
        {activeTab === "schedule" && <DoctorSchedulePage />}
        {activeTab === "analytics" && <EarningsAnalytics />}
        {activeTab === "profile" && <DoctorProfile />}
        {activeTab === "patients" && <PatientAttendDetails />}
        {/* {activeTab === "payments" && <PaymentManagement />} */}
        {activeTab === "payments" && <PaymentDetails />}
        {activeTab === "tele" && <TeleconsultationPage />}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your practice and patients</p>
        </div>
        <div>
                  <div className="bg-primary/10 px-3 py-1 rounded-full">
          {loading ? (
            <span className="text-sm text-muted-foreground">Loading…</span>
          ) : (
            <span className="text-sm font-medium">
              Plan: {planName}
            </span>
          )}
        </div>

        </div>
        <div className="flex gap-2">
           <Button
            onClick={() => {handleTabChange("profile"); trackButtonClick("My Profile Button")}}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <Settings className="h-4 w-4 mr-2" />
            My Profile
          </Button>
          <Button variant="doctor" size="lg" onClick={() => {handleTabChange("calendar"); trackButtonClick("View Calendar Button")}}>
            <Calendar className="mr-2 h-4 w-4" />
            Time Slots
          </Button>
          {/* <Button variant="outline" size="lg" onClick={() => {trackButtonClick("Add Patient Button")}}>
            <User className="mr-2 h-4 w-4" />
            Add Patient
          </Button> */}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="default"
              size="sm"
              onClick={() => {handleTabChange("overview"); trackButtonClick("Overview Tab")}}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              Overview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("appointments"); trackButtonClick("Appointments Tab")}}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Calendar className="h-4 w-4 mr-1" />
              My Appointments
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("patients"); trackButtonClick("Patients Tab")}}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <User className="h-4 w-4 mr-1" />
              Patients
            </Button> */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("schedule"); trackButtonClick("Schedule Tab")}}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Bed className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("analytics"); trackButtonClick("Analytics Tab")}}
              className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"
            >
              <FileText className="h-4 w-4 mr-1" />
              Analytics
            </Button> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("profile"); trackButtonClick("My Profile Button")}}
              className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"
            >
              <File className="h-4 w-4 mr-1" />
              My Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("payments"); trackButtonClick("Payments Tab")}}
              className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"
            >
              <IndianRupee className="h-4 w-4 mr-1" />
              Payments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("tele"); trackButtonClick("Tele")}}
              className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"
            >
              <Telescope className="h-4 w-4 mr-1" />
              Tele consultation booking
            </Button>
          </div>

           <div className="w-full p-4 rounded-lg border border-green-200 bg-green-50 text-center mb-4">
    <p className="text-red-600 font-medium"> Tele consultation booking is not availble in your current subscription. Please purchase a subscription or contact </p>
    </div>

           {loadingVisibility ? (
  <div>Loading...</div>
) : profileVisible === false? (
  <div className="w-full p-4 rounded-lg border border-red-200 bg-red-50 text-center mb-4">
    <p className="text-red-600 font-medium">
      Your profile status is Hidden. Hence it is unavailable for new appointment bookings.
    </p>

  </div>
) : null}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">
              {/* {todayAppointments.length} */}
                {loading ? "..." : appointments.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month's Patients</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">      {loading ? "..." : monthlyPatientsCount}
</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">      ₹{loading ? "..." : monthlyRevenue.toLocaleString('en-IN')}
</CardDescription>
          </CardHeader>
        </Card>
        
        {/* <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patient Rating</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">0</CardDescription>
          </CardHeader>
        </Card> */}

        <Card variant="doctor">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Total Earnings
    </CardTitle>
    <CardDescription className="text-2xl font-bold text-doctor">
      ₹{totalEarnings.toLocaleString('en-IN')}
    </CardDescription>
  </CardHeader>
</Card>
<Card variant="doctor">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Profile Views
    </CardTitle>
    <CardDescription className="text-2xl font-bold text-doctor">
      {doctorViews}
    </CardDescription>
  </CardHeader>
</Card>

{/* Subscription Usage Card */}
{professionalId && (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Subscription Usage</CardTitle>
      <CardDescription>Your remaining consultations for this month</CardDescription>
    </CardHeader>
    <CardContent>
      <SubscriptionUsage professionalId={professionalId} />
    </CardContent>
  </Card>
)}
<Card variant="doctor" >
  <CardHeader className="pb-2">
    <CardTitle className="text-lg font-medium text-muted-foreground">
      To Upgrade / Renew your subscription, please contact Support from your Registered email
    </CardTitle>

    <CardDescription className="text-lg text-gray-700 space-y-1">
      {/* <p>
        <span className="font-semibold text-doctor"><a
                        href="mailto:support@pmhssmarthealth.com"
                        className="text-blue-600"
                      >
                        support@pmhssmarthealth.com
                      </a></span>
      </p> */}

      <p className="text-sm text-muted-foreground">Contact us to update your number</p>

<p className="flex items-center justify-center">
  <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  <span className="text-primary">+91 98868 81149</span>
</p>


      <p className="text-lg text-muted-foreground">
        You can manage your appointments based on your current subscription plan.
      </p>
    </CardDescription>
  </CardHeader>
</Card>
<Card 
  className="cursor-pointer transition-all hover:shadow-md" 
  onClick={() => setShowTelePopup(true)}
>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Tele Subscription
    </CardTitle>
    <CardDescription className="text-2xl font-bold text-doctor">
      Upgrade / Renew
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-xs text-muted-foreground">
      Click to contact support
    </p>
  </CardContent>
</Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} • {appointment.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-doctor/10 text-doctor' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => {trackButtonClick('view_appointment_details', { appointmentId: appointment.id, patient: appointment.patient }); handleTabChange("appointments")}}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))} */}
              {loading ? (
  <div className="text-center py-4 text-muted-foreground"><Loader1/></div>
  // <div className="text-center py-4 text-muted-foreground">Loading appointments...</div>
) : appointments.length > 0 ? (
  appointments.map((appointment) => (
    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">

      <div>
        {/* <img
    src={appointment.avatar || "/placeholder-avatar.png"}
    className="w-10 h-10 rounded-full object-cover"
  /> */}
        {appointment?.avatar ? (
        <img
          src={appointment.avatar}
          alt={appointment?.patient || "User"}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${appointment?.patient || "User"}`;
          }}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
          {(appointment?.patient || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
      )}

        <p className="font-medium">{appointment.patient}</p>
        <p className="text-sm text-muted-foreground">
          {appointment.time} • {appointment.type}
        </p>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded ${
          appointment.status === 'confirmed' 
            ? 'bg-doctor/10 text-doctor' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {appointment.status}
        </span>
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={() => {trackButtonClick('view_appointment_details', { appointmentId: appointment.id, patient: appointment.patient }); handleTabChange("appointments")}}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  ))
) : (
  <div className="text-center py-4 text-muted-foreground">No appointments today</div>
)}
             <Button
  variant="doctor"
  className="w-full"
  onClick={() => {handleTabChange("appointments"); trackButtonClick("View Appointments Button")}}
>
  <Calendar className="mr-2 h-4 w-4" />
  View Appointments
</Button>

            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {trackButtonClick('view_patient_record', { patientId: patient.id, patientName: patient.name }); handleTabChange("patients")}}>
                    View Record
                  </Button>
                </div>
              ))} 
              <div className="text-center py-4 text-muted-foreground">
                  No Recent Patients
                </div>
              <Button variant="doctor" className="w-full" onClick={() => {trackButtonClick("View All Patients Button");
                 handleTabChange("patients")
                 }}>
                <User className="mr-2 h-4 w-4" />
                View All Patients
              </Button>
            </div>
          </CardContent>
        </Card> */}
        {/* Recent Patients */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center">
      <User className="mr-2 h-5 w-5" />
      Recent Patients
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4 text-muted-foreground">Loading patients...</div>
      ) : patients.length > 0 ? (
        patients.map((patient) => (
          <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-muted-foreground">{patient.condition}</p>
              <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {trackButtonClick('view_patient_record', { patientId: patient.id, patientName: patient.name }); handleTabChange("patients")}}>
              View Record
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">No recent patients</div>
      )}
      {/* <Button variant="doctor" className="w-full" onClick={() => {trackButtonClick("View All Patients Button");handleTabChange("patients")}}>
        <User className="mr-2 h-4 w-4" />
        View All Patients
      </Button> */}
    </div>
  </CardContent>
</Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features for your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button variant="doctor" className="h-20 flex-col" onClick={() => {trackButtonClick("e-Prescription Button")}}>
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">e-Prescription</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col" onClick={() => {trackButtonClick("Schedule Button")}}>
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col" onClick={() => {trackButtonClick("Patient Records Button")}}>
              <User className="h-6 w-6 mb-2" />
              <span className="text-sm">Patient Records</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col" onClick={() => {trackButtonClick("Analytics Button")}}>
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
            {/* This button is modified */}
           <Button
  variant="doctor"
  className="h-20 flex-col"
  onClick={() => {trackButtonClick("Appointments Button"); handleTabChange("appointments")}}
>
  <Clock className="h-6 w-6 mb-2" />
  <span className="text-sm">Appointments</span>
</Button>

          </div>
        </CardContent>
      </Card>

      {/* Tele Subscription Popup */}
<Dialog open={showTelePopup} onOpenChange={setShowTelePopup}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Contact for Tele Subscription</DialogTitle>
      <DialogDescription>
        Please reach out to our support team to upgrade or renew your Tele Subscription.
      </DialogDescription>
    </DialogHeader>
    <div className="flex items-center justify-center space-x-2 py-4">
      <PhoneIcon className="h-5 w-5 text-primary" />
      <a href="tel:+919886499994" className="text-lg font-medium text-primary underline">
        +91 98864 99994
      </a>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowTelePopup(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default DoctorDashboard;