import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Search, Clock, FileText, Star, Heart, Shield, Plus, DollarSign, Settings, Bed } from "lucide-react";
import DoctorSearch from "@/components/patient/DoctorSearch";
import AppointmentManagement from "@/components/patient/AppointmentManagement";
import DocumentVault from "@/components/patient/DocumentVault";
import RecordSharing from "@/components/patient/RecordSharing";
import PaymentManagement from "@/components/patient/PaymentManagement";
import PatientProfile from "@/components/patient/PatientProfile";
import PatientDetailsPage from "@/pages/patient/PatientDetailsPage";
import { mixpanelInstance } from "@/utils/mixpanel";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location?: string;
  distance?: string;
  consultationFee: number;
  availability: string;
  hospital?: string;
  image?: string;
  description?: string;
}

interface Appointment {
  id: string;
  doctor_name: string;
  display_doctor_name?: string;
  appointment_date: string;
  type: string;
  status: string;
  doctor_id?: string;
  patient_id?: string;
  facility_id?: string;
  consultation_fee?: number;
  reason?: string;
  
  notes?: string;
}

interface Facility {
  id: string;
    facility_name?: string;
  facility_type?: string;
}


interface Patient {
  id: string;
    patient_first_name?: string;
  patient_last_name?: string;
  patient_email?: string;
  patient_phone?: string;
  patient_full_name?: string;
}
const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "search" | "appointments" | "documents" | "sharing" | "payments" | "profile"|"bookings">("overview");
 const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const fetchAppointments = async () => {
//     setLoading(true);
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       // Fetch appointments with doctor details from medical_professionals
//       const { data, error } = await supabase
//         .from("appointments")
//         .select(`* `)
//         .eq("patient_id", user.id) 
//         .order("appointment_date", { ascending: true });

//       if (error) {
//         console.error("Error fetching appointments:", error);
//         setAppointments([]);
//       } else if (data) {
//         // Transform the data to include doctor details
//         const transformedAppointments = data.map((app: any) => {
//           const medicalProf = app.medical_professionals;
//           const profileData = medicalProf?.profiles;
          
//           return {
//             ...app,
//             doctor_specialty: medicalProf?.medical_speciality ,
//             doctor_rating: medicalProf?.rating || 0,
//             doctor_experience: medicalProf?.years_experience || 0,
//             doctor_first_name: profileData?.first_name,
//             doctor_last_name: profileData?.last_name,
//             doctor_email: profileData?.email,
//             doctor_phone: profileData?.phone_number,
//             // Use doctor_name from appointments if available, otherwise construct from profile
//             display_doctor_name: app.doctor_name || 
//               (profileData ? `Dr. ${profileData.first_name} ${profileData.last_name}` : "Unknown Doctor")
//           };
//         });
//         setAppointments(transformedAppointments);
//       }
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       setAppointments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAppointments();


// }, []);



  // Update tab based on URL
useEffect(() => {
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Step 1: Fetch appointments first
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", user.id)
        .order("appointment_date", { ascending: true });

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        setAppointments([]);
        return;
      }

      if (!appointmentsData || appointmentsData.length === 0) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      // Step 2: Get all unique doctor_ids from appointments
      const doctorIds = [...new Set(appointmentsData
        .map(app => app.doctor_id)
        .filter(id => id) // Remove null/undefined
      )];

      if (doctorIds.length === 0) {
        // No doctor_ids found, just return appointments without doctor details
        setAppointments(appointmentsData);
        setLoading(false);
        return;
      }

      // Step 3: Fetch medical professionals data for these doctor_ids
      const { data: medicalProfessionalsData, error: medicalError } = await supabase
        .from("medical_professionals")
        .select(`*`)       
        .in("user_id", doctorIds);

      if (medicalError) {
        console.error("Error fetching medical professionals:", medicalError);
        // Still return appointments even if doctor details fail
        setAppointments(appointmentsData);
        setLoading(false);
        return;
      }

      // Step 4: Create a map for quick lookup
      const doctorMap = new Map();
      medicalProfessionalsData?.forEach(prof => {
        doctorMap.set(prof.user_id, {
          specialty: prof.medical_speciality,
          rating: prof.rating || 0,
          experience: prof.years_experience || 0,
          first_name: prof.profiles?.first_name,
          last_name: prof.profiles?.last_name,
          email: prof.profiles?.email,
          phone: prof.profiles?.phone_number
        });
      });

      // Step 5: Merge appointments with doctor details
      const transformedAppointments = appointmentsData.map((app: any) => {
        const doctorDetails = doctorMap.get(app.doctor_id);
        
        return {
          ...app,
          doctor_specialty: doctorDetails?.specialty,
          doctor_rating: doctorDetails?.rating || 0,
          doctor_experience: doctorDetails?.experience || 0,
          doctor_first_name: doctorDetails?.first_name,
          doctor_last_name: doctorDetails?.last_name,
          doctor_email: doctorDetails?.email,
          doctor_phone: doctorDetails?.phone,
          display_doctor_name: app.doctor_name || 
            (doctorDetails?.first_name ? `Dr. ${doctorDetails.first_name} ${doctorDetails.last_name || ''}` : "Unknown Doctor")
        };
      });

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("Error in fetchAppointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/search')) setActiveTab('search');
    else if (path.includes('/appointments')) setActiveTab('appointments');
    else if (path.includes('/records')) setActiveTab('documents');
    else if (path.includes('/sharing')) setActiveTab('sharing');
    else if (path.includes('/my_bed_bookings')) setActiveTab('bookings');
    else if (path.includes('/payments')) setActiveTab('payments');
    else setActiveTab('overview');
  }, [location.pathname]);

  // Update URL when tab changes
  const handleTabChange = (tab: typeof activeTab) => {
    mixpanelInstance.track('Patient Dashboard Tab Change', {
          fromTab: activeTab,
          toTab: tab,
          location: 'dashboard_navigation '
        });
    setActiveTab(tab);
    const basePath = '/dashboard/patient';
    switch (tab) {
      case 'overview': navigate(basePath); break;
      case 'profile': navigate(`${basePath}/profile`); break;
      case 'search': navigate(`${basePath}/search`); break;
      case 'appointments': navigate(`${basePath}/appointments`); break;
      case 'documents': navigate(`${basePath}/records`); break;
      case 'sharing': navigate(`${basePath}/sharing`); break;
      case 'bookings': navigate(`${basePath}/my_bed_bookings`); break;
      case 'payments': navigate(`${basePath}/payments`); break;
    }
  };
     const trackButtonClick = (buttonName: string, additionalData = {}) => {
      mixpanelInstance.track('Patient Dashboard Button Click', {
        buttonName,
        activeTab,
        ...additionalData
      });
    };
  // const upcomingAppointments = [
  //   {
  //     id: 1,
  //     doctor: "Dr. Sarah Johnson",
  //     specialty: "Cardiologist",
  //     date: "2024-01-15",
  //     time: "10:00 AM",
  //     type: "In-person"
  //   },
  //   {
  //     id: 2,
  //     doctor: "Dr. Michael Chen",
  //     specialty: "Dermatologist",
  //     date: "2024-01-18",
  //     time: "2:30 PM",
  //     type: "Teleconsultation"
  //   },
  //   {
  //     id: 2,
  //     doctor: "Dr. Michael Chen",
  //     specialty: "Dermatologist",
  //     date: "2024-01-18",
  //     time: "2:30 PM",
  //     type: "Teleconsultation"
  //   }
  // ];

  // const recentReports = [
  //   { id: 1, name: "Blood Test Report", date: "2024-01-10", doctor: "Dr. Sarah Johnson" },
  //   { id: 2, name: "ECG Report", date: "2024-01-08", doctor: "Dr. Sarah Johnson" },
  //   { id: 3, name: "X-Ray Chest", date: "2024-01-05", doctor: "Dr. Michael Chen" }
  // ];

  const carePlans = [
    {
      id: 1,
      name: "Cardiac Care Plus",
      description: "Comprehensive heart health monitoring",
      price: "₹2,999/month",
      features: ["Monthly doctor consultations", "Heart rate monitoring", "Diet planning", "Emergency support"]
    },
    {
      id: 2,
      name: "Diabetes Management",
      description: "Complete diabetes care and monitoring",
      price: "₹1,999/month",
      features: ["Blood sugar tracking", "Dietician consultations", "Medication reminders", "Regular check-ups"]
    }
  ];

  if (activeTab === "profile") {
    return <PatientProfile onBack={() => handleTabChange("overview")} />;
  }

  if (activeTab !== "overview") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Overview Tab"); handleTabChange("overview")}}
              className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Search Tab"); handleTabChange("search")}}
              className={activeTab === "search" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}
            >
              <Search className="h-4 w-4 mr-1" />
              Find Doctors
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Appointments Tab"); handleTabChange("appointments")}}
              className={activeTab === "appointments" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Appointments
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Bookings Tab"); handleTabChange("bookings")}}
              className={activeTab === "bookings" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <Bed className="h-4 w-4 mr-1" />
              My Bed Bookings
            </Button>
            {/* <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Documents Tab"); handleTabChange("documents")}}
              className={activeTab === "documents" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"}
            >
              <FileText className="h-4 w-4 mr-1" />
              Medical Vault
            </Button>
            <Button
              variant={activeTab === "sharing" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Sharing Tab"); handleTabChange("sharing")}}
              className={activeTab === "sharing" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"}
            >
              <Shield className="h-4 w-4 mr-1" />
              Share Records
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              size="sm"
              onClick={() =>{trackButtonClick("Payments Tab"); handleTabChange("payments")}}
              className={activeTab === "payments" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button> */}
          </div>
        </div>

        {activeTab === "search" && <DoctorSearch  view="all"/>}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "bookings" && <PatientDetailsPage />}
        {activeTab === "documents" && <DocumentVault />}
        {activeTab === "sharing" && <RecordSharing />}
        {activeTab === "payments" && <PaymentManagement />}
      </div>
    );
  }

    // Filter upcoming appointments (future dates)
  const upcomingAppointments = appointments
    .filter(app => new Date(app.appointment_date) > new Date() && app.status !== 'cancelled')
    .slice(0, 3); // Show only top 3 in overview

  // Filter past appointments
  const pastAppointments = appointments
    .filter(app => new Date(app.appointment_date) < new Date() || app.status === 'completed');

     // Get today's appointments
  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointment_date).toDateString();
    const today = new Date().toDateString();
    return appDate === today && app.status !== 'cancelled';
  });

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Patient Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">✨ Manage your health and appointments with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() =>{trackButtonClick("Profile Tab"); handleTabChange("profile")}}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            My Profile
          </Button>
        </div>
      </div>
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="default"
              size="sm"
              onClick={() =>{trackButtonClick("Overview Tab"); handleTabChange("overview")}}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              Overview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Search Tab"); handleTabChange("search")}}
              className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
            >
              <Search className="h-4 w-4 mr-1" />
              Find Doctors
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Appointments Tab"); handleTabChange("appointments")}}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Appointments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Bookings Tab"); handleTabChange("bookings")}}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Bed className="h-4 w-4 mr-1" />
              My Bed Bookings
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Documents Tab"); handleTabChange("documents")}}
              className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"
            >
              <FileText className="h-4 w-4 mr-1" />
              Medical Vault
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Sharing Tab"); handleTabChange("sharing")}}
              className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"
            >
              <Shield className="h-4 w-4 mr-1" />
              Share Records
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>{trackButtonClick("Payments Tab"); handleTabChange("payments")}}
              className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button> */}
          </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Upcoming Appointments</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              {/* {upcomingAppointments.length} */}{loading ? "..." : upcomingAppointments.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Medical Reports</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              {/* {recentReports.length} */}0
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Active Prescriptions</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Heart className="h-6 w-6 mr-2" />
              {/* 3 */}0
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Health Score</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Star className="h-6 w-6 mr-2" />
              {/* 85% */}0
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        {/* <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Calendar className="mr-2 h-6 w-6" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={() => { trackButtonClick("Search Tab"); handleTabChange("search"); }}
              >
                <Search className="mr-2 h-4 w-4" />
                Find & Book Doctors
              </Button>
            </div>
          </CardContent>
        </Card> */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Calendar className="mr-2 h-6 w-6" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading appointments...</div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-medium">{appointment.doctor_name}</p>
                      {/* <p className="text-sm text-muted-foreground">{appointment.doctor_specialty || "General Physician"}</p> */}
                      <p className="text-sm text-muted-foreground">
                        {formatAppointmentDate(appointment.appointment_date)} at {formatAppointmentTime(appointment.appointment_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded m-2 ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTabChange("appointments")}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={() => { trackButtonClick("Search Tab"); handleTabChange("search"); }}
              >
                <Search className="mr-2 h-4 w-4" />
                Find & Book Doctors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Reports */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-6 w-6" />
              Medical Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {/* {recentReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">By {report.doctor}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}  */}
             <div className="text-center py-4 text-muted-foreground">
                  No Manage Documents
                </div>
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                onClick={() => { trackButtonClick("Documents Tab"); handleTabChange("documents"); }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Plans */}
      {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <Heart className="mr-2 h-6 w-6" />
            💎 Recommended Care Plans
          </CardTitle>
          <CardDescription className="text-purple-100">
            Subscribe to specialized care packages for chronic conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {carePlans.map((plan) => (
              <Card key={plan.id} className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{plan.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" >
                    <Plus className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl">🚀 Quick Actions</CardTitle>
          <CardDescription className="text-indigo-100">Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-2">
            <Button
              className="h-24 flex-col bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => { trackButtonClick("Search Tab"); handleTabChange("search"); }}
            >
              <Search className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Find Doctors</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => { trackButtonClick("Appointments Tab"); handleTabChange("appointments"); }}
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Appointments</span>
            </Button>
            {/* <Button
              className="h-24 flex-col bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => { trackButtonClick("Documents Tab"); handleTabChange("documents"); }}
            >
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Medical Vault</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => { trackButtonClick("Sharing Tab"); handleTabChange("sharing"); }}
            >
              <Shield className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Share Records</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => { trackButtonClick("Payments Tab"); handleTabChange("payments"); }}
            >
              <DollarSign className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Payments</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
              onClick={() => { trackButtonClick("Emergency SOS"); }}
            >
              <Clock className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Emergency SOS</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;