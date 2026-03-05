// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { User, Calendar, Search, Home } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import HeroCarousel from "@/components/carousel/HeroCarousel";
// import PromotionCarousel from "@/components/carousel/PromotionCarousel";
// import SEOHead from "@/components/seo/SEOHead";
// import { organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema } from "@/components/seo/StructuredData";
// import Hometab from "@/pages/Hometab";
// import { useEffect, useState } from "react";
// import type { User as SupabaseUser } from "@supabase/supabase-js";
// import { supabase } from "@/integrations/supabase/client";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [authMode, setAuthMode] = useState<"signin">("signin");
//  const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" | null>(null);

// const checkUser = async () => {
//   try {
//     const {
//       data: { session },
//     } = await supabase.auth.getSession();

//     const currentUser = session?.user || null;
//     setUser(currentUser);

//     if (currentUser) {
//       // Fix: Query by user_id instead of id
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("id, role, user_id, first_name, last_name, email")
//         .eq("user_id", currentUser.id)  // Changed from "id" to "user_id"
//         .maybeSingle();  // Using maybeSingle to avoid errors if no profile exists

//       if (profile) {
//         setUserRole(profile.role || null);
//       }
//     }

//   } catch (error) {
//     console.error(error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   const checkRole = async () => {
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session) {
//       // Fix: Use userRole from state instead of parameter
//       navigate(`/login/${userRole}`);
//       return;
//     }

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("id, role, user_id, first_name, last_name, email")
//       .eq("user_id", session.user.id)  // Changed from "id" to "user_id"
//       .maybeSingle();

//     if (profile) {
//       // Check based on the actual role from database
//       if (profile.role === "patient") {
//         const { data: patient } = await supabase
//           .from("patient")
//           .select("id")
//           .eq("user_id", session.user.id)
//           .maybeSingle();
          
//         if (!patient) {
//           // Patient profile exists but no patient record
//           console.log("Patient profile incomplete");
//         }
//         navigate("/"); 
//       } else if (profile.role === "doctor") {
//         // Check if doctor has a medical_professionals record
//         const { data: doctor } = await supabase
//           .from("medical_professionals")
//           .select("id")
//           .eq("user_id", session.user.id)
//           .maybeSingle();
          
//         if (!doctor) {
//           // Doctor profile exists but no medical_professionals record
//           console.log("Doctor profile incomplete");
//         }
//         navigate("/"); // Redirect to doctor dashboard
//       } else if (profile.role === "facility") {
//         // Check if facility has a facilities record
//         const { data: facility } = await supabase
//           .from("facilities")
//           .select("id")
//           .eq("admin_user_id", session.user.id)  // Note: facilities uses admin_user_id
//           .maybeSingle();
          
//         if (!facility) {
//           console.log("Facility profile incomplete");
//         }
//         navigate("/"); // Redirect to facility dashboard
//       } else {
//         // Unknown role or no role
//         navigate("/");
//       }
//     } else {
//       // No profile found
//       navigate("/complete-profile");
//     }
//   };

//   checkRole();
// }, [userRole]); // Add userRole as dependency if needed



//   const userTypes = [
//     {
//       title: "Patients",
//       description: "Book appointments, access medical records, and manage your health journey",
//       icon: User,
//       variant: "patient" as const,
//       features: ["Book Appointments", "Digital Medical Records", "Health Timeline", "Emergency SOS"]
//     },
//     {
//       title: "Medical Professionals", 
//       description: "Manage your practice, access patient records, and provide teleconsultations",
//       icon: User,
//       variant: "doctor" as const,
//       features: ["Patient Management", "e-Prescriptions", "Teleconsultation", "Revenue Dashboard"]
//     },
//     {
//       title: "Medical Facilities",
//       description: "Streamline operations, manage departments, and track facility analytics",
//       icon: Calendar,
//       variant: "facility" as const,
//       features: ["Department Management", "Staff Scheduling", "Analytics Dashboard", "Invoice Generation"]
//     }
//   ];

//   return (
//     <>
//       <SEOHead 
//         title="NextGen Medical Platform - AI-Enhanced Healthcare Ecosystem"
//         description="AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities in one powerful platform."
//         keywords="medical platform, healthcare, AI medical, telemedicine, patient portal, doctor portal, medical records, appointments, HIPAA compliance, multilingual healthcare"
//         jsonLd={[organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema]}
//       />
      
//       <div className="min-h-screen bg-background">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <img
//               src="/favicon.svg"
//               alt="NextGen Medical"
//               className="h-8 w-8 rounded-md object-contain mt-1"
//             />
//             <span className="text-xl font-bold">NextGen Medical</span>
//           </div>
//           {/* <div className="flex items-center space-x-4">
//             <Button variant="ghost" onClick={() => {
//                 document.getElementById('user-types')?.scrollIntoView({ behavior: 'smooth' });
//               }}>Sign In 
//             </Button>
//             <Button variant="hero">Get Started</Button>
//           </div> */}
//           <div className="flex items-center space-x-4">

//   {!user ? (
//     <>
//       <Button variant="ghost" onClick={() => navigate("/login")}>
//         Sign In
//       </Button>

//       <Button variant="hero" onClick={() => navigate("/register")}>
//         Get Started
//       </Button>
//     </>
//   ) : (
//     <>
//       <Button
//         variant="ghost"
//         onClick={() => navigate(`/dashboard/${userRole}`)}
//       >
//         Dashboard
//       </Button>

//       <Button
//         variant="ghost"
//         onClick={() => navigate(`/profile/${userRole}`)}
//       >
//         Profile
//       </Button>

//       <Button
//         variant="destructive"
//         onClick={async () => {
//           await supabase.auth.signOut();
//           setUser(null);
//           setUserRole(null);
//           navigate("/");
//         }}
//       >
//         Logout
//       </Button>
//     </>
//   )}

// </div>
//         </div>
//       </nav>

//       {/* Smart Hero Carousel */}
//       <HeroCarousel />

//       {/* User Types Section */}
//       <section className="py-20 bg-muted/30" id="user-types">
//         <div className="container">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Choose Your Portal</h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Access specialized features designed for your role in the healthcare ecosystem
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
//             {userTypes.map((userType, index) => {
//               const IconComponent = userType.icon;
//               return (
//                 <Card key={index} variant={userType.variant} className="group cursor-pointer h-full">
//                   <CardHeader className="text-center">
//                     <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-${userType.variant}`}>
//                       <IconComponent className="h-8 w-8 text-white" />
//                     </div>
//                     <CardTitle className="text-xl mb-2">{userType.title}</CardTitle>
//                     <CardDescription className="text-center">
//                       {userType.description}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       {userType.features.map((feature, featureIndex) => (
//                         <li key={featureIndex} className="flex items-center text-sm">
//                           <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                     {/* <Button 
//                       variant={userType.variant} 
//                       className="w-full mt-6 group-hover:scale-105 transition-transform"
//                       onClick={() => navigate(`/register/${userType.variant}`)}
//                     >
//                       Access Portal
//                     </Button> */}
//                     {!user ? (

//   <Button
//     variant={userType.variant}
//     className="w-full mt-6"
//     onClick={() => navigate(`/register/${userType.variant}`)}
//   >
//     Access Portal
//   </Button>

// ) : userRole === userType.variant ? (

//   <Button
//     variant="hero"
//     className="w-full mt-6"
//     onClick={() => navigate(`/dashboard/${userRole}`)}
//   >
//     Go to Dashboard
//   </Button>

// ) : (

//   <Button
//     variant="secondary"
//     className="w-full mt-6 cursor-not-allowed opacity-50"
//     disabled
//   >
//     Access Restricted
//   </Button>

// )}
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Promotions Carousel */}
//       <section className="py-16 bg-muted/30">
//         <div className="container">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">Featured Healthcare Solutions</h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Discover our latest innovations in digital healthcare technology
//             </p>
//           </div>
//           <PromotionCarousel />
//         </div>
//       </section>
//       <div className="container">
//         <Hometab />
//       </div>

//       {/* Features Section */}
//       <section className="py-20">
//         <div className="container">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Advanced Healthcare Technology</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               Powered by AI, built for compliance, designed for the future of healthcare
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             <Card variant="elevated" className="hover-scale">
//               <CardHeader>
//                 <CardTitle className="text-xl mb-2">AI-Powered Features</CardTitle>
//                 <CardDescription>
//                   Smart scheduling, diagnostic assistance, and automated workflows powered by advanced machine learning
//                 </CardDescription>
//               </CardHeader>
//             </Card>
            
//             <Card variant="elevated" className="hover-scale">
//               <CardHeader>
//                 <CardTitle className="text-xl mb-2">Compliance Ready</CardTitle>
//                 <CardDescription>
//                   HIPAA, MOH-UAE, NABH compliant with full audit trails and data encryption
//                 </CardDescription>
//               </CardHeader>
//             </Card>
            
//             <Card variant="elevated" className="hover-scale">
//               <CardHeader>
//                 <CardTitle className="text-xl mb-2">Multilingual Support</CardTitle>
//                 <CardDescription>
//                   Real-time translation and voice assistance in 50+ languages for better accessibility
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t py-12 bg-muted/30">
//         <div className="container">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
//               <span className="text-xl font-bold">NextGen Medical</span>
//             </div>
//             <p className="text-muted-foreground text-center md:text-right">
//               © 2024 NextGen Medical Platform. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//       </div>
//     </>
//   );
// };

// export default LandingPage;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/carousel/HeroCarousel";
import PromotionCarousel from "@/components/carousel/PromotionCarousel";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema } from "@/components/seo/StructuredData";
import Hometab from "@/pages/Hometab";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Footer from "@/pages/alldetails/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"signin">("signin");
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" | null>(null);

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
          setUserRole(profile.role || null);
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Check user on mount and set up auth listener
  useEffect(() => {
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Use an async function inside the callback
        const fetchUserRole = async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", currentUser.id)
            .maybeSingle();

          // if (profile) {
          //   setUserRole(profile.role);
          // }
          if (profile) {

  // ✅ ADD THIS CONDITION ONLY
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

      if (!session) {
        // If no session, don't redirect - this should only run when user is logged in
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role, user_id, first_name, last_name, email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        // Check based on the actual role from database
        if (profile.role === "patient") {
          const { data: patient } = await supabase
            .from("patient")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();
            
          if (!patient) {
            // Patient profile exists but no patient record
            console.log("Patient profile incomplete");
          } // Fixed: Navigate to patient dashboard
        } else if (profile.role === "doctor") {
          // Check if doctor has a medical_professionals record
          const { data: doctor } = await supabase
            .from("medical_professionals")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();
            
          if (!doctor) {
            // Doctor profile exists but no medical_professionals record
            console.log("Doctor profile incomplete");
          } // Fixed: Navigate to doctor dashboard
        } else if (profile.role === "facility") {
          // Check if facility has a facilities record
          const { data: facility } = await supabase
            .from("facilities")
            .select("id")
            .eq("admin_user_id", session.user.id)
            .maybeSingle();
            
          if (!facility) {
            console.log("Facility profile incomplete");
          }// Fixed: Navigate to facility dashboard
        } else {
          // Unknown role or no role
          navigate("/");
        }
      } else {
        // No profile found
        navigate("/");
      }
    };

    // Only run checkRole if user exists
    if (user) {
      checkRole();
    }
  }, [user, navigate]); // Fixed: Added proper dependencies

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const userTypes = [
    {
      title: "Patients",
      description: "Book appointments, access medical records, and manage your health journey",
      icon: User,
      variant: "patient" as const,
      features: ["Book Appointments", "Digital Medical Records", "Health Timeline", "Emergency SOS"]
    },
    {
      title: "Medical Professionals", 
      description: "Manage your practice, access patient records, and provide teleconsultations",
      icon: User,
      variant: "doctor" as const,
      features: ["Patient Management", "e-Prescriptions", "Teleconsultation", "Revenue Dashboard"]
    },
    {
      title: "Medical Facilities",
      description: "Streamline operations, manage departments, and track facility analytics",
      icon: Calendar,
      variant: "facility" as const,
      features: ["Department Management", "Staff Scheduling", "Analytics Dashboard", "Invoice Generation"]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="NextGen Medical Platform - AI-Enhanced Healthcare Ecosystem"
        description="AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities in one powerful platform."
        keywords="medical platform, healthcare, AI medical, telemedicine, patient portal, doctor portal, medical records, appointments, HIPAA compliance, multilingual healthcare"
        jsonLd={[organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema]}
      />
      
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/favicon.svg"
                alt="NextGen Medical"
                className="h-8 w-8 rounded-md object-contain mt-1"
              />
              <span className="text-xl font-bold">NextGen Medical</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                // <>
                //   <Button variant="ghost" onClick={() => navigate("/login")}>
                //     Sign In
                //   </Button>
                //   <Button variant="hero" onClick={() => navigate("/register")}>
                //     Get Started
                //   </Button>
                // </>

<>
  {/* Sign In Dropdown */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost">
        Sign In
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => navigate("/login/patient")}>
        Patient Login
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => navigate("/login/doctor")}>
        Doctor Login
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => navigate("/login/facility")}>
        Facility Login
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>


  {/* Register Dropdown */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="hero">
        Get Started
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => navigate("/register/patient")}>
        Patient Register
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => navigate("/register/doctor")}>
        Doctor Register
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => navigate("/register/facility")}>
        Facility Register
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(userRole ? `/dashboard/${userRole}` : "/")}
                    disabled={!userRole}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(userRole ? `/dashboard/${userRole}/profile` : "/")}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Smart Hero Carousel */}
        <HeroCarousel />

        {/* User Types Section */}
        <section className="py-20 bg-muted/30" id="user-types">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Portal</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access specialized features designed for your role in the healthcare ecosystem
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {userTypes.map((userType, index) => {
                const IconComponent = userType.icon;
                return (
                  <Card key={index} variant={userType.variant} className="group cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-${userType.variant}`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-2">{userType.title}</CardTitle>
                      <CardDescription className="text-center">
                        {userType.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {userType.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      {!user ? (
                        <Button
                          variant={userType.variant}
                          className="w-full mt-6"
                          onClick={() => navigate(`/register/${userType.variant}`)} // Fixed: Removed role from path
                        >
                          Access Portal
                        </Button>
                      ) : userRole === userType.variant ? (
                        <Button
                          variant="hero"
                          className="w-full mt-6"
                          onClick={() => navigate(`/dashboard/${userRole}`)}
                        >
                          Go to Dashboard
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          className="w-full mt-6 cursor-not-allowed opacity-50"
                          disabled
                        >
                          Access Restricted
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Promotions Carousel */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Healthcare Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our latest innovations in digital healthcare technology
              </p>
            </div>
            <PromotionCarousel />
          </div>
        </section>
        
        <div className="container">
          <Hometab />
        </div>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Advanced Healthcare Technology</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Powered by AI, built for compliance, designed for the future of healthcare
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card variant="elevated" className="hover-scale">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">AI-Powered Features</CardTitle>
                  <CardDescription>
                    Smart scheduling, diagnostic assistance, and automated workflows powered by advanced machine learning
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card variant="elevated" className="hover-scale">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">Compliance Ready</CardTitle>
                  <CardDescription>
                    HIPAA, MOH-UAE, NABH compliant with full audit trails and data encryption
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card variant="elevated" className="hover-scale">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">Multilingual Support</CardTitle>
                  <CardDescription>
                    Real-time translation and voice assistance in 50+ languages for better accessibility
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        {/* <footer className="border-t py-12 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
                <span className="text-xl font-bold">NextGen Medical</span>
              </div>
              <p className="text-muted-foreground text-center md:text-right">
                © 2024 NextGen Medical Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer> */}
        <Footer/>
      </div>
    </>
  );
};

export default LandingPage;