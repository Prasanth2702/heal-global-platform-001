// // import { useEffect, useState } from "react";
// // import { supabase } from "@/integrations/supabase/client";
// // import DoctorAppointmentCard from "./DoctorAppointmentCard";
// // import { Button } from "@/components/ui/button";

// // export interface DoctorAppointment {
// //   id: string;
// //   patientName: string;
// //   date: string;
// //   time: string;
// //   type: "teleconsultation" | "in_person";
// //   isPast: boolean;
// //   status: "confirmed" | "cancelled" | "completed" ;
// //   notes?: string;
// //   videoRoomId?: string;
// //   patientAvatar?: string | null;
// //   patientId: string;          // ✅ ADD
// //   doctorId: string;           // ✅ ADD
// // }

// // const to12Hour = (time: string) => {
// //   const [h, m] = time.split(":");
// //   const hour = Number(h);
// //   const suffix = hour >= 12 ? "PM" : "AM";
// //   const hour12 = hour % 12 || 12;
// //   return `${hour12}:${m} ${suffix}`;
// // };

// // export default function DoctorAppointmentManagement() {
// //   const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
// //   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
// //   const [statusFilter, setStatusFilter] = useState<
// //     "all" | "confirmed" | "cancelled"
// //   >("all");

// //   useEffect(() => {
// //     fetchAppointments();
// //   }, []);

// //   const fetchAppointments = async () => {
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) return;

// //     const { data: profiles } = await supabase
// //       .from("profiles")
// //       .select("user_id, role")
// //       .eq("user_id", user.id);

// //     if (!profiles || profiles[0]?.role !== "doctor") return;

// //     const { data: appts } = await supabase
// //       .from("appointments")
// //       .select(`
// //         id,
// //         patient_id,
// //         appointment_date,
// //         time_slot_id,
// //         type,
// //         status,
// //         notes,
// //         video_room_id
// //       `)
// //       .eq("doctor_id", user.id)
// //       .order("appointment_date", { ascending: true });

// //     if (!appts) return;

// //     const patientIds = [...new Set(appts.map(a => a.patient_id))];

// //     const { data: patients } = await supabase
// //       .from("profiles")
// //       .select("user_id, first_name, last_name,avatar_url")
// //       .in("user_id", patientIds);

// //     const patientMap = new Map(
// //       patients?.map(p => [p.user_id, `${p.first_name} ${p.last_name}`])
// //     );
// //     const patientAvatarMap = new Map(
// //       patients?.map(p => [p.user_id, p.avatar_url])
// //     );


// //     const enriched: DoctorAppointment[] = [];

// //     for (const apt of appts) {
// //       const { data: slot } = await supabase
// //         .from("time_slots")
// //         .select("start_time, end_time")
// //         .eq("id", apt.time_slot_id)
// //         .single();

// //       if (!slot) continue;

// //       // Determine if appointment is past only by date not time
// //       const dateOnly = apt.appointment_date.split("T")[0];
// //       const today = new Date().toISOString().split("T")[0];
// //       const isPast = dateOnly < today;

// //       enriched.push({
// //         id: apt.id,
// //         patientId: apt.patient_id,      // ✅ ADD
// //         doctorId: user.id,              // ✅ ADD
// //         patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
// //         date: dateOnly,
// //         time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
// //         type: apt.type,
// //         status: apt.status,
// //         isPast,
// //         notes: apt.notes,
// //         videoRoomId: apt.video_room_id,
// //         patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,

// //       });
// //     }

// //     setAppointments(enriched);
// //   };

// //   const filterByStatus = (list: DoctorAppointment[]) => {
// //     if (statusFilter === "all") return list;
// //     return list.filter(a => a.status === statusFilter);
// //   };

// //   const upcoming = filterByStatus(appointments.filter(a => !a.isPast));
// //   const past = filterByStatus(appointments.filter(a => a.isPast));



// //   return (
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

// //       <div className="flex gap-3 mb-4">
// //         <Button
// //           variant={activeTab === "upcoming" ? "doctor" : "outline"}
// //           onClick={() => setActiveTab("upcoming")}
// //         >
// //           Upcoming
// //         </Button>
// //         <Button
// //           variant={activeTab === "past" ? "doctor" : "outline"}
// //           onClick={() => setActiveTab("past")}
// //         >
// //           Past
// //         </Button>
// //       </div>

// //       <div className="flex gap-2 mb-6">
// //         {["all", "confirmed", "cancelled"].map(s => (
// //           <Button
// //             key={s}
// //             size="sm"
// //             variant={statusFilter === s ? "doctor" : "outline"}
// //             onClick={() => setStatusFilter(s as any)}
// //           >
// //             {s.charAt(0).toUpperCase() + s.slice(1)}
// //           </Button>
// //         ))}
// //       </div>

// //       {(activeTab === "upcoming" ? upcoming : past).map(apt => (
// //         <DoctorAppointmentCard
// //           key={apt.id}
// //           appointment={apt}
// //           onRefresh={fetchAppointments}
// //         />
// //       ))}

// //       {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
// //         <p className="text-muted-foreground">No appointments</p>
// //       )}
// //     </div>
// //   );
// // }


// // ========================================
// // DoctorAppointmentManagement.tsx
// // ========================================

// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import DoctorAppointmentCard from "./DoctorAppointmentCard";
// import { Button } from "@/components/ui/button";
// import VideoMeeting from "../VideoMeeting";
// import mixpanelInstance from "@/utils/mixpanel";
// import { toast } from "@/hooks/use-toast";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Filter, Calendar } from "lucide-react";
// import { format } from "date-fns";
// import Loader from "../ui/Loader";

// export interface DoctorAppointment {
//   id: string;
//   patientName: string;
//   date: string;
//   time: string;
//   type: "teleconsultation" | "in_person";
//   isPast: boolean;
//   status: "confirmed" | "cancelled" | "completed";
//   notes?: string;
//   videoRoomId?: string;
//   patientAvatar?: string | null;
//   patientId: string;
//   doctorId: string;
// }

// interface VideoMeetingState {
//   showMeeting: boolean;
//   meetingId: string;
//   patientName: string;
//     appointmentId: string; // Add this

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
//     const [isLoading, setIsLoading] = useState(true);
  
// const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   // Video meeting state moved to parent
//   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
//     showMeeting: false,
//     meetingId: "",
//     patientName: "",
//       appointmentId: "",// Add this

//   });
// const [doctorUserId, setDoctorUserId] = useState<string>("");
// useEffect(() => {
//   const getDoctorId = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       setDoctorUserId(user.id);
//     }
//   };
//   getDoctorId();
// }, []);

//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

//   useEffect(() => {
//     fetchAppointments();
//     // Mixpanel track: Doctor Appointments Page View
//     mixpanelInstance.track("Doctor Appointments Page View");
//   }, []);

//   const fetchAppointments = async () => {
//     setIsLoading(true); // Start loading

//     try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data: profiles } = await supabase
//       .from("profiles")
//       .select("user_id, role")
//       .eq("user_id", user.id);

//     if (!profiles || profiles[0]?.role !== "doctor") return;

//     const { data: appts } = await supabase
//       .from("appointments")
//       .select(
//         `
//         id,
//         patient_id,
//         appointment_date,
//         time_slot_id,
//         type,
//         status,
//         notes,
//         video_room_id
//       `
//       )
//       .eq("doctor_id", user.id)
//       .order("appointment_date", { ascending: true });

//     if (!appts) return;

//     const patientIds = [...new Set(appts.map((a) => a.patient_id))];

//     const { data: patients } = await supabase
//       .from("profiles")
//       .select("user_id, first_name, last_name, avatar_url")
//       .in("user_id", patientIds);

//     const patientMap = new Map(
//       patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`])
//     );
//     const patientAvatarMap = new Map(
//       patients?.map((p) => [p.user_id, p.avatar_url])
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
//         patientId: apt.patient_id,
//         doctorId: user.id,
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
//     } catch (err) {
//       console.error("Error fetching doctor appointments:", err);
//     }finally {
//     setIsLoading(false); // Stop loading
//   }
//   };

//   const filterByStatus = (list: DoctorAppointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter((a) => a.status === statusFilter);
//   };

//   // Handle starting video meeting
//   const handleJoinVideo = (appointmentId: string) => {
//     const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
//     if (!appointmentData || !apiKey) {
//       toast({ title: "Unable to start video meeting" });
//       return;
//     }

//     if (appointmentData.type !== "teleconsultation") {
//       toast({ title: "This appointment is not a teleconsultation" });
//       return;
//     }

//     if (appointmentData.status !== "confirmed") {
//       toast({ title: "Only confirmed appointments can be started" });
//       return;
//     }

//     const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;
//     const doctorName = localStorage.getItem("doctorName") || "Doctor";

//     setVideoMeeting({
//       showMeeting: true,
//       meetingId: meetingId,
//       patientName: appointmentData.patientName,
//     appointmentId: appointmentData.id, // Add this

//     });
//   };

//   const handleLeaveMeeting = () => {
//     console.log("Doctor leaving meeting");
//     setVideoMeeting({
//       showMeeting: false,
//       meetingId: "",
//       patientName: "",
//       appointmentId:"",
//     });
//   };

//   const getDoctorDisplayName = () => {
//     return localStorage.getItem("doctorName") || "Doctor";
//   };

//   // const upcoming = filterByStatus(appointments.filter((a) => !a.isPast));
//   // const past = filterByStatus(appointments.filter((a) => a.isPast));
// const selectedDateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

// const upcoming = filterByStatus(
//   appointments.filter((a) => 
//     !a.isPast && (!selectedDateString || a.date === selectedDateString)
//   )
// );
// const past = filterByStatus(
//   appointments.filter((a) => 
//     a.isPast && (!selectedDateString || a.date === selectedDateString)
//   )
// );
//   // Show video meeting in parent component
//   if (videoMeeting.showMeeting) {
//     return (
//       <div className="inset-0 bg-white">
//         <VideoMeeting
//           isHost={true}
//           apiKey={apiKey}
//           meetingId={videoMeeting.meetingId}
//           name={getDoctorDisplayName()}
//           onMeetingLeave={handleLeaveMeeting}
//           micEnabled={true}
//           webcamEnabled={true}
//           containerId="video-container"
//           meetingTitle={`Consultation with ${videoMeeting.patientName}`}
//           appointmentId={videoMeeting.appointmentId} // Pass appointment ID
// userId={doctorUserId}
//         userRole="doctor" // Set role to doctor
//         enableDocumentSharing={true}
      
//         />
//       </div>
//     );
//   }

//   // return (
//   //   <div className="p-6 max-w-4xl mx-auto">
//   //     <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

//   //     <div className="flex gap-3 mb-4">
//   //       <Button
//   //         variant={activeTab === "upcoming" ? "doctor" : "outline"}
//   //         onClick={() => setActiveTab("upcoming")}
//   //       >
//   //         Upcoming
//   //       </Button>
//   //       <Button
//   //         variant={activeTab === "past" ? "doctor" : "outline"}
//   //         onClick={() => setActiveTab("past")}
//   //       >
//   //         Past
//   //       </Button>
//   //     </div>

//   //     <div className="flex gap-2 mb-6">
//   //       {["all", "confirmed", "cancelled"].map((s) => (
//   //         <Button
//   //           key={s}
//   //           size="sm"
//   //           variant={statusFilter === s ? "doctor" : "outline"}
//   //           onClick={() => setStatusFilter(s as any)}
//   //         >
//   //           {s.charAt(0).toUpperCase() + s.slice(1)}
//   //         </Button>
//   //       ))}
//   //     </div>

//   //     {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
//   //       <DoctorAppointmentCard
//   //         key={apt.id}
//   //         appointment={apt}
//   //         onRefresh={fetchAppointments}
//   //         onJoinVideo={() => handleJoinVideo(apt.id)}
//   //       />
//   //     ))}

//   //     {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
//   //       <p className="text-muted-foreground">No appointments</p>
//   //     )}
//   //   </div>
//   // );
// return (
//   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//     <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
//       {/* Header Section */}
//       <div className="mb-8">
//         <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//           My Appointments
//         </h2>
//         <p className="text-gray-500 mt-2 text-sm md:text-base">
//           Manage and track all your patient appointments
//         </p>
//       </div>

//       {/* Main Grid - Calendar on Left, Appointments on Right */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
//         {/* Left Column - Calendar */}
//         <div className="lg:col-span-1 order-1 lg:order-1">
//           <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//             <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
//               <CardTitle className="flex items-center gap-2 text-gray-700">
//                 <Filter className="h-5 w-5 text-blue-500" />
//                 Quick Filters
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 p-4 md:p-6">
//               <div className="space-y-3">
//                 <label className="text-gray-600 font-semibold text-sm">Select Date</label>
//                 <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
//                   <CalendarComponent
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => setSelectedDate(date)}
//                     initialFocus
//                     className="w-full"
//                   />
//                 </div>
//                 {selectedDate && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setSelectedDate(undefined)}
//                     className="w-full mt-2 text-gray-500 hover:text-gray-700"
//                   >
//                     Clear Filter
//                   </Button>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Appointments Content */}
//         <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          
//           {/* Main Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
//             <div className="flex gap-2 md:gap-3">
//               <Button
//                 variant={activeTab === "upcoming" ? "default" : "outline"}
//                 onClick={() => setActiveTab("upcoming")}
//                 className={`flex-1 md:flex-none transition-all duration-200 ${
//                   activeTab === "upcoming" 
//                     ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" 
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 Upcoming ({upcoming.length})
//               </Button>
//               <Button
//                 variant={activeTab === "past" ? "default" : "outline"}
//                 onClick={() => setActiveTab("past")}
//                 className={`flex-1 md:flex-none transition-all duration-200 ${
//                   activeTab === "past" 
//                     ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" 
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 Past ({past.length})
//               </Button>
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div className="flex flex-wrap gap-2">
//             {["all", "confirmed", "cancelled"].map((s) => (
//               <Button
//                 key={s}
//                 size="sm"
//                 variant={statusFilter === s ? "default" : "outline"}
//                 onClick={() => setStatusFilter(s as any)}
//                 className={`transition-all duration-200 ${
//                   statusFilter === s ? "shadow-md" : "hover:bg-gray-50"
//                 }`}
//               >
//                 {s.charAt(0).toUpperCase() + s.slice(1)}
//               </Button>
//             ))}
//           </div>

//           {/* Appointments List */}
//           <div className="space-y-4">
        
//             {(activeTab === "upcoming" ? upcoming : past).length > 0 ? (
//               (activeTab === "upcoming" ? upcoming : past).map((apt) => (
//                 <DoctorAppointmentCard
//                   key={apt.id}
//                   appointment={apt}
//                   onRefresh={fetchAppointments}
//                   onJoinVideo={() => handleJoinVideo(apt.id)}
//                 />
//               ))
//             ) : (
//               <>
//                                   {isLoading ? (
//       <div className="flex justify-center items-center py-12">
//         <Loader />
//       </div>
//     ) :(
      
//               <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//                 <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-500 font-medium">No appointments found</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
//                 </p>
//               </div>
            
//     )}
//     </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// }

// ========================================
// DoctorAppointmentManagement.tsx - Final
// ========================================

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { Button } from "@/components/ui/button";
import VideoMeeting from "../VideoMeeting";
import mixpanelInstance from "@/utils/mixpanel";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Calendar } from "lucide-react";
import { format } from "date-fns";
import Loader from "../ui/Loader";

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
  appointmentId: string;
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
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    patientName: "",
    appointmentId: "",
  });
  const [doctorUserId, setDoctorUserId] = useState<string>("");
  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  useEffect(() => {
    const getDoctorId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setDoctorUserId(user.id);
    };
    getDoctorId();
    fetchAppointments();
    mixpanelInstance.track("Doctor Appointments Page View");
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
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

      const patientIds = [...new Set(appts.map((a) => a.patient_id))];
      const { data: patients } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", patientIds);

      const patientMap = new Map(patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`]));
      const patientAvatarMap = new Map(patients?.map((p) => [p.user_id, p.avatar_url]));

      const enriched: DoctorAppointment[] = [];
      for (const apt of appts) {
        const { data: slot } = await supabase
          .from("time_slots")
          .select("start_time, end_time")
          .eq("id", apt.time_slot_id)
          .single();
        if (!slot) continue;

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
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByStatus = (list: DoctorAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  };

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
    setVideoMeeting({
      showMeeting: true,
      meetingId,
      patientName: appointmentData.patientName,
      appointmentId: appointmentData.id,
    });
  };

  const handleLeaveMeeting = () => {
    setVideoMeeting({ showMeeting: false, meetingId: "", patientName: "", appointmentId: "" });
  };

  const getDoctorDisplayName = () => localStorage.getItem("doctorName") || "Doctor";

  const selectedDateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const upcoming = filterByStatus(
    appointments.filter((a) => !a.isPast && (!selectedDateString || a.date === selectedDateString))
  );
  const past = filterByStatus(
    appointments.filter((a) => a.isPast && (!selectedDateString || a.date === selectedDateString))
  );

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
          appointmentId={videoMeeting.appointmentId}
          userId={doctorUserId}
          userRole="doctor"
          enableDocumentSharing={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            My Appointments
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Manage and track all your patient appointments
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Calendar Card */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <Filter className="h-5 w-5 text-blue-500" />
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="space-y-3">
                  <label className="text-gray-600 font-semibold text-sm">Select Date</label>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="w-full"
                    />
                  </div>
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                      className="w-full mt-2 text-gray-500 hover:text-gray-700"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex gap-2 md:gap-3">
                <Button
                  variant={activeTab === "upcoming" ? "default" : "outline"}
                  onClick={() => setActiveTab("upcoming")}
                  className={`flex-1 md:flex-none transition-all duration-200 ${
                    activeTab === "upcoming" ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" : "hover:bg-gray-50"
                  }`}
                >
                  Upcoming ({upcoming.length})
                </Button>
                <Button
                  variant={activeTab === "past" ? "default" : "outline"}
                  onClick={() => setActiveTab("past")}
                  className={`flex-1 md:flex-none transition-all duration-200 ${
                    activeTab === "past" ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" : "hover:bg-gray-50"
                  }`}
                >
                  Past ({past.length})
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "confirmed", "cancelled"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "default" : "outline"}
                  onClick={() => setStatusFilter(s as any)}
                  className={`transition-all duration-200 ${statusFilter === s ? "shadow-md" : "hover:bg-gray-50"}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader />
                </div>
              ) : (activeTab === "upcoming" ? upcoming : past).length > 0 ? (
                (activeTab === "upcoming" ? upcoming : past).map((apt) => (
                  <DoctorAppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onRefresh={fetchAppointments}
                    onJoinVideo={() => handleJoinVideo(apt.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No appointments found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}