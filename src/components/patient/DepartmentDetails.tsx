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
const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const facility = location.state?.facility as Facility | null;
 // Add this ref for the booking section
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
// Add these missing state declarations at the top with your other states
const [confirmOpen, setConfirmOpen] = useState(false);
const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
const [notes, setNotes] = useState("");
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Add this missing function
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
    setConfirmOpen(false);
    setNotes("");
    setSelectedSlot(null);
    setExpandedTimeSlotId(null);
    
    // Refresh slots
    if (department) {
      await fetchTimeSlotsAndDepartmentBookings(department);
    }
  } catch (err: any) {
    console.error("Booking error:", err);
    toast({
      title: "Error",
      description: err?.message || "Unable to book appointment",
      variant: "destructive",
    });
  }
};
  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
    }
  }, [id]);

  const fetchDepartmentDetails = async () => {
    setLoading(true);
    try {
      // Fetch department details
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("*")
        .eq("id", id)
        .single();

      if (deptError) throw deptError;
      setDepartment(deptData);

      // Fetch doctors in this department
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("medical_professionals")
        .select(`
          *,
          medical_professionals_user_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("department_id", id);

      if (doctorsError) throw doctorsError;

      if (doctorsData) {
        const mapped = doctorsData.map((item: any) => ({
          id: item.id,
          name: `${item.medical_professionals_user_id_fkey?.first_name || ""} ${
            item.medical_professionals_user_id_fkey?.last_name || ""
          }`.trim() || "Unknown Doctor",
          specialty: item.medical_speciality,
          rating: item.rating || 4.5,
          image: item.medical_professionals_user_id_fkey?.avatar_url || "",
        }));
        setDepartmentDoctors(mapped);
      }
    } catch (error) {
      console.error("Error fetching department details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoctor = (doctorId: string) => {
    navigate(`/dashboard/patient/doctor/${createSlug(department?.name || "")}/${doctorId}`);
  };

  const handleBookAppointmentClick = () => {
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

    const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
    const [expandedTimeSlotId, setExpandedTimeSlotId] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(0);
    
  
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

const fetchTimeSlotsAndDepartmentBookings = async (department: Department) => {
    try {
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("department_id", department.id)
        .eq("slot_type", "booking")
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
        .eq("department_id", department.id);

      if (bookingsError) {
        console.error("bookings fetch error", bookingsError);
        setBookings([]);
      } else {
        setBookings(bookingsData || []);
      }
    } catch (err) {
      console.error("fetchTimeSlotsAndDepartmentBookings error", err);
      setTimeSlots([]);
      setBookings([]);
    }
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

  if (loading) {
    return (
      <DashboardLayout userType="patient">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading department details...</p>
          </div>
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
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="patient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with navigation */}
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
                    <div className="flex items-center gap-2 mt-2">
                      {department.is_active ? (
                        <Badge className="bg-green-500">Active Department</Badge>
                      ) : (
                        <Badge variant="outline">Inactive Department</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0"
                onClick={handleBookAppointmentClick}
              >
                <Calendar className="h-4 w-4 mr-2" /> Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BedDouble className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold">{department.bed_capacity || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Available Beds</p>
              <p className="text-2xl font-bold">{department.available_beds || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Doctors</p>
              <p className="text-2xl font-bold">{departmentDoctors.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              {department.is_active ? (
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              )}
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={department.is_active ? "bg-green-500 mt-1" : "bg-gray-500 mt-1"}>
                {department.is_active ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Department Info */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Description & Services */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About Department</h2>
                <p className="text-gray-700 leading-relaxed">
                  {department.description || "No description available"}
                </p>
                 
              </CardContent>
            </Card>
            <Card ref={bookingSectionRef}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
                 <Button
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => toggleExpandDepartment(department)}
                              >
                                View Availability
                              </Button>

                               {expandedTimeSlotId === department.id && (
                                                            <div className="mt-4 p-4 rounded-xl border shadow bg-white">
                                                              <h3 className="font-semibold mb-3 text-lg">
                                                                Available Slots
                                                              </h3>
                              
                                                              {timeSlots.length === 0 ? (
                                                                <p className="text-red-600 font-medium">
                                                                  Department {department.name} is not available.
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
                                                                                  ? "bg-green-600 text-white"
                                                                                  : "bg-white text-gray-700"
                                                                              }
                                                                              border ${
                                                                                isActiveDay
                                                                                  ? "border-green-600"
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
                                                                    className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                                                                    disabled={!selectedSlot}
                                                                    onClick={() =>
                                                                      handleDepartmentBookNow(selectedSlot!, selectedDay, department)
                                                                    }
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

          {/* Right Column - Doctors */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Doctors ({departmentDoctors.length})
                </h2>
                {departmentDoctors.length > 0 ? (
                  <div className="space-y-3">
                    {departmentDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => handleViewDoctor(doc.id)}
                      >
                        <img
                          src={doc.image || "https://via.placeholder.com/150"}
                          alt={doc.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.specialty}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs ml-1">{doc.rating}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No doctors assigned to this department
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDetails;