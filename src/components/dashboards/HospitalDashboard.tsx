import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, CreditCard, TrendingUp, Package, FileText, Activity, Settings, Calendar1 } from "lucide-react";
import DepartmentManagement from "@/components/hospital/DepartmentManagement";
import StaffManagement from "@/components/hospital/StaffManagement";
import TimeSlotManagement from "@/components/hospital/TimeSlotManagement";
import HospitalPayments from "@/components/hospital/HospitalPayments";
import HospitalEarnings from "@/components/hospital/HospitalEarnings";
import mixpanelInstance from "@/utils/mixpanel";
import InventoryManagement from "@/components/hospital/InventoryManagement";
import FacilityCertifications from "@/components/hospital/FacilityCertifications";
import AppointmentFlow from "@/components/hospital/AppointmentFlow";
import FacilityProfile from "../hospital/FacilityProfile";
import BedDepartments from "../hospital/BedDepartments";
import { useLocation, useNavigate } from "react-router";
import FacilityAppointmentManagement from "@/components/facility/FacilityAppointmentManagement";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";

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


const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "departments"
    | "staff"
    | "timeslots"
    | "payments"
    | "earnings"
    | "inventory"
    | "facilitics"
    | "profile"
    | "appointments"
  >("overview");
  // const location = window.location;
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [overviewStats, setOverviewStats] = useState({
  totalDepartments: 0,
  totalStaff: 0,
  todayAppointments: 0,
  monthlyRevenue: 0,
  activePatients: 0,
  inventoryAlerts: 0
});

//  useEffect(() => {
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       // Fetch appointments
//       const { data: appointmentsData, error: appointmentsError } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("facility_id", user.id)
//         .order("appointment_date", { ascending: true });

//       if (appointmentsError) {
//         console.error("Error fetching appointments:", appointmentsError);
//       } else {
//         setAppointments(appointmentsData || []);
//       }

//       // Fetch departments count
//       const { count: departmentsCount } = await supabase
//         .from("departments")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", user.id);

//       // Fetch staff count
//       const { count: staffCount } = await supabase
//         .from("staff")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", user.id);

//       // Update overview stats with real data
//       setOverviewStats(prev => ({
//         ...prev,
//         totalDepartments: departmentsCount || 0,
//         totalStaff: staffCount || 0,
//         todayAppointments: appointmentsData?.filter(app => 
//           new Date(app.appointment_date).toDateString() === new Date().toDateString()
//         ).length || 0
//       }));

//     } catch (error) {
//       console.error("Error in fetchDashboardData:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDashboardData();
// }, []);
useEffect(() => {
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // IMPORTANT: First get the facility ID using the user_id
      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .single();

      if (facilityError || !facilityData) {
        console.error("Error fetching facility:", facilityError);
        setLoading(false);
        return;
      }

      const facilityId = facilityData.id;

      // Fetch appointments using facilityId (not user.id)
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")// Use facilityId here
        .order("appointment_date", { ascending: true });

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

      // Fetch departments count using facilityId
      const { count: departmentsCount } = await supabase
        .from("departments")
        .select("*", { count: 'exact', head: true })
        .eq("facility_id", facilityId); // Use facilityId

      // Fetch staff count from medical_professionals (not "staff" table)
      const { count: doctorCount } = await supabase
        .from("medical_professionals")
        .select("*", { count: 'exact', head: true })
        .eq("facility_id", facilityId); // Use facilityId

         const { count: staffCount } = await supabase
        .from("staff")
        .select("*", { count: 'exact', head: true })
        // .eq("facility_id", user.id);
        .eq("facility_id", facilityId); 

      // Calculate active patients (unique patients in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activePatientsData } = await supabase
        .from("appointments")
        .select("patient_id")
        .eq("facility_id", facilityId)
        .gte("appointment_date", thirtyDaysAgo.toISOString());

      const uniquePatients = activePatientsData 
        ? [...new Set(activePatientsData.map(a => a.patient_id))].length 
        : 0;

      // Update overview stats with real data
      setOverviewStats(prev => ({
        ...prev,
        totalDepartments: departmentsCount || 0,
        totalStaff: staffCount || 0,
        todayAppointments: appointmentsData?.filter(app => 
          new Date(app.appointment_date).toDateString() === new Date().toDateString()
        ).length || 0,
        activePatients: uniquePatients || 0
        // monthlyRevenue and inventoryAlerts need their own queries
      }));

    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);
  useEffect(() => {
  const path = location.pathname;
  if (path.includes('/profile')) setActiveTab('profile');
  else if (path.includes('/departments')) setActiveTab('departments');
  else if (path.includes('/staff')) setActiveTab('staff');
  else if (path.includes('/timeslots')) setActiveTab('timeslots');
  else if (path.includes('/payments')) setActiveTab('payments');
  else if (path.includes('/analytics')) setActiveTab('earnings');
  else if (path.includes('/inventory')) setActiveTab('inventory');
  else if (path.includes('/facilitics')) setActiveTab('facilitics');
  else if (path.includes('/appointments')) setActiveTab('appointments');
  else setActiveTab('overview');
}, [location.pathname]);

    // Update URL when tab changes
   const handleTabChange = (tab: typeof activeTab) => {
    mixpanelInstance.track('Hospital Dashboard Tab Change', {
        fromTab: activeTab,
        toTab: tab,
        location: 'dashboard_navigation'
      });
    setActiveTab(tab);
  const basePath = '/dashboard/facility';
  switch (tab) {
    case 'overview':
      navigate(basePath);
      break;
    case 'departments':
      navigate(`${basePath}/departments`);
      break;
    case 'staff':
      navigate(`${basePath}/staff`);
      break;
    case 'timeslots':
      navigate(`${basePath}/timeslots`);
      break;
    case 'payments':
      navigate(`${basePath}/payments`);
      break;
    case 'earnings':
      navigate(`${basePath}/analytics`);
      break;
    case 'inventory':
      navigate(`${basePath}/inventory`);
      break;
    case 'facilitics':
      navigate(`${basePath}/facilitics`);
      break;
    case 'profile':
      navigate(`${basePath}/profile`);
      break;
    case 'appointments':
      navigate(`${basePath}/appointments`);
      break;
    default:
      navigate(basePath);
  }
};
const trackButtonClick = (buttonName: string, additionalData = {}) => {
      mixpanelInstance.track('Doctor Dashboard Button Click', {
        buttonName,
        activeTab,
        ...additionalData
      });
    };




  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hospital Management Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive hospital operations management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as typeof activeTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="overview" className="flex items-center space-x-2" onClick={() => trackButtonClick("Overview Tab")}>
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center space-x-2" onClick={() => trackButtonClick("Departments Tab")}>
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Departments</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center space-x-2" onClick={() => trackButtonClick("Staff Tab")}>
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="timeslots" className="flex items-center space-x-2" onClick={() => trackButtonClick("Time Slots Tab")}>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Time Slots</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2" onClick={() => trackButtonClick("Appointments Tab")}>
            <Calendar1 className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          {/* <TabsTrigger value="payments" className="flex items-center space-x-2" onClick={() => trackButtonClick("Payments Tab")}>
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center space-x-2" onClick={() => trackButtonClick("Earnings Tab")}>
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2" onClick={() => trackButtonClick("Inventory Tab")}>
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="facilitics" className="flex items-center space-x-2" onClick={() => trackButtonClick("Facility Tab")}>
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Facility</span>
          </TabsTrigger> */}
          <TabsTrigger value="profile" className="flex items-center space-x-2" onClick={() => trackButtonClick("Profile Tab")}>
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">My profile</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <FacilityProfile />
        </TabsContent>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : overviewStats.totalDepartments}</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalStaff}</div>
                <p className="text-xs text-muted-foreground">Medical professionals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.todayAppointments}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(overviewStats.monthlyRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.activePatients}</div>
                <p className="text-xs text-muted-foreground">Under treatment</p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                <Package className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{overviewStats.inventoryAlerts}</div>
                <p className="text-xs text-muted-foreground">Low stock items</p>
              </CardContent>
            </Card> */}
          </div>

          <div className="mt-6">
            <AppointmentFlow />
          </div>
 </TabsContent>
        <TabsContent value="departments">
          <DepartmentManagement />
        </TabsContent>
        {/* <TabsContent value="bed-departments">
          <BedDepartments />
        </TabsContent> */}

        <TabsContent value="staff">
          <StaffManagement />
        </TabsContent>
        <TabsContent value="appointments">
          <FacilityAppointmentManagement />
        </TabsContent>

        <TabsContent value="timeslots">
          <TimeSlotManagement />
        </TabsContent>

        <TabsContent value="payments">
          <HospitalPayments />
        </TabsContent>

        <TabsContent value="earnings">
          <HospitalEarnings />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="facilitics">
          <FacilityCertifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboard;

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building2, Users, Calendar, CreditCard, TrendingUp, Package, FileText, Activity, Settings, Calendar1 } from "lucide-react";
// import DepartmentManagement from "@/components/hospital/DepartmentManagement";
// import StaffManagement from "@/components/hospital/StaffManagement";
// import TimeSlotManagement from "@/components/hospital/TimeSlotManagement";
// import HospitalPayments from "@/components/hospital/HospitalPayments";
// import HospitalEarnings from "@/components/hospital/HospitalEarnings";
// import mixpanelInstance from "@/utils/mixpanel";
// import InventoryManagement from "@/components/hospital/InventoryManagement";
// import FacilityCertifications from "@/components/hospital/FacilityCertifications";
// import AppointmentFlow from "@/components/hospital/AppointmentFlow";
// import FacilityProfile from "../hospital/FacilityProfile";
// import BedDepartments from "../hospital/BedDepartments";
// import { useLocation, useNavigate } from "react-router";
// import FacilityAppointmentManagement from "@/components/facility/FacilityAppointmentManagement";
// import { Button } from "../ui/button";
// import { supabase } from "@/integrations/supabase/client";

// interface Appointment {
//   id: string;
//   doctor_name: string;
//   display_doctor_name?: string;
//   appointment_date: string;
//   type: string;
//   status: string;
//   doctor_id?: string;
//   patient_id?: string;
//   facility_id?: string;
//   consultation_fee?: number;
//   reason?: string;
//   notes?: string;
// }

// interface UserProfile {
//   role: string;
//   user_id: string;
// }

// const HospitalDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<
//     | "overview"
//     | "departments"
//     | "staff"
//     | "timeslots"
//     | "payments"
//     | "earnings"
//     | "inventory"
//     | "facilitics"
//     | "profile"
//     | "appointments"
//   >("overview");
  
//   const location = useLocation();
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<string>("");
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [facilityId, setFacilityId] = useState<string | null>(null);
  
//   const [overviewStats, setOverviewStats] = useState({
//     totalDepartments: 0,
//     totalStaff: 0,
//     todayAppointments: 0,
//     monthlyRevenue: 0,
//     activePatients: 0,
//     inventoryAlerts: 0
//   });

//   // Fetch user role and facility ID on component mount
//   useEffect(() => {
//     const fetchUserRoleAndFacility = async () => {
//       try {
//         // Get current user
//         const { data: { user } } = await supabase.auth.getUser();
        
//         if (!user) {
//           setLoading(false);
//           return;
//         }

//         // Fetch user profile to get role
//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("role, user_id")
//           .eq("user_id", user.id)
//           .single();

//         if (profileError) {
//           console.error("Error fetching profile:", profileError);
//           setLoading(false);
//           return;
//         }

//         setUserProfile(profileData);
//         setUserRole(profileData.role);

//         let facilityIdToUse = user.id; // Default for hospital_admin

//         // If user is hospital_staff, get facility_id from staff table
//         if (profileData.role === 'hospital_staff') {
//           console.log('User is hospital_staff, fetching facility from staff table');
          
//           const { data: staffData, error: staffError } = await supabase
//             .from('staff')
//             .select('facility_id')
//             .eq('user_id', user.id)
//             .eq('is_active', true)
//             .maybeSingle();

//           if (staffError) {
//             console.error('Staff fetch error:', staffError.message);
//             setLoading(false);
//             return;
//           }

//           if (!staffData) {
//             console.error('No active staff record found');
//             setLoading(false);
//             return;
//           }

//           facilityIdToUse = staffData.facility_id;
//           console.log('Found facility_id for staff:', facilityIdToUse);
//         }

//         setFacilityId(facilityIdToUse);
        
//         // Now fetch dashboard data with the correct facility ID
//         await fetchDashboardData(facilityIdToUse, user.id, profileData.role);

//       } catch (error) {
//         console.error("Error in fetchUserRoleAndFacility:", error);
//         setLoading(false);
//       }
//     };

//     fetchUserRoleAndFacility();
//   }, []);

//   const fetchDashboardData = async (facilityId: string, userId: string, role: string) => {
//     try {
//       // Fetch facility data using facilityId
//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("id, facility_name")
//         .eq("id", facilityId)
//         .single();

//       if (facilityError) {
//         console.error("Error fetching facility:", facilityError);
//       }

//       // Fetch appointments using facilityId
//       const { data: appointmentsData, error: appointmentsError } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("facility_id", facilityId)
//         .order("appointment_date", { ascending: true });

//       if (appointmentsError) {
//         console.error("Error fetching appointments:", appointmentsError);
//       } else {
//         setAppointments(appointmentsData || []);
//       }

//       // Fetch departments count using facilityId
//       const { count: departmentsCount } = await supabase
//         .from("departments")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", facilityId);

//       // Fetch staff count - different logic based on role
//       let staffCount = 0;
      
//       if (role === 'hospital_admin') {
//         // Admin sees all staff
//         const { count } = await supabase
//           .from("staff")
//           .select("*", { count: 'exact', head: true })
//           .eq("facility_id", facilityId);
//         staffCount = count || 0;
//       } else if (role === 'hospital_staff') {
//         // Staff member only sees themselves
//         const { count } = await supabase
//           .from("staff")
//           .select("*", { count: 'exact', head: true })
//           .eq("facility_id", facilityId)
//           .eq("user_id", userId);
//         staffCount = count || 0;
//       }

//       // Calculate active patients (unique patients in last 30 days)
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       const { data: activePatientsData } = await supabase
//         .from("appointments")
//         .select("patient_id")
//         .eq("facility_id", facilityId)
//         .gte("appointment_date", thirtyDaysAgo.toISOString());

//       const uniquePatients = activePatientsData 
//         ? [...new Set(activePatientsData.map(a => a.patient_id))].length 
//         : 0;

//       // Update overview stats with real data
//       setOverviewStats(prev => ({
//         ...prev,
//         totalDepartments: departmentsCount || 0,
//         totalStaff: staffCount,
//         todayAppointments: appointmentsData?.filter(app => 
//           new Date(app.appointment_date).toDateString() === new Date().toDateString()
//         ).length || 0,
//         activePatients: uniquePatients || 0
//       }));

//     } catch (error) {
//       console.error("Error in fetchDashboardData:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const path = location.pathname;
//     if (path.includes('/profile')) setActiveTab('profile');
//     else if (path.includes('/departments')) setActiveTab('departments');
//     else if (path.includes('/staff')) setActiveTab('staff');
//     else if (path.includes('/timeslots')) setActiveTab('timeslots');
//     else if (path.includes('/payments')) setActiveTab('payments');
//     else if (path.includes('/analytics')) setActiveTab('earnings');
//     else if (path.includes('/inventory')) setActiveTab('inventory');
//     else if (path.includes('/facilitics')) setActiveTab('facilitics');
//     else if (path.includes('/appointments')) setActiveTab('appointments');
//     else setActiveTab('overview');
//   }, [location.pathname]);

//   // Update URL when tab changes
//   const handleTabChange = (tab: typeof activeTab) => {
//     mixpanelInstance.track('Hospital Dashboard Tab Change', {
//       fromTab: activeTab,
//       toTab: tab,
//       location: 'dashboard_navigation',
//       userRole: userRole
//     });
    
//     setActiveTab(tab);
//     const basePath = '/dashboard/facility';
    
//     switch (tab) {
//       case 'overview':
//         navigate(basePath);
//         break;
//       case 'departments':
//         navigate(`${basePath}/departments`);
//         break;
//       case 'staff':
//         navigate(`${basePath}/staff`);
//         break;
//       case 'timeslots':
//         navigate(`${basePath}/timeslots`);
//         break;
//       case 'payments':
//         navigate(`${basePath}/payments`);
//         break;
//       case 'earnings':
//         navigate(`${basePath}/analytics`);
//         break;
//       case 'inventory':
//         navigate(`${basePath}/inventory`);
//         break;
//       case 'facilitics':
//         navigate(`${basePath}/facilitics`);
//         break;
//       case 'profile':
//         navigate(`${basePath}/profile`);
//         break;
//       case 'appointments':
//         navigate(`${basePath}/appointments`);
//         break;
//       default:
//         navigate(basePath);
//     }
//   };

//   const trackButtonClick = (buttonName: string, additionalData = {}) => {
//     mixpanelInstance.track('Hospital Dashboard Button Click', {
//       buttonName,
//       activeTab,
//       userRole: userRole,
//       ...additionalData
//     });
//   };

//   // Render tabs with role-based access
//   const renderTabs = () => {
//     const tabs = [
//       { value: "overview", label: "Overview", icon: Activity, always: true },
//       { value: "departments", label: "Departments", icon: Building2, adminOnly: true },
//       { value: "staff", label: "Staff", icon: Users, adminOnly: true },
//       { value: "timeslots", label: "Time Slots", icon: Calendar, always: true },
//       { value: "appointments", label: "Appointments", icon: Calendar1, always: true },
//       { value: "profile", label: "My Profile", icon: Settings, always: true }
//     ];

//     return tabs.map(tab => {
//       // Skip if adminOnly and user is not admin
//       if (tab.adminOnly && userRole !== 'hospital_admin') {
//         return null;
//       }
      
//       return (
//         <TabsTrigger 
//           key={tab.value} 
//           value={tab.value} 
//           className="flex items-center space-x-2" 
//           onClick={() => trackButtonClick(`${tab.label} Tab`)}
//         >
//           <tab.icon className="h-4 w-4" />
//           <span className="hidden sm:inline">{tab.label}</span>
//         </TabsTrigger>
//       );
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with role badge */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Hospital Management Dashboard</h1>
//           <div className="flex items-center gap-2">
//             <p className="text-muted-foreground">
//               Comprehensive hospital operations management
//             </p>
//             {userRole && (
//               <span className={`text-xs px-2 py-1 rounded-full ${
//                 userRole === 'hospital_admin' 
//                   ? 'bg-purple-100 text-purple-800' 
//                   : 'bg-blue-100 text-blue-800'
//               }`}>
//                 {userRole === 'hospital_admin' ? 'Admin' : 'Staff Member'}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as typeof activeTab)} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-6">
//           {renderTabs()}
//         </TabsList>

//         <TabsContent value="profile">
//           <FacilityProfile />
//         </TabsContent>

//         <TabsContent value="overview">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
//                 <Building2 className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{loading ? "..." : overviewStats.totalDepartments}</div>
//                 <p className="text-xs text-muted-foreground">Active departments</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   {userRole === 'hospital_admin' ? 'Total Staff' : 'Your Staff Record'}
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewStats.totalStaff}</div>
//                 <p className="text-xs text-muted-foreground">
//                   {userRole === 'hospital_admin' ? 'Medical professionals' : 'Your staff record'}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewStats.todayAppointments}</div>
//                 <p className="text-xs text-muted-foreground">Scheduled for today</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">₹{(overviewStats.monthlyRevenue / 100000).toFixed(1)}L</div>
//                 <p className="text-xs text-muted-foreground">This month</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
//                 <Activity className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{overviewStats.activePatients}</div>
//                 <p className="text-xs text-muted-foreground">Under treatment</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
//                 <Package className="h-4 w-4 text-destructive" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-destructive">{overviewStats.inventoryAlerts}</div>
//                 <p className="text-xs text-muted-foreground">Low stock items</p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="mt-6">
//             <AppointmentFlow />
//           </div>
//         </TabsContent>

//         <TabsContent value="departments">
//           <DepartmentManagement />
//         </TabsContent>

//         <TabsContent value="staff">
//           <StaffManagement />
//         </TabsContent>

//         <TabsContent value="appointments">
//           <FacilityAppointmentManagement />
//         </TabsContent>

//         <TabsContent value="timeslots">
//           <TimeSlotManagement />
//         </TabsContent>

//         {/* Other tabs remain the same */}
//         <TabsContent value="payments">
//           <HospitalPayments />
//         </TabsContent>

//         <TabsContent value="earnings">
//           <HospitalEarnings />
//         </TabsContent>

//         <TabsContent value="inventory">
//           <InventoryManagement />
//         </TabsContent>

//         <TabsContent value="facilitics">
//           <FacilityCertifications />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default HospitalDashboard;