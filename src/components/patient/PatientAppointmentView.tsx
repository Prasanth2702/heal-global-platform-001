import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Mail, Phone, Calendar, Clock, FileText, Upload, Eye, Heart, Ruler, Weight,
  AlertCircle, Stethoscope, Pill, Video, CreditCard, Loader2, Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoMeeting from "../VideoMeeting";

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

interface Vitals {
  id: string; recorded_at: string; temperature: number; blood_pressure_systolic: number;
  blood_pressure_diastolic: number; heart_rate: number; recorded_by: string;
}

const PatientAppointmentView: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
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
    fetchData();
  }, [Id, appointmentId]);

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

  useEffect(() => {
    if (!currentAppointment || currentAppointment.status !== "pending") {
      setTimeLeft(null);
      return;
    }
    if (!currentAppointment.createdAt) return;
    const interval = setInterval(() => {
      const createdAt = new Date(currentAppointment.createdAt!).getTime();
      const deadline = createdAt + 30 * 60 * 1000;
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentAppointment?.status, currentAppointment?.createdAt]);

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

  const fetchData = async () => {
    if (!Id) return;
    setLoading(true);
    try {
      // Fetch patient profile
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", Id)
         .maybeSingle();
      if (patientError) throw patientError;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", patientData.user_id)
        .maybeSingle();
      setPatient({
        id: patientData.id,
        user_id: patientData.user_id,
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email || "",
        phone_number: profileData?.phone_number || "",
        date_of_birth: patientData.date_of_birth || "",
        gender: patientData.gender || "",
        blood_group: patientData.blood_group || "",
        height: patientData.height || 0,
        weight: patientData.weight || 0,
        known_allergies: patientData.known_allergies || "",
        emergency_contact_name: patientData.emergency_contact_name || "",
        emergency_contact_number: patientData.emergency_contact_number || "",
        emergency_contact_relationship: patientData.emergency_contact_relationship || "",
        medical_history: patientData.medical_history || "",
        current_medications: patientData.current_medications || "",
      });

      // Fetch current appointment
      if (appointmentId) {
        const { data: aptData, error: aptError } = await supabase
          .from("appointments")
          .select(`
            id, appointment_date, duration_minutes, type, status, department_id, facility_id,
            doctor_id, patient_id, chief_complaint, notes, consultation_fee, video_room_id,
            reminder_sent, payment_requested, document_requested, created_at
          `)
          .eq("id", appointmentId)
          .single();
        if (!aptError && aptData) {
          let departmentName = "N/A";
          if (aptData.department_id) {
            const { data: deptData } = await supabase
              .from("departments")
              .select("name")
              .eq("id", aptData.department_id)
              .single();
            if (deptData) departmentName = deptData.name;
          }
          let doctorName = "N/A";
          if (aptData.doctor_id) {
            const { data: docData } = await supabase
              .from("medical_professionals")
              .select("name")
              .eq("user_id", aptData.doctor_id)
              .single();
            if (docData) doctorName = docData.name;
          }
          setCurrentAppointment({
            id: aptData.id,
            appointment_date: aptData.appointment_date,
            duration_minutes: aptData.duration_minutes,
            type: aptData.type,
            status: aptData.status,
            department_name: departmentName,
            department_id: aptData.department_id,
            doctor_name: doctorName,
            doctor_specialty: "",
            facility_id: aptData.facility_id,
            doctor_id: aptData.doctor_id,
            chief_complaint: aptData.chief_complaint,
            notes: aptData.notes,
            consultation_fee: aptData.consultation_fee,
            video_room_id: aptData.video_room_id,
            reminder_sent: aptData.reminder_sent,
            payment_requested: aptData.payment_requested,
            document_requested: aptData.document_requested,
            createdAt: aptData.created_at,
          });
        }
      }

      // Fetch documents
      if (appointmentId) {
        const { data: docsData } = await supabase
          .from("documents")
          .select("*")
          .eq("appointment_id", appointmentId)
          .order("created_at", { ascending: false });
        if (docsData) setDocuments(docsData);
      }

      // Check payment status
      if (appointmentId) {
        const { data: payData } = await supabase
          .from("payments")
          .select("status")
          .eq("appointment_id", appointmentId)
          .eq("status", "completed")
          .maybeSingle();
        if (payData) setPaymentCompleted(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinVideo = (appointment: Appointment) => {
    if (!appointment.video_room_id) {
      toast({ title: "Error", description: "No video room available", variant: "destructive" });
      return;
    }
    if (appointment.status !== "confirmed") {
      toast({ title: "Cannot Join", description: "Only confirmed appointments can be joined", variant: "destructive" });
      return;
    }
    if (appointment.type !== "teleconsultation") {
      toast({ title: "Not a Teleconsultation", description: "Video is only for teleconsultations", variant: "destructive" });
      return;
    }
    const participantName = patient ? `${patient.first_name} ${patient.last_name}` : "Patient";
    setVideoMeeting({
      showMeeting: true,
      meetingId: appointment.video_room_id,
      participantName,
      appointmentId: appointment.id,
      userRole: "patient",
    });
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

  const handleDeleteDocument = async (doc: Document) => {
    if (!userId) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }
    setDeletingDocId(doc.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: "patient", reason: "Deleted by patient" }),
        }
      );
      if (!response.ok) throw new Error((await response.json()).error || "Delete failed");
      toast({ title: "Success", description: "Document deleted successfully" });
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setDeletingDocId(null);
    }
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const payload = { appointment_id: currentAppointment?.id, reason: cancelReason, notes: cancelNotes, patient_id: patient?.id };
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

  const BookingCompleted = async () => {
    if (!appointmentId) {
      toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
      return;
    }
    setCompleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ appointment_id: appointmentId, payment_requested: true, document_requested: true, confirmed_by_role: "patient" }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData?.message || JSON.stringify(responseData));
      toast({ title: "Appointment Confirmed", description: "Appointment confirmed successfully." });
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to confirm appointment", variant: "destructive" });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!patient || !currentAppointment) return <div className="p-4">No data found</div>;

  const isCompleted = currentAppointment.status === "completed";
  const isCancelled = currentAppointment.status === "cancelled";
  const isPending = currentAppointment.status === "pending";

  if (videoMeeting.showMeeting) {
    const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
    return (
      <div className="inset-0 bg-white">
        <VideoMeeting
          isHost={false}
          apiKey={apiKey}
          meetingId={videoMeeting.meetingId}
          name={videoMeeting.participantName}
          onMeetingLeave={() => setVideoMeeting({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "patient" })}
          micEnabled={true}
          webcamEnabled={true}
          containerId="video-container"
          meetingTitle="Consultation with Doctor"
          appointmentId={videoMeeting.appointmentId}
          userId={userId || ""}
          userRole="patient"
          enableDocumentSharing={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 mt-2"><User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}</Badge>
        </div>
        {isPending && timeLeft !== null && timeLeft > 0 && (
          <div className="bg-white p-2 rounded-md shadow-sm flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time remaining:</span>
            <TimerDisplay seconds={timeLeft} />
          </div>
        )}
        <Button variant="doctor" onClick={BookingCompleted} disabled={isCompleted || isCancelled}>Completed</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Patient Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
              <CardTitle className="text-white"><User className="inline mr-2 h-5 w-5" /> Personal Information</CardTitle>
              <CardDescription className="text-blue-100">Patient details and demographics</CardDescription>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="font-medium">Full Name:</span> {patient.first_name} {patient.last_name}</div>
              <div><span className="font-medium">Email:</span> {patient.email || "N/A"}</div>
              <div><span className="font-medium">Phone:</span> {patient.phone_number || "N/A"}</div>
              <div><span className="font-medium">DOB:</span> {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(patient.date_of_birth)})</div>
              <div><span className="font-medium">Blood Group:</span> {patient.blood_group || "N/A"}</div>
              <div><span className="font-medium">Height/Weight:</span> {patient.height || "?"} cm / {patient.weight || "?"} kg</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3">
              <CardTitle className="text-white"><Stethoscope className="inline mr-2 h-5 w-5" /> Medical Information</CardTitle>
              <CardDescription className="text-green-100">Health records, allergies, medications</CardDescription>
            </div>
            <CardContent className="p-6 space-y-3">
              <div><span className="font-medium">Allergies:</span> {patient.known_allergies || "None"}</div>
              <div><span className="font-medium">Medical History:</span> {patient.medical_history || "None"}</div>
              <div><span className="font-medium">Current Medications:</span> {patient.current_medications || "None"}</div>
              <Separator />
              <div><span className="font-medium">Emergency Contact:</span> {patient.emergency_contact_name || "N/A"} ({patient.emergency_contact_relationship}) - {patient.emergency_contact_number || "N/A"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Documents */}
        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentAppointment.document_requested === true && !isPending && (
              <Card className="bg-indigo-50/40 border-indigo-100">
                <CardContent className="p-4 text-center">
                  <Upload className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Upload Document</h3>
                  <Button onClick={() => setShowUploadModal(true)} variant="outline" className="mt-2 w-full">Select File</Button>
                </CardContent>
              </Card>
            )}

            {currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
              <Card className="bg-sky-50/40 border-sky-100 sm:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center"><Video className="mr-2 h-5 w-5 text-sky-600" /> Teleconsultation</CardTitle>
                  <CardDescription>Scheduled on {new Date(currentAppointment.appointment_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => { handleJoinVideo(currentAppointment); handleJoinMeeting(); }} className="w-full">
                    <Video className="mr-2 h-4 w-4" /> Start Tele Consultation
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel</Button>
                    <Button variant="doctor" onClick={() => { setPendingCompletion(true); setShowUploadModal(true); }} className="flex-1">Mark Completed</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
              <Card className="bg-rose-50/40 border-rose-100">
                <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel</Button>
                  <Button variant="doctor" onClick={() => setOpenComplete(true)} disabled={isCompleted || isCancelled}>Mark Completed</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Medical Documents */}
          {currentAppointment.document_requested === true && (
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
                <CardTitle className="text-white"><FileText className="inline mr-2 h-5 w-5" /> Medical Documents</CardTitle>
                <CardDescription className="text-emerald-100">Prescriptions, reports & lab results</CardDescription>
              </div>
              <CardContent className="p-6 max-h-[400px] overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="text-center text-muted-foreground">No documents uploaded yet</div>
                ) : (
                  documents.map(doc => {
                    let bgColor = "bg-white", roleLabel = doc.uploader_role;
                    if (doc.uploader_role === "patient") { bgColor = "bg-blue-50"; roleLabel = "Patient"; }
                    else if (doc.uploader_role === "doctor") { bgColor = "bg-green-50"; roleLabel = "Doctor"; }
                    else if (doc.uploader_role === "department") { bgColor = "bg-purple-50"; roleLabel = "Department"; }
                    return (
                      <div key={doc.id} className={`border rounded-lg p-3 mb-2 ${bgColor}`}>
                        <div className="flex justify-between items-center">
                          <div><p className="font-medium">{doc.name}</p><p className="text-xs">Uploaded by {roleLabel} on {new Date(doc.created_at).toLocaleDateString()}</p></div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500">{deletingDocId === doc.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</Button>
                          </div>
                        </div>
                        {doc.ai_summary && <Button variant="outline" size="sm" className="mt-2" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View AI Summary</Button>}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {openComplete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Complete Appointment</h3>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => { setPendingCompletion(true); setShowUploadModal(true); setOpenComplete(false); }}>Complete with Prescription</Button>
              <Button variant="outline" className="w-full" onClick={() => { setOpenComplete(false); completeAppointment(); }}>Complete without Prescription</Button>
            </div>
            <Button variant="ghost" onClick={() => setOpenComplete(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {openCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Cancel Appointment</h3>
            <input className="w-full border rounded p-2" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason *" />
            <textarea className="w-full border rounded p-2" rows={3} value={cancelNotes} onChange={(e) => setCancelNotes(e.target.value)} placeholder="Notes (optional)" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCancel(false)}>Close</Button>
              <Button variant="destructive" onClick={cancelAppointment} disabled={cancelling}>{cancelling ? "Cancelling..." : "Confirm Cancel"}</Button>
            </div>
          </div>
        </div>
      )}

      <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button onClick={() => { setShowUploadModal(false); setPendingCompletion(false); }}>✕</button>
            </div>
            <div className="p-6">
              <UploadPrescriptionForm
                patientId={patient.user_id}
                appointmentId={appointmentId || null}
                uploadedBy="patient"
                defaultDocumentType="medical_record"
                title="Upload Medical Document"
                onCancel={() => setShowUploadModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div>
          <DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointmentView;