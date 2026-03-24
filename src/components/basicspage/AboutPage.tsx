import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Building,
  ArrowLeft,
  Shield,
  UserPlus,
  Home,
  User,
  X,
  Lock,
  Laptop,
  Users,
  GraduationCap,
  Menu,
  LogOut,
  UserIcon,
  Calendar,
  Bed,
  Hospital,
  Stethoscope,
  Ambulance,
  HeartPulse,
  Syringe,
  Pill,
  Microscope,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import logo from "@/image/About page.png";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

const AboutPage = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      toast({ title: "Signed Out", description: "You have been signed out." });
      navigate("/");
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  return (
    <>
   
    <div className="space-y-6">
      {/* Header with Sheet component wrapping mobile menu */}
      <Header/>

      {/* Page content remains the same */}
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Hospital className="h-6 w-6 text-blue-600" />
              About cloudhospitals.ai
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
              <strong className="bold">cloudhospitals.ai</strong> is a revolutionary digital healthcare platform 
              founded in 2023, designed to bridge the gap between patients and healthcare providers. 
              Our mission is to make quality healthcare accessible to everyone through seamless digital 
              solutions for appointment booking and bed management.
            </p>
            <p className="text-gray-700 mt-4 text-sm md:text-base">
              With a network of over 500+ hospitals and 2000+ healthcare providers across India, 
             cloudhospitals.ai offers a comprehensive platform where patients can easily find and book 
              appointments with doctors, schedule diagnostic tests, and reserve hospital beds - all 
              from the comfort of their homes.
            </p>
            <p className="text-gray-700 mt-4 text-sm md:text-base">
              Our platform integrates real-time availability, instant confirmation, and secure payment 
              processing to ensure a hassle-free experience. Whether you need a routine check-up, 
              emergency care, or planned hospitalization, cloudhospitals.ai connects you with the right 
              healthcare services at the right time.
            </p>
          </div>

          {/* Right Column */}
          <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-blue-600" />
              Our Mission
            </h2>
            <img
              src={logo}
              alt="Healthcare platform mission"
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 text-sm md:text-base">
              Our mission is to revolutionize healthcare access by providing a unified digital platform 
              that simplifies the process of booking appointments and reserving beds. We strive to 
              reduce waiting times, eliminate paperwork, and ensure that every patient receives timely 
              medical attention when they need it most.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Appointment Booking
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Book appointments with top doctors across specialties. 
                Real-time availability, instant confirmation, and reminders.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mt-3 space-y-1 text-sm">
                <li>500+ Specialists</li>
                <li>Same-day appointments</li>
                <li>Video consultations</li>
                <li>Prescription download</li>
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Bed className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Bed Booking
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Reserve hospital beds in advance. Check real-time availability 
                across ICU, general wards, and private rooms.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mt-3 space-y-1 text-sm">
                <li>ICU & Critical Care</li>
                <li>General Wards</li>
                <li>Private Rooms</li>
                <li>Emergency beds</li>
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Microscope className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Diagnostic Tests
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Schedule lab tests and health checkups at NABL accredited 
                laboratories with home sample collection.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mt-3 space-y-1 text-sm">
                <li>100+ Lab tests</li>
                <li>Home collection</li>
                <li>Digital reports</li>
                <li>Health packages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section: Our Team */}
        <div className="max-w-6xl mx-auto mt-8 bg-white p-5 md:p-6 shadow rounded-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6 text-sm md:text-base">
            Meet the experts behind <strong>cloudhospitals.ai</strong> – a unique
            blend of medical professionals, AI engineers, and healthcare technology
            specialists dedicated to transforming patient care.
          </p>

          <div className="space-y-6">
            {/* Team Member 1 */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-blue-700">
                  Dr. Mohammed Ahetasham, M.B.B.S, M.D.R.D
                </h3>
                <p className="text-sm md:text-base font-medium text-gray-800">
                  Founder & Chairman – cloudhospitals.ai
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Dr. Mohammed Ahetasham is a visionary healthcare innovator,
                  accomplished Radiologist, and Founder & Chairman of cloudhospitals.ai. 
                  With over 12 years of experience in the medical industry, he has 
                  been instrumental in advancing the intersection of clinical 
                  excellence and digital healthcare delivery.
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  His career spans extensive clinical practice, academic research, 
                  and leadership in the adoption of emerging technologies such as 
                  AI-powered diagnostics, telemedicine platforms, and digital 
                  healthcare solutions.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-blue-700">
                  Suresh Kannan
                </h3>
                <p className="text-sm md:text-base font-medium text-gray-800">
                  Chief Technology Officer | Healthcare Platforms & Product Delivery
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  An accomplished technology leader with over 25 years of
                  experience in driving innovation across healthcare platforms,
                  software architecture, and large-scale project delivery. Known
                  for successfully leading global teams and delivering intelligent,
                  patient-centric solutions.
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  With deep expertise in cloud infrastructure, healthcare data 
                  security (HIPAA compliance), and real-time booking systems, 
                  this executive has played a critical role in building 
                  cloudhospitals's robust appointment and bed management platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: How It Works */}
        <div className="max-w-6xl mx-auto mt-8 bg-white p-5 md:p-6 shadow rounded-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            How cloudhospitals.ai Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Appointment Booking Process */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Book an Appointment
              </h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm md:text-base">
                <li>Search for doctors by specialty, location, or hospital</li>
                <li>View doctor profiles, availability, and patient reviews</li>
                <li>Select a convenient time slot and confirm booking</li>
                <li>Receive instant confirmation via SMS and email</li>
                <li>Attend consultation (in-person or video)</li>
                <li>Get digital prescription and follow-up reminders</li>
              </ol>
            </div>

            {/* Bed Booking Process */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                <Bed className="h-5 w-5 text-blue-600" />
                Reserve a Hospital Bed
              </h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm md:text-base">
                <li>Search hospitals by location and bed type required</li>
                <li>Check real-time bed availability (ICU, General, Private)</li>
                <li>View estimated costs and insurance acceptance</li>
                <li>Reserve bed with partial payment</li>
                <li>Receive bed allocation confirmation</li>
                <li>Direct hospital admission on arrival</li>
              </ol>
            </div>
          </div>

          <h3 className="text-base md:text-lg font-semibold mt-6">
            Why cloudhospitals.ai Stands Out
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm md:text-base">
            <li><strong>Real-time Availability:</strong> Live updates on doctor slots and bed availability</li>
            <li><strong>Verified Providers:</strong> All hospitals and doctors are thoroughly verified</li>
            <li><strong>Secure Platform:</strong> HIPAA-compliant data protection</li>
            <li><strong>24/7 Support:</strong> Round-the-clock customer assistance</li>
            <li><strong>Insurance Integration:</strong> Check coverage and cashless options</li>
          </ul>

          <h3 className="text-base md:text-lg font-semibold mt-5">
            Key Benefits
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm md:text-base">
            <li><strong>Save Time:</strong> No more waiting in queues or calling multiple hospitals</li>
            <li><strong>Emergency Ready:</strong> Quick bed booking during emergencies</li>
            <li><strong>Compare Options:</strong> Choose based on reviews, distance, and cost</li>
            <li><strong>Digital Records:</strong> All your health records in one place</li>
            <li><strong>Family Account:</strong> Manage bookings for your entire family</li>
          </ul>

          <p className="text-blue-700 font-semibold mt-5 text-sm md:text-base flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            👉 Experience hassle-free healthcare with <strong>cloudhospitals.ai</strong> Today!
          </p>
        </div>
      </div>
      <Footer/>
    </div>
    </>
  );
};

export default AboutPage;