import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";  // 🟢 ADDED
import { useNavigate } from "react-router-dom"; // 🟢 ADDED
import React from "react"; // 🟢 



interface Doctor {
  id: string;
  user_id: string;      // 🔵Updated (8/12)
  name: string;          // 🔵 UPDATED (from static fields to dynamic)
  specialty: string;
  rating: number;
  experience: string;
  location?: string;     // 🔵 UPDATED (optional)
  distance?: string;     // 🔵 UPDATED
  consultationFee: number;
  availability: string;
  hospital?: string;     // 🔵 UPDATED
  image?: string;        // 🔵 UPDATED
}
// console.log("DoctorSearch component loaded");

const DoctorSearch = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]); // 🟢 ADDED
  const [loading, setLoading] = useState(true);         // 🟢 ADDED
  const navigate = useNavigate();                       // 🟢 ADDED
  const [expandedDoctorId, setExpandedDoctorId] = useState(null); // ⭐ holds selected doctor
  const [timeSlots, setTimeSlots] = useState([]); // 🟢
  const [selectedSlot, setSelectedSlot] = useState(null);


  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ophthalmologist"
  ];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const TIME_RANGE = ["9:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00"];
 
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
    // console.log("Fetching doctors from Supabase...",data[0].medical_professionals_user_id_fkey.user_id);
    // console.log("Fetched doctors data in:", data);
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
      };
    });

    // console.log("Mapped doctors data:", mapped[1].availability);
    setDoctors(mapped);
    setLoading(false);
  };
  const fetchTimeSlots = async (doctorId) => {
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq('is_available', true);

    if (error) return console.error(error);
    console.log("Fetched time slots for doctor", doctorId, data);
    setTimeSlots(data);  // store in state
  };



  // 🟢 ADDED — fetch when component loads
  useEffect(() => {

    fetchDoctors();

  }, []);


  const filteredDoctors = searchQuery.trim() === "" ? [] :
    doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        doctor.hospital?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesSpecialty =
        !selectedSpecialty || doctor.specialty === selectedSpecialty;

      const matchesLocation =
        !locationFilter ||
        doctor.location?.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesLocation;
    });

  const toggleExpand = async (doctorId) => {
    // Close previous section OR open new one
    setExpandedDoctorId((prev) => (prev === doctorId ? null : doctorId));

    // 🟢 IMPORTANT: Reset previous selected slot
    setSelectedSlot(null);

    // 🟢 (optional but recommended) Clear old time slots
    setTimeSlots([]);

    if (doctorId !== expandedDoctorId) {
      fetchTimeSlots(doctorId);
    }
  };



  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Detected",
            description: "Searching for doctors near your location...",
          });
          // In real app, use coordinates to filter nearby doctors
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

  const handleBookAppointment = (doctor, slot) => {
    console.log("Booking with doctor:", doctor);
    console.log("Selected slot:", slot);

    toast({
      title: "Booking Appointment",
      description: `Booking ${doctor.name} at ${slot.start_time}`,
    });
  };


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
              console.log("Rendering doctor:", doctor.user_id),

              <Card
                key={doctor.id}
                className="hover:shadow-medium transition "
              // onClick={() => toggleExpand(doctor.user_id)}
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
                        {/* // ⭐ NEW: View Availability Button */}
                        <Button
                          variant="patient"
                          size="sm"
                          // onClick={() => navigate(`/doctor-availability/${doctor.user_id}`)}
                          onClick={() => toggleExpand(doctor.user_id)}
                        >
                          View Availability
                        </Button>
                      </div>
                    </div>
                  </div>
                  {expandedDoctorId === doctor.user_id && (
                    <div className="mt-4 p-4 rounded-xl border shadow bg-white">

                      <h3 className="font-semibold mb-3 text-lg">Available Slots</h3>

                      {/* 🟥 If NO SLOTS → show ONLY this message */}
                      {timeSlots.length === 0 ? (
                        <p className="text-red-600 font-medium">Doctor is not available.</p>
                      ) : (
                        <>
                          {/* 🟦 If slots exist → render calendar */}
                          <div className="space-y-4 overflow-x-auto pb-2">
                            {DAYS.filter(day =>
                              timeSlots.some(s => s.day_of_week === day)
                            ).map(day => {
                              const slots = timeSlots.filter(s => s.day_of_week === day);

                              return (
                                <div key={day} className="py-1">

                                  {/* Day Title */}
                                  <div className="font-medium text-sm mb-2">{day}</div>

                                  {/* Slots Row */}
                                  <div className="flex gap-2 overflow-x-auto">
                                    {slots.map(slot => {
                                      let isSelected = false;
                                      isSelected = selectedSlot?.id === slot.id;

                                      const borderColor =
                                        slot.slot_type === "clinic"
                                          ? "border-green-500"
                                          : "border-blue-500";

                                      const bgColor =
                                        slot.slot_type === "clinic"
                                          ? "bg-green-100"
                                          : "bg-blue-100";

                                      return (
                                        <div
                                          key={slot.id}
                                          onClick={() => setSelectedSlot(slot)}
                                          className={`
                          w-16 h-12 min-w-[4rem]
                          flex flex-col items-center justify-center
                          text-xs rounded-md cursor-pointer 
                          ${bgColor}
                          ${isSelected ? `border-2 ${borderColor}` : "border border-gray-300"}
                          hover:opacity-90 transition
                        `}
                                        >
                                          <span className="font-semibold">
                                            {slot.start_time.slice(0, 5)}
                                          </span>
                                          <span className="text-[10px] text-gray-600">
                                            {slot.slot_type === "clinic" ? "C" : "T"}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Info text */}
                          {!selectedSlot && (
                            <p className="text-gray-500 text-xs mt-2">
                              Please select a slot to book an appointment.
                            </p>
                          )}

                          {/* Book button */}
                          <Button
                            variant="patient"
                            size="sm"
                            className="mt-3 w-full sm:w-auto"
                            disabled={!selectedSlot}
                            onClick={() => handleBookAppointment(doctor, selectedSlot)}
                          >
                            Book Appointment
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
    </div>
  );
};

export default DoctorSearch;