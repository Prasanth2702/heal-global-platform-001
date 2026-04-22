// doctor.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, FileText, Upload, Eye, Stethoscope, Video, Loader2, Trash2, DockIcon, Telescope, CreditCard, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import VideoMeeting from "../VideoMeeting";
import { CardLink } from "react-bootstrap";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Interfaces (same as patient, but with doctor-specific fields)
interface DoctorProfile {
  id: string; user_id: string; medical_speciality: string; license_number: string;
  years_experience: number; consultation_fee: number; rating: number; total_reviews: number;
  about_yourself?: string; is_verified: boolean; address?: string; city?: string; state?: string;
}
interface Appointment { id: string; appointment_date: string; type: string; status: string; doctor_name: string; doctor_specialty: string; video_room_id?: string; payment_requested?: boolean; document_requested?: boolean; host_joined?: boolean; createdAt?: string; }
interface Document { id: string; name: string; file_path: string; created_at: string; uploader_role: string; ai_summary?: string; }

const cleanSummary = (text: string) => text?.replace(/[=*]/g, "").replace(/[▬►▪•]/g, "").replace(/\n{3,}/g, "\n\n").trim() || "";
const DoctorPendingOverlay = () => (<div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg"><div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md">⏳ Pending — Waiting for confirmation.</div></div>);

const PatientViewAppiontment: React.FC = () => {
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
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [joiningMeeting, setJoiningMeeting] = useState(false);
  const [videoMeeting, setVideoMeeting] = useState({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "doctor" as const });
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
const [paymentCompleted, setPaymentCompleted] = useState(false);
const [meetingEnded, setMeetingEnded] = useState(false);
const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(false);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null)); }, []);
const userRole = "doctor";
const isDoctor = true;   // since this is the doctor view
  const fetchData = async () => {
    if (!Id) return;
    try {
      setLoading(true);
      const { data: doctorData } = await supabase.from("medical_professionals").select("*").eq("user_id", Id).maybeSingle();
      if (!doctorData) throw new Error("Doctor not found");
      setDoctor(doctorData);
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", doctorData.user_id).single();
      setDoctorProfile(profileData);
      if (appointmentId) {
        const { data: aptData } = await supabase.from("appointments").select("*").eq("id", appointmentId).single();
        if (aptData) setCurrentAppointment(aptData);
        const { data: docsData } = await supabase.from("documents").select("*").eq("appointment_id", appointmentId).order("created_at", { ascending: false });
        if (docsData) setDocuments(docsData);
      }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [Id, appointmentId]);
useEffect(() => {
  const checkPayment = async () => {
    if (!appointmentId) return;
    const { data, error } = await supabase
      .from('payments')
      .select('status')
      .eq('appointment_id', appointmentId)
      .eq('status', 'completed')
      .maybeSingle();
    if (!error && data) setPaymentCompleted(true);
  };
  checkPayment();
}, [appointmentId]);
  const handleOpenUploadModal = async () => {
    if (!appointmentId) { toast({ title: "Error", description: "No appointment selected", variant: "destructive" }); return; }
    const { data } = await supabase.from("appointments").select("patient_id").eq("id", appointmentId).single();
    if (data?.patient_id) setUploadPatientId(data.patient_id);
    setShowUploadModal(true);
  };

  const handleJoinVideo = (appointment: Appointment) => {
    if (!appointment.video_room_id) { toast({ title: "Error", description: "No video room available", variant: "destructive" }); return; }
    const participantName = doctorProfile ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}` : "Doctor";
    setVideoMeeting({ showMeeting: true, meetingId: appointment.video_room_id, participantName, appointmentId: appointment.id, userRole: "doctor" });
  };

  const handleJoinMeeting = async () => {
    setJoiningMeeting(true);
    await supabase.from("appointments").update({ host_joined: true }).eq("id", appointmentId).eq("doctor_id", userId);
    setJoiningMeeting(false);
  };

  const handleDeleteDocument = async (doc: Document) => {
    setDeletingDocId(doc.id);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: "doctor", reason: "Deleted by doctor" }),
    });
    toast({ title: "Success", description: "Document deleted" });
    await fetchData();
    setDeletingDocId(null);
  };

  const PaymentCompleted = async () => {
    setPaymentRequestLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/request_payment", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
    toast({ title: "Payment Requested", description: "Payment request sent." });
    await fetchData();
    setPaymentRequestLoading(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!doctor) return <div>Doctor not found</div>;

  if (videoMeeting.showMeeting) {
    const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
    return <VideoMeeting isHost={true} apiKey={apiKey} meetingId={videoMeeting.meetingId} name={videoMeeting.participantName} onMeetingLeave={() => setVideoMeeting({ ...videoMeeting, showMeeting: false })} micEnabled webcamEnabled containerId="video-container" meetingTitle="Consultation with Patient" appointmentId={videoMeeting.appointmentId} userId={userId || ""} userRole="patient" enableDocumentSharing />;
  }

  const isPending = currentAppointment?.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
             <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          {/* Left: Back button */}
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0 w-full md:w-auto">
            ← Back
          </Button>
        
          {/* Center: Title + Badge + Punctuality Message */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Appointment Details
            </h1>
            <div className="flex justify-center mt-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <User className="h-3 w-3 mr-1" /> Doctor ID: {doctor.user_id}
              </Badge>
            </div>
        
            {/* Punctuality message (unchanged) */}
            {currentAppointment?.type && (
              <div className="mt-3 px-3 py-2 bg-amber-50 border-l-4 border-amber-500 rounded-r-md text-left max-w-md mx-auto">
                <p className="text-xs text-amber-800">
                  ⏰ Please respect the doctor's valuable time. 
                  {currentAppointment.type === "teleconsultation" 
                    ? " Join the teleconsultation on time. Late arrivals may result in meeting termination."
                    : " Reach the hospital at the correct time. Late arrival may cause the meeting to be cancelled."}
                </p>
              </div>
            )}
          </div>
        
          {/* Right: Status + Timer (only if pending) */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div>
              Status :{" "}
              <span className={`
                capitalize px-2 py-0.5 rounded-full text-xs font-medium
                ${currentAppointment.status === "confirmed" && "bg-green-100 text-green-800"}
                ${currentAppointment.status === "pending" && "bg-yellow-100 text-yellow-800"}
                ${currentAppointment.status === "cancelled" && "bg-red-100 text-red-800"}
                ${currentAppointment.status === "completed" && "bg-blue-100 text-blue-800"}
              `}>
                {currentAppointment.status}
              </span>
            </div>
            {/* {currentAppointment?.status === "pending" && timeLeft !== null && timeLeft > 0 && (
              <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                <span className="text-sm font-medium text-gray-700">Time remaining:</span>
                <TimerDisplay seconds={timeLeft} />
              </div>
            )} */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3"><CardTitle className="text-white flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Doctor Personal Information</CardTitle></div>
                            <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Full Name</span><span className="text-gray-900">Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Specialty</span><span className="text-gray-900">{doctor.medical_speciality}</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">License Number</span><span className="text-gray-900">{doctor.license_number}</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Experience</span><span className="text-gray-900">{doctor.years_experience} years</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Consultation Fee</span><span className="text-gray-900">₹{doctor.consultation_fee}</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Email</span><span className="text-gray-900">{doctorProfile?.email}</span></div>
                              <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Phone</span><span className="text-gray-900">{doctorProfile?.phone_number}</span></div>
                              {doctor.address && <div className="flex justify-between"><span className="font-medium text-gray-600">Address</span><span className="text-gray-900 text-right">{doctor.address}, {doctor.city}, {doctor.state}</span></div>}
                            </CardContent>
                          </Card>
            
                          <Card className="border-0 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3"><CardTitle className="text-white flex items-center gap-2"><Calendar className="h-5 w-5" /> Appointment Information</CardTitle></div>
                            <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
                              {currentAppointment ? (
                                <>
                                  <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Date & Time</span><span className="text-gray-900">{new Date(currentAppointment.appointment_date).toLocaleString()}</span></div>
                                  <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Type</span><span className="text-gray-900 capitalize">{currentAppointment.type}</span></div>
                                  <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Status</span><Badge variant="outline" className="capitalize bg-green-50 text-green-700">{currentAppointment.status}</Badge></div>
                                </>
                              ) : (
                                <div className="text-center text-muted-foreground py-8">No appointment selected or found.</div>
                              )}
                            </CardContent>
                          </Card>
        </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* {currentAppointment?.document_requested === true && !isPending && ( */}
                  <Card className="relative  bg-indigo-50/40 border-indigo-100">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <DockIcon className="h-5 w-5" />
    Share Documents
  </CardTitle>
</div>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Upload for medical or lab Reports</p>
                      <Upload className="h-8 w-8 text-indigo-600 mb-2" />
                      <h3 className="font-semibold">Upload Document</h3>
                      <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
                      <Button onClick={handleOpenUploadModal} variant="outline" className="w-full"><Upload className="mr-2 h-4 w-4" /> Select File</Button>
                      <p className="text-xs text-muted-foreground mb-2">Add medical reports, prescriptions, lab reports, or other documents</p>
                      <p className="text-[11px] text-gray-500">Supported formats: PDF, PNG, JPG, JPEG</p>
                    </CardContent>
                    {/* {isPending && <PendingOverlay />} */}
                        {/* {(isPending || !currentAppointment?.document_requested) && <DoctorPendingOverlay />} */}
       {(isPending || !currentAppointment?.document_requested) && (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
    <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md text-center font-medium">
      
      {isPending ? (
        <>⏳ Pending — Waiting for confirmation.</>
      ) : (
        <>Please share the medical reports and lab reports directly.</>
      )}

    </div>
  </div>
)}
                  </Card>
                {/* )} */}

                {/* {currentAppointment?.payment_requested === true && !isPending && ( */}
                  <Card className="relative bg-amber-50/40 border-amber-100">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <CardLink className="h-5 w-5" />
    Consultation Fee Payment
  </CardTitle>
</div>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="flex gap-3"><IndianRupee className="h-8 w-8 text-amber-600 mb-2" /><div><h3 className="font-semibold">Consultation Fee</h3><p className="text-xs text-muted-foreground mb-3">₹{doctor.consultation_fee || "0"}</p></div></div>
                      <div className="space-y-2">
                        {!currentAppointment?.payment_requested && <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-md">💡 Please request payment from the doctor after the consultation fee is complete.</p>}
                        {userRole === "doctor" && paymentCompleted ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span className="font-medium">Consultation Fee Paid</span></div>
                        ) : userRole === "doctor" && !paymentCompleted && (
                          <Button size="default" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md" onClick={() => navigate(`/patient/appointment-payment/${appointmentId}`)}>Consultation Fee ₹{doctor.consultation_fee || "0"}</Button>
                        )}
                        {currentAppointment?.payment_requested && !paymentCompleted && <p className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded-md">⏳ Meeting started – you can now request consultation fee.</p>}
                      </div>
                    </CardContent>
                    {/* {isPending && <PendingOverlay />} */}
       {(isPending || !currentAppointment?.payment_requested) && (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
    <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md text-center font-medium">
      
      {isPending ? (
        <>⏳ Pending — Waiting for confirmation.</>
      ) : (
        <>💳 Please pay the consultation fee directly.</>
      )}

    </div>
  </div>
)}

                  </Card>
                {/* )} */}

                {currentAppointment?.type === "teleconsultation" && currentAppointment?.status === "confirmed" && (
                  <Card className="bg-sky-50/40 border-sky-100 sm:col-span-2">
                               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <Telescope className="h-5 w-5" />
    Join Tele Consultation Meeting
  </CardTitle>
</div>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Video className="h-8 w-8 text-sky-600 mb-2" />
                      <h3 className="font-semibold">Tele Consultation</h3>
                      <p className="text-xs text-muted-foreground mb-3">Join the live session</p>
                      <div className="mt-2 mb-4">
                        {meetingEnded ? <p className="text-sm text-red-600 font-medium">This consultation session has ended</p>
                        : isDoctor ? <p className="text-sm text-blue-600 font-medium">You are hosting this consultation. You can start the session anytime.</p>
                        : currentAppointment?.host_joined ? <p className="text-sm text-green-600 font-medium">Doctor is available. You can now join the consultation.</p>
                        : <p className="text-sm text-yellow-600 font-medium">Waiting for doctor to start the consultation</p>}
                      </div>
                      <Button onClick={() => { mixpanelInstance.track("Doctor Join Tele Consultation", { appointmentId: currentAppointment.id, timestamp: new Date().toISOString() }); handleJoinVideo(currentAppointment); handleJoinMeeting(); }} disabled={joiningMeeting || isJoinButtonDisabled || meetingEnded || currentAppointment?.host_joined !== true} className="w-full">
                        {meetingEnded ? "Consultation Ended" : joiningMeeting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</> : isJoinButtonDisabled ? "Consultation not started yet" : <><Video className="mr-2 h-4 w-4" /> Join Tele Consultation</>}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* {currentAppointment?.document_requested === true && ( */}
                <Card className="relative border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
                    <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5" /> Medical Documents</CardTitle>
                    <CardDescription className="text-emerald-100">Prescriptions, reports & lab results</CardDescription>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-slate-800">
                    {documents.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No documents uploaded yet</p></div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => {
                          let bgColor = "bg-white", borderColor = "border-gray-200", roleLabel = doc.uploader_role;
                          if (doc.uploader_role === "patient") { bgColor = "bg-blue-50"; borderColor = "border-blue-200"; roleLabel = "Patient"; }
                          else if (doc.uploader_role === "doctor") { bgColor = "bg-green-50"; borderColor = "border-green-200"; roleLabel = "Doctor"; }
                          else if (doc.uploader_role === "department") { bgColor = "bg-purple-50"; borderColor = "border-purple-200"; roleLabel = "Department"; }
                          return (
                            <div key={doc.id} className={`border rounded-lg p-4 ${bgColor} ${borderColor} hover:shadow-md transition-all`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3"><div className="bg-primary/10 p-2 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div><div><p className="font-medium text-gray-900 dark:text-white">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleString()} • Uploaded by: <span className="font-medium">{roleLabel}</span></p></div></div>
                                <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500 hover:text-red-700 hover:bg-red-50">{deletingDocId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                              </div>
                              {doc.ai_summary && <div className="mt-3 flex justify-end"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View AI Summary</Button></div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                  {/* {isPending && <PendingOverlay />} */}
                      {isPending  && <DoctorPendingOverlay />}

                </Card>
              {/* )} */}
            </div>
        </div>
      </div>
       <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
              {showUploadModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white dark:bg-slate-800">
                      <h3 className="text-lg font-semibold">Upload Document for Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h3>
                      <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentId(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <div className="p-6">
                      <UploadPrescriptionForm patientId={uploadPatientId!} doctorId={userId!} appointmentId={appointmentId || null} uploadedBy="doctor" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
                    </div>
                  </div>
                </div>
              )}
              <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
                <DialogContent className="max-w-3xl md:max-w-4xl">
                  <DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div>
                  <DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter>
                </DialogContent>
              </Dialog>
    </div>
  );
};

export default PatientViewAppiontment;