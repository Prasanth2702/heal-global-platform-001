// // // ========================================
// // // AppointmentManagement.tsx (Patient) - Fixed
// // // Patient Appointment Page (Upcoming + Past)
// // // ========================================

// // import React, { useEffect, useState } from "react";
// // import { supabase } from "@/integrations/supabase/client";
// // import { useToast } from "@/components/ui/use-toast";
// // import AppointmentCard from "./AppointmentCard";
// // import VideoMeeting from "../VideoMeeting";
// // import { Button } from "@/components/ui/button";
// // import AppointmentDepartmentsCard from "./AppointmentDepartmentsCard";

// // // ------------------------
// // // Types for safety & clarity
// // // ------------------------
// // export interface Appointment {
// //   id: string;
// //   doctorName: string;
// //   specialty: string;
// //   date: string; // yyyy-mm-dd
// //   time: string; // "10:00 - 10:30"
// //   type: "teleconsultation" | "in_person";
// //   status: "confirmed" | "cancelled" | "completed";
// //   location: string;
// //   consultationFee: number | null;
// //   doctorImage?: string;
// //   doctorId: string;
// //   doctorVerified: boolean;
// //   slotStartTime: string; // (HH:MM format)
// //   slotEndTime: string; // (HH:MM format)
// //   doctorAvatar: string | null;
// //   cancellationReason?: string | null;
// //   notes?: string | null;
// //   isPast: boolean;
// //   videoRoomId?: string; // This is the meeting ID
// //   documents?: Document[];
// // }

// // interface VideoMeetingState {
// //   showMeeting: boolean;
// //   meetingId: string;
// //   doctorName: string;
// // }

// // interface Profile {
// //   id: string;
// //   user_id: string;
// //   first_name: string;
// //   last_name: string;
// //   email: string;
// // }

// // interface Document {
// //   id: string;
// //   name: string;
// //   file_path: string;
// //   mime_type: string;
// //   created_at: string;
// //   uploaded_by: string;
// //   uploader_role: string;
// // }

// // // ------------------------
// // // Helper function
// // // ------------------------
// // const to12Hour = (time: string) => {
// //   const [h, m] = time.split(":");
// //   const hour = Number(h);
// //   const suffix = hour >= 12 ? "PM" : "AM";
// //   const hour12 = hour % 12 || 12;
// //   return `${hour12}:${m} ${suffix}`;
// // };

// // // ------------------------
// // // Component
// // // ------------------------
// // export default function AppointmentManagement() {
// //   const { toast } = useToast();
// // const [hospitalAppointments, setHospitalAppointments] = useState<Appointment[]>([]);
// //   const [appointments, setAppointments] = useState<Appointment[]>([]);
// //   const [activeTab, setActiveTab] = useState<"upcoming" | "past"|"doctor"|"hospital">("upcoming");
// //   const [statusFilter, setStatusFilter] = useState<
// //     "all" | "confirmed" | "cancelled" | "completed"
// //   >("all");

// //   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
// //     showMeeting: false,
// //     meetingId: "",
// //     doctorName: "",
// //   });

// //   const [profile, setProfile] = useState<Profile | null>(null);
// //   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

// //   // Load appointments when screen opens
// //   useEffect(() => {
// //     fetchAppointments();
// //   }, []);

// //   // -------------------------------------------------------------
// //   // Fetch appointments
// //   // -------------------------------------------------------------
// //   const fetchAppointments = async () => {
// //     try {
// //       // 1️⃣ Get patient information
// //       const {
// //         data: { user },
// //         error: userError,
// //       } = await supabase.auth.getUser();
// //       if (userError || !user) return;

// //       // 2️⃣ Get profile
// //       const { data: profileData, error: profileError } = await supabase
// //         .from("profiles")
// //         .select("id, user_id, first_name, last_name, email")
// //         .eq("user_id", user.id)
// //         .single();

// //       if (profileError) {
// //         console.error("Profile error:", profileError);
// //         toast({
// //           title: "Error",
// //           description: "Failed to load profile details",
// //         });
// //       } else {
// //         setProfile(profileData);
// //       }

// //       // 3️⃣ Get all appointments for this patient
// //       const { data, error } = await supabase
// //         .from("appointments")
// //         .select(
// //           `
// //           id,
// //           doctor_id,
// //           doctor_name,
// //           appointment_date,
// //           time_slot_id,
// //           status,
// //           type,
// //           consultation_fee,
// //           reason,
// //           cancellation_reason,
// //           notes,
// //           video_room_id
// //         `
// //         )
// //         .eq("patient_id", user.id)
// //         .order("appointment_date", { ascending: true });

// //       if (error) {
// //         toast({ title: "Error", description: "Could not load appointments" });
// //         return;
// //       }

// //       if (!data || data.length === 0) {
// //         setAppointments([]);
// //         return;
// //       }

// //       // 4️⃣ For each appointment → fetch the time slot details
// //       const enrichedPromises = data.map(async (apt) => {
// //         const { data: slot } = await supabase
// //           .from("time_slots")
// //           .select("start_time, end_time, slot_type")
// //           .eq("id", apt.time_slot_id)
// //           .single();

// //         // Check if doctor is verified
// //         const { data: doctorVerification } = await supabase
// //           .from("medical_professionals")
// //           .select("is_verified")
// //           .eq("user_id", apt.doctor_id)
// //           .single();

// //         // Get doctor avatar from profiles
// //         const { data: doctorProfile } = await supabase
// //           .from("profiles")
// //           .select("avatar_url")
// //           .eq("user_id", apt.doctor_id)
// //           .single();

// //         // Fetch prescriptions for this appointment
// //         const { data: documents } = await supabase
// //           .from("documents")
// //           .select(
// //             "id, name, file_path, mime_type, created_at, uploaded_by, uploader_role"
// //           )
// //           .eq("appointment_id", apt.id)
// //           .order("created_at", { ascending: false });

// //         // Determine if appointment is past only by date not time
// //         const dateOnly = apt.appointment_date?.split("T")[0] || "";
// //         const today = new Date().toISOString().split("T")[0];
// //         const isPast = dateOnly < today;

// //         return {
// //           id: apt.id,
// //           doctorName: apt.doctor_name,
// //           specialty: apt.reason ?? "Consultation",
// //           date: dateOnly,
// //           time: slot
// //             ? `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`
// //             : "",
// //           type: slot?.slot_type === "tele" ? "teleconsultation" : "in_person",
// //           status: apt.status,
// //           location: slot?.slot_type === "tele" ? "Online" : "Clinic",
// //           consultationFee: apt.consultation_fee,
// //           doctorImage: "/doctor-placeholder.png",
// //           doctorId: apt.doctor_id,
// //           doctorVerified: doctorVerification?.is_verified || false,
// //           slotStartTime: slot?.start_time || "",
// //           slotEndTime: slot?.end_time || "",
// //           doctorAvatar: doctorProfile?.avatar_url || null,
// //           cancellationReason: apt.cancellation_reason || null,
// //           notes: apt.notes || null,
// //           isPast,
// //           videoRoomId: apt.video_room_id, // This is the meeting ID
// //           documents: documents || [],
// //         } as Appointment;
// //       });

// //       const enriched = await Promise.all(enrichedPromises);

// //       // ✅ Remove duplicates
// //       const uniqueAppointments = Array.from(
// //         new Map(enriched.map((a) => [a.id, a])).values()
// //       );

// //       setAppointments(uniqueAppointments);
// //     } catch (err) {
// //       console.error("Error fetching:", err);
// //       toast({
// //         title: "Error",
// //         description: "Failed to load appointments",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   // -------------------------------------------------------------
// //   // Filter appointments
// //   // -------------------------------------------------------------
// //   const filterByStatus = (list: Appointment[]) => {
// //     if (statusFilter === "all") return list;
// //     return list.filter((a) => a.status === statusFilter);
// //   };

// //   const upcomingAppointments = filterByStatus(
// //     appointments.filter((a) => !a.isPast)
// //   );

// //   const pastAppointments = filterByStatus(appointments.filter((a) => a.isPast));

// //   // -------------------------------------------------------------
// //   // Video Meeting Functions
// //   // -------------------------------------------------------------
// //   const handleLeaveMeeting = () => {
// //     console.log("Patient leaving meeting");
// //     setVideoMeeting({
// //       showMeeting: false,
// //       meetingId: "",
// //       doctorName: "",
// //     });
// //   };

// //   const getDisplayName = () => {
// //     if (profile?.first_name && profile?.last_name) {
// //       return `${profile.first_name} ${profile.last_name}`;
// //     } else if (profile?.email) {
// //       return profile.email;
// //     } else {
// //       return "Participant";
// //     }
// //   };

// //   const canJoinMeeting = (
// //     appointmentDate: string,
// //     slotStartTime: string,
// //     slotEndTime: string
// //   ) => {
// //     const now = new Date();
// //     const appointmentDateObj = new Date(appointmentDate);

// //     // Parse start time (e.g., "10:00")
// //     const [startHour, startMinute] = slotStartTime.split(":").map(Number);
// //     const appointmentStartTime = new Date(appointmentDateObj);
// //     appointmentStartTime.setHours(startHour, startMinute, 0, 0);

// //     // Parse end time (e.g., "10:30")
// //     const [endHour, endMinute] = slotEndTime.split(":").map(Number);
// //     const appointmentEndTime = new Date(appointmentDateObj);
// //     appointmentEndTime.setHours(endHour, endMinute, 0, 0);

// //     // Allow joining 10 minutes before start time
// //     const tenMinutesBefore = new Date(
// //       appointmentStartTime.getTime() - 10 * 60000
// //     );

// //     // Allow joining up to 1 hour after end time
// //     const oneHourAfter = new Date(appointmentEndTime.getTime() + 60 * 60000);

// //     return now >= tenMinutesBefore && now <= oneHourAfter;
// //   };

// //   const handleJoinVideo = (appointmentId: string) => {
// //     const appointment = appointments.find((apt) => apt.id === appointmentId);
// //     if (!appointment) return;

// //     if (!apiKey) {
// //       toast({
// //         title: "Error",
// //         description: "Video conferencing is not configured properly",
// //       });
// //       return;
// //     }

// //     // Check if it's teleconsultation
// //     if (appointment.type !== "teleconsultation") {
// //       toast({
// //         title: "Cannot Join Meeting",
// //         description: "This appointment is not a teleconsultation",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     // Check if appointment is confirmed
// //     if (appointment.status !== "confirmed") {
// //       toast({
// //         title: "Cannot Join Meeting",
// //         description: "Only confirmed appointments can be joined",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     // Check if doctor is verified (only for teleconsultation)
// //     if (!appointment.doctorVerified) {
// //       toast({
// //         title: "Doctor Not Verified",
// //         description:
// //           "Doctor verification is pending. Meeting cannot be started.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     // Check timing restrictions
// //     // if (
// //     //   !canJoinMeeting(
// //     //     appointment.date,
// //     //     appointment.slotStartTime,
// //     //     appointment.slotEndTime
// //     //   )
// //     // ) {
// //     //   toast({
// //     //     title: "Cannot Join Meeting",
// //     //     description:
// //     //       "You can only join the meeting 10 minutes before and up to 1 hour after the scheduled time",
// //     //     variant: "destructive",
// //     //   });
// //     //   return;
// //     // }

// //     // Use videoRoomId as meeting ID (same as doctor uses)
// //     const meetingId =
// //       appointment.videoRoomId || `appointment-${appointment.id}`;

// //     console.log("Starting video meeting with ID:", meetingId);

// //     setVideoMeeting({
// //       showMeeting: true,
// //       meetingId: meetingId,
// //       doctorName: appointment.doctorName,
// //     });
// //   };

// //   // Show video meeting if active
// //   if (videoMeeting.showMeeting) {
// //     return (
// //       <div className=" inset-0 bg-white">
// //         <VideoMeeting
// //           isHost={false} // Patient is not host
// //           apiKey={apiKey}
// //           meetingId={videoMeeting.meetingId}
// //           name={getDisplayName()}
// //           onMeetingLeave={handleLeaveMeeting}
// //           micEnabled={true}
// //           webcamEnabled={true}
// //           containerId="video-container"
// //           meetingTitle={`Consultation with ${videoMeeting.doctorName}`}
// //         />
// //       </div>
// //     );
// //   }

// //   // -------------------------------------------------------------
// //   // Render
// //   // -------------------------------------------------------------
// //   return (
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

// //       {/* Tabs */}
// //       <div className="flex gap-3 mb-4">
// //         <Button
// //           variant={activeTab === "upcoming" ? "default" : "outline"}
// //           onClick={() => setActiveTab("upcoming")}
// //         >
// //           Upcoming
// //         </Button>
// //         <Button
// //           variant={activeTab === "past" ? "default" : "outline"}
// //           onClick={() => setActiveTab("past")}
// //         >
// //           Past
// //         </Button>
// //         <Button
// //           variant={activeTab === "past" ? "default" : "outline"}
// //           onClick={() => setActiveTab("doctor")}
// //         >
// //           Doctor Appointments
// //         </Button>
// //         <Button
// //           variant={activeTab === "hospital" ? "default" : "outline"}
// //           onClick={() => setActiveTab("hospital")}
// //         >
// //           Hospital Appointments
// //         </Button>
// //       </div>

// //       {/* Status Filter */}
// //       <div className="flex gap-2 mb-6">
// //         {["all", "confirmed", "cancelled", "completed"].map((s) => (
// //           <Button
// //             key={s}
// //             size="sm"
// //             variant={statusFilter === s ? "default" : "outline"}
// //             onClick={() => setStatusFilter(s as any)}
// //           >
// //             {s.charAt(0).toUpperCase() + s.slice(1)}
// //           </Button>
// //         ))}
// //       </div>

// //       {/* Upcoming Appointments */}
// //       {activeTab === "upcoming" && (
// //         <div className="space-y-4">
// //           {upcomingAppointments.length === 0 ? (
// //             <p className="text-muted-foreground">
// //               No upcoming appointments found
// //             </p>
// //           ) : (
// //             upcomingAppointments.map((apt) => (
// //               <AppointmentCard
// //                 key={apt.id}
// //                 appointment={apt}
// //                 userRole="patient"
// //                 onJoinVideo={() => handleJoinVideo(apt.id)}
// //                 // onRefresh={fetchAppointments}
// //               />
// //             ))
// //              hospitalAppointments.map((apt) => (
// //               <AppointmentDepartmentsCard
// //                 key={apt.id}
// //                 appointment={apt}
// //                 userRole="patient"
// //               />
// //             ))
// //           )}
// //         </div>
// //       )}

// //       {/* Past Appointments */}
// //       {activeTab === "past" && (
// //         <div className="space-y-4">
// //           {pastAppointments.length === 0 ? (
// //             <p className="text-muted-foreground">No past appointments found</p>
// //           ) : (
// //             pastAppointments.map((apt) => (
// //               <AppointmentCard
// //                 key={apt.id}
// //                 appointment={apt}
// //                 userRole="patient"
// //                 onJoinVideo={() => {}}
// //                 // onRefresh={fetchAppointments}
// //               />

// //             ))
// //              hospitalAppointments.map((apt) => (
// //               <AppointmentDepartmentsCard
// //                 key={apt.id}
// //                 appointment={apt}
// //                 userRole="patient"
// //               />
// //             ))
// //           )}
// //         </div>
// //       )}
// //       {activeTab === "hospital" && (
// //         <div className="space-y-4">
// //           {hospitalAppointments.length === 0 ? (
// //             <p className="text-muted-foreground">No hospital appointments found</p>
// //           ) : (
// //             hospitalAppointments.map((apt) => (
// //               <AppointmentDepartmentsCard
// //                 key={apt.id}
// //                 appointment={apt}
// //                 userRole="patient"
// //               />
// //             ))
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // ========================================
// // AppointmentManagement.tsx (Patient) - Updated with Doctor & Hospital Tabs
// // Patient Appointment Page (Upcoming + Past + Doctor + Hospital)
// // ========================================

// import React, { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/components/ui/use-toast";
// import AppointmentCard from "./AppointmentCard";
// import AppointmentDepartmentsCard from "./AppointmentDepartmentsCard";
// import VideoMeeting from "../VideoMeeting";
// import { Button } from "@/components/ui/button";

// // ------------------------
// // Types for safety & clarity
// // ------------------------
// export interface Appointment {
//   id: string;
//   doctorName: string;
//   specialty: string;
//   date: string; // yyyy-mm-dd
//   time: string; // "10:00 - 10:30"
//   type: "teleconsultation" | "in_person";
//   status: "confirmed" | "cancelled" | "completed";
//   location: string;
//   consultationFee: number | null;
//   doctorImage?: string;
//   doctorId: string;
//   doctorVerified: boolean;
//   slotStartTime: string; // (HH:MM format)
//   slotEndTime: string; // (HH:MM format)
//   doctorAvatar: string | null;
//   cancellationReason?: string | null;
//   notes?: string | null;
//   isPast: boolean;
//   videoRoomId?: string; // This is the meeting ID
//   documents?: Document[];
// }

// // New interface for department/hospital appointments
// export interface DepartmentAppointment {
//   id: string;
//   departmentId: string;
//   departmentName: string;
//   departmentDescription?: string;
//   facilityName: string;
//   facilityId: string;
//   date: string;
//   time: string;
//   type: "teleconsultation" | "in_person";
//   status: "confirmed" | "cancelled" | "completed";
//   location: string;
//   consultationFee: number | null;
//   slotStartTime: string;
//   slotEndTime: string;
//   isPast: boolean;
//   cancellationReason?: string | null;
//   notes?: string | null;
//   chiefComplaint?: string | null;
//   completedAt?: string | null;
//   documents?: Document[];
// }

// interface VideoMeetingState {
//   showMeeting: boolean;
//   meetingId: string;
//   doctorName: string;
// }

// interface Profile {
//   id: string;
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
// }

// interface Document {
//   id: string;
//   name: string;
//   file_path: string;
//   mime_type: string;
//   created_at: string;
//   uploaded_by: string;
//   uploader_role: string;
// }

// // ------------------------
// // Helper function
// // ------------------------
// const to12Hour = (time: string) => {
//   const [h, m] = time.split(":");
//   const hour = Number(h);
//   const suffix = hour >= 12 ? "PM" : "AM";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${m} ${suffix}`;
// };

// // ------------------------
// // Component
// // ------------------------
// export default function AppointmentManagement() {
//   const { toast } = useToast();
  
//   // Separate state for different appointment types
//   const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
//   const [hospitalAppointments, setHospitalAppointments] = useState<DepartmentAppointment[]>([]);
  
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "doctor" | "hospital">("upcoming");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "confirmed" | "cancelled" | "completed"
//   >("all");

//   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
//     showMeeting: false,
//     meetingId: "",
//     doctorName: "",
//   });

//   const [profile, setProfile] = useState<Profile | null>(null);
//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

//   // Load appointments when screen opens
//   useEffect(() => {
//     fetchDoctorAppointments();
//     fetchHospitalAppointments();
//   }, []);

//   // -------------------------------------------------------------
//   // Fetch DOCTOR appointments (with doctor_id)
//   // -------------------------------------------------------------
//   const fetchDoctorAppointments = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       // Get profile
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("id, user_id, first_name, last_name, email")
//         .eq("user_id", user.id)
//         .single();

//       if (profileData) {
//         setProfile(profileData);
//       }

//       // Get doctor appointments (with doctor_id and not null)
//       const { data, error } = await supabase
//         .from("appointments")
//         .select(
//           `
//           id,
//           doctor_id,
//           doctor_name,
//           appointment_date,
//           time_slot_id,
//           status,
//           type,
//           consultation_fee,
//           reason,
//           cancellation_reason,
//           notes,
//           video_room_id
//         `
//         )
//         .eq("patient_id", user.id)
//         .not("doctor_id", "is", null) // Only appointments with doctor_id
//         .order("appointment_date", { ascending: true });

//       if (error) {
//         console.error("Error fetching doctor appointments:", error);
//         return;
//       }

//       if (!data || data.length === 0) {
//         setDoctorAppointments([]);
//         return;
//       }

//       // Enrich with time slot details
//       const enrichedPromises = data.map(async (apt) => {
//         const { data: slot } = await supabase
//           .from("time_slots")
//           .select("start_time, end_time, slot_type")
//           .eq("id", apt.time_slot_id)
//           .single();

//         const { data: doctorVerification } = await supabase
//           .from("medical_professionals")
//           .select("is_verified")
//           .eq("user_id", apt.doctor_id)
//           .single();

//         const { data: doctorProfile } = await supabase
//           .from("profiles")
//           .select("avatar_url")
//           .eq("user_id", apt.doctor_id)
//           .single();

//         const { data: documents } = await supabase
//           .from("documents")
//           .select("*")
//           .eq("appointment_id", apt.id)
//           .order("created_at", { ascending: false });

//         const dateOnly = apt.appointment_date?.split("T")[0] || "";
//         const today = new Date().toISOString().split("T")[0];
//         const isPast = dateOnly < today;

//         return {
//           id: apt.id,
//           doctorName: apt.doctor_name,
//           specialty: apt.reason ?? "Consultation",
//           date: dateOnly,
//           time: slot
//             ? `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`
//             : "",
//           type: slot?.slot_type === "tele" ? "teleconsultation" : "in_person",
//           status: apt.status,
//           location: slot?.slot_type === "tele" ? "Online" : "Clinic",
//           consultationFee: apt.consultation_fee,
//           doctorImage: "/doctor-placeholder.png",
//           doctorId: apt.doctor_id,
//           doctorVerified: doctorVerification?.is_verified || false,
//           slotStartTime: slot?.start_time || "",
//           slotEndTime: slot?.end_time || "",
//           doctorAvatar: doctorProfile?.avatar_url || null,
//           cancellationReason: apt.cancellation_reason || null,
//           notes: apt.notes || null,
//           isPast,
//           videoRoomId: apt.video_room_id,
//           documents: documents || [],
//         } as Appointment;
//       });

//       const enriched = await Promise.all(enrichedPromises);
//       const uniqueAppointments = Array.from(
//         new Map(enriched.map((a) => [a.id, a])).values()
//       );

//       setDoctorAppointments(uniqueAppointments);
//     } catch (err) {
//       console.error("Error fetching doctor appointments:", err);
//     }
//   };

//   // -------------------------------------------------------------
//   // Fetch HOSPITAL/DEPARTMENT appointments (with department_id, no doctor_id)
//   // -------------------------------------------------------------
//   const fetchHospitalAppointments = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       // Get department appointments (with department_id and no doctor_id)
//       const { data, error } = await supabase
//         .from("appointments")
//         .select(
//           `
//           id,
//           department_id,
//           facility_id,
//           appointment_date,
//           time_slot_id,
//           status,
//           type,
//           consultation_fee,
//           chief_complaint,
//           notes,
//           cancellation_reason,
//           completed_at
//         `
//         )
//         .eq("patient_id", user.id)
//         .not("department_id", "is", null)
//         .is("doctor_id", null) // Ensure no doctor_id
//         .order("appointment_date", { ascending: true });

//       if (error) {
//         console.error("Error fetching hospital appointments:", error);
//         return;
//       }

//       if (!data || data.length === 0) {
//         setHospitalAppointments([]);
//         return;
//       }

//       // Enrich with time slot and department details
//       const enrichedPromises = data.map(async (apt) => {
//         const { data: slot } = await supabase
//           .from("time_slots")
//           .select("start_time, end_time, slot_type")
//           .eq("id", apt.time_slot_id)
//           .single();

//         const { data: department } = await supabase
//           .from("departments")
//           .select("name, description, facility_id")
//           .eq("id", apt.department_id)
//           .single();

//         const { data: facility } = await supabase
//           .from("facilities")
//           .select("name")
//           .eq("id", apt.facility_id)
//           .single();

//         const { data: documents } = await supabase
//           .from("documents")
//           .select("*")
//           .eq("appointment_id", apt.id)
//           .order("created_at", { ascending: false });

//         const dateOnly = apt.appointment_date?.split("T")[0] || "";
//         const today = new Date().toISOString().split("T")[0];
//         const isPast = dateOnly < today;

//         return {
//           id: apt.id,
//           departmentId: apt.department_id,
//           departmentName: department?.name || "Unknown Department",
//           departmentDescription: department?.description || null,
//           facilityName: facility?.name || "Unknown Facility",
//           facilityId: apt.facility_id,
//           date: dateOnly,
//           time: slot
//             ? `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`
//             : "",
//           type: slot?.slot_type === "tele" ? "teleconsultation" : "in_person",
//           status: apt.status,
//           location: slot?.slot_type === "tele" ? "Online" : facility?.name || "Clinic",
//           consultationFee: apt.consultation_fee,
//           slotStartTime: slot?.start_time || "",
//           slotEndTime: slot?.end_time || "",
//           isPast,
//           cancellationReason: apt.cancellation_reason || null,
//           notes: apt.notes || null,
//           chiefComplaint: apt.chief_complaint || null,
//           completedAt: apt.completed_at || null,
//           documents: documents || [],
//         } as DepartmentAppointment;
//       });

//       const enriched = await Promise.all(enrichedPromises);
//       const uniqueAppointments = Array.from(
//         new Map(enriched.map((a) => [a.id, a])).values()
//       );

//       setHospitalAppointments(uniqueAppointments);
//     } catch (err) {
//       console.error("Error fetching hospital appointments:", err);
//     }
//   };

//   // -------------------------------------------------------------
//   // Filter appointments by status
//   // -------------------------------------------------------------
//   const filterDoctorByStatus = (list: Appointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter((a) => a.status === statusFilter);
//   };

//   const filterHospitalByStatus = (list: DepartmentAppointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter((a) => a.status === statusFilter);
//   };

//   // Filtered lists for upcoming/past tabs
//   const upcomingDoctorAppointments = filterDoctorByStatus(
//     doctorAppointments.filter((a) => !a.isPast)
//   );
//   const pastDoctorAppointments = filterDoctorByStatus(
//     doctorAppointments.filter((a) => a.isPast)
//   );

//   const upcomingHospitalAppointments = filterHospitalByStatus(
//     hospitalAppointments.filter((a) => !a.isPast)
//   );
//   const pastHospitalAppointments = filterHospitalByStatus(
//     hospitalAppointments.filter((a) => a.isPast)
//   );

//   // Combined for "upcoming" and "past" tabs
//   const allUpcoming = [...upcomingDoctorAppointments, ...upcomingHospitalAppointments];
//   const allPast = [...pastDoctorAppointments, ...pastHospitalAppointments];

//   // -------------------------------------------------------------
//   // Video Meeting Functions
//   // -------------------------------------------------------------
//   const handleLeaveMeeting = () => {
//     setVideoMeeting({
//       showMeeting: false,
//       meetingId: "",
//       doctorName: "",
//     });
//   };

//   const getDisplayName = () => {
//     if (profile?.first_name && profile?.last_name) {
//       return `${profile.first_name} ${profile.last_name}`;
//     } else if (profile?.email) {
//       return profile.email;
//     } else {
//       return "Participant";
//     }
//   };

//   const handleJoinVideo = (appointmentId: string) => {
//     const appointment = doctorAppointments.find((apt) => apt.id === appointmentId);
//     if (!appointment) return;

//     if (!apiKey) {
//       toast({
//         title: "Error",
//         description: "Video conferencing is not configured properly",
//       });
//       return;
//     }

//     if (appointment.type !== "teleconsultation") {
//       toast({
//         title: "Cannot Join Meeting",
//         description: "This appointment is not a teleconsultation",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (appointment.status !== "confirmed") {
//       toast({
//         title: "Cannot Join Meeting",
//         description: "Only confirmed appointments can be joined",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!appointment.doctorVerified) {
//       toast({
//         title: "Doctor Not Verified",
//         description: "Doctor verification is pending. Meeting cannot be started.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const meetingId = appointment.videoRoomId || `appointment-${appointment.id}`;

//     setVideoMeeting({
//       showMeeting: true,
//       meetingId: meetingId,
//       doctorName: appointment.doctorName,
//     });
//   };

//   // Show video meeting if active
//   if (videoMeeting.showMeeting) {
//     return (
//       <div className="inset-0 bg-white">
//         <VideoMeeting
//           isHost={false}
//           apiKey={apiKey}
//           meetingId={videoMeeting.meetingId}
//           name={getDisplayName()}
//           onMeetingLeave={handleLeaveMeeting}
//           micEnabled={true}
//           webcamEnabled={true}
//           containerId="video-container"
//           meetingTitle={`Consultation with ${videoMeeting.doctorName}`}
//         />
//       </div>
//     );
//   }

//   // -------------------------------------------------------------
//   // Render
//   // -------------------------------------------------------------
//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

//       {/* Main Tabs */}
//       <div className="flex gap-3 mb-4 border-b pb-2">
//         <Button
//           variant={activeTab === "upcoming" ? "default" : "outline"}
//           onClick={() => setActiveTab("upcoming")}
//           className={activeTab === "upcoming" ? "bg-blue-600" : ""}
//         >
//           Upcoming ({allUpcoming.length})
//         </Button>
//         <Button
//           variant={activeTab === "past" ? "default" : "outline"}
//           onClick={() => setActiveTab("past")}
//           className={activeTab === "past" ? "bg-gray-600" : ""}
//         >
//           Past ({allPast.length})
//         </Button>
//         <Button
//           variant={activeTab === "doctor" ? "default" : "outline"}
//           onClick={() => setActiveTab("doctor")}
//           className={activeTab === "doctor" ? "bg-green-600" : "border-green-200 text-green-700"}
//         >
//           👨‍⚕️ Doctor ({doctorAppointments.length})
//         </Button>
//         <Button
//           variant={activeTab === "hospital" ? "default" : "outline"}
//           onClick={() => setActiveTab("hospital")}
//           className={activeTab === "hospital" ? "bg-blue-600" : "border-blue-200 text-blue-700"}
//         >
//           🏥 Hospital ({hospitalAppointments.length})
//         </Button>
//       </div>

//       {/* Status Filter - Show for all tabs except maybe hide for specific ones */}
//       <div className="flex gap-2 mb-6">
//         {["all", "confirmed", "cancelled", "completed"].map((s) => (
//           <Button
//             key={s}
//             size="sm"
//             variant={statusFilter === s ? "default" : "outline"}
//             onClick={() => setStatusFilter(s as any)}
//           >
//             {s.charAt(0).toUpperCase() + s.slice(1)}
//           </Button>
//         ))}
//       </div>

//       {/* UPCOMING TAB - Shows both doctor and hospital appointments */}
//       {activeTab === "upcoming" && (
//         <div className="space-y-4">
//           {allUpcoming.length === 0 ? (
//             <p className="text-muted-foreground">No upcoming appointments found</p>
//           ) : (
//             <>
//               {/* Doctor Appointments in Green */}
//               {upcomingDoctorAppointments.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                     Doctor Appointments
//                   </h3>
//                   {upcomingDoctorAppointments.map((apt) => (
//                     <div key={apt.id} className="mb-4">
//                       <AppointmentCard
//                         appointment={apt}
//                         userRole="patient"
//                         onJoinVideo={() => handleJoinVideo(apt.id)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Hospital Appointments in Blue */}
//               {upcomingHospitalAppointments.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     Hospital Appointments
//                   </h3>
//                   {upcomingHospitalAppointments.map((apt) => (
//                     <div key={apt.id} className="mb-4">
//                       <AppointmentDepartmentsCard
//                         appointment={apt}
//                         userRole="patient"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* PAST TAB - Shows both doctor and hospital appointments */}
//       {activeTab === "past" && (
//         <div className="space-y-4">
//           {allPast.length === 0 ? (
//             <p className="text-muted-foreground">No past appointments found</p>
//           ) : (
//             <>
//               {/* Doctor Appointments in Green */}
//               {pastDoctorAppointments.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                     Doctor Appointments
//                   </h3>
//                   {pastDoctorAppointments.map((apt) => (
//                     <div key={apt.id} className="mb-4">
//                       <AppointmentCard
//                         appointment={apt}
//                         userRole="patient"
//                         onJoinVideo={() => {}}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Hospital Appointments in Blue */}
//               {pastHospitalAppointments.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     Hospital Appointments
//                   </h3>
//                   {pastHospitalAppointments.map((apt) => (
//                     <div key={apt.id} className="mb-4">
//                       <AppointmentDepartmentsCard
//                         appointment={apt}
//                         userRole="patient"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* DOCTOR TAB - Shows ONLY doctor appointments */}
//       {activeTab === "doctor" && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//             All Doctor Appointments
//           </h3>
//           {filterDoctorByStatus(doctorAppointments).length === 0 ? (
//             <p className="text-muted-foreground">No doctor appointments found</p>
//           ) : (
//             filterDoctorByStatus(doctorAppointments).map((apt) => (
//               <div key={apt.id} className="mb-4">
//                 <AppointmentCard
//                   appointment={apt}
//                   userRole="patient"
//                   onJoinVideo={() => handleJoinVideo(apt.id)}
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* HOSPITAL TAB - Shows ONLY hospital/department appointments */}
//       {activeTab === "hospital" && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
//             <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//             All Hospital Appointments
//           </h3>
//           {filterHospitalByStatus(hospitalAppointments).length === 0 ? (
//             <p className="text-muted-foreground">No hospital appointments found</p>
//           ) : (
//             filterHospitalByStatus(hospitalAppointments).map((apt) => (
//               <div key={apt.id} className="mb-4">
//                 <AppointmentDepartmentsCard
//                   appointment={apt}
//                   userRole="patient"
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// ========================================
// AppointmentManagement.tsx (Patient) - Updated with Current Appointments First
// Patient Appointment Page (Upcoming + Past + Doctor + Hospital)
// ========================================

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AppointmentCard from "./AppointmentCard";
import AppointmentDepartmentsCard from "./AppointmentDepartmentsCard";
import VideoMeeting from "../VideoMeeting";
import { Button } from "@/components/ui/button";

// ------------------------
// Types for safety & clarity
// ------------------------
export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // yyyy-mm-dd
  time: string; // "10:00 - 10:30"
  type: "teleconsultation" | "in_person";
  status: "confirmed" | "cancelled" | "completed";
  location: string;
  consultationFee: number | null;
  doctorImage?: string;
  doctorId: string;
  doctorVerified: boolean;
  slotStartTime: string; // (HH:MM format)
  slotEndTime: string; // (HH:MM format)
  doctorAvatar: string | null;
  cancellationReason?: string | null;
  notes?: string | null;
  isPast: boolean;
  videoRoomId?: string; // This is the meeting ID
  documents?: Document[];
  appointmentDateTime?: Date; // For sorting
}

// New interface for department/hospital appointments
export interface DepartmentAppointment {
  id: string;
  departmentId: string;
  departmentName: string;
  departmentDescription?: string;
  facilityName: string;
  facilityId: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  status: "confirmed" | "cancelled" | "completed";
  location: string;
  consultationFee: number | null;
  slotStartTime: string;
  slotEndTime: string;
  isPast: boolean;
  cancellationReason?: string | null;
  notes?: string | null;
  chiefComplaint?: string | null;
  completedAt?: string | null;
  documents?: Document[];
  appointmentDateTime?: Date; // For sorting
}

interface VideoMeetingState {
  showMeeting: boolean;
  meetingId: string;
  doctorName: string;
}

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  uploaded_by: string;
  uploader_role: string;
}

// ------------------------
// Helper function
// ------------------------
const to12Hour = (time: string) => {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

// Helper function to create full datetime object for sorting
const createFullDateTime = (date: string, time: string) => {
  // Extract start time from time range (e.g., "10:00 - 10:30" -> "10:00")
  const startTime = time.split(" - ")[0];
  
  // Convert to 24-hour format for Date constructor
  const [timeStr, period] = startTime.split(" ");
  let [hours, minutes] = timeStr.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
};

// ------------------------
// Component
// ------------------------
export default function AppointmentManagement() {
  const { toast } = useToast();
  
  // Separate state for different appointment types
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [hospitalAppointments, setHospitalAppointments] = useState<DepartmentAppointment[]>([]);
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "doctor" | "hospital">("upcoming");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "cancelled" | "completed"
  >("all");

  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    doctorName: "",
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  // Load appointments when screen opens
  useEffect(() => {
    fetchDoctorAppointments();
    fetchHospitalAppointments();
  }, []);

  // -------------------------------------------------------------
  // Fetch DOCTOR appointments (with doctor_id)
  // -------------------------------------------------------------
  const fetchDoctorAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, user_id, first_name, last_name, email")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Get doctor appointments (with doctor_id and not null)
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          doctor_id,
          doctor_name,
          appointment_date,
          time_slot_id,
          status,
          type,
          consultation_fee,
          reason,
          cancellation_reason,
          notes,
          video_room_id
        `
        )
        .eq("patient_id", user.id)
        .not("doctor_id", "is", null) // Only appointments with doctor_id
        .order("appointment_date", { ascending: true });

      if (error) {
        console.error("Error fetching doctor appointments:", error);
        return;
      }

      if (!data || data.length === 0) {
        setDoctorAppointments([]);
        return;
      }

      // Enrich with time slot details
      const enrichedPromises = data.map(async (apt) => {
        const { data: slot } = await supabase
          .from("time_slots")
          .select("start_time, end_time, slot_type")
          .eq("id", apt.time_slot_id)
          .single();

        const { data: doctorVerification } = await supabase
          .from("medical_professionals")
          .select("is_verified")
          .eq("user_id", apt.doctor_id)
          .single();

        const { data: doctorProfile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("user_id", apt.doctor_id)
          .single();

        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .eq("appointment_id", apt.id)
          .order("created_at", { ascending: false });

        const dateOnly = apt.appointment_date?.split("T")[0] || "";
        const today = new Date().toISOString().split("T")[0];
        const isPast = dateOnly < today;
        
        // Format time string
        const timeString = slot
          ? `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`
          : "";

        const appointment = {
          id: apt.id,
          doctorName: apt.doctor_name,
          specialty: apt.reason ?? "Consultation",
          date: dateOnly,
          time: timeString,
          type: slot?.slot_type === "tele" ? "teleconsultation" : "in_person",
          status: apt.status,
          location: slot?.slot_type === "tele" ? "Online" : "Clinic",
          consultationFee: apt.consultation_fee,
          doctorImage: "/doctor-placeholder.png",
          doctorId: apt.doctor_id,
          doctorVerified: doctorVerification?.is_verified || false,
          slotStartTime: slot?.start_time || "",
          slotEndTime: slot?.end_time || "",
          doctorAvatar: doctorProfile?.avatar_url || null,
          cancellationReason: apt.cancellation_reason || null,
          notes: apt.notes || null,
          isPast,
          videoRoomId: apt.video_room_id,
          documents: documents || [],
          appointmentDateTime: createFullDateTime(dateOnly, timeString)
        } as Appointment;

        return appointment;
      });

      const enriched = await Promise.all(enrichedPromises);
      const uniqueAppointments = Array.from(
        new Map(enriched.map((a) => [a.id, a])).values()
      );

      setDoctorAppointments(uniqueAppointments);
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
    }
  };

  // -------------------------------------------------------------
  // Fetch HOSPITAL/DEPARTMENT appointments (with department_id, no doctor_id)
  // -------------------------------------------------------------
  const fetchHospitalAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get department appointments (with department_id and no doctor_id)
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          department_id,
          facility_id,
          appointment_date,
          time_slot_id,
          status,
          type,
          consultation_fee,
          chief_complaint,
          notes,
          cancellation_reason,
          completed_at
        `
        )
        .eq("patient_id", user.id)
        .not("department_id", "is", null)
        .is("doctor_id", null) // Ensure no doctor_id
        .order("appointment_date", { ascending: true });

      if (error) {
        console.error("Error fetching hospital appointments:", error);
        return;
      }

      if (!data || data.length === 0) {
        setHospitalAppointments([]);
        return;
      }

      // Enrich with time slot and department details
      const enrichedPromises = data.map(async (apt) => {
        const { data: slot } = await supabase
          .from("time_slots")
          .select("start_time, end_time, slot_type")
          .eq("id", apt.time_slot_id)
          .single();

        const { data: department } = await supabase
          .from("departments")
          .select("name, description, facility_id")
          .eq("id", apt.department_id)
          .single();

        const { data: facility } = await supabase
          .from("facilities")
          .select("name")
          .eq("id", apt.facility_id)
          .single();

        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .eq("appointment_id", apt.id)
          .order("created_at", { ascending: false });

        const dateOnly = apt.appointment_date?.split("T")[0] || "";
        const today = new Date().toISOString().split("T")[0];
        const isPast = dateOnly < today;
        
        // Format time string
        const timeString = slot
          ? `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`
          : "";

        const appointment = {
          id: apt.id,
          departmentId: apt.department_id,
          departmentName: department?.name || "Unknown Department",
          departmentDescription: department?.description || null,
          facilityName: facility?.name || "Unknown Facility",
          facilityId: apt.facility_id,
          date: dateOnly,
          time: timeString,
          type: slot?.slot_type === "tele" ? "teleconsultation" : "in_person",
          status: apt.status,
          location: slot?.slot_type === "tele" ? "Online" : facility?.name || "Clinic",
          consultationFee: apt.consultation_fee,
          slotStartTime: slot?.start_time || "",
          slotEndTime: slot?.end_time || "",
          isPast,
          cancellationReason: apt.cancellation_reason || null,
          notes: apt.notes || null,
          chiefComplaint: apt.chief_complaint || null,
          completedAt: apt.completed_at || null,
          documents: documents || [],
          appointmentDateTime: createFullDateTime(dateOnly, timeString)
        } as DepartmentAppointment;

        return appointment;
      });

      const enriched = await Promise.all(enrichedPromises);
      const uniqueAppointments = Array.from(
        new Map(enriched.map((a) => [a.id, a])).values()
      );

      setHospitalAppointments(uniqueAppointments);
    } catch (err) {
      console.error("Error fetching hospital appointments:", err);
    }
  };

  // -------------------------------------------------------------
  // Filter and Sort appointments
  // -------------------------------------------------------------
  const filterDoctorByStatus = (list: Appointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  };

  const filterHospitalByStatus = (list: DepartmentAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  };

  // Sort function to put current/upcoming appointments first
  const sortByDateTime = <T extends { appointmentDateTime?: Date }>(a: T, b: T) => {
    if (!a.appointmentDateTime || !b.appointmentDateTime) return 0;
    return a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime();
  };

  // Filtered and sorted lists for upcoming/past tabs
  const upcomingDoctorAppointments = filterDoctorByStatus(
    doctorAppointments.filter((a) => !a.isPast)
  ).sort(sortByDateTime);

  const pastDoctorAppointments = filterDoctorByStatus(
    doctorAppointments.filter((a) => a.isPast)
  ).sort((a, b) => {
    // For past appointments, show most recent first (descending)
    if (!a.appointmentDateTime || !b.appointmentDateTime) return 0;
    return b.appointmentDateTime.getTime() - a.appointmentDateTime.getTime();
  });

  const upcomingHospitalAppointments = filterHospitalByStatus(
    hospitalAppointments.filter((a) => !a.isPast)
  ).sort(sortByDateTime);

  const pastHospitalAppointments = filterHospitalByStatus(
    hospitalAppointments.filter((a) => a.isPast)
  ).sort((a, b) => {
    // For past appointments, show most recent first (descending)
    if (!a.appointmentDateTime || !b.appointmentDateTime) return 0;
    return b.appointmentDateTime.getTime() - a.appointmentDateTime.getTime();
  });

  // Combined and sorted for "upcoming" and "past" tabs
  const allUpcoming = [...upcomingDoctorAppointments, ...upcomingHospitalAppointments]
    .sort(sortByDateTime);
  
  const allPast = [...pastDoctorAppointments, ...pastHospitalAppointments]
    .sort((a, b) => {
      if (!a.appointmentDateTime || !b.appointmentDateTime) return 0;
      return b.appointmentDateTime.getTime() - a.appointmentDateTime.getTime();
    });

  // Get current date for highlighting
  const today = new Date().toISOString().split('T')[0];

  // -------------------------------------------------------------
  // Video Meeting Functions
  // -------------------------------------------------------------
  const handleLeaveMeeting = () => {
    setVideoMeeting({
      showMeeting: false,
      meetingId: "",
      doctorName: "",
    });
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile?.email) {
      return profile.email;
    } else {
      return "Participant";
    }
  };

  const handleJoinVideo = (appointmentId: string) => {
    const appointment = doctorAppointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Video conferencing is not configured properly",
      });
      return;
    }

    if (appointment.type !== "teleconsultation") {
      toast({
        title: "Cannot Join Meeting",
        description: "This appointment is not a teleconsultation",
        variant: "destructive",
      });
      return;
    }

    if (appointment.status !== "confirmed") {
      toast({
        title: "Cannot Join Meeting",
        description: "Only confirmed appointments can be joined",
        variant: "destructive",
      });
      return;
    }

    if (!appointment.doctorVerified) {
      toast({
        title: "Doctor Not Verified",
        description: "Doctor verification is pending. Meeting cannot be started.",
        variant: "destructive",
      });
      return;
    }

    const meetingId = appointment.videoRoomId || `appointment-${appointment.id}`;

    setVideoMeeting({
      showMeeting: true,
      meetingId: meetingId,
      doctorName: appointment.doctorName,
    });
  };

  // Show video meeting if active
  if (videoMeeting.showMeeting) {
    return (
      <div className="inset-0 bg-white">
        <VideoMeeting
          isHost={false}
          apiKey={apiKey}
          meetingId={videoMeeting.meetingId}
          name={getDisplayName()}
          onMeetingLeave={handleLeaveMeeting}
          micEnabled={true}
          webcamEnabled={true}
          containerId="video-container"
          meetingTitle={`Consultation with ${videoMeeting.doctorName}`}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {/* Main Tabs */}
      <div className="flex gap-3 mb-4 border-b pb-2">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
          className={activeTab === "upcoming" ? "bg-blue-600" : ""}
        >
          Upcoming ({allUpcoming.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
          className={activeTab === "past" ? "bg-gray-600" : ""}
        >
          Past ({allPast.length})
        </Button>
        <Button
          variant={activeTab === "doctor" ? "default" : "outline"}
          onClick={() => setActiveTab("doctor")}
          className={activeTab === "doctor" ? "bg-green-600" : "border-green-200 text-green-700"}
        >
          👨‍⚕️ Doctor ({doctorAppointments.length})
        </Button>
        <Button
          variant={activeTab === "hospital" ? "default" : "outline"}
          onClick={() => setActiveTab("hospital")}
          className={activeTab === "hospital" ? "bg-blue-600" : "border-blue-200 text-blue-700"}
        >
          🏥 Hospital ({hospitalAppointments.length})
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {["all", "confirmed", "cancelled", "completed"].map((s) => (
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

      {/* Today's date indicator */}
      <div className="mb-4 text-sm text-gray-500">
        Today: {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      {/* UPCOMING TAB - Shows both doctor and hospital appointments */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {allUpcoming.length === 0 ? (
            <p className="text-muted-foreground">No upcoming appointments found</p>
          ) : (
            <>
              {/* Doctor Appointments in Green */}
              {upcomingDoctorAppointments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Doctor Appointments
                  </h3>
                  {upcomingDoctorAppointments.map((apt) => (
                    <div key={apt.id} className="mb-4">
                      {apt.date === today && (
                        <div className="mb-1 text-xs font-semibold text-orange-500">
                          🔴 TODAY
                        </div>
                      )}
                      <AppointmentCard
                        appointment={apt}
                        userRole="patient"
                        onJoinVideo={() => handleJoinVideo(apt.id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Hospital Appointments in Blue */}
              {upcomingHospitalAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Hospital Appointments
                  </h3>
                  {upcomingHospitalAppointments.map((apt) => (
                    <div key={apt.id} className="mb-4">
                      {apt.date === today && (
                        <div className="mb-1 text-xs font-semibold text-orange-500">
                          🔴 TODAY
                        </div>
                      )}
                      <AppointmentDepartmentsCard
                        appointment={apt}
                        userRole="patient"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PAST TAB - Shows both doctor and hospital appointments */}
      {activeTab === "past" && (
        <div className="space-y-4">
          {allPast.length === 0 ? (
            <p className="text-muted-foreground">No past appointments found</p>
          ) : (
            <>
              {/* Doctor Appointments in Green */}
              {pastDoctorAppointments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Doctor Appointments
                  </h3>
                  {pastDoctorAppointments.map((apt) => (
                    <div key={apt.id} className="mb-4">
                      <AppointmentCard
                        appointment={apt}
                        userRole="patient"
                        onJoinVideo={() => {}}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Hospital Appointments in Blue */}
              {pastHospitalAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Hospital Appointments
                  </h3>
                  {pastHospitalAppointments.map((apt) => (
                    <div key={apt.id} className="mb-4">
                      <AppointmentDepartmentsCard
                        appointment={apt}
                        userRole="patient"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* DOCTOR TAB - Shows ONLY doctor appointments */}
      {activeTab === "doctor" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            All Doctor Appointments
          </h3>
          
          {/* Upcoming Doctor Appointments */}
          {upcomingDoctorAppointments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 text-gray-600">Upcoming</h4>
              {upcomingDoctorAppointments.map((apt) => (
                <div key={apt.id} className="mb-4">
                  {apt.date === today && (
                    <div className="mb-1 text-xs font-semibold text-orange-500">
                      🔴 TODAY
                    </div>
                  )}
                  <AppointmentCard
                    appointment={apt}
                    userRole="patient"
                    onJoinVideo={() => handleJoinVideo(apt.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Past Doctor Appointments */}
          {pastDoctorAppointments.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2 text-gray-600">Past</h4>
              {pastDoctorAppointments.map((apt) => (
                <div key={apt.id} className="mb-4">
                  <AppointmentCard
                    appointment={apt}
                    userRole="patient"
                    onJoinVideo={() => {}}
                  />
                </div>
              ))}
            </div>
          )}

          {filterDoctorByStatus(doctorAppointments).length === 0 && (
            <p className="text-muted-foreground">No doctor appointments found</p>
          )}
        </div>
      )}

      {/* HOSPITAL TAB - Shows ONLY hospital/department appointments */}
      {activeTab === "hospital" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            All Hospital Appointments
          </h3>

          {/* Upcoming Hospital Appointments */}
          {upcomingHospitalAppointments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 text-gray-600">Upcoming</h4>
              {upcomingHospitalAppointments.map((apt) => (
                <div key={apt.id} className="mb-4">
                  {apt.date === today && (
                    <div className="mb-1 text-xs font-semibold text-orange-500">
                      🔴 TODAY
                    </div>
                  )}
                  <AppointmentDepartmentsCard
                    appointment={apt}
                    userRole="patient"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Past Hospital Appointments */}
          {pastHospitalAppointments.length > 0 && (
            <div>
              {/* <h4 className="text-md font-medium mb-2 text-gray-600">Past</h4> */}
              {pastHospitalAppointments.map((apt) => (
                <div key={apt.id} className="mb-4">
                  <AppointmentDepartmentsCard
                    appointment={apt}
                    userRole="patient"
                  />
                </div>
              ))}
            </div>
          )}

          {filterHospitalByStatus(hospitalAppointments).length === 0 && (
            <p className="text-muted-foreground">No hospital appointments found</p>
          )}
        </div>
      )}
    </div>
  );
}