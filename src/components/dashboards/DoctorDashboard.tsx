import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, FileText, TrendingUp,Settings, FileLineChart, Bed, Calendar1, DollarSign, Users, File} from "lucide-react";
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

const DoctorDashboard = () => {

  const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "patients" | "analytics" | "profile" | "calendar"|"payments"|"schedule">("overview");
  // Add these states at the top with your existing useState
const [appointments, setAppointments] = useState([]);
const [patients, setPatients] = useState([]);
const [loading, setLoading] = useState(true);

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
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (doctorError || !doctorData) {
        console.error("Error fetching doctor data:", doctorError);
        setLoading(false);
        return;
      }

      // Step 2: Fetch appointments separately
      await fetchAppointments(doctorData.id);
      
      // Step 3: Fetch patients separately
      await fetchPatients(doctorData.id);

    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (doctorId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: { user } } = await supabase.auth.getUser();
      // First get all appointments for today
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", user.id)
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

      // Create patient lookup map
      const patientMap = new Map();
      patientsData?.forEach(patient => {
        patientMap.set(patient.id, patient);
      });

      // Merge appointments with patient details
      const transformedAppointments = appointmentsData.map(app => {
        const patient = patientMap.get(app.patient_id);
        return {
          id: app.id,
          patient: patient ? 
            `${patient.first_name || ''} ${patient.last_name || ''}`.trim() : 
            "Unknown Patient",
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

    useEffect(() => {
      const path = location.pathname;
        console.log("Navigate to tab:",path);
      if (path.includes('/appointments')) setActiveTab('appointments');
      else if (path.includes('/patients')) setActiveTab('patients');
      else if (path.includes('/analytics')) setActiveTab('analytics');
      else if (path.includes('/profile')) setActiveTab('profile');
      else if (path.includes('/schedule')) setActiveTab('schedule');
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
      }
    };
     const trackButtonClick = (buttonName: string, additionalData = {}) => {
      mixpanelInstance.track('Doctor Dashboard Button Click', {
        buttonName,
        activeTab,
        ...additionalData
      });
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
              Profile
            </Button>
            {/* <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              size="sm"
              onClick={() => {handleTabChange("payments"); trackButtonClick("Payments Tab")}}
              className={activeTab === "payments" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button> */}
          </div>
        </div>

         {activeTab === "appointments" && <DoctorAppointmentManagement />}
        {activeTab === "schedule" && <DoctorSchedulePage />}
        {activeTab === "analytics" && <EarningsAnalytics />}
        {activeTab === "profile" && <DoctorProfile />}
        {activeTab === "patients" && <PatientAttendDetails />}
        {/* {activeTab === "payments" && <PaymentManagement />} */}
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
            View Calendar
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
              Appointments
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
              Profile
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => {handleTabChange("payments"); trackButtonClick("Payments Tab")}}
              className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button> */}
          </div>

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
            <CardDescription className="text-2xl font-bold text-doctor">0</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">₹0</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patient Rating</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">0</CardDescription>
          </CardHeader>
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
  <div className="text-center py-4 text-muted-foreground">Loading appointments...</div>
) : appointments.length > 0 ? (
  appointments.map((appointment) => (
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
    </div>
  );
};

export default DoctorDashboard;