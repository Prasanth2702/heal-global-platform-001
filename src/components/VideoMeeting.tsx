// // import { useEffect, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // export interface VideoMeetingProps {
// //   apiKey: string;
// //   meetingId: string; // This should be your seminar ID (e.g., "6idk-rpv5-fmu9")
// //   sessionId?: string; // Optional session ID for rejoining
// //   name: string;
// //   micEnabled?: boolean;
// //   webcamEnabled?: boolean;
// //   containerId?: string | null;
// //   isHost?: boolean;
// //   onMeetingLeave?: () => void;
// //   style?: React.CSSProperties;
// //   meetingTitle?: string;
// //   isRejoining?: boolean;
// // }

// // const VideoMeeting = ({
// //   apiKey,
// //   meetingId,
// //   sessionId,
// //   name,
// //   micEnabled = true,
// //   webcamEnabled = true,
// //   containerId = null,
// //   isHost = false,
// //   style,
// //   onMeetingLeave = () => {},
// //   meetingTitle = "Seminar Meeting",
// //   // isRejoining = false,
// //   isRejoining,
// // }: VideoMeetingProps) => {
// //   const navigate = useNavigate();
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const meetingInitialized = useRef(false);
// //   const [containerReady, setContainerReady] = useState(false);
// //   const idRef = useRef(
// //     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
// //   );

// //   useEffect(() => {
// //     if (containerRef.current) {
// //       setContainerReady(true);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (
// //       !apiKey ||
// //       !containerReady ||
// //       meetingInitialized.current ||
// //       !meetingId
// //     ) {
// //       return;
// //     }

// //     const scriptSrc =
// //       "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
// //     let script: HTMLScriptElement | null = null;

// //     const initializeMeeting = () => {
// //       try {
// //         const meeting = new (window as any).VideoSDKMeeting();

// //         const config = {
// //           name,
// //           meetingId: meetingId, // Always use the seminar ID
// //           apiKey,
// //           containerId: idRef.current,
// //           micEnabled: micEnabled,
// //           webcamEnabled: webcamEnabled,
// //           participantCanToggleSelfWebcam: true,
// //           participantCanToggleSelfMic: true,
// //           screenShareEnabled: isHost,
// //           chatEnabled: true,
// //           raiseHandEnabled: true,
// //           joinScreen: {
// //             visible: true,
// //             title: meetingTitle,
// //           },
// //           permissions: {
// //             askToJoin: false,
// //             toggleParticipantMic: isHost,
// //             toggleParticipantWebcam: isHost,
// //             changeLayout: true,
// //             canCreatePoll: true,
// //             endMeeting: isHost,
// //           },
// //           layout: {
// //             type: "SIDEBAR",
// //             priority: "PIN",
// //             gridSize: 3,
// //           },
// //           whiteboardEnabled: false,
// //           recordingEnabled: false,
// //           liveStreamEnabled: false,
// //           brandingEnabled: true,
// //           brandLogoURL:
// //             "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
// //           brandName: "Room#1",
// //           poweredBy: false,
// //           // For rejoining existing session
// //           participantId: isRejoining && sessionId ? sessionId : undefined,
// //         };

// //         const cleanConfig = Object.fromEntries(
// //           Object.entries(config).filter(([_, v]) => v !== undefined)
// //         );

// //         console.log(
// //           `Initializing meeting with ID: ${meetingId}${
// //             isRejoining ? " (rejoining)" : ""
// //           }`
// //         );

// //         if (isRejoining && sessionId) {
// //           console.log(`Rejoining session with ID: ${sessionId}`);
// //           // Use join instead of init for rejoining
// //           meeting.join(cleanConfig);
// //         } else {
// //           console.log(`Starting new session`);
// //           meeting.init(cleanConfig);
// //         }

// //         meetingInitialized.current = true;

// //         setTimeout(() => {
// //           if (!micEnabled) {
// //             meeting?.localParticipant?.disableMic?.();
// //           }
// //           if (!webcamEnabled) {
// //             meeting?.localParticipant?.disableWebcam?.();
// //           }
// //         }, 1000);
// //       } catch (error) {
// //         console.error("Error initializing VideoSDK meeting:", error);
// //       }
// //     };

// //     const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
// //     if (existingScript) {
// //       script = existingScript as HTMLScriptElement;
// //     } else {
// //       script = document.createElement("script");
// //       script.src = scriptSrc;
// //       script.async = true;
// //       document.body.appendChild(script);
// //     }

// //     if ((window as any).VideoSDKMeeting) {
// //       initializeMeeting();
// //       return;
// //     }

// //     const onScriptLoad = () => {
// //       if ((window as any).VideoSDKMeeting) {
// //         initializeMeeting();
// //       }
// //     };

// //     script.addEventListener("load", onScriptLoad);

// //     return () => {
// //       if (script) {
// //         script.removeEventListener("load", onScriptLoad);
// //       }
// //       onMeetingLeave();
// //       meetingInitialized.current = false;
// //     };
// //   }, [
// //     apiKey,
// //     meetingId,
// //     sessionId,
// //     name,
// //     micEnabled,
// //     webcamEnabled,
// //     containerId,
// //     isHost,
// //     onMeetingLeave,
// //     containerReady,
// //     meetingTitle,
// //     isRejoining,
// //   ]);
// //   const handleHostAction = () => {
// //     console.log("Host-only action triggered");
// //     // You can trigger any logic here, e.g., start recording, custom alert, etc.
// //   };
// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
// //       {isHost && (
// //         <button
// //           onClick={handleHostAction}
// //           style={{
// //             position: "absolute",
// //             top: 10,
// //             right: 10,
// //             zIndex: 1000,
// //             padding: "8px 12px",
// //             backgroundColor: "#007bff",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           Host Action
// //         </button>
// //       )}
// //       <div
// //         ref={containerRef}
// //         id={idRef.current}
// //         style={{
// //           flex: 1,
// //           minHeight: 0,
// //           backgroundColor: "#f0f0f0",
// //           position: "relative",
// //           ...style,
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default VideoMeeting;

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "@/hooks/use-toast";
// import Loader2 from "./ui/Loader2";
// import UploadPrescriptionForm from "./doctor/UploadPrescriptionForm";
// import rollbar from "@/lib/rollbar";

// export interface VideoMeetingProps {
//   apiKey: string;
//   meetingId: string;
//   sessionId?: string;
//   name: string;
//   micEnabled?: boolean;
//   webcamEnabled?: boolean;
//   containerId?: string | null;
//   isHost?: boolean;
//   onMeetingLeave?: () => void;
//   style?: React.CSSProperties;
//   meetingTitle?: string;
//   isRejoining?: boolean;
//   enableDocumentSharing?: boolean;
//   appointmentId?: string;
//   userId?: string;
//   userRole?: "doctor" | "patient";
// }

// interface DocumentFile {
//   id: string;
//   name: string;
//   url: string;
//   type: string;
//   size: number;
//   file_path: string;
//   uploaded_by: string;
//   owner_id: string;
//   created_at: string;
//   ai_summary?: string | null;
// }

// interface PatientFullDetails {
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
//   profile?: {
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone_number: string;
//     avatar_url?: string;
//   };
// }

// interface DoctorFullDetails {
//   id: string;
//   user_id: string;
//   medical_speciality: string;
//   license_number: string;
//   years_experience: number;
//   consultation_fee: number;
//   rating: number;
//   total_reviews: number;
//   about_yourself?: string;
//   is_verified: boolean;
//   address?: string;
//   city?: string;
//   state?: string;
//   facility_id?: string;
//   profile?: {
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone_number: string;
//     avatar_url?: string;
//   };
// }

// interface FacilityDetails {
//   id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   address: string;
//   rating: number;
//   total_reviews: number;
//   about_facility?: string;
//   total_beds?: number;
//   number_of_staffs?: number;
//   is_verified: boolean;
// }

// const VideoMeeting = ({
//   apiKey,
//   meetingId,
//   sessionId,
//   name,
//   micEnabled = true,
//   webcamEnabled = true,
//   containerId = null,
//   isHost = false,
//   style,
//   onMeetingLeave = () => {},
//   meetingTitle = "Seminar Meeting",
//   isRejoining,
//   enableDocumentSharing = true,
//   appointmentId,
//   userId,
//   userRole = "patient",
// }: VideoMeetingProps) => {
//   const navigate = useNavigate();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const meetingInitialized = useRef(false);
//   const [containerReady, setContainerReady] = useState(false);
//   const [documents, setDocuments] = useState<DocumentFile[]>([]);
//   const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
//   const [isSharingScreen, setIsSharingScreen] = useState(false);
//   const [meetingInstance, setMeetingInstance] = useState<any>(null);
//   const [uploading, setUploading] = useState(false);
//   const [appointmentContext, setAppointmentContext] = useState<{ patient_id: string; doctor_id: string } | null>(null);
// const [contextLoaded, setContextLoaded] = useState(false);
//   // New state for document click background highlight
//   const [selectedDocIdForHighlight, setSelectedDocIdForHighlight] = useState<string | null>(null);
  
//   // Modal states
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showDocumentViewerModal, setShowDocumentViewerModal] = useState(false);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
  
//   // Details state
//   const [patientDetails, setPatientDetails] = useState<PatientFullDetails | null>(null);
//   const [doctorDetails, setDoctorDetails] = useState<DoctorFullDetails | null>(null);
//   const [facilityDetails, setFacilityDetails] = useState<FacilityDetails | null>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [activeDetailTab, setActiveDetailTab] = useState<"clinical" | "documents">("clinical");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   // AI Summary state
//   const [selectedSummary, setSelectedSummary] = useState<string>("");
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   useEffect(() => {
//   if (userId) {
//     rollbar.configure({
//       payload: {
//         person: {
//           id: userId,
//         },
//       },
//     });
//   }
// }, [userId, userRole]);
//   // Zoom state for document viewer
//   const [zoomLevel, setZoomLevel] = useState(1);
  
//   const idRef = useRef(
//     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
//   );

//   // Clean summary text
//   const cleanSummary = (text: string) => {
//     if (!text) return "";
//     return text
//       .replace(/[=*]/g, "")
//       .replace(/[▬►▪•]/g, "")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim();
//   };

//   // Fetch documents
//   useEffect(() => {
//     if (appointmentId && enableDocumentSharing) {
//       fetchDocuments();
//     }
//   }, [appointmentId]);

//   // Automatically show appropriate details when meeting starts
//   useEffect(() => {
//     if (appointmentId && !loadingDetails) {
//       const loadInitialDetails = async () => {
//         const context = await getAppointmentContext();
//         if (userRole === "doctor" && context?.patient_id) {
//           await fetchEnhancedPatientDetails(context.patient_id);
//           setShowDetailsModal(false);
//         } else if (userRole === "patient" && context?.doctor_id) {
//           await fetchEnhancedDoctorDetails(context.doctor_id);
//           setShowDetailsModal(false);
//         }
//       };
//       loadInitialDetails();
//     }
//   }, [appointmentId, userRole]);

//   useEffect(() => {
//   const loadAppointmentContext = async () => {
//     if (!appointmentId) return;
//     try {
//       const { data, error } = await supabase
//         .from("appointments")
//         .select("patient_id, doctor_id")
//         .eq("id", appointmentId)
//         .single();
//       if (error) throw error;
//       setAppointmentContext(data);
//     } catch (error) {
//       console.error("Error loading appointment context:", error);
//     } finally {
//       setContextLoaded(true);
//     }
//   };
//   loadAppointmentContext();
// }, [appointmentId]);

//   const fetchDocuments = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       let query = supabase
//         .from("documents")
//         .select("*")
//         .eq("appointment_id", appointmentId)
//         .order("created_at", { ascending: false });

//       if (userRole === "patient") {
//         query = query.eq("owner_id", user.id);
//       } else if (userRole === "doctor") {
//         const context = await getAppointmentContext();
//         if (context?.patient_id) {
//           query = query.eq("owner_id", context.patient_id);
//         }
//       }

//       const { data, error } = await query;
//       if (error) throw error;
//       if (data) {
//         const docs = data.map((doc) => ({
//           id: doc.id,
//           name: doc.name,
//           url: "",
//           type: doc.mime_type || "application/pdf",
//           size: 0,
//           file_path: doc.file_path,
//           uploaded_by: doc.uploaded_by,
//           owner_id: doc.owner_id,
//           created_at: doc.created_at,
//           ai_summary: doc.ai_summary,
//         }));
//         setDocuments(docs);
//       }
//     } catch (error) {
//       console.error("Error fetching documents:", error);

//        rollbar.error("Fetch documents failed", {
//     appointmentId,
//     userRole,
//     error: error?.message,
//   });
//     }
//   };

//   const fetchEnhancedPatientDetails = async (patientUserId: string) => {
//     try {
//       setLoadingDetails(true);
//       const { data: patientData, error: patientError } = await supabase
//         .from("patients")
//         .select("*")
//         .eq("user_id", patientUserId)
//         .single();
//       if (patientError) throw patientError;

//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("first_name, last_name, email, phone_number, avatar_url")
//         .eq("user_id", patientUserId)
//         .single();

//       setPatientDetails({
//         ...patientData,
//         profile: profileData,
//       });
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
      
//       rollbar.error("Fetch patient details failed", {
//     patientUserId,
//     error: error?.message,
//   });
      
//       toast({ title: "Error", description: "Could not load patient details", variant: "destructive" });
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const fetchEnhancedDoctorDetails = async (doctorUserId: string) => {
//     try {
//       setLoadingDetails(true);
//       const { data: doctorData, error: doctorError } = await supabase
//         .from("medical_professionals")
//         .select("*")
//         .eq("user_id", doctorUserId)
//         .single();
//       if (doctorError) throw doctorError;

//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("first_name, last_name, email, phone_number, avatar_url")
//         .eq("user_id", doctorUserId)
//         .single();

//       setDoctorDetails({ ...doctorData, profile: profileData });

//       if (doctorData.facility_id) {
//         const { data: facilityData } = await supabase
//           .from("facilities")
//           .select("*")
//           .eq("id", doctorData.facility_id)
//           .single();
//         if (facilityData) setFacilityDetails(facilityData);
//       }
//     } catch (error) {
//       console.error("Error fetching doctor details:", error);
//       toast({ title: "Error", description: "Could not load doctor details", variant: "destructive" });
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const fetchFacilityDetails = async (facilityId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("facilities")
//         .select("*")
//         .eq("id", facilityId)
//         .single();
//       if (error) throw error;
//       setFacilityDetails(data);
//     } catch (error) {
//       console.error("Error fetching facility details:", error);
//     }
//   };

//   const getAppointmentContext = async () => {
//     if (!appointmentId) return null;
//     const { data, error } = await supabase
//       .from("appointments")
//       .select("patient_id, doctor_id, facility_id")
//       .eq("id", appointmentId)
//       .single();
//     if (error) return null;
//     return data;
//   };

//   // Fetch AI Summary for a document - uses ai_summary column directly
//   const fetchAISummary = async (documentId: string, fileName: string) => {
//     try {
//       setSummaryLoading(true);
//       // First check if summary already exists in documents table
//       const { data: doc, error: fetchError } = await supabase
//         .from("documents")
//         .select("ai_summary,tags")
//         .eq("id", documentId)
//         .single();
      
//       if (!fetchError && doc?.ai_summary) {
//         return doc.ai_summary;
//       }
//       if (!fetchError && doc?.tags) {
//         return doc.tags;
//       }
      
      
     
//     } catch (error: any) {
//       console.error("Error fetching AI summary:", error);
//       rollbar.warning("AI summary failed", {
//     documentId,
//     fileName,
//     error: error?.message,
//   });
//       toast({ title: "Summary Error", description: error.message || "Could not generate summary", variant: "destructive" });
//       return null;
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   const handleAISummary = async (document: DocumentFile) => {
//     setSelectedDocument(document);
//     setSummaryLoading(true);
//     setShowSummaryModal(true);
//     setSummaryLoading(true);

//     const summary = await fetchAISummary(document.id, document.name);
//     if (summary) {
//       setSelectedSummary(summary);
//     } else {
//       setSelectedSummary("Unable to generate summary for this document.");
//     }
//     setSummaryLoading(false);
//   };

//   const handleViewDocument = async (document: DocumentFile) => {
//     try {
//       setSelectedDocument(document);
//       setZoomLevel(1);
//       setLoadingDetails(true);
//        setShowSummaryModal(false);
//        setSelectedSummary("");

//       const context = await getAppointmentContext();
//       if (userRole === "doctor" && context?.patient_id) {
//         await fetchEnhancedPatientDetails(context.patient_id);
//       } else if (userRole === "patient" && context?.doctor_id) {
//         await fetchEnhancedDoctorDetails(context.doctor_id);
//       }
//       if (context?.facility_id) {
//         await fetchFacilityDetails(context.facility_id);
//       }

//       const { data: signedUrlData, error: signedUrlError } = await supabase.storage
//         .from("patient_files")
//         .createSignedUrl(document.file_path, 3600);
      
//       if (signedUrlError || !signedUrlData?.signedUrl) {
//         toast({ title: "Error", description: "Unable to access document", variant: "destructive" });
//         return;
//       }
      
//       setSelectedDocument({ ...document, url: signedUrlData.signedUrl });
//       setShowDocumentViewerModal(true);
//       setShowSummaryModal(false);
//     } catch (error) {
//       console.error("Error viewing document:", error);
//       rollbar.error("Document view failed", {
//     documentId: document.id,
//     filePath: document.file_path,
//     error: error?.message,
//   });
//       toast({ title: "Error", description: "Failed to load document", variant: "destructive" });
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const handleEndMeeting = () => {
//     if (meetingInstance) {
//       meetingInstance.leave();
//     }
//     onMeetingLeave();
//     navigate("/");
//   };

//   // Zoom controls
//   const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
//   const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
//   const resetZoom = () => setZoomLevel(1);

//   const renderDocumentPreview = () => {
//     if (!selectedDocument) return null;
//     const isPDF = selectedDocument.type?.includes("pdf") || selectedDocument.name?.toLowerCase().endsWith(".pdf");
//     const isImage = selectedDocument.type?.includes("image") || 
//       selectedDocument.name?.toLowerCase().endsWith(".png") ||
//       selectedDocument.name?.toLowerCase().endsWith(".jpg") ||
//       selectedDocument.name?.toLowerCase().endsWith(".jpeg");

//     const previewStyle = {
//       transform: `scale(${zoomLevel})`,
//       transition: "transform 0.2s ease",
//       transformOrigin: "center center",
//     };

//     if (isPDF) {
//       return (
//         <iframe
//           src={`${selectedDocument.url}#toolbar=0`}
//           title={selectedDocument.name}
//           style={{ width: "100%", height: "100%", border: "none", ...previewStyle }}
//         />
//       );
//     }
//     if (isImage) {
//       return (
//         <img
//           src={selectedDocument.url}
//           alt={selectedDocument.name}
//           style={{ width: "100%", height: "100%", objectFit: "contain", ...previewStyle }}
//         />
//       );
//     }
//     return (
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <p>📄 {selectedDocument.name}</p>
//         <p style={{ fontSize: "12px", color: "#666" }}>Preview only available for PDF & Images</p>
//       </div>
//     );
//   };

//   // Common document item component with two buttons + click background highlight
//   // Inside VideoMeeting component, replace the existing DocumentItem with this:

// const DocumentItem = ({ doc }: { doc: DocumentFile }) => {
//   const [isViewLoading, setIsViewLoading] = useState(false);
//   const [isViewsummaryLoading, setIsViewsummaryLoading] = useState(false);
//   const isHighlighted = selectedDocIdForHighlight === doc.id;

//   const handleViewClick = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsViewLoading(true);
//     try {
//       await handleViewDocument(doc);
//       setSelectedDocIdForHighlight(doc.id)

//     } finally {
//       setIsViewLoading(false);
//     }
//   };
//   const handleViewsummaryClick = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsViewsummaryLoading(true);
//     try {
//       await handleAISummary(doc);
//       setSelectedDocIdForHighlight(doc.id)

//     } finally {
//       setIsViewsummaryLoading(false);
//     }
//   };

//   return (
//     <div
//       onClick={() => setSelectedDocIdForHighlight(doc.id)}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: "10px",
//         padding: "10px",
//         marginBottom: "8px",
//         borderRadius: "8px",
//         backgroundColor: isHighlighted ? "#e0f2fe" : "#f8f9fa",
//         border: "1px solid #e9ecef",
//         cursor: "pointer",
//         transition: "background-color 0.2s ease",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
//         <div style={{ fontSize: "24px" }}>{doc.type?.includes('pdf') ? '📄' : '🖼️'}</div>
//         <div
//           style={{
//             fontWeight: "500",
//             wordBreak: "break-word",
//             // 👇 Condition: when loading, blue background + white text
//             backgroundColor: isViewLoading ? "#007bff" : "transparent",
//             color: isViewLoading ? "white" : "inherit",
//             padding: isViewLoading ? "2px 6px" : "0",
//             borderRadius: "4px",
//             transition: "all 0.2s ease",
//           }}
//         >
//           {doc.name}
//         </div>
//       </div>
//       <div style={{ display: "flex", gap: "8px" }}>
//         <button
//           onClick={handleViewClick}
//           disabled={isViewLoading}
//           style={{
//             padding: "4px 12px",
//             backgroundColor: isViewLoading ? "#6c757d" : "#3498db",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: isViewLoading ? "not-allowed" : "pointer",
//             fontSize: "12px",
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//           }}
//         >
//           {isViewLoading ? (
//             <>⏳ Loading...</> // or use a small spinner icon
//           ) : (
//             <>👁️ View</>
//           )}
//         </button>
//         {userRole === "doctor" && doc.ai_summary && (
//           <button
//                       onClick={handleViewsummaryClick}
//                       disabled={isViewsummaryLoading}
//             style={{
//               padding: "4px 12px",
//               backgroundColor: "#9b59b6",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "12px",
//             }}
//           >
//            {isViewsummaryLoading ? (
//             <>⏳ Loading Summary...</> // or use a small spinner icon
//           ) : ( 
//             <> 🤖 AI Summary</>
//           )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

//   // Reusable details content with clinical + documents tabs
//   const renderDetailsContent = (type: "patient" | "doctor") => {
//     if (type === "patient" && !patientDetails) return null;
//     if (type === "doctor" && !doctorDetails) return null;

//     const p = patientDetails;
//     const d = doctorDetails;
//     const getAge = (dob: string) => {
//       if (!dob) return "N/A";
//       const birth = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birth.getFullYear();
//       const m = today.getMonth() - birth.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//       return `${age} years`;
//     };

//     return (
//       <div>
//         <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
//           <button
//             style={{
//               padding: "4px 12px",
//               borderRadius: "20px",
//               backgroundColor: activeDetailTab === "clinical" ? "#e2e8f0" : "transparent",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={() => setActiveDetailTab("clinical")}
//           >
//             {userRole === "doctor" ? "Patient Information" : "Doctor Information"}
//           </button>
//           <button
//             style={{
//               padding: "4px 12px",
//               borderRadius: "20px",
//               backgroundColor: activeDetailTab === "documents" ? "#e2e8f0" : "transparent",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={() => setActiveDetailTab("documents")}
//           >
            
//              {userRole === "doctor" ? "Patient Documents" : "Doctor Documents"}
//           </button>
//         </div>
//         {activeDetailTab === "clinical" && (
//           <>
//             {type === "patient" && p && (
//               <>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                   <div><strong>Name:</strong> {p.profile?.first_name} {p.profile?.last_name}</div>
//                   <div><strong>DOB:</strong> {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(p.date_of_birth)})</div>
//                   <div><strong>Gender:</strong> {p.gender || "N/A"}</div>
//                   <div><strong>Blood Group:</strong> {p.blood_group || "N/A"}</div>
//                   <div><strong>Height/Weight:</strong> {p.height || "?"} cm / {p.weight || "?"} kg</div>
//                   <div><strong>Allergies:</strong> {p.known_allergies || "None"}</div>
//                   <div><strong>Medical History:</strong> <div style={{ whiteSpace: "pre-wrap" }}>{p.medical_history || "None"}</div></div>
//                   <div><strong>Current Medications:</strong> {p.current_medications || "None"}</div>
//                 </div>
//                 <br />
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                   <div><strong>Email:</strong> {p.profile?.email || "N/A"}</div>
//                   <div><strong>Phone:</strong> {p.profile?.phone_number || "N/A"}</div>
//                   <div><strong>Emergency Contact:</strong> {p.emergency_contact_name || "N/A"}</div>
//                   <div><strong>Emergency Phone:</strong> {p.emergency_contact_number || "N/A"}</div>
//                   <div><strong>Relationship:</strong> {p.emergency_contact_relationship || "N/A"}</div>
//                 </div>
//               </>
//             )}
//             {type === "doctor" && d && (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                 <div><strong>Name:</strong> Dr. {d.profile?.first_name} {d.profile?.last_name}</div>
//                 <div><strong>Specialty:</strong> {d.medical_speciality}</div>
//                 <div><strong>License:</strong> {d.license_number}</div>
//                 <div><strong>Experience:</strong> {d.years_experience} years</div>
//                 <div><strong>Consultation Fee:</strong> ₹{d.consultation_fee}</div>
//                 <div><strong>Rating:</strong> {d.rating} ⭐ ({d.total_reviews} reviews)</div>
//                 <div><strong>Email:</strong> {d.profile?.email}</div>
//                 <div><strong>Phone:</strong> {d.profile?.phone_number}</div>
//                 {d.address && <div><strong>Address:</strong> {d.address}, {d.city}, {d.state}</div>}
//                 {d.about_yourself && <div><strong>About:</strong> {d.about_yourself}</div>}
//               </div>
//             )}
//           </>
//         )}
//         {activeDetailTab === "documents" && (
//           <>
//           {userRole === "doctor" && type === "patient" && (
//   <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//     <button
//       onClick={() => setShowUploadModal(true)}
//       style={{
//         display: "inline-block",
//         padding: "8px 16px",
//         backgroundColor: "#27ae60",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         cursor: "pointer",
//       }}
//     >
//       {uploading ? "Uploading..." : "📤 Upload Document"}
//     </button>
//   </div>
// )}
//           {userRole === "patient" && type === "doctor" && (
//   <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//     <button
//       onClick={() => setShowUploadModal(true)}
//       style={{
//         display: "inline-block",
//         padding: "8px 16px",
//         backgroundColor: "#27ae60",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         cursor: "pointer",
//       }}
//     >
//       {uploading ? "Uploading..." : "📤 Upload Document"}
//     </button>
//   </div>
// )}

//             {/* {userRole === "doctor" && type === "patient" && (
//               <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//                 <label style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#27ae60", color: "white", borderRadius: "4px", cursor: "pointer" }}>
//                   {uploading ? "Uploading..." : "📤 Upload Document"}
//                   <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} style={{ display: "none" }} disabled={uploading} />
//                 </label>
//               </div>
//             )} */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
//               {documents.length === 0 ? (
//                 <p>No documents uploaded yet.</p>
//               ) : (
//                 documents.map(doc => <DocumentItem key={doc.id} doc={doc} />)
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };


//   useEffect(() => {
//     if (containerRef.current) setContainerReady(true);
//   }, []);

//   useEffect(() => {
//     if (!apiKey || !containerReady || meetingInitialized.current || !meetingId) return;

//     const scriptSrc = "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
//     let script: HTMLScriptElement | null = null;
//     if (!contextLoaded) return;
//       if (!apiKey || !containerReady || meetingInitialized.current || !meetingId) return;

//     const initializeMeeting = () => {
//       try {
//         const meeting = new (window as any).VideoSDKMeeting();
//         setMeetingInstance(meeting);

//         let backHref = "https://www.pmhssmarthealth.com/"; // fallback
// if (appointmentContext) {
//   if (userRole === "patient" && appointmentContext.doctor_id) {
//     backHref = `https://www.pmhssmarthealth.com/patient/appointment-doctor/${userId}/${appointmentContext.doctor_id}/${appointmentId}`;
//   } else if (userRole === "doctor" && appointmentContext.patient_id) {
//     backHref = `https://www.pmhssmarthealth.com/doctor/appointment-patient/${userId}/${appointmentContext.patient_id}/${appointmentId}`;
//   }
// }
//         const config = {
//           name,
//           meetingId,
//           apiKey,
//           containerId: idRef.current,
//           micEnabled,
//           webcamEnabled,
//           participantCanToggleSelfWebcam: true,
//           participantCanToggleSelfMic: true,
//           screenShareEnabled: isHost,
//           chatEnabled: true,
//           raiseHandEnabled: true,
//           joinScreen: { visible: true, title: meetingTitle },
//           permissions: {
//             askToJoin: false,
//             toggleParticipantMic: isHost,
//             toggleParticipantWebcam: isHost,
//             changeLayout: true,
//             canCreatePoll: true,
//             endMeeting: isHost,
//           },
//           layout: { type: "SIDEBAR", priority: "PIN", gridSize: 3 },
//           whiteboardEnabled: false,
//           recordingEnabled: false,
//           liveStreamEnabled: false,
//           brandingEnabled: true,
//           brandLogoURL: "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
//           brandName: "Room#1",
//           poweredBy: false,
//           participantId: isRejoining && sessionId ? sessionId : undefined,
//           leftScreen: {
//         // visible when redirect on leave not provieded
//         actionButton: {
//           // optional action button
//           label: "Back", // action button label
//           href: backHref, // action button href
//           // href: "navigate(-1);", // action button href
//         },
//       },
//         };

//         const cleanConfig = Object.fromEntries(Object.entries(config).filter(([_, v]) => v !== undefined));
//         if (isRejoining && sessionId) meeting.join(cleanConfig);
//         else meeting.init(cleanConfig);

//         meetingInitialized.current = true;

//         meeting.on("meeting-joined", () => {
//           console.log("Meeting joined successfully");
//         });

//         meeting.on("chat-message", (message: any) => {
//           if (message.data && typeof message.data === 'string') {
//             try {
//               const parsedData = JSON.parse(message.data);
//               if (parsedData.type === "DOCUMENT_UPLOADED") {
//                 fetchDocuments();
//                 toast({ title: "New Document", description: `${parsedData.sender} uploaded a new document` });
//               }
//             } catch (e) {}
//           }
//         });

//         setTimeout(() => {
//           if (!micEnabled) meeting?.localParticipant?.disableMic?.();
//           if (!webcamEnabled) meeting?.localParticipant?.disableWebcam?.();
//         }, 1000);
//       } catch (error) {
//         console.error("Error initializing VideoSDK meeting:", error);
//        rollbar.critical("Meeting initialization failed", {
//     meetingId,
//     userId,
//     isHost,
//     error: error?.message,
//   });
//       }
//     };

//     const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
//     if (existingScript) script = existingScript as HTMLScriptElement;
//     else {
//       script = document.createElement("script");
//       script.src = scriptSrc;
//       script.async = true;
//       document.body.appendChild(script);
//     }

//     if ((window as any).VideoSDKMeeting) initializeMeeting();
//     else script.addEventListener("load", initializeMeeting);

//     return () => {
//       if (script) script.removeEventListener("load", initializeMeeting);
//       onMeetingLeave();
//       meetingInitialized.current = false;
//     };
//   }, [apiKey, meetingId, sessionId, name, micEnabled, webcamEnabled, containerId, isHost, onMeetingLeave, containerReady, meetingTitle, isRejoining, contextLoaded]);
// const handleRefreshData = async () => {
//   try {
//     setLoadingDetails(true);

//     // Refresh documents
//     await fetchDocuments();

//     // Refresh appointment context
//     const context = await getAppointmentContext();

//     // Refresh details based on role
//     if (userRole === "doctor" && context?.patient_id) {
//       await fetchEnhancedPatientDetails(context.patient_id);
//     }

//     if (userRole === "patient" && context?.doctor_id) {
//       await fetchEnhancedDoctorDetails(context.doctor_id);
//     }

//     // Refresh facility
//     if (context?.facility_id) {
//       await fetchFacilityDetails(context.facility_id);
//     }

//     toast({
//       title: "Refreshed",
//       description: "Data updated successfully",
//     });

//   } catch (error) {
//     console.error(error);

//     rollbar.error("Refresh data failed", {
//     appointmentId,
//     userRole,
//     error: error?.message,
//   });

//     toast({
//       title: "Error",
//       description: "Failed to refresh data",
//       variant: "destructive",
//     });
//   } finally {
//     setLoadingDetails(false);
//   }
// };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
//       {/* Top Bar with buttons */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#2c3e50", color: "white", zIndex: 100 }}>
//         <div style={{ display: "flex", gap: "10px" }}>
//           {userRole === "doctor" && (
//             <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//               👤 Patient Information
//             </button>
//           )}
//           {userRole === "patient" && (
//             <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//               👤 Doctor Information
//             </button>
//           )}

         
//         </div>
//       </div>

//       {/* Video Container */}
//       <div ref={containerRef} id={idRef.current} style={{ flex: 1, minHeight: 0, backgroundColor: "#f0f0f0", position: "relative", ...style }} />

//       {/* Details Modal (Patient or Doctor) */}
//       {showDetailsModal && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", overflow: "auto", padding: "20px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
//               <h3>{userRole === "doctor" ? "Patient Information" : "Doctor Information"}</h3>
//                <button
//     onClick={handleRefreshData}
//     style={{
//       padding: "4px 10px",
//       backgroundColor: "#16a34a",
//       color: "white",
//       border: "none",
//       borderRadius: "4px",
//       cursor: "pointer",
//     }}
//   >
//     🔄 Refresh
//   </button>
//               <button onClick={() => setShowDetailsModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
//             </div>
//             {loadingDetails ? <Loader2 /> : renderDetailsContent(userRole === "doctor" ? "patient" : "doctor")}
//             {facilityDetails && (
//               <>
//                 <h4 style={{ marginTop: "20px" }}>Facility Information</h4>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                   <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
//                   <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
//                   <div><strong>License:</strong> {facilityDetails.license_number}</div>
//                   <div><strong>Address:</strong> {facilityDetails.address}</div>
//                   <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
//                   {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
//                   {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
//                   {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

      

//      {showUploadModal && (
//   <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
//     <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//         <h3>Upload Documents</h3>
//         <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
//       </div>
//       <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
//         {userRole === "patient" ? (
//           <UploadPrescriptionForm
//             patientId={userId!}
//             appointmentId={appointmentId!}
//             uploadedBy="patient"
//             defaultDocumentType="medical_record"
//             title="Upload Medical Document"
//             onCancel={() => setShowUploadModal(false)}
//           />
//         ) : (
//           <UploadPrescriptionForm
//             patientId={patientDetails?.user_id || ""}
//             doctorId={userId!}
//             appointmentId={appointmentId!}
//             uploadedBy="doctor"
//             defaultDocumentType="medical_record"
//             onCancel={() => setShowUploadModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   </div>
// )}
      

//       {/* Document Viewer Modal with split view + zoom controls */}
//       {showDocumentViewerModal && selectedDocument && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(197, 197, 197, 0.7)176, 0.7)234, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//               <h3>{selectedDocument.name}</h3>
//               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                  <button
//     onClick={handleRefreshData}
//     style={{
//       padding: "4px 10px",
//       backgroundColor: "#16a34a",
//       color: "white",
//       border: "none",
//       borderRadius: "4px",
//       cursor: "pointer",
//     }}
//   >
//     🔄 Refresh
//   </button>
//                 <button onClick={zoomOut} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom Out</button>
//                 <span style={{ minWidth: "60px", textAlign: "center" }}>{Math.round(zoomLevel * 100)}%</span>
//                 <button onClick={zoomIn} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom In</button>
//                 <button onClick={resetZoom} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reset</button>
//                 <button onClick={() => { setShowDocumentViewerModal(false); setShowDetailsModal(false)}} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
//               </div>
//             </div>
//             <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
//               {/* Left panel: Details */}
//               <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
              
//                     {userRole === "doctor" && patientDetails && renderDetailsContent("patient")}
//                     {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
//                     {facilityDetails && (
//                       <>
//                         <h4>Facility Information</h4>
//                         <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                           <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
//                           <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
//                           <div><strong>License:</strong> {facilityDetails.license_number}</div>
//                           <div><strong>Address:</strong> {facilityDetails.address}</div>
//                           <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
//                           {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
//                           {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
//                           {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
//                         </div>
//                       </>
//                     )}
                
//               </div>
//               {/* Right panel: Document preview with zoom */}
//                 {loadingDetails ? <Loader2 /> : (
//                   <>
//               <div style={{ width: "60%", overflow: "auto", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {renderDocumentPreview()}
//               </div>
//                 </>
//                 )}
//             </div>
//           </div>
//         </div>
//       )} 
//       {showSummaryModal && selectedDocument &&(
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(197, 197, 197, 0.7)176, 0.7)234, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//               <h3>AI Summary: {selectedDocument?.name}</h3>
//               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                  <button
//     onClick={handleRefreshData}
//     style={{
//       padding: "4px 10px",
//       backgroundColor: "#16a34a",
//       color: "white",
//       border: "none",
//       borderRadius: "4px",
//       cursor: "pointer",
//     }}
//   >
//     🔄 Refresh
//   </button>
//                 <button onClick={() => { setShowSummaryModal(false); setShowDocumentViewerModal(false); setShowDetailsModal(false)}} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
//               </div>
//             </div>
//             <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
//               {/* Left panel: Details */}
//               <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
//                 {loadingDetails ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
//                   <Loader2 />
//                   <span style={{ marginLeft: "10px" }}>Generating AI summary...</span>
//                 </div>) : (
//                   <>
//                     {userRole === "doctor" && patientDetails && renderDetailsContent("patient")}
//                     {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
//                     {facilityDetails && (
//                       <>
//                         <h4>Facility Information</h4>
//                         <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
//                           <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
//                           <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
//                           <div><strong>License:</strong> {facilityDetails.license_number}</div>
//                           <div><strong>Address:</strong> {facilityDetails.address}</div>
//                           <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
//                           {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
//                           {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
//                           {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}
//               </div>
//               {/* Right panel: Document preview with zoom */}
//               <div style={{ width: "60%", overflow: "auto", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
           
//               {summaryLoading ? (
//                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
//                   <Loader2 />
//                   <span style={{ marginLeft: "10px" }}>Generating AI summary...</span>
//                 </div>
//               ) : (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto" style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
//                   {cleanSummary(selectedSummary)}
//                 </div>
//               )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoMeeting;


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Loader2 from "./ui/Loader2";
import UploadPrescriptionForm from "./doctor/UploadPrescriptionForm";
import rollbar from "@/lib/rollbar";

export interface VideoMeetingProps {
  apiKey: string;
  meetingId: string;
  sessionId?: string;
  name: string;
  micEnabled?: boolean;
  webcamEnabled?: boolean;
  containerId?: string | null;
  isHost?: boolean;
  onMeetingLeave?: () => void;
  style?: React.CSSProperties;
  meetingTitle?: string;
  isRejoining?: boolean;
  enableDocumentSharing?: boolean;
  appointmentId?: string;
  userId?: string;
  userRole?: "doctor" | "patient" | "facility" | "hospital_staff" | "hospital_admin";
}

interface DocumentFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  file_path: string;
  uploaded_by: string;
  owner_id: string;
  created_at: string;
  ai_summary?: string | null;
}

interface PatientFullDetails {
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
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar_url?: string;
  };
}

interface DoctorFullDetails {
  id: string;
  user_id: string;
  medical_speciality: string;
  license_number: string;
  years_experience: number;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  about_yourself?: string;
  is_verified: boolean;
  address?: string;
  city?: string;
  state?: string;
  facility_id?: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar_url?: string;
    prefix?: string;
  };
}

interface FacilityDetails {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: string;
  rating: number;
  total_reviews: number;
  about_facility?: string;
  total_beds?: number;
  number_of_staffs?: number;
  is_verified: boolean;
}

const VideoMeeting = ({
  apiKey,
  meetingId,
  sessionId,
  name,
  micEnabled = true,
  webcamEnabled = true,
  containerId = null,
  isHost = false,
  style,
  onMeetingLeave = () => {},
  meetingTitle = "Seminar Meeting",
  isRejoining,
  enableDocumentSharing = true,
  appointmentId,
  userId,
  userRole = "patient",
}: VideoMeetingProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const meetingInitialized = useRef(false);
  const [containerReady, setContainerReady] = useState(false);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [meetingInstance, setMeetingInstance] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [appointmentContext, setAppointmentContext] = useState<{ patient_id: string; doctor_id: string; facility_id: string } | null>(null);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [selectedDocIdForHighlight, setSelectedDocIdForHighlight] = useState<string | null>(null);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentViewerModal, setShowDocumentViewerModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  // Details state
  const [patientDetails, setPatientDetails] = useState<PatientFullDetails | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorFullDetails | null>(null);
  const [facilityDetails, setFacilityDetails] = useState<FacilityDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<"clinical" | "documents">("clinical");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  useEffect(() => {
    if (userId) {
      rollbar.configure({
        payload: {
          person: {
            id: userId,
          },
        },
      });
    }
  }, [userId, userRole]);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const idRef = useRef(
    containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
  );

  const cleanSummary = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[=*]/g, "")
      .replace(/[▬►▪•]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  // Fetch documents
  useEffect(() => {
    if (appointmentId && enableDocumentSharing) {
      fetchDocuments();
    }
  }, [appointmentId]);

  // Automatically show appropriate details when meeting starts
  useEffect(() => {
    if (appointmentId && !loadingDetails) {
      const loadInitialDetails = async () => {
        const context = await getAppointmentContext();
        if ((userRole === "doctor" || userRole === "hospital_staff" || userRole === "hospital_admin") && context?.patient_id) {
          await fetchEnhancedPatientDetails(context.patient_id);
          setShowDetailsModal(false);
        } else if (userRole === "patient" && context?.doctor_id) {
          await fetchEnhancedDoctorDetails(context.doctor_id);
          setShowDetailsModal(false);
        } else if ((userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && context?.facility_id) {
          await fetchFacilityDetails(context.facility_id);
          setShowDetailsModal(false);
        }
      };
      loadInitialDetails();
    }
  }, [appointmentId, userRole]);

  useEffect(() => {
    const loadAppointmentContext = async () => {
      if (!appointmentId) return;
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("patient_id, doctor_id, facility_id")
          .eq("id", appointmentId)
          .single();
        if (error) throw error;
        setAppointmentContext(data);
      } catch (error) {
        console.error("Error loading appointment context:", error);
      } finally {
        setContextLoaded(true);
      }
    };
    loadAppointmentContext();
  }, [appointmentId]);

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("documents")
        .select("*")
        .eq("appointment_id", appointmentId)
        .order("created_at", { ascending: false });

      if (userRole === "patient") {
        query = query.eq("owner_id", user.id);
      } else if (userRole === "doctor") {
        const context = await getAppointmentContext();
        if (context?.patient_id) {
          query = query.eq("owner_id", context.patient_id);
        }
      } else if (userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") {
        const context = await getAppointmentContext();
        if (context?.patient_id) {
          query = query.eq("owner_id", context.patient_id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        const docs = data.map((doc) => ({
          id: doc.id,
          name: doc.name,
          url: "",
          type: doc.mime_type || "application/pdf",
          size: 0,
          file_path: doc.file_path,
          uploaded_by: doc.uploaded_by,
          owner_id: doc.owner_id,
          created_at: doc.created_at,
          ai_summary: doc.ai_summary,
        }));
        setDocuments(docs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      rollbar.error("Fetch documents failed", {
        appointmentId,
        userRole,
        error: error?.message,
      });
    }
  };

  const fetchEnhancedPatientDetails = async (patientUserId: string) => {
    try {
      setLoadingDetails(true);
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", patientUserId)
        .single();
      if (patientError) throw patientError;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone_number, avatar_url")
        .eq("user_id", patientUserId)
        .single();

      setPatientDetails({
        ...patientData,
        profile: profileData,
      });
    } catch (error) {
      console.error("Error fetching patient details:", error);
      rollbar.error("Fetch patient details failed", {
        patientUserId,
        error: error?.message,
      });
      toast({ title: "Error", description: "Could not load patient details", variant: "destructive" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchEnhancedDoctorDetails = async (doctorUserId: string) => {
    try {
      setLoadingDetails(true);
      const { data: doctorData, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("*")
        .eq("user_id", doctorUserId)
        .single();
      if (doctorError) throw doctorError;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone_number, avatar_url, prefix")
        .eq("user_id", doctorUserId)
        .single();

      setDoctorDetails({ ...doctorData, profile: profileData });

      if (doctorData.facility_id) {
        const { data: facilityData } = await supabase
          .from("facilities")
          .select("*")
          .eq("id", doctorData.facility_id)
          .single();
        if (facilityData) setFacilityDetails(facilityData);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast({ title: "Error", description: "Could not load doctor details", variant: "destructive" });
    } finally {
      setLoadingDetails(false);
    }
  };


const fetchFacilityDetails = async (facilityId: string) => {
  try {
    setLoadingDetails(true);

    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("id", facilityId)
      .single();

    if (error) throw error;

    setFacilityDetails(data);
  } catch (error) {
    console.error("Error fetching facility details:", error);

    toast({
      title: "Error",
      description: "Could not load facility details",
      variant: "destructive",
    });
  } finally {
    setLoadingDetails(false);
  }
};
  const getAppointmentContext = async () => {
    if (!appointmentId) return null;
    const { data, error } = await supabase
      .from("appointments")
      .select("patient_id, doctor_id, facility_id")
      .eq("id", appointmentId)
      .single();
    if (error) return null;
    return data;
  };

  const fetchAISummary = async (documentId: string, fileName: string) => {
    try {
      setSummaryLoading(true);
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("ai_summary,tags")
        .eq("id", documentId)
        .single();
      
      if (!fetchError && doc?.ai_summary) {
        return doc.ai_summary;
      }
      if (!fetchError && doc?.tags) {
        return doc.tags;
      }
    } catch (error: any) {
      console.error("Error fetching AI summary:", error);
      rollbar.warning("AI summary failed", {
        documentId,
        fileName,
        error: error?.message,
      });
      toast({ title: "Summary Error", description: error.message || "Could not generate summary", variant: "destructive" });
      return null;
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleAISummary = async (document: DocumentFile) => {
    setSelectedDocument(document);
    setSummaryLoading(true);
    setShowSummaryModal(true);
    const summary = await fetchAISummary(document.id, document.name);
    if (summary) {
      setSelectedSummary(summary);
    } else {
      setSelectedSummary("Unable to generate summary for this document.");
    }
    setSummaryLoading(false);
  };

  const handleViewDocument = async (document: DocumentFile) => {
    try {
      setSelectedDocument(document);
      setZoomLevel(1);
      setLoadingDetails(true);
      setShowSummaryModal(false);
      setSelectedSummary("");

      const context = await getAppointmentContext();
      
      // For doctor, facility staff, or hospital admin: show patient details
      if ((userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && context?.patient_id) {
        await fetchEnhancedPatientDetails(context.patient_id);
      }
      // For patient: show doctor details if exists, else facility details
      if (userRole === "patient") {
        if (context?.doctor_id) {
          await fetchEnhancedDoctorDetails(context.doctor_id);
        } else if (context?.facility_id) {
          await fetchFacilityDetails(context.facility_id);
        }
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("patient_files")
        .createSignedUrl(document.file_path, 3600);
      
      if (signedUrlError || !signedUrlData?.signedUrl) {
        toast({ title: "Error", description: "Unable to access document", variant: "destructive" });
        return;
      }
      
      setSelectedDocument({ ...document, url: signedUrlData.signedUrl });
      setShowDocumentViewerModal(true);
      setShowSummaryModal(false);
    } catch (error) {
      console.error("Error viewing document:", error);
      rollbar.error("Document view failed", {
        documentId: document.id,
        filePath: document.file_path,
        error: error?.message,
      });
      toast({ title: "Error", description: "Failed to load document", variant: "destructive" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEndMeeting = () => {
    if (meetingInstance) {
      meetingInstance.leave();
    }
    onMeetingLeave();
    navigate("/");
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setZoomLevel(1);

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null;
    const isPDF = selectedDocument.type?.includes("pdf") || selectedDocument.name?.toLowerCase().endsWith(".pdf");
    const isImage = selectedDocument.type?.includes("image") || 
      selectedDocument.name?.toLowerCase().endsWith(".png") ||
      selectedDocument.name?.toLowerCase().endsWith(".jpg") ||
      selectedDocument.name?.toLowerCase().endsWith(".jpeg");

    const previewStyle = {
      transform: `scale(${zoomLevel})`,
      transition: "transform 0.2s ease",
      transformOrigin: "center center",
    };

    if (isPDF) {
      return (
        <iframe
          src={`${selectedDocument.url}#toolbar=0`}
          title={selectedDocument.name}
          style={{ width: "100%", height: "100%", border: "none", ...previewStyle }}
        />
      );
    }
    if (isImage) {
      return (
        <img
          src={selectedDocument.url}
          alt={selectedDocument.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", ...previewStyle }}
        />
      );
    }
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>📄 {selectedDocument.name}</p>
        <p style={{ fontSize: "12px", color: "#666" }}>Preview only available for PDF & Images</p>
      </div>
    );
  };

  const DocumentItem = ({ doc }: { doc: DocumentFile }) => {
    const [isViewLoading, setIsViewLoading] = useState(false);
    const [isViewsummaryLoading, setIsViewsummaryLoading] = useState(false);
    const isHighlighted = selectedDocIdForHighlight === doc.id;

    const handleViewClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsViewLoading(true);
      try {
        await handleViewDocument(doc);
        setSelectedDocIdForHighlight(doc.id);
      } finally {
        setIsViewLoading(false);
      }
    };
    const handleViewsummaryClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsViewsummaryLoading(true);
      try {
        await handleAISummary(doc);
        setSelectedDocIdForHighlight(doc.id);
      } finally {
        setIsViewsummaryLoading(false);
      }
    };

    return (
      <div
        onClick={() => setSelectedDocIdForHighlight(doc.id)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "10px",
          marginBottom: "8px",
          borderRadius: "8px",
          backgroundColor: isHighlighted ? "#e0f2fe" : "#f8f9fa",
          border: "1px solid #e9ecef",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <div style={{ fontSize: "24px" }}>{doc.type?.includes('pdf') ? '📄' : '🖼️'}</div>
          <div
            style={{
              fontWeight: "500",
              wordBreak: "break-word",
              backgroundColor: isViewLoading ? "#007bff" : "transparent",
              color: isViewLoading ? "white" : "inherit",
              padding: isViewLoading ? "2px 6px" : "0",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
          >
            {doc.name}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleViewClick}
            disabled={isViewLoading}
            style={{
              padding: "4px 12px",
              backgroundColor: isViewLoading ? "#6c757d" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isViewLoading ? "not-allowed" : "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isViewLoading ? <>⏳ Loading...</> : <>👁️ View</>}
          </button>
          {userRole === "doctor" && doc.ai_summary && (
            <button
              onClick={handleViewsummaryClick}
              disabled={isViewsummaryLoading}
              style={{
                padding: "4px 12px",
                backgroundColor: "#9b59b6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {isViewsummaryLoading ? <>⏳ Loading Summary...</> : <> 🤖 AI Summary</>}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDetailsContent = (type: "patient" | "doctor" | "facility" | "hospital_staff" | "hospital_admin") => {
    if (type === "patient" && !patientDetails) return null;
if (type === "doctor" && !doctorDetails) return null;
if (type === "facility" && !facilityDetails) return null;

    const p = patientDetails;
    const d = doctorDetails;
    const f = facilityDetails;
    const getAge = (dob: string) => {
      if (!dob) return "N/A";
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return `${age} years`;
    };

    return (
      <div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
          <button
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: activeDetailTab === "clinical" ? "#e2e8f0" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setActiveDetailTab("clinical")}
          >
            {type === "patient" ? "Patient Information" : type === "doctor" ? "Doctor Information" : "Facility Information"}
          </button>
          <button
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: activeDetailTab === "documents" ? "#e2e8f0" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setActiveDetailTab("documents")}
          >
            Documents
          </button>
        </div>

        {activeDetailTab === "clinical" && (
          <>
            {type === "patient" && p && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                  <div><strong>Name:</strong> {p.profile?.first_name} {p.profile?.last_name}</div>
                  <div><strong>DOB:</strong> {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : "N/A"} ({getAge(p.date_of_birth)})</div>
                  <div><strong>Gender:</strong> {p.gender || "N/A"}</div>
                  <div><strong>Blood Group:</strong> {p.blood_group || "N/A"}</div>
                  <div><strong>Height/Weight:</strong> {p.height || "?"} cm / {p.weight || "?"} kg</div>
                  <div><strong>Allergies:</strong> {p.known_allergies || "None"}</div>
                  <div><strong>Medical History:</strong> <div style={{ whiteSpace: "pre-wrap" }}>{p.medical_history || "None"}</div></div>
                  <div><strong>Current Medications:</strong> {p.current_medications || "None"}</div>
                </div>
                <br />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                  <div><strong>Email:</strong> {p.profile?.email || "N/A"}</div>
                  <div><strong>Phone:</strong> {p.profile?.phone_number || "N/A"}</div>
                  <div><strong>Emergency Contact:</strong> {p.emergency_contact_name || "N/A"}</div>
                  <div><strong>Emergency Phone:</strong> {p.emergency_contact_number || "N/A"}</div>
                  <div><strong>Relationship:</strong> {p.emergency_contact_relationship || "N/A"}</div>
                </div>
              </>
            )}
            {type === "doctor" && d && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                <div><strong>Name:</strong> { d.profile.prefix.charAt(0).toUpperCase() + d.profile.prefix.slice(1)} {d.profile?.first_name} {d.profile?.last_name}</div>
                <div><strong>Specialty:</strong> {d.medical_speciality}</div>
                <div><strong>License:</strong> {d.license_number}</div>
                <div><strong>Experience:</strong> {d.years_experience} years</div>
                <div><strong>Consultation Fee:</strong> ₹{d.consultation_fee}</div>
                <div><strong>Rating:</strong> {d.rating} ⭐ ({d.total_reviews} reviews)</div>
                <div><strong>Email:</strong> {d.profile?.email}</div>
                <div><strong>Phone:</strong> {d.profile?.phone_number}</div>
                {d.address && <div><strong>Address:</strong> {d.address}, {d.city}, {d.state}</div>}
                {d.about_yourself && <div><strong>About:</strong> {d.about_yourself}</div>}
              </div>
            )}
            {type === "facility" && f && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                <div><strong>Name:</strong> {f.facility_name}</div>
                <div><strong>Type:</strong> {f.facility_type}</div>
                <div><strong>License:</strong> {f.license_number}</div>
                <div><strong>Address:</strong> {f.address}</div>
                <div><strong>Rating:</strong> {f.rating} ⭐ ({f.total_reviews} reviews)</div>
                {f.total_beds && <div><strong>Total Beds:</strong> {f.total_beds}</div>}
                {f.number_of_staffs && <div><strong>Staff Count:</strong> {f.number_of_staffs}</div>}
                {f.about_facility && <div><strong>About:</strong> {f.about_facility}</div>}
              </div>
            )}
          </>
        )}
        {activeDetailTab === "documents" && (
          <>
            {(userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && type === "patient" && (
              <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {uploading ? "Uploading..." : "📤 Upload Document"}
                </button>
              </div>
            )}
            {userRole === "patient" && type === "doctor" && (
              <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {uploading ? "Uploading..." : "📤 Upload Document"}
                </button>
              </div>
            )}
            {userRole === "patient" && type === "facility" && (
              <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {uploading ? "Uploading..." : "📤 Upload Document"}
                </button>
              </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
              ) : (
                documents.map(doc => <DocumentItem key={doc.id} doc={doc} />)
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (containerRef.current) setContainerReady(true);
  }, []);

  useEffect(() => {
    if (!apiKey || !containerReady || meetingInitialized.current || !meetingId) return;

    const scriptSrc = "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
    let script: HTMLScriptElement | null = null;
    if (!contextLoaded) return;

    const initializeMeeting = () => {
      try {
        const meeting = new (window as any).VideoSDKMeeting();
        setMeetingInstance(meeting);

        let backHref = "https://www.pmhssmarthealth.com/"; // fallback
        if (appointmentContext) {
          if (userRole === "patient" && appointmentContext.doctor_id) {
            backHref = `https://www.pmhssmarthealth.com/patient/appointment-doctor/${userId}/${appointmentContext.doctor_id}/${appointmentId}`;
          } else if (userRole === "doctor" && appointmentContext.patient_id) {
            backHref = `https://www.pmhssmarthealth.com/doctor/appointment-patient/${userId}/${appointmentContext.patient_id}/${appointmentId}`;
          } else if ((userRole === "facility" || userRole === "hospital_admin") && appointmentContext.patient_id) {
            backHref = `https://www.pmhssmarthealth.com/facility/appointment-patient/${userId}/${appointmentContext.patient_id}/${appointmentId}`;
          } else if ((userRole === "facility" || userRole === "hospital_staff" ) && appointmentContext.patient_id) {
            backHref = `https://www.pmhssmarthealth.com/staff/appointment-patient/${userId}/${appointmentContext.patient_id}/${appointmentId}`;
          }
        }
        const config = {
          name,
          meetingId,
          apiKey,
          containerId: idRef.current,
          micEnabled,
          webcamEnabled,
          participantCanToggleSelfWebcam: true,
          participantCanToggleSelfMic: true,
          screenShareEnabled: isHost,
          chatEnabled: true,
          raiseHandEnabled: true,
          joinScreen: { visible: true, title: meetingTitle },
          permissions: {
            askToJoin: false,
            toggleParticipantMic: isHost,
            toggleParticipantWebcam: isHost,
            changeLayout: true,
            canCreatePoll: true,
            endMeeting: isHost,
          },
          layout: { type: "SIDEBAR", priority: "PIN", gridSize: 3 },
          whiteboardEnabled: false,
          recordingEnabled: false,
          liveStreamEnabled: false,
          brandingEnabled: true,
          brandLogoURL: "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
          brandName: "Room#1",
          poweredBy: false,
          participantId: isRejoining && sessionId ? sessionId : undefined,
          leftScreen: {
            actionButton: {
              label: "Back",
              href: backHref,
            },
          },
        };

        const cleanConfig = Object.fromEntries(Object.entries(config).filter(([_, v]) => v !== undefined));
        if (isRejoining && sessionId) meeting.join(cleanConfig);
        else meeting.init(cleanConfig);

        meetingInitialized.current = true;

        meeting.on("meeting-joined", () => {
          console.log("Meeting joined successfully");
        });

        meeting.on("chat-message", (message: any) => {
          if (message.data && typeof message.data === 'string') {
            try {
              const parsedData = JSON.parse(message.data);
              if (parsedData.type === "DOCUMENT_UPLOADED") {
                fetchDocuments();
                toast({ title: "New Document", description: `${parsedData.sender} uploaded a new document` });
              }
            } catch (e) {}
          }
        });

        setTimeout(() => {
          if (!micEnabled) meeting?.localParticipant?.disableMic?.();
          if (!webcamEnabled) meeting?.localParticipant?.disableWebcam?.();
        }, 1000);
      } catch (error) {
        console.error("Error initializing VideoSDK meeting:", error);
        rollbar.critical("Meeting initialization failed", {
          meetingId,
          userId,
          isHost,
          error: error?.message,
        });
      }
    };

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) script = existingScript as HTMLScriptElement;
    else {
      script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }

    if ((window as any).VideoSDKMeeting) initializeMeeting();
    else script.addEventListener("load", initializeMeeting);

    return () => {
      if (script) script.removeEventListener("load", initializeMeeting);
      onMeetingLeave();
      meetingInitialized.current = false;
    };
  }, [apiKey, meetingId, sessionId, name, micEnabled, webcamEnabled, containerId, isHost, onMeetingLeave, containerReady, meetingTitle, isRejoining, contextLoaded]);

  const handleRefreshData = async () => {
    try {
      setLoadingDetails(true);
      await fetchDocuments();
      const context = await getAppointmentContext();
      
      if ((userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && context?.patient_id) {
        await fetchEnhancedPatientDetails(context.patient_id);
      }
      if (userRole === "patient") {
  if (context?.doctor_id) {
    await fetchEnhancedDoctorDetails(context.doctor_id);
  } else if (context?.facility_id) {
    await fetchFacilityDetails(context.facility_id);
  }
}

      toast({
        title: "Refreshed",
        description: "Data updated successfully",
      });
    } catch (error) {
      console.error(error);
      rollbar.error("Refresh data failed", {
        appointmentId,
        userRole,
        error: error?.message,
      });
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#2c3e50", color: "white", zIndex: 100 }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {(userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && (
            <button onClick={async () => {setShowDetailsModal(true);
const context = await getAppointmentContext();
              if (context?.patient_id) {
        await fetchEnhancedPatientDetails(context.patient_id);
              }

            }} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              👤 Patient Information
            </button>
          )}
         {userRole === "patient" && (
  <button
    onClick={async () => {
      setShowDetailsModal(true);

      const context = await getAppointmentContext();

      // Fetch Doctor Details
      if (context?.doctor_id) {
        await fetchEnhancedDoctorDetails(context.doctor_id);
      }
      
      // Fetch Facility Details
      if (context?.facility_id) {
        await fetchFacilityDetails(context.facility_id);
      }
    }}
    style={{
      padding: "8px 16px",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    }}
  >
    {doctorDetails ? "👤 Doctor Information" : "🏥 Facility Information"}
  </button>
)}
        </div>
      </div>

      <div ref={containerRef} id={idRef.current} style={{ flex: 1, minHeight: 0, backgroundColor: "#f0f0f0", position: "relative", ...style }} />

      {showDetailsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", overflow: "auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>
                {userRole === "doctor" ? "Patient Information" :
                 userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin" ? "Patient Information" :
                 "Information"}
              </h3>
              <button onClick={handleRefreshData} style={{ padding: "4px 10px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>🔄 Refresh</button>
              <button onClick={() => setShowDetailsModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            {loadingDetails ? <Loader2 /> : (
              <>
                {(userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && patientDetails && renderDetailsContent("patient")}
                {/* {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
                {userRole === "patient" && facilityDetails && renderDetailsContent("facility")} */}
                
{userRole === "patient" && (
  <>
    { !facilityDetails && doctorDetails && renderDetailsContent("doctor")}
    {!doctorDetails && facilityDetails && renderDetailsContent("facility")}
  </>
)}
              </>
            )}
          </div>
        </div>
      )}

      {showUploadModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
              <h3>Upload Documents</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {userRole === "patient" ? (
                <UploadPrescriptionForm
                  patientId={userId!}
                  appointmentId={appointmentId!}
                  uploadedBy="patient"
                  defaultDocumentType="medical_record"
                  title="Upload Medical Document"
                  onCancel={() => setShowUploadModal(false)}
                />
              ) : (userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") ? (
                <UploadPrescriptionForm
                  patientId={patientDetails?.user_id || userId!}
                  appointmentId={appointmentId!}
                  uploadedBy="department"
                  defaultDocumentType="medical_record"
                  title="Upload Medical Document"
                  onCancel={() => setShowUploadModal(false)}
                />
              ) : (
                <UploadPrescriptionForm
                  patientId={patientDetails?.user_id || ""}
                  doctorId={userId!}
                  appointmentId={appointmentId!}
                  uploadedBy="doctor"
                  defaultDocumentType="medical_record"
                  onCancel={() => setShowUploadModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showDocumentViewerModal && selectedDocument && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
              <h3>{selectedDocument.name}</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={handleRefreshData} style={{ padding: "4px 10px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>🔄 Refresh</button>
                <button onClick={zoomOut} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom Out</button>
                <span style={{ minWidth: "60px", textAlign: "center" }}>{Math.round(zoomLevel * 100)}%</span>
                <button onClick={zoomIn} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom In</button>
                <button onClick={resetZoom} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reset</button>
                <button onClick={() => { setShowDocumentViewerModal(false); setShowDetailsModal(false); }} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
                {(userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && patientDetails && renderDetailsContent("patient")}
                {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
                {userRole === "patient" && facilityDetails && renderDetailsContent("facility")}
              </div>
              <div style={{ width: "60%", overflow: "auto", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loadingDetails ? <Loader2 /> : renderDocumentPreview()}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSummaryModal && selectedDocument &&(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
              <h3>AI Summary: {selectedDocument?.name}</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={handleRefreshData} style={{ padding: "4px 10px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>🔄 Refresh</button>
                <button onClick={() => { setShowSummaryModal(false); setShowDocumentViewerModal(false); setShowDetailsModal(false); }} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
                {loadingDetails ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <Loader2 />
                    <span style={{ marginLeft: "10px" }}>Generating AI summary...</span>
                  </div>
                ) : (
                  <>
                    {(userRole === "doctor" || userRole === "facility" || userRole === "hospital_staff" || userRole === "hospital_admin") && patientDetails && renderDetailsContent("patient")}
                    {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
                    {userRole === "patient" && facilityDetails && renderDetailsContent("facility")}
                  </>
                )}
              </div>
              <div style={{ width: "60%", overflow: "auto", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {summaryLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <Loader2 />
                    <span style={{ marginLeft: "10px" }}>Generating AI summary...</span>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap shadow w-full max-h-[60vh] overflow-y-auto" style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                    {cleanSummary(selectedSummary)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;