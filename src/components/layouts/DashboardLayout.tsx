import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Calendar, FileText, Search, TrendingUp, LogOut, Menu, X, LogIn, RegexIcon, Bed, WalletCards, BookDashedIcon, EqualApproximately, Clock, UserCogIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { register } from "module";
import Footer from "@/pages/alldetails/Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "patient" | "doctor" | "facility" | "admin" |"hospital_staff"  ;
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasBedManagement, setHasBedManagement] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          // Show toast notification
          toast({
            title: "Authentication Required",
            description: "Please log in to access the dashboard",
            variant: "destructive",
          });
          
          // Redirect to home page
          navigate("/", { replace: true });
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);




//   useEffect(() => {
//   if (userType === "facility") {
//     checkBedManagementDepartment();
//   }
// }, [userType]);

// const checkBedManagementDepartment = async () => {
//   try {
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) return;

//     // Get staff record to find department_id
//     const { data: staffData, error: staffError } = await supabase
//       .from("staff")
//       .select("department_id")
//       .eq("user_id", user.id)
//       .maybeSingle();

//     if (staffError) throw staffError;
//     if (!staffData || !staffData.department_id) return;

//     const departmentId = staffData.department_id;

//     // Check if this department is a "Bed Management" department
//     const { data: departmentData, error: deptError } = await supabase
//       .from("departments")
//       .select("id, name")
//       .eq("id", departmentId)
//       .eq("name", "Bed Management")
//       .eq("is_active", true)
//       .maybeSingle();

//     if (deptError) throw deptError;

//     // If department exists and is named "Bed Management" → allow menu
//     if (departmentData) {
//       setHasBedManagement(true);
//     }
//   } catch (err) {
//     console.error("Bed Management check failed:", err);
//   }
// };

useEffect(() => {
  if (userType === "facility" || userType === "hospital_staff") {
    checkBedManagementDepartment();
  }
}, [userType]);

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

  const userTypeConfig = {
    patient: {
      title: "NextGen Medical - Patient",
      variant: "patient" as const,
      routes: [
        { path: "/dashboard/patient", label: "Dashboard", icon: TrendingUp },
        {
          path: "/dashboard/patient/appointments",
          label: "Appointments",
          icon: Calendar,
        },
        // {
        //   path: "/dashboard/patient/records",
        //   label: "Medical Records",
        //   icon: FileText,
        // },
        {
          path: "/dashboard/patient/search",
          label: "Find Doctors",
          icon: Search,
        },
        { path: "/dashboard/patient/profile", label: "Profile", icon: User },
        // {
        //   path: "/dashboard/patient/my_bed_bookings",
        //   label: "My Bed Bookings",
        //   icon: User,
        // },
        // {
        //   path: "/dashboard/patient/book/:facilityId",
        //   label: "My Bed",
        //   icon: FileText,
        // },
        {
          path: "/dashboard/patient/book/patient-facilities",
          label: "Find Bed",
          icon: Bed,
        },
      ],
  //     routes1: [
  //     {
  //       register:"/register/patient",
  //       labelName: "Register",
  //       icon: RegexIcon,
  //     },
  //     ],
  //  routes2: [
  //     {
  //       login: "/login/patient",
  //       labelName: "Login",
  //       icon: LogIn,
  //     }
  //     ]
    },
    doctor: {
      title: "NextGen Medical - Doctor",
      variant: "doctor" as const,
      routes: [
        { path: "/dashboard/doctor", label: "Dashboard", icon: TrendingUp },
        // {
        //   path: "/dashboard/doctor/schedule",
        //   label: "Schedule",
        //   icon: Calendar,
        // },
        // { path: "/dashboard/doctor/patients", label: "Patients", icon: UserCogIcon },
        { path: "/dashboard/doctor/appointments", label: "Appointments", icon: Calendar },
        // {
        //   path: "/dashboard/doctor/prescriptions",
        //   label: "Prescriptions",
        //   icon: FileText,
        // },
        { path: "/dashboard/doctor/profile", label: "Profile", icon: User },
      ],
  //     routes1: [
  //     {
  //      register:"/register/doctor",
  //      labelName: "Register",
  //      icon: RegexIcon,
  //    },
  //    ],
  //  routes2: [
  //    {
  //      login: "/login/doctor",
  //      labelName: "Login",
  //      icon: LogIn,
  //    }
  //   ]
    },
    facility: {
      title: "NextGen Medical - Facility",
      variant: "facility" as const,
      routes: [
        { path: "/dashboard/facility", label: "Dashboard", icon: TrendingUp },
        {
          path: "/dashboard/facility/departments",
          label: "Departments",
          icon: FileText,
        },
        {
          path: "/dashboard/facility/staff",
          label: "Staff Management",
          icon: User,
        },
        {
          path: "/dashboard/facility/timeslots",
          label: "Time Slots",
          icon: Clock,
        },
        {
          path: "/dashboard/facility/appointments",
          label: "Appointments",
          icon: Calendar,
        },
        // {
        //   path: "/dashboard/facility/analytics",
        //   label: "Analytics",
        //   icon: TrendingUp,
        // },
        {
          path: "/dashboard/facility/profile",
          label: "My Profile",
          icon: FileText,
        },
        // {
        //   path: "/dashboard/facility/booking_bed",
        //   label: "Bed Bookings",
        //   icon: FileText,
        // },
        // {
        //   path: "/dashboard/facility/ward-management",
        //   label: "Ward Management",
        //   icon: FileText,
        // },
  //       ...(hasBedManagement
  // ? [
      {
        path: "/dashboard/facility/booking_bed",
        label: "Bed Bookings",
        icon: Bed,
      },
      {
        path: "/dashboard/facility/ward-management",
        label: "Ward Management",
        icon: WalletCards,
      },
      // ]
      // : []),
      // {
      //   path: "/dashboard/facility/bed-management",
      //   label: "Bed Management",
      //   icon: BookDashedIcon,
      // },
    
  ],
  // routes1: [
  // {
  //    register:"/register/facility",
  //    labelName: "Register",
  //    icon: RegexIcon,
  //  },
  // ],
  //  routes2: [
  // {
  //     login: "/login/facility", // or appropriate login path for facility
  //     labelName: "Login",
  //     icon: LogIn,
  //   }]
    },
    admin: {
      title: "NextGen Medical - Admin",
      variant: "admin" as const,
      routes: [
        { path: "/dashboard/admin", label: "Overview", icon: TrendingUp },
        {
          path: "/dashboard/admin/users",
          label: "User Management",
          icon: User,
        },
        {
          path: "/dashboard/admin/facilities",
          label: "Facilities",
          icon: FileText,
        },
        {
          path: "/dashboard/admin/analytics",
          label: "Platform Analytics",
          icon: TrendingUp,
        },
        { path: "/dashboard/admin/settings", label: "Settings", icon: User },
      ],
//        routes1: [
//     {
//       register: "/register/admin", // or appropriate register path for admin
//       labelName: "Register",
//       icon: RegexIcon,
//     },
//   ],
//   routes2: [
//   {
//     login: "/login/admin", // or appropriate login path for admin
//     labelName: "Login",
//     icon: LogIn,
//   }
// ]
    },
    hospital_staff: {
      title: "NextGen Medical - Hospital staff",
      variant: "hospital_staff" as const,
      routes: [
        { path: "/dashboard/staff", label: "Overview", icon: TrendingUp },
           ...(!hasBedManagement ? [  {
          path: "/dashboard/staff/appointments",
          label: "Appointments",
          icon: Calendar,
        }, ] : []),
               ...(hasBedManagement
  ? [
         {
        path: "/dashboard/staff/booking_bed",
        label: "Bed Bookings",
        icon: Bed,
      },
    ]
  : []),
      ],

    },
  };

  const config = userTypeConfig[userType];
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });

    navigate("/");
  };

   

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

    // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return (
    <>
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            {/* <img
    src="/favicon.svg"
    alt="NextGen Medical"
    className="h-8 w-8 rounded-md object-contain"
  /> */}
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
        {/* Sidebar Footer */}
{/* <div className="p-4 border-t">
  {user ? (
    <Button
      variant="destructive"
      className="w-full justify-start"
      onClick={handleLogout}
    >
      <LogOut className="mr-3 h-4 w-4" />
      Logout
    </Button>
  ) : (
    <div className="space-y-2">
      <div className="space-y-1">
        {config.routes1.map(route1 => {
            const RegisterIcon = route1.icon;
            return (
              <Button
                key={route1.register}
                variant="default"
                className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(route1.register)}
              >
                <RegisterIcon className="mr-3 h-4 w-4" />
                {route1.labelName}
              </Button>
            );
          })}
      </div>
      <div className="space-y-1">
        {config.routes2.map(route2 => {
            const RegisterIcon = route2.icon;
            return (
              <Button
                key={route2.login}
                variant="default"
                className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(route2.login)}
              >
                <RegisterIcon className="mr-3 h-4 w-4" />
                {route2.labelName}
              </Button>
            );
          })}
      </div>

    </div>
  )}
</div> */}
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/dashboard/${userType}/profile`)}
            >
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
      <Footer/>
      </>
  );
};

export default DashboardLayout;