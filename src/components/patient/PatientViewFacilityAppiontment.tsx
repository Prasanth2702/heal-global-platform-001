// PatientViewFacilityAppiontment.tsx (with department details)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Calendar, FileText, Upload, Eye, Building, Star, Loader2, Trash2, DockIcon, Hospital, Users, Bed, ClipboardList
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FacilityProfile {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: string;
  rating: number;
  total_reviews: number;
  about_facility?: string;
  number_of_staffs?: number;
  number_of_departments?: number;
  is_verified: boolean;
  city?: string;
  state?: string;
  country_code?: string;
  pin_code?: string;
  email?: string;
  phone_number?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  head_doctor_id?: string;
  bed_capacity?: number;
  available_beds?: number;
  staff_count?: number;
}

interface Appointment {
  id: string;
  appointment_date: string;
  type: string;
  status: string;
  department_id?: string;
  department?: Department; // joined data
  doctor_name?: string;
  patient_name?: string;
  document_requested?:string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  uploader_role: string;
  ai_summary?: string;
}

const cleanSummary = (text: string) => {
  if (!text) return "";
  return text.replace(/[=*]/g, "").replace(/[▬►▪•]/g, "").replace(/\n{3,}/g, "\n\n").trim();
};

const PatientViewFacilityAppiontment: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
const [facilityProfile, setFacilityProfile] = useState<any>(null);
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  const fetchData = async () => {
  if (!Id) return;

  try {
    setLoading(true);

    // Fetch facility by ID
   const { data: facilityData, error: facilityError } = await supabase
  .from("facilities")
  .select("*")
  .eq("id", Id)
  .maybeSingle();

if (facilityError) throw facilityError;
if (!facilityData) throw new Error("Facility not found");

// Set facility
setFacility(facilityData);

// Get admin_user_id
const adminUserId = facilityData.admin_user_id;

// Fetch profile using admin_user_id
const { data: profileData, error: profileError } = await supabase
  .from("profiles")
  .select("email, phone_number")
  .eq("user_id", adminUserId)
  .maybeSingle();

if (profileError) throw profileError;

if (profileData) {
  setFacilityProfile(profileData);
}

    // Fetch current appointment
    if (appointmentId) {
      const { data: aptData, error: aptError } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          type,
          status,
          department_id,
          doctor_id,
          patient_id,
          document_requested,
          host_joined
        `)
        .eq("id", appointmentId)
        .single();

      if (aptError) throw aptError;

      // Department fetch
      let departmentInfo: Department | undefined = undefined;

      if (aptData.department_id) {
        const { data: deptData } = await supabase
          .from("departments")
          .select(
            "id, name, description, head_doctor_id, bed_capacity, available_beds"
          )
          .eq("id", aptData.department_id)
          .single();

        if (deptData) departmentInfo = deptData;
      }

      // Doctor fetch
      let doctorName = "N/A";

      if (aptData.doctor_id) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("user_id", aptData.doctor_id)
          .single();

        if (profData)
          doctorName = `Dr. ${profData.first_name} ${profData.last_name}`;
      }

      // Patient fetch
      let patientName = "N/A";

      if (aptData.patient_id) {
        const { data: patData } = await supabase
          .from("patients")
          .select("user_id")
          .eq("user_id", aptData.patient_id)
          .single();

        if (patData?.user_id) {
          const { data: profData } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", patData.user_id)
            .single();

          if (profData)
            patientName = `${profData.first_name} ${profData.last_name}`;
        }
      }

      setCurrentAppointment({
        id: aptData.id,
        appointment_date: aptData.appointment_date,
        type: aptData.type,
        status: aptData.status,
        department_id: aptData.department_id,
        department: departmentInfo,
        doctor_name: doctorName,
        patient_name: patientName,
      });

      // Documents fetch
      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("appointment_id", appointmentId)
        .order("created_at", { ascending: false });

      if (docsData) setDocuments(docsData);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [Id, appointmentId]);

  const handleOpenUploadModal = async () => {
    if (!appointmentId) {
      toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("appointments")
      .select("patient_id")
      .eq("id", appointmentId)
      .single();
    if (error || !data) {
      toast({ title: "Error", description: "Could not find patient for this appointment", variant: "destructive" });
      return;
    }
    setUploadPatientId(data.patient_id);
    setShowUploadModal(true);
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
          body: JSON.stringify({
            document_id: doc.id,
            user_id: userId,
            user_role: "hospital_admin",
            reason: "Deleted by facility",
          }),
        }
      );
      if (!response.ok) throw new Error((await response.json()).error || "Delete failed");
      toast({ title: "Success", description: "Document deleted successfully" });
      await fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setDeletingDocId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading facility data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive m-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!facility) return <div className="p-4">Facility not found</div>;
   const isPending = currentAppointment?.status === "pending";


  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-6">
      <div className="relative flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">
          ← Back
        </Button>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Appointment Details
          </h1>
          <div className="flex justify-center mt-1">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Building className="h-3 w-3 mr-1" /> Facility ID: {facility.id}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Facility Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="h-5 w-5" /> Facility Information
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Facility Name</span>
                <span className="text-gray-900">{facility.facility_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Type</span>
                <span className="text-gray-900 capitalize">{facility.facility_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Reviews</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {facility.rating} ⭐ ({facility.total_reviews} reviews)
                </Badge>
              </div>
              {facility.is_verified && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  ✓ Verified
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="h-5 w-5" /> Facility Details
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">License Number</span>
                <span className="text-gray-900">{facility.license_number}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-900">{facilityProfile?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Phone</span>
                <span className="text-gray-900">{facilityProfile?.phone_number || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Staff Count</span>
                <span className="text-gray-900">{facility.number_of_staffs || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Departments</span>
                <span className="text-gray-900">{facility.number_of_departments || "N/A"}</span>
              </div>
              {facility.address && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Address</span>
                  <span className="text-gray-900 text-right">
                    {facility.address}, {facility.city}, {facility.state}, {facility.country_code} {facility.pin_code}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {facility.about_facility && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{facility.about_facility}</p>
              </CardContent>
            </Card>
          )}

          {/* Department Information Card - only if department exists for this appointment */}
          {currentAppointment?.department && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Department Information
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Details of the department handling this appointment
                </CardDescription>
              </div>
              <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Department Name</span>
                  <span className="text-gray-900">{currentAppointment.department.name}</span>
                </div>
                {currentAppointment.department.description && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Description</span>
                    <span className="text-gray-900 text-right">{currentAppointment.department.description}</span>
                  </div>
                )}
                {currentAppointment.department.head_doctor_id && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Head Doctor ID</span>
                    <span className="text-gray-900">{currentAppointment.department.head_doctor_id}</span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Bed Capacity</span>
                  <span className="text-gray-900">{currentAppointment.department.bed_capacity ?? "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Available Beds</span>
                  <span className="text-gray-900">{currentAppointment.department.available_beds ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Staff Count</span>
                  <span className="text-gray-900">{currentAppointment.department.staff_count ?? "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          )}
          {currentAppointment && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Appointment Summary
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Date & Time</span>
                  <span className="text-gray-900">{new Date(currentAppointment.appointment_date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Type</span>
                  <span className="text-gray-900 capitalize">{currentAppointment.type}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Status</span>
                  <Badge variant="outline" className="capitalize bg-green-50 text-green-700">
                    {currentAppointment.status}
                  </Badge>
                </div>
                {currentAppointment.doctor_name && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Doctor</span>
                    <span className="text-gray-900">{currentAppointment.doctor_name}</span>
                  </div>
                )}
                {currentAppointment.patient_name && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Patient</span>
                    <span className="text-gray-900">{currentAppointment.patient_name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Appointment Info, Upload & Documents */}
        <div className="space-y-6">
          {/* Appointment summary card */}
          

          <Card className="relative bg-indigo-50/40 border-indigo-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DockIcon className="h-5 w-5" /> Share Documents
              </CardTitle>
            </div>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <p className="text-xs text-indigo-600 font-medium mb-1">
                Upload medical or lab reports
              </p>
              <Upload className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold">Upload Document</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Add prescription, report, or medical record
              </p>
              <Button onClick={handleOpenUploadModal} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Select File
              </Button>
              <p className="text-[11px] text-gray-500 mt-2">
                Supported formats: PDF, PNG, JPG, JPEG
              </p>
            </CardContent>
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

          <Card className="relative border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" /> Medical Documents
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Prescriptions, reports & lab results
              </CardDescription>
            </div>
            <CardContent className="p-6 bg-white dark:bg-slate-800">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => {
                    let bgColor = "bg-white", roleLabel = doc.uploader_role;
                    if (doc.uploader_role === "patient") {
                      bgColor = "bg-blue-50";
                      roleLabel = "Patient";
                    } else if (doc.uploader_role === "doctor") {
                      bgColor = "bg-green-50";
                      roleLabel = "Doctor";
                    } else if (doc.uploader_role === "department") {
                      bgColor = "bg-purple-50";
                      roleLabel = "Department";
                    }
                    return (
                      <div key={doc.id} className={`border rounded-lg p-4 ${bgColor} hover:shadow-md transition-all`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(doc.created_at).toLocaleString()} • Uploaded by:{" "}
                                <span className="font-medium">{roleLabel}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const { data } = await supabase.storage
                                  .from("patient_files")
                                  .createSignedUrl(doc.file_path, 60);
                                if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc)}
                              disabled={deletingDocId === doc.id}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingDocId === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* {doc.ai_summary && (
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSummary(doc.ai_summary!);
                                setShowSummaryModal(true);
                              }}
                            >
                              View AI Summary
                            </Button>
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>

            {(isPending)}
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AppointmentDocumentsModal
        open={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        appointmentId={selectedAppointmentId || ""}
        role="hospital_admin"
      />

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                Upload Document for {facility.facility_name}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <UploadPrescriptionForm
                patientId={uploadPatientId!}
                depertmentId={userId!}
                appointmentId={appointmentId || null}
                uploadedBy="department"
                defaultDocumentType="medical_record"
                title="Upload Medical Document"
                onCancel={() => {
                  mixpanelInstance.track("Facility Upload Cancelled", {
                    appointmentId,
                    userRole: "facility",
                  });
                  setShowUploadModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
        <DialogContent className="max-w-3xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
            <DialogDescription>Detailed summary generated by AI</DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">
            {cleanSummary(selectedSummary)}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientViewFacilityAppiontment;