// // ========================================
// // AppointmentDepartmentsCard.tsx - Department Appointment Card
// // Patient Department Appointment Card Component
// // ========================================

// import React, { useEffect, useState } from "react";
// import { Calendar, MapPin, Clock, FileText, User, Upload, Building2, Building } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
// import { Button } from "@/components/ui/button";
// import AppointmentCard from "./AppointmentCard";
// import { useNavigate } from "react-router-dom";

// // Define the DepartmentAppointment interface
// interface DepartmentAppointment {
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
//   facilityEmail:string;
//   facilityPhone:number;
//   isPast: boolean;
//   cancellationReason?: string | null;
//   notes?: string | null;
//   chiefComplaint?: string | null;
//   completedAt?: string | null;
//   documents?: {
//     id: string;
//     name: string;
//     file_path: string;
//     mime_type: string;
//     created_at: string;
//     uploaded_by: string;
//     uploader_role: string;
//     tags?: string | string[];   // JSON or array
//   ai_summary?: string; // Add AI-generated summary

//   }[];
// }

// interface Props {
//   appointment: DepartmentAppointment;
//   userRole: "patient" | "doctor" | "department"; // Add department role
// }

// export default function AppointmentDepartmentsCard({
//   appointment,
//   userRole,
// }: Props) {
//   console.log("Rendering AppointmentDepartmentsCard for:", appointment);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showFullNotes, setShowFullNotes] = useState(false);
//   const [showDocsModal, setShowDocsModal] = useState(false);
// const navigate = useNavigate();

//   useEffect(() => {
//     const loadUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUserId(user?.id ?? null);
//     };
//     loadUser();
//   }, []);

//   // Determine if appointment is upcoming
//   const isUpcoming = appointment.status === "confirmed" && !appointment.isPast;

//   // Get status badge color
//   const getStatusBadge = () => {
//     switch(appointment.status) {
//       case "confirmed":
//         return "bg-green-100 text-green-700";
//       case "completed":
//         return "bg-blue-100 text-blue-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // return (
//   //   <div
//   //     className={`
//   //       relative rounded-xl p-5 space-y-4 shadow transition mt-4
//   //       border-l-4
//   //       ${
//   //         appointment.status === "cancelled"
//   //           ? "border-red-500 bg-red-50"
//   //           : "border-blue-500 bg-blue-50"
//   //       }
//   //     `}
//   //   >
//   //     {/* Department Details */}
//   //     <div className="flex items-center gap-3">
//   //       <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//   //         <Building2 size={24} />
//   //       </div>

//   //       <div className="flex-1">
//   //         <h3 className="text-lg font-semibold">{appointment.departmentName}</h3>
//   //         <p className="text-sm text-gray-500">{appointment.facilityName}</p>
//   //         {appointment.departmentDescription && (
//   //           <p className="text-xs text-gray-400 mt-1 line-clamp-1">
//   //             {appointment.departmentDescription}
//   //           </p>
//   //         )}
//   //       </div>

//   //       <span
//   //         className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge()}`}
//   //       >
//   //         {appointment.status.toUpperCase()}
//   //       </span>
    
//   //       <span
//   //         className={`text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700`}
//   //       >
//   //         Hospital Appointments
//   //       </span>
    
//   //     </div>

//   //     {/* Date & Time */}
//   //     <div className="flex items-center gap-4 text-sm">
//   //       <Calendar size={16} />
//   //       <span>{appointment.date}</span>
//   //       <Clock size={16} />
//   //       <span>{appointment.time}</span>
//   //     </div>

//   //     {/* Chief Complaint (if available) */}
//   //     {appointment.chiefComplaint && (
//   //       <div className="bg-gray-50 p-3 rounded text-sm">
//   //         <span className="font-medium">Chief Complaint:</span>{" "}
//   //         {appointment.chiefComplaint}
//   //       </div>
//   //     )}

//   //     {/* Consultation Type */}
//   //     <div
//   //       className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
//   //         ${
//   //           appointment.type === "teleconsultation"
//   //             ? "bg-purple-100 text-purple-700"
//   //             : "bg-indigo-100 text-indigo-700"
//   //         }`}
//   //     >
//   //       {appointment.type === "teleconsultation" ? (
//   //         <>
//   //           <MapPin size={14} />
//   //           Online Department Consultation
//   //         </>
//   //       ) : (
//   //         <>
//   //           <MapPin size={14} />
//   //           In-Person at {appointment.facilityName}
//   //         </>
//   //       )}
//   //     </div>

//   //     {/* Documents Button */}
//   //     <Button
//   //       variant="ghost"
//   //       size="sm"
//   //       onClick={() => setShowDocsModal(true)}
//   //       className="mt-2 flex items-center gap-1 text-blue-600 hover:bg-blue-50"
//   //     >
//   //       <FileText className="h-4 w-4" />
//   //       <span className="text-sm">Documents</span>
//   //     </Button>

//   //     {/* Documents Modal */}
//   //     <AppointmentDocumentsModal
//   //       open={showDocsModal}
//   //       onClose={() => setShowDocsModal(false)}
//   //       appointmentId={appointment.id}
//   //       role="patient"
//   //     />

//   //     {/* Cancellation Reason */}
//   //     {appointment.status === "cancelled" && appointment.cancellationReason && (
//   //       <div className="bg-red-50 rounded-lg p-4 space-y-2">
//   //         <p className="text-sm text-red-600 leading-relaxed">
//   //           <span className="font-medium">Cancellation Reason:</span>{" "}
//   //           {appointment.cancellationReason}
//   //         </p>
//   //       </div>
//   //     )}

//   //     {/* Patient Notes */}
//   //     {appointment.notes && (
//   //       <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3">
//   //         <div className="flex items-center justify-between mb-1">
//   //           <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
//   //             <FileText size={14} />
//   //             Patient Notes
//   //           </div>

//   //           {appointment.notes.length > 100 && (
//   //             <button
//   //               onClick={() => setShowFullNotes(!showFullNotes)}
//   //               className="text-xs text-blue-600 hover:underline"
//   //             >
//   //               {showFullNotes ? "Hide" : "View"}
//   //             </button>
//   //           )}
//   //         </div>

//   //         <p
//   //           className={`text-sm text-blue-800 ${
//   //             showFullNotes ? "" : "line-clamp-2"
//   //           }`}
//   //         >
//   //           {appointment.notes}
//   //         </p>
//   //       </div>
//   //     )}

//   //     {/* Completed At (for past appointments) */}
//   //     {appointment.isPast && appointment.completedAt && (
//   //       <div className="text-xs text-gray-500">
//   //         Completed on: {new Date(appointment.completedAt).toLocaleString()}
//   //       </div>
//   //     )}

//   //     {/* Documents Section */}
//   //     {appointment.documents && appointment.documents.length > 0 && (
//   //       <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 max-h-48 overflow-y-auto">
//   //         {/* Header */}
//   //         <div className="flex items-center justify-between mb-3">
//   //           <div className="flex items-center gap-2 text-blue-700 font-semibold">
//   //             <FileText size={16} />
//   //             <span>Documents</span>
//   //           </div>

//   //           <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//   //             {appointment.documents.length}
//   //           </span>
//   //         </div>

//   //         {/* File List */}
//   //         <div className="space-y-2">
//   //           {appointment.documents.map((doc) => (
//   //             <button
//   //               key={doc.id}
//   //               onClick={async () => {
//   //                 const { data, error } = await supabase.storage
//   //                   .from("patient_files")
//   //                   .createSignedUrl(doc.file_path, 300);

//   //                 if (data?.signedUrl) {
//   //                   window.open(data.signedUrl, "_blank");
//   //                 }
//   //               }}
//   //               className="
//   //                 group w-full rounded-lg border bg-white p-3
//   //                 flex items-center justify-between
//   //                 hover:border-blue-400 hover:shadow-sm
//   //                 transition-all
//   //               "
//   //             >
//   //               {/* Left */}
//   //               <div className="flex items-center gap-3">
//   //                 <div className="rounded-md bg-blue-100 p-2 text-blue-700">
//   //                   <FileText size={18} />
//   //                 </div>

//   //                 <div className="text-left">
//   //                   <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
//   //                     {doc.name}
//   //                   </p>
//   //                   <p className="text-xs text-gray-500">
//   //                     Uploaded by {doc.uploader_role} on{" "}
//   //                     {new Date(doc.created_at).toLocaleDateString()}
//   //                   </p>
//   //                 </div>
//   //               </div>

//   //               {/* Right */}
//   //               <span className="text-xs font-medium text-blue-600">
//   //                 View
//   //               </span>
//   //             </button>
//   //           ))}
//   //         </div>
//   //       </div>
//   //     )}

//   //     {/* PATIENT DOCUMENT UPLOAD – UPCOMING ONLY */}
//   //     {userRole === "patient" &&
//   //       appointment.status === "confirmed" &&
//   //       !appointment.isPast && (
//   //       <>
//   //         <button
//   //           onClick={() => setShowUploadModal(true)}
//   //           className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
//   //         >
//   //           <Upload size={16} />
//   //           Upload Medical Document
//   //         </button>

//   //         {/* Upload Modal */}
//   //         {showUploadModal && (
//   //           <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//   //             <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
//   //               {/* Header */}
//   //               <div className="flex items-center justify-between px-6 py-4 border-b">
//   //                 <h3 className="text-lg font-semibold">Upload Document</h3>
//   //                 <button
//   //                   onClick={() => setShowUploadModal(false)}
//   //                   className="text-gray-500 hover:text-gray-700"
//   //                 >
//   //                   ✕
//   //                 </button>
//   //               </div>

//   //               {/* Body */}
//   //               <div className="p-6 max-h-[80vh] overflow-y-auto">
//   //                 <UploadPrescriptionForm
//   //                   patientId={userId!}
//   //                   appointmentId={appointment.id}
//   //                   uploadedBy="patient"
//   //                   defaultDocumentType="medical_record"
//   //                   title="Upload Medical Document"
//   //                   onCancel={() => setShowUploadModal(false)}
//   //                 />
//   //               </div>
//   //             </div>
//   //           </div>
//   //         )}
//   //       </>
//   //     )}
//   //   </div>
//   // );

//   return (
//   <div
//     className={`
//       relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl
//       border-l-4
//       ${
//         appointment.status === "cancelled"
//           ? "border-red-500 bg-gradient-to-r from-red-50 to-white"
//           : "border-blue-500 bg-gradient-to-r from-blue-50 to-white"
//       }
//     `}
//   >
//     <div className="p-4 md:p-5 space-y-4">
//       {/* Department Details - Enhanced Layout */}
//       <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//         <div className="flex items-center gap-3 flex-1">
//           <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
//             <Building2 size={24} />
//           </div>

//           <div className="flex-1 min-w-0">
//             <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
//               {appointment.departmentName}
//             </h3>
//             <p className="text-sm text-gray-500 truncate">{appointment.facilityName}</p>
//             {appointment.departmentDescription && (
//               <p className="text-xs text-gray-400 mt-1 line-clamp-1">
//                 {appointment.departmentDescription}
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 ml-auto sm:ml-0">
//           <span
//             className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
//               appointment.status === "confirmed" 
//                 ? "bg-green-100 text-green-700 border border-green-200"
//                 : appointment.status === "completed"
//                 ? "bg-blue-100 text-blue-700 border border-blue-200"
//                 : "bg-red-100 text-red-700 border border-red-200"
//             }`}
//           >
//             {appointment.status.toUpperCase()}
//           </span>
//           <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
//             Hospital Appointments
//           </span>
//         </div>
//       </div>
//       <div className="flex-1 min-w-0">
//             <h6 className="text-gray-500">
//               Email : {appointment.facilityEmail}
//             </h6>
//             <h6 className="text-gray-500">
//               Phone : {appointment.facilityPhone}
//             </h6>
//           </div>

//       {/* Date & Time - Grid Layout */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/60 rounded-lg">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Calendar size={16} className="text-blue-500" />
//           <span className="font-medium">{appointment.date}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Clock size={16} className="text-blue-500" />
//           <span className="font-medium">{appointment.time}</span>
//         </div>
//       </div>
      

//       {/* Chief Complaint */}
//       {appointment.chiefComplaint && (
//         <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
//           <div className="flex items-start gap-2">
//             <span className="text-sm font-semibold text-gray-700">Chief Complaint:</span>
//             <p className="text-sm text-gray-600 flex-1">{appointment.chiefComplaint}</p>
//           </div>
//         </div>
//       )}

//       {/* Consultation Type */}
//       <div
//         className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm
//           ${
//             appointment.type === "teleconsultation"
//               ? "bg-purple-100 text-purple-700 border border-purple-200"
//               : "bg-indigo-100 text-indigo-700 border border-indigo-200"
//           }`}
//       >
//         {appointment.type === "teleconsultation" ? (
//           <>
//             <MapPin size={14} />
//             Online Department Consultation
//           </>
//         ) : (
//           <>
//             <MapPin size={14} />
//             In-Person at {appointment.facilityName}
//           </>
//         )}
//       </div>

      

//       {/* Documents Button */}
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => setShowDocsModal(true)}
//         className="mt-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
//       >
//         <FileText className="h-4 w-4" />
//         <span className="text-sm font-medium">Documents</span>
//       </Button>

//       {/* Documents Modal */}
//       <AppointmentDocumentsModal
//         open={showDocsModal}
//         onClose={() => setShowDocsModal(false)}
//         appointmentId={appointment.id}
//         role="patient"
//       />
      
//       {appointment.facilityId && (
//       <Button size="sm" variant="outline" onClick={() => navigate(`/patient/appointment-facility/${appointment.facilityId}/${appointment.id}`)}>
//         <Building className="h-4 w-4 mr-1" /> Hospital Profile
//       </Button>
//     )}

//       {/* Cancellation Reason */}
//       {appointment.status === "cancelled" && appointment.cancellationReason && (
//         <div className="bg-red-50 rounded-lg p-4 space-y-2 border border-red-200">
//           <p className="text-sm text-red-700 leading-relaxed">
//             <span className="font-semibold">Cancellation Reason:</span>{" "}
//             {appointment.cancellationReason}
//           </p>
//         </div>
//       )}

//       {/* Patient Notes */}
//       {appointment.notes && (
//         <div className="border border-blue-200 bg-blue-50 rounded-lg px-4 py-3">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
//               <FileText size={14} />
//               Patient Notes
//             </div>

//             {appointment.notes.length > 100 && (
//               <button
//                 onClick={() => setShowFullNotes(!showFullNotes)}
//                 className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
//               >
//                 {showFullNotes ? "Show Less" : "View All"}
//               </button>
//             )}
//           </div>

//           <p
//             className={`text-sm text-blue-800 ${
//               showFullNotes ? "" : "line-clamp-2"
//             }`}
//           >
//             {appointment.notes}
//           </p>
//         </div>
//       )}

//       {/* Completed At */}
//       {appointment.isPast && appointment.completedAt && (
//         <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
//           <p className="text-xs text-gray-600">
//             Completed on: {new Date(appointment.completedAt).toLocaleString()}
//           </p>
//         </div>
//       )}

//       {/* Documents Section */}
//       {appointment.documents && appointment.documents.length > 0 && (
//         <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 max-h-52 overflow-y-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2 text-blue-700 font-semibold">
//               <FileText size={16} />
//               <span>Documents</span>
//             </div>

//             <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
//               {appointment.documents.length}
//             </span>
//           </div>

//           {/* File List */}
//           <div className="space-y-2">
//   {appointment.documents.map((doc) => (
//     <button
//       key={doc.id}
//       onClick={async () => {
//         const { data, error } = await supabase.storage
//           .from("patient_files")
//           .createSignedUrl(doc.file_path, 300);

//         if (data?.signedUrl) {
//           window.open(data.signedUrl, "_blank");
//         }
//       }}
//       className="
//         group w-full rounded-lg bg-white p-3
//         flex flex-col md:flex-row md:items-center md:justify-between gap-2
//         hover:border-blue-400 hover:shadow-md
//         transition-all border border-gray-200
//       "
//     >
//       {/* Left */}
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className="rounded-md bg-blue-100 p-2 text-blue-700 flex-shrink-0">
//           <FileText size={18} />
//         </div>

//         <div className="text-left flex-1 min-w-0">
//           <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
//             {doc.name}
//           </p>
//           <p className="text-xs text-gray-500">
//             Uploaded by {doc.uploader_role} on{" "}
//             {new Date(doc.created_at).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       {/* Right */}
//       <span className="
//         text-xs font-medium text-blue-600 
//         group-hover:text-blue-700 
//         flex-shrink-0 
//         md:ml-2
//       ">
//         View →
//       </span>

//     </button>
//   ))}
// </div>
//         </div>
//       )}

//       {/* PATIENT DOCUMENT UPLOAD – UPCOMING ONLY */}
//       {userRole === "patient" &&
//         appointment.status === "confirmed" &&
//         !appointment.isPast && (
//         <>
//           <button
//             onClick={() => setShowUploadModal(true)}
//             className="w-full px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
//           >
//             <Upload size={16} />
//             Upload Medical Document
//           </button>

//           {/* Upload Modal */}
//           {showUploadModal && (
//             <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//               <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
//                   <h3 className="text-lg font-semibold text-gray-800">Upload Document</h3>
//                   <button
//                     onClick={() => setShowUploadModal(false)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-6 max-h-[80vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//                     patientId={userId!}
//                     appointmentId={appointment.id}
//                     uploadedBy="patient"
//                     defaultDocumentType="medical_record"
//                     title="Upload Medical Document"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   </div>
// );
// }

// ========================================
// AppointmentDepartmentsCard.tsx
// ========================================

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, FileText, Upload, Building2, Building, User, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DepartmentAppointment {
  id: string;
  departmentId: string;
  departmentName: string;
  departmentDescription?: string;
  facilityName: string;
  facilityId: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  status: "confirmed" | "cancelled" | "completed" | "pending";
  location: string;
  consultationFee: number | null;
  slotStartTime: string;
  slotEndTime: string;
  facilityEmail: string;
  facilityPhone: number;
  isPast: boolean;
  cancellationReason?: string | null;
  notes?: string | null;
  chiefComplaint?: string | null;
  completedAt?: string | null;
  documents?: {
    id: string;
    name: string;
    file_path: string;
    mime_type: string;
    created_at: string;
    uploaded_by: string;
    uploader_role: string;
    tags?: string | string[];
    ai_summary?: string;
  }[];
}

interface Props {
  appointment: DepartmentAppointment;
  userRole: "patient" | "doctor" | "department";
  showHospitalDetail?: boolean;
  showDocuments?: boolean;
  showUploadButton?: boolean;
}

export default function AppointmentDepartmentsCard({
  appointment,
  userRole,
  showHospitalDetail = true,
  showDocuments = true,
  showUploadButton = true,
}: Props) {
  console.log("Rendering AppointmentDepartmentsCard for:", appointment);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  const getStatusBadge = () => {
    switch(appointment.status) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  const isPending = appointment.status === "pending";
   const getPendingMessage = () => {
    if (appointment.status === "pending") {
      return "⚠️ This appointment is awaiting your confirmation. Please confirm within 30 minutes of booking to avoid auto-cancellation.";
    } else {
      return "⏳ Your appointment is currently pending confirmation from the doctor/medical team or the facility. Please do not visit until you receive confirmation. You will be notified once it is confirmed. You may follow up with them using the email  provided in your profile.";
      // return "⏳ Your appointment is pending doctor confirmation. You will be notified once confirmed.";
    }
  };

  return (
    <div
      className={`
        relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl
        border-l-4

        ${
  appointment.status === "pending"
    ? "border-gray-400 bg-gray-100"
    : appointment.status === "cancelled"
    ? "border-red-500 bg-gradient-to-r from-red-50 to-white"
    : appointment.status === "completed"
    ? "border-green-500 bg-gradient-to-r from-green-50 to-white"
    : "border-blue-500 bg-gradient-to-r from-blue-50 to-white"
}
       
      `}
    >
      <div className="p-4 md:p-5 space-y-4">
        {/* Department Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Building2 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                {appointment.departmentName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{appointment.facilityName}</p>
              {appointment.departmentDescription && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {appointment.departmentDescription}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto sm:ml-0">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${getStatusBadge()}`}>
              {appointment.status.toUpperCase()}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
              Hospital Appointments
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h6 className="text-gray-500">Email : {appointment.facilityEmail}</h6>
          <h6 className="text-gray-500">Phone : {appointment.facilityPhone}</h6>
        </div>

        {/* Date & Time */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-blue-500" />
            <span className="font-medium">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-blue-500" />
            <span className="font-medium">{appointment.time}</span>
          </div>
        </div> */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="font-medium">Appointment Date : {appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-blue-500" />
                    <span className="font-medium">Appointment Time : {appointment.time}</span>
                  </div>
                </div>

        {/* Chief Complaint */}
        {appointment.chiefComplaint && (
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-gray-700">Chief Complaint:</span>
              <p className="text-sm text-gray-600 flex-1">{appointment.chiefComplaint}</p>
            </div>
          </div>
        )}

        {/* Consultation Type */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm
            ${
              appointment.type === "teleconsultation"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
            }`}
        >
          {appointment.type === "teleconsultation" ? (
            <>
              <MapPin size={14} />
              Online Department Consultation
            </>
          ) : (
             <>
                  <MapPin size={14} />
                  <span>
                    <strong>Type :</strong>  In-Person at {appointment.facilityName}
                  </span>
                </>
           
          )}
        </div>

        {isPending && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex items-start gap-2 text-gray-700">
            <AlertCircle size={18} className="text-gray-500 mt-0.5" />
            <p className="text-sm">{getPendingMessage()}</p>
          </div>
        )}

        {/* Documents Button - conditional */}
        {/* {showDocuments && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDocsModal(true)}
            className="mt-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Documents</span>
          </Button>
        )} */}



        <AppointmentDocumentsModal
          open={showDocsModal}
          onClose={() => setShowDocsModal(false)}
          appointmentId={appointment.id}
          role="patient"
        />

        {/* Hospital Profile Button - conditional */}
        {/* {showHospitalDetail && appointment.facilityId && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/patient/appointment-facility/${appointment.facilityId}/${appointment.id}`)}
          >
            <Building className="h-4 w-4 mr-1" /> Hospital Profile
          </Button>
        )} */}
         <button
                          className="w-full px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"

            onClick={() => navigate(`/patient/appointment-facility/${userId}/${appointment.facilityId}/${appointment.id}`)}
          >
            <User className="h-4 w-4 mr-1" /> Appointment Details Page
          </button>

        {/* Cancellation Reason */}
        {appointment.status === "cancelled" && appointment.cancellationReason && (
          <div className="bg-red-50 rounded-lg p-4 space-y-2 border border-red-200">
            <p className="text-sm text-red-700 leading-relaxed">
              <span className="font-semibold">Cancellation Reason:</span>{" "}
              {appointment.cancellationReason}
            </p>
          </div>
        )}

        {/* Patient Notes */}
        {appointment.notes && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                <FileText size={14} />
                Patient Notes
              </div>
              {appointment.notes.length > 100 && (
                <button
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {showFullNotes ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <p className={`text-sm text-blue-800 ${showFullNotes ? "" : "line-clamp-2"}`}>
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Completed At */}
        {appointment.isPast && appointment.completedAt && (
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-600">
              Completed on: {new Date(appointment.completedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Documents Section - conditional */}
        {/* {showDocuments && appointment.documents && appointment.documents.length > 0 && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 max-h-52 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FileText size={16} />
                <span>Documents</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {appointment.documents.length}
              </span>
            </div>
            <div className="space-y-2">
              {appointment.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={async () => {
                    const { data } = await supabase.storage
                      .from("patient_files")
                      .createSignedUrl(doc.file_path, 300);
                    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                  }}
                  className="group w-full rounded-lg bg-white p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:border-blue-400 hover:shadow-md transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="rounded-md bg-blue-100 p-2 text-blue-700 flex-shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {doc.uploader_role} on {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex-shrink-0 md:ml-2">
                    View →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Upload Medical Document Button - conditional */}
        {showUploadButton &&
          userRole === "patient" &&
          appointment.status === "confirmed" &&
          !appointment.isPast && (
            <>
              {/* <button
                onClick={() => setShowUploadModal(true)}
                className="w-full px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Upload size={16} />
                Upload Medical Document
              </button> */}
              {showUploadModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
                      <h3 className="text-lg font-semibold text-gray-800">Upload Document</h3>
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                      <UploadPrescriptionForm
                        patientId={userId!}
                        appointmentId={appointment.id}
                        uploadedBy="patient"
                        defaultDocumentType="medical_record"
                        title="Upload Medical Document"
                        onCancel={() => setShowUploadModal(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}