// HomeLogin.tsx - Redesigned Version
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  CalendarCheck, 
  PersonStanding, 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Star,
  Bed,
  Users,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HeartPulse,
  Mail,
  Globe,
  Shield,
  Award,
  Menu,
  X,
  ChevronRight,
  LogIn,
  UserPlus,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  ArrowRight,
  Home,
  Stethoscope,
  Hotel,
  FileText,
  ChevronLeft,
  Briefcase,
  Languages,
  MessageCircle,
  Share2,
  Sparkles,
  Wind,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';
import DoctorSearch from './DoctorSearch';
import PatientFacilities from '@/pages/patient/PatientFacilities';
import { toast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location?: string;
  distance?: string;
  consultationFee: number;
  availability: string;
  hospital?: string;
  image?: string;
  patients?: number;
  education?: string;
  languages?: string[];
  about?: string;
  achievements?: string[];
  specialization?: string[];
  updated_at?: string;
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
  website: string;
  insurance_partners: string;
  about_facility: string;
  contact_number?: string;
  email?: string;
  facilities?: string[];
  departments?: Department[];
  images?: string[];
  timings?: string;
  emergency_services?: string[];
  accreditation?: string[];
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
  doctors?: Doctor[];
}

interface BedBooking {
  id: string;
  bedNumber: string;
  bedType: string;
  roomNumber: string;
  floorNumber: number;
  wing: string;
  status: string;
  availability: string;
  hasOxygen: boolean;
  hasVentilator: boolean;
  isIsolation: boolean;
  wardId: string;
  wardName: string;
  wardCode: string;
  wardType: string;
  facilityId: string;
  facilityName: string;
  city: string;
  state: string;
  facilityType: string;
  patientName?: string;
  patientAge?: number;
  doctor?: string;
  department?: string;
  pricePerDay?: number;
  bookingDate?: string;
  dischargeDate?: string;
}

type ViewType = 'all' | 'doctors' | 'hospitals' | 'beds';
type DetailViewType = 'doctor' | 'hospital' | 'bed' | null;

const HomeLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [detailView, setDetailView] = useState<DetailViewType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('all');
  
  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Filter states
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedBedType, setSelectedBedType] = useState<string>('');

  // Check login status on mount
  useEffect(() => {
    checkLoginStatus();
    fetchDoctors();
    fetchFacilityDetails();
    fetchBedBookings();
  }, []);

  const checkUserRole = async (userId: string) => {
  try {
    // Check in patients table
    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (patientData) {
      return { role: 'patient', exists: true };
    }

    // Check in medical_professionals table (doctors)
    // const { data: doctorData, error: doctorError } = await supabase
    //   .from("medical_professionals")
    //   .select("id")
    //   .eq("user_id", userId)
    //   .single();

    // if (doctorData) {
    //   return { role: 'doctor', exists: true };
    // }

    // // Check in facilities table (hospital/facility admins)
    // const { data: facilityData, error: facilityError } = await supabase
    //   .from("facilities")
    //   .select("id")
    //   .eq("user_id", userId)
    //   .single();

    // if (facilityData) {
    //   return { role: 'facility', exists: true };
    // }

    return { role: 'unknown', exists: false };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { role: 'unknown', exists: false };
  }
};

  // const checkLoginStatus = async () => {
  //   const { data: { session } } = await supabase.auth.getSession();
  //   setIsLoggedIn(!!session);
  // };

  // const handleLoginRedirect = (path?: string) => {
  //   navigate(path || '/login/patient');
  // };

  // const handleSignupRedirect = () => {
  //   navigate('/signup/patient');
  // };
//   const checkLoginStatus = async () => {
//   const { data: { session } } = await supabase.auth.getSession();
  
//   if (session?.user) {
//     // Check the user's role
//     const userRole = await checkUserRole(session.user.id);
    
//     if (userRole.role === 'patient') {
//       setIsLoggedIn(true);
//     } else {
//       // If not a patient, sign them out and show message
//       await supabase.auth.signOut();
//       setIsLoggedIn(false);
      
//     }
//   } else {
//     setIsLoggedIn(false);
//   }
// };
const checkLoginStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // Check the user's role
    const userRole = await checkUserRole(session.user.id);
    
    if (userRole.role === 'patient') {
      navigate('/');
      setIsLoggedIn(true);
      
      // Check if there's a redirect path in sessionStorage
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    } else {
      // If not a patient, sign them out and show message
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      toast({
        title: "Access Denied",
        description: "This portal is for patients only. Please login with a patient account.",
        variant: "destructive",
      });
    }
    
  } else {
    navigate('/homelogin');
    setIsLoggedIn(false);
  }
};

// Update the handleLoginRedirect function
// const handleLoginRedirect = (path?: string) => {
//   // Add role parameter to login page
//   navigate(path || '/login/patient');
// };
const handleLoginRedirect = (path?: string) => {
  // Store the intended path to redirect back after login
  if (path) {
    navigate('/login/patient');
    // sessionStorage.setItem('redirectAfterLogin', path);
  }
  // Add role parameter to login page
  navigate('/login/patient');
};

// Update the handleSignupRedirect function
const handleSignupRedirect = () => {
  navigate('/signup/patient');
};

  // View handlers
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setDetailView(null);
    setSelectedItem(null);
  };

  const handleItemClick = (item: any, type: 'doctor' | 'hospital' | 'bed') => {
    setSelectedItem(item);
    setDetailView(type);
  };

  const handleBack = () => {
    setDetailView(null);
    setSelectedItem(null);
  };

  // Fetch functions (keeping your existing fetch logic)
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("medical_professionals")
        .select(`
          *,
          medical_professionals_user_id_fkey (
            first_name,
            last_name,
            avatar_url,
            user_id
          )
        `);

      if (error) throw error;

      const mapped = data.map((item: any) => {
        const fullName = item.medical_professionals_user_id_fkey
          ? `${item.medical_professionals_user_id_fkey.first_name || ""} ${
              item.medical_professionals_user_id_fkey.last_name || ""
            }`.trim()
          : "Unknown Doctor";

        return {
          id: item.id,
          user_id: item.medical_professionals_user_id_fkey?.user_id || "",
          name: fullName || "Unknown Doctor",
          specialty: item.medical_speciality,
          rating: item.rating || 4.5,
          experience: item.years_experience
            ? `${item.years_experience} years`
            : "N/A",
          consultationFee: item.consultation_fee || 0,
          availability: item.availability?.status || "Available",
          hospital: item.medical_school || "Not specified",
          location: item.about_yourself || "Location not provided",
          image: item.medical_professionals_user_id_fkey?.avatar_url || "https://via.placeholder.com/100",
          patients: Math.floor(Math.random() * 1000) + 500,
          education: item.education || "MBBS, MD",
          languages: item.languages || ["English", "Hindi"],
          about: item.about_yourself || "Experienced medical professional dedicated to patient care.",
          achievements: [
            "Best Doctor Award 2023",
            "1000+ Successful Surgeries",
            "Published 20+ Research Papers"
          ],
          specialization: [item.medical_speciality, "General Medicine", "Critical Care"],
          updated_at: item.updated_at || item.created_at,
        } as Doctor;
      });

      setDoctors(mapped);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilityDetails = async () => {
    try {
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from("facilities")
        .select(`
          id,
          facility_name,
          facility_type,
          license_number,
          city,
          state,
          pincode,
          total_beds,
          rating,
          total_reviews,
          is_verified,
          established_year,
          insurance_partners,
          about_facility,
          website
        `);

      if (facilitiesError) throw facilitiesError;

      if (facilitiesData) {
        const enhancedFacilities = facilitiesData.map(facility => ({
          ...facility,
          contact_number: "+1 234-567-890" + Math.floor(Math.random() * 10),
          email: `info@${facility.facility_name.toLowerCase().replace(/\s+/g, '')}.com`,
          facilities: ["Emergency", "ICU", "Pharmacy", "Laboratory"],
          images: [
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ],
          timings: "24/7 Emergency Services",
          emergency_services: ["Trauma Care", "Cardiac Emergency", "Stroke Unit"],
          accreditation: ["NABH", "JCI", "ISO 9001:2015"]
        }));
        
        setFacilities(enhancedFacilities);
        setFilteredFacilities(enhancedFacilities);
        
        const facilityIds = facilitiesData.map(f => f.id);
        
        if (facilityIds.length > 0) {
          const { data: departmentsData, error: departmentsError } = await supabase
            .from("departments")
            .select("*")
            .in("facility_id", facilityIds);

          if (!departmentsError && departmentsData) {
            const enhancedDepts = departmentsData.map(dept => ({
              ...dept,
              doctors: doctors.filter(doc => doc.hospital === dept.name).slice(0, 3)
            }));
            setDepartments(enhancedDepts);
            setFilteredDepartments(enhancedDepts);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const fetchBedBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data: bedsData, error: bedsError } = await supabase
        .from("beds")
        .select(`
          id,
          bed_number,
          bed_type,
          room_number,
          floor_number,
          wing,
          current_status,
          has_oxygen,
          has_ventilator,
          is_isolation,
          ward_id
        `)
        .eq("current_status","AVAILABLE")
        .eq('is_active', true);

      if (bedsError) throw bedsError;

      if (!bedsData || bedsData.length === 0) {
        setBedBookings([]);
        return;
      }

      const wardIds = [...new Set(bedsData.map(bed => bed.ward_id).filter(Boolean))];
      
      if (wardIds.length === 0) {
        setBedBookings([]);
        return;
      }
      
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .select(`
          id,
          name,
          ward_code,
          ward_type,
          floor_number,
          wing,
          facility_id,
          facilities!wards_facility_id_fkey(
            id,
            facility_name,
            city,
            state,
            facility_type
          )
        `)
        .in('id', wardIds);

      if (wardsError) throw wardsError;

      const wardMap = new Map(wardsData?.map(ward => [ward.id, ward]));

      const transformedData = bedsData.map(bed => {
        const ward = wardMap.get(bed.ward_id) || {};
        const facility = ward.facilities || {};
        
        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          bedType: bed.bed_type,
          roomNumber: bed.room_number,
          floorNumber: bed.floor_number,
          wing: bed.wing,
          status: bed.current_status,
          availability: bed.current_status === 'available' ? 'Occupied' : 'Available',
          hasOxygen: bed.has_oxygen || false,
          hasVentilator: bed.has_ventilator || false,
          isIsolation: bed.is_isolation || false,
          wardId: ward.id,
          wardName: ward.name || 'Unknown Ward',
          wardCode: ward.ward_code,
          wardType: ward.ward_type,
          facilityId: facility.id,
          facilityName: facility.facility_name || 'Unknown Facility',
          city: facility.city || 'N/A',
          state: facility.state || 'N/A',
          facilityType: facility.facility_type,
          pricePerDay: Math.floor(Math.random() * 500) + 100,
        };
      });

      setBedBookings(transformedData);
    } catch (error) {
      console.error("Error fetching bed bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Search and filter logic
  const getFilteredDoctors = () => {
    let filtered = [...doctors];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.hospital?.toLowerCase().includes(term) ||
        doctor.education?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const getFilteredHospitals = () => {
    let filtered = [...facilities];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(hospital => 
        hospital.facility_name.toLowerCase().includes(term) ||
        hospital.city.toLowerCase().includes(term) ||
        hospital.facility_type.toLowerCase().includes(term) ||
        hospital.departments?.some(dept => dept.name.toLowerCase().includes(term))
      );
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(hospital => 
        hospital.departments?.some(dept => dept.id === selectedDepartment)
      );
    }
    
    if (selectedCity) {
      filtered = filtered.filter(h => h.city === selectedCity);
    }
    
    if (showVerifiedOnly) {
      filtered = filtered.filter(h => h.is_verified);
    }
    
    return filtered;
  };

  const getFilteredBeds = () => {
    let filtered = [...bedBookings];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bed => 
        bed.facilityName.toLowerCase().includes(term) ||
        bed.wardName.toLowerCase().includes(term) ||
        bed.city.toLowerCase().includes(term) ||
        bed.bedType.toLowerCase().includes(term)
      );
    }
    
    if (selectedBedType) {
      filtered = filtered.filter(bed => bed.bedType === selectedBedType);
    }
    
    if (selectedCity) {
      filtered = filtered.filter(bed => bed.city === selectedCity);
    }
    
    return filtered;
  };

  // Get unique values for filters
  const uniqueCities = [...new Set(facilities.map(f => f.city))];
  const uniqueDepartments = [...new Set(departments.map(d => d.name))];
  const uniqueBedTypes = [...new Set(bedBookings.map(b => b.bedType))];

  // Doctor Detail View Component - Redesigned
  const DoctorDetailView = ({ doctor }: { doctor: Doctor }) => (
    <div className="doctor-detail-view">
      {/* Back Button */}
      <button 
        className="btn btn-link text-primary mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
      >
        <ChevronLeft size={20} />
        Back to {currentView === 'doctors' ? 'Doctors' : 'All'}
      </button>

      <div className="glass-card rounded-4 overflow-hidden">
        <div className="position-relative">
          {/* Background Gradient */}
          <div className="position-absolute top-0 start-0 w-100 h-50 bg-gradient-primary opacity-10"></div>
          
          <div className="position-relative p-4">
            {/* Header Section */}
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div className="position-relative d-inline-block">
                  <div className="avatar-glow">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="rounded-4 border border-4 border-white shadow-lg"
                      style={{ width: '220px', height: '220px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                    <span className="badge bg-success rounded-pill p-2 shadow">
                      <CheckCircle size={20} />
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="display-6 fw-bold mb-2">{doctor.name}</h1>
                    <p className="text-primary fs-5 mb-3">{doctor.specialty}</p>
                    
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-2">
                        <Star size={18} className="text-warning" fill="currentColor" />
                        <span className="fw-bold">{doctor.rating}</span>
                        <span className="text-muted">Rating</span>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-2">
                        <Users size={18} className="text-primary" />
                        <span className="fw-bold">{doctor.patients}+</span>
                        <span className="text-muted">Patients</span>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-2">
                        <Clock size={18} className="text-success" />
                        <span className="fw-bold">{doctor.experience}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isLoggedIn && (
                    <div className="alert alert-warning py-2 px-3 mb-0 rounded-3">
                      <small className="d-flex align-items-center gap-2">
                        <LogIn size={14} />
                        <button 
                          className="btn btn-link text-warning p-0 ms-1"
                          onClick={() => handleLoginRedirect()}
                        >
                          Login
                        </button> to book
                      </small>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 mb-4">
                  <button 
                    className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3"
                    onClick={() => isLoggedIn ? navigate('/appointment') : handleLoginRedirect()}
                  >
                    <CalendarCheck size={20} />
                    {isLoggedIn ? 'Book Appointment' : 'Login to Book'}
                  </button>
                  <button className="btn btn-outline-primary rounded-3">
                    <MessageCircle size={20} />
                  </button>
                  <button className="btn btn-outline-primary rounded-3">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="row mt-4 g-4">
              <div className="col-md-6">
                <div className="glass-card-light p-4 rounded-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <div className="icon-circle bg-primary bg-opacity-10 p-2 rounded-3">
                      <Briefcase size={20} className="text-primary" />
                    </div>
                    Professional Details
                  </h5>
                  
                  <div className="vstack gap-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="text-muted">Experience</span>
                      <span className="fw-bold">{doctor.experience}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="text-muted">Education</span>
                      <span className="fw-bold">{doctor.education}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="text-muted">Hospital</span>
                      <span className="fw-bold">{doctor.hospital}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Languages</span>
                      <div className="d-flex gap-2">
                        {doctor.languages?.map((lang, idx) => (
                          <span key={idx} className="badge bg-light text-dark px-3 py-2 rounded-pill">
                            <Languages size={12} className="me-1" />
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="glass-card-light p-4 rounded-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <div className="icon-circle bg-warning bg-opacity-10 p-2 rounded-3">
                      <Award size={20} className="text-warning" />
                    </div>
                    Achievements & Specializations
                  </h5>
                  
                  <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {doctor.specialization?.map((spec, idx) => (
                        <span key={idx} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    <div className="vstack gap-2">
                      {doctor.achievements?.map((achievement, idx) => (
                        <div key={idx} className="d-flex align-items-start gap-2 bg-light p-2 rounded-3">
                          <Sparkles size={16} className="text-warning mt-1" />
                          <span className="small">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="glass-card-light p-4 rounded-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <div className="icon-circle bg-info bg-opacity-10 p-2 rounded-3">
                      <FileText size={20} className="text-info" />
                    </div>
                    About
                  </h5>
                  <p className="mb-0 text-muted">{doctor.about}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Hospital Detail View Component - Redesigned
  const HospitalDetailView = ({ hospital }: { hospital: Facility }) => (
    <div className="hospital-detail-view">
      <button 
        className="btn btn-link text-primary mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
      >
        <ChevronLeft size={20} />
        Back to {currentView === 'hospitals' ? 'Hospitals' : 'All'}
      </button>

      <div className="glass-card rounded-4 overflow-hidden">
        <div className="position-relative">
          {/* Header Image */}
          <div className="position-relative" style={{ height: '250px' }}>
            <img 
              src={hospital.images?.[0] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d"} 
              alt={hospital.facility_name}
              className="w-100 h-100 object-fit-cover"
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ 
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            }}>
              <div className="d-flex align-items-center gap-3 text-white">
                <h2 className="fw-bold mb-0">{hospital.facility_name}</h2>
                {hospital.is_verified && (
                  <span className="badge bg-success d-flex align-items-center gap-1 px-3 py-2 rounded-pill">
                    <Shield size={14} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Info Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3 col-6">
                <div className="glass-card-light p-3 rounded-4 text-center">
                  <MapPin size={24} className="text-primary mb-2" />
                  <small className="text-muted d-block">Location</small>
                  <span className="fw-bold small">{hospital.city}</span>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card-light p-3 rounded-4 text-center">
                  <Phone size={24} className="text-primary mb-2" />
                  <small className="text-muted d-block">Contact</small>
                  <span className="fw-bold small">{hospital.contact_number}</span>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card-light p-3 rounded-4 text-center">
                  <Mail size={24} className="text-primary mb-2" />
                  <small className="text-muted d-block">Email</small>
                  <span className="fw-bold small">{hospital.email}</span>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card-light p-3 rounded-4 text-center">
                  <Star size={24} className="text-warning mb-2" fill="currentColor" />
                  <small className="text-muted d-block">Rating</small>
                  <span className="fw-bold small">{hospital.rating} ({hospital.total_reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="glass-card-light p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-3">About Hospital</h5>
              <p className="text-muted mb-0">{hospital.about_facility}</p>
            </div>

            {/* Departments */}
            <div className="glass-card-light p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-4">Departments</h5>
              <div className="row g-3">
                {departments
                  .filter(d => d.facility_id === hospital.id)
                  .map(dept => (
                    <div key={dept.id} className="col-md-6">
                      <div className="glass-card p-3 rounded-4 hover-scale">
                        <h6 className="fw-bold mb-2">{dept.name}</h6>
                        <p className="small text-muted mb-2">{dept.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                            <Bed size={14} className="me-1" />
                            {dept.available_beds || 0}/{dept.bed_capacity || 0} Beds
                          </span>
                          {dept.doctors && dept.doctors.length > 0 && (
                            <small className="text-muted">
                              <Users size={14} className="me-1" />
                              {dept.doctors.length} Doctors
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Facilities & Services */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="glass-card-light p-4 rounded-4">
                  <h6 className="fw-bold mb-3">Facilities</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {hospital.facilities?.map((fac, idx) => (
                      <span key={idx} className="badge bg-light text-dark px-3 py-2 rounded-pill">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="glass-card-light p-4 rounded-4">
                  <h6 className="fw-bold mb-3">Emergency Services</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {hospital.emergency_services?.map((service, idx) => (
                      <span key={idx} className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="glass-card-light p-4 rounded-4">
                  <h6 className="fw-bold mb-3">Accreditations</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {hospital.accreditation?.map((acc, idx) => (
                      <span key={idx} className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                        <Award size={14} className="me-1" />
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="alert alert-warning mt-4 rounded-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <LogIn size={18} className="me-2" />
                    Login to book beds or appointments
                  </span>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => handleLoginRedirect()}
                  >
                    Login Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Bed Detail View Component - Redesigned
  const BedDetailView = ({ bed }: { bed: BedBooking }) => (
    <div className="bed-detail-view">
      <button 
        className="btn btn-link text-primary mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
      >
        <ChevronLeft size={20} />
        Back to {currentView === 'beds' ? 'Beds' : 'All'}
      </button>

      <div className="glass-card rounded-4 overflow-hidden">
        <div className="p-4">
          <div className="row g-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4">Bed Details</h2>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Hospital</small>
                    <h5 className="fw-bold mb-1">{bed.facilityName}</h5>
                    <small className="text-primary">{bed.facilityType}</small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Location</small>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{bed.city}, {bed.state}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Ward</small>
                    <h6 className="fw-bold mb-1">{bed.wardName}</h6>
                    <small>Type: {bed.wardType}</small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Bed Number</small>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="text-primary fw-bold mb-0">{bed.bedNumber}</h4>
                      <small className="text-muted">Room: {bed.roomNumber || 'N/A'}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Location Details</small>
                    <div className="d-flex gap-3">
                      <div>Floor: {bed.floorNumber}</div>
                      <div>Wing: {bed.wing || 'Main'}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="glass-card-light p-3 rounded-4">
                    <small className="text-muted d-block mb-1">Price per Day</small>
                    <h4 className="text-success fw-bold">${bed.pricePerDay}</h4>
                  </div>
                </div>

                <div className="col-12">
                  <div className="glass-card-light p-3 rounded-4">
                    <h6 className="fw-bold mb-3">Facilities</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {bed.hasOxygen && (
                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                          <Wind size={14} className="me-1" />
                          Oxygen
                        </span>
                      )}
                      {bed.hasVentilator && (
                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                          <Activity size={14} className="me-1" />
                          Ventilator
                        </span>
                      )}
                      {bed.isIsolation && (
                        <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                          <AlertCircle size={14} className="me-1" />
                          Isolation
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card-light p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                <h5 className="fw-bold mb-4">Booking Status</h5>
                
                <div className={`badge w-100 p-4 mb-4 rounded-4 ${bed.availability === 'Available' ? 'bg-success' : 'bg-warning'}`}>
                  <h4 className="text-white mb-0">{bed.availability}</h4>
                </div>
                
                <div className="vstack gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Bed Type</span>
                    <span className="fw-bold">{bed.bedType}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Ward Code</span>
                    <span className="fw-bold">{bed.wardCode}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Room Number</span>
                    <span className="fw-bold">{bed.roomNumber || 'N/A'}</span>
                  </div>
                  
                  <hr />
                  
                  {!isLoggedIn ? (
                    <>
                      <p className="small text-muted text-center mb-3">Login to book this bed</p>
                      <button 
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3"
                        onClick={() => handleLoginRedirect()}
                      >
                        <LogIn size={18} />
                        Login to Book
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3"
                      onClick={() => navigate('/book-bed', { state: { bed } })}
                    >
                      <Bed size={18} />
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Search Bar Component - Redesigned
  const SearchBar = () => (
    <div className="search-bar mb-4">
      <div className="glass-card rounded-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-0 rounded-start-4">
                <Search size={18} className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none py-3"
                placeholder={`Search ${currentView === 'all' ? 'doctors, hospitals, beds...' : 
                  currentView === 'doctors' ? 'doctors by name, specialty, hospital...' :
                  currentView === 'hospitals' ? 'hospitals by name, city, department...' :
                  'beds by hospital, ward, city...'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-lg-7">
            <div className="d-flex gap-2 flex-wrap justify-content-lg-end">
              {currentView === 'hospitals' && (
                <>
                  <select 
                    className="form-select w-auto border-0 bg-light rounded-3 py-3"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="form-select w-auto border-0 bg-light rounded-3 py-3"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  
                  <div className="form-check form-switch mt-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="verifiedOnly"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="verifiedOnly">
                      Verified Only
                    </label>
                  </div>
                </>
              )}

              {currentView === 'beds' && (
                <>
                  <select 
                    className="form-select w-auto border-0 bg-light rounded-3 py-3"
                    value={selectedBedType}
                    onChange={(e) => setSelectedBedType(e.target.value)}
                  >
                    <option value="">All Bed Types</option>
                    {uniqueBedTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="form-select w-auto border-0 bg-light rounded-3 py-3"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Component - Redesigned
  const Sidebar = () => (
    <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : 'closed'}`} style={{
      width: sidebarOpen ? '400px' : '90px',
      transition: 'width 0.3s ease',
      height: 'calc(100vh - 76px)',
      position: 'sticky',
      top: '76px',
      overflowY: 'auto',
      borderRight: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div className="p-3">
        <button 
          className="btn btn-light w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          {sidebarOpen && 'Collapse Menu'}
        </button>

        <div className="nav flex-column nav-pills gap-2">
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => handleViewChange('all')}
          >
            <div className={`icon-circle ${currentView === 'all' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Home size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">All</span>}
          </button>
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'doctors' ? 'active' : ''}`}
            onClick={() => handleViewChange('doctors')}
          >
            <div className={`icon-circle ${currentView === 'doctors' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Stethoscope size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Doctors</span>}
          </button>
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'hospitals' ? 'active' : ''}`}
            onClick={() => handleViewChange('hospitals')}
          >
            <div className={`icon-circle ${currentView === 'hospitals' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Hotel size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Hospitals</span>}
          </button>
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'beds' ? 'active' : ''}`}
            onClick={() => handleViewChange('beds')}
          >
            <div className={`icon-circle ${currentView === 'beds' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Bed size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Bed Booking</span>}
          </button>
        </div>

        {sidebarOpen && (
          <div className="mt-5">
            <h6 className="px-3 mb-3 text-muted small fw-bold">Quick Stats</h6>
            <div className="vstack gap-2">
              <div className="glass-card-light p-3 rounded-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-circle bg-primary bg-opacity-10 p-2 rounded-3">
                      <Users size={16} className="text-primary" />
                    </div>
                    <small className="text-muted">Doctors</small>
                  </div>
                  <span className="fw-bold">{doctors.length}</span>
                </div>
              </div>
              
              <div className="glass-card-light p-3 rounded-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-circle bg-success bg-opacity-10 p-2 rounded-3">
                      <Hotel size={16} className="text-success" />
                    </div>
                    <small className="text-muted">Hospitals</small>
                  </div>
                  <span className="fw-bold">{facilities.length}</span>
                </div>
              </div>
              
              <div className="glass-card-light p-3 rounded-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-circle bg-info bg-opacity-10 p-2 rounded-3">
                      <Bed size={16} className="text-info" />
                    </div>
                    <small className="text-muted">Available Beds</small>
                  </div>
                  <span className="fw-bold">{bedBookings.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Contact Section - Redesigned
  const ContactSection = () => (
    <section className="py-5" id="contact" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Contact Us</h2>
          <p className="lead text-muted">We're here to help 24/7</p>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-card p-4 text-center h-100 rounded-4 hover-lift">
              <div className="icon-circle bg-primary bg-opacity-10 p-3 mx-auto mb-4 rounded-4" style={{ width: '80px', height: '80px' }}>
                <PhoneIcon size={40} className="text-primary" />
              </div>
              <h5 className="fw-bold mb-2">Emergency</h5>
              <p className="text-muted mb-2">24/7 Helpline</p>
              <h4 className="text-primary">+1 800-123-4567</h4>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="glass-card p-4 text-center h-100 rounded-4 hover-lift">
              <div className="icon-circle bg-success bg-opacity-10 p-3 mx-auto mb-4 rounded-4" style={{ width: '80px', height: '80px' }}>
                <MailIcon size={40} className="text-success" />
              </div>
              <h5 className="fw-bold mb-2">Email Us</h5>
              <p className="text-muted mb-2">Get support via email</p>
              <h6 className="text-success">support@healthcare.com</h6>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="glass-card p-4 text-center h-100 rounded-4 hover-lift">
              <div className="icon-circle bg-info bg-opacity-10 p-3 mx-auto mb-4 rounded-4" style={{ width: '80px', height: '80px' }}>
                <MapPinIcon size={40} className="text-info" />
              </div>
              <h5 className="fw-bold mb-2">Visit Us</h5>
              <p className="text-muted mb-2">Head Office</p>
              <h6 className="text-info">123 Healthcare Ave, Medical City</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Card Components for Main View - Redesigned
  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div 
      className="glass-card p-3 rounded-4 hover-lift cursor-pointer"
      onClick={() => handleItemClick(doctor, 'doctor')}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          <img 
            src={doctor.image} 
            alt={doctor.name}
            className="rounded-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div className="position-absolute bottom-0 end-0">
            <span className="badge bg-success rounded-circle p-1">
              <CheckCircle size={12} />
            </span>
          </div>
        </div>
        
        <div className="flex-grow-1">
          <h6 className="fw-bold mb-1">{doctor.name}</h6>
          <p className="text-primary small mb-2">{doctor.specialty}</p>
          
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-light text-dark px-2 py-1 rounded-pill small">
              <Clock size={12} className="me-1" />
              {doctor.experience}
            </span>
            
            <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill small">
              <Star size={12} fill="currentColor" className="me-1" />
              {doctor.rating}
            </span>
            
            <span className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded-pill small">
              <Users size={12} className="me-1" />
              {doctor.patients}+
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const HospitalCard = ({ hospital }: { hospital: Facility }) => (
    <div 
      className="glass-card p-3 rounded-4 hover-lift cursor-pointer"
      onClick={() => handleItemClick(hospital, 'hospital')}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-bold mb-1">{hospital.facility_name}</h6>
          <p className="text-muted small mb-2">
            <MapPin size={12} className="me-1" />
            {hospital.city}
          </p>
        </div>
        {hospital.is_verified && (
          <Shield size={16} className="text-success" />
        )}
      </div>
      
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill small">
          {hospital.facility_type}
        </span>
        <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill small">
          <Star size={12} fill="currentColor" className="me-1" />
          {hospital.rating}
        </span>
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          <Building2 size={12} className="me-1" />
          {hospital.departments?.length || 0} Depts
        </small>
        <small className="text-muted">
          <Bed size={12} className="me-1" />
          {hospital.total_beds} Beds
        </small>
      </div>
    </div>
  );

  const BedCard = ({ bed }: { bed: BedBooking }) => (
    <div 
      className="glass-card p-3 rounded-4 hover-lift cursor-pointer"
      onClick={() => handleItemClick(bed, 'bed')}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="fw-bold mb-1">{bed.facilityName}</h6>
          <p className="text-muted small mb-1">
            <MapPin size={12} className="me-1" />
            {bed.city}
          </p>
        </div>
        <span className={`badge ${bed.availability === 'Available' ? 'bg-success' : 'bg-warning'} px-2 py-1 rounded-pill`}>
          {bed.availability}
        </span>
      </div>
      
      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
        <span className="badge bg-light text-dark px-2 py-1 rounded-pill small">
          {bed.bedType}
        </span>
        <span className="badge bg-light text-dark px-2 py-1 rounded-pill small">
          Ward: {bed.wardName}
        </span>
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">Bed #{bed.bedNumber}</small>
        {bed.pricePerDay && (
          <small className="text-primary fw-bold">${bed.pricePerDay}/day</small>
        )}
      </div>
    </div>
  );

  const renderMainContent = () => {
  if (detailView === "doctor" && selectedItem) {
    return <DoctorDetailView doctor={selectedItem} />;
  }

  if (detailView === "hospital" && selectedItem) {
    return <HospitalDetailView hospital={selectedItem} />;
  }

  if (detailView === "bed" && selectedItem) {
    return <BedDetailView bed={selectedItem} />;
  }

  const SectionWrapper = ({ title, subtitle, viewKey, data, CardComponent, emptyIcon, emptyTitle, emptyText }) => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">{title}</h3>
          <p className="text-muted small">{subtitle}</p>
        </div>

        {currentView === "all" && (
          <button
            className="btn btn-link text-primary d-flex align-items-center gap-1"
            onClick={() => handleViewChange(viewKey)}
          >
            View All <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="row g-4">
        {data.length > 0 ? (
          data
            .slice(0, currentView === "all" ? 6 : undefined)
            .map((item) => (
              <div
                key={item.id}
                className="col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex"
              >
                <div className="w-100 h-100">
                  <CardComponent {...{ [viewKey.slice(0, -1)]: item }} />
                </div>
              </div>
            ))
        ) : (
          <div className="col-12">
            <div
              className="glass-card p-5 text-center rounded-4 d-flex flex-column justify-content-center align-items-center"
              style={{ minHeight: "250px" }}
            >
              {emptyIcon}
              <h5>{emptyTitle}</h5>
              <p className="text-muted mb-0">{emptyText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* <SearchBar /> */}

      {(currentView === "all" || currentView === "doctors" || currentView === "hospitals") && (
        // <SectionWrapper
        //   title="Doctors"
        //   subtitle="Top rated doctors near you"
        //   viewKey="doctors"
        //   data={getFilteredDoctors()}
        //   CardComponent={DoctorCard}
        //   emptyIcon={<Stethoscope size={48} className="text-muted mb-3" />}
        //   emptyTitle="No Doctors Found"
        //   emptyText="Try adjusting your search criteria"
        // />
        <DoctorSearch view={currentView} />
      )}

      {/* {(currentView === "all" || currentView === "hospitals") && (
        // <SectionWrapper
        //   title="Hospitals"
        //   subtitle="Top healthcare facilities"
        //   viewKey="hospitals"
        //   data={getFilteredHospitals()}
        //   CardComponent={HospitalCard}
        //   emptyIcon={<Hotel size={48} className="text-muted mb-3" />}
        //   emptyTitle="No Hospitals Found"
        //   emptyText="Try adjusting your search criteria"
        // />
       <DoctorSearch view={currentView} />
      )} */}

      {(currentView === "all" || currentView === "beds") && (
        // <SectionWrapper
        //   title="Available Beds"
        //   subtitle="Real-time bed availability"
        //   viewKey="beds"
        //   data={getFilteredBeds()}
        //   CardComponent={BedCard}
        //   emptyIcon={<Bed size={48} className="text-muted mb-3" />}
        //   emptyTitle="No Beds Available"
        //   emptyText="Check back later for updates"
        // />
        <PatientFacilities />
      )}
    </>
  );
};

  return (

    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
  <Header />
  
  <div className="d-flex">
    {/* Desktop Sidebar - hidden on mobile */}
    <div className="d-none d-md-block">
      <Sidebar />
    </div>
    
    <main className="flex-grow-1 p-4" style={{ 
      transition: 'margin-left 0.3s ease'
    }}>
  <div className="d-block d-md-none">
  {/* Mobile Tab Navigation - 2x2 Grid with Cards */}
  <div className="p-3">
    <div className="row g-3">
      <div className="col-6">
        <button 
          className={`w-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
            currentView === 'all' 
              ? 'bg-primary text-white shadow border-0' 
              : 'bg-white text-dark border shadow-sm hover:shadow'
          }`}
          onClick={() => handleViewChange('all')}
          style={{ border: 'none', outline: 'none', minHeight: '100px' }}
        >
          <Home size={28} className={currentView === 'all' ? 'text-white' : 'text-primary'} />
          <span className="fw-medium">All</span>
          <small className={currentView === 'all' ? 'text-white-50' : 'text-muted'}>
            Browse all
          </small>
        </button>
      </div>
      
      <div className="col-6">
        <button 
          className={`w-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
            currentView === 'doctors' 
              ? 'bg-primary text-white shadow border-0' 
              : 'bg-white text-dark border shadow-sm hover:shadow'
          }`}
          onClick={() => handleViewChange('doctors')}
          style={{ border: 'none', outline: 'none', minHeight: '100px' }}
        >
          <Stethoscope size={28} className={currentView === 'doctors' ? 'text-white' : 'text-primary'} />
          <span className="fw-medium">Doctors</span>
          <small className={currentView === 'doctors' ? 'text-white-50' : 'text-muted'}>
            {getFilteredDoctors().length} available
          </small>
        </button>
      </div>
      
      <div className="col-6">
        <button 
          className={`w-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
            currentView === 'hospitals' 
              ? 'bg-primary text-white shadow border-0' 
              : 'bg-white text-dark border shadow-sm hover:shadow'
          }`}
          onClick={() => handleViewChange('hospitals')}
          style={{ border: 'none', outline: 'none', minHeight: '100px' }}
        >
          <Hotel size={28} className={currentView === 'hospitals' ? 'text-white' : 'text-primary'} />
          <span className="fw-medium">Hospitals</span>
          <small className={currentView === 'hospitals' ? 'text-white-50' : 'text-muted'}>
            {getFilteredHospitals().length} facilities
          </small>
        </button>
      </div>
      
      <div className="col-6">
        <button 
          className={`w-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all ${
            currentView === 'beds' 
              ? 'bg-primary text-white shadow border-0' 
              : 'bg-white text-dark border shadow-sm hover:shadow'
          }`}
          onClick={() => handleViewChange('beds')}
          style={{ border: 'none', outline: 'none', minHeight: '100px' }}
        >
          <Bed size={28} className={currentView === 'beds' ? 'text-white' : 'text-primary'} />
          <span className="fw-medium">Beds</span>
          <small className={currentView === 'beds' ? 'text-white-50' : 'text-muted'}>
            {getFilteredBeds().length} available
          </small>
        </button>
      </div>
    </div>
  </div>

  <style>{`
    .transition-all {
      transition: all 0.2s ease-in-out;
    }
    .hover\\:shadow:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    .text-white-50 {
      color: rgba(255, 255, 255, 0.7) !important;
    }
  `}</style>
</div>
      <div className="container-fluid">
        {renderMainContent()}
      </div>
    </main>
  </div>

  <ContactSection />
  <Footer />

  <style>{`
    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .glass-card-light {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hover-card {
      transition: all 0.3s ease;
    }
    
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important;
    }
    
    .hover-lift {
      transition: all 0.3s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    /* Removed conflicting sidebar styles */
    
    .nav-link {
      border-radius: 16px;
      padding: 12px 15px;
      transition: all 0.3s ease;
      color: #495057;
    }
    
    .nav-link:hover {
      background-color: rgba(102, 126, 234, 0.1);
      transform: translateX(5px);
    }
    
    .nav-link.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
    
    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .nav-link.active .icon-circle {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    .doctor-detail-view,
    .hospital-detail-view,
    .bed-detail-view {
      animation: fadeInUp 0.4s ease;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .avatar-glow {
      position: relative;
    }
    
    .avatar-glow::after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 24px;
      opacity: 0.3;
      z-index: -1;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.05);
      }
    }
    
    .badge {
      font-weight: 500;
      letter-spacing: 0.3px;
    }
    
    .form-control,
    .form-select {
      border-radius: 16px;
      border: none;
      background: rgba(255, 255, 255, 0.9);
    }
    
    .form-control:focus,
    .form-select:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
      border-radius: 16px;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
    }
    
    .btn-outline-primary {
      border-color: #667eea;
      color: #667eea;
      transition: all 0.3s ease;
      border-radius: 16px;
    }
    
    .btn-outline-primary:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      transform: translateY(-2px);
      color: white;
    }
    
    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .rounded-4 {
      border-radius: 20px;
    }
    
    .rounded-5 {
      border-radius: 30px;
    }
    
    /* Updated media query - removed conflicting styles */
    @media (max-width: 768px) {
      .display-5 {
        font-size: 2rem;
      }
      
      /* Optional: Add some mobile-specific adjustments */
      .btn {
        white-space: nowrap;
      }
    }
    
    /* Smooth scrolling */
    * {
      scroll-behavior: smooth;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #764ba2, #667eea);
    }
  `}</style>
</div>
  );
};

// Add missing Trophy icon
const Trophy = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

export default HomeLogin;