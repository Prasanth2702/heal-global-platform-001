// // import { HeartPulse, LogIn, Menu, UserPlus, X, Home, Info, Stethoscope, Building2, Bed, Calendar, ChevronDown, User } from 'lucide-react';
// // import React, { useEffect, useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import {
// //   DropdownMenu,
// //   DropdownMenuTrigger,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// // } from "@/components/ui/dropdown-menu";
// // import { Button } from "@/components/ui/button";
// // import type { User as SupabaseUser } from "@supabase/supabase-js";
// // import { supabase } from "@/integrations/supabase/client";
// // import logoheader from "@/image/Gemini.png"
// // const Header = () => {
// //   const navigate = useNavigate();
  
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState<SupabaseUser | null>(null);
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" | null>(null);

// //   const checkUser = async () => {
// //     try {
// //       const {
// //         data: { session },
// //       } = await supabase.auth.getSession();

// //       const currentUser = session?.user || null;
// //       setUser(currentUser);

// //       if (currentUser) {
// //         const { data: profile } = await supabase
// //           .from("profiles")
// //           .select("id, role, user_id, first_name, last_name, email")
// //           .eq("user_id", currentUser.id)
// //           .maybeSingle();

// //         if (profile) {
// //           if (profile.role === "hospital_admin") {
// //             setUserRole("facility");
// //           } else {
// //             setUserRole(profile.role || null);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Check user on mount and set up auth listener
// //   useEffect(() => {
// //     checkUser();

// //     // Set up auth state listener
// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       const currentUser = session?.user || null;
// //       setUser(currentUser);
      
// //       if (currentUser) {
// //         const fetchUserRole = async () => {
// //           const { data: profile } = await supabase
// //             .from("profiles")
// //             .select("role")
// //             .eq("user_id", currentUser.id)
// //             .maybeSingle();

// //           if (profile) {
// //             if (profile.role === "hospital_admin") {
// //               setUserRole("facility");
// //             } else {
// //               setUserRole(profile.role || null);
// //             }
// //           }
// //         };
// //         fetchUserRole();
// //       } else {
// //         setUserRole(null);
// //       }
// //       setLoading(false);
// //     });

// //     return () => subscription.unsubscribe();
// //   }, []);

// //   useEffect(() => {
// //     const checkRole = async () => {
// //       const { data: { session } } = await supabase.auth.getSession();

// //       if (!session) {
// //         return;
// //       }

// //       const { data: profile } = await supabase
// //         .from("profiles")
// //         .select("id, role, user_id, first_name, last_name, email")
// //         .eq("user_id", session.user.id)
// //         .maybeSingle();

// //       if (profile) {
// //         if (profile.role === "patient") {
// //           const { data: patient } = await supabase
// //             .from("patient")
// //             .select("id")
// //             .eq("user_id", session.user.id)
// //             .maybeSingle();
            
// //           if (!patient) {
// //             console.log("Patient profile incomplete");
// //           }
// //         } else if (profile.role === "doctor") {
// //           const { data: doctor } = await supabase
// //             .from("medical_professionals")
// //             .select("id")
// //             .eq("user_id", session.user.id)
// //             .maybeSingle();
            
// //           if (!doctor) {
// //             console.log("Doctor profile incomplete");
// //           }
// //         } else if (profile.role === "facility" || profile.role === "hospital_admin") {
// //           const { data: facility } = await supabase
// //             .from("facilities")
// //             .select("id")
// //             .eq("admin_user_id", session.user.id)
// //             .maybeSingle();
            
// //           if (!facility) {
// //             console.log("Facility profile incomplete");
// //           }
// //         }
// //       }
// //     };

// //     if (user) {
// //       checkRole();
// //     }
// //   }, [user, navigate]);

// //   const handleLogout = async () => {
// //     try {
// //       await supabase.auth.signOut();
// //       setUser(null);
// //       setUserRole(null);
// //       setMobileMenuOpen(false);
// //       navigate("/");
// //     } catch (error) {
// //       console.error("Error logging out:", error);
// //     }
// //   };

// //   const closeMobileMenu = () => {
// //     setMobileMenuOpen(false);
// //   };

// //   const navigationLinks = [
// //     { name: 'Home', path: '/', icon: <Home size={18} /> },
// //     { name: 'About', path: '/about', icon: <User size={18} /> },
// //     { name: 'Find Doctors / Specialists', path: '/appointment/doctors', icon: <Stethoscope size={18} /> },
// //     { name: 'Find Facility / Services ', path: '/appointment/hospitals', icon: <Building2 size={18} /> },
// //     { name: 'Find Beds', path: '/appointment/beds', icon: <Calendar size={18} /> },
// //   ];

// //   // Handle navigation with proper event prevention
// //   const handleNavigation = (path: string) => {
// //     navigate(path);
// //     setMobileMenuOpen(false);
// //   };

// //   return (
// //     <div className="bg-white shadow-sm sticky top-0 z-50">
// //       <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
// //         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex h-20 items-center justify-between">
// //             {/* Logo */}
// //             <Link 
// //               to="/" 
// //               className="flex items-center space-x-2 hover:opacity-80 transition-opacity" 
// //               onClick={closeMobileMenu}
// //             >
// //               {/* <img
// //                 src="/favicon.svg"
// //                 alt="NextGen Medical"
// //                 className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-contain"
// //               /> */}
// //               <img
// //                 src={logoheader}
// //                 alt="Cloud Hospitals"
// //                 className="h-10 w-10 sm:h-20 sm:w-20 rounded-md object-contain"
// //               />
// //               <span className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-none bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
// //                 CloudHospitals.ai
// //               </span>
// //               {/* <span className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-none 
// // bg-gradient-to-r from-[#1e6fa8] via-[#2bb3c0] to-[#5ed6c5] 
// // bg-clip-text text-transparent 
// // drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
// //   Cloud Hospitals - Ai
// // </span> */}
// //             </Link>

// //             {/* Desktop Navigation Links - Hidden on mobile */}
// //             <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
// //               {navigationLinks.map((link) => (
// //                 <Button
// //                   key={link.name}
// //                   variant="ghost"
// //                   onClick={(e) => {
// //                     e.preventDefault();
// //                     handleNavigation(link.path);
// //                   }}
// //                   className="flex items-center gap-1 px-2 xl:px-3 text-sm xl:text-base hover:bg-blue-50 hover:text-blue-600 transition-all"
// //                 >
// //                   <span className="text-blue-600">{link.icon}</span>
// //                   <span>{link.name}</span>
// //                 </Button>
// //               ))}
// //             </div>

// //             {/* Auth Buttons - Desktop */}
// //             <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
// //               {!user ? (
// //                 <>
// //                   {/* Sign In Dropdown */}
// //                   <DropdownMenu>
// //                     <DropdownMenuTrigger asChild>
// //                       <Button 
// //                         variant="outline" 
// //                         className="flex items-center gap-1 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
// //                       >
// //                         Sign In
// //                         <ChevronDown size={16} />
// //                       </Button>
// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent align="end">
// //                       <DropdownMenuItem onClick={() => handleNavigation("/login/patient")}>
// //                         Patient Login
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem onClick={() => handleNavigation("/login/doctor")}>
// //                         Doctor Login
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem onClick={() => handleNavigation("/login/facility")}>
// //                         Facility Login
// //                       </DropdownMenuItem>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu>

// //                   {/* Register Dropdown */}
// //                   <DropdownMenu>
// //                     <DropdownMenuTrigger asChild>
// //                       <Button 
// //                         className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0"
// //                       >
// //                         Get Started
// //                         <ChevronDown size={16} />
// //                       </Button>
// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent align="end">
// //                       <DropdownMenuItem onClick={() => handleNavigation("/register/patient")}>
// //                         Patient Register
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem onClick={() => handleNavigation("/register/doctor")}>
// //                         Doctor Register
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem onClick={() => handleNavigation("/register/facility")}>
// //                         Facility Register
// //                       </DropdownMenuItem>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Button
// //                     variant="outline"
// //                     onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
// //                     disabled={!userRole}
// //                     className="text-sm lg:text-base border-blue-600 text-blue-600 hover:bg-blue-50"
// //                   >
// //                     Dashboard
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
// //                     className="text-sm lg:text-base border-green-600 text-green-600 hover:bg-green-50"
// //                   >
// //                     Profile
// //                   </Button>
// //                   <Button
// //                     variant="destructive"
// //                     onClick={handleLogout}
// //                     className="text-sm lg:text-base bg-red-600 hover:bg-red-700 text-white"
// //                   >
// //                     Logout
// //                   </Button>
// //                 </>
// //               )}
// //             </div>

// //             {/* Mobile Menu Button */}
// //             <button
// //               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //               className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
// //               aria-label="Toggle menu"
// //             >
// //               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
// //             </button>
// //           </div>

// //           {/* Mobile Menu */}
// //           {mobileMenuOpen && (
// //             <div className="md:hidden border-t py-4 animate-in slide-in-from-top duration-300">
// //               <div className="flex flex-col space-y-3">
// //                 {/* Navigation Links */}
// //                 {navigationLinks.map((link) => (
// //                   <Button
// //                     key={link.name}
// //                     variant="ghost"
// //                     onClick={(e) => {
// //                       e.preventDefault();
// //                       handleNavigation(link.path);
// //                     }}
// //                     className="flex items-center justify-start gap-3 w-full px-4 py-2 text-base hover:bg-blue-50"
// //                   >
// //                     <span className="text-blue-600">{link.icon}</span>
// //                     <span>{link.name}</span>
// //                   </Button>
// //                 ))}

// //                 <div className="border-t my-2"></div>

// //                 {/* Auth Buttons - Mobile */}
// //                 {!user ? (
// //                   <>
// //                     <div className="px-4 py-2">
// //                       <p className="text-sm font-semibold text-gray-500 mb-2">Sign In As</p>
// //                       <div className="space-y-2">
// //                         <Button
// //                           variant="outline"
// //                           onClick={() => handleNavigation("/login/patient")}
// //                           className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50"
// //                         >
// //                           Patient Login
// //                         </Button>
// //                         <Button
// //                           variant="outline"
// //                           onClick={() => handleNavigation("/login/doctor")}
// //                           className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50"
// //                         >
// //                           Doctor Login
// //                         </Button>
// //                         <Button
// //                           variant="outline"
// //                           onClick={() => handleNavigation("/login/facility")}
// //                           className="w-full justify-start border-purple-600 text-purple-600 hover:bg-purple-50"
// //                         >
// //                           Facility Login
// //                         </Button>
// //                       </div>
// //                     </div>

// //                     <div className="px-4 py-2">
// //                       <p className="text-sm font-semibold text-gray-500 mb-2">Register As</p>
// //                       <div className="space-y-2">
// //                         <Button
// //                           className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0"
// //                           onClick={() => handleNavigation("/register/patient")}
// //                         >
// //                           Patient Register
// //                         </Button>
// //                         <Button
// //                           className="w-full justify-start bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 border-0"
// //                           onClick={() => handleNavigation("/register/doctor")}
// //                         >
// //                           Doctor Register
// //                         </Button>
// //                         <Button
// //                           className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-0"
// //                           onClick={() => handleNavigation("/register/facility")}
// //                         >
// //                           Facility Register
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </>
// //                 ) : (
// //                   <div className="px-4 space-y-2">
// //                     <Button
// //                       variant="outline"
// //                       onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
// //                       className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50"
// //                       disabled={!userRole}
// //                     >
// //                       Dashboard
// //                     </Button>
// //                     <Button
// //                       variant="outline"
// //                       onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
// //                       className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50"
// //                     >
// //                       Profile
// //                     </Button>
// //                     <Button
// //                       variant="destructive"
// //                       onClick={handleLogout}
// //                       className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
// //                     >
// //                       Logout
// //                     </Button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Header;

// import { HeartPulse, LogIn, Menu, UserPlus, X, Home, Info, Stethoscope, Building2, Bed, Calendar, ChevronDown, User } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import type { User as SupabaseUser } from "@supabase/supabase-js";
// import { supabase } from "@/integrations/supabase/client";
// import logoheader from "@/image/pmhs_logo_small.png";

// const Header = () => {
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" |"staff"| null>(null);

//   const checkUser = async () => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       const currentUser = session?.user || null;
//       setUser(currentUser);

//       if (currentUser) {
//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("id, role, user_id, first_name, last_name, email")
//           .eq("user_id", currentUser.id)
//           .maybeSingle();

//         if (profile) {
//           if (profile.role === "hospital_admin") {
//             setUserRole("facility");
//           } else if (profile.role === "hospital_staff") {
//             setUserRole("staff");
//           }
//           else {
//             setUserRole(profile.role || null);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkUser();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       const currentUser = session?.user || null;
//       setUser(currentUser);
      
//       if (currentUser) {
//         const fetchUserRole = async () => {
//           const { data: profile } = await supabase
//             .from("profiles")
//             .select("role")
//             .eq("user_id", currentUser.id)
//             .maybeSingle();

//           if (profile) {
//             if (profile.role === "hospital_admin") {
//               setUserRole("facility");
//             } else {
//               setUserRole(profile.role || null);
//             }
//           }
//         };
//         fetchUserRole();
//       } else {
//         setUserRole(null);
//       }
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     const checkRole = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) return;

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("id, role, user_id, first_name, last_name, email")
//         .eq("user_id", session.user.id)
//         .maybeSingle();

//       if (profile) {
//         if (profile.role === "patient") {
//           const { data: patient } = await supabase
//             .from("patients")
//             .select("id")
//             .eq("user_id", session.user.id)
//             .maybeSingle();
//           if (!patient) console.log("Patient profile incomplete");
//         } else if (profile.role === "doctor") {
//           const { data: doctor } = await supabase
//             .from("medical_professionals")
//             .select("id")
//             .eq("user_id", session.user.id)
//             .maybeSingle();
//           if (!doctor) console.log("Doctor profile incomplete");
//         } else if (profile.role === "facility" || profile.role === "hospital_admin") {
//           const { data: facility } = await supabase
//             .from("facilities")
//             .select("id")
//             .eq("admin_user_id", session.user.id)
//             .maybeSingle();
//           if (!facility) console.log("Facility profile incomplete");
//         }
//       }
//     };

//     if (user) checkRole();
//   }, [user, navigate]);

//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setUserRole(null);
//       setMobileMenuOpen(false);
//       navigate("/");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const closeMobileMenu = () => setMobileMenuOpen(false);
//   const handleNavigation = (path: string) => {
//     navigate(path);
//     setMobileMenuOpen(false);
//   };
//   useEffect(() => {
//     if (mobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [mobileMenuOpen]);
//   const navigationLinks = [
//     { name: 'Home', path: '/', icon: <Home size={16} /> },
//     { name: 'About', path: '/about', icon: <User size={16} /> },
//     { name: 'Find Doctors / Specialists', path: '/appointment/doctors', icon: <Stethoscope size={16} /> },
//     { name: 'Find Facility / Services', path: '/appointment/hospitals', icon: <Building2 size={16} /> },
//     { name: 'Find Beds', path: '/appointment/beds', icon: <Calendar size={16} /> },
//   ];

//   return (
//     <div className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container mx-auto px-3 sm:px-4 lg:px-6">
//           <div className="flex h-16 sm:h-20 items-center justify-between">
//             {/* Logo - responsive sizes */}
//             <Link 
//               to="/" 
//               className="flex items-center space-x-2 hover:opacity-80 transition-opacity" 
//               onClick={closeMobileMenu}
//             >
//              <img
//   src={logoheader}
//   alt="PMHS Smart Health"
//   className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 object-contain"
// />
//               {/* <span className="text-sm sm:text-base md:text-lg font-bold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
//                 PMHS Smart Health
//               </span> */}
//             </Link>

//             {/* Desktop Navigation - hidden on mobile, visible from md up */}
//             <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
//               {navigationLinks.map((link) => (
//                 <Button
//                   key={link.name}
//                   variant="ghost"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleNavigation(link.path);
//                   }}
//                   className="flex items-center gap-1 px-2 lg:px-3 text-xs lg:text-sm xl:text-base hover:bg-blue-50 hover:text-blue-600 transition-all"
//                 >
//                   <span className="text-blue-600">{link.icon}</span>
//                   <span className="whitespace-nowrap">{link.name}</span>
//                 </Button>
//               ))}
//             </div>

//             {/* Desktop Auth Buttons - visible from md up */}
//             <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
//               {!user ? (
//                 <>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         variant="outline" 
//                         className="flex items-center gap-1 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2"
//                       >
//                         Sign In
//                         <ChevronDown size={14} />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleNavigation("/login/patient")} className="text-xs">
//                         Patient Login
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleNavigation("/login/doctor")} className="text-xs">
//                         Doctor Login
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleNavigation("/login/facility")} className="text-xs">
//                         Facility Login
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2"
//                       >
//                         Get Started
//                         <ChevronDown size={14} />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleNavigation("/register/patient")} className="text-xs">
//                         Patient Register
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleNavigation("/register/doctor")} className="text-xs">
//                         Doctor Register
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleNavigation("/register/facility")} className="text-xs">
//                         Facility Register
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
//                     disabled={!userRole}
//                     className="text-xs lg:text-sm border-blue-600 text-blue-600 hover:bg-blue-50 px-2 lg:px-3 py-1 lg:py-2"
//                   >
//                     Dashboard
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
//                     className="text-xs lg:text-sm border-green-600 text-green-600 hover:bg-green-50 px-2 lg:px-3 py-1 lg:py-2"
//                   >
//                     Profile
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     onClick={handleLogout}
//                     className="text-xs lg:text-sm bg-red-600 hover:bg-red-700 text-white px-2 lg:px-3 py-1 lg:py-2"
//                   >
//                     Logout
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Mobile Menu Button - visible only on small screens */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
//               aria-label="Toggle menu"
//             >
//               {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>

//           {/* Mobile Menu (slide-in) - visible only when open */}
//           {mobileMenuOpen && (
//            <div className="md:hidden border-t py-3 animate-in slide-in-from-top duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
//           <div className="flex flex-col space-y-2">
//                 {navigationLinks.map((link) => (
//                   <Button
//                     key={link.name}
//                     variant="ghost"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleNavigation(link.path);
//                     }}
//                     className="flex items-center justify-start gap-3 w-full px-3 py-1.5 text-sm hover:bg-blue-50"
//                   >
//                     <span className="text-blue-600">{link.icon}</span>
//                     <span>{link.name}</span>
//                   </Button>
//                 ))}

//                 <div className="border-t my-2"></div>

//                 {!user ? (
//                   <>
//                     <div className="px-3 py-1">
//                       <p className="text-xs font-semibold text-gray-500 mb-1">Sign In As</p>
//                       <div className="space-y-1.5">
//                         <Button
//                           variant="outline"
//                           onClick={() => handleNavigation("/login/patient")}
//                           className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-1"
//                         >
//                           Patient Login
//                         </Button>
//                         <Button
//                           variant="outline"
//                           onClick={() => handleNavigation("/login/doctor")}
//                           className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50 text-sm py-1"
//                         >
//                           Doctor Login
//                         </Button>
//                         <Button
//                           variant="outline"
//                           onClick={() => handleNavigation("/login/facility")}
//                           className="w-full justify-start border-purple-600 text-purple-600 hover:bg-purple-50 text-sm py-1"
//                         >
//                           Facility Login
//                         </Button>
//                       </div>
//                     </div>

//                     <div className="px-3 py-1">
//                       <p className="text-xs font-semibold text-gray-500 mb-1">Register As</p>
//                       <div className="space-y-1.5">
//                         <Button
//                           className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 text-sm py-1"
//                           onClick={() => handleNavigation("/register/patient")}
//                         >
//                           Patient Register
//                         </Button>
//                         <Button
//                           className="w-full justify-start bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 border-0 text-sm py-1"
//                           onClick={() => handleNavigation("/register/doctor")}
//                         >
//                           Doctor Register
//                         </Button>
//                         <Button
//                           className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-0 text-sm py-1"
//                           onClick={() => handleNavigation("/register/facility")}
//                         >
//                           Facility Register
//                         </Button>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="px-3 space-y-1.5">
//                     <Button
//                       variant="outline"
//                       onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
//                       className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-1"
//                       disabled={!userRole}
//                     >
//                       Dashboard
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
//                       className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50 text-sm py-1"
//                     >
//                       Profile
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={handleLogout}
//                       className="w-full justify-start bg-red-600 hover:bg-red-700 text-white text-sm py-1"
//                     >
//                       Logout
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Header;

import { HeartPulse, LogIn, Menu, UserPlus, X, Home, Info, Stethoscope, Building2, Bed, Calendar, ChevronDown, User, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import logoheader from "@/image/pmhs_logo_small.png";

const Header = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" |"staff"| null>(null);
  const [facilitySubmenuOpen, setFacilitySubmenuOpen] = useState(false); // for mobile

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role, user_id, first_name, last_name, email")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (profile) {
          if (profile.role === "hospital_admin") {
            setUserRole("facility");
          } else if (profile.role === "hospital_staff") {
            setUserRole("staff");
          }
          else {
            setUserRole(profile.role || null);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        const fetchUserRole = async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (profile) {
            if (profile.role === "hospital_admin") {
              setUserRole("facility");
            } else {
              setUserRole(profile.role || null);
            }
          }
        };
        fetchUserRole();
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role, user_id, first_name, last_name, email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        if (profile.role === "patient") {
          const { data: patient } = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (!patient) console.log("Patient profile incomplete");
        } else if (profile.role === "doctor") {
          const { data: doctor } = await supabase
            .from("medical_professionals")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (!doctor) console.log("Doctor profile incomplete");
        } else if (profile.role === "facility" || profile.role === "hospital_admin") {
          const { data: facility } = await supabase
            .from("facilities")
            .select("id")
            .eq("admin_user_id", session.user.id)
            .maybeSingle();
          if (!facility) console.log("Facility profile incomplete");
        }
      }
    };

    if (user) checkRole();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setFacilitySubmenuOpen(false);
  };
  
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navigationLinks = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'About', path: '/about', icon: <User size={16} /> },
    { name: 'Find Doctors / Specialists', path: '/appointment/doctors', icon: <Stethoscope size={16} /> },
    { name: 'Find Facility / Services', path: '/appointment/hospitals', icon: <Building2 size={16} /> },
    { name: 'Find Beds', path: '/appointment/beds', icon: <Calendar size={16} /> },
  ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity" 
              onClick={closeMobileMenu}
            >
              <img
                src={logoheader}
                alt="PMHS Smart Health"
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
              {navigationLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(link.path);
                  }}
                  className="flex items-center gap-1 px-2 lg:px-3 text-xs lg:text-sm xl:text-base hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <span className="text-blue-600">{link.icon}</span>
                  <span className="whitespace-nowrap">{link.name}</span>
                </Button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {!user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2"
                      >
                        Sign In
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleNavigation("/login/patient")} className="text-xs">
                        Patient Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/login/doctor")} className="text-xs">
                        Doctor Login
                      </DropdownMenuItem>
                      
                      {/* Facility Login Submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-xs">
                          Facility Login
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem 
                            onClick={() => handleNavigation("/login/facility-admin")}
                            className="text-xs text-purple-700 hover:bg-purple-50"
                          >
                            <span className="font-medium">Admin Login</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleNavigation("/login/facility-staff")}
                            className="text-xs text-pink-700 hover:bg-pink-50"
                          >
                            <span className="font-medium">Staff Login</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2"
                      >
                        Get Started
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleNavigation("/register/patient")} className="text-xs">
                        Patient Register
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/register/doctor")} className="text-xs">
                        Doctor Register
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/register/facility")} className="text-xs">
                        Facility Register
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
                    disabled={!userRole}
                    className="text-xs lg:text-sm border-blue-600 text-blue-600 hover:bg-blue-50 px-2 lg:px-3 py-1 lg:py-2"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
                    className="text-xs lg:text-sm border-green-600 text-green-600 hover:bg-green-50 px-2 lg:px-3 py-1 lg:py-2"
                  >
                    Profile
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="text-xs lg:text-sm bg-red-600 hover:bg-red-700 text-white px-2 lg:px-3 py-1 lg:py-2"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-3 animate-in slide-in-from-top duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col space-y-2">
                {navigationLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(link.path);
                    }}
                    className="flex items-center justify-start gap-3 w-full px-3 py-1.5 text-sm hover:bg-blue-50"
                  >
                    <span className="text-blue-600">{link.icon}</span>
                    <span>{link.name}</span>
                  </Button>
                ))}

                <div className="border-t my-2"></div>

                {!user ? (
                  <>
                    <div className="px-3 py-1">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Sign In As</p>
                      <div className="space-y-1.5">
                        <Button
                          variant="outline"
                          onClick={() => handleNavigation("/login/patient")}
                          className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-1"
                        >
                          Patient Login
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleNavigation("/login/doctor")}
                          className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50 text-sm py-1"
                        >
                          Doctor Login
                        </Button>
                        
                        {/* Mobile Facility Login submenu (collapsible) */}
                        <div className="border rounded-md">
                          <button
                            onClick={() => setFacilitySubmenuOpen(!facilitySubmenuOpen)}
                            className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50"
                          >
                            <span>Facility Login</span>
                            <ChevronRight size={14} className={`transform transition-transform ${facilitySubmenuOpen ? 'rotate-90' : ''}`} />
                          </button>
                          {facilitySubmenuOpen && (
                            <div className="pl-4 pb-1 space-y-1">
                              <Button
                                variant="ghost"
                                onClick={() => handleNavigation("/login/facility-admin")}
                                className="w-full justify-start text-purple-700 hover:bg-purple-50 text-sm py-1"
                              >
                                Admin Login
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleNavigation("/login/facility-staff")}
                                className="w-full justify-start text-pink-700 hover:bg-pink-50 text-sm py-1"
                              >
                                Staff Login
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-1">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Register As</p>
                      <div className="space-y-1.5">
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 text-sm py-1"
                          onClick={() => handleNavigation("/register/patient")}
                        >
                          Patient Register
                        </Button>
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 border-0 text-sm py-1"
                          onClick={() => handleNavigation("/register/doctor")}
                        >
                          Doctor Register
                        </Button>
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-0 text-sm py-1"
                          onClick={() => handleNavigation("/register/facility")}
                        >
                          Facility Register
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-3 space-y-1.5">
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}` : "/")}
                      className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-1"
                      disabled={!userRole}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation(userRole ? `/dashboard/${userRole}/profile` : "/")}
                      className="w-full justify-start border-green-600 text-green-600 hover:bg-green-50 text-sm py-1"
                    >
                      Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full justify-start bg-red-600 hover:bg-red-700 text-white text-sm py-1"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;