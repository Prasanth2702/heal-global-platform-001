// // // import { useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { useLocation, useNavigate, useParams } from "react-router-dom";
// // // import { useToast } from "@/hooks/use-toast";
// // // import AuthLayout from "./AuthLayout";
// // // import OTPLogin from "./OTPLogin";
// // // import { supabase } from "@/integrations/supabase/client";
// // // import mixpanelInstance from "@/utils/mixpanel";


// // // const LoginForm = () => {
// // //   const navigate = useNavigate();
// // //   const { userType } = useParams();
// // //   const { toast } = useToast();
// // //   const location = useLocation();
// // //   const [formData, setFormData] = useState({
// // //     email: "",
// // //     password: ""
// // //   });
// // //  const from = location.state?.from || `/dashboard/${userType}`;

// // //   const userTypeConfig = {
// // //     patient: {
// // //       title: "Patient Login",
// // //       description: "Access your health dashboard and appointments",
// // //       variant: "patient" as const,
// // //       dashboardRoute: "/dashboard/patient"
// // //     },
// // //     doctor: {
// // //       title: "Medical Professional Login", 
// // //       description: "Access your practice management dashboard",
// // //       variant: "doctor" as const,
// // //       dashboardRoute: "/dashboard/doctor"
// // //     },
// // //     facility: {
// // //       title: "Medical Facility Login",
// // //       description: "Manage your facility and staff",
// // //       variant: "facility" as const,
// // //       dashboardRoute: "/dashboard/facility"
// // //     },
// // //     admin: {
// // //       title: "Admin Login",
// // //       description: "Platform administration and oversight",
// // //       variant: "admin" as const,
// // //       dashboardRoute: "/dashboard/admin"
// // //     }
// // //   };

// // //   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
  
// // //   const userRole = (userType=='facility')? 'hospital_admin' : userType;


// // //   const checkEmailInProfiles = async (email : string) => {
// // //     const lowerCaseEmail = email.toLowerCase();
// // //     // const { data, error } = await supabase
// // //     //   .from('profiles')
// // //     //   .select('email')
// // //     //   .eq('email', lowerCaseEmail)
// // //     //   .eq('role',userRole)
// // //     //   .maybeSingle();
// // // let query = supabase
// // //     .from('profiles')
// // //     .select('email')
// // //     .eq('email', lowerCaseEmail);
  
// // //   if (userType === 'facility') {
// // //     // Check for either role
// // //     query = query.in('role', ['hospital_admin', 'hospital_staff']);
// // //   } else {
// // //     // Check for specific role
// // //     query = query.eq('role', userRole);
// // //   }
  
// // //   const { data, error } = await query.maybeSingle();
// // //     if (error) {
// // //       console.error('Error checking email:', error);
// // //       return false;
// // //     }
// // //     else{
// // //       console.log(data);
// // //     }
// // //     return !!data;
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // // mixpanelInstance.track('Login Attempt', {
// // //       email: formData.email,
// // //       userType: userType,
// // //       loginMethod: 'email_password'
// // //     });

// // //     const { email, password } = formData;

// // //     const emailExists = await checkEmailInProfiles(email);
// // //     if (emailExists) {
// // //       const { data, error } = await supabase.auth.signInWithPassword({
// // //         email,
// // //         password
// // //       });

// // //       if (error) {
// // //         toast({
// // //           title: "Login failed",
// // //           description: "Invalid email or password. Please try again",
// // //           variant: "destructive"
// // //         });
// // //          mixpanelInstance.track('Login Failed', {
// // //           email: formData.email,
// // //           userType: userType,
// // //           loginMethod: 'email_password',
// // //           reason: 'invalid_credentials'
// // //         });
// // //         return;
// // //       }

// // //         mixpanelInstance.track('Login Success', {
// // //         email: formData.email,
// // //         userType: userType,
// // //         loginMethod: 'email_password',
// // //         userId: data.user?.id
// // //       });

// // //       toast({
// // //         title: "Login Successful!",
// // //         description: `Welcome back! Redirecting to your ${userType} dashboard...`,
// // //       });

// // //       setTimeout(() => {
// // //         if (from) {
// // //           navigate(from, { replace: true });
// // //         } else
// // //         navigate(config.dashboardRoute);
// // //       }, 1500);

// // //     } else {
// // //       console.log("Email is not registered. Please sign up first");
// // //       toast({
// // //         title: "Login failed",
// // //         description: "Email is not registered. Please sign up first",
// // //         variant: "destructive"
// // //       });
// // //        mixpanelInstance.track('Login Failed', {
// // //         email: formData.email,
// // //         userType: userType,
// // //         loginMethod: 'email_password',
// // //         reason: 'email_not_registered'
// // //       });
// // //     }
// // //   };


// // //   const handleLoginSuccess = () => {
// // //     setTimeout(() => {
// // //       navigate(config.dashboardRoute);
// // //     }, 1500);
// // //   };

// // //   const handleOTPLogin = () => {
// // //     toast({
// // //       title: "Login Successful!",
// // //       description: `Welcome back! Redirecting to your ${userType} dashboard...`,
// // //     });
// // //      mixpanelInstance.track('Login Success', {
// // //       email: formData.email,
// // //       userType: userType,
// // //       loginMethod: 'otp'
// // //     });
// // //     handleLoginSuccess();
// // //   };

// // //    const handleSignInClick = () => {
// // //     mixpanelInstance.track('Sign In Button Clicked', {
// // //       userType: userType,
// // //       location: 'login_form'
// // //     });
// // //   };

// // //   return (
// // //     <AuthLayout
// // //       title={config.title}
// // //       description={config.description}
// // //       userType={config.variant}
// // //     >
// // //       <Tabs defaultValue="email" className="w-full">
// // //         <TabsList className="grid w-full grid-cols-1">
// // //           <TabsTrigger value="email">Email/Password</TabsTrigger>
// // //           {/* <TabsTrigger value="otp">OTP Login</TabsTrigger> */}
// // //         </TabsList>
        
// // //         <TabsContent value="email" className="space-y-4">
// // //           <form onSubmit={handleSubmit} className="space-y-4">
// // //             <div>
// // //               <Label htmlFor="email">Email or Phone</Label>
// // //               <Input
// // //                 id="email"
// // //                 type="email"
// // //                 value={formData.email}
// // //                 onChange={(e) => setFormData({...formData, email: e.target.value})}
// // //                 placeholder="Enter your email or phone number"
// // //                 required
// // //               />
// // //             </div>

// // //             <div>
// // //               <Label htmlFor="password">Password</Label>
// // //               <Input
// // //                 id="password"
// // //                 type="password"
// // //                 value={formData.password}
// // //                 onChange={(e) => setFormData({...formData, password: e.target.value})}
// // //                 placeholder="Enter your password"
// // //                 required
// // //               />
// // //             </div>

// // //             <div className="text-right">
// // //               <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate("/forgot-password/" + userType)}>
// // //                 Forgot password?
// // //               </Button>
// // //             </div>

// // //             <Button type="submit" variant={config.variant} className="w-full" size="lg" onClick={handleSignInClick}>
// // //               Sign In
// // //             </Button>
// // //           </form>
// // //         </TabsContent>
        
// // //         <TabsContent value="otp" className="space-y-4">
// // //           <OTPLogin userType={config.variant} onSuccess={handleOTPLogin} />
// // //         </TabsContent>
// // //       </Tabs>

// // //       <div className="text-center text-sm text-muted-foreground  mt-3">
// // //         Don't have an account?{" "}
// // //         <Button 
// // //           variant="link" 
// // //           className="p-0 h-auto" 
// // //           onClick={() => navigate(`/register/${userType}`)}
// // //         >
// // //           Register here
// // //         </Button>
// // //       </div>
// // //     </AuthLayout>
// // //   );
// // // };

// // // export default LoginForm;

// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useLocation, useNavigate, useParams } from "react-router-dom";
// // import { useToast } from "@/hooks/use-toast";
// // import AuthLayout from "./AuthLayout";
// // import OTPLogin from "./OTPLogin";
// // import { supabase } from "@/integrations/supabase/client";
// // import mixpanelInstance from "@/utils/mixpanel";

// // const LoginForm = () => {
// //   const navigate = useNavigate();
// //   const { userType } = useParams();
// //   const { toast } = useToast();
// //   const [isLoading, setIsLoading] = useState(false);
// //   const location = useLocation();
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: ""
// //   });
// //   const from = location.state?.from;

// //   const userTypeConfig = {
// //     patient: {
// //       title: "Patient Login",
// //       description: "Access your health dashboard and appointments",
// //       variant: "patient" as const,
// //     },
// //     doctor: {
// //       title: "Medical Professional Login", 
// //       description: "Access your practice management dashboard",
// //       variant: "doctor" as const,
// //     },
// //      // 🔥 NEW
// //   "facility-admin": {
// //     title: "Facility Admin Login",
// //     description: "Manage your facility and staff",
// //     variant: "facility" as const,
// //   },
// //   "facility-staff": {
// //     title: "Facility Staff Login",
// //     description: "Access assigned hospital operations",
// //     variant: "facility" as const,
// //   },
// //     facility: {
// //       title: "Medical Facility Login",
// //       description: "Manage your facility and staff",
// //       variant: "facility" as const,
// //     },
// //     admin: {
// //       title: "Admin Login",
// //       description: "Platform administration and oversight",
// //       variant: "admin" as const,
// //     }
// //   };

// //   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;

// //   const checkEmailInProfiles = async (email: string) => {
// //     const lowerCaseEmail = email.toLowerCase();
    
// //     let query = supabase
// //       .from('profiles')
// //       .select('email, role') // Also fetch the role
// //       .eq('email', lowerCaseEmail);
    
// //     if (userType === 'facility') {
// //       // Check for either role
// //       query = query.in('role', ['hospital_admin', 'hospital_staff']);
// //     } else {
// //       // Check for specific role
// //       query = query.eq('role', userType);
// //     }
    
// //     const { data, error } = await query.maybeSingle();
    
// //     if (error) {
// //       console.error('Error checking email:', error);
// //       return null;
// //     }
    
// //     console.log('Profile data:', data);
// //     return data; // Return the full data object
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// // setIsLoading(true);


// //   try {
// //     mixpanelInstance.track('Login Attempt', {
// //       email: formData.email,
// //       userType: userType,
// //       loginMethod: 'email_password'
// //     });

// //     const { email, password } = formData;

// //     const profileData = await checkEmailInProfiles(email);
    
// //     if (profileData) {
// //       const { data, error } = await supabase.auth.signInWithPassword({
// //         email,
// //         password
// //       });

// //       if (error) {
// //         toast({
// //           title: "Login failed",
// //           description: "Invalid email or password. Please try again",
// //           variant: "destructive"
// //         });
// //         mixpanelInstance.track('Login Failed', {
// //           email: formData.email,
// //           userType: userType,
// //           loginMethod: 'email_password',
// //           reason: 'invalid_credentials'
// //         });
// //         return;
// //       }

// //       mixpanelInstance.track('Login Success', {
// //         email: formData.email,
// //         userType: userType,
// //         loginMethod: 'email_password',
// //         userId: data.user?.id,
// //         role: profileData.role
// //       });

// //       toast({
// //         title: "Login Successful!",
// //         description: `Welcome back! Redirecting to your dashboard...`,
// //       });

// //       // Determine redirect path based on role
// //       setTimeout(() => {
// //         let redirectPath = '';
        
// //         // If there's a from state with a specific path, use that
// //         if (from) {
// //           redirectPath = from;
// //         } 
// //         // For facility logins, check the specific role
// //         else if (userType === 'facility') {
// //           if (profileData.role === 'hospital_admin') {
// //             redirectPath = '/dashboard/facility';
// //           } else if (profileData.role === 'hospital_staff') {
// //             redirectPath = '/dashboard/staff';
// //           } else {
// //             // Fallback to default facility dashboard if role is unknown
// //             redirectPath = '/dashboard/facility';
// //           }
// //         } 
// //         // For other user types
// //         else {
// //           redirectPath = `/dashboard/${userType}`;
// //         }

// //         navigate(redirectPath, { replace: true });
// //       }, 1500);

// //     } else {
// //       console.log("Email is not registered. Please sign up first");
// //       toast({
// //         title: "Login failed",
// //         description: "Email is not registered. Please sign up first",
// //         variant: "destructive"
// //       });
// //       mixpanelInstance.track('Login Failed', {
// //         email: formData.email,
// //         userType: userType,
// //         loginMethod: 'email_password',
// //         reason: 'email_not_registered'
// //       });
// //     }
// //     } finally {
// //     setIsLoading(false);
// //   }
// //   };

// //   const handleLoginSuccess = async () => {
// //     // For OTP login, we need to fetch the user's role after successful authentication
// //     const { data: { user } } = await supabase.auth.getUser();
    
// //     if (user) {
// //       const { data: profile } = await supabase
// //         .from('profiles')
// //         .select('role')
// //         .eq('user_id', user.id)
// //         .single();
      
// //       setTimeout(() => {
// //         let redirectPath = '';
        
// //         if (userType === 'facility' && profile) {
// //           if (profile.role === 'hospital_admin') {
// //             redirectPath = '/dashboard/facility';
// //           } else if (profile.role === 'hospital_staff') {
// //             redirectPath = '/dashboard/staff';
// //           } else {
// //             redirectPath = '/dashboard/facility';
// //           }
// //         } else {
// //           redirectPath = `/dashboard/${userType}`;
// //         }
        
// //         navigate(redirectPath);
// //       }, 1500);
// //     } else {
// //       // Fallback if we can't get the user
// //       setTimeout(() => {
// //         navigate(`/dashboard/${userType}`);
// //       }, 1500);
// //     }
// //   };

// //   const handleOTPLogin = () => {
// //     toast({
// //       title: "Login Successful!",
// //       description: `Welcome back! Redirecting to your dashboard...`,
// //     });
// //     mixpanelInstance.track('Login Success', {
// //       email: formData.email,
// //       userType: userType,
// //       loginMethod: 'otp'
// //     });
// //     handleLoginSuccess();
// //   };

// //   const handleSignInClick = () => {
// //     mixpanelInstance.track('Sign In Button Clicked', {
// //       userType: userType,
// //       location: 'login_form'
// //     });
// //   };

// //   return (
// //     <AuthLayout
// //       title={config.title}
// //       description={config.description}
// //       userType={config.variant}
// //     >
// //       <Tabs defaultValue="email" className="w-full">
// //         {/* <TabsList className="grid w-full grid-cols-1">
// //           <TabsTrigger value="email">Email/Password</TabsTrigger>
// //           <TabsTrigger value="otp">OTP Login</TabsTrigger>
// //         </TabsList> */}
        
// //         <TabsContent value="email" className="space-y-4">
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div>
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={(e) => setFormData({...formData, email: e.target.value})}
// //                 placeholder="Enter your email "
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <Label htmlFor="password">Password</Label>
// //               <Input
// //                 id="password"
// //                 type="password"
// //                 value={formData.password}
// //                 onChange={(e) => setFormData({...formData, password: e.target.value})}
// //                 placeholder="Enter your password"
// //                 required
// //               />
// //             </div>

// //             <div className="text-right">
// //               <Button     type="button"
// //  variant="link" className="p-0 h-auto text-sm" onClick={() => navigate("/forgot-password/" + userType)}>
// //                 Forgot password?
// //               </Button>
// //             </div>

// //             <Button type="submit" variant={config.variant} className="w-full" size="lg" onClick={handleSignInClick}   disabled={isLoading}
// // >
// //               {/* Sign In */}
// //                 {isLoading ? "Signing in..." : "Sign In"}

// //             </Button>
// //           </form>
// //         </TabsContent>
        
// //         <TabsContent value="otp" className="space-y-4">
// //           <OTPLogin userType={config.variant} onSuccess={handleOTPLogin} />
// //         </TabsContent>
// //       </Tabs>

// //       <div className="text-center text-sm text-muted-foreground mt-3">
// //         Don't have an account?{" "}
// //         <Button 
// //           variant="link" 
// //           className="p-0 h-auto" 
// //           onClick={() => navigate(`/register/${userType}`)}
// //         >
// //           Register here
// //         </Button>
// //       </div>
// //     </AuthLayout>
// //   );
// // };

// // export default LoginForm;

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import AuthLayout from "./AuthLayout";
// import OTPLogin from "./OTPLogin";
// import { supabase } from "@/integrations/supabase/client";
// import mixpanelInstance from "@/utils/mixpanel";
// import { Eye, EyeOff } from "lucide-react";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const { userType } = useParams();
//   const { toast } = useToast();
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("email");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const from = location.state?.from;

//   // Map URL userType params to actual profile roles
//   const getExpectedRoles = (userTypeParam: string): string[] => {
//     if (userTypeParam === 'facility' || userTypeParam === 'facility-admin' || userTypeParam === 'facility-staff') {
//       return ['hospital_admin', 'hospital_staff'];
//     }
//     // For patient, doctor, admin
//     return [userTypeParam];
//   };

//   const userTypeConfig = {
//     patient: {
//       title: "Patient Login",
//       description: "Access your health dashboard and appointments",
//       variant: "patient" as const,
//     },
//     doctor: {
//       title: "Medical Professional Login", 
//       description: "Access your practice management dashboard",
//       variant: "doctor" as const,
//     },
//     "facility-admin": {
//       title: "Facility Admin Login",
//       description: "Manage your facility and staff",
//       variant: "facility" as const,
//     },
//     "facility-staff": {
//       title: "Facility Staff Login",
//       description: "Access assigned hospital operations",
//       variant: "facility" as const,
//     },
//     facility: {
//       title: "Medical Facility Login",
//       description: "Manage your facility and staff",
//       variant: "facility" as const,
//     },
//     admin: {
//       title: "Admin Login",
//       description: "Platform administration and oversight",
//       variant: "admin" as const,
//     }
//   };

//   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;

//   // Helper to determine redirect path based on profile role
//   const getDashboardPath = (profileRole: string | null, fallbackUserType: string): string => {
//     if (from) return from;
//     if (profileRole === 'hospital_admin') return '/dashboard/facility';
//     if (profileRole === 'hospital_staff') return '/dashboard/staff';
//     return `/dashboard/${fallbackUserType}`;
//   };

//   const checkEmailInProfiles = async (email: string) => {
//     const lowerCaseEmail = email.toLowerCase();
//     const allowedRoles = getExpectedRoles(userType);

//     let query = supabase
//       .from('profiles')
//       .select('email, role')
//       .eq('email', lowerCaseEmail);

//     if (allowedRoles.length > 1) {
//       query = query.in('role', allowedRoles);
//     } else {
//       query = query.eq('role', allowedRoles[0]);
//     }

//     const { data, error } = await query.maybeSingle();
//     if (error) {
//       console.error('Error checking email:', error);
//       return null;
//     }
//     return data;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       mixpanelInstance.track('Login Attempt', {
//         email: formData.email,
//         userType: userType,
//         loginMethod: 'email_password'
//       });

//       const { email, password } = formData;

//       const profileData = await checkEmailInProfiles(email);
      
//       if (profileData) {
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password
//         });

//         if (error) {
//           toast({
//             title: "Login failed",
//             description: "Invalid email or password. Please try again",
//             variant: "destructive"
//           });
//           mixpanelInstance.track('Login Failed', {
//             email: formData.email,
//             userType: userType,
//             loginMethod: 'email_password',
//             reason: 'invalid_credentials'
//           });
//           return;
//         }

//         mixpanelInstance.track('Login Success', {
//           email: formData.email,
//           userType: userType,
//           loginMethod: 'email_password',
//           userId: data.user?.id,
//           role: profileData.role
//         });

//         toast({
//           title: "Login Successful!",
//           description: `Welcome back! Redirecting to your dashboard...`,
//         });

//         const redirectPath = getDashboardPath(profileData.role, userType);
//         setTimeout(() => {
//           navigate(redirectPath, { replace: true });
//         }, 1500);
//       } else {
//         toast({
//           title: "Login failed",
//           description: "Email is not registered. Please sign up first",
//           variant: "destructive"
//         });
//         mixpanelInstance.track('Login Failed', {
//           email: formData.email,
//           userType: userType,
//           loginMethod: 'email_password',
//           reason: 'email_not_registered'
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOTPLoginSuccess = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
    
//     if (user) {
//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('user_id', user.id)
//         .single();
      
//       toast({
//         title: "Login Successful!",
//         description: `Welcome back! Redirecting to your dashboard...`,
//       });
      
//       mixpanelInstance.track('Login Success', {
//         email: formData.email,
//         userType: userType,
//         loginMethod: 'otp'
//       });

//       const redirectPath = getDashboardPath(profile?.role, userType);
//       setTimeout(() => {
//         navigate(redirectPath, { replace: true });
//       }, 1500);
//     } else {
//       // Fallback (should not happen)
//       setTimeout(() => {
//         navigate(`/dashboard/${userType}`, { replace: true });
//       }, 1500);
//     }
//   };

//   // Auto‑switch tab via query param
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     if (params.get("tab") === "otp") setActiveTab("otp");
//   }, [location.search]);

//   // Allowed user types that can register (patient, doctor, facility only)
// const normalizedUserType =
//   userType === "facility-admin" ? "facility" : userType;
//   const canRegister =
//   normalizedUserType === "patient" ||
//   normalizedUserType === "doctor" ||
//   normalizedUserType === "facility";

//   return (
//     <AuthLayout
//       title={config.title}
//       description={config.description}
//       userType={config.variant}
//     >
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         {/* <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="email">Email/Password</TabsTrigger>
//           <TabsTrigger value="otp">OTP Login</TabsTrigger>
//         </TabsList> */}
        
//         <TabsContent value="email" className="space-y-4">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             {/* <div>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div> */}
//             <div>
//   <Label htmlFor="password">Password</Label>
//   <div className="relative">
//     <Input
//       id="password"
//       type={showPassword ? "text" : "password"}
//       value={formData.password}
//       onChange={(e) => setFormData({...formData, password: e.target.value})}
//       placeholder="Enter your password"
//       required
//       className="pr-10"
//     />
//     <button
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//     >
//       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//     </button>
//   </div>
// </div>

//             <div className="text-right">
//               <Button
//                 type="button"
//                 variant="link"
//                 className="p-0 h-auto text-sm"
//                 onClick={() => navigate(`/forgot-password/${userType}`)}
//               >
//                 Forgot password?
//               </Button>
//             </div>

//             <Button type="submit" variant={config.variant} className="w-full" size="lg" disabled={isLoading}>
//               {isLoading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>
//         </TabsContent>
        
//         <TabsContent value="otp" className="space-y-4">
//           <OTPLogin userType={config.variant} onSuccess={handleOTPLoginSuccess} />
//         </TabsContent>
//       </Tabs>

//       {/* Show registration link only for patient, doctor, facility */}
//       {canRegister && (
//         <div className="text-center text-sm text-muted-foreground mt-3">
//           Don't have an account?{" "}
//           <Button 
//             variant="link" 
//             className="p-0 h-auto" 
//             onClick={() => navigate(`/register/${normalizedUserType}`)}
//           >
//             Register here
//           </Button>
//         </div>
//       )}
//     </AuthLayout>
//   );
// };

// export default LoginForm;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";
import OTPLogin from "./OTPLogin";
import { supabase } from "@/integrations/supabase/client";
import mixpanelInstance from "@/utils/mixpanel";
import { Eye, EyeOff } from "lucide-react";
import rollbar from "@/lib/rollbar";

const LoginForm = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { toast } = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from;

  
  // Map URL userType params to actual profile roles
  const getExpectedRoles = (userTypeParam: string): string[] => {
    if (userTypeParam === 'facility' || userTypeParam === 'facility-admin' || userTypeParam === 'facility-staff') {
      return ['hospital_admin', 'hospital_staff'];
    }
    // For patient, doctor, admin
    return [userTypeParam];
  };

  const userTypeConfig = {
    patient: {
      title: "Patient's Login",
      description: "Access your health dashboard and appointments",
      variant: "patient" as const,
    },
    doctor: {
      title: "Doctor's Login", 
      description: "Access your practice management dashboard",
      variant: "doctor" as const,
    },
    "facility-admin": {
      title: "Facility Admin's Login",
      description: "Manage your facility and staff",
      variant: "facility" as const,
    },
    "facility-staff": {
      title: "Facility Staff's Login",
      description: "Access assigned hospital operations",
      variant: "facility" as const,
    },
    facility: {
      title: "Facility Login",
      description: "Manage your facility and staff",
      variant: "facility" as const,
    },
    admin: {
      title: "Admin Login",
      description: "Platform administration and oversight",
      variant: "admin" as const,
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;

  // Helper to determine redirect path based on profile role
  const getDashboardPath = (profileRole: string | null, fallbackUserType: string): string => {
    if (from) return from;
    if (profileRole === 'hospital_admin') return '/dashboard/facility';
    if (profileRole === 'hospital_staff') return '/dashboard/staff';
    return `/dashboard/${fallbackUserType}`;
  };

  /**
   * Check if an email exists in profiles AND has one of the allowed roles.
   * Returns an object with email, role, and exists flag, or null if not found.
   */
  const checkEmailInProfiles = async (email: string) => {
    const lowerCaseEmail = email.toLowerCase();
    const allowedRoles = getExpectedRoles(userType);

    let query = supabase
      .from('profiles')
      .select('email, role')
      .eq('email', lowerCaseEmail);

    if (allowedRoles.length > 1) {
      query = query.in('role', allowedRoles);
    } else {
      query = query.eq('role', allowedRoles[0]);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('Error checking email:', error);
      return null;
    }
    return data; // { email, role } or null
  };

  /**
   * Check if an email exists in profiles (any role) – used to distinguish not found vs wrong role.
   */
  const emailExistsAnyRole = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
    return !!data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      mixpanelInstance.track('Login Attempt', {
        email: formData.email,
        userType: userType,
        loginMethod: 'email_password'
      });

      const { email, password } = formData;

      // First, check if the email exists at all in profiles
      const emailExists = await emailExistsAnyRole(email);

      if (!emailExists) {
          rollbar.warning("Login attempt with non-existing email", {
    email,
    userType,
  });
        toast({
          title: "Email not found",
          description: "No account exists with this email. Please sign up first.",
          variant: "destructive"
        });
        mixpanelInstance.track('Login Failed', {
          email: formData.email,
          userType: userType,
          loginMethod: 'email_password',
          reason: 'email_not_found'
        });
        setIsLoading(false);
        return;
      }

      // Then check if it has the correct role for this login page
      const profileData = await checkEmailInProfiles(email);

      if (!profileData) {
        // Email exists but role does not match
        // toast({
        //   title: "Invalid login portal",
        //   description: `If the email is already registered. Please go to right portal login page.`,
        //   variant: "destructive"
        // });
        rollbar.warning("Login role mismatch", {
        email,
        attemptedUserType: userType,
      });

        toast({
  title: "Login Error",
  description: "If you registered already, Please choose the correct login type (Patient / Doctor / Facility).",
  variant: "destructive"
});
        mixpanelInstance.track('Login Failed', {
          email: formData.email,
          userType: userType,
          loginMethod: 'email_password',
          reason: 'role_mismatch'
        });
        setIsLoading(false);
        return;
      }

      // Proceed with sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {

        rollbar.error("Invalid login credentials", {
    email,
    userType,
    error: error.message,
  });
        
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again",
          variant: "destructive"
        });
        mixpanelInstance.track('Login Failed', {
          email: formData.email,
          userType: userType,
          loginMethod: 'email_password',
          reason: 'invalid_credentials'
        });
        setIsLoading(false);
        return;
      }

      mixpanelInstance.track('Login Success', {
        email: formData.email,
        userType: userType,
        loginMethod: 'email_password',
        userId: data.user?.id,
        role: profileData.role
      });

      toast({
        title: "Login Successful!",
        description: `Welcome back! Redirecting to your dashboard...`,
      });

      const redirectPath = getDashboardPath(profileData.role, userType);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1500);

} catch (err: any) {
    // ✅ Unexpected error logging
    rollbar.critical("Unexpected login error", {
      email: formData.email,
      userType,
      error: err?.message,
    });

    toast({
      title: "Something went wrong",
      description: "Please try again later.",
      variant: "destructive"
    });

    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLoginSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (profileError || !profile) {
        console.error('Profile fetch error after OTP:', profileError);
        toast({
          title: "Login Error",
          description: "Could not retrieve profile information.",
          variant: "destructive",
        });
        // Sign out to avoid inconsistent state
        await supabase.auth.signOut();
        return;
      }

      // Validate that the user's role matches the intended login type
      const allowedRoles = getExpectedRoles(userType);
      if (!allowedRoles.includes(profile.role)) {
        toast({
          title: "Access Denied",
          description: `Please use the correct portal.`,
          variant: "destructive",
        });
        await supabase.auth.signOut();
        return;
      }

      toast({
        title: "Login Successful!",
        description: `Welcome back! Redirecting to your dashboard...`,
      });
      
      mixpanelInstance.track('Login Success', {
        email: user.email,
        userType: userType,
        loginMethod: 'otp',
        userId: user.id,
        role: profile.role
      });

      const redirectPath = getDashboardPath(profile.role, userType);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1500);
    } else {
      // Fallback (should not happen)
      setTimeout(() => {
        navigate(`/dashboard/${userType}`, { replace: true });
      }, 1500);
    }
  };

  // Auto‑switch tab via query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "otp") setActiveTab("otp");
  }, [location.search]);

  // Allowed user types that can register (patient, doctor, facility only)
  const normalizedUserType =
    userType === "facility-admin" ? "facility" : userType;
  const canRegister =
    normalizedUserType === "patient" ||
    normalizedUserType === "doctor" ||
    normalizedUserType === "facility";

  return (
    <AuthLayout
      title={config.title}
      description={config.description}
      userType={config.variant}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="email" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate(`/forgot-password/${userType}`)}
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" variant={config.variant} className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="otp" className="space-y-4">
          <OTPLogin userType={config.variant} onSuccess={handleOTPLoginSuccess} />
        </TabsContent>
      </Tabs>

      {/* Show registration link only for patient, doctor, facility */}
      {canRegister && (
        <div className="text-center text-sm text-muted-foreground mt-3">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            onClick={() => navigate(`/register/${normalizedUserType}`)}
          >
            Register here
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginForm;