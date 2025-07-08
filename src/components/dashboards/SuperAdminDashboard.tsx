import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, UserCheck, CreditCard, Bell, Shield, BarChart3, Globe, Edit, DollarSign } from "lucide-react";
import UserStatistics from "@/components/admin/UserStatistics";
import RegistrationApprovals from "@/components/admin/RegistrationApprovals";
import PaymentMonitoring from "@/components/admin/PaymentMonitoring";
import NotificationBroadcast from "@/components/admin/NotificationBroadcast";
import RolePermissionManagement from "@/components/admin/RolePermissionManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import PlatformEarnings from "@/components/admin/PlatformEarnings";
import GeographicStatistics from "@/components/admin/GeographicStatistics";
import ProfileManagement from "@/components/admin/ProfileManagement";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock overview data
  const overviewStats = {
    totalUsers: 12547,
    totalDoctors: 1834,
    totalHospitals: 267,
    totalPatients: 10446,
    pendingApprovals: 43,
    monthlyRevenue: 2850000,
    activeSubscriptions: 156,
    expiringSubscriptions: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive platform management and analytics
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="geography" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Geography</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Profiles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All platform users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Professionals</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalDoctors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Doctors & specialists</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthcare Facilities</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalHospitals}</div>
                <p className="text-xs text-muted-foreground">Hospitals & clinics</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Bell className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{overviewStats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(overviewStats.monthlyRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">Platform earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Current subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Bell className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{overviewStats.expiringSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalPatients.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Registered patients</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserStatistics />
        </TabsContent>

        <TabsContent value="approvals">
          <RegistrationApprovals />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentMonitoring />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationBroadcast />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissionManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="earnings">
          <PlatformEarnings />
        </TabsContent>

        <TabsContent value="geography">
          <GeographicStatistics />
        </TabsContent>

        <TabsContent value="profiles">
          <ProfileManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;