import { HeartPulse, LogIn, Menu, UserPlus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    }, [user, navigate]); 
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
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "facility" | null>(null);
  const handleLoginRedirect = (path) => {
    navigate(path || '/login/patient');
  };

  const handleSignupRedirect = () => {
    navigate('/signup/patient');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white shadow-sm sticky-top">
      {/* <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/favicon.svg"
              alt="NextGen Medical"
              className="me-2"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <span className="fw-bold fs-4">NextGen Medical</span>
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`collapse navbar-collapse${mobileMenuOpen ? ' show' : ''}`}> 
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item mx-lg-2">
                <a 
                  className="nav-link text-dark fw-semibold" 
                  href="#doctors"
                  onClick={closeMobileMenu}
                >
                  Doctors
                </a>
              </li>
              <li className="nav-item mx-lg-2">
                <a 
                  className="nav-link text-dark fw-semibold" 
                  href="#hospitals"
                  onClick={closeMobileMenu}
                >
                  Hospitals
                </a>
              </li>
              <li className="nav-item mx-lg-2">
                <a 
                  className="nav-link text-dark fw-semibold" 
                  href="#beds"
                  onClick={closeMobileMenu}
                >
                  Bed Availability
                </a>
              </li>
              <li className="nav-item mx-lg-2">
                <a 
                  className="nav-link text-dark fw-semibold" 
                  href="#services"
                  onClick={closeMobileMenu}
                >
                  Services
                </a>
              </li>
              <li className="nav-item mx-lg-2">
                <a 
                  className="nav-link text-dark fw-semibold" 
                  href="#contact"
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2 px-4"
                onClick={() => {
                  handleLoginRedirect('/login/patient');
                  closeMobileMenu();
                }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-4"
                onClick={() => {
                  handleSignupRedirect();
                  closeMobileMenu();
                }}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </nav> */}
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
    </div>
  );
};

export default Header;