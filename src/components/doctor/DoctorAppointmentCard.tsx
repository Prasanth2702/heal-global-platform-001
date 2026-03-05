// // ========================================
// // DoctorAppointmentCard.tsx
// // ========================================

// import { Button } from "@/components/ui/button";
// import { Calendar, Clock, Video, FileText, MapPin } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { DoctorAppointment } from "./DoctorAppointmentManagement";
// import { useState,useEffect } from "react";
// import VideoMeeting from "../VideoMeeting";
// import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";

// interface Props {
//   appointment: DoctorAppointment;
//   onRefresh: () => void;
// }

// // Update the DoctorAppointment interface to include slot times
// interface EnhancedDoctorAppointment extends DoctorAppointment {
//   slotStartTime?: string;
//   slotEndTime?: string;
//   videoRoomId?: string; // Make sure this is included
// }

// interface VideoMeetingState {
//   showMeeting: boolean;
//   meetingId: string;
//   patientName: string;
// }

// export default function DoctorAppointmentCard({
//   appointment,
//   onRefresh,
// }: Props) {
//   // Type cast to include optional slot times
//   const enhancedAppointment = appointment as EnhancedDoctorAppointment;

//   // Confirm the cancelling the appointment
//   const [openCancel, setOpenCancel] = useState(false);
//   const [reason, setReason] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   // const [showUpload, setShowUpload] = useState(false);
//   // const [openComplete, setOpenComplete] = useState(false);
//   const [completedWithoutDoc, setCompletedWithoutDoc] = useState(false);
//   const [uiCompleted, setUiCompleted] = useState(false);
//   const [openComplete, setOpenComplete] = useState(false);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [showDocsModal, setShowDocsModal] = useState(false);

//   const [userId, setUserId] = useState<string | null>(null);

//   // Video meeting state
//   const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
//     showMeeting: false,
//     meetingId: "",
//     patientName: "",
//   });

//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

//   useEffect(() => {
//     const loadUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUserId(user?.id ?? null);
//     };
//     loadUser();
//   }, []);

//   // -------- ACTIONS --------

//   const cancelAppointment = async () => {
//     if (!reason.trim()) {
//       alert("Cancellation reason is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
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
//             doctor_id: user.id,
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
//       alert("Failed to cancel appointment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLeaveMeeting = () => {
//     console.log("Doctor leaving meeting");
//     setVideoMeeting({
//       showMeeting: false,
//       meetingId: "",
//       patientName: "",
//     });
//   };

//   // ✅ Helper function (place ABOVE startTeleconsultation)
//   const canStartMeeting = () => {
//     const now = new Date();
//     const appointmentDate = new Date(enhancedAppointment.date);

//     if (enhancedAppointment.slotStartTime && enhancedAppointment.slotEndTime) {
//       const [startHour, startMinute] = enhancedAppointment.slotStartTime
//         .split(":")
//         .map(Number);

//       const [endHour, endMinute] = enhancedAppointment.slotEndTime
//         .split(":")
//         .map(Number);

//       const appointmentStartTime = new Date(appointmentDate);
//       appointmentStartTime.setHours(startHour, startMinute, 0, 0);

//       const appointmentEndTime = new Date(appointmentDate);
//       appointmentEndTime.setHours(endHour, endMinute, 0, 0);

//       const tenMinutesBefore = new Date(
//         appointmentStartTime.getTime() - 10 * 60000
//       );

//       const oneHourAfter = new Date(appointmentEndTime.getTime() + 60 * 60000);

//       return now >= tenMinutesBefore && now <= oneHourAfter;
//     }

//     // fallback timing
//     const appointmentStartTime = new Date(appointmentDate);
//     appointmentStartTime.setHours(9, 0, 0, 0);

//     const appointmentEndTime = new Date(appointmentDate);
//     appointmentEndTime.setHours(17, 0, 0, 0);

//     const tenMinutesBefore = new Date(
//       appointmentStartTime.getTime() - 10 * 60000
//     );

//     const oneHourAfter = new Date(appointmentEndTime.getTime() + 60 * 60000);

//     return now >= tenMinutesBefore && now <= oneHourAfter;
//   };

//   const startTeleconsultation = () => {
//     if (!apiKey) {
//       alert("Video conferencing is not configured properly");
//       return;
//     }

//     // Check if it's teleconsultation
//     if (enhancedAppointment.type !== "teleconsultation") {
//       alert("This appointment is not a teleconsultation");
//       return;
//     }

//     // Check if appointment is confirmed
//     if (enhancedAppointment.status !== "confirmed") {
//       alert("Only confirmed appointments can be started");
//       return;
//     }

//     // if (canStartMeeting()) {
//     //   alert(
//     //     "You can only start the meeting 10 minutes before and up to 1 hour after the scheduled time"
//     //   );
//     //   return;
//     // }

//     // Use videoRoomId as meeting ID (same as patient uses)
//     const meetingId =
//       enhancedAppointment.videoRoomId ||
//       `appointment-${enhancedAppointment.id}`;

//     console.log("Starting video meeting with ID:", meetingId);

//     setVideoMeeting({
//       showMeeting: true,
//       meetingId: meetingId,
//       patientName: enhancedAppointment.patientName,
//     });
//   };

//   // Get doctor display name
//   const getDoctorDisplayName = () => {
//     // Get doctor name from localStorage or profile
//     const doctorName = localStorage.getItem("doctorName") || "Doctor";
//     return doctorName;
//   };

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       const { data, error } = await supabase
//       .from("documents")
//       .select("*")
//         .eq("appointment_id", appointment.id)
//         .order("created_at", { ascending: false });
        
//       if (!error) setDocuments(data ?? []);
//     };

//     fetchDocuments();
//   }, [appointment.id]);

//   // Component to render individual document item

//   const canUploadPrescription =
//   (enhancedAppointment.isPast === false ||
//     enhancedAppointment.isPast === true) &&
//     enhancedAppointment.status === "confirmed";
    
//     const isCompleted = enhancedAppointment.status === "completed" || uiCompleted;
    
//     const isCancelled = enhancedAppointment.status === "cancelled";
//     //fetch the uploaded documents for this appointment
//     // Render Video Meeting if active
//     if (videoMeeting.showMeeting) {
//       return (
//         <div className=" inset-0 bg-white">
//           <VideoMeeting
//             isHost={true} // Doctor is the host
//             apiKey={apiKey}
//             meetingId={videoMeeting.meetingId}
//             name={getDoctorDisplayName()}
//             onMeetingLeave={handleLeaveMeeting}
//             micEnabled={true}
//             webcamEnabled={true}
//             containerId="video-container"
//             meetingTitle={`Consultation with ${videoMeeting.patientName}`}
//           />
//         </div>
//       );
//     }
//   return (
//     <div
//       className={`
//         relative rounded-xl p-5 space-y-4 shadow transition
//         border-l-4 mt-4
//         ${
//           enhancedAppointment.status === "cancelled"
//             ? "border-red-500 bg-red-50"
//             : "border-green-500 bg-green-50"
//         }
//       `}
//     >
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

//         <h3 className="text-lg font-semibold">
//           {enhancedAppointment.patientName}
//         </h3>
//         <span
//           className={`text-xs px-2 py-1 rounded-full font-medium
//             ${
//               enhancedAppointment.status === "confirmed"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//         >
//           {enhancedAppointment.status.toUpperCase()}
//         </span>
//       </div>

//       <div className="flex items-center gap-3 text-sm text-gray-700">
//         <Calendar size={16} />
//         {enhancedAppointment.date}
//         <Clock size={16} className="ml-3" />
//         {enhancedAppointment.time}
//       </div>

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
//       {/* View the Upload document's */}

//       <AppointmentDocumentsModal
//         open={showDocsModal}
//         onClose={() => setShowDocsModal(false)}
//         appointmentId={appointment.id}
//         role="doctor"
//       />

//       {/* ACTIONS */}
//       {/* ACTIONS */}
//       {!enhancedAppointment.isPast &&
//         enhancedAppointment.status !== "cancelled" && (
//           <div className="flex justify-end gap-2">
//             {/* START VIDEO */}
//             {enhancedAppointment.type === "teleconsultation" && (
//               <Button
//                 size="sm"
//                 onClick={startTeleconsultation}
//                 disabled={isCompleted || isCancelled}
//               >
//                 <Video className="h-4 w-4 mr-1" />
//                 Start Video
//               </Button>
//             )}

//             {/* CANCEL */}
//             <Button
//               variant="destructive"
//               onClick={() => setOpenCancel(true)}
//               disabled={isCompleted || isCancelled}
//             >
//               Cancel Appointment
//             </Button>

//             {/* MARK AS COMPLETED */}
//             <Button
//               variant="doctor"
//               onClick={() => setOpenComplete(true)}
//               disabled={isCompleted || isCancelled}
//             >
//               Mark as Completed
//             </Button>
//           </div>
//         )}
//       {/* Pop msg for choose a option to complete appointment */}
//       {openComplete && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center  z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//             <h3 className="text-lg font-semibold">Complete Appointment</h3>

//             <p className="text-sm text-gray-600">
//               Please choose how you want to complete this appointment.
//             </p>

//             <div className="space-y-3">
//               {/* WITH PRESCRIPTION */}
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

//               {/* WITHOUT PRESCRIPTION */}
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={() => {
//                   setCompletedWithoutDoc(true);
//                   setOpenComplete(false);
//                   alert(
//                     "Appointment marked as completed (with no prescription)"
//                   );
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

//       {/* UPLOAD PRESCRIPTION */}
//       {canUploadPrescription && (
//         <div className="mt-4 border-t pt-4">
//           <Button
//             variant="doctor"
//             size="sm"
//             onClick={() => {
//               setShowUploadModal(true);
//               setOpenComplete(false);
//             }}
//           >
//             {showUploadModal
//               ? "Hide Prescription Upload"
//               : "Upload Prescription"}
//           </Button>
//           {showUploadModal && (
//             <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//               <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b">
//                   <h3 className="text-lg font-semibold">Upload Document</h3>
//                   <button
//                     onClick={() => setShowUploadModal(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* Body */}
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
//               className="mt-2 m-5 items-center gap-1 text-emerald-600 hover:bg-emerald-50"
//             >
//               <FileText className="h-4 w-4" />
//               <span className="text-sm">Documents</span>
//             </Button>
//           )}
//         </div>
//       )}

//       {openCancel && (
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
//     </div>
//   );
// }

// ========================================
// DoctorAppointmentCard.tsx - Updated
// ========================================

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, FileText, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DoctorAppointment } from "./DoctorAppointmentManagement";
import { useState, useEffect } from "react";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";

interface Props {
  appointment: DoctorAppointment;
  onRefresh: () => void;
  onJoinVideo: () => void; // Add this prop
}

// Update the DoctorAppointment interface to include slot times
interface EnhancedDoctorAppointment extends DoctorAppointment {
  slotStartTime?: string;
  slotEndTime?: string;
  videoRoomId?: string;
}

export default function DoctorAppointmentCard({
  appointment,
  onRefresh,
  onJoinVideo, // Destructure this new prop
}: Props) {
  // Type cast to include optional slot times
  const enhancedAppointment = appointment as EnhancedDoctorAppointment;

  const [openCancel, setOpenCancel] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedWithoutDoc, setCompletedWithoutDoc] = useState(false);
  const [uiCompleted, setUiCompleted] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  // -------- ACTIONS --------

  const cancelAppointment = async () => {
    if (!reason.trim()) {
      alert("Cancellation reason is required");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
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
            doctor_id: user.id,
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
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    } finally {
      setLoading(false);
    }
  };

  const startTeleconsultation = () => {
    if (!apiKey) {
      alert("Video conferencing is not configured properly");
      return;
    }

    // Check if it's teleconsultation
    if (enhancedAppointment.type !== "teleconsultation") {
      alert("This appointment is not a teleconsultation");
      return;
    }

    // Check if appointment is confirmed
    if (enhancedAppointment.status !== "confirmed") {
      alert("Only confirmed appointments can be started");
      return;
    }

    // Call parent function to start video meeting
    onJoinVideo();
  };

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

  const canUploadPrescription =
    (enhancedAppointment.isPast === false ||
      enhancedAppointment.isPast === true) &&
    enhancedAppointment.status === "confirmed";

  const isCompleted = enhancedAppointment.status === "completed" || uiCompleted;

  const isCancelled = enhancedAppointment.status === "cancelled";

  return (
    <div
      className={`
        relative rounded-xl p-5 space-y-4 shadow transition
        border-l-4 mt-4
        ${
          enhancedAppointment.status === "cancelled"
            ? "border-red-500 bg-red-50"
            : "border-green-500 bg-green-50"
        }
      `}
    >
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

        <h3 className="text-lg font-semibold">
          {enhancedAppointment.patientName}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium
            ${
              enhancedAppointment.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {enhancedAppointment.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Calendar size={16} />
        {enhancedAppointment.date}
        <Clock size={16} className="ml-3" />
        {enhancedAppointment.time}
      </div>

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

      <AppointmentDocumentsModal
        open={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        appointmentId={appointment.id}
        role="doctor"
      />

      {!enhancedAppointment.isPast &&
        enhancedAppointment.status !== "cancelled" && (
          <div className="flex justify-end gap-2">
            {/* START VIDEO */}
            {enhancedAppointment.type === "teleconsultation" && (
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
            <Button
              variant="destructive"
              onClick={() => setOpenCancel(true)}
              disabled={isCompleted || isCancelled}
            >
              Cancel Appointment
            </Button>

            {/* MARK AS COMPLETED */}
            <Button
              variant="doctor"
              onClick={() => setOpenComplete(true)}
              disabled={isCompleted || isCancelled}
            >
              Mark as Completed
            </Button>
          </div>
        )}

      {openComplete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Complete Appointment</h3>

            <p className="text-sm text-gray-600">
              Please choose how you want to complete this appointment.
            </p>

            <div className="space-y-3">
              {/* WITH PRESCRIPTION */}
              <Button
                className="w-full justify-start"
                onClick={() => {
                  setShowUploadModal(true);
                  setOpenComplete(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Complete with Prescription
              </Button>

              {/* WITHOUT PRESCRIPTION */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setCompletedWithoutDoc(true);
                  setOpenComplete(false);
                  alert(
                    "Appointment marked as completed (with no prescription)"
                  );
                }}
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

      {/* UPLOAD PRESCRIPTION */}
      {canUploadPrescription && (
        <div className="mt-4 border-t pt-4">
          <Button
            variant="doctor"
            size="sm"
            onClick={() => {
              setShowUploadModal(true);
              setOpenComplete(false);
            }}
          >
            {showUploadModal
              ? "Hide Prescription Upload"
              : "Upload Prescription"}
          </Button>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Upload Document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <UploadPrescriptionForm
                    patientId={appointment.patientId}
                    doctorId={userId!}
                    appointmentId={appointment.id}
                    uploadedBy="doctor"
                    defaultDocumentType="medical_record"
                    onCancel={() => setShowUploadModal(false)}
                  />
                </div>
              </div>
            </div>
          )}
          {documents.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocsModal(true)}
              className="mt-2 m-5 items-center gap-1 text-emerald-600 hover:bg-emerald-50"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">Documents</span>
            </Button>
          )}
        </div>
      )}

      {openCancel && (
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
                onClick={() => setOpenCancel(false)}
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
    </div>
  );
}