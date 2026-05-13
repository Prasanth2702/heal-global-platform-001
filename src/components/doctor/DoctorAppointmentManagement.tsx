// // // // import { useEffect, useState } from "react";
// // // // import { supabase } from "@/integrations/supabase/client";
// // // // import DoctorAppointmentCard from "./DoctorAppointmentCard";
// // // // import { Button } from "@/components/ui/button";

// // // // export interface DoctorAppointment {
// // // //   id: string;
// // // //   patientName: string;
// // // //   date: string;
// // // //   time: string;
// // // //   type: "teleconsultation" | "in_person";
// // // //   isPast: boolean;
// // // //   status: "confirmed" | "cancelled" | "completed" ;
// // // //   notes?: string;
// // // //   videoRoomId?: string;
// // // //   patientAvatar?: string | null;
// // // //   patientId: string;          // ✅ ADD
// // // //   doctorId: string;           // ✅ ADD
// // // // }

// // // // const to12Hour = (time: string) => {
// // // //   const [h, m] = time.split(":");
// // // //   const hour = Number(h);
// // // //   const suffix = hour >= 12 ? "PM" : "AM";
// // // //   const hour12 = hour % 12 || 12;
// // // //   return `${hour12}:${m} ${suffix}`;
// // // // };

// // // // export default function DoctorAppointmentManagement() {
// // // //   const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
// // // //   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
// // // //   const [statusFilter, setStatusFilter] = useState<
// // // //     "all" | "confirmed" | "cancelled"
// // // //   >("all");

// // // //   useEffect(() => {
// // // //     fetchAppointments();
// // // //   }, []);

// // // //   const fetchAppointments = async () => {
// // // //     const { data: { user } } = await supabase.auth.getUser();
// // // //     if (!user) return;

// // // //     const { data: profiles } = await supabase
// // // //       .from("profiles")
// // // //       .select("user_id, role")
// // // //       .eq("user_id", user.id);

// // // //     if (!profiles || profiles[0]?.role !== "doctor") return;

// // // //     const { data: appts } = await supabase
// // // //       .from("appointments")
// // // //       .select(`
// // // //         id,
// // // //         patient_id,
// // // //         appointment_date,
// // // //         time_slot_id,
// // // //         type,
// // // //         status,
// // // //         notes,
// // // //         video_room_id
// // // //       `)
// // // //       .eq("doctor_id", user.id)
// // // //       .order("appointment_date", { ascending: true });

// // // //     if (!appts) return;

// // // //     const patientIds = [...new Set(appts.map(a => a.patient_id))];

// // // //     const { data: patients } = await supabase
// // // //       .from("profiles")
// // // //       .select("user_id, first_name, last_name,avatar_url")
// // // //       .in("user_id", patientIds);

// // // //     const patientMap = new Map(
// // // //       patients?.map(p => [p.user_id, `${p.first_name} ${p.last_name}`])
// // // //     );
// // // //     const patientAvatarMap = new Map(
// // // //       patients?.map(p => [p.user_id, p.avatar_url])
// // // //     );


// // // //     const enriched: DoctorAppointment[] = [];

// // // //     for (const apt of appts) {
// // // //       const { data: slot } = await supabase
// // // //         .from("time_slots")
// // // //         .select("start_time, end_time")
// // // //         .eq("id", apt.time_slot_id)
// // // //         .single();

// // // //       if (!slot) continue;

// // // //       // Determine if appointment is past only by date not time
// // // //       const dateOnly = apt.appointment_date.split("T")[0];
// // // //       const today = new Date().toISOString().split("T")[0];
// // // //       const isPast = dateOnly < today;

// // // //       enriched.push({
// // // //         id: apt.id,
// // // //         patientId: apt.patient_id,      // ✅ ADD
// // // //         doctorId: user.id,              // ✅ ADD
// // // //         patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
// // // //         date: dateOnly,
// // // //         time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
// // // //         type: apt.type,
// // // //         status: apt.status,
// // // //         isPast,
// // // //         notes: apt.notes,
// // // //         videoRoomId: apt.video_room_id,
// // // //         patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,

// // // //       });
// // // //     }

// // // //     setAppointments(enriched);
// // // //   };

// // // //   const filterByStatus = (list: DoctorAppointment[]) => {
// // // //     if (statusFilter === "all") return list;
// // // //     return list.filter(a => a.status === statusFilter);
// // // //   };

// // // //   const upcoming = filterByStatus(appointments.filter(a => !a.isPast));
// // // //   const past = filterByStatus(appointments.filter(a => a.isPast));



// // // //   return (
// // // //     <div className="p-6 max-w-4xl mx-auto">
// // // //       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

// // // //       <div className="flex gap-3 mb-4">
// // // //         <Button
// // // //           variant={activeTab === "upcoming" ? "doctor" : "outline"}
// // // //           onClick={() => setActiveTab("upcoming")}
// // // //         >
// // // //           Upcoming
// // // //         </Button>
// // // //         <Button
// // // //           variant={activeTab === "past" ? "doctor" : "outline"}
// // // //           onClick={() => setActiveTab("past")}
// // // //         >
// // // //           Past
// // // //         </Button>
// // // //       </div>

// // // //       <div className="flex gap-2 mb-6">
// // // //         {["all", "confirmed", "cancelled"].map(s => (
// // // //           <Button
// // // //             key={s}
// // // //             size="sm"
// // // //             variant={statusFilter === s ? "doctor" : "outline"}
// // // //             onClick={() => setStatusFilter(s as any)}
// // // //           >
// // // //             {s.charAt(0).toUpperCase() + s.slice(1)}
// // // //           </Button>
// // // //         ))}
// // // //       </div>

// // // //       {(activeTab === "upcoming" ? upcoming : past).map(apt => (
// // // //         <DoctorAppointmentCard
// // // //           key={apt.id}
// // // //           appointment={apt}
// // // //           onRefresh={fetchAppointments}
// // // //         />
// // // //       ))}

// // // //       {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
// // // //         <p className="text-muted-foreground">No appointments</p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // // ========================================
// // // // DoctorAppointmentManagement.tsx
// // // // ========================================

// // // import { useEffect, useState } from "react";
// // // import { supabase } from "@/integrations/supabase/client";
// // // import DoctorAppointmentCard from "./DoctorAppointmentCard";
// // // import { Button } from "@/components/ui/button";
// // // import VideoMeeting from "../VideoMeeting";
// // // import mixpanelInstance from "@/utils/mixpanel";
// // // import { toast } from "@/hooks/use-toast";
// // // import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Filter, Calendar } from "lucide-react";
// // // import { format } from "date-fns";
// // // import Loader from "../ui/Loader";

// // // export interface DoctorAppointment {
// // //   id: string;
// // //   patientName: string;
// // //   date: string;
// // //   time: string;
// // //   type: "teleconsultation" | "in_person";
// // //   isPast: boolean;
// // //   status: "confirmed" | "cancelled" | "completed";
// // //   notes?: string;
// // //   videoRoomId?: string;
// // //   patientAvatar?: string | null;
// // //   patientId: string;
// // //   doctorId: string;
// // // }

// // // interface VideoMeetingState {
// // //   showMeeting: boolean;
// // //   meetingId: string;
// // //   patientName: string;
// // //     appointmentId: string; // Add this

// // // }

// // // const to12Hour = (time: string) => {
// // //   const [h, m] = time.split(":");
// // //   const hour = Number(h);
// // //   const suffix = hour >= 12 ? "PM" : "AM";
// // //   const hour12 = hour % 12 || 12;
// // //   return `${hour12}:${m} ${suffix}`;
// // // };

// // // export default function DoctorAppointmentManagement() {
// // //   const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
// // //   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
// // //   const [statusFilter, setStatusFilter] = useState<
// // //     "all" | "confirmed" | "cancelled"
// // //   >("all");
// // //     const [isLoading, setIsLoading] = useState(true);
  
// // // const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
// // //   // Video meeting state moved to parent
// // //   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
// // //     showMeeting: false,
// // //     meetingId: "",
// // //     patientName: "",
// // //       appointmentId: "",// Add this

// // //   });
// // // const [doctorUserId, setDoctorUserId] = useState<string>("");
// // // useEffect(() => {
// // //   const getDoctorId = async () => {
// // //     const { data: { user } } = await supabase.auth.getUser();
// // //     if (user) {
// // //       setDoctorUserId(user.id);
// // //     }
// // //   };
// // //   getDoctorId();
// // // }, []);

// // //   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

// // //   useEffect(() => {
// // //     fetchAppointments();
// // //     // Mixpanel track: Doctor Appointments Page View
// // //     mixpanelInstance.track("Doctor Appointments Page View");
// // //   }, []);

// // //   const fetchAppointments = async () => {
// // //     setIsLoading(true); // Start loading

// // //     try {
// // //     const {
// // //       data: { user },
// // //     } = await supabase.auth.getUser();
// // //     if (!user) return;

// // //     const { data: profiles } = await supabase
// // //       .from("profiles")
// // //       .select("user_id, role")
// // //       .eq("user_id", user.id);

// // //     if (!profiles || profiles[0]?.role !== "doctor") return;

// // //     const { data: appts } = await supabase
// // //       .from("appointments")
// // //       .select(
// // //         `
// // //         id,
// // //         patient_id,
// // //         appointment_date,
// // //         time_slot_id,
// // //         type,
// // //         status,
// // //         notes,
// // //         video_room_id
// // //       `
// // //       )
// // //       .eq("doctor_id", user.id)
// // //       .order("appointment_date", { ascending: true });

// // //     if (!appts) return;

// // //     const patientIds = [...new Set(appts.map((a) => a.patient_id))];

// // //     const { data: patients } = await supabase
// // //       .from("profiles")
// // //       .select("user_id, first_name, last_name, avatar_url")
// // //       .in("user_id", patientIds);

// // //     const patientMap = new Map(
// // //       patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`])
// // //     );
// // //     const patientAvatarMap = new Map(
// // //       patients?.map((p) => [p.user_id, p.avatar_url])
// // //     );

// // //     const enriched: DoctorAppointment[] = [];

// // //     for (const apt of appts) {
// // //       const { data: slot } = await supabase
// // //         .from("time_slots")
// // //         .select("start_time, end_time")
// // //         .eq("id", apt.time_slot_id)
// // //         .single();

// // //       if (!slot) continue;

// // //       // Determine if appointment is past only by date not time
// // //       const dateOnly = apt.appointment_date.split("T")[0];
// // //       const today = new Date().toISOString().split("T")[0];
// // //       const isPast = dateOnly < today;

// // //       enriched.push({
// // //         id: apt.id,
// // //         patientId: apt.patient_id,
// // //         doctorId: user.id,
// // //         patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
// // //         date: dateOnly,
// // //         time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
// // //         type: apt.type,
// // //         status: apt.status,
// // //         isPast,
// // //         notes: apt.notes,
// // //         videoRoomId: apt.video_room_id,
// // //         patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
// // //       });
// // //     }

// // //     setAppointments(enriched);
// // //     } catch (err) {
// // //       console.error("Error fetching doctor appointments:", err);
// // //     }finally {
// // //     setIsLoading(false); // Stop loading
// // //   }
// // //   };

// // //   const filterByStatus = (list: DoctorAppointment[]) => {
// // //     if (statusFilter === "all") return list;
// // //     return list.filter((a) => a.status === statusFilter);
// // //   };

// // //   // Handle starting video meeting
// // //   const handleJoinVideo = (appointmentId: string) => {
// // //     const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
// // //     if (!appointmentData || !apiKey) {
// // //       toast({ title: "Unable to start video meeting" });
// // //       return;
// // //     }

// // //     if (appointmentData.type !== "teleconsultation") {
// // //       toast({ title: "This appointment is not a teleconsultation" });
// // //       return;
// // //     }

// // //     if (appointmentData.status !== "confirmed") {
// // //       toast({ title: "Only confirmed appointments can be started" });
// // //       return;
// // //     }

// // //     const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;
// // //     const doctorName = localStorage.getItem("doctorName") || "Doctor";

// // //     setVideoMeeting({
// // //       showMeeting: true,
// // //       meetingId: meetingId,
// // //       patientName: appointmentData.patientName,
// // //     appointmentId: appointmentData.id, // Add this

// // //     });
// // //   };

// // //   const handleLeaveMeeting = () => {
// // //     console.log("Doctor leaving meeting");
// // //     setVideoMeeting({
// // //       showMeeting: false,
// // //       meetingId: "",
// // //       patientName: "",
// // //       appointmentId:"",
// // //     });
// // //   };

// // //   const getDoctorDisplayName = () => {
// // //     return localStorage.getItem("doctorName") || "Doctor";
// // //   };

// // //   // const upcoming = filterByStatus(appointments.filter((a) => !a.isPast));
// // //   // const past = filterByStatus(appointments.filter((a) => a.isPast));
// // // const selectedDateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

// // // const upcoming = filterByStatus(
// // //   appointments.filter((a) => 
// // //     !a.isPast && (!selectedDateString || a.date === selectedDateString)
// // //   )
// // // );
// // // const past = filterByStatus(
// // //   appointments.filter((a) => 
// // //     a.isPast && (!selectedDateString || a.date === selectedDateString)
// // //   )
// // // );
// // //   // Show video meeting in parent component
// // //   if (videoMeeting.showMeeting) {
// // //     return (
// // //       <div className="inset-0 bg-white">
// // //         <VideoMeeting
// // //           isHost={true}
// // //           apiKey={apiKey}
// // //           meetingId={videoMeeting.meetingId}
// // //           name={getDoctorDisplayName()}
// // //           onMeetingLeave={handleLeaveMeeting}
// // //           micEnabled={true}
// // //           webcamEnabled={true}
// // //           containerId="video-container"
// // //           meetingTitle={`Consultation with ${videoMeeting.patientName}`}
// // //           appointmentId={videoMeeting.appointmentId} // Pass appointment ID
// // // userId={doctorUserId}
// // //         userRole="doctor" // Set role to doctor
// // //         enableDocumentSharing={true}
      
// // //         />
// // //       </div>
// // //     );
// // //   }

// // //   // return (
// // //   //   <div className="p-6 max-w-4xl mx-auto">
// // //   //     <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

// // //   //     <div className="flex gap-3 mb-4">
// // //   //       <Button
// // //   //         variant={activeTab === "upcoming" ? "doctor" : "outline"}
// // //   //         onClick={() => setActiveTab("upcoming")}
// // //   //       >
// // //   //         Upcoming
// // //   //       </Button>
// // //   //       <Button
// // //   //         variant={activeTab === "past" ? "doctor" : "outline"}
// // //   //         onClick={() => setActiveTab("past")}
// // //   //       >
// // //   //         Past
// // //   //       </Button>
// // //   //     </div>

// // //   //     <div className="flex gap-2 mb-6">
// // //   //       {["all", "confirmed", "cancelled"].map((s) => (
// // //   //         <Button
// // //   //           key={s}
// // //   //           size="sm"
// // //   //           variant={statusFilter === s ? "doctor" : "outline"}
// // //   //           onClick={() => setStatusFilter(s as any)}
// // //   //         >
// // //   //           {s.charAt(0).toUpperCase() + s.slice(1)}
// // //   //         </Button>
// // //   //       ))}
// // //   //     </div>

// // //   //     {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
// // //   //       <DoctorAppointmentCard
// // //   //         key={apt.id}
// // //   //         appointment={apt}
// // //   //         onRefresh={fetchAppointments}
// // //   //         onJoinVideo={() => handleJoinVideo(apt.id)}
// // //   //       />
// // //   //     ))}

// // //   //     {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
// // //   //       <p className="text-muted-foreground">No appointments</p>
// // //   //     )}
// // //   //   </div>
// // //   // );
// // // return (
// // //   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// // //     <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
// // //       {/* Header Section */}
// // //       <div className="mb-8">
// // //         <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
// // //           My Appointments
// // //         </h2>
// // //         <p className="text-gray-500 mt-2 text-sm md:text-base">
// // //           Manage and track all your patient appointments
// // //         </p>
// // //       </div>

// // //       {/* Main Grid - Calendar on Left, Appointments on Right */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
// // //         {/* Left Column - Calendar */}
// // //         <div className="lg:col-span-1 order-1 lg:order-1">
// // //           <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
// // //             <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
// // //               <CardTitle className="flex items-center gap-2 text-gray-700">
// // //                 <Filter className="h-5 w-5 text-blue-500" />
// // //                 Quick Filters
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4 p-4 md:p-6">
// // //               <div className="space-y-3">
// // //                 <label className="text-gray-600 font-semibold text-sm">Select Date</label>
// // //                 <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
// // //                   <CalendarComponent
// // //                     mode="single"
// // //                     selected={selectedDate}
// // //                     onSelect={(date) => setSelectedDate(date)}
// // //                     initialFocus
// // //                     className="w-full"
// // //                   />
// // //                 </div>
// // //                 {selectedDate && (
// // //                   <Button
// // //                     variant="ghost"
// // //                     size="sm"
// // //                     onClick={() => setSelectedDate(undefined)}
// // //                     className="w-full mt-2 text-gray-500 hover:text-gray-700"
// // //                   >
// // //                     Clear Filter
// // //                   </Button>
// // //                 )}
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         </div>

// // //         {/* Right Column - Appointments Content */}
// // //         <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          
// // //           {/* Main Tabs */}
// // //           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
// // //             <div className="flex gap-2 md:gap-3">
// // //               <Button
// // //                 variant={activeTab === "upcoming" ? "default" : "outline"}
// // //                 onClick={() => setActiveTab("upcoming")}
// // //                 className={`flex-1 md:flex-none transition-all duration-200 ${
// // //                   activeTab === "upcoming" 
// // //                     ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" 
// // //                     : "hover:bg-gray-50"
// // //                 }`}
// // //               >
// // //                 Upcoming ({upcoming.length})
// // //               </Button>
// // //               <Button
// // //                 variant={activeTab === "past" ? "default" : "outline"}
// // //                 onClick={() => setActiveTab("past")}
// // //                 className={`flex-1 md:flex-none transition-all duration-200 ${
// // //                   activeTab === "past" 
// // //                     ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" 
// // //                     : "hover:bg-gray-50"
// // //                 }`}
// // //               >
// // //                 Past ({past.length})
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* Status Filter */}
// // //           <div className="flex flex-wrap gap-2">
// // //             {["all", "confirmed", "cancelled"].map((s) => (
// // //               <Button
// // //                 key={s}
// // //                 size="sm"
// // //                 variant={statusFilter === s ? "default" : "outline"}
// // //                 onClick={() => setStatusFilter(s as any)}
// // //                 className={`transition-all duration-200 ${
// // //                   statusFilter === s ? "shadow-md" : "hover:bg-gray-50"
// // //                 }`}
// // //               >
// // //                 {s.charAt(0).toUpperCase() + s.slice(1)}
// // //               </Button>
// // //             ))}
// // //           </div>

// // //           {/* Appointments List */}
// // //           <div className="space-y-4">
        
// // //             {(activeTab === "upcoming" ? upcoming : past).length > 0 ? (
// // //               (activeTab === "upcoming" ? upcoming : past).map((apt) => (
// // //                 <DoctorAppointmentCard
// // //                   key={apt.id}
// // //                   appointment={apt}
// // //                   onRefresh={fetchAppointments}
// // //                   onJoinVideo={() => handleJoinVideo(apt.id)}
// // //                 />
// // //               ))
// // //             ) : (
// // //               <>
// // //                                   {isLoading ? (
// // //       <div className="flex justify-center items-center py-12">
// // //         <Loader />
// // //       </div>
// // //     ) :(
      
// // //               <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
// // //                 <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// // //                 <p className="text-gray-500 font-medium">No appointments found</p>
// // //                 <p className="text-sm text-gray-400 mt-1">
// // //                   {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
// // //                 </p>
// // //               </div>
            
// // //     )}
// // //     </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // }

// // // ========================================
// // // DoctorAppointmentManagement.tsx - Final
// // // ========================================

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/integrations/supabase/client";
// // import DoctorAppointmentCard from "./DoctorAppointmentCard";
// // import { Button } from "@/components/ui/button";
// // import VideoMeeting from "../VideoMeeting";
// // import mixpanelInstance from "@/utils/mixpanel";
// // import { toast } from "@/hooks/use-toast";
// // import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Filter, Calendar } from "lucide-react";
// // import { format } from "date-fns";
// // import Loader from "../ui/Loader";

// // export interface DoctorAppointment {
// //   id: string;
// //   patientName: string;
// //   date: string;
// //   time: string;
// //   type: "teleconsultation" | "in_person";
// //   isPast: boolean;
// //   status: "confirmed" | "cancelled" | "completed";
// //   notes?: string;
// //   videoRoomId?: string;
// //   patientAvatar?: string | null;
// //   patientId: string;
// //   doctorId: string;
// // }

// // interface VideoMeetingState {
// //   showMeeting: boolean;
// //   meetingId: string;
// //   patientName: string;
// //   appointmentId: string;
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
// //   const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
// //   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
// //     showMeeting: false,
// //     meetingId: "",
// //     patientName: "",
// //     appointmentId: "",
// //   });
// //   const [doctorUserId, setDoctorUserId] = useState<string>("");
// //   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

// //   useEffect(() => {
// //     const getDoctorId = async () => {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (user) setDoctorUserId(user.id);
// //     };
// //     getDoctorId();
// //     fetchAppointments();
// //     mixpanelInstance.track("Doctor Appointments Page View");
// //   }, []);

// //   const fetchAppointments = async () => {
// //     setIsLoading(true);
// //     try {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) return;

// //       const { data: profiles } = await supabase
// //         .from("profiles")
// //         .select("user_id, role")
// //         .eq("user_id", user.id);
// //       if (!profiles || profiles[0]?.role !== "doctor") return;

// //       const { data: appts } = await supabase
// //         .from("appointments")
// //         .select(`
// //           id,
// //           patient_id,
// //           appointment_date,
// //           time_slot_id,
// //           type,
// //           status,
// //           notes,
// //           video_room_id
// //         `)
// //         .eq("doctor_id", user.id)
// //         .order("appointment_date", { ascending: true });

// //       if (!appts) return;

// //       const patientIds = [...new Set(appts.map((a) => a.patient_id))];
// //       const { data: patients } = await supabase
// //         .from("profiles")
// //         .select("user_id, first_name, last_name, avatar_url")
// //         .in("user_id", patientIds);

// //       const patientMap = new Map(patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`]));
// //       const patientAvatarMap = new Map(patients?.map((p) => [p.user_id, p.avatar_url]));

// //       const enriched: DoctorAppointment[] = [];
// //       for (const apt of appts) {
// //         const { data: slot } = await supabase
// //           .from("time_slots")
// //           .select("start_time, end_time")
// //           .eq("id", apt.time_slot_id)
// //           .single();
// //         if (!slot) continue;

// //         const dateOnly = apt.appointment_date.split("T")[0];
// //         const today = new Date().toISOString().split("T")[0];
// //         const isPast = dateOnly < today;

// //         enriched.push({
// //           id: apt.id,
// //           patientId: apt.patient_id,
// //           doctorId: user.id,
// //           patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
// //           date: dateOnly,
// //           time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
// //           type: apt.type,
// //           status: apt.status,
// //           isPast,
// //           notes: apt.notes,
// //           videoRoomId: apt.video_room_id,
// //           patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
// //         });
// //       }
// //       setAppointments(enriched);
// //     } catch (err) {
// //       console.error("Error fetching doctor appointments:", err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const filterByStatus = (list: DoctorAppointment[]) => {
// //     if (statusFilter === "all") return list;
// //     return list.filter((a) => a.status === statusFilter);
// //   };

// //   const handleJoinVideo = (appointmentId: string) => {
// //     const appointmentData = appointments.find((apt) => apt.id === appointmentId);
// //     if (!appointmentData || !apiKey) {
// //       toast({ title: "Unable to start video meeting" });
// //       return;
// //     }
// //     if (appointmentData.type !== "teleconsultation") {
// //       toast({ title: "This appointment is not a teleconsultation" });
// //       return;
// //     }
// //     if (appointmentData.status !== "confirmed") {
// //       toast({ title: "Only confirmed appointments can be started" });
// //       return;
// //     }
// //     const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;
// //     setVideoMeeting({
// //       showMeeting: true,
// //       meetingId,
// //       patientName: appointmentData.patientName,
// //       appointmentId: appointmentData.id,
// //     });
// //   };

// //   const handleLeaveMeeting = () => {
// //     setVideoMeeting({ showMeeting: false, meetingId: "", patientName: "", appointmentId: "" });
// //   };

// //   const getDoctorDisplayName = () => localStorage.getItem("doctorName") || "Doctor";

// //   const selectedDateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
// //   const upcoming = filterByStatus(
// //     appointments.filter((a) => !a.isPast && (!selectedDateString || a.date === selectedDateString))
// //   );
// //   const past = filterByStatus(
// //     appointments.filter((a) => a.isPast && (!selectedDateString || a.date === selectedDateString))
// //   );

// //   if (videoMeeting.showMeeting) {
// //     return (
// //       <div className="inset-0 bg-white">
// //         <VideoMeeting
// //           isHost={true}
// //           apiKey={apiKey}
// //           meetingId={videoMeeting.meetingId}
// //           name={getDoctorDisplayName()}
// //           onMeetingLeave={handleLeaveMeeting}
// //           micEnabled={true}
// //           webcamEnabled={true}
// //           containerId="video-container"
// //           meetingTitle={`Consultation with ${videoMeeting.patientName}`}
// //           appointmentId={videoMeeting.appointmentId}
// //           userId={doctorUserId}
// //           userRole="doctor"
// //           enableDocumentSharing={true}
// //         />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// //       <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
// //             My Appointments
// //           </h2>
// //           <p className="text-gray-500 mt-2 text-sm md:text-base">
// //             Manage and track all your patient appointments
// //           </p>
// //         </div>

// //         {/* Main Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
// //           {/* Calendar Card */}
// //           <div className="lg:col-span-1 order-1 lg:order-1">
// //             <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
// //               <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
// //                 <CardTitle className="flex items-center gap-2 text-gray-700">
// //                   <Filter className="h-5 w-5 text-blue-500" />
// //                   Quick Filters
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4 p-4 md:p-6">
// //                 <div className="space-y-3">
// //                   <label className="text-gray-600 font-semibold text-sm">Select Date</label>
// //                   <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
// //                     <CalendarComponent
// //                       mode="single"
// //                       selected={selectedDate}
// //                       onSelect={setSelectedDate}
// //                       initialFocus
// //                       className="w-full"
// //                     />
// //                   </div>
// //                   {selectedDate && (
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       onClick={() => setSelectedDate(undefined)}
// //                       className="w-full mt-2 text-gray-500 hover:text-gray-700"
// //                     >
// //                       Clear Filter
// //                     </Button>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Appointments List */}
// //           <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
// //             {/* Tabs */}
// //             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
// //               <div className="flex gap-2 md:gap-3">
// //                 <Button
// //                   variant={activeTab === "upcoming" ? "default" : "outline"}
// //                   onClick={() => setActiveTab("upcoming")}
// //                   className={`flex-1 md:flex-none transition-all duration-200 ${
// //                     activeTab === "upcoming" ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" : "hover:bg-gray-50"
// //                   }`}
// //                 >
// //                   Upcoming ({upcoming.length})
// //                 </Button>
// //                 <Button
// //                   variant={activeTab === "past" ? "default" : "outline"}
// //                   onClick={() => setActiveTab("past")}
// //                   className={`flex-1 md:flex-none transition-all duration-200 ${
// //                     activeTab === "past" ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" : "hover:bg-gray-50"
// //                   }`}
// //                 >
// //                   Past ({past.length})
// //                 </Button>
// //               </div>
// //             </div>

// //             {/* Status Filter */}
// //             <div className="flex flex-wrap gap-2">
// //               {["all", "confirmed", "cancelled"].map((s) => (
// //                 <Button
// //                   key={s}
// //                   size="sm"
// //                   variant={statusFilter === s ? "default" : "outline"}
// //                   onClick={() => setStatusFilter(s as any)}
// //                   className={`transition-all duration-200 ${statusFilter === s ? "shadow-md" : "hover:bg-gray-50"}`}
// //                 >
// //                   {s.charAt(0).toUpperCase() + s.slice(1)}
// //                 </Button>
// //               ))}
// //             </div>

// //             {/* Appointments List */}
// //             <div className="space-y-4">
// //               {isLoading ? (
// //                 <div className="flex justify-center items-center py-12">
// //                   <Loader />
// //                 </div>
// //               ) : (activeTab === "upcoming" ? upcoming : past).length > 0 ? (
// //                 (activeTab === "upcoming" ? upcoming : past).map((apt) => (
// //                   <DoctorAppointmentCard
// //                     key={apt.id}
// //                     appointment={apt}
// //                     onRefresh={fetchAppointments}
// //                     onJoinVideo={() => handleJoinVideo(apt.id)}
// //                   />
// //                 ))
// //               ) : (
// //                 <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
// //                   <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                   <p className="text-gray-500 font-medium">No appointments found</p>
// //                   <p className="text-sm text-gray-400 mt-1">
// //                     {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // ========================================
// // DoctorAppointmentManagement.tsx - Final
// // Responsive text sizes + calendar auto-tab
// // ========================================

// import { useEffect, useRef, useState } from "react";
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
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Link } from "react-router-dom";
// import { Eye } from "lucide-react";
// // ------------------------
// // Device Detection Hook
// // ------------------------
// const useDeviceType = () => {
//   const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width < 640) setDeviceType("mobile");
//       else if (width >= 640 && width < 1024) setDeviceType("tablet");
//       else setDeviceType("desktop");
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return deviceType;
// };

// // Responsive helper
// const getResponsiveClasses = (deviceType: "mobile" | "tablet" | "desktop") => ({
//   heading1: deviceType === "mobile" ? "text-xl" : deviceType === "tablet" ? "text-2xl" : "text-3xl lg:text-4xl",
//   heading2: deviceType === "mobile" ? "text-base" : deviceType === "tablet" ? "text-lg" : "text-xl",
//   bodyText: deviceType === "mobile" ? "text-xs" : deviceType === "tablet" ? "text-sm" : "text-base",
//   smallText: deviceType === "mobile" ? "text-[10px]" : deviceType === "tablet" ? "text-xs" : "text-sm",
//   buttonText: deviceType === "mobile" ? "text-xs" : deviceType === "tablet" ? "text-sm" : "text-sm",
//   cardTitle: deviceType === "mobile" ? "text-sm" : deviceType === "tablet" ? "text-base" : "text-lg",
//   calendarScale: deviceType === "mobile" ? "scale-90" : deviceType === "tablet" ? "scale-95" : "scale-100",
//   spacing: {
//     containerPadding: deviceType === "mobile" ? "px-3 py-4" : deviceType === "tablet" ? "px-5 py-6" : "px-6 py-8",
//     cardPadding: deviceType === "mobile" ? "p-3" : deviceType === "tablet" ? "p-4" : "p-6",
//   },
// });

// export interface DoctorAppointment {
//   id: string;
//   patientName: string;
//   date: string;
//   time: string;
//   type: "teleconsultation" | "in_person";
//   isPast: boolean;
//   status: "confirmed" | "cancelled" | "completed"| "pending";
//   notes?: string;
//   email?: string | null;
//   phoneNumber?: string | null;
//   videoRoomId?: string;
//   patientAvatar?: string | null;
//   patientId: string;
//   doctorId: string;
//    createdAt?: string;          // NEW: for pending timeout logic
//   appointmentDateTime?: Date;
// }

// interface VideoMeetingState {
//   showMeeting: boolean;
//   meetingId: string;
//   patientName: string;
//   appointmentId: string;
// }

// const to12Hour = (time: string) => {
//   const [h, m] = time.split(":");
//   const hour = Number(h);
//   const suffix = hour >= 12 ? "PM" : "AM";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${m} ${suffix}`;
// };

// export default function DoctorAppointmentManagement() {
//   const deviceType = useDeviceType();
//   const responsive = getResponsiveClasses(deviceType);
  
//   const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
//   const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
//     showMeeting: false,
//     meetingId: "",
//     patientName: "",
//     appointmentId: "",
//   });
//   const [doctorUserId, setDoctorUserId] = useState<string>("");
//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
// const hasAutoOpened = useRef(false);
  

// useEffect(() => {
//     const getDoctorId = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) setDoctorUserId(user.id);
//     };
//     getDoctorId();
//     fetchAppointments();
//     mixpanelInstance.track("Doctor Appointments Page View");
//   }, []);

//   // Auto-switch tab when selected date changes (past vs upcoming)
//   useEffect(() => {
//     if (!selectedDate) return;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const isPastDate = selectedDate < today;
//     setActiveTab(isPastDate ? "past" : "upcoming");
//   }, [selectedDate]);
// const [selectedPendingAppointment, setSelectedPendingAppointment] = useState<DoctorAppointment | null>(null);
// const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
// useEffect(() => {
//   // Only auto-open once, when appointments are loaded and not loading
//   if (!isLoading && appointments.length > 0 && !hasAutoOpened.current) {
//     // Find the first pending appointment (you can change order logic as needed)
//     const pendingAppt = appointments.find(apt => apt.status === "pending");
//     if (pendingAppt) {
//       handleViewPendingDetails(pendingAppt);
//       hasAutoOpened.current = true;
//     }
//   }
// }, [isLoading, appointments]);
// // Function to open dialog
// const handleViewPendingDetails = (appointment: DoctorAppointment) => {
//   setSelectedPendingAppointment(appointment);
//   setDetailsDialogOpen(true);
// };
//   const fetchAppointments = async () => {
//     setIsLoading(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data: profiles } = await supabase
//         .from("profiles")
//         .select("user_id, role")
//         .eq("user_id", user.id);
//       if (!profiles || profiles[0]?.role !== "doctor") return;

//       const { data: appts } = await supabase
//         .from("appointments")
//         .select(`
//           id,
//           patient_id,
//           appointment_date,
//           time_slot_id,
//           type,
//           status,
//           notes,
//           video_room_id
//         `)
//         .eq("doctor_id", user.id)
//         .order("appointment_date", { ascending: true });

//       if (!appts) return;

//       const patientIds = [...new Set(appts.map((a) => a.patient_id))];
//       const { data: patients } = await supabase
//         .from("profiles")
//         .select("user_id, first_name, last_name,email,phone_number, avatar_url")
//         .in("user_id", patientIds);

//       const patientMap = new Map(patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`]));
//       const patientAvatarMap = new Map(patients?.map((p) => [p.user_id, p.avatar_url]));
//       const patientEmailMap = new Map(
//   patients?.map((p) => [p.user_id, p.email])
// );

// const patientPhoneMap = new Map(
//   patients?.map((p) => [p.user_id, p.phone_number])
// );

//       const enriched: DoctorAppointment[] = [];
//       for (const apt of appts) {
//         const { data: slot } = await supabase
//           .from("time_slots")
//           .select("start_time, end_time")
//           .eq("id", apt.time_slot_id)
//           .single();
//         if (!slot) continue;

//         const dateOnly = apt.appointment_date.split("T")[0];
//         const today = new Date().toISOString().split("T")[0];
//         const isPast = dateOnly < today;

//         enriched.push({
//           id: apt.id,
//           patientId: apt.patient_id,
//           doctorId: user.id,
//           patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
//           date: dateOnly,
//           time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
//           type: apt.type,
//           status: apt.status,
//           isPast,
//           notes: apt.notes,
//           videoRoomId: apt.video_room_id,
//           patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
//           email: patientEmailMap.get(apt.patient_id) ?? null,
//           phoneNumber: patientPhoneMap.get(apt.patient_id) ?? null,
//         });
//       }
//       setAppointments(enriched);
//     } catch (err) {
//       console.error("Error fetching doctor appointments:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterByStatus = (list: DoctorAppointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter((a) => a.status === statusFilter);
//   };

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
//     setVideoMeeting({
//       showMeeting: true,
//       meetingId,
//       patientName: appointmentData.patientName,
//       appointmentId: appointmentData.id,
//     });
//   };

//   const handleLeaveMeeting = () => {
//     setVideoMeeting({ showMeeting: false, meetingId: "", patientName: "", appointmentId: "" });
//   };

//   const getDoctorDisplayName = () => localStorage.getItem("doctorName") || "Doctor";

//   const selectedDateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
//   const upcoming = filterByStatus(
//     appointments.filter((a) => !a.isPast && (!selectedDateString || a.date === selectedDateString))
//   );
//   const past = filterByStatus(
//     appointments.filter((a) => a.isPast && (!selectedDateString || a.date === selectedDateString))
//   );

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
//           appointmentId={videoMeeting.appointmentId}
//           userId={doctorUserId}
//           userRole="doctor"
//           enableDocumentSharing={true}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className={`container mx-auto ${responsive.spacing.containerPadding}`}>
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className={`font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${responsive.heading1}`}>
//             My Appointments
//           </h2>
//           <p className={`text-gray-500 mt-2 ${responsive.bodyText}`}>
//             Manage and track all your patient appointments
//           </p>
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           {/* Calendar Card */}
//           <div className="lg:col-span-1 order-1 lg:order-1">
//             <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardHeader className={`border-b bg-gray-50/50 rounded-t-xl ${deviceType === "mobile" ? "py-3" : "py-4"}`}>
//                 <CardTitle className={`flex items-center gap-2 text-gray-700 ${responsive.cardTitle}`}>
//                   <Filter className={`h-${deviceType === "mobile" ? 4 : 5} w-${deviceType === "mobile" ? 4 : 5} text-blue-500`} style={{ height: deviceType === "mobile" ? 16 : 20, width: deviceType === "mobile" ? 16 : 20 }} />
//                   Quick Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className={`space-y-4 ${responsive.spacing.cardPadding}`}>
//                 <div className="space-y-3">
//                   <label className={`text-gray-600 font-semibold ${responsive.bodyText}`}>Select Date</label>
//                   <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${responsive.calendarScale}`}>
//                     <CalendarComponent
//                       mode="single"
//                       selected={selectedDate}
//                       onSelect={setSelectedDate}
//                       initialFocus
//                       className="w-full"
//                     />
//                   </div>
//                   {selectedDate && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setSelectedDate(undefined)}
//                       className={`w-full mt-2 text-gray-500 hover:text-gray-700 ${responsive.smallText}`}
//                     >
//                       Clear Filter
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Appointments List */}
//           <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
//             {/* Tabs */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
//               <div className="flex gap-2 md:gap-3">
//                 <Button
//                   variant={activeTab === "upcoming" ? "default" : "outline"}
//                   onClick={() => setActiveTab("upcoming")}
//                   className={`flex-1 md:flex-none transition-all duration-200 ${activeTab === "upcoming" ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" : "hover:bg-gray-50"} ${responsive.buttonText}`}
//                 >
//                   Upcoming ({upcoming.length})
//                 </Button>
//                 <Button
//                   variant={activeTab === "past" ? "default" : "outline"}
//                   onClick={() => setActiveTab("past")}
//                   className={`flex-1 md:flex-none transition-all duration-200 ${activeTab === "past" ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" : "hover:bg-gray-50"} ${responsive.buttonText}`}
//                 >
//                   Past ({past.length})
//                 </Button>
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div className="flex flex-wrap gap-2">
//               {["all", "confirmed", "cancelled","pending"].map((s) => (
//                 <Button
//                   key={s}
//                   size="sm"
//                   variant={statusFilter === s ? "default" : "outline"}
//                   onClick={() => setStatusFilter(s as any)}
//                   className={`transition-all duration-200 ${statusFilter === s ? "shadow-md" : "hover:bg-gray-50"} ${responsive.smallText}`}
//                 >
//                   {s.charAt(0).toUpperCase() + s.slice(1)}
//                 </Button>
//               ))}
//             </div>

//             {/* Appointments List */}
//             <div className="space-y-4">
//               {isLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <Loader />
//                 </div>
//               ) : (activeTab === "upcoming" ? upcoming : past).length > 0 ? (
//                 (activeTab === "upcoming" ? upcoming : past).map((apt) => (
//                   <DoctorAppointmentCard
//                     key={apt.id}
//                     appointment={apt}
//                     onRefresh={fetchAppointments}
//                     onJoinVideo={() => handleJoinVideo(apt.id)}
//                   />
//                 ))
//               ) : (
//                 <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//                   <Calendar className={`h-12 w-12 text-gray-400 mx-auto mb-4 ${deviceType === "mobile" ? "h-8 w-8" : ""}`} />
//                   <p className={`text-gray-500 font-medium ${responsive.bodyText}`}>No appointments found</p>
//                   <p className={`text-sm text-gray-400 mt-1 ${responsive.smallText}`}>
//                     {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
//   <DialogContent className="sm:max-w-lg">
//     <DialogHeader>
//       <DialogTitle>Appointment Details</DialogTitle>
//       <DialogDescription>
//         Review the appointment information before taking action.
//       </DialogDescription>
//     </DialogHeader>
//     {selectedPendingAppointment && (
//       <div className="space-y-4 py-2">
//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <div className="font-medium">Patient Name:</div>
//           <div>{selectedPendingAppointment.patientName}</div>
//           <div className="font-medium">Date:</div>
//           <div>{selectedPendingAppointment.date}</div>
//           <div className="font-medium">Time:</div>
//           <div>{selectedPendingAppointment.time}</div>
//           <div className="font-medium">Type:</div>
//           <div className="capitalize">{selectedPendingAppointment.type}</div>
//           <div className="font-medium">Status:</div>
//           <div className="capitalize text-amber-600 font-semibold">Pending</div>
//           <div className="font-medium">Email:</div>
//           <div>{selectedPendingAppointment.email || "Not provided"}</div>
//           <div className="font-medium">Phone:</div>
//           <div>{selectedPendingAppointment.phoneNumber || "Not provided"}</div>
//           {selectedPendingAppointment.notes && (
//             <>
//               <div className="font-medium">Notes:</div>
//               <div className="col-span-1">{selectedPendingAppointment.notes}</div>
//             </>
//           )}
//         </div>
//       </div>
//     )}
//     <DialogFooter className="flex flex-col sm:flex-row gap-2">
//       <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
//         Close
//       </Button>
//       {selectedPendingAppointment && (
//         <Link
//           to={`/doctor/appointment-patient/${selectedPendingAppointment.patientId}/${selectedPendingAppointment.id}`}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Button className="w-full sm:w-auto">
//             <Eye className="mr-2 h-4 w-4" />
//             View Full Details
//           </Button>
//         </Link>
//       )}
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//     </div>
//   );
// }


// ========================================
// DoctorAppointmentManagement.tsx - Final
// Responsive text sizes + calendar auto-tab + pending auto-dialog
// ========================================

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { Button } from "@/components/ui/button";
import VideoMeeting from "../VideoMeeting";
import mixpanelInstance from "@/utils/mixpanel";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Calendar } from "lucide-react";
import { format } from "date-fns";
import Loader from "../ui/Loader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

// ------------------------
// Device Detection Hook
// ------------------------
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType("mobile");
      else if (width >= 640 && width < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return deviceType;
};

// Responsive helper
const getResponsiveClasses = (deviceType: "mobile" | "tablet" | "desktop") => ({
  heading1: deviceType === "mobile" ? "text-xl" : deviceType === "tablet" ? "text-2xl" : "text-3xl lg:text-4xl",
  heading2: deviceType === "mobile" ? "text-base" : deviceType === "tablet" ? "text-lg" : "text-xl",
  bodyText: deviceType === "mobile" ? "text-xs" : deviceType === "tablet" ? "text-sm" : "text-base",
  smallText: deviceType === "mobile" ? "text-[10px]" : deviceType === "tablet" ? "text-xs" : "text-sm",
  buttonText: deviceType === "mobile" ? "text-xs" : deviceType === "tablet" ? "text-sm" : "text-sm",
  cardTitle: deviceType === "mobile" ? "text-sm" : deviceType === "tablet" ? "text-base" : "text-lg",
  calendarScale: deviceType === "mobile" ? "scale-90" : deviceType === "tablet" ? "scale-95" : "scale-100",
  spacing: {
    containerPadding: deviceType === "mobile" ? "px-3 py-4" : deviceType === "tablet" ? "px-5 py-6" : "px-6 py-8",
    cardPadding: deviceType === "mobile" ? "p-3" : deviceType === "tablet" ? "p-4" : "p-6",
  },
});

export interface DoctorAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  isPast: boolean;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  notes?: string;
  email?: string | null;
  phoneNumber?: string | null;
  videoRoomId?: string;
  patientAvatar?: string | null;
  patientId: string;
  doctorId: string;
  createdAt?: string;          // for pending timeout logic
  appointmentDateTime?: Date;
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
  const deviceType = useDeviceType();
  const responsive = getResponsiveClasses(deviceType);
  
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    patientName: "",
    appointmentId: "",
  });
  const [doctorUserId, setDoctorUserId] = useState<string>("");
  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    const getDoctorId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setDoctorUserId(user.id);
    };
    getDoctorId();
    fetchAppointments();
    mixpanelInstance.track("Doctor Appointments Page View");
  }, []);

  // Auto-switch tab when selected date changes (past vs upcoming)
  useEffect(() => {
    if (!selectedDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastDate = selectedDate < today;
    setActiveTab(isPastDate ? "past" : "upcoming");
  }, [selectedDate]);

  const [selectedPendingAppointment, setSelectedPendingAppointment] = useState<DoctorAppointment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Auto-open dialog for the first pending appointment (only once)
  useEffect(() => {
    if (!isLoading && appointments.length > 0 && !hasAutoOpened.current) {
      const pendingAppt = appointments.find(apt => apt.status === "pending");
      if (pendingAppt) {
        handleViewPendingDetails(pendingAppt);
        hasAutoOpened.current = true;
      }
    }
  }, [isLoading, appointments]);

  const handleViewPendingDetails = (appointment: DoctorAppointment) => {
    setSelectedPendingAppointment(appointment);
    setDetailsDialogOpen(true);
  };

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
          video_room_id,
          created_at
        `)
        .eq("doctor_id", user.id)
        .order("appointment_date", { ascending: true });

      if (!appts) return;

      const patientIds = [...new Set(appts.map((a) => a.patient_id))];
      const { data: patients } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email, phone_number, avatar_url")
        .in("user_id", patientIds);

      const patientMap = new Map(patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`]));
      const patientAvatarMap = new Map(patients?.map((p) => [p.user_id, p.avatar_url]));
      const patientEmailMap = new Map(patients?.map((p) => [p.user_id, p.email]));
      const patientPhoneMap = new Map(patients?.map((p) => [p.user_id, p.phone_number]));

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
          email: patientEmailMap.get(apt.patient_id) ?? null,
          phoneNumber: patientPhoneMap.get(apt.patient_id) ?? null,
          createdAt: apt.created_at,
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

const SubscriptionUsage = ({
  professionalId,
}: {
  professionalId: string;
}) => {
  const [limits, setLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);

  useEffect(() => {
    if (!professionalId) return;

    const fetchLimits = async () => {
      try {
        setLoading(true);

        const { data: sessionData } =
          await supabase.auth.getSession();

        const token =
          sessionData.session?.access_token;

        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_auth_id: professionalId,
            }),
          }
        );

        const result = await response.json();

        console.log("LIMIT RESULT:", result);

        setLimits(result);

        setHasSubscription(
          result?.hasActiveSubscription ?? false
        );
      } catch (err) {
        console.error(
          "Error fetching subscription limits:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [professionalId]);

  if (loading) {
    return (
      <div className="text-center py-3 text-sm text-gray-500">
        Loading subscription usage...
      </div>
    );
  }

  if (!limits) return null;

  // In-Person Limits
  const inPersonLimitMax =
    limits?.limits?.in_person?.max ?? 0;

  const inPersonLimitCurrent =
    limits?.limits?.in_person?.used ?? 0;

  const inPersonRemaining =
    limits?.limits?.in_person?.remaining ?? 0;

  const isInPersonLimitReached =
    inPersonLimitCurrent >= inPersonLimitMax &&
    inPersonLimitMax > 0;

  // Teleconsultation Limits
  const teleLimitMax =
    limits?.limits?.teleconsultation?.max ?? 0;

  const teleLimitCurrent =
    limits?.limits?.teleconsultation?.used ?? 0;

  const teleRemaining =
    limits?.limits?.teleconsultation?.remaining ?? 0;

  const isTeleLimitReached =
    teleLimitCurrent >= teleLimitMax &&
    teleLimitMax > 0;

  return (
    <div className="space-y-4">
      {/* No Subscription */}
      {!hasSubscription && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          No active subscription found.
        </div>
      )}

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In-Person Consultation */}
        <div
          className={`rounded-lg border p-4 ${
            isInPersonLimitReached
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`font-semibold ${
                isInPersonLimitReached
                  ? "text-red-700"
                  : "text-yellow-800"
              }`}
            >
              In-Person Consultation
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isInPersonLimitReached
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {limits?.limits?.in_person?.limitType ??
                "limited"}
            </span>
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {inPersonLimitCurrent} / {inPersonLimitMax}
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Remaining: {inPersonRemaining}
          </div>

          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${
                isInPersonLimitReached
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
              style={{
                width: `${
                  limits?.limits?.in_person
                    ?.percentageUsed ?? 0
                }%`,
              }}
            />
          </div>

          {isInPersonLimitReached && (
            <div className="mt-3 text-xs font-medium text-red-700">
              In-person consultation limit reached.
            </div>
          )}
        </div>

        {/* Teleconsultation */}
        <div
          className={`rounded-lg border p-4 ${
            isTeleLimitReached
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`font-semibold ${
                isTeleLimitReached
                  ? "text-red-700"
                  : "text-yellow-800"
              }`}
            >
              Teleconsultation
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isTeleLimitReached
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {limits?.limits?.teleconsultation
                ?.limitType ?? "none"}
            </span>
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {teleLimitCurrent} / {teleLimitMax}
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Remaining: {teleRemaining}
          </div>

          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${
                isTeleLimitReached
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
              style={{
                width: `${
                  limits?.limits?.teleconsultation
                    ?.percentageUsed ?? 0
                }%`,
              }}
            />
          </div>

          {isTeleLimitReached && (
            <div className="mt-3 text-xs font-medium text-red-700">
              Teleconsultation limit reached.
            </div>
          )}
        </div>
      </div>

      {/* Backend Message */}
      {limits?.message && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          {limits.message}
        </div>
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={`container mx-auto ${responsive.spacing.containerPadding}`}>
        {/* Header */}
        <div className="mb-8">
          <h2 className={`font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${responsive.heading1}`}>
            My Appointments
          </h2>
          <p className={`text-gray-500 mt-2 ${responsive.bodyText}`}>
            Manage and track all your patient appointments
          </p>
        </div>

              <SubscriptionUsage professionalId={doctorUserId} />
      

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          {/* Calendar Card */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card className="sticky top-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className={`border-b bg-gray-50/50 rounded-t-xl ${deviceType === "mobile" ? "py-3" : "py-4"}`}>
                <CardTitle className={`flex items-center gap-2 text-gray-700 ${responsive.cardTitle}`}>
                  <Filter className={`h-${deviceType === "mobile" ? 4 : 5} w-${deviceType === "mobile" ? 4 : 5} text-blue-500`} style={{ height: deviceType === "mobile" ? 16 : 20, width: deviceType === "mobile" ? 16 : 20 }} />
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 ${responsive.spacing.cardPadding}`}>
                <div className="space-y-3">
                  <label className={`text-gray-600 font-semibold ${responsive.bodyText}`}>Select Date</label>
                  <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${responsive.calendarScale}`}>
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
                      className={`w-full mt-2 text-gray-500 hover:text-gray-700 ${responsive.smallText}`}
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
                  className={`flex-1 md:flex-none transition-all duration-200 ${activeTab === "upcoming" ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" : "hover:bg-gray-50"} ${responsive.buttonText}`}
                >
                  Upcoming ({upcoming.length})
                </Button>
                <Button
                  variant={activeTab === "past" ? "default" : "outline"}
                  onClick={() => setActiveTab("past")}
                  className={`flex-1 md:flex-none transition-all duration-200 ${activeTab === "past" ? "bg-gradient-to-r from-gray-600 to-gray-500 shadow-md" : "hover:bg-gray-50"} ${responsive.buttonText}`}
                >
                  Past ({past.length})
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "confirmed", "cancelled", "pending"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "default" : "outline"}
                  onClick={() => setStatusFilter(s as any)}
                  className={`transition-all duration-200 ${statusFilter === s ? "shadow-md" : "hover:bg-gray-50"} ${responsive.smallText}`}
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
                  <Calendar className={`h-12 w-12 text-gray-400 mx-auto mb-4 ${deviceType === "mobile" ? "h-8 w-8" : ""}`} />
                  <p className={`text-gray-500 font-medium ${responsive.bodyText}`}>No appointments found</p>
                  <p className={`text-sm text-gray-400 mt-1 ${responsive.smallText}`}>
                    {selectedDate ? "No appointments on selected date" : "No appointments scheduled"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment waiting for your confirmation</DialogTitle>
            <DialogDescription>
              Review the appointment information before taking action.
            </DialogDescription>
          </DialogHeader>
          {/* {selectedPendingAppointment && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="font-medium">Patient Name:</div>
                <div>{selectedPendingAppointment.patientName}</div>
                <div className="font-medium">Date:</div>
                <div>{selectedPendingAppointment.date}</div>
                <div className="font-medium">Time:</div>
                <div>{selectedPendingAppointment.time}</div>
                <div className="font-medium">Type:</div>
                <div className="capitalize">{selectedPendingAppointment.type}</div>
                <div className="font-medium">Status:</div>
                <div className="capitalize text-amber-600 font-semibold">Pending</div>
                <div className="font-medium">Email:</div>
                <div>{selectedPendingAppointment.email || "Not provided"}</div>
                <div className="font-medium">Phone:</div>
                <div>{selectedPendingAppointment.phoneNumber || "Not provided"}</div>
                {selectedPendingAppointment.notes && (
                  <>
                    <div className="font-medium">Notes:</div>
                    <div className="col-span-1">{selectedPendingAppointment.notes}</div>
                  </>
                )}
              </div>
            </div>
          )} */}
          <div className="space-y-4 py-2">
            You have a pending appointment request. Please review and take action.
    Click View Pending Appointment to open the pending appointment page.
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedPendingAppointment && (
              <Link
                to={`/dashboard/doctor/appointment-pending`}
                // to={`/doctor/appointment-patient/${selectedPendingAppointment.patientId}/${selectedPendingAppointment.id}`}
                // target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto">
                  <Eye className="mr-2 h-4 w-4" />
                  Proceed to Confirm 
                </Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}