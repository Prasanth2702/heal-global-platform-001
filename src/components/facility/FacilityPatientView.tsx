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
//   Video,
//   CreditCard,
//   Loader2,
//   IndianRupee,
//   Trash2,
// } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
// import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
// import mixpanelInstance from "@/utils/mixpanel";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import VideoMeeting from "../VideoMeeting";

// // Interfaces (unchanged)
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
//   payment_requested?: boolean;
//   host_joined?: boolean;
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
// country_code?: string;
// pin_code?: string;
//   facility_id?: string;
//   payment_requested?: boolean;
//   host_joined?: boolean;
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
//   city?: string;
//   state?: string;
// country_code?: string;
// pin_code?: string;
// email?: string;
// phone_number?: string;
//   departments?: Department[];
// }
// export interface Department {
//   id: string;
//   facility_id: string;
//   name: string;
//   description: string;
//   head_doctor_id?: string;
//   services?: any;
//   equipment?: any;
//   bed_capacity?: number;
//   available_beds?: number;
//   is_active?: boolean;
//   created_at?: string;
//   updated_at?: string;
//   price_per_day?: number;
//   has_variable_pricing?: boolean;
//    staff_count?: number;
// }

// interface Appointment {
//   id: string;
//   appointment_date: string;
//   duration_minutes?: number;
//   type: string;
//   status: string;
//   department_id?: string;
//   department_name?: string; // after join
//   doctor_name: string;
//   doctor_specialty: string;
//   facility_id?: string;
//   doctor_id?: string;
//   chief_complaint?: string;
//   notes?: string;
//   consultation_fee?: number;
//   video_room_id?: string;
//   reminder_sent?: boolean;
//   payment_requested?: boolean;
//   host_joined?: boolean;
//   createdAt?: string;
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
//   const { Id, appointmentId } = useParams<{ Id: string; appointmentId: string }>();
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
  
//   const [completedWithoutDoc, setCompletedWithoutDoc] = useState(false);
//   // Common state
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showDocsModal, setShowDocsModal] = useState(false);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
//   const [selectedSummary, setSelectedSummary] = useState("");
//   const [selectedAppointmentForUpload, setSelectedAppointmentForUpload] = useState<Appointment | null>(null);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   // New state for storing patient ID when uploading from doctor/facility views
//   const [uploadPatientId, setUploadPatientId] = useState<string | null>(null);
//   const [openCancel, setOpenCancel] = useState(false);
// const [cancelReason, setCancelReason] = useState("");
// const [cancelNotes, setCancelNotes] = useState("");
// const [cancelling, setCancelling] = useState(false);
// const [openComplete, setOpenComplete] = useState(false);
// const [completing, setCompleting] = useState(false);
// const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
// const [paymentInfo, setPaymentInfo] = useState<{ amount: number; status: string; payment_date?: string; transaction_id?: string } | null>(null);
// const [facilityName, setFacilityName] = useState<string>("");
//   // Load current user
// const [joiningMeeting, setJoiningMeeting] = useState(false);
//   const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(false);
//   const [meetingEnded, setMeetingEnded] = useState(false);
// const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
// const [timeLeft, setTimeLeft] = useState<number | null>(null);
// const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
//     const [videoMeeting, setVideoMeeting] = useState<{
//   showMeeting: boolean;
//   meetingId: string;
//   participantName: string;
//   appointmentId: string;
//   userRole: "patient" | "doctor";
// }>({
//   showMeeting: false,
//   meetingId: "",
//   participantName: "",
//   appointmentId: "",
//   userRole: "patient",
// });
// // Replace the existing completeAppointment function with:
// const [pendingCompletion, setPendingCompletion] = useState(false);

// const startCompleteWithUpload = () => {
//   setPendingCompletion(true);
//   setShowUploadModal(true);
// };

//   useEffect(() => {
//     const loadUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUserId(user?.id || null);
//     };
//     loadUser();
//   }, []);

//   const [preselectedAppointmentId, setPreselectedAppointmentId] = useState<string | null>(null);

//   useEffect(() => {
//     const state = location.state as { appointmentId?: string };
//     if (state?.appointmentId) {
//       setPreselectedAppointmentId(state.appointmentId);
//     }
//   }, []);

//   useEffect(() => {
//     if (preselectedAppointmentId && appointments.length > 0) {
//       const matched = appointments.find(apt => apt.id === preselectedAppointmentId);
//       if (matched) {
//         setSelectedAppointmentForUpload(matched);
//         setPreselectedAppointmentId(null);
//       }
//     }
//   }, [appointments, preselectedAppointmentId]);

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

// // Timer for pending appointments (30‑minute auto‑cancel deadline)
// useEffect(() => {
//   if (!currentAppointment || currentAppointment.status !== "pending") {
//     setTimeLeft(null);
//     return;
//   }
//   if (!currentAppointment.createdAt) {
//     setTimeLeft(null);
//     return;
//   }

//   const interval = setInterval(() => {
//     const createdAt = new Date(currentAppointment.createdAt!).getTime();
//     const deadline = createdAt + 30 * 60 * 1000; // 30 minutes
//     const remaining = deadline - Date.now();

//     if (remaining <= 0) {
//       setTimeLeft(0);
//       clearInterval(interval);
//       // Optionally refetch appointment data here
//     } else {
//       setTimeLeft(Math.floor(remaining / 1000));
//     }
//   }, 1000);

//   return () => clearInterval(interval);
// }, [currentAppointment?.status, currentAppointment?.createdAt]);
// const TimerDisplay = ({ seconds }: { seconds: number }) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   const isLast30Sec = seconds <= 30;

//   return (
//     <div className={`text-lg font-mono font-bold ${isLast30Sec ? "text-red-600 animate-pulse" : "text-amber-600"}`}>
//       {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
//     </div>
//   );
// };

// const loadPatientData = async (patientRecord: any) => {
//   // -----------------------------
//   // Load Patient Profile
//   // -----------------------------
//   const { data: profileData } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("user_id", patientRecord.user_id)
//     .single();

//   const fullPatient: PatientProfile = {
//     id: patientRecord.id,
//     user_id: patientRecord.user_id,
//     first_name: profileData?.first_name || "",
//     last_name: profileData?.last_name || "",
//     email: profileData?.email || "",
//     phone_number: profileData?.phone_number || "",
//     date_of_birth: patientRecord.date_of_birth || "",
//     gender: patientRecord.gender || "",
//     blood_group: patientRecord.blood_group || "",
//     height: patientRecord.height || 0,
//     weight: patientRecord.weight || 0,
//     known_allergies: patientRecord.known_allergies || "",
//     emergency_contact_name: patientRecord.emergency_contact_name || "",
//     emergency_contact_number: patientRecord.emergency_contact_number || "",
//     emergency_contact_relationship:
//       patientRecord.emergency_contact_relationship || "",
//     medical_history: patientRecord.medical_history || "",
//     current_medications: patientRecord.current_medications || "",
//   };

//   setPatient(fullPatient);

//   // -----------------------------
//   // Load All Appointments
//   // -----------------------------
//   const { data: appointmentsData } = await supabase
//     .from("appointments")
//     .select(`
//       id,
//       appointment_date,
//       type,
//       status,
//       facility_id,
//       doctor_id,
//       department_id,
//       payment_requested
//     `)
//     .eq("patient_id", patientRecord.id)
//     .order("appointment_date", { ascending: false });

//   if (appointmentsData) {
//     const formattedAppointments = await Promise.all(
//       appointmentsData.map(async (apt: any) => {
//         // -----------------------------
//         // Fetch Department
//         // -----------------------------
//         let departmentName = "N/A";

//         if (apt.department_id) {
//           const { data: deptData } = await supabase
//             .from("departments")
//             .select("name")
//             .eq("id", apt.department_id)
//             .single();

//           if (deptData) {
//             departmentName = deptData.name;
//           }
//         }

//         // -----------------------------
//         // Fetch Doctor
//         // -----------------------------
//         let doctorName = "N/A";
//         let doctorSpecialty = "N/A";

//         if (apt.doctor_id) {
//           const { data: doctorData } = await supabase
//             .from("medical_professionals")
//             .select("name, specialty")
//             .eq("user_id", apt.doctor_id)
//             .single();

//           if (doctorData) {
//             doctorName = doctorData.name;
//             doctorSpecialty = doctorData.specialty;
//           }
//         }

//         return {
//           id: apt.id,
//           appointment_date: apt.appointment_date,
//           appointment_time: apt.appointment_time,
//           type: apt.type,
//           status: apt.status,
//           department: departmentName,
//           doctor_name: doctorName,
//           doctor_specialty: doctorSpecialty,
//           facility_id: apt.facility_id,
//           doctor_id: apt.doctor_id,
//           payment_requested: apt.payment_requested,
          
//         };
//       })
//     );

//     setAppointments(formattedAppointments);
//   }

//   // -----------------------------
//   // Fetch Current Appointment
//   // -----------------------------
//   if (appointmentId) {
//     const { data: aptData, error: aptError } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         appointment_date,
//         duration_minutes,
//         type,
//         status,
//         department_id,
//         facility_id,
//         doctor_id,
//         patient_id,
//         chief_complaint,
//         notes,
//         consultation_fee,
//         video_room_id,
//         reminder_sent,
//         payment_requested,
//         created_at
//       `)
//       .eq("id", appointmentId)
//       .single();

//     if (!aptError && aptData) {
//       // Department
//       let departmentName = "N/A";

//       if (aptData.department_id) {
//         const { data: deptData } = await supabase
//           .from("departments")
//           .select("name")
//           .eq("id", aptData.department_id)
//           .single();

//         if (deptData) departmentName = deptData.name;
//       }

//       // Doctor
//       let doctorName = "N/A";

//       if (aptData.doctor_id) {
//         const { data: doctorData } = await supabase
//           .from("medical_professionals")
//           .select("medical_speciality")
//           .eq("user_id", aptData.doctor_id)
//           .single();

//         if (doctorData) {
//           doctorName = doctorData.name;
//         }
//       }

//       setCurrentAppointment({
//         id: aptData.id,
//         appointment_date: aptData.appointment_date,
//         duration_minutes: aptData.duration_minutes,
//         type: aptData.type,
//         status: aptData.status,
//         department_name: departmentName,
//         department_id: aptData.department_id,
//         doctor_name: doctorName,
//         doctor_specialty: "",
//         facility_id: aptData.facility_id,
//         doctor_id: aptData.doctor_id,
//         chief_complaint: aptData.chief_complaint,
//         notes: aptData.notes,
//         consultation_fee: aptData.consultation_fee,
//         video_room_id: aptData.video_room_id,
//         reminder_sent: aptData.reminder_sent,
//         payment_requested: aptData.payment_requested,
//         createdAt: aptData.created_at,
//       });
//     }
//   }

//   // -----------------------------
//   // Fetch Documents
//   // -----------------------------
//   if (appointmentId) {
//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//       .eq("appointment_id", appointmentId)
//       .order("created_at", { ascending: false });

//     if (docsData) {
//       setDocuments(docsData);
//     }
//   }
// };
// const loadDoctorData = async (doctorRecord: any) => {
//   try {
//     setDoctor(doctorRecord);
    
//     // Fetch profile data
//     const { data: profileData } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", doctorRecord.user_id)
//       .single();
//     setDoctorProfile(profileData);

//     // Fetch facility name if doctor belongs to a facility
//     if (doctorRecord.facility_id) {
//       const { data: facilityData } = await supabase
//         .from("facilities")
//         .select("facility_name")
//         .eq("id", doctorRecord.facility_id)
//         .single();
//       if (facilityData) setFacility(facilityData as any);
//     }

//     // Fetch recent appointments (optional, used for listing)
//     const { data: appointmentsData } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         appointment_date,
//         type,
//         status,
//         patient_id,
//         host_joined
//       `)
//       .eq("doctor_id", doctorRecord.user_id)
//       .eq("facility_id", doctorRecord.facility_id || "")
//       .limit(10);

//     if (appointmentsData) {
//       const formatted = appointmentsData.map((apt: any) => ({
//         id: apt.id,
//         appointment_date: apt.appointment_date,
//         appointment_time: apt.appointment_time,
//         type: apt.type,
//         status: apt.status,
//         department: "N/A",
//         doctor_name: "N/A",
//         doctor_specialty: doctorRecord.medical_speciality,
//         host_joined: apt.host_joined || false,
//       }));
//       setAppointments(formatted);
//     }

//     // Fetch documents for this appointment (if appointmentId exists)
//     if (appointmentId) {
//       const { data: docsData } = await supabase
//         .from("documents")
//         .select("*")
//         .eq("appointment_id", appointmentId)
//         .order("created_at", { ascending: false });
//       if (docsData) setDocuments(docsData);

//       // Fetch specific appointment details
//       const { data: aptData, error: aptError } = await supabase
//   .from("appointments")
//   .select(`
//     id,
//     appointment_date,
//     duration_minutes,
//     type,
//     status,
//     department_id,
//     facility_id,
//     doctor_id,
//     patient_id,
//     chief_complaint,
//     notes,
//     consultation_fee,
//     video_room_id,
//     reminder_sent,
//     payment_requested,
//     host_joined,
//     created_at 
//   `)
//   .eq("id", appointmentId)
//   .single();

// if (!aptError && aptData) {
//   // Fetch department name if department_id exists
//   let departmentName = "N/A";
//   if (aptData.department_id) {
//     const { data: deptData } = await supabase
//       .from("departments")
//       .select("name")
//       .eq("id", aptData.department_id)
//       .single();
//     if (deptData) departmentName = deptData.name;
//   }

//   setCurrentAppointment({
//     id: aptData.id,
//     appointment_date: aptData.appointment_date,
//     duration_minutes: aptData.duration_minutes,
//     type: aptData.type,
//     status: aptData.status,
//     department_name: departmentName,
//     department_id: aptData.department_id,
//     doctor_name: profileData ? `Dr. ${profileData.first_name} ${profileData.last_name}` : "N/A",
//     doctor_specialty: doctorRecord.medical_speciality,
//     facility_id: aptData.facility_id,
//     doctor_id: aptData.doctor_id,
//     chief_complaint: aptData.chief_complaint,
//     notes: aptData.notes,
//     consultation_fee: aptData.consultation_fee,
//     video_room_id: aptData.video_room_id,
//     reminder_sent: aptData.reminder_sent,
//     payment_requested: aptData.payment_requested,
//     host_joined: aptData.host_joined || false,
//      createdAt: aptData.created_at, 
//   });

//         // Fetch facility name
//         if (aptData.facility_id) {
//           const { data: facData } = await supabase
//             .from("facilities")
//             .select("facility_name")
//             .eq("id", aptData.facility_id)
//             .single();
//           if (facData) setFacilityName(facData.facility_name);
//         }

//         // Fetch payment information
//         const { data: payData } = await supabase
//           .from("payments")
//           .select("amount, status, created_at, stripe_session_id")
//           .eq("appointment_id", appointmentId)
//           .maybeSingle();

//         if (payData) {
//           setPaymentInfo({
//             amount: payData.amount,
//             status: payData.status,
//             payment_date: payData.created_at,
//             transaction_id: payData.stripe_session_id,
//           });
//         }
//       }
//     } else {
//       // If no appointmentId, still try to fetch documents for the doctor (optional)
//       const { data: docsData } = await supabase
//         .from("documents")
//         .select("*")
//         .eq("doctor_id", doctorRecord.user_id)
//         .order("created_at", { ascending: false })
//         .limit(5);
//       if (docsData) setDocuments(docsData);
//     }
//   } catch (error) {
//     console.error("Error in loadDoctorData:", error);
//   }
// };

//   const loadFacilityData = async (facilityRecord: any) => {
//     setFacility(facilityRecord);
//     const { data: profileData } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", facilityRecord.user_id)
//       .single();
//     setDoctorProfile(profileData);

//     if (facilityRecord.facility_id) {
//       const { data: facilityData } = await supabase
//         .from("facilities")
//         .select(` id,
//         facility_name,
//         facility_type,
//         address,
//         rating,
//         total_reviews,
//         about_facility,
//         number_of_staffs,
//         number_of_departments,
//         is_verified,
//         departments (
//           id,
//           facility_id,
//           name,
//           description,
//           head_doctor_id,
//           services,
//           equipment,
//           bed_capacity,
//           available_beds,
//           is_active
//         )`)
//         .eq("id", facilityRecord.facility_id)
//         .single();
    
//       if (facilityData) {
//       setFacility({
//         ...facilityData,
//         departments: facilityData.departments || [],
//       } as FacilityProfile);
//       }}

//     const { data: appointmentsData } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         appointment_date,
//         appointment_time,
//         type,
//         status,
//         patient_id
//       `)
//       .eq("facility_id", facilityRecord.facility_id)
//       .limit(10);

//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//       .eq("appointment_id", appointmentId)
//       .order("created_at", { ascending: false });
//     if (docsData) setDocuments(docsData);

//     if (appointmentsData) {
//       const formatted = appointmentsData.map((apt: any) => ({
//         id: apt.id,
//         appointment_date: apt.appointment_date,
//         appointment_time: apt.appointment_time,
//         type: apt.type,
//         status: apt.status,
//         department: "N/A",
//         doctor_name: "N/A",
//         doctor_specialty: facilityRecord.medical_speciality,
//       }));
//       setAppointments(formatted);
//     }

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

//   const fetchData = async () => {
//     if (!Id) return;
//     try {
//       setLoading(true);
//       setError(null);

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

//  const handleUploadSuccess = async () => {
//   setShowUploadModal(false);
  
//   if (pendingCompletion && appointmentId) {
//     // Mark appointment as completed
//     const { error } = await supabase
//       .from("appointments")
//       .update({
//         status: "completed",
//         completed_at: new Date().toISOString(),
//       })
//       .eq("id", appointmentId)
//       .eq("patient_id", patient.id);
    
//     if (error) {
//       toast({ title: "Error", description: "Document uploaded but failed to mark appointment as completed.", variant: "destructive" });
//     } else {
//       toast({ title: "Success", description: "Document uploaded and appointment marked as completed." });
//     }
//     setPendingCompletion(false);
//   } else {
//     toast({ title: "Success", description: "Document uploaded successfully." });
//   }
  
//   await fetchData(); // refresh all data
// };

//   const handleViewDocuments = (appointmentId?: string) => {
//     setSelectedAppointmentId(appointmentId || null);
//     setShowDocsModal(true);
//   };

//   // NEW: Function to fetch patientId from appointment and open modal
//   const handleOpenUploadModal = async () => {
//     if (!appointmentId) {
//       toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
//       return;
//     }
//     try {
//       const { data, error } = await supabase
//         .from("appointments")
//         .select("patient_id")
//         .eq("id", appointmentId)
//         .single();
//       if (error || !data) {
//         throw new Error("Could not find patient for this appointment");
//       }
//       setUploadPatientId(data.patient_id);
//       setShowUploadModal(true);
//     } catch (err: any) {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     }
//   };
//   useEffect(() => {
//   const checkPayment = async () => {
//     if (!appointmentId) return;
//     const { data, error } = await supabase
//       .from('payments')
//       .select('status')
//       .eq('appointment_id', appointmentId)
//       .eq('status', 'completed')
//       .maybeSingle();
//     if (!error && data) setPaymentCompleted(true);
//   };
//   checkPayment();
// }, [appointmentId]);

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



// const handleJoinVideo = (appointment: Appointment, userRole: "patient" | "doctor") => {
//   if (!appointment.video_room_id) {
//     toast({ title: "Error", description: "No video room available for this appointment", variant: "destructive" });
//     return;
//   }
//   if (appointment.status !== "confirmed") {
//     toast({ title: "Cannot Join", description: "Only confirmed appointments can be joined", variant: "destructive" });
//     return;
//   }
//   if (appointment.type !== "teleconsultation") {
//     toast({ title: "Not a Teleconsultation", description: "Video is only available for teleconsultation appointments", variant: "destructive" });
//     return;
//   }
//   const participantName = userRole === "patient" && patient
//     ? `${patient.first_name} ${patient.last_name}`
//     : userRole === "doctor" && doctorProfile
//     ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
//     : "Participant";

//   setVideoMeeting({
//     showMeeting: true,
//     meetingId: appointment.video_room_id,
//     participantName,
//     appointmentId: appointment.id,
//     userRole,
//   });
// };

// if (videoMeeting.showMeeting) {
//   const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
//   return (
//     <div className="inset-0 bg-white">
//       <VideoMeeting
//         isHost={videoMeeting.userRole === "doctor"}
//         apiKey={apiKey}
//         meetingId={videoMeeting.meetingId}
//         name={videoMeeting.participantName}
//         onMeetingLeave={() => setVideoMeeting({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "patient" })}
//         micEnabled={true}
//         webcamEnabled={true}
//         containerId="video-container"
//         meetingTitle={`Consultation with ${videoMeeting.userRole === "patient" ? "Doctor" : "Patient"}`}
//         appointmentId={videoMeeting.appointmentId}
//         userId={userId || ""}
//         userRole={videoMeeting.userRole}
//         enableDocumentSharing={true}
//       />
//     </div>
//   );
// }

//     const isCompleted = currentAppointment?.status === "completed";
//     const isCancelled = currentAppointment?.status === "cancelled";
// const isDoctor = userRole === "doctor"; 



// // Add this state near your other useState declarations (optional but recommended)

// // The full corrected function
// const PaymentCompleted = async () => {
//   if (!appointmentId) {
//     toast({
//       title: "Error",
//       description: "No appointment selected",
//       variant: "destructive",
//     });
//     return;
//   }

//   setPaymentRequestLoading(true);
//   try {
//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/request_payment",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           appointment_id: appointmentId,

//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data?.message || "Payment request failed");
//     }

//     toast({
//       title: "Payment Requested",
//       description: "Payment request sent successfully.",
//     });

//     // Optional: refresh appointment data to reflect updated payment_requested flag
//     await fetchData(); // if you have a fetchData function that refreshes current appointment
//   } catch (err: any) {
//     console.error("Payment request error:", err);
//     toast({
//       title: "Error",
//       description: err.message || "Failed to request payment",
//       variant: "destructive",
//     });
//   } finally {
//     setPaymentRequestLoading(false);
//   }
// };

// const handleJoinMeeting = async () => {
//   setJoiningMeeting(true);
//   if (!appointmentId || !userId) return;
//   if (!userId) {
//     toast({ title: "Error", description: "Doctor profile not found", variant: "destructive" });
//     setJoiningMeeting(false);
//     return;
//   }
//   const { error } = await supabase
//     .from("appointments")
//     .update({ host_joined: true })
//     .eq("id", appointmentId)
//     .eq("doctor_id", userId);
//   if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
// };

// const cancelAppointment = async () => {
//   if (!cancelReason.trim()) {
//     toast({ title: "Error", description: "Cancellation reason is required", variant: "destructive" });
//     return;
//   }
//   setCancelling(true);
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error("Not authenticated");

//     // Track analytics with the appropriate role
//     mixpanelInstance.track(
//       userRole === "doctor" ? "Doctor Cancel Appointment" : "Facility Cancel Appointment",
//       {
//         appointmentId: currentAppointment?.id,
//         patientId: patient.id,
//         userRole,
//         reason: cancelReason,
//         notes: cancelNotes,
//       }
//     );

//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     // Build payload based on who is cancelling
//     let payload: any = {
//       appointment_id: currentAppointment?.id,
//       reason: cancelReason,
//       notes: cancelNotes,
//     };

//     if (userRole === "doctor") {
//       payload.doctor_id = user.id;
//     } else if (userRole === "facility") {
//       // Facility users must send department_id (and optionally facility_id)
//       payload.department_id = currentAppointment?.department_id;
//       payload.facility_id = currentAppointment?.facility_id;
//     } else {
//       // Patient self-cancel (if ever allowed) – send patient_id
//       payload.patient_id = patient.id;
//     }

//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-appointment",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(text);
//     }

//     setOpenCancel(false);
//     setCancelReason("");
//     setCancelNotes("");
//     await fetchData(); // refresh page
//     toast({ title: "Success", description: "Appointment cancelled." });
//   } catch (err) {
//     console.error(err);
//     toast({ title: "Error", description: "Failed to cancel appointment", variant: "destructive" });
//   } finally {
//     setCancelling(false);
//   }
// };

//   const completeAppointment = async () => {
//     setCompleting(true);
//     try {
//       const { error } = await supabase
//         .from("appointments")
//         .update({
//           status: "completed",
//           completed_at: new Date().toISOString(),
//         })
//         .eq("id", appointmentId)
//         .eq("patient_id", patient.id);

//       if (error) throw error;

//       toast({ title: "Appointment Completed", description: "You have marked this appointment as completed." });
//       setOpenComplete(false);
//       await fetchData();
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: "Error", description: err.message || "Failed to complete appointment", variant: "destructive" });
//     } finally {
//       setCompleting(false);
//     }
//   };

//   const BookingCompleted = async () => {
//     if (!appointmentId) {
//       toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
//       return;
//     }

//     setCompleting(true);
//     try {
//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;
//       if (!token) {
//         throw new Error("Unable to authenticate request");
//       }

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             appointment_id: appointmentId,
//             payment_requested: true,
//             document_requested: true,
//             confirmed_by_role: "doctor",
//           }),
//         }
//       );

//       const responseData = await response.json();
//       if (!response.ok) {
//         throw new Error(responseData?.message || JSON.stringify(responseData));
//       }

//       toast({
//         title: "Appointment Confirmed",
//         description: "Doctor confirmation succeeded. Please upload the consultation summary.",
//       });
//       await fetchData();
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: "Error", description: err.message || "Failed to confirm appointment", variant: "destructive" });
//     } finally {
//       setCompleting(false);
//     }
//   };

// const handleDeleteDocument = async (doc: Document) => {
//   if (!userId) {
//     toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
//     return;
//   }

//   // Permission checks
//   const canDelete =
//     doc.uploader_role === "patient" && doc.uploaded_by === userId ||
//     doc.uploader_role === "doctor" && doc.uploaded_by === userId ||
//     userRole === "facility"; // facility admins can delete any document

//   // if (!canDelete) {
//   //   toast({ title: "Unauthorized", description: "You cannot delete this document", variant: "destructive" });
//   //   return;
//   // }

//   setDeletingDocId(doc.id);
//   try {
//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/delete-document",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           document_id: doc.id,
//           user_id: userId,
//           user_role: userRole === "facility" ? "hospital_admin" : userRole,
//           reason: `Deleted by ${userRole}`,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Delete failed");
//     }

//     toast({ title: "Success", description: "Document deleted successfully" });
//     // Refresh documents
//     await fetchData(); // your existing refresh function
//   } catch (err: any) {
//     console.error(err);
//     toast({ title: "Error", description: err.message, variant: "destructive" });
//   } finally {
//     setDeletingDocId(null);
//   }
// };
 
// // ==================== PATIENT VIEW (WITH CANCEL & COMPLETE) ====================


// if (viewType === "patient" && patient) {
//   return (
//     <div className="w-full px-4 sm:px-6 py-4 space-y-6">
//       {/* Header – back, title, timer, completed button */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
//           <div className="flex flex-wrap gap-2 mt-2">
//             <Badge variant="outline" className="bg-blue-50 text-blue-700">
//               <User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}
//             </Badge>
//           </div>
//         </div>
//         {currentAppointment?.status === "pending" && timeLeft !== null && timeLeft > 0 && (
//           <div className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
//             <span className="text-sm font-medium text-gray-700">Time remaining:</span>
//             <TimerDisplay seconds={timeLeft} />
//           </div>
//         )}

//         <Button variant="doctor" onClick={() => BookingCompleted()} disabled={isCompleted || isCancelled}>
//           Completed
//         </Button>
//       </div>

//       {/* Two-column layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT COLUMN */}
//         <div className="space-y-6">
//           {/* Personal Information Card */}
//           <Card className="border-0 shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
//               <CardTitle className="text-white flex items-center gap-2">
//                 <User className="h-5 w-5" /> Personal Information
//               </CardTitle>
//               <CardDescription className="text-blue-100">
//                 Patient details and demographics
//               </CardDescription>
//             </div>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-start space-x-3">
//                   <User className="h-5 w-5 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Full Name</p>
//                     <p className="text-sm text-muted-foreground">{patient.first_name} {patient.last_name}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Email</p>
//                     <p className="text-sm text-muted-foreground">{patient.email || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Phone Number</p>
//                     <p className="text-sm text-muted-foreground">{patient.phone_number || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Date of Birth</p>
//                     <p className="text-sm text-muted-foreground">
//                       {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(patient.date_of_birth)})
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Heart className="h-5 w-5 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Blood Group</p>
//                     <p className="text-sm text-muted-foreground">{patient.blood_group || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="flex space-x-2">
//                     <Ruler className="h-5 w-5" />
//                     <Weight className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Height / Weight</p>
//                     <p className="text-sm text-muted-foreground">{patient.height || "?"} cm / {patient.weight || "?"} kg</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Medical Information Card */}
//           <Card className="border-0 shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3">
//               <CardTitle className="text-white flex items-center gap-2">
//                 <Stethoscope className="h-5 w-5" /> Medical Information
//               </CardTitle>
//               <CardDescription className="text-green-100">
//                 Health records, allergies, and medications
//               </CardDescription>
//             </div>
//             <CardContent className="p-6 space-y-4">
//               <div>
//                 <p className="text-sm font-medium flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1 text-red-500" /> Known Allergies
//                 </p>
//                 <p className="text-sm text-muted-foreground mt-1">{patient.known_allergies || "None reported"}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium flex items-center">
//                   <Stethoscope className="h-4 w-4 mr-1 text-blue-500" /> Medical History
//                 </p>
//                 <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{patient.medical_history || "No history recorded"}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium flex items-center">
//                   <Pill className="h-4 w-4 mr-1 text-green-500" /> Current Medications
//                 </p>
//                 <p className="text-sm text-muted-foreground mt-1">{patient.current_medications || "None"}</p>
//               </div>
//               <Separator />
//               <div>
//                 <p className="text-sm font-medium">Emergency Contact</p>
//                 <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                   <div><span className="text-muted-foreground">Name:</span> {patient.emergency_contact_name || "N/A"}</div>
//                   <div><span className="text-muted-foreground">Phone:</span> {patient.emergency_contact_number || "N/A"}</div>
//                   <div><span className="text-muted-foreground">Relationship:</span> {patient.emergency_contact_relationship || "N/A"}</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-6">
//           {/* Action Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Upload Document Card */}
//             {(userRole === "facility" || userRole === "doctor") && (
//               <Card className="bg-indigo-50/40 border-indigo-100">
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                   <p className="text-xs text-indigo-600 font-medium mb-1">Upload for medical or lab Reports</p>
//                   <Upload className="h-8 w-8 text-indigo-600" />
//                   <h3 className="font-semibold">Upload Document</h3>
//                   <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
//                   <Button onClick={() => setShowUploadModal(true)} variant="outline" className="w-full mb-2">
//                     <Upload className="mr-2 h-4 w-4" /> Select File
//                   </Button>
//                   <p className="text-xs text-muted-foreground mb-2">Add medical reports, prescriptions, lab reports, or other documents</p>
//                   <p className="text-[11px] text-gray-500">Supported formats: PDF, PNG, JPG, JPEG</p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Request Payment Card (only for doctor) */}
//             {userRole === "doctor" && (
//               <Card className="bg-amber-50/40 border-amber-100">
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                   {currentAppointment?.payment_requested ? (
//                     <>
//                       <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
//                         <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                       <h3 className="font-semibold text-green-700">Consultation Fee Paid</h3>
//                       <p className="text-xs text-muted-foreground">Awaiting patient payment</p>
//                     </>
//                   ) : (
//                     <>
//                       <CreditCard className="h-8 w-8 text-amber-600 mb-2" />
//                       <h3 className="font-semibold">Request Consultation Fee</h3>
//                       <p className="text-xs text-muted-foreground mb-3">Send consultation fee request to patient</p>
//                       <Button onClick={PaymentCompleted} disabled={paymentRequestLoading} variant="outline" className="w-full">
//                         {paymentRequestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
//                         Request Consultation Fee
//                       </Button>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Upcoming Teleconsultation Card */}
//             {currentAppointment && currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
//               <Card className="bg-sky-50/40 border-sky-100 sm:col-span-2">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="flex items-center text-base"><Video className="mr-2 h-5 w-5 text-sky-600" /> Upcoming Teleconsultation</CardTitle>
//                   <CardDescription>Scheduled on {new Date(currentAppointment.appointment_date).toLocaleDateString()}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Button onClick={() => { handleJoinVideo(currentAppointment, "patient"); handleJoinMeeting(); }} className="w-full">
//                     <Video className="mr-2 h-4 w-4" /> Start Tele Consultation
//                   </Button>
//                   <div className="flex gap-2">
//                     <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>
//                       Cancel Appointment
//                     </Button>
//                     <Button variant="doctor" onClick={startCompleteWithUpload} className="flex-1">
//                       Mark as Completed
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Appointment Actions Card (non‑teleconsultation, doctor or facility) */}
//             {userRole === "doctor" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
//               <Card className="bg-rose-50/40 border-rose-100">
//                 <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
//                 <CardContent className="flex gap-2">
//                   <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>
//                     Cancel Appointment
//                   </Button>
//                   <Button variant="doctor" onClick={() => setOpenComplete(true)} disabled={isCompleted || isCancelled}>
//                     Mark as Completed
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//             {userRole === "facility" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
//               <Card className="bg-rose-50/40 border-rose-100">
//                 <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
//                 <CardContent>
//                   <Button variant="doctor" onClick={() => setOpenComplete(true)} disabled={isCompleted || isCancelled}>
//                     Mark as Completed
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Medical Documents Card - redesigned as per example */}
//           <Card className="border-0 shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
//               <CardTitle className="text-white flex items-center gap-2">
//                 <FileText className="h-5 w-5" /> Medical Documents
//               </CardTitle>
//               <CardDescription className="text-emerald-100">
//                 Prescriptions, reports & lab results
//               </CardDescription>
//             </div>
//             <CardContent className="p-6 space-y-3 max-h-[calc(150vh-250px)] overflow-y-auto">
//               {documents.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
//                   <p>No documents uploaded yet</p>
//                 </div>
//               ) : (
//                 documents.map((doc) => {
//                   let bgColor = "bg-white";
//                   let borderColor = "border-gray-200";
//                   let roleLabel = doc.uploader_role;
//                   if (doc.uploader_role === "patient") {
//                     bgColor = "bg-blue-50";
//                     borderColor = "border-blue-200";
//                     roleLabel = "Patient";
//                   } else if (doc.uploader_role === "doctor") {
//                     bgColor = "bg-green-50";
//                     borderColor = "border-green-200";
//                     roleLabel = "Doctor";
//                   } else if (doc.uploader_role === "department") {
//                     bgColor = "bg-purple-50";
//                     borderColor = "border-purple-200";
//                     roleLabel = "Department";
//                   }
//                   return (
//                     <div key={doc.id} className={`border rounded-lg p-3 ${bgColor} ${borderColor} hover:shadow transition`}>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div>
//                           <div>
//                             <p className="font-medium text-sm">{doc.name}</p>
//                             <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • Uploaded by: <span className="font-medium">{roleLabel}</span></p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}>
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleDeleteDocument(doc)}
//                             disabled={deletingDocId === doc.id}
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                           >
//                             {deletingDocId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
//                           </Button>
//                         </div>
//                       </div>
//                       {doc.ai_summary && (
//                         <div className="mt-2 flex items-center justify-between">
//                           <Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </CardContent>
//           </Card>

//           {/* Vitals Card (if any) */}
//           {vitals.length > 0 && (
//             <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Heart className="h-5 w-5" /> Recent Vitals
//                 </CardTitle>
//                 <CardDescription className="text-purple-100">
//                   Latest temperature, heart rate, and blood pressure
//                 </CardDescription>
//               </div>
//               <CardContent className="p-6">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                   {vitals.map((v) => (
//                     <div key={v.id} className="text-center p-2 border rounded">
//                       <div className="text-lg font-bold">{v.temperature}°C</div>
//                       <div className="text-xs text-muted-foreground">Temp</div>
//                       <div className="text-lg font-bold mt-2">{v.heart_rate}</div>
//                       <div className="text-xs text-muted-foreground">HR</div>
//                       <div className="text-sm">{v.blood_pressure_systolic}/{v.blood_pressure_diastolic}</div>
//                       <div className="text-xs text-muted-foreground">BP</div>
//                       <div className="text-xs text-muted-foreground mt-1">{new Date(v.recorded_at).toLocaleDateString()}</div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//        {/* Modals – unchanged */}
//       {openComplete && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//             <h3 className="text-lg font-semibold">Complete Appointment</h3>
//             <p className="text-sm text-gray-600">Please choose how you want to complete this appointment.</p>
//             <div className="space-y-3">
//               <Button className="w-full justify-start" onClick={() => { setPendingCompletion(true); setShowUploadModal(true); setOpenComplete(false); }}>
//                 <FileText className="h-4 w-4 mr-2" /> Complete with Prescription
//               </Button>
//               <Button variant="outline" className="w-full justify-start" onClick={() => { setOpenComplete(false); completeAppointment(); }}>
//                 Complete without Prescription
//               </Button>
//             </div>
//             <div className="flex justify-end"><Button variant="ghost" onClick={() => setOpenComplete(false)}>Cancel</Button></div>
//           </div>
//         </div>
//       )}

//       {openCancel && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//             <h3 className="text-lg font-semibold">Cancel Appointment</h3>
//             <div><label className="text-sm font-medium">Reason *</label><input className="w-full border rounded p-2 mt-1" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Why are you cancelling?" /></div>
//             <div><label className="text-sm font-medium">Notes (optional)</label><textarea className="w-full border rounded p-2 mt-1" rows={3} value={cancelNotes} onChange={(e) => setCancelNotes(e.target.value)} placeholder="Additional details" /></div>
//             <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenCancel(false)} disabled={cancelling}>Close</Button><Button variant="destructive" onClick={cancelAppointment} disabled={cancelling}>{cancelling ? "Cancelling..." : "Confirm Cancel"}</Button></div>
//           </div>
//         </div>
//       )}

//       <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="hospital_admin" />

//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
//               <h3 className="text-lg font-semibold">Upload Document for {patient.first_name} {patient.last_name}</h3>
//               <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
//             </div>
//             {userRole === "patient" ? (
//               <div className="p-6 max-h-[80vh] overflow-y-auto">
//                 <UploadPrescriptionForm
//                   patientId={patient.user_id}
//                   appointmentId={appointmentId || null}
//                   uploadedBy="patient"
//                   defaultDocumentType="medical_record"
//                   title="Upload Medical Document"
//                   onCancel={() => setShowUploadModal(false)}
//                 />
//               </div>
//             ) : userRole === "doctor" ? (
//               <div className="p-6 max-h-[70vh] overflow-y-auto">
//                 <UploadPrescriptionForm
//                   patientId={patient.user_id}
//                   doctorId={userId!}
//                   appointmentId={appointmentId || null}
//                   uploadedBy="doctor"
//                   defaultDocumentType="medical_record"
//                   onCancel={() => setShowUploadModal(false)}
//                 />
//               </div>
//             ) : userRole === "facility" ? (
//               <div className="p-6 max-h-[70vh] overflow-y-auto">
//                 <UploadPrescriptionForm
//                   patientId={patient.user_id}
//                   depertmentId={userId!}
//                   appointmentId={appointmentId || null}
//                   uploadedBy="department"
//                   defaultDocumentType="medical_record"
//                   onCancel={() => {
//                     mixpanelInstance.track('Facility Upload Cancelled', { 
//                       appointmentId: selectedAppointmentForUpload?.id, 
//                       patientName: `${patient.first_name} ${patient.last_name}`, 
//                       userRole 
//                     });
//                     setShowUploadModal(false);
//                   }}
//                 />
//               </div>
//             ) : null}
//           </div>
//         </div>
//       )}

//       <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
//         <DialogContent className="max-w-3xl md:max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>AI Summary</DialogTitle>
//             <DialogDescription>Detailed summary generated by AI</DialogDescription>
//           </DialogHeader>
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">
//             {cleanSummary(selectedSummary)}
//           </div>
//           <DialogFooter><Button onClick={() => setShowSummaryModal(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

//   // ==================== DOCTOR VIEW (FIXED) ====================

// if (viewType === "doctor" && doctor) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header: back button left, title centered, actions right */}
//         <div className="relative flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">
//             ← Back
//           </Button>
//           <div className="absolute left-1/2 transform -translate-x-1/2">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Appointment Details</h1>
//             <div className="flex justify-center mt-1">
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//                 <User className="h-3 w-3 mr-1" /> Doctor ID: {doctor.user_id}
//               </Badge>
//             </div>
//           </div>
//            {currentAppointment?.status === "pending" && 
//  timeLeft !== null && timeLeft > 0 && (
//   <div className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
//     <span className="text-sm font-medium text-gray-700">Time remaining:</span>
//     <TimerDisplay seconds={timeLeft} />
//   </div>
// )}
//         </div>

//         {/* Two‑column grid: left (info cards) | right (action cards + documents) */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* LEFT COLUMN – Doctor Personal Information + Appointment Information */}
//           <div className="space-y-6">
//             {/* Doctor Personal Information Card */}
//             <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Stethoscope className="h-5 w-5" /> Doctor Personal Information
//                 </CardTitle>
//               </div>
//               <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Full Name</span><span className="text-gray-900">Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Specialty</span><span className="text-gray-900">{doctor.medical_speciality}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">License Number</span><span className="text-gray-900">{doctor.license_number}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Experience</span><span className="text-gray-900">{doctor.years_experience} years</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Consultation Fee</span><span className="text-gray-900">₹{doctor.consultation_fee}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Email</span><span className="text-gray-900">{doctorProfile?.email}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Phone</span><span className="text-gray-900">{doctorProfile?.phone_number}</span></div>
//                 {doctor.address && <div className="flex justify-between"><span className="font-medium text-gray-600">Address</span><span className="text-gray-900 text-right">{doctor.address}, {doctor.city}, {doctor.state}</span></div>}
//               </CardContent>
//             </Card>

//             {/* Appointment Information Card */}
//             <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Calendar className="h-5 w-5" /> Appointment Information
//                 </CardTitle>
//               </div>
//               <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
//                 {currentAppointment ? (
//                   <>
//                     <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Date & Time</span><span className="text-gray-900">{new Date(currentAppointment.appointment_date).toLocaleString()}</span></div>
//                     {currentAppointment.duration_minutes && <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Duration</span><span className="text-gray-900">{currentAppointment.duration_minutes} minutes</span></div>}
//                     <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Type</span><span className="text-gray-900 capitalize">{currentAppointment.type}</span></div>
//                     <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Status</span><Badge variant="outline" className="capitalize bg-green-50 text-green-700">{currentAppointment.status}</Badge></div>
                    
//                   </>
//                 ) : (
//                   <div className="text-center text-muted-foreground py-8">No appointment selected or found.</div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* RIGHT COLUMN – Action cards + Documents */}
//           <div className="space-y-6">
//             {/* Action cards grid (2 columns on medium screens, 1 on small) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Upload Document Card */}
//               <Card className="bg-indigo-50/40 border-indigo-100">
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                     <p className="text-xs text-indigo-600 font-medium mb-1">
//         Upload for medical or lab Reports
//       </p>
//                   <Upload className="h-8 w-8 text-indigo-600 mb-2" />
//                   <h3 className="font-semibold">Upload Document</h3>
//                   <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
//                   <Button onClick={handleOpenUploadModal} variant="outline" className="w-full">
//                     <Upload className="mr-2 h-4 w-4" /> Select File
//                   </Button>

//                     <p className="text-xs text-muted-foreground mb-2">
//         Add medical reports, prescriptions, lab reports, or other documents
//       </p>

//       <p className="text-[11px] text-gray-500 mb-3">
//         Supported formats: PDF, PNG, JPG, JPEG
//       </p>
//                 </CardContent>
//               </Card>

//               {/* Request Payment Card (only for doctor) */}
              
//                 <Card className="bg-amber-50/40 border-amber-100">
//                   <CardContent className="p-4 flex flex-col items-center text-center">
//                    <div className="flex gap-3">
//                     <IndianRupee className="h-8 w-8 text-amber-600 mb-2" />
//                     <div>
//                       <h3 className="font-semibold">Consultation Fee</h3>
//                       <p className="text-xs text-muted-foreground mb-3">₹{doctor.consultation_fee || "0"}</p>
//                     </div>
//                    </div>
//             {/* Payment Section (original – kept unchanged) */}
//             <div className="space-y-2">
//               {!currentAppointment?.payment_requested && (
//                 <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-md">
//                   💡 Please request payment from the doctor after the consultation fee is complete.
//                 </p>
//               )}
//               {userRole === "patient" && paymentCompleted ? (
//                 <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                   <span className="font-medium">Consultation Fee Paid</span>
//                 </div>
//               ) : userRole === "patient" && !paymentCompleted && (
//                 <Button
//                   size="default"
//                   className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
//                   onClick={() => navigate(`/patient/appointment-payment/${appointmentId}`)}
//                 >
//                   Consultation Fee ₹{doctor.consultation_fee || "0"}
//                 </Button>
//               )}
//               {currentAppointment?.payment_requested && !paymentCompleted && (
//                 <p className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded-md">
//                   ⏳ Meeting started – you can now request consultation fee.
//                 </p>
//               )}
//             </div>
//                   </CardContent>
//                 </Card>
             

//               {/* Join Video Consultation Card (only if teleconsultation & confirmed) */}
//               {currentAppointment?.type === "teleconsultation" && currentAppointment?.status === "confirmed" && (
//                 <Card className="bg-sky-50/40 border-sky-100 sm:col-span-2">
//                   <CardContent className="p-4 flex flex-col items-center text-center">
//                     <Video className="h-8 w-8 text-sky-600 mb-2" />
//                     <h3 className="font-semibold">Tele Consultation</h3>
//                     <p className="text-xs text-muted-foreground mb-3">Join the live session</p>

// {currentAppointment?.type === "teleconsultation" && (
//   <div className="mt-2 mb-4">
//     {meetingEnded ? (
//       <p className="text-sm text-red-600 font-medium">
//         This consultation session has ended
//       </p>
//     ) : isDoctor ? (
//       <p className="text-sm text-blue-600 font-medium">
//         You are hosting this consultation. You can start the session anytime.
//       </p>
//     ) : currentAppointment?.host_joined ? (
//       <p className="text-sm text-green-600 font-medium">
//         Doctor is available. You can now join the consultation.
//       </p>
//     ) : (
//       <p className="text-sm text-yellow-600 font-medium">
//         Waiting for doctor to start the consultation
//       </p>
//     )}
//   </div>
// )}

//                     <Button
//                       onClick={() => {
//                         mixpanelInstance.track("Doctor Join Tele Consultation", {
//                           appointmentId: currentAppointment.id,
//                           timestamp: new Date().toISOString(),
//                         });
//                         handleJoinVideo(currentAppointment, "doctor");
//                         handleJoinMeeting();
//                       }}
//                       disabled={joiningMeeting || isJoinButtonDisabled || meetingEnded || currentAppointment?.host_joined !== true}
//                       className="w-full"
//                     >
//                       {meetingEnded ? (
//                         "Consultation Ended"
//                       ) : joiningMeeting ? (
//                         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</>
//                       ) : isJoinButtonDisabled ? (
//                         "Consultation not started yet"
//                       ) : currentAppointment?.host_joined === true ? (
//     <><Video className="mr-2 h-4 w-4" /> Join Tele Consultation</>
//   ) : (
//     <><Video className="mr-2 h-4 w-4" /> Join Tele Consultation</>
//   )}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             {/* Documents Card – full width, with colored items based on uploader role */}
//             <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//   <FileText className="h-5 w-5" /> Medical Documents
// </CardTitle>
// <CardDescription className="text-emerald-100">
//   Prescriptions, reports & lab results
// </CardDescription>
//                 {/* <CardDescription className="text-emerald-100">Uploaded documents for this appointment</CardDescription> */}
//               </div>
//               <CardContent className="p-6 bg-white dark:bg-slate-800">
//                 {documents.length === 0 ? (
//                   <div className="text-center py-12 text-muted-foreground">
//                     <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
//                     <p>No documents uploaded yet</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {documents.map((doc) => {
//                       let bgColor = "bg-white";
//                       let borderColor = "border-gray-200";
//                       let roleLabel = doc.uploader_role;
//                       if (doc.uploader_role === "patient") {
//                         bgColor = "bg-blue-50";
//                         borderColor = "border-blue-200";
//                         roleLabel = "Patient";
//                       } else if (doc.uploader_role === "doctor") {
//                         bgColor = "bg-green-50";
//                         borderColor = "border-green-200";
//                         roleLabel = "Doctor";
//                       } else if (doc.uploader_role === "department") {
//                         bgColor = "bg-purple-50";
//                         borderColor = "border-purple-200";
//                         roleLabel = "Department";
//                       }
//                       return (
//                         <div key={doc.id} className={`border rounded-lg p-4 ${bgColor} ${borderColor} hover:shadow-md transition-all`}>
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-start gap-3">
//                               <div className="bg-primary/10 p-2 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
//                               <div>
//                                 <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
//                                 <p className="text-xs text-muted-foreground">
//                                   {new Date(doc.created_at).toLocaleString()} • Uploaded by: <span className="font-medium">{roleLabel}</span>
//                                 </p>
//                               </div>
//                             </div>
//                             <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}>
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//   variant="ghost"
//   size="sm"
//   onClick={() => handleDeleteDocument(doc)}
//   disabled={deletingDocId === doc.id}
//   className="text-red-500 hover:text-red-700 hover:bg-red-50"
// >
//   {deletingDocId === doc.id ? (
//     <Loader2 className="h-4 w-4 animate-spin" />
//   ) : (
//     <Trash2 className="h-4 w-4" />
//   )}
// </Button>
//                           </div>
//                           {doc.ai_summary && (
//                             <div className="mt-3 flex justify-end">
//                               <Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>
//                                 View AI Summary
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Modals and Dialogs (unchanged) */}
//       <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
      
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white dark:bg-slate-800">
//               <h3 className="text-lg font-semibold">Upload Document for Dr. {doctorProfile?.first_name} {doctorProfile?.last_name}</h3>
//               <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
//             </div>
//             <div className="p-6">
//               <UploadPrescriptionForm
//                 patientId={uploadPatientId!}
//                 doctorId={userId!}
//                 appointmentId={appointmentId || null}
//                 uploadedBy="doctor"
//                 defaultDocumentType="medical_record"
//                 title="Upload Medical Document"
//                 onCancel={() => setShowUploadModal(false)}
//               />
//             </div>
//           </div>
//         </div>
//       )}
      
//       <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
//         <DialogContent className="max-w-3xl md:max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>AI Summary</DialogTitle>
//             <DialogDescription>Detailed summary generated by AI</DialogDescription>
//           </DialogHeader>
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">
//             {cleanSummary(selectedSummary)}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

//   // ==================== FACILITY VIEW (FIXED) ====================
  
// if (viewType === "facility" && facility) {
//   return (
//     <div className="w-full px-4 sm:px-6 py-4 space-y-6">
//       {/* Header: back button left, title + badges centered */}
//       {/* <div className="relative flex items-center justify-between"> */}
//         {/* <div className="max-w-7xl mx-auto space-y-6"> */}
//         {/* Header: back button left, title centered, actions right */}
//         <div className="relative flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">
//             ← Back
//           </Button>
//           <div className="absolute left-1/2 transform -translate-x-1/2">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Appointment Details</h1>
//             <div className="flex justify-center mt-1">
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//                 <User className="h-3 w-3 mr-1" /> Facility ID: {facility.id}
//               </Badge>
//             </div>
//           </div>
//           </div>
//         {/* </div> */}
//       {/* </div> */}

//       {/* Two‑column grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT COLUMN: Facility Details + About + Department Details */}
//         <div className="space-y-6">

//  <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Calendar className="h-5 w-5" /> Facility Information
//                 </CardTitle>
//               </div>
//               <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
//                   <>
//                     <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Facility Name</span><span className="text-gray-900">{facility.facility_name}</span></div>
//                     <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Type</span><span className="text-gray-900 capitalize">{facility.facility_type}</span></div>
//                     <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Reviews</span><Badge variant="outline" className="capitalize bg-green-50 text-green-700">{facility.rating} ⭐ ({facility.total_reviews} reviews)</Badge></div>
//                     {facility.is_verified && (
//               <Badge variant="outline" className="bg-purple-50 text-purple-700">
//                 ✓ Verified
//               </Badge>
//             )}
//                   </>
              
//               </CardContent>
//             </Card>

//           {/* Facility Details Card */}
//             <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Stethoscope className="h-5 w-5" /> Facility Details
//                 </CardTitle>
//               </div>
//               <CardContent className="p-6 space-y-3 bg-white dark:bg-slate-800">
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">License Number</span><span className="text-gray-900">{facility.license_number}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Email</span><span className="text-gray-900">{facility.email}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Phone</span><span className="text-gray-900">{facility.phone_number}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Staff Count:</span><span className="text-gray-900">{facility.number_of_staffs || "N/A"}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Departments:</span><span className="text-gray-900">{facility.number_of_departments || "N/A"}</span></div>
//                 {facility.address && <div className="flex justify-between"><span className="font-medium text-gray-600">Address</span><span className="text-gray-900 text-right">{facility.address}, {facility.city}, {facility.state},{facility.country_code} {facility.pin_code}</span></div>}
//               </CardContent>
//             </Card>

        
//           {/* About Facility Card (if exists) */}
//           {facility.about_facility && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>About</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>{facility.about_facility}</p>
//               </CardContent>
//             </Card>
//           )}

//           {/* Department Details Card (new) */}
//           {/* <Card>
//   <CardHeader>
//     <CardTitle>Department Details</CardTitle>
//   </CardHeader>
//   <CardContent>
//     {facility.departments && facility.departments.length > 0 ? (
//       <div className="space-y-3">
//         {facility.departments.map((dept, idx) => (
//           <div key={idx} className="border-b pb-2 last:border-0">
//             <p className="font-medium">{dept.name}</p>
//             {dept.description && <p className="text-sm text-muted-foreground">Description: {dept.description}</p>}
//             {dept.bed_capacity && <p className="text-sm text-muted-foreground">Bed Capacity: {dept.bed_capacity}</p>}
//             {dept.available_beds !== undefined && <p className="text-sm text-muted-foreground">Available Beds: {dept.available_beds}</p>}
//           </div>
//         ))}
//       </div>
//     ) : (
//       <p className="text-muted-foreground">No department details available.</p>
//     )}
//   </CardContent>
// </Card> */}
//         </div>

//         {/* RIGHT COLUMN: Upload Document action card + Documents card */}
//         <div className="space-y-6">
//           {/* Upload Document Action Card */}
//           <Card className="bg-indigo-50/40 border-indigo-100">
//             <CardContent className="p-4 flex flex-col items-center text-center">
//                 <p className="text-xs text-indigo-600 font-medium mb-1">
//         Upload for medical or lab Reports
//       </p>
//               <Upload className="h-8 w-8 text-indigo-600 mb-2" />
//               <h3 className="font-semibold">Upload Document</h3>
//               <p className="text-xs text-muted-foreground mb-3">Add prescription or report</p>
//               <Button onClick={handleOpenUploadModal} variant="outline" className="w-full">
//                 <Upload className="mr-2 h-4 w-4 " /> Select File
//               </Button>
//                 <p className="text-xs text-muted-foreground mb-2">
//         Add medical reports, prescriptions, lab reports, or other documents
//       </p>

//       <p className="text-[11px] text-gray-500 mb-3">
//         Supported formats: PDF, PNG, JPG, JPEG
//       </p>
//             </CardContent>
//           </Card>

          

//           {/* Documents Card – with color coding by uploader role */}
//           <Card className="border-0 shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
//                <CardTitle className="text-white flex items-center gap-2">
//   <FileText className="h-5 w-5" /> Medical Documents
// </CardTitle>
// <CardDescription className="text-emerald-100">
//   Prescriptions, reports & lab results
// </CardDescription>
//                 {/* <CardDescription className="text-emerald-100">Uploaded documents for this appointment</CardDescription> */}
//               </div>
//               <CardContent className="p-6 bg-white dark:bg-slate-800">
//               {documents.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
//                   <p>No documents uploaded yet</p>
//                 </div>
//               ) : (
//                 documents.map((doc) => {
//                   let bgColor = "bg-white";
//                   let borderColor = "border-gray-200";
//                   let roleLabel = doc.uploader_role;
//                   if (doc.uploader_role === "patient") {
//                     bgColor = "bg-blue-50";
//                     borderColor = "border-blue-200";
//                     roleLabel = "Patient";
//                   } else if (doc.uploader_role === "doctor") {
//                     bgColor = "bg-green-50";
//                     borderColor = "border-green-200";
//                     roleLabel = "Doctor";
//                   } else if (doc.uploader_role === "department") {
//                     bgColor = "bg-purple-50";
//                     borderColor = "border-purple-200";
//                     roleLabel = "Department";
//                   }
//                   return (
//                     <div key={doc.id} className={`border rounded-lg p-3 mb-2 ${bgColor} ${borderColor} hover:shadow transition`}>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3 ">
//                           <div className="bg-primary/10 p-2 rounded">
//                             <FileText className="h-4 w-4 text-primary" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-sm">{doc.name}</p>
//                             <p className="text-xs text-muted-foreground">
//                               {new Date(doc.created_at).toLocaleDateString()} • Uploaded by: <span className="font-medium">{roleLabel}</span>
//                             </p>
//                           </div>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={async () => {
//                             const { data } = await supabase.storage
//                               .from("patient_files")
//                               .createSignedUrl(doc.file_path, 60);
//                             if (data?.signedUrl) window.open(data.signedUrl, "_blank");
//                           }}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button
//   variant="ghost"
//   size="sm"
//   onClick={() => handleDeleteDocument(doc)}
//   disabled={deletingDocId === doc.id}
//   className="text-red-500 hover:text-red-700 hover:bg-red-50"
// >
//   {deletingDocId === doc.id ? (
//     <Loader2 className="h-4 w-4 animate-spin" />
//   ) : (
//     <Trash2 className="h-4 w-4" />
//   )}
// </Button>
//                       </div>
//                       {doc.ai_summary && (
//                         <div className="mt-2 flex items-center justify-between">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedSummary(doc.ai_summary);
//                               setShowSummaryModal(true);
//                             }}
//                           >
//                             View Full Summary
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Modals – unchanged */}
//       <AppointmentDocumentsModal
//         open={showDocsModal}
//         onClose={() => setShowDocsModal(false)}
//         appointmentId={selectedAppointmentId || ""}
//         role="patient"
//       />

//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
//               <h3 className="text-lg font-semibold">
//                 Upload Document for {facility.facility_name}
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowUploadModal(false);
//                   setSelectedAppointmentForUpload(null);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="p-6 max-h-[80vh] overflow-y-auto">
//               <UploadPrescriptionForm
//                 patientId={uploadPatientId!}
//                 depertmentId={userId!}
//                 appointmentId={appointmentId || null}
//                 uploadedBy="department"
//                 defaultDocumentType="medical_record"
//                 title="Upload Medical Document"
//                 onCancel={() => {
//                   mixpanelInstance.track("Facility Upload Cancelled", {
//                     appointmentId: selectedAppointmentForUpload?.id,
//                     userRole,
//                   });
//                   setShowUploadModal(false);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
//         <DialogContent className="max-w-3xl md:max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>AI Summary</DialogTitle>
//             <DialogDescription>Detailed summary generated by AI</DialogDescription>
//           </DialogHeader>
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto">
//             {cleanSummary(selectedSummary)}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
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
  Video,
  CreditCard,
  Loader2,
  IndianRupee,
  Trash2,
  DockIcon,
  LucideAppWindow,
  Telescope,
  ClipboardList,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import mixpanelInstance from "@/utils/mixpanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoMeeting from "../VideoMeeting";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardLink } from "react-bootstrap";
import { useFacilityLimit } from "@/hooks/useFacilityLimit";
// Interfaces
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
  payment_requested?: boolean;
  host_joined?: boolean;
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
  country_code?: string;
  pin_code?: string;
  facility_id?: string;
  payment_requested?: boolean;
  host_joined?: boolean;
}

interface FacilityProfile {
  id: string;
  user_id: string;
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
  city?: string;
  state?: string;
  country_code?: string;
  pin_code?: string;
  email?: string;
  phone_number?: string;
  departments?: Department[];
}

export interface Department {
  id: string;
  facility_id: string;
  name: string;
  description: string;
  head_doctor_id?: string;
  services?: any;
  equipment?: any;
  bed_capacity?: number;
  available_beds?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  price_per_day?: number;
  has_variable_pricing?: boolean;
  staff_count?: number;
}

interface Appointment {
  id: string;
  appointment_date: string;
  duration_minutes?: number;
  type: string;
  status: string;
  department_id?: string;
  department_name?: string;
  doctor_name: string;
  doctor_specialty: string;
  facility_id?: string;
  doctor_id?: string;
  chief_complaint?: string;
  notes?: string;
  consultation_fee?: number;
  video_room_id?: string;
  reminder_sent?: boolean;
  payment_requested?: boolean;
  document_requested?: boolean;
  host_joined?: boolean;
  createdAt?: string;
  time_slot_id?: string;
  start_time?: string;
  end_time?: string;
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
  const {user, Id, appointmentId } = useParams<{user:string; Id: string; appointmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = location.pathname.includes("/facility/") ? "facility"
                 : location.pathname.includes("/facility/") ? "hospital_staff"
                 : location.pathname.includes("/doctor/") ? "doctor"
                 : "patient";

  const userRoles = location.pathname.includes("/facility/") ? "department"
                 : location.pathname.includes("/doctor/") ? "doctor"
                 : "patient";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"patient" | "doctor" | "facility" | "hospital_staff" | null>(null);
  
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
  const [departmentInfo, setDepartmentInfo] = useState<Department | null>(null);
  const [completedWithoutDoc, setCompletedWithoutDoc] = useState(false);
  // Common state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [selectedAppointmentForUpload, setSelectedAppointmentForUpload] = useState<Appointment | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [uploadPatientId, setUploadPatientId] = useState<string | null>(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ amount: number; status: string; payment_date?: string; transaction_id?: string } | null>(null);
  const [facilityName, setFacilityName] = useState<string>("");
  const [joiningMeeting, setJoiningMeeting] = useState(false);
  const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentPermission, setDocumentPermission] = useState<string>("false");
const [consultationFee, setConsultationFee] = useState<string>("false");
const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [videoMeeting, setVideoMeeting] = useState<{
    showMeeting: boolean;
    meetingId: string;
    participantName: string;
    appointmentId: string;
    userRole: "patient" | "doctor";
  }>({
    showMeeting: false,
    meetingId: "",
    participantName: "",
    appointmentId: "",
    userRole: "patient",
  });
  const [pendingCompletion, setPendingCompletion] = useState(false);
const [joiningVideo, setJoiningVideo] = useState(false);

  const startCompleteWithUpload = () => {
    setPendingCompletion(true);
    setShowUploadModal(true);
  };
const [isCheckingLimit, setIsCheckingLimit] = useState(true);
const [limitExceeded, setLimitExceeded] = useState(false);
const [limitMessage, setLimitMessage] = useState("");
const [limitRecommendations, setLimitRecommendations] = useState<string[]>([]);
//  useEffect(() => {
//   const checkSubscriptionAndNavigate = async () => {
//     try {
//       if (!user || !currentAppointment) return; // ✅ use currentAppointment

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             user_auth_id: user,
//             consultation_type: currentAppointment.type, // ✅ use currentAppointment.type
//           }),
//         }
//       );

//       const result = await response.json();

//       const limits = {
//         clinical: result.limits?.in_person || { used: 0, max: 0 },
//         tele: result.limits?.teleconsultation || { used: 0, max: 0 },
//       };

//       const isTele = currentAppointment.type === "teleconsultation";
//       const selectedLimit = isTele ? limits.tele : limits.clinical;

//       if (!result.hasActiveSubscription || selectedLimit.used >= selectedLimit.max) {
//         toast({ title: "Subscription limit reached. Please upgrade your plan." }); // ✅ object form
//         return;
//       }

//       // ... rest of your logic
//     } catch (err) {
//       console.error("Subscription check failed:", err);
//       toast({ title: "Unable to verify subscription" }); // ✅ object form
//     }
//   };

//   checkSubscriptionAndNavigate();
// }, [user, currentAppointment]); // ✅ add currentAppointment as dependency

// useEffect(() => {
//   const checkSubscriptionAndNavigate = async () => {
//     try {
//       if (!user || !currentAppointment) return;

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             user_auth_id: user,
//             consultation_type: currentAppointment.type,
//           }),
//         }
//       );

//       const result = await response.json();

//       // ✅ 🚫 HARD STOP if not allowed
//       if (!result.allowed) {
//         // 🔥 Clean UI message
//         toast({
//           title: result.message || "Subscription limit reached",
//           description: result.recommendations?.join("\n"),
//           variant: "destructive",
//         });

//         return; // ❗ STOP EVERYTHING HERE
//       }

//       // ✅ ONLY runs if allowed = true
//       console.log("Allowed → continue flow");

//       // your next logic here (navigation, API calls, etc.)

//     } catch (err) {
//       console.error("Subscription check failed:", err);
//       toast({
//         title: "Unable to verify subscription",
//         variant: "destructive",
//       });
//     }
//   };

//   checkSubscriptionAndNavigate();
// }, [user, currentAppointment]);

// useEffect(() => {
//   const checkSubscription = async () => {
//     try {
//       if (!user || !currentAppointment) {
//         setIsCheckingLimit(false);
//         return;
//       }

//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;

//       const response = await fetch(
//         "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             user_auth_id: user,
//             consultation_type: currentAppointment.type,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!result.allowed) {
//         setLimitExceeded(true);
//         setLimitMessage(result.message || "Subscription limit exceeded");
//         setLimitRecommendations(result.recommendations || []);
//       } else {
//         setLimitExceeded(false);
//       }
//     } catch (err) {
//       console.error("Subscription check failed:", err);
//       setLimitExceeded(false); // Allow page on error, or you can set to true if you want to block
//     } finally {
//       setIsCheckingLimit(false);
//     }
//   };

//   checkSubscription();
// }, [user, currentAppointment]);
const { checkLimit, limits, loading: limitLoading } = useFacilityLimit();
useEffect(() => {
  const checkSubscription = async () => {
    setIsCheckingLimit(true);   // ✅ start loading

    try {
      if (userRole === "doctor") {
        if (!user || !currentAppointment) {   // ✅ use user.id
          setLimitExceeded(false);
          return;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_auth_id: user,               // ✅ fixed
              consultation_type: currentAppointment.type,
            }),
          }
        );

        const result = await response.json();

        if (!result.allowed) {
          setLimitExceeded(true);
          setLimitMessage(result.message || "Subscription limit exceeded");
          setLimitRecommendations(result.recommendations || []);
        } else {
          setLimitExceeded(false);
        }
      } else {
        // non‑doctor branch
        if (!user) return;

         const { data: facility, error: facilityError } = await supabase
      .from('facilities')
      .select('id')
      .eq('admin_user_id', user)
      .single()

      const facilityId = facility?.id;
        const result = await checkLimit(facilityId,"clinical");  // ✅ using hook for non‑doctor

        if (!result.allowed) {
          setLimitExceeded(true);
          setLimitMessage(result.message || "Facility limit exceeded");
          setLimitRecommendations(result.recommendations || []);
        } else {
          setLimitExceeded(false);
        }
      }
    } catch (err) {
      console.error("Subscription check failed:", err);
      setLimitExceeded(false);   // allow page on error
    } finally {
      setIsCheckingLimit(false);  // ✅ always reset loading
    }
  };

  checkSubscription();
}, [user, currentAppointment, userRole]);   // ✅ added missing deps
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

  // Timer for pending appointments (30‑minute auto‑cancel deadline)
  useEffect(() => {
    if (!currentAppointment || currentAppointment.status !== "pending") {
      setTimeLeft(null);
      return;
    }
    if (!currentAppointment.createdAt) {
      setTimeLeft(null);
      return;
    }

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

  useEffect(() => {
  const fetchUserRole = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user)
      .single();
    if (!error && data) {
      setCurrentUserRole(data.role);  // e.g. "facility", "hospital_staff"
    }
  };
  fetchUserRole();
}, [user]);

//   const loadPatientData = async (patientRecord: any) => {
//     // Load Patient Profile
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

//     // Load All Appointments
//     const { data: appointmentsData } = await supabase
//       .from("appointments")
//       .select(`
//         id, appointment_date, time_slot_id, type, status, facility_id, doctor_id, department_id, payment_requested, document_requested
//       `)
//       .eq("patient_id", patientRecord.id)
//       .order("appointment_date", { ascending: false });

//     if (appointmentsData) {
//       // const formattedAppointments = await Promise.all(
//       //   appointmentsData.map(async (apt: any) => {
//       //     let departmentName = "N/A";
//       //     if (apt.department_id) {
//       //       const { data: deptData } = await supabase
//       //         .from("departments")
//       //         .select("name")
//       //         .eq("id", apt.department_id)
//       //         .single();
//       //       if (deptData) departmentName = deptData.name;
//       //     }
//       //     let doctorName = "N/A";
//       //     let doctorSpecialty = "N/A";
//       //     if (apt.doctor_id) {
//       //       const { data: doctorData } = await supabase
//       //         .from("medical_professionals")
//       //         .select("name, specialty")
//       //         .eq("user_id", apt.doctor_id)
//       //         .single();
//       //       if (doctorData) {
//       //         doctorName = doctorData.name;
//       //         doctorSpecialty = doctorData.specialty;
//       //       }
//       //     }

//       //     const { data: slotData } = await supabase
//       //   .from("time_slots")
//       //   .select("id, start_time, end_time")
//       //   .eq("id", apt.time_slot_id)
//       //   .single();

      
//       //     return {
//       //       id: apt.id,
//       //       appointment_date: apt.appointment_date,
//       //       appointment_time: apt.appointment_time,
//       //       type: apt.type,
//       //       status: apt.status,
//       //       department: departmentName,
//       //       doctor_name: doctorName,
//       //       doctor_specialty: doctorSpecialty,
//       //       facility_id: apt.facility_id,
//       //       doctor_id: apt.doctor_id,
//       //       payment_requested: apt.payment_requested,
//       //       document_requested: apt.document_requested,
//       //     };
//       //   })
//       // );
//       const formattedAppointments = await Promise.all(
//   appointmentsData.map(async (apt: any) => {
//     let departmentName = "N/A";
//     let doctorName = "N/A";
//     let doctorSpecialty = "N/A";
//     let slotTime = "N/A";

//     // ===============================
//     // ✅ Department
//     // ===============================
//     if (apt.department_id) {
//       const { data: deptData } = await supabase
//         .from("departments")
//         .select("name")
//         .eq("id", apt.department_id)
//         .single();

//       if (deptData) departmentName = deptData.name;
//     }

//     // ===============================
//     // ✅ Doctor (ONLY if doctor appointment)
//     // ===============================
//     if (apt.type === "doctor" && apt.doctor_id) {
//       const { data: doctorData } = await supabase
//         .from("medical_professionals")
//         .select("name, specialty")
//         .eq("user_id", apt.doctor_id)
//         .single();

//       if (doctorData) {
//         doctorName = doctorData.name;
//         doctorSpecialty = doctorData.specialty;
//       }
//     }

//     // ===============================
//     // ✅ Time Slot Condition
//     // ===============================
//     if (apt.time_slot_id) {
//       let slotQuery = supabase
//         .from("time_slots")
//         .select("start_time, end_time")
//         .eq("id", apt.time_slot_id);

//       // 👉 Doctor Appointment
//       if (apt.type === "doctor" && apt.doctor_id) {
//         slotQuery = slotQuery.eq("doctor_id", apt.doctor_id);
//       }

//       // 👉 Facility Appointment
//       if (apt.type === "facility" && apt.facility_id && apt.department_id) {
//         slotQuery = slotQuery
//           .eq("facility_id", apt.facility_id)
//           .eq("department_id", apt.department_id);
//       }

//       const { data: slotData } = await slotQuery.single();

//       if (slotData) {
//         slotTime = `${slotData.start_time} - ${slotData.end_time}`;
//       }
//     }

//     return {
//       id: apt.id,
//       appointment_date: apt.appointment_date,
//       appointment_time: slotTime, // ✅ FIXED HERE
//       type: apt.type,
//       status: apt.status,
//       department: departmentName,
//       doctor_name: doctorName,
//       doctor_specialty: doctorSpecialty,
//       facility_id: apt.facility_id,
//       doctor_id: apt.doctor_id,
//       payment_requested: apt.payment_requested,
//       document_requested: apt.document_requested,
//     };
//   })
// );
//       setAppointments(formattedAppointments);
//     }

//     // Fetch Current Appointment
//     if (appointmentId) {
//       const { data: aptData, error: aptError } = await supabase
//         .from("appointments")
//         .select(`
//           id, appointment_date, duration_minutes, type, status, department_id, facility_id, doctor_id, patient_id,
//           chief_complaint, notes, consultation_fee, video_room_id, reminder_sent, payment_requested, document_requested, created_at, time_slot_id
//         `)
//         .eq("id", appointmentId)
//         .single();

//       if (!aptError && aptData) {
//         let departmentName = "N/A";
//         if (aptData.department_id) {
//           const { data: deptData } = await supabase
//             .from("departments")
//             .select("name")
//             .eq("id", aptData.department_id)
//             .single();
//           if (deptData) departmentName = deptData.name;
//         }
//         let doctorName = "N/A";
//         if (aptData.doctor_id) {
//           const { data: doctorData } = await supabase
//             .from("medical_professionals")
//             .select("medical_speciality")
//             .eq("user_id", aptData.doctor_id)
//             .single();
//           if (doctorData) doctorName = doctorData.name;
//         }
//         setCurrentAppointment({
//           id: aptData.id,
//           appointment_date: aptData.appointment_date,
//           duration_minutes: aptData.duration_minutes,
//           type: aptData.type,
//           status: aptData.status,
//           department_name: departmentName,
//           department_id: aptData.department_id,
//           doctor_name: doctorName,
//           doctor_specialty: "",
//           facility_id: aptData.facility_id,
//           doctor_id: aptData.doctor_id,
//           chief_complaint: aptData.chief_complaint,
//           notes: aptData.notes,
//           consultation_fee: aptData.consultation_fee,
//           video_room_id: aptData.video_room_id,
//           reminder_sent: aptData.reminder_sent,
//           payment_requested: aptData.payment_requested,
//           document_requested: aptData.document_requested,
//           createdAt: aptData.created_at,
//         });
        
//       }
//     }
    

//     // Fetch Documents
//     if (appointmentId) {
//       const { data: docsData } = await supabase
//         .from("documents")
//         .select("*")
//         .eq("appointment_id", appointmentId)
//         .order("created_at", { ascending: false });
//       if (docsData) setDocuments(docsData);
//     }
//   };
const loadPatientData = async (patientRecord: any) => {
  // 1. Load Patient Profile (unchanged)
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

  // 2. Load All Appointments (including time_slot_id)
  const { data: appointmentsData } = await supabase
    .from("appointments")
    .select(`
      id, appointment_date, time_slot_id, type, status, facility_id, doctor_id, department_id, payment_requested, document_requested
    `)
    .eq("patient_id", patientRecord.id)
    .order("appointment_date", { ascending: false });

  if (appointmentsData) {
    // Collect all time_slot_ids (ignore null/undefined)
    const timeSlotIds = appointmentsData
      .map(apt => apt.time_slot_id)
      .filter(id => id);

    // Batch fetch time slots
    let timeSlotsMap = new Map();
    if (timeSlotIds.length > 0) {
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("id, start_time, end_time")
        .in("id", timeSlotIds);
      if (!slotsError && slotsData) {
        slotsData.forEach(slot => timeSlotsMap.set(slot.id, slot));
      }
    }

    const formattedAppointments = await Promise.all(
      appointmentsData.map(async (apt: any) => {
        // Department name
        let departmentName = "N/A";
        if (apt.department_id) {
          const { data: deptData } = await supabase
            .from("departments")
            .select("name")
            .eq("id", apt.department_id)
            .single();
          if (deptData) departmentName = deptData.name;
        }

        // Doctor name & specialty
        let doctorName = "N/A";
        let doctorSpecialty = "N/A";
        if (apt.doctor_id) {
          const { data: doctorData } = await supabase
            .from("medical_professionals")
            .select("name, specialty")
            .eq("user_id", apt.doctor_id)
            .single();
          if (doctorData) {
            doctorName = doctorData.name;
            doctorSpecialty = doctorData.specialty;
          }
        }

        // Get time slot details from map
        const slot = timeSlotsMap.get(apt.time_slot_id);
        const start_time = slot?.start_time || "";
        const end_time = slot?.end_time || "";
        const appointment_time = start_time && end_time ? `${start_time} - ${end_time}` : "";

        return {
          id: apt.id,
          appointment_date: apt.appointment_date,
          time_slot_id: apt.time_slot_id,
          start_time,
          end_time,
          appointment_time,   // formatted string
          type: apt.type,
          status: apt.status,
          department: departmentName,
          doctor_name: doctorName,
          doctor_specialty: doctorSpecialty,
          facility_id: apt.facility_id,
          doctor_id: apt.doctor_id,
          payment_requested: apt.payment_requested,
          document_requested: apt.document_requested,
        };
      })
    );
    setAppointments(formattedAppointments);
  }

  // 3. Fetch Current Appointment (including its time slot)
  if (appointmentId) {
    const { data: aptData, error: aptError } = await supabase
      .from("appointments")
      .select(`
        id, appointment_date, time_slot_id, duration_minutes, type, status,
        department_id, facility_id, doctor_id, patient_id,
        chief_complaint, notes, consultation_fee, video_room_id,
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
        const { data: doctorData } = await supabase
          .from("medical_professionals")
          .select("medical_speciality")
          .eq("user_id", aptData.doctor_id)
          .single();
        if (doctorData) doctorName = doctorData.name;
      }

      // Fetch time slot for current appointment
      let start_time = "", end_time = "";
      if (aptData.time_slot_id) {
        const { data: slotData } = await supabase
          .from("time_slots")
          .select("start_time, end_time")
          .eq("id", aptData.time_slot_id)
          .single();
        if (slotData) {
          start_time = slotData.start_time;
          end_time = slotData.end_time;
        }
      }

      setCurrentAppointment({
        id: aptData.id,
        appointment_date: aptData.appointment_date,
        time_slot_id: aptData.time_slot_id,
        start_time,
        end_time,
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

  // 4. Fetch Documents (unchanged)
  if (appointmentId) {
    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });
    if (docsData) setDocuments(docsData);
  }
};

  const loadDoctorData = async (doctorRecord: any) => {
    try {
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

      // Fetch recent appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select(`id, appointment_date, type, status, patient_id, host_joined`)
        .eq("doctor_id", doctorRecord.user_id)
        .eq("facility_id", doctorRecord.facility_id || "")
        .limit(10);

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
          host_joined: apt.host_joined || false,
        }));
        setAppointments(formatted);
      }

      if (appointmentId) {
        const { data: docsData } = await supabase
          .from("documents")
          .select("*")
          .eq("appointment_id", appointmentId)
          .order("created_at", { ascending: false });
        if (docsData) setDocuments(docsData);

        const { data: aptData, error: aptError } = await supabase
          .from("appointments")
          .select(`
            id, appointment_date, duration_minutes, type, status, department_id, facility_id, doctor_id, patient_id,
            chief_complaint, notes, consultation_fee, video_room_id, reminder_sent, payment_requested, document_requested, host_joined, created_at
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
          setCurrentAppointment({
            id: aptData.id,
            appointment_date: aptData.appointment_date,
            duration_minutes: aptData.duration_minutes,
            type: aptData.type,
            status: aptData.status,
            department_name: departmentName,
            department_id: aptData.department_id,
            doctor_name: profileData ? `Dr. ${profileData.first_name} ${profileData.last_name}` : "N/A",
            doctor_specialty: doctorRecord.medical_speciality,
            facility_id: aptData.facility_id,
            doctor_id: aptData.doctor_id,
            chief_complaint: aptData.chief_complaint,
            notes: aptData.notes,
            consultation_fee: aptData.consultation_fee,
            video_room_id: aptData.video_room_id,
            reminder_sent: aptData.reminder_sent,
            payment_requested: aptData.payment_requested,
            document_requested: aptData.document_requested,
            host_joined: aptData.host_joined || false,
            createdAt: aptData.created_at,
          });

          if (aptData.facility_id) {
            const { data: facData } = await supabase
              .from("facilities")
              .select("facility_name")
              .eq("id", aptData.facility_id)
              .single();
            if (facData) setFacilityName(facData.facility_name);
          }

          const { data: payData } = await supabase
            .from("payments")
            .select("amount, status, created_at, stripe_session_id")
            .eq("appointment_id", appointmentId)
            .maybeSingle();
          if (payData) {
            setPaymentInfo({
              amount: payData.amount,
              status: payData.status,
              payment_date: payData.created_at,
              transaction_id: payData.stripe_session_id,
            });
          }
        }
      } else {
        const { data: docsData } = await supabase
          .from("documents")
          .select("*")
          .eq("doctor_id", doctorRecord.user_id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (docsData) setDocuments(docsData);
      }
    } catch (error) {
      console.error("Error in loadDoctorData:", error);
    }
  };
const loadFacilityData = async (facilityRecord: any) => {
  try {
    // 1. Set base facility
    setFacility(facilityRecord);

    // 2. Load admin profile (optional)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", facilityRecord.admin_user_id)
      .single();
    if (profileData) setDoctorProfile(profileData);

    // 3. Load facility details (without departments – fetched separately)
    const { data: facilityData } = await supabase
      .from("facilities")
      .select(`
        id,
        facility_name,
        facility_type,
        address,
        rating,
        license_number,
        total_reviews,
        about_facility,
        number_of_staffs,
        number_of_departments,
        is_verified
      `)
      .eq("id", facilityRecord.id)
      .single();
    if (facilityData) setFacility(facilityData as FacilityProfile);

    // 4. Load departments for this facility
    const { data: departmentsData } = await supabase
      .from("departments")
      .select(`
        id,
        facility_id,
        name,
        description,
        head_doctor_id,
        services,
        equipment,
        bed_capacity,
        available_beds,
        is_active
      `)
      .eq("facility_id", facilityRecord.id);

    // 5. Load appointments with necessary fields
    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        type,
        status,
        patient_id,
        department_id
      `)
      .eq("facility_id", facilityRecord.id)
      .order("appointment_date", { ascending: false })
      .limit(10);

    // 6. Enrich appointments with department names
    const formattedAppointments: Appointment[] = (appointmentsData || []).map((apt: any) => {
      const department = departmentsData?.find((d: any) => d.id === apt.department_id);
      return {
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        type: apt.type,
        status: apt.status,
        department_id: apt.department_id,
        department_name: department?.name || "N/A",
        doctor_name: "N/A",
        doctor_specialty: "General",
      };
    });

    // 7. Load documents (optional)
    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", facilityRecord.id)
      .order("created_at", { ascending: false });
    if (docsData) setDocuments(docsData);

    // 8. Get ward and bed counts for stats
    const { count: wardCount } = await supabase
      .from("wards")
      .select("*", { count: "exact", head: true })
      .eq("facility_id", facilityRecord.id);
    const { count: bedCount } = await supabase
      .from("beds")
      .select("*", { count: "exact", head: true })
      .eq("facility_id", facilityRecord.id);

    // 9. Set appointments including a stats row (using a placeholder appointment)
    setAppointments([
      ...formattedAppointments,
      {
        id: "stats",
        appointment_date: "",
        type: "stats",
        status: "",
        department_id: undefined,
        department_name: `Wards: ${wardCount || 0}`,
        doctor_name: `Beds: ${bedCount || 0}`,
        doctor_specialty: "",
      } as any, // cast to any because it's not a real appointment
    ]);

  } catch (error) {
    console.error("Facility Load Error:", error);
  }
};

  // const loadFacilityData = async (facilityRecord: any) => {
  //   setFacility(facilityRecord);
  //   const { data: profileData } = await supabase
  //     .from("profiles")
  //     .select("*")
  //     .eq("user_id", facilityRecord.user_id)
  //     .single();
  //   setDoctorProfile(profileData);

  //   if (facilityRecord.facility_id) {
  //     const { data: facilityData } = await supabase
  //       .from("facilities")
  //       .select(`
  //         id, facility_name, facility_type, address, rating, total_reviews, about_facility,
  //         number_of_staffs, number_of_departments, is_verified,
  //         departments (id, facility_id, name, description, head_doctor_id, services, equipment, bed_capacity, available_beds, is_active)
  //       `)
  //       .eq("id", facilityRecord.facility_id)
  //       .single();
  //     if (facilityData) {
  //       setFacility({
  //         ...facilityData,
  //         departments: facilityData.departments || [],
  //       } as FacilityProfile);
  //     }
  //   }

  //   const { data: appointmentsData } = await supabase
  //     .from("appointments")
  //     .select(`id, appointment_date, appointment_time, type, status, patient_id`)
  //     .eq("facility_id", facilityRecord.facility_id)
  //     .limit(10);

  //   const { data: docsData } = await supabase
  //     .from("documents")
  //     .select("*")
  //     .eq("appointment_id", appointmentId)
  //     .order("created_at", { ascending: false });
  //   if (docsData) setDocuments(docsData);

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

  //   const { count: wardCount } = await supabase
  //     .from("wards")
  //     .select("*", { count: "exact", head: true })
  //     .eq("facility_id", facilityRecord.id);
  //   const { count: bedCount } = await supabase
  //     .from("beds")
  //     .select("*", { count: "exact", head: true })
  //     .eq("facility_id", facilityRecord.id);
  //   setAppointments([{
  //     id: "stats",
  //     appointment_date: "",
  //     appointment_time: "",
  //     type: "stats",
  //     status: "",
  //     department: `Wards: ${wardCount || 0}`,
  //     doctor_name: `Beds: ${bedCount || 0}`,
  //     doctor_specialty: "",
  //   }] as any);
  // };
// const loadFacilityData = async (facilityRecord: any) => {
//   try {
//     // -------------------------
//     // 1. Set Base Facility
//     // -------------------------
//     setFacility(facilityRecord);

//     // -------------------------
//     // 2. Load Admin Profile
//     // -------------------------
//     const { data: profileData } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", facilityRecord.admin_user_id)
//       .single();

//     if (profileData) setDoctorProfile(profileData);


//     // -------------------------
//     // 3. Load Facility Details
//     // -------------------------
//     const { data: facilityData } = await supabase
//       .from("facilities")
//       .select(`
//         id,
//         facility_name,
//         facility_type,
//         address,
//         rating,
//         license_number,
//         total_reviews,
//         about_facility,
//         number_of_staffs,
//         number_of_departments,
//         is_verified
//       `)
//       .eq("id", facilityRecord.id)
//       .single();

//     if (facilityData) {
//       setFacility(facilityData as FacilityProfile);
//     }


//     // -------------------------
//     // 4. Load Departments
//     // -------------------------
//     const { data: departmentData } = await supabase
//       .from("departments")
//       .select(`
//         id,
//         facility_id,
//         name,
//         description,
//         head_doctor_id,
//         services,
//         equipment,
//         bed_capacity,
//         available_beds,
//         is_active
//       `)
//       .eq("facility_id", facilityRecord.id);


//     // -------------------------
//     // 5. Load Appointments
//     // -------------------------
//     const { data: appointmentsData } = await supabase
//       .from("appointments")
//       .select(`
//         id,
//         type,
//         status,
//         patient_id,
//         department_id
//       `)
//       .eq("facility_id", facilityRecord.id)
//       .limit(10);


//     let formattedAppointments: any[] = [];

//     if (appointmentsData) {
//       formattedAppointments = appointmentsData.map((apt: any) => {

//         const department =
//           departmentData?.find(
//             (dept: any) => dept.id === apt.department_id
//           ) || null;

//         return {
//           id: apt.id,
//           appointment_date: apt.appointment_date,
//           appointment_time: apt.appointment_time,
//           type: apt.type,
//           status: apt.status,
//           department: department, // FIXED
//           doctor_name: "N/A",
//           doctor_specialty: facilityRecord.medical_speciality || "General",
//         };
//       });
//     }


//     // -------------------------
//     // 6. Load Documents
//     // -------------------------
//     const { data: docsData } = await supabase
//       .from("documents")
//       .select("*")
//       .eq("facility_id", facilityRecord.id)
//       .order("created_at", { ascending: false });

//     if (docsData) setDocuments(docsData);


//     // -------------------------
//     // 7. Load Ward Count
//     // -------------------------
//     const { count: wardCount } = await supabase
//       .from("wards")
//       .select("*", { count: "exact", head: true })
//       .eq("facility_id", facilityRecord.id);


//     // -------------------------
//     // 8. Load Bed Count
//     // -------------------------
//     const { count: bedCount } = await supabase
//       .from("beds")
//       .select("*", { count: "exact", head: true })
//       .eq("facility_id", facilityRecord.id);


//     // -------------------------
//     // 9. Set Appointments
//     // -------------------------
//     setAppointments([
//       ...formattedAppointments,
//       {
//         id: "stats",
//         appointment_date: "",
//         appointment_time: "",
//         type: "stats",
//         status: "",
//         department: null,
//         doctor_name: `Beds: ${bedCount || 0}`,
//         doctor_specialty: `Wards: ${wardCount || 0}`,
//       }
//     ]);

//   } catch (error) {
//     console.error("Facility Load Error:", error);
//   }
// };
  const fetchData = async () => {
    if (!Id) return;
    try {
      setLoading(true);
      setError(null);

      const { data: patientData } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", Id)
        .maybeSingle();
      if (patientData) {
        setViewType("patient");
        await loadPatientData(patientData);
        return;
      }

      const { data: doctorData } = await supabase
        .from("medical_professionals")
        .select("*")
        .eq("user_id", Id)
        .maybeSingle();
      if (doctorData) {
        setViewType("doctor");
        await loadDoctorData(doctorData);
        return;
      }

      const { data: facilityData } = await supabase
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

  const handleUploadSuccess = async () => {
    setShowUploadModal(false);
    if (pendingCompletion && appointmentId) {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", appointmentId)
        .eq("patient_id", patient?.id);
      if (error) {
        toast({ title: "Error", description: "Document uploaded but failed to mark appointment as completed.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Document uploaded and appointment marked as completed." });
      }
      setPendingCompletion(false);
    } else {
      toast({ title: "Success", description: "Document uploaded successfully." });
    }
    await fetchData();
  };

  const handleViewDocuments = (appointmentId?: string) => {
    setSelectedAppointmentId(appointmentId || null);
    setShowDocsModal(true);
  };

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
      if (error || !data) throw new Error("Could not find patient for this appointment");
      setUploadPatientId(data.patient_id);
      setShowUploadModal(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
useEffect(() => {
  const fetchDepartmentInfo = async () => {
    if (currentAppointment?.department_id) {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("id", currentAppointment.department_id)
        .single();
      if (!error && data) {
        setDepartmentInfo(data);
      } else {
        setDepartmentInfo(null);
      }
    } else {
      setDepartmentInfo(null);
    }
  };
  fetchDepartmentInfo();
}, [currentAppointment?.department_id]);
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

  

  const handleJoinVideo = (appointment: Appointment, userRole: "patient" | "doctor") => {
    if (!appointment.video_room_id) {
      toast({ title: "Error", description: "No video room available for this appointment", variant: "destructive" });
      return;
    }
    if (appointment.status !== "confirmed") {
      toast({ title: "Cannot Join", description: "Only confirmed appointments can be joined", variant: "destructive" });
      return;
    }
    if (appointment.type !== "teleconsultation") {
      toast({ title: "Not a Teleconsultation", description: "Video is only available for teleconsultation appointments", variant: "destructive" });
      return;
    }
      setJoiningVideo(true);
  try {

    const participantName = userRole === "patient" && patient
      ? `${patient.first_name} ${patient.last_name}`
      : userRole === "doctor" && doctorProfile
      ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
      : "";
      
       if (userRole === "doctor") {
      handleJoinMeeting(); // fire-and-forget
    }
    setVideoMeeting({
      showMeeting: true,
      meetingId: appointment.video_room_id,
      participantName,
      appointmentId: appointment.id,
      userRole,
    });
    } catch (error) {
    console.error("Error joining video meeting:", error);
    toast({ title: "Error", description: "Failed to start video meeting", variant: "destructive" });
  } finally {
    setJoiningVideo(false);
  }
  };

  if (videoMeeting.showMeeting) {
    const apiKey = import.meta.env.VITE_VIDEOSDK_API_KEY;
    return (
      <div className="inset-0 bg-white">
        <VideoMeeting
          isHost={videoMeeting.userRole === "doctor"}
          apiKey={apiKey}
          meetingId={videoMeeting.meetingId}
          name={videoMeeting.participantName}
          onMeetingLeave={() => setVideoMeeting({ showMeeting: false, meetingId: "", participantName: "", appointmentId: "", userRole: "patient" })}
          micEnabled={true}
          webcamEnabled={true}
          containerId="video-container"
          meetingTitle={`Consultation with ${videoMeeting.userRole === "patient" ? "Doctor" : "Patient"}`}
          appointmentId={videoMeeting.appointmentId}
          userId={userId || ""}
          userRole={videoMeeting.userRole}
          enableDocumentSharing={true}
        />
      </div>
    );
  }

  const isCompleted = currentAppointment?.status === "completed";
  const isCancelled = currentAppointment?.status === "cancelled";
  const isDoctor = userRole === "doctor";

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
// const completeAppointment = async () => {
//   setCompleting(true);

//   try {
//     let query = supabase
//       .from("appointments")
//       .update({
//         status: "completed",
//         completed_at: new Date().toISOString(),
//       })
//       .eq("id", appointmentId);

//     // ✅ Doctor case
//     if (userRole === "doctor") {
//       query = query.eq("doctor_id", currentAppointment?.doctor_id);
//     }

//     // ✅ Facility case
//     if (userRole === "facility") {
//       query = query.eq("facility_id", currentAppointment?.facility_id);
//     }

//     // ✅ Optional: patient safety check
//     if (patient?.id) {
//       query = query.eq("patient_id", patient.id);
//     }

//     const { error } = await query;

//     if (error) throw error;

//     toast({
//       title: "Appointment Completed",
//       description: "You have marked this appointment as completed.",
//     });

//     setOpenComplete(false);
//     await fetchData();
//   } catch (err: any) {
//     console.error(err);
//     toast({
//       title: "Error",
//       description: err.message || "Failed to complete appointment",
//       variant: "destructive",
//     });
//   } finally {
//     setCompleting(false);
//   }
// };
  // const completeAppointment = async () => {
  //   setCompleting(true);
  //   try {
  //     const { error } = await supabase
  //       .from("appointments")
  //       .update({ status: "completed", completed_at: new Date().toISOString() })
  //       .eq("id", appointmentId)
  //       .eq("patient_id", patient?.id)
  //       .eq("facility_id", currentAppointment?.facility_id);
  //     if (error) throw error;
  //     toast({ title: "Appointment Completed", description: "You have marked this appointment as completed." });
  //     setOpenComplete(false);
  //     await fetchData();
  //   } catch (err: any) {
  //     console.error(err);
  //     toast({ title: "Error", description: err.message || "Failed to complete appointment", variant: "destructive" });
  //   } finally {
  //     setCompleting(false);
  //   }
  // };
//   const completeAppointment = async () => {
//   // 🔒 Condition: only allow completion if appointment time has passed
//   if (!isAppointmentTimePassed()) {
//     toast({
//       title: "Cannot Complete",
//       description: "You can mark this appointment as completed only after the scheduled time has ended.",
//       variant: "destructive",
//     });
//     return;
//   }

//   setCompleting(true);
//   try {
//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     if (!token) throw new Error("Not authenticated");

//     // 👇 Call your edge function
//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/complete-appointment",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           id: appointmentId,
//           doctor_id: currentAppointment?.doctor_id ||null,
//           facility_id: currentAppointment?.facility_id || null,
//           department_id: currentAppointment?.department_id || null,
//         }),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Failed to complete appointment");
//     }

//     toast({
//       title: "Appointment Completed",
//       description: "Appointment has been marked as completed.",
//     });
//     setOpenComplete(false);
//     await fetchData(); // refresh the view
//   } catch (err: any) {
//     console.error(err);
//     toast({
//       title: "Error",
//       description: err.message || "Failed to complete appointment",
//       variant: "destructive",
//     });
//   } finally {
//     setCompleting(false);
//   }
// };
// const completeAppointment = async () => {
//   // 🔒 Time validation
//   // if (!isAppointmentTimePassed()) {
//   //   toast({
//   //     title: "Cannot Complete",
//   //     description: "You can mark this appointment as completed only after the scheduled time has ended.",
//   //     variant: "destructive",
//   //   });
//   //   return;
//   // }

//   setCompleting(true);

//   try {
//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     if (!token) throw new Error("Not authenticated");

//     // ✅ Build payload based on role
//     let payload: any = {
//       id: appointmentId,
//     };

//     if (userRole === "doctor") {
//   payload.doctor_id = currentAppointment?.doctor_id;
// }

// if (userRole === "facility") {
//   payload.facility_admin_id = currentAppointment?.facility_id;
// }

// if (userRole === "hospital_staff") {

//   payload.staff_id = user;
// }
   

//     // 🚀 Call Edge Function
//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/complete-appointment",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Failed to complete appointment");
//     }

//     toast({
//       title: "Appointment Completed",
//       description: "Appointment has been marked as completed successfully.",
//     });

//     setOpenComplete(false);
//     await fetchData();

//   } catch (err: any) {
//     console.error(err);
//     toast({
//       title: "Error",
//       description: err.message || "Failed to complete appointment",
//       variant: "destructive",
//     });
//   } finally {
//     setCompleting(false);
//   }
// };

const completeAppointment = async () => {
  setCompleting(true);

  try {
    // 1️⃣ Get session + user
    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData.session?.access_token;

    if (!token || !user) throw new Error("Not authenticated");

    // 2️⃣ Get profile (ROLE SOURCE)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, role") // make sure 'role' column exists
      .eq("user_id", user)
      .single();

    if (profileError || !profile) {
      throw new Error("User profile not found");
    }

    const role = profile.role; // 👈 role from DB

    let payload: any = {
      id: appointmentId,
    };

    // 3️⃣ Role-based logic

    // ✅ Doctor
    if (role === "doctor") {
      payload.doctor_id = currentAppointment?.doctor_id;
    }

    // ✅ Facility Admin
    else if (role === "facility" || role === "hospital_admin") {
      const { data: facility } = await supabase
        .from("facilities")
        .select("admin_user_id")
        .eq("admin_user_id", user) // better check by user.id
        .single();

      if (!facility) {
        throw new Error("Facility not found for this admin");
      }

      payload.facility_admin_id = user;
    }

    // ✅ Staff
    else if (role === "hospital_staff") {
      const { data: staff } = await supabase
        .from("staff")
        .select("user_id, is_active")
        .eq("facility_id", currentAppointment?.facility_id) // ensure staff belongs to the same facility
        .eq("user_id", user)
        .single();

      if (!staff || !staff.is_active) {
        throw new Error("Staff not active or not found");
      }

      payload.staff_id = user;
    }

    else {
      throw new Error("Invalid role");
    }

    // 4️⃣ Call Edge Function
    const response = await fetch(
      "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/complete-appointment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to complete appointment");
    }

    console.log("✅ SUCCESS:", result);

  } catch (err: any) {
    console.error("❌ ERROR:", err.message);
  } finally {
    setCompleting(false);
  }
};
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
  // const BookingCompleted = async () => {
  //   if (!appointmentId) {
  //     toast({ title: "Error", description: "No appointment selected", variant: "destructive" });
  //     return;
  //   }
  //   setCompleting(true);
  //   try {
  //     const { data: sessionData } = await supabase.auth.getSession();
  //     const token = sessionData.session?.access_token;
  //     if (!token) throw new Error("Unable to authenticate request");
  //     const response = await fetch(
  //       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //         body: JSON.stringify({ appointment_id: appointmentId, payment_requested: true, document_requested: true, confirmed_by_role: "doctor" }),
  //       }
  //     );
  //     const responseData = await response.json();
  //     if (!response.ok) throw new Error(responseData?.message || JSON.stringify(responseData));
  //     toast({ title: "Appointment Confirmed", description: "Doctor confirmation succeeded. Please upload the consultation summary." });
  //     await fetchData();
  //   } catch (err: any) {
  //     console.error(err);
  //     toast({ title: "Error", description: err.message || "Failed to confirm appointment", variant: "destructive" });
  //   } finally {
  //     setCompleting(false);
  //   }
  // };
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
//     const { data: sessionData } = await supabase.auth.getSession();
//     const token = sessionData.session?.access_token;

//     if (!token) throw new Error("Unable to authenticate request");

//     const response = await fetch(
//       "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/confirm-appointment",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           appointment_id: appointmentId,
//           payment_requested: payment_requested,
//           document_requested: document_requested,
//           confirmed_by_role: "doctor"
//         })
//       }
//     );

//     const responseData = await response.json();

//     if (!response.ok)
//       throw new Error(responseData?.message || JSON.stringify(responseData));

//     toast({
//       title: "Appointment Confirmed",
//       description: "Doctor confirmation succeeded."
//     });

//     await fetchData();

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
          body: JSON.stringify({ document_id: doc.id, user_id: userId, user_role: userRole === "facility" ? "hospital_admin" : userRole, reason: `Deleted by ${userRole}` }),
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
const PendingOverlay = () => (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
    <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md text-center font-medium">
      ⏳ Pending – Awaiting doctor's permission
    </div>
  </div>
);
const PatientPendingOverlay = () => (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
      
      <div className="bg-gray-50 rounded-lg px-6 py-4 shadow-md text-center font-medium space-y-3">
        
        <div>
          ⏳ Pending – This appointment is waiting for your approval.
        </div>

          {/* <Button
            variant="doctor"
            onClick={() => setIsDialogOpen(true)}
            disabled={isCompleted || isCancelled}
            className="w-full"
          >
            Confirm this appointment
          </Button> */}

      </div>

    </div>
);
const DoctorPendingOverlay = () => (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
    <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md text-center font-medium">
      ⏳ Pending — Waiting for confirmation.
    </div>
  </div>
);
const FacilityPendingOverlay = () => (
  <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
    <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-md text-center font-medium">
      ⏳ Pending — Waiting for confirmation.
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

const isAppointmentTimePassed = () => {
  if (!currentAppointment?.appointment_date || !currentAppointment?.end_time) return false;
  // Combine date and end_time into a full datetime
  const dateStr = currentAppointment.appointment_date.split('T')[0]; // YYYY-MM-DD
  const endDateTime = new Date(`${dateStr}T${currentAppointment.end_time}`);
  return new Date() > endDateTime;
};
const getCompletionMessage = () => {
  if (isCompleted) return "Appointment already completed";
  if (isCancelled) return "Appointment has been cancelled";

  if (!isAppointmentTimePassed()) {
    if (currentAppointment?.type === "doctor") {
      return "You can mark this appointment as completed only after the doctor's consultation time ends.";
    }

    if (currentAppointment?.type === "facility") {
      return "You can mark this appointment as completed only after the facility service time ends.";
    }

    return "You can mark this appointment as completed only after the scheduled time ends.";
  }

  return "";
};
const CompletionMessage = () => {
  if (isAppointmentTimePassed() || isCompleted || isCancelled) return null;

  return (
    <p className="text-sm text-gray-500 mt-2">
      {getCompletionMessage()}
    </p>
  );
};

// Show loader while checking subscription

if (isCheckingLimit && viewType === "patient" && userRole === "doctor" && patient && currentAppointment?.status === "pending") {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Verifying subscription...</p>
      </div>
    </div>
  );
}

// Show full-page error if limit exceeded
if (limitExceeded && viewType === "patient" && userRole === "doctor" && patient && currentAppointment?.status === "pending") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="max-w-md w-full shadow-xl border-red-200">
        <CardHeader className="bg-red-600 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" /> Subscription Limit Exceeded
          </CardTitle>
          <CardDescription className="text-red-100">
            You cannot access this appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm">
            {limitMessage}
          </div>

          {limitRecommendations.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm text-gray-700">Recommendations:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {limitRecommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={() => window.open("/pricing", "_blank")}>
              Upgrade Plan
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.open("/contact", "_blank")}>
              Contact Support
            </Button>
          </div> */}

          <Button variant="ghost" className="w-full mt-2" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

if (isCheckingLimit && viewType === "patient" && userRole === "facility" && patient && currentAppointment?.status === "pending") {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Verifying subscription...</p>
      </div>
    </div>
  );
}

// Show full-page error if limit exceeded
if (limitExceeded && viewType === "patient" && userRole === "facility" && patient && currentAppointment?.status === "pending") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="max-w-md w-full shadow-xl border-red-200">
        <CardHeader className="bg-red-600 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" /> Subscription Limit Exceeded
          </CardTitle>
          <CardDescription className="text-red-100">
            You cannot access this appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm">
            {limitMessage}
          </div>

          {limitRecommendations.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm text-gray-700">Recommendations:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {limitRecommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={() => window.open("/pricing", "_blank")}>
              Upgrade Plan
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.open("/contact", "_blank")}>
              Contact Support
            </Button>
          </div> */}

          <Button variant="ghost" className="w-full mt-2" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

  // ==================== PATIENT VIEW ====================
  if (viewType === "patient" && patient) {
    const isPending = currentAppointment?.status === "pending";
    const isFacility = userRole === "facility" || currentUserRole === "hospital_admin" || currentUserRole === "hospital_staff";
    return (
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>← Back</Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <User className="h-3 w-3 mr-1" /> Patient ID: {patient.id}
              </Badge>
            </div>
          </div>
          {currentAppointment?.status === "pending" && timeLeft !== null && timeLeft > 0 && (
            <div className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-700">Time remaining:</span>
              <TimerDisplay seconds={timeLeft} />
            </div>
          )}
          {userRole === "doctor" && currentAppointment.status === "pending" && (
          <Button variant="doctor" 
          onClick={() => setIsDialogOpen(true)} 
            disabled={isCompleted || isCancelled}>
            Confirm this appointment
          </Button>)}
          {/* {userRole === "facility" && currentAppointment.status === "pending" && (
          <Button variant="doctor" 
          onClick={() => setIsDialogOpen(true)} 
            disabled={isCompleted || isCancelled}>
            Confirm this appointment
          </Button>)} */}
           {isPending &&  isFacility && (
                      <Button variant="doctor" onClick={() => setIsDialogOpen(true)} disabled={isCompleted || isCancelled}>
                        Confirm this appointment
                      </Button>
                    )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Personal & Medical Info */}
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

          {/* RIGHT COLUMN - Action Cards & Documents */}
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
    {(isPending || !currentAppointment?.document_requested)  && userRole === "doctor" &&  <PatientPendingOverlay />}
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
{userRole === "doctor" &&(
  <Card className="relative bg-amber-50/40 border-amber-100">
   <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <CardLink className="h-5 w-5" />
    Consultation Fee Payment
  </CardTitle>
</div>
    <CardContent className="p-4 flex flex-col items-center text-center">
      {paymentCompleted ? (
        <>
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-green-700">Consultation Fee Paid</h3>
          <p className="text-xs text-muted-foreground">Awaiting patient payment</p>
        </>

        ) : currentAppointment?.payment_requested ? (
  <>
    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
      <CreditCard className="h-5 w-5 text-yellow-600" />
    </div>

    <h3 className="font-semibold text-yellow-700">
      Payment Requested
    </h3>

    <p className="text-xs text-muted-foreground">
      Waiting for the patient to complete the payment.
    </p>
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
            </div>
              {/* Teleconsultation Card
              {userRole === "doctor" && currentAppointment && currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
                <Card className="relative border-0 shadow-lg overflow-hidden">
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
                    <Button onClick={() => { handleJoinVideo(currentAppointment, "doctor"); handleJoinMeeting(); }} disabled={joiningVideo} className="w-full">
                      {/* <Video className="mr-2 h-4 w-4" /> Start Tele Consultation 
                      {joiningVideo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
  {joiningVideo ? "Starting..." : "Start Tele Consultation"}
                    </Button>
                      <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel Appointment</Button>
                      {/* <Button variant="doctor" onClick={startCompleteWithUpload} className="flex-1"  
                      <Button variant="doctor" onClick={() => setOpenComplete(true)} className="flex-1" 
                      disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
>Mark as Completed</Button>
              <div className="mt-3 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
  <AlertCircle className="h-5 w-5 mt-0.5" />
  <div className="text-sm">
    <CompletionMessage />
  </div>
</div>
                  </CardContent>
                </Card>
              )}

              {/* Non-teleconsultation action buttons 
              {userRole === "doctor" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
                <Card className="relative border-0 shadow-lg overflow-hidden">
                {/* <Card className="bg-rose-50/40 border-rose-100"> 
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <LucideAppWindow className="h-5 w-5" />
    Appointment Actions
  </CardTitle>
</div>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
                  <CardContent className="flex gap-2 ">
                    <Button variant="destructive" onClick={() => setOpenCancel(true)} disabled={isCompleted || isCancelled}>Cancel Appointment</Button>
                    <Button variant="doctor" onClick={() => setOpenComplete(true)}
                    
                    disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
>Mark as Completed</Button>


<div className="mt-3 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
  <AlertCircle className="h-5 w-5 mt-0.5" />
  <div className="text-sm">
    <CompletionMessage />
  </div>
</div>
                  </CardContent>
                </Card>
              )}
              {(currentUserRole === "hospital_admin"  || currentUserRole === "hospital_staff" ) && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
                <Card className="relative border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
  <CardTitle className="text-white flex items-center gap-2">
    <LucideAppWindow className="h-5 w-5" />
    Appointment Actions
  </CardTitle>
</div>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Appointment Actions</CardTitle></CardHeader>
                  <CardContent>
                    <Button variant="doctor" onClick={() => setOpenComplete(true)} 
                    disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
>Mark as Completed</Button>
<div className="mt-3 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
  <AlertCircle className="h-5 w-5 mt-0.5" />
  <div className="text-sm">
    <CompletionMessage />
  </div>
</div>
                  </CardContent>
                  
                </Card>
              )} */}
              {/* Teleconsultation Card */}
{userRole === "doctor" && currentAppointment && currentAppointment.type === "teleconsultation" && currentAppointment.status === "confirmed" && (
  <Card className="relative border-0 shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
      <CardTitle className="text-white flex items-center gap-2">
        <Telescope className="h-5 w-5" />
        Start Tele Consultation Meeting
      </CardTitle>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center text-base">
        <Video className="mr-2 h-5 w-5 text-sky-600" /> Upcoming Teleconsultation
      </CardTitle>
      <CardDescription>
        Scheduled on {new Date(currentAppointment.appointment_date).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Main action buttons row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => {
            handleJoinVideo(currentAppointment, "doctor");
            handleJoinMeeting();
          }}
          disabled={joiningVideo}
          className="flex-1"
        >
          {joiningVideo ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Video className="mr-2 h-4 w-4" />
          )}
          {joiningVideo ? "Starting..." : "Start Tele Consultation"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setOpenCancel(true)}
          disabled={isCompleted || isCancelled}
          className="flex-1"
        >
          Cancel Appointment
        </Button>
      </div>
      {/* Mark as Completed button – below for clarity */}
      <Button
        variant="doctor"
        onClick={() => setOpenComplete(true)}
        disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
        className="w-full sm:w-auto"
      >
        Mark as Completed
      </Button>
      {/* Warning message */}
      <div className="mt-2 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <CompletionMessage />
        </div>
      </div>
    </CardContent>
  </Card>
)}

{/* Non-teleconsultation action buttons – doctor */}
{userRole === "doctor" && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
  <Card className="relative border-0 shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
      <CardTitle className="text-white flex items-center gap-2">
        <LucideAppWindow className="h-5 w-5" />
        Appointment Actions
      </CardTitle>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Appointment Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="destructive"
          onClick={() => setOpenCancel(true)}
          disabled={isCompleted || isCancelled}
          className="flex-1"
        >
          Cancel Appointment
        </Button>
        <Button
          variant="doctor"
          onClick={() => setOpenComplete(true)}
          disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
          className="flex-1"
        >
          Mark as Completed
        </Button>
      </div>
      <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <CompletionMessage />
        </div>
      </div>
    </CardContent>
  </Card>
)}

{/* Hospital admin / staff – only Mark as Completed */}
{(currentUserRole === "hospital_admin" || currentUserRole === "hospital_staff") && currentAppointment && currentAppointment.type !== "teleconsultation" && currentAppointment.status === "confirmed" && (
  <Card className="relative border-0 shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
      <CardTitle className="text-white flex items-center gap-2">
        <LucideAppWindow className="h-5 w-5" />
        Appointment Actions
      </CardTitle>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Appointment Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Button
        variant="doctor"
        onClick={() => setOpenComplete(true)}
        disabled={isCompleted || isCancelled || !isAppointmentTimePassed()}
        className="w-full sm:w-auto"
      >
        Mark as Completed
      </Button>
      <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-900 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <CompletionMessage />
        </div>
      </div>
    </CardContent>
  </Card>
)}

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
                       {isPending }

              </Card>
            {/* )} */}

            {vitals.length > 0 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
                  <CardTitle className="text-white flex items-center gap-2"><Heart className="h-5 w-5" /> Recent Vitals</CardTitle>
                  <CardDescription className="text-purple-100">Latest temperature, heart rate, and blood pressure</CardDescription>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {vitals.map((v) => (
                      <div key={v.id} className="text-center p-2 border rounded">
                        <div className="text-lg font-bold">{v.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temp</div>
                        <div className="text-lg font-bold mt-2">{v.heart_rate}</div>
                        <div className="text-xs text-muted-foreground">HR</div>
                        <div className="text-sm">{v.blood_pressure_systolic}/{v.blood_pressure_diastolic}</div>
                        <div className="text-xs text-muted-foreground">BP</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(v.recorded_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
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
                <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
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
                  <UploadPrescriptionForm patientId={patient.user_id} depertmentId={userId!} appointmentId={appointmentId || null} uploadedBy="department" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => { mixpanelInstance.track('Facility Upload Cancelled', { appointmentId: selectedAppointmentForUpload?.id, patientName: `${patient.first_name} ${patient.last_name}`, userRole }); setShowUploadModal(false); }} />
                </div>
              ) : null}
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
  <DialogContent>
  {/* <DialogContent className="sm:max-w-md"> */}
    <DialogHeader>
      <DialogTitle>Confirm this appointment</DialogTitle>
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
          <div className="bg-gray-100 p-3 rounded-md text-sm mt-2 ">
            {documentPermission === "true"
              ? "📄 I have read the privacy policy of the platform. I shall handle the patients digital documents with care and will not share with any one else."
              : "📄 I understand that the patient will not be able to share any digital medical or lab documents through the platform. I shall collect any necessary documents in offline mode."}
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
        // onClick={handleConfirmCompletion}
        onClick={() => setShowFinalConfirm(true)}
        type="button"
      >
        Confirm Booking
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={showFinalConfirm} onOpenChange={setShowFinalConfirm}>
  <DialogContent className="sm:max-w-sm">
    <DialogHeader>
      <DialogTitle>Would you like to Confirmation</DialogTitle>
      <DialogDescription>
        Yes, I want to confirm this appointment.
      </DialogDescription>
    </DialogHeader>

    <div className="text-sm text-gray-600">
      I understand that this action will mark the appointment as confirmed and I will not be able to make any further changes.
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setShowFinalConfirm(false)}
      >
        No, Cancel
      </Button>

      <Button
        onClick={() => {
          setShowFinalConfirm(false);
          handleConfirmCompletion(); // ✅ FINAL ACTION
        }}
      >
        Yes, Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>
    );
  }

  // ==================== DOCTOR VIEW ====================
  if (viewType === "doctor" && doctor) {
    const isPending = currentAppointment?.status === "pending";
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* <div className="relative flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">← Back</Button>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Appointment Details</h1>
              <div className="flex justify-center mt-1"><Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><User className="h-3 w-3 mr-1" /> Doctor ID: {doctor.user_id}</Badge></div>
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
            {currentAppointment?.status === "pending" && timeLeft !== null && timeLeft > 0 && (
              <div className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"><span className="text-sm font-medium text-gray-700">Time remaining:</span><TimerDisplay seconds={timeLeft} /></div>
            )}
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
          </div> */}
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
                      {currentAppointment.duration_minutes && <div className="flex justify-between border-b pb-2"><span className="font-medium text-gray-600">Duration</span><span className="text-gray-900">{currentAppointment.duration_minutes} minutes</span></div>}
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
                        {userRole === "patient" && paymentCompleted ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span className="font-medium">Consultation Fee Paid</span></div>
                        ) : userRole === "patient" && !paymentCompleted && (
                          <Button size="default" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md" onClick={() => navigate(`/patient/appointment-payment/${appointmentId}`)}>Consultation Fee ₹{doctor.consultation_fee +150 || "0"}</Button>
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
                      <Button onClick={() => { mixpanelInstance.track("Doctor Join Tele Consultation", { appointmentId: currentAppointment.id, timestamp: new Date().toISOString() }); handleJoinVideo(currentAppointment, "patient"); handleJoinMeeting(); }} disabled={joiningMeeting || isJoinButtonDisabled || meetingEnded || currentAppointment?.host_joined !== true} className="w-full">
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
                <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
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
  }

  // ==================== FACILITY VIEW ====================
  if (viewType === "facility" && facility) {
    const isPending = currentAppointment?.status === "pending";
    return (
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        <div className="relative flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0">← Back</Button>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Appointment Details</h1>
            <div className="flex justify-center mt-1"><Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><User className="h-3 w-3 mr-1" /> Facility ID: {facility.id}</Badge></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span className="text-gray-900">{doctorProfile?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Phone</span>
                <span className="text-gray-900">{doctorProfile?.phone_number || "N/A"}</span>
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
          {departmentInfo && (
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
        <span className="text-gray-900">{departmentInfo.name}</span>
      </div>
      {departmentInfo.description && (
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Description</span>
          <span className="text-gray-900 text-right">{departmentInfo.description}</span>
        </div>
      )}
      {departmentInfo.head_doctor_id && (
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Head Doctor ID</span>
          <span className="text-gray-900">{departmentInfo.head_doctor_id}</span>
        </div>
      )}
      <div className="flex justify-between border-b pb-2">
        <span className="font-medium text-gray-600">Bed Capacity</span>
        <span className="text-gray-900">{departmentInfo.bed_capacity ?? "N/A"}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-medium text-gray-600">Available Beds</span>
        <span className="text-gray-900">{departmentInfo.available_beds ?? "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Staff Count</span>
        <span className="text-gray-900">{departmentInfo.staff_count ?? "N/A"}</span>
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
                
              </CardContent>
            </Card>
          )}
        </div>

          <div className="space-y-6">
            {/* {currentAppointment?.document_requested === true && !isPending && ( */}
              <Card className="relative bg-indigo-50/40 border-indigo-100">
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
              </Card>
            {/* )} */}

            {/* {currentAppointment?.document_requested === true && ( */}
              <Card className=" relative border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3">
                  <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5" /> Medical Documents</CardTitle>
                  <CardDescription className="text-emerald-100">Prescriptions, reports & lab results</CardDescription>
                </div>
                <CardContent className="p-6 bg-white dark:bg-slate-800">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>No documents uploaded yet</p></div>
                  ) : (
                    documents.map((doc) => {
                      let bgColor = "bg-white", borderColor = "border-gray-200", roleLabel = doc.uploader_role;
                      if (doc.uploader_role === "patient") { bgColor = "bg-blue-50"; borderColor = "border-blue-200"; roleLabel = "Patient"; }
                      else if (doc.uploader_role === "doctor") { bgColor = "bg-green-50"; borderColor = "border-green-200"; roleLabel = "Doctor"; }
                      else if (doc.uploader_role === "department") { bgColor = "bg-purple-50"; borderColor = "border-purple-200"; roleLabel = "Department"; }
                      return (
                        <div key={doc.id} className={`border rounded-lg p-3 mb-2 ${bgColor} ${borderColor} hover:shadow transition`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3"><div className="bg-primary/10 p-2 rounded"><FileText className="h-4 w-4 text-primary" /></div><div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()} • Uploaded by: <span className="font-medium">{roleLabel}</span></p></div></div>
                            <Button variant="ghost" size="sm" onClick={async () => { const { data } = await supabase.storage.from("patient_files").createSignedUrl(doc.file_path, 60); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)} disabled={deletingDocId === doc.id} className="text-red-500 hover:text-red-700 hover:bg-red-50">{deletingDocId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                          </div>
                          {doc.ai_summary && <div className="mt-2 flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => { setSelectedSummary(doc.ai_summary); setShowSummaryModal(true); }}>View Full Summary</Button></div>}
                        </div>
                      );
                    })
                  )}
                </CardContent>
                {/* {isPending && <PendingOverlay />} */}
              </Card>
            {/* )} */}
          </div>
        </div>

        <AppointmentDocumentsModal open={showDocsModal} onClose={() => setShowDocsModal(false)} appointmentId={selectedAppointmentId || ""} role="patient" />
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <h3 className="text-lg font-semibold">Upload Document for {facility.facility_name}</h3>
                <button onClick={() => { setShowUploadModal(false); setSelectedAppointmentForUpload(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <UploadPrescriptionForm patientId={uploadPatientId!} depertmentId={userId!} appointmentId={appointmentId || null} uploadedBy="department" defaultDocumentType="medical_record" title="Upload Medical Document" onCancel={() => { mixpanelInstance.track("Facility Upload Cancelled", { appointmentId: selectedAppointmentForUpload?.id, userRole }); setShowUploadModal(false); }} />
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
  }

  return null;
};

export default FacilityPatientView;