// HomeLoginPage.tsx - Redesigned Version
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
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';
import PatientFacilities from '@/pages/patient/PatientFacilities';
import { toast } from '@/hooks/use-toast';
import DoctorSearch from '@/components/patient/DoctorSearch';
import DoctorHospitals from '@/components/patient/DoctorHospitals';

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

type ViewType = 'all' | 'doctors' | 'hospitals' | 'beds'|"doctorprofile";
type DetailViewType = 'doctor' | 'hospital' | 'bed' | null;

const HomeLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [detailView, setDetailView] = useState<DetailViewType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('all');
  const { view } = useParams();
  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
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

  useEffect(() => {
  if (view === 'doctors') {
    setCurrentView('doctors');
  } else if (view === 'hospitals') {
    setCurrentView('hospitals');
  } else if (view === 'beds') {
    setCurrentView('beds');
  } else {
    setCurrentView('all');
  }
}, [view]);

const handleViewChange = (view: ViewType) => {
  setCurrentView(view);
  setDetailView(null);
  setSelectedItem(null);

  if (view === 'all') {
    navigate(`/appointment`);
  } else if(view === "doctors") {
    navigate(`/appointment/doctors`);
  } else if(view === "hospitals") {
    navigate(`/appointment/facility`);
  } else if(view === "beds") {
    navigate(`/appointment/beds`);
  } else if(view === "doctorprofile") {
    navigate(`/appointment/doctorprofile`);
  } else {
    navigate(`/appointment/`);
  }
};

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
      // navigate('/');
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
    navigate(`/appointment/${view}`);
    // navigate('/homelogin');
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
  // const handleViewChange = (view: ViewType) => {
  //   setCurrentView(view);
  //   setDetailView(null);
  //   setSelectedItem(null);
  // };

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
          {/* <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => handleViewChange('all')}
          >
            <div className={`icon-circle ${currentView === 'all' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Home size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">All</span>}
          </button> */}
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'doctors' ? 'active' : ''}`}
            onClick={() => handleViewChange('doctors')}
          >
            <div className={`icon-circle ${currentView === 'doctors' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Stethoscope size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Find Doctors / Specialists</span>}
          </button>
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'hospitals' ? 'active' : ''}`}
            onClick={() => handleViewChange('hospitals')}
          >
            <div className={`icon-circle ${currentView === 'hospitals' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Hotel size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Find Hospitals(Facilities) / Services</span>}
          </button>
          
          <button 
            className={`nav-link text-start d-flex align-items-center gap-3 py-3 rounded-4 ${currentView === 'beds' ? 'active' : ''}`}
            onClick={() => handleViewChange('beds')}
          >
            <div className={`icon-circle ${currentView === 'beds' ? 'bg-white bg-opacity-20' : 'bg-light'} p-2 rounded-3`}>
              <Bed size={20} />
            </div>
            {sidebarOpen && <span className="fw-medium">Find Beds</span>}
          </button>
        </div>

        {/* {sidebarOpen && (
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
        )} */}
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

  const renderMainContent = () => {


  return (
    <>
      {/* <SearchBar /> */}

      {(currentView === "all" || currentView === "doctors" || currentView === "hospitals") && (
        
        <DoctorSearch view={currentView} />
      )}

      {(currentView === "all" || currentView === "beds") && (
        
        <PatientFacilities view={currentView}/>
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

export default HomeLoginPage;