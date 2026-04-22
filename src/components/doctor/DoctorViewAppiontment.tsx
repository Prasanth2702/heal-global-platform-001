// patient.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Mail, Phone, Calendar, Clock, FileText, Upload, Eye, Heart,
  Ruler, Weight, AlertCircle, Stethoscope, Pill, Building, MapPin,
  Star, Users, Bed, Video, CreditCard, Loader2, IndianRupee, Trash2,
  DockIcon, LucideAppWindow, Telescope
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardLink } from "react-bootstrap";
import VideoMeeting from "../VideoMeeting";

// Interfaces
interface PatientProfile {
  id: string; user_id: string; first_name: string; last_name: string; email: string;
  phone_number: string; date_of_birth: string; gender: string; blood_group: string;
  height: number; weight: number; known_allergies: string; emergency_contact_name: string;
  emergency_contact_number: string; emergency_contact_relationship: string;
  medical_history: string; current_medications: string;
}

interface Appointment {
  id: string; appointment_date: string; duration_minutes?: number; type: string; status: string;
  department_id?: string; department_name?: string; doctor_name: string; doctor_specialty: string;
  facility_id?: string; doctor_id?: string; chief_complaint?: string; notes?: string;
  consultation_fee?: number; video_room_id?: string; reminder_sent?: boolean;
  payment_requested?: boolean; document_requested?: boolean; host_joined?: boolean; createdAt?: string;
}

interface Document {
  id: string; name: string; file_path: string; mime_type: string; created_at: string;
  uploaded_by: string; uploader_role: string; appointment_id?: string; ai_summary?: string;
}

// Utility functions
const getAge = (dob: string) => {
  if (!dob) return "N/A";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} years`;
};

const cleanSummary = (text: string) => {
  if (!text) return "";
  return text.replace(/[=*]/g, "").replace(/[▬►▪•]/g, "").replace(/\n{3,}/g, "\n\n").trim();
};

const TimerDisplay = ({ seconds }: { seconds: number }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLast30Sec = seconds <= 30;
  return (
    <div className={`text-lg font-mono font-bold ${isLast30Sec ? "text-red-600 animate-pulse" : "text-amber-600"}`}>
      {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
    </div>
  );
};

// const PatientPendingOverlay = () => (
//   <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
//     <div className="bg-gray-50 rounded-lg px-6 py-4 shadow-md text-center font-medium space-y-3">
//       <div>⏳ Pending – Your appointment is waiting for your approval.</div>
//       {/* Button moved to parent, overlay only visual */}
//     </div>
//   </div>
// );

const DoctorViewAppiontment: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [uploadPatientId, setUploadPatientId] = useState<string | null>(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentPermission, setDocumentPermission] = useState<string>("false");
  const [consultationFee, setConsultationFee] = useState<string>("false");
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const [videoMeeting, setVideoMeeting] = useState<{
    showMeeting: boolean; meetingId: string; participantName: string;
    appointmentId: string; userRole: "patient" | "doctor";
  }>({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "patient" });
const [joiningMeeting, setJoiningMeeting] = useState(false);
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    loadUser();
  }, []);

  const loadPatientData = async (patientRecord: any) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", patientRecord.user_id)
      .single();
    const fullPatient: PatientProfile = {
      id: patientRecord.id, user_id: patientRecord.user_id,
      first_name: profileData?.first_name || "", last_name: profileData?.last_name || "",
      email: profileData?.email || "", phone_number: profileData?.phone_number || "",
      date_of_birth: patientRecord.date_of_birth || "", gender: patientRecord.gender || "",
      blood_group: patientRecord.blood_group || "", height: patientRecord.height || 0,
      weight: patientRecord.weight || 0, known_allergies: patientRecord.known_allergies || "",
      emergency_contact_name: patientRecord.emergency_contact_name || "",
      emergency_contact_number: patientRecord.emergency_contact_number || "",
      emergency_contact_relationship: patientRecord.emergency_contact_relationship || "",
      medical_history: patientRecord.medical_history || "", current_medications: patientRecord.current_medications || "",
    };
    setPatient(fullPatient);

    // Load all appointments
    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`id, appointment_date, type, status, facility_id, doctor_id, department_id, payment_requested, document_requested`)
      .eq("patient_id", patientRecord.id)
      .order("appointment_date", { ascending: false });
    if (appointmentsData) {
      const formatted = await Promise.all(appointmentsData.map(async (apt: any) => {
        let departmentName = "N/A";
        if (apt.department_id) {
          const { data: deptData } = await supabase.from("departments").select("name").eq("id", apt.department_id).single();
          if (deptData) departmentName = deptData.name;
        }
        let doctorName = "N/A", doctorSpecialty = "N/A";
        if (apt.doctor_id) {
          const { data: doctorData } = await supabase.from("medical_professionals").select("name, specialty").eq("user_id", apt.doctor_id).single();
          if (doctorData) { doctorName = doctorData.name; doctorSpecialty = doctorData.specialty; }
        }
        return { id: apt.id, appointment_date: apt.appointment_date, type: apt.type, status: apt.status, department_name: departmentName, doctor_name: doctorName, doctor_specialty: doctorSpecialty, facility_id: apt.facility_id, doctor_id: apt.doctor_id, payment_requested: apt.payment_requested, document_requested: apt.document_requested };
      }));
      setAppointments(formatted);
    }

    // Current appointment
    if (appointmentId) {
      const { data: aptData, error: aptError } = await supabase
        .from("appointments")
        .select(`id, appointment_date, duration_minutes, type, status, department_id, facility_id, doctor_id, patient_id, chief_complaint, notes, consultation_fee, video_room_id, reminder_sent, payment_requested, document_requested, created_at`)
        .eq("id", appointmentId).single();
      if (!aptError && aptData) {
        let departmentName = "N/A";
        if (aptData.department_id) {
          const { data: deptData } = await supabase.from("departments").select("name").eq("id", aptData.department_id).single();
          if (deptData) departmentName = deptData.name;
        }
        let doctorName = "N/A";
        if (aptData.doctor_id) {
          const { data: doctorData } = await supabase.from("medical_professionals").select("medical_speciality").eq("user_id", aptData.doctor_id).single();
          if (doctorData) doctorName = doctorData.name;
        }
        setCurrentAppointment({
          id: aptData.id, appointment_date: aptData.appointment_date, duration_minutes: aptData.duration_minutes,
          type: aptData.type, status: aptData.status, department_name: departmentName, department_id: aptData.department_id,
          doctor_name: doctorName, doctor_specialty: "", facility_id: aptData.facility_id, doctor_id: aptData.doctor_id,
          chief_complaint: aptData.chief_complaint, notes: aptData.notes, consultation_fee: aptData.consultation_fee,
          video_room_id: aptData.video_room_id, reminder_sent: aptData.reminder_sent,
          payment_requested: aptData.payment_requested, document_requested: aptData.document_requested, createdAt: aptData.created_at,
        });
      }
    }

    // Documents
    if (appointmentId) {
      const { data: docsData } = await supabase.from("documents").select("*").eq("appointment_id", appointmentId).order("created_at", { ascending: false });
      if (docsData) setDocuments(docsData);
    }
  };

  const fetchData = async () => {
    if (!Id) return;
    try {
      setLoading(true);
      const { data: patientData } = await supabase.from("patients").select("*").eq("user_id", Id).maybeSingle();
      if (!patientData) throw new Error("Patient not found");
      await loadPatientData(patientData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [Id, appointmentId]);

  useEffect(() => {
    if (!currentAppointment || currentAppointment.status !== "pending" || !currentAppointment.createdAt) {
      setTimeLeft(null);
      return;
    }
    const interval = setInterval(() => {
      const deadline = new Date(currentAppointment.createdAt!).getTime() + 30 * 60 * 1000;
      const remaining = deadline - Date.now();
      if (remaining <= 0) { setTimeLeft(0); clearInterval(interval); }
      else setTimeLeft(Math.floor(remaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentAppointment?.status, currentAppointment?.createdAt]);

  const handleDeleteDocument = async (doc: Document) => {
    if (!userId) { toast({ title: "Error", description: "You must be logged in", variant: "destructive" }); return; }
    setDeletingDocId(doc.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: "patient", reason: "Deleted by patient" }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Delete failed");
      toast({ title: "Success", description: "Document deleted successfully" });
      await fetchData();
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setDeletingDocId(null); }
  };

  const handleJoinVideo = (appointment: Appointment) => {
    if (!appointment.video_room_id) { toast({ title: "Error", description: "No video room available", variant: "destructive" }); return; }
    if (appointment.status !== "confirmed") { toast({ title: "Cannot Join", description: "Only confirmed appointments can be joined", variant: "destructive" }); return; }
    if (appointment.type !== "teleconsultation") { toast({ title: "Not a Teleconsultation", description: "Video is only available for teleconsultation appointments", variant: "destructive" }); return; }
    const participantName = patient ? `${patient.first_name} ${patient.last_name}` : "Patient";
    setVideoMeeting({ showMeeting: true, meetingId: appointment.video_room_id, participantName, appointmentId: appointment.id, userRole: "patient" });
  };

 

  const startCompleteWithUpload = () => { setPendingCompletion(true); setShowUploadModal(true); };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!patient) return <div className="p-4">Patient not found</div>;

  const isPending = currentAppointment?.status === "pending";
  const isCompleted = currentAppointment?.status === "completed";
  const isCancelled = currentAppointment?.status === "cancelled";

  if (videoMeeting.showMeeting) {
    const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
    return (
      <div className="inset-0 bg-white">
        <VideoMeeting isHost={false} apiKey={apiKey} meetingId={videoMeeting.meetingId} name={videoMeeting.participantName}
          onMeetingLeave={() => setVideoMeeting({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "patient" })}
          micEnabled webcamEnabled containerId="video-container" meetingTitle="Consultation with Doctor"
          appointmentId={videoMeeting.appointmentId} userId={userId || ""} userRole="doctor" enableDocumentSharing />
      </div>
    );
  }
  const handleConfirmAppointment = async () => {
  if (!appointmentId) return;

  try {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "confirmed",
        document_requested: documentPermission === "true",
        consultation_fee: consultationFee || null,
        payment_requested: consultationFee ? true : false
      })
      .eq("id", appointmentId);

    if (error) throw error;

    toast({
      title: "Appointment Confirmed",
      description: "Appointment confirmed successfully"
    });

    setIsDialogOpen(false);
    fetchData();

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
};

  
    const PaymentCompleted = async () => {
      if (!appointmentId) {
        toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
        return;
      }
      setPaymentRequestLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/request_payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ appointment_id: appointmentId }),
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Payment request failed");
        toast({ title: "Payment Requested", description: "Payment request sent successfully." });
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: err.message || "Failed to request payment", variant: "destructive" });
      } finally {
        setPaymentRequestLoading(false);
      }
    };
  
    const handleJoinMeeting = async () => {
      setJoiningMeeting(true);
      if (!appointmentId || !userId) return;
      const { error } = await supabase
        .from("appointments")
        .update({ host_joined: true })
        .eq("id", appointmentId)
        .eq("doctor_id", userId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      setJoiningMeeting(false);
    };
  
    const cancelAppointment = async () => {
      if (!cancelReason.trim()) {
        toast({ title: "Error", description: "Cancellation reason is required", variant: "destructive" });
        return;
      }
      setCancelling(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        mixpanelInstance.track(
          userRole === "doctor" ? "Doctor Cancel Appointment" : "Facility Cancel Appointment",
          { appointmentId: currentAppointment?.id, patientId: patient?.id, userRole, reason: cancelReason, notes: cancelNotes }
        );
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        let payload: any = { appointment_id: currentAppointment?.id, reason: cancelReason, notes: cancelNotes };
        if (userRole === "doctor") payload.doctor_id = user.id;
        else if (userRole === "facility") {
          payload.department_id = currentAppointment?.department_id;
          payload.facility_id = currentAppointment?.facility_id;
        } else payload.patient_id = patient?.id;
        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment",
          { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }
        );
        if (!response.ok) throw new Error(await response.text());
        setOpenCancel(false);
        setCancelReason("");
        setCancelNotes("");
        await fetchData();
        toast({ title: "Success", description: "Appointment cancelled." });
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to cancel appointment", variant: "destructive" });
      } finally {
        setCancelling(false);
      }
    };
  
    const completeAppointment = async () => {
      setCompleting(true);
      try {
        const { error } = await supabase
          .from("appointments")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", appointmentId)
          .eq("patient_id", patient?.id);
        if (error) throw error;
        toast({ title: "Appointment Completed", description: "You have marked this appointment as completed." });
        setOpenComplete(false);
        await fetchData();
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: err.message || "Failed to complete appointment", variant: "destructive" });
      } finally {
        setCompleting(false);
      }
    };

    // const BookingCompleted = async (
    //   document_requested: boolean,
    //   payment_requested: boolean
    // ) => {
    //   if (!appointmentId) {
    //     toast({
    //       title: "Error",
    //       description: "No appointment selected",
    //       variant: "destructive"
    //     });
    //     return;
    //   }
    
    //   setCompleting(true);
    
    //   try {
    //     // ✅ Check Appointment Status
    //     const { data: appointment, error: statusError } = await supabase
    //       .from("appointments")
    //       .select("status")
    //       .eq("id", appointmentId)
    //       .single();
    
    //     if (statusError) throw statusError;
    
    //     // ✅ If Already Confirmed → Direct Update
    //     if (appointment?.status === "confirmed") {
    //       const { error: updateError } = await supabase
    //         .from("appointments")
    //         .update({
    //           document_requested,
    //           payment_requested,
    //           updated_at: new Date().toISOString()
    //         })
    //         .eq("id", appointmentId);
    
    //       if (updateError) throw updateError;
    
    //       toast({
    //         title: "Appointment Updated",
    //         description: "Appointment updated successfully."
    //       });
    
    //       await fetchData();
    //       return;
    //     }
    
    //     // ✅ If Pending → Call Edge Function
    //     if (appointment?.status === "pending") {
    //       const { data: sessionData } = await supabase.auth.getSession();
    //       const token = sessionData.session?.access_token;
    
    //       if (!token) throw new Error("Unable to authenticate request");
    
    //       const response = await fetch(
    //         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
    //         {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`
    //           },
    //           body: JSON.stringify({
    //             appointment_id: appointmentId,
    //             payment_requested,
    //             document_requested,
    //             confirmed_by_role: "doctor"
    //           })
    //         }
    //       );
    
    //       const responseData = await response.json();
    
    //       if (!response.ok)
    //         throw new Error(responseData?.message || JSON.stringify(responseData));
    
    //       toast({
    //         title: "Appointment Confirmed",
    //         description: "Doctor confirmation succeeded."
    //       });
    
    //       await fetchData();
    //     }
    
    //   } catch (err: any) {
    //     console.error(err);
    
    //     toast({
    //       title: "Error",
    //       description: err.message || "Failed to confirm appointment",
    //       variant: "destructive"
    //     });
    
    //   } finally {
    //     setCompleting(false);
    //   }
    // };
const BookingCompleted = async (
  document_requested: boolean,
  payment_requested: boolean
) => {
  if (!appointmentId) {
    toast({
      title: "Error",
      description: "No appointment selected",
      variant: "destructive"
    });
    return;
  }

  setCompleting(true);

  try {
    // ✅ Check Appointment Status
    const { data: appointment, error: statusError } = await supabase
      .from("appointments")
      .select("status")
      .eq("id", appointmentId)
      .single();

    if (statusError) throw statusError;

    // ✅ If Already Confirmed → Direct Update
    if (appointment?.status === "confirmed") {
      const { error: updateError } = await supabase
        .from("appointments")
        .update({
          document_requested,
          payment_requested,
          updated_at: new Date().toISOString()
        })
        .eq("id", appointmentId);

      if (updateError) throw updateError;

      toast({
        title: "Appointment Updated",
        description: "Appointment updated successfully."
      });

      await fetchData();
      return;
    }

    // ✅ If Pending → Call Edge Function
    if (appointment?.status === "pending") {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) throw new Error("Unable to authenticate request");

      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            appointment_id: appointmentId,
            payment_requested,
            document_requested,
            confirmed_by_role: "doctor"
          })
        }
      );

      const responseData = await response.json();

      if (!response.ok)
        throw new Error(responseData?.message || JSON.stringify(responseData));

      toast({
        title: "Appointment Confirmed",
        description: "Doctor confirmation succeeded."
      });

      await fetchData();
    }

  } catch (err: any) {
    console.error(err);

    toast({
      title: "Error",
      description: err.message || "Failed to confirm appointment",
      variant: "destructive"
    });

  } finally {
    setCompleting(false);
  }
};

    const PatientPendingOverlay = () => (
      <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
          
          <div className="bg-gray-50 rounded-lg px-6 py-4 shadow-md text-center font-medium space-y-3">
            
            <div>
              ⏳ Pending – Your appointment is waiting for your approval.
            </div>
    
              <Button
                variant="doctor"
                onClick={() => setIsDialogOpen(true)}
                disabled={isCompleted || isCancelled}
                className="w-full"
              >
                Confired your Appointment
              </Button>
    
          </div>
    
        </div>
    );

    const handleConfirmCompletion = () => {

  BookingCompleted(
    documentPermission === "true",
    consultationFee === "true"
  );

  setIsDialogOpen(false);
};

  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <div><h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1><Badge variant="outline" className="bg-blue-50 text-blue-700"><User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}</Badge></div>
        {currentAppointment?.status === "pending" && timeLeft !== null && timeLeft > 0 && <div className="flex items-center bg-white p-2 rounded-md shadow-sm"><span className="text-sm font-medium">Time remaining:</span><TimerDisplay seconds={timeLeft} /></div>}
        <Button variant="doctor" onClick={() => setIsDialogOpen(true)} disabled={isCompleted || isCancelled}>Confirm your Appointment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Personal & Medical Info */}
         <div className="space-y-6">
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
                        <CardTitle className="text-white flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle>
                        <CardDescription className="text-blue-100">Patient details and demographics</CardDescription>
                      </div>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start space-x-3"><User className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Full Name</p><p className="text-sm text-muted-foreground">{patient.first_name} {patient.last_name}</p></div></div>
                          <div className="flex items-start space-x-3"><Mail className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Email</p><p className="text-sm text-muted-foreground">{patient.email || "N/A"}</p></div></div>
                          <div className="flex items-start space-x-3"><Phone className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Phone Number</p><p className="text-sm text-muted-foreground">{patient.phone_number || "N/A"}</p></div></div>
                          <div className="flex items-start space-x-3"><Calendar className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Date of Birth</p><p className="text-sm text-muted-foreground">{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(patient.date_of_birth)})</p></div></div>
                          <div className="flex items-start space-x-3"><Heart className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Blood Group</p><p className="text-sm text-muted-foreground">{patient.blood_group || "N/A"}</p></div></div>
                          <div className="flex items-start space-x-3"><div className="flex space-x-2"><Ruler className="h-5 w-5" /><Weight className="h-5 w-5" /></div><div><p className="text-sm font-medium">Height / Weight</p><p className="text-sm text-muted-foreground">{patient.height || "?"} cm / {patient.weight || "?"} kg</p></div></div>
                        </div>
                      </CardContent>
                    </Card>
        
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3">
                        <CardTitle className="text-white flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Medical Information</CardTitle>
                        <CardDescription className="text-green-100">Health records, allergies, and medications</CardDescription>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div><p className="text-sm font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-red-500" /> Known Allergies</p><p className="text-sm text-muted-foreground mt-1">{patient.known_allergies || "None reported"}</p></div>
                        <div><p className="text-sm font-medium flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-blue-500" /> Medical History</p><p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{patient.medical_history || "No history recorded"}</p></div>
                        <div><p className="text-sm font-medium flex items-center"><Pill className="h-4 w-4 mr-1 text-green-500" /> Current Medications</p><p className="text-sm text-muted-foreground mt-1">{patient.current_medications || "None"}</p></div>
                        <Separator />
                        <div><p className="text-sm font-medium">Emergency Contact</p><div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">Name:</span> {patient.emergency_contact_name || "N/A"}</div><div><span className="text-muted-foreground">Phone:</span> {patient.emergency_contact_number || "N/A"}</div><div><span className="text-muted-foreground">Relationship:</span> {patient.emergency_contact_relationship || "N/A"}</div></div></div>
                      </CardContent>
                    </Card>
                  </div>

        {/* Right column - Actions & Documents */}
        <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Upload Document Card - only if document_requested true and not pending */}
                      {/* {currentAppointment?.document_requested === true && !isPending && (
                        <Card className="bg-indigo-50/40 border-indigo-100">
                          <CardContent className="p-4 flex flex-col items-center text-center">
                            <p className="text-xs text-indigo-600 font-medium mb-1">Upload for medical or lab Reports</p>
                            <Upload className="h-8 w-8 text-indigo-600" />
                            <h3 className="font-semibold">Upload Document</h3>
                            <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
                            <Button onClick={() => setShowUploadModal(true)} variant="outline" className="w-full mb-2">
                              <Upload className="mr-2 h-4 w-4" /> Select File
                            </Button>
                            <p className="text-xs text-muted-foreground mb-2">Add medical reports, prescriptions, lab reports, or other documents</p>
                            <p className="text-[11px] text-gray-500">Supported formats: PDF, PNG, JPG, JPEG</p>
                          </CardContent>
                        </Card>
                      )} */}
                      {/* Upload Document Card - always shown, overlay when pending */}
        <Card className="relative bg-indigo-50/40 border-indigo-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
          <CardTitle className="text-white flex items-center gap-2">
            <DockIcon className="h-5 w-5" />
            Share Documents
          </CardTitle>
        </div>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <p className="text-xs text-indigo-600 font-medium mb-1">Upload for medical or lab Reports</p>
            <Upload className="h-8 w-8 text-indigo-600" />
            <h3 className="font-semibold">Upload Document</h3>
            <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
            <Button onClick={() => setShowUploadModal(true)} variant="outline" className="w-full mb-2">
              <Upload className="mr-2 h-4 w-4" /> Select File
            </Button>
            <p className="text-xs text-muted-foreground mb-2">Add medical reports, prescriptions, lab reports, or other documents</p>
            <p className="text-[11px] text-gray-500">Supported formats: PDF, PNG, JPG, JPEG</p>
            {/* {isPending && <PendingOverlay />} */}
            {(isPending || !currentAppointment?.document_requested) && <PatientPendingOverlay />}
          </CardContent>
        </Card>
        
                      {/* Request Payment Card - only if payment_requested true and not pending */}
                      {/* {currentAppointment?.payment_requested === true && !isPending && userRole === "doctor" && (
                        <Card className="bg-amber-50/40 border-amber-100">
                          <CardContent className="p-4 flex flex-col items-center text-center">
                            {currentAppointment?.payment_requested ? (
                              <>
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <h3 className="font-semibold text-green-700">Consultation Fee Paid</h3>
                                <p className="text-xs text-muted-foreground">Awaiting patient payment</p>
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-8 w-8 text-amber-600 mb-2" />
                                <h3 className="font-semibold">Request Consultation Fee</h3>
                                <p className="text-xs text-muted-foreground mb-3">Send consultation fee request to patient</p>
                                <Button onClick={PaymentCompleted} disabled={paymentRequestLoading} variant="outline" className="w-full">
                                  {paymentRequestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                                  Request Consultation Fee
                                </Button>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )} */}
        {/* Request Payment Card - always shown for doctor, overlay when pending */}
        {userRole === "doctor" && (
          <Card className="relative bg-amber-50/40 border-amber-100">
           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
          <CardTitle className="text-white flex items-center gap-2">
            <CardLink className="h-5 w-5" />
            Consultation Fee Payment
          </CardTitle>
        </div>
            <CardContent className="p-4 flex flex-col items-center text-center">
              {currentAppointment?.payment_requested ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-700">Consultation Fee Paid</h3>
                  <p className="text-xs text-muted-foreground">Awaiting patient payment</p>
                </>
              ) : (
                <>
                  <CreditCard className="h-8 w-8 text-amber-600 mb-2" />
                  <h3 className="font-semibold">Request Consultation Fee</h3>
                  <p className="text-xs text-muted-foreground mb-3">Send consultation fee request to patient</p>
                  <Button onClick={PaymentCompleted} disabled={paymentRequestLoading} variant="outline" className="w-full">
                    {paymentRequestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                    Request Consultation Fee
                  </Button>
                </>
              )}
              {/* {isPending && <PendingOverlay />} */}
              {(isPending || !currentAppointment?.payment_requested) && <PatientPendingOverlay />}
            </CardContent>
          </Card>
        )}
                      {/* Teleconsultation Card */}
                      {currentAppointment && currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
                        <Card className="bg-sky-50/40 border-sky-100 sm:col-span-2">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Telescope className="h-5 w-5" />
           Start Tele Consultation Meeting
          </CardTitle>
        </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-base"><Video className="mr-2 h-5 w-5 text-sky-600" /> Upcoming Teleconsultation</CardTitle>
                            <CardDescription>Scheduled on {new Date(currentAppointment.appointment_date).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Button onClick={() => { handleJoinVideo(currentAppointment); handleJoinMeeting(); }} className="w-full">
                              <Video className="mr-2 h-4 w-4" /> Start Tele Consultation
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel Appointment</Button>
                              <Button variant="doctor" onClick={startCompleteWithUpload} className="flex-1">Mark as Completed</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
        
                      {/* Non-teleconsultation action buttons */}
                      {userRole === "doctor" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
                        <Card className="bg-rose-50/40 border-rose-100">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
          <CardTitle className="text-white flex items-center gap-2">
            <LucideAppWindow className="h-5 w-5" />
            Appointment Actions
          </CardTitle>
        </div>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
                          <CardContent className="flex gap-2">
                            <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel Appointment</Button>
                            <Button variant="doctor" onClick={() => setOpenComplete(true)} disabled={isCompleted || isCancelled}>Mark as Completed</Button>
                          </CardContent>
                        </Card>
                      )}
                      {userRole === "facility" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
                        <Card className="bg-rose-50/40 border-rose-100">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
          <CardTitle className="text-white flex items-center gap-2">
            <LucideAppWindow className="h-5 w-5" />
            Appointment Actions
          </CardTitle>
        </div>
                          <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
                          <CardContent>
                            <Button variant="doctor" onClick={() => setOpenComplete(true)} disabled={isCompleted || isCancelled}>Mark as Completed</Button>
                          </CardContent>
                          
                        </Card>
                      )}
                    </div>
        
                    {/* Medical Documents Card - only if document_requested true */}
                    {/* {currentAppointment?.document_requested === true && ( */}
                      <Card className="relative border-0 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
                          <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5" /> Medical Documents</CardTitle>
                          <CardDescription className="text-emerald-100">Prescriptions, reports & lab results</CardDescription>
                        </div>
                        <CardContent className="p-6 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
                          {documents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                              <p>No documents uploaded yet</p>
                            </div>
                          ) : (
                            documents.map((doc) => {
                              let bgColor = "bg-white", borderColor = "border-gray-200", roleLabel = doc.uploader_role;
                              if (doc.uploader_role === "patient") { bgColor = "bg-blue-50"; borderColor = "border-blue-200"; roleLabel = "Patient"; }
                              else if (doc.uploader_role === "doctor") { bgColor = "bg-green-50"; borderColor = "border-green-200"; roleLabel = "Doctor"; }
                              else if (doc.uploader_role === "department") { bgColor = "bg-purple-50"; borderColor = "border-purple-200"; roleLabel = "Department"; }
                              return (
                                <div key={doc.id} className={`border rounded-lg p-3 ${bgColor} ${borderColor} hover:shadow transition`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div>
                                      <div>
                                        <p className="font-medium text-sm">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • Uploaded by: <span className="font-medium">{roleLabel}</span></p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        {deletingDocId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                      </Button>
                                    </div>
                                  </div>
                                  {doc.ai_summary && (
                                    <div className="mt-2 flex items-center justify-between">
                                      <Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </CardContent>
                           {/* {isPending && <PendingOverlay />} */}
                               {(isPending || !currentAppointment?.document_requested) && <PatientPendingOverlay />}
        
                      </Card>
                    {/* )} */}
        
                  </div>
      </div>

      {/* Modals */}
       {openComplete && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-lg font-semibold">Complete Appointment</h3>
                  <p className="text-sm text-gray-600">Please choose how you want to complete this appointment.</p>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" onClick={() => { setPendingCompletion(true); setShowUploadModal(true); setOpenComplete(false); }}>
                      <FileText className="h-4 w-4 mr-2" /> Complete with Prescription
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { setOpenComplete(false); completeAppointment(); }}>
                      Complete without Prescription
                    </Button>
                  </div>
                  <div className="flex justify-end"><Button variant="ghost" onClick={() => setOpenComplete(false)}>Cancel</Button></div>
                </div>
              </div>
            )}
    
            {openCancel && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-lg font-semibold">Cancel Appointment</h3>
                  <div><label className="text-sm font-medium">Reason *</label><input className="w-full border rounded p-2 mt-1" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Why are you cancelling?" /></div>
                  <div><label className="text-sm font-medium">Notes (optional)</label><textarea className="w-full border rounded p-2 mt-1" rows={3} value={cancelNotes} onChange={(e) => setCancelNotes(e.target.value)} placeholder="Additional details" /></div>
                  <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenCancel(false)} disabled={cancelling}>Close</Button><Button variant="destructive" onClick={cancelAppointment} disabled={cancelling}>{cancelling ? "Cancelling..." : "Confirm Cancel"}</Button></div>
                </div>
              </div>
            )}
    
            <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="hospital_admin" />
    
            {showUploadModal && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                    <h3 className="text-lg font-semibold">Upload Document for {patient.first_name} {patient.last_name}</h3>
                    <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentId(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  {userRole === "patient" ? (
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                      <UploadPrescriptionForm patientId={patient.user_id} appointmentId={appointmentId || null} uploadedBy="patient" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
                    </div>
                  ) : userRole === "doctor" ? (
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                      <UploadPrescriptionForm patientId={patient.user_id} doctorId={userId!} appointmentId={appointmentId || null} uploadedBy="doctor" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
                    </div>
                  ) : userRole === "facility" ? (
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                      <UploadPrescriptionForm patientId={patient.user_id} depertmentId={userId!} appointmentId={appointmentId || null} uploadedBy="doctor" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
                      {/* <UploadPrescriptionForm patientId={patient.user_id} depertmentId={userId!} appointmentId={appointmentId || null} uploadedBy="doctor" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => { mixpanelInstance.track('Facility Upload Cancelled', { appointmentId: selectedAppointmentId , patientName: `${patient.first_name} ${patient.last_name}`, userRole }); setShowUploadModal(false); }} /> */}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Confirm Appointment</DialogTitle>
      <DialogDescription>
        Please confirm document permission and consultation fee
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">

      {/* Document Permission */}
      <div className="grid gap-2">
        <Label>Document Permission</Label>

        <RadioGroup
          value={documentPermission}
          onValueChange={setDocumentPermission}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="doc-yes" />
            <Label htmlFor="doc-yes">Allow</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="doc-no" />
            <Label htmlFor="doc-no">Not Allow</Label>
          </div>

        </RadioGroup>
      </div>


      {/* Consultation Fee */}
      <div className="grid gap-2">
        <Label>Consultation Fee</Label>

        <input
          type="number"
          placeholder="Enter Consultation Fee"
          className="border rounded-lg px-3 py-2"
          value={consultationFee}
          onChange={(e) => setConsultationFee(e.target.value)}
        />
      </div>

    </div>

    <DialogFooter className="flex gap-2">

      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(false)}
      >
        Cancel
      </Button>

      <Button
        variant="doctor"
        onClick={handleConfirmAppointment}
      >
        Confirm Appointment
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>
            <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
              <DialogContent className="max-w-3xl md:max-w-4xl">
                <DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div>
                <DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter>
              </DialogContent>
            </Dialog>
             {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Booking</DialogTitle>
                <DialogDescription>
                  Please provide the following information before marking as completed.
                </DialogDescription>
              </DialogHeader>
    
              <div className="grid gap-4 py-4">
                
    
                <div className="grid gap-2">
                  <Label>Document Permission</Label>
    <RadioGroup
      value={documentPermission}
      onValueChange={setDocumentPermission}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="doc-yes" />
        <Label htmlFor="doc-yes">Yes</Label>
      </div>
    
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="doc-no" />
        <Label htmlFor="doc-no">No</Label>
      </div>
    </RadioGroup>
                </div>
    
                <div className="grid gap-2">
                  <Label>Consultation Fee Collected?</Label>
                 <RadioGroup
      value={consultationFee}
      onValueChange={setConsultationFee}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="fee-yes" />
        <Label htmlFor="fee-yes">Yes</Label>
      </div>
    
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="fee-no" />
        <Label htmlFor="fee-no">No</Label>
      </div>
    </RadioGroup>
                </div>
              </div>
    
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmCompletion} type="button">
                  Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Consultation</DialogTitle>
          <DialogDescription>
            Please confirm the following details before completing the appointment.
          </DialogDescription>
        </DialogHeader>
    
        <div className="grid gap-5 py-4">
    
          {/* Document Permission */}
          <div className="grid gap-2">
            <Label className="font-semibold">
              Allow Patient to share Digital Medical / Lab Documents?
            </Label>
    
            <RadioGroup
              value={documentPermission}
              onValueChange={setDocumentPermission}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="doc-yes" />
                <Label htmlFor="doc-yes">Yes</Label>
              </div>
    
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="doc-no" />
                <Label htmlFor="doc-no">No</Label>
              </div>
            </RadioGroup>
    
            {/* Preview Message */}
            {documentPermission && (
              <div className="bg-gray-100 p-3 rounded-md text-sm mt-2">
                {documentPermission === "true"
                  ? "📄 I have read the privacy policy of the platform. I shall handle the patients digital documents with care and will not share with any one else."
                  : ""}
              </div>
            )}
          </div>
    
          {/* Consultation Fee */}
          
          <div className="grid gap-2">
      <Label className="font-semibold">
        Consultation Fee Payment Request
      </Label>
    
      <RadioGroup
        value={consultationFee}
        onValueChange={setConsultationFee}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="fee-yes" />
          <Label htmlFor="fee-yes">Yes</Label>
        </div>
    
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="fee-no" />
          <Label htmlFor="fee-no">No</Label>
        </div>
      </RadioGroup>
    
      {/* Preview Message */}
      {consultationFee && (
        <div className="bg-gray-100 p-3 rounded-md text-sm mt-2">
          {consultationFee === "true"
            ? "💳 Send Consultation fee Payment request to the patient"
            : "🆓 There is no need for Online Consultation Fee Payment. I shall collect it in offline."}
        </div>
      )}
    </div>
    
        </div>
    
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
    
          <Button
            onClick={handleConfirmCompletion}
            type="button"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default DoctorViewAppiontment;