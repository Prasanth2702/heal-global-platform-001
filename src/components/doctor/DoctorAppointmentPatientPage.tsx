import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Video, MapPin, FileText, User, Mail, Phone, PhoneIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { format } from "date-fns";// adjust path if needed
import { toast } from "@/hooks/use-toast";
import SubscriptionUsage from "./SubscriptionUsage";

interface AppointmentDetails {
  id: string;
  patientId: string;
  doctorId: string;
  appointment_date: string;
  type: "teleconsultation" | "in_person";
  status: string;
  notes?: string;
  video_room_id?: string;
  created_at: string;
  timeStart: string;
  timeEnd: string;
}

interface PatientProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url?: string;
}

const to12Hour = (time: string) => {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function DoctorAppointmentPatientPage() {
  const { userId, patientId, appointmentId } = useParams<{
    userId: string;
    patientId: string;
    appointmentId: string;
  }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [doctorUserId, setDoctorUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId || !patientId || !userId) {
        toast({ title: "Missing parameters", variant: "destructive" });
        navigate("/dashboard/doctor");
        return;
      }

      try {
        // 1. Get current logged-in doctor to verify access
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
          toast({ title: "Unauthorized", variant: "destructive" });
          navigate("/dashboard/doctor");
          return;
        }
        setDoctorUserId(user.id);

        // 2. Fetch appointment with time slot
        const { data: apt, error: aptError } = await supabase
          .from("appointments")
          .select("id, patient_id, doctor_id, appointment_date, time_slot_id, type, status, notes, video_room_id, created_at")
          .eq("id", appointmentId)
          .single();

        if (aptError || !apt) throw new Error("Appointment not found");

        // 3. Fetch time slot
        const { data: slot, error: slotError } = await supabase
          .from("time_slots")
          .select("start_time, end_time")
          .eq("id", apt.time_slot_id)
          .single();

        if (slotError) throw new Error("Time slot not found");

        // 4. Fetch patient profile
        const { data: patientData, error: patientError } = await supabase
          .from("profiles")
          .select("first_name, last_name, email, phone_number, avatar_url")
          .eq("user_id", patientId)
          .single();

        if (patientError) throw new Error("Patient not found");

        setAppointment({
          ...apt,
          timeStart: slot.start_time,
          timeEnd: slot.end_time,
        });
        setPatient(patientData);
      } catch (err: any) {
        console.error(err);
        toast({ title: err.message || "Failed to load appointment", variant: "destructive" });
        navigate("/dashboard/doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, patientId, userId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!appointment || !patient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Appointment data not found.</p>
        <Button onClick={() => navigate("/dashboard/doctor")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isTele = appointment.type === "teleconsultation";
  const consultationTypeForSubscription = isTele ? "tele" : "clinical";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/doctor")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Appointments
        </Button>

        {/* Appointment Header Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              {patient.avatar_url ? (
                <img
                  src={patient.avatar_url}
                  alt={patient.first_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {patient.first_name[0]}{patient.last_name[0]}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{patient.first_name} {patient.last_name}</h2>
                <div className="flex gap-3 mt-1 text-gray-600">
                  <span className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" /> {patient.email}</span>
                  <span className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" /> {patient.phone_number}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Date:</span> {appointment.appointment_date}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Time:</span> {to12Hour(appointment.timeStart)} - {to12Hour(appointment.timeEnd)}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                {isTele ? <Video className="h-5 w-5 text-purple-500" /> : <MapPin className="h-5 w-5 text-indigo-500" />}
                <span className="font-medium">Type:</span>
                <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${isTele ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`}>
                  {appointment.type === "teleconsultation" ? "Teleconsultation" : "In-Person"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Status:</span>
                <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === "confirmed" ? "bg-green-100 text-green-700" :
                  appointment.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                  <FileText className="h-4 w-4" /> Patient Notes
                </div>
                <p className="text-gray-600">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Usage Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 rounded-t-xl border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <span>📊 Subscription Usage</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isTele ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`}>
                {isTele ? "Teleconsultation" : "Clinical (In-Person)"} Appointment
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Pass doctor's user ID to SubscriptionUsage */}
            <SubscriptionUsage professionalId={doctorUserId} />

            {/* Conditional note explaining highlighted usage */}
            <div className="mt-4 text-sm text-gray-500 border-t pt-4">
              <p className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                The usage above shows both consultation types. Your current appointment is a{" "}
                <strong>{isTele ? "teleconsultation" : "clinical (in-person)"}</strong> – ensure you have remaining quota for that type.
              </p>

              <p className="text-sm text-muted-foreground">Contact us to update your number</p>

<p className="flex items-center justify-center">
  <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  <span className="text-primary">+91 98868 81149</span>
</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}