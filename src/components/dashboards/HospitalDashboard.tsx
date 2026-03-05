import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, CreditCard, TrendingUp, Package, FileText, Activity, Settings } from "lucide-react";
import DepartmentManagement from "@/components/hospital/DepartmentManagement";
import StaffManagement from "@/components/hospital/StaffManagement";
import TimeSlotManagement from "@/components/hospital/TimeSlotManagement";
import HospitalPayments from "@/components/hospital/HospitalPayments";
import HospitalEarnings from "@/components/hospital/HospitalEarnings";

import InventoryManagement from "@/components/hospital/InventoryManagement";
import FacilityCertifications from "@/components/hospital/FacilityCertifications";
import AppointmentFlow from "@/components/hospital/AppointmentFlow";
import FacilityProfile from "../hospital/FacilityProfile";
import BedDepartments from "../hospital/BedDepartments";
import { useNavigate } from "react-router";
import FacilityAppointmentManagement from "@/components/facility/FacilityAppointmentManagementPage";
import { Button } from "../ui/button";

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
    | "facility"
    | "profile"
    | "appointments"
  >("overview");
  const location = window.location;

  useEffect(() => {
  const path = location.pathname;
  if (path.includes('/profile')) setActiveTab('profile');
  else if (path.includes('/departments')) setActiveTab('departments');
  else if (path.includes('/staff')) setActiveTab('staff');
  else if (path.includes('/timeslots')) setActiveTab('timeslots');
  else if (path.includes('/payments')) setActiveTab('payments');
  else if (path.includes('/analytics')) setActiveTab('earnings');
  else if (path.includes('/inventory')) setActiveTab('inventory');
  else if (path.includes('/facility')) setActiveTab('facility');
  else if (path.includes('/appointments')) setActiveTab('appointments');
  else setActiveTab('overview');
}, [location.pathname]);

    // Update URL when tab changes
   const handleTabChange = (tab: typeof activeTab) => {
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
    case 'facility':
      navigate(`${basePath}/facility`);
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

  // Mock data for overview
  const overviewStats = {
    totalDepartments: 8,
    totalStaff: 124,
    todayAppointments: 45,
    monthlyRevenue: 2850000,
    activePatients: 1250,
    inventoryAlerts: 12
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
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Departments</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="timeslots" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Time Slots</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="facility" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Facility</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">My profile</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
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
                <div className="text-2xl font-bold">{overviewStats.totalDepartments}</div>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                <Package className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{overviewStats.inventoryAlerts}</div>
                <p className="text-xs text-muted-foreground">Low stock items</p>
              </CardContent>
            </Card>
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

        <TabsContent value="facility">
          <FacilityCertifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboard;