// // ========================================
// // AppointmentCard.tsx
// // Reusable card component for each appointment
// // ========================================

// import React, { useState } from "react";
// import { Calendar, MapPin, Video, X, Clock } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";

// interface Appointment {
//   id: string;
//   doctorName: string;
//   specialty: string;
//   date: string;
//   time: string;
//   type: string; // in-person | teleconsultation
//   status: string;
//   location: string;
//   consultationFee: number | null;
//   doctorImage?: string;
//   doctorId: string;
//   doctorVerified: boolean; // Add this
//   slotStartTime: string; // Add this (HH:MM format)
//   slotEndTime: string; // Add this (HH:MM format)
// }

// interface Props {
//   appointment: Appointment;
//   userRole?: 'patient' | 'doctor';
//   onJoinVideo?: (id: string) => void;
// }

// export default function AppointmentCard({
//   appointment,
//   userRole = "patient",
//   onJoinVideo,
// }: Props) {
//   console.log("Rendering AppointmentCard for:", appointment);

 

//   return (
//     <div className="border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-3">
//       {/* Doctor Details */}
//       <div className="flex gap-4">
//         <img
//           src={appointment.doctorImage || "/doctor-placeholder.png"}
//           alt="Doctor"
//           className="w-16 h-16 rounded-full object-cover border"
//         />

//         <div>
//           <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
//           <p className="text-sm text-gray-500">{appointment.specialty}</p>
//         </div>
//       </div>

//       {/* Date & Time */}
//       <div className="flex items-center gap-3 text-sm text-gray-700">
//         <Calendar size={16} />
//         <span>{appointment.date}</span>

//         <Clock size={16} className="ml-3" />
//         <span>{appointment.time}</span>
//       </div>

//       {/* Location or Video */}
//       <div className="flex items-center gap-3 text-sm text-gray-700">
//         {appointment.type === "teleconsultation" ? (
//           <>
//             <Video size={16} />
//             <span>Online Video Consultation</span>
//           </>
//         ) : (
//           <>
//             <MapPin size={16} />
//             <span>{appointment.location}</span>
//           </>
//         )}
//       </div>

//       {/* Status */}
//       <div
//         className={`text-xs w-fit px-3 py-1 rounded-full font-semibold ${
//           appointment.status === "upcoming"
//             ? "bg-blue-100 text-blue-700"
//             : appointment.status === "completed"
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-700"
//         }`}
//       >
//         {appointment.status}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-2 mt-2">
//         {/* Teleconsultation Video Button */}
//         {AppointmentButtons.RENDER_VIDEO(appointment,userRole, onJoinVideo)}
//       </div>
//     </div>
//   );
// }

// // --------------------------------------------
// // Helper: Renders action buttons
// // --------------------------------------------
// // const AppointmentButtons = {
 
// //   RENDER_VIDEO(apt: Appointment, onJoinVideo?: (id: string) => void) {
// //     if (apt.type !== "teleconsultation") return null;
// //     // if (apt.status !== "confirmed") return null;

// //     return (
// //       <button
// //         onClick={() => onJoinVideo?.(apt.id)}
// //         className="px-3 py-1 text-sm border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
// //       >
// //         Join Video
// //       </button>
// //     );
// //   },

 
// // };
// // In AppointmentCard component, modify the RENDER_VIDEO function
// const AppointmentButtons = {
//   RENDER_VIDEO(apt: Appointment, userRole: 'patient' | 'doctor', onJoinVideo?: (id: string) => void) {
//     if (apt.type !== "teleconsultation") return null;
//     if (apt.status !== "confirmed") return null;
    
//     // For doctor: Show "Start Meeting" button
//     if (userRole === 'doctor') {
//       return (
//         <button
//           onClick={() => onJoinVideo?.(apt.id)}
//           disabled={!apt.doctorVerified} // Disable if not verified
//           className={`px-3 py-1 text-sm border rounded-lg ${
//             apt.doctorVerified 
//               ? "bg-green-600 text-white hover:bg-green-700" 
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           {apt.doctorVerified ? "Start Meeting" : "Verification Pending"}
//         </button>
//       );
//     }
    
//     // For patient: Show "Join Meeting" button
//     return (
//       <button
//         onClick={() => onJoinVideo?.(apt.id)}
//         className="px-3 py-1 text-sm border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//       >
//         Join Meeting
//       </button>
//     );
//   },
// };
// ========================================
// AppointmentCard.tsx
// Reusable card component for each appointment
// ========================================

import React from "react";
import { Calendar, MapPin, Video, X, Clock } from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string; // in-person | teleconsultation
  status: string;
  location: string;
  consultationFee: number | null;
  doctorImage?: string;
}

interface Props {
  appointment: Appointment;
  userRole;
  onJoinVideo?: (id: string) => void;
}

export default function AppointmentCard({
  appointment,
 
  onJoinVideo
}: Props) {
  console.log("Rendering AppointmentCard for:", appointment);
  return (
    <div className="border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-3">

      {/* Doctor Details */}
      <div className="flex gap-4">
        <img
          src={appointment.doctorImage || "/doctor-placeholder.png"}
          alt="Doctor"
          className="w-16 h-16 rounded-full object-cover border"
        />

        <div>
          <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
          <p className="text-sm text-gray-500">{appointment.specialty}</p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Calendar size={16} />
        <span>{appointment.date}</span>

        <Clock size={16} className="ml-3" />
        <span>{appointment.time}</span>
      </div>

      {/* Location or Video */}
      <div className="flex items-center gap-3 text-sm text-gray-700">
        {appointment.type === "teleconsultation" ? (
          <>
            <Video size={16} />
            <span>Online Video Consultation</span>
          </>
        ) : (
          <>
            <MapPin size={16} />
            <span>{appointment.location}</span>
          </>
        )}
      </div>

      {/* Status */}
      <div
        className={`text-xs w-fit px-3 py-1 rounded-full font-semibold ${
          appointment.status === "upcoming"
            ? "bg-blue-100 text-blue-700"
            : appointment.status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {appointment.status}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-2">

        

        {/* Teleconsultation Video Button */}
        {AppointmentButtons.RENDER_VIDEO(appointment, onJoinVideo)}

       
      </div>
    </div>
  );
}

// --------------------------------------------
// Helper: Renders action buttons
// --------------------------------------------
const AppointmentButtons = {
 
  RENDER_VIDEO(apt: Appointment, onJoinVideo?: (id: string) => void) {
    if (apt.type !== "teleconsultation") return null;
    // if (apt.status !== "confirmed") return null;

    return (
      <button
        onClick={() => onJoinVideo?.(apt.id)}
        className="px-3 py-1 text-sm border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Join Video
      </button>
    );
  },

 
};