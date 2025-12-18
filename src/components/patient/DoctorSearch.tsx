import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";



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
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


const DoctorSearch = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
const [bookingInfo, setBookingInfo] = useState(null);
const [notes, setNotes] = useState("");


  // const [, setSelectedDate] = useState<Date | null>(null);

  // calendar UI state
  const [selectedDay, setSelectedDay] = useState<number>(0); // index 0..6, default today

  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ophthalmologist"
  ];

  
  // ------------------------
  // Helpers
  // ------------------------
  const formatDayLabel = (date: Date, index: number) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    // Mon, 21 Jan
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDateNumber = (date: Date) => {
    return date.getDate();
  };

  const formatTimePretty = (timeStr: string) => {
    // timeStr is "HH:MM:SS"
    const hh = parseInt(timeStr.slice(0, 2), 10);
    const mm = timeStr.slice(3, 5);
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${hour12}:${mm} ${ampm}`;
  };

  // ------------------------
  // Data fetchers
  // ------------------------
  const fetchDoctors = async () => {
    setLoading(true);
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

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped = data.map((item: any) => {
      const fullName = item.medical_professionals_user_id_fkey
        ? `${item.medical_professionals_user_id_fkey.first_name || ""} ${item.medical_professionals_user_id_fkey.last_name || ""}`.trim()
        : "Unknown Doctor";

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
        image: item.medical_professionals_user_id_fkey?.avatar_url || "",
      } as Doctor;
    });

    setDoctors(mapped);
    setLoading(false);
  };

  /**
   * Fetch time_slots for doctor (only available ones).
   * Also fetch bookings for the doctor (used to mark booked slots).
   */
  const fetchTimeSlotsAndBookings = async (doctorId: string) => {
    try {
      // fetch available time slots
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

      // fetch bookings for this doctor
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId);
      console.log("Fetched bookings data:", doctorId);
      if (bookingsError) {
        console.error("bookings fetch error", bookingsError);
        setBookings([]);
      } else {
        setBookings(bookingsData || []);
      }
      console.log("Fetched time slots:", bookings);
    } catch (err) {
      console.error("fetchTimeSlotsAndBookings error", err);
      setTimeSlots([]);
      setBookings([]);
    }
  };

  // ------------------------
  // Effects
  // ------------------------
  useEffect(() => {
    fetchDoctors();
  }, []);

  // ------------------------
  // Handlers
  // ------------------------
  const toggleExpand = async (doctorId: string) => {
    // If closing same doctor, collapse and reset selection + data
    console.log("Toggling expand for doctorId:", doctorId, "Current expandedDoctorId:", expandedDoctorId);
    if (expandedDoctorId === doctorId) {
      setExpandedDoctorId(null);
      setSelectedSlot(null);
      setTimeSlots([]);
      setBookings([]);
      setSelectedDay(0);
      return;
    }

    // Opening a new doctor: reset previous selection/data then fetch new
    setExpandedDoctorId(doctorId);
    setSelectedSlot(null);
    setTimeSlots([]);
    setBookings([]);
    setSelectedDay(0);

    await fetchTimeSlotsAndBookings(doctorId);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Detected",
            description: "Searching for doctors near your location...",
          });
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or enter your area manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleBookNow = (slot, date, doctor) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + date);
    console.log("Booking with doctor:", doctor);
    console.log("Selected slot:", slot);
    console.log("Booking date:", date, newDate);

    toast({
      title: "Booking Appointment",
      description: `Booking ${doctor.name} at ${formatTimePretty(slot.start_time)}  ${date === 0 ? "Today" : date === 1 ? `Tomorrow ${newDate.getDate()} / ${newDate.getMonth() + 1}` : `  ${newDate.getDate()}  / ${newDate.getMonth() + 1} date`}`,
    });
   const bookingData = {
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

  // ------------------------
  // Filtered doctors for search
  // ------------------------
  const filteredDoctors = searchQuery.trim() === "" ? [] :
    doctors.filter(doctor => {
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.hospital?.toLowerCase().includes(term);

      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
      const matchesLocation = !locationFilter || doctor.location?.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesSpecialty && matchesLocation;
    });

  console.log("Filtered Doctors:", filteredDoctors);
  // ------------------------  Pass confirm booking to backend
  const handleConfirmBooking = async () => {
  if (!bookingInfo) return;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    console.log("Booking Info:", token);
    const { data: { user } } = await supabase.auth.getUser();

    const response = await fetch(
     'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
     body: JSON.stringify({
  patient_id: user.id,
  doctor_id: bookingInfo.doctor_id,
  booking_date: bookingInfo.booking_date,
  time_slot_id: bookingInfo.slot_id,
  notes: notes || null,
}),

      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    // toast.success("Appointment Confirmed!");
    setConfirmOpen(false);

  } catch (err) {
    // toast.error("Unable to book appointment");
  }
};


  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="space-y-6">
      {/* --- Search Header --- */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Doctors, Hospitals, or Specialties</Label>
            <Input
              id="search"
              placeholder="Enter doctor name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={detectLocation} variant="outline">
              <MapPin className="mr-2 h-4 w-4" /> Near Me
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Specialty</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location/Area</Label>
                  <Input
                    placeholder="Enter area or hospital"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* --- Results --- */}
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {filteredDoctors.length} Doctor(s) Found
          </h3>
        </div>

        {loading ? (
          <p>Loading doctors…</p>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="hover:shadow-medium transition"
              >
                <CardContent className="p-6">
                  {/* Row Top */}
                  <div className="flex gap-4">
                    {/* Image */}
                    <img
                      src={doctor.image || "https://via.placeholder.com/150"}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full"
                    />

                    {/*Doctor(s) Details*/}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">{doctor.name}</h4>
                          <p className="text-muted">{doctor.specialty}</p>
                        </div>

                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1">{doctor.rating}</span>
                        </div>
                      </div>
                         
                      <div className="text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {doctor.location || "Location not provided"}
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {doctor.availability}
                        </Badge>

                        <span className="text-green-600 font-medium">
                          ₹{doctor.consultationFee} Consultation
                        </span>
                      </div>

                      <div className="mt-3">
                        <Button
                          variant="patient"
                          size="sm"
                          onClick={() => { console.log("Toggling availability for user ID:", doctor.user_id); toggleExpand(doctor.user_id); }}
                        >
                          View Availability
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* -------------------------
                      Expanded availability area
                      ------------------------- */}
                  {expandedDoctorId === doctor.user_id && (
                    <div className="mt-4 p-4 rounded-xl border shadow bg-white">

                      <h3 className="font-semibold mb-3 text-lg">Available Slots</h3>

                      {timeSlots.length === 0 ? (
                        <p className="text-red-600 font-medium">Doctor is not available.</p>
                      ) : (
                        <>
                          {/* Calendar strip: next 14 days */}
                          <div className="flex gap-3 overflow-x-auto py-2">
                            {Array.from({ length: 14 }).map((_, index) => {

                              // 1. Selected date
                              const date = new Date();
                              date.setDate(date.getDate() + index);

                              const label = formatDayLabel(date, index);
                              const dayNumber = formatDateNumber(date);

                              // 2. Day name
                              const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

                              // 3. Get all slots for this day-of-week
                              const slotsForDay = timeSlots.filter(
                                s => s.day_of_week === dayOfWeek
                              );

                              // 4. Convert date to YYYY-MM-DD
                              const dateISO = date.toISOString().split("T")[0];

                              // 5. Find bookings for this exact date
                              const bookingsForDay = bookings.filter(b => {
                                const bookingISO = new Date(b.appointment_date)
                                  .toISOString()
                                  .split("T")[0];

                                return bookingISO === dateISO;
                              });

                              // 6. Available slots = slots - bookedSlots
                              const bookedSlotIds = new Set(
                                bookingsForDay.map(b => b.time_slot_id)
                              );

                              const availableSlotsCount = slotsForDay.filter(
                                slot => !bookedSlotIds.has(slot.id)
                              ).length;

                              // 7. Render date header
                              const isActiveDay = selectedDay === index;

                              return (
                                <div key={index} className="min-w-[110px]">
                                  <button
                                    onClick={() => {
                                      setSelectedDay(index);
                                      setSelectedSlot(null);
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg text-center transition
                                    ${isActiveDay ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
                                    border ${isActiveDay ? "border-blue-600" : "border-gray-200"}`}
                                  >
                                    <div className="text-xs font-medium">
                                      {label}
                                    </div>

                                    <div className="text-lg font-bold mt-1">
                                      {dayNumber}
                                    </div>

                                    <div
                                      className={`${isActiveDay
                                        ? "text-[11px] text-white mt-1"
                                        : "text-[11px] text-gray-400 mt-1"
                                        }`}
                                    >
                                      {availableSlotsCount} slot{availableSlotsCount !== 1 ? "s" : ""}
                                    </div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>


                          {/* Slots for selected day (compact grid) */}
                          <div className="mt-4">
                            {/* Available Slots */}
                            {(() => {
                              // 1. Convert selectedDay → selected actual date
                              const selectedDate = new Date();
                              selectedDate.setDate(selectedDate.getDate() + selectedDay);
                              const selectedISO = selectedDate.toISOString().split("T")[0];

                              // 2. Get the weekday name
                              const fullDayName = selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                              });

                              // 3. Filter slots for this weekday
                              const slotsForDay = timeSlots.filter(s => s.day_of_week === fullDayName);
                              console.log("Slots for Day", fullDayName, ":", slotsForDay);

                              if (slotsForDay.length === 0) {
                                return <p className="text-gray-500 text-sm">No slots available for this day.</p>;
                              }

                              // 4. Appointments for this exact selected date
                              const todaysBookings = bookings.filter(b => {
                                const bookingISO = new Date(b.appointment_date).toISOString().split("T")[0];
                                console.log("Comparing booking date:", bookingISO, "with selected date:", selectedISO);
                                return bookingISO === selectedISO;
                              });

                              // 5. Remove booked slots
                              const availableSlots = slotsForDay.filter(slot =>
                                !todaysBookings.some(b => b.time_slot_id === slot.id)
                              );

                              return (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
 

                                  {availableSlots.map(slot => {
                                    const isSelected = selectedSlot?.id === slot.id;

                                    return (
                                      <div
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`
              p-2 rounded-md cursor-pointer text-sm transition
              ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
              ${isSelected ? "border-2 border-green-600" : "border border-gray-300"}
            `}
                                      >
                                        <div className="font-medium">
                                          {formatTimePretty(slot.start_time)} - {formatTimePretty(slot.end_time)}
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

                          {/* helper text */}
                          {!selectedSlot && (
                            <p className="text-gray-500 text-xs mt-2">Please select a slot to book an appointment.</p>
                          )}

                          {/* Book Now button */}
                          <Button
                            variant="patient"
                            size="sm"
                            className="mt-3 w-full sm:w-auto"
                            disabled={!selectedSlot}
                            onClick={() => handleBookNow(selectedSlot, selectedDay, doctor)}
                          >
                            Book Appointment without Payment
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p>No doctors found. Try changing search filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <DialogContent className="rounded-xl p-6">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-center">
        Confirm Appointment
      </DialogTitle>
    </DialogHeader>

    {bookingInfo && (
  <div className="space-y-4 mt-2">

    {/* Doctor */}
    <div className="p-4 bg-gray-100 rounded-lg">
      <p className="text-sm text-gray-600">Doctor</p>
      <p className="text-lg font-medium">{bookingInfo.doctor_name}</p>
    </div>

    {/* Date & Time */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Date</p>
        <p className="text-md font-medium">{bookingInfo.booking_date}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Time Slot</p>
        <p className="text-md font-medium">
          {formatTimePretty(bookingInfo.start_time)} - {formatTimePretty(bookingInfo.end_time)}
        </p>
      </div>
    </div>

    {/* Notes */}
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
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default DoctorSearch;
