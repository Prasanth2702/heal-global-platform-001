// ========================================
// AppointmentManagement.tsx
// Patient Appointment Page (Upcoming + Past)
// ========================================

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import AppointmentCard from "./AppointmentCard"; // your existing card component

// ------------------------
// Supabase Client
// ------------------------
import { supabase } from "@/integrations/supabase/client";
import VideoMeeting from "../VideoMeeting";

// ------------------------
// Types for safety & clarity
// ------------------------ 
interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // yyyy-mm-dd
  time: string; // "10:00 - 10:30"
  type: string; // in-person or teleconsultation
  status: string; // upcoming / completed / cancelled
  location: string;
  consultationFee: number | null;
  doctorImage?: string;
  doctorId: string;
  doctorVerified: boolean; // Add this
  slotStartTime: string; // Add this (HH:MM format)
  slotEndTime: string; // Add this (HH:MM format)
}

interface VideoMeetingState {
  showMeeting: boolean;
  meetingId: string;
  doctorName: string;
}

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// ------------------------
// Component
// ------------------------
export default function AppointmentManagement() {
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const [videoMeeting, setVideoMeeting] = useState<VideoMeetingState>({
    showMeeting: false,
    meetingId: "",
    doctorName: "",
  });

  const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;


  const [profile, setProfile] = useState<Profile | null>(null);
  // Load appointments when screen opens
  useEffect(() => {
    fetchAppointments();
  }, []);

  // -------------------------------------------------------------
  // Fetch appointments belonging ONLY to the logged-in patient
  // -------------------------------------------------------------
  const fetchAppointments = async () => {
    try {
      // 1️⃣ Get patient information
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      // 2️⃣ Get all appointments for this patient
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          doctor_id,
          doctor_name,
          appointment_date,
          time_slot_id,
          status,
          type,
          consultation_fee,
          reason
        `
        )
        .eq("patient_id", user.id)
        .order("appointment_date", { ascending: true });

      if (error) {
        toast({ title: "Error", description: "Could not load appointments" });
        return;
      }

      // 3️⃣ For each appointment → fetch the time slot details
      const enriched = await Promise.all(
        data.map(async (apt) => {
          const { data: slot } = await supabase
            .from("time_slots")
            .select("start_time, end_time, slot_type")
            .eq("id", apt.time_slot_id)
            .single();

          // Check if doctor is verified
          const { data: doctorVerification } = await supabase
            .from("medical_professionals")
            .select("is_verified")
            .eq("user_id", apt.doctor_id)
            .single();

          return {
            id: apt.id,
            doctorName: apt.doctor_name,
            specialty: apt.reason ?? "Consultation",
            date: apt.appointment_date?.split("T")[0], // format → yyyy-mm-dd
            time: slot ? `${slot.start_time} - ${slot.end_time}` : "",
            type: slot?.slot_type === "tele" ? "teleconsultation" : "in-person",
            status: apt.status,
            location: slot?.slot_type === "tele" ? "Online" : "Clinic",
            consultationFee: apt.consultation_fee,
            doctorImage: "/doctor-placeholder.png",
            doctorId: apt.doctor_id,
            doctorVerified: doctorVerification?.is_verified || false, // Add this
            slotStartTime: slot?.start_time || "", // Add for timing check
            slotEndTime: slot?.end_time || "", // Add for timing check
          };
        })
      );

      setAppointments(enriched);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, user_id, first_name, last_name, email")
          .eq("user_id", user.id)
          .single(); // 👈 because one user has one profile

        if (profileError) {
          toast({
            title: "Error",
            description: "Failed to load profile details",
          });
          return;
        }

        console.log("Profile Data:", profileData);


    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  // -------------------------------------------------------------
  // Split into upcoming / past
  // -------------------------------------------------------------
  const today = new Date().toISOString().split("T")[0];

  const upcomingAppointments = appointments.filter((apt) => {
    return apt.status === "confirmed" && apt.date >= today;
  });

  const pastAppointments = appointments.filter((apt) => {
    return (
      apt.date < today ||
      apt.status === "completed" ||
      apt.status === "cancelled"
    );
  });

  // ---------------------------
  // videosdk Meeting
  // ---------------------------

  const handleLeaveMeeting = () => {
    console.log("Leaving meeting");
    setVideoMeeting({
      showMeeting: false,
      meetingId: "",
      doctorName: "",
    });
  };


   const getDisplayName = () => {
     if (profile?.first_name && profile?.last_name) {
       return `${profile.first_name} ${profile.last_name}`;
     } else if (profile?.email) {
       return profile.email;
     } else {
       return "Participant";
     }
   };

const canJoinMeeting = (
  appointmentDate: string,
  slotStartTime: string,
  slotEndTime: string
) => {
  const now = new Date();
  const appointmentDateObj = new Date(appointmentDate);

  // Parse start time (e.g., "10:00")
  const [startHour, startMinute] = slotStartTime.split(":").map(Number);
  const appointmentStartTime = new Date(appointmentDateObj);
  appointmentStartTime.setHours(startHour, startMinute, 0, 0);

  // Parse end time (e.g., "10:30")
  const [endHour, endMinute] = slotEndTime.split(":").map(Number);
  const appointmentEndTime = new Date(appointmentDateObj);
  appointmentEndTime.setHours(endHour, endMinute, 0, 0);

  // Allow joining 10 minutes before start time
  const tenMinutesBefore = new Date(
    appointmentStartTime.getTime() - 10 * 60000
  );

  // Allow joining up to 1 hour after end time
  const oneHourAfter = new Date(appointmentEndTime.getTime() + 60 * 60000);

  return now >= tenMinutesBefore && now <= oneHourAfter;
};

  const handleJoinVideo = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Video conferencing is not configured properly",
      });
      return;
    }

    // Check if doctor is verified (only for teleconsultation)
    if (
      appointment.type === "teleconsultation" &&
      !appointment.doctorVerified
    ) {
      toast({
        title: "Doctor Not Verified",
        description:
          "Doctor verification is pending. Meeting cannot be started.",
        variant: "destructive",
      });
      return;
    }

    // Check timing restrictions
    if (
      !canJoinMeeting(
        appointment.date,
        appointment.slotStartTime,
        appointment.slotEndTime
      )
    ) {
      toast({
        title: "Cannot Join Meeting",
        description:
          "You can only join the meeting 10 minutes before and up to 1 hour after the scheduled time",
        variant: "destructive",
      });
      return;
    }

    setVideoMeeting({
      showMeeting: true,
      meetingId: appointment.doctorId,
      doctorName: appointment.doctorName,
    });
  };

  if (videoMeeting.showMeeting) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <VideoMeeting
          isHost={false}
          apiKey={apiKey}
          meetingId={videoMeeting.meetingId}
          name={getDisplayName()}
          onMeetingLeave={handleLeaveMeeting}
          micEnabled={true}
          webcamEnabled={true}
          containerId="video-container"
          meetingTitle={`Consultation with ${videoMeeting.doctorName}`}
        />
      </div>
    );
  }

  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');

// In fetchAppointments or useEffect
const checkUserRole = async (userId: string) => {
  // Check if user exists in medical_professionals table
  const { data } = await supabase
    .from("medical_professionals")
    .select("id")
    .eq("user_id", userId)
    .single();
  
  if (data) {
    setUserRole('doctor');
  } else {
    setUserRole('patient');
  }
};

  // ---------------------------
  // UI Rendering
  // ---------------------------
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

      {/* --------------------------------- */}
      {/*        Toggle Buttons (Tabs)      */}
      {/* --------------------------------- */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-lg font-medium border 
            ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white"
            } `}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded-lg font-medium border
            ${
              activeTab === "past"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white"
            } `}
        >
          Past
        </button>
      </div>

      {/* --------------------------------- */}
      {/*        Upcoming Appointments      */}
      {/* --------------------------------- */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 && (
            <p className="text-gray-400 text-sm">No upcoming appointments</p>
          )}

          {upcomingAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              userRole={userRole} // Pass user role
              onJoinVideo={handleJoinVideo}
              // onJoinVideo={() => console.log("Join video")}
            />
          ))}
        </div>
      )}

      {/* --------------------------------- */}
      {/*        Past Appointments          */}
      {/* --------------------------------- */}
      {activeTab === "past" && (
        <div className="space-y-4">
          {pastAppointments.length === 0 && (
            <p className="text-gray-400 text-sm">No past appointments</p>
          )}

          {pastAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              userRole={()=>{}}
              onJoinVideo={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};
