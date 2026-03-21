// // import { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Badge } from "@/components/ui/badge";
// // import { MapPin, Star, Clock, Filter, Building2, Users, ChevronRight } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// // import { supabase } from "@/integrations/supabase/client";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useNavigate } from "react-router-dom";

// // // ------------------------
// // // Types
// // // ------------------------
// // interface Doctor {
// //   id: string;
// //   user_id: string;
// //   name: string;
// //   specialty: string;
// //   rating: number;
// //   experience: string;
// //   location?: string;
// //   distance?: string;
// //   consultationFee: number;
// //   availability: string;
// //   hospital?: string;
// //   image?: string;
// //   description?: string;
// // }

// // interface BookingInfo {
// //   slot_id: string;
// //   start_time: string;
// //   end_time: string;
// //   booking_date: string;
// //   doctor_id: string;
// //   doctor_name: string;
// //   department_id?: string;
// // }

// // interface TimeSlot {
// //   id: string;
// //   doctor_id: string;
// //   day_of_week: string;
// //   start_time: string;
// //   end_time: string;
// //   slot_type: string;
// //   is_available: boolean;
// // }

// // interface Department {
// //   id: string;
// //   facility_id: string;
// //   name: string;
// //   description: string;
// //   head_doctor_id?: string;
// //   services?: any;
// //   equipment?: any;
// //   bed_capacity?: number;
// //   available_beds?: number;
// //   is_active?: boolean;
// //   created_at?: string;
// //   updated_at?: string;
// //   price_per_day?: number; // Add this
// //   has_variable_pricing?: boolean; // Add this
// // }

// // interface Facility {
// //   id: string;
// //   facility_name: string;
// //   facility_type: string;
// //   license_number: string;
// //   city: string;
// //   state: string;
// //   pincode: number;
// //   total_beds: number;
// //   rating: number;
// //   total_reviews: number;
// //   is_verified: boolean;
// //   established_year: number;
// //   website: string;
// //   insurance_partners: string;
// //   about_facility: string;
// //   contact_number?: string;
// //   email?: string;
// // }

// // // ------------------------
// // // Component
// // // ------------------------
// // interface DoctorSearchProps {
// //   view: "all" | "doctors" | "hospitals";
// // }

// // const DoctorSearch: React.FC<DoctorSearchProps> = ({ view }) => {
// //   const { toast } = useToast();
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState<any>(null);
// //   // Search and Filter States
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedSpecialty, setSelectedSpecialty] = useState("all");
// //   const [selectedViewSpecialty, setSelectedViewSpecialty] = useState(view === "hospitals" ? "doctors" : "all");
// //   const [locationFilter, setLocationFilter] = useState("");
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [activeFilterTab, setActiveFilterTab] = useState("all"); // "all", "doctors", "hospitals"
  
// //   // Data States
// //   const [doctors, setDoctors] = useState<Doctor[]>([]);
// //   const [facilities, setFacilities] = useState<Facility[]>([]);
// //   const [departments, setDepartments] = useState<Department[]>([]);
// //   const [loading, setLoading] = useState(true);
  
// //   // UI States
// //   const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
// //   const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
// //   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
// //   const [bookings, setBookings] = useState<any[]>([]);
// //   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
// //   const [selectedDay, setSelectedDay] = useState<number>(0);
  
// //   // Booking States
// //   const [confirmOpen, setConfirmOpen] = useState(false);
// //   const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
// //   const [notes, setNotes] = useState("");
// //   const createSlug = (text: string) => {
// //   return text
// //     .toLowerCase()
// //     .replace(/[^a-z0-9]+/g, '-')
// //     .replace(/^-+|-+$/g, '');
// // };
// //   // Pagination States
// //   const [doctorPage, setDoctorPage] = useState(1);
// //   const [hospitalPage, setHospitalPage] = useState(1);
// //   const DOCTORS_PER_PAGE = 8;
// //   const HOSPITALS_PER_PAGE = 8;

// //   const specialties = [
// //     "General Physician",
// //     "Cardiologist",
// //     "Dermatologist",
// //     "Neurologist",
// //     "Orthopedic",
// //     "Pediatrician",
// //     "Gynecologist",
// //     "Psychiatrist",
// //     "Dentist",
// //     "Physiotherapist",
// //     "Dietician",
// //     "Ophthalmologist",
// //   ];

// //   // ------------------------
// //   // Helper Functions
// //   // ------------------------
// //   const formatDayLabel = (date: Date, index: number) => {
// //     if (index === 0) return "Today";
// //     if (index === 1) return "Tomorrow";
// //     return date.toLocaleDateString("en-US", { weekday: "short" });
// //   };

// //   const formatDateNumber = (date: Date) => {
// //     return date.getDate();
// //   };

// //   const formatTimePretty = (timeStr: string) => {
// //     const hh = parseInt(timeStr.slice(0, 2), 10);
// //     const mm = timeStr.slice(3, 5);
// //     const hour12 = hh % 12 === 0 ? 12 : hh % 12;
// //     const ampm = hh >= 12 ? "PM" : "AM";
// //     return `${hour12}:${mm} ${ampm}`;
// //   };

// //   useEffect(() => {
// //   if (view === "doctors") {
// //     setActiveFilterTab("doctors");
// //   } else if (view === "hospitals") {
// //     setActiveFilterTab("hospitals");
// //   } else {
// //     setActiveFilterTab("all");
// //   }
// // }, [view]);
// // useEffect(() => {
// //   const checkUser = async () => {
// //     const { data: { session } } = await supabase.auth.getSession();
// //     setUser(session?.user || null);
// //   };
  
// //   checkUser();

// //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //     setUser(session?.user || null);
// //   });

// //   return () => subscription.unsubscribe();
// // }, []);
// // // const handleLogin = (doctorId?: string, departmentId?: string, facilityId?: string, type?: string) => {
// // //  let redirectPath = departmentId? `/dashboard/patient/department/${departmentId}` : doctorId ? `/dashboard/patient/doctor/${doctorId}` : facilityId ? `/dashboard/patient/facility/${facilityId}` : '/dashboard/patient';
// // //   if (departmentId && type === "department") {
// // //     redirectPath = `/dashboard/patient/department/${departmentId}`;
// // //   } else if (doctorId && type === "doctor") {
// // //     redirectPath = `/dashboard/patient/doctor/${doctorId}`;
// // //   } else if (facilityId && type === "hospital") {
// // //     redirectPath = `/dashboard/patient/facility/${facilityId}`;
// // //   }
  
// // //   navigate(`/login/patient`, { 
// // //     state: { from: redirectPath } 
// // //   });
// // // };

// // const handleLogin = (id: string, type: 'doctor' | 'hospital' | 'department' ) => {
// //   let redirectPath = '';
  
// //   if (type === 'doctor') {
// //     redirectPath = `/dashboard/patient/doctor/${createSlug(doctors.find(d => d.id === id)?.name || "")}/${id}`;
// //   } else if (type === 'hospital') {
// //     redirectPath = `/dashboard/patient/facility/${createSlug(facilities.find(f => f.id === id)?.facility_name || "")}/${id}`;
// //   } else if (type === 'department') {
// //     redirectPath = `/dashboard/patient/department/${createSlug(departments.find(d => d.id === id)?.name || "")}/${id}`;
// //   }
  
// //   navigate(`/login/patient`, { 
// //     state: { from: redirectPath } 
// //   });
// // };
// //   // ------------------------
// //   // Data Fetching
// //   // ------------------------
// //   const fetchDoctors = async () => {
// //     setLoading(true);
// //     const { data, error } = await supabase.from("medical_professionals")
// //       .select(`
// //         *,
// //         medical_professionals_user_id_fkey (
// //           first_name,
// //           last_name,
// //           avatar_url,
// //           user_id
// //         )
// //       `);

// //     if (error) {
// //       console.error(error);
// //       setLoading(false);
// //       return;
// //     }

// //     const mapped = data.map((item: any) => {
// //       const fullName = item.medical_professionals_user_id_fkey
// //         ? `${item.medical_professionals_user_id_fkey.first_name || ""} ${
// //             item.medical_professionals_user_id_fkey.last_name || ""
// //           }`.trim()
// //         : "Unknown Doctor";

// //       return {
// //         id: item.id,
// //         user_id: item.medical_professionals_user_id_fkey?.user_id || "",
// //         name: fullName || "Unknown Doctor",
// //         specialty: item.medical_speciality,
// //         rating: item.rating || 0,
// //         experience: item.years_experience
// //           ? `${item.years_experience} years`
// //           : "N/A",
// //         consultationFee: item.consultation_fee || 0,
// //         availability: item.availability?.status || "Not Available",
// //         hospital: item.medical_school || "Not specified",
// //         location: item.about_yourself || "Location not provided",
// //         image: item.medical_professionals_user_id_fkey?.avatar_url || "",
// //         description: item.description || item.about_yourself || "No description provided.",
// //       } as Doctor;
// //     });

// //     setDoctors(mapped);
// //     setLoading(false);
// //   };

// //   const fetchFacilityDetails = async () => {
// //     const { data: facilitiesData, error: facilitiesError } = await supabase
// //       .from("facilities")
// //       .select(`
// //         id,
// //         facility_name,
// //         facility_type,
// //         license_number,
// //         city,
// //         state,
// //         pincode,
// //         total_beds,
// //         rating,
// //         total_reviews,
// //         is_verified,
// //         established_year,
// //         insurance_partners,
// //         about_facility,
// //         website
// //       `);

// //     if (!facilitiesError && facilitiesData) {
// //       // Add mock contact info
// //       const enhancedFacilities = facilitiesData.map(facility => ({
// //         ...facility,
// //         contact_number: "+1 234-567-890" + Math.floor(Math.random() * 10),
// //         email: `info@${facility.facility_name.toLowerCase().replace(/\s+/g, '')}.com`,
// //       }));
      
// //       setFacilities(enhancedFacilities);
      
// //       const facilityIds = facilitiesData.map(f => f.id);
      
// //       if (facilityIds.length > 0) {
// //         const { data: departmentsData, error: departmentsError } = await supabase
// //           .from("departments")
// //           .select("*")
// //           .in("facility_id", facilityIds);

// //         if (!departmentsError && departmentsData) {
// //           setDepartments(departmentsData);
// //         }
// //       }
// //     }
// //   };

// //   const fetchTimeSlotsAndBookings = async (doctorId: string) => {
// //     try {
// //       const { data: slotsData, error: slotsError } = await supabase
// //         .from("time_slots")
// //         .select("*")
// //         .eq("doctor_id", doctorId)
// //         .eq("is_available", true);

// //       if (slotsError) {
// //         console.error("time_slots fetch error", slotsError);
// //         setTimeSlots([]);
// //       } else {
// //         setTimeSlots(slotsData || []);
// //       }

// //       const { data: bookingsData, error: bookingsError } = await supabase
// //         .from("appointments")
// //         .select("*")
// //         .eq("doctor_id", doctorId);

// //       if (bookingsError) {
// //         console.error("bookings fetch error", bookingsError);
// //         setBookings([]);
// //       } else {
// //         setBookings(bookingsData || []);
// //       }
// //     } catch (err) {
// //       console.error("fetchTimeSlotsAndBookings error", err);
// //       setTimeSlots([]);
// //       setBookings([]);
// //     }
// //   };

// //   const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
// //     try {
// //       const { data: slotsData, error: slotsError } = await supabase
// //         .from("time_slots")
// //         .select("*")
// //         .eq("department_id", department.id)
// //         .eq("slot_type", "booking")
// //         .eq("is_available", true);

// //       if (slotsError) {
// //         console.error("time_slots fetch error", slotsError);
// //         setTimeSlots([]);
// //       } else {
// //         setTimeSlots(slotsData || []);
// //       }

// //       const { data: bookingsData, error: bookingsError } = await supabase
// //         .from("appointments")
// //         .select("*")
// //         .eq("department_id", department.id);

// //       if (bookingsError) {
// //         console.error("bookings fetch error", bookingsError);
// //         setBookings([]);
// //       } else {
// //         setBookings(bookingsData || []);
// //       }
// //     } catch (err) {
// //       console.error("fetchTimeSlotsAndDepartmentBookings error", err);
// //       setTimeSlots([]);
// //       setBookings([]);
// //     }
// //   };

// //   // ------------------------
// //   // Effects
// //   // ------------------------
// //   useEffect(() => {
// //     fetchDoctors();
// //     fetchFacilityDetails();
// //   }, []);

// //   // ------------------------
// //   // Filter Logic
// //   // ------------------------
// //   const filteredDoctors = doctors.filter((doctor) => {
// //     if (activeFilterTab === "hospitals") return false;
    
// //     const term = searchQuery.toLowerCase().trim();
// //     if (term === "") return true;
    
// //     return (
// //       doctor.name.toLowerCase().includes(term) ||
// //       doctor.specialty.toLowerCase().includes(term) ||
// //       doctor.hospital?.toLowerCase().includes(term) ||
// //       doctor.description?.toLowerCase().includes(term)
// //     );
// //   }).filter((doctor) => {
// //     const matchesSpecialty = selectedViewSpecialty === "all" || doctor.specialty === selectedViewSpecialty;
// //     const matchesLocation = !locationFilter ||
// //       doctor.location?.toLowerCase().includes(locationFilter.toLowerCase());
// //     return matchesSpecialty && matchesLocation;
// //   });

// //   const filteredFacilities = facilities.filter((facility) => {
// //   if (activeFilterTab === "doctors") return false;
  
// //   const term = searchQuery.toLowerCase().trim();
// //   if (term === "") return true;
  
// //   const matchesFacilityName = facility.facility_name?.toLowerCase().includes(term);
// //   const matchesCity = facility.city?.toLowerCase().includes(term);
// //   const matchesState = facility.state?.toLowerCase().includes(term);
// //   const matchesType = facility.facility_type?.toLowerCase().includes(term);
  
// //   // Update this condition to check if ANY department matches the search term
// //   const matchesDepartments = departments.some(
// //     (dept) =>
// //       dept.facility_id === facility.id &&
// //       (
// //         dept.name?.toLowerCase().includes(term) ||
// //         dept.description?.toLowerCase().includes(term)
// //       )
// //   );

// //   // Return true if any of the conditions match
// //   return matchesFacilityName || matchesCity || matchesState || 
// //          matchesType || matchesDepartments;
// // });
// // const getFacilityDepartments = (facilityId: string) => {
// //   const facilityDepts = departments.filter(dept => dept.facility_id === facilityId);
  
// //   // If there's a search query, filter departments that match
// //   if (searchQuery.trim() !== "") {
// //     const term = searchQuery.toLowerCase().trim();
// //     return facilityDepts.filter(dept => 
// //       dept.name?.toLowerCase().includes(term) || 
// //       dept.description?.toLowerCase().includes(term)
// //     );
// //   }
  
// //   return facilityDepts;
// // };
// //   // const filteredFacilities = facilities.filter((facility) => {
// //   //   if (activeFilterTab === "doctors") return false;
    
// //   //   const term = searchQuery.toLowerCase().trim();
// //   //   if (term === "") return true;
    
// //   //   const matchesFacilityName = facility.facility_name?.toLowerCase().includes(term);
// //   //   const matchesCity = facility.city?.toLowerCase().includes(term);
// //   //   const matchesState = facility.state?.toLowerCase().includes(term);
// //   //   const matchesType = facility.facility_type?.toLowerCase().includes(term);
    
// //   //   const matchesDepartments = departments.some(
// //   //     (dept) =>
// //   //       dept.facility_id === facility.id &&
// //   //       (
// //   //         dept.name?.toLowerCase().includes(term) ||
// //   //         dept.description?.toLowerCase().includes(term)
// //   //       )
// //   //   );

// //   //   return matchesFacilityName || matchesCity || matchesState || 
// //   //          matchesType || matchesDepartments;
// //   // });

// //   // const getFacilityDepartments = (facilityId: string) => {
// //   //   return departments.filter(dept => dept.facility_id === facilityId);
// //   // };

// //   // Pagination
// //   const paginatedDoctors = filteredDoctors.slice(0, doctorPage * DOCTORS_PER_PAGE);
// //   const paginatedHospitals = filteredFacilities.slice(0, hospitalPage * HOSPITALS_PER_PAGE);
  
// //   const hasMoreDoctors = paginatedDoctors.length < filteredDoctors.length;
// //   const hasMoreHospitals = paginatedHospitals.length < filteredFacilities.length;

// //   // ------------------------
// //   // Handlers
// //   // ------------------------


// //   const toggleExpand = async (doctorId: string) => {
// //     if (expandedDoctorId === doctorId) {
// //       setExpandedDoctorId(null);
// //       setSelectedSlot(null);
// //       setTimeSlots([]);
// //       setBookings([]);
// //       setSelectedDay(0);
// //       return;
// //     }

// //     setExpandedDoctorId(doctorId);
// //     setSelectedSlot(null);
// //     setTimeSlots([]);
// //     setBookings([]);
// //     setSelectedDay(0);
// //     await fetchTimeSlotsAndBookings(doctorId);
// //   };

// //   const toggleExpandDepartment = async (department: Department) => {
// //     if (expandedTimeSlotId === department.id) {
// //       setExpandedTimeSlotId(null);
// //       setSelectedSlot(null);
// //       setTimeSlots([]);
// //       setBookings([]);
// //       setSelectedDay(0);
// //       return;
// //     }

// //     setExpandedTimeSlotId(department.id);
// //     setSelectedSlot(null);
// //     setTimeSlots([]);
// //     setBookings([]);
// //     setSelectedDay(0);
// //     await fetchTimeSlotsAndDepartmentBookings(department);
// //   };

// //   const detectLocation = () => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           toast({
// //             title: "Location Detected",
// //             description: "Searching for doctors near your location...",
// //           });
// //         },
// //         () => {
// //           toast({
// //             title: "Location Access Denied",
// //             description: "Please allow location access or enter your area manually.",
// //             variant: "destructive",
// //           });
// //         }
// //       );
// //     }
// //   };

// //   const handleBookNow = (slot: TimeSlot, dateIndex: number, doctor: Doctor) => {
// //     const newDate = new Date();
// //     newDate.setDate(newDate.getDate() + dateIndex);

// //     const bookingData: BookingInfo = {
// //       slot_id: slot.id,
// //       start_time: slot.start_time,
// //       end_time: slot.end_time,
// //       booking_date: newDate.toISOString().split("T")[0],
// //       doctor_id: slot.doctor_id,
// //       doctor_name: doctor.name,
// //     };

// //     setBookingInfo(bookingData);
// //     setConfirmOpen(true);
// //   };

// //   const handleDepartmentBookNow = (slot: TimeSlot, dateIndex: number, department: Department) => {
// //     const newDate = new Date();
// //     newDate.setDate(newDate.getDate() + dateIndex);

// //     const bookingData: BookingInfo = {
// //       slot_id: slot.id,
// //       start_time: slot.start_time,
// //       end_time: slot.end_time,
// //       booking_date: newDate.toISOString().split("T")[0],
// //       doctor_id: "",
// //       doctor_name: department.name || "Department",
// //       department_id: department.id,
// //     };

// //     setBookingInfo(bookingData);
// //     setConfirmOpen(true);
// //   };

// //   const handleConfirmBooking = async () => {
// //     if (!bookingInfo) return;

// //     try {
// //       const { data: { user }, error: userError } = await supabase.auth.getUser();
      
// //       if (userError || !user) {
// //         toast({
// //           title: "Authentication Required",
// //           description: "Please log in to book an appointment.",
// //           variant: "destructive",
// //         });
// //         navigate('/login');
// //         return;
// //       }

// //       const { data: sessionData } = await supabase.auth.getSession();
// //       const token = sessionData.session?.access_token;

// //       let payload;
// //       if (bookingInfo.department_id) {
// //         const department = departments.find(d => d.id === bookingInfo.department_id);
// //         const facility_id = department ? department.facility_id : null;
// //         payload = {
// //           patient_id: user.id,
// //           facility_id,
// //           doctor_id: null,
// //           department_id: bookingInfo.department_id,
// //           booking_date: bookingInfo.booking_date,
// //           time_slot_id: bookingInfo.slot_id,
// //           notes: notes || null,
// //         };
// //       } else {
// //         payload = {
// //           patient_id: user.id,
// //           doctor_id: bookingInfo.doctor_id,
// //           booking_date: bookingInfo.booking_date,
// //           time_slot_id: bookingInfo.slot_id,
// //           notes: notes || null,
// //         };
// //       }
      
// //       const response = await fetch(
// //         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": `Bearer ${token}`,
// //           },
// //           body: JSON.stringify(payload),
// //         }
// //       );

// //       const result = await response.json();
      
// //       if (!response.ok) {
// //         let errorMsg = result.error || "Unable to book appointment";
        
// //         if (response.status === 401) {
// //           toast({
// //             title: "Authentication Failed",
// //             description: "Your session is invalid. Please log in again.",
// //             variant: "destructive",
// //           });
// //           navigate('/login');
// //         } else if (errorMsg.includes("No doctors available in this department") ||
// //             errorMsg.includes("All doctors in this department are booked for this time slot")) {
// //           toast({
// //             title: "No Doctors Available",
// //             description: "No doctors are available in this department for the selected time. Please try another time or department.",
// //             variant: "destructive",
// //           });
// //         } else {
// //           toast({
// //             title: "Error",
// //             description: errorMsg,
// //             variant: "destructive",
// //           });
// //         }
// //         return;
// //       }

// //       toast({
// //         title: "Success",
// //         description: "Appointment booked successfully!",
// //       });
// //       setConfirmOpen(false);
// //       setNotes("");
// //       setSelectedSlot(null);

// //       if (expandedDoctorId) {
// //         await fetchTimeSlotsAndBookings(expandedDoctorId);
// //       }
// //     } catch (err: any) {
// //       console.error("Booking error:", err);
// //       toast({
// //         title: "Error",
// //         description: err?.message || "Unable to book appointment. Please try again.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const handleViewAllDoctors = () => {
// //     setActiveFilterTab("doctors");
// //     setDoctorPage(1);
// //   };

// //   const handleViewAllHospitals = () => {
// //     setActiveFilterTab("hospitals");
// //     setHospitalPage(1);
// //   };

// //   const handleViewDoctorProfile = (doctorId: string) => {
// //     const user = supabase.auth.getUser();
// //     // if (!user) {
// //     //   navigate('/login');
// //     // } else {
// //       const doctor = doctors.find(d => d.id === doctorId);
// //       navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
// //     // }
// //   };

// //   // const handleViewHospitalDetails = (facilityId: string) => {
// //   //   const user = supabase.auth.getUser();
// //   //   if (!user) {
// //   //     navigate('/login');
// //   //   } else {
// //   //     navigate(`/dashboard/patient/facility/${facilityId}`);
// //   //   }
// //   // };
// //   const handleViewHospitalDetails = (facilityId: string) => {
// //   const user = supabase.auth.getUser();
// //   if (!user) {
// //     navigate('/login');
// //   } else {
// //     // Navigate with state
// //     const facility = facilities.find(f => f.id === facilityId);
// //     navigate(`/dashboard/patient/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
// //       state: { activeTab: 'overview', from: 'search' }
// //     });
// //   }
// // };
// //   const handleViewHospitalDepartmentDetails = (facilityId: string) => {
// //   const user = supabase.auth.getUser();
// //   if (!user) {
// //     navigate('/login');
// //   } else {
// //     // Navigate with state
// //     const facility = facilities.find(f => f.id === facilityId);
// //     navigate(`/dashboard/patient/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
// //       state: { activeTab: 'departments', from: 'search' }
// //     });
// //   }
// // };

// //   const handleViewAllBookings = () => {
// //     const user = supabase.auth.getUser();
// //     if (!user) {
// //       navigate('/login');
// //     } else {
// //       navigate('/dashboard/patient/book/patient-facilities');
// //     }
// //   };

// //   const handleViewDepartment = (department: Department) => {
// //   // Navigate to department details page
// //   navigate(`/dashboard/patient/department/${createSlug(department.name || "")}/${department.id}`, {
// //     state: { facility: facilities.find(f => f.id === department.facility_id) }
// //   });
// // };

// //   // ------------------------
// //   // Render Functions
// //   // ------------------------
// //   const renderSearchHeader = () => (
// //     <div className="space-y-4">
// //       <div className="flex flex-col md:flex-row gap-4">
// //         <div className="flex-1">
// //           <Label htmlFor="search">
// //             Search Doctors, Hospitals, or Specialties
// //           </Label>
// //           <Input
// //             id="search"
// //             placeholder="Enter doctor name, specialty, or hospital..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="mt-1"
// //           />
// //         </div>

// //         <div className="flex gap-2">
// //           <Button onClick={detectLocation} variant="outline">
// //             <MapPin className="mr-2 h-4 w-4" /> Near Me
// //           </Button>
// //           <Button
// //             variant="outline"
// //             onClick={() => setShowFilters(!showFilters)}
// //           >
// //             <Filter className="mr-2 h-4 w-4" /> Filters
// //           </Button>
// //         </div>
// //       </div>

// //       {/* {showFilters && ( */}
// //         <Card>
// //           <CardContent className="pt-6">
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div>
// //                 <Label>Filter By</Label>
// //                 <Tabs 
// //                   defaultValue="all" 
// //                   value={activeFilterTab}
// //                   onValueChange={(value) => {
// //                     setActiveFilterTab(value);
// //                     setDoctorPage(1);
// //                     setHospitalPage(1);
// //                   }}
// //                   className="mt-2"
// //                 >
// //                   <TabsList className="grid w-full grid-cols-3">
// //                     <TabsTrigger value="all">All</TabsTrigger>
// //                     <TabsTrigger value="doctors">Doctors</TabsTrigger>
// //                     <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
// //                   </TabsList>
// //                 </Tabs>
// //               </div>

// //               {activeFilterTab !== "doctors" && (
// //                 <div>
// //                   <Label>Specialty</Label>
// //                   <Select
// //                     value={selectedSpecialty}
// //                     onValueChange={setSelectedSpecialty}
// //                   >
// //                     <SelectTrigger className="mt-1">
// //                       <SelectValue placeholder="Select specialty" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="all">All Specialties</SelectItem>
// //                       {specialties.map((s) => (
// //                         <SelectItem key={s} value={s}>
// //                           {s}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               )}

// //               <div>
// //                 <Label>Location/Area</Label>
// //                 <Input
// //                   placeholder="Enter area or hospital"
// //                   value={locationFilter}
// //                   onChange={(e) => setLocationFilter(e.target.value)}
// //                   className="mt-1"
// //                 />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       {/* )} */}
// //     </div>
// //   );

// //   const renderDoctorsSection = () => {
// //     if (activeFilterTab === "hospitals") return null;
    
// //     return (
// //       <div className="mb-8">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-2xl font-bold text-blue-600">Doctors & Professionals</h2>
// //           {filteredDoctors.length > DOCTORS_PER_PAGE && (
// //             <Button 
// //               variant="ghost" 
// //               className="text-blue-600"
// //               onClick={handleViewAllDoctors}
// //             >
// //               View All Doctors <ChevronRight className="ml-1 h-4 w-4" />
// //             </Button>
// //           )}
           
          
// //         </div>

// //         {loading ? (
// //           <p>Loading doctors…</p>
// //         ) : (
// //           <div className="space-y-4">
// //             {paginatedDoctors.length > 0 ? (
// //               paginatedDoctors.map((doctor) => (
// //                 <Card key={doctor.id} className="hover:shadow-medium transition">
// //                   <CardContent className="p-6">
// //                     <div className="flex gap-4">
// //                       <img
// //                         src={doctor.image || "https://via.placeholder.com/150"}
// //                         alt={doctor.name}
// //                         className="w-20 h-20 rounded-full object-cover"
// //                       />

// //                       <div className="flex-1 space-y-2">
// //                         <div className="flex justify-between">
// //                           <div>
// //                             <h4 className="text-lg font-semibold">
// //                               {doctor.name}
// //                             </h4>
// //                             <p className="text-muted-foreground">
// //                               {doctor.specialty}
// //                             </p>
// //                             {doctor.description && (
// //                               <p className="text-gray-500 text-sm mt-1 line-clamp-2">
// //                                 {doctor.description}
// //                               </p>
// //                             )}
// //                           </div>

// //                           <div className="flex items-center">
// //                             <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
// //                             <span className="ml-1">{doctor.rating}</span>
// //                           </div>
// //                         </div>

// //                         <div className="text-sm text-muted-foreground">
// //                           <MapPin className="h-4 w-4 inline mr-1" />
// //                           {doctor.location || "Location not provided"}
// //                         </div>

// //                         <div className="flex justify-between items-center">
// //                           <Badge variant="outline">
// //                             <Clock className="h-3 w-3 mr-1" />
// //                             {doctor.availability}
// //                           </Badge>

// //                           {/* <span className="text-green-600 font-medium">
// //                             ₹{doctor.consultationFee||" consult a doctor" } Consultation
// //                           </span> */}
// //                           <span className="text-green-600 font-medium">
// //   {doctor.consultationFee && doctor.consultationFee > 0 ? (
// //     <>₹{doctor.consultationFee} / Day</>
// //     // <>₹{doctor.consultationFee} Consultation</>
// //   ) : (
// //     <span className="text-blue-600">Consult a Doctor</span>
// //   )}
// // </span>
// //                         </div>

// //                         <div className="flex gap-2 mt-3">
// //                            {/* {!user ? (
// //     <>
// //       <Button
// //         variant="default"
// //         size="sm"
// //         onClick={() => handleLogin(doctor.id, 'doctor')}
// //       >
// //         Login
// //       </Button>
// //       </>
// //   ) : (
// //     <> */}
// //                           {/* <Button
// //                             variant="default"
// //                             size="sm"
// //                             onClick={() => toggleExpand(doctor.user_id)}
// //                           >
// //                             View Availability
// //                           </Button> */}
// //                           <Button
// //                             variant="outline"
// //                             size="sm"
// //                             onClick={() => handleViewDoctorProfile(doctor.id)}
// //                           >
// //                             View Profile
// //                           </Button>
// //                           {/* </>
// //                           )} */}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Expanded Availability Area */}
// //                     {expandedDoctorId === doctor.user_id && (
// //                       <div className="mt-4 p-4 rounded-xl border shadow bg-white">
// //                         <h3 className="font-semibold mb-3 text-lg">
// //                           Available Slots
// //                         </h3>

// //                         {timeSlots.length === 0 ? (
// //                           <p className="text-red-600 font-medium">
// //                             Doctor is not available.
// //                           </p>
// //                         ) : (
// //                           <>
// //                             <div className="flex gap-3 overflow-x-auto py-2">
// //                               {Array.from({ length: 14 }).map((_, index) => {
// //                                 const date = new Date();
// //                                 date.setDate(date.getDate() + index);

// //                                 const label = formatDayLabel(date, index);
// //                                 const dayNumber = formatDateNumber(date);
// //                                 const dayOfWeek = date.toLocaleDateString(
// //                                   "en-US",
// //                                   { weekday: "long" }
// //                                 );

// //                                 const slotsForDay = timeSlots.filter(
// //                                   (s) => s.day_of_week === dayOfWeek
// //                                 );

// //                                 const dateISO = date.toISOString().split("T")[0];
// //                                 const bookingsForDay = bookings.filter((b) => {
// //                                   const bookingISO = new Date(b.appointment_date)
// //                                     .toISOString()
// //                                     .split("T")[0];
// //                                   return bookingISO === dateISO;
// //                                 });

// //                                 const bookedSlotIds = new Set(
// //                                   bookingsForDay.map((b) => b.time_slot_id)
// //                                 );

// //                                 const availableSlotsCount = slotsForDay.filter(
// //                                   (slot) => !bookedSlotIds.has(slot.id)
// //                                 ).length;

// //                                 const isActiveDay = selectedDay === index;

// //                                 return (
// //                                   <div key={index} className="min-w-[110px]">
// //                                     <button
// //                                       onClick={() => {
// //                                         setSelectedDay(index);
// //                                         setSelectedSlot(null);
// //                                       }}
// //                                       className={`w-full px-3 py-2 rounded-lg text-center transition
// //                                         ${
// //                                           isActiveDay
// //                                             ? "bg-blue-600 text-white"
// //                                             : "bg-white text-gray-700"
// //                                         }
// //                                         border ${
// //                                           isActiveDay
// //                                             ? "border-blue-600"
// //                                             : "border-gray-200"
// //                                         }`}
// //                                     >
// //                                       <div className="text-xs font-medium">
// //                                         {label}
// //                                       </div>
// //                                       <div className="text-lg font-bold mt-1">
// //                                         {dayNumber}
// //                                       </div>
// //                                       <div
// //                                         className={`${
// //                                           isActiveDay
// //                                             ? "text-[11px] text-white mt-1"
// //                                             : "text-[11px] text-gray-400 mt-1"
// //                                         }`}
// //                                       >
// //                                         {availableSlotsCount} slot
// //                                         {availableSlotsCount !== 1 ? "s" : ""}
// //                                       </div>
// //                                     </button>
// //                                   </div>
// //                                 );
// //                               })}
// //                             </div>

// //                             <div className="mt-4">
// //                               {(() => {
// //                                 const selectedDate = new Date();
// //                                 selectedDate.setDate(
// //                                   selectedDate.getDate() + selectedDay
// //                                 );
// //                                 const selectedISO = selectedDate
// //                                   .toISOString()
// //                                   .split("T")[0];
// //                                 const fullDayName =
// //                                   selectedDate.toLocaleDateString("en-US", {
// //                                     weekday: "long",
// //                                   });

// //                                 const slotsForDay = timeSlots.filter(
// //                                   (s) => s.day_of_week === fullDayName
// //                                 );

// //                                 if (slotsForDay.length === 0) {
// //                                   return (
// //                                     <p className="text-gray-500 text-sm">
// //                                       No slots available for this day.
// //                                     </p>
// //                                   );
// //                                 }

// //                                 const todaysBookings = bookings.filter((b) => {
// //                                   const bookingISO = new Date(b.appointment_date)
// //                                     .toISOString()
// //                                     .split("T")[0];
// //                                   return bookingISO === selectedISO;
// //                                 });

// //                                 const availableSlots = slotsForDay.filter(
// //                                   (slot) =>
// //                                     !todaysBookings.some(
// //                                       (b) => b.time_slot_id === slot.id
// //                                     )
// //                                 );

// //                                 return (
// //                                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
// //                                     {availableSlots.map((slot) => {
// //                                       const isSelected =
// //                                         selectedSlot?.id === slot.id;
// //                                       return (
// //                                         <div
// //                                           key={slot.id}
// //                                           onClick={() => setSelectedSlot(slot)}
// //                                           className={`
// //                                             p-2 rounded-md cursor-pointer text-sm transition
// //                                             ${
// //                                               slot.slot_type === "clinic"
// //                                                 ? "bg-green-50"
// //                                                 : "bg-blue-50"
// //                                             }
// //                                             ${
// //                                               isSelected
// //                                                 ? "border-2 border-green-600"
// //                                                 : "border border-gray-300"
// //                                             }
// //                                           `}
// //                                         >
// //                                           <div className="font-medium">
// //                                             {formatTimePretty(slot.start_time)} -{" "}
// //                                             {formatTimePretty(slot.end_time)}
// //                                           </div>
// //                                           <div className="text-[11px] text-gray-600 capitalize">
// //                                             {slot.slot_type}
// //                                           </div>
// //                                           <div className="text-[11px] mt-1 font-semibold text-green-600">
// //                                             Available
// //                                           </div>
// //                                         </div>
// //                                       );
// //                                     })}

// //                                     {availableSlots.length === 0 && (
// //                                       <p className="text-red-500 text-sm col-span-full text-center">
// //                                         No available slots for this day.
// //                                       </p>
// //                                     )}
// //                                   </div>
// //                                 );
// //                               })()}
// //                             </div>

// //                             {!selectedSlot && (
// //                               <p className="text-gray-500 text-xs mt-2">
// //                                 Please select a slot to book an appointment.
// //                               </p>
// //                             )}

// //                             <Button
// //                               variant="default"
// //                               size="sm"
// //                               className="mt-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
// //                               disabled={!selectedSlot}
// //                               onClick={() =>
// //                                 handleBookNow(selectedSlot!, selectedDay, doctor)
// //                               }
// //                             >
// //                               Book Appointment without Payment
// //                             </Button>
// //                           </>
// //                         )}
// //                       </div>
// //                     )}
// //                   </CardContent>
// //                 </Card>
// //               ))
// //             ) : (
// //               <Card>
// //                 <CardContent className="p-8 text-center">
// //                   <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
// //                   <p className="text-gray-500">No doctors found matching your criteria.</p>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {hasMoreDoctors && (
// //               <div className="text-center mt-4">
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => setDoctorPage(doctorPage + 1)}
// //                 >
// //                   Load More Doctors
// //                 </Button>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderHospitalsSection = () => {
// //     if (activeFilterTab === "doctors") return null;
    
// //     return (
// //       <div className="mb-8">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-2xl font-bold text-green-600">Hospitals & Facilities</h2>
// //           {filteredFacilities.length > HOSPITALS_PER_PAGE && (
// //             <Button 
// //               variant="ghost" 
// //               className="text-green-600"
// //               onClick={handleViewAllHospitals}
// //             >
// //               View All Hospitals <ChevronRight className="ml-1 h-4 w-4" />
// //             </Button>
// //           )}
// //         </div>

// //         <div className="space-y-4">
// //           {paginatedHospitals.length > 0 ? (
// //             paginatedHospitals.map((facility) => {
// //               const facilityDepts = getFacilityDepartments(facility.id);
              
// //               return (
// //                 <Card key={facility.id} className="mx-auto shadow-lg border-2 border-green-100">
// //                   <div className="bg-green-600 rounded-t-xl px-6 py-4">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <h2 className="text-xl font-bold text-white">{facility.facility_name}</h2>
// //                         <span className="text-green-100 text-sm font-medium">{facility.facility_type}</span>
// //                       </div>
// //                       <div className="flex items-center gap-2">
// //                         <div className="flex items-center gap-1 text-white">
// //                           <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
// //                           <span className="font-semibold">{facility.rating}</span>
// //                           <span className="text-xs text-green-100">({facility.total_reviews})</span>
// //                         </div>
// //                         {facility.is_verified && (
// //                           <Badge className="bg-green-500 text-white">Verified</Badge>
// //                         )}
// //                       </div>
// //                     </div>
// //                       <div className="flex items-center justify-between">
// //                     <div className="flex items-center gap-2 text-green-100 mt-1">
// //                       <MapPin className="h-4 w-4" />
// //                       <span>{facility.city}, {facility.state} - {facility.pincode}</span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       {!user ? (
// //     <>
// //       <Button
// //         variant="default"
// //         size="sm"
// //         onClick={() => handleLogin(facility.id, 'hospital')}
// //       >
// //         Login Hospital
// //       </Button>
// //       </>
// //   ) : (
// //     <>
// //                       <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => handleViewHospitalDetails(facility.id)}
// //                               >
// //                                 View Hospital
// //                               </Button>
// //                               </>)}
// //                       </div>
// //                       </div>
// //                   </div>
                  
// //                   <CardContent className="p-6 bg-gray-50 rounded-b-xl">
// //                     <div className="flex justify-between items-center mb-4">
// //                       <div className="flex items-center gap-2">
// //                         <Building2 className="h-5 w-5 text-gray-600" />
// //                         <span className="font-semibold">Hospitals Departments</span>
// //                         {/* <span className="font-semibold">{facility.total_beds} Beds</span> */}
// //                       </div>
// //                        {!user ? (
// //     <>
// //       <Button
// //         variant="default"
// //         size="sm"
// //         onClick={() => handleLogin(facility.id, 'hospital')}
// //       >
// //         Login Beds
// //       </Button>
// //       </>
// //   ) : (
// //     <>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => handleViewHospitalDepartmentDetails(facility.id)}
// //                       >
// //                         View Details
// //                       </Button>
// //                         </>
// //                         )}
// //                     </div>

// //                     {/* Departments Section */}
// //                     <div className="mt-4 space-y-4">
// //                       <h3 className="text-lg font-bold text-green-700">Departments</h3>
// //                       {facilityDepts.length === 0 ? (
// //                         <p className="text-gray-500">No departments found for this facility.</p>
// //                       ) : (
// //                         facilityDepts.map((dept) => (
// //                           <div key={dept.id} className="border rounded-lg p-4 bg-white shadow-sm">
// //                             <div className="flex justify-between items-start">
// //         <div>

// //                             <h4 className="font-semibold text-md text-green-600 mb-1">
// //                               {dept.name}
// //                             </h4>
// //                             {/* <p className="text-gray-700 text-sm mb-2">
// //                               {dept.description || "No description provided."}
// //                             </p> */}
// //                             </div>
// //                             <div className="text-right">
// //           {dept.price_per_day && dept.price_per_day > 0 ? (
// //             <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
// //               ₹{dept.price_per_day}/day
// //             </div>
// //           ) : (
// //             <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
// //               Contact for Price
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //                             <div className="flex flex-wrap gap-4 text-sm text-gray-700">
// //                               {/* <span>
// //                                 <strong>Bed Capacity:</strong> {dept.bed_capacity ?? "N/A"}
// //                               </span>
// //                               <span>
// //                                 <strong>Available Beds:</strong> {dept.available_beds ?? "N/A"}
// //                               </span> */}
// //                               <span>
// //                                 <strong>Status:</strong>{" "}
// //                                 {dept.is_active ? (
// //                                   <span className="text-green-600 font-semibold">Active</span>
// //                                 ) : (
// //                                   <span className="text-red-500 font-semibold">Inactive</span>
// //                                 )}
// //                               </span>
// //                             </div>
                            
// //                             <div className="flex gap-2 mt-3">
// //                                 {!user ? (
// //     <>
// //       <Button
// //         variant="default"
// //         size="sm"
// //           onClick={() => handleLogin(dept.id, 'department')}
// //       >
// //         Login Departments
// //       </Button>
// //       </>
// //   ) : (
// //     <>
// //                               <Button
// //                                 variant="default"
// //                                 size="sm"
// //                                 className="bg-green-600 hover:bg-green-700"
// //                                 onClick={() => toggleExpandDepartment(dept)}
// //                               >
// //                                 View Availability
// //                               </Button>
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => handleViewDepartment(dept)}
// //                               >
// //                                 View Departments
// //                               </Button></>)}
// //                             </div>

// //                             {expandedTimeSlotId === dept.id && (
// //                               <div className="mt-4 p-4 rounded-xl border shadow bg-white">
// //                                 <h3 className="font-semibold mb-3 text-lg">
// //                                   Available Slots
// //                                 </h3>

// //                                 {timeSlots.length === 0 ? (
// //                                   <p className="text-red-600 font-medium">
// //                                     Department {dept.name} is not available.
// //                                   </p>
// //                                 ) : (
// //                                   <>
// //                                     <div className="flex gap-3 overflow-x-auto py-2">
// //                                       {Array.from({ length: 14 }).map((_, index) => {
// //                                         const date = new Date();
// //                                         date.setDate(date.getDate() + index);

// //                                         const label = formatDayLabel(date, index);
// //                                         const dayNumber = formatDateNumber(date);
// //                                         const dayOfWeek = date.toLocaleDateString(
// //                                           "en-US",
// //                                           { weekday: "long" }
// //                                         );

// //                                         const slotsForDay = timeSlots.filter(
// //                                           (s) => s.day_of_week === dayOfWeek
// //                                         );

// //                                         const dateISO = date.toISOString().split("T")[0];
// //                                         const bookingsForDay = bookings.filter((b) => {
// //                                           const bookingISO = new Date(b.appointment_date)
// //                                             .toISOString()
// //                                             .split("T")[0];
// //                                           return bookingISO === dateISO;
// //                                         });

// //                                         const bookedSlotIds = new Set(
// //                                           bookingsForDay.map((b) => b.time_slot_id)
// //                                         );

// //                                         const availableSlotsCount = slotsForDay.filter(
// //                                           (slot) => !bookedSlotIds.has(slot.id)
// //                                         ).length;

// //                                         const isActiveDay = selectedDay === index;

// //                                         return (
// //                                           <div key={index} className="min-w-[110px]">
// //                                             <button
// //                                               onClick={() => {
// //                                                 setSelectedDay(index);
// //                                                 setSelectedSlot(null);
// //                                               }}
// //                                               className={`w-full px-3 py-2 rounded-lg text-center transition
// //                                                 ${
// //                                                   isActiveDay
// //                                                     ? "bg-green-600 text-white"
// //                                                     : "bg-white text-gray-700"
// //                                                 }
// //                                                 border ${
// //                                                   isActiveDay
// //                                                     ? "border-green-600"
// //                                                     : "border-gray-200"
// //                                                 }`}
// //                                             >
// //                                               <div className="text-xs font-medium">
// //                                                 {label}
// //                                               </div>
// //                                               <div className="text-lg font-bold mt-1">
// //                                                 {dayNumber}
// //                                               </div>
// //                                               <div
// //                                                 className={`${
// //                                                   isActiveDay
// //                                                     ? "text-[11px] text-white mt-1"
// //                                                     : "text-[11px] text-gray-400 mt-1"
// //                                                 }`}
// //                                               >
// //                                                 {availableSlotsCount} slot
// //                                                 {availableSlotsCount !== 1 ? "s" : ""}
// //                                               </div>
// //                                             </button>
// //                                           </div>
// //                                         );
// //                                       })}
// //                                     </div>

// //                                     <div className="mt-4">
// //                                       {(() => {
// //                                         const selectedDate = new Date();
// //                                         selectedDate.setDate(
// //                                           selectedDate.getDate() + selectedDay
// //                                         );
// //                                         const selectedISO = selectedDate
// //                                           .toISOString()
// //                                           .split("T")[0];
// //                                         const fullDayName =
// //                                           selectedDate.toLocaleDateString("en-US", {
// //                                             weekday: "long",
// //                                           });

// //                                         const slotsForDay = timeSlots.filter(
// //                                           (s) => s.day_of_week === fullDayName
// //                                         );

// //                                         if (slotsForDay.length === 0) {
// //                                           return (
// //                                             <p className="text-gray-500 text-sm">
// //                                               No slots available for this day.
// //                                             </p>
// //                                           );
// //                                         }

// //                                         const todaysBookings = bookings.filter((b) => {
// //                                           const bookingISO = new Date(b.appointment_date)
// //                                             .toISOString()
// //                                             .split("T")[0];
// //                                           return bookingISO === selectedISO;
// //                                         });

// //                                         const availableSlots = slotsForDay.filter(
// //                                           (slot) =>
// //                                             !todaysBookings.some(
// //                                               (b) => b.time_slot_id === slot.id
// //                                             )
// //                                         );

// //                                         return (
// //                                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
// //                                             {availableSlots.map((slot) => {
// //                                               const isSelected =
// //                                                 selectedSlot?.id === slot.id;
// //                                               return (
// //                                                 <div
// //                                                   key={slot.id}
// //                                                   onClick={() => setSelectedSlot(slot)}
// //                                                   className={`
// //                                                     p-2 rounded-md cursor-pointer text-sm transition
// //                                                     ${
// //                                                       slot.slot_type === "clinic"
// //                                                         ? "bg-green-50"
// //                                                         : "bg-blue-50"
// //                                                     }
// //                                                     ${
// //                                                       isSelected
// //                                                         ? "border-2 border-green-600"
// //                                                         : "border border-gray-300"
// //                                                     }
// //                                                   `}
// //                                                 >
// //                                                   <div className="font-medium">
// //                                                     {formatTimePretty(slot.start_time)} -{" "}
// //                                                     {formatTimePretty(slot.end_time)}
// //                                                   </div>
// //                                                   <div className="text-[11px] text-gray-600 capitalize">
// //                                                     {slot.slot_type}
// //                                                   </div>
// //                                                   <div className="text-[11px] mt-1 font-semibold text-green-600">
// //                                                     Available
// //                                                   </div>
// //                                                 </div>
// //                                               );
// //                                             })}

// //                                             {availableSlots.length === 0 && (
// //                                               <p className="text-red-500 text-sm col-span-full text-center">
// //                                                 No available slots for this day.
// //                                               </p>
// //                                             )}
// //                                           </div>
// //                                         );
// //                                       })()}
// //                                     </div>

// //                                     {!selectedSlot && (
// //                                       <p className="text-gray-500 text-xs mt-2">
// //                                         Please select a slot to book an appointment.
// //                                       </p>
// //                                     )}

// //                                     <Button
// //                                       variant="default"
// //                                       size="sm"
// //                                       className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
// //                                       disabled={!selectedSlot}
// //                                       onClick={() =>
// //                                         handleDepartmentBookNow(selectedSlot!, selectedDay, dept)
// //                                       }
// //                                     >
// //                                       Book Appointment without Payment
// //                                     </Button>
// //                                   </>
// //                                 )}
// //                               </div>
// //                             )}
// //                           </div>
// //                         ))
// //                       )}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               );
// //             })
// //           ) : (
// //             <Card>
// //               <CardContent className="p-8 text-center">
// //                 <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
// //                 <p className="text-gray-500">No hospitals found matching your criteria.</p>
// //               </CardContent>
// //             </Card>
// //           )}

// //           {hasMoreHospitals && (
// //             <div className="text-center mt-4">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setHospitalPage(hospitalPage + 1)}
// //               >
// //                 Load More Hospitals
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ------------------------
// //   // Main Render
// //   // ------------------------
// //   return (
// //     <div className="space-y-6">
// //       {renderSearchHeader()}

// //       {/* Results Count */}
// //       <div className="flex justify-between items-center">
// //         <h3 className="text-lg font-semibold">
// //           {activeFilterTab === "all" && (
// //             <>Found {filteredDoctors.length} doctors & {filteredFacilities.length} hospitals</>
// //           )}
// //           {activeFilterTab === "doctors" && (
// //             <>Found {filteredDoctors.length} doctors</>
// //           )}
// //           {activeFilterTab === "hospitals" && (
// //             <>Found {filteredFacilities.length} hospitals</>
// //           )}
// //         </h3>
        
// //         <Button 
// //           variant="link" 
// //           className="text-purple-600"
// //           onClick={handleViewAllBookings}
// //         >
// //           View All Bed Bookings <ChevronRight className="ml-1 h-4 w-4" />
// //         </Button>
// //       </div>

// //       {/* Results Sections */}
// //       {activeFilterTab !== "hospitals" && renderDoctorsSection()}
// //       {activeFilterTab !== "doctors" && renderHospitalsSection()}

// //       {/* Confirmation Dialog */}
// //       <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
// //         <DialogContent className="rounded-xl p-6">
// //           <DialogHeader>
// //             <DialogTitle className="text-xl font-bold text-center">
// //               Confirm Appointment 
// //             </DialogTitle>
// //           </DialogHeader>

// //           {bookingInfo && (
// //             <div className="space-y-4 mt-2">
// //               <div className="p-4 bg-gray-100 rounded-lg">
// //                 <p className="text-sm text-gray-600">Doctor/Department</p>
// //                 <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="p-4 bg-gray-100 rounded-lg">
// //                   <p className="text-sm text-gray-600">Date</p>
// //                   <p className="text-md font-medium">
// //                     {bookingInfo.booking_date}
// //                   </p>
// //                 </div>

// //                 <div className="p-4 bg-gray-100 rounded-lg">
// //                   <p className="text-sm text-gray-600">Time Slot</p>
// //                   <p className="text-md font-medium">
// //                     {formatTimePretty(bookingInfo.start_time)} -{" "}
// //                     {formatTimePretty(bookingInfo.end_time)}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-4">
// //                 <label className="text-sm font-medium text-gray-600">
// //                   Notes (optional)
// //                 </label>
// //                 <textarea
// //                   value={notes}
// //                   onChange={(e) => setNotes(e.target.value)}
// //                   placeholder="Add message for doctor..."
// //                   className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
// //                   rows={3}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           <DialogFooter className="mt-6 flex justify-between">
// //             <Button
// //               variant="outline"
// //               onClick={() => {
// //                 setConfirmOpen(false);
// //                 setNotes("");
// //               }}
// //             >
// //               Cancel
// //             </Button>

// //             <Button
// //               className="bg-blue-600 hover:bg-blue-700 text-white"
// //               onClick={handleConfirmBooking}
// //             >
// //               Confirm Booking
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // };

// // export default DoctorSearch;

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { ChevronRight, Building2, Users } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import DoctorCard from "./Search/DoctorCard";
// import HospitalCard from "./Search/HospitalCard";
// import SearchHeader from "./Search/SearchHeader";
// export interface Doctor {
//   id: string;
//   user_id: string;
//   name: string;
//   specialty: string;
//   rating: number;
//   experience: string;
//   location?: string;
//   distance?: string;
//   consultationFee: number;
//   availability: string;
//   hospital?: string;
//   image?: string;
//   description?: string;
// }

// export interface BookingInfo {
//   slot_id: string;
//   start_time: string;
//   end_time: string;
//   booking_date: string;
//   doctor_id: string;
//   doctor_name: string;
//   department_id?: string;
// }

// export interface TimeSlot {
//   id: string;
//   doctor_id: string;
//   day_of_week: string;
//   start_time: string;
//   end_time: string;
//   slot_type: string;
//   is_available: boolean;
// }

// export interface Department {
//   id: string;
//   facility_id: string;
//   name: string;
//   description: string;
//   head_doctor_id?: string;
//   services?: any;
//   equipment?: any;
//   bed_capacity?: number;
//   available_beds?: number;
//   is_active?: boolean;
//   created_at?: string;
//   updated_at?: string;
//   price_per_day?: number;
//   has_variable_pricing?: boolean;
// }

// export interface Facility {
//   id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   city: string;
//   state: string;
//   pincode: number;
//   total_beds: number;
//   rating: number;
//   total_reviews: number;
//   is_verified: boolean;
//   established_year: number;
//   website: string;
//   insurance_partners: string;
//   about_facility: string;
//   contact_number?: string;
//   email?: string;
// }
// interface DoctorSearchProps {
//   view: "all" | "doctors" | "hospitals";
// }

// const DoctorSearch: React.FC<DoctorSearchProps> = ({ view }) => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);
  
//   // Search and Filter States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState("all");
//   const [selectedViewSpecialty, setSelectedViewSpecialty] = useState(view === "hospitals" ? "doctors" : "all");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeFilterTab, setActiveFilterTab] = useState("all");
  
//   // Data States
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // UI States
//   const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
//   const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
//   const [selectedDay, setSelectedDay] = useState<number>(0);
  
//   // Booking States
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
//   const [notes, setNotes] = useState("");
  
//   // Pagination States
//   const [doctorPage, setDoctorPage] = useState(1);
//   const [hospitalPage, setHospitalPage] = useState(1);
//   const DOCTORS_PER_PAGE = 8;
//   const HOSPITALS_PER_PAGE = 8;

//   const specialties = [
//     "General Physician",
//     "Cardiologist",
//     "Dermatologist",
//     "Neurologist",
//     "Orthopedic",
//     "Pediatrician",
//     "Gynecologist",
//     "Psychiatrist",
//     "Dentist",
//     "Physiotherapist",
//     "Dietician",
//     "Ophthalmologist",
//   ];

//   // Helper Functions
//   const createSlug = (text: string) => {
//     return text
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   };

//   const formatDayLabel = (date: Date, index: number) => {
//     if (index === 0) return "Today";
//     if (index === 1) return "Tomorrow";
//     return date.toLocaleDateString("en-US", { weekday: "short" });
//   };

//   const formatDateNumber = (date: Date) => {
//     return date.getDate();
//   };

//   const formatTimePretty = (timeStr: string) => {
//     const hh = parseInt(timeStr.slice(0, 2), 10);
//     const mm = timeStr.slice(3, 5);
//     const hour12 = hh % 12 === 0 ? 12 : hh % 12;
//     const ampm = hh >= 12 ? "PM" : "AM";
//     return `${hour12}:${mm} ${ampm}`;
//   };

//   useEffect(() => {
//     if (view === "doctors") {
//       setActiveFilterTab("doctors");
//     } else if (view === "hospitals") {
//       setActiveFilterTab("hospitals");
//     } else {
//       setActiveFilterTab("all");
//     }
//   }, [view]);

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setUser(session?.user || null);
//     };
    
//     checkUser();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   // const handleLogin = (id: string, type: 'doctor' | 'hospital' | 'department') => {
//   //   let redirectPath = '';
    
//   //   if (type === 'doctor') {
//   //     redirectPath = `/dashboard/patient/doctor/${createSlug(doctors.find(d => d.id === id)?.name || "")}/${id}`;
//   //   } else if (type === 'hospital') {
//   //     redirectPath = `/dashboard/patient/facility/${createSlug(facilities.find(f => f.id === id)?.facility_name || "")}/${id}`;
//   //   } else if (type === 'department') {
//   //     redirectPath = `/dashboard/patient/department/${createSlug(departments.find(d => d.id === id)?.name || "")}/${id}`;
//   //   }
    
//   //   navigate(`/login/patient`, { 
//   //     state: { from: redirectPath } 
//   //   });
//   // };

//   // Data Fetching
//   const fetchDoctors = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("medical_professionals")
//       .select(`
//         *,
//         medical_professionals_user_id_fkey (
//           first_name,
//           last_name,
//           avatar_url,
//           user_id
//         )
//       `);

//     if (error) {
//       console.error(error);
//       setLoading(false);
//       return;
//     }

//     const mapped = data.map((item: any) => {
//       const fullName = item.medical_professionals_user_id_fkey
//         ? `${item.medical_professionals_user_id_fkey.first_name || ""} ${
//             item.medical_professionals_user_id_fkey.last_name || ""
//           }`.trim()
//         : "Unknown Doctor";

//       return {
//         id: item.id,
//         user_id: item.medical_professionals_user_id_fkey?.user_id || "",
//         name: fullName || "Unknown Doctor",
//         specialty: item.medical_speciality,
//         rating: item.rating || 0,
//         experience: item.years_experience
//           ? `${item.years_experience} years`
//           : "N/A",
//         consultationFee: item.consultation_fee || 0,
//         availability: item.availability?.status || "Not Available",
//         hospital: item.medical_school || "Not specified",
//         location: item.about_yourself || "Location not provided",
//         image: item.medical_professionals_user_id_fkey?.avatar_url || "",
//         description: item.description || item.about_yourself || "No description provided.",
//       } as Doctor;
//     });

//     setDoctors(mapped);
//     setLoading(false);
//   };

//   const fetchFacilityDetails = async () => {
//     const { data: facilitiesData, error: facilitiesError } = await supabase
//       .from("facilities")
//       .select(`
//         id,
//         facility_name,
//         facility_type,
//         license_number,
//         city,
//         state,
//         pincode,
//         total_beds,
//         rating,
//         total_reviews,
//         is_verified,
//         established_year,
//         insurance_partners,
//         about_facility,
//         website
//       `);

//     if (!facilitiesError && facilitiesData) {
//       const enhancedFacilities = facilitiesData.map(facility => ({
//         ...facility,
//         contact_number: "+1 234-567-890" + Math.floor(Math.random() * 10),
//         email: `info@${facility.facility_name.toLowerCase().replace(/\s+/g, '')}.com`,
//       }));
      
//       setFacilities(enhancedFacilities);
      
//       const facilityIds = facilitiesData.map(f => f.id);
      
//       if (facilityIds.length > 0) {
//         const { data: departmentsData, error: departmentsError } = await supabase
//           .from("departments")
//           .select("*")
//           .in("facility_id", facilityIds);

//         if (!departmentsError && departmentsData) {
//           setDepartments(departmentsData);
//         }
//       }
//     }
//   };

//   const fetchTimeSlotsAndBookings = async (doctorId: string) => {
//     try {
//       const { data: slotsData, error: slotsError } = await supabase
//         .from("time_slots")
//         .select("*")
//         .eq("doctor_id", doctorId)
//         .eq("is_available", true);

//       if (slotsError) {
//         console.error("time_slots fetch error", slotsError);
//         setTimeSlots([]);
//       } else {
//         setTimeSlots(slotsData || []);
//       }

//       const { data: bookingsData, error: bookingsError } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("doctor_id", doctorId);

//       if (bookingsError) {
//         console.error("bookings fetch error", bookingsError);
//         setBookings([]);
//       } else {
//         setBookings(bookingsData || []);
//       }
//     } catch (err) {
//       console.error("fetchTimeSlotsAndBookings error", err);
//       setTimeSlots([]);
//       setBookings([]);
//     }
//   };

//   const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
//     try {
//       const { data: slotsData, error: slotsError } = await supabase
//         .from("time_slots")
//         .select("*")
//         .eq("department_id", department.id)
//         .eq("slot_type", "booking")
//         .eq("is_available", true);

//       if (slotsError) {
//         console.error("time_slots fetch error", slotsError);
//         setTimeSlots([]);
//       } else {
//         setTimeSlots(slotsData || []);
//       }

//       const { data: bookingsData, error: bookingsError } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("department_id", department.id);

//       if (bookingsError) {
//         console.error("bookings fetch error", bookingsError);
//         setBookings([]);
//       } else {
//         setBookings(bookingsData || []);
//       }
//     } catch (err) {
//       console.error("fetchTimeSlotsAndDepartmentBookings error", err);
//       setTimeSlots([]);
//       setBookings([]);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//     fetchFacilityDetails();
//   }, []);

//   // Filter Logic
//   const filteredDoctors = doctors.filter((doctor) => {
//     if (activeFilterTab === "hospitals") return false;
    
//     const term = searchQuery.toLowerCase().trim();
//     if (term === "") return true;
    
//     return (
//       doctor.name.toLowerCase().includes(term) ||
//       doctor.specialty.toLowerCase().includes(term) ||
//       doctor.hospital?.toLowerCase().includes(term) ||
//       doctor.description?.toLowerCase().includes(term)
//     );
//   }).filter((doctor) => {
//     const matchesSpecialty = selectedViewSpecialty === "all" || doctor.specialty === selectedViewSpecialty;
//     const matchesLocation = !locationFilter ||
//       doctor.location?.toLowerCase().includes(locationFilter.toLowerCase());
//     return matchesSpecialty && matchesLocation;
//   });

//   const filteredFacilities = facilities.filter((facility) => {
//     if (activeFilterTab === "doctors") return false;
    
//     const term = searchQuery.toLowerCase().trim();
//     if (term === "") return true;
    
//     const matchesFacilityName = facility.facility_name?.toLowerCase().includes(term);
//     const matchesCity = facility.city?.toLowerCase().includes(term);
//     const matchesState = facility.state?.toLowerCase().includes(term);
//     const matchesType = facility.facility_type?.toLowerCase().includes(term);
    
//     const matchesDepartments = departments.some(
//       (dept) =>
//         dept.facility_id === facility.id &&
//         (
//           dept.name?.toLowerCase().includes(term) ||
//           dept.description?.toLowerCase().includes(term)
//         )
//     );

//     return matchesFacilityName || matchesCity || matchesState || 
//            matchesType || matchesDepartments;
//   });

//   const getFacilityDepartments = (facilityId: string) => {
//     const facilityDepts = departments.filter(dept => dept.facility_id === facilityId);
    
//     if (searchQuery.trim() !== "") {
//       const term = searchQuery.toLowerCase().trim();
//       return facilityDepts.filter(dept => 
//         dept.name?.toLowerCase().includes(term) || 
//         dept.description?.toLowerCase().includes(term)
//       );
//     }
    
//     return facilityDepts;
//   };

//   // Pagination
//   const paginatedDoctors = filteredDoctors.slice(0, doctorPage * DOCTORS_PER_PAGE);
//   const paginatedHospitals = filteredFacilities.slice(0, hospitalPage * HOSPITALS_PER_PAGE);
  
//   const hasMoreDoctors = paginatedDoctors.length < filteredDoctors.length;
//   const hasMoreHospitals = paginatedHospitals.length < filteredFacilities.length;

//   // Handlers
//   const handleSearch = () => {
//     // Reset pagination when searching
//     setDoctorPage(1);
//     setHospitalPage(1);
    
//     toast({
//       title: "Searching...",
//       description: `Looking for "${searchQuery}"`,
//     });
//   };

//   const toggleExpand = async (doctorId: string) => {
//     if (expandedDoctorId === doctorId) {
//       setExpandedDoctorId(null);
//       setSelectedSlot(null);
//       setTimeSlots([]);
//       setBookings([]);
//       setSelectedDay(0);
//       return;
//     }

//     setExpandedDoctorId(doctorId);
//     setSelectedSlot(null);
//     setTimeSlots([]);
//     setBookings([]);
//     setSelectedDay(0);
//     await fetchTimeSlotsAndBookings(doctorId);
//   };

//   const toggleExpandDepartment = async (department: Department) => {
//     if (expandedTimeSlotId === department.id) {
//       setExpandedTimeSlotId(null);
//       setSelectedSlot(null);
//       setTimeSlots([]);
//       setBookings([]);
//       setSelectedDay(0);
//       return;
//     }

//     setExpandedTimeSlotId(department.id);
//     setSelectedSlot(null);
//     setTimeSlots([]);
//     setBookings([]);
//     setSelectedDay(0);
//     await fetchTimeSlotsAndDepartmentBookings(department);
//   };

//   const detectLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           toast({
//             title: "Location Detected",
//             description: "Searching for doctors near your location...",
//           });
//         },
//         () => {
//           toast({
//             title: "Location Access Denied",
//             description: "Please allow location access or enter your area manually.",
//             variant: "destructive",
//           });
//         }
//       );
//     }
//   };

//   const handleBookNow = (slot: TimeSlot, dateIndex: number, doctor: Doctor) => {
//     const newDate = new Date();
//     newDate.setDate(newDate.getDate() + dateIndex);

//     const bookingData: BookingInfo = {
//       slot_id: slot.id,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//       booking_date: newDate.toISOString().split("T")[0],
//       doctor_id: slot.doctor_id,
//       doctor_name: doctor.name,
//     };

//     setBookingInfo(bookingData);
//     setConfirmOpen(true);
//   };

//   const handleDepartmentBookNow = (slot: TimeSlot, dateIndex: number, department: Department) => {
//     const newDate = new Date();
//     newDate.setDate(newDate.getDate() + dateIndex);

//     const bookingData: BookingInfo = {
//       slot_id: slot.id,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//       booking_date: newDate.toISOString().split("T")[0],
//       doctor_id: "",
//       doctor_name: department.name || "Department",
//       department_id: department.id,
//     };

//     setBookingInfo(bookingData);
//     setConfirmOpen(true);
//   };

//   const handleConfirmBooking = async () => {
//     if (!bookingInfo) return;

//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
      
//       if (userError || !user) {
//         toast({
//           title: "Authentication Required",
//           description: "Please log in to book an appointment.",
//           variant: "destructive",
//         });
//         navigate('/login');
//         return;
//       }

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       let payload;
//       if (bookingInfo.department_id) {
//         const department = departments.find(d => d.id === bookingInfo.department_id);
//         const facility_id = department ? department.facility_id : null;
//         payload = {
//           patient_id: user.id,
//           facility_id,
//           doctor_id: null,
//           department_id: bookingInfo.department_id,
//           booking_date: bookingInfo.booking_date,
//           time_slot_id: bookingInfo.slot_id,
//           notes: notes || null,
//         };
//       } else {
//         payload = {
//           patient_id: user.id,
//           doctor_id: bookingInfo.doctor_id,
//           booking_date: bookingInfo.booking_date,
//           time_slot_id: bookingInfo.slot_id,
//           notes: notes || null,
//         };
//       }
      
//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();
      
//       if (!response.ok) {
//         let errorMsg = result.error || "Unable to book appointment";
        
//         if (response.status === 401) {
//           toast({
//             title: "Authentication Failed",
//             description: "Your session is invalid. Please log in again.",
//             variant: "destructive",
//           });
//           navigate('/login');
//         } else if (errorMsg.includes("No doctors available in this department") ||
//             errorMsg.includes("All doctors in this department are booked for this time slot")) {
//           toast({
//             title: "No Doctors Available",
//             description: "No doctors are available in this department for the selected time. Please try another time or department.",
//             variant: "destructive",
//           });
//         } else {
//           toast({
//             title: "Error",
//             description: errorMsg,
//             variant: "destructive",
//           });
//         }
//         return;
//       }

//       toast({
//         title: "Success",
//         description: "Appointment booked successfully!",
//       });
//       setConfirmOpen(false);
//       setNotes("");
//       setSelectedSlot(null);

//       if (expandedDoctorId) {
//         await fetchTimeSlotsAndBookings(expandedDoctorId);
//       }
//     } catch (err: any) {
//       console.error("Booking error:", err);
//       toast({
//         title: "Error",
//         description: err?.message || "Unable to book appointment. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleViewAllDoctors = () => {
//     setActiveFilterTab("doctors");
//     setDoctorPage(1);
//   };

//   const handleViewAllHospitals = () => {
//     setActiveFilterTab("hospitals");
//     setHospitalPage(1);
//   };

//   // const handleViewDoctorProfile = (doctorId: string) => {
//   //   const doctor = doctors.find(d => d.id === doctorId);
//   //   navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
//   // };
// const handleViewDoctorProfile = (doctorId: string) => {
//   const doctor = doctors.find(d => d.id === doctorId);
  
//   // Check if user is logged in
//   if (user) {
//     // Logged in - go to dashboard patient view
//     navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
//   } else {
//     // Not logged in - go to public appointment view with doctor data in state
//     navigate(`/appointment/doctorprofile/doctor/${createSlug(doctor?.name || "")}/${doctorId}`, {
//       state: { doctorData: doctor }
//     });
//   }
// };

//   const handleViewHospitalDetails = (facilityId: string) => {
//     const facility = facilities.find(f => f.id === facilityId);
//     if (user) {
//     navigate(`/dashboard/patient/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
//       state: { activeTab: 'overview', from: 'search' }
//     });
//     } else {
//           navigate(`/appointment/facilityprofile/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
//       state: { activeTab: 'overview', from: 'search' }
//     });
//   }
//   };

//   const handleViewHospitalDepartmentDetails = (facilityId: string) => {
//     const facility = facilities.find(f => f.id === facilityId);
//     if (user) {
//     navigate(`/dashboard/patient/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
//       state: { activeTab: 'departments', from: 'search' }
//     });
//     } else {
//     navigate(`/appointment/facilityprofile/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
//       state: { activeTab: 'departments', from: 'search' }
//     });
//   }
//   };
// // Add these state variables near your other states
// const [doctorSpecialties] = useState<string[]>([
//   "General Physician",
//   "Cardiologist",
//   "Dermatologist",
//   "Neurologist",
//   "Orthopedic",
//   "Pediatrician",
//   "Gynecologist",
//   "Psychiatrist",
//   "Dentist",
//   "Physiotherapist",
//   "Dietician",
//   "Ophthalmologist",
// ]);

// const [hospitalDepartments] = useState<string[]>([
//   "General Medicine",
//   "Cardiology",
//   "Neurology",
//   "Orthopedics",
//   "Pediatrics",
//   "Gynecology",
//   "Surgery",
//   "Emergency",
//   "ICU",
//   "Radiology",
//   "Pathology",
//   "Dermatology",
//   "ENT",
//   "Ophthalmology",
//   "Psychiatry",
//   "Physiotherapy",
//   "Dental",
//   "Ayurveda",
//   "Homeopathy",
//   "Dietetics"
// ]);

// const [cities] = useState<string[]>([
//   "Mumbai",
//   "Delhi",
//   "Bangalore",
//   "Chennai",
//   "Kolkata",
//   "Pune",
//   "Hyderabad",
//   "Ahmedabad",
//   "Jaipur",
//   "Lucknow"
// ]);
//   const handleViewAllBookings = () => {
//     navigate('/dashboard/patient/book/patient-facilities');
//   };

//   const handleViewDepartment = (department: Department) => {
//      if (user) {
//     navigate(`/dashboard/patient/department/${createSlug(department.name || "")}/${department.id}`, {
//       state: { facility: facilities.find(f => f.id === department.facility_id) }
//     });
    
//     } else {
//        navigate(`/appointment/facilityprofile/department/${createSlug(department.name || "")}/${department.id}`, {
//       state: { facility: facilities.find(f => f.id === department.facility_id) }
//     });
//   }
//   };

//   // Render Functions
//   const renderDoctorsSection = () => {
//     if (activeFilterTab === "hospitals") return null;
    
//     return (
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-blue-600">Doctors & Professionals</h2>
//           {filteredDoctors.length > DOCTORS_PER_PAGE && (
//             <Button 
//               variant="ghost" 
//               className="text-blue-600"
//               onClick={handleViewAllDoctors}
//             >
//               View All Doctors <ChevronRight className="ml-1 h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         {loading ? (
//           <p>Loading doctors…</p>
//         ) : (
//           <div className="space-y-4 row">
//             {paginatedDoctors.length > 0 ? (
//               paginatedDoctors.map((doctor) => (
//                 <DoctorCard
//                   key={doctor.id}
//                   doctor={doctor}
//                   user={user}
//                   expandedDoctorId={expandedDoctorId}
//                   timeSlots={timeSlots}
//                   bookings={bookings}
//                   selectedSlot={selectedSlot}
//                   selectedDay={selectedDay}
//                   onToggleExpand={toggleExpand}
//                   onViewProfile={handleViewDoctorProfile}
//                   onSelectDay={setSelectedDay}
//                   onSelectSlot={setSelectedSlot}
//                   onBookNow={handleBookNow}
//                   formatDayLabel={formatDayLabel}
//                   formatDateNumber={formatDateNumber}
//                   formatTimePretty={formatTimePretty}
//                 />
//               ))
//             ) : (
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                   <p className="text-gray-500">No doctors found matching your criteria.</p>
//                 </CardContent>
//               </Card>
//             )}

//             {hasMoreDoctors && (
//               <div className="text-center mt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => setDoctorPage(doctorPage + 1)}
//                 >
//                   Load More Doctors
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderHospitalsSection = () => {
//     if (activeFilterTab === "doctors") return null;
    
//     return (
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-green-600">Hospitals & Facilities</h2>
//           {filteredFacilities.length > HOSPITALS_PER_PAGE && (
//             <Button 
//               variant="ghost" 
//               className="text-green-600"
//               onClick={handleViewAllHospitals}
//             >
//               View All Hospitals <ChevronRight className="ml-1 h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         <div className="space-y-4 row">
//           {paginatedHospitals.length > 0 ? (
//             paginatedHospitals.map((facility) => (
//               <HospitalCard
//                 key={facility.id}
//                 facility={facility}
//                 departments={getFacilityDepartments(facility.id)}
//                 user={user}
//                 expandedTimeSlotId={expandedTimeSlotId}
//                 timeSlots={timeSlots}
//                 bookings={bookings}
//                 selectedSlot={selectedSlot}
//                 selectedDay={selectedDay}
//                 onToggleExpandDepartment={toggleExpandDepartment}
//                 onViewHospitalDetails={handleViewHospitalDetails}
//                 onViewHospitalDepartmentDetails={handleViewHospitalDepartmentDetails}
//                 onViewDepartment={handleViewDepartment}
//                 onSelectDay={setSelectedDay}
//                 onSelectSlot={setSelectedSlot}
//                 onDepartmentBookNow={handleDepartmentBookNow}
//                 // onLogin={handleLogin}
//                 formatDayLabel={formatDayLabel}
//                 formatDateNumber={formatDateNumber}
//                 formatTimePretty={formatTimePretty}
//               />
//             ))
//           ) : (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">No hospitals found matching your criteria.</p>
//               </CardContent>
//             </Card>
//           )}

//           {hasMoreHospitals && (
//             <div className="text-center mt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setHospitalPage(hospitalPage + 1)}
//               >
//                 Load More Hospitals
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Main Render
//   return (
//     <div className="space-y-6">
//       <SearchHeader
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         locationFilter={locationFilter}
//         setLocationFilter={setLocationFilter}
//         selectedSpecialty={selectedSpecialty}
//         setSelectedSpecialty={setSelectedSpecialty}
//         activeFilterTab={activeFilterTab}
//         setActiveFilterTab={setActiveFilterTab}
//         showFilters={showFilters}
//         setShowFilters={setShowFilters}
//         onSearch={handleSearch}
//         onDetectLocation={detectLocation}
//         specialties={specialties}
//          doctorSpecialties={doctorSpecialties}
//   hospitalDepartments={hospitalDepartments}
//   cities={cities}
//       />

//       {/* Results Count */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">
//           {/* {activeFilterTab === "all" && (
//             <>Found {filteredDoctors.length} doctors & {filteredFacilities.length} hospitals</>
//           )} */}
//           {activeFilterTab === "doctors" && (
//             <>Found {filteredDoctors.length} doctors</>
//           )}
//           {activeFilterTab === "hospitals" && (
//             <>Found {filteredFacilities.length} hospitals</>
//           )}
//         </h3>
        
//         {/* <Button 
//           variant="link" 
//           className="text-purple-600"
//           onClick={handleViewAllBookings}
//         >
//           View All Bed Bookings <ChevronRight className="ml-1 h-4 w-4" />
//         </Button> */}
//       </div>

//       {/* Results Sections */}
//       {activeFilterTab !== "hospitals" && renderDoctorsSection()}
//       {activeFilterTab !== "doctors" && renderHospitalsSection()}

//       {/* Confirmation Dialog */}
//       <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
//         <DialogContent className="rounded-xl p-6">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold text-center">
//               Confirm Appointment 
//             </DialogTitle>
//           </DialogHeader>

//           {bookingInfo && (
//             <div className="space-y-4 mt-2">
//               <div className="p-4 bg-gray-100 rounded-lg">
//                 <p className="text-sm text-gray-600">Doctor/Department</p>
//                 <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-100 rounded-lg">
//                   <p className="text-sm text-gray-600">Date</p>
//                   <p className="text-md font-medium">
//                     {bookingInfo.booking_date}
//                   </p>
//                 </div>

//                 <div className="p-4 bg-gray-100 rounded-lg">
//                   <p className="text-sm text-gray-600">Time Slot</p>
//                   <p className="text-md font-medium">
//                     {formatTimePretty(bookingInfo.start_time)} -{" "}
//                     {formatTimePretty(bookingInfo.end_time)}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <label className="text-sm font-medium text-gray-600">
//                   Notes (optional)
//                 </label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Add message for doctor..."
//                   className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
//                   rows={3}
//                 />
//               </div>
//             </div>
//           )}

//           <DialogFooter className="mt-6 flex justify-between">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setConfirmOpen(false);
//                 setNotes("");
//               }}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//               onClick={handleConfirmBooking}
//             >
//               Confirm Booking
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default DoctorSearch;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Building2, Users, Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import DoctorCard from "./Search/DoctorCard";
import HospitalCard from "./Search/HospitalCard";
import SearchHeader from "./Search/SearchHeader";
import { Label } from "../ui/label";

export interface Doctor {
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
  description?: string;
  city?: string;
  state?: string;
  address?:string;
  pincode?:string;
  country_code?:string;
}

export interface BookingInfo {
  slot_id: string;
  start_time: string;
  end_time: string;
  booking_date: string;
  doctor_id: string;
  doctor_name: string;
  department_id?: string;
}

export interface TimeSlot {
  id: string;
  doctor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_available: boolean;
}

export interface Department {
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
  price_per_day?: number;
  has_variable_pricing?: boolean;
}

export interface Facility {
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
  departments?: Department[];
}

interface DoctorSearchProps {
  view: "all" | "doctors" | "hospitals";
}

const DoctorSearch: React.FC<DoctorSearchProps> = ({ view }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("all");
  
  // Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [facilityType, setFacilityType] = useState("all");
  // UI States
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  
  // Booking States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [notes, setNotes] = useState("");
  
  // Pagination States
  const [doctorPage, setDoctorPage] = useState(1);
  const [hospitalPage, setHospitalPage] = useState(1);
  const DOCTORS_PER_PAGE = 8;
  const HOSPITALS_PER_PAGE = 8;

  // Data Arrays
  const doctorSpecialties = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Gynecologist",
    "Psychiatrist",
    "Dentist",
    "Physiotherapist",
    "Dietician",
    "Ophthalmologist",
    "ENT Specialist",
    "Oncologist",
    "Nephrologist",
  ];

  const hospitalDepartments = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Surgery",
    "Emergency",
    "ICU",
    "Radiology",
    "Pathology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
    "Physiotherapy",
    "Dental",
    "Ayurveda",
    "Homeopathy",
    "Dietetics"
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Pune",
    "Hyderabad",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Bhopal",
    "Indore",
    "Nagpur",
    "Surat"
  ];

  // Helper Functions
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
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

  useEffect(() => {
    if (view === "doctors") {
      setActiveFilterTab("doctors");
    } else if (view === "hospitals") {
      setActiveFilterTab("hospitals");
    } else {
      setActiveFilterTab("all");
    }
  }, [view]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Fetching
  // const fetchDoctors = async () => {
  //   try {
  //     const { data, error } = await supabase.from("medical_professionals")
  //       .select(`
  //         *,
  //         medical_professionals_user_id_fkey (
  //           first_name,
  //           last_name,
  //           avatar_url,
  //           user_id,
  //         )
  //       `);

  //     if (error) throw error;

  //     const mapped = data.map((item: any) => {
  //       const fullName = item.medical_professionals_user_id_fkey
  //         ? `${item.medical_professionals_user_id_fkey.first_name || ""} ${
  //             item.medical_professionals_user_id_fkey.last_name || ""
  //           }`.trim()
  //         : "Unknown Doctor";

  //       // Extract city from location if available
  //       let city = "";
  //       let state = "";
  //     let fullAddress = "";
  //       if (item.about_yourself) {
  //       // Try to extract location from about_yourself
  //       const locationParts = item.about_yourself.split(',');
  //       if (locationParts.length >= 2) {
  //         city = locationParts[1].trim();
  //         fullAddress = item.about_yourself;
  //       } else {
  //         fullAddress = item.about_yourself;
  //       }
  //     }
  //      if (item.city) city = item.city;
  //     if (item.state) state = item.state;
      
  //     // Build address if not already set
  //     if (!fullAddress) {
  //       const addressParts = [
  //         item.address,
  //         item.address_line1,
  //         city,
  //         state,
  //         item.pincode
  //       ].filter(part => part && part.trim() !== "");
  //       fullAddress = addressParts.join(", ");
  //     }

  //       return {
  //         id: item.id,
  //         user_id: item.medical_professionals_user_id_fkey?.user_id || "",
  //         name: fullName || "Unknown Doctor",
  //         specialty: item.medical_speciality,
  //         rating: item.rating || 0,
  //         experience: item.years_experience ? `${item.years_experience} years` : "N/A",
  //         consultationFee: item.consultation_fee || 0,
  //         availability: item.availability?.status || "Not Available",
  //         hospital: item.medical_school || "Not specified",
  //         location: item.about_yourself || "Location not provided",
  //          address: fullAddress || item.location || "Address not available",
  //       city: city || item.city || "",
  //       state: state || item.state || "",
  //       country_code: item.country_code || "IN",
  //       pincode: item.pincode || "",
  //         image: item.medical_professionals_user_id_fkey?.avatar_url || "",
  //         description: item.description || item.about_yourself || "No description provided.",
  //       } as Doctor;
  //     });

  //     setDoctors(mapped);
  //   } catch (error) {
  //     console.error("Error fetching doctors:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch doctors",
  //       variant: "destructive"
  //     });
  //   }
  // };
 const fetchDoctors = async () => {
  try {
    const { data, error } = await supabase.from("medical_professionals")
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

      // Build the full address from database fields
      const addressParts = [
        item.address,
        item.city,
        item.state,
        item.pincode,
        item.country_code
      ].filter(part => part && part.trim() !== "");
      
      const fullAddress = addressParts.join(", ");

      return {
        id: item.id,
        user_id: item.medical_professionals_user_id_fkey?.user_id || "",
        name: fullName || "Unknown Doctor",
        specialty: item.medical_speciality,
        rating: item.rating || 0,
        experience: item.years_experience ? `${item.years_experience} years` : "N/A",
        consultationFee: item.consultation_fee || 0,
        availability: item.availability?.status || "Not Available",
        hospital: item.medical_school || "Not specified",
        location: item.about_yourself || "Location not provided",
        address: item.address || fullAddress || "Address not available",
        city: item.city || "",
        state: item.state || "",
        country_code: item.country_code || "IN",
        pincode: item.pincode || "",
        image: item.medical_professionals_user_id_fkey?.avatar_url || "",
        description: item.description || item.about_yourself || "No description provided.",
      } as Doctor;
    });

    setDoctors(mapped);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    toast({
      title: "Error",
      description: "Failed to fetch doctors",
      variant: "destructive"
    });
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
          country_code,
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
        }));
        
        setFacilities(enhancedFacilities);
        
        const facilityIds = facilitiesData.map(f => f.id);
        
        if (facilityIds.length > 0) {
          const { data: departmentsData, error: departmentsError } = await supabase
            .from("departments")
            .select("*")
            .in("facility_id", facilityIds);

          if (!departmentsError && departmentsData) {
            setDepartments(departmentsData);
            
            // Attach departments to facilities
            setFacilities(prev => prev.map(facility => ({
              ...facility,
              departments: departmentsData.filter(d => d.facility_id === facility.id)
            })));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };
//   const filteredFacilities = facilities.filter((facility) => {
//   if (activeFilterTab === "doctors") return false;
  
//   const term = searchQuery.toLowerCase().trim();
//   if (term === "") return true;
  
//   const matchesFacilityName = facility.facility_name?.toLowerCase().includes(term);
//   const matchesCity = facility.city?.toLowerCase().includes(term);
//   const matchesState = facility.state?.toLowerCase().includes(term);
//   const matchesType = facility.facility_type?.toLowerCase().includes(term);
//   const matchesAbout = facility.about_facility?.toLowerCase().includes(term);
  
//   const matchesDepartments = departments.some(
//     (dept) =>
//       dept.facility_id === facility.id &&
//       (
//         dept.name?.toLowerCase().includes(term) ||
//         dept.description?.toLowerCase().includes(term)
//       )
//   );

//   const matchesDepartmentFilter = selectedSpecialty === "all" || 
//     departments.some(
//       (dept) => dept.facility_id === facility.id && 
//       dept.name?.toLowerCase() === selectedSpecialty.toLowerCase()
//     );

//   const matchesLocation = locationFilter === "all" || 
//     facility.city?.toLowerCase() === locationFilter.toLowerCase();

//   // Add facility type filter
//   const matchesFacilityType = facilityType === "all" || 
//     facility.facility_type?.toLowerCase() === facilityType.toLowerCase();

//   return (matchesFacilityName || matchesCity || matchesState || matchesType || matchesAbout || matchesDepartments) &&
//          matchesDepartmentFilter &&
//          matchesLocation &&
//          matchesFacilityType;
// });

const filteredFacilities = facilities.filter((facility) => {
  if (activeFilterTab === "doctors") return false;
  
  const term = searchQuery.toLowerCase().trim();
  
  // Check if term is empty - if yes, still apply facility type filter
  const matchesSearch = term === "" || 
    facility.facility_name?.toLowerCase().includes(term) ||
    facility.city?.toLowerCase().includes(term) ||
    facility.state?.toLowerCase().includes(term) ||
    facility.facility_type?.toLowerCase().includes(term) ||
    facility.about_facility?.toLowerCase().includes(term) ||
    departments.some(
      (dept) =>
        dept.facility_id === facility.id &&
        (dept.name?.toLowerCase().includes(term) ||
          dept.description?.toLowerCase().includes(term))
    );

  const matchesDepartmentFilter = selectedSpecialty === "all" || 
    departments.some(
      (dept) => dept.facility_id === facility.id && 
      dept.name?.toLowerCase() === selectedSpecialty.toLowerCase()
    );

  const matchesLocation = locationFilter === "all" || 
    facility.city?.toLowerCase() === locationFilter.toLowerCase();

  // Add facility type filter - this works even when search is empty
  const matchesFacilityType = facilityType === "all" || 
    facility.facility_type?.toLowerCase() === facilityType.toLowerCase();

  // Return true only if ALL conditions match
  return matchesSearch && 
         matchesDepartmentFilter && 
         matchesLocation && 
         matchesFacilityType;
});
  const fetchTimeSlotsAndBookings = async (doctorId: string) => {
    try {
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("doctor_id", doctorId)
        .eq("is_available", true);

      if (slotsError) throw slotsError;
      setTimeSlots(slotsData || []);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId);

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setTimeSlots([]);
      setBookings([]);
    }
  };

  const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
    try {
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("department_id", department.id)
        .eq("slot_type", "booking")
        .eq("is_available", true);

      if (slotsError) throw slotsError;
      setTimeSlots(slotsData || []);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("department_id", department.id);

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (err) {
      console.error("Error fetching department slots:", err);
      setTimeSlots([]);
      setBookings([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDoctors(), fetchFacilityDetails()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Enhanced Filter Logic
  const filteredDoctors = doctors.filter((doctor) => {
    if (activeFilterTab === "hospitals") return false;
    
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = term === "" || 
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term) ||
      (doctor.hospital && doctor.hospital.toLowerCase().includes(term)) ||
      (doctor.description && doctor.description.toLowerCase().includes(term)) ||
      (doctor.location && doctor.location.toLowerCase().includes(term)) ||
      (doctor.city && doctor.city.toLowerCase().includes(term));

    const matchesSpecialty = selectedSpecialty === "all" || 
      doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    const matchesLocation = locationFilter === "all" || 
      (doctor.location && doctor.location.toLowerCase().includes(locationFilter.toLowerCase())) ||
      (doctor.city && doctor.city.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // const filteredFacilities = facilities.filter((facility) => {
  //   if (activeFilterTab === "doctors") return false;
    
  //   const term = searchQuery.toLowerCase().trim();
  //   if (term === "") return true;
    
  //   const matchesFacilityName = facility.facility_name?.toLowerCase().includes(term);
  //   const matchesCity = facility.city?.toLowerCase().includes(term);
  //   const matchesState = facility.state?.toLowerCase().includes(term);
  //   const matchesType = facility.facility_type?.toLowerCase().includes(term);
  //   const matchesAbout = facility.about_facility?.toLowerCase().includes(term);
    
  //   const matchesDepartments = departments.some(
  //     (dept) =>
  //       dept.facility_id === facility.id &&
  //       (
  //         dept.name?.toLowerCase().includes(term) ||
  //         dept.description?.toLowerCase().includes(term)
  //       )
  //   );

  //   const matchesDepartmentFilter = selectedSpecialty === "all" || 
  //     departments.some(
  //       (dept) => dept.facility_id === facility.id && 
  //       dept.name?.toLowerCase() === selectedSpecialty.toLowerCase()
  //     );

  //   const matchesLocation = locationFilter === "all" || 
  //     facility.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
  //     facility.state?.toLowerCase().includes(locationFilter.toLowerCase());

  //   return (matchesFacilityName || matchesCity || matchesState || matchesType || matchesAbout || matchesDepartments) &&
  //          matchesDepartmentFilter &&
  //          matchesLocation;
  // });

  const getFacilityDepartments = (facilityId: string) => {
    const facilityDepts = departments.filter(dept => dept.facility_id === facilityId);
    
    if (searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase().trim();
      return facilityDepts.filter(dept => 
        dept.name?.toLowerCase().includes(term) || 
        dept.description?.toLowerCase().includes(term)
      );
    }
    
    return facilityDepts;
  };

  // Pagination
  const paginatedDoctors = filteredDoctors.slice(0, doctorPage * DOCTORS_PER_PAGE);
  const paginatedHospitals = filteredFacilities.slice(0, hospitalPage * HOSPITALS_PER_PAGE);
  
  const hasMoreDoctors = paginatedDoctors.length < filteredDoctors.length;
  const hasMoreHospitals = paginatedHospitals.length < filteredFacilities.length;

  // Handlers
  const handleSearch = () => {
    setDoctorPage(1);
    setHospitalPage(1);
    setSearchPerformed(true);
    
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Looking for "${searchQuery}"`,
      });
    }
  };

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

  const toggleExpandDepartment = async (department: Department) => {
    if (expandedTimeSlotId === department.id) {
      setExpandedTimeSlotId(null);
      setSelectedSlot(null);
      setTimeSlots([]);
      setBookings([]);
      setSelectedDay(0);
      return;
    }

    setExpandedTimeSlotId(department.id);
    setSelectedSlot(null);
    setTimeSlots([]);
    setBookings([]);
    setSelectedDay(0);
    await fetchTimeSlotsAndDepartmentBookings(department);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Detected",
            description: "Showing results near your location...",
          });
          // Here you would typically update filters based on coordinates
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or enter your area manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleBookNow = (slot: TimeSlot, dateIndex: number, doctor: Doctor) => {
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

    setBookingInfo(bookingData);
    setConfirmOpen(true);
  };

  const handleDepartmentBookNow = (slot: TimeSlot, dateIndex: number, department: Department) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dateIndex);

    const bookingData: BookingInfo = {
      slot_id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      booking_date: newDate.toISOString().split("T")[0],
      doctor_id: "",
      doctor_name: department.name || "Department",
      department_id: department.id,
    };

    setBookingInfo(bookingData);
    setConfirmOpen(true);
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

  const handleViewDoctorProfile = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (user) {
      navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
    } else {
      navigate(`/appointment/doctorprofile/doctor/${createSlug(doctor?.name || "")}/${doctorId}`, {
        state: { doctorData: doctor }
      });
    }
  };

  const handleViewHospitalDetails = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    const path = user ? '/dashboard/patient/facility' : '/appointment/facilityprofile/facility';
    navigate(`${path}/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
      state: { activeTab: 'overview', from: 'search' }
    });
  };

  const handleViewHospitalDepartmentDetails = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    const path = user ? '/dashboard/patient/facility' : '/appointment/facilityprofile/facility';
    navigate(`${path}/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
      state: { activeTab: 'departments', from: 'search' }
    });
  };

  const handleViewDepartment = (department: Department) => {
    const path = user ? '/dashboard/patient/department' : '/appointment/facilityprofile/department';
    navigate(`${path}/${createSlug(department.name || "")}/${department.id}`, {
      state: { facility: facilities.find(f => f.id === department.facility_id) }
    });
  };

  const handleViewAllDoctors = () => {
    setActiveFilterTab("doctors");
    setDoctorPage(1);
  };

  const handleViewAllHospitals = () => {
    setActiveFilterTab("hospitals");
    setHospitalPage(1);
  };

  // Render Functions
  const renderDoctorsSection = () => {
    if (activeFilterTab === "hospitals") return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">
            {searchPerformed ? "Doctors Matching Your Search" : "Recommended Doctors"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredDoctors.length} found)
            </span>
          </h2>
          {/* {filteredDoctors.length > DOCTORS_PER_PAGE && (
            <Button 
              variant="ghost" 
              className="text-blue-600"
              onClick={handleViewAllDoctors}
            >
              View All Doctors <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )} */}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
           <div className="space-y-4 row">
            {paginatedDoctors.length > 0 ? (
              paginatedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  user={user}
                  expandedDoctorId={expandedDoctorId}
                  timeSlots={timeSlots}
                  bookings={bookings}
                  selectedSlot={selectedSlot}
                  selectedDay={selectedDay}
                  onToggleExpand={toggleExpand}
                  onViewProfile={handleViewDoctorProfile}
                  onSelectDay={setSelectedDay}
                  onSelectSlot={setSelectedSlot}
                  onBookNow={handleBookNow}
                  formatDayLabel={formatDayLabel}
                  formatDateNumber={formatDateNumber}
                  formatTimePretty={formatTimePretty}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <SearchIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No doctors found</p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search or filters to find more results
                  </p>
                </CardContent>
              </Card>
            )}

            {hasMoreDoctors && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDoctorPage(doctorPage + 1)}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  Load More Doctors
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderHospitalsSection = () => {
    if (activeFilterTab === "doctors") return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-600">
            {searchPerformed ? "Hospitals Matching Your Search" : "Recommended Hospitals / Facility"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredFacilities.length} found)
            </span>
          </h2>
          {/* {filteredFacilities.length > HOSPITALS_PER_PAGE && (
            <Button 
              variant="ghost" 
              className="text-green-600"
              onClick={handleViewAllHospitals}
            >
              View All Hospitals <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )} */}
        </div>

        <div className="space-y-4 row">
          {paginatedHospitals.length > 0 ? (
            paginatedHospitals.map((facility) => (
              <HospitalCard
                key={facility.id}
                facility={facility}
                departments={getFacilityDepartments(facility.id)}
                user={user}
                expandedTimeSlotId={expandedTimeSlotId}
                timeSlots={timeSlots}
                bookings={bookings}
                selectedSlot={selectedSlot}
                selectedDay={selectedDay}
                selectedDepartmentFilter={selectedSpecialty} 
                onToggleExpandDepartment={toggleExpandDepartment}
                onViewHospitalDetails={handleViewHospitalDetails}
                onViewHospitalDepartmentDetails={handleViewHospitalDepartmentDetails}
                onViewDepartment={handleViewDepartment}
                onSelectDay={setSelectedDay}
                onSelectSlot={setSelectedSlot}
                onDepartmentBookNow={handleDepartmentBookNow}
                formatDayLabel={formatDayLabel}
                formatDateNumber={formatDateNumber}
                formatTimePretty={formatTimePretty}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No hospitals found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or filters to find more results
                </p>
              </CardContent>
            </Card>
          )}

          {hasMoreHospitals && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setHospitalPage(hospitalPage + 1)}
                className="border-green-200 hover:bg-green-50"
              >
                Load More Hospitals
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        activeFilterTab={activeFilterTab}
        setActiveFilterTab={setActiveFilterTab}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onSearch={handleSearch}
        onDetectLocation={detectLocation}
        doctorSpecialties={doctorSpecialties}
        hospitalDepartments={hospitalDepartments}
        cities={cities}
         facilityType={facilityType}
  setFacilityType={setFacilityType}
      />

      {/* Results Count */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">
          {activeFilterTab === "doctors" && (
            <>Found <span className="text-blue-600">{filteredDoctors.length}</span> doctors</>
          )}
          {activeFilterTab === "hospitals" && (
            <>Found <span className="text-green-600">{filteredFacilities.length}</span> hospitals</>
          )}
          {activeFilterTab === "all" && (
            <>Found <span className="text-blue-600">{filteredDoctors.length}</span> doctors & <span className="text-green-600">{filteredFacilities.length}</span> hospitals</>
          )}
        </h3>
      </div>

      {/* Results Sections */}
      {activeFilterTab !== "hospitals" && renderDoctorsSection()}
      {activeFilterTab !== "doctors" && renderHospitalsSection()}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Confirm Appointment 
            </DialogTitle>
          </DialogHeader>

          {bookingInfo && (
            <div className="space-y-4 mt-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Doctor/Department</p>
                <p className="text-lg font-semibold text-blue-700">{bookingInfo.doctor_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-md font-medium">
                    {new Date(bookingInfo.booking_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="text-md font-medium">
                    {formatTimePretty(bookingInfo.start_time)} - {formatTimePretty(bookingInfo.end_time)}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special requests or information for the doctor..."
                  className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setNotes("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSearch;