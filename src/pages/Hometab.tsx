import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Calculator, 
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
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
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




const Hometab: React.FC = () => {
   const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('doctors');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [expandedFacilityId, setExpandedFacilityId] = useState<string | null>(null);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  // Bed bookings state
  const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

  const checkIfPatient = async (userId: string) => {
  try {
    // Check if user exists in patients table
    const { data, error } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle(); 
    
    return !!data; // Returns true if patient exists
  } catch (error) {
    console.error('Error checking patient status:', error);
    return false;
  }
};

  useEffect(() => {
    
    fetchDoctors();
    fetchFacilityDetails();
    fetchBedBookings(); // Add this to fetch bed bookings
  }, []);

  useEffect(() => {
  checkUser();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user || null);
  });
  
  return () => {
    subscription?.unsubscribe();
  };
}, []);

  //  useEffect(() => {
  //   checkUser();
  //   const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     setUser(session?.user || null);
  //   });
    
  //   return () => {
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, []);
  const PatientProtectedButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  path?:string;
}> = ({ onClick, children, className,path }) => {
  const [isPatient, setIsPatient] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // if (!user) {
    //   navigate('/appointment');
    //   // navigate('/homelogin');
    //   return;
    // }
      if (!user) {
      // If not logged in, navigate to the appropriate appointment view
      if (path) {
        navigate(path); // Use the provided path
      } else {
        navigate('/appointment'); // Default fallback
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        onClick(); // Patient can proceed
      } else {
          if (path) {
          navigate(path);
        } else {
          navigate('/appointment');
        }
        // navigate('/appointment');
        // navigate('/homelogin');
      }
    } catch (error) {
      console.error('Error verifying patient:', error);
      toast({
        title: "Unable to verify account type",
        description: "Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={className} 
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? 'Verifying...' : children}
    </button>
  );
};

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  // const handleNavigation = async (path: string, requiresAuth: boolean = true) => {
  //   if (requiresAuth && !user) {
  //     navigate('/homelogin');
  //     // navigate('/login/patient');

  //      if (user) {
  //   const isPatient = await checkIfPatient(user.id);
    
  //   // If they are a doctor or facility staff, prevent booking navigation
  //   if (!isPatient) {
  //     // Show an alert or toast message
  //     alert('Only patients can book appointments and beds. Please login with a patient account.');
  //     return;
  //   }
  // }

  //   } else {
  //     navigate(path);
  //   }
  // };
const handleNavigation = async (path: string, requiresAuth: boolean = true) => {
  if (requiresAuth) {
    // if (!user) {
    //   navigate('/appointment');
    //   // navigate('/homelogin');
    //   return;
    // }
  if (!user) {
      // If not logged in, navigate to the appropriate appointment view
      if (path) {
        navigate(path); // Use the provided path
      } else {
        navigate('/appointment'); // Default fallback
      }
      return;
    }
    // Check if user is a patient for booking-related paths
    if (path.includes('book') || path.includes('bed') || path.includes('doctor/')) {
      const isPatient = await checkIfPatient(user.id);
      if (!isPatient) {
        toast({
          title: "Access Denied",
          description: "Only patients can book appointments and beds. Please login with a patient account."
        });
        return;
      }
    }
  }
  
  navigate(path);
};
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
        // Add mock contact info for demo
        const enhancedFacilities = facilitiesData.map(facility => ({
          ...facility,
          contact_number: "+1 234-567-890" + Math.floor(Math.random() * 10),
          email: `info@${facility.facility_name.toLowerCase().replace(/\s+/g, '')}.com`,
          facilities: ["Emergency", "ICU", "Pharmacy", "Laboratory"]
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
            setDepartments(departmentsData);
            setFilteredDepartments(departmentsData);
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
      // First fetch beds
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

      // Get unique ward IDs
      const wardIds = [...new Set(bedsData.map(bed => bed.ward_id).filter(Boolean))];
      
      if (wardIds.length === 0) {
        setBedBookings([]);
        return;
      }
      
      // Fetch wards with their facilities
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

      // Create a map for quick lookup
      const wardMap = new Map(wardsData?.map(ward => [ward.id, ward]));

      // Transform the data
      const transformedData = bedsData.map(bed => {
        const ward = wardMap.get(bed.ward_id) || {};
        const facility = ward.facilities || {};
        
        // Generate random patient data for occupied beds
        const isOccupied = bed.current_status === 'occupied';
        
        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          bedType: bed.bed_type,
          roomNumber: bed.room_number,
          floorNumber: bed.floor_number,
          wing: bed.wing,
          status: bed.current_status,
          // availability: bed.current_status,
          availability: bed.current_status === 'available' ? 'Occupied' : 'Available',
          hasOxygen: bed.has_oxygen || false,
          hasVentilator: bed.has_ventilator || false,
          isIsolation: bed.is_isolation || false,
          updated_at: bed.updated_at || bed.created_at,
          
          // Ward details
          wardId: ward.id,
          wardName: ward.name || 'Unknown Ward',
          wardCode: ward.ward_code,
          wardType: ward.ward_type,
          
          // Facility details
          facilityId: facility.id,
          facilityName: facility.facility_name || 'Unknown Facility',
          city: facility.city || 'N/A',
          state: facility.state || 'N/A',
          facilityType: facility.facility_type,
          
          // Patient data (only for occupied beds)
          ...(isOccupied && {
            patientName: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Brown'][Math.floor(Math.random() * 5)],
            patientAge: Math.floor(Math.random() * 60) + 18,
            doctor: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'][Math.floor(Math.random() * 5)],
            department: ward.ward_type || 'General',
            pricePerDay: Math.floor(Math.random() * 500) + 100,
            bookingDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            dischargeDate: Math.random() > 0.6 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : null
          })
        };
      });

      setBedBookings(transformedData);
    } catch (error) {
      console.error("Error fetching bed bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredDoctors = doctors
    .filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getFacilityDepartments = (facilityId: string) => {
    return departments.filter(dept => dept.facility_id === facilityId);
  };

  const getAvailableBeds = (facilityId: string) => {
    const facilityDepts = getFacilityDepartments(facilityId);
    const totalAvailable = facilityDepts.reduce((sum, dept) => sum + (dept.available_beds || 0), 0);
    return totalAvailable;
  };

  const getTotalBeds = (facilityId: string) => {
    const facilityDepts = getFacilityDepartments(facilityId);
    const totalCapacity = facilityDepts.reduce((sum, dept) => sum + (dept.bed_capacity || 0), 0);
    return totalCapacity || 100; // Default if no data
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: any }> = {
      available: { class: 'bg-success', icon: CheckCircle },
      occupied: { class: 'bg-warning', icon: AlertCircle },
      maintenance: { class: 'bg-danger', icon: XCircle },
      reserved: { class: 'bg-info', icon: Clock },
      confirmed: { class: 'bg-success', icon: CheckCircle },
      pending: { class: 'bg-warning', icon: AlertCircle },
      cancelled: { class: 'bg-danger', icon: XCircle }
    };
    // return badges[status] || { class: 'bg-secondary', icon: AlertCircle };
     
  const badge = badges[status.toLowerCase()] || { class: 'bg-secondary', icon: AlertCircle };
  return badge;
  };

  const getAvailabilityColor = (availability: string) => {
    return availability === 'Available' ? 'text-success' : 'text-danger';
  };

  const renderDoctorsTab = () => (
    <div className="doctors-tab">
      {/* Search and Filter Section */}
      {/* <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={20} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search doctors by name, specialty, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select">
                <option value="">All Specialties</option>
                <option>Cardiologist</option>
                <option>Neurologist</option>
                <option>Pediatrician</option>
                <option>Dermatologist</option>
                <option>Orthopedic</option>
              </select>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      {/* <div className="row mb-4">
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 shadow-sm bg-gradient-primary">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="text-white mb-1">Total Doctors</h6>
                  <h3 className="text-white mb-0">{doctors.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 shadow-sm bg-gradient-success">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                  <Activity className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="text-white mb-1">Specialties</h6>
                  <h3 className="text-white mb-0">12+</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 shadow-sm bg-gradient-info">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="text-white mb-1">Available Today</h6>
                  <h3 className="text-white mb-0">24</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 shadow-sm bg-gradient-warning">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="text-white mb-1">Avg Rating</h6>
                  <h3 className="text-white mb-0">4.8 ★</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
    {filteredDoctors.length > 0 ? (
    filteredDoctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body p-4">
                    <div className="position-relative mb-4">
                      <div className="avatar-wrapper mx-auto">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          className="rounded-circle border border-3 border-primary p-1"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                      <span className="position-absolute top-0 start-50 translate-middle badge bg-success rounded-pill px-3 py-2">
                        {doctor.rating} ★
                      </span>
                    </div>
                    
                    <h5 className="card-title text-center mb-1">{doctor.name}</h5>
                    <p className="text-primary text-center mb-2">{doctor.specialty}</p>
                    
                    {/* <div className="d-flex justify-content-center mb-3">
                      <span className="badge bg-light text-dark px-3 py-2">
                        <Clock size={14} className="me-1" />
                        {doctor.experience}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Building2 size={14} className="text-muted me-2" />
                        <small className="text-muted">{doctor.hospital}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <MapPin size={14} className="text-muted me-2" />
                        <small className="text-muted">{doctor.location?.substring(0, 30)}...</small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`badge w-100 p-2 d-flex align-items-center justify-content-center gap-2 ${
                        doctor.availability === 'Available' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                      }`}>
                        <CalendarCheck size={16} />
                        <span>{doctor.availability}</span>
                      </span>
                    </div> */}
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted d-block">Consultation Fee</small>
                        <strong className="text-primary">${doctor.consultationFee}</strong>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Patients</small>
                        <strong>{doctor.patients}+</strong>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      {/* <button className="btn btn-primary d-flex justify-content-center align-items-center gap-2">
                        <Calculator size={18} />
                        <span>Book Appointment</span>
                      </button> */}
                      {/* <PatientProtectedButton className="btn btn-outline-primary d-flex justify-content-center align-items-center gap-2" onClick={() => handleNavigation(`/dashboard/patient/doctor/${doctor.id}`, true)}> */}
                      <PatientProtectedButton 
  className="btn btn-outline-primary d-flex justify-content-center align-items-center gap-2" 
  onClick={() => handleNavigation(`/dashboard/patient/doctor/${createSlug(doctor.name)}/${doctor.id}`, true)}
 path="/appointment/doctors"
>
                        <PersonStanding size={18} />
                        <span>View Profile</span>
                      </PatientProtectedButton>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No doctors found matching your search criteria.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

 const renderHospitalsTab = () => {
  // Apply filters
  let filtered = [...facilities];
  
  if (showVerifiedOnly) {
    filtered = filtered.filter(f => f.is_verified);
  }
  
  if (selectedCity) {
    filtered = filtered.filter(f => f.city === selectedCity);
  }
  
  // Apply sorting
  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'beds') {
    filtered.sort((a, b) => b.total_beds - a.total_beds);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.facility_name.localeCompare(b.facility_name));
  }

  // Get unique cities for filter
  const cities = [...new Set(facilities.map(f => f.city))];

  // Show only first 4 items
  const displayedHospitals = filtered.slice(0, 4);

  return (
    <div className="hospitals-tab">
      {/* Filters */}
      {/* <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by: Highest Rated</option>
                <option value="beds">Sort by: Most Beds</option>
                <option value="name">Sort by: Name</option>
              </select>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="verifiedOnly"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="verifiedOnly">
                  Show Verified Only
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Hospitals Grid */}
          <div className="row">
            {displayedHospitals.length > 0 ? (
              displayedHospitals.map((hospital) => {
                const availableBeds = getAvailableBeds(hospital.id);
                const totalBeds = getTotalBeds(hospital.id);
                const bedPercentage = (availableBeds / totalBeds) * 100;
                const facilityDepts = getFacilityDepartments(hospital.id);

                return (
                  <div key={hospital.id} className="col-md-6 col-lg-3 mb-3">
                    <div className="card h-100 border-0 shadow-sm hover-card">
                      {/* ... rest of your hospital card code ... */}
                      <div className="card-header bg-white border-0 pt-4 px-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title mb-1">{hospital.facility_name}</h5>
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-light text-dark">
                                {hospital.facility_type}
                              </span>
                              {hospital.is_verified && (
                                <span className="badge bg-success">
                                  <Shield size={12} className="me-1" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-warning d-flex align-items-center">
                            <Star size={16} fill="currentColor" />
                            <span className="ms-1 text-dark">{hospital.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-body pt-2">
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-muted me-2" />
                            <span className="text-muted small">
                              {hospital.city}, {hospital.state} - {hospital.pincode}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Phone size={16} className="text-muted me-2" />
                            <span className="text-muted small">{hospital.contact_number}</span>
                          </div>
                        </div>

                        {/* Bed Availability */}
                        {/* <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small fw-bold">Bed Availability</span>
                            <span className="small">
                              {availableBeds}/{totalBeds} Available
                            </span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${bedPercentage > 30 ? 'bg-success' : 'bg-warning'}`}
                              style={{ width: `${bedPercentage}%` }}
                            ></div>
                          </div>
                        </div> */}

                        {/* Departments Preview */}
                        {facilityDepts.length > 0 && (
                          <div className="mb-3">
                            <small className="text-muted d-block mb-2">Departments:</small>
                            <div className="d-flex flex-wrap gap-1">
                              {facilityDepts.slice(0, 3).map(dept => (
                                <span key={dept.id} className="badge bg-light text-dark">
                                  {dept.name}
                                </span>
                              ))}
                              {facilityDepts.length > 3 && (
                                <span className="badge bg-light text-dark">
                                  +{facilityDepts.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="d-flex gap-2 mt-3">
                          <PatientProtectedButton className="btn btn-primary flex-grow-1 btn-sm"   onClick={() => handleNavigation(`/dashboard/patient/facility/${createSlug(hospital.facility_name)}/${hospital.id}`, true)} path="/appointment/facility">
                            
                            View Details
                          </PatientProtectedButton>
                          <button className="btn btn-outline-primary btn-sm">
                            <Phone size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State Message
              <div className="col-12">
                <div className="alert alert-info text-center py-4">
                  <Building2 size={48} className="mx-auto mb-3 text-muted" />
                  <h5>No Hospitals Found</h5>
                  <p className="text-muted mb-0">
                    {showVerifiedOnly || selectedCity 
                      ? "No hospitals match your selected filters. Try adjusting your criteria."
                      : "There are no hospitals available at the moment."}
                  </p>
                </div>
              </div>
            )}
          </div>

         
        </>
      )}
    </div>
  );
};

  const renderBedBookingsTab = () => {
    const totalBookings = bedBookings.length;
    const availableBeds = bedBookings.filter(b => b.availability === 'Available').length;
    const occupiedBeds = bedBookings.filter(b => b.availability === 'Occupied').length;
    const totalRevenue = bedBookings.reduce((sum, b) => sum + (b.pricePerDay || 0), 0);

    return (
      <div className="bed-bookings-tab">
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 shadow-sm bg-primary text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                    <Bed size={24} />
                  </div>
                  <div>
                    <h6 className="text-white mb-1">Total Beds</h6>
                    <h3 className="text-white mb-0">{totalBookings}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 shadow-sm bg-success text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h6 className="text-white mb-1">Available Beds</h6>
                    <h3 className="text-white mb-0">{availableBeds}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 shadow-sm bg-warning text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h6 className="text-white mb-1">Occupied Beds</h6>
                    <h3 className="text-white mb-0">{occupiedBeds}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 shadow-sm bg-info text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h6 className="text-white mb-1">Est. Revenue</h6>
                    <h3 className="text-white mb-0">${totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Bookings Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

  {/* Title */}
  <h5 className="mb-0 fw-semibold">Bed Management</h5>

  {/* Search */}
  {/* <div className="input-group" style={{ maxWidth: "350px" }}>
    <span className="input-group-text bg-white border-end-0">
      <Search size={16} className="text-muted" />
    </span>
    <input
      type="text"
      className="form-control border-start-0"
      placeholder="Search beds by number, ward, facility..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div> */}

  {/* Button */}
  {/* <button className="btn btn-primary btn-sm d-flex align-items-center">
    <i className="bi bi-plus-circle me-2"></i>
    Add Bed Booking
  </button> */}

</div>

          </div>
          <div className="card-body">
            {loadingBookings ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>City</th>
                      <th>Hospital</th>
                      <th>Department/Ward</th>
                      <th>Bed Details</th>
                      <th>Ward Details</th>
                      <th>Room Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bedBookings.length > 0 ? (
                      bedBookings.map((booking) => {
                        const statusBadge = getStatusBadge(booking.status);
                        const StatusIcon = statusBadge.icon;
                        
                        return (
                          <tr key={booking.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <MapPin size={16} className="text-muted me-2" />
                                <span>{booking.city || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <strong>{booking.facilityName}</strong>
                              <br />
                              <small className="text-muted">{booking.facilityType}</small>
                            </td>
                            <td>
                              <div>
                                <strong>{booking.wardName || 'General Ward'}</strong>
                                <br />
                                <small className="text-muted">
                                  {booking.wardType} • Code: {booking.wardCode}
                                </small>
                                {booking.patientName && (
                                  <div className="mt-1">
                                    <small className="text-primary">
                                      Patient: {booking.patientName} ({booking.patientAge})
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className="badge bg-info text-dark">
                                  {booking.bedType}
                                </span>
                                <br />
                                <small className="text-muted">
                                  Bed: {booking.bedNumber}
                                  {booking.hasVentilator && ' • Ventilator'}
                                  {booking.hasOxygen && ' • O2'}
                                </small>
                                {booking.doctor && (
                                  <div className="mt-1">
                                    <small className="text-muted">Dr: {booking.doctor}</small>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className="badge bg-secondary">
                                  Floor {booking.floorNumber}
                                </span>
                                <br />
                                <small className="text-muted">
                                  Wing: {booking.wing || 'Main'}
                                  {booking.isIsolation && ' • Isolation'}
                                </small>
                              </div>
                            </td>
                            <td>
                              <strong>{booking.roomNumber || 'N/A'}</strong>
                            </td>
                            <td>
                              <span className={`badge ${statusBadge.class} d-inline-flex align-items-center gap-1`}>
                                <StatusIcon size={12} />
                                {booking.status}
                              </span>
                              <br />
                              <small className={getAvailabilityColor(booking.availability)}>
                                {booking.availability}
                              </small>
                              {booking.pricePerDay && (
                                <div className="mt-1">
                                  <small className="text-muted">${booking.pricePerDay}/day</small>
                                </div>
                              )}
                            </td>
                            <td>
                              <PatientProtectedButton className="btn btn-outline-primary d-flex justify-content-center align-items-center gap-2" onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(booking.facilityName)}/${booking.facilityId}/${booking.wardId}/${booking.id}`, true)}
                                 path="/appointment/beds">
                        <Bed size={18} />
                        <span>View Bed</span>
                      </PatientProtectedButton>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <div className="text-muted">
                            <p>No bed bookings found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      {/* <div className="bg-white border-bottom shadow-sm mb-4">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-primary mb-1 d-flex align-items-center">
                <HeartPulse size={40} className="me-3" />
                Healthcare Management System
              </h1>
              <p className="text-muted mb-0">
                Manage doctors, hospitals, and bed bookings efficiently
              </p>
            </div>
            <div className="d-flex gap-2">
              <div className="d-flex align-items-center gap-2">
                <PatientProtectedButton className="btn btn-outline-primary" onClick={() => handleNavigation('/dashboard/patient/search', true)} path="/appointment">
                  <i className="bi bi-person-circle me-2"></i>
                  View All
                </PatientProtectedButton>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container pb-5">
        {/* <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-0">
            <ul className="nav nav-tabs nav-fill" style={{ borderBottom: 'none' }}>
              <li className="nav-item">
                <button
                  className={`nav-link py-3 ${activeTab === 'doctors' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('doctors')}
                  style={{ border: 'none' }}
                >
                  <i className="bi bi-person-badge fs-5 d-block mb-1"></i>
                  <span className="fw-bold">Doctors</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-3 ${activeTab === 'hospitals' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('hospitals')}
                  style={{ border: 'none' }}
                >
                  <i className="bi bi-building fs-5 d-block mb-1"></i>
                  <span className="fw-bold">Hospitals</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-3 ${activeTab === 'bookings' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('bookings')}
                  style={{ border: 'none' }}
                >
                  <i className="bi bi-calendar-check fs-5 d-block mb-1"></i>
                  <span className="fw-bold">Bed Bookings</span>
                </button>
              </li>
            </ul>
          </div>
        </div> 
         <div className="tab-content">
          {activeTab === 'doctors' && renderDoctorsTab()}
          {activeTab === 'hospitals' && renderHospitalsTab()}
          {activeTab === 'bookings' && renderBedBookingsTab()}
        </div> */}
        <div>
  {/* Doctors Section - Blue Theme */}
<div className="mb-5">
  <div className="bg-primary bg-gradient text-white border-bottom shadow-sm mb-4">
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="t text-white"> Find Doctors / Specialists</h1>
        <PatientProtectedButton className="btn btn-light text-primary fw-bold" onClick={() => handleNavigation('/dashboard/patient/search', true)}  path="/appointment/doctors" >
          View All Doctors →
        </PatientProtectedButton>
      </div>
    </div>
  </div>
  {renderDoctorsTab()}
</div>

{/* Hospitals Section - Green Theme */}
<div className="mb-5">
  <div className="bg-success bg-gradient text-white border-bottom shadow-sm mb-4">
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="t text-white">Find Hospitals(Facitlity) / Services </h1>
        <PatientProtectedButton className="btn btn-light text-success fw-bold" onClick={() => handleNavigation('/dashboard/patient/search', true)} path="/appointment/facility">
          View All Hospitals →
        </PatientProtectedButton>
      </div>
    </div>
  </div>
  {renderHospitalsTab()}
</div>

{/* Bed Bookings Section - Purple Theme */}
<div className="mb-5">
  <div className="bg-purple bg-gradient text-white border-bottom shadow-sm mb-4" style={{ backgroundColor: '#6f42c1' }}>
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="t text-white">Find Bed </h1>
        <PatientProtectedButton className="btn btn-light" onClick={() => handleNavigation('/dashboard/patient/book/patient-facilities', true)} path="/appointment/beds">
  View All Bookings →
</PatientProtectedButton>
      </div>
    </div>
  </div>
  {renderBedBookingsTab()}
</div>
      </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important;
        }
        
        .nav-tabs .nav-link {
          border-radius: 0;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .nav-tabs .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white !important;
        }
        
        .nav-tabs .nav-link:not(.active):hover {
          background-color: #f8f9fa;
        }
        
        .card {
          border-radius: 15px;
          overflow: hidden;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
          transition: all 0.3s ease;
        }
        
        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          transform: translateY(-2px);
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-gradient-success {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
        
        .bg-gradient-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }
        
        .bg-gradient-warning {
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        }
        
        .badge {
          padding: 8px 12px;
          font-weight: 500;
        }
        
        .avatar-wrapper {
          position: relative;
          width: fit-content;
        }
        
        .table th {
          font-weight: 600;
          color: #495057;
          border-bottom-width: 1px;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .bg-success-light {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
        
        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Hometab;