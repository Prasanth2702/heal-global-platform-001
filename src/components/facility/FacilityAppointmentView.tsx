import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, FileText, Upload, Eye, Stethoscope, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FacilityProfile {
  id: string; facility_name: string; facility_type: string; license_number: string;
  address: string; rating: number; total_reviews: number; is_verified: boolean;
  email?: string; phone_number?: string; city?: string; state?: string;
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

const FacilityAppointmentView: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facility, setFacility] = useState<FacilityProfile | null>(null);
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
  const [openComplete, setOpenComplete] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    loadUser();
    fetchData();
  }, [Id, appointmentId]);

  const cleanSummary = (text: string) => text.replace(/[=*]/g, "").replace(/[▬►▪•]/g, "").replace(/\n{3,}/g, "\n\n").trim();

  const fetchData = async () => {
    if (!Id) return;
    setLoading(true);
    try {
      const { data: facilityData, error: facError } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", Id)
        .single();
      if (facError) throw facError;
      setFacility(facilityData);

      if (appointmentId) {
        const { data: aptData } = await supabase
          .from("appointments")
          .select(`id, appointment_date, type, status, department_id, facility_id, patient_id, chief_complaint, notes, consultation_fee, document_requested, created_at`)
          .eq("id", appointmentId)
          .single();
        if (aptData) {
          let departmentName = "N/A";
          if (aptData.department_id) {
            const { data: deptData } = await supabase.from("departments").select("name").eq("id", aptData.department_id).single();
            if (deptData) departmentName = deptData.name;
          }
          setCurrentAppointment({
            id: aptData.id, appointment_date: aptData.appointment_date, type: aptData.type, status: aptData.status,
            department_name: departmentName, facility_id: aptData.facility_id, chief_complaint: aptData.chief_complaint,
            notes: aptData.notes, consultation_fee: aptData.consultation_fee, document_requested: aptData.document_requested,
            createdAt: aptData.created_at, doctor_name: "N/A", doctor_specialty: "",
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

  const handleDeleteDocument = async (doc: Document) => {
    setDeletingDocId(doc.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await fetch("https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: "hospital_admin", reason: "Deleted by facility admin" }),
      });
      toast({ title: "Success", description: "Document deleted" });
      await fetchData();
    } catch (err) { console.error(err); } finally { setDeletingDocId(null); }
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
  if (!facility || !currentAppointment) return <div className="p-4">No data found</div>;

  const isPending = currentAppointment.status === "pending";

  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-6">
      <div className="relative flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
          <Badge variant="secondary" className="mt-1"><User className="h-3 w-3 mr-1" /> Facility ID: {facility.id}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><CardTitle><Calendar className="inline mr-2" /> Facility Information</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div><span className="font-medium">Name:</span> {facility.facility_name}</div>
              <div><span className="font-medium">Type:</span> {facility.facility_type}</div>
              <div><span className="font-medium">Rating:</span> {facility.rating} ⭐ ({facility.total_reviews} reviews)</div>
              {facility.is_verified && <Badge className="mt-2">✓ Verified</Badge>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><CardTitle><Stethoscope className="inline mr-2" /> Facility Details</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div><span className="font-medium">License:</span> {facility.license_number}</div>
              <div><span className="font-medium">Email:</span> {facility.email}</div>
              <div><span className="font-medium">Phone:</span> {facility.phone_number}</div>
              <div><span className="font-medium">Address:</span> {facility.address}, {facility.city}, {facility.state}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {currentAppointment.document_requested === true && !isPending && (
            <Card className="bg-indigo-50/40">
              <CardContent className="p-4 text-center">
                <Upload className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <h3 className="font-semibold">Upload Document</h3>
                <Button onClick={handleOpenUploadModal} variant="outline" className="mt-2 w-full">Select File</Button>
              </CardContent>
            </Card>
          )}

          {currentAppointment.status === "confirmed" && (
            <Card className="bg-rose-50/40">
              <CardContent className="p-4 text-center">
                <Button variant="doctor" onClick={() => setOpenComplete(true)}>Mark as Completed</Button>
              </CardContent>
            </Card>
          )}

          {currentAppointment.document_requested === true && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"><CardTitle><FileText className="inline mr-2" /> Medical Documents</CardTitle></CardHeader>
              <CardContent className="p-6">
                {documents.length === 0 ? <p className="text-muted-foreground">No documents uploaded</p> : (
                  documents.map(doc => (
                    <div key={doc.id} className="border rounded p-2 mb-2 flex justify-between items-center">
                      <div><p className="font-medium">{doc.name}</p><p className="text-xs">Uploaded by {doc.uploader_role}</p></div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500">{deletingDocId === doc.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {openComplete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold">Complete Appointment</h3>
            <div className="space-y-3 mt-4">
              <Button className="w-full" onClick={completeAppointment} disabled={completing}>Mark as Completed</Button>
              <Button variant="outline" className="w-full" onClick={() => setOpenComplete(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="hospital_admin" />

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between"><h3 className="text-lg font-semibold">Upload Document</h3><button onClick={() => setShowUploadModal(false)}>✕</button></div>
            <div className="p-6">
              <UploadPrescriptionForm patientId={uploadPatientId!} depertmentId={userId!} appointmentId={appointmentId || null} uploadedBy="department" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => setShowUploadModal(false)} />
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

export default FacilityAppointmentView;