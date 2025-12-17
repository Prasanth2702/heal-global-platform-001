import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { Button } from "@/components/ui/button";

export interface DoctorAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  isPast: boolean;
  status: "confirmed" | "cancelled";
  notes?: string;
  videoRoomId?: string;
  patientAvatar?: string | null;
}

const to12Hour = (time: string) => {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function DoctorAppointmentManagement() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "cancelled"
  >("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, role")
      .eq("user_id", user.id);

    if (!profiles || profiles[0]?.role !== "doctor") return;

    const { data: appts } = await supabase
      .from("appointments")
      .select(`
        id,
        patient_id,
        appointment_date,
        time_slot_id,
        type,
        status,
        notes,
        video_room_id
      `)
      .eq("doctor_id", user.id)
      .order("appointment_date", { ascending: true });

    if (!appts) return;

    const patientIds = [...new Set(appts.map(a => a.patient_id))];

    const { data: patients } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name,avatar_url")
      .in("user_id", patientIds);

    const patientMap = new Map(
      patients?.map(p => [p.user_id, `${p.first_name} ${p.last_name}`])
    );
    const patientAvatarMap = new Map(
  patients?.map(p => [p.user_id, p.avatar_url])
);


    const enriched: DoctorAppointment[] = [];

    for (const apt of appts) {
      const { data: slot } = await supabase
        .from("time_slots")
        .select("start_time, end_time")
        .eq("id", apt.time_slot_id)
        .single();

      if (!slot) continue;

      const dateOnly = apt.appointment_date.split("T")[0];
      const endTime = new Date(`${dateOnly}T${slot.end_time}`);

      enriched.push({
        id: apt.id,
        patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
        date: dateOnly,
        time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
        type: apt.type,
        status: apt.status,
        isPast: endTime < new Date(),
        notes: apt.notes,
        videoRoomId: apt.video_room_id,
   patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,

      });
    }

    setAppointments(enriched);
  };

  const filterByStatus = (list: DoctorAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter(a => a.status === statusFilter);
  };

  const upcoming = filterByStatus(appointments.filter(a => !a.isPast));
  const past = filterByStatus(appointments.filter(a => a.isPast));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <div className="flex gap-3 mb-4">
        <Button
          variant={activeTab === "upcoming" ? "doctor" : "outline"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === "past" ? "doctor" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Past
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "confirmed", "cancelled"].map(s => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "doctor" : "outline"}
            onClick={() => setStatusFilter(s as any)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {(activeTab === "upcoming" ? upcoming : past).map(apt => (
        <DoctorAppointmentCard
          key={apt.id}
          appointment={apt}
          onRefresh={fetchAppointments}
        />
      ))}

      {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
        <p className="text-muted-foreground">No appointments</p>
      )}
    </div>
  );
}
