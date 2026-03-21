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


const StaffDashboard = () => {
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
  const [facilityName, setFacilityName] = useState("");
    const [loading, setLoading] = useState(true);
    const[UserRole,setUserRole]=useState();
    const [overviewStats, setOverviewStats] = useState({
  totalDepartments: 0,
  totalStaff: 0,
  todayAppointments: 0,
  monthlyRevenue: 0,
  activePatients: 0,
  inventoryAlerts: 0
});

 const [hasBedManagement, setHasBedManagement] = useState(false);
useEffect(() => {
    checkBedManagementDepartment();
  }, []);

  const checkBedManagementDepartment = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      // Get staff record to find department_id
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("department_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (staffError) throw staffError;
      if (!staffData || !staffData.department_id) return;

      const departmentId = staffData.department_id;

      // Check if this department is a "Bed Management" department
      const { data: departmentData, error: deptError } = await supabase
        .from("departments")
        .select("id, name")
        .eq("id", departmentId)
        .eq("name", "Bed Management")
        .eq("is_active", true)
        .maybeSingle();

      if (deptError) throw deptError;

      // If department exists and is named "Bed Management" → set flag
      if (departmentData) {
        setHasBedManagement(true);
      } else {
        setHasBedManagement(false);
      }
    } catch (err) {
      console.error("Bed Management check failed:", err);
      setHasBedManagement(false);
    }
  };
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
// useEffect(() => {
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Step 1: Get current user
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       console.log("Current user:", user.id);

//       // Step 2: Check staff profile using user_id
//       const { data: staffData, error: staffError } = await supabase
//         .from("staff")
//         .select("id, facility_id")
//         .eq("user_id", user.id)
//         .single();

//       if (staffError || !staffData) {
//         console.error("Error fetching staff profile:", staffError);
//         setLoading(false);
//         return;
//       }

//       console.log("Staff data:", staffData);
//       const facilityId = staffData.facility_id;

//       // Step 3: Get facility details using facility_id
//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("id, facility_name, admin_user_id")
//         .eq("id", facilityId)
//         .single();

//       if (facilityError || !facilityData) {
//         console.error("Error fetching facility:", facilityError);
//         setLoading(false);
//         return;
//       }

//       console.log("Facility data:", facilityData);
//       const facilityName = facilityData.facility_name;
      
//       // Set facility name in state
//       setFacilityName(facilityName || "");

//       // Step 4: Fetch appointments using facilityId
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

//       // Step 5: Fetch departments count using facilityId
//       const { count: departmentsCount } = await supabase
//         .from("departments")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", facilityId);

//       // Step 6: Fetch doctors count from medical_professionals
//       const { count: doctorCount } = await supabase
//         .from("medical_professionals")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", facilityId);

//       // Step 7: Fetch other staff count (excluding the current user maybe?)
//       const { count: otherStaffCount } = await supabase
//         .from("staff")
//         .select("*", { count: 'exact', head: true })
//         .eq("facility_id", facilityId)
//         .neq("user_id", user.id); // Exclude current user if you want

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
//         totalStaff: (doctorCount || 0) + (otherStaffCount || 0) + 1, // +1 for current user
//         todayAppointments: appointmentsData?.filter(app => 
//           new Date(app.appointment_date).toDateString() === new Date().toDateString()
//         ).length || 0,
//         activePatients: uniquePatients || 0
//         // monthlyRevenue and inventoryAlerts need their own queries
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
      // Step 1: Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      console.log("Current user:", user.id);

      // Step 2: Check user profile first
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      console.log("User profile:", profile);

      let facilityId = null;
      let userRole = null;

      // Step 3: Check if user is facility admin (from profile)
      if (profile?.role === 'facility_admin') {
        console.log("User is facility admin");
        userRole = 'admin';
        
        // Get facility where user is admin
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select("id, facility_name, admin_user_id")
          .eq("admin_user_id", user.id)
          .maybeSingle();

        if (facilityError) {
          console.error("Error fetching admin facility:", facilityError);
        }

        if (facilityData) {
          facilityId = facilityData.id;
          setFacilityName(facilityData.facility_name || "");
          console.log("Admin facility found:", facilityId);
        }
      }
      // Step 4: Check if user is facility staff (from staff table)
      else {
        console.log("Checking staff table...");
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select("id, facility_id, department_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (staffError) {
          console.error("Error fetching staff:", staffError);
        }

        if (staffData) {
          console.log("Staff data found:", staffData);
          userRole = staffData.role || 'staff';
          facilityId = staffData.facility_id;

          // Verify facility exists
          const { data: facilityData, error: facilityError } = await supabase
            .from("facilities")
            .select("id, facility_name")
            .eq("id", facilityId)
            .maybeSingle();

          if (facilityError) {
            console.error("Error fetching staff facility:", facilityError);
          }

          if (facilityData) {
            setFacilityName(facilityData.facility_name || "");
            console.log("Staff facility found:", facilityId);
          }
        }
        // Step 5: Check if user has profile but no staff record
        else if (profile) {
          console.log("User has profile but no staff record");
          userRole = profile.role || 'personnel';
          
          // Try to find facility through any association
          const { data: deptStaff } = await supabase
            .from("staff")
            .select("facility_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (deptStaff?.facility_id) {
            facilityId = deptStaff.facility_id;
          }
        }
      }

      // If no facility ID found, user might not have access
      if (!facilityId) {
        console.log("No facility access for user");
        setOverviewStats({
          totalDepartments: 0,
          totalStaff: 0,
          todayAppointments: 0,
          monthlyRevenue: 0,
          activePatients: 0,
          inventoryAlerts: 0
        });
        setAppointments([]);
        setLoading(false);
        return;
      }

      console.log("Using facility ID:", facilityId);

      // Step 6: Fetch appointments using facilityId
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("facility_id", facilityId)
        .order("appointment_date", { ascending: true });

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

      // Step 7: Fetch departments count
      const { count: departmentsCount } = await supabase
        .from("departments")
        .select("*", { count: 'exact', head: true })
        .eq("facility_id", facilityId);

      // Step 8: Fetch doctors count
      const { count: doctorCount } = await supabase
        .from("medical_professionals")
        .select("*", { count: 'exact', head: true })
        .eq("facility_id", facilityId);

      // Step 9: Fetch other staff count
      const { count: otherStaffCount } = await supabase
        .from("staff")
        .select("*", { count: 'exact', head: true })
        .eq("facility_id", facilityId);

      // Step 10: Calculate active patients
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

      // Step 11: Calculate today's appointments
      const today = new Date().toDateString();
      const todayAppointments = appointmentsData?.filter(app => 
        new Date(app.appointment_date).toDateString() === today
      ).length || 0;

      // Update overview stats
      setOverviewStats({
        totalDepartments: departmentsCount || 0,
        totalStaff: (doctorCount || 0) + (otherStaffCount || 0),
        todayAppointments: todayAppointments,
        activePatients: uniquePatients || 0,
        monthlyRevenue: 0, // You can add revenue calculation here
        inventoryAlerts: 0 // You can add inventory alerts here
      });

      // Set user role if needed
      if (userRole) {
        setUserRole(userRole);
      }

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
//   if (path.includes('/profile')) setActiveTab('profile');
//   else if (path.includes('/departments')) setActiveTab('departments');
//   else if (path.includes('/staff')) setActiveTab('staff');
//   else if (path.includes('/timeslots')) setActiveTab('timeslots');
//   else if (path.includes('/payments')) setActiveTab('payments');
//   else if (path.includes('/analytics')) setActiveTab('earnings');
//   else if (path.includes('/inventory')) setActiveTab('inventory');
//   else if (path.includes('/facilitics')) setActiveTab('facilitics');
//   else 
    if (path.includes('/appointments')) setActiveTab('appointments');
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
  const basePath = '/dashboard/staff';
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
          <h1 className="text-3xl font-bold">Hospital Management Dashboard{facilityName ? ` - ${facilityName}` : ''}</h1>
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
          {/* <TabsTrigger value="departments" className="flex items-center space-x-2" onClick={() => trackButtonClick("Departments Tab")}>
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
          </TabsTrigger> */}
          {!hasBedManagement && (
          <TabsTrigger value="appointments" className="flex items-center space-x-2" onClick={() => trackButtonClick("Appointments Tab")}>
            <Calendar1 className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          )}
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
          {/* <TabsTrigger value="profile" className="flex items-center space-x-2" onClick={() => trackButtonClick("Profile Tab")}>
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">My profile</span>
          </TabsTrigger> */}
        </TabsList>
        {/* <TabsContent value="profile">
          <FacilityProfile />
        </TabsContent> */}
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

export default StaffDashboard;

