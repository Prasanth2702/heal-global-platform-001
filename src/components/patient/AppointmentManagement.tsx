import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppointmentCard from "./AppointmentCard";
import { Button } from "@/components/ui/button";

// ------------ TYPES ----------------
export interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  isPast: boolean;
  location: string;
  consultationFee: number | null;
  doctorNotes?: string;
  videoRoomId?: string;
  status: "confirmed" | "cancelled";
  doctorAvatar: string | null;
cancellationReason?: string | null;
notes?: string | null;

}

// ------------ HELPERS ----------------
const to12Hour = (time: string) => {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "cancelled"
  >("all");

useEffect(() => {
  fetchAppointments();
}, []);


  // ------------ FETCH ----------------
const fetchAppointments = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      doctor_id,
      appointment_date,
      time_slot_id,
      type,
      consultation_fee,
      notes,
      video_room_id,
      status,
      cancellation_reason,
      notes
    `)
    .eq("patient_id", user.id)
    .order("appointment_date", { ascending: true });
    console.log(data);

  if (error || !data) {
    console.error(error);
    return;
  }

  const doctorIds = [...new Set(data.map(a => a.doctor_id))];

  const { data: doctors } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, avatar_url")
    .in("user_id", doctorIds);

  const doctorMap = new Map(
    doctors?.map(d => [
      d.user_id,
      {
        name: `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim() || "Doctor",
        avatar: d.avatar_url ?? null,
      },
    ])
  );

  const enriched: Appointment[] = [];

  for (const apt of data) {
    const { data: slot } = await supabase
      .from("time_slots")
      .select("start_time, end_time, slot_type")
      .eq("id", apt.time_slot_id)
      .single();

    if (!slot) continue;

    const dateOnly = apt.appointment_date.split("T")[0];
    const endDateTime = new Date(`${dateOnly}T${slot.end_time}`);

    const doctor = doctorMap.get(apt.doctor_id);

    enriched.push({
      id: apt.id,
      doctorName: doctor?.name ?? "Doctor",
      date: dateOnly,
      time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
      type: apt.type,
      isPast: endDateTime < new Date(),
      location: slot.slot_type === "tele" ? "Online" : "Clinic",
      consultationFee: apt.consultation_fee,
      doctorNotes: apt.notes,
      videoRoomId: apt.video_room_id,
      status: apt.status,
      doctorAvatar: doctor?.avatar ?? null,
      cancellationReason: apt.cancellation_reason ?? null,
      notes: apt.notes ?? null,

    });
  }

  // ✅ HARD DEDUPLICATION
  const unique = Array.from(
    new Map(enriched.map(a => [a.id, a])).values()
  );

  setAppointments(unique);
};


  // ------------ FILTERING ----------------
  const filterByStatus = (list: Appointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter(a => a.status === statusFilter);
  };

  const upcoming = filterByStatus(
    appointments.filter(a => !a.isPast)
  );

  const past = filterByStatus(
    appointments.filter(a => a.isPast)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Past
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {["all", "confirmed", "cancelled"].map(s => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => setStatusFilter(s as any)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {(activeTab === "upcoming" ? upcoming : past).map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}

      {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
        <p className="text-muted-foreground">
          No appointments found
        </p>
      )}
    </div>
  );
}
