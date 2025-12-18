
// ========================================
// DoctorAppointmentCard.tsx
// ========================================

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, X, FileText, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DoctorAppointment } from "./DoctorAppointmentManagement";
import { useState } from "react";


interface Props {
  appointment: DoctorAppointment;
  onRefresh: () => void;
} 
 
export default function DoctorAppointmentCard({
  appointment, 
  onRefresh,
}: Props) {

  // Confirm the cancelling the appointment
const [openCancel, setOpenCancel] = useState(false);
const [reason, setReason] = useState("");
const [notes, setNotes] = useState("");
const [loading, setLoading] = useState(false);



  // -------- ACTIONS --------
const cancelAppointment = async () => {
  if (!reason.trim()) {
    alert("Cancellation reason is required");
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
          appointment_id: appointment.id,
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
    console.log("Start video room:", appointment.videoRoomId);
    // you will plug video logic here
  };

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
  {appointment.patientAvatar ? (
    <img
      src={appointment.patientAvatar}
      alt={appointment.patientName}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.png";
      }}
      className="w-12 h-12 rounded-full object-cover border-gray-300"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
      {appointment.patientName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  )}

  <h3 className="text-lg font-semibold">
    {appointment.patientName}
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


     

      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Calendar size={16} />
        {appointment.date}
        <Clock size={16} className="ml-3" />
        {appointment.time}
      </div>

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


   {appointment.notes  && !appointment.isPast && (
  <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1 text-sm">
      <FileText size={12} />
      Patient Notes
    </div>
    <p className="text-sm text-blue-800">
      {appointment.notes}
    </p>
  </div>
)}

      {/* ACTIONS */}
      {!appointment.isPast && appointment.status === "confirmed" &&(
        <div className="flex justify-end gap-2">
          {appointment.type === "teleconsultation" && (
            <Button size="sm" onClick={startTeleconsultation}>
              <Video className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
{/* 
          <Button size="sm" variant="outline">
            <RefreshCcw className="h-4 w-4 mr-1" />
            Reschedule
          </Button> */}

      {
  (

 <Button
  variant="destructive"
  onClick={() => setOpenCancel(true)}
>
  Cancel Appointment
</Button>

)}

          {/* Pop msg for Confirm Cancel */}
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
