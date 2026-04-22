import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Bed, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Filter,
  Activity,
  Wind,
  Shield,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

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
  price?: number;
  ward_id: string;
  created_at: string;
  wardName?: string;
  wardCode?: string;
  wardType?: string;
  facilityId?: string;
  facilityName?: string;
  city?: string;
  state?: string;
  facilityType?: string;
  bookings?: any[];
}

interface BedBooking {
  id: string;
  bed_id: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  status: string;
  patient_id: string;
}
interface DoctorProfileProps {
  onBack?: () => void;
}
const PatientFacilitiesId: React.FC<DoctorProfileProps> = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bedBookingsData, setBedBookingsData] = useState<any[]>([]);
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("availability");
const [isPatient, setIsPatient] = useState<boolean | null>(null);
  // Get facility from location state or fetch by ID
const [selectedDate, setSelectedDate] = useState<Date>(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0,0,0,0);
  return tomorrow;
});
useEffect(() => {
  const checkPatientStatus = async () => {
    if (!user) {
      setIsPatient(false);
      return;
    }
    const patient = await checkIfPatient(user.id);
    setIsPatient(patient);
  };
  checkPatientStatus();
}, [user]);

  useEffect(() => {
    if (location.state?.facility) {
      setSelectedFacility(location.state.facility);
      setLoading(false);
    } else {
      // If facility not passed via state, fetch by ID from URL
      const pathSegments = location.pathname.split('/');
      const facilityId = pathSegments[pathSegments.length - 1];
      if (facilityId) {
        fetchFacilityById(facilityId);
      } else {
        navigate('/dashboard/patient/facilities');
      }
    }
  }, [location]);

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
    if (selectedFacility) {
      fetchBedBookings();
    }
  }, [selectedFacility]);

  const fetchFacilityById = async (facilityId: string) => {
    try {
      setLoading(true);
      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .single();

      if (facilityError) throw facilityError;

      if (facilityData) {
        // Fetch wards for this facility
        const { data: wardsData, error: wardsError } = await supabase
          .from("wards")
          .select("*")
          .eq("facility_id", facilityId);

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
            price: bed.price,
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

        const totalAvailableBeds = wardsWithBeds.reduce((sum, ward) => sum + (ward.available_beds || 0), 0);
        const totalBeds = wardsWithBeds.reduce((sum, ward) => sum + (ward.total_beds || 0), 0);
        const uniqueWardTypes = [...new Set(wardsWithBeds.map(ward => ward.ward_type))];
        
        setSelectedFacility({
          ...facilityData,
          wards: wardsWithBeds,
          available_beds: totalAvailableBeds,
          total_beds: totalBeds || facilityData.total_beds,
          unique_ward_types: uniqueWardTypes
        });
      }
    } catch (err: any) {
      console.error("Error fetching facility:", err);
      toast({
        title: "Error",
        description: "Failed to load facility details",
        variant: "destructive"
      });
      navigate('/dashboard/patient/facilities');
    } finally {
      setLoading(false);
    }
  };

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

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // const handleBack = () => {
  //   navigate('/dashboard/patient/facilities');
  // };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
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
      MAINTENANCE: { class: 'bg-red-100 text-red-800', icon: AlertCircle }
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

  const checkBedAvailabilityOnDate = (bookings: any[], checkDate: Date) => {
    const isBooked = bookings.some(booking => {
      const status = booking.status?.toLowerCase();
      
      if (status === 'cancelled') return false;
      if (status === 'reserved') return false;
      
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
        
        if (booking.actual_discharge_time) {
          const actualDischarge = new Date(booking.actual_discharge_time);
          actualDischarge.setHours(0, 0, 0, 0);
          
          if (checkDate >= actualDischarge) {
            return false;
          }
        }
        
        if (dischargeDate) {
          return checkDate >= admissionDate && checkDate <= dischargeDate;
        }
        
        return checkDate >= admissionDate;
      }
      
      if (booking.expected_admission_date && booking.expected_discharge_date) {
        const admissionDate = new Date(booking.expected_admission_date);
        const dischargeDate = new Date(booking.expected_discharge_date);
        
        admissionDate.setHours(0, 0, 0, 0);
        dischargeDate.setHours(0, 0, 0, 0);
        
        return checkDate >= admissionDate && checkDate <= dischargeDate;
      }
      
      return false;
    });
    
    return !isBooked;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading facility details...</div>
      </div>
    );
  }

  if (!selectedFacility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
        >
          ← Back to Facilities
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Facility not found</p>
        </div>
      </div>
    );
  }

  // Flatten all beds from all wards for display
  const allBeds = selectedFacility.wards?.flatMap(ward => 
    ward.beds?.map(bed => ({
      ...bed,
      wardName: ward.name,
      wardCode: ward.ward_code,
      wardType: ward.ward_type,
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.facility_name,
      city: selectedFacility.city,
      state: selectedFacility.state,
      facilityType: selectedFacility.facility_type,
      bookings: bedBookingsData?.filter(booking => booking.assigned_bed_id === bed.id) || []
    })) || []
  ) || [];

  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(0, 0, 0, 0);

  const bedsAvailableOnDate = allBeds.filter((bed) => {
    const bookings = bed.bookings || [];

    const isBlocked = bookings.some((booking: any) => {
      const status = booking.status?.toLowerCase();

      if (status === "reserved") return false;

      let admissionDate = null;
      let dischargeDate = null;

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

        if (booking.actual_discharge_time) {
          const actualDischarge = new Date(booking.actual_discharge_time);
          actualDischarge.setHours(0, 0, 0, 0);

          if (selectedDateTime >= actualDischarge) {
            return false;
          }
        }

        if (dischargeDate) {
          return (
            selectedDateTime >= admissionDate &&
            selectedDateTime <= dischargeDate
          );
        }

        return selectedDateTime >= admissionDate;
      }

      if (booking.expected_admission_date && booking.expected_discharge_date) {
        const admissionDate = new Date(booking.expected_admission_date);
        const dischargeDate = new Date(booking.expected_discharge_date);

        admissionDate.setHours(0, 0, 0, 0);
        dischargeDate.setHours(0, 0, 0, 0);

        if (selectedDateTime < admissionDate) return false;

        return (
          selectedDateTime >= admissionDate &&
          selectedDateTime <= dischargeDate
        );
      }

      return false;
    });

    return !isBlocked;
  });

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
                      {/* <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) =>
                          isBefore(date, startOfDay(new Date()))
                        }
                        className="rounded-md"
                      /> */}
                      <CalendarComponent
  mode="single"
  selected={selectedDate}
  onSelect={(date) => date && setSelectedDate(date)}
  disabled={(date) => {
    const tomorrow = addDays(startOfDay(new Date()), 1);
    return isBefore(date, tomorrow);
  }}
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
                  {/* Tabs can be added here if needed */}
                </div>

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

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bedsAvailableOnDate.map((bed) => {
                          const statusBadge = getStatusBadge(bed.state);
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
                                  Floor {bed.floor_number} • Wing: {bed.wing || 'Main'} • Code: {bed.wardCode}
                                </div>
                              </div>

                              <div className="px-4 py-3">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <span className="text-sm text-gray-600">Bed</span>
                                    <p className="text-xl font-bold text-gray-900">{bed.bed_number}</p>
                                  </div>
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
                                      {bed.bed_type}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Room</p>
                                    <p className="text-sm font-medium">{bed.room_number || 'N/A'}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  {bed.has_oxygen && (
                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      <Wind size={12} className="mr-1" />
                                      Oxygen
                                    </span>
                                  )}
                                  {bed.has_ventilator && (
                                    <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                      <Activity size={12} className="mr-1" />
                                      Ventilator
                                    </span>
                                  )}
                                  {bed.is_isolation && (
                                    <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      <Shield size={12} className="mr-1" />
                                      Isolation
                                    </span>
                                  )}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                  <div>
                                    {bed.price && bed.price > 0 ? (
                                      <p className="text-sm font-semibold text-green-600">${bed.price}/day</p>
                                    ) : (
                                      <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
                                    )}
                                  </div>
                                  
                                  {/* {!user ? (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => navigate("/login/patient", { 
                                        state: { 
                                          from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName || '')}/${bed.facilityId}/${bed.ward_id}/${bed.id}`,
                                          bedData: {
                                            facilityName: bed.facilityName,
                                            facilityId: bed.facilityId,
                                            wardId: bed.ward_id,
                                            bedId: bed.id,
                                            bedNumber: bed.bed_number,
                                            wardName: bed.wardName,
                                            bedType: bed.bed_type,
                                            pricePerDay: bed.price
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
                                          onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName || '')}/${bed.facilityId}/${bed.ward_id}/${bed.id}?date=${selectedDate.toISOString()}`, true)}
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
                                  )} */}
                                   {!user ? (
    <Button
      variant="default"
      size="sm"
      onClick={() => navigate("/login/patient", { 
        state: { 
          from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName || '')}/${bed.facilityId}/${bed.ward_id}/${bed.id}`,
          bedData: {
            facilityName: bed.facilityName,
            facilityId: bed.facilityId,
            wardId: bed.ward_id,
            bedId: bed.id,
            bedNumber: bed.bed_number,
            wardName: bed.wardName,
            bedType: bed.bed_type,
            pricePerDay: bed.price
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
        isPatient === true ? (
          <PatientProtectedButton 
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName || '')}/${bed.facilityId}/${bed.ward_id}/${bed.id}?date=${selectedDate.toISOString()}`, true)}
            path="/appointment"
          >
            <Bed size={16} className="mr-2" />
            <span>Book Now</span>
          </PatientProtectedButton>
        ) : isPatient === false ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/register/patient", { 
              state: { returnTo: window.location.pathname }
            })}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Register as Patient
          </Button>
        ) : (
         <Button disabled className="bg-gray-300 text-gray-500">
                                          Can you try later
                                        </Button>
        )
      ) : (
        <Button disabled className="bg-gray-300 text-gray-500">
          Not Available
        </Button>
      )}
    </>
  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
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
};

export default PatientFacilitiesId;