// DoctorHospitals.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  BedDouble,
  Stethoscope,
  ArrowLeft,
  Share2,
  Bookmark,
  AlertCircle,
  CheckCircle,
  XCircle,
  Ambulance,
  Microscope,
  HeartPulse,
  Syringe,
  Pill,
  Activity,
  UserRound,
  CalendarClock,
  Wallet,
  Languages,
  FileText,
  Info,
  Sparkles,
  ChevronRight,
  Coffee,
  ParkingCircle,
  BookAIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Types
interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location?: string;
  consultationFee: number;
  availability: string;
  hospital?: string;
  image?: string;
  qualifications?: string[];
  languages?: string[];
  about?: string;
  awards?: string[];
  specializations?: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  workExperience?: {
    position: string;
    hospital: string;
    duration: string;
  }[];
  publications?: {
    title: string;
    journal: string;
    year: string;
  }[];
  memberships?: string[];
  telemedicineAvailable?: boolean;
  videoConsultationFee?: number;
  clinicVisits?: {
    day: string;
    time: string;
    location: string;
  }[];
}

interface Facility {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  city: string;
  state: string;
  pincode: number;
  total_beds: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  established_year: number;
  insurance_partners: string;
  about_facility: string;
  website: string;
  contact_number?: string;
  email?: string;
  facilities?: string[];
  accreditations?: string[];
  emergencyServices?: boolean;
  ambulanceAvailable?: boolean;
  parkingAvailable?: boolean;
  operationTheaters?: number;
  icuBeds?: number;
  labServices?: boolean;
  pharmacy?: boolean;
  cafeteria?: boolean;
  visitingHours?: string;
}

interface Department {
  id: string;
  facility_id: string;
  name: string;
  description: string;
  head_doctor_id?: string;
  services?: any;
  equipment?: any;
  bed_capacity?: number;
  available_beds?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DoctorAvailability {
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  location?: string;
}

interface TimeSlot {
  id: string;
  doctor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_available: boolean;
}


interface BookingInfo {
  slot_id: string;
  start_time: string;
  end_time: string;
  booking_date: string;
  doctor_id: string;
  doctor_name: string;
  department_id?: string;
}

const DoctorHospitals = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
  
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState<"doctor" | "hospital" | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [similarDoctors, setSimilarDoctors] = useState<Doctor[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
    const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(0);
      const [confirmOpen, setConfirmOpen] = useState(false);
      const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
      const [notes, setNotes] = useState("");
      const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
   const toggleExpand = async (doctorId: string) => {
    if (expandedDoctorId === doctorId) {
      setExpandedDoctorId(null);
      setSelectedSlot(null);
      setTimeSlots([]);
      setBookings([]);
      setSelectedDay(0);
      return;
    }

    setExpandedDoctorId(doctorId);
    setSelectedSlot(null);
    setTimeSlots([]);
    setBookings([]);
    setSelectedDay(0);
    await fetchTimeSlotsAndBookings(doctorId);
  };
    // Add this ref for the booking section
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fetchDepartmentDoctors = async (departmentId: string) => {
  try {
    // Fetch doctors associated with this department
    const { data: doctorsData, error } = await supabase
      .from("medical_professionals")
      .select(`
        *,
        medical_professionals_user_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("department_id", departmentId);

    if (error) {
      console.error("Error fetching department doctors:", error);
      return;
    }

    if (doctorsData) {
      const mapped = doctorsData.map((item: any) => ({
        id: item.id,
        user_id: item.medical_professionals_user_id_fkey?.user_id || "",
        name: `${item.medical_professionals_user_id_fkey?.first_name || ""} ${
          item.medical_professionals_user_id_fkey?.last_name || ""
        }`.trim() || "Unknown Doctor",
        specialty: item.medical_speciality,
        rating: item.rating || 4.5,
        experience: `${item.years_experience || 10} years`,
        consultationFee: item.consultation_fee || 500,
        availability: "Available",
        image: item.medical_professionals_user_id_fkey?.avatar_url || "",
      }));
      setDepartmentDoctors(mapped);
    }
  } catch (error) {
    console.error("Error in fetchDepartmentDoctors:", error);
  }
};
// const handleViewDepartment = (department: Department) => {
//   setSelectedDepartment(department);
//   fetchDepartmentDoctors(department.id);
//   setDepartmentDialogOpen(true);
// };
const handleViewDepartment = (department: Department) => {
  // Navigate to department details page
  navigate(`/dashboard/patient/department/${createSlug(department.name || "")}/${department.id}`, {
    state: { facility: facility }
  });
};
useEffect(() => {
  // Check state from navigation
  if (location.state?.activeTab) {
    setActiveTab(location.state.activeTab);
  }
}, [location.state]);
   
   const fetchTimeSlotsAndBookings = async (doctorId: string) => {
      try {
        const { data: slotsData, error: slotsError } = await supabase
          .from("time_slots")
          .select("*")
          .eq("doctor_id", doctorId)
          .eq("is_available", true);
  
        if (slotsError) {
          console.error("time_slots fetch error", slotsError);
          setTimeSlots([]);
        } else {
          setTimeSlots(slotsData || []);
        }
  
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("appointments")
          .select("*")
          .eq("doctor_id", doctorId);
  
        if (bookingsError) {
          console.error("bookings fetch error", bookingsError);
          setBookings([]);
        } else {
          setBookings(bookingsData || []);
        }
      } catch (err) {
        console.error("fetchTimeSlotsAndBookings error", err);
        setTimeSlots([]);
        setBookings([]);
      }
    };
     const formatDayLabel = (date: Date, index: number) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDateNumber = (date: Date) => {
    return date.getDate();
  };

  const formatTimePretty = (timeStr: string) => {
    const hh = parseInt(timeStr.slice(0, 2), 10);
    const mm = timeStr.slice(3, 5);
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${hour12}:${mm} ${ampm}`;
  };

  const handleConfirmBooking = async () => {
      if (!bookingInfo) return;
  
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to book an appointment.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
  
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
  
        let payload;
        if (bookingInfo.department_id) {
          const department = departments.find(d => d.id === bookingInfo.department_id);
          const facility_id = department ? department.facility_id : null;
          payload = {
            patient_id: user.id,
            facility_id,
            doctor_id: null,
            department_id: bookingInfo.department_id,
            booking_date: bookingInfo.booking_date,
            time_slot_id: bookingInfo.slot_id,
            notes: notes || null,
          };
        } else {
          payload = {
            patient_id: user.id,
            doctor_id: bookingInfo.doctor_id,
            booking_date: bookingInfo.booking_date,
            time_slot_id: bookingInfo.slot_id,
            notes: notes || null,
          };
        }
        
        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
  
        const result = await response.json();
        
        if (!response.ok) {
          let errorMsg = result.error || "Unable to book appointment";
          
          if (response.status === 401) {
            toast({
              title: "Authentication Failed",
              description: "Your session is invalid. Please log in again.",
              variant: "destructive",
            });
            navigate('/login');
          } else if (errorMsg.includes("No doctors available in this department") ||
              errorMsg.includes("All doctors in this department are booked for this time slot")) {
            toast({
              title: "No Doctors Available",
              description: "No doctors are available in this department for the selected time. Please try another time or department.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
          }
          return;
        }
  
        toast({
          title: "Success",
          description: "Appointment booked successfully!",
        });
        setConfirmOpen(false);
        setNotes("");
        setSelectedSlot(null);
  
        if (expandedDoctorId) {
          await fetchTimeSlotsAndBookings(expandedDoctorId);
        }
      } catch (err: any) {
        console.error("Booking error:", err);
        toast({
          title: "Error",
          description: err?.message || "Unable to book appointment. Please try again.",
          variant: "destructive",
        });
      }
    };
  

  const handleBookNow = (slot: TimeSlot, dateIndex: number, doctor: Doctor) => {
  try {
    console.log("handleBookNow called", { slot, dateIndex, doctor });
    
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dateIndex);

    const bookingData: BookingInfo = {
      slot_id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      booking_date: newDate.toISOString().split("T")[0],
      doctor_id: slot.doctor_id,
      doctor_name: doctor.name,
    };

    console.log("Setting booking info:", bookingData);
    setBookingInfo(bookingData);
    setConfirmOpen(true);
  } catch (error) {
    console.error("Error in handleBookNow:", error);
    toast({
      title: "Error",
      description: "Failed to process booking. Please try again.",
      variant: "destructive",
    });
  }
};
  useEffect(() => {
    if (id) {
      determineEntityTypeAndFetch();
    }
  }, [id]);

  const determineEntityTypeAndFetch = async () => {
    setLoading(true);
    try {
      // Try to fetch as doctor first
      const { data: doctorData, error: doctorError } = await supabase
        .from("medical_professionals")
        .select(`
          *,
          medical_professionals_user_id_fkey (
            first_name,
            last_name,
            avatar_url,
            user_id
          )
        `)
        .eq("id", id)
        .single();

      if (doctorData && !doctorError) {
        setEntityType("doctor");
        await fetchDoctorDetails(doctorData);
      } else {
        // If not a doctor, try as facility
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select("*")
          .eq("id", id)
          .single();

        if (facilityData && !facilityError) {
          setEntityType("hospital");
          await fetchFacilityDetails(facilityData);
        } else {
          toast({
            title: "Not Found",
            description: "The requested doctor or hospital could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard/patient/search");
        }
      }
    } catch (error) {
      console.error("Error determining entity type:", error);
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorData: any) => {
    const fullName = doctorData.medical_professionals_user_id_fkey
      ? `${doctorData.medical_professionals_user_id_fkey.first_name || ""} ${
          doctorData.medical_professionals_user_id_fkey.last_name || ""
        }`.trim()
      : "Unknown Doctor";

    // Fetch doctor's availability
    const { data: availabilityData } = await supabase
      .from("time_slots")
      .select("*")
      .eq("doctor_id", doctorData.id)
      .eq("is_available", true);

    setAvailability(availabilityData || []);

    // Mock additional doctor data (in real app, fetch from separate tables)
    const mockDoctor: Doctor = {
      id: doctorData.id,
      user_id: doctorData.medical_professionals_user_id_fkey?.user_id || "",
      name: fullName,
      specialty: doctorData.medical_speciality,
      rating: doctorData.rating || 4.5,
      experience: doctorData.years_experience ? `${doctorData.years_experience} years` : "15+ years",
      consultationFee: doctorData.consultation_fee || 500,
      availability: availabilityData?.length ? "Available Today" : "Next Available: Tomorrow",
      hospital: doctorData.medical_school || "City General Hospital",
      location: doctorData.about_yourself || "Mumbai, Maharashtra",
      image: doctorData.medical_professionals_user_id_fkey?.avatar_url || "",
      qualifications: ["MBBS", "MD - Internal Medicine", "DM - Cardiology"],
      languages: ["English", "Hindi", "Marathi"],
      about: "Dr. Sharma is a highly experienced cardiologist with over 15 years of clinical practice. He specializes in interventional cardiology and has performed over 1000 successful angioplasties.",
      specializations: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology"],
      education: [
        { degree: "DM - Cardiology", institution: "AIIMS, Delhi", year: "2010" },
        { degree: "MD - Internal Medicine", institution: "KEM Hospital, Mumbai", year: "2005" },
        { degree: "MBBS", institution: "Grant Medical College, Mumbai", year: "2002" },
      ],
      workExperience: [
        { position: "Senior Consultant Cardiologist", hospital: "City General Hospital", duration: "2015 - Present" },
        { position: "Consultant Cardiologist", hospital: "Apollo Hospitals", duration: "2010 - 2015" },
      ],
      publications: [
        { title: "Advances in Interventional Cardiology", journal: "Indian Heart Journal", year: "2023" },
        { title: "Prevention of Heart Disease in Asian Population", journal: "Journal of Cardiology", year: "2021" },
      ],
      memberships: ["Cardiological Society of India", "American College of Cardiology", "European Society of Cardiology"],
      telemedicineAvailable: true,
      videoConsultationFee: 400,
      clinicVisits: [
        { day: "Monday - Wednesday", time: "10:00 AM - 2:00 PM", location: "City General Hospital" },
        { day: "Thursday - Saturday", time: "4:00 PM - 8:00 PM", location: "Heart Care Clinic" },
      ],
    };

    setDoctor(mockDoctor);

    // Fetch similar doctors
    const { data: similarData } = await supabase
      .from("medical_professionals")
      .select(`
        *,
        medical_professionals_user_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("medical_speciality", doctorData.medical_speciality)
      .neq("id", doctorData.id)
      .limit(3);

    if (similarData) {
      const mapped = similarData.map((item: any) => ({
        id: item.id,
        user_id: item.medical_professionals_user_id_fkey?.user_id || "",
        name: `${item.medical_professionals_user_id_fkey?.first_name || ""} ${
          item.medical_professionals_user_id_fkey?.last_name || ""
        }`.trim() || "Unknown Doctor",
        specialty: item.medical_speciality,
        rating: item.rating || 4.5,
        experience: `${item.years_experience || 10} years`,
        consultationFee: item.consultation_fee || 500,
        availability: "Available",
        image: item.medical_professionals_user_id_fkey?.avatar_url || "",
      }));
      setSimilarDoctors(mapped);
    }
  };

  const fetchFacilityDetails = async (facilityData: any) => {
    // Fetch departments
    const { data: departmentsData } = await supabase
      .from("departments")
      .select("*")
      .eq("facility_id", facilityData.id);

    setDepartments(departmentsData || []);

    // Fetch doctors in this facility
    const { data: doctorsData } = await supabase
      .from("medical_professionals")
      .select(`
        *,
        medical_professionals_user_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("facility_id", facilityData.id)
      .limit(6);

    if (doctorsData) {
      const mapped = doctorsData.map((item: any) => ({
        id: item.id,
        user_id: item.medical_professionals_user_id_fkey?.user_id || "",
        name: `${item.medical_professionals_user_id_fkey?.first_name || ""} ${
          item.medical_professionals_user_id_fkey?.last_name || ""
        }`.trim() || "Unknown Doctor",
        specialty: item.medical_speciality,
        rating: item.rating || 4.5,
        experience: `${item.years_experience || 10} years`,
        consultationFee: item.consultation_fee || 500,
        availability: "Available",
        image: item.medical_professionals_user_id_fkey?.avatar_url || "",
      }));
      setDoctors(mapped);
    }

    // Mock facility details
    const mockFacility: Facility = {
      ...facilityData,
      contact_number: facilityData.contact_number || "+91 22 1234 5678",
      email: facilityData.email || `info@${facilityData.facility_name.toLowerCase().replace(/\s+/g, '')}.com`,
      facilities: ["24/7 Emergency", "ICU", "Operation Theaters", "Diagnostic Center", "Pharmacy", "Cafeteria", "Parking"],
      accreditations: ["NABH Accredited", "ISO 9001:2015", "Joint Commission International"],
      emergencyServices: true,
      ambulanceAvailable: true,
      parkingAvailable: true,
      operationTheaters: 5,
      icuBeds: 20,
      labServices: true,
      pharmacy: true,
      cafeteria: true,
      visitingHours: "10:00 AM - 8:00 PM (Visiting Hours: 4:00 PM - 6:00 PM)",
    };

    setFacility(mockFacility);
  };

  const handleBookAppointment = () => {
    if (entityType === "doctor" && doctor) {
      navigate(`/dashboard/patient/book/doctor/${createSlug(doctor.name || "")}/${doctor.id}`);
    } else if (entityType === "hospital" && facility) {
      navigate(`/dashboard/patient/book/facility/${createSlug(facility.facility_name || "")}/${facility.id}`);
    }
  };

  const handleViewDoctor = (doctorId: string) => {
    navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Profile link copied to clipboard",
    });
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved to bookmarks",
      description: isSaved ? "Profile removed from your saved list" : "Profile added to your saved list",
    });
  };

  // Update the handleBookAppointmentClick function
const handleBookAppointmentClick = () => {
  // First switch to the Availability tab
  setActiveTab("availability");
  
  // Then scroll to the booking section after a short delay to allow tab switch
  setTimeout(() => {
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 100);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!entityType || (!doctor && !facility)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">The requested profile could not be found.</p>
          <Button onClick={() => navigate("/dashboard/patient/search")}>
            Back to Search
          </Button>
        </Card>
      </div>
    );
  }


  // Doctor Profile View
  if (entityType === "doctor" && doctor) {
    return (
        <DashboardLayout userType="patient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={toggleSave}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Doctor Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <img
                src={doctor.image || "https://via.placeholder.com/150"}
                alt={doctor.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                    <p className="text-xl text-blue-600 mt-1">{doctor.specialty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-semibold">{doctor.rating}</span>
                        <span className="text-gray-500 ml-1">(120 reviews)</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">{doctor.experience} experience</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleBookAppointmentClick}>
                      <Calendar className="h-4 w-4 mr-2" /> Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - About & Details */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <UserRound className="h-5 w-5 mr-2 text-blue-600" /> About Dr. {doctor.name.split(" ").pop()}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center text-gray-600">
                        <Languages className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{doctor.languages?.join(", ")}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{doctor.qualifications?.join(", ")}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                        <span>₹{doctor.consultationFee} consultation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-blue-600" /> Education & Training
                    </h2>
                    <div className="space-y-4">
                      {doctor.education?.map((edu, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                          <div>
                            <p className="font-medium">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" /> Publications
                    </h2>
                    <div className="space-y-4">
                      {doctor.publications?.map((pub, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium">{pub.title}</p>
                          <p className="text-sm text-gray-600">{pub.journal} • {pub.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Specializations</h2>
                    <div className="space-y-2">
                      {doctor.specializations?.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Professional Memberships</h2>
                    <ul className="space-y-2">
                      {doctor.memberships?.map((member, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {member}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Consultation Options</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Video Consultation</p>
                          <p className="text-sm text-gray-600">₹{doctor.videoConsultationFee}</p>
                        </div>
                        {doctor.telemedicineAvailable ? (
                          <Badge className="bg-green-500">Available</Badge>
                        ) : (
                          <Badge variant="outline">Unavailable</Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Clinic Visit</p>
                          <p className="text-sm text-gray-600">₹{doctor.consultationFee}</p>
                        </div>
                        <Badge className="bg-blue-500">Available</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" /> Work Experience
                </h2>
                <div className="space-y-6">
                  {doctor.workExperience?.map((work, index) => (
                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:pb-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                      <p className="font-semibold text-lg">{work.position}</p>
                      <p className="text-gray-700">{work.hospital}</p>
                      <p className="text-sm text-gray-500">{work.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" /> Awards & Recognition
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {doctor.awards?.map((award, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{award}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 col-span-2 text-center py-4">No awards information available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-blue-600" /> Clinic Hours
                </h2>
                <div className="space-y-4">
                  {doctor.clinicVisits?.map((visit, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{visit.day}</p>
                        <p className="text-sm text-gray-600">{visit.time}</p>
                        <p className="text-sm text-gray-500 mt-1">{visit.location}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50">Available</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card ref={bookingSectionRef}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookAIcon className="h-5 w-5 mr-2 text-blue-600" /> Book an Appointment
                </h2>
              </CardContent>
              <CardContent className="p-6">
                <Button
                            variant="default"
                            size="sm"
                            onClick={() => toggleExpand(doctor.user_id)}
                          >
                            View Availability
                          </Button>
                          {expandedDoctorId === doctor.user_id && (
                                                <div className="mt-4 p-4 rounded-xl border shadow bg-white">
                                                  <h3 className="font-semibold mb-3 text-lg">
                                                    Available Slots
                                                  </h3>
                          
                                                  {timeSlots.length === 0 ? (
                                                    <p className="text-red-600 font-medium">
                                                      Doctor is not available.
                                                    </p>
                                                  ) : (
                                                    <>
                                                      <div className="flex gap-3 overflow-x-auto py-2">
                                                        {Array.from({ length: 14 }).map((_, index) => {
                                                          const date = new Date();
                                                          date.setDate(date.getDate() + index);
                          
                                                          const label = formatDayLabel(date, index);
                                                          const dayNumber = formatDateNumber(date);
                                                          const dayOfWeek = date.toLocaleDateString(
                                                            "en-US",
                                                            { weekday: "long" }
                                                          );
                          
                                                          const slotsForDay = timeSlots.filter(
                                                            (s) => s.day_of_week === dayOfWeek
                                                          );
                          
                                                          const dateISO = date.toISOString().split("T")[0];
                                                          const bookingsForDay = bookings.filter((b) => {
                                                            const bookingISO = new Date(b.appointment_date)
                                                              .toISOString()
                                                              .split("T")[0];
                                                            return bookingISO === dateISO;
                                                          });
                          
                                                          const bookedSlotIds = new Set(
                                                            bookingsForDay.map((b) => b.time_slot_id)
                                                          );
                          
                                                          const availableSlotsCount = slotsForDay.filter(
                                                            (slot) => !bookedSlotIds.has(slot.id)
                                                          ).length;
                          
                                                          const isActiveDay = selectedDay === index;
                          
                                                          return (
                                                            <div key={index} className="min-w-[110px]">
                                                              <button
                                                                onClick={() => {
                                                                  setSelectedDay(index);
                                                                  setSelectedSlot(null);
                                                                }}
                                                                className={`w-full px-3 py-2 rounded-lg text-center transition
                                                                  ${
                                                                    isActiveDay
                                                                      ? "bg-blue-600 text-white"
                                                                      : "bg-white text-gray-700"
                                                                  }
                                                                  border ${
                                                                    isActiveDay
                                                                      ? "border-blue-600"
                                                                      : "border-gray-200"
                                                                  }`}
                                                              >
                                                                <div className="text-xs font-medium">
                                                                  {label}
                                                                </div>
                                                                <div className="text-lg font-bold mt-1">
                                                                  {dayNumber}
                                                                </div>
                                                                <div
                                                                  className={`${
                                                                    isActiveDay
                                                                      ? "text-[11px] text-white mt-1"
                                                                      : "text-[11px] text-gray-400 mt-1"
                                                                  }`}
                                                                >
                                                                  {availableSlotsCount} slot
                                                                  {availableSlotsCount !== 1 ? "s" : ""}
                                                                </div>
                                                              </button>
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                          
                                                      <div className="mt-4">
                                                        {(() => {
                                                          const selectedDate = new Date();
                                                          selectedDate.setDate(
                                                            selectedDate.getDate() + selectedDay
                                                          );
                                                          const selectedISO = selectedDate
                                                            .toISOString()
                                                            .split("T")[0];
                                                          const fullDayName =
                                                            selectedDate.toLocaleDateString("en-US", {
                                                              weekday: "long",
                                                            });
                          
                                                          const slotsForDay = timeSlots.filter(
                                                            (s) => s.day_of_week === fullDayName
                                                          );
                          
                                                          if (slotsForDay.length === 0) {
                                                            return (
                                                              <p className="text-gray-500 text-sm">
                                                                No slots available for this day.
                                                              </p>
                                                            );
                                                          }
                          
                                                          const todaysBookings = bookings.filter((b) => {
                                                            const bookingISO = new Date(b.appointment_date)
                                                              .toISOString()
                                                              .split("T")[0];
                                                            return bookingISO === selectedISO;
                                                          });
                          
                                                          const availableSlots = slotsForDay.filter(
                                                            (slot) =>
                                                              !todaysBookings.some(
                                                                (b) => b.time_slot_id === slot.id
                                                              )
                                                          );
                          
                                                          return (
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                              {availableSlots.map((slot) => {
                                                                const isSelected =
                                                                  selectedSlot?.id === slot.id;
                                                                return (
                                                                  <div
                                                                    key={slot.id}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                    className={`
                                                                      p-2 rounded-md cursor-pointer text-sm transition
                                                                      ${
                                                                        slot.slot_type === "clinic"
                                                                          ? "bg-green-50"
                                                                          : "bg-blue-50"
                                                                      }
                                                                      ${
                                                                        isSelected
                                                                          ? "border-2 border-green-600"
                                                                          : "border border-gray-300"
                                                                      }
                                                                    `}
                                                                  >
                                                                    <div className="font-medium">
                                                                      {formatTimePretty(slot.start_time)} -{" "}
                                                                      {formatTimePretty(slot.end_time)}
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-600 capitalize">
                                                                      {slot.slot_type}
                                                                    </div>
                                                                    <div className="text-[11px] mt-1 font-semibold text-green-600">
                                                                      Available
                                                                    </div>
                                                                  </div>
                                                                );
                                                              })}
                          
                                                              {availableSlots.length === 0 && (
                                                                <p className="text-red-500 text-sm col-span-full text-center">
                                                                  No available slots for this day.
                                                                </p>
                                                              )}
                                                            </div>
                                                          );
                                                        })()}
                                                      </div>
                          
                                                      {!selectedSlot && (
                                                        <p className="text-gray-500 text-xs mt-2">
                                                          Please select a slot to book an appointment.
                                                        </p>
                                                      )}
                          
                                                      <Button
  variant="default"
  size="sm"
  className="mt-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
  disabled={!selectedSlot}
  onClick={() => {
    console.log("Button clicked", { selectedSlot, selectedDay, doctor });
    if (selectedSlot) {
      handleBookNow(selectedSlot, selectedDay, doctor);
    }
  }}
>
  Book Appointment without Payment
</Button>
                                                    </>
                                                  )}
                                                </div>
                                              )}
                                              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent className="rounded-xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center">
                    Confirm Appointment 
                  </DialogTitle>
                </DialogHeader>
      
                {bookingInfo && (
                  <div className="space-y-4 mt-2">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">Doctor/Department</p>
                      <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
                    </div>
      
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="text-md font-medium">
                          {bookingInfo.booking_date}
                        </p>
                      </div>
      
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Time Slot</p>
                        <p className="text-md font-medium">
                          {formatTimePretty(bookingInfo.start_time)} -{" "}
                          {formatTimePretty(bookingInfo.end_time)}
                        </p>
                      </div>
                    </div>
      
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add message for doctor..."
                        className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
      
                <DialogFooter className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConfirmOpen(false);
                      setNotes("");
                    }}
                  >
                    Cancel
                  </Button>
      
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Patient Reviews</h3>
                <p className="text-gray-500 mb-6">Reviews feature coming soon</p>
                <Button variant="outline">Be the first to review</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Doctors */}
        {similarDoctors.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Doctors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarDoctors.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => handleViewDoctor(doc.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={doc.image || "https://via.placeholder.com/150"}
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm ml-1">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Profile <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      </DashboardLayout>
    );
  }

  // Hospital Profile View
  if (entityType === "hospital" && facility) {
    return (
        <DashboardLayout userType="patient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={toggleSave}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-green-600 text-green-600" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Hospital Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 h-48 relative">
            {facility.is_verified && (
              <Badge className="absolute top-4 right-4 bg-white text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{facility.facility_name}</h1>
                <p className="text-xl text-green-600 mt-1">{facility.facility_type}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold">{facility.rating}</span>
                    <span className="text-gray-500 ml-1">({facility.total_reviews} reviews)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">Est. {facility.established_year}</span>
                </div>
              </div>
              {/* <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleBookAppointment}>
                <Calendar className="h-4 w-4 mr-2" /> Book Appointment
              </Button> */}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                <span>{facility.city}, {facility.state} - {facility.pincode}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                <span>{facility.contact_number}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                <span>{facility.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-green-600" /> About {facility.facility_name}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{facility.about_facility}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-green-600" /> Accreditations
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {facility.accreditations?.map((acc, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50">
                          {acc}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-green-600" /> Insurance Partners
                    </h2>
                    <p className="text-gray-700">{facility.insurance_partners || "All major insurance providers accepted"}</p>
                    {facility.website && (
                      <a href={facility.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline mt-4 block">
                        Visit Website
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Beds</span>
                        <span className="font-semibold">{facility.total_beds}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ICU Beds</span>
                        <span className="font-semibold">{facility.icuBeds}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Operation Theaters</span>
                        <span className="font-semibold">{facility.operationTheaters}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Departments</span>
                        <span className="font-semibold">{departments.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Services</h2>
                    <div className="space-y-2">
                      {facility.emergencyServices && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Ambulance className="h-4 w-4 mr-2 text-green-500" />
                          Emergency Services
                        </div>
                      )}
                      {facility.ambulanceAvailable && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="h-4 w-4 mr-2 text-green-500" />
                          Ambulance Available
                        </div>
                      )}
                      {facility.labServices && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Microscope className="h-4 w-4 mr-2 text-green-500" />
                          Lab Services
                        </div>
                      )}
                      {facility.pharmacy && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Pill className="h-4 w-4 mr-2 text-green-500" />
                          Pharmacy
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Visiting Hours</h2>
                    <p className="text-sm text-gray-600">{facility.visitingHours}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          {/* Departments Tab */}
<TabsContent value="departments" className="space-y-6">
  <div className="grid md:grid-cols-2 gap-6">
    {departments.map((dept) => (
      <Card
        key={dept.id}
        className="hover:shadow-lg transition cursor-pointer border-2 hover:border-green-300"
        onClick={() => handleViewDepartment(dept)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{dept.name}</h3>
            {dept.is_active ? (
              <Badge className="bg-green-500">Active</Badge>
            ) : (
              <Badge variant="outline">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {dept.description || "No description available"}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Available Beds: <span className="font-semibold">{dept.available_beds || 0}</span>/{dept.bed_capacity || 0}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-green-600">
              View Departments <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => handleViewDoctor(doc.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={doc.image || "https://via.placeholder.com/150"}
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm ml-1">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Profile <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities & Facilities</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {facility.facilities?.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {item.includes("Emergency") && <Ambulance className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("ICU") && <HeartPulse className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("Operation") && <Stethoscope className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("Diagnostic") && <Microscope className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("Pharmacy") && <Pill className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("Cafeteria") && <Coffee className="h-4 w-4 mr-2 text-green-600" />}
                      {item.includes("Parking") && <ParkingCircle className="h-4 w-4 mr-2 text-green-600" />}
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      </DashboardLayout>
    );
  }

  return null;
};

export default DoctorHospitals;