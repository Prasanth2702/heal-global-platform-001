import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react"; // ✅ spinner icon
import { flushSync } from "react-dom";


export default function AppointmentBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const { slot_id, start_time, end_time, booking_date, doctor_id } =
    location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorName, setDoctorName] = useState("Loading...");
  const [userId, setUserId] = useState("");

  // ---------------- LOAD USER + DOCTOR ----------------
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);

      const { data: doc } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", doctor_id)
        .single();

      if (doc) {
        setDoctorName(`Dr. ${doc.first_name} ${doc.last_name}`);
      }
    })();
  }, [doctor_id]);

  // ---------------- CONFIRM APPOINTMENT ----------------
 const handleConfirm = async () => {
  if (isSubmitting) return;

  // 🔒 FORCE UI UPDATE IMMEDIATELY
  flushSync(() => {
    setIsSubmitting(true);
  });

  if (!userId) {
    toast.error("Please login first");
    setIsSubmitting(false);
    return;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error("Authentication failed");

    const response = await fetch(
      "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/book-appointment-without-fee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          patient_id: userId,
          doctor_id,
          facility_id: null,
          booking_date,
          time_slot_id: slot_id,
          notes: null,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Booking failed");

    toast.success("Appointment Confirmed!");
    navigate("/appointments");

  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
    setIsSubmitting(false); // 🔓 unlock only on error
  }
};



  return (
    <>
      <Toaster />
      <div className="max-w-lg mx-auto p-6 mt-10">
        <Card className="shadow-xl border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Confirm Appointment
            </h2>

            {/* Appointment Summary */}
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Doctor:</span> {doctorName}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {booking_date}
              </p>
              <p>
                <span className="font-semibold">Time:</span>{" "}
                {start_time} - {end_time}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              {/* ❌ Cancel disabled while loading */}
            <Button
  variant="outline"
  disabled={isSubmitting}
  onClick={() => navigate(-1)}
>
  Cancel
</Button>


              {/* ✅ Confirm with loader */}
   <Button
  onClick={handleConfirm}
  disabled={isSubmitting}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Confirming...
    </span>
  ) : (
    "Confirm Appointment"
  )}
</Button>


            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
