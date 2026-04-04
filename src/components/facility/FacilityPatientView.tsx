// // FacilityPatientView.tsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Clock,
//   FileText,
//   Upload,
//   Eye,
//   Heart,
//   Ruler,
//   Weight,
//   AlertCircle,
//   Stethoscope,
//   Pill,
//   Building,
//   MapPin,
//   Star,
//   Users,
//   Bed,
// } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
// import mixpanelInstance from "@/utils/mixpanel";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// // Interfaces
// interface PatientProfile {
//   id: string;
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;
//   date_of_birth: string;
//   gender: string;
//   blood_group: string;
//   height: number;
//   weight: number;
//   known_allergies: string;
//   emergency_contact_name: string;
//   emergency_contact_number: string;
//   emergency_contact_relationship: string;
//   medical_history: string;
//   current_medications: string;
// }

// interface DoctorProfile {
//   id: string;
//   user_id: string;
//   medical_speciality: string;
//   license_number: string;
//   years_experience: number;
//   consultation_fee: number;
//   rating: number;
//   total_reviews: number;
//   about_yourself?: string;
//   education?: any;
//   certifications?: any;
//   languages_known?: any;
//   is_verified: boolean;
//   address?: string;
//   city?: string;
//   state?: string;
//   facility_id?: string;
// }

// interface FacilityProfile {
//   id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   address: string;
//   rating: number;
//   total_reviews: number;
//   about_facility?: string;
//   operating_hours?: any;
//   total_beds?: number;
//   number_of_staffs?: number;
//   number_of_departments?: number;
//   is_verified: boolean;
// }

// interface Appointment {
//   id: string;
//   appointment_date: string;
//   appointment_time: string;
//   type: string;
//   status: string;
//   department: string;
//   doctor_name: string;
//   doctor_specialty: string;
//   facility_id?: string;
//   doctor_id?: string;
// }

// interface Document {
//   id: string;
//   name: string;
//   file_path: string;
//   mime_type: string;
//   created_at: string;
//   uploaded_by: string;
//   uploader_role: string;
//   appointment_id?: string;
//   ai_summary?: string;
// }

// interface Vitals {
//   id: string;
//   recorded_at: string;
//   temperature: number;
//   blood_pressure_systolic: number;
//   blood_pressure_diastolic: number;
//   heart_rate: number;
//   recorded_by: string;
// }

// const FacilityPatientView: React.FC = () => {
//   const { Id,appointmentId  } = useParams<{ Id: string; appointmentId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const userRole = location.pathname.includes("/facility/") ? "facility"
//                  : location.pathname.includes("/doctor/") ? "doctor"
//                  : "patient";

//   const userRoles = location.pathname.includes("/facility/") ? "department"
//                  : location.pathname.includes("/doctor/") ? "doctor"
//                  : "patient";

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewType, setViewType] = useState<"patient" | "doctor" | "facility" | null>(null);
  
//   // Patient specific state
//   const [patient, setPatient] = useState<PatientProfile | null>(null);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [vitals, setVitals] = useState<Vitals[]>([]);
  
//   // Doctor specific state
//   const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
//   const [doctorProfile, setDoctorProfile] = useState<any>(null);
  
//   // Facility specific state
//   const [facility, setFacility] = useState<FacilityProfile | null>(null);
  
//   // Common state
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showDocsModal, setShowDocsModal] = useState(false);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
//   const [selectedSummary, setSelectedSummary] = useState("");
//   const [selectedAppointmentForUpload, setSelectedAppointmentForUpload] = useState<Appointment | null>(null);

//   // Load current user
//   useEffect(() => {
//     const loadUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUserId(user?.id || null);
//     };
//     loadUser();
//   }, []);

//   // Inside component, after state declarations
// const [preselectedAppointmentId, setPreselectedAppointmentId] = useState<string | null>(null);

// // Read location state once
// useEffect(() => {
//   const state = location.state as { appointmentId?: string };
//   if (state?.appointmentId) {
//     setPreselectedAppointmentId(state.appointmentId);
//   }
// }, []);

// // Match preselected appointment when appointments are loaded
// useEffect(() => {
//   if (preselectedAppointmentId && appointments.length > 0) {
//     const matched = appointments.find(apt => apt.id === preselectedAppointmentId);
//     if (matched) {
//       setSelectedAppointmentForUpload(matched);
//       setPreselectedAppointmentId(null);
//     }
//   }
// }, [appointments, preselectedAppointmentId]);


//   // Helper functions
//   const getAge = (dob: string) => {
//     if (!dob) return "N/A";
//     const birth = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//     return `${age} years`;
//   };

//   const cleanSummary = (text: string) => {
//     if (!text) return "";
//     return text
//       .replace(/[=*]/g, "")
//       .replace(/[▬►▪•]/g, "")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim();
//   };

//   // Load Patient Data
//   const loadPatientData = async (patientRecord: any) => {
//     // Get profile
//     const { data: profileData } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", patientRecord.user_id)
//       .single();

//     const fullPatient: PatientProfile = {
//       id: patientRecord.id,
//       user_id: patientRecord.user_id,
//       first_name: profileData?.first_name || "",
//       last_name: profileData?.last_name || "",
//       email: profileData?.email || "",
//       phone_number: profileData?.phone_number || "",
//       date_of_birth: patientRecord.date_of_birth || "",
//       gender: patientRecord.gender || "",
//       blood_group: patientRecord.blood_group || "",
//       height: patientRecord.height || 0,
//       weight: patientRecord.weight || 0,
//       known_allergies: patientRecord.known_allergies || "",
//       emergency_contact_name: patientRecord.emergency_contact_name || "",
//       emergency_contact_number: patientRecord.emergency_contact_number || "",
//       emergency_contact_relationship: patientRecord.emergency_contact_relationship || "",
//       medical_history: patientRecord.medical_history || "",
//       current_medications: patientRecord.current_medications || "",
//     };
//     setPatient(fullPatient);

//     // Fetch appointments
//     const { data: appointmentsData } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         appointment_date,
//         appointment_time,
//         type,
//         status,
//         facility_id,
//         doctor_id,
//         department:departments(name),
//         doctor:doctors(name, specialty)
//       `)
//       .eq("patient_id", patientRecord.id)
//       .order("appointment_date", { ascending: false });

//     if (appointmentsData) {
//       const formatted = appointmentsData.map((apt: any) => ({
//         id: apt.id,
//         appointment_date: apt.appointment_date,
//         appointment_time: apt.appointment_time,
//         type: apt.type,
//         status: apt.status,
//         department: apt.department?.name || "N/A",
//         doctor_name: apt.doctor?.name || "N/A",
//         doctor_specialty: apt.doctor?.specialty || "N/A",
//         facility_id: apt.facility_id,
//         doctor_id: apt.doctor_id,
//       }));
//       setAppointments(formatted);
//     }

//     // Fetch documents
//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//               .eq("appointment_id", appointmentId)
//       .order("created_at", { ascending: false });
//     if (docsData) setDocuments(docsData);

//   };


// const loadDoctorData = async (doctorRecord: any) => {
//   setDoctor(doctorRecord);
  
//   // Get profile
//   const { data: profileData } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("user_id", doctorRecord.user_id)
//     .single();
//   setDoctorProfile(profileData);

//   // Get facility name if facility_id exists
//   if (doctorRecord.facility_id) {
//     const { data: facilityData } = await supabase
//       .from("facilities")
//       .select("facility_name")
//       .eq("id", doctorRecord.facility_id)
//       .single();
//     if (facilityData) setFacility(facilityData as any);
//   }

//   // Fetch doctor's appointments (as doctor) – fixed query
//   const { data: appointmentsData } = await supabase
//     .from("appointments")
//     .select(`
//       id,
//       type,
//       status,
//       patient_id
//     `)
//     .eq("doctor_id", doctorRecord.user_id)
//         .eq("facility_id", doctorRecord.facility_id)

//     .limit(10);

    
//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//               .eq("appointment_id", appointmentId)

//       .order("created_at", { ascending: false });
//     if (docsData) setDocuments(docsData);

//   if (appointmentsData) {
//     const formatted = appointmentsData.map((apt: any) => ({
//       id: apt.id,
//       appointment_date: apt.appointment_date,
//       appointment_time: apt.appointment_time,
//       type: apt.type,
//       status: apt.status,
//       department: "N/A",
//       doctor_name: "N/A",
//       doctor_specialty: doctorRecord.medical_speciality,
//     }));
//     setAppointments(formatted);
//   }
// };

//   // Load Facility Data
//   const loadFacilityData = async (facilityRecord: any) => {
//     setFacility(facilityRecord);
//       const { data: profileData } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("user_id", facilityRecord.user_id)
//     .single();
//   setDoctorProfile(profileData);

//   // Get facility name if facility_id exists
//   if (facilityRecord.facility_id) {
//     const { data: facilityData } = await supabase
//       .from("facilities")
//       .select("facility_name")
//       .eq("id", facilityRecord.facility_id)
//       .single();
//     if (facilityData) setFacility(facilityData as any);
//   }

//   // Fetch doctor's appointments (as doctor) – fixed query
//   const { data: appointmentsData } = await supabase
//     .from("appointments")
//     .select(`
//       id,
//       type,
//       status,
//       patient_id
//     `)
//         .eq("facility_id", facilityRecord.facility_id)

//     .limit(10);

    
//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//       .eq("appointment_id", appointmentId)
//       .order("created_at", { ascending: false });
//     if (docsData) setDocuments(docsData);

//   if (appointmentsData) {
//     const formatted = appointmentsData.map((apt: any) => ({
//       id: apt.id,
//       appointment_date: apt.appointment_date,
//       appointment_time: apt.appointment_time,
//       type: apt.type,
//       status: apt.status,
//       department: "N/A",
//       doctor_name: "N/A",
//       doctor_specialty: facilityRecord.medical_speciality,
//     }));
//     setAppointments(formatted);
//   }

//     // Fetch wards/beds count
//     const { count: wardCount } = await supabase
//       .from("wards")
//       .select("*", { count: "exact", head: true })
//       .eq("facility_id", facilityRecord.id);
    
//     const { count: bedCount } = await supabase
//       .from("beds")
//       .select("*", { count: "exact", head: true })
//       .eq("facility_id", facilityRecord.id);

//     setAppointments([{
//       id: "stats",
//       appointment_date: "",
//       appointment_time: "",
//       type: "stats",
//       status: "",
//       department: `Wards: ${wardCount || 0}`,
//       doctor_name: `Beds: ${bedCount || 0}`,
//       doctor_specialty: "",
//     }] as any);
//   };

//   // Main fetch function
//   const fetchData = async () => {
//     if (!Id) return;
//     try {
//       setLoading(true);
//       setError(null);

//       // Check patients table
//       const { data: patientData, error: patientError } = await supabase
//         .from("patients")
//         .select("*")
//         .eq("user_id", Id)
//         .maybeSingle();

//       if (patientData) {
//         setViewType("patient");
//         await loadPatientData(patientData);
//         return;
//       }

//       // Check medical_professionals table
//       const { data: doctorData, error: doctorError } = await supabase
//         .from("medical_professionals")
//         .select("*")
//         .eq("user_id", Id)
//         .maybeSingle();

//       if (doctorData) {
//         setViewType("doctor");
//         await loadDoctorData(doctorData);
//         return;
//       }

//       // Check facilities table by admin_user_id
//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("*")
//         .eq("id", Id)
//         .maybeSingle();

//       if (facilityData) {
//         setViewType("facility");
//         await loadFacilityData(facilityData);
//         return;
//       }

//       throw new Error("ID does not match any patient, doctor, or facility");
//     } catch (err: any) {
//       console.error("Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [Id]);

//   const handleUploadSuccess = () => {
//     setShowUploadModal(false);
//     fetchData();
//     toast({ title: "Success", description: "Document uploaded successfully." });
//   };

//   const handleViewDocuments = (appointmentId?: string) => {
//     setSelectedAppointmentId(appointmentId || null);
//     setShowDocsModal(true);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="border-destructive m-4">
//         <CardContent className="pt-6">
//           <div className="flex flex-col items-center text-center">
//             <AlertCircle className="h-12 w-12 text-destructive mb-4" />
//             <h3 className="text-lg font-semibold">Not Found</h3>
//             <p className="text-muted-foreground">{error}</p>
//             <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // ==================== PATIENT VIEW ====================
//   if (viewType === "patient" && patient) {
//     return (
//       <div className="w-full px-4 sm:px-6 py-4 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//               ← Back
//             </Button>

//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <Badge variant="outline" className="bg-blue-50 text-blue-700">
//                 <User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}
//               </Badge>
//              </div>
//           </div>
//           <div className="flex gap-2">
//             {(userRole === "facility" || userRole === "doctor") && (
//               <Button onClick={() => setShowUploadModal(true)}>
//                 <Upload className="mr-2 h-4 w-4" /> Upload Document
//               </Button>
         
//             )}
//             {/* <Button variant="outline" onClick={() => handleViewDocuments()}>
//               <FileText className="mr-2 h-4 w-4" /> All Documents
//             </Button> */}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-start space-x-3"><User className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Full Name</p><p className="text-sm text-muted-foreground">{patient.first_name} {patient.last_name}</p></div></div>
//                   <div className="flex items-start space-x-3"><Mail className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Email</p><p className="text-sm text-muted-foreground">{patient.email || "N/A"}</p></div></div>
//                   <div className="flex items-start space-x-3"><Phone className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Phone Number</p><p className="text-sm text-muted-foreground">{patient.phone_number || "N/A"}</p></div></div>
//                   <div className="flex items-start space-x-3"><Calendar className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Date of Birth</p><p className="text-sm text-muted-foreground">{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(patient.date_of_birth)})</p></div></div>
//                   <div className="flex items-start space-x-3"><Heart className="h-5 w-5 text-muted-foreground mt-0.5" /><div><p className="text-sm font-medium">Blood Group</p><p className="text-sm text-muted-foreground">{patient.blood_group || "N/A"}</p></div></div>
//                   <div className="flex items-start space-x-3"><div className="flex space-x-2"><Ruler className="h-5 w-5" /><Weight className="h-5 w-5" /></div><div><p className="text-sm font-medium">Height / Weight</p><p className="text-sm text-muted-foreground">{patient.height || "?"} cm / {patient.weight || "?"} kg</p></div></div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
//               <CardContent className="space-y-4">
//                 <div><p className="text-sm font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-red-500" /> Known Allergies</p><p className="text-sm text-muted-foreground mt-1">{patient.known_allergies || "None reported"}</p></div>
//                 <div><p className="text-sm font-medium flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-blue-500" /> Medical History</p><p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{patient.medical_history || "No history recorded"}</p></div>
//                 <div><p className="text-sm font-medium flex items-center"><Pill className="h-4 w-4 mr-1 text-green-500" /> Current Medications</p><p className="text-sm text-muted-foreground mt-1">{patient.current_medications || "None"}</p></div>
//                 <Separator />
//                 <div><p className="text-sm font-medium">Emergency Contact</p><div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">Name:</span> {patient.emergency_contact_name || "N/A"}</div><div><span className="text-muted-foreground">Phone:</span> {patient.emergency_contact_number || "N/A"}</div><div><span className="text-muted-foreground">Relationship:</span> {patient.emergency_contact_relationship || "N/A"}</div></div></div>
//               </CardContent>
//             </Card>

//             {/* <Card>
//               <CardHeader><CardTitle>Recent Appointments</CardTitle><CardDescription>Past and upcoming visits</CardDescription></CardHeader>
//               <CardContent>
//                 {appointments.length === 0 ? (<div className="text-center py-6 text-muted-foreground">No appointments found</div>) : (
//                   <div className="space-y-3">
//                     {appointments.slice(0, 3).map((apt) => (
//                       <div key={apt.id} className="border rounded-lg p-3 flex flex-wrap justify-between items-center">
//                         <div><p className="font-medium">{apt.department}</p><p className="text-sm text-muted-foreground">Dr. {apt.doctor_name} ({apt.doctor_specialty})</p><div className="flex items-center text-xs text-muted-foreground mt-1"><Calendar className="h-3 w-3 mr-1" /> {new Date(apt.appointment_date).toLocaleDateString()}<Clock className="h-3 w-3 ml-2 mr-1" /> {apt.appointment_time}</div></div>
//                         <Badge variant={apt.status === "completed" ? "default" : "secondary"}>{apt.status}</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card> */}

//             {vitals.length > 0 && (
//               <Card>
//                 <CardHeader><CardTitle>Recent Vitals</CardTitle></CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                     {vitals.map((v) => (
//                       <div key={v.id} className="text-center p-2 border rounded">
//                         <div className="text-lg font-bold">{v.temperature}°C</div><div className="text-xs text-muted-foreground">Temp</div>
//                         <div className="text-lg font-bold mt-2">{v.heart_rate}</div><div className="text-xs text-muted-foreground">HR</div>
//                         <div className="text-sm">{v.blood_pressure_systolic}/{v.blood_pressure_diastolic}</div><div className="text-xs text-muted-foreground">BP</div>
//                         <div className="text-xs text-muted-foreground mt-1">{new Date(v.recorded_at).toLocaleDateString()}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <Card className="h-full flex flex-col">
//               <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
//               <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
//                 {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
//                   documents.map((doc) => (
//                     <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
//                         <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
//                       </div>
//                       {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
//                     </div>
//                   ))
//                 )}
//                 {/* {documents.length > 5 && (<Button variant="link" className="w-full" onClick={() => handleViewDocuments()}>View all {documents.length} documents →</Button>)} */}
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="hospital_admin" />
//                 {showUploadModal && (
//           <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
//                 <h3 className="text-lg font-semibold">Upload Document for {patient.first_name} {patient.last_name}</h3>
//                 <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
//               </div>
//               {userRole === "patient" ? (
//                 <div className="p-6 max-h-[80vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//       patientId={patient.user_id}          // ← changed from patient.id
//                     appointmentId={appointmentId || null}
//                     uploadedBy="patient"
//                     defaultDocumentType="medical_record"
//                     title="Upload Medical Document"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               ) : userRole === "doctor" ? (
//                 <div className="p-6 max-h-[70vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//       patientId={patient.user_id}          // ← changed from patient.id
//                     doctorId={userId!}
//                     appointmentId={appointmentId || null}
//                     uploadedBy="doctor"
//                     defaultDocumentType="medical_record"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               ) : userRole === "facility" ? (
//                 <div className="p-6 max-h-[70vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//       patientId={patient.user_id}          // ← changed from patient.id
//                     depertmentId={userId!}
//                     appointmentId={appointmentId || null}
//                     uploadedBy="department"
//                     defaultDocumentType="medical_record"
//                     onCancel={() => {
//                       mixpanelInstance.track('Facility Upload Cancelled', { 
//                         appointmentId: selectedAppointmentForUpload?.id, 
//                         patientName: `${patient.first_name} ${patient.last_name}`, 
//                         userRole 
//                       });
//                       setShowUploadModal(false);
//                     }}
//                   />
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         )}

        
//         <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}><DialogContent className="max-w-3xl md:max-w-4xl"><DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader><div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div><DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
//       </div>
//     );
//   }

//   // ==================== DOCTOR VIEW ====================
//   if (viewType === "doctor" && doctor) {
//     return (
//       <div className="w-full px-4 sm:px-6 py-4 space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//                 <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//               ← Back
//             </Button>
//             <h1 className="text-2xl md:text-3xl font-bold">Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <Badge variant="outline" className="bg-blue-50 text-blue-700"><Stethoscope className="h-3 w-3 mr-1" /> {doctor.medical_speciality}</Badge>
//               <Badge variant="outline" className="bg-green-50 text-green-700"><Star className="h-3 w-3 mr-1" /> {doctor.rating} ⭐ ({doctor.total_reviews} reviews)</Badge>
//               {doctor.is_verified && <Badge variant="outline" className="bg-purple-50 text-purple-700">✓ Verified</Badge>}
//             </div>
//           </div>
//           <div className="flex gap-2">
//             {(userRole === "patient") && (
//               <Button onClick={() => setShowUploadModal(true)}>
//                 <Upload className="mr-2 h-4 w-4" /> Upload Document
//               </Button>
         
//             )}
                  
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="space-y-6">
//             <Card><CardHeader><CardTitle>Professional Information</CardTitle></CardHeader><CardContent className="space-y-2">
//               <div><span className="font-medium">License Number:</span> {doctor.license_number}</div>
//               <div><span className="font-medium">Experience:</span> {doctor.years_experience} years</div>
//               <div><span className="font-medium">Consultation Fee:</span> ₹{doctor.consultation_fee}</div>
//               <div><span className="font-medium">Email:</span> {doctorProfile?.email}</div>
//               <div><span className="font-medium">Phone:</span> {doctorProfile?.phone_number}</div>
//               {doctor.address && <div><span className="font-medium">Address:</span> {doctor.address}, {doctor.city}, {doctor.state}</div>}
//             </CardContent></Card>

//             {doctor.about_yourself && (<Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent><p>{doctor.about_yourself}</p></CardContent></Card>)}
//           </div>

//           {/* <div className="space-y-6">
//             <Card><CardHeader><CardTitle>Recent Appointments</CardTitle></CardHeader><CardContent>
//               {appointments.length === 0 ? (<div className="text-center py-6">No appointments found</div>) : (
//                 <div className="space-y-3">{appointments.map((apt) => (<div key={apt.id} className="border rounded-lg p-3"><p className="font-medium">{new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</p><p className="text-sm text-muted-foreground">Status: {apt.status}</p></div>))}</div>
//               )}
//             </CardContent></Card>
//           </div> */}
//           <div className="space-y-6">
//             <Card className="h-full flex flex-col">
//               <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
//               <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
//                 {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
//                   documents.map((doc) => (
//                     <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
//                         <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
//                       </div>
//                       {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
//                     </div>
//                   ))
//                 )}
//                 {/* {documents.length > 5 && (<Button variant="link" className="w-full" onClick={() => handleViewDocuments()}>View all {documents.length} documents →</Button>)} */}
//               </CardContent>
//             </Card>

//             <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
//                 {showUploadModal && (
//           <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
//                 <h3 className="text-lg font-semibold">Upload Document for Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h3>
//                 <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
//               </div>
//               {userRole === "patient" && (
//                 <div className="p-6 max-h-[80vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//       patientId={patient.user_id}          // ← changed from patient.id
//                     appointmentId={appointmentId || null}
//                     uploadedBy="patient"
//                     defaultDocumentType="medical_record"
//                     title="Upload Medical Document"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               ) }
//             </div>
//           </div>
//         )}
//                     <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}><DialogContent className="max-w-3xl md:max-w-4xl"><DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader><div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div><DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter></DialogContent></Dialog>

//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==================== FACILITY VIEW ====================
//   if (viewType === "facility" && facility) {
//     return (
//       <div className="w-full px-4 sm:px-6 py-4 space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//                 <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//               ← Back
//             </Button>
//             <h1 className="text-2xl md:text-3xl font-bold">{facility.facility_name}</h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <Badge variant="outline" className="bg-blue-50 text-blue-700"><Building className="h-3 w-3 mr-1" /> {facility.facility_type}</Badge>
//               <Badge variant="outline" className="bg-green-50 text-green-700"><Star className="h-3 w-3 mr-1" /> {facility.rating} ⭐ ({facility.total_reviews} reviews)</Badge>
//               {facility.is_verified && <Badge variant="outline" className="bg-purple-50 text-purple-700">✓ Verified</Badge>}
//             </div>
//             <div className="flex gap-2">
//                  {(userRole === "patient") && (
//               <Button onClick={() => setShowUploadModal(true)}>
//                 <Upload className="mr-2 h-4 w-4" /> Upload Document
//               </Button>
         
//             )}
           
          
//           </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="space-y-6">
//             <Card><CardHeader><CardTitle>Facility Details</CardTitle></CardHeader><CardContent className="space-y-2">
//               <div><span className="font-medium">License Number:</span> {facility.license_number}</div>
//               <div><span className="font-medium">Address:</span> {facility.address}</div>
//               <div><span className="font-medium">Total Beds:</span> {facility.total_beds || "N/A"}</div>
//               <div><span className="font-medium">Staff Count:</span> {facility.number_of_staffs || "N/A"}</div>
//               <div><span className="font-medium">Departments:</span> {facility.number_of_departments || "N/A"}</div>
//             </CardContent></Card>
//             {facility.about_facility && (<Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent><p>{facility.about_facility}</p></CardContent></Card>)}
//           </div>
//           {/* <div className="space-y-6">
//             <Card><CardHeader><CardTitle>Statistics</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div className="text-center p-4 border rounded"><div className="text-2xl font-bold">{appointments[0]?.department?.split(":")[1] || "0"}</div><div className="text-sm text-muted-foreground">Wards</div></div><div className="text-center p-4 border rounded"><div className="text-2xl font-bold">{appointments[0]?.doctor_name?.split(":")[1] || "0"}</div><div className="text-sm text-muted-foreground">Beds</div></div></div></CardContent></Card>
//           </div> */}
//         </div>
//         <div className="space-y-6">
//             <Card className="h-full flex flex-col">
//               <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
//               <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
//                 {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
//                   documents.map((doc) => (
//                     <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
//                         <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
//                       </div>
//                       {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
//                     </div>
//                   ))
//                 )}
//                 {/* {documents.length > 5 && (<Button variant="link" className="w-full" onClick={() => handleViewDocuments()}>View all {documents.length} documents →</Button>)} */}
//               </CardContent>
//             </Card>
//             <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
//                 {showUploadModal && (
//           <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
//                 <h3 className="text-lg font-semibold">Upload Document for {facility.facility_name} </h3>
//                 <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
//               </div>
//               {userRole === "patient" && (
//                 <div className="p-6 max-h-[80vh] overflow-y-auto">
//                   <UploadPrescriptionForm
//       patientId={patient.user_id}          // ← changed from patient.id
//                     appointmentId={appointmentId || null}
//                     uploadedBy="patient"
//                     defaultDocumentType="medical_record"
//                     title="Upload Medical Document"
//                     onCancel={() => setShowUploadModal(false)}
//                   />
//                 </div>
//               ) }
//             </div>
//           </div>
//         )}
//                     <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}><DialogContent className="max-w-3xl md:max-w-4xl"><DialogHeader><DialogTitle>AI Summary</DialogTitle><DialogDescription>Detailed summary generated by AI</DialogDescription></DialogHeader><div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">{cleanSummary(selectedSummary)}</div><DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter></DialogContent></Dialog>

//           </div>
          
//       </div>
//     );
//   }

//   return null;
// };

// export default FacilityPatientView;

// FacilityPatientView.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Upload,
  Eye,
  Heart,
  Ruler,
  Weight,
  AlertCircle,
  Stethoscope,
  Pill,
  Building,
  MapPin,
  Star,
  Users,
  Bed,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Interfaces (unchanged)
interface PatientProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height: number;
  weight: number;
  known_allergies: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relationship: string;
  medical_history: string;
  current_medications: string;
}

interface DoctorProfile {
  id: string;
  user_id: string;
  medical_speciality: string;
  license_number: string;
  years_experience: number;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  about_yourself?: string;
  education?: any;
  certifications?: any;
  languages_known?: any;
  is_verified: boolean;
  address?: string;
  city?: string;
  state?: string;
  facility_id?: string;
}

interface FacilityProfile {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: string;
  rating: number;
  total_reviews: number;
  about_facility?: string;
  operating_hours?: any;
  total_beds?: number;
  number_of_staffs?: number;
  number_of_departments?: number;
  is_verified: boolean;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  status: string;
  department: string;
  doctor_name: string;
  doctor_specialty: string;
  facility_id?: string;
  doctor_id?: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  uploaded_by: string;
  uploader_role: string;
  appointment_id?: string;
  ai_summary?: string;
}

interface Vitals {
  id: string;
  recorded_at: string;
  temperature: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  recorded_by: string;
}

const FacilityPatientView: React.FC = () => {
  const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = location.pathname.includes("/facility/") ? "facility"
                 : location.pathname.includes("/doctor/") ? "doctor"
                 : "patient";

  const userRoles = location.pathname.includes("/facility/") ? "department"
                 : location.pathname.includes("/doctor/") ? "doctor"
                 : "patient";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"patient" | "doctor" | "facility" | null>(null);
  
  // Patient specific state
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vitals, setVitals] = useState<Vitals[]>([]);
  
  // Doctor specific state
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  
  // Facility specific state
  const [facility, setFacility] = useState<FacilityProfile | null>(null);
  
  // Common state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [selectedAppointmentForUpload, setSelectedAppointmentForUpload] = useState<Appointment | null>(null);
  
  // New state for storing patient ID when uploading from doctor/facility views
  const [uploadPatientId, setUploadPatientId] = useState<string | null>(null);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    loadUser();
  }, []);

  const [preselectedAppointmentId, setPreselectedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { appointmentId?: string };
    if (state?.appointmentId) {
      setPreselectedAppointmentId(state.appointmentId);
    }
  }, []);

  useEffect(() => {
    if (preselectedAppointmentId && appointments.length > 0) {
      const matched = appointments.find(apt => apt.id === preselectedAppointmentId);
      if (matched) {
        setSelectedAppointmentForUpload(matched);
        setPreselectedAppointmentId(null);
      }
    }
  }, [appointments, preselectedAppointmentId]);

  // Helper functions
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
    return text
      .replace(/[=*]/g, "")
      .replace(/[▬►▪•]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  // Load Patient Data
  const loadPatientData = async (patientRecord: any) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", patientRecord.user_id)
      .single();

    const fullPatient: PatientProfile = {
      id: patientRecord.id,
      user_id: patientRecord.user_id,
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      email: profileData?.email || "",
      phone_number: profileData?.phone_number || "",
      date_of_birth: patientRecord.date_of_birth || "",
      gender: patientRecord.gender || "",
      blood_group: patientRecord.blood_group || "",
      height: patientRecord.height || 0,
      weight: patientRecord.weight || 0,
      known_allergies: patientRecord.known_allergies || "",
      emergency_contact_name: patientRecord.emergency_contact_name || "",
      emergency_contact_number: patientRecord.emergency_contact_number || "",
      emergency_contact_relationship: patientRecord.emergency_contact_relationship || "",
      medical_history: patientRecord.medical_history || "",
      current_medications: patientRecord.current_medications || "",
    };
    setPatient(fullPatient);

    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        type,
        status,
        facility_id,
        doctor_id,
        department:departments(name),
        doctor:doctors(name, specialty)
      `)
      .eq("patient_id", patientRecord.id)
      .order("appointment_date", { ascending: false });

    if (appointmentsData) {
      const formatted = appointmentsData.map((apt: any) => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        type: apt.type,
        status: apt.status,
        department: apt.department?.name || "N/A",
        doctor_name: apt.doctor?.name || "N/A",
        doctor_specialty: apt.doctor?.specialty || "N/A",
        facility_id: apt.facility_id,
        doctor_id: apt.doctor_id,
      }));
      setAppointments(formatted);
    }

    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });
    if (docsData) setDocuments(docsData);
  };

  const loadDoctorData = async (doctorRecord: any) => {
    setDoctor(doctorRecord);
    
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", doctorRecord.user_id)
      .single();
    setDoctorProfile(profileData);

    if (doctorRecord.facility_id) {
      const { data: facilityData } = await supabase
        .from("facilities")
        .select("facility_name")
        .eq("id", doctorRecord.facility_id)
        .single();
      if (facilityData) setFacility(facilityData as any);
    }

    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        type,
        status,
        patient_id
      `)
      .eq("doctor_id", doctorRecord.user_id)
      .eq("facility_id", doctorRecord.facility_id)
      .limit(10);

    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });
    if (docsData) setDocuments(docsData);

    if (appointmentsData) {
      const formatted = appointmentsData.map((apt: any) => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        type: apt.type,
        status: apt.status,
        department: "N/A",
        doctor_name: "N/A",
        doctor_specialty: doctorRecord.medical_speciality,
      }));
      setAppointments(formatted);
    }
  };

  const loadFacilityData = async (facilityRecord: any) => {
    setFacility(facilityRecord);
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", facilityRecord.user_id)
      .single();
    setDoctorProfile(profileData);

    if (facilityRecord.facility_id) {
      const { data: facilityData } = await supabase
        .from("facilities")
        .select("facility_name")
        .eq("id", facilityRecord.facility_id)
        .single();
      if (facilityData) setFacility(facilityData as any);
    }

    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        type,
        status,
        patient_id
      `)
      .eq("facility_id", facilityRecord.facility_id)
      .limit(10);

    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });
    if (docsData) setDocuments(docsData);

    if (appointmentsData) {
      const formatted = appointmentsData.map((apt: any) => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        type: apt.type,
        status: apt.status,
        department: "N/A",
        doctor_name: "N/A",
        doctor_specialty: facilityRecord.medical_speciality,
      }));
      setAppointments(formatted);
    }

    const { count: wardCount } = await supabase
      .from("wards")
      .select("*", { count: "exact", head: true })
      .eq("facility_id", facilityRecord.id);
    
    const { count: bedCount } = await supabase
      .from("beds")
      .select("*", { count: "exact", head: true })
      .eq("facility_id", facilityRecord.id);

    setAppointments([{
      id: "stats",
      appointment_date: "",
      appointment_time: "",
      type: "stats",
      status: "",
      department: `Wards: ${wardCount || 0}`,
      doctor_name: `Beds: ${bedCount || 0}`,
      doctor_specialty: "",
    }] as any);
  };

  const fetchData = async () => {
    if (!Id) return;
    try {
      setLoading(true);
      setError(null);

      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", Id)
        .maybeSingle();

      if (patientData) {
        setViewType("patient");
        await loadPatientData(patientData);
        return;
      }

      const { data: doctorData, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("*")
        .eq("user_id", Id)
        .maybeSingle();

      if (doctorData) {
        setViewType("doctor");
        await loadDoctorData(doctorData);
        return;
      }

      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", Id)
        .maybeSingle();

      if (facilityData) {
        setViewType("facility");
        await loadFacilityData(facilityData);
        return;
      }

      throw new Error("ID does not match any patient, doctor, or facility");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Id]);

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchData();
    toast({ title: "Success", description: "Document uploaded successfully." });
  };

  const handleViewDocuments = (appointmentId?: string) => {
    setSelectedAppointmentId(appointmentId || null);
    setShowDocsModal(true);
  };

  // NEW: Function to fetch patientId from appointment and open modal
  const handleOpenUploadModal = async () => {
    if (!appointmentId) {
      toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
      return;
    }
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("patient_id")
        .eq("id", appointmentId)
        .single();
      if (error || !data) {
        throw new Error("Could not find patient for this appointment");
      }
      setUploadPatientId(data.patient_id);
      setShowUploadModal(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive m-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Not Found</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==================== PATIENT VIEW ====================
  if (viewType === "patient" && patient) {
    return (
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {(userRole === "facility" || userRole === "doctor") && (
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent>
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

            <Card>
              <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-sm font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-red-500" /> Known Allergies</p><p className="text-sm text-muted-foreground mt-1">{patient.known_allergies || "None reported"}</p></div>
                <div><p className="text-sm font-medium flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-blue-500" /> Medical History</p><p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{patient.medical_history || "No history recorded"}</p></div>
                <div><p className="text-sm font-medium flex items-center"><Pill className="h-4 w-4 mr-1 text-green-500" /> Current Medications</p><p className="text-sm text-muted-foreground mt-1">{patient.current_medications || "None"}</p></div>
                <Separator />
                <div><p className="text-sm font-medium">Emergency Contact</p><div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">Name:</span> {patient.emergency_contact_name || "N/A"}</div><div><span className="text-muted-foreground">Phone:</span> {patient.emergency_contact_number || "N/A"}</div><div><span className="text-muted-foreground">Relationship:</span> {patient.emergency_contact_relationship || "N/A"}</div></div></div>
              </CardContent>
            </Card>

            {vitals.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Recent Vitals</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {vitals.map((v) => (
                      <div key={v.id} className="text-center p-2 border rounded">
                        <div className="text-lg font-bold">{v.temperature}°C</div><div className="text-xs text-muted-foreground">Temp</div>
                        <div className="text-lg font-bold mt-2">{v.heart_rate}</div><div className="text-xs text-muted-foreground">HR</div>
                        <div className="text-sm">{v.blood_pressure_systolic}/{v.blood_pressure_diastolic}</div><div className="text-xs text-muted-foreground">BP</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(v.recorded_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
              <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
                {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
                        <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                      </div>
                      {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="hospital_admin" />
        
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <h3 className="text-lg font-semibold">Upload Document for {patient.first_name} {patient.last_name}</h3>
                <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              {userRole === "patient" ? (
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <UploadPrescriptionForm
                    patientId={patient.user_id}
                    appointmentId={appointmentId || null}
                    uploadedBy="patient"
                    defaultDocumentType="medical_record"
                    title="Upload Medical Document"
                    onCancel={() => setShowUploadModal(false)}
                    // onSuccess={handleUploadSuccess}
                  />
                </div>
              ) : userRole === "doctor" ? (
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <UploadPrescriptionForm
                    patientId={patient.user_id}
                    doctorId={userId!}
                    appointmentId={appointmentId || null}
                    uploadedBy="doctor"
                    defaultDocumentType="medical_record"
                    onCancel={() => setShowUploadModal(false)}
                    // onSuccess={handleUploadSuccess}
                  />
                </div>
              ) : userRole === "facility" ? (
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <UploadPrescriptionForm
                    patientId={patient.user_id}
                    depertmentId={userId!}
                    appointmentId={appointmentId || null}
                    uploadedBy="department"
                    defaultDocumentType="medical_record"
                    onCancel={() => {
                      mixpanelInstance.track('Facility Upload Cancelled', { 
                        appointmentId: selectedAppointmentForUpload?.id, 
                        patientName: `${patient.first_name} ${patient.last_name}`, 
                        userRole 
                      });
                      setShowUploadModal(false);
                    }}
                    // onSuccess={handleUploadSuccess}
                  />
                </div>
              ) : null}
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
  }

  // ==================== DOCTOR VIEW (FIXED) ====================
  if (viewType === "doctor" && doctor) {
    return (
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700"><Stethoscope className="h-3 w-3 mr-1" /> {doctor.medical_speciality}</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700"><Star className="h-3 w-3 mr-1" /> {doctor.rating} ⭐ ({doctor.total_reviews} reviews)</Badge>
              {doctor.is_verified && <Badge variant="outline" className="bg-purple-50 text-purple-700">✓ Verified</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Show upload button for doctor role */}
            {(userRole === "patient") && (
              <Button onClick={handleOpenUploadModal}>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Professional Information</CardTitle></CardHeader><CardContent className="space-y-2">
              <div><span className="font-medium">License Number:</span> {doctor.license_number}</div>
              <div><span className="font-medium">Experience:</span> {doctor.years_experience} years</div>
              <div><span className="font-medium">Consultation Fee:</span> ₹{doctor.consultation_fee}</div>
              <div><span className="font-medium">Email:</span> {doctorProfile?.email}</div>
              <div><span className="font-medium">Phone:</span> {doctorProfile?.phone_number}</div>
              {doctor.address && <div><span className="font-medium">Address:</span> {doctor.address}, {doctor.city}, {doctor.state}</div>}
            </CardContent></Card>
            {doctor.about_yourself && (<Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent><p>{doctor.about_yourself}</p></CardContent></Card>)}
          </div>

          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
              <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
                {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
                        <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                      </div>
                      {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
            
            {/* Upload Modal for Doctor View */}
            {showUploadModal && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                    <h3 className="text-lg font-semibold">Upload Document for Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h3>
                    <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <UploadPrescriptionForm
                      patientId={uploadPatientId!}
                      doctorId={userId!}
                      appointmentId={appointmentId || null}
                      uploadedBy="doctor"
                      defaultDocumentType="medical_record"
                      title="Upload Medical Document"
                      onCancel={() => setShowUploadModal(false)}
                    //   onSuccess={handleUploadSuccess}
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
        </div>
      </div>
    );
  }

  // ==================== FACILITY VIEW (FIXED) ====================
  if (viewType === "facility" && facility) {
    return (
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">{facility.facility_name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700"><Building className="h-3 w-3 mr-1" /> {facility.facility_type}</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700"><Star className="h-3 w-3 mr-1" /> {facility.rating} ⭐ ({facility.total_reviews} reviews)</Badge>
              {facility.is_verified && <Badge variant="outline" className="bg-purple-50 text-purple-700">✓ Verified</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Show upload button for facility role */}
            {(userRole === "patient") && (
              <Button onClick={handleOpenUploadModal}>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Facility Details</CardTitle></CardHeader><CardContent className="space-y-2">
              <div><span className="font-medium">License Number:</span> {facility.license_number}</div>
              <div><span className="font-medium">Address:</span> {facility.address}</div>
              <div><span className="font-medium">Total Beds:</span> {facility.total_beds || "N/A"}</div>
              <div><span className="font-medium">Staff Count:</span> {facility.number_of_staffs || "N/A"}</div>
              <div><span className="font-medium">Departments:</span> {facility.number_of_departments || "N/A"}</div>
            </CardContent></Card>
            {facility.about_facility && (<Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent><p>{facility.about_facility}</p></CardContent></Card>)}
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Documents</CardTitle><CardDescription>Last 5 uploaded files</CardDescription></CardHeader>
            <CardContent className="flex-1 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
              {documents.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>) : (
                documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • {doc.uploader_role}</p></div></div>
                      <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                    </div>
                    {doc.ai_summary && (<div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>)}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
          <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
          
          {/* Upload Modal for Facility View */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                  <h3 className="text-lg font-semibold">Upload Document for {facility.facility_name}</h3>
                  <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
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
                      mixpanelInstance.track('Facility Upload Cancelled', { 
                        appointmentId: selectedAppointmentForUpload?.id, 
                        userRole 
                      });
                      setShowUploadModal(false);
                    }}
                    // onSuccess={handleUploadSuccess}
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
      </div>
    );
  }

  return null;
};

export default FacilityPatientView;