
// // // ========================================
// // // FacilityAppointmentCard.tsx - Updated
// // // ========================================

// // import { Button } from "@/components/ui/button";
// // import { Calendar, Clock, Video, FileText, MapPin } from "lucide-react";
// // import { supabase } from "@/integrations/supabase/client";
// // import { FacilityAppointment } from "./FacilityAppointmentManagement";
// // import { useState, useEffect } from "react";
// // import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// // import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";

// // interface DepartmentInfo {
// //   id: string;
// //   name: string;
// //   description?: string;
// // }

// // interface Props {
// //   appointment: FacilityAppointment;
// //   onRefresh: () => void;
// //   onJoinVideo: () => void;
// //   department: DepartmentInfo | null;
// // }

// // // Update the FacilityAppointment interface to include slot times
// // interface EnhancedFacilityAppointment extends FacilityAppointment {
// //   slotStartTime?: string;
// //   slotEndTime?: string;
// //   videoRoomId?: string;
// // }

// // export default function FacilityAppointmentCard({
// //   appointment,
// //   onRefresh,
// //   onJoinVideo,
// //   department,
// // }: Props) {
// //   // Type cast to include optional slot times
// //   const enhancedAppointment = appointment as EnhancedFacilityAppointment;

// //   const [openCancel, setOpenCancel] = useState(false);
// //   const [reason, setReason] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [completedWithoutDoc, setCompletedWithoutDoc] = useState(false);
// //   const [uiCompleted, setUiCompleted] = useState(false);
// //   const [openComplete, setOpenComplete] = useState(false);
// //   const [showUploadModal, setShowUploadModal] = useState(false);
// //   const [documents, setDocuments] = useState<any[]>([]);
// //   const [showDocsModal, setShowDocsModal] = useState(false);

// //   const [userId, setUserId] = useState<string | null>(null);

// //   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

// //   useEffect(() => {
// //     const loadUser = async () => {
// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();
// //       setUserId(user?.id ?? null);
// //     };
// //     loadUser();
// //   }, []);

// //   // -------- ACTIONS --------

// //   const cancelAppointment = async () => {
// //     if (!reason.trim()) {
// //       alert("Cancellation reason is required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();
// //       if (!user) throw new Error("Not authenticated");

// //       const { data: sessionData } = await supabase.auth.getSession();
// //       const token = sessionData.session?.access_token;

// //       const response = await fetch(
// //         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify({
// //             appointment_id: enhancedAppointment.id,
// //             department_id: enhancedAppointment.department_id,
// //             reason,
// //             notes,
// //           }),
// //         }
// //       );

// //       if (!response.ok) {
// //         const text = await response.text();
// //         throw new Error(text);
// //       }

// //       setOpenCancel(false);
// //       setReason("");
// //       setNotes("");
// //       onRefresh();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to cancel appointment");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const startTeleconsultation = () => {
// //     if (!apiKey) {
// //       alert("Video conferencing is not configured properly");
// //       return;
// //     }

// //     // Check if it's teleconsultation
// //     if (enhancedAppointment.type !== "teleconsultation") {
// //       alert("This appointment is not a teleconsultation");
// //       return;
// //     }

// //     // Check if appointment is confirmed
// //     if (enhancedAppointment.status !== "confirmed") {
// //       alert("Only confirmed appointments can be started");
// //       return;
// //     }

// //     // Call parent function to start video meeting
// //     onJoinVideo();
// //   };

// //   useEffect(() => {
// //     const fetchDocuments = async () => {
// //       const { data, error } = await supabase
// //         .from("documents")
// //         .select("*")
// //         .eq("appointment_id", appointment.id)
// //         .order("created_at", { ascending: false });

// //       if (!error) setDocuments(data ?? []);
// //     };

// //     fetchDocuments();
// //   }, [appointment.id]);

// //   const canUploadPrescription =
// //     (enhancedAppointment.isPast === false ||
// //       enhancedAppointment.isPast === true) &&
// //     enhancedAppointment.status === "confirmed";

// //   const isCompleted = enhancedAppointment.status === "completed" || uiCompleted;

// //   const isCancelled = enhancedAppointment.status === "cancelled";

// //   return (
// //     <div
// //       className={`
// //         relative rounded-xl p-5 space-y-4 shadow transition
// //         border-l-4 mt-4
// //         ${
// //           enhancedAppointment.status === "cancelled"
// //             ? "border-red-500 bg-red-50"
// //             : "border-green-500 bg-green-50"
// //         }
// //       `}
// //     >
// //       <div className="flex items-center gap-3">
// //         {enhancedAppointment.patientAvatar ? (
// //           <img
// //             src={enhancedAppointment.patientAvatar}
// //             alt={enhancedAppointment.patientName}
// //             onError={(e) => {
// //               (e.currentTarget as HTMLImageElement).src =
// //                 "/avatar-placeholder.png";
// //             }}
// //             className="w-12 h-12 rounded-full object-cover border-gray-300"
// //           />
// //         ) : (
// //           <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
// //             {enhancedAppointment.patientName
// //               .split(" ")
// //               .map((n) => n[0])
// //               .join("")
// //               .slice(0, 2)
// //               .toUpperCase()}
// //           </div>
// //         )}

// //         <h3 className="text-lg font-semibold">
// //           {enhancedAppointment.patientName}
// //         </h3>
// //         <span
// //           className={`text-xs px-2 py-1 rounded-full font-medium
// //             ${
// //               enhancedAppointment.status === "confirmed"
// //                 ? "bg-green-100 text-green-700"
// //                 : "bg-red-100 text-red-700"
// //             }`}
// //         >
// //           {enhancedAppointment.status.toUpperCase()}
// //         </span>
// //       </div>


// //       <div className="flex items-center gap-3 text-sm text-gray-700">
// //         <Calendar size={16} />
// //         {enhancedAppointment.date}
// //         <Clock size={16} className="ml-3" />
// //         {enhancedAppointment.time}
// //       </div>

// //       {department && (
// //         <div className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded px-3 py-2 my-2">
// //           <div className="font-semibold">Department: {department.name}</div>
// //           {department.description && (
// //             <div className="text-xs text-blue-700 mt-1">{department.description}</div>
// //           )}
// //         </div>
// //       )}

// //       <div
// //         className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
// //           ${
// //             enhancedAppointment.type === "teleconsultation"
// //               ? "bg-purple-100 text-purple-700"
// //               : "bg-indigo-100 text-indigo-700"
// //           }`}
// //       >
// //         {enhancedAppointment.type === "teleconsultation" ? (
// //           <>
// //             <Video size={14} />
// //             Online Consultation
// //           </>
// //         ) : (
// //           <>
// //             <MapPin size={14} />
// //             Clinic Visit
// //           </>
// //         )}
// //       </div>

// //       {enhancedAppointment.notes && !enhancedAppointment.isPast && (
// //         <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
// //           <div className="flex items-center gap-2 text-blue-700 font-medium mb-1 text-sm">
// //             <FileText size={12} />
// //             Patient Notes
// //           </div>
// //           <p className="text-sm text-blue-800">{enhancedAppointment.notes}</p>
// //         </div>
// //       )}

// //       <AppointmentDocumentsModal
// //         open={showDocsModal}
// //         onClose={() => setShowDocsModal(false)}
// //         appointmentId={appointment.id}
// //         role="doctor"
// //       />

// //       {!enhancedAppointment.isPast &&
// //         enhancedAppointment.status !== "cancelled" && (
// //           <div className="flex justify-end gap-2">
// //             {/* START VIDEO */}
// //             {enhancedAppointment.type === "teleconsultation" && (
// //               <Button
// //                 size="sm"
// //                 onClick={startTeleconsultation}
// //                 disabled={isCompleted || isCancelled}
// //               >
// //                 <Video className="h-4 w-4 mr-1" />
// //                 Start Video
// //               </Button>
// //             )}

// //             {/* CANCEL */}
// //             <Button
// //               variant="destructive"
// //               onClick={() => setOpenCancel(true)}
// //               disabled={isCompleted || isCancelled}
// //             >
// //               Cancel Appointment
// //             </Button>

// //             {/* MARK AS COMPLETED */}
// //             <Button
// //               variant="doctor"
// //               onClick={() => setOpenComplete(true)}
// //               disabled={isCompleted || isCancelled}
// //             >
// //               Mark as Completed
// //             </Button>
// //           </div>
// //         )}

// //       {openComplete && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
// //             <h3 className="text-lg font-semibold">Complete Appointment</h3>

// //             <p className="text-sm text-gray-600">
// //               Please choose how you want to complete this appointment.
// //             </p>

// //             <div className="space-y-3">
// //               {/* WITH PRESCRIPTION */}
// //               <Button
// //                 className="w-full justify-start"
// //                 onClick={() => {
// //                   setShowUploadModal(true);
// //                   setOpenComplete(false);
// //                 }}
// //               >
// //                 <FileText className="h-4 w-4 mr-2" />
// //                 Complete with Prescription
// //               </Button>

// //               {/* WITHOUT PRESCRIPTION */}
// //               <Button
// //                 variant="outline"
// //                 className="w-full justify-start"
// //                 onClick={() => {
// //                   setCompletedWithoutDoc(true);
// //                   setOpenComplete(false);
// //                   alert(
// //                     "Appointment marked as completed (with no prescription)"
// //                   );
// //                 }}
// //               >
// //                 Complete without Prescription
// //               </Button>
// //             </div>

// //             <div className="flex justify-end">
// //               <Button variant="ghost" onClick={() => setOpenComplete(false)}>
// //                 Cancel
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* UPLOAD PRESCRIPTION */}
// //       {canUploadPrescription && (
// //         <div className="mt-4 border-t pt-4">
// //           <Button
// //             variant="doctor"
// //             size="sm"
// //             onClick={() => {
// //               setShowUploadModal(true);
// //               setOpenComplete(false);
// //             }}
// //           >
// //             {showUploadModal
// //               ? "Hide Prescription Upload"
// //               : "Upload Prescription"}
// //           </Button>
// //           {showUploadModal && (
// //             <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
// //               <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
// //                 {/* Header */}
// //                 <div className="flex items-center justify-between px-6 py-4 border-b">
// //                   <h3 className="text-lg font-semibold">Upload Document</h3>
// //                   <button
// //                     onClick={() => setShowUploadModal(false)}
// //                     className="text-gray-500 hover:text-gray-700"
// //                   >
// //                     ✕
// //                   </button>
// //                 </div>

// //                 {/* Body */}
// //                 <div className="p-6 max-h-[70vh] overflow-y-auto">
// //                   <UploadPrescriptionForm
// //                     patientId={appointment.patientId}
// //                     doctorId={userId!}
// //                     appointmentId={appointment.id}
// //                     uploadedBy="doctor"
// //                     defaultDocumentType="medical_record"
// //                     onCancel={() => setShowUploadModal(false)}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //           {documents.length > 0 && (
// //             <Button
// //               variant="ghost"
// //               size="sm"
// //               onClick={() => setShowDocsModal(true)}
// //               className="mt-2 m-5 items-center gap-1 text-emerald-600 hover:bg-emerald-50"
// //             >
// //               <FileText className="h-4 w-4" />
// //               <span className="text-sm">Documents</span>
// //             </Button>
// //           )}
// //         </div>
// //       )}

// //       {openCancel && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
// //             <h3 className="text-lg font-semibold">Cancel Appointment</h3>

// //             <div>
// //               <label className="text-sm font-medium">Reason *</label>
// //               <input
// //                 className="w-full border rounded p-2 mt-1"
// //                 value={reason}
// //                 onChange={(e) => setReason(e.target.value)}
// //                 placeholder="Enter cancellation reason"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-sm font-medium">Notes (optional)</label>
// //               <textarea
// //                 className="w-full border rounded p-2 mt-1"
// //                 rows={3}
// //                 value={notes}
// //                 onChange={(e) => setNotes(e.target.value)}
// //                 placeholder="Additional notes"
// //               />
// //             </div>

// //             <div className="flex justify-end gap-2">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setOpenCancel(false)}
// //                 disabled={loading}
// //               >
// //                 Close
// //               </Button>

// //               <Button
// //                 variant="destructive"
// //                 onClick={cancelAppointment}
// //                 disabled={loading}
// //               >
// //                 {loading ? "Cancelling..." : "Confirm Cancel"}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // ========================================
// // FacilityAppointmentCard.tsx - Fixed with Role-based Actions
// // ========================================

// import { Button } from "@/components/ui/button";
// import { toast } from "@/hooks/use-toast";
// import { Calendar, Clock, Video, FileText, MapPin, Shield, User } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { FacilityAppointment } from "./FacilityAppointmentManagement";
// import { useState, useEffect } from "react";
// import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";

// interface DepartmentInfo {
//   id: string;
//   name: string;
//   description?: string;
//   head_doctor_id?: string;
// }

// interface Props {
//   appointment: FacilityAppointment;
//   onRefresh: () => void;
//   onJoinVideo: () => void;
//   department: DepartmentInfo | null;
//   userRole?: 'admin' | 'department_head' | 'department_staff' | 'department_personnel';
//   currentUserId: string;
// }

// interface EnhancedFacilityAppointment extends FacilityAppointment {
//   slotStartTime?: string;
//   slotEndTime?: string;
//   videoRoomId?: string;
// }

// export default function FacilityAppointmentCard({
//   appointment,
//   onRefresh,
//   onJoinVideo,
//   department,
//   userRole = 'department_personnel',
//   currentUserId,
// }: Props) {
//   const enhancedAppointment = appointment as EnhancedFacilityAppointment;

//   const [openCancel, setOpenCancel] = useState(false);
//   const [reason, setReason] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openComplete, setOpenComplete] = useState(false);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [showDocsModal, setShowDocsModal] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

//   // Check if user is assigned to this appointment
//   const isAssignedDoctor = appointment.doctor_id === currentUserId;
  
//   // Check if user is department head for this specific department
//   const isDepartmentHead = userRole === 'department_head' || 
//     (department?.head_doctor_id === currentUserId);

//   // Admin has full access to everything
//   const isAdmin = userRole === 'admin';
  
//   // Department Head and Department Staff (management) have full access to department appointments
//   const hasManagementAccess = isAdmin || isDepartmentHead || userRole === 'department_staff';
  
//   // Regular personnel can only access their assigned appointments
//   const canAccessAppointment = isAdmin || hasManagementAccess || isAssignedDoctor;

//   // Actions permissions
//   const canCancelAppointment = isAdmin || isDepartmentHead; // Only admin and department heads can cancel
//   const canCompleteAppointment = isAdmin || isDepartmentHead; // Only admin and department heads can mark as completed
//   const canUploadPrescription = isAdmin || isDepartmentHead || isAssignedDoctor; // Assigned doctors can upload
//   const canStartVideo = isAssignedDoctor || hasManagementAccess; // Assigned doctors and management can start video

//   useEffect(() => {
//     const loadUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUserId(user?.id ?? null);
//     };
//     loadUser();
//   }, []);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       const { data, error } = await supabase
//         .from("documents")
//         .select("*")
//         .eq("appointment_id", appointment.id)
//         .order("created_at", { ascending: false });

//       if (!error) setDocuments(data ?? []);
//     };

//     fetchDocuments();
//   }, [appointment.id]);

//   const cancelAppointment = async () => {
//     if (!reason.trim()) {
//       toast({
//         title: "Cancellation Required",
//         description: "Please provide a reason for cancellation.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             appointment_id: enhancedAppointment.id,
//             department_id: enhancedAppointment.department_id,
//             doctor_id: enhancedAppointment.doctor_id|| null,
//             reason,
//             notes,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text);
//       }

//       setOpenCancel(false);
//       setReason("");
//       setNotes("");
//       onRefresh();
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to cancel appointment.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   const completeAppointment = async () => {
 

//     try {
//       setLoading(true);

//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("Not authenticated");

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/upload-prescriptions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             appointment_id: enhancedAppointment.id,
//             department_id: enhancedAppointment.department_id,
//             doctor_id: enhancedAppointment.doctor_id|| null,
//             notes,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text);
//       }

//       setShowUploadModal(false);
//       setReason("");
//       setNotes("");
//       onRefresh();
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to complete appointment.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startTeleconsultation = () => {
//     if (!apiKey) {
//       toast({
//         title: "Video Error",
//         description: "Video conferencing is not configured properly.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (enhancedAppointment.type !== "teleconsultation") {
//       toast({
//         title: "Type Error",
//         description: "This appointment is not a teleconsultation.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (enhancedAppointment.status !== "confirmed") {
//       toast({
//         title: "Status Error",
//         description: "Only confirmed appointments can be started.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!canStartVideo) {
//       toast({
//         title: "Permission Denied",
//         description: "You don't have permission to start this video consultation.",
//         variant: "destructive",
//       });
//       return;
//     }

//     onJoinVideo();
//   };

//   const isCompleted = enhancedAppointment.status === "completed";
//   const isCancelled = enhancedAppointment.status === "cancelled";

//   // If user can't access this appointment, don't show it
//   if (!canAccessAppointment) {
//     return null;
//   }

//   // Role badge color and text
//   const getRoleBadge = () => {
//     if (isAdmin) return 'bg-purple-100 text-purple-700';
//     if (isDepartmentHead) return 'bg-blue-100 text-blue-700';
//     if (userRole === 'department_staff') return 'bg-green-100 text-green-700';
//     if (isAssignedDoctor) return 'bg-orange-100 text-orange-700';
//     return 'bg-gray-100 text-gray-700';
//   };

//   const getRoleText = () => {
//     if (isAdmin) return 'Admin';
//     if (isDepartmentHead) return 'Department Head';
//     if (userRole === 'department_staff') return 'Dept Management';
//     if (isAssignedDoctor) return 'Assigned Doctor';
//     return 'View Only';
//   };

//   return (
//     <div
//       className={`
//         relative rounded-xl p-5 space-y-4 shadow transition
//         border-l-4 mt-4
//         ${enhancedAppointment.status === "cancelled"
//           ? "border-red-500 bg-red-50"
//           : "border-green-500 bg-green-50"
//         }
//         ${!isAssignedDoctor && !hasManagementAccess ? 'opacity-90' : ''}
//       `}
//     >
//       {/* Role Badge */}
//       <div className="absolute top-4 right-4">
//         <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getRoleBadge()}`}>
//           <Shield size={12} />
//           {getRoleText()}
//         </span>
//       </div>

//       {/* Assigned Doctor Indicator */}
//       {appointment.doctor_name && (
//         <div className="absolute top-4 right-32">
//           <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
//             <User size={12} />
//             Dr. {appointment.doctor_name}
//           </span>
//         </div>
//       )}

//       <div className="flex items-center gap-3">
//         {enhancedAppointment.patientAvatar ? (
//           <img
//             src={enhancedAppointment.patientAvatar}
//             alt={enhancedAppointment.patientName}
//             onError={(e) => {
//               (e.currentTarget as HTMLImageElement).src =
//                 "/avatar-placeholder.png";
//             }}
//             className="w-12 h-12 rounded-full object-cover border-gray-300"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
//             {enhancedAppointment.patientName
//               .split(" ")
//               .map((n) => n[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </div>
//         )}

//         <div className="flex-1">
//           <h3 className="text-lg font-semibold">
//             {enhancedAppointment.patientName}
//           </h3>
//           <span
//             className={`text-xs px-2 py-1 rounded-full font-medium
//               ${
//                 enhancedAppointment.status === "confirmed"
//                   ? "bg-green-100 text-green-700"
//                   : enhancedAppointment.status === "completed"
//                   ? "bg-blue-100 text-blue-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//           >
//             {enhancedAppointment.status.toUpperCase()}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 text-sm text-gray-700">
//         <Calendar size={16} />
//         {enhancedAppointment.date}
//         <Clock size={16} className="ml-3" />
//         {enhancedAppointment.time}
//       </div>

//       {department && (
//         <div className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded px-3 py-2 my-2">
//           <div className="font-semibold flex items-center gap-2">
//             Department: {department.name}
//             {department.head_doctor_id === currentUserId && (
//               <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
//                 You are Head
//               </span>
//             )}
//           </div>
//           {department.description && (
//             <div className="text-xs text-blue-700 mt-1">{department.description}</div>
//           )}
//         </div>
//       )}

//       <div
//         className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
//           ${
//             enhancedAppointment.type === "teleconsultation"
//               ? "bg-purple-100 text-purple-700"
//               : "bg-indigo-100 text-indigo-700"
//           }`}
//       >
//         {enhancedAppointment.type === "teleconsultation" ? (
//           <>
//             <Video size={14} />
//             Online Consultation
//           </>
//         ) : (
//           <>
//             <MapPin size={14} />
//             Clinic Visit
//           </>
//         )}
//       </div>

//       {enhancedAppointment.notes && !enhancedAppointment.isPast && (
//         <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
//           <div className="flex items-center gap-2 text-blue-700 font-medium mb-1 text-sm">
//             <FileText size={12} />
//             Patient Notes
//           </div>
//           <p className="text-sm text-blue-800">{enhancedAppointment.notes}</p>
//         </div>
//       )}

//       <AppointmentDocumentsModal
//         open={showDocsModal}
//         onClose={() => setShowDocsModal(false)}
//         appointmentId={appointment.id}
//         role="doctor"
//       />

//       {/* Action Buttons - Based on Role */}
//       {!enhancedAppointment.isPast &&
//         enhancedAppointment.status !== "cancelled" && (
//           <div className="flex justify-end gap-2 flex-wrap">
//             {/* START VIDEO - Available to assigned doctors and management */}
//             {enhancedAppointment.type === "teleconsultation" && canStartVideo && (
//               <Button
//                 size="sm"
//                 onClick={startTeleconsultation}
//                 disabled={isCompleted || isCancelled}
//               >
//                 <Video className="h-4 w-4 mr-1" />
//                 Start Video
//               </Button>
//             )}

//             {/* CANCEL - Only Admin and Department Head */}
//             {canCancelAppointment && (
//               <Button
//                 variant="destructive"
//                 onClick={() => setOpenCancel(true)}
//                 disabled={isCompleted || isCancelled}
//               >
//                 Cancel Appointment
//               </Button>
//             )}

//             {/* MARK AS COMPLETED - Only Admin and Department Head */}
//             {canCompleteAppointment && (
//               <Button
//                 variant="doctor"
//                 onClick={() => setOpenComplete(true)}
//                 disabled={isCompleted || isCancelled}
//               >
//                 Mark as Completed
//               </Button>
//             )}

//             {/* View Only Message for non-assigned personnel */}
//             {!isAssignedDoctor && !hasManagementAccess && (
//               <span className="text-xs text-gray-500 italic">
//                 View only access - Not your assigned appointment
//               </span>
//             )}
//           </div>
//         )}

//       {/* Complete Modal - Only shown to users with access */}
//       {openComplete && canCompleteAppointment && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//             <h3 className="text-lg font-semibold">Complete Appointment</h3>

//             <p className="text-sm text-gray-600">
//               Please choose how you want to complete this appointment.
//             </p>

//             <div className="space-y-3">
//               <Button
//                 className="w-full justify-start"
//                 onClick={() => {
//                   setShowUploadModal(true);
//                   setOpenComplete(false);
//                 }}
//               >
//                 <FileText className="h-4 w-4 mr-2" />
//                 Complete with Prescription
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={() => {
//                   setOpenComplete(false);
//                   toast({
//                     title: "Completed",
//                     description: "Appointment marked as completed (with no prescription)",
//                     variant: "default",
//                   });
//                 }}
//               >
//                 Complete without Prescription
//               </Button>
//             </div>

//             <div className="flex justify-end">
//               <Button variant="ghost" onClick={() => setOpenComplete(false)}>
//                 Cancel
//               </Button>
//             </div>


//           </div>
//         </div>
//       )}
//       {showUploadModal && (
//      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
//          <div className="flex items-center justify-between px-6 py-4 border-b">
//            <h3 className="text-lg font-semibold">Upload Document</h3>
//            <button
//              onClick={() => setShowUploadModal(false)}
//              className="text-gray-500 hover:text-gray-700"
//            >
//              ✕
//            </button>
//          </div>

//          <div className="p-6 max-h-[70vh] overflow-y-auto">
//            <UploadPrescriptionForm
//              patientId={appointment.patientId}
//              departmentId={userId!}
//              appointmentId={appointment.id}
//              uploadedBy="department"
//              defaultDocumentType="medical_record"
//              onCancel={() => setShowUploadModal(false)}
//            />
//          </div>
//        </div>
//      </div>
//    )}

//       {/* Upload Prescription - Available to assigned doctors and management */}
//       {/* {canUploadPrescription && (
//         <div className="mt-4 border-t pt-4">
//           <Button
//             variant="doctor"
//             size="sm"
//             onClick={() => setShowUploadModal(true)}
//           >
//             Upload Prescription
//           </Button>

//           {showUploadModal && (
//             <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//               <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
//                 <div className="flex items-center justify-between px-6 py-4 border-b">
//                   <h3 className="text-lg font-semibold">Upload Document</h3>
//                   <button
//                     onClick={() => setShowUploadModal(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <div className="p-6 max-h-[70vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//                     patientId={appointment.patientId}
//                     doctorId={userId!}
//                     appointmentId={appointment.id}
//                     uploadedBy="doctor"
//                     defaultDocumentType="medical_record"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {documents.length > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowDocsModal(true)}
//               className="mt-2 ml-5 items-center gap-1 text-emerald-600 hover:bg-emerald-50"
//             >
//               <FileText className="h-4 w-4" />
//               <span className="text-sm">Documents ({documents.length})</span>
//             </Button>
//           )}
//         </div>
//       )} */}

//       {/* Cancel Modal */}
//       {openCancel && canCancelAppointment && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//             <h3 className="text-lg font-semibold">Cancel Appointment</h3>

//             <div>
//               <label className="text-sm font-medium">Reason *</label>
//               <input
//                 className="w-full border rounded p-2 mt-1"
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="Enter cancellation reason"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Notes (optional)</label>
//               <textarea
//                 className="w-full border rounded p-2 mt-1"
//                 rows={3}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Additional notes"
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setOpenCancel(false)}
//                 disabled={loading}
//               >
//                 Close
//               </Button>

//               <Button
//                 variant="destructive"
//                 onClick={cancelAppointment}
//                 disabled={loading}
//               >
//                 {loading ? "Cancelling..." : "Confirm Cancel"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* {openComplete && canCompleteAppointment && (
//       // {showUploadModal && (

//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//               <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">Upload Prescription</h3>
//                   <button
//                     onClick={() => setOpenComplete(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                       <div>
//               <label className="text-sm font-medium">Notes (optional)</label>
//               <textarea
//                 className="w-full border rounded p-2 mt-1"
//                 rows={3}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Additional notes"
//               />
              
//             </div>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setOpenComplete(false)}
//                 disabled={loading}
//               >
//                 Close
//               </Button>

//               <Button
//                 variant="destructive"
//                 onClick={completeAppointment}
//                 disabled={loading}
//               >
//                 {loading ? "Completing..." : "Confirm Complete"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, FileText, MapPin, Shield, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FacilityAppointment } from "./FacilityAppointmentManagement";
import { useState, useEffect } from "react";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
interface DepartmentInfo {
  id: string;
  name: string;
  description?: string;
  head_doctor_id?: string;
}

interface Props {
  appointment: FacilityAppointment;
  onRefresh: () => void;
  onJoinVideo: () => void;
  department: DepartmentInfo | null;
  userRole?: 'admin' | 'department_head' | 'department_staff' | 'department_personnel';
  currentUserId: string;
}

interface EnhancedFacilityAppointment extends FacilityAppointment {
  slotStartTime?: string;
  slotEndTime?: string;
  videoRoomId?: string;
}

export default function FacilityAppointmentCard({
  appointment,
  onRefresh,
  onJoinVideo,
  department,
  userRole = 'department_personnel',
  currentUserId,
}: Props) {
  const enhancedAppointment = appointment as EnhancedFacilityAppointment;

  const [openCancel, setOpenCancel] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  // Check if user is assigned to this appointment
  const isAssignedDoctor = appointment.doctor_id === currentUserId;
  
  // Check if user is department head for this specific department
  const isDepartmentHead = userRole === 'department_head' || 
    (department?.head_doctor_id === currentUserId);

  // Admin has full access to everything
  const isAdmin = userRole === 'admin';
  
  // Department Head and Department Staff (management) have full access to department appointments
  const hasManagementAccess = isAdmin || isDepartmentHead || userRole === 'department_staff';
  
  // Regular personnel can only access their assigned appointments
  const canAccessAppointment = isAdmin || hasManagementAccess || isAssignedDoctor;

  // Actions permissions
  const canCancelAppointment = isAdmin || isDepartmentHead;
  const canCompleteAppointment = isAdmin || isDepartmentHead;
  const canUploadPrescription = isAdmin || isDepartmentHead || isAssignedDoctor;
  const canStartVideo = isAssignedDoctor || hasManagementAccess;


  
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("appointment_id", appointment.id)
        .order("created_at", { ascending: false });

      if (!error) setDocuments(data ?? []);
    };

    fetchDocuments();
  }, [appointment.id]);

  const cancelAppointment = async () => {
      mixpanelInstance.track('Facility Appointment Cancelled', {
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    departmentId: appointment.department_id,
    reason,
    userRole
  });
    if (!reason.trim()) {
      toast({
        title: "Cancellation Required",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointment_id: enhancedAppointment.id,
            department_id: enhancedAppointment.department_id,
            doctor_id: enhancedAppointment.doctor_id || null,
            reason,
            notes,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setOpenCancel(false);
      setReason("");
      setNotes("");
      onRefresh();
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to cancel appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (withPrescription: boolean = false) => {
      mixpanelInstance.track('Facility Appointment Completed', {
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    departmentId: appointment.department_id,
    withPrescription,
    userRole
  });
    try {
      setLoading(true);

      if (withPrescription) {
        // If completing with prescription, open upload modal instead
        setOpenComplete(false);
        setShowUploadModal(true);
        setLoading(false);
        return;
      }

      // For completion without prescription, update the appointment status directly
      const { error } = await supabase
        .from("appointments")
        .update({ 
          status: "completed",
          updated_at: new Date().toISOString()
        })
        .eq("id", appointment.id);

      if (error) throw error;

      setOpenComplete(false);
      onRefresh();
      
      toast({
        title: "Success",
        description: "Appointment marked as completed.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to complete appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    onRefresh();
    toast({
      title: "Success",
      description: "Documents uploaded successfully.",
    });
     mixpanelInstance.track('Facility Documents Uploaded', {
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    userRole
  });
  };

  const startTeleconsultation = () => {
      mixpanelInstance.track('Facility Teleconsultation Started', {
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    departmentId: appointment.department_id,
    doctorId: appointment.doctor_id,
    userRole
  });
    if (!apiKey) {
      toast({
        title: "Video Error",
        description: "Video conferencing is not configured properly.",
        variant: "destructive",
      });
      return;
    }

    if (enhancedAppointment.type !== "teleconsultation") {
      toast({
        title: "Type Error",
        description: "This appointment is not a teleconsultation.",
        variant: "destructive",
      });
      return;
    }

    if (enhancedAppointment.status !== "confirmed") {
      toast({
        title: "Status Error",
        description: "Only confirmed appointments can be started.",
        variant: "destructive",
      });
      return;
    }

    if (!canStartVideo) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to start this video consultation.",
        variant: "destructive",
      });
      return;
    }

    onJoinVideo();
  };


// Add to view documents
const handleViewDocuments = () => {
  mixpanelInstance.track('Facility Documents Viewed', {
    appointmentId: appointment.id,
    patientName: appointment.patientName,
    documentCount: documents.length,
    userRole
  });
  setShowDocsModal(true);
};

  const isCompleted = enhancedAppointment.status === "completed";
  const isCancelled = enhancedAppointment.status === "cancelled";

  // If user can't access this appointment, don't show it
  if (!canAccessAppointment) {
    return null;
  }

  // Role badge color and text
  const getRoleBadge = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-700';
    if (isDepartmentHead) return 'bg-blue-100 text-blue-700';
    if (userRole === 'department_staff') return 'bg-green-100 text-green-700';
    if (isAssignedDoctor) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getRoleText = () => {
    if (isAdmin) return 'Admin';
    if (isDepartmentHead) return 'Department Head';
    if (userRole === 'department_staff') return 'Dept Management';
    if (isAssignedDoctor) return 'Assigned Doctor';
    return 'View Only';
  };

  return (
    <>
      <div
        className={`
          relative rounded-xl p-5 space-y-4 shadow transition
          border-l-4 mt-4
          ${enhancedAppointment.status === "cancelled"
            ? "border-red-500 bg-red-50"
            : "border-green-500 bg-green-50"
          }
          ${!isAssignedDoctor && !hasManagementAccess ? 'opacity-90' : ''}
        `}
      >
        {/* Role Badge */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getRoleBadge()}`}>
            <Shield size={12} />
            {getRoleText()}
          </span>
        </div>

        {/* Assigned Doctor Indicator */}
        {appointment.doctor_name && (
          <div className="absolute top-4 right-32">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
              <User size={12} />
              Dr. {appointment.doctor_name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {enhancedAppointment.patientAvatar ? (
            <img
              src={enhancedAppointment.patientAvatar}
              alt={enhancedAppointment.patientName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/avatar-placeholder.png";
              }}
              className="w-12 h-12 rounded-full object-cover border-gray-300"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
              {enhancedAppointment.patientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {enhancedAppointment.patientName}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium
                ${
                  enhancedAppointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : enhancedAppointment.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {enhancedAppointment.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Calendar size={16} />
          {enhancedAppointment.date}
          <Clock size={16} className="ml-3" />
          {enhancedAppointment.time}
        </div>

        {department && (
          <div className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded px-3 py-2 my-2">
            <div className="font-semibold flex items-center gap-2">
              Department: {department.name}
              {department.head_doctor_id === currentUserId && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                  You are Head
                </span>
              )}
            </div>
            {department.description && (
              <div className="text-xs text-blue-700 mt-1">{department.description}</div>
            )}
          </div>
        )}

        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${
              enhancedAppointment.type === "teleconsultation"
                ? "bg-purple-100 text-purple-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
        >
          {enhancedAppointment.type === "teleconsultation" ? (
            <>
              <Video size={14} />
              Online Consultation
            </>
          ) : (
            <>
              <MapPin size={14} />
              Clinic Visit
            </>
          )}
        </div>

        {enhancedAppointment.notes && !enhancedAppointment.isPast && (
          <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-1 text-sm">
              <FileText size={12} />
              Patient Notes
            </div>
            <p className="text-sm text-blue-800">{enhancedAppointment.notes}</p>
          </div>
        )}

        {/* Documents Button */}
        {/* {documents.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDocsModal(true)}
            className="items-center gap-1 text-emerald-600 hover:bg-emerald-50"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">Documents ({documents.length})</span>
          </Button>
        )} */}

        {/* Upload Prescription Button */}
        {/* {canUploadPrescription && !isCompleted && !isCancelled && (
          <Button
            variant="doctor"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="mt-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Upload Prescription
          </Button>
        )} */}

        {/* Action Buttons */}
        {!enhancedAppointment.isPast &&
          enhancedAppointment.status !== "cancelled" && (
          <div className="flex justify-end gap-2 flex-wrap">
            {/* START VIDEO */}
            {enhancedAppointment.type === "teleconsultation" && canStartVideo && (
              <Button
                size="sm"
                onClick={startTeleconsultation}
                disabled={isCompleted || isCancelled}
              >
                <Video className="h-4 w-4 mr-1" />
                Start Video
              </Button>
            )}

            {/* CANCEL */}
            {canCancelAppointment && (
              <Button
                variant="destructive"
                onClick={() => setOpenCancel(true)}
                disabled={isCompleted || isCancelled}
              >
                Cancel Appointment
              </Button>
            )}

            {/* MARK AS COMPLETED */}
            {canCompleteAppointment && !isCompleted && !isCancelled && (
              <Button
                variant="doctor"
                onClick={() => setOpenComplete(true)}
                disabled={isCompleted || isCancelled}
              >
                Mark as Completed
              </Button>
            )}

            {/* View Only Message */}
            {!isAssignedDoctor && !hasManagementAccess && (
              <span className="text-xs text-gray-500 italic">
                View only access - Not your assigned appointment
              </span>
            )}
          </div>
        )}
      </div>

      {/* Documents Modal */}
      {/* <AppointmentDocumentsModal
        open={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        appointmentId={appointment.id}
        role="doctor"
      /> */}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Upload Documents</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* <UploadPrescriptionForm
                patientId={appointment.patientId}
                depertmentId={userId!}
                appointmentId={appointment.id}
                uploadedBy="department"
                defaultDocumentType="medical_record"
                onCancel={() => setShowUploadModal(false)}
              /> */}
              <UploadPrescriptionForm
  patientId={appointment.patientId}
  depertmentId={userId!}  // This is correct - userId is the current user's ID
  appointmentId={appointment.id}
  uploadedBy="department"
  defaultDocumentType="medical_record"
  onCancel={() =>{ mixpanelInstance.track('Facility Upload Cancelled', { appointmentId: appointment.id, patientName: appointment.patientName, userRole });  setShowUploadModal(false)}}
/>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {openCancel && canCancelAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Cancel Appointment</h3>

            <div>
              <label className="text-sm font-medium">Reason *</label>
              <input
                className="w-full border rounded p-2 mt-1"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter cancellation reason"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea
                className="w-full border rounded p-2 mt-1"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>{ mixpanelInstance.track('Facility Cancel Modal Closed', { appointmentId: appointment.id, patientName: appointment.patientName, userRole });  setOpenCancel(false)}}
                disabled={loading}
              >
                Close
              </Button>

              <Button
                variant="destructive"
                onClick={cancelAppointment}
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {openComplete && canCompleteAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Complete Appointment</h3>

            <p className="text-sm text-gray-600">
              Please choose how you want to complete this appointment.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => completeAppointment(true)}
                disabled={loading}
              >
                <FileText className="h-4 w-4 mr-2" />
                Complete with Prescription
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => completeAppointment(false)}
                disabled={loading}
              >
                Complete without Prescription
              </Button>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpenComplete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}