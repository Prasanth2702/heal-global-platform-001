import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, Star, Bed, UserCheck, Settings, BarChart3 } from "lucide-react";
import MedicalProfessionalManagement from "@/components/subadmin/MedicalProfessionalManagement";
import ServiceScheduleManagement from "@/components/subadmin/ServiceScheduleManagement";
import FacilityAppointmentManagement from "@/components/subadmin/FacilityAppointmentManagement";
import FacilityPaymentTracking from "@/components/subadmin/FacilityPaymentTracking";
import PatientReviewManagement from "@/components/subadmin/PatientReviewManagement";
import BedManagementSystem from "@/components/subadmin/BedManagementSystem";
import SubAdminSettings from "@/components/subadmin/SubAdminSettings";
import UsageAuditLogs from "@/components/subadmin/UsageAuditLogs";

const SubAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock facility data (would be fetched based on sub-admin's assigned facility)
  const facilityData = {
    facilityName: "Apollo Hospital - Mumbai",
    facilityType: "Hospital",
    totalStaff: 45,
    totalBeds: 120,
    occupiedBeds: 87,
    todayAppointments: 32,
    monthlyRevenue: 850000,
    averageRating: 4.6,
    totalReviews: 234
  };

  const overviewStats = {
    totalStaff: facilityData.totalStaff,
    todayAppointments: facilityData.todayAppointments,
    availableBeds: facilityData.totalBeds - facilityData.occupiedBeds,
    monthlyRevenue: facilityData.monthlyRevenue,
    averageRating: facilityData.averageRating,
    pendingRequests: 8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sub-Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {facilityData.facilityName} Management Portal
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="beds" className="flex items-center space-x-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Beds</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalStaff}</div>
                <p className="text-xs text-muted-foreground">Active professionals</p>
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
                <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.availableBeds}</div>
                <p className="text-xs text-muted-foreground">Out of {facilityData.totalBeds} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(overviewStats.monthlyRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.averageRating}</div>
                <p className="text-xs text-muted-foreground">{facilityData.totalReviews} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <UserCheck className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{overviewStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions for facility management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setActiveTab("staff")}>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Add Staff</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setActiveTab("beds")}>
                  <div className="text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Manage Beds</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setActiveTab("services")}>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Schedule Services</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-accent" onClick={() => setActiveTab("reviews")}>
                  <div className="text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">View Reviews</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Usage Audit Logs in Overview */}
          <UsageAuditLogs />
        </TabsContent>

        <TabsContent value="staff">
          <MedicalProfessionalManagement facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="services">
          <ServiceScheduleManagement facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="appointments">
          <FacilityAppointmentManagement facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="payments">
          <FacilityPaymentTracking facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="reviews">
          <PatientReviewManagement facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="beds">
          <BedManagementSystem facilityId="apollo-mumbai" />
        </TabsContent>

        <TabsContent value="settings">
          <SubAdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubAdminDashboard;