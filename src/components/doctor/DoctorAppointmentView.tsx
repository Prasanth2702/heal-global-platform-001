import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Mail, Phone, Calendar, FileText, Upload, Eye, Video, CreditCard,
  Loader2, IndianRupee, Trash2, Stethoscope
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoMeeting from "../VideoMeeting";

// Interfaces same as before, but with doctor-specific fields
interface DoctorProfile {
  id: string; user_id: string; medical_speciality: string; license_number: string;
  years_experience: number; consultation_fee: number; is_verified: boolean;
  address?: string; city?: string; state?: string;prefix?: string;
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

const DoctorAppointmentView: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
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
  const [videoMeeting, setVideoMeeting] = useState<{ showMeeting: boolean; meetingId: string; participantName: string; appointmentId: string; userRole: "patient" | "doctor"; }>({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "doctor" });
  const [joiningMeeting, setJoiningMeeting] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    loadUser();
    fetchData();
  }, [Id, appointmentId]);

  const cleanSummary = (text: string) => text.replace(/[=*]/g, "").replace(/[▬►▪•]/g, "").replace(/\n{3,}/g, "\n\n").trim();

  useEffect(() => {
    if (!currentAppointment || currentAppointment.status !== "pending") {
      setTimeLeft(null);
      return;
    }
    if (!currentAppointment.createdAt) return;
    const interval = setInterval(() => {
      const deadline = new Date(currentAppointment.createdAt!).getTime() + 30 * 60 * 1000;
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
    return <div className={`text-lg font-mono font-bold ${seconds <= 30 ? "text-red-600 animate-pulse" : "text-amber-600"}`}>{mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}</div>;
  };

  const fetchData = async () => {
    if (!Id) return;
    setLoading(true);
    try {
      const { data: doctorData, error: docError } = await supabase
        .from("medical_professionals")
        .select("*")
        .eq("user_id", Id)
        .maybeSingle();
      if (docError) throw docError;
      setDoctor(doctorData);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", doctorData.user_id)
        .maybeSingle();
      setDoctorProfile(profileData);

      if (appointmentId) {
        const { data: aptData, error: aptError } = await supabase
          .from("appointments")
          .select(`
            id, appointment_date, duration_minutes, type, status, department_id, facility_id,
            doctor_id, patient_id, chief_complaint, notes, consultation_fee, video_room_id,
            reminder_sent, payment_requested, document_requested, host_joined, created_at
          `)
          .eq("id", appointmentId)
          .single();
        if (!aptError && aptData) {
          let departmentName = "N/A";
          if (aptData.department_id) {
            const { data: deptData } = await supabase.from("departments").select("name").eq("id", aptData.department_id).single();
            if (deptData) departmentName = deptData.name;
          }
          setCurrentAppointment({
            id: aptData.id, appointment_date: aptData.appointment_date, duration_minutes: aptData.duration_minutes,
            type: aptData.type, status: aptData.status, department_name: departmentName, department_id: aptData.department_id,
            doctor_name: `${profileData?.prefix?.charAt(0)?.toUpperCase() + profileData?.prefix?.slice(1) || ''} ${profileData?.first_name} ${profileData?.last_name}`, doctor_specialty: doctorData.medical_speciality,
            facility_id: aptData.facility_id, doctor_id: aptData.doctor_id, chief_complaint: aptData.chief_complaint,
            notes: aptData.notes, consultation_fee: aptData.consultation_fee, video_room_id: aptData.video_room_id,
            reminder_sent: aptData.reminder_sent, payment_requested: aptData.payment_requested,
            document_requested: aptData.document_requested, host_joined: aptData.host_joined || false, createdAt: aptData.created_at,
          });
        }

        const { data: docsData } = await supabase.from("documents").select("*").eq("appointment_id", appointmentId).order("created_at", { ascending: false });
        if (docsData) setDocuments(docsData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadModal = async () => {
    if (!appointmentId) return;
    const { data } = await supabase.from("appointments").select("patient_id").eq("id", appointmentId).single();
    if (data) setUploadPatientId(data.patient_id);
    setShowUploadModal(true);
  };

  const handleJoinVideo = (appointment: Appointment) => {
    if (!appointment.video_room_id || appointment.status !== "confirmed" || appointment.type !== "teleconsultation") {
      toast({ title: "Cannot Join", description: "Invalid appointment for video", variant: "destructive" });
      return;
    }
    setVideoMeeting({
      showMeeting: true,
      meetingId: appointment.video_room_id,
      participantName: `${doctorProfile?.prefix?.charAt(0)?.toUpperCase() + doctorProfile?.prefix?.slice(1) || ''} ${doctorProfile?.first_name} ${doctorProfile?.last_name}`,
      appointmentId: appointment.id,
      userRole: "doctor",
    });
  };

  const handleJoinMeeting = async () => {
    setJoiningMeeting(true);
    if (!appointmentId || !userId) return;
    await supabase.from("appointments").update({ host_joined: true }).eq("id", appointmentId).eq("doctor_id", userId);
    setJoiningMeeting(false);
  };

  const PaymentCompleted = async () => {
    setPaymentRequestLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/request_payment", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      toast({ title: "Payment Requested", description: "Payment request sent successfully." });
      await fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPaymentRequestLoading(false);
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    setDeletingDocId(doc.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: "doctor", reason: "Deleted by doctor" }),
      });
      toast({ title: "Success", description: "Document deleted" });
      await fetchData();
    } catch (err) { console.error(err); } finally { setDeletingDocId(null); }
  };

  const cancelAppointment = async () => {
    if (!cancelReason.trim()) return;
    setCancelling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ appointment_id: currentAppointment?.id, reason: cancelReason, notes: cancelNotes, doctor_id: user?.id }),
      });
      setOpenCancel(false);
      await fetchData();
      toast({ title: "Success", description: "Appointment cancelled." });
    } catch (err) { console.error(err); } finally { setCancelling(false); }
  };

  const completeAppointment = async () => {
    setCompleting(true);
    try {
      await supabase.from("appointments").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", appointmentId);
      toast({ title: "Appointment Completed" });
      setOpenComplete(false);
      await fetchData();
    } catch (err) { console.error(err); } finally { setCompleting(false); }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!doctor || !currentAppointment) return <div className="p-4">No data found</div>;

  const isPending = currentAppointment.status === "pending";

  if (videoMeeting.showMeeting) {
    const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
    return (
      <VideoMeeting
        isHost={true}
        apiKey={apiKey}
        meetingId={videoMeeting.meetingId}
        name={videoMeeting.participantName}
        onMeetingLeave={() => setVideoMeeting({ ...videoMeeting, showMeeting: false })}
        micEnabled={true}
        webcamEnabled={true}
        containerId="video-container"
        meetingTitle="Consultation with Patient"
        appointmentId={videoMeeting.appointmentId}
        userId={userId || ""}
        userRole="doctor"
        enableDocumentSharing={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
            <Badge variant="secondary" className="mt-1"><User className="h-3 w-3 mr-1" /> Doctor ID: {doctor.user_id}</Badge>
          </div>
          {isPending && timeLeft !== null && timeLeft > 0 && (
            <div className="bg-white p-2 rounded-md shadow-sm flex items-center gap-2">
              <span className="text-sm font-medium">Auto-cancel in:</span>
              <TimerDisplay seconds={timeLeft} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Doctor Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><CardTitle><Stethoscope className="inline mr-2" /> Doctor Information</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-2">
                <div><span className="font-medium">Name:</span> {doctorProfile?.prefix?.charAt(0)?.toUpperCase() + doctorProfile?.prefix?.slice(1) || ''} {doctorProfile?.first_name} {doctorProfile?.last_name}</div>
                <div><span className="font-medium">Specialty:</span> {doctor.medical_speciality}</div>
                <div><span className="font-medium">License:</span> {doctor.license_number}</div>
                <div><span className="font-medium">Experience:</span> {doctor.years_experience} years</div>
                <div><span className="font-medium">Consultation Fee:</span> ₹{doctor.consultation_fee}</div>
                <div><span className="font-medium">Email:</span> {doctorProfile?.email}</div>
                <div><span className="font-medium">Phone:</span> {doctorProfile?.phone_number}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><CardTitle><Calendar className="inline mr-2" /> Appointment Info</CardTitle></CardHeader>
              <CardContent className="p-6">
                <div><span className="font-medium">Date & Time:</span> {new Date(currentAppointment.appointment_date).toLocaleString()}</div>
                <div><span className="font-medium">Type:</span> {currentAppointment.type}</div>
                <div><span className="font-medium">Status:</span> <Badge variant="outline" className="bg-green-50">{currentAppointment.status}</Badge></div>
                {currentAppointment.chief_complaint && <div><span className="font-medium">Chief Complaint:</span> {currentAppointment.chief_complaint}</div>}
                {currentAppointment.notes && <div><span className="font-medium">Notes:</span> {currentAppointment.notes}</div>}
              </CardContent>
            </Card>
          </div>

          {/* Right: Actions & Documents */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentAppointment.document_requested === true && !isPending && (
                <Card className="bg-indigo-50/40">
                  <CardContent className="p-4 text-center">
                    <Upload className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Upload Document</h3>
                    <Button onClick={handleOpenUploadModal} variant="outline" className="mt-2 w-full">Select File</Button>
                  </CardContent>
                </Card>
              )}

              {currentAppointment.payment_requested === true && !isPending && (
                <Card className="bg-amber-50/40">
                  <CardContent className="p-4 text-center">
                    <IndianRupee className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Consultation Fee</h3>
                    <p className="text-xs mb-2">₹{currentAppointment.consultation_fee || doctor.consultation_fee}</p>
                    <Button onClick={PaymentCompleted} disabled={paymentRequestLoading} variant="outline" className="w-full">
                      {paymentRequestLoading ? <Loader2 className="animate-spin" /> : <CreditCard className="mr-2" />} Request Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
                <Card className="bg-sky-50/40 col-span-2">
                  <CardContent className="p-4 text-center">
                    <Video className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Tele Consultation</h3>
                    <Button onClick={() => { handleJoinVideo(currentAppointment); handleJoinMeeting(); }} className="w-full mt-2">Join Tele Consultation</Button>
                  </CardContent>
                </Card>
              )}

              {currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
                <Card className="bg-rose-50/40 col-span-2">
                  <CardContent className="flex gap-2 justify-center p-4">
                    <Button variant="destructive" onClick={() => setOpenCancel(true)}>Cancel Appointment</Button>
                    <Button variant="doctor" onClick={() => setOpenComplete(true)}>Mark as Completed</Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {currentAppointment.document_requested === true && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"><CardTitle><FileText className="inline mr-2" /> Medical Documents</CardTitle></CardHeader>
                <CardContent className="p-6">
                  {documents.length === 0 ? <p className="text-muted-foreground">No documents uploaded</p> : (
                    <div className="space-y-2">
                      {documents.map(doc => (
                        <div key={doc.id} className="border rounded p-2 flex justify-between items-center">
                          <div><p className="font-medium">{doc.name}</p><p className="text-xs">Uploaded by {doc.uploader_role}</p></div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500">{deletingDocId === doc.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals (similar to patient) */}
      {openComplete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold">Complete Appointment</h3>
            <div className="space-y-3 mt-4">
              <Button className="w-full" onClick={() => { setOpenComplete(false); setShowUploadModal(true); }}>Complete with Prescription</Button>
              <Button variant="outline" className="w-full" onClick={completeAppointment}>Complete without Prescription</Button>
            </div>
            <Button variant="ghost" className="mt-4 w-full" onClick={() => setOpenComplete(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {openCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold">Cancel Appointment</h3>
            <input className="w-full border rounded p-2 mt-2" placeholder="Reason *" value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
            <textarea className="w-full border rounded p-2 mt-2" rows={3} placeholder="Notes" value={cancelNotes} onChange={e => setCancelNotes(e.target.value)} />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenCancel(false)}>Close</Button>
              <Button variant="destructive" onClick={cancelAppointment} disabled={cancelling}>Confirm Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="doctor" />

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between"><h3 className="text-lg font-semibold">Upload Document</h3><button onClick={() => setShowUploadModal(false)}>✕</button></div>
            <div className="p-6">
              <UploadPrescriptionForm patientId={uploadPatientId!} doctorId={userId!} appointmentId={appointmentId || null} uploadedBy="doctor" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
        <DialogContent><DialogHeader><DialogTitle>AI Summary</DialogTitle></DialogHeader><div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">{cleanSummary(selectedSummary)}</div><DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointmentView;