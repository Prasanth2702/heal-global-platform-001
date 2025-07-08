import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Calendar, FileText, Search, TrendingUp, LogOut, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "patient" | "doctor" | "facility" | "admin";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userTypeConfig = {
    patient: {
      title: "NextGen Medical - Patient",
      variant: "patient" as const,
      routes: [
        { path: "/dashboard/patient", label: "Dashboard", icon: TrendingUp },
        { path: "/dashboard/patient/appointments", label: "Appointments", icon: Calendar },
        { path: "/dashboard/patient/records", label: "Medical Records", icon: FileText },
        { path: "/dashboard/patient/search", label: "Find Doctors", icon: Search },
        { path: "/dashboard/patient/profile", label: "Profile", icon: User },
      ]
    },
    doctor: {
      title: "NextGen Medical - Doctor",
      variant: "doctor" as const,
      routes: [
        { path: "/dashboard/doctor", label: "Dashboard", icon: TrendingUp },
        { path: "/dashboard/doctor/schedule", label: "Schedule", icon: Calendar },
        { path: "/dashboard/doctor/patients", label: "Patients", icon: User },
        { path: "/dashboard/doctor/prescriptions", label: "Prescriptions", icon: FileText },
        { path: "/dashboard/doctor/profile", label: "Profile", icon: User },
      ]
    },
    facility: {
      title: "NextGen Medical - Facility",
      variant: "facility" as const,
      routes: [
        { path: "/dashboard/facility", label: "Dashboard", icon: TrendingUp },
        { path: "/dashboard/facility/staff", label: "Staff Management", icon: User },
        { path: "/dashboard/facility/appointments", label: "Appointments", icon: Calendar },
        { path: "/dashboard/facility/analytics", label: "Analytics", icon: TrendingUp },
        { path: "/dashboard/facility/profile", label: "Facility Profile", icon: FileText },
      ]
    },
    admin: {
      title: "NextGen Medical - Admin",
      variant: "admin" as const,
      routes: [
        { path: "/dashboard/admin", label: "Overview", icon: TrendingUp },
        { path: "/dashboard/admin/users", label: "User Management", icon: User },
        { path: "/dashboard/admin/facilities", label: "Facilities", icon: FileText },
        { path: "/dashboard/admin/analytics", label: "Platform Analytics", icon: TrendingUp },
        { path: "/dashboard/admin/settings", label: "Settings", icon: User },
      ]
    }
  };

  const config = userTypeConfig[userType];

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-${config.variant}`}></div>
            <span className="font-bold text-lg">NextGen Medical</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {config.routes.map((route) => {
            const IconComponent = route.icon;
            const isActive = isActiveRoute(route.path);
            
            return (
              <Button
                key={route.path}
                variant={isActive ? config.variant : "ghost"}
                className={`w-full justify-start ${isActive ? 'shadow-medium' : ''}`}
                onClick={() => {
                  navigate(route.path);
                  setSidebarOpen(false);
                }}
              >
                <IconComponent className="mr-3 h-4 w-4" />
                {route.label}
              </Button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold ml-2 lg:ml-0">
              {config.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;