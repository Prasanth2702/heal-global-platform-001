// // // DepartmentDetails.tsx
// // import { useState, useEffect, useRef } from "react";
// // import { useParams, useNavigate, useLocation } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Building2,
// //   BedDouble,
// //   Activity,
// //   Users,
// //   CheckCircle,
// //   XCircle,
// //   Microscope,
// //   Star,
// //   ArrowLeft,
// //   Calendar,
// //   ChevronRight,
// // } from "lucide-react";
// // import { supabase } from "@/integrations/supabase/client";
// // import DashboardLayout from "../layouts/DashboardLayout";
// // import { toast } from "@/hooks/use-toast";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import Loader2 from "../ui/Loader2";
// // import { useFacilityLimit } from "@/hooks/useFacilityLimit";

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
// // }

// // interface Doctor {
// //   id: string;
// //   name: string;
// //   specialty: string;
// //   rating: number;
// //   image?: string;
// // }

// // interface Facility {
// //   id: string;
// //   facility_name: string;
// //   facility_type: string;
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
// // interface BookingInfo {
// //   slot_id: string;
// //   start_time: string;
// //   end_time: string;
// //   booking_date: string;
// //   doctor_id: string;
// //   doctor_name: string;
// //   department_id?: string;
// // }
// // const DepartmentDetails = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const facility = location.state?.facility as Facility | null;
// //  // Add this ref for the booking section
// //   const bookingSectionRef = useRef<HTMLDivElement>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [department, setDepartment] = useState<Department | null>(null);
// //   const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
// // // Add these missing state declarations at the top with your other states
// // const [confirmOpen, setConfirmOpen] = useState(false);
// // const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
// // const [notes, setNotes] = useState("");
// // const [isBooking, setIsBooking] = useState(false);
// // const [hasTimeSlots, setHasTimeSlots] = useState<boolean | null>(null);
// // const createSlug = (text: string) => {
// //   return text
// //     .toLowerCase()
// //     .replace(/[^a-z0-9]+/g, '-')
// //     .replace(/^-+|-+$/g, '');
// // };
// // const [isBookingBlocked, setIsBookingBlocked] = useState(false);
// // const [existingBooking, setExistingBooking] = useState<any>(null);
// // const [checkingBooking, setCheckingBooking] = useState(false);

// // useEffect(() => {
// //   if (facility?.id) {
// //     checkBookingStatus(facility.id);
// //   }
// // }, [facility]);
// // const checkBookingStatus = async (facilityId: string) => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("booking_attempts")
// //       .insert({ facility_id: facilityId, booking_type: "appointment" })
// //       .eq("facility_id", facilityId); // ✅ FIX

// //     if (error) {
// //       console.error("Booking status error:", error);
// //       return;
// //     }

// //     // ✅ If no row → allow booking
// //     if (!data) {
// //       setIsBookingBlocked(false);
// //       return;
// //     }
   
// //   } catch (err) {
// //     console.error("checkBookingStatus error:", err);
// //   }
// // };
// // const checkExistingAppointment = async (
// //   departmentId: string,
// //   bookingDate: string
// // ) => {
// //   try {
// //     setCheckingBooking(true);

// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser();

// //     if (!user) return null;

// //     const { data, error } = await supabase
// //       .from("appointments")
// //       .select("*")
// //       .eq("patient_id", user.id)
// //       .eq("department_id", departmentId)
// //       .eq("appointment_date", bookingDate)
// //       .in("status", ["pending", "confirmed"])
// //       .maybeSingle();

// //     if (error) {
// //       console.error("Existing booking check error:", error);
// //       return null;
// //     }

// //     return data;
// //   } catch (err) {
// //     console.error("checkExistingAppointment error:", err);
// //     return null;
// //   } finally {
// //     setCheckingBooking(false);
// //   }
// // };
// // // Add this missing function
// // const handleConfirmBooking = async () => {
// //   if (!bookingInfo) return;

// //   try {
// //     setIsBooking(true);

// //     const bookingDateObj = new Date(bookingInfo.booking_date);

// // const dayOfWeek = bookingDateObj.toLocaleDateString("en-US", {
// //   weekday: "long",
// // });

// // const slotStatus = await checkSlotAvailability(
// //   bookingInfo.slot_id,
// //   bookingInfo.booking_date,
// //   dayOfWeek // ✅ correct
// // );

// //     // if (!slotStatus || slotStatus.count <= 0) {
// //     if (
// //   !slotStatus ||
// //   slotStatus.booked_count >= slotStatus.max_appointments
// // ) {
// //       toast({
// //         title: "Slot Full",
// //         description: "This time slot is already fully booked.",
// //         variant: "destructive",
// //       });
// //       setIsBooking(false);
// //       return;
// //     }

// //     const { data: { user }, error: userError } = await supabase.auth.getUser();
    
// //     if (userError || !user) {
// //       toast({
// //         title: "Authentication Required",
// //         description: "Please log in to book an appointment.",
// //         variant: "destructive",
// //       });
// //       navigate('/login');
// //       return;
// //     }

// //     const { data: sessionData } = await supabase.auth.getSession();
// //     const token = sessionData.session?.access_token;

// //     const payload = {
// //       patient_id: user.id,
// //       doctor_id: null,
// //       facility_id: department?.facility_id || null,
// //       department_id: bookingInfo.department_id,
// //       booking_date: bookingInfo.booking_date,
// //       time_slot_id: bookingInfo.slot_id,
// //       notes: notes || null,
// //     };
    
// //     const response = await fetch(
// //       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-temp-booking",
// //       // "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee",
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //       }
// //     );

// //     const result = await response.json();
    
// //     if (!response.ok) {
// //       toast({
// //         title: "Error",
// //         description: result.error || "Unable to book appointment",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     toast({
// //       title: "Success",
// //       description: "Appointment booked successfully!",
// //     });
// //     setConfirmOpen(false);
// //     setNotes("");
// //     setSelectedSlot(null);
// //     setExpandedTimeSlotId(null);
    
// //     // Refresh slots
// //     if (department) {
// //       await fetchTimeSlotsAndDepartmentBookings(department);
// //     }
// //   } catch (err: any) {
// //     console.error("Booking error:", err);
// //     toast({
// //       title: "Error",
// //       description: err?.message || "Unable to book appointment",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsBooking(false);
// //   }
// // };
// //   useEffect(() => {
// //     if (id) {
// //       fetchDepartmentDetails();
// //     }
// //   }, [id]);

// //   const { checkLimit, limits, loading: limitLoading } = useFacilityLimit();
// //     useEffect(() => {
// //       if (facility) {
// //         checkLimit(facility.id, "clinical"); // 🔥 AUTO CALL
// //       }
// //     }, [facility]);

// //     const isClinicalLimitReached =
// //   limits?.limits?.clinical &&
// //   limits.limits.clinical.allowed === false;



// //   // useEffect(() => {
// //   //     if (slot) {
// //   //       checkSlotAvailability(slot.id, data); // 🔥 AUTO CALL
// //   //     }
// //   //   }, [slot]);
// //     const checkSlotAvailability = async (slotId: string, date: string, dayOfWeek:string) => {
// //   try {
// //     const { data: sessionData } = await supabase.auth.getSession();
// //     const token = sessionData.session?.access_token;

// //     const response = await fetch(
// //       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/get-time-slot-counts",
// //       {
// //         method: "POST",
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           time_slot_id: slotId,
// //           date: date,
// //           day_Of_Week: dayOfWeek.toLowerCase()
// //         }),
// //       }
// //     );

// //     const result = await response.json();

// //     console.log("result", result)

// //     if (!response.ok || !result.success) {
// //       throw new Error(result.error || "Failed to check slot");
// //     }

// //     return result; // contains count, booked_count, max_appointments
// //   } catch (error) {
// //     console.error("Slot check error:", error);
// //     return null;
// //   }
// // };

// //   // const fetchDepartmentDetails = async () => {
// //   //   setLoading(true);
// //   //   try {
// //   //     // Fetch department details
// //   //     const { data: deptData, error: deptError } = await supabase
// //   //       .from("departments")
// //   //       .select("*")
// //   //       .eq("id", id)
// //   //       .single();

// //   //     if (deptError) throw deptError;
// //   //     setDepartment(deptData);

// //   //     // Fetch doctors in this department
// //   //     const { data: doctorsData, error: doctorsError } = await supabase
// //   //       .from("medical_professionals")
// //   //       .select(`
// //   //         *,
// //   //         medical_professionals_user_id_fkey (
// //   //           first_name,
// //   //           last_name,
// //   //           avatar_url
// //   //         )
// //   //       `);
// //   //       // .eq("department_id", id);

// //   //     if (doctorsError) throw doctorsError;

// //   //     if (doctorsData) {
// //   //       const mapped = doctorsData.map((item: any) => ({
// //   //         id: item.id,
// //   //         name: `${item.medical_professionals_user_id_fkey?.first_name || ""} ${
// //   //           item.medical_professionals_user_id_fkey?.last_name || ""
// //   //         }`.trim() || "Unknown Doctor",
// //   //         specialty: item.medical_speciality,
// //   //         rating: item.rating || 4.5,
// //   //         image: item.medical_professionals_user_id_fkey?.avatar_url || "",
// //   //       }));
// //   //       setDepartmentDoctors(mapped);
// //   //     }
// //   //   } catch (error) {
// //   //     console.error("Error fetching department details:", error);
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   // const handleViewDoctor = (doctorId: string) => {
// //   //   navigate(`/dashboard/patient/doctor/${createSlug(department?.name || "")}/${doctorId}`);
// //   // };
// // // Replace the doctors query with staff query
// // const fetchDepartmentDetails = async () => {
// //   setLoading(true);
// //   try {
// //     // Fetch department details
// //     const { data: deptData, error: deptError } = await supabase
// //       .from("departments")
// //       .select("*")
// //       .eq("id", id)
// //       .single();

// //     if (deptError) throw deptError;
// //     setDepartment(deptData);

// //     // Fetch STAFF in this department (not medical_professionals)
// //     const { data: staffData, error: staffError } = await supabase
// //       .from("staff")
// //       .select(`
// //         *,
// //         profiles!staff_user_id_fkey (
// //           first_name,
// //           last_name,
// //           avatar_url
// //         )
// //       `)
// //       .eq("department_id", id); // Filter by department_id

// //     if (staffError) throw staffError;

// //     if (staffData) {
// //       const mapped = staffData.map((item: any) => ({
// //         id: item.id,
// //         name: `${item.profiles?.first_name || ""} ${
// //           item.profiles?.last_name || ""
// //         }`.trim() || "Unknown Staff",
// //         specialty: item.position || item.role || "Staff", // Use position or role
// //         rating: 4.5, // Default rating or from another table
// //         image: item.profiles?.avatar_url || "",
// //         role: item.role,
// //         position: item.position
// //       }));
// //       setDepartmentDoctors(mapped);
// //     }
// //     const { data: slotCheck, error: slotError } = await supabase
// //   .from("time_slots")
// //   .select("id")
// //   .eq("department_id", deptData.id)
// //   .limit(1);

// // if (slotError) {
// //   console.error("Slot check error:", slotError);
// //   setHasTimeSlots(false);
// // } else {
// //   setHasTimeSlots((slotCheck?.length || 0) > 0);
// // }

// // const { data: { user } } = await supabase.auth.getUser();

// // if (!user) return;
// // const { data: bookingsData, error: bookingsError } = await supabase
// //         .from("appointments")
// //         .select("*")
// //         .eq("patient_id", user.id)

// //   } catch (error) {
// //     console.error("Error fetching department details:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   const handleBookAppointmentClick = () => {
// //     if (bookingSectionRef.current) {
// //       bookingSectionRef.current.scrollIntoView({ 
// //         behavior: 'smooth', 
// //         block: 'start' 
// //       });
// //     }
// //   };

// //     const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
// //     const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
// //     const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
// //     const [bookings, setBookings] = useState<any[]>([]);
// //     const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
// //     const [selectedDay, setSelectedDay] = useState<number>(0);
// //     const [slotAvailability, setSlotAvailability] = useState<Record<string, any>>({});
  
// //  const toggleExpandDepartment = async (department: Department) => {
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

// //   const formatDayLabel = (date: Date, index: number) => {
// //     // if (index === 0) return "Today";
// //     if (index === 0) return "Tomorrow";
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



// // const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
// //     try {

      
// //       const { data: slotsData, error: slotsError } = await supabase
// //         .from("time_slots")
// //         .select("*")
// //         .eq("department_id", department.id)
// //         // .eq("slot_type", "booking")
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

// // //     const handleDepartmentBookNow = (slot: TimeSlot, dateIndex: number, department: Department) => {
// // //     const newDate = new Date();
// // //     // newDate.setDate(newDate.getDate() + dateIndex);
// // // const dayOffset = dateIndex + 1;
// // // newDate.setDate(newDate.getDate() + dayOffset);
// // //     const bookingData: BookingInfo = {
// // //       slot_id: slot.id,
// // //       start_time: slot.start_time,
// // //       end_time: slot.end_time,
// // //       booking_date: newDate.toISOString().split("T")[0],
// // //       doctor_id: "",
// // //       doctor_name: department.name || "Department",
// // //       department_id: department.id,
// // //     };

// // //     setBookingInfo(bookingData);
// // //     setConfirmOpen(true);
// // //   };
// // const handleDepartmentBookNow = async (
// //   slot: TimeSlot,
// //   dateIndex: number,
// //   department: Department
// // ) => {
// //   const newDate = new Date();

// //   const dayOffset = dateIndex + 1;

// //   newDate.setDate(newDate.getDate() + dayOffset);

// //   const bookingDate = newDate.toISOString().split("T")[0];

// //   // ✅ CHECK SLOT AVAILABILITY
// //   const slotCheck = await checkSlotAvailability(
// //     slot.id,
// //     bookingDate,
// //     slot.day_of_week
// //   );

// //   // ✅ SLOT FULL
// //   if (
// //     !slotCheck ||
// //     slotCheck.success === false ||
// //     slotCheck.remaining_count <= 0
// //   ) {
// //     toast({
// //       title: "Slot Full",
// //       description: "This appointment slot is already full.",
// //       variant: "destructive",
// //     });

// //     return;
// //   }

// //   // ✅ CHECK EXISTING APPOINTMENT
// //   const existing = await checkExistingAppointment(
// //     department.id,
// //     bookingDate
// //   );

// //   // ✅ USER ALREADY BOOKED
// //   if (existing) {
// //     setExistingBooking(existing);

// //     toast({
// //       title: "Appointment Already Exists",
// //       description:
// //         "You already booked an appointment for this department on this date.",
// //       variant: "destructive",
// //     });

// //     // ✅ AUTO OPEN DIALOG
// //     setConfirmOpen(true);

// //     return;
// //   }

// //   const bookingData: BookingInfo = {
// //     slot_id: slot.id,
// //     start_time: slot.start_time,
// //     end_time: slot.end_time,
// //     booking_date: bookingDate,
// //     doctor_id: "",
// //     doctor_name: department.name || "Department",
// //     department_id: department.id,
// //   };

// //   setBookingInfo(bookingData);

// //   // ✅ OPEN CONFIRM DIALOG
// //   setConfirmOpen(true);
// // };
// //   const fetchAvailabilityForDay = async (dayIndex: number) => {
// //   const dayOffset = dayIndex + 1;

// //   const selectedDate = new Date();
// //   selectedDate.setDate(selectedDate.getDate() + dayOffset);

// //   const dateISO = selectedDate.toISOString().split("T")[0];

// //   const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
// //     weekday: "long",
// //   });

// //   const slotsForDay = timeSlots.filter(
// //     (s) => s.day_of_week === dayOfWeek
// //   );

// //   const results: Record<string, any> = {};

// //   await Promise.all(
// //     slotsForDay.map(async (slot) => {
// //       const res = await checkSlotAvailability(
// //         slot.id,
// //         dateISO,
// //         dayOfWeek
// //       );
// //       if (res) results[slot.id] = res;
// //     })
// //   );

// //   setSlotAvailability(results);

// //   return { selectedDate, dateISO, dayOfWeek };
// // };

// //   if (loading) {
// //     return (
// //       <DashboardLayout userType="patient">
// //         <div className="min-h-screen flex items-center justify-center">
// //           <div className="text-center">
// //             {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div> */}
// //             <p className="mt-4 text-gray-600"><Loader2/></p>
// //             {/* <p className="mt-4 text-gray-600">Loading department details...</p> */}
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   if (!department) {
// //     return (
// //       <DashboardLayout userType="patient">
// //         <div className="min-h-screen flex items-center justify-center">
// //           <Card className="p-8 text-center">
// //             <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
// //             <h2 className="text-2xl font-bold text-gray-800 mb-2">Department Not Found</h2>
// //             <p className="text-gray-600 mb-6">The requested department could not be found.</p>
// //             <Button onClick={() => navigate(-1)}>
// //               Go Back
// //             </Button>
// //           </Card>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout userType="patient">
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         {/* Header with navigation */}
// //         <div className="flex justify-between items-center mb-6">
// //           <Button variant="ghost" onClick={() => navigate(-1)}>
// //             <ArrowLeft className="h-4 w-4 mr-2" /> Back
// //           </Button>
// //           {facility && (
// //             <p className="text-sm text-gray-600">
// //               {facility.facility_name} • {facility.facility_type}
// //             </p>
// //           )}
// //         </div>

// //         {/* Department Header */}
// //         <Card className="mb-8 overflow-hidden">
// //           <div className="bg-gradient-to-r from-green-600 to-green-800 h-32"></div>
// //           <CardContent className="relative pt-0">
// //             <div className="flex flex-col md:flex-row justify-between items-start gap-4 -mt-16">
// //               <div className="bg-white p-4 rounded-lg shadow-lg">
// //                 <div className="flex items-center gap-4">
// //                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
// //                     <Building2 className="h-8 w-8 text-green-600" />
// //                   </div>
// //                   <div>
// //                     <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
// //                     {/* <div className="flex items-center gap-2 mt-2">
// //                       {department.is_active ? (
// //                         <Badge className="bg-green-500">Active Department</Badge>
// //                       ) : (
// //                         <Badge variant="outline">Inactive Department</Badge>
// //                       )}
// //                     </div> */}
// //                   </div>
// //                 </div>
// //               </div>
// //               <Button
// //                 size="lg"
// //                 className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0"
// //                 onClick={handleBookAppointmentClick}
// //               >
// //                 <Calendar className="h-4 w-4 mr-2" /> Book Appointment
// //               </Button>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Department Stats */}
// //         {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <BedDouble className="h-8 w-8 text-green-600 mx-auto mb-2" />
// //               <p className="text-sm text-gray-600">Total Beds</p>
// //               <p className="text-2xl font-bold">{department.bed_capacity || 0}</p>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
// //               <p className="text-sm text-gray-600">Available Beds</p>
// //               <p className="text-2xl font-bold">{department.available_beds || 0}</p>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
// //               <p className="text-sm text-gray-600">Doctors</p>
// //               <p className="text-2xl font-bold">{departmentDoctors.length}</p>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               {department.is_active ? (
// //                 <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
// //               ) : (
// //                 <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
// //               )}
// //               <p className="text-sm text-gray-600">Status</p>
// //               <Badge className={department.is_active ? "bg-green-500 mt-1" : "bg-gray-500 mt-1"}>
// //                 {department.is_active ? "Active" : "Inactive"}
// //               </Badge>
// //             </CardContent>
// //           </Card>
// //         </div> */}

// //         {/* Department Info */}
// //         {/* <div className="grid md:grid-cols-3 gap-6"> */}
// //           {/* Left Column - Description & Services */}
// //           <div className="md:col-span-2 space-y-6">
// //           {/* <div className="md:col-span-2 space-y-6"> */}
// //             <Card>
// //               <CardContent className="p-6">
// //                 <h2 className="text-xl font-semibold mb-4">About Department</h2>
// //                 <p className="text-gray-700 leading-relaxed">
// //                   {department.description || "No description available"}
// //                 </p>
                 
// //               </CardContent>
// //             </Card>
// //             <Card ref={bookingSectionRef}>
// //               <CardContent className="p-6">
// //                 <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
// //                  {/* <Button
// //                                 variant="default"
// //                                 size="sm"
// //                                 className="bg-green-600 hover:bg-green-700"
// //                                 onClick={() => toggleExpandDepartment(department)}
// //                               >
// //                                 View Availability
// //                               </Button> */}
// //                               <div className="space-y-3">

// // {hasTimeSlots === false && (
// //   <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
// //     <p className="text-sm text-yellow-700 font-medium">
// //       ⏳ Appointment slots are not available.
// //     </p>
// //     <p className="text-xs text-yellow-600 mt-1">
// //       Please contact the hospital or try again later.
// //     </p>
// //   </div>
// // )}

// // <Button
// //   variant="default"
// //   size="sm"
// //   className="bg-green-600 hover:bg-green-700"
// //   onClick={() => toggleExpandDepartment(department)}
// //   disabled={!hasTimeSlots || isClinicalLimitReached}
// // >
// //   {/* View Availability */}
// //   {isClinicalLimitReached ? "Booking not available, please try after some time." : "View Availability"}
// // </Button>

// // </div>

// //                                {expandedTimeSlotId === department.id && (
// //                                                             <div className="mt-4 p-4 rounded-xl border shadow bg-white">
// //                                                               <h3 className="font-semibold mb-3 text-lg">
// //                                                                 Available Slots
// //                                                               </h3>
                              
// //                                                               {timeSlots.length === 0 ? (
// //                                                                 <p className="text-red-600 font-medium">
// //                                                                   Department {department.name} is not available.
// //                                                                 </p>
// //                                                               ) : (
// //                                                                 <>
// //                                                                   <div className="flex gap-3 overflow-x-auto py-2">
// //                                                                     {Array.from({ length: 14 }).map((_, index) => {
// //                                                                       // const date = new Date();
// //                                                                       // date.setDate(date.getDate() + index);
// //                               const dayOffset = index + 1;        // 1 = tomorrow, 2 = day after, ...
// //   const date = new Date();
// //   date.setDate(date.getDate() + dayOffset);

// //                                                                       const label = formatDayLabel(date, index);
// //                                                                       const dayNumber = formatDateNumber(date);
// //                                                                       const dayOfWeek = date.toLocaleDateString(
// //                                                                         "en-US",
// //                                                                         { weekday: "long" }
// //                                                                       );
                              
// //                                                                       const slotsForDay = timeSlots.filter(
// //                                                                         (s) => s.day_of_week === dayOfWeek
// //                                                                       );
                              
// //                                                                       const dateISO = date.toISOString().split("T")[0];
// //                                                                       const bookingsForDay = bookings.filter((b) => {
// //                                                                         const bookingISO = new Date(b.appointment_date)
// //                                                                           .toISOString()
// //                                                                           .split("T")[0];
// //                                                                         return bookingISO === dateISO;
// //                                                                       });
                              
// //                                                                       const bookedSlotIds = new Set(
// //                                                                         bookingsForDay.map((b) => b.time_slot_id)
// //                                                                       );
                              
// //                                                                       const availableSlotsCount = slotsForDay.filter(
// //                                                                         (slot) => !bookedSlotIds.has(slot.id)
// //                                                                       ).length;
                              
// //                                                                       const isActiveDay = selectedDay === index;
                              
// //                                                                       return (
// //                                                                         <div key={index} className="min-w-[110px]">
// //                                                                           <button
// //                                                                             onClick={ async () => {
// //                                                                               setSelectedDay(index);
// //                                                                               setSelectedSlot(null);
// //                                                                                await fetchAvailabilityForDay(index);
  
// //                                                                             }}
// //                                                                             className={`w-full px-3 py-2 rounded-lg text-center transition
// //                                                                               ${
// //                                                                                 isActiveDay
// //                                                                                   ? "bg-green-600 text-white"
// //                                                                                   : "bg-white text-gray-700"
// //                                                                               }
// //                                                                               border ${
// //                                                                                 isActiveDay
// //                                                                                   ? "border-green-600"
// //                                                                                   : "border-gray-200"
// //                                                                               }`}
// //                                                                           >

                                                                            
// //                                                                             <div className="text-xs font-medium">
// //                                                                               {label}
// //                                                                             </div>
                                                                            
// //                                                                             <div className="text-lg font-bold mt-1">
// //                                                                               {dayNumber}
// //                                                                             </div>
// //                                                                             <div
// //                                                                               className={`${
// //                                                                                 isActiveDay
// //                                                                                   ? "text-[11px] text-white mt-1"
// //                                                                                   : "text-[11px] text-gray-400 mt-1"
// //                                                                               }`}
// //                                                                             >
// //                                                                               {availableSlotsCount} slot
// //                                                                               {availableSlotsCount !== 1 ? "s" : ""}
// //                                                                             </div>
// //                                                                           </button>
// //                                                                         </div>
// //                                                                       );
// //                                                                     })}
// //                                                                   </div>

                


                              
// //                                                                   <div className="mt-4">
// //                                                                     {(() => {
// //                                                                       const selectedDate = new Date();
// //                                                                       // selectedDate.setDate(
// //                                                                       //   selectedDate.getDate() + selectedDay
// //                                                                       // );
// //                                                                       const dayOffset = selectedDay + 1;
// // selectedDate.setDate(
// //   selectedDate.getDate() + dayOffset
// // );
// //                                                                       const selectedISO = selectedDate
// //                                                                         .toISOString()
// //                                                                         .split("T")[0];
// //                                                                       const fullDayName =
// //                                                                         selectedDate.toLocaleDateString("en-US", {
// //                                                                           weekday: "long",
// //                                                                         });
                              
// //                                                                       const slotsForDay = timeSlots.filter(
// //                                                                         (s) => s.day_of_week === fullDayName
// //                                                                       );
                              
// //                                                                       if (slotsForDay.length === 0) {
// //                                                                         return (
// //                                                                           <p className="text-gray-500 text-sm">
// //                                                                             No slots available for this day.
// //                                                                           </p>
// //                                                                         );
// //                                                                       }
                              
// //                                                                       const todaysBookings = bookings.filter((b) => {
// //                                                                         const bookingISO = new Date(b.appointment_date)
// //                                                                           .toISOString()
// //                                                                           .split("T")[0];
// //                                                                         return bookingISO === selectedISO;
// //                                                                       });
                              
// //                                                                       const availableSlots = slotsForDay.filter(
// //                                                                         (slot) =>
// //                                                                           !todaysBookings.some(
// //                                                                             (b) => b.time_slot_id === slot.id
// //                                                                           )
// //                                                                       );
                              
// //                                                                       return (
// //                                                                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
// //                                                                           {/* {availableSlots.map((slot) => {
// //                                                                             const isSelected =
// //                                                                               selectedSlot?.id === slot.id;
// //                                                                             return (
// //                                                                               <div
// //                                                                                 key={slot.id}
// //                                                                                 onClick={() => setSelectedSlot(slot)}
// //                                                                                 className={`
// //                                                                                   p-2 rounded-md cursor-pointer text-sm transition
// //                                                                                   ${
// //                                                                                     slot.slot_type === "clinic"
// //                                                                                       ? "bg-green-50"
// //                                                                                       : "bg-blue-50"
// //                                                                                   }
// //                                                                                   ${
// //                                                                                     isSelected
// //                                                                                       ? "border-2 border-green-600"
// //                                                                                       : "border border-gray-300"
// //                                                                                   }
// //                                                                                 `}
// //                                                                               >
// //                                                                                 <div className="font-medium">
// //                                                                                   {formatTimePretty(slot.start_time)} -{" "}
// //                                                                                   {formatTimePretty(slot.end_time)}
// //                                                                                 </div>
// //                                                                                 <div className="text-[11px] text-gray-600 capitalize">
// //                                                                                   {slot.slot_type}
// //                                                                                 </div>
// //                                                                                 <div className="text-[11px] mt-1 font-semibold text-green-600">
// //                                                                                   Available
// //                                                                                 </div>
// //                                                                               </div>
// //                                                                             );
// //                                                                           })} */}
// //                                                                           {availableSlots.map((slot) => {
// //   const availability = slotAvailability[slot.id];

// //   // const isFull =
// //   //   availability &&
// //   //   availability.booked_count >= availability.max_appointments;
// // const isFull =
// //   !availability ||
// //   availability.success === false ||
// //   availability.remaining_count <= 0 ||
// //   availability.booked_count >= availability.max_appointments;

// //   const remaining =
// //     availability
// //       ? availability.max_appointments - availability.booked_count
// //       : null;

// //   const isSelected = selectedSlot?.id === slot.id;

// //   return (
// //     <div
// //       key={slot.id}
// //       onClick={() => {
// //         if (!isFull) setSelectedSlot(slot);
// //       }}
// //       className={`
// //         p-2 rounded-md text-sm transition
// //         ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
// //         ${isFull ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
// //         ${isSelected ? "border-2 border-green-600" : "border border-gray-300"}
// //       `}
// //     >
// //       <div className="font-medium">
// //         {formatTimePretty(slot.start_time)} -{" "}
// //         {formatTimePretty(slot.end_time)}
// //       </div>

// //       <div className="text-[11px] text-gray-600 capitalize">
// //         {slot.slot_type}
// //       </div>

// //       {/* ✅ STATUS */}
// //       <div className="text-[11px] mt-1 font-semibold">
// //         {availability ? (
// //           isFull ? (
// //             <span className="text-red-500">Full</span>
// //           ) : (
// //             <span className="text-green-600">
// //               {remaining} left
// //             </span>
// //           )
// //         ) : (
// //           <span className="text-gray-400">Checking...</span>
// //         )}
// //       </div>

// //                                            <div className="text-[11px] mt-1 font-semibold">
// //   {availability ? (
// //     availability.booked_count >= availability.max_appointments ? (
// //       <span className="text-red-500">
// //         Full ({availability.booked_count}/{availability.max_appointments})
// //       </span>
// //     ) : (
// //       <span className="text-green-600">
// //         {availability.booked_count}/{availability.max_appointments} booked
// //       </span>
// //     )
// //   ) : (
// //     <span className="text-gray-400">Checking...</span>
// //   )}
// // </div>
      
// //     </div>
// //   );
// // })}
                              
// //                               {/* {availableSlots.map((slot) => {
// //   const availability = slotAvailability[slot.id];

// //   const isFull =
// //     availability &&
// //     availability.booked_count >= availability.max_appointments;

// //   const remaining =
// //     availability
// //       ? availability.max_appointments - availability.booked_count
// //       : null;

// //   const isSelected = selectedSlot?.id === slot.id;

// //   return (
// //     <div  className={`w-full px-3 py-2 rounded-lg text-center transition
// //                                                                               bg-green text-white-700
// //                                                                              border-green-200
// //                                                                               }`}>
// //      <div className="text-[11px] mt-1 font-semibold">
// //         {availability ? (
// //           isFull ? (
// //             <span className="text-red-500">Full</span>
// //           ) : (
// //             <span className="text-green-600">
// //               {remaining} left
// //             </span>
// //           )
// //         ) : (
// //           <span className="text-gray-400">Checking...</span>
// //         )}
// //       </div>

// //                                              <div className="text-[11px] mt-1 font-semibold">
// //   {availability ? (
// //     availability.booked_count >= availability.max_appointments ? (
// //       <span className="text-red-500">
// //         Full ({availability.booked_count}/{availability.max_appointments})
// //       </span>
// //     ) : (
// //       <span className="text-green-600">
// //         {availability.booked_count}/{availability.max_appointments} booked
// //       </span>
// //     )
// //   ) : (
// //     <span className="text-gray-400">Checking...</span>
// //   )}
// // </div>
// // </div>
// //                                                                     )})} */}
                              
// //                                                                           {/* {availableSlots.length === 0 && ( */}
// //                                                                             {availableSlots.filter((slot) => {
// //   const availability = slotAvailability[slot.id];
// //   return (
// //     availability &&
// //     availability.booked_count < availability.max_appointments
// //   );
// // }).length === 0 && (
// //                                                                             <p className="text-red-500 text-sm col-span-full text-center">
// //                                                                               No available slots for this day.
// //                                                                             </p>
// //                                                                           )}
// //                                                                         </div>
// //                                                                       );
// //                                                                     })()}
// //                                                                   </div>

                                                                  
// //                                                                   {!selectedSlot && (
// //                                                                     <p className="text-gray-500 text-xs mt-2">
// //                                                                       Please select a slot to book an appointment.
// //                                                                     </p>
// //                                                                   )}
                              
// //                                                                   {/* <Button
// //                                                                     variant="default"
// //                                                                     size="sm"
// //                                                                     className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
// //                                                                     disabled={!selectedSlot}
// //                                                                     onClick={() =>{
// //                                                                       handleDepartmentBookNow(selectedSlot!, selectedDay, department)
// //                                                                     }}
// //                                                                   >
// //                                                                     Book Appointment 
// //                                                                     {/* Book Appointment without Payment 
// //                                                                   </Button> */}

// //                                                                   <Button
// //   variant="default"
// //   size="sm"
// //   className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
// //   disabled={
// //     !selectedSlot ||
// //     (selectedSlot &&
// //       slotAvailability[selectedSlot.id] &&
// //       (
// //         slotAvailability[selectedSlot.id].success === false ||
// //         slotAvailability[selectedSlot.id].remaining_count <= 0
// //       ))
// //   }
// //   onClick={() => {
// //     handleDepartmentBookNow(
// //       selectedSlot!,
// //       selectedDay,
// //       department
// //     );
// //   }}
// // >
// //   {selectedSlot &&
// //   slotAvailability[selectedSlot.id] &&
// //   (
// //     slotAvailability[selectedSlot.id].success === false ||
// //     slotAvailability[selectedSlot.id].remaining_count <= 0
// //   )
// //     ? "Slot Full"
// //     : "Book Appointment"}
// // </Button>
// //                                                                 </>
// //                                                               )}
// //                                                             </div>
// //                                                           )}
// //                                                           <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
// //                                                                   <DialogContent className="rounded-xl p-6">
// //                                                                     <DialogHeader>
// //                                                                       <DialogTitle className="text-xl font-bold text-center">
// //                                                                         Confirm Appointment 
// //                                                                       </DialogTitle>
// //                                                                     </DialogHeader>

// //                                                                     {existingBooking && (
// //   <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
// //     <p className="text-red-700 font-semibold">
// //       You already booked an appointment
// //     </p>

// //     <div className="mt-2 text-sm text-gray-700">
// //       <p>
// //         Date: {existingBooking.appointment_date}
// //       </p>

// //       <p>
// //         Status: {existingBooking.status}
// //       </p>
// //     </div>
// //   </div>
// // )}
                                                          
// //                                                                     {bookingInfo && (
// //                                                                       <div className="space-y-4 mt-2">
// //                                                                         <div className="p-4 bg-gray-100 rounded-lg">
// //                                                                           <p className="text-sm text-gray-600">Doctor/Department</p>
// //                                                                           <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
// //                                                                         </div>
                                                          
// //                                                                         <div className="grid grid-cols-2 gap-4">
// //                                                                           <div className="p-4 bg-gray-100 rounded-lg">
// //                                                                             <p className="text-sm text-gray-600">Date</p>
// //                                                                             <p className="text-md font-medium">
// //                                                                               {bookingInfo.booking_date}
// //                                                                             </p>
// //                                                                           </div>
                                                          
// //                                                                           <div className="p-4 bg-gray-100 rounded-lg">
// //                                                                             <p className="text-sm text-gray-600">Time Slot</p>
// //                                                                             <p className="text-md font-medium">
// //                                                                               {formatTimePretty(bookingInfo.start_time)} -{" "}
// //                                                                               {formatTimePretty(bookingInfo.end_time)}
// //                                                                             </p>
// //                                                                           </div>
// //                                                                         </div>
                                                          
// //                                                                         <div className="mt-4">
// //                                                                           <label className="text-sm font-medium text-gray-600">
// //                                                                             Notes (optional)
// //                                                                           </label>
// //                                                                           <textarea
// //                                                                             value={notes}
// //                                                                             onChange={(e) => setNotes(e.target.value)}
// //                                                                             placeholder="Add message for doctor..."
// //                                                                             className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
// //                                                                             rows={3}
// //                                                                           />
// //                                                                         </div>
// //                                                                       </div>
// //                                                                     )}
                                                          
// //                                                                     <DialogFooter className="mt-6 flex justify-between">
// //                                                                       <Button
// //                                                                         variant="outline"
// //                                                                         onClick={() => {
// //                                                                           setConfirmOpen(false);
// //                                                                           setNotes("");
// //                                                                         }}
// //                                                                       >
// //                                                                         Cancel
// //                                                                       </Button>
                                                          
// //                                                                       <Button
// //                                                                         className="bg-blue-600 hover:bg-blue-700 text-white"
// //                                                                         onClick={handleConfirmBooking}
// //                                                                         disabled={isBooking || !bookingInfo}
// //                                                                       >
// //                                                                         {isBooking ? "Confirming..." : "Confirm Booking"}
// //                                                                       </Button>
// //                                                                     </DialogFooter>
// //                                                                   </DialogContent>
// //                                                                 </Dialog>
// //               </CardContent>
// //             </Card>

// //             {department.services && (
// //               <Card>
// //                 <CardContent className="p-6">
// //                   <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
// //                   <div className="grid md:grid-cols-2 gap-3">
// //                     {Array.isArray(department.services) ? (
// //                       department.services.map((service: string, index: number) => (
// //                         <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
// //                           <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
// //                           <span className="text-sm text-gray-700">{service}</span>
// //                         </div>
// //                       ))
// //                     ) : (
// //                       <p className="text-sm text-gray-600 col-span-2">{department.services}</p>
// //                     )}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {department.equipment && (
// //               <Card>
// //                 <CardContent className="p-6">
// //                   <h2 className="text-xl font-semibold mb-4">Equipment</h2>
// //                   <div className="grid md:grid-cols-2 gap-3">
// //                     {Array.isArray(department.equipment) ? (
// //                       department.equipment.map((item: string, index: number) => (
// //                         <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
// //                           <Microscope className="h-4 w-4 text-green-500 flex-shrink-0" />
// //                           <span className="text-sm text-gray-700">{item}</span>
// //                         </div>
// //                       ))
// //                     ) : (
// //                       <p className="text-sm text-gray-600 col-span-2">{department.equipment}</p>
// //                     )}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </div>

// //           {/* Right Column - Doctors */}
// //           {/* <div className="space-y-6">
// //             <Card>
// //               <CardContent className="p-6">
// //                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //                   <Users className="h-5 w-5 text-green-600" />
// //                   Doctors ({departmentDoctors.length})
// //                 </h2>
// //                 {departmentDoctors.length > 0 ? (
// //                   <div className="space-y-3">
// //                     {departmentDoctors.map((doc) => (
// //                       <div
// //                         key={doc.id}
// //                         className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
// //                         // onClick={() => handleViewDoctor(doc.id)}
// //                       >
// //                         <img
// //                           src={doc.image || "https://via.placeholder.com/150"}
// //                           alt={doc.name}
// //                           className="w-12 h-12 rounded-full object-cover"
// //                         />
// //                         <div className="flex-1">
// //                           <p className="font-medium">{doc.name}</p>
// //                           <p className="text-sm text-gray-600">{doc.specialty}</p>
// //                           <div className="flex items-center mt-1">
// //                             <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
// //                             <span className="text-xs ml-1">{doc.rating}</span>
// //                           </div>
// //                         </div>
// //                         <ChevronRight className="h-4 w-4 text-gray-400" />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <p className="text-gray-500 text-center py-8">
// //                     No doctors assigned to this department
// //                   </p>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </div> */}
// //           {/* <div className="space-y-6">
// //   <Card>
// //     <CardContent className="p-6">
// //       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //         <Users className="h-5 w-5 text-green-600" />
// //         Department Doctors ({departmentDoctors.length})
// //       </h2>
// //       {departmentDoctors.length > 0 ? (
// //         <div className="space-y-3">
// //           {departmentDoctors.map((staff) => (
// //             <div
// //               key={staff.id}
// //               className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
// //             >
// //               <img
// //                 src={staff.image || "https://via.placeholder.com/150"}
// //                 alt={staff.name}
// //                 className="w-12 h-12 rounded-full object-cover"
// //               />
// //               <div className="flex-1">
// //                 <p className="font-medium">{staff.name}</p>
// //                 <p className="text-sm text-gray-600">{staff.position || staff.role}</p>
// //                 <div className="flex items-center mt-1">
// //                   <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
// //                   <span className="text-xs ml-1">{staff.rating}</span>
// //                 </div>
// //               </div>
// //               <ChevronRight className="h-4 w-4 text-gray-400" />
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <p className="text-gray-500 text-center py-8">
// //           No staff assigned to this department
// //         </p>
// //       )}
// //     </CardContent>
// //   </Card>
// // </div> */}
// //         {/* </div> */}
// //       </div>
// //     </DashboardLayout>
// //   );
// // };

// // export default DepartmentDetails;

// // DepartmentDetails.tsx
// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Building2,
//   BedDouble,
//   Activity,
//   Users,
//   CheckCircle,
//   XCircle,
//   Microscope,
//   Star,
//   ArrowLeft,
//   Calendar,
//   ChevronRight,
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import DashboardLayout from "../layouts/DashboardLayout";
// import { toast } from "@/hooks/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import Loader2 from "../ui/Loader2";
// import { useFacilityLimit } from "@/hooks/useFacilityLimit";

// // ==================== TYPES ====================
// interface Department {
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
// }

// interface Doctor {
//   id: string;
//   name: string;
//   specialty: string;
//   rating: number;
//   image?: string;
// }

// interface Facility {
//   id: string;
//   facility_name: string;
//   facility_type: string;
// }

// interface TimeSlot {
//   id: string;
//   doctor_id: string;
//   day_of_week: string;
//   start_time: string;
//   end_time: string;
//   slot_type: string;
//   is_available: boolean;
// }

// interface BookingInfo {
//   slot_id: string;
//   start_time: string;
//   end_time: string;
//   booking_date: string;
//   doctor_id: string;
//   doctor_name: string;
//   department_id?: string;
// }

// // Extended availability info including user's own booking status
// interface SlotAvailability {
//   success: boolean;
//   time_slot_id: string;
//   max_appointments: number;
//   booked_count: number;
//   remaining_count: number;
//   user_has_booked: boolean;   // <-- key addition
//   date: string;
//   day_of_week: string;
// }

// // ==================== MAIN COMPONENT ====================
// const DepartmentDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const facility = location.state?.facility as Facility | null;
//   const bookingSectionRef = useRef<HTMLDivElement>(null);

//   // Core data
//   const [loading, setLoading] = useState(true);
//   const [department, setDepartment] = useState<Department | null>(null);
//   const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
//   const [hasTimeSlots, setHasTimeSlots] = useState<boolean | null>(null);
//   const [isBookingBlocked, setIsBookingBlocked] = useState(false);

//   // Time slots & bookings
//   const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
//   const [selectedDay, setSelectedDay] = useState<number>(0);
//   const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability>>({});

//   // Booking dialog
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
//   const [notes, setNotes] = useState("");
//   const [isBooking, setIsBooking] = useState(false);
// const [bookingError, setBookingError] = useState<string | null>(null);
//   // Facility limit
//   const { checkLimit, limits, loading: limitLoading } = useFacilityLimit();
//   const isClinicalLimitReached = limits?.limits?.clinical && limits.limits.clinical.allowed === false;

//   // ==================== HELPER FUNCTIONS ====================
//   const createSlug = (text: string) => {
//     return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
//   };

//   const formatTimePretty = (timeStr: string) => {
//     const hh = parseInt(timeStr.slice(0, 2), 10);
//     const mm = timeStr.slice(3, 5);
//     const hour12 = hh % 12 === 0 ? 12 : hh % 12;
//     const ampm = hh >= 12 ? "PM" : "AM";
//     return `${hour12}:${mm} ${ampm}`;
//   };

//   const formatDayLabel = (date: Date, index: number) => {
//     if (index === 0) return "Tomorrow";
//     return date.toLocaleDateString("en-US", { weekday: "short" });
//   };

//   const formatDateNumber = (date: Date) => date.getDate();

//   // ==================== CHECK SLOT AVAILABILITY (with user_has_booked) ====================
//   const checkSlotAvailability = async (
//     slotId: string,
//     date: string,
//     dayOfWeek: string
//   ): Promise<SlotAvailability | null> => {
//     try {
//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("User not logged in");

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/get-time-slot-counts",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             time_slot_id: slotId,
//             date: date,
//             day_Of_Week: dayOfWeek.toLowerCase(),
//             user_id: user.id,   // ✅ send user id to edge function
//           }),
//         }
//       );

//       const result = await response.json();
//       if (!response.ok || !result.success) {
//         throw new Error(result.error || "Failed to check slot");
//       }

//       // If edge function already returns user_has_booked, use it. Otherwise fallback.
//       let userHasBooked = result.user_has_booked;
//       if (userHasBooked === undefined) {
//         // Fallback: manually check if user already booked this slot+date
//        const startOfDay = `${date}T00:00:00`;
// const endOfDay = `${date}T23:59:59`;

// const { data: existing } = await supabase
//   .from("appointments")
//   .select("id")
//   .eq("time_slot_id", slotId)
//   .eq("patient_id", user.id)
//   .gte("appointment_date", startOfDay)
//   .lte("appointment_date", endOfDay)
//   .maybeSingle();
//         userHasBooked = !!existing;
//       }

//       return {
//         success: true,
//         time_slot_id: result.time_slot_id,
//         max_appointments: result.max_appointments,
//         booked_count: result.booked_count,
//         remaining_count: result.remaining_count,
//         user_has_booked: userHasBooked,
//         date: result.date,
//         day_of_week: result.day_of_week,
//       };
//     } catch (error) {
//       console.error("Slot check error:", error);
//       // Return a failure object so UI can disable the slot
//       return {
//         success: false,
//         time_slot_id: slotId,
//         max_appointments: 0,
//         booked_count: 0,
//         remaining_count: 0,
//         user_has_booked: false,
//         date: date,
//         day_of_week: dayOfWeek,
//       };
//     }
//   };

//   // ==================== FETCH AVAILABILITY FOR A SPECIFIC DAY ====================
//   const fetchAvailabilityForDay = async (dayIndex: number) => {
//     const dayOffset = dayIndex + 1;
//     const selectedDate = new Date();
//     selectedDate.setDate(selectedDate.getDate() + dayOffset);
//     const dateISO = selectedDate.toISOString().split("T")[0];
//     const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

//     const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
//     const results: Record<string, SlotAvailability> = {};

//     await Promise.all(
//       slotsForDay.map(async (slot) => {
//         if (slot.slot_type === "teleconsultation") {
//       return;
//     }
//         const res = await checkSlotAvailability(slot.id, dateISO, dayOfWeek);
//         if (res) results[slot.id] = res;
//       })
//     );

//     setSlotAvailability(results);
//     return { selectedDate, dateISO, dayOfWeek };
//   };

//   // ==================== FETCH TIME SLOTS & BOOKINGS ====================
//   const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
//     try {
//       const { data: slotsData, error: slotsError } = await supabase
//         .from("time_slots")
//         .select("*")
//         .eq("department_id", department.id)
//         .eq("is_available", true);
//       if (slotsError) throw slotsError;
//       setTimeSlots(slotsData || []);

//       const { data: bookingsData, error: bookingsError } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("department_id", department.id);
//       if (bookingsError) throw bookingsError;
//       setBookings(bookingsData || []);
//     } catch (err) {
//       console.error("fetchTimeSlotsAndDepartmentBookings error", err);
//       setTimeSlots([]);
//       setBookings([]);
//     }
//   };

//   // ==================== TOGGLE DEPARTMENT EXPAND ====================
//   const toggleExpandDepartment = async (department: Department) => {
//     if (expandedTimeSlotId === department.id) {
//       setExpandedTimeSlotId(null);
//       setSelectedSlot(null);
//       setTimeSlots([]);
//       setBookings([]);
//       setSelectedDay(0);
//       setSlotAvailability({});
//       return;
//     }
//     setExpandedTimeSlotId(department.id);
//     setSelectedSlot(null);
//     setTimeSlots([]);
//     setBookings([]);
//     setSelectedDay(0);
//     setSlotAvailability({});
//     await fetchTimeSlotsAndDepartmentBookings(department);
//   };

//   // ==================== FETCH DEPARTMENT DETAILS ====================
//   const fetchDepartmentDetails = async () => {
//     setLoading(true);
//     try {
//       const { data: deptData, error: deptError } = await supabase
//         .from("departments")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (deptError) throw deptError;
//       setDepartment(deptData);

//       // Fetch STAFF in this department
//       const { data: staffData, error: staffError } = await supabase
//         .from("staff")
//         .select(`
//           *,
//           profiles!staff_user_id_fkey (first_name, last_name, avatar_url)
//         `)
//         .eq("department_id", id);
//       if (staffError) throw staffError;
//       if (staffData) {
//         const mapped = staffData.map((item: any) => ({
//           id: item.id,
//           name: `${item.profiles?.first_name || ""} ${item.profiles?.last_name || ""}`.trim() || "Unknown Staff",
//           specialty: item.position || item.role || "Staff",
//           rating: 4.5,
//           image: item.profiles?.avatar_url || "",
//           role: item.role,
//           position: item.position,
//         }));
//         setDepartmentDoctors(mapped);
//       }

//       const { data: slotCheck, error: slotError } = await supabase
//         .from("time_slots")
//         .select("id")
//         .eq("department_id", deptData.id)
//         .limit(1);
//       setHasTimeSlots((slotCheck?.length || 0) > 0);
//     } catch (error) {
//       console.error("Error fetching department details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== BOOKING FLOW ====================
//   const handleDepartmentBookNow = async (slot: TimeSlot, dateIndex: number, department: Department) => {
//     const dayOffset = dateIndex + 1;
//     // const newDate = new Date();
// const newDate = new Date();
// newDate.setDate(newDate.getDate() + dayOffset);

// const dateISO = newDate.toISOString().split("T")[0];
//     //  const dateISO = newDate.toISOString().split("T")[0];

//   const dayOfWeek = newDate.toLocaleDateString("en-US", { weekday: "long" });

//   const availability = await checkSlotAvailability(slot.id, dateISO, dayOfWeek);
//   if (availability?.user_has_booked) {
//     setBookingError("You have already booked this time slot on this date.");
//     setConfirmOpen(true);  // open dialog with error message
//     return;
//   }
//     newDate.setDate(newDate.getDate() + dayOffset);
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
//       setIsBooking(true);

//       // Re-check availability right before booking (including user_has_booked)
//       const bookingDateObj = new Date(bookingInfo.booking_date);
//       const dayOfWeek = bookingDateObj.toLocaleDateString("en-US", { weekday: "long" });
//       const slotStatus = await checkSlotAvailability(
//         bookingInfo.slot_id,
//         bookingInfo.booking_date,
//         dayOfWeek
//       );

//       // Edge function failure
//       if (!slotStatus || !slotStatus.success) {
//         toast({
//           title: "Cannot Book",
//           description: "Slot information unavailable. Please try again later.",
//           variant: "destructive",
//         });
//         return;
//       }

//       // Slot full
//       if (slotStatus.booked_count >= slotStatus.max_appointments) {
//         toast({
//           title: "Slot Full",
//           description: "This time slot is already fully booked.",
//           variant: "destructive",
//         });
//         return;
//       }

//       // User already booked this slot+date
//       if (slotStatus.user_has_booked) {
//         toast({
//           title: "Already Booked",
//           description: "You have already booked this time slot on this date.",
//           variant: "destructive",
//         });
//         return;
//       }

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

//       const payload = {
//         patient_id: user.id,
//         doctor_id: null,
//         facility_id: department?.facility_id || null,
//         department_id: bookingInfo.department_id,
//         booking_date: bookingInfo.booking_date,
//         time_slot_id: bookingInfo.slot_id,
//         notes: notes || null,
//       };

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-temp-booking",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();
//       if (!response.ok) {
//         toast({
//           title: "Error",
//           description: result.error || "Unable to book appointment",
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Success",
//         description: "Appointment booked successfully!",
//       });
//       setConfirmOpen(false);
//       setNotes("");
//       setSelectedSlot(null);
//       setExpandedTimeSlotId(null);

//       // Refresh slots & bookings
//       if (department) {
//         await fetchTimeSlotsAndDepartmentBookings(department);
//       }
//     } catch (err: any) {
//       console.error("Booking error:", err);
//       toast({
//         title: "Error",
//         description: err?.message || "Unable to book appointment",
//         variant: "destructive",
//       });
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   // ==================== CHECK BOOKING STATUS (unused but kept) ====================
//   const checkBookingStatus = async (facilityId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("booking_attempts")
//         .insert({ facility_id: facilityId, booking_type: "appointment" })
//         .eq("facility_id", facilityId);
//       if (error) {
//         console.error("Booking status error:", error);
//         return;
//       }
//       if (!data) setIsBookingBlocked(false);
//     } catch (err) {
//       console.error("checkBookingStatus error:", err);
//     }
//   };

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (id) fetchDepartmentDetails();
//   }, [id]);

//   useEffect(() => {
//     if (facility) {
//       checkLimit(facility.id, "clinical");
//       checkBookingStatus(facility.id);
//     }
//   }, [facility]);

//   // ==================== RENDER ====================
//   if (loading) {
//     return (
//       <DashboardLayout userType="patient">
//         <div className="min-h-screen flex items-center justify-center">
//           <Loader2 />
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!department) {
//     return (
//       <DashboardLayout userType="patient">
//         <div className="min-h-screen flex items-center justify-center">
//           <Card className="p-8 text-center">
//             <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Department Not Found</h2>
//             <p className="text-gray-600 mb-6">The requested department could not be found.</p>
//             <Button onClick={() => navigate(-1)}>Go Back</Button>
//           </Card>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout userType="patient">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <Button variant="ghost" onClick={() => navigate(-1)}>
//             <ArrowLeft className="h-4 w-4 mr-2" /> Back
//           </Button>
//           {facility && (
//             <p className="text-sm text-gray-600">
//               {facility.facility_name} • {facility.facility_type}
//             </p>
//           )}
//         </div>

//         {/* Department Header */}
//         <Card className="mb-8 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-600 to-green-800 h-32"></div>
//           <CardContent className="relative pt-0">
//             <div className="flex flex-col md:flex-row justify-between items-start gap-4 -mt-16">
//               <div className="bg-white p-4 rounded-lg shadow-lg">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//                     <Building2 className="h-8 w-8 text-green-600" />
//                   </div>
//                   <div>
//                     <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 size="lg"
//                 className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0"
//                 onClick={() => bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
//               >
//                 <Calendar className="h-4 w-4 mr-2" /> Book Appointment
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="md:col-span-2 space-y-6">
//           {/* About Department */}
//           <Card>
//             <CardContent className="p-6">
//               <h2 className="text-xl font-semibold mb-4">About Department</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {department.description || "No description available"}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Booking Section */}
//           <Card ref={bookingSectionRef}>
//             <CardContent className="p-6">
//               <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
//               <div className="space-y-3">
//                 {hasTimeSlots === false && (
//                   <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                     <p className="text-sm text-yellow-700 font-medium">
//                       ⏳ Appointment slots are not available.
//                     </p>
//                     <p className="text-xs text-yellow-600 mt-1">
//                       Please contact the hospital or try again later.
//                     </p>
//                   </div>
//                 )}
//                 <Button
//                   variant="default"
//                   size="sm"
//                   className="bg-green-600 hover:bg-green-700"
//                   onClick={() => toggleExpandDepartment(department)}
//                   disabled={!hasTimeSlots || isClinicalLimitReached}
//                 >
//                   {isClinicalLimitReached
//                     ? "Booking not available, please try after some time."
//                     : "View Availability"}
//                 </Button>
//               </div>

//               {expandedTimeSlotId === department.id && (
//                 <div className="mt-4 p-4 rounded-xl border shadow bg-white">
//                   <h3 className="font-semibold mb-3 text-lg">Available Slots</h3>
//                   {timeSlots.length === 0 ? (
//                     <p className="text-red-600 font-medium">
//                       Department {department.name} is not available.
//                     </p>
//                   ) : (
//                     <>
//                       {/* Day Selector */}
//                       <div className="flex gap-3 overflow-x-auto py-2">
//                         {Array.from({ length: 14 }).map((_, index) => {
//                           const dayOffset = index + 1;
//                           const date = new Date();
//                           date.setDate(date.getDate() + dayOffset);
//                           const label = formatDayLabel(date, index);
//                           const dayNumber = formatDateNumber(date);
//                           const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
//                           const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
//                           const dateISO = date.toISOString().split("T")[0];
//                           const bookingsForDay = bookings.filter(
//                             (b) => new Date(b.appointment_date).toISOString().split("T")[0] === dateISO
//                           );
//                           const bookedSlotIds = new Set(bookingsForDay.map((b) => b.time_slot_id));
//                           const availableSlotsCount = slotsForDay.filter(
//                             (slot) => !bookedSlotIds.has(slot.id)
//                           ).length;
//                           const isActiveDay = selectedDay === index;
//                           return (
//                             <div key={index} className="min-w-[110px]">
//                               <button
//                                 onClick={async () => {
//                                   setSelectedDay(index);
//                                   setSelectedSlot(null);
//                                   await fetchAvailabilityForDay(index);
//                                 }}
//                                 className={`w-full px-3 py-2 rounded-lg text-center transition ${
//                                   isActiveDay
//                                     ? "bg-green-600 text-white"
//                                     : "bg-white text-gray-700 border border-gray-200"
//                                 }`}
//                               >
//                                 <div className="text-xs font-medium">{label}</div>
//                                 <div className="text-lg font-bold mt-1">{dayNumber}</div>
//                                 <div
//                                   className={`text-[11px] mt-1 ${
//                                     isActiveDay ? "text-white" : "text-gray-400"
//                                   }`}
//                                 >
//                                   {availableSlotsCount} slot{availableSlotsCount !== 1 ? "s" : ""}
//                                 </div>
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
// {/* <p >Please choose your desired time slot from the below</p> */}
//                       {/* Slots for selected day */}
//                       <div className="mt-4">
//                         {(() => {
//                           const dayOffset = selectedDay + 1;
//                           const selectedDate = new Date();
//                           selectedDate.setDate(selectedDate.getDate() + dayOffset);
//                           const selectedISO = selectedDate.toISOString().split("T")[0];
//                           const fullDayName = selectedDate.toLocaleDateString("en-US", {
//                             weekday: "long",
//                           });
//                           const slotsForDay = timeSlots.filter((s) => s.day_of_week === fullDayName);

//                           if (slotsForDay.length === 0) {
//                             return <p className="text-gray-500 text-sm">No slots available for this day.</p>;
//                           }

//                           // Filter slots that are not fully booked and not already booked by user
//                           const availableSlots = slotsForDay.filter((slot) => {
//                               if (slot.slot_type === "teleconsultation") {
//     return true;
//   }
//                             const avail = slotAvailability[slot.id];
//                             if (!avail) return true; // still checking
//                             return avail.booked_count < avail.max_appointments && !avail.user_has_booked;
//                           });

//                           return (
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                               {slotsForDay.map((slot) => {
//                                 const avail = slotAvailability[slot.id];
//                                 const isFull = avail && avail.booked_count >= avail.max_appointments;
//                                 // const alreadyBookedByUser = avail && avail.user_has_booked;
//                                 const isDisabled = isFull  || (avail && !avail.success);
//                                 const isSelected = selectedSlot?.id === slot.id;

//                                 return (
//                                   <>
                                  
//                                   <div
//                                     key={slot.id}
//                                     onClick={() => {
//                                       if (!isDisabled) setSelectedSlot(slot);
//                                     }}
//                                     className={`
//                                       p-2 rounded-md text-sm transition
//                                       ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
//                                       ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//                                       ${isSelected ? "border-2 border-green-600" : "border border-gray-300"}
//                                     `}
//                                   >
                                    
//                                     <div className="font-medium">
//                                       {formatTimePretty(slot.start_time)} -{" "}
//                                       {formatTimePretty(slot.end_time)}
//                                     </div>
//                                     <div className="text-[11px] text-gray-600 capitalize">
//                                       {slot.slot_type}
//                                     </div>

//                                     {/* Status message */}
//                                     <div className="text-[11px] mt-1 font-semibold">
//                                       {!avail?.success ? (
//                                         <span className="text-gray-400">Checking...</span>
//                                       // ) : alreadyBookedByUser ? (
//                                       //   <span className="text-orange-600">Already booked by you</span>
//                                       ) : isFull ? (
//                                         <span className="text-red-500">
//                                           Full ({avail.booked_count}/{avail.max_appointments})
//                                         </span>
//                                       ) : (
//                                         <>
//                                         <span className="text-green-600">
//                                           {avail.remaining_count} left
//                                         </span>
//                                         <br/>
//                                         <span className="text-red-500">
//                                           Full ({avail.booked_count}/{avail.max_appointments})
//                                         </span>
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                     </>
//                                 );
//                               })}
//                               {availableSlots.length === 0 && (
//                                 <p className="text-red-500 text-sm col-span-full text-center">
//                                   No available slots for this day.
//                                 </p>
//                               )}
//                             </div>
//                           );
//                         })()}
//                       </div>

//                       {!selectedSlot && (
//                         <p className="text-gray-500 text-xs mt-2 ">
//                           Please select a slot to book an appointment.
//                         </p>
//                       )}
//                       <Button
//                         variant="default"
//                         size="sm"
//                         className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
//                         disabled={!selectedSlot}
//                         onClick={() => handleDepartmentBookNow(selectedSlot!, selectedDay, department)}
//                       >
//                         Book Appointment
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* Confirmation Dialog with re-check */}
//               {/* <Dialog open={confirmOpen} onOpenChange={(open) => {
//   if (!open) {
//     setBookingError(null);
//     setConfirmOpen(true);
//   }
// }}
// >
//                 <DialogContent className="rounded-xl p-6">
//                   <DialogHeader>
//                     <DialogTitle className="text-xl font-bold text-center">
//                       Confirm Appointment
//                     </DialogTitle>
//                   </DialogHeader>

//                   {bookingError ? (
//       <div className="p-4 bg-red-50 text-red-700 rounded-lg">
//         {bookingError}
//       </div>
//     ) : (
//       <>
//                   {bookingInfo && (
//                     <div className="space-y-4 mt-2">
//                       <div className="p-4 bg-gray-100 rounded-lg">
//                         <p className="text-sm text-gray-600">Doctor/Department</p>
//                         <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="p-4 bg-gray-100 rounded-lg">
//                           <p className="text-sm text-gray-600">Date</p>
//                           <p className="text-md font-medium">{bookingInfo.booking_date}</p>
//                         </div>
//                         <div className="p-4 bg-gray-100 rounded-lg">
//                           <p className="text-sm text-gray-600">Time Slot</p>
//                           <p className="text-md font-medium">
//                             {formatTimePretty(bookingInfo.start_time)} -{" "}
//                             {formatTimePretty(bookingInfo.end_time)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="mt-4">
//                         <label className="text-sm font-medium text-gray-600">Notes (optional)</label>
//                         <textarea
//                           value={notes}
//                           onChange={(e) => setNotes(e.target.value)}
//                           placeholder="Add message for doctor..."
//                           className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
//                           rows={3}
//                         />
//                       </div>
//                     </div>
//                   )}
//                   </>
//     )}
//                   <DialogFooter className="mt-6 flex justify-between">
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         setConfirmOpen(false);
//                         setNotes("");
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       className="bg-blue-600 hover:bg-blue-700 text-white"
//                       onClick={handleConfirmBooking}
//                       disabled={isBooking || !bookingInfo || !!bookingError}
//                     >
//                       {isBooking ? "Confirming..." : "Confirm Booking"}
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog> */}
//               <Dialog
//   open={confirmOpen}
//   onOpenChange={(open) => {
//     setConfirmOpen(open);

//     if (!open) {
//       setBookingError(null);
//       setBookingInfo(null);
//       setNotes("");
//     }
//   }}
// >
//   <DialogContent className="rounded-xl p-6">
//     <DialogHeader>
//       <DialogTitle className="text-xl font-bold text-center">
//         {bookingError ? "Appointment Already Exists" : "Confirm Appointment"}
//       </DialogTitle>
//     </DialogHeader>

//     {/* Error Message */}
//     {bookingError ? (
//       <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//         {bookingError}
//       </div>
//     ) : (
//       <>
//         {bookingInfo && (
//           <div className="space-y-4 mt-2">
//             <div className="p-4 bg-gray-100 rounded-lg">
//               <p className="text-sm text-gray-600">
//                 Doctor/Department
//               </p>

//               <p className="text-lg font-medium">
//                 {bookingInfo.doctor_name}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-4 bg-gray-100 rounded-lg">
//                 <p className="text-sm text-gray-600">Date</p>

//                 <p className="text-md font-medium">
//                   {bookingInfo.booking_date}
//                 </p>
//               </div>

//               <div className="p-4 bg-gray-100 rounded-lg">
//                 <p className="text-sm text-gray-600">
//                   Time Slot
//                 </p>

//                 <p className="text-md font-medium">
//                   {formatTimePretty(bookingInfo.start_time)}
//                   {" - "}
//                   {formatTimePretty(bookingInfo.end_time)}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-600">
//                 Notes (optional)
//               </label>

//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Add message for doctor..."
//                 className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
//                 rows={3}
//               />
//             </div>
//           </div>
//         )}
//       </>
//     )}

//     <DialogFooter className="mt-6 flex justify-between">
//       <Button
//         variant="outline"
//         onClick={() => {
//           setConfirmOpen(false);
//           setBookingError(null);
//           setBookingInfo(null);
//           setNotes("");
//         }}
//       >
//         Close
//       </Button>

//       {!bookingError && (
//         <Button
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//           onClick={handleConfirmBooking}
//           disabled={isBooking || !bookingInfo}
//         >
//           {isBooking ? "Confirming..." : "Confirm Booking"}
//         </Button>
//       )}
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//             </CardContent>
//           </Card>

//           {/* Services & Equipment (unchanged) */}
//           {department.services && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {Array.isArray(department.services) ? (
//                     department.services.map((service: string, index: number) => (
//                       <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
//                         <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                         <span className="text-sm text-gray-700">{service}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-600 col-span-2">{department.services}</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {department.equipment && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Equipment</h2>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {Array.isArray(department.equipment) ? (
//                     department.equipment.map((item: string, index: number) => (
//                       <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
//                         <Microscope className="h-4 w-4 text-green-500 flex-shrink-0" />
//                         <span className="text-sm text-gray-700">{item}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-600 col-span-2">{department.equipment}</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default DepartmentDetails;

// DepartmentDetails.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BedDouble,
  Activity,
  Users,
  CheckCircle,
  XCircle,
  Microscope,
  Star,
  ArrowLeft,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Loader2 from "../ui/Loader2";
import { useFacilityLimit } from "@/hooks/useFacilityLimit";

// ==================== TYPES ====================
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image?: string;
}

interface Facility {
  id: string;
  facility_name: string;
  facility_type: string;
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

interface SlotAvailability {
  success: boolean;
  time_slot_id: string;
  max_appointments: number;
  booked_count: number;
  remaining_count: number;
  user_has_booked: boolean;
  date: string;
  day_of_week: string;
}

// ==================== MAIN COMPONENT ====================
const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const facility = location.state?.facility as Facility | null;
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  // Core data
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
  const [hasTimeSlots, setHasTimeSlots] = useState<boolean | null>(null);
  const [isBookingBlocked, setIsBookingBlocked] = useState(false);

  // Time slots & bookings
  const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability>>({});
const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  // Booking dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Facility limit
  const { checkLimit, limits,  } = useFacilityLimit();
  useEffect(() => {
    if (facility) {
      checkLimit(facility.id, "all");
      checkBookingStatus(facility.id);
    }
  }, [facility]);
  const isClinicalLimitReached = limits?.limits?.clinical && limits.limits.clinical.allowed === false;
const clinicalLimit = limits?.limits?.clinical;
const teleLimit = limits?.limits?.tele;

// Detect slot type
const isTeleSlot = selectedSlot?.slot_type === "tele";
const isClinicalSlot =
  selectedSlot?.slot_type === "consultation" ||
  selectedSlot?.slot_type === "clinic";

// Get correct limit data
const limitData = isTeleSlot ? teleLimit : clinicalLimit;

// Values
const used = limitData?.used ?? 0;
const max = limitData?.max ?? 0;
const remaining = limitData?.remaining ?? 0;
const percentageUsed = limitData?.percentageUsed ?? 0;
const totalmax = used >= max;

  // ==================== HELPER FUNCTIONS ====================
  const createSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const formatTimePretty = (timeStr: string) => {
    const hh = parseInt(timeStr.slice(0, 2), 10);
    const mm = timeStr.slice(3, 5);
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${hour12}:${mm} ${ampm}`;
  };

  const formatDayLabel = (date: Date, index: number) => {
    if (index === 0) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDateNumber = (date: Date) => date.getDate();

  // ==================== CHECK SLOT AVAILABILITY (with user_has_booked) ====================
  const checkSlotAvailability = async (
    slotId: string,
    date: string,
    dayOfWeek: string
  ): Promise<SlotAvailability | null> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/get-time-slot-counts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time_slot_id: slotId,
            date: date,
            day_Of_Week: dayOfWeek.toLowerCase(),
            user_id: user.id,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to check slot");
      }

      return {
        success: true,
        time_slot_id: result.time_slot_id,
        max_appointments: result.max_appointments,
        booked_count: result.booked_count,
        remaining_count: result.remaining_count,
        user_has_booked: result.user_has_booked,
        date: result.date,
        day_of_week: result.day_of_week,
      };
    } catch (error) {
      console.error("Slot check error:", error);
      return {
        success: false,
        time_slot_id: slotId,
        max_appointments: 0,
        booked_count: 0,
        remaining_count: 0,
        user_has_booked: false,
        date: date,
        day_of_week: dayOfWeek,
      };
    }
  };

  // ==================== FETCH AVAILABILITY FOR A SPECIFIC DAY ====================
  // const fetchAvailabilityForDay = async (dayIndex: number) => {
  //    try {
  //   setIsLoadingSlots(true);
  //   const dayOffset = dayIndex + 1;
  //   const selectedDate = new Date();
  //   selectedDate.setDate(selectedDate.getDate() + dayOffset);
  //   const dateISO = selectedDate.toISOString().split("T")[0];
  //   const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  //   const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
  //      if (slotsForDay.length === 0) {
  //   setSlotAvailability({});
  //   return;
  // }
  //   const results: Record<string, SlotAvailability> = {};

  //   await Promise.all(
  //     slotsForDay.map(async (slot) => {
  //       const res = await checkSlotAvailability(slot.id, dateISO, dayOfWeek);
  //       if (res) results[slot.id] = res;
  //     })
  //   );

  //   setSlotAvailability(results);
  //   return { selectedDate, dateISO, dayOfWeek };
  //   } catch (error) {
  //   console.error("fetchAvailabilityForDay error:", error);
  // } finally {
  //   setIsLoadingSlots(false);
  // }
  // };
  const fetchAvailabilityForDay = async (dayIndex: number) => {
  try {
    setIsLoadingSlots(true);
    const dayOffset = dayIndex + 1;
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + dayOffset);
    const dateISO = selectedDate.toISOString().split("T")[0];
    const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
    if (slotsForDay.length === 0) {
      setSlotAvailability({});
      return;
    }
    const results: Record<string, SlotAvailability> = {};
    await Promise.all(
      slotsForDay.map(async (slot) => {
        const res = await checkSlotAvailability(slot.id, dateISO, dayOfWeek);
        if (res) results[slot.id] = res;
      })
    );
    setSlotAvailability(results);
  } catch (error) {
    console.error("fetchAvailabilityForDay error:", error);
  } finally {
    setIsLoadingSlots(false);
  }
};

  // ==================== FETCH TIME SLOTS & BOOKINGS ====================
  const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
    try {
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("department_id", department.id)
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
      console.error("fetchTimeSlotsAndDepartmentBookings error", err);
      setTimeSlots([]);
      setBookings([]);
    }
  };

  // ==================== TOGGLE DEPARTMENT EXPAND ====================
  // const toggleExpandDepartment = async (department: Department) => {
  //   if (expandedTimeSlotId === department.id) {
  //     setExpandedTimeSlotId(null);
  //     setSelectedSlot(null);
  //     setTimeSlots([]);
  //     setBookings([]);
  //     setSelectedDay(0);
  //     setSlotAvailability({});
  //     setIsLoadingSlots(false);
  //     return;
  //   }
  //   setExpandedTimeSlotId(department.id);
  //   setSelectedSlot(null);
  //   setTimeSlots([]);
  //   setBookings([]);
  //   setSelectedDay(0);
  //   setSlotAvailability({});
  //    setIsLoadingSlots(true); 
  //   await fetchTimeSlotsAndDepartmentBookings(department);
    
  // };

  const toggleExpandDepartment = async (department: Department) => {
  if (expandedTimeSlotId === department.id) {
    setExpandedTimeSlotId(null);
    setSelectedSlot(null);
    setTimeSlots([]);
    setBookings([]);
    setSelectedDay(0);
    setSlotAvailability({});
    setIsLoadingSlots(false);
    return;
  }

  try {
    setExpandedTimeSlotId(department.id);
    setSelectedSlot(null);
    setTimeSlots([]);
    setBookings([]);
    setSelectedDay(0);
    setSlotAvailability({});

    // START LOADER
    setIsLoadingSlots(true);

    // FETCH DATA
    await fetchTimeSlotsAndDepartmentBookings(department);


  } catch (error) {
    console.error("toggleExpandDepartment error:", error);
  } finally {
    // STOP LOADER
    setIsLoadingSlots(false);
  }
};

  // ==================== FETCH DEPARTMENT DETAILS ====================
  const fetchDepartmentDetails = async () => {
    setLoading(true);
    try {
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("*")
        .eq("id", id)
        .single();
      if (deptError) throw deptError;
      setDepartment(deptData);

      // Fetch STAFF in this department
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select(`
          *,
          profiles!staff_user_id_fkey (first_name, last_name, avatar_url)
        `)
        .eq("department_id", id);
      if (staffError) throw staffError;
      if (staffData) {
        const mapped = staffData.map((item: any) => ({
          id: item.id,
          name: `${item.profiles?.first_name || ""} ${item.profiles?.last_name || ""}`.trim() || "Unknown Staff",
          specialty: item.position || item.role || "Staff",
          rating: 4.5,
          image: item.profiles?.avatar_url || "",
          role: item.role,
          position: item.position,
        }));
        setDepartmentDoctors(mapped);
      }

      const { data: slotCheck, error: slotError } = await supabase
        .from("time_slots")
        .select("id")
        .eq("department_id", deptData.id)
        .limit(1);
      setHasTimeSlots((slotCheck?.length || 0) > 0);
    } catch (error) {
      console.error("Error fetching department details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== BOOKING FLOW ====================
  const handleDepartmentBookNow = async (
    slot: TimeSlot,
    dateIndex: number,
    department: Department
  ) => {
    try {
      const dayOffset = dateIndex + 1;

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + dayOffset);

      const dateISO = bookingDate.toISOString().split("T")[0];

      const dayOfWeek = bookingDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // ================= USER CHECK =================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Login Required",
          description: "Please login to book appointment.",
          variant: "destructive",
        });

        navigate("/login/patient");
        return;
      }

      // ================= DATE RANGE =================
const startOfDay = new Date(bookingDate);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(bookingDate);
endOfDay.setHours(23, 59, 59, 999);

      // ================= FIRST CHECK APPOINTMENT =================
      const { data: existingAppointment, error: appointmentError } =
        await supabase
          .from("appointments")
          .select("id")
          .eq("patient_id", user.id)
          .eq("facility_id", facility.id)
          .eq("department_id", department.id)
          .eq("time_slot_id", slot.id)
           .gte("appointment_date", startOfDay.toISOString())
    .lte("appointment_date", endOfDay.toISOString())
          .maybeSingle();

      if (appointmentError) {
        console.error("Appointment check error:", appointmentError);
      }

      // ================= ALREADY BOOKED CONDITION =================
      if (existingAppointment) {
        setBookingError(
          "You have already booked this appointment for this date."
        );

        setConfirmOpen(true);

        return;
      }

      // ================= SLOT AVAILABILITY =================
      const availability = await checkSlotAvailability(
        slot.id,
        dateISO,
        dayOfWeek
      );

      if (!availability?.success) {
        toast({
          title: "Cannot Book",
          description: "Slot information unavailable.",
          variant: "destructive",
        });
        return;
      }

      // ================= SLOT FULL =================
      if (availability.booked_count >= availability.max_appointments) {
        toast({
          title: "Slot Full",
          description: "This slot is fully booked.",
          variant: "destructive",
        });
        return;
      }

      // ================= OPEN DIALOG =================
      setBookingError(null);

      const bookingData: BookingInfo = {
        slot_id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        booking_date: dateISO,
        doctor_id: "",
        doctor_name: department.name || "Department",
        department_id: department.id,
      };

      setBookingInfo(bookingData);

      setConfirmOpen(true);

    } catch (error) {
      console.error("Booking flow error:", error);

      toast({
        title: "Error",
        description: "Unable to process booking.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingInfo) return;

    try {
      setIsBooking(true);

      // Re-check availability once more before final submission
      const bookingDateObj = new Date(bookingInfo.booking_date);
      const dayOfWeek = bookingDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const slotStatus = await checkSlotAvailability(
        bookingInfo.slot_id,
        bookingInfo.booking_date,
        dayOfWeek
      );

      if (!slotStatus || !slotStatus.success) {
        toast({
          title: "Cannot Book",
          description: "Slot information unavailable. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (slotStatus.booked_count >= slotStatus.max_appointments) {
        toast({
          title: "Slot Full",
          description: "This time slot is already fully booked.",
          variant: "destructive",
        });
        return;
      }

      if (slotStatus.user_has_booked) {
        toast({
          title: "Already Booked",
          description: "You have already booked this time slot on this date.",
          variant: "destructive",
        });
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        navigate('/login/patient');
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const payload = {
        patient_id: user.id,
        doctor_id: null,
        facility_id: department?.facility_id || null,
        department_id: bookingInfo.department_id,
        booking_date: bookingInfo.booking_date,
        time_slot_id: bookingInfo.slot_id,
        notes: notes || null,
      };

      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-temp-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: result.error || "Unable to book appointment",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset state
      setConfirmOpen(false);
      setNotes("");
      setSelectedSlot(null);
      setExpandedTimeSlotId(null);

      // Refresh slots & bookings for the department
      if (department) {
        await fetchTimeSlotsAndDepartmentBookings(department);
        // Also refresh availability for the currently selected day
        await fetchAvailabilityForDay(selectedDay);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({
        title: "Error",
        description: err?.message || "Unable to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // ==================== CHECK BOOKING STATUS ====================
  const checkBookingStatus = async (facilityId: string) => {
    try {
      const { data, error } = await supabase
        .from("booking_attempts")
        .insert({ facility_id: facilityId, booking_type: "appointment" })
        .eq("facility_id", facilityId);
      if (error) {
        console.error("Booking status error:", error);
        return;
      }
      if (!data) setIsBookingBlocked(false);
    } catch (err) {
      console.error("checkBookingStatus error:", err);
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (id) fetchDepartmentDetails();
  }, [id]);

 

  // ==================== RENDER ====================
  if (loading) {
    return (
      <DashboardLayout userType="patient">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 />
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout userType="patient">
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Department Not Found</h2>
            <p className="text-gray-600 mb-6">The requested department could not be found.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="patient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {facility && (
            <p className="text-sm text-gray-600">
              {facility.facility_name} • {facility.facility_type}
            </p>
          )}
        </div>

        {/* Department Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 h-32"></div>
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 -mt-16">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0"
                onClick={() => bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calendar className="h-4 w-4 mr-2" /> Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {/* About Department */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About Department</h2>
              <p className="text-gray-700 leading-relaxed">
                {department.description || "No description available"}
              </p>
            </CardContent>
          </Card>

          {/* Booking Section */}
          <Card ref={bookingSectionRef}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
              <div className="space-y-3">
                {hasTimeSlots === false && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 font-medium">
                      ⏳ Appointment slots are not available.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Please contact the hospital or try again later.
                    </p>
                  </div>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => toggleExpandDepartment(department)}
                  disabled={!hasTimeSlots || isClinicalLimitReached}
                >
                  {isClinicalLimitReached
                    ? "Booking not available, please try after some time."
                    : "View Availability"}
                </Button>
              </div>

              {expandedTimeSlotId === department.id && (
                <div className="mt-4 p-4 rounded-xl border shadow bg-white">
                  <h3 className="font-semibold mb-3 text-lg">Available Slots</h3>
                  {timeSlots.length === 0 ? (
                    <p className="text-red-600 font-medium">
                      Department {department.name} is not available.
                    </p>
                  ) : (
                    <>
                      {/* Day Selector */}
                      <div className="flex gap-3 overflow-x-auto py-2">
                        {Array.from({ length: 14 }).map((_, index) => {
                          const dayOffset = index + 1;
                          const date = new Date();
                          date.setDate(date.getDate() + dayOffset);
                          const label = formatDayLabel(date, index);
                          const dayNumber = formatDateNumber(date);
                          const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
                          const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
                          const dateISO = date.toISOString().split("T")[0];
                          const bookingsForDay = bookings.filter(
                            (b) => new Date(b.appointment_date).toISOString().split("T")[0] === dateISO
                          );
                          const bookedSlotIds = new Set(bookingsForDay.map((b) => b.time_slot_id));
                          const availableSlotsCount = slotsForDay.filter(
                            (slot) => !bookedSlotIds.has(slot.id)
                          ).length;
                          const isActiveDay = selectedDay === index;
                          return (
                            <div key={index} className="min-w-[110px]">
                              <button
                                onClick={async () => {
                                  setSelectedDay(index);
                                  setSelectedSlot(null);
                                  await fetchAvailabilityForDay(index);
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-center transition ${
                                  isActiveDay
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-200"
                                }`}
                              >
                                <div className="text-xs font-medium">{label}</div>
                                <div className="text-lg font-bold mt-1">{dayNumber}</div>
                                <div
                                  className={`text-[11px] mt-1 ${
                                    isActiveDay ? "text-white" : "text-gray-400"
                                  }`}
                                >
                                  {availableSlotsCount} slot{availableSlotsCount !== 1 ? "s" : ""}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Slots for selected day */}
                      <div className="mt-4">

                                  {isLoadingSlots ? (
                                     <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      <span className="ml-3 text-sm text-gray-600">
        Loading slots...
      </span>
    </div>
                                    ):(
                        (() => {
                          const dayOffset = selectedDay + 1;
                          const selectedDate = new Date();
                          selectedDate.setDate(selectedDate.getDate() + dayOffset);
                          const selectedISO = selectedDate.toISOString().split("T")[0];
                          const fullDayName = selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                          });
                          const slotsForDay = timeSlots.filter((s) => s.day_of_week === fullDayName);

                          if (slotsForDay.length === 0) {
                            return <p className="text-gray-500 text-sm">No slots available for this day.</p>;
                          }

                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {slotsForDay.map((slot) => {
                                const avail = slotAvailability[slot.id];
                                const isFull = avail && avail.booked_count >= avail.max_appointments;
                                const alreadyBookedByUser = avail && avail.user_has_booked;
                                // Disable if slot is full, already booked by user, or availability check failed
                                const isDisabled = !avail?.success || isFull || alreadyBookedByUser;
                                const isSelected = selectedSlot?.id === slot.id;

                                return (
                                  
                                  <div
                                    key={slot.id}
                                    onClick={() => {
                                      if (!isDisabled) setSelectedSlot(slot);
                                    }}
                                    className={`
                                      p-2 rounded-md text-sm transition
                                      ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
                                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                      ${isSelected ? "border-2 border-green-600" : "border border-gray-300"}
                                    `}
                                  >
                                    <div className="font-medium">
                                      {formatTimePretty(slot.start_time)} -{" "}
                                      {formatTimePretty(slot.end_time)}
                                    </div>
                                    <div className="text-[11px] text-gray-600 capitalize">
                                      {slot.slot_type}
                                    </div>

                                    {/* FIXED: status message – only one condition shown */}
                                    <div className="text-[11px] mt-1 font-semibold">
                                      {alreadyBookedByUser ? (
                                        <span className="text-orange-600">Already booked by you</span>
                                                                            ) : (
                                        <>
                                        <span className="text-green-600">
                                          {avail?.remaining_count} left
                                        </span>
                                        <br/>
                                        <span className="text-green-500">
                                          status
                                        </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()
                      )}
                      </div>

                      {!selectedSlot && (
                        <p className="text-red-500 text-lg mt-2">
                          Please select a slot to book an appointment.
                        </p>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        disabled={!selectedSlot || totalmax}
                        onClick={() => handleDepartmentBookNow(selectedSlot!, selectedDay, department)}
                      >
                        { totalmax 
    ? "Booking not available right now. Please try after some time."
    : "Book Appointment"}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Confirmation Dialog with duplicate error handling */}
              <Dialog
                open={confirmOpen}
                onOpenChange={(open) => {
                  setConfirmOpen(open);
                  if (!open) {
                    setBookingError(null);
                    setBookingInfo(null);
                    setNotes("");
                  }
                }}
              >
                <DialogContent className="rounded-xl p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">
                      {bookingError ? "Appointment Already Exists" : "Confirm Appointment"}
                    </DialogTitle>
                  </DialogHeader>

                  {bookingError ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {bookingError}
                    </div>
                  ) : (
                    <>
                      {bookingInfo && (
                        <div className="space-y-4 mt-2">
                          <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">Doctor/Department</p>
                            <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-100 rounded-lg">
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="text-md font-medium">{bookingInfo.booking_date}</p>
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
                            <label className="text-sm font-medium text-gray-600">Notes (optional)</label>
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
                    </>
                  )}

                  <DialogFooter className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConfirmOpen(false);
                        setBookingError(null);
                        setBookingInfo(null);
                        setNotes("");
                      }}
                    >
                      Close
                    </Button>
                    {!bookingError && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleConfirmBooking}
                        disabled={isBooking || !bookingInfo}
                      >
                        {isBooking ? "Confirming..." : "Confirm Booking"}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Services & Equipment */}
          {department.services && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {Array.isArray(department.services) ? (
                    department.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{service}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 col-span-2">{department.services}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {department.equipment && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Equipment</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {Array.isArray(department.equipment) ? (
                    department.equipment.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Microscope className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 col-span-2">{department.equipment}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDetails;

