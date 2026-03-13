
// // // ========================================
// // // FacilityAppointmentManagement.tsx
// // // ========================================

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/integrations/supabase/client";
// // import { Button } from "@/components/ui/button";
// // import VideoMeeting from "../VideoMeeting";
// // import FacilityAppointmentCard from "./FacilityAppointmentCard";

// // interface DepartmentInfo {
// //   id: string;
// //   name: string;
// //   description?: string;
// // }
// // import DashboardLayout from "../layouts/DashboardLayout";

// // export interface FacilityAppointment {
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
// //   department_id: string;
// // }

// // interface VideoMeetingState {
// //   showMeeting: boolean;
// //   meetingId: string;
// //   patientName: string;
// // }

// // const to12Hour = (time: string) => {
// //   const [h, m] = time.split(":");
// //   const hour = Number(h);
// //   const suffix = hour >= 12 ? "PM" : "AM";
// //   const hour12 = hour % 12 || 12;
// //   return `${hour12}:${m} ${suffix}`;
// // };

// // export default function FacilityAppointmentManagement() {
// //   const [appointments, setAppointments] = useState<FacilityAppointment[]>([]);
// //   const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
// //   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
// //   const [statusFilter, setStatusFilter] = useState<
// //     "all" | "confirmed" | "cancelled"
// //   >("all");

// //   // Video meeting state moved to parent
// //   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
// //     showMeeting: false,
// //     meetingId: "",
// //     patientName: "",
// //   });

// //   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

// //   useEffect(() => {
// //     fetchAppointments();
// //     fetchDepartments();
// //   }, []);

// //   const fetchDepartments = async () => {
// //     const { data, error } = await supabase
// //       .from("departments")
// //       .select("id, name, description");
// //     if (!error && data) setDepartments(data);
// //   };

// //   const fetchAppointments = async () => {
// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser();
// //     if (!user) return;

// //     const { data: profiles } = await supabase
// //       .from("profiles")
// //       .select("user_id, role")
// //       .eq("user_id", user.id);

// //     if (!profiles || profiles[0]?.role !== "hospital_admin") return;

// //     const { data: appts } = await supabase
// //       .from("appointments")
// //       .select(
// //         `
// //         id,
// //         patient_id,
// //         appointment_date,
// //         time_slot_id,
// //         type,
// //         status,
// //         notes,
// //         video_room_id,
// //         department_id
// //       `
// //       )
// //       .eq("department_id", user.id)
// //       .order("appointment_date", { ascending: true });

// //     if (!appts) return;

// //     const patientIds = [...new Set(appts.map((a) => a.patient_id))];

// //     const { data: patients } = await supabase
// //       .from("profiles")
// //       .select("user_id, first_name, last_name, avatar_url")
// //       .in("user_id", patientIds);

// //     const patientMap = new Map(
// //       patients?.map((p) => [p.user_id, `${p.first_name} ${p.last_name}`])
// //     );
// //     const patientAvatarMap = new Map(
// //       patients?.map((p) => [p.user_id, p.avatar_url])
// //     );

// //     const enriched:FacilityAppointment[] = [];

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
// //         patientId: apt.patient_id,
// //         department_id: user.id,
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

// //   const filterByStatus = (list: FacilityAppointment[]) => {
// //     if (statusFilter === "all") return list;
// //     return list.filter((a) => a.status === statusFilter);
// //   };

// //   // Handle starting video meeting
// //   const handleJoinVideo = (appointmentId: string) => {
// //     const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
// //     if (!appointmentData || !apiKey) {
// //       alert("Unable to start video meeting");
// //       return;
// //     }

// //     if (appointmentData.type !== "teleconsultation") {
// //       alert("This appointment is not a teleconsultation");
// //       return;
// //     }

// //     if (appointmentData.status !== "confirmed") {
// //       alert("Only confirmed appointments can be started");
// //       return;
// //     }

// //     const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;
// //     const doctorName = localStorage.getItem("doctorName") || "Doctor";

// //     setVideoMeeting({
// //       showMeeting: true,
// //       meetingId: meetingId,
// //       patientName: appointmentData.patientName,
// //     });
// //   };

// //   const handleLeaveMeeting = () => {
// //     console.log("Doctor leaving meeting");
// //     setVideoMeeting({
// //       showMeeting: false,
// //       meetingId: "",
// //       patientName: "",
// //     });
// //   };

// //   const getDoctorDisplayName = () => {
// //     return localStorage.getItem("doctorName") || "Doctor";
// //   };

// //   const upcoming = filterByStatus(appointments.filter((a) => !a.isPast));
// //   const past = filterByStatus(appointments.filter((a) => a.isPast));

// //   // Show video meeting in parent component
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
// //         />
// //       </div>
// //     );
// //   }

// //   return (
// //     <DashboardLayout userType="facility">
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">My Departments</h2>

// //       <div className="flex gap-3 mb-4">
// //         <Button
// //           variant={activeTab === "upcoming" ? "facility" : "outline"}
// //           onClick={() => setActiveTab("upcoming")}
// //         >
// //           Upcoming
// //         </Button>
// //         <Button
// //           variant={activeTab === "past" ? "facility" : "outline"}
// //           onClick={() => setActiveTab("past")}
// //         >
// //           Past
// //         </Button>
// //       </div>

// //       <div className="flex gap-2 mb-6">
// //         {["all", "confirmed", "cancelled"].map((s) => (
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

// //       {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
// //         <FacilityAppointmentCard
// //           key={apt.id}
// //           appointment={apt}
// //           onRefresh={fetchAppointments}
// //           onJoinVideo={() => handleJoinVideo(apt.id)}
// //           department={departments.find((d) => d.id === apt.department_id) || null}
// //         />
// //       ))}

// //       {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
// //         <p className="text-muted-foreground">No Departments</p>
// //       )}
// //     </div>
// //     </DashboardLayout>
// //   );
// // }


// // ========================================
// // FacilityAppointmentManagement.tsx - Fixed with Department Access Control
// // ========================================

// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import VideoMeeting from "../VideoMeeting";
// import FacilityAppointmentCard from "./FacilityAppointmentCard";
// import DashboardLayout from "../layouts/DashboardLayout";

// interface DepartmentInfo {
//   id: string;
//   name: string;
//   description?: string;
//   head_doctor_id?: string;
//   is_active?: boolean;
// }

// interface UserDepartment {
//   department_id: string;
//   department_name: string;
//   role: 'head' | 'staff' | 'admin';
//   user_id: string;
// }

// export interface FacilityAppointment {
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
//   department_id: string;
//   department_name?: string;
//   doctor_id?: string;
//   doctor_name?: string;
//   facility_id?: string;
// }

// interface VideoMeetingState {
//   showMeeting: boolean;
//   meetingId: string;
//   patientName: string;
// }

// const to12Hour = (time: string) => {
//   const [h, m] = time.split(":");
//   const hour = Number(h);
//   const suffix = hour >= 12 ? "PM" : "AM";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${m} ${suffix}`;
// };

// export default function FacilityAppointmentManagement() {
//   const [appointments, setAppointments] = useState<FacilityAppointment[]>([]);
//   const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
//   const [userDepartments, setUserDepartments] = useState<UserDepartment[]>([]);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
//   const [userRole, setUserRole] = useState<'admin' | 'department_head' | 'staff' | 'department_personnel'>('staff');
//   const [loading, setLoading] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "confirmed" | "cancelled"
//   >("all");

//   // Video meeting state
//   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
//     showMeeting: false,
//     meetingId: "",
//     patientName: "",
//   });

//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

//   useEffect(() => {
//     initializeUserAndData();
//   }, []);

//   const initializeUserAndData = async () => {
//     setLoading(true);
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;
      
//       setCurrentUserId(user.id);

//       // Get user profile to determine role
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("role, user_id")
//         .eq("user_id", user.id)
//         .single();

//       // Check if user is facility admin
//       const { data: facilityAdmin } = await supabase
//         .from("facilities")
//         .select("id")
//         .eq("admin_user_id", user.id)
//         .single();

//       if (facilityAdmin) {
//         setUserRole('admin');
//         // Admin can see all departments and all appointments
//         await fetchAllDepartments();
//         await fetchAllAppointments();
//       } else {
//         // Check if user is associated with any departments
//         const { data: deptStaff } = await supabase
//           .from("staff")
//           .select(`
//             department_id,
//             role,
//             departments!staff_department_id_fkey (
//               id,
//               name,
//               description,
//               head_doctor_id
//             )
//           `)
//           .eq("user_id", user.id);

//         if (deptStaff && deptStaff.length > 0) {
//           const userDepts = deptStaff.map(item => ({
//             department_id: item.department_id,
//             department_name: item.departments?.name || 'Unknown',
//             role: item.role as 'head' | 'staff',
//             user_id: user.id
//           }));
          
//           setUserDepartments(userDepts);
          
//           // Check if user is head of any department
//           const isHead = userDepts.some(d => d.role === 'head');
          
//           // Determine role: head, staff (management), or regular personnel
//           if (isHead) {
//             setUserRole('department_head');
//           } else {
//             // Check if user has management privileges or just regular personnel
//             // For now, default to department_personnel
//             setUserRole('department_personnel');
//           }
          
//           // Fetch only user's departments
//           const userDeptIds = userDepts.map(d => d.department_id);
//           await fetchUserDepartments(userDeptIds);
          
//           // If only one department, auto-select it
//           if (userDeptIds.length === 1) {
//             setSelectedDepartment(userDeptIds[0]);
//           }
          
//           // Fetch appointments based on role
//           await fetchAppointmentsByRole(userDeptIds, user.id, isHead);
//         }
//       }
//     } catch (error) {
//       console.error("Error initializing user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllDepartments = async () => {
//     const { data, error } = await supabase
//       .from("departments")
//       .select("id, name, description, head_doctor_id, is_active")
//       .eq("is_active", true);
    
//     if (!error && data) {
//       setDepartments(data);
//     }
//   };

//   const fetchUserDepartments = async (deptIds: string[]) => {
//     const { data, error } = await supabase
//       .from("departments")
//       .select("id, name, description, head_doctor_id, is_active")
//       .in("id", deptIds)
//       .eq("is_active", true);
    
//     if (!error && data) {
//       setDepartments(data);
//     }
//   };

//   const fetchAllAppointments = async () => {
//      const { data: appts } = await supabase
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
//         video_room_id,
//         department_id,
//       `
//       )
//       .eq("department_id", selectedDepartment)
//       .order("appointment_date", { ascending: true });

//     if (!appts) return;

//     if (!appts) return;
//     await enrichAppointmentsWithPatientData(appts);
//   };

//   // New function to fetch appointments based on user role
//   const fetchAppointmentsByRole = async (deptIds: string[], userId: string, isHead: boolean) => {
//     let query = supabase
//   .from("appointments")
//   .select(`
//     id,
//     patient_id,
//     facility_id,
//     appointment_date,
//     time_slot_id,
//     type,
//     status,
//     department_id,
//     created_at
//   `)
//   .order("appointment_date", { ascending: true });

//     if (isHead) {
//       // Department heads can see all appointments in their departments
//       query = query.in("department_id", deptIds);
//     } else {
//       // Regular department personnel can only see appointments assigned to them
//       query = query
//         .in("department_id", deptIds)
//         .eq("doctor_id", userId); // Assuming doctor_id links to the staff member
//     }

//     const { data: appts, error } = await query;

//     if (!appts) return;
//     await enrichAppointmentsWithPatientData(appts);
//   };

//   const enrichAppointmentsWithPatientData = async (appts: any[]) => {
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

//     const enriched: FacilityAppointment[] = [];

//     for (const apt of appts) {
//       const { data: slot } = await supabase
//         .from("time_slots")
//         .select("start_time, end_time")
//         .eq("id", apt.time_slot_id)
//         .single();

//       if (!slot) continue;

//       const dateOnly = apt.appointment_date.split("T")[0];
//       const today = new Date().toISOString().split("T")[0];
//       const isPast = dateOnly < today;

//       enriched.push({
//         id: apt.id,
//         patientId: apt.patient_id,
//         doctor_id: apt.doctor_id,
//         doctor_name: apt.doctor_name,
//         facility_id: apt.facility_id,
//         department_id: apt.department_id,
//         department_name: apt.departments?.name || 'Unknown Department',
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

//   const filterByStatus = (list: FacilityAppointment[]) => {
//     if (statusFilter === "all") return list;
//     return list.filter((a) => a.status === statusFilter);
//   };

//   const filterByDepartment = (list: FacilityAppointment[]) => {
//     if (selectedDepartment === "all") return list;
//     return list.filter((a) => a.department_id === selectedDepartment);
//   };

//   const handleJoinVideo = (appointmentId: string) => {
//     const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
//     if (!appointmentData || !apiKey) {
//       alert("Unable to start video meeting");
//       return;
//     }

//     if (appointmentData.type !== "teleconsultation") {
//       alert("This appointment is not a teleconsultation");
//       return;
//     }

//     if (appointmentData.status !== "confirmed") {
//       alert("Only confirmed appointments can be started");
//       return;
//     }

//     const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;

//     setVideoMeeting({
//       showMeeting: true,
//       meetingId: meetingId,
//       patientName: appointmentData.patientName,
//     });
//   };

//   const handleLeaveMeeting = () => {
//     console.log("Leaving meeting");
//     setVideoMeeting({
//       showMeeting: false,
//       meetingId: "",
//       patientName: "",
//     });
//   };

//   const getDoctorDisplayName = () => {
//     return localStorage.getItem("doctorName") || "Doctor";
//   };

//   // Apply filters
//   const filteredAppointments = filterByDepartment(filterByStatus(appointments));
//   const upcoming = filteredAppointments.filter((a) => !a.isPast);
//   const past = filteredAppointments.filter((a) => a.isPast);

//   // Show video meeting
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
//         />
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout userType="facility">
//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold">Appointment Management</h2>
//             <p className="text-gray-600 mt-1">
//               {userRole === 'admin' && 'Administrator view - All departments'}
//               {userRole === 'department_head' && 'Department Head view - All appointments in your departments'}
//               {userRole === 'staff' && 'Department Management view - All appointments in your departments'}
//               {userRole === 'department_personnel' && 'Department Personnel view - Your assigned appointments only'}
//             </p>
//           </div>
          
//           {/* Department Filter - Show only if user has multiple departments or is admin */}
//           {(userRole === 'admin' || userDepartments.length > 1) && (
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium">Department:</label>
//               <select
//                 className="border rounded-md px-3 py-2 text-sm"
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//               >
//                 {userRole === 'admin' && (
//                   <option value="all">All Departments</option>
//                 )}
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name} {dept.head_doctor_id === currentUserId ? '(You are Head)' : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <>
//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <p className="text-sm text-blue-600">Total Appointments</p>
//                 <p className="text-2xl font-bold">{filteredAppointments.length}</p>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                 <p className="text-sm text-green-600">Upcoming</p>
//                 <p className="text-2xl font-bold">{upcoming.length}</p>
//               </div>
//               <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//                 <p className="text-sm text-purple-600">
//                   {userRole === 'department_personnel' ? 'My Appointments' : 'Departments'}
//                 </p>
//                 <p className="text-2xl font-bold">
//                   {userRole === 'department_personnel' ? filteredAppointments.length : departments.length}
//                 </p>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-3 mb-4">
//               <Button
//                 variant={activeTab === "upcoming" ? "facility" : "outline"}
//                 onClick={() => setActiveTab("upcoming")}
//               >
//                 Upcoming ({upcoming.length})
//               </Button>
//               <Button
//                 variant={activeTab === "past" ? "facility" : "outline"}
//                 onClick={() => setActiveTab("past")}
//               >
//                 Past ({past.length})
//               </Button>
//             </div>

//             {/* Status Filters */}
//             <div className="flex gap-2 mb-6">
//               {["all", "confirmed", "cancelled"].map((s) => (
//                 <Button
//                   key={s}
//                   size="sm"
//                   variant={statusFilter === s ? "doctor" : "outline"}
//                   onClick={() => setStatusFilter(s as any)}
//                 >
//                   {s.charAt(0).toUpperCase() + s.slice(1)}
//                 </Button>
//               ))}
//             </div>

//             {/* Appointments List */}
//             <div className="space-y-4">
//               {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
//                 <FacilityAppointmentCard
//                   key={apt.id}
//                   appointment={apt}
//                   onRefresh={() => {
//                     if (userRole === 'admin') {
//                       fetchAllAppointments();
//                     } else {
//                       fetchAppointmentsByRole(
//                         userDepartments.map(d => d.department_id),
//                         currentUserId!,
//                         userRole === 'staff'
//                       );
//                     }
//                   }}
//                   onJoinVideo={() => handleJoinVideo(apt.id)}
//                   department={departments.find((d) => d.id === apt.department_id) || null}
//                   // userRole={userRole}
//                   currentUserId={currentUserId || ''}
//                 />
//               ))}

//               {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
//                 <div className="text-center py-12 bg-gray-50 rounded-lg">
//                   <p className="text-gray-500">No appointments found</p>
//                   {selectedDepartment !== "all" && (
//                     <p className="text-sm text-gray-400 mt-2">
//                       Try selecting a different department or filter
//                     </p>
//                   )}
//                   {userRole === 'department_personnel' && (
//                     <p className="text-sm text-gray-400 mt-2">
//                       You can only see appointments assigned to you
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// ========================================
// FacilityAppointmentManagement.tsx - Fixed with Department Access Control
// ========================================

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import VideoMeeting from "../VideoMeeting";
import FacilityAppointmentCard from "./FacilityAppointmentCard";
import DashboardLayout from "../layouts/DashboardLayout";
import { mixpanelInstance } from "@/utils/mixpanel";
import { toast } from "@/hooks/use-toast";

interface DepartmentInfo {
  id: string;
  name: string;
  description?: string;
  head_doctor_id?: string;
  is_active?: boolean;
}

interface UserDepartment {
  department_id: string;
  department_name: string;
  role: 'head' | 'staff' | 'admin' | 'personnel';
  user_id: string;
}

export interface FacilityAppointment {
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
  department_id: string;
  department_name?: string;
  doctor_id?: string;
  doctor_name?: string;
  facility_id?: string;
  time_slot_id?: string;
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

export default function FacilityAppointmentManagement() {
  const [appointments, setAppointments] = useState<FacilityAppointment[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [userDepartments, setUserDepartments] = useState<UserDepartment[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [userRole, setUserRole] = useState<'admin' | 'department_head' | 'staff' | 'personnel'>('personnel');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentFacilityId, setCurrentFacilityId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "cancelled" | "completed"
  >("all");

  // Video meeting state
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    patientName: "",
  });

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  useEffect(() => {
    initializeUserAndData();
  }, []);

  const trackAppointmentAction = (action: string, appointmentData?: any) => {
  mixpanelInstance.track('Facility Appointment Action', {
    action,
    userRole,
    selectedDepartment,
    appointmentId: appointmentData?.id,
    patientName: appointmentData?.patientName,
    appointmentType: appointmentData?.type,
    appointmentStatus: appointmentData?.status,
    ...appointmentData
  });
};

  const initializeUserAndData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      setCurrentUserId(user.id);

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Check if user is facility admin
      const { data: facilityAdmin } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .maybeSingle();

      if (facilityAdmin) {
        setUserRole('admin');
        setCurrentFacilityId(facilityAdmin.id);
        await fetchAllDepartments();
        await fetchAllAppointments(facilityAdmin.id);
      } else {
        // Check if user is associated with any departments through staff table
        const { data: deptStaff, error: staffError } = await supabase
          .from("staff")
          .select(`
            id,
            department_id,
            role,
            departments!staff_department_id_fkey (
              id,
              name,
              description,
              head_doctor_id,
              facility_id,
              is_active
            )
          `)
          .eq("user_id", user.id)
          .eq("departments.is_active", true);

        if (deptStaff && deptStaff.length > 0) {
          const userDepts: UserDepartment[] = deptStaff.map(item => ({
            department_id: item.department_id,
            department_name: item.departments?.name || 'Unknown',
            role: item.role as 'head' | 'staff' | 'personnel',
            user_id: user.id
          }));
          
          setUserDepartments(userDepts);
          
          // Set facility ID from first department
          if (deptStaff[0]?.departments?.facility_id) {
            setCurrentFacilityId(deptStaff[0].departments.facility_id);
          }
          
          // Check if user is head of any department
          const isHead = userDepts.some(d => d.role === 'head');
          const isManagement = userDepts.some(d => d.role === 'staff');
          
          // Determine role
          if (isHead) {
            setUserRole('department_head');
          } else if (isManagement) {
            setUserRole('staff');
          } else {
            setUserRole('personnel');
          }
          
          // Fetch user's departments
          const userDeptIds = userDepts.map(d => d.department_id);
          const { data: deptData } = await supabase
            .from("departments")
            .select("id, name, description, head_doctor_id, is_active")
            .in("id", userDeptIds)
            .eq("is_active", true);
          
          if (deptData) {
            setDepartments(deptData);
          }
          
          // If only one department, auto-select it
          if (userDeptIds.length === 1) {
            setSelectedDepartment(userDeptIds[0]);
          }
          
          // Fetch appointments based on role
          await fetchAppointmentsByRole(userDeptIds, user.id, isHead);
        } else {
          // No departments assigned
          setDepartments([]);
          setAppointments([]);
        }
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("id, name, description, head_doctor_id, is_active")
      .eq("is_active", true);
    
    if (!error && data) {
      setDepartments(data);
    }
  };

  const fetchAllAppointments = async (facilityId: string) => {
    try {
      // First get all departments for this facility
      const { data: deptData } = await supabase
        .from("departments")
        .select("id")
        .eq("facility_id", facilityId)
        .eq("is_active", true);

      if (!deptData || deptData.length === 0) {
        setAppointments([]);
        return;
      }

      const deptIds = deptData.map(d => d.id);
      
      // Build query based on selected department
      let query = supabase
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
          department_id,
          doctor_id,
          facility_id
        `);

      if (selectedDepartment !== "all") {
        query = query.eq("department_id", selectedDepartment);
      } else {
        query = query.in("department_id", deptIds);
      }

      const { data: appts, error } = await query.order("appointment_date", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      if (!appts || appts.length === 0) {
        setAppointments([]);
        return;
      }

      await enrichAppointmentsWithPatientData(appts);
    } catch (error) {
      console.error("Error in fetchAllAppointments:", error);
    }
  };

  const fetchAppointmentsByRole = async (deptIds: string[], userId: string, isHead: boolean) => {
    try {
      let query = supabase
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
          department_id,
          doctor_id,
          facility_id
        `);

      // Apply department filter
      if (selectedDepartment !== "all") {
        query = query.eq("department_id", selectedDepartment);
      } else {
        query = query.in("department_id", deptIds);
      }

      if (!isHead) {
        // Regular personnel can only see appointments assigned to them
        query = query.eq("doctor_id", userId);
      }

      const { data: appts, error } = await query.order("appointment_date", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      if (!appts || appts.length === 0) {
        setAppointments([]);
        return;
      }

      await enrichAppointmentsWithPatientData(appts);
    } catch (error) {
      console.error("Error in fetchAppointmentsByRole:", error);
    }
  };

  const enrichAppointmentsWithPatientData = async (appts: any[]) => {
    try {
      const patientIds = [...new Set(appts.map((a) => a.patient_id))];

      const { data: patients } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", patientIds);

      const patientMap = new Map(
        patients?.map((p) => [p.user_id, `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown Patient'])
      );
      
      const patientAvatarMap = new Map(
        patients?.map((p) => [p.user_id, p.avatar_url])
      );

      // Get department names
      const deptIds = [...new Set(appts.map((a) => a.department_id))];
      const { data: deptData } = await supabase
        .from("departments")
        .select("id, name")
        .in("id", deptIds);

      const deptNameMap = new Map(
        deptData?.map((d) => [d.id, d.name])
      );

      const enriched: FacilityAppointment[] = [];

      for (const apt of appts) {
        // Get time slot details
        const { data: slot } = await supabase
          .from("time_slots")
          .select("start_time, end_time")
          .eq("id", apt.time_slot_id)
          .maybeSingle();

        if (!slot) continue;

        const dateOnly = apt.appointment_date.split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        const isPast = dateOnly < today;

        enriched.push({
          id: apt.id,
          patientId: apt.patient_id,
          doctor_id: apt.doctor_id,
          doctor_name: apt.doctor_name,
          facility_id: apt.facility_id,
          department_id: apt.department_id,
          department_name: deptNameMap.get(apt.department_id) || 'Unknown Department',
          patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
          date: dateOnly,
          time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
          type: apt.type,
          status: apt.status,
          isPast,
          notes: apt.notes,
          videoRoomId: apt.video_room_id,
          patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
          time_slot_id: apt.time_slot_id
        });
      }

      setAppointments(enriched);
    } catch (error) {
      console.error("Error enriching appointments:", error);
    }
  };

  const filterByStatus = (list: FacilityAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  };

  const filterByDepartment = (list: FacilityAppointment[]) => {
    if (selectedDepartment === "all") return list;
    return list.filter((a) => a.department_id === selectedDepartment);
  };

  const handleJoinVideo = (appointmentId: string) => {
    const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    trackAppointmentAction('join_video', appointmentData);
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
      meetingId: meetingId,
      patientName: appointmentData.patientName,
    });
  };

  const handleLeaveMeeting = () => {
    console.log("Leaving meeting");
    setVideoMeeting({
      showMeeting: false,
      meetingId: "",
      patientName: "",
    });
  };

  const getDoctorDisplayName = () => {
    return localStorage.getItem("doctorName") || "Doctor";
  };

  const refreshAppointments = async () => {
    setLoading(true);
    try {
      if (userRole === 'admin' && currentFacilityId) {
        await fetchAllAppointments(currentFacilityId);
      } else if (userDepartments.length > 0) {
        await fetchAppointmentsByRole(
          userDepartments.map(d => d.department_id),
          currentUserId!,
          userRole === 'department_head'
        );
      }
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle department change
  useEffect(() => {
    if (!loading && currentUserId) {
      refreshAppointments();
    }
  }, [selectedDepartment]);
  // Add to tab changes
const handleTabChange = (tab: "upcoming" | "past") => {
  trackAppointmentAction('tab_change', { tab, fromTab: activeTab });
  setActiveTab(tab);
};

// Add to filter changes
const handleStatusFilterChange = (filter: string) => {
  trackAppointmentAction('status_filter_change', { filter, fromFilter: statusFilter });
  setStatusFilter(filter as any);
};

// Add to department filter
const handleDepartmentFilterChange = (deptId: string) => {
  trackAppointmentAction('department_filter_change', { 
    departmentId: deptId, 
    fromDepartment: selectedDepartment 
  });
  setSelectedDepartment(deptId);
};

// Add to refresh button
const handleRefresh = () => {
  trackAppointmentAction('refresh_data');
  refreshAppointments();
};

  // Apply filters
  const filteredAppointments = filterByDepartment(filterByStatus(appointments));
  const upcoming = filteredAppointments.filter((a) => !a.isPast);
  const past = filteredAppointments.filter((a) => a.isPast);

  // Show video meeting
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
    // <DashboardLayout userType="facility">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Appointment Management</h2>
            <p className="text-gray-600 mt-1">
              {userRole === 'admin' && 'Administrator view - All departments'}
              {userRole === 'department_head' && 'Department Head view - All appointments in your departments'}
              {userRole === 'staff' && 'Department Management view - All appointments in your departments'}
              {userRole === 'personnel' && 'Department Personnel view - Your assigned appointments only'}
            </p>
          </div>
          
          {/* Department Filter - Show only if user has multiple departments or is admin */}
          {(userRole === 'admin' || departments.length > 1) && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Department:</label>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {userRole === 'admin' && (
                  <option value="all">All Departments</option>
                )}
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} {dept.head_doctor_id === currentUserId ? '(You are Head)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Total Appointments</p>
                <p className="text-2xl font-bold">{filteredAppointments.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Upcoming</p>
                <p className="text-2xl font-bold">{upcoming.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600">
                  {userRole === 'personnel' ? 'My Appointments' : 'Departments'}
                </p>
                <p className="text-2xl font-bold">
                  {userRole === 'personnel' ? filteredAppointments.length : departments.length}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              <Button
                variant={activeTab === "upcoming" ? "facility" : "outline"}
                onClick={() => {trackAppointmentAction('tab_change', { tab: "upcoming", fromTab: activeTab }); setActiveTab("upcoming")}}
              >
                Upcoming ({upcoming.length})
              </Button>
              <Button
                variant={activeTab === "past" ? "facility" : "outline"}
                onClick={() => {trackAppointmentAction('tab_change', { tab: "past", fromTab: activeTab }); setActiveTab("past")}}
              >
                Past ({past.length})
              </Button>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mb-6">
              {["all", "confirmed", "cancelled", "completed"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "doctor" : "outline"}
                  onClick={() => {trackAppointmentAction('status_filter_change', { filter: s, fromFilter: statusFilter }); setStatusFilter(s as any)}}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
                <FacilityAppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onRefresh={refreshAppointments}
                  onJoinVideo={() => handleJoinVideo(apt.id)}
                  department={departments.find((d) => d.id === apt.department_id) || null}
                  userRole={userRole === 'staff' ? 'department_staff' : 
          userRole === 'personnel' ? 'department_personnel' : 
          userRole === 'department_head' ? 'department_head' : 'admin'}
                  currentUserId={currentUserId || ''}
                />
              ))}

              {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No appointments found</p>
                  {selectedDepartment !== "all" && (
                    <p className="text-sm text-gray-400 mt-2">
                      Try selecting a different department or filter
                    </p>
                  )}
                  {userRole === 'personnel' && (
                    <p className="text-sm text-gray-400 mt-2">
                      You can only see appointments assigned to you
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    // </DashboardLayout>
  );
}