// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import DoctorAppointmentCard from "./DoctorAppointmentCard";
// import { Button } from "@/components/ui/button";

// export interface DoctorAppointment {
//   id: string;
//   patientName: string;
//   date: string;
//   time: string;
//   type: "teleconsultation" | "in_person";
//   isPast: boolean;
//   status: "confirmed" | "cancelled" | "completed" ;
//   notes?: string;
//   videoRoomId?: string;
//   patientAvatar?: string | null;
//   patientId: string;          // ✅ ADD
//   doctorId: string;           // ✅ ADD
// }

// const to12Hour = (time: string) => {
//   const [h, m] = time.split(":");
//   const hour = Number(h);
//   const suffix = hour >= 12 ? "PM" : "AM";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${m} ${suffix}`;
// };

// export default function DoctorAppointmentManagement() {
//   const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "confirmed" | "cancelled"
//   >("all");

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data: profiles } = await supabase
//       .from("profiles")
//       .select("user_id, role")
//       .eq("user_id", user.id);

//     if (!profiles || profiles[0]?.role !== "doctor") return;

//     const { data: appts } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         patient_id,
//         appointment_date,
//         time_slot_id,
//         type,
//         status,
//         notes,
//         video_room_id
//       `)
//       .eq("doctor_id", user.id)
//       .order("appointment_date", { ascending: true });

//     if (!appts) return;

//     const patientIds = [...new Set(appts.map(a => a.patient_id))];

//     const { data: patients } = await supabase
//       .from("profiles")
//       .select("user_id, first_name, last_name,avatar_url")
//       .in("user_id", patientIds);

//     const patientMap = new Map(
//       patients?.map(p => [p.user_id, `${p.first_name} ${p.last_name}`])
//     );
//     const patientAvatarMap = new Map(
//       patients?.map(p => [p.user_id, p.avatar_url])
//     );


//     const enriched: DoctorAppointment[] = [];

//     for (const apt of appts) {
//       const { data: slot } = await supabase
//         .from("time_slots")
//         .select("start_time, end_time")
//         .eq("id", apt.time_slot_id)
//         .single();

//       if (!slot) continue;

//       // Determine if appointment is past only by date not time
//       const dateOnly = apt.appointment_date.split("T")[0];
//       const today = new Date().toISOString().split("T")[0];
//       const isPast = dateOnly < today;

//       enriched.push({
//         id: apt.id,
//         patientId: apt.patient_id,      // ✅ ADD
//         doctorId: user.id,              // ✅ ADD
//         patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
//         date: dateOnly,
//         time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
//         type: apt.type,
//         status: apt.status,
//         isPast,
//         notes: apt.notes,
//         videoRoomId: apt.video_room_id,
//         patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,

//       });
//     }

//     setAppointments(enriched);
//   };

//   const filterByStatus = (list: DoctorAppointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter(a => a.status === statusFilter);
//   };

//   const upcoming = filterByStatus(appointments.filter(a => !a.isPast));
//   const past = filterByStatus(appointments.filter(a => a.isPast));



//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

//       <div className="flex gap-3 mb-4">
//         <Button
//           variant={activeTab === "upcoming" ? "doctor" : "outline"}
//           onClick={() => setActiveTab("upcoming")}
//         >
//           Upcoming
//         </Button>
//         <Button
//           variant={activeTab === "past" ? "doctor" : "outline"}
//           onClick={() => setActiveTab("past")}
//         >
//           Past
//         </Button>
//       </div>

//       <div className="flex gap-2 mb-6">
//         {["all", "confirmed", "cancelled"].map(s => (
//           <Button
//             key={s}
//             size="sm"
//             variant={statusFilter === s ? "doctor" : "outline"}
//             onClick={() => setStatusFilter(s as any)}
//           >
//             {s.charAt(0).toUpperCase() + s.slice(1)}
//           </Button>
//         ))}
//       </div>

//       {(activeTab === "upcoming" ? upcoming : past).map(apt => (
//         <DoctorAppointmentCard
//           key={apt.id}
//           appointment={apt}
//           onRefresh={fetchAppointments}
//         />
//       ))}

//       {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
//         <p className="text-muted-foreground">No appointments</p>
//       )}
//     </div>
//   );
// }


// ========================================
// DoctorAppointmentManagement.tsx
// ========================================

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { Button } from "@/components/ui/button";
import VideoMeeting from "../VideoMeeting";
import mixpanelInstance from "@/utils/mixpanel";
import { toast } from "@/hooks/use-toast";

export interface DoctorAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  isPast: boolean;
  status: "confirmed" | "cancelled" | "completed";
  notes?: string;
  videoRoomId?: string;
  patientAvatar?: string | null;
  patientId: string;
  doctorId: string;
}

interface VideoMeetingState {
  showMeeting: boolean;
  meetingId: string;
  patientName: string;
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

  // Video meeting state moved to parent
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    patientName: "",
  });

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  useEffect(() => {
    fetchAppointments();
    // Mixpanel track: Doctor Appointments Page View
    mixpanelInstance.track("Doctor Appointments Page View");
  }, []);

  const fetchAppointments = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, role")
      .eq("user_id", user.id);

    if (!profiles || profiles[0]?.role !== "doctor") return;

    const { data: appts } = await supabase
      .from("appointments")
      .select(
        `
        id,
        patient_id,
        appointment_date,
        time_slot_id,
        type,
        status,
        notes,
        video_room_id
      `
      )
      .eq("doctor_id", user.id)
      .order("appointment_date", { ascending: true });

    if (!appts) return;

    const patientIds = [...new Set(appts.map((a) => a.patient_id))];

    const { data: patients } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, avatar_url")
      .in("user_id", patientIds);

    const patientMap = new Map(
      patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`])
    );
    const patientAvatarMap = new Map(
      patients?.map((p) => [p.user_id, p.avatar_url])
    );

    const enriched: DoctorAppointment[] = [];

    for (const apt of appts) {
      const { data: slot } = await supabase
        .from("time_slots")
        .select("start_time, end_time")
        .eq("id", apt.time_slot_id)
        .single();

      if (!slot) continue;

      // Determine if appointment is past only by date not time
      const dateOnly = apt.appointment_date.split("T")[0];
      const today = new Date().toISOString().split("T")[0];
      const isPast = dateOnly < today;

      enriched.push({
        id: apt.id,
        patientId: apt.patient_id,
        doctorId: user.id,
        patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
        date: dateOnly,
        time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
        type: apt.type,
        status: apt.status,
        isPast,
        notes: apt.notes,
        videoRoomId: apt.video_room_id,
        patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
      });
    }

    setAppointments(enriched);
  };

  const filterByStatus = (list: DoctorAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  };

  // Handle starting video meeting
  const handleJoinVideo = (appointmentId: string) => {
    const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
    if (!appointmentData || !apiKey) {
      toast({ title: "Unable to start video meeting" });
      return;
    }

    if (appointmentData.type !== "teleconsultation") {
      toast({ title: "This appointment is not a teleconsultation" });
      return;
    }

    if (appointmentData.status !== "confirmed") {
      toast({ title: "Only confirmed appointments can be started" });
      return;
    }

    const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;
    const doctorName = localStorage.getItem("doctorName") || "Doctor";

    setVideoMeeting({
      showMeeting: true,
      meetingId: meetingId,
      patientName: appointmentData.patientName,
    });
  };

  const handleLeaveMeeting = () => {
    console.log("Doctor leaving meeting");
    setVideoMeeting({
      showMeeting: false,
      meetingId: "",
      patientName: "",
    });
  };

  const getDoctorDisplayName = () => {
    return localStorage.getItem("doctorName") || "Doctor";
  };

  const upcoming = filterByStatus(appointments.filter((a) => !a.isPast));
  const past = filterByStatus(appointments.filter((a) => a.isPast));

  // Show video meeting in parent component
  if (videoMeeting.showMeeting) {
    return (
      <div className="inset-0 bg-white">
        <VideoMeeting
          isHost={true}
          apiKey={apiKey}
          meetingId={videoMeeting.meetingId}
          name={getDoctorDisplayName()}
          onMeetingLeave={handleLeaveMeeting}
          micEnabled={true}
          webcamEnabled={true}
          containerId="video-container"
          meetingTitle={`Consultation with ${videoMeeting.patientName}`}
        />
      </div>
    );
  }

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
        {["all", "confirmed", "cancelled"].map((s) => (
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

      {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
        <DoctorAppointmentCard
          key={apt.id}
          appointment={apt}
          onRefresh={fetchAppointments}
          onJoinVideo={() => handleJoinVideo(apt.id)}
        />
      ))}

      {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
        <p className="text-muted-foreground">No appointments</p>
      )}
    </div>
  );
}