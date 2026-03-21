
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

// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import VideoMeeting from "../VideoMeeting";
// import FacilityAppointmentCard from "./FacilityAppointmentCard";
// import DashboardLayout from "../layouts/DashboardLayout";
// import { mixpanelInstance } from "@/utils/mixpanel";
// import { toast } from "@/hooks/use-toast";

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
//   role: 'head' | 'staff' | 'admin' | 'personnel';
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
//   time_slot_id?: string;
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
//   const [userRole, setUserRole] = useState<'admin' | 'department_head' | 'staff' | 'personnel'>('personnel');
//   const [loading, setLoading] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [currentFacilityId, setCurrentFacilityId] = useState<string | null>(null);
  
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "confirmed" | "cancelled" | "completed"
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

//   const trackAppointmentAction = (action: string, appointmentData?: any) => {
//   mixpanelInstance.track('Facility Appointment Action', {
//     action,
//     userRole,
//     selectedDepartment,
//     appointmentId: appointmentData?.id,
//     patientName: appointmentData?.patientName,
//     appointmentType: appointmentData?.type,
//     appointmentStatus: appointmentData?.status,
//     ...appointmentData
//   });
// };

//   const initializeUserAndData = async () => {
//     setLoading(true);
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         setLoading(false);
//         return;
//       }
      
//       setCurrentUserId(user.id);

//       // Get user profile
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("role, user_id")
//         .eq("user_id", user.id)
//         .maybeSingle();

//       // Check if user is facility admin
//       const { data: facilityAdmin } = await supabase
//         .from("facilities")
//         .select("id")
//         .eq("admin_user_id", user.id)
//         .maybeSingle();

//       if (facilityAdmin) {
//         setUserRole('admin');
//         setCurrentFacilityId(facilityAdmin.id);
//         await fetchAllDepartments();
//         await fetchAllAppointments(facilityAdmin.id);
//       } else {
//         // Check if user is associated with any departments through staff table
//         const { data: deptStaff, error: staffError } = await supabase
//           .from("staff")
//           .select(`
//             id,
//             department_id,
//             role,
//             departments!staff_department_id_fkey (
//               id,
//               name,
//               description,
//               head_doctor_id,
//               facility_id,
//               is_active
//             )
//           `)
//           .eq("user_id", user.id)
//           .eq("departments.is_active", true);

//         if (deptStaff && deptStaff.length > 0) {
//           const userDepts: UserDepartment[] = deptStaff.map(item => ({
//             department_id: item.department_id,
//             department_name: item.departments?.name || 'Unknown',
//             role: item.role as 'head' | 'staff' | 'personnel',
//             user_id: user.id
//           }));
          
//           setUserDepartments(userDepts);
          
//           // Set facility ID from first department
//           if (deptStaff[0]?.departments?.facility_id) {
//             setCurrentFacilityId(deptStaff[0].departments.facility_id);
//           }
          
//           // Check if user is head of any department
//           const isHead = userDepts.some(d => d.role === 'head');
//           const isManagement = userDepts.some(d => d.role === 'staff');
          
//           // Determine role
//           if (isHead) {
//             setUserRole('department_head');
//           } else if (isManagement) {
//             setUserRole('staff');
//           } else {
//             setUserRole('personnel');
//           }
          
//           // Fetch user's departments
//           const userDeptIds = userDepts.map(d => d.department_id);
//           const { data: deptData } = await supabase
//             .from("departments")
//             .select("id, name, description, head_doctor_id, is_active")
//             .in("id", userDeptIds)
//             .eq("is_active", true);
          
//           if (deptData) {
//             setDepartments(deptData);
//           }
          
//           // If only one department, auto-select it
//           if (userDeptIds.length === 1) {
//             setSelectedDepartment(userDeptIds[0]);
//           }
          
//           // Fetch appointments based on role
//           await fetchAppointmentsByRole(userDeptIds, user.id, isHead);
//         } else {
//           // No departments assigned
//           setDepartments([]);
//           setAppointments([]);
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

//   const fetchAllAppointments = async (facilityId: string) => {
//     try {
//       // First get all departments for this facility
//       const { data: deptData } = await supabase
//         .from("departments")
//         .select("id")
//         .eq("facility_id", facilityId)
//         .eq("is_active", true);

//       if (!deptData || deptData.length === 0) {
//         setAppointments([]);
//         return;
//       }

//       const deptIds = deptData.map(d => d.id);
      
//       // Build query based on selected department
//       let query = supabase
//         .from("appointments")
//         .select(`
//           id,
//           patient_id,
//           appointment_date,
//           time_slot_id,
//           type,
//           status,
//           notes,
//           video_room_id,
//           department_id,
//           doctor_id,
//           facility_id
//         `);

//       if (selectedDepartment !== "all") {
//         query = query.eq("department_id", selectedDepartment);
//       } else {
//         query = query.in("department_id", deptIds);
//       }

//       const { data: appts, error } = await query.order("appointment_date", { ascending: true });

//       if (error) {
//         console.error("Error fetching appointments:", error);
//         return;
//       }

//       if (!appts || appts.length === 0) {
//         setAppointments([]);
//         return;
//       }

//       await enrichAppointmentsWithPatientData(appts);
//     } catch (error) {
//       console.error("Error in fetchAllAppointments:", error);
//     }
//   };

//   const fetchAppointmentsByRole = async (deptIds: string[], userId: string, isHead: boolean) => {
//     try {
//       let query = supabase
//         .from("appointments")
//         .select(`
//           id,
//           patient_id,
//           appointment_date,
//           time_slot_id,
//           type,
//           status,
//           notes,
//           video_room_id,
//           department_id,
//           doctor_id,
//           facility_id
//         `);

//       // Apply department filter
//       if (selectedDepartment !== "all") {
//         query = query.eq("department_id", selectedDepartment);
//       } else {
//         query = query.in("department_id", deptIds);
//       }

//       if (!isHead) {
//         // Regular personnel can only see appointments assigned to them
//         query = query.eq("doctor_id", userId);
//       }

//       const { data: appts, error } = await query.order("appointment_date", { ascending: true });

//       if (error) {
//         console.error("Error fetching appointments:", error);
//         return;
//       }

//       if (!appts || appts.length === 0) {
//         setAppointments([]);
//         return;
//       }

//       await enrichAppointmentsWithPatientData(appts);
//     } catch (error) {
//       console.error("Error in fetchAppointmentsByRole:", error);
//     }
//   };

//   const enrichAppointmentsWithPatientData = async (appts: any[]) => {
//     try {
//       const patientIds = [...new Set(appts.map((a) => a.patient_id))];

//       const { data: patients } = await supabase
//         .from("profiles")
//         .select("user_id, first_name, last_name, avatar_url")
//         .in("user_id", patientIds);

//       const patientMap = new Map(
//         patients?.map((p) => [p.user_id, `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown Patient'])
//       );
      
//       const patientAvatarMap = new Map(
//         patients?.map((p) => [p.user_id, p.avatar_url])
//       );

//       // Get department names
//       const deptIds = [...new Set(appts.map((a) => a.department_id))];
//       const { data: deptData } = await supabase
//         .from("departments")
//         .select("id, name")
//         .in("id", deptIds);

//       const deptNameMap = new Map(
//         deptData?.map((d) => [d.id, d.name])
//       );

//       const enriched: FacilityAppointment[] = [];

//       for (const apt of appts) {
//         // Get time slot details
//         const { data: slot } = await supabase
//           .from("time_slots")
//           .select("start_time, end_time")
//           .eq("id", apt.time_slot_id)
//           .maybeSingle();

//         if (!slot) continue;

//         const dateOnly = apt.appointment_date.split("T")[0];
//         const today = new Date().toISOString().split("T")[0];
//         const isPast = dateOnly < today;

//         enriched.push({
//           id: apt.id,
//           patientId: apt.patient_id,
//           doctor_id: apt.doctor_id,
//           doctor_name: apt.doctor_name,
//           facility_id: apt.facility_id,
//           department_id: apt.department_id,
//           department_name: deptNameMap.get(apt.department_id) || 'Unknown Department',
//           patientName: patientMap.get(apt.patient_id) ?? "Unknown Patient",
//           date: dateOnly,
//           time: `${to12Hour(slot.start_time)} - ${to12Hour(slot.end_time)}`,
//           type: apt.type,
//           status: apt.status,
//           isPast,
//           notes: apt.notes,
//           videoRoomId: apt.video_room_id,
//           patientAvatar: patientAvatarMap.get(apt.patient_id) ?? null,
//           time_slot_id: apt.time_slot_id
//         });
//       }

//       setAppointments(enriched);
//     } catch (error) {
//       console.error("Error enriching appointments:", error);
//     }
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
//     trackAppointmentAction('join_video', appointmentData);
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

//   const refreshAppointments = async () => {
//     setLoading(true);
//     try {
//       if (userRole === 'admin' && currentFacilityId) {
//         await fetchAllAppointments(currentFacilityId);
//       } else if (userDepartments.length > 0) {
//         await fetchAppointmentsByRole(
//           userDepartments.map(d => d.department_id),
//           currentUserId!,
//           userRole === 'department_head'
//         );
//       }
//     } catch (error) {
//       console.error("Error refreshing appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle department change
//   useEffect(() => {
//     if (!loading && currentUserId) {
//       refreshAppointments();
//     }
//   }, [selectedDepartment]);
//   // Add to tab changes
// const handleTabChange = (tab: "upcoming" | "past") => {
//   trackAppointmentAction('tab_change', { tab, fromTab: activeTab });
//   setActiveTab(tab);
// };

// // Add to filter changes
// const handleStatusFilterChange = (filter: string) => {
//   trackAppointmentAction('status_filter_change', { filter, fromFilter: statusFilter });
//   setStatusFilter(filter as any);
// };

// // Add to department filter
// const handleDepartmentFilterChange = (deptId: string) => {
//   trackAppointmentAction('department_filter_change', { 
//     departmentId: deptId, 
//     fromDepartment: selectedDepartment 
//   });
//   setSelectedDepartment(deptId);
// };

// // Add to refresh button
// const handleRefresh = () => {
//   trackAppointmentAction('refresh_data');
//   refreshAppointments();
// };

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
//     // <DashboardLayout userType="facility">
//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold">Appointment Management</h2>
//             <p className="text-gray-600 mt-1">
//               {userRole === 'admin' && 'Administrator view - All departments'}
//               {userRole === 'department_head' && 'Department Head view - All appointments in your departments'}
//               {userRole === 'staff' && 'Department Management view - All appointments in your departments'}
//               {userRole === 'personnel' && 'Department Personnel view - Your assigned appointments only'}
//             </p>
//           </div>
          
//           {/* Department Filter - Show only if user has multiple departments or is admin */}
//           {(userRole === 'admin' || departments.length > 1) && (
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
//                   {userRole === 'personnel' ? 'My Appointments' : 'Departments'}
//                 </p>
//                 <p className="text-2xl font-bold">
//                   {userRole === 'personnel' ? filteredAppointments.length : departments.length}
//                 </p>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-3 mb-4">
//               <Button
//                 variant={activeTab === "upcoming" ? "facility" : "outline"}
//                 onClick={() => {trackAppointmentAction('tab_change', { tab: "upcoming", fromTab: activeTab }); setActiveTab("upcoming")}}
//               >
//                 Upcoming ({upcoming.length})
//               </Button>
//               <Button
//                 variant={activeTab === "past" ? "facility" : "outline"}
//                 onClick={() => {trackAppointmentAction('tab_change', { tab: "past", fromTab: activeTab }); setActiveTab("past")}}
//               >
//                 Past ({past.length})
//               </Button>
//             </div>

//             {/* Status Filters */}
//             <div className="flex gap-2 mb-6">
//               {["all", "confirmed", "cancelled", "completed"].map((s) => (
//                 <Button
//                   key={s}
//                   size="sm"
//                   variant={statusFilter === s ? "doctor" : "outline"}
//                   onClick={() => {trackAppointmentAction('status_filter_change', { filter: s, fromFilter: statusFilter }); setStatusFilter(s as any)}}
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
//                   onRefresh={refreshAppointments}
//                   onJoinVideo={() => handleJoinVideo(apt.id)}
//                   department={departments.find((d) => d.id === apt.department_id) || null}
//                   userRole={userRole === 'staff' ? 'department_staff' : 
//           userRole === 'personnel' ? 'department_personnel' : 
//           userRole === 'department_head' ? 'department_head' : 'admin'}
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
//                   {userRole === 'personnel' && (
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
//     // </DashboardLayout>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import VideoMeeting from "../VideoMeeting";
import FacilityAppointmentCard from "./FacilityAppointmentCard";
import { mixpanelInstance } from "@/utils/mixpanel";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Calendar, Users, Building2 } from "lucide-react";

// Types
interface DepartmentInfo {
  id: string;
  name: string;
  description?: string;
  head_doctor_id?: string;
  is_active?: boolean;
  facility_id?: string;
}

interface UserDepartment {
  department_id: string;
  department_name: string;
  role: 'head' | 'staff' | 'admin' | 'personnel';
  user_id: string;
  facility_id?: string;
}

export interface FacilityAppointment {
  id: string;
  patientName: string;
  patientFirstName?: string;
  patientLastName?: string;
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
  doctorFirstName?: string;
  doctorLastName?: string;
  facility_id?: string;
  time_slot_id?: string;
  start_time?: string;
  end_time?: string;
}

interface VideoMeetingState {
  showMeeting: boolean;
  meetingId: string;
  patientName: string;
  appointmentId: string;
}

interface FacilityUser {
  id: string;
  role: 'hospital_admin' | 'hospital_staff' | 'doctor' | 'patient';
  facility_id: string | null;
  department_ids: string[];
  is_facility_admin: boolean;
}

// Utility functions
const to12Hour = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function FacilityAppointmentManagement() {
  // State management
  const [appointments, setAppointments] = useState<FacilityAppointment[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [userDepartments, setUserDepartments] = useState<UserDepartment[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [facilityUser, setFacilityUser] = useState<FacilityUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentFacilityId, setCurrentFacilityId] = useState<string | null>(null);
  const [facilityName, setFacilityName] = useState<string>("");
  
  // UI state
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled" | "completed">("all");

  // Video meeting state
  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    patientName: "",
    appointmentId: "",
  });

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  // Initialize component
  useEffect(() => {
    initializeUserAndData();
  }, []);

  // Track analytics
  const trackAppointmentAction = (action: string, appointmentData?: any) => {
    try {
      mixpanelInstance.track('Facility Appointment Action', {
        action,
        userRole: facilityUser?.role,
        facilityId: currentFacilityId,
        selectedDepartment,
        appointmentId: appointmentData?.id,
        patientName: appointmentData?.patientName,
        appointmentType: appointmentData?.type,
        appointmentStatus: appointmentData?.status,
        ...appointmentData
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Initialize user data
  const initializeUserAndData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to continue",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setCurrentUserId(user.id);

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, user_id, first_name, last_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Check if user is facility admin
      const { data: facilityAdmin, error: facilityError } = await supabase
        .from("facilities")
        .select("id, facility_name, admin_user_id")
        .eq("admin_user_id", user.id)
        .maybeSingle();

      if (facilityError) throw facilityError;

      if (facilityAdmin) {
        // User is hospital_admin
        setFacilityUser({
          id: user.id,
          role: 'hospital_admin',
          facility_id: facilityAdmin.id,
          department_ids: [],
          is_facility_admin: true
        });
        setCurrentFacilityId(facilityAdmin.id);
        setFacilityName(facilityAdmin.facility_name);
        await fetchAllDepartments(facilityAdmin.id);
        await fetchAllAppointments(facilityAdmin.id);
      } else {
        // Check if user is hospital_staff (in staff table)
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select(`
            id,
            department_id,
            user_id,
            facilities!inner (
              id,
              facility_name,
              admin_user_id
            ),
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
          .eq("is_active", true);

        if (staffError) throw staffError;

        if (staffData && staffData.length > 0) {
          // User is hospital_staff
          const facilityId = staffData[0]?.facilities?.id;
          const facilityName = staffData[0]?.facilities?.facility_name;
          
          setCurrentFacilityId(facilityId);
          setFacilityName(facilityName || "");

          const userDepts: UserDepartment[] = staffData.map(item => ({
            department_id: item.department_id,
            department_name: item.departments?.name || 'Unknown',
            role: item.role as 'head' | 'staff' | 'personnel',
            user_id: user.id,
            facility_id: facilityId
          }));
          
          setUserDepartments(userDepts);

          setFacilityUser({
            id: user.id,
            role: 'hospital_staff',
            facility_id: facilityId,
            department_ids: userDepts.map(d => d.department_id),
            is_facility_admin: false
          });

          // Fetch departments
          const deptIds = userDepts.map(d => d.department_id);
          const { data: deptData, error: deptError } = await supabase
            .from("departments")
            .select("id, name, description, head_doctor_id, is_active, facility_id")
            .in("id", deptIds)
            .eq("is_active", true);

          if (deptError) throw deptError;

          if (deptData) {
            setDepartments(deptData);
          }

          // Auto-select first department if only one
          if (deptIds.length === 1) {
            setSelectedDepartment(deptIds[0]);
          }

          // Fetch appointments
          await fetchAppointmentsForStaff(userDepts.map(d => d.department_id), user.id);
        } else {
          // User has no facility access
          setFacilityUser({
            id: user.id,
            role: profile?.role || 'patient',
            facility_id: null,
            department_ids: [],
            is_facility_admin: false
          });
          setDepartments([]);
          setAppointments([]);
          
          toast({
            title: "No Facility Access",
            description: "You don't have access to any facility",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all departments for admin
  const fetchAllDepartments = async (facilityId: string) => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, description, head_doctor_id, is_active, facility_id")
        .eq("facility_id", facilityId)
        .eq("is_active", true);
      
      if (error) throw error;
      
      if (data) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    }
  };

  // Fetch all appointments for admin
  const fetchAllAppointments = async (facilityId: string) => {
    try {
      // First get all departments for this facility
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("id")
        .eq("facility_id", facilityId)
        .eq("is_active", true);

      if (deptError) throw deptError;

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
          doctor_id,
          doctor_name,
          appointment_date,
          time_slot_id,
          type,
          status,
          notes,
          video_room_id,
          department_id,
          facility_id,
          created_at,
          updated_at,
          completed_at,
          cancellation_reason
        `)
        .order("appointment_date", { ascending: true });

      if (selectedDepartment !== "all") {
        query = query.eq("department_id", selectedDepartment);
      } else {
        query = query.in("department_id", deptIds);
      }

      const { data: appts, error: apptError } = await query;

      if (apptError) throw apptError;

      if (!appts || appts.length === 0) {
        setAppointments([]);
        return;
      }

      await enrichAppointmentsWithDetails(appts);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    }
  };

  // Fetch appointments for staff
  const fetchAppointmentsForStaff = async (deptIds: string[], userId: string) => {
    try {
      let query = supabase
        .from("appointments")
        .select(`
          id,
          patient_id,
          doctor_id,
          doctor_name,
          appointment_date,
          time_slot_id,
          type,
          status,
          notes,
          video_room_id,
          department_id,
          facility_id,
          created_at,
          updated_at,
          completed_at,
          cancellation_reason
        `)
        .order("appointment_date", { ascending: true });

      // Apply department filter
      if (selectedDepartment !== "all") {
        query = query.eq("department_id", selectedDepartment);
      } else {
        query = query.in("department_id", deptIds);
      }

      const { data: appts, error } = await query;

      if (error) throw error;

      if (!appts || appts.length === 0) {
        setAppointments([]);
        return;
      }

      await enrichAppointmentsWithDetails(appts);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    }
  };

  // Enrich appointments with patient and doctor details
  const enrichAppointmentsWithDetails = async (appts: any[]) => {
    try {
      // Get patient details
      const patientIds = [...new Set(appts.map((a) => a.patient_id).filter(Boolean))];
      const doctorIds = [...new Set(appts.map((a) => a.doctor_id).filter(Boolean))];

      const [patientsResult, doctorsResult, timeSlotsResult, departmentsResult] = await Promise.all([
        // Fetch patients
        patientIds.length > 0 ? supabase
          .from("profiles")
          .select("user_id, first_name, last_name, avatar_url")
          .in("user_id", patientIds) : { data: [] },
        
        // Fetch doctors
        doctorIds.length > 0 ? supabase
          .from("profiles")
          .select("user_id, first_name, last_name, avatar_url")
          .in("user_id", doctorIds) : { data: [] },
        
        // Fetch time slots
        supabase
          .from("time_slots")
          .select("id, start_time, end_time"),
        
        // Fetch department names
        supabase
          .from("departments")
          .select("id, name")
      ]);

      const patients = patientsResult.data || [];
      const doctors = doctorsResult.data || [];
      const timeSlots = timeSlotsResult.data || [];
      const departments_list = departmentsResult.data || [];

      // Create maps for quick lookup
      const patientMap = new Map(
        patients.map((p) => [p.user_id, {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown Patient',
          firstName: p.first_name,
          lastName: p.last_name,
          avatar: p.avatar_url
        }])
      );

      const doctorMap = new Map(
        doctors.map((d) => [d.user_id, {
          name: `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'Unknown Doctor',
          firstName: d.first_name,
          lastName: d.last_name
        }])
      );

      const timeSlotMap = new Map(
        timeSlots.map((ts) => [ts.id, {
          start: ts.start_time,
          end: ts.end_time
        }])
      );

      const deptNameMap = new Map(
        departments_list.map((d) => [d.id, d.name])
      );

      const enriched: FacilityAppointment[] = [];

      for (const apt of appts) {
        const timeSlot = timeSlotMap.get(apt.time_slot_id);
        if (!timeSlot) continue;

        const patient = patientMap.get(apt.patient_id) || {
          name: "Unknown Patient",
          firstName: "",
          lastName: "",
          avatar: null
        };

        const doctor = doctorMap.get(apt.doctor_id) || {
          name: apt.doctor_name || "Unknown Doctor",
          firstName: "",
          lastName: ""
        };

        const dateOnly = apt.appointment_date.split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        const isPast = dateOnly < today || apt.status === 'completed' || apt.status === 'cancelled';

        enriched.push({
          id: apt.id,
          patientId: apt.patient_id,
          patientName: patient.name,
          patientFirstName: patient.firstName,
          patientLastName: patient.lastName,
          doctor_id: apt.doctor_id,
          doctor_name: doctor.name,
          doctorFirstName: doctor.firstName,
          doctorLastName: doctor.lastName,
          facility_id: apt.facility_id,
          department_id: apt.department_id,
          department_name: deptNameMap.get(apt.department_id) || 'Unknown Department',
          date: formatDate(apt.appointment_date),
          time: `${to12Hour(timeSlot.start)} - ${to12Hour(timeSlot.end)}`,
          start_time: timeSlot.start,
          end_time: timeSlot.end,
          type: apt.type,
          status: apt.status,
          isPast,
          notes: apt.notes,
          videoRoomId: apt.video_room_id,
          patientAvatar: patient.avatar,
          time_slot_id: apt.time_slot_id
        });
      }

      setAppointments(enriched);
    } catch (error) {
      console.error("Error enriching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointment details",
        variant: "destructive",
      });
    }
  };

  // Filter appointments by status
  const filterByStatus = useCallback((list: FacilityAppointment[]) => {
    if (statusFilter === "all") return list;
    return list.filter((a) => a.status === statusFilter);
  }, [statusFilter]);

  // Filter appointments by department
  const filterByDepartment = useCallback((list: FacilityAppointment[]) => {
    if (selectedDepartment === "all") return list;
    return list.filter((a) => a.department_id === selectedDepartment);
  }, [selectedDepartment]);

  // Handle joining video meeting
  const handleJoinVideo = (appointmentId: string) => {
    const appointmentData = appointments.find((apt) => apt.id === appointmentId);
    
    if (!appointmentData) {
      toast({ 
        title: "Error", 
        description: "Appointment not found",
        variant: "destructive" 
      });
      return;
    }

    trackAppointmentAction('join_video', appointmentData);

    if (!apiKey) {
      toast({ 
        title: "Configuration Error", 
        description: "Video meeting API key not configured",
        variant: "destructive" 
      });
      return;
    }

    if (appointmentData.type !== "teleconsultation") {
      toast({ 
        title: "Invalid Appointment Type", 
        description: "This appointment is not a teleconsultation",
        variant: "destructive" 
      });
      return;
    }

    if (appointmentData.status !== "confirmed") {
      toast({ 
        title: "Cannot Start Meeting", 
        description: "Only confirmed appointments can be started",
        variant: "destructive" 
      });
      return;
    }

    const meetingId = appointmentData.videoRoomId || `appointment-${appointmentData.id}`;

    setVideoMeeting({
      showMeeting: true,
      meetingId: meetingId,
      patientName: appointmentData.patientName,
      appointmentId: appointmentData.id,
    });
  };

  // Handle leaving video meeting
  const handleLeaveMeeting = () => {
    setVideoMeeting({
      showMeeting: false,
      meetingId: "",
      patientName: "",
      appointmentId: "",
    });
    
    // Refresh appointments to update status if needed
    refreshAppointments();
  };

  // Get doctor display name
  const getDoctorDisplayName = useCallback(() => {
    return localStorage.getItem("doctorName") || "Doctor";
  }, []);

  // Refresh appointments
  const refreshAppointments = async () => {
    setRefreshing(true);
    try {
      if (!facilityUser) return;

      if (facilityUser.role === 'hospital_admin' && currentFacilityId) {
        await fetchAllAppointments(currentFacilityId);
      } else if (facilityUser.role === 'hospital_staff' && userDepartments.length > 0) {
        await fetchAppointmentsForStaff(
          userDepartments.map(d => d.department_id),
          currentUserId!
        );
      }
      
      toast({
        title: "Success",
        description: "Appointments refreshed",
        variant: "default",
      });
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      toast({
        title: "Error",
        description: "Failed to refresh appointments",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Handle department change
  useEffect(() => {
    if (!loading && currentUserId && facilityUser) {
      refreshAppointments();
    }
  }, [selectedDepartment]);

  // Handle appointment updates from child components
  const handleAppointmentUpdate = useCallback(() => {
    refreshAppointments();
  }, []);

  // Apply filters
  const filteredAppointments = filterByDepartment(filterByStatus(appointments));
  const upcoming = filteredAppointments.filter((a) => !a.isPast);
  const past = filteredAppointments.filter((a) => a.isPast);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Show video meeting
  if (videoMeeting.showMeeting) {
    return (
      <div className="fixed inset-0 bg-white z-50">
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

  // Check if user has access
  if (!facilityUser?.facility_id) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Building2 className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Facility Access</h3>
          <p className="text-yellow-600">
            You don't have access to any facility. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
            {facilityName && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {facilityName}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {facilityUser.role === 'hospital_admin' && 'Administrator view - All facility appointments'}
            {facilityUser.role === 'hospital_staff' && 'Staff view - Department appointments'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          {(facilityUser.role === 'hospital_admin' || departments.length > 1) && (
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Department:
              </label>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={refreshing}
              >
                {facilityUser.role === 'hospital_admin' && (
                  <option value="all">All Departments</option>
                )}
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} {dept.head_doctor_id === currentUserId ? ' (Head)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={refreshAppointments}
            disabled={refreshing}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Appointments</p>
              <p className="text-2xl font-bold text-blue-900">{filteredAppointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-green-900">{upcoming.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Past</p>
              <p className="text-2xl font-bold text-purple-900">{past.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Departments</p>
              <p className="text-2xl font-bold text-orange-900">{departments.length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b px-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "past"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past ({past.length})
            </button>
          </div>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2 py-1">Status:</span>
            {["all", "confirmed", "cancelled", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  statusFilter === s
                    ? s === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300'
                    : s === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300'
                    : s === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-4">
          {refreshing ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === "upcoming" ? upcoming : past).length > 0 ? (
                (activeTab === "upcoming" ? upcoming : past).map((apt) => (
                  <FacilityAppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onRefresh={handleAppointmentUpdate}
                    onJoinVideo={() => handleJoinVideo(apt.id)}
                    department={departments.find((d) => d.id === apt.department_id) || null}
                    userRole={facilityUser.role === 'hospital_admin' ? 'admin' : 'staff'}
                    currentUserId={currentUserId || ''}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No appointments found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedDepartment !== "all" 
                      ? "Try selecting a different department"
                      : facilityUser.role === 'hospital_staff'
                      ? "No appointments assigned to your departments"
                      : "No appointments scheduled"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}