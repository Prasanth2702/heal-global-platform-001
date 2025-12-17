// ========================================
// AppointmentCard.tsx
// ========================================

import { Calendar, Clock, MapPin, Video, FileText,X } from "lucide-react";
import { Appointment } from "./AppointmentManagement";

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Props) {
  // console.log(appointment.cancelationReason);
  return (
   <div
  className={`
    relative rounded-xl p-5 space-y-4 shadow transition
    border-l-4 mt-4
    ${appointment.status === "cancelled"
      ? "border-red-500 bg-red-50"
      : "border-green-500 bg-green-50"
    }
  `}
>

    <div className="flex items-center gap-3">
  {appointment.doctorAvatar ? (
    <img
      src={appointment.doctorAvatar}
      alt={appointment.doctorName}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.png";
      }}
      className="w-12 h-12 rounded-full object-cover"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
      {appointment.doctorName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  )}

  <h3 className="text-lg font-semibold">
    {appointment.doctorName}
  </h3>
  <span
  className={`text-xs px-2 py-1 rounded-full font-medium
    ${appointment.status === "confirmed"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
    }`}
>
  {appointment.status.toUpperCase()}
</span>

</div>
      {/* Date & Time */}
      <div className="flex items-center gap-4 text-sm">
        <Calendar size={16} />
        {appointment.date}
        <Clock size={16} />
        {appointment.time}
      </div>

      {/* Type */}
    
       <div
  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
    ${appointment.type === "teleconsultation"
      ? "bg-purple-100 text-purple-700"
      : "bg-indigo-100 text-indigo-700"
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
      Clinic Visit
    </>
  )}
</div>
   
 
      {/* {appointment.status} */}
 {appointment.status === "cancelled" &&
  appointment.cancellationReason && (
    <div className="relative  bg-red-50 rounded-lg p-4 space-y-2">
      {/* Reason */}
      <p className="text-sm text-red-600 leading-relaxed">
        <span className="font-medium">Reason:</span>{" "}
        {appointment.cancellationReason}
      </p>
    </div>
)}

{/* Patient notes which is passed  to doctor */}
          {(appointment.notes   )? (
         <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
           <div className="flex items-center gap-2 text-blue-700 font-medium mb-1 text-sm">
             <FileText size={12} />
             Patient Notes
           </div>
           <p className="text-sm text-blue-800">
             {appointment.notes}
           </p>
         </div>
       ): null}
      {/* Doctor Notes – ONLY PAST */}
      {appointment.isPast && appointment.doctorNotes && appointment.status === "confirmed" && (
        <div className="bg-gray-50 p-3 rounded text-sm flex gap-2">
          <FileText size={16} />
          <p>{appointment.doctorNotes}</p>
        </div>
      )}

      {/* Join Video – ONLY UPCOMING + TELE */}
      {!appointment.isPast && appointment.status === "confirmed" && 
        appointment.type === "teleconsultation" &&
        appointment.videoRoomId && (
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 flex items-center gap-2">
              Join Video
            </button>
          </div>
        )}
    </div>
  );
}
