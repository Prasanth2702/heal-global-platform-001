import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bed, 
  Home, 
  MapPin, 
  ChevronRight, 
  Activity, 
  Wind, 
  Shield, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Building2,
  Stethoscope,
  Pill,
  Ambulance,
  HeartPulse,
  Syringe,
  Microscope,
  Bone,
  Brain,
  Eye,
  Ear,
  Baby,
  Calendar,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, format, isBefore, startOfDay, isWithinInterval } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Country, State, City } from "country-state-city";

interface Facility {
  id: string;
  admin_user_id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: string;
  additional_services: Record<string, any>;
  rating: number | null;
  total_reviews: number | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
  established_year: number | null;
  website: string | null;
  insurance_partners: string | null;
  departments: Record<string, any>;
  total_beds: number;
  about_facility: string | null;
  city: string;
  state: string;
  pincode: number;
  available_beds?: number;
  wards?: Ward[];
  unique_ward_types?: string[];
}

interface Ward {
  id: string;
  name: string;
  ward_code: string;
  ward_type: string;
  floor_number: number;
  wing: string;
  facility_id: string;
  total_beds: number;
  available_beds?: number;
  beds?: Bed[];
}

interface Bed {
  id: string;
  bed_number: string;
  bed_type: string;
  room_number: string;
  floor_number: number;
  wing: string;
  current_status: string;
  has_oxygen: boolean;
  has_ventilator: boolean;
  is_isolation: boolean;
  price_per_day?: number;
  ward_id: string;
  created_at: string;
}

interface BedBooking {
  id: string;
  bed_id: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  status: string;
  patient_id: string;
}

interface FilterState {
  searchText: string;
  city: string;
  department: string;
  facilityType: string;
  hasOxygen: boolean;
  hasVentilator: boolean;
  isIsolation: boolean;
}

interface PatientFacilitiesProps {
  view: "all" | "beds";
}

const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [showWardDetails, setShowWardDetails] = useState(false);
  const [showBedDetails, setShowBedDetails] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
  const [indianCities, setIndianCities] = useState<string[]>([]);
const [showDatePicker, setShowDatePicker] = useState(false);
const [dateFilteredFacilities, setDateFilteredFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    city: '',
    department: '',
    facilityType: '',
    hasOxygen: false,
    hasVentilator: false,
    isIsolation: false
  });
  
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [availableFacilityTypes, setAvailableFacilityTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [bedTypeFilter, setBedTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("availability");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dbWards, setDbWards] = useState<Ward[]>([]);
  const [dbBeds, setDbBeds] = useState<Bed[]>([]);
  const [bedBookingsData, setBedBookingsData] = useState<any[]>([]);

  // Common department types in hospitals
  const commonDepartments = [
    'General Ward',
    'ICU',
    'CCU',
    'NICU',
    'PICU',
    'Emergency',
    'Operation Theatre',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Oncology',
    'Nephrology',
    'Pulmonology',
    'Gastroenterology',
    'Dermatology',
    'Psychiatry',
    'ENT',
    'Ophthalmology',
    'Dental',
    'Physiotherapy',
    'Radiology',
    'Laboratory'
  ];

  const facilityTypeIcons: Record<string, any> = {
    'Hospital': Building2,
    'Clinic': Stethoscope,
    'Nursing Home': Home,
    'Diagnostic Center': Microscope,
    'Rehabilitation Center': HeartPulse,
    'Mental Health Facility': Brain,
    'Maternity Home': Baby,
    'Hospice': HeartPulse,
    'Emergency Center': Ambulance,
    'Surgical Center': Syringe
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
useEffect(() => {
  filterFacilitiesByDate();
}, [selectedDate, filteredFacilities]);

const filterFacilitiesByDate = async () => {
  if (!filteredFacilities.length) {
    setDateFilteredFacilities([]);
    return;
  }

  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(0, 0, 0, 0);

  // For each facility, check if any beds are available on the selected date
  const facilitiesWithAvailability = await Promise.all(
    filteredFacilities.map(async (facility) => {
      // Get all wards for this facility
      const facilityWards = facility.wards || [];
      
      // Check each ward for available beds on the selected date
      let hasAvailableBeds = false;
      
      for (const ward of facilityWards) {
        const wardBeds = ward.beds || [];
        
        for (const bed of wardBeds) {
          // Fetch bookings for this bed
          const { data: bookings } = await supabase
            .from('bed_bookings')
            .select('*')
            .eq('assigned_bed_id', bed.id);
          
          // Check if bed is available on selected date
          const isAvailable = checkBedAvailabilityOnDate(bookings || [], selectedDateTime);
          
          if (isAvailable) {
            hasAvailableBeds = true;
            break;
          }
        }
        
        if (hasAvailableBeds) break;
      }
      
      return {
        ...facility,
        hasAvailableBedsOnDate: hasAvailableBeds
      };
    })
  );
  
  // Filter facilities that have at least one bed available on the selected date
  const availableFacilities = facilitiesWithAvailability.filter(f => f.hasAvailableBedsOnDate);
  setDateFilteredFacilities(availableFacilities);
};

// Helper function to check bed availability based on bookings
const checkBedAvailabilityOnDate = (bookings: any[], checkDate: Date) => {
  // Check if there's any booking that overlaps with the selected date
  const isBooked = bookings.some(booking => {
    const status = booking.status?.toLowerCase();
    
    // Skip cancelled bookings
    if (status === 'cancelled') return false;
    
    // Handle occupied beds
    if (status === 'occupied') {
      let admissionDate = null;
      let dischargeDate = null;
      
      if (booking.actual_admission_time) {
        admissionDate = new Date(booking.actual_admission_time);
      } else if (booking.expected_admission_date) {
        admissionDate = new Date(booking.expected_admission_date);
      }
      
      if (booking.actual_discharge_time) {
        dischargeDate = new Date(booking.actual_discharge_time);
      } else if (booking.expected_discharge_date) {
        dischargeDate = new Date(booking.expected_discharge_date);
      }
      
      if (!admissionDate) return false;
      
      admissionDate.setHours(0, 0, 0, 0);
      dischargeDate?.setHours(0, 0, 0, 0);
      
      // If discharged, bed is available
      if (booking.actual_discharge_time) {
        const actualDischarge = new Date(booking.actual_discharge_time);
        actualDischarge.setHours(0, 0, 0, 0);
        
        if (checkDate >= actualDischarge) {
          return false;
        }
      }
      
      // Check if date falls within stay period
      if (dischargeDate) {
        return checkDate >= admissionDate && checkDate <= dischargeDate;
      }
      
      return checkDate >= admissionDate;
    }
    
    // Handle confirmed or pending bookings
    if (booking.expected_admission_date && booking.expected_discharge_date) {
      const admissionDate = new Date(booking.expected_admission_date);
      const dischargeDate = new Date(booking.expected_discharge_date);
      
      admissionDate.setHours(0, 0, 0, 0);
      dischargeDate.setHours(0, 0, 0, 0);
      
      // Bed is booked if selected date is between admission and discharge dates
      return checkDate >= admissionDate && checkDate <= dischargeDate;
    }
    
    return false;
  });
  
  // Bed is available if no conflicting bookings found
  return !isBooked;
};

  // Fetch bed bookings for selected facility
  useEffect(() => {
    const fetchBedBookings = async () => {
      if (!selectedFacility) return;
      
      try {
        setLoadingBookings(true);
        const { data, error } = await supabase
          .from('bed_bookings')
          .select('*')
          .eq('facility_id', selectedFacility.id);
        
        if (error) throw error;
        setBedBookingsData(data || []);
      } catch (error) {
        console.error('Error fetching bed bookings:', error);
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchBedBookings();
  }, [selectedFacility]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, []);

  // useEffect(() => {
  //   const india = Country.getAllCountries().find(country => country.isoCode === 'IN');
  //   if (india) {
  //     const allIndianCities = City.getCitiesOfCountry('IN') || [];
  //     const cityNames = allIndianCities.map(city => city.name).sort();
  //     setIndianCities(cityNames);
  //   }
  // }, []);

  useEffect(() => {
    applyFilters();
  }, [facilities, filters]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*");

      if (facilityError) throw facilityError;

      if (!facilityData) {
        setFacilities([]);
        setFilteredFacilities([]);
        return;
      }

      const facilityIds = facilityData.map(f => f.id);
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .select("*")
        .in("facility_id", facilityIds);

      if (wardsError) throw wardsError;

      const wardIds = wardsData?.map(w => w.id) || [];
      let bedsData: any[] = [];
      
      if (wardIds.length > 0) {
        const { data: bedsResult, error: bedsError } = await supabase
          .from("beds")
          .select("*")
          .in("ward_id", wardIds)
          .eq("is_active", true);

        if (bedsError) throw bedsError;
        bedsData = bedsResult || [];
      }

      const bedsByWard: Record<string, Bed[]> = {};
      bedsData.forEach(bed => {
        if (!bedsByWard[bed.ward_id]) {
          bedsByWard[bed.ward_id] = [];
        }
        bedsByWard[bed.ward_id].push({
          ...bed,
          bed_number: bed.bed_number,
          bed_type: bed.bed_type,
          room_number: bed.room_number,
          floor_number: bed.floor_number,
          wing: bed.wing,
          current_status: bed.current_status,
          created_at: bed.created_at,
          has_oxygen: bed.has_oxygen,
          has_ventilator: bed.has_ventilator,
          is_isolation: bed.is_isolation,
          price_per_day: Math.floor(Math.random() * 500) + 100
        });
      });

      const wardsWithBeds: Ward[] = (wardsData || []).map(ward => {
        const wardBeds = bedsByWard[ward.id] || [];
        const availableBeds = wardBeds.filter(bed => bed.current_status === 'AVAILABLE').length;
        
        return {
          ...ward,
          beds: wardBeds,
          total_beds: wardBeds.length,
          available_beds: availableBeds
        };
      });

      const wardsByFacility: Record<string, Ward[]> = {};
      wardsWithBeds.forEach(ward => {
        if (!wardsByFacility[ward.facility_id]) {
          wardsByFacility[ward.facility_id] = [];
        }
        wardsByFacility[ward.facility_id].push(ward);
      });

      const facilitiesWithDetails = facilityData.map(facility => {
        const facilityWards = wardsByFacility[facility.id] || [];
        const totalAvailableBeds = facilityWards.reduce((sum, ward) => sum + (ward.available_beds || 0), 0);
        const totalBeds = facilityWards.reduce((sum, ward) => sum + (ward.total_beds || 0), 0);
        const uniqueWardTypes = [...new Set(facilityWards.map(ward => ward.ward_type))];
        
        return {
          ...facility,
          wards: facilityWards,
          available_beds: totalAvailableBeds,
          total_beds: totalBeds || facility.total_beds,
          unique_ward_types: uniqueWardTypes
        };
      });

      setFacilities(facilitiesWithDetails);
      
      const cities = [...new Set(facilitiesWithDetails.map(f => f.city).filter(Boolean))];
      const facilityTypes = [...new Set(facilitiesWithDetails.map(f => f.facility_type).filter(Boolean))];
      const departments = [...new Set(facilitiesWithDetails.flatMap(f => f.unique_ward_types || []))];
      
      setAvailableCities(cities.sort());
      setAvailableFacilityTypes(facilityTypes.sort());
      setAvailableDepartments(departments.sort());
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch facilities");
      console.error("Error fetching facilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...facilities];

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(facility => 
        facility.facility_name.toLowerCase().includes(searchLower) ||
        facility.address?.toLowerCase().includes(searchLower) ||
        facility.city?.toLowerCase().includes(searchLower) ||
        facility.state?.toLowerCase().includes(searchLower) ||
        facility.facility_type?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.city) {
      filtered = filtered.filter(facility => 
        facility.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    if (filters.facilityType) {
      filtered = filtered.filter(facility => 
        facility.facility_type?.toLowerCase() === filters.facilityType.toLowerCase()
      );
    }

    if (filters.department) {
      filtered = filtered.filter(facility => 
        facility.unique_ward_types?.some(type => 
          type.toLowerCase().includes(filters.department.toLowerCase())
        )
      );
    }

    if (filters.hasOxygen || filters.hasVentilator || filters.isIsolation) {
      filtered = filtered.filter(facility => {
        return facility.wards?.some(ward => 
          ward.beds?.some(bed => 
            (!filters.hasOxygen || bed.has_oxygen) &&
            (!filters.hasVentilator || bed.has_ventilator) &&
            (!filters.isIsolation || bed.is_isolation)
          )
        );
      });
    }

    setFilteredFacilities(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      city: '',
      department: '',
      facilityType: '',
      hasOxygen: false,
      hasVentilator: false,
      isIsolation: false
    });
  };

  const handleViewWards = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowWardDetails(true);
    setShowBedDetails(false);
  };

  const handleBack = () => {
    if (showBedDetails) {
      setShowBedDetails(false);
    } else if (showWardDetails) {
      setShowWardDetails(false);
      setSelectedFacility(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: any }> = {
      available: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      occupied: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      maintenance: { class: 'bg-red-100 text-red-800', icon: XCircle },
      reserved: { class: 'bg-blue-100 text-blue-800', icon: Clock },
      confirmed: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      cancelled: { class: 'bg-red-100 text-red-800', icon: XCircle },
      AVAILABLE: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      OCCUPIED: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      MAINTENANCE: { class: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const badge = badges[status?.toLowerCase()] || { class: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    return badge;
  };

  const checkIfPatient = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle(); 
      
      return !!data;
    } catch (error) {
      console.error('Error checking patient status:', error);
      return false;
    }
  };

  const handleNavigation = async (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth) {
      if (!user) {
        if (path) {
          navigate(path);
        } else {
          navigate('/appointment');
        }
        return;
      }
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
  
  const PatientProtectedButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    path?: string;
  }> = ({ onClick, children, className, path }) => {
    const [loading, setLoading] = useState(false);
  
    const handleClick = async () => {
      if (!user) {
        if (path) {
          navigate(path);
        } else {
          navigate('/appointment');
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
          onClick();
        } else {
          if (path) {
            navigate(path);
          } else {
            navigate('/appointment');
          }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading facilities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
        <button
          onClick={fetchFacilities}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (showWardDetails && selectedFacility) {
    // Flatten all beds from all wards for display
    const allBeds = selectedFacility.wards?.flatMap(ward => 
      ward.beds?.map(bed => ({
        id: bed.id,
        bedNumber: bed.bed_number,
        bedType: bed.bed_type,
        roomNumber: bed.room_number,
        floorNumber: bed.floor_number,
        wing: bed.wing,
        status: bed.current_status,
        availability: bed.current_status === 'AVAILABLE' ? 'Available' : 'Not Available',
        hasOxygen: bed.has_oxygen,
        hasVentilator: bed.has_ventilator,
        isIsolation: bed.is_isolation,
        wardId: ward.id,
        wardName: ward.name,
        wardCode: ward.ward_code,
        wardType: ward.ward_type,
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.facility_name,
        city: selectedFacility.city,
        state: selectedFacility.state,
        facilityType: selectedFacility.facility_type,
        pricePerDay: bed.price_per_day,
        created_at: bed.created_at,
        bookings: bedBookingsData?.filter(booking => booking.assigned_bed_id === bed.id) || []
      })) || []
    ) || [];

    // Use the selected date for availability check
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(0, 0, 0, 0);

    // Filter beds available on selected date using bedBookings
    // const bedsAvailableOnDate = allBeds.filter(bed => {
    //   // Check bookings for this bed
    //   const overlappingBookings = bed.bookings.filter((booking: any) => {
    //     if (!booking.expected_admission_date || !booking.expected_discharge_date) return false;
        
    //     const admissionDate = new Date(booking.expected_admission_date);
    //     admissionDate.setHours(0, 0, 0, 0);
    //     const dischargeDate = new Date(booking.expected_discharge_date);
    //     dischargeDate.setHours(0, 0, 0, 0);
        
    //     // Bed is occupied if selected date is between admission and discharge dates (excluding discharge date)
    //     return selectedDateTime >= admissionDate && selectedDateTime < dischargeDate;
    //   });
      
    //   // Bed is available if no overlapping bookings
    //   return overlappingBookings.length === 0;
    // });

const bedsAvailableOnDate = allBeds.filter((bed) => {
  const bookings = bed.bookings || [];

  const isBlocked = bookings.some((booking: any) => {
    const status = booking.status?.toLowerCase();

    // ❌ Ignore RESERVED completely (your rule)
    if (status === "reserved") return false;

    let admissionDate = null;
    let dischargeDate = null;

    // 🔴 OCCUPIED → use ACTUAL dates (priority)
    if (status === "occupied") {
      if (booking.actual_admission_time) {
        admissionDate = new Date(booking.actual_admission_time);
      } else if (booking.expected_admission_date) {
        admissionDate = new Date(booking.expected_admission_date);
      }

      if (booking.actual_discharge_time) {
        dischargeDate = new Date(booking.actual_discharge_time);
      } else if (booking.expected_discharge_date) {
        dischargeDate = new Date(booking.expected_discharge_date);
      }

      if (!admissionDate) return false;

      admissionDate.setHours(0, 0, 0, 0);
      dischargeDate?.setHours(0, 0, 0, 0);

      // ✅ If discharged → AVAILABLE again
      if (booking.actual_discharge_time) {
        const actualDischarge = new Date(booking.actual_discharge_time);
        actualDischarge.setHours(0, 0, 0, 0);

        if (selectedDateTime >= actualDischarge) {
          return false;
        }
      }

      // ❌ BLOCK if inside stay period
      if (dischargeDate) {
        return (
          selectedDateTime >= admissionDate &&
          selectedDateTime <= dischargeDate
        );
      }

      // no discharge → still occupied
      return selectedDateTime >= admissionDate;
    }

    // 🟡 OTHER BOOKINGS (CONFIRMED / PENDING)
    if (booking.expected_admission_date && booking.expected_discharge_date) {
      const admissionDate = new Date(booking.expected_admission_date);
      const dischargeDate = new Date(booking.expected_discharge_date);

      admissionDate.setHours(0, 0, 0, 0);
      dischargeDate.setHours(0, 0, 0, 0);

      // 👉 BEFORE admission → AVAILABLE
      if (selectedDateTime < admissionDate) return false;

      // ❌ DURING → BLOCK
      return (
        selectedDateTime >= admissionDate &&
        selectedDateTime <= dischargeDate
      );
    }

    return false;
  });

  // ✅ Final: show only available beds
  return !isBlocked;
});



    // Also keep the original availableBeds for "bookings" tab
    const availableBeds = allBeds.filter(bed => bed.status === 'AVAILABLE');

    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
        >
          ← Back to Facilities
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">{selectedFacility.facility_name}</h2>
          <p className="text-gray-600 mb-4">{selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} - {selectedFacility.pincode}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold">{selectedFacility.total_beds}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600">Available Beds</p>
              <p className="text-3xl font-bold text-green-600">{selectedFacility.available_beds || 0}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Occupied Beds</p>
              <p className="text-2xl font-bold text-red-600">
                {(selectedFacility.total_beds || 0) - (selectedFacility.available_beds || 0)}
              </p>
            </div>
          </div>

          {selectedFacility.unique_ward_types && selectedFacility.unique_ward_types.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Departments/Wards:</p>
              <div className="flex flex-wrap gap-2">
                {selectedFacility.unique_ward_types.map((type, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Beds Section */}
        {allBeds.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-700 flex items-center">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <CheckCircle size={20} className="text-green-600" />
                </span>
                Bed Availability
              </h3>
              <span className="text-sm text-gray-500">Check availability by date</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Filters and Stats */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Quick Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Selected Date</Label>
                      <div className="border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) =>
                            isBefore(date, startOfDay(new Date()))
                          }
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Beds and Bookings */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    {/* <TabsList>
                      <TabsTrigger value="availability">
                        Bed Availability
                      </TabsTrigger>
                      <TabsTrigger value="bookings">
                        All Bed Bookings
                      </TabsTrigger>
                    </TabsList> */}
                  </div>

                   {/* <TabsContent value="availability" className="space-y-4"> */}
                   <div>
                    {(() => {
                      if (bedsAvailableOnDate.length === 0) {
                        return (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Bed size={48} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="font-semibold text-gray-700">
                              No beds available for {format(selectedDate, 'MMMM d, yyyy')}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              Try selecting a different date
                            </p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                const nextDate = new Date(selectedDate);
                                nextDate.setDate(nextDate.getDate() + 1);
                                setSelectedDate(nextDate);
                              }}
                            >
                              Check Next Day
                            </Button>
                          </div>
                        );
                      }

                      // return bedsAvailableOnDate.map((bed) => {
                      return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {bedsAvailableOnDate.map((bed) => {
                        const statusBadge = getStatusBadge(bed.status);
                        const StatusIcon = statusBadge.icon;
                        const canBook = (() => {
  const bookings = bed.bookings || [];

  return !bookings.some((booking: any) => {
    const status = booking.status?.toLowerCase();

    let admissionDate = null;
    let dischargeDate = null;

    if (status === "occupied") {
      if (booking.actual_admission_time) {
        admissionDate = new Date(booking.actual_admission_time);
      }

      if (booking.actual_discharge_time) {
        dischargeDate = new Date(booking.actual_discharge_time);
      }

      admissionDate?.setHours(0,0,0,0);
      dischargeDate?.setHours(0,0,0,0);

      if (dischargeDate && selectedDateTime >= dischargeDate) {
        return false;
      }

      return admissionDate && selectedDateTime >= admissionDate;
    }

    if (booking.expected_admission_date && booking.expected_discharge_date) {
      admissionDate = new Date(booking.expected_admission_date);
      dischargeDate = new Date(booking.expected_discharge_date);

      admissionDate.setHours(0,0,0,0);
      dischargeDate.setHours(0,0,0,0);

      return (
        selectedDateTime >= admissionDate &&
        selectedDateTime < dischargeDate
      );
    }

    return false;
  });
})();
                        // Find next available date for this bed
                        const bedBookingsForBed = bed.bookings;
                        let nextAvailableDate = null;
                        if (bedBookingsForBed.length > 0) {
                          const lastDischarge = bedBookingsForBed
                            .filter((b: any) => b.expected_discharge_date)
                            .map((b: any) => new Date(b.expected_discharge_date))
                            .sort((a, b) => b.getTime() - a.getTime())[0];
                          
                          if (lastDischarge && lastDischarge >= selectedDate) {
                            nextAvailableDate = new Date(lastDischarge);
                            nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
                            nextAvailableDate.setHours(0, 0, 0, 0);
                          }
                        }
                        
                        return (
                          <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
                            <div className="absolute top-2 right-2 z-10">
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <CheckCircle size={12} className="mr-1" />
                                AVAILABLE ON {format(selectedDate, 'MMM d')}
                              </span>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <MapPin size={16} className="text-green-600" />
                                  <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
                                </div>
                                {bed.facilityType && (
                                  <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 font-medium">
                                    {bed.facilityType}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
                            </div>

                            <div className="px-4 py-3 border-b bg-gray-50">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-600">Ward/Department</p>
                                  <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Ward Type</p>
                                  <p className="font-medium text-sm text-gray-700">{bed.wardType}</p>
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'} • Code: {bed.wardCode}
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-sm text-gray-600">Bed</span>
                                  <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
                                </div>
                                {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                                  <StatusIcon size={12} />
                                  {bed.status}
                                </span> */}

                              </div>

                              {nextAvailableDate && nextAvailableDate.getTime() > selectedDate.getTime() && (
                                <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                                  <p className="text-blue-700">
                                    Next available from: {format(nextAvailableDate, 'MMM d, yyyy')}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <p className="text-xs text-gray-500">Bed Type</p>
                                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {bed.bedType}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Room</p>
                                  <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {bed.hasOxygen && (
                                  <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    <Wind size={12} className="mr-1" />
                                    Oxygen
                                  </span>
                                )}
                                {bed.hasVentilator && (
                                  <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    <Activity size={12} className="mr-1" />
                                    Ventilator
                                  </span>
                                )}
                                {bed.isIsolation && (
                                  <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    <Shield size={12} className="mr-1" />
                                    Isolation
                                  </span>
                                )}
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t">
                                <div>
                                  {bed.pricePerDay && bed.pricePerDay > 0 ? (
                                    <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
                                  ) : (
                                    <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
                                  )}
                                </div>
                                
                                {!user ? (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => navigate("/login/patient", { 
                                      state: { 
                                        from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`,
                                        bedData: {
                                          facilityName: bed.facilityName,
                                          facilityId: bed.facilityId,
                                          wardId: bed.wardId,
                                          bedId: bed.id,
                                          bedNumber: bed.bedNumber,
                                          wardName: bed.wardName,
                                          bedType: bed.bedType,
                                          pricePerDay: bed.pricePerDay
                                        }
                                      } 
                                    })}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    <Bed size={16} className="mr-2" />
                                    <span>Login to Book</span>
                                  </Button>
                                ) : (
                                  <>
                                  {canBook ? (
                                  <PatientProtectedButton 
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}?date=${selectedDate.toISOString()}`, true)}
                                    path="/appointment"
                                  >
                                    <Bed size={16} className="mr-2" />
                                    <span>Book Now</span>
                                  </PatientProtectedButton>
                                  ) : (
  <Button disabled className="bg-gray-300 text-gray-500">
    Can you try later
  </Button>
)}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      // });
                          })}
  </div>
);
                    })()}
                    </div>
                  {/* </TabsContent>  */}


                  {/* <TabsContent value="bookings" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Bed Bookings</CardTitle>
                        <CardDescription>
                          {loadingBookings ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              Loading bookings...
                            </div>
                          ) : (
                            `Showing all bed bookings for this facility`
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {bedBookingsData.length === 0 ? (
                          <div className="text-center py-8">
                            <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-700">No bookings found</h3>
                            <p className="text-gray-500 text-sm mt-1">
                              No bed bookings found for this facility
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bedBookingsData.map((booking) => (
                              <div key={booking.id} className="bg-white rounded-lg shadow-md p-4 border">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Booking Reference</p>
                                    <p className="font-medium">{booking.booking_reference}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge className={getStatusBadge(booking.status).class}>
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Admission Date</p>
                                    <p className="font-medium">{booking.expected_admission_date ? format(new Date(booking.expected_admission_date), 'MMM d, yyyy') : 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Discharge Date</p>
                                    <p className="font-medium">{booking.expected_discharge_date ? format(new Date(booking.expected_discharge_date), 'MMM d, yyyy') : 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Patient Type</p>
                                    <p className="font-medium">{booking.patient_type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Priority</p>
                                    <p className="font-medium">{booking.priority}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent> */}
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {allBeds.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bed size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">No beds found in this facility</p>
          </div>
        )}
      </div>
    );
  }

  // Main Facilities View with Search and Filters
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Find Bed</h1>
        
        {!user && (
          <Button 
            onClick={() => navigate('/login/patient')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login to Book
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by hospital name, city, address, or facility type..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Button 
            onClick={() => applyFilters()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </div>

          

        <div className="grid grid-cols-3 gap-4 pt-4">
          {/* City Filter */}
          <div className="w-full max-w-md">
            <Label className="text-sm font-semibold">City</Label>
            <Select 
              value={filters.city || "all"} 
              onValueChange={(value) => handleFilterChange('city', value === "all" ? "" : value)}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {indianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Showing Indian cities
            </p>
          </div>

          {/* Department/Ward Type Filter */}
          <div className="w-full max-w-md">
            <Label className="text-sm font-semibold">Find Beds</Label>
            <Select 
              value={filters.department || "all"} 
              onValueChange={(value) => handleFilterChange('department', value === "all" ? "" : value)}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Beds</SelectItem>
                {commonDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
                {availableDepartments
                  .filter(dept => !commonDepartments.includes(dept))
                  .map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Select a department or ward type
            </p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Found {filteredFacilities.length} facilities matching your criteria
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities
          .filter(facility => facility.available_beds && facility.available_beds > 0)
          .map((facility) => {
            const FacilityTypeIcon = facilityTypeIcons[facility.facility_type] || Building2;
            return (
              <div
                key={facility.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-2">
                    <FacilityTypeIcon size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {facility.facility_name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {facility.facility_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {facility.is_verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                    
                    {facility.rating !== null && (
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-medium">
                          {facility.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          ({facility.total_reviews || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start gap-1 text-gray-600">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <p className="text-sm">
                      {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Total Beds</span>
                    <p className="font-medium">{facility.total_beds}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Available Beds</span>
                    <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {facility.unique_ward_types && facility.unique_ward_types.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Departments/Wards:</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.unique_ward_types.slice(0, 3).map((type, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                        {facility.unique_ward_types.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{facility.unique_ward_types.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {facility.city && (
                    <div>
                      <span className="text-xs text-gray-500">City:</span>
                      <p className="font-medium text-xs truncate">
                        {facility.city}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {facility.established_year && (
                    <div>
                      <span className="text-xs text-gray-500">Established:</span>
                      <p className="font-medium text-sm">{facility.established_year}</p>
                    </div>
                  )}
                  {facility.license_number && (
                    <div>
                      <span className="text-xs text-gray-500">License:</span>
                      <p className="font-medium text-xs truncate">
                        {facility.license_number}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  {facility.website && (
                    <a
                      href={facility.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visit Website →
                    </a>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    <div className="relative group">
                      <button
                        className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                          facility.available_beds && facility.available_beds > 0
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => facility.available_beds && facility.available_beds > 0 && handleViewWards(facility)}
                        disabled={!facility.available_beds || facility.available_beds === 0}
                      >
                        {facility.available_beds && facility.available_beds > 0 
                          ? `View Beds (${facility.available_beds} Available)` 
                          : 'No Beds Available'}
                      </button>
                      
                      {(!facility.available_beds || facility.available_beds === 0) && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          No beds currently available in this facility
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No facilities found matching your criteria.</p>
          <Button
            variant="link"
            onClick={clearFilters}
            className="mt-2 text-blue-600"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientFacilities;