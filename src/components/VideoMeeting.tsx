// // // // // import { useEffect, useRef, useState } from "react";
// // // // // import { useNavigate } from "react-router-dom";

// // // // // export interface VideoMeetingProps {
// // // // //   apiKey: string;
// // // // //   meetingId: string; // This should be your seminar ID (e.g., "6idk-rpv5-fmu9")
// // // // //   sessionId?: string; // Optional session ID for rejoining
// // // // //   name: string;
// // // // //   micEnabled?: boolean;
// // // // //   webcamEnabled?: boolean;
// // // // //   containerId?: string | null;
// // // // //   isHost?: boolean;
// // // // //   onMeetingLeave?: () => void;
// // // // //   style?: React.CSSProperties;
// // // // //   meetingTitle?: string;
// // // // //   isRejoining?: boolean;
// // // // // }

// // // // // const VideoMeeting = ({
// // // // //   apiKey,
// // // // //   meetingId,
// // // // //   sessionId,
// // // // //   name,
// // // // //   micEnabled = true,
// // // // //   webcamEnabled = true,
// // // // //   containerId = null,
// // // // //   isHost = false,
// // // // //   style,
// // // // //   onMeetingLeave = () => {},
// // // // //   meetingTitle = "Seminar Meeting",
// // // // //   // isRejoining = false,
// // // // //   isRejoining,
// // // // // }: VideoMeetingProps) => {
// // // // //   const navigate = useNavigate();
// // // // //   const containerRef = useRef<HTMLDivElement>(null);
// // // // //   const meetingInitialized = useRef(false);
// // // // //   const [containerReady, setContainerReady] = useState(false);
// // // // //   const idRef = useRef(
// // // // //     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
// // // // //   );

// // // // //   useEffect(() => {
// // // // //     if (containerRef.current) {
// // // // //       setContainerReady(true);
// // // // //     }
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (
// // // // //       !apiKey ||
// // // // //       !containerReady ||
// // // // //       meetingInitialized.current ||
// // // // //       !meetingId
// // // // //     ) {
// // // // //       return;
// // // // //     }

// // // // //     const scriptSrc =
// // // // //       "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
// // // // //     let script: HTMLScriptElement | null = null;

// // // // //     const initializeMeeting = () => {
// // // // //       try {
// // // // //         const meeting = new (window as any).VideoSDKMeeting();

// // // // //         const config = {
// // // // //           name,
// // // // //           meetingId: meetingId, // Always use the seminar ID
// // // // //           apiKey,
// // // // //           containerId: idRef.current,
// // // // //           micEnabled: micEnabled,
// // // // //           webcamEnabled: webcamEnabled,
// // // // //           participantCanToggleSelfWebcam: true,
// // // // //           participantCanToggleSelfMic: true,
// // // // //           screenShareEnabled: isHost,
// // // // //           chatEnabled: true,
// // // // //           raiseHandEnabled: true,
// // // // //           joinScreen: {
// // // // //             visible: true,
// // // // //             title: meetingTitle,
// // // // //           },
// // // // //           permissions: {
// // // // //             askToJoin: false,
// // // // //             toggleParticipantMic: isHost,
// // // // //             toggleParticipantWebcam: isHost,
// // // // //             changeLayout: true,
// // // // //             canCreatePoll: true,
// // // // //             endMeeting: isHost,
// // // // //           },
// // // // //           layout: {
// // // // //             type: "SIDEBAR",
// // // // //             priority: "PIN",
// // // // //             gridSize: 3,
// // // // //           },
// // // // //           whiteboardEnabled: false,
// // // // //           recordingEnabled: false,
// // // // //           liveStreamEnabled: false,
// // // // //           brandingEnabled: true,
// // // // //           brandLogoURL:
// // // // //             "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
// // // // //           brandName: "Room#1",
// // // // //           poweredBy: false,
// // // // //           // For rejoining existing session
// // // // //           participantId: isRejoining && sessionId ? sessionId : undefined,
// // // // //         };

// // // // //         const cleanConfig = Object.fromEntries(
// // // // //           Object.entries(config).filter(([_, v]) => v !== undefined)
// // // // //         );

// // // // //         console.log(
// // // // //           `Initializing meeting with ID: ${meetingId}${
// // // // //             isRejoining ? " (rejoining)" : ""
// // // // //           }`
// // // // //         );

// // // // //         if (isRejoining && sessionId) {
// // // // //           console.log(`Rejoining session with ID: ${sessionId}`);
// // // // //           // Use join instead of init for rejoining
// // // // //           meeting.join(cleanConfig);
// // // // //         } else {
// // // // //           console.log(`Starting new session`);
// // // // //           meeting.init(cleanConfig);
// // // // //         }

// // // // //         meetingInitialized.current = true;

// // // // //         setTimeout(() => {
// // // // //           if (!micEnabled) {
// // // // //             meeting?.localParticipant?.disableMic?.();
// // // // //           }
// // // // //           if (!webcamEnabled) {
// // // // //             meeting?.localParticipant?.disableWebcam?.();
// // // // //           }
// // // // //         }, 1000);
// // // // //       } catch (error) {
// // // // //         console.error("Error initializing VideoSDK meeting:", error);
// // // // //       }
// // // // //     };

// // // // //     const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
// // // // //     if (existingScript) {
// // // // //       script = existingScript as HTMLScriptElement;
// // // // //     } else {
// // // // //       script = document.createElement("script");
// // // // //       script.src = scriptSrc;
// // // // //       script.async = true;
// // // // //       document.body.appendChild(script);
// // // // //     }

// // // // //     if ((window as any).VideoSDKMeeting) {
// // // // //       initializeMeeting();
// // // // //       return;
// // // // //     }

// // // // //     const onScriptLoad = () => {
// // // // //       if ((window as any).VideoSDKMeeting) {
// // // // //         initializeMeeting();
// // // // //       }
// // // // //     };

// // // // //     script.addEventListener("load", onScriptLoad);

// // // // //     return () => {
// // // // //       if (script) {
// // // // //         script.removeEventListener("load", onScriptLoad);
// // // // //       }
// // // // //       onMeetingLeave();
// // // // //       meetingInitialized.current = false;
// // // // //     };
// // // // //   }, [
// // // // //     apiKey,
// // // // //     meetingId,
// // // // //     sessionId,
// // // // //     name,
// // // // //     micEnabled,
// // // // //     webcamEnabled,
// // // // //     containerId,
// // // // //     isHost,
// // // // //     onMeetingLeave,
// // // // //     containerReady,
// // // // //     meetingTitle,
// // // // //     isRejoining,
// // // // //   ]);
// // // // //   const handleHostAction = () => {
// // // // //     console.log("Host-only action triggered");
// // // // //     // You can trigger any logic here, e.g., start recording, custom alert, etc.
// // // // //   };
// // // // //   return (
// // // // //     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
// // // // //       {isHost && (
// // // // //         <button
// // // // //           onClick={handleHostAction}
// // // // //           style={{
// // // // //             position: "absolute",
// // // // //             top: 10,
// // // // //             right: 10,
// // // // //             zIndex: 1000,
// // // // //             padding: "8px 12px",
// // // // //             backgroundColor: "#007bff",
// // // // //             color: "#fff",
// // // // //             border: "none",
// // // // //             borderRadius: "4px",
// // // // //             cursor: "pointer",
// // // // //           }}
// // // // //         >
// // // // //           Host Action
// // // // //         </button>
// // // // //       )}
// // // // //       <div
// // // // //         ref={containerRef}
// // // // //         id={idRef.current}
// // // // //         style={{
// // // // //           flex: 1,
// // // // //           minHeight: 0,
// // // // //           backgroundColor: "#f0f0f0",
// // // // //           position: "relative",
// // // // //           ...style,
// // // // //         }}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default VideoMeeting;

// // // // import { useEffect, useRef, useState } from "react";
// // // // import { useNavigate } from "react-router-dom";

// // // // export interface VideoMeetingProps {
// // // //   apiKey: string;
// // // //   meetingId: string; // This should be your seminar ID (e.g., "6idk-rpv5-fmu9")
// // // //   sessionId?: string; // Optional session ID for rejoining
// // // //   name: string;
// // // //   micEnabled?: boolean;
// // // //   webcamEnabled?: boolean;
// // // //   containerId?: string | null;
// // // //   isHost?: boolean;
// // // //   onMeetingLeave?: () => void;
// // // //   style?: React.CSSProperties;
// // // //   meetingTitle?: string;
// // // //   isRejoining?: boolean;
// // // //   enableDocumentSharing?: boolean; // New prop for document sharing
// // // // }

// // // // interface DocumentFile {
// // // //   id: string;
// // // //   name: string;
// // // //   url: string;
// // // //   type: string;
// // // //   size: number;
// // // // }

// // // // const VideoMeeting = ({
// // // //   apiKey,
// // // //   meetingId,
// // // //   sessionId,
// // // //   name,
// // // //   micEnabled = true,
// // // //   webcamEnabled = true,
// // // //   containerId = null,
// // // //   isHost = false,
// // // //   style,
// // // //   onMeetingLeave = () => {},
// // // //   meetingTitle = "Seminar Meeting",
// // // //   isRejoining,
// // // //   enableDocumentSharing = true, // Default to true
// // // // }: VideoMeetingProps) => {
// // // //   const navigate = useNavigate();
// // // //   const containerRef = useRef<HTMLDivElement>(null);
// // // //   const meetingInitialized = useRef(false);
// // // //   const [containerReady, setContainerReady] = useState(false);
// // // //   const [showDocumentSidebar, setShowDocumentSidebar] = useState(false);
// // // //   const [documents, setDocuments] = useState<DocumentFile[]>([]);
// // // //   const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
// // // //   const [isSharingScreen, setIsSharingScreen] = useState(false);
// // // //   const [meetingInstance, setMeetingInstance] = useState<any>(null);
  
// // // //   const idRef = useRef(
// // // //     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
// // // //   );

// // // //   useEffect(() => {
// // // //     if (containerRef.current) {
// // // //       setContainerReady(true);
// // // //     }
// // // //   }, []);


// // // //   useEffect(() => {
// // // //     if (
// // // //       !apiKey ||
// // // //       !containerReady ||
// // // //       meetingInitialized.current ||
// // // //       !meetingId
// // // //     ) {
// // // //       return;
// // // //     }

// // // //     const scriptSrc =
// // // //       "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
// // // //     let script: HTMLScriptElement | null = null;

// // // //     const initializeMeeting = () => {
// // // //       try {
// // // //         const meeting = new (window as any).VideoSDKMeeting();
// // // //         setMeetingInstance(meeting);

// // // //         const config = {
// // // //           name,
// // // //           meetingId: meetingId,
// // // //           apiKey,
// // // //           containerId: idRef.current,
// // // //           micEnabled: micEnabled,
// // // //           webcamEnabled: webcamEnabled,
// // // //           participantCanToggleSelfWebcam: true,
// // // //           participantCanToggleSelfMic: true,
// // // //           screenShareEnabled: isHost,
// // // //           chatEnabled: true,
// // // //           raiseHandEnabled: true,
// // // //           joinScreen: {
// // // //             visible: true,
// // // //             title: meetingTitle,
// // // //           },
// // // //           permissions: {
// // // //             askToJoin: false,
// // // //             toggleParticipantMic: isHost,
// // // //             toggleParticipantWebcam: isHost,
// // // //             changeLayout: true,
// // // //             canCreatePoll: true,
// // // //             endMeeting: isHost,
// // // //           },
// // // //           layout: {
// // // //             type: "SIDEBAR",
// // // //             priority: "PIN",
// // // //             gridSize: 3,
// // // //           },
// // // //           whiteboardEnabled: false,
// // // //           recordingEnabled: false,
// // // //           liveStreamEnabled: false,
// // // //           brandingEnabled: true,
// // // //           brandLogoURL:
// // // //             "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
// // // //           brandName: "Room#1",
// // // //           poweredBy: false,
// // // //           participantId: isRejoining && sessionId ? sessionId : undefined,
// // // //         };

// // // //         const cleanConfig = Object.fromEntries(
// // // //           Object.entries(config).filter(([_, v]) => v !== undefined)
// // // //         );

// // // //         console.log(
// // // //           `Initializing meeting with ID: ${meetingId}${
// // // //             isRejoining ? " (rejoining)" : ""
// // // //           }`
// // // //         );

// // // //         if (isRejoining && sessionId) {
// // // //           console.log(`Rejoining session with ID: ${sessionId}`);
// // // //           meeting.join(cleanConfig);
// // // //         } else {
// // // //           console.log(`Starting new session`);
// // // //           meeting.init(cleanConfig);
// // // //         }

// // // //         meetingInitialized.current = true;

// // // //         setTimeout(() => {
// // // //           if (!micEnabled) {
// // // //             meeting?.localParticipant?.disableMic?.();
// // // //           }
// // // //           if (!webcamEnabled) {
// // // //             meeting?.localParticipant?.disableWebcam?.();
// // // //           }
// // // //         }, 1000);
// // // //       } catch (error) {
// // // //         console.error("Error initializing VideoSDK meeting:", error);
// // // //       }
// // // //     };

// // // //     const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
// // // //     if (existingScript) {
// // // //       script = existingScript as HTMLScriptElement;
// // // //     } else {
// // // //       script = document.createElement("script");
// // // //       script.src = scriptSrc;
// // // //       script.async = true;
// // // //       document.body.appendChild(script);
// // // //     }

// // // //     if ((window as any).VideoSDKMeeting) {
// // // //       initializeMeeting();
// // // //       return;
// // // //     }

// // // //     const onScriptLoad = () => {
// // // //       if ((window as any).VideoSDKMeeting) {
// // // //         initializeMeeting();
// // // //       }
// // // //     };

// // // //     script.addEventListener("load", onScriptLoad);

// // // //     return () => {
// // // //       if (script) {
// // // //         script.removeEventListener("load", onScriptLoad);
// // // //       }
// // // //       onMeetingLeave();
// // // //       meetingInitialized.current = false;
// // // //     };
// // // //   }, [
// // // //     apiKey,
// // // //     meetingId,
// // // //     sessionId,
// // // //     name,
// // // //     micEnabled,
// // // //     webcamEnabled,
// // // //     containerId,
// // // //     isHost,
// // // //     onMeetingLeave,
// // // //     containerReady,
// // // //     meetingTitle,
// // // //     isRejoining,
// // // //   ]);

// // // //   // Handle screen sharing
// // // //   const handleScreenShare = async () => {
// // // //     try {
// // // //       if (meetingInstance) {
// // // //         if (!isSharingScreen) {
// // // //           // Start screen sharing
// // // //           const screenShareStream = await navigator.mediaDevices.getDisplayMedia({
// // // //             video: true,
// // // //             audio: false,
// // // //           });
          
// // // //           // Share screen through VideoSDK
// // // //           const screenShareTrack = screenShareStream.getVideoTracks()[0];
// // // //           meetingInstance?.localParticipant?.shareScreen(screenShareTrack);
// // // //           setIsSharingScreen(true);
          
// // // //           screenShareTrack.onended = () => {
// // // //             handleScreenShare(); // Stop sharing when user clicks stop
// // // //           };
// // // //         } else {
// // // //           // Stop screen sharing
// // // //           meetingInstance?.localParticipant?.stopShareScreen();
// // // //           setIsSharingScreen(false);
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error sharing screen:", error);
// // // //     }
// // // //   };

// // // //   // Handle document upload
// // // //   const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const files = event.target.files;
// // // //     if (files && files.length > 0) {
// // // //       const file = files[0];
// // // //       const newDocument: DocumentFile = {
// // // //         id: Date.now().toString(),
// // // //         name: file.name,
// // // //         url: URL.createObjectURL(file),
// // // //         type: file.type,
// // // //         size: file.size
// // // //       };
      
// // // //       setDocuments(prev => [...prev, newDocument]);
      
// // // //       // Automatically select the uploaded document
// // // //       setSelectedDocument(newDocument);
      
// // // //       // Broadcast document to all participants
// // // //       if (meetingInstance && isHost) {
// // // //         meetingInstance?.sendMessage({
// // // //           type: "DOCUMENT_SHARED",
// // // //           data: {
// // // //             documentId: newDocument.id,
// // // //             documentName: newDocument.name,
// // // //             documentUrl: newDocument.url,
// // // //             timestamp: new Date().toISOString()
// // // //           }
// // // //         });
// // // //       }
// // // //     }
// // // //   };

// // // //   // Handle document selection
// // // //   const handleDocumentSelect = (document: DocumentFile) => {
// // // //     setSelectedDocument(document);
// // // //   };

// // // //   // Handle close document
// // // //   const handleCloseDocument = () => {
// // // //     setSelectedDocument(null);
// // // //     setShowDocumentSidebar(false);
// // // //   };

// // // //   // Render document viewer based on file type
// // // //   const renderDocumentViewer = (document: DocumentFile) => {
// // // //     if (document.type.startsWith('image/')) {
// // // //       return (
// // // //         <div style={styles.documentViewer}>
// // // //           <img 
// // // //             src={document.url} 
// // // //             alt={document.name}
// // // //             style={styles.documentImage}
// // // //           />
// // // //         </div>
// // // //       );
// // // //     } else if (document.type === 'application/pdf') {
// // // //       return (
// // // //         <div style={styles.documentViewer}>
// // // //           <iframe
// // // //             src={`${document.url}#toolbar=0`}
// // // //             title={document.name}
// // // //             style={styles.documentIframe}
// // // //           />
// // // //         </div>
// // // //       );
// // // //     } else {
// // // //       return (
// // // //         <div style={styles.documentViewer}>
// // // //           <div style={styles.placeholderMessage}>
// // // //             <p>Preview not available for this file type</p>
// // // //             <a 
// // // //               href={document.url} 
// // // //               download={document.name}
// // // //               style={styles.downloadLink}
// // // //             >
// // // //               Download {document.name}
// // // //             </a>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }
// // // //   };

// // // //   const handleHostAction = () => {
// // // //     console.log("Host-only action triggered");
// // // //     // You can trigger any logic here, e.g., start recording, custom alert, etc.
// // // //   };

// // // //   return (
// // // //     <div style={styles.container}>
// // // //       {/* Top Bar with Document Sharing Controls */}
// // // //       {enableDocumentSharing && (
// // // //         <div style={styles.topBar}>
// // // //           <div style={styles.topBarLeft}>
// // // //             <button
// // // //               onClick={() => setShowDocumentSidebar(!showDocumentSidebar)}
// // // //               style={styles.topBarButton}
// // // //             >
// // // //               📄 Documents
// // // //             </button>
// // // //               <>
// // // //                 <label style={styles.uploadButton}>
// // // //                   📤 Upload Document
// // // //                   <input
// // // //                     type="file"
// // // //                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
// // // //                     onChange={handleDocumentUpload}
// // // //                     style={styles.hiddenInput}
// // // //                   />
// // // //                 </label>
// // // //               </>
          
// // // //           </div>
// // // //           <div style={styles.topBarRight}>
// // // //             <span style={styles.meetingTitle}>{meetingTitle}</span>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Video Container */}
// // // //       <div
// // // //         ref={containerRef}
// // // //         id={idRef.current}
// // // //         style={{
// // // //           flex: 1,
// // // //           minHeight: 0,
// // // //           backgroundColor: "#f0f0f0",
// // // //           position: "relative",
// // // //           ...style,
// // // //         }}
// // // //       />

      

// // // //       {/* Document Viewer Popup (appears on top of video) */}
// // // //       {selectedDocument && (
// // // //         <div style={styles.documentPopup}>
// // // //           <div style={styles.documentPopupHeader}>
// // // //             <h3 style={styles.documentPopupTitle}>{selectedDocument.name}</h3>
// // // //             <div style={styles.documentPopupActions}>
              
// // // //               <button
// // // //                 onClick={handleCloseDocument}
// // // //                 style={styles.closePopupButton}
// // // //               >
// // // //                 ×
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //           <div style={styles.documentPopupContent}>
// // // //             {renderDocumentViewer(selectedDocument)}
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* {isHost && (
// // // //         <button
// // // //           onClick={handleHostAction}
// // // //           style={styles.hostButton}
// // // //         >
// // // //           Host Action
// // // //         </button>
// // // //       )} */}
// // // //     </div>
// // // //   );
// // // // };

// // // // // Styles object
// // // // const styles: { [key: string]: React.CSSProperties } = {
// // // //   container: {
// // // //     display: "flex",
// // // //     flexDirection: "column",
// // // //     height: "100vh",
// // // //     position: "relative"
// // // //   },
// // // //   topBar: {
// // // //     display: "flex",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     padding: "10px 20px",
// // // //     backgroundColor: "#2c3e50",
// // // //     color: "white",
// // // //     zIndex: 100,
// // // //     boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
// // // //   },
// // // //   topBarLeft: {
// // // //     display: "flex",
// // // //     gap: "10px"
// // // //   },
// // // //   topBarRight: {
// // // //     display: "flex",
// // // //     alignItems: "center"
// // // //   },
// // // //   meetingTitle: {
// // // //     fontSize: "16px",
// // // //     fontWeight: "500"
// // // //   },
// // // //   topBarButton: {
// // // //     padding: "8px 16px",
// // // //     backgroundColor: "#3498db",
// // // //     color: "white",
// // // //     border: "none",
// // // //     borderRadius: "4px",
// // // //     cursor: "pointer",
// // // //     fontSize: "14px",
// // // //     transition: "background-color 0.3s"
// // // //   },
// // // //   uploadButton: {
// // // //     padding: "8px 16px",
// // // //     backgroundColor: "#27ae60",
// // // //     color: "white",
// // // //     border: "none",
// // // //     borderRadius: "4px",
// // // //     cursor: "pointer",
// // // //     fontSize: "14px",
// // // //     display: "inline-block"
// // // //   },
// // // //   hiddenInput: {
// // // //     display: "none"
// // // //   },
// // // //   sidebar: {
// // // //     position: "fixed",
// // // //     right: 0,
// // // //     top: 0,
// // // //     width: "50px", // 50px width popup
// // // //     height: "100vh",
// // // //     backgroundColor: "white",
// // // //     boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
// // // //     zIndex: 200,
// // // //     transition: "width 0.3s ease",
// // // //     overflow: "hidden",
// // // //     display: "flex",
// // // //     flexDirection: "column"
// // // //   },
// // // //   sidebarHeader: {
// // // //     padding: "15px 10px",
// // // //     backgroundColor: "#f8f9fa",
// // // //     borderBottom: "1px solid #dee2e6",
// // // //     display: "flex",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     cursor: "pointer"
// // // //   },
// // // //   sidebarTitle: {
// // // //     margin: 0,
// // // //     fontSize: "14px",
// // // //     writingMode: "vertical-rl",
// // // //     transform: "rotate(180deg)",
// // // //     whiteSpace: "nowrap"
// // // //   },
// // // //   closeButton: {
// // // //     background: "none",
// // // //     border: "none",
// // // //     fontSize: "20px",
// // // //     cursor: "pointer",
// // // //     color: "#6c757d",
// // // //     padding: "5px",
// // // //     width: "30px",
// // // //     height: "30px",
// // // //     display: "flex",
// // // //     alignItems: "center",
// // // //     justifyContent: "center"
// // // //   },
// // // //   documentList: {
// // // //     flex: 1,
// // // //     overflowY: "auto",
// // // //     padding: "10px 5px"
// // // //   },
// // // //   documentItem: {
// // // //     display: "flex",
// // // //     flexDirection: "column",
// // // //     alignItems: "center",
// // // //     padding: "10px 5px",
// // // //     marginBottom: "10px",
// // // //     cursor: "pointer",
// // // //     borderRadius: "8px",
// // // //     transition: "background-color 0.3s",
// // // //     textAlign: "center"
// // // //   },
// // // //   documentIcon: {
// // // //     fontSize: "24px",
// // // //     marginBottom: "5px"
// // // //   },
// // // //   documentInfo: {
// // // //     width: "100%",
// // // //     textAlign: "center"
// // // //   },
// // // //   documentName: {
// // // //     fontSize: "10px",
// // // //     fontWeight: "500",
// // // //     overflow: "hidden",
// // // //     textOverflow: "ellipsis",
// // // //     whiteSpace: "nowrap"
// // // //   },
// // // //   documentSize: {
// // // //     fontSize: "8px",
// // // //     color: "#6c757d"
// // // //   },
// // // //   emptyMessage: {
// // // //     textAlign: "center",
// // // //     padding: "20px 10px",
// // // //     fontSize: "10px",
// // // //     color: "#6c757d"
// // // //   },
// // // //   documentPopup: {
// // // //     position: "fixed",
// // // //     top: "50%",
// // // //     left: "50%",
// // // //     transform: "translate(-50%, -50%)",
// // // //     width: "80%",
// // // //     maxWidth: "1000px",
// // // //     height: "80%",
// // // //     backgroundColor: "white",
// // // //     borderRadius: "8px",
// // // //     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
// // // //     zIndex: 300,
// // // //     display: "flex",
// // // //     flexDirection: "column",
// // // //     overflow: "hidden"
// // // //   },
// // // //   documentPopupHeader: {
// // // //     padding: "15px 20px",
// // // //     backgroundColor: "#f8f9fa",
// // // //     borderBottom: "1px solid #dee2e6",
// // // //     display: "flex",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center"
// // // //   },
// // // //   documentPopupTitle: {
// // // //     margin: 0,
// // // //     fontSize: "16px",
// // // //     fontWeight: "500"
// // // //   },
// // // //   documentPopupActions: {
// // // //     display: "flex",
// // // //     gap: "10px",
// // // //     alignItems: "center"
// // // //   },
// // // //   downloadButton: {
// // // //     padding: "5px 10px",
// // // //     backgroundColor: "#28a745",
// // // //     color: "white",
// // // //     textDecoration: "none",
// // // //     borderRadius: "4px",
// // // //     fontSize: "12px"
// // // //   },
// // // //   closePopupButton: {
// // // //     background: "none",
// // // //     border: "none",
// // // //     fontSize: "24px",
// // // //     cursor: "pointer",
// // // //     color: "#6c757d",
// // // //     width: "30px",
// // // //     height: "30px",
// // // //     display: "flex",
// // // //     alignItems: "center",
// // // //     justifyContent: "center"
// // // //   },
// // // //   documentPopupContent: {
// // // //     flex: 1,
// // // //     overflow: "auto",
// // // //     padding: "20px"
// // // //   },
// // // //   documentViewer: {
// // // //     width: "100%",
// // // //     height: "100%",
// // // //     display: "flex",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     backgroundColor: "#f5f5f5"
// // // //   },
// // // //   documentImage: {
// // // //     maxWidth: "100%",
// // // //     maxHeight: "100%",
// // // //     objectFit: "contain"
// // // //   },
// // // //   documentIframe: {
// // // //     width: "100%",
// // // //     height: "100%",
// // // //     border: "none"
// // // //   },
// // // //   placeholderMessage: {
// // // //     textAlign: "center",
// // // //     padding: "20px"
// // // //   },
// // // //   hostButton: {
// // // //     position: "absolute",
// // // //     top: 10,
// // // //     right: 10,
// // // //     zIndex: 1000,
// // // //     padding: "8px 12px",
// // // //     backgroundColor: "#007bff",
// // // //     color: "#fff",
// // // //     border: "none",
// // // //     borderRadius: "4px",
// // // //     cursor: "pointer"
// // // //   }
// // // // };

// // // // export default VideoMeeting;

// // // import { useEffect, useRef, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { supabase } from "@/integrations/supabase/client";
// // // import { toast } from "@/hooks/use-toast";

// // // export interface VideoMeetingProps {
// // //   apiKey: string;
// // //   meetingId: string;
// // //   sessionId?: string;
// // //   name: string;
// // //   micEnabled?: boolean;
// // //   webcamEnabled?: boolean;
// // //   containerId?: string | null;
// // //   isHost?: boolean;
// // //   onMeetingLeave?: () => void;
// // //   style?: React.CSSProperties;
// // //   meetingTitle?: string;
// // //   isRejoining?: boolean;
// // //   enableDocumentSharing?: boolean;
// // //   appointmentId?: string;
// // //   userId?: string;
// // //   userRole?: "doctor" | "patient";
// // // }

// // // interface DocumentFile {
// // //   id: string;
// // //   name: string;
// // //   url: string;
// // //   type: string;
// // //   size: number;
// // //   file_path: string;
// // //   uploaded_by: string;
// // //   owner_id: string;
// // //   created_at: string;
// // // }

// // // const VideoMeeting = ({
// // //   apiKey,
// // //   meetingId,
// // //   sessionId,
// // //   name,
// // //   micEnabled = true,
// // //   webcamEnabled = true,
// // //   containerId = null,
// // //   isHost = false,
// // //   style,
// // //   onMeetingLeave = () => {},
// // //   meetingTitle = "Seminar Meeting",
// // //   isRejoining,
// // //   enableDocumentSharing = true,
// // //   appointmentId,
// // //   userId,
// // //   userRole = "patient",
// // // }: VideoMeetingProps) => {
// // //   const navigate = useNavigate();
// // //   const containerRef = useRef<HTMLDivElement>(null);
// // //   const meetingInitialized = useRef(false);
// // //   const [containerReady, setContainerReady] = useState(false);
// // //   const [showDocumentSidebar, setShowDocumentSidebar] = useState(false);
// // //   const [documents, setDocuments] = useState<DocumentFile[]>([]);
// // //   const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
// // //   const [isSharingScreen, setIsSharingScreen] = useState(false);
// // //   const [meetingInstance, setMeetingInstance] = useState<any>(null);
// // //   const [uploading, setUploading] = useState(false);
// // //   const [patientDetails, setPatientDetails] = useState<any>(null);
// // //   const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  
// // //   const idRef = useRef(
// // //     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
// // //   );

// // //   // Fetch documents from Supabase when meeting starts
// // //   useEffect(() => {
// // //     if (appointmentId && enableDocumentSharing) {
// // //       fetchDocuments();
// // //     }
// // //   }, [appointmentId]);

// // //   // const fetchDocuments = async () => {
// // //   //   try {
// // //   //     const { data, error } = await supabase
// // //   //       .from("documents")
// // //   //       .select("*")
// // //   //       .eq("appointment_id", appointmentId)
// // //   //       .order("created_at", { ascending: false });

// // //   //     if (error) {
// // //   //       console.error("Error fetching documents:", error);
// // //   //       return;
// // //   //     }

// // //   //     if (data) {
// // //   //       const docsWithUrls = await Promise.all(
// // //   //         data.map(async (doc) => {
// // //   //           const { data: urlData } = await supabase.storage
// // //   //             .from("patient_files")
// // //   //             .createSignedUrl(doc.file_path, 3600);

// // //   //           return {
// // //   //             id: doc.id,
// // //   //             name: doc.name,
// // //   //             url: urlData?.signedUrl || "",
// // //   //             type: doc.mime_type || "application/pdf",
// // //   //             size: 0,
// // //   //             file_path: doc.file_path,
// // //   //             uploaded_by: doc.uploaded_by,
// // //   //             owner_id: doc.owner_id,
// // //   //             created_at: doc.created_at,
// // //   //           };
// // //   //         })
// // //   //       );
// // //   //       setDocuments(docsWithUrls);
// // //   //     }
// // //   //   } catch (error) {
// // //   //     console.error("Error fetching documents:", error);
// // //   //   }
// // //   // };
// // // const fetchDocuments = async () => {
// // //   try {
// // //     const { data, error } = await supabase
// // //       .from("documents")
// // //   .select("*")
// // //       .eq("appointment_id", appointmentId)
// // //       .order("created_at", { ascending: false });

// // //     if (error) {
// // //       console.error("Error fetching documents:", error);
// // //       return;
// // //     }

// // //     if (data) {
// // //       const docs = data.map((doc) => ({
// // //         id: doc.id,
// // //         name: doc.name,
// // //         url: "", // ❌ remove signed url here
// // //         type: doc.mime_type || "application/pdf",
// // //         size: 0,
// // //         file_path: doc.file_path,
// // //         uploaded_by: doc.uploaded_by,
// // //         owner_id: doc.owner_id,
// // //         created_at: doc.created_at,
// // //       }));

// // //       setDocuments(docs);
// // //     }
// // //   } catch (error) {
// // //     console.error("Error fetching documents:", error);
// // //   }
// // // };
// // //   const fetchPatientDetails = async (patientId: string) => {
// // //   try {
// // //     setLoadingPatientDetails(true);

// // //     const { data: patientData, error: patientError } = await supabase
// // //       .from("patients")
// // //       .select("*")
// // //       .eq("user_id", patientId)
// // //       .single();

// // //     if (patientError) {
// // //       console.error(patientError);
// // //       return;
// // //     }

// // //     const { data: profileData } = await supabase
// // //       .from("profiles")
// // //       .select(`
// // //         id,
// // //         user_id,
// // //         email,
// // //         phone_number,
// // //         role,
// // //         avatar_url,
// // //         first_name,
// // //         last_name
// // //       `)
// // //       .eq("user_id", patientId)
// // //       .single();

// // //     setPatientDetails({
// // //       ...patientData,
// // //       profile: profileData
// // //     });

// // //   } catch (error) {
// // //     console.error(error);
// // //   } finally {
// // //     setLoadingPatientDetails(false);
// // //   }
// // // };
// // //   const fetchDoctorDetails = async (doctorId: string) => {
// // //   try {
// // //     setLoadingPatientDetails(true);

// // //     const { data, error } = await supabase
// // //       .from("medical_professionals")
// // //       .select(`
// // //         *,
// // //         profiles:profiles!medical_professionals_user_id_fkey (
// // //           first_name,
// // //           last_name,
// // //           email,
// // //           phone_number,
// // //           avatar_url
// // //         )
// // //       `)
// // //       .eq("user_id", doctorId)
// // //       .single();

// // //     if (error) {
// // //       console.error("Error fetching doctor details:", error);
// // //       return;
// // //     }

// // //     setPatientDetails(data);

// // //   } catch (error) {
// // //     console.error(error);
// // //   } finally {
// // //     setLoadingPatientDetails(false);
// // //   }
// // // };

// // //   useEffect(() => {
// // //     if (containerRef.current) {
// // //       setContainerReady(true);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     if (
// // //       !apiKey ||
// // //       !containerReady ||
// // //       meetingInitialized.current ||
// // //       !meetingId
// // //     ) {
// // //       return;
// // //     }

// // //     const scriptSrc =
// // //       "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.34/rtc-js-prebuilt.js";
// // //     let script: HTMLScriptElement | null = null;

// // //     const initializeMeeting = () => {
// // //       try {
// // //         const meeting = new (window as any).VideoSDKMeeting();
// // //         setMeetingInstance(meeting);

// // //         const config = {
// // //           name,
// // //           meetingId: meetingId,
// // //           apiKey,
// // //           containerId: idRef.current,
// // //           micEnabled: micEnabled,
// // //           webcamEnabled: webcamEnabled,
// // //           participantCanToggleSelfWebcam: true,
// // //           participantCanToggleSelfMic: true,
// // //           screenShareEnabled: isHost,
// // //           chatEnabled: true,
// // //           raiseHandEnabled: true,
// // //           joinScreen: {
// // //             visible: true,
// // //             title: meetingTitle,
// // //           },
// // //           permissions: {
// // //             askToJoin: false,
// // //             toggleParticipantMic: isHost,
// // //             toggleParticipantWebcam: isHost,
// // //             changeLayout: true,
// // //             canCreatePoll: true,
// // //             endMeeting: isHost,
// // //           },
// // //           layout: {
// // //             type: "SIDEBAR",
// // //             priority: "PIN",
// // //             gridSize: 3,
// // //           },
// // //           whiteboardEnabled: false,
// // //           recordingEnabled: false,
// // //           liveStreamEnabled: false,
// // //           brandingEnabled: true,
// // //           brandLogoURL:
// // //             "https://thefuturemed.com/wp-content/uploads/2025/01/thefuturemed_logo.jpg",
// // //           brandName: "Room#1",
// // //           poweredBy: false,
// // //           participantId: isRejoining && sessionId ? sessionId : undefined,
// // //         };

// // //         const cleanConfig = Object.fromEntries(
// // //           Object.entries(config).filter(([_, v]) => v !== undefined)
// // //         );

// // //         if (isRejoining && sessionId) {
// // //           meeting.join(cleanConfig);
// // //         } else {
// // //           meeting.init(cleanConfig);
// // //         }

// // //         meetingInitialized.current = true;

// // //         if (meeting) {
// // //           meeting.on("meeting-joined", () => {
// // //             console.log("Meeting joined successfully");
// // //             if (isHost && documents.length > 0) {
// // //               broadcastDocuments();
// // //             }
// // //           });

// // //           meeting.on("meeting-left", () => {
// // //             console.log("Meeting left");
// // //           });

// // //           meeting.on("chat-message", (message: any) => {
// // //             if (message.data && typeof message.data === 'string') {
// // //               try {
// // //                 const parsedData = JSON.parse(message.data);
// // //                 if (parsedData.type === "DOCUMENT_UPLOADED") {
// // //                   fetchDocuments();
// // //                   toast({
// // //                     title: "New Document",
// // //                     description: `${parsedData.sender} uploaded a new document`,
// // //                   });
// // //                 }
// // //               } catch (e) {
// // //                 // Not a JSON message, ignore
// // //               }
// // //             }
// // //           });
// // //         }

// // //         setTimeout(() => {
// // //           if (!micEnabled) {
// // //             meeting?.localParticipant?.disableMic?.();
// // //           }
// // //           if (!webcamEnabled) {
// // //             meeting?.localParticipant?.disableWebcam?.();
// // //           }
// // //         }, 1000);
// // //       } catch (error) {
// // //         console.error("Error initializing VideoSDK meeting:", error);
// // //       }
// // //     };

// // //     const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
// // //     if (existingScript) {
// // //       script = existingScript as HTMLScriptElement;
// // //     } else {
// // //       script = document.createElement("script");
// // //       script.src = scriptSrc;
// // //       script.async = true;
// // //       document.body.appendChild(script);
// // //     }

// // //     if ((window as any).VideoSDKMeeting) {
// // //       initializeMeeting();
// // //       return;
// // //     }

// // //     const onScriptLoad = () => {
// // //       if ((window as any).VideoSDKMeeting) {
// // //         initializeMeeting();
// // //       }
// // //     };

// // //     script.addEventListener("load", onScriptLoad);

// // //     return () => {
// // //       if (script) {
// // //         script.removeEventListener("load", onScriptLoad);
// // //       }
// // //       onMeetingLeave();
// // //       meetingInitialized.current = false;
// // //     };
// // //   }, [
// // //     apiKey,
// // //     meetingId,
// // //     sessionId,
// // //     name,
// // //     micEnabled,
// // //     webcamEnabled,
// // //     containerId,
// // //     isHost,
// // //     onMeetingLeave,
// // //     containerReady,
// // //     meetingTitle,
// // //     isRejoining,
// // //   ]);

// // //   const broadcastDocuments = () => {
// // //     if (meetingInstance && isHost) {
// // //       meetingInstance.sendMessage(JSON.stringify({
// // //         type: "DOCUMENTS_LIST",
// // //         data: documents.map(doc => ({
// // //           id: doc.id,
// // //           name: doc.name,
// // //           type: doc.type,
// // //           uploaded_by: doc.uploaded_by
// // //         }))
// // //       }));
// // //     }
// // //   };

// // //   const EDGE_FUNCTION_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/upload-prescriptions';

// // //   const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const files = event.target.files;
// // //     if (files && files.length > 0 && appointmentId && userId) {
// // //       const file = files[0];
// // //       setUploading(true);

// // //       try {
// // //         const { data: appointmentData, error: appointmentError } = await supabase
// // //           .from('appointments')
// // //           .select('patient_id')
// // //           .eq('id', appointmentId)
// // //           .single();

// // //         if (appointmentError || !appointmentData) {
// // //           throw new Error('Could not fetch appointment details');
// // //         }

// // //         const patientId = appointmentData.patient_id;

// // //         const { data: sessionData } = await supabase.auth.getSession();
// // //         const accessToken = sessionData.session?.access_token;

// // //         if (!accessToken) {
// // //           toast({
// // //             title: "Authentication Failed",
// // //             description: "Please log in again",
// // //             variant: "destructive",
// // //           });
// // //           return;
// // //         }

// // //         const formData = new FormData();
        
// // //         formData.append("appointment_id", appointmentId);
// // //         formData.append("patient_id", patientId);
// // //         formData.append("uploaded_by", userId);
// // //         formData.append("document_type", "medical_record");
// // //         formData.append("files", file);

// // //         const response = await fetch(EDGE_FUNCTION_URL, {
// // //           method: "POST",
// // //           headers: {
// // //             Authorization: `Bearer ${accessToken}`,
// // //           },
// // //           body: formData,
// // //         });

// // //         const result = await response.json();

// // //         if (!response.ok) {
// // //           throw new Error(result.error || "Upload failed");
// // //         }

// // //         if (result.success && result.uploaded_documents && result.uploaded_documents.length > 0) {
// // //           const uploadedDoc = result.uploaded_documents[0];
          
// // //           const newDocument: DocumentFile = {
// // //             id: uploadedDoc.id,
// // //             name: file.name,
// // //             url: uploadedDoc.url || "",
// // //             type: file.type,
// // //             size: file.size,
// // //             file_path: uploadedDoc.file_path || "",
// // //             uploaded_by: userId,
// // //             owner_id: userId,
// // //             created_at: new Date().toISOString(),
// // //           };

// // //           setDocuments(prev => [newDocument, ...prev]);
          
// // //           if (meetingInstance) {
// // //             meetingInstance.sendMessage(JSON.stringify({
// // //               type: "DOCUMENT_UPLOADED",
// // //               data: {
// // //                 documentId: newDocument.id,
// // //                 documentName: newDocument.name,
// // //                 sender: name,
// // //                 timestamp: new Date().toISOString()
// // //               }
// // //             }));
// // //           }

// // //           toast({
// // //             title: "Upload Successful",
// // //             description: result.message || `${file.name} has been uploaded`,
// // //             variant: "default",
// // //           });
// // //         } else {
// // //           throw new Error("No documents were uploaded");
// // //         }

// // //       } catch (error: any) {
// // //         console.error("Error uploading document:", error);
// // //         toast({
// // //           title: "Upload Failed",
// // //           description: error.message || "An unexpected error occurred",
// // //           variant: "destructive",
// // //         });
// // //       } finally {
// // //         setUploading(false);
// // //         event.target.value = '';
// // //       }
// // //     }
// // //   };
// // //   const handleDocumentSelect = async (document: DocumentFile) => {
// // //   try {
// // //     setSelectedDocument(document);

// // //     let filePath = document.file_path;

// // //     // Remove bucket prefix
// // //     if (filePath.startsWith("patient_files/")) {
// // //       filePath = filePath.replace("patient_files/", "");
// // //     }

// // //     console.log("Final File Path:", filePath);

// // //     // Get session
// // //     const {
// // //       data: { session },
// // //       error: sessionError,
// // //     } = await supabase.auth.getSession();

// // //     const token = session?.access_token;
// // //     const currentUserId = session?.user?.id;

// // //     if (!currentUserId) {
// // //       toast({
// // //         title: "Error",
// // //         description: "User not authenticated",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     // ✅ Get user role
// // //     const { data: profileData, error: profileError } = await supabase
// // //       .from("profiles")
// // //       .select("role")
// // //       .eq("user_id", currentUserId)
// // //       .single();

// // //     if (profileError) {
// // //       console.error("Profile Error:", profileError);
// // //       toast({
// // //         title: "Error",
// // //         description: "Unable to verify user role",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     const userRole = profileData?.role;
// // //     console.log("User Role:", userRole);

// // //     // ✅ Get document ownership
// // //     const { data: documentData, error: documentError } = await supabase
// // //       .from("documents")
// // //       .select("uploaded_by, owner_id, appointment_id")
// // //       .eq("file_path", document.file_path)
// // //       .single();

// // //     if (documentError) {
// // //       console.error("Document check error:", documentError);
// // //       toast({
// // //         title: "Error",
// // //         description: "Unable to verify document access",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     const documentUploader = documentData?.uploaded_by;
// // //     const documentOwner = documentData?.owner_id;
// // //     const documentAppointmentId = documentData?.appointment_id;

// // //     console.log("Document Uploader:", documentUploader);
// // //     console.log("Document Owner:", documentOwner);
// // //     console.log("Document Appointment:", documentAppointmentId);
// // //     console.log("Current User:", currentUserId);

// // //     // ✅ Access Control
// // //     let hasAccess = false;

// // //     // Fetch appointment
// // //     const { data: appointmentData, error: appointmentError } =
// // //       await supabase
// // //         .from("appointments")
// // //         .select("patient_id, doctor_id")
// // //         .eq("id", documentAppointmentId)
// // //         .single();

// // //     if (appointmentError) {
// // //       console.error("Appointment error:", appointmentError);
// // //       toast({
// // //         title: "Error",
// // //         description: "Unable to verify appointment",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     const patientId = appointmentData?.patient_id;
// // //     const doctorId = appointmentData?.doctor_id;

// // //     console.log("Appointment Patient:", patientId);
// // //     console.log("Appointment Doctor:", doctorId);

// // //     // ✅ Doctor Access
// // //     if (userRole === "doctor") {
// // //       if (
// // //         documentUploader === currentUserId || // doctor uploaded
// // //         (doctorId === currentUserId && documentOwner === patientId) // patient document
// // //       ) {
// // //         hasAccess = true;
// // //         console.log("Doctor Access Granted");
// // //       }
// // //     }

// // //     // ✅ Patient Access
// // //     if (userRole === "patient") {
// // //       if (
// // //         documentOwner === currentUserId || // own upload
// // //         (patientId === currentUserId && documentUploader === doctorId) // doctor uploaded
// // //       ) {
// // //         hasAccess = true;
// // //         console.log("Patient Access Granted");
// // //       }
// // //     }

// // //     // ❌ Access Denied
// // //     if (!hasAccess) {
// // //       toast({
// // //         title: "Access Denied",
// // //         description: "You are not authorized to view this document",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     console.log("Access granted");

// // //     // ✅ Get Signed URL
// // //     const { data: signedUrlData, error: signedUrlError } =
// // //       await supabase.storage
// // //         .from("patient_files")
// // //         .createSignedUrl(filePath, 3600);

// // //     if (signedUrlError || !signedUrlData?.signedUrl) {
// // //       console.error("Signed URL error:", signedUrlError);

// // //       toast({
// // //         title: "Error",
// // //         description: "Unable to access document",
// // //         variant: "destructive",
// // //       });

// // //       return;
// // //     }

// // //     const finalUrl = signedUrlData.signedUrl;

// // //     console.log("Signed URL:", finalUrl);

// // //     setSelectedDocument({
// // //       ...document,
// // //       url: finalUrl,
// // //     });

// // //     // Fetch doctor/patient details
// // //     if (appointmentId) {
// // //       const { data: appointmentDetails } = await supabase
// // //         .from("appointments")
// // //         .select("patient_id, doctor_id")
// // //         .eq("id", appointmentId)
// // //         .single();

// // //       if (userRole === "doctor") {
// // //         await fetchPatientDetails(appointmentDetails?.patient_id);
// // //       } else {
// // //         await fetchDoctorDetails(appointmentDetails?.doctor_id);
// // //       }
// // //     }

// // //   } catch (error) {
// // //     console.error("Error in handleDocumentSelect:", error);

// // //     toast({
// // //       title: "Error",
// // //       description: "Failed to load document",
// // //       variant: "destructive",
// // //     });
// // //   }
// // // };
// // // // const handleDocumentSelect = async (document: DocumentFile) => {
// // // //   try {
// // // //     setSelectedDocument(document);

// // // //     let filePath = document.file_path;

// // // //     // Remove bucket prefix
// // // //     if (filePath.startsWith("patient_files/")) {
// // // //       filePath = filePath.replace("patient_files/", "");
// // // //     }

// // // //     console.log("Final File Path:", filePath);

// // // //     // Get session
// // // //     const {
// // // //       data: { session },
// // // //       error: sessionError,
// // // //     } = await supabase.auth.getSession();

// // // //     const token = session?.access_token;
// // // //     const currentUserId = session?.user?.id;

// // // //     if (!currentUserId) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "User not authenticated",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     // ✅ Get user role from profiles table
// // // //     const { data: profileData, error: profileError } = await supabase
// // // //       .from("profiles")
// // // //       .select("role")
// // // //       .eq("user_id", currentUserId)
// // // //       .single();

// // // //     if (profileError) {
// // // //       console.error("Profile Error:", profileError);
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to verify user role",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     const userRole = profileData?.role;
// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Get document ownership details
// // // //     const { data: documentData, error: documentError } = await supabase
// // // //       .from("documents")
// // // //       .select("uploaded_by, owner_id, appointment_id")
// // // //       .eq("file_path", document.file_path)
// // // //       .single();

// // // //     if (documentError) {
// // // //       console.error("Document check error:", documentError);
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to verify document access",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     const documentUploader = documentData?.uploaded_by;
// // // //     const documentOwner = documentData?.owner_id;
// // // //     const documentAppointmentId = documentData?.appointment_id;

// // // //     console.log("Document Uploader:", documentUploader);
// // // //     console.log("Document Owner:", documentOwner);
// // // //     console.log("Current User:", currentUserId);
// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Check if user has access to this document
// // // //     let hasAccess = false;

// // // //     if (userRole === "doctor") {
// // // //       // Doctor can view if:
// // // //       // 1. They uploaded the document (their own uploads), OR
// // // //       // 2. The document belongs to a patient they're consulting with (patient_id matches)
      
// // // //       if (documentUploader === currentUserId) {
// // // //         // Doctor uploaded this document
// // // //         hasAccess = true;
// // // //         console.log("Doctor access - Own upload");
// // // //       } else {
// // // //         // Get the patient_id from the appointment
// // // //         const { data: appointmentData } = await supabase
// // // //           .from("appointments")
// // // //           .select("patient_id")
// // // //           .eq("id", appointmentId)
// // // //           .single();
        
// // // //         const patientId = appointmentData?.patient_id;
        
// // // //         // Check if the document belongs to this patient
// // // //         if (documentOwner === patientId) {
// // // //           hasAccess = true;
// // // //           console.log("Doctor access - Patient document:", patientId);
// // // //         }
// // // //       }
// // // //     } else if (userRole === "patient") {
// // // //       // Patient can only view their own documents
// // // //       hasAccess = documentOwner === currentUserId;
// // // //       console.log("Patient access - Own documents only:", hasAccess);
// // // //     }

// // // //     if (!hasAccess) {
// // // //       toast({
// // // //         title: "Access Denied",
// // // //         description: userRole === "doctor" 
// // // //           ? "You are not authorized to view this patient's document"
// // // //           : "You can only view your own documents",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     console.log("Access granted - User is authorized to view this document");

// // // //     // Get signed URL - THIS IS A GET REQUEST, NOT POST
// // // //     const { data: signedUrlData, error: signedUrlError } =
// // // //       await supabase.storage
// // // //         .from("patient_files")
// // // //         .createSignedUrl(filePath, 3600);

// // // //     if (signedUrlError || !signedUrlData?.signedUrl) {
// // // //       console.error("Signed URL error:", signedUrlError);

// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to access document",
// // // //         variant: "destructive",
// // // //       });

// // // //       return;
// // // //     }

// // // //     // ✅ IMPORTANT: Use the signed URL as-is without adding any parameters
// // // //     // The signed URL already contains all necessary authentication
// // // //     const finalUrl = signedUrlData.signedUrl;
// // // //     console.log("Final URL (GET request):", finalUrl);

// // // //     setSelectedDocument({
// // // //       ...document,
// // // //       url: finalUrl,
// // // //     });

// // // //     // Fetch appointment data for patient/doctor details display
// // // //     if (appointmentId) {
// // // //       const { data: appointmentData } = await supabase
// // // //         .from("appointments")
// // // //         .select("patient_id, doctor_id")
// // // //         .eq("id", appointmentId)
// // // //         .single();

// // // //       if (userRole === "doctor") {
// // // //         // Pass the patient_id to fetch patient details
// // // //         await fetchPatientDetails(appointmentData?.patient_id);
// // // //       } else {
// // // //         // For patient, fetch doctor details using the doctor_id from appointment
// // // //         await fetchDoctorDetails(appointmentData?.doctor_id);
// // // //       }
// // // //     }

// // // //   } catch (error) {
// // // //     console.error("Error in handleDocumentSelect:", error);

// // // //     toast({
// // // //       title: "Error",
// // // //       description: "Failed to load document",
// // // //       variant: "destructive",
// // // //     });
// // // //   }
// // // // };

// // // //   const handleDocumentSelect = async (document: DocumentFile) => {
// // // //   try {
// // // //     setSelectedDocument(document);

// // // //     let filePath = document.file_path;

// // // //     // Remove bucket prefix
// // // //     if (filePath.startsWith("patient_files/")) {
// // // //       filePath = filePath.replace("patient_files/", "");
// // // //     }

// // // //     console.log("Final File Path:", filePath);

// // // //     // Get session
// // // //     const {
// // // //       data: { session },
// // // //       error: sessionError,
// // // //     } = await supabase.auth.getSession();

// // // //     const token = session?.access_token;
// // // //     const currentUserId = session?.user?.id;

// // // //     if (!currentUserId) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "User not authenticated",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     // ✅ Get user role from profiles table
// // // //     const { data: profileData, error: profileError } = await supabase
// // // //       .from("profiles")
// // // //       .select("role")
// // // //       .eq("user_id", currentUserId)
// // // //       .single();

// // // //     if (profileError) {
// // // //       console.error("Profile Error:", profileError);
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to verify user role",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     const userRole = profileData?.role;
// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Get document ownership details
// // // //     const { data: documentData, error: documentError } = await supabase
// // // //       .from("documents")
// // // //       .select("uploaded_by, owner_id, appointment_id")
// // // //       .eq("file_path", document.file_path)
// // // //       .single();

// // // //     if (documentError) {
// // // //       console.error("Document check error:", documentError);
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to verify document access",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     const documentUploader = documentData?.uploaded_by;
// // // //     const documentOwner = documentData?.owner_id;
// // // //     const documentAppointmentId = documentData?.appointment_id;

// // // //     console.log("Document Uploader:", documentUploader);
// // // //     console.log("Document Owner:", documentOwner);
// // // //     console.log("Current User:", currentUserId);
// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Check if user has access to this document
// // // //     let hasAccess = false;

// // // //     if (userRole === "doctor") {
// // // //       // Doctor can view if:
// // // //       // 1. They uploaded the document (their own uploads), OR
// // // //       // 2. The document belongs to a patient they're consulting with
      
// // // //       if (documentUploader === currentUserId) {
// // // //         // Doctor uploaded this document
// // // //         hasAccess = true;
// // // //         console.log("Doctor access - Own upload");
// // // //       } else if (documentAppointmentId && appointmentId === documentAppointmentId) {
// // // //         // Document belongs to the current appointment
// // // //         hasAccess = true;
// // // //         console.log("Doctor access - Patient document from current appointment");
// // // //       } else {
// // // //         // Additional check: verify if this patient is associated with this doctor
// // // //         const { data: appointmentCheck } = await supabase
// // // //           .from("appointments")
// // // //           .select("doctor_id")
// // // //           .eq("id", documentAppointmentId)
// // // //           .single();
          
// // // //         if (appointmentCheck?.doctor_id === currentUserId) {
// // // //           hasAccess = true;
// // // //           console.log("Doctor access - Patient assigned to this doctor");
// // // //         }
// // // //       }
// // // //     } else if (userRole === "patient") {
// // // //       // Patient can only view their own documents (owner_id matches their ID)
// // // //       hasAccess = documentOwner === currentUserId;
// // // //       console.log("Patient access - Own documents only:", hasAccess);
// // // //     }

// // // //     if (!hasAccess) {
// // // //       toast({
// // // //         title: "Access Denied",
// // // //         description: userRole === "doctor" 
// // // //           ? "You are not authorized to view this patient's document"
// // // //           : "You can only view your own documents",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     console.log("Access granted - User is authorized to view this document");

// // // //     // Get signed URL
// // // //     const { data: signedUrlData, error: signedUrlError } =
// // // //       await supabase.storage
// // // //         .from("patient_files")
// // // //         .createSignedUrl(filePath, 3600);

// // // //     if (signedUrlError || !signedUrlData?.signedUrl) {
// // // //       console.error("Signed URL error:", signedUrlError);

// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to access document",
// // // //         variant: "destructive",
// // // //       });

// // // //       return;
// // // //     }

// // // //     let finalUrl = signedUrlData.signedUrl;

// // // //     // ✅ Add token for doctor access
// // // //     if (userRole === "doctor" && token) {
// // // //       finalUrl = `${signedUrlData.signedUrl}&access_token=${token}`;
// // // //       console.log("Doctor Access with Token");
// // // //     }

// // // //     // ✅ Patient without token (or with token if needed)
// // // //     if (userRole === "patient") {
// // // //       finalUrl = signedUrlData.signedUrl;
// // // //       console.log("Patient Access without Token");
// // // //     }

// // // //     setSelectedDocument({
// // // //       ...document,
// // // //       url: finalUrl,
// // // //     });

// // // //     // Fetch appointment data for patient/doctor details display
// // // //     if (appointmentId) {
// // // //       const { data: appointmentData } = await supabase
// // // //         .from("appointments")
// // // //         .select("patient_id, doctor_id")
// // // //         .eq("id", appointmentId)
// // // //         .single();

// // // //       if (userRole === "doctor") {
// // // //         await fetchPatientDetails(appointmentData?.patient_id);
// // // //       } else {
// // // //         await fetchDoctorDetails(appointmentData?.patient_id);
// // // //       }
// // // //     }

// // // //   } catch (error) {
// // // //     console.error("Error in handleDocumentSelect:", error);

// // // //     toast({
// // // //       title: "Error",
// // // //       description: "Failed to load document",
// // // //       variant: "destructive",
// // // //     });
// // // //   }
// // // // };

// // // // const handleDocumentSelect = async (document: DocumentFile) => {
// // // //   try {
// // // //     setSelectedDocument(document);

// // // //     let filePath = document.file_path;

// // // //     // Remove bucket prefix
// // // //     if (filePath.startsWith("patient_files/")) {
// // // //       filePath = filePath.replace("patient_files/", "");
// // // //     }

// // // //     console.log("Final File Path:", filePath);

// // // //     // Get session
// // // //     const {
// // // //       data: { session },
// // // //       error: sessionError,
// // // //     } = await supabase.auth.getSession();

// // // //     const token = session?.access_token;
// // // //     const userId = session?.user?.id;

// // // //     if (!userId) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "User not authenticated",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     // ✅ Get user role from profiles table
// // // //     const { data: profileData, error: profileError } = await supabase
// // // //       .from("profiles")
// // // //       .select("role")
// // // //       .eq("user_id", userId)
// // // //       .single();

// // // //     if (profileError) {
// // // //       console.error("Profile Error:", profileError);
// // // //     }

// // // //     const userRole = profileData?.role;

// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Check document ownership for both doctor and patient
// // // //     const { data: documentData, error: documentError } = await supabase
// // // //       .from("documents")
// // // //       .select("uploaded_by, owner_id")
// // // //       .eq("file_path", document.file_path)
// // // //       .single();

// // // //     if (documentError) {
// // // //       console.error("Document check error:", documentError);
// // // //     }

// // // //     const documentUploader = documentData?.uploaded_by;
// // // //     const documentOwner = documentData?.owner_id;

// // // //     console.log("Document Uploader:", documentUploader);
// // // //     console.log("Document Owner:", documentOwner);
// // // //     console.log("Current User:", userId);
// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Condition: Allow access based on role and ownership
// // // //     let hasAccess = false;

// // // //     if (userRole === "doctor") {
// // // //       // Doctors can view documents if they are the uploader OR the patient is the owner
// // // //       hasAccess = documentUploader === userId || documentOwner !== null;
// // // //       console.log("Doctor access - Can view patient documents");
// // // //     } else if (userRole === "patient") {
// // // //       // Patients can only view their own documents (owner_id matches their ID)
// // // //       hasAccess = documentOwner === userId;
// // // //       console.log("Patient access - Only own documents");
// // // //     }

// // // //     if (!hasAccess) {
// // // //       toast({
// // // //         title: "Access Denied",
// // // //         description: userRole === "doctor" 
// // // //           ? "You are not authorized to view this patient's document"
// // // //           : "You can only view your own documents",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     console.log("Access granted");

// // // //     // Get signed URL
// // // //     const { data: signedUrlData, error: signedUrlError } =
// // // //       await supabase.storage
// // // //         .from("patient_files")
// // // //         .createSignedUrl(filePath, 3600);

// // // //     if (signedUrlError || !signedUrlData?.signedUrl) {
// // // //       console.error("Signed URL error:", signedUrlError);

// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to access document",
// // // //         variant: "destructive",
// // // //       });

// // // //       return;
// // // //     }

// // // //     let finalUrl = signedUrlData.signedUrl;

// // // //     // ✅ Add token only for doctor
// // // //     if (userRole === "doctor" && token) {
// // // //       finalUrl = `${signedUrlData.signedUrl}&access_token=${token}`;
// // // //       console.log("Doctor Access with Token");
// // // //     }

// // // //     // ✅ Patient without token
// // // //     if (userRole === "patient") {
// // // //       finalUrl = signedUrlData.signedUrl;
// // // //       console.log("Patient Access without Token");
// // // //     }

// // // //     setSelectedDocument({
// // // //       ...document,
// // // //       url: finalUrl,
// // // //     });

// // // //     // Fetch appointment data
// // // //     if (appointmentId) {
// // // //       const { data: appointmentData } = await supabase
// // // //         .from("appointments")
// // // //         .select("patient_id, doctor_id")
// // // //         .eq("id", appointmentId)
// // // //         .single();

// // // //       if (userRole === "doctor") {
// // // //         await fetchPatientDetails(appointmentData?.patient_id);
// // // //       } else {
// // // //         await fetchDoctorDetails(appointmentData?.doctor_id);
// // // //       }
// // // //     }

// // // //   } catch (error) {
// // // //     console.error(error);

// // // //     toast({
// // // //       title: "Error",
// // // //       description: "Failed to load document",
// // // //       variant: "destructive",
// // // //     });
// // // //   }
// // // // };


// // // // const handleDocumentSelect = async (document: DocumentFile) => {
// // // //   try {
// // // //     setSelectedDocument(document);

// // // //     let filePath = document.file_path;

// // // //     // Remove bucket prefix
// // // //     if (filePath.startsWith("patient_files/")) {
// // // //       filePath = filePath.replace("patient_files/", "");
// // // //     }

// // // //     console.log("Final File Path:", filePath);

// // // //     // Get session
// // // //     const {
// // // //       data: { session },
// // // //       error: sessionError,
// // // //     } = await supabase.auth.getSession();

// // // //     const token = session?.access_token;
// // // //     const userId = session?.user?.id;

// // // //     if (!userId) {
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "User not authenticated",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     // ✅ Get user role from profiles table
// // // //     const { data: profileData, error: profileError } = await supabase
// // // //       .from("profiles")
// // // //       .select("role")
// // // //       .eq("user_id", userId)
// // // //       .single();

// // // //     if (profileError) {
// // // //       console.error("Profile Error:", profileError);
// // // //     }

// // // //     const userRole = profileData?.role;

// // // //     console.log("User Role:", userRole);

// // // //     // ✅ Check document ownership for both doctor and patient
// // // //     const { data: documentData, error: documentError } = await supabase
// // // //       .from("documents")
// // // //       .select("uploaded_by, owner_id")
// // // //       .eq("file_path", document.file_path)
// // // //       .single();

// // // //     if (documentError) {
// // // //       console.error("Document check error:", documentError);
// // // //     }

// // // //     const documentUploader = documentData?.uploaded_by;
// // // //     const documentOwner = documentData?.owner_id;

// // // //     console.log("Document Uploader:", documentUploader);
// // // //     console.log("Document Owner:", documentOwner);
// // // //     console.log("Current User:", userId);

// // // //     // ✅ Condition: Allow access if user is either the uploader (doctor) OR the owner (patient)
// // // //     const hasAccess = documentUploader === userId || documentOwner === userId;

// // // //     if (!hasAccess) {
// // // //       toast({
// // // //         title: "Access Denied",
// // // //         description: "You are not authorized to view this document",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     console.log("Access granted - User is either uploader or owner");

// // // //     // Get signed URL
// // // //     const { data: signedUrlData, error: signedUrlError } =
// // // //       await supabase.storage
// // // //         .from("patient_files")
// // // //         .createSignedUrl(filePath, 3600);

// // // //     if (signedUrlError || !signedUrlData?.signedUrl) {
// // // //       console.error("Signed URL error:", signedUrlError);

// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Unable to access document",
// // // //         variant: "destructive",
// // // //       });

// // // //       return;
// // // //     }

// // // //     let finalUrl = signedUrlData.signedUrl;

// // // //     // ✅ Add token only for doctor
// // // //     if (userRole === "doctor" && token) {
// // // //       finalUrl = `${signedUrlData.signedUrl}&access_token=${token}`;
// // // //       console.log("Doctor Access with Token");
// // // //     }

// // // //     // ✅ Patient without token
// // // //     if (userRole === "patient") {
// // // //       finalUrl = signedUrlData.signedUrl;
// // // //       console.log("Patient Access without Token");
// // // //     }

// // // //     setSelectedDocument({
// // // //       ...document,
// // // //       url: finalUrl,
// // // //     });

// // // //     // Fetch appointment data
// // // //     if (appointmentId) {
// // // //       const { data: appointmentData } = await supabase
// // // //         .from("appointments")
// // // //         .select("patient_id, doctor_id")
// // // //         .eq("id", appointmentId)
// // // //         .single();

// // // //       if (userRole === "doctor") {
// // // //         await fetchPatientDetails(appointmentData?.patient_id);
// // // //       } else {
// // // //         await fetchDoctorDetails(appointmentData?.doctor_id);
// // // //       }
// // // //     }

// // // //   } catch (error) {
// // // //     console.error(error);

// // // //     toast({
// // // //       title: "Error",
// // // //       description: "Failed to load document",
// // // //       variant: "destructive",
// // // //     });
// // // //   }
// // // // };
// // // const handleCloseDocument = () => {
// // //     setSelectedDocument(null);
// // //     setPatientDetails(null);
// // //   };

// // // //   const renderDocumentViewer = (document: DocumentFile) => {
// // // //   // ✅ Only render PDF files
// // // //   if (
// // // //     document.type?.includes("pdf") ||
// // // //     document.name?.toLowerCase().endsWith(".pdf")
// // // //   ) {
// // // //     return (
// // // //       <div style={styles.documentViewer}>
// // // //         <iframe
// // // //           src={document.url}
// // // //           title={document.name}
// // // //           style={styles.documentIframe}
// // // //           // ✅ Remove sandbox to allow PDF loading
// // // //           // sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
// // // //         />
// // // //       </div>
// // // //     );
// // // //   }
// // // //   // ✅ For non-PDF files, show message without image preview or download link
// // // //   else {
// // // //     return (
// // // //       <div style={styles.documentViewer}>
// // // //         <div style={styles.placeholderMessage}>
// // // //           <p>📄 {document.name}</p>
// // // //           <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
// // // //             Preview only available for PDF files
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }
// // // // };
// // // const renderDocumentViewer = (document: DocumentFile) => {
// // //   const isPDF =
// // //     document.type?.includes("pdf") ||
// // //     document.name?.toLowerCase().endsWith(".pdf");

// // //   const isImage =
// // //     document.type?.includes("image") ||
// // //     document.name?.toLowerCase().endsWith(".png") ||
// // //     document.name?.toLowerCase().endsWith(".jpg") ||
// // //     document.name?.toLowerCase().endsWith(".jpeg");

// // //   // PDF Viewer
// // //   if (isPDF) {
// // //     return (
// // //       <div style={styles.documentViewer}>
// // //         <iframe
// // //           src={`${document.url}#toolbar=0`}
// // //           title={document.name}
// // //           style={styles.documentIframe}
// // //         />
// // //       </div>
// // //     );
// // //   }

// // //   // Image Viewer (PNG / JPG)
// // //   if (isImage) {
// // //     return (
// // //       <div style={styles.documentViewer}>
// // //         <img
// // //           src={document.url}
// // //           alt={document.name}
// // //           style={{
// // //             width: "100%",
// // //             height: "100%",
// // //             objectFit: "contain",
// // //             borderRadius: "8px",
// // //           }}
// // //         />
// // //       </div>
// // //     );
// // //   }

// // //   // Fallback
// // //   return (
// // //     <div style={styles.documentViewer}>
// // //       <div style={styles.placeholderMessage}>
// // //         <p>📄 {document.name}</p>
// // //         <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
// // //           Preview only available for PDF & Images
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // //   const handleScreenShare = async () => {
// // //     try {
// // //       if (meetingInstance) {
// // //         if (!isSharingScreen) {
// // //           const screenShareStream = await navigator.mediaDevices.getDisplayMedia({
// // //             video: true,
// // //             audio: false,
// // //           });
          
// // //           const screenShareTrack = screenShareStream.getVideoTracks()[0];
// // //           meetingInstance?.localParticipant?.shareScreen(screenShareTrack);
// // //           setIsSharingScreen(true);
          
// // //           screenShareTrack.onended = () => {
// // //             handleScreenShare();
// // //           };
// // //         } else {
// // //           meetingInstance?.localParticipant?.stopShareScreen();
// // //           setIsSharingScreen(false);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Error sharing screen:", error);
// // //     }
// // //   };

// // //   return (
// // //     <div style={styles.container}>
// // //       {enableDocumentSharing && (
// // //         <div style={styles.topBar}>
// // //           <div style={styles.topBarLeft}>
// // //             <button
// // //               onClick={() => setShowDocumentSidebar(!showDocumentSidebar)}
// // //               style={styles.topBarButton}
// // //             >
// // //               📄 Documents ({documents.length})
// // //             </button>
// // //             {userRole === "doctor" && (
// // //               <>
// // //                 <label style={styles.uploadButton}>
// // //                   {uploading ? "📤 Uploading..." : "📤 Upload Document"}
// // //                   <input
// // //                     type="file"
// // //                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
// // //                     onChange={handleDocumentUpload}
// // //                     style={styles.hiddenInput}
// // //                     disabled={uploading}
// // //                   />
// // //                 </label>
// // //               </>
// // //             )}
// // //           </div>
// // //           <div style={styles.topBarRight}>
// // //             <span style={styles.meetingTitle}>{meetingTitle}</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {showDocumentSidebar && (
// // //         <div style={styles.sidebar}>
// // //           <div style={styles.sidebarHeader}>
// // //             <h4 style={styles.sidebarTitle}>Documents</h4>
// // //             <button
// // //               onClick={() => setShowDocumentSidebar(false)}
// // //               style={styles.closeButton}
// // //             >
// // //               ×
// // //             </button>
// // //           </div>
// // //           <div style={styles.documentList}>
// // //             {documents.length === 0 ? (
// // //               <div style={styles.emptyMessage}>
// // //                 <p>No documents uploaded yet</p>
// // //                 {userRole === "doctor" && (
// // //                   <p style={{ fontSize: "10px", marginTop: "5px" }}>
// // //                     Click the Upload button to share documents
// // //                   </p>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               documents.map((doc) => (
// // //                 <div
// // //                   key={doc.id}
// // //                   style={styles.documentItem}
// // //                   onClick={() => handleDocumentSelect(doc)}
// // //                 >
// // //                   <div style={styles.documentIcon}>
// // //                     {doc.type?.includes('pdf') ? '📄' : 
// // //                      doc.type?.includes('image') ? '🖼️' : '📁'}
// // //                   </div>
// // //                   <div style={styles.documentInfo}>
// // //                     <div style={styles.documentName}>{doc.name}</div>
// // //                   </div>
// // //                 </div>
// // //               ))
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div
// // //         ref={containerRef}
// // //         id={idRef.current}
// // //         style={{
// // //           flex: 1,
// // //           minHeight: 0,
// // //           backgroundColor: "#f0f0f0",
// // //           position: "relative",
// // //           ...style,
// // //         }}
// // //       />

// // //       {selectedDocument && (
// // //         <div style={styles.documentPopup}>
// // //           <div style={styles.documentPopupHeader}>
// // //             <div style={styles.documentPopupTitleContainer}>
// // //               <h3 style={styles.documentPopupTitle}>{selectedDocument.name}</h3>
// // //             </div>
// // //             <button
// // //               onClick={handleCloseDocument}
// // //               style={styles.closePopupButton}
// // //             >
// // //               ×
// // //             </button>
// // //           </div>
          
          
          
// // //           <div style={styles.documentPopupContent}>
// // //             {loadingPatientDetails ? (
// // //               <div style={styles.loadingContainer}>
// // //                 <p>Loading patient details...</p>
// // //               </div>
// // //             ) : (
// // //               <>
// // //               {patientDetails && !loadingPatientDetails && (
// // //             <div style={styles.patientDetailsSection}>
// // //               <div style={styles.patientDetailsHeader}>
// // // <strong>
// // // {userRole === "doctor" ? "Patient Information" : "Doctor Information"}
// // // </strong>              </div>
// // //               <div style={styles.patientDetailItem}>
// // //   <span style={styles.detailLabel}>Name:</span>
// // //   <span>
// // //     {userRole === "doctor"
// // //       ? `${patientDetails.profile?.first_name} ${patientDetails.profile?.last_name}`
// // //       : `${patientDetails.profiles?.first_name} ${patientDetails.profiles?.last_name}`
// // //     }
// // //   </span>
// // // </div>

// // // <div style={styles.patientDetailItem}>
// // //   <span style={styles.detailLabel}>Email:</span>
// // //   <span>
// // //     {userRole === "doctor"
// // //       ? patientDetails.profile?.email
// // //       : patientDetails.profiles?.email
// // //     }
// // //   </span>
// // // </div>

// // // <div style={styles.patientDetailItem}>
// // //   <span style={styles.detailLabel}>Phone:</span>
// // //   <span>
// // //     {userRole === "doctor"
// // //       ? patientDetails.profile?.phone_number
// // //       : patientDetails.profiles?.phone_number
// // //     }
// // //   </span>
// // // </div>

// // // {(patientDetails.profile?.date_of_birth || patientDetails.profiles?.date_of_birth) && (
// // //   <div style={styles.patientDetailItem}>
// // //     <span style={styles.detailLabel}>Date of Birth:</span>
// // //     <span>
// // //       {new Date(
// // //         userRole === "doctor"
// // //           ? patientDetails.profile?.date_of_birth
// // //           : patientDetails.profiles?.date_of_birth
// // //       ).toLocaleDateString()}
// // //     </span>
// // //   </div>
// // // )}

// // // {(patientDetails.profile?.gender || patientDetails.profiles?.gender) && (
// // //   <div style={styles.patientDetailItem}>
// // //     <span style={styles.detailLabel}>Gender:</span>
// // //     <span>
// // //       {userRole === "doctor"
// // //         ? patientDetails.profile?.gender
// // //         : patientDetails.profiles?.gender
// // //       }
// // //     </span>
// // //   </div>
// // // )}
// // // </div>

            
// // //           )}
// // // {renderDocumentViewer(selectedDocument)}           
// // //    </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const styles: { [key: string]: React.CSSProperties } = {
// // //   container: {
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     height: "100vh",
// // //     position: "relative"
// // //   },
// // //   topBar: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     padding: "10px 20px",
// // //     backgroundColor: "#2c3e50",
// // //     color: "white",
// // //     zIndex: 100,
// // //     boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
// // //   },
// // //   topBarLeft: {
// // //     display: "flex",
// // //     gap: "10px"
// // //   },
// // //   topBarRight: {
// // //     display: "flex",
// // //     alignItems: "center"
// // //   },
// // //   meetingTitle: {
// // //     fontSize: "16px",
// // //     fontWeight: "500"
// // //   },
// // //   topBarButton: {
// // //     padding: "8px 16px",
// // //     backgroundColor: "#3498db",
// // //     color: "white",
// // //     border: "none",
// // //     borderRadius: "4px",
// // //     cursor: "pointer",
// // //     fontSize: "14px",
// // //     transition: "background-color 0.3s"
// // //   },
// // //   uploadButton: {
// // //     padding: "8px 16px",
// // //     backgroundColor: "#27ae60",
// // //     color: "white",
// // //     border: "none",
// // //     borderRadius: "4px",
// // //     cursor: "pointer",
// // //     fontSize: "14px",
// // //     display: "inline-block"
// // //   },
// // //   hiddenInput: {
// // //     display: "none"
// // //   },
// // //   sidebar: {
// // //     position: "fixed",
// // //     right: 0,
// // //     top: 60,
// // //     width: "250px",
// // //     height: "calc(100vh - 60px)",
// // //     backgroundColor: "white",
// // //     boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
// // //     zIndex: 200,
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     overflow: "hidden"
// // //   },
// // //   sidebarHeader: {
// // //     padding: "15px",
// // //     backgroundColor: "#f8f9fa",
// // //     borderBottom: "1px solid #dee2e6",
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center"
// // //   },
// // //   sidebarTitle: {
// // //     margin: 0,
// // //     fontSize: "16px",
// // //     fontWeight: "500"
// // //   },
// // //   closeButton: {
// // //     background: "none",
// // //     border: "none",
// // //     fontSize: "20px",
// // //     cursor: "pointer",
// // //     color: "#6c757d",
// // //     padding: "5px",
// // //     width: "30px",
// // //     height: "30px",
// // //     display: "flex",
// // //     alignItems: "center",
// // //     justifyContent: "center"
// // //   },
// // //   documentList: {
// // //     flex: 1,
// // //     overflowY: "auto",
// // //     padding: "10px"
// // //   },
// // //   documentItem: {
// // //     display: "flex",
// // //     alignItems: "center",
// // //     gap: "10px",
// // //     padding: "10px",
// // //     marginBottom: "8px",
// // //     cursor: "pointer",
// // //     borderRadius: "8px",
// // //     transition: "background-color 0.3s",
// // //     backgroundColor: "#f8f9fa",
// // //     border: "1px solid #e9ecef"
// // //   },
// // //   documentIcon: {
// // //     fontSize: "24px"
// // //   },
// // //   documentInfo: {
// // //     flex: 1
// // //   },
// // //   documentName: {
// // //     fontSize: "12px",
// // //     fontWeight: "500",
// // //     overflow: "hidden",
// // //     textOverflow: "ellipsis",
// // //     whiteSpace: "nowrap"
// // //   },
// // //   emptyMessage: {
// // //     textAlign: "center",
// // //     padding: "20px",
// // //     fontSize: "12px",
// // //     color: "#6c757d"
// // //   },
// // //   documentPopup: {
// // //     position: "fixed",
// // //     top: "50%",
// // //     left: "50%",
// // //     transform: "translate(-50%, -50%)",
// // //     width: "80%",
// // //     maxWidth: "1000px",
// // //     height: "80%",
// // //     backgroundColor: "white",
// // //     borderRadius: "8px",
// // //     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
// // //     zIndex: 300,
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     overflow: "hidden"
// // //   },
// // //   documentPopupHeader: {
// // //     padding: "15px 20px",
// // //     backgroundColor: "#f8f9fa",
// // //     borderBottom: "1px solid #dee2e6",
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center"
// // //   },
// // //   documentPopupTitleContainer: {
// // //     flex: 1
// // //   },
// // //   documentPopupTitle: {
// // //     margin: 0,
// // //     fontSize: "16px",
// // //     fontWeight: "500"
// // //   },
// // //   closePopupButton: {
// // //     background: "none",
// // //     border: "none",
// // //     fontSize: "24px",
// // //     cursor: "pointer",
// // //     color: "#6c757d",
// // //     width: "30px",
// // //     height: "30px",
// // //     display: "flex",
// // //     alignItems: "center",
// // //     justifyContent: "center"
// // //   },
// // //   documentPopupContent: {
// // //     flex: 1,
// // //     overflow: "auto",
// // //     padding: "20px"
// // //   },
// // //   documentViewer: {
// // //     width: "100%",
// // //     height: "100%",
// // //     display: "flex",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: "#f5f5f5"
// // //   },
// // //   documentImage: {
// // //     maxWidth: "100%",
// // //     maxHeight: "100%",
// // //     objectFit: "contain"
// // //   },
// // //   documentIframe: {
// // //     width: "100%",
// // //     height: "100%",
// // //     border: "none"
// // //   },
// // //   placeholderMessage: {
// // //     textAlign: "center",
// // //     padding: "20px"
// // //   },
// // //   downloadLink: {
// // //     color: "#007bff",
// // //     textDecoration: "underline",
// // //     cursor: "pointer"
// // //   },
// // //   patientDetailsSection: {
// // //     padding: "15px 20px",
// // //     backgroundColor: "#f8f9fa",
// // //     borderBottom: "1px solid #dee2e6"
// // //   },
// // //   patientDetailsHeader: {
// // //     marginBottom: "10px",
// // //     fontSize: "14px",
// // //     color: "#495057"
// // //   },
// // //   patientDetailsGrid: {
// // //     display: "grid",
// // //     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
// // //     gap: "8px",
// // //     fontSize: "13px"
// // //   },
// // //   patientDetailItem: {
// // //     display: "flex",
// // //     gap: "8px"
// // //   },
// // //   detailLabel: {
// // //     fontWeight: "500",
// // //     color: "#6c757d",
// // //     minWidth: "90px"
// // //   },
// // //   loadingContainer: {
// // //     display: "flex",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     height: "100%"
// // //   }
// // // };

// // // export default VideoMeeting;


// // import { useEffect, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { supabase } from "@/integrations/supabase/client";
// // import { toast } from "@/hooks/use-toast";
// // import Loader2 from "./ui/Loader2";

// // export interface VideoMeetingProps {
// //   apiKey: string;
// //   meetingId: string;
// //   sessionId?: string;
// //   name: string;
// //   micEnabled?: boolean;
// //   webcamEnabled?: boolean;
// //   containerId?: string | null;
// //   isHost?: boolean;
// //   onMeetingLeave?: () => void;
// //   style?: React.CSSProperties;
// //   meetingTitle?: string;
// //   isRejoining?: boolean;
// //   enableDocumentSharing?: boolean;
// //   appointmentId?: string;
// //   userId?: string;
// //   userRole?: "doctor" | "patient";
// // }

// // interface DocumentFile {
// //   id: string;
// //   name: string;
// //   url: string;
// //   type: string;
// //   size: number;
// //   file_path: string;
// //   uploaded_by: string;
// //   owner_id: string;
// //   created_at: string;
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
// //   isRejoining,
// //   enableDocumentSharing = true,
// //   appointmentId,
// //   userId,
// //   userRole = "patient",
// // }: VideoMeetingProps) => {
// //   const navigate = useNavigate();
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const meetingInitialized = useRef(false);
// //   const [containerReady, setContainerReady] = useState(false);
// //   const [showDocumentSidebar, setShowDocumentSidebar] = useState(false);
// //   const [documents, setDocuments] = useState<DocumentFile[]>([]);
// //   const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
// //   const [isSharingScreen, setIsSharingScreen] = useState(false);
// //   const [meetingInstance, setMeetingInstance] = useState<any>(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [patientDetails, setPatientDetails] = useState<any>(null);
// //   const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  
// //   const idRef = useRef(
// //     containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
// //   );

// //   // Fetch documents from Supabase when meeting starts
// //   useEffect(() => {
// //     if (appointmentId && enableDocumentSharing) {
// //       fetchDocuments();
// //     }
// //   }, [appointmentId]);

// //   const fetchDocuments = async () => {
// //     try {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) return;

// //       // Get user role
// //       const { data: profileData } = await supabase
// //         .from("profiles")
// //         .select("role")
// //         .eq("user_id", user.id)
// //         .single();

// //       const currentUserRole = profileData?.role;
      
// //       let query = supabase
// //         .from("documents")
// //         .select("*")
// //         .eq("appointment_id", appointmentId)
// //         .order("created_at", { ascending: false });

// //       // PATIENT: Only show their own documents
// //       if (currentUserRole === "patient") {
// //         query = query.eq("owner_id", user.id);
// //         console.log("Patient filter: showing only own documents");
// //       }
// //       // DOCTOR: Only show documents from the patient they are consulting with
// //       else if (currentUserRole === "doctor") {
// //         const { data: appointmentData } = await supabase
// //           .from("appointments")
// //           .select("patient_id")
// //           .eq("id", appointmentId)
// //           .single();
        
// //         const patientId = appointmentData?.patient_id;
// //         if (patientId) {
// //           query = query.eq("owner_id", patientId);
// //           console.log("Doctor filter: showing documents for patient:", patientId);
// //         }
// //       }

// //       const { data, error } = await query;

// //       if (error) {
// //         console.error("Error fetching documents:", error);
// //         return;
// //       }

// //       if (data) {
// //         const docs = data.map((doc) => ({
// //           id: doc.id,
// //           name: doc.name,
// //           url: "",
// //           type: doc.mime_type || "application/pdf",
// //           size: 0,
// //           file_path: doc.file_path,
// //           uploaded_by: doc.uploaded_by,
// //           owner_id: doc.owner_id,
// //           created_at: doc.created_at,
// //             tags: doc.tags || [], // Add tags for categorization
// //   ai_summary: doc.ai_summary || "Not available", // Add AI-generated summary

// //         }));

// //         setDocuments(docs);
// //         console.log(`Fetched ${docs.length} documents for ${currentUserRole}`);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching documents:", error);
// //     }
// //   };

// //   const fetchPatientDetails = async (patientId: string) => {
// //     try {
// //       setLoadingPatientDetails(true);

// //       const { data: patientData, error: patientError } = await supabase
// //         .from("patients")
// //         .select("*")
// //         .eq("user_id", patientId)
// //         .single();

// //       if (patientError) {
// //         console.error(patientError);
// //         return;
// //       }

// //       const { data: profileData } = await supabase
// //         .from("profiles")
// //         .select(`
// //           id,
// //           user_id,
// //           email,
// //           phone_number,
// //           role,
// //           avatar_url,
// //           first_name,
// //           last_name
// //         `)
// //         .eq("user_id", patientId)
// //         .single();

// //       setPatientDetails({
// //         ...patientData,
// //         profile: profileData
// //       });

// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoadingPatientDetails(false);
// //     }
// //   };

// //   const fetchDoctorDetails = async (doctorId: string) => {
// //     try {
// //       setLoadingPatientDetails(true);

// //       const { data, error } = await supabase
// //         .from("medical_professionals")
// //         .select(`
// //           *,
// //           profiles:profiles!medical_professionals_user_id_fkey (
// //             id,
// //             first_name,
// //             last_name,
// //             email,
// //             phone_number,
// //             avatar_url
// //           )
// //         `)
// //         .eq("user_id", doctorId)
// //         .single();

// //       if (error) {
// //         console.error("Error fetching doctor details:", error);
// //         return;
// //       }

// //       setPatientDetails(data);

// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoadingPatientDetails(false);
// //     }
// //   };

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
// //         setMeetingInstance(meeting);

// //         const config = {
// //           name,
// //           meetingId: meetingId,
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
// //           participantId: isRejoining && sessionId ? sessionId : undefined,
// //         };

// //         const cleanConfig = Object.fromEntries(
// //           Object.entries(config).filter(([_, v]) => v !== undefined)
// //         );

// //         if (isRejoining && sessionId) {
// //           meeting.join(cleanConfig);
// //         } else {
// //           meeting.init(cleanConfig);
// //         }

// //         meetingInitialized.current = true;

// //         if (meeting) {
// //           meeting.on("meeting-joined", () => {
// //             console.log("Meeting joined successfully");
// //             if (isHost && documents.length > 0) {
// //               broadcastDocuments();
// //             }
// //           });

// //           meeting.on("meeting-left", () => {
// //             console.log("Meeting left");
// //           });

// //           meeting.on("chat-message", (message: any) => {
// //             if (message.data && typeof message.data === 'string') {
// //               try {
// //                 const parsedData = JSON.parse(message.data);
// //                 if (parsedData.type === "DOCUMENT_UPLOADED") {
// //                   fetchDocuments();
// //                   toast({
// //                     title: "New Document",
// //                     description: `${parsedData.sender} uploaded a new document`,
// //                   });
// //                 }
// //               } catch (e) {
// //                 // Not a JSON message, ignore
// //               }
// //             }
// //           });
// //         }

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

// //   const broadcastDocuments = () => {
// //     if (meetingInstance && isHost) {
// //       meetingInstance.sendMessage(JSON.stringify({
// //         type: "DOCUMENTS_LIST",
// //         data: documents.map(doc => ({
// //           id: doc.id,
// //           name: doc.name,
// //           type: doc.type,
// //           uploaded_by: doc.uploaded_by
// //         }))
// //       }));
// //     }
// //   };

// //   // const EDGE_FUNCTION_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/upload-prescriptions';

// //   // const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //   //   const files = event.target.files;
// //   //   if (files && files.length > 0 && appointmentId && userId) {
// //   //     const file = files[0];
// //   //     setUploading(true);

// //   //     try {
// //   //       // const { data: appointmentData, error: appointmentError } = await supabase
// //   //       //   .from('appointments')
// //   //       //   .select('patient_id')
// //   //       //   .eq('id', appointmentId)
// //   //       //   .single();

// //   //       // if (appointmentError || !appointmentData) {
// //   //       //   throw new Error('Could not fetch appointment details');
// //   //       // }

// //   //       // const patientId = appointmentData.patient_id;

// //   //       const { data: sessionData } = await supabase.auth.getSession();
// //   //       const accessToken = sessionData.session?.access_token;

// //   //       if (!accessToken) {
// //   //         toast({
// //   //           title: "Authentication Failed",
// //   //           description: "Please log in again",
// //   //           variant: "destructive",
// //   //         });
// //   //         return;
// //   //       }

// //   //       const formData = new FormData();
        
// //   //       formData.append("appointment_id", appointmentId);
// //   //       // formData.append("patient_id", patientId);
// //   //       formData.append("uploaded_by", userId);
// //   //       formData.append("document_type", "medical_record");
// //   //       formData.append("files", file);

// //   //       const response = await fetch(EDGE_FUNCTION_URL, {
// //   //         method: "POST",
// //   //         headers: {
// //   //           Authorization: `Bearer ${accessToken}`,
// //   //         },
// //   //         body: formData,
// //   //       });

// //   //       const result = await response.json();

// //   //       if (!response.ok) {
// //   //         throw new Error(result.error || "Upload failed");
// //   //       }

// //   //       if (result.success && result.uploaded_documents && result.uploaded_documents.length > 0) {
// //   //         const uploadedDoc = result.uploaded_documents[0];
          
// //   //         const newDocument: DocumentFile = {
// //   //           id: uploadedDoc.id,
// //   //           name: file.name,
// //   //           url: uploadedDoc.url || "",
// //   //           type: file.type,
// //   //           size: file.size,
// //   //           file_path: uploadedDoc.file_path || "",
// //   //           uploaded_by: userId,
// //   //           owner_id: userId,
// //   //           created_at: new Date().toISOString(),
// //   //         };

// //   //         setDocuments(prev => [newDocument, ...prev]);
          
// //   //         if (meetingInstance) {
// //   //           meetingInstance.sendMessage(JSON.stringify({
// //   //             type: "DOCUMENT_UPLOADED",
// //   //             data: {
// //   //               documentId: newDocument.id,
// //   //               documentName: newDocument.name,
// //   //               sender: name,
// //   //               timestamp: new Date().toISOString()
// //   //             }
// //   //           }));
// //   //         }

// //   //         toast({
// //   //           title: "Upload Successful",
// //   //           description: result.message || `${file.name} has been uploaded`,
// //   //           variant: "default",
// //   //         });
// //   //       } else {
// //   //         throw new Error("No documents were uploaded");
// //   //       }

// //   //     } catch (error: any) {
// //   //       console.error("Error uploading document:", error);
// //   //       toast({
// //   //         title: "Upload Failed",
// //   //         description: error.message || "An unexpected error occurred",
// //   //         variant: "destructive",
// //   //       });
// //   //     } finally {
// //   //       setUploading(false);
// //   //       event.target.value = '';
// //   //     }
// //   //   }
// //   // };

// //   const EDGE_FUNCTION_URL = 'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/upload-prescriptions';

// // const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //   const files = event.target.files;
// //   if (!files || files.length === 0 || !appointmentId || !userId) {
// //     console.warn('Missing required data', { files: files?.length, appointmentId, userId });
// //     return;
// //   }

// //   const file = files[0];
// //   setUploading(true);

// //   try {
// //     // 1. Get appointment details (patient_id is needed for storage path)
// //     const { data: appointmentData, error: appointmentError } = await supabase
// //       .from('appointments')
// //       .select('patient_id')
// //       .eq('id', appointmentId)
// //       .single();

// //     if (appointmentError || !appointmentData) {
// //       throw new Error(`Could not fetch appointment details: ${appointmentError?.message}`);
// //     }

// //     const patientId = appointmentData.patient_id;

// //     // 2. Get access token
// //     const { data: sessionData } = await supabase.auth.getSession();
// //     const accessToken = sessionData.session?.access_token;
// //     if (!accessToken) {
// //       toast({
// //         title: "Authentication Failed",
// //         description: "Please log in again",
// //         variant: "destructive",
// //       });
// //       setUploading(false);
// //       return;
// //     }

// //     // 3. Build FormData
// //     const formData = new FormData();
// //     formData.append("appointment_id", appointmentId);
// //     formData.append("patient_id", patientId);
// //     formData.append("uploaded_by", userId);
// //     formData.append("document_type", "medical_record");
// //     formData.append("files", file);

// //     // 4. Send to edge function
// //     console.log('Uploading file:', { name: file.name, size: file.size, type: file.type });
// //     const response = await fetch(EDGE_FUNCTION_URL, {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`,
// //       },
// //       body: formData,
// //     });

// //     const result = await response.json();
// //     console.log('Edge function response:', result);

// //     if (!response.ok) {
// //       throw new Error(result.error || `Upload failed with status ${response.status}`);
// //     }

// //     // 5. Process successful upload
// //     if (result.success && result.uploaded_documents?.length > 0) {
// //       const uploadedDoc = result.uploaded_documents[0];
      
// //       const newDocument: DocumentFile = {
// //         id: uploadedDoc.id,
// //         name: file.name,
// //         url: uploadedDoc.url || "",
// //         type: file.type,
// //         size: file.size,
// //         file_path: uploadedDoc.file_path || uploadedDoc.path || "",
// //         uploaded_by: userId,
// //         owner_id: userId,   // For doctors, owner_id = patientId? Actually the edge function should set owner_id = patient_id.
// //         created_at: new Date().toISOString(),
// //       };

// //       // Add to state
// //       setDocuments(prev => [newDocument, ...prev]);
      
// //       // Broadcast to meeting
// //       if (meetingInstance) {
// //         meetingInstance.sendMessage(JSON.stringify({
// //           type: "DOCUMENT_UPLOADED",
// //           data: {
// //             documentId: newDocument.id,
// //             documentName: newDocument.name,
// //             sender: name,
// //             timestamp: new Date().toISOString()
// //           }
// //         }));
// //       }

// //       toast({
// //         title: "Upload Successful",
// //         description: result.message || `${file.name} has been uploaded`,
// //         variant: "default",
// //       });

// //       // Auto‑open the uploaded document
// //       await handleDocumentSelect(newDocument);
      
// //     // } else {
// //     //   throw new Error("No documents were uploaded or unexpected response format");
// //     }

// //   } catch (error: any) {
// //     console.error("Error uploading document:", error);
// //     // toast({
// //     //   title: "Upload Failed",
// //     //   description: error.message || "An unexpected error occurred",
// //     //   variant: "destructive",
// //     // });
// //   } finally {
// //     setUploading(false);
// //     event.target.value = ''; // clear input
// //   }
// // };

// //   // DOCTOR DOCUMENT SELECTION - WITH STRICT PATIENT ACCESS
// //   const handleDoctorDocumentSelect = async (document: DocumentFile) => {
// //     try {
// //       setSelectedDocument(document);

// //       let filePath = document.file_path;
// //       if (filePath.startsWith("patient_files/")) {
// //         filePath = filePath.replace("patient_files/", "");
// //       }

// //       const { data: { session } } = await supabase.auth.getSession();
// //       const currentUserId = session?.user?.id;

// //       if (!currentUserId) {
// //         toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
// //         return;
// //       }

// //       // Get appointment details
// //       const { data: appointmentData, error: appointmentError } = await supabase
// //         .from("appointments")
// //         .select("patient_id, doctor_id")
// //         .eq("id", appointmentId)
// //         .single();

// //       if (appointmentError) {
// //         toast({ title: "Error", description: "Unable to verify appointment", variant: "destructive" });
// //         return;
// //       }

// //       const patientId = appointmentData?.patient_id;
// //       const doctorId = appointmentData?.doctor_id;

// //       // DOCTOR ACCESS: Can only view documents where owner_id matches patient_id
// //       if (doctorId !== currentUserId) {
// //         toast({ title: "Access Denied", description: "You are not the assigned doctor for this appointment", variant: "destructive" });
// //         return;
// //       }

// //       if (document.owner_id !== patientId) {
// //         toast({ title: "Access Denied", description: "You can only view documents belonging to your patient", variant: "destructive" });
// //         return;
// //       }
// //       const accessToken = session?.access_token;


// //       // Get signed URL
// //       const { data: signedUrlData, error: signedUrlError } = await supabase.storage
// //         .from("patient_files")
// // .createSignedUrl(document.file_path, 3600)
// // const finalUrl = `${signedUrlData.signedUrl}&token=${accessToken}`;
// //       if (signedUrlError || !finalUrl) {
// //         toast({ title: "Error", description: "Unable to access document", variant: "destructive" });
// //         return;
// //       }

// //       setSelectedDocument({ ...document, url: signedUrlData.signedUrl });
// //       await fetchPatientDetails(patientId);

// //     } catch (error) {
// //       console.error("Error in doctor document select:", error);
// //       toast({ title: "Error", description: "Failed to load document", variant: "destructive" });
// //     }
// //   };
  
// // const handlePatientDocumentSelect = async (document: DocumentFile) => {
// //     try {
// //       setSelectedDocument(document);

// //       let filePath = document.file_path;
// //       if (filePath.startsWith("patient_files/")) {
// //         filePath = filePath.replace("patient_files/", "");
// //       }

// //       const { data: { session } } = await supabase.auth.getSession();
// //       const currentUserId = session?.user?.id;

// //       if (!currentUserId) {
// //         toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
// //         return;
// //       }

// //       // PATIENT ACCESS: Can only view their own documents
// //       if (document.owner_id !== currentUserId) {
// //         toast({ title: "Access Denied", description: "You can only view your own medical documents", variant: "destructive" });
// //         return;
// //       }

// //       // Get appointment details for doctor info
// //       const { data: appointmentData } = await supabase
// //         .from("appointments")
// //         .select("doctor_id")
// //         .eq("id", appointmentId)
// //         .single();

// //       // Get signed URL
// //       const { data: signedUrlData, error: signedUrlError } = await supabase.storage
// //         .from("patient_files")
// //         .createSignedUrl(filePath, 3600);

// //       if (signedUrlError || !signedUrlData?.signedUrl) {
// //         toast({ title: "Error", description: "Unable to access document", variant: "destructive" });
// //         return;
// //       }

// //       setSelectedDocument({ ...document, url: signedUrlData.signedUrl });
      
// //       if (appointmentData?.doctor_id) {
// //         await fetchDoctorDetails(appointmentData.doctor_id);
// //       }

// //     } catch (error) {
// //       console.error("Error in patient document select:", error);
// //       toast({ title: "Error", description: "Failed to load document", variant: "destructive" });
// //     }
// //   };

// //   const handleDocumentSelect = async (document: DocumentFile) => {
// //     if (userRole === "doctor") {
// //       await handleDoctorDocumentSelect(document);
// //     } else {
// //       await handlePatientDocumentSelect(document);
// //     }
// //   };

// //   const handleCloseDocument = () => {
// //     setSelectedDocument(null);
// //     setPatientDetails(null);
// //   };

// //   const renderDocumentViewer = (document: DocumentFile) => {
// //     const isPDF = document.type?.includes("pdf") || document.name?.toLowerCase().endsWith(".pdf");
// //     const isImage = document.type?.includes("image") || 
// //       document.name?.toLowerCase().endsWith(".png") ||
// //       document.name?.toLowerCase().endsWith(".jpg") ||
// //       document.name?.toLowerCase().endsWith(".jpeg");

// //     if (isPDF) {
// //       return (
// //         <div style={styles.documentViewer}>
// //           <iframe
// //             src={`${document.url}#toolbar=0`}
// //             title={document.name}
// //             style={styles.documentIframe}
// //           />
// //         </div>
// //       );
// //     }

// //     if (isImage) {
// //       return (
// //         <div style={styles.documentViewer}>
// //           <img
// //             src={document.url}
// //             alt={document.name}
// //             style={{
// //               width: "100%",
// //               height: "100%",
// //               objectFit: "contain",
// //               borderRadius: "8px",
// //             }}
// //           />
// //         </div>
// //       );
// //     }

// //     return (
// //       <div style={styles.documentViewer}>
// //         <div style={styles.placeholderMessage}>
// //           <p>📄 {document.name}</p>
// //           <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
// //             Preview only available for PDF & Images
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const handleScreenShare = async () => {
// //     try {
// //       if (meetingInstance) {
// //         if (!isSharingScreen) {
// //           const screenShareStream = await navigator.mediaDevices.getDisplayMedia({
// //             video: true,
// //             audio: false,
// //           });
          
// //           const screenShareTrack = screenShareStream.getVideoTracks()[0];
// //           meetingInstance?.localParticipant?.shareScreen(screenShareTrack);
// //           setIsSharingScreen(true);
          
// //           screenShareTrack.onended = () => {
// //             handleScreenShare();
// //           };
// //         } else {
// //           meetingInstance?.localParticipant?.stopShareScreen();
// //           setIsSharingScreen(false);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error sharing screen:", error);
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       {enableDocumentSharing && (
// //         <div style={styles.topBar}>
// //           <div style={styles.topBarLeft}>
// //             <button
// //               onClick={() => setShowDocumentSidebar(!showDocumentSidebar)}
// //               style={styles.topBarButton}
// //             >
// //               📄 Documents ({documents.length})
// //             </button>
// //             {userRole === "doctor" && (
// //               <>
// //                 <label style={styles.uploadButton}>
// //                   {uploading ? "📤 Uploading..." : "📤 Upload Document"}
// //                   <input
// //                     type="file"
// //                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
// //                     onChange={handleDocumentUpload}
// //                     style={styles.hiddenInput}
// //                     disabled={uploading}
// //                   />
// //                 </label>
// //               </>
// //             )}
// //           </div>
// //           <div style={styles.topBarRight}>
// //             <span style={styles.meetingTitle}>{meetingTitle}</span>
// //           </div>
// //         </div>
// //       )}

// //       {showDocumentSidebar && (
// //         <div style={styles.sidebar}>
// //           <div style={styles.sidebarHeader}>
// //             <h4 style={styles.sidebarTitle}>Documents</h4>
// //             <button
// //               onClick={() => setShowDocumentSidebar(false)}
// //               style={styles.closeButton}
// //             >
// //               ×
// //             </button>
// //           </div>
// //           <div style={styles.documentList}>
// //             {documents.length === 0 ? (
// //               <div style={styles.emptyMessage}>
// //                 <p>No documents uploaded yet</p>
// //                 {userRole === "doctor" && (
// //                   <p style={{ fontSize: "10px", marginTop: "5px" }}>
// //                     Click the Upload button to share documents
// //                   </p>
// //                 )}
// //               </div>
// //             ) : (
// //               documents.map((doc) => (
// //                 <div
// //                   key={doc.id}
// //                   style={styles.documentItem}
// //                   onClick={() => handleDocumentSelect(doc)}
// //                 >
// //                   <div style={styles.documentIcon}>
// //                     {doc.type?.includes('pdf') ? '📄' : 
// //                      doc.type?.includes('image') ? '🖼️' : '📁'}
// //                   </div>
// //                   <div style={styles.documentInfo}>
// //                     <div style={styles.documentName}>{doc.name}</div>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>
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

// //       {selectedDocument && (
// //         <div style={styles.documentPopup}>
// //           <div style={styles.documentPopupHeader}>
// //             <div style={styles.documentPopupTitleContainer}>
// //               <h3 style={styles.documentPopupTitle}>{selectedDocument.name}</h3>
// //             </div>
// //             <button
// //               onClick={handleCloseDocument}
// //               style={styles.closePopupButton}
// //             >
// //               ×
// //             </button>
// //           </div>
          
// //           <div style={styles.documentPopupContent}>
// //             {loadingPatientDetails ? (
// //               <div style={styles.loadingContainer}>
// //                 <p><Loader2/></p>
// //                 {/* <p>Loading details...</p> */}
// //               </div>
// //             ) : (
// //               <>
// //                 {patientDetails && !loadingPatientDetails && (
// //                   <div style={styles.patientDetailsSection}>
// //                     <div style={styles.patientDetailsHeader}>
// //                       <strong>
// //                         {userRole === "doctor" ? "Patient Information" : "Doctor Information"}
// //                       </strong>
// //                     </div>
// //                     <div style={styles.patientDetailItem}>
// //                       <span style={styles.detailLabel}>Name:</span>
// //                       <span>
// //                         {userRole === "doctor"
// //                           ? `${patientDetails.profile?.first_name} ${patientDetails.profile?.last_name}`
// //                           : `Dr. ${patientDetails.profiles?.first_name} ${patientDetails.profiles?.last_name}`
// //                         }
// //                       </span>
// //                     </div>
// //                     <div style={styles.patientDetailItem}>
// //                       <span style={styles.detailLabel}>Email:</span>
// //                       <span>
// //                         {userRole === "doctor"
// //                           ? patientDetails.profile?.email
// //                           : patientDetails.profiles?.email
// //                         }
// //                       </span>
// //                     </div>
// //                     <div style={styles.patientDetailItem}>
// //                       <span style={styles.detailLabel}>Phone:</span>
// //                       <span>
// //                         {userRole === "doctor"
// //                           ? patientDetails.profile?.phone_number
// //                           : patientDetails.profiles?.phone_number
// //                         }
// //                       </span>
// //                     </div>
// //                     {userRole === "patient" && patientDetails.profiles?.specialty && (
// //                       <div style={styles.patientDetailItem}>
// //                         <span style={styles.detailLabel}>Specialty:</span>
// //                         <span>{patientDetails.profiles.specialty}</span>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //                 {renderDocumentViewer(selectedDocument)}           
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const styles: { [key: string]: React.CSSProperties } = {
// //   container: {
// //     display: "flex",
// //     flexDirection: "column",
// //     height: "100vh",
// //     position: "relative"
// //   },
// //   topBar: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: "10px 20px",
// //     backgroundColor: "#2c3e50",
// //     color: "white",
// //     zIndex: 100,
// //     boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
// //   },
// //   topBarLeft: {
// //     display: "flex",
// //     gap: "10px"
// //   },
// //   topBarRight: {
// //     display: "flex",
// //     alignItems: "center"
// //   },
// //   meetingTitle: {
// //     fontSize: "16px",
// //     fontWeight: "500"
// //   },
// //   topBarButton: {
// //     padding: "8px 16px",
// //     backgroundColor: "#3498db",
// //     color: "white",
// //     border: "none",
// //     borderRadius: "4px",
// //     cursor: "pointer",
// //     fontSize: "14px",
// //     transition: "background-color 0.3s"
// //   },
// //   uploadButton: {
// //     padding: "8px 16px",
// //     backgroundColor: "#27ae60",
// //     color: "white",
// //     border: "none",
// //     borderRadius: "4px",
// //     cursor: "pointer",
// //     fontSize: "14px",
// //     display: "inline-block"
// //   },
// //   hiddenInput: {
// //     display: "none"
// //   },
// //   sidebar: {
// //     position: "fixed",
// //     right: 0,
// //     top: 60,
// //     width: "250px",
// //     height: "calc(100vh - 60px)",
// //     backgroundColor: "white",
// //     boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
// //     zIndex: 200,
// //     display: "flex",
// //     flexDirection: "column",
// //     overflow: "hidden"
// //   },
// //   sidebarHeader: {
// //     padding: "15px",
// //     backgroundColor: "#f8f9fa",
// //     borderBottom: "1px solid #dee2e6",
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center"
// //   },
// //   sidebarTitle: {
// //     margin: 0,
// //     fontSize: "16px",
// //     fontWeight: "500"
// //   },
// //   closeButton: {
// //     background: "none",
// //     border: "none",
// //     fontSize: "20px",
// //     cursor: "pointer",
// //     color: "#6c757d",
// //     padding: "5px",
// //     width: "30px",
// //     height: "30px",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center"
// //   },
// //   documentList: {
// //     flex: 1,
// //     overflowY: "auto",
// //     padding: "10px"
// //   },
// //   documentItem: {
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "10px",
// //     padding: "10px",
// //     marginBottom: "8px",
// //     cursor: "pointer",
// //     borderRadius: "8px",
// //     transition: "background-color 0.3s",
// //     backgroundColor: "#f8f9fa",
// //     border: "1px solid #e9ecef"
// //   },
// //   documentIcon: {
// //     fontSize: "24px"
// //   },
// //   documentInfo: {
// //     flex: 1
// //   },
// //   documentName: {
// //     fontSize: "12px",
// //     fontWeight: "500",
// //     overflow: "hidden",
// //     textOverflow: "ellipsis",
// //     whiteSpace: "nowrap"
// //   },
// //   emptyMessage: {
// //     textAlign: "center",
// //     padding: "20px",
// //     fontSize: "12px",
// //     color: "#6c757d"
// //   },
// //   documentPopup: {
// //     position: "fixed",
// //     top: "50%",
// //     left: "50%",
// //     transform: "translate(-50%, -50%)",
// //     width: "80%",
// //     maxWidth: "1000px",
// //     height: "80%",
// //     backgroundColor: "white",
// //     borderRadius: "8px",
// //     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
// //     zIndex: 300,
// //     display: "flex",
// //     flexDirection: "column",
// //     overflow: "hidden"
// //   },
// //   documentPopupHeader: {
// //     padding: "15px 20px",
// //     backgroundColor: "#f8f9fa",
// //     borderBottom: "1px solid #dee2e6",
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center"
// //   },
// //   documentPopupTitleContainer: {
// //     flex: 1
// //   },
// //   documentPopupTitle: {
// //     margin: 0,
// //     fontSize: "16px",
// //     fontWeight: "500"
// //   },
// //   closePopupButton: {
// //     background: "none",
// //     border: "none",
// //     fontSize: "24px",
// //     cursor: "pointer",
// //     color: "#6c757d",
// //     width: "30px",
// //     height: "30px",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center"
// //   },
// //   documentPopupContent: {
// //     flex: 1,
// //     overflow: "auto",
// //     padding: "20px"
// //   },
// //   documentViewer: {
// //     width: "100%",
// //     height: "100%",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#f5f5f5"
// //   },
// //   documentImage: {
// //     maxWidth: "100%",
// //     maxHeight: "100%",
// //     objectFit: "contain"
// //   },
// //   documentIframe: {
// //     width: "100%",
// //     height: "100%",
// //     border: "none"
// //   },
// //   placeholderMessage: {
// //     textAlign: "center",
// //     padding: "20px"
// //   },
// //   downloadLink: {
// //     color: "#007bff",
// //     textDecoration: "underline",
// //     cursor: "pointer"
// //   },
// //   patientDetailsSection: {
// //     padding: "15px 20px",
// //     backgroundColor: "#f8f9fa",
// //     borderBottom: "1px solid #dee2e6",
// //     marginBottom: "15px"
// //   },
// //   patientDetailsHeader: {
// //     marginBottom: "10px",
// //     fontSize: "14px",
// //     color: "#495057"
// //   },
// //   patientDetailsGrid: {
// //     display: "grid",
// //     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
// //     gap: "8px",
// //     fontSize: "13px"
// //   },
// //   patientDetailItem: {
// //     display: "flex",
// //     gap: "8px"
// //   },
// //   detailLabel: {
// //     fontWeight: "500",
// //     color: "#6c757d",
// //     minWidth: "90px"
// //   },
// //   loadingContainer: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     height: "100%"
// //   }
// // };

// // export default VideoMeeting;

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "@/hooks/use-toast";
// import Loader2 from "./ui/Loader2";
// import UploadPrescriptionForm from "./doctor/UploadPrescriptionForm";

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

//   // Common document item component with two buttons
//   const DocumentItem = ({ doc }: { doc: DocumentFile }) => (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: "10px",
//         padding: "10px",
//         marginBottom: "8px",
//         borderRadius: "8px",
//         backgroundColor: "#f8f9fa",
//         border: "1px solid #e9ecef",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
//         <div style={{ fontSize: "24px" }}>{doc.type?.includes('pdf') ? '📄' : '🖼️'}</div>
//         <div style={{ fontWeight: "500", wordBreak: "break-word" }}>{doc.name}</div>
//       </div>
//       <div style={{ display: "flex", gap: "8px" }}>
//         <button
//           onClick={() => handleViewDocument(doc)}
//           style={{
//             padding: "4px 12px",
//             backgroundColor: "#3498db",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "12px",
//           }}
//         >
//           👁️ View
//         </button>
//         {userRole === "doctor" &&doc.ai_summary && (
//         <button
//           onClick={() => handleAISummary(doc)}
//           style={{
//             padding: "4px 12px",
//             backgroundColor: "#9b59b6",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "12px",
//           }}
//         >
//           🤖 AI Summary
//         </button>
//         )}
//       </div>
//     </div>
//   );

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

//     const initializeMeeting = () => {
//       try {
//         const meeting = new (window as any).VideoSDKMeeting();
//         setMeetingInstance(meeting);

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
//   }, [apiKey, meetingId, sessionId, name, micEnabled, webcamEnabled, containerId, isHost, onMeetingLeave, containerReady, meetingTitle, isRejoining]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
//       {/* Top Bar with buttons */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#2c3e50", color: "white", zIndex: 100 }}>
//         <div style={{ display: "flex", gap: "10px" }}>
//           {userRole === "doctor" && (
//             <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//               👤 Patient Details
//             </button>
//           )}
//           {userRole === "patient" && (
//             <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//               👤 Doctor Details
//             </button>
//           )}
//           <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//             📄 Documents ({documents.length})
//           </button>
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

      

//       {showUploadModal && (
//   <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
//     <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//         <h3>Upload Documents</h3>
//         <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
//       </div>
//       <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
//         <UploadPrescriptionForm
//           patientId={patientDetails?.user_id || ""} // fetch from context if not loaded
//           depertmentId={userId!}
//           appointmentId={appointmentId!}
//           uploadedBy="department"
//           defaultDocumentType="medical_record"
//           onCancel={() => setShowUploadModal(false)}
//           // onSuccess={() => {
//           //   setShowUploadModal(false);
//           // }}
//         />
//       </div>
//     </div>
//   </div>
// )}

      

//       {/* Document Viewer Modal with split view + zoom controls */}
//       {showDocumentViewerModal && selectedDocument && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//               <h3>{selectedDocument.name}</h3>
//               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                 <button onClick={zoomOut} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom Out</button>
//                 <span style={{ minWidth: "60px", textAlign: "center" }}>{Math.round(zoomLevel * 100)}%</span>
//                 <button onClick={zoomIn} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom In</button>
//                 <button onClick={resetZoom} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reset</button>
//                 <button onClick={() => { setShowDocumentViewerModal(false); setSelectedDocument(null); setPatientDetails(null); setDoctorDetails(null); setFacilityDetails(null); setZoomLevel(1); }} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
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
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
//               <h3>AI Summary: {selectedDocument?.name}</h3>
//               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                 <button onClick={() => { setShowSummaryModal(false); setSelectedSummary(""); setShowDocumentViewerModal(false); setSelectedDocument(null); setPatientDetails(null); setDoctorDetails(null); setFacilityDetails(null); setZoomLevel(1); }} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
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
  userRole?: "doctor" | "patient";
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
  
  // New state for document click background highlight
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
  // AI Summary state
  const [selectedSummary, setSelectedSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  // Zoom state for document viewer
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const idRef = useRef(
    containerId || `video-container-${Math.random().toString(36).substr(2, 9)}`
  );

  // Clean summary text
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
        if (userRole === "doctor" && context?.patient_id) {
          await fetchEnhancedPatientDetails(context.patient_id);
          setShowDetailsModal(false);
        } else if (userRole === "patient" && context?.doctor_id) {
          await fetchEnhancedDoctorDetails(context.doctor_id);
          setShowDetailsModal(false);
        }
      };
      loadInitialDetails();
    }
  }, [appointmentId, userRole]);

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
        .select("first_name, last_name, email, phone_number, avatar_url")
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
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .single();
      if (error) throw error;
      setFacilityDetails(data);
    } catch (error) {
      console.error("Error fetching facility details:", error);
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

  // Fetch AI Summary for a document - uses ai_summary column directly
  const fetchAISummary = async (documentId: string, fileName: string) => {
    try {
      setSummaryLoading(true);
      // First check if summary already exists in documents table
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
    setSummaryLoading(true);

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
      if (userRole === "doctor" && context?.patient_id) {
        await fetchEnhancedPatientDetails(context.patient_id);
      } else if (userRole === "patient" && context?.doctor_id) {
        await fetchEnhancedDoctorDetails(context.doctor_id);
      }
      if (context?.facility_id) {
        await fetchFacilityDetails(context.facility_id);
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

  // Zoom controls
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

  // Common document item component with two buttons + click background highlight
  // Inside VideoMeeting component, replace the existing DocumentItem with this:

const DocumentItem = ({ doc }: { doc: DocumentFile }) => {
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isViewsummaryLoading, setIsViewsummaryLoading] = useState(false);
  const isHighlighted = selectedDocIdForHighlight === doc.id;

  const handleViewClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewLoading(true);
    try {
      await handleViewDocument(doc);
      setSelectedDocIdForHighlight(doc.id)

    } finally {
      setIsViewLoading(false);
    }
  };
  const handleViewsummaryClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewsummaryLoading(true);
    try {
      await handleAISummary(doc);
      setSelectedDocIdForHighlight(doc.id)

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
            // 👇 Condition: when loading, blue background + white text
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
          {isViewLoading ? (
            <>⏳ Loading...</> // or use a small spinner icon
          ) : (
            <>👁️ View</>
          )}
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
           {isViewsummaryLoading ? (
            <>⏳ Loading Summary...</> // or use a small spinner icon
          ) : ( 
            <> 🤖 AI Summary</>
          )}
          </button>
        )}
      </div>
    </div>
  );
};

  // Reusable details content with clinical + documents tabs
  const renderDetailsContent = (type: "patient" | "doctor") => {
    if (type === "patient" && !patientDetails) return null;
    if (type === "doctor" && !doctorDetails) return null;

    const p = patientDetails;
    const d = doctorDetails;
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
            {userRole === "doctor" ? "Patient Information" : "Doctor Information"}
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
            
             {userRole === "doctor" ? "Patient Documents" : "Doctor Documents"}
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
                <div><strong>Name:</strong> Dr. {d.profile?.first_name} {d.profile?.last_name}</div>
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
          </>
        )}
        {activeDetailTab === "documents" && (
          <>
          {userRole === "doctor" && type === "patient" && (
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

            {/* {userRole === "doctor" && type === "patient" && (
              <div style={{ padding: "16px", borderBottom: "1px solid #dee2e6" }}>
                <label style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#27ae60", color: "white", borderRadius: "4px", cursor: "pointer" }}>
                  {uploading ? "Uploading..." : "📤 Upload Document"}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
              </div>
            )} */}
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

    const initializeMeeting = () => {
      try {
        const meeting = new (window as any).VideoSDKMeeting();
        setMeetingInstance(meeting);

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
  }, [apiKey, meetingId, sessionId, name, micEnabled, webcamEnabled, containerId, isHost, onMeetingLeave, containerReady, meetingTitle, isRejoining]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      {/* Top Bar with buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#2c3e50", color: "white", zIndex: 100 }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {userRole === "doctor" && (
            <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              👤 Patient Information
            </button>
          )}
          {userRole === "patient" && (
            <button onClick={() => setShowDetailsModal(true)} style={{ padding: "8px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              👤 Doctor Information
            </button>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div ref={containerRef} id={idRef.current} style={{ flex: 1, minHeight: 0, backgroundColor: "#f0f0f0", position: "relative", ...style }} />

      {/* Details Modal (Patient or Doctor) */}
      {showDetailsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "80vh", overflow: "auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>{userRole === "doctor" ? "Patient Information" : "Doctor Information"}</h3>
              <button onClick={() => setShowDetailsModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            {loadingDetails ? <Loader2 /> : renderDetailsContent(userRole === "doctor" ? "patient" : "doctor")}
            {facilityDetails && (
              <>
                <h4 style={{ marginTop: "20px" }}>Facility Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                  <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
                  <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
                  <div><strong>License:</strong> {facilityDetails.license_number}</div>
                  <div><strong>Address:</strong> {facilityDetails.address}</div>
                  <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
                  {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
                  {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
                  {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
                </div>
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
        <UploadPrescriptionForm
          patientId={patientDetails?.user_id || ""} // fetch from context if not loaded
          depertmentId={userId!}
          appointmentId={appointmentId!}
          uploadedBy="department"
          defaultDocumentType="medical_record"
          onCancel={() => setShowUploadModal(false)}
          // onSuccess={() => {
          //   setShowUploadModal(false);
          // }}
        />
      </div>
    </div>
  </div>
)}

      

      {/* Document Viewer Modal with split view + zoom controls */}
      {showDocumentViewerModal && selectedDocument && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(197, 197, 197, 0.7)176, 0.7)234, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
              <h3>{selectedDocument.name}</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={zoomOut} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom Out</button>
                <span style={{ minWidth: "60px", textAlign: "center" }}>{Math.round(zoomLevel * 100)}%</span>
                <button onClick={zoomIn} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Zoom In</button>
                <button onClick={resetZoom} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reset</button>
                <button onClick={() => { setShowDocumentViewerModal(false); setShowDetailsModal(false)}} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left panel: Details */}
              <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
              
                    {userRole === "doctor" && patientDetails && renderDetailsContent("patient")}
                    {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
                    {facilityDetails && (
                      <>
                        <h4>Facility Information</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                          <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
                          <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
                          <div><strong>License:</strong> {facilityDetails.license_number}</div>
                          <div><strong>Address:</strong> {facilityDetails.address}</div>
                          <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
                          {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
                          {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
                          {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
                        </div>
                      </>
                    )}
                
              </div>
              {/* Right panel: Document preview with zoom */}
                {loadingDetails ? <Loader2 /> : (
                  <>
              <div style={{ width: "60%", overflow: "auto", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderDocumentPreview()}
              </div>
                </>
                )}
            </div>
          </div>
        </div>
      )} 
      {showSummaryModal && selectedDocument &&(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(197, 197, 197, 0.7)176, 0.7)234, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "1400px", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #dee2e6" }}>
              <h3>AI Summary: {selectedDocument?.name}</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => { setShowSummaryModal(false); setShowDocumentViewerModal(false); setShowDetailsModal(false)}} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left panel: Details */}
              <div style={{ width: "40%", overflowY: "auto", borderRight: "1px solid #dee2e6", padding: "16px", backgroundColor: "#fafafa" }}>
                {loadingDetails ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                  <Loader2 />
                  <span style={{ marginLeft: "10px" }}>Generating AI summary...</span>
                </div>) : (
                  <>
                    {userRole === "doctor" && patientDetails && renderDetailsContent("patient")}
                    {userRole === "patient" && doctorDetails && renderDetailsContent("doctor")}
                    {facilityDetails && (
                      <>
                        <h4>Facility Information</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                          <div><strong>Name:</strong> {facilityDetails.facility_name}</div>
                          <div><strong>Type:</strong> {facilityDetails.facility_type}</div>
                          <div><strong>License:</strong> {facilityDetails.license_number}</div>
                          <div><strong>Address:</strong> {facilityDetails.address}</div>
                          <div><strong>Rating:</strong> {facilityDetails.rating} ⭐ ({facilityDetails.total_reviews} reviews)</div>
                          {facilityDetails.total_beds && <div><strong>Total Beds:</strong> {facilityDetails.total_beds}</div>}
                          {facilityDetails.number_of_staffs && <div><strong>Staff Count:</strong> {facilityDetails.number_of_staffs}</div>}
                          {facilityDetails.about_facility && <div><strong>About:</strong> {facilityDetails.about_facility}</div>}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              {/* Right panel: Document preview with zoom */}
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