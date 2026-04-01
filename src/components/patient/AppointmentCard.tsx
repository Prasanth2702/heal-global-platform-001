// ========================================
// AppointmentCard.tsx
// ========================================

import React from "react";
import { Calendar, MapPin, Video, Clock, FileText, User, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import { useEffect, useState } from "react";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import { Button } from "@/components/ui/button";
// Define the Appointment interface
interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  status: "confirmed" | "cancelled" | "completed" | "upcoming";
  location: string;
  consultationFee: number | null;
  doctorImage?: string;
  doctorAvatar: string | null;
  doctorEmail:string |null;
  doctorPhone:number |null;
  isPast: boolean;
  doctorNotes?: string;
  videoRoomId?: string;
  cancellationReason?: string | null;
  notes?: string | null;
  documents?: {
  id: string;
  name: string;
  file_path: string;
  mime_type: string;
  created_at: string;
}[];
}

interface Props {
  appointment: Appointment;
  userRole: "patient" | "doctor"; // Add userRole to props
  onJoinVideo?: (id: string) => void;
}

export default function AppointmentCard({
  appointment,
  userRole,
  onJoinVideo,
}: Props) {
  console.log("Rendering AppointmentCard for:", appointment);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);



  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  const handleOpenDocument = async (doc: any) => {
    console.log("Opening file:", doc.file_path);
    const { data, error } = await supabase.storage
      .from("patient_files") // ✅ MUST MATCH BUCKET NAME
      .createSignedUrl(doc.file_path, 60);

    if (error) {
      console.error("Failed to open document", error);
      alert("Unable to open document");
      return;
    }

    window.open(data.signedUrl, "_blank");
  };



  // Determine if appointment is upcoming (for video button)
  const isUpcoming = appointment.status === "confirmed" && !appointment.isPast;

  // function setShowUpload(arg0: boolean): void {
  //   throw new Error("Function not implemented.");
  // }

//   return (
//     <div
//       className={`
//         relative rounded-xl p-5 space-y-4 shadow transition mt-4
//         border-l-4
//         ${
//           appointment.status === "cancelled"
//             ? "border-red-500 bg-red-50"
//             : "border-green-500 bg-green-50"
//         }
//       `}
//     >
//       {/* Doctor Details with Avatar */}
//       <div className="flex items-center gap-3">
//         {appointment.doctorAvatar ? (
//           <img
//             src={appointment.doctorAvatar}
//             alt={appointment.doctorName}
//             onError={(e) => {
//               (e.currentTarget as HTMLImageElement).src =
//                 "/avatar-placeholder.png";
//             }}
//             className="w-12 h-12 rounded-full object-cover"
//           />
//         ) : appointment.doctorImage ? (
//           <img
//             src={appointment.doctorImage}
//             alt={appointment.doctorName}
//             className="w-12 h-12 rounded-full object-cover border"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
//             {appointment.doctorName
//               .split(" ")
//               .map((n) => n[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </div>
//         )}

//         <div className="flex-1">
//           <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
//           <p className="text-sm text-gray-500">{appointment.specialty}</p>
//         </div>

//         <span
//           className={`text-xs px-2 py-1 rounded-full font-medium
//             ${
//               appointment.status === "confirmed" ||
//               appointment.status === "upcoming"
//                 ? "bg-green-100 text-green-700"
//                 : appointment.status === "completed"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//         >
//           {appointment.status.toUpperCase()}
//         </span>
//         <span
//           className={`text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700`}
            
//         >
//           Doctor Appointments
//         </span>
//       </div>

//       {/* Date & Time */}
//       <div className="flex items-center gap-4 text-sm">
//         <Calendar size={16} />
//         <span>{appointment.date}</span>
//         <Clock size={16} />
//         <span>{appointment.time}</span>
//       </div>
//       {/* Prescriptions – ONLY FOR PATIENT + PAST */}




//       {/* Consultation Type */}
//       <div
//         className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
//           ${
//             appointment.type === "teleconsultation"
//               ? "bg-purple-100 text-purple-700"
//               : "bg-indigo-100 text-indigo-700"
//           }`}
//       >
//         {appointment.type === "teleconsultation" ? (
//           <>
//             <Video size={14} />
//             Online Consultation
//           </>
//         ) : (
//           <>
//             <MapPin size={14} />
//             { "Clinic Consultation"}
//           </>
//         )}
//       </div>
// <Button
//   variant="ghost"
//   size="sm"
//   onClick={() => setShowDocsModal(true)}
//   className="mt-2 flex items-center gap-1 text-emerald-600 hover:bg-emerald-50"
// >
//   <FileText className="h-4 w-4" />
//   <span className="text-sm">Documents</span>
// </Button>


// <AppointmentDocumentsModal
//   open={showDocsModal}
//   onClose={() => setShowDocsModal(false)}
//   appointmentId={appointment.id}
//   role="patient"
// />




//       {/* Cancellation Reason */}
//       {appointment.status === "cancelled" && appointment.cancellationReason && (
//         <div className="bg-red-50 rounded-lg p-4 space-y-2">
//           <p className="text-sm text-red-600 leading-relaxed">
//             <span className="font-medium">Cancellation Reason:</span>{" "}
//             {appointment.cancellationReason}
//           </p>
//         </div>
//       )}

//       {/* Patient Notes */}
// {appointment.notes && (
//   <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3">
//     <div className="flex items-center justify-between mb-1">
//       <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
//         <FileText size={14} />
//         Patient Notes
//       </div>

//       {appointment.notes.length > 1 && (
//         <button
//           onClick={() => setShowFullNotes(!showFullNotes)}
//           className="text-xs text-blue-600 hover:underline"
//         >
//           {showFullNotes ? "Hide" : "View"}
//         </button>
//       )}
//     </div>

//     <p
//       className={`text-sm text-blue-800 ${
//         showFullNotes ? "" : "line-clamp-2"
//       }`}
//     >
//       {appointment.notes}
//     </p>
//   </div>
// )}



//       {/* Doctor Notes – ONLY PAST */}
//       {appointment.isPast &&
//         appointment.doctorNotes &&
//         appointment.status === "confirmed" && (
//           <div className="bg-gray-50 p-3 rounded text-sm flex gap-2">
//             <FileText size={16} />
//             <p>{appointment.doctorNotes}</p>
//           </div>
//         )}

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-2 mt-2">
//         {/* Join Video Button – ONLY UPCOMING + TELE */}
//         {isUpcoming &&
//           appointment.type === "teleconsultation" &&
//           appointment.videoRoomId &&
//           onJoinVideo && (
//             <button
//               onClick={() => onJoinVideo(appointment.id)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//             >
//               <Video size={16} />
//               Join Video
//             </button>
//           )}
//       </div>
//       {/* Prescriptions Section */}
// {appointment.documents && appointment.documents.length > 0 && (
// <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 max-h-48 overflow-y-auto">

    
//     {/* Header */}
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2 text-emerald-700 font-semibold">
//         <FileText size={16} />
//         <span>Prescriptions</span>
//       </div>

//      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
//   {appointment.documents.length}
// </span>

//     </div>

//     {/* File List */}
//     <div className="space-y-2">
//       {appointment.documents.map((doc) => (
//         <button
//           key={doc.id}
//           onClick={async () => {
//             const { data, error } = await supabase.storage
//               .from("patient_files")
//               .createSignedUrl(doc.file_path, 300);

//             if (data?.signedUrl) {
//               window.open(data.signedUrl, "_blank");
//             }
//           }}
//           className="
//             group w-full rounded-lg border bg-white p-3
//             flex items-center justify-between
//             hover:border-emerald-400 hover:shadow-sm
//             transition-all
//           "
//         >
//           {/* Left */}
//           <div className="flex items-center gap-3">
//             <div className="rounded-md bg-emerald-100 p-2 text-emerald-700">
//               <FileText size={18} />
//             </div>

//             <div className="text-left">
//               <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">
//                 {doc.name}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Uploaded on{" "}
//                 {new Date(doc.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//           {/* Right */}
//           <span className="text-xs font-medium text-emerald-600">
//             View
//           </span>
//         </button>
//       ))}
//     </div>
//   </div>
// )}
// {/* PATIENT DOCUMENT UPLOAD – UPCOMING ONLY */}
// {userRole === "patient" &&
//  appointment.status === "confirmed" &&
//  !appointment.isPast && (
//   <button
//     onClick={() => setShowUploadModal(true)}
//     className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
//     // disabled={appointment.status === "completed"}

//   >
//     <Upload size={16} />
//     Upload Medical Document to share with Booked Doctor's
//   </button>
// )}
// {showUploadModal && (
//   <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//     <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">

//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <h3 className="text-lg font-semibold">Upload Document</h3>
//         <button
//           onClick={() => setShowUploadModal(false)}
//           className="text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6 max-h-[80vh] overflow-y-auto">
//         <UploadPrescriptionForm
//           patientId={userId!}
//           appointmentId={appointment.id}
//           uploadedBy="patient"
//           defaultDocumentType="medical_record"
//           title="Upload Medical Document"
//           onCancel={() => setShowUpload(false)}
//         />
//       </div>
//     </div>
//   </div>
// )}


// </div>
//   );
return (
  <div
    className={`
      relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl
      border-l-4
      ${
        appointment.status === "cancelled"
          ? "border-red-500 bg-gradient-to-r from-red-50 to-white"
          : "border-green-500 bg-gradient-to-r from-green-50 to-white"
      }
    `}
  >
    <div className="p-4 md:p-5 space-y-4">
      {/* Doctor Details with Avatar - Enhanced Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {appointment.doctorAvatar ? (
            <img
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/avatar-placeholder.png";
              }}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : appointment.doctorImage ? (
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {appointment.doctorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {appointment.doctorName}
            </h3>
            <p className="text-sm text-gray-500 truncate">{appointment.specialty}</p>
          </div>
          
        </div>

        <div className="flex flex-wrap gap-2 ml-auto sm:ml-0">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm
              ${
                appointment.status === "confirmed" ||
                appointment.status === "upcoming"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : appointment.status === "completed"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
          >
            {appointment.status.toUpperCase()}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm`}
          >
            Doctor Appointments
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
            <h6 className="text-gray-500">
              Email : {appointment.doctorEmail}
            </h6>
            <h6 className="text-gray-500">
              Phone : {appointment.doctorPhone}
            </h6>
          </div>

      {/* Date & Time - Grid Layout for Better Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/60 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-blue-500" />
          <span className="font-medium">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-blue-500" />
          <span className="font-medium">{appointment.time}</span>
        </div>
      </div>

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
            <Video size={14} />
            Online Consultation
          </>
        ) : (
          <>
            <MapPin size={14} />
            Clinic Consultation
          </>
        )}
      </div>

      {/* Documents Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDocsModal(true)}
        className="mt-2 flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
      >
        <FileText className="h-4 w-4" />
        <span className="text-sm font-medium">Documents</span>
      </Button>

      <AppointmentDocumentsModal
        open={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        appointmentId={appointment.id}
        role="patient"
      />

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

            {appointment.notes.length > 1 && (
              <button
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {showFullNotes ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          <p
            className={`text-sm text-blue-800 ${
              showFullNotes ? "" : "line-clamp-2"
            }`}
          >
            {appointment.notes}
          </p>
        </div>
      )}

      {/* Doctor Notes */}
      {appointment.isPast &&
        appointment.doctorNotes &&
        appointment.status === "confirmed" && (
          <div className="bg-gray-100 p-3 rounded-lg text-sm flex gap-2 border border-gray-200">
            <FileText size={16} className="text-gray-600" />
            <p className="text-gray-700">{appointment.doctorNotes}</p>
          </div>
        )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-3">
        {isUpcoming &&
          appointment.type === "teleconsultation" &&
          appointment.videoRoomId &&
          onJoinVideo && (
            <button
              onClick={() => onJoinVideo(appointment.id)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Video size={16} />
              Join Video
            </button>
          )}
      </div>

      {/* Prescriptions Section */}
      {appointment.documents && appointment.documents.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 max-h-52 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <FileText size={16} />
              <span>Prescriptions</span>
            </div>

            <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
              {appointment.documents.length}
            </span>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {appointment.documents.map((doc) => (
              <button
                key={doc.id}
                onClick={async () => {
                  const { data, error } = await supabase.storage
                    .from("patient_files")
                    .createSignedUrl(doc.file_path, 300);

                  if (data?.signedUrl) {
                    window.open(data.signedUrl, "_blank");
                  }
                }}
                className="
                  group w-full rounded-lg bg-white p-3
                  flex items-center justify-between
                  hover:border-emerald-400 hover:shadow-md
                  transition-all border border-gray-200
                "
              >
                {/* Left */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="rounded-md bg-emerald-100 p-2 text-emerald-700 flex-shrink-0">
                    <FileText size={18} />
                  </div>

                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded on{" "}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <span className="text-xs font-medium text-emerald-600 group-hover:text-emerald-700 flex-shrink-0 ml-2">
                  View →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PATIENT DOCUMENT UPLOAD */}
      {userRole === "patient" &&
        appointment.status === "confirmed" &&
        !appointment.isPast && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Upload size={16} />
            Upload Medical Document
          </button>
        )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
              <h3 className="text-lg font-semibold text-gray-800">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <UploadPrescriptionForm
                patientId={userId!}
                appointmentId={appointment.id}
                uploadedBy="patient"
                defaultDocumentType="medical_record"
                title="Upload Medical Document"
                onCancel={() => setShowUpload(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}