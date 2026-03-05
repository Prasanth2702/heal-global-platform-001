// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import React, { useState, useEffect } from "react";

// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Table,
//   Button,
//   Badge,
//   ProgressBar,
//   Form,
//   Modal,
//   Tab,
//   Nav,
//   Alert,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import {
//   Search,
//   Filter,
//   Clock,
//   User,
//   Activity,
//   Bed as BedIcon,
//   Building,
//   PlusCircle,
//   Users,
//   Percent,
//   Info,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Printer,
//   Phone,
//   Mail,
//   Heart,
//   Thermometer,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   ChevronRight,
//   Star,
//   Shield,
//   RefreshCw,
//   CalendarDays,
//   ChevronDown,
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { Calendar } from "@/components/ui/calendar";

// // Types and Interfaces
// interface Patient {
//   id: string;
//   user_id: string;
//   date_of_birth: string;
//   gender: "Male" | "Female" | "Other";
//   emergency_contact_name: string;
//   blood_group: string;
//   emergency_contact_number: string;
//   known_allergies: string;
//   current_medications: string;
//   created_at: string;
//   updated_at: string;
//   patient_profile_id: string;
//   profile?: Profile;
//   bookings?: BedBooking[];
// }

// interface ProcessedPatient extends Patient {
//   age: number;
//   name: string;
//   admissionDate: string;
//   diagnosis: string;
//   doctor: string;
//   contact: string;
//   emergencyContact: string;
//   bloodGroup: string;
//   allergies: string[];
//   status: "Admitted" | "Discharged" | "Critical" | "Pending";
//   priority: "low" | "medium" | "high" | "emergency";
//   insurance: string;
//   roomPreferences: string[];
// }

// interface Profile {
//   id: string;
//   user_id: string;
//   email: string;
//   phone_number: string;
//   role: string;
//   avatar_url: string;
//   first_name: string;
//   last_name: string;
//   created_at: string;
//   updated_at: string;
//   profile_id: string;
//   full_name?: string;
// }

// interface Ward {
//   id: string;
//   facility_id: string;
//   ward_code: string;
//   name: string;
//   description: string;
//   ward_type: string;
//   floor_number: number;
//   wing: string;
//   phone_extension: string;
//   head_nurse_id: string;
//   total_beds: number;
//   available_beds: number;
//   reserved_beds: number;
//   is_active: boolean;
//   is_operational: boolean;
//   emergency_contact: string;
//   created_by: string;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   head_nurse?: Profile;
//   beds?: Bed[];
//   occupancyRate?: number;
//   operatingHours?: {
//     start: string;
//     end: string;
//   };
//   cleaningSchedule?: string;
// }

// // Bed types from your database
// type BedType =
//   | "ICU"
//   | "CCU"
//   | "NICU"
//   | "PICU"
//   | "GENERAL"
//   | "PRIVATE"
//   | "SEMI_PRIVATE"
//   | "ISOLATION"
//   | "BURN_UNIT"
//   | "CARDIAC"
//   | "NEURO"
//   | "MATERNITY"
//   | "PEDIATRIC"
//   | "PSYCHIATRIC"
//   | "REHABILITATION"
//   | "STEP_DOWN"
//   | "EMERGENCY";

// // Bed status from your database
// type BedStatus =
//   | "AVAILABLE"
//   | "OCCUPIED"
//   | "MAINTENANCE"
//   | "CLEANING"
//   | "RESERVED"
//   | "OUT_OF_SERVICE";

// interface Bed {
//   id: string;
//   facility_id: string;
//   ward_id: string;
//   bed_number: string;
//   bed_label: string;
//   bed_type: BedType;
//   room_number: string;
//   floor_number: number;
//   wing: string;
//   current_status: BedStatus;
//   status_notes: string;
//   has_oxygen: boolean;
//   has_suction: boolean;
//   has_monitor: boolean;
//   has_ventilator: boolean;
//   has_cpip: boolean;
//   has_infusion_pump: boolean;
//   is_bariatric: boolean;
//   is_isolation: boolean;
//   is_negative_pressure: boolean;
//   is_wheelchair_accessible: boolean;
//   width_cm: number;
//   length_cm: number;
//   max_weight_kg: number;
//   electrical_outlets: number;
//   is_active: boolean;
//   last_maintenance_date: string;
//   next_maintenance_date: string;
//   maintenance_notes: string;
//   purchase_date: string;
//   created_by: string;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   patient?: ProcessedPatient;
//   booking?: BedBooking;
//   ward?: Ward;
//   isOccupied?: boolean;
//   restrictions?: string[];
//   equipment?: string[];
//   maintenance?: boolean;
//   lastCleaned?: string;
// }

// // Priority levels from your database
// type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

// // Patient types from your database
// type PatientType = "INPATIENT" | "OUTPATIENT" | "DAY_CARE" | "EMERGENCY";

// // Booking status
// type BookingStatus =
//   | "PENDING"
//   | "AVAILABLE"
//   | "CHECKED_IN"
//   | "CHECKED_OUT"
//   | "CANCELLED"
//   | "NO_SHOW"
//   | "TRANSFERRED"
//   | "RESERVED"
//   |"OCCUPIED";

// interface BedBooking {
//   id: string;
//   booking_reference: string;
//   facility_id: string;
//   patient_id: string;
//   admission_type: string;
//   primary_diagnosis: string;
//   secondary_diagnosis: string;
//   allergies: string;
//   special_instructions: string;
//   required_bed_type: BedType;
//   special_requirements: string[];
//   referring_doctor_id: string;
//   attending_doctor_id: string;
//   primary_nurse_id: string;
//   assigned_bed_id: string;
//   assigned_ward_id: string;
//   expected_admission_date: string;
//   expected_discharge_date: string;
//   actual_admission_time: string;
//   actual_discharge_time: string;
//   status: BookingStatus;
//   patient_type: PatientType;
//   priority: PriorityLevel;
//   cancellation_reason: string;
//   insurance_provider: string;
//   insurance_policy_number: string;
//   insurance_verified_by: string;
//   insurance_verified_at: string;
//   estimated_cost: number;
//   created_by: string;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   patient?: ProcessedPatient;
//   bed?: Bed;
//   ward?: Ward;
//   referring_doctor?: Profile;
//   attending_doctor?: Profile;
//   primary_nurse?: Profile;
// }

// interface Facility {
//   id: string;
//   admin_user_id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   address: any;
//   additional_services: any;
//   operating_hours: any;
//   rating: number;
//   total_reviews: number;
//   is_verified: boolean;
//   created_at: string;
//   updated_at: string;
//   latitude: number;
//   longitude: number;
//   established_year: number;
//   website: string;
//   insurance_partners: string;
//   departments: any;
//   total_beds: number;
//   about_facility: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface ActionData {
//   booking_id?: string;
//   admission_diagnosis?: string;
//   notes?: string;
//   discharge_diagnosis?: string;
//   discharge_summary?: string;
//   new_bed_id?: string;
//   new_ward_id?: string;
//   transfer_reason?: string;
//   clinical_notes?: string;
//   administrative_notes?: string;
// }

// type ActionType = "admit" | "discharge" | "transfer" | "cancelled" | null;

// const ViewFacility: React.FC = () => {
//   // State Management
//   const [wards, setWards] = useState<Ward[]>([]);
//   const [patients, setPatients] = useState<ProcessedPatient[]>([]);
//   const [beds, setBeds] = useState<Bed[]>([]);
//   const [bookings, setBookings] = useState<BedBooking[]>([]);
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [facility, setFacility] = useState<Facility | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showBedDetailsModal, setShowBedDetailsModal] = useState(false);
//   const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
//   const [selectedPatient, setSelectedPatient] =
//     useState<ProcessedPatient | null>(null);
//   const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
//   const [selectedBooking, setSelectedBooking] = useState<BedBooking | null>(
//     null
//   );
//   const [activeTab, setActiveTab] = useState("overview");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [wardTypeFilter, setWardTypeFilter] = useState("all");

//   // Action states
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [currentAction, setCurrentAction] = useState<ActionType>(null);
//   const [currentBed, setCurrentBed] = useState<Bed | null>(null);
//   const [currentBooking, setCurrentBooking] = useState<BedBooking | null>(null);
//   const [actionData, setActionData] = useState<ActionData>({});
//   const [bedActionStatus, setBedActionStatus] = useState<
//     Record<string, string>
//   >({});
//   const [showDemoModal, setShowDemoModal] = useState(false);
//   const [demoModalData, setDemoModalData] = useState<any>(null);
//   const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
//   const [selectedBookingForDetails, setSelectedBookingForDetails] =
//     useState<BedBooking | null>(null);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

//   // New ward state
//   const [newWard, setNewWard] = useState({
//     name: "",
//     ward_type: "GENERAL",
//     total_beds: 10,
//     operating_hours: { start: "08:00", end: "20:00" },
//     description: "",
//     head_nurse_id: "",
//     phone_extension: "",
//     floor_number: 1,
//     wing: "",
//     emergency_contact: "",
//   });

//   // Notification function
//   const showNotification = (
//     message: string,
//     type: "success" | "error" | "info" | "warning" = "info"
//   ) => {
//     // Create a custom notification element
//     const notification = document.createElement("div");
//     notification.className = `notification notification-${type}`;
//     notification.innerHTML = `
//       <div class="notification-content">
//         <strong>${type.toUpperCase()}:</strong> ${message}
//       </div>
//     `;

//     // Add styles
//     notification.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 15px 20px;
//       background: ${
//         type === "success"
//           ? "#d4edda"
//           : type === "error"
//           ? "#f8d7da"
//           : type === "warning"
//           ? "#fff3cd"
//           : "#d1ecf1"
//       };
//       color: ${
//         type === "success"
//           ? "#155724"
//           : type === "error"
//           ? "#721c24"
//           : type === "warning"
//           ? "#856404"
//           : "#0c5460"
//       };
//       border: 1px solid ${
//         type === "success"
//           ? "#c3e6cb"
//           : type === "error"
//           ? "#f5c6cb"
//           : type === "warning"
//           ? "#ffeaa7"
//           : "#bee5eb"
//       };
//       border-radius: 5px;
//       z-index: 9999;
//       min-width: 300px;
//       max-width: 400px;
//       box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//       animation: slideIn 0.3s ease;
//     `;

//     document.body.appendChild(notification);

//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       notification.style.animation = "slideOut 0.3s ease";
//       setTimeout(() => {
//         if (notification.parentNode) {
//           notification.parentNode.removeChild(notification);
//         }
//       }, 300);
//     }, 5000);
//   };

//   // Add CSS for animations
//   useEffect(() => {
//     const notificationStyles = document.createElement("style");
//     notificationStyles.innerHTML = `
//       @keyframes slideIn {
//         from { transform: translateX(100%); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//       }
//       @keyframes slideOut {
//         from { transform: translateX(0); opacity: 1; }
//         to { transform: translateX(100%); opacity: 0; }
//       }
//     `;
//     document.head.appendChild(notificationStyles);

//     return () => {
//       if (notificationStyles.parentNode) {
//         notificationStyles.parentNode.removeChild(notificationStyles);
//       }
//     };
//   }, []);

//   const formatTimeTo24Hour = (timeStr: string): string => {
//     if (!timeStr) return "08:00";
//     timeStr = timeStr.toLowerCase().replace(/\s/g, "");
//     if (timeStr.includes(":")) {
//       return timeStr.length === 5 ? timeStr : timeStr.padStart(5, "0");
//     }
//     const match = timeStr.match(/(\d+)(?::(\d+))?(am|pm)?/);
//     if (match) {
//       let hours = parseInt(match[1]);
//       const minutes = match[2] ? parseInt(match[2]) : 0;
//       const period = match[3];
//       if (period === "pm" && hours < 12) hours += 12;
//       if (period === "am" && hours === 12) hours = 0;
//       return `${hours.toString().padStart(2, "0")}:${minutes
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return "08:00";
//   };

//   const fetchData = async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         setError("User not authenticated");
//         return;
//       }

//       const facilityId = user?.user_metadata?.facility_id;

//       if (!facilityId) {
//         setError("Facility ID not found in user metadata");
//         return;
//       }

//       setRefreshing(true);
//       setError(null);

//       // Fetch bookings
//       const { data: bookingsData, error: bookingsError } = await supabase
//         .from("bed_bookings")
//         .select("*")
//         .eq("facility_id", facilityId)
//         .order("created_at", { ascending: false });

//       if (bookingsError) {
//         console.error("Error fetching bookings:", bookingsError);
//         throw bookingsError;
//       }

//       console.log("Bookings fetched:", bookingsData?.length);

//       // Fetch patients
//       const { data: patientsData, error: patientsError } = await supabase
//         .from("patients")
//         .select("*");

//       if (patientsError) throw patientsError;

//       // Fetch profiles
//       const { data: profilesData, error: profilesError } = await supabase
//         .from("profiles")
//         .select("*");

//       if (profilesError) throw profilesError;

//       // Fetch beds
//       const { data: bedsData, error: bedsError } = await supabase
//         .from("beds")
//         .select("*")
//         .eq("facility_id", facilityId)
//         .eq("is_active", true)
//         .order("bed_number");

//       if (bedsError) throw bedsError;

//       // Fetch wards
//       const { data: wardsData, error: wardsError } = await supabase
//         .from("wards")
//         .select("*")
//         .eq("facility_id", facilityId)
//         .eq("is_active", true)
//         .order("created_at", { ascending: false });

//       if (wardsError) throw wardsError;

//       // Fetch facility
//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("*")
//         .eq("id", facilityId)
//         .single();

//       if (facilityError && facilityError.code !== "PGRST116") {
//         console.error("Facility fetch error:", facilityError);
//       }

//       // Process profiles to create a lookup map
//       const profileMap = new Map();
//       profilesData?.forEach((profile) => {
//         profileMap.set(profile.user_id, {
//           ...profile,
//           full_name: `${profile.first_name} ${profile.last_name}`.trim(),
//         });
//       });

//       // Process patients with profile data
//       const processedPatients: ProcessedPatient[] =
//         patientsData?.map((patient) => {
//           const profile = profileMap.get(patient.user_id);

//           // Calculate age
//           let age = 0;
//           if (patient.date_of_birth) {
//             const dob = new Date(patient.date_of_birth);
//             const today = new Date();
//             age = today.getFullYear() - dob.getFullYear();
//             const monthDiff = today.getMonth() - dob.getMonth();
//             if (
//               monthDiff < 0 ||
//               (monthDiff === 0 && today.getDate() < dob.getDate())
//             ) {
//               age--;
//             }
//           }

//           return {
//             ...patient,
//             age,
//             name: profile?.full_name || `Patient ${patient.patient_profile_id}`,
//             admissionDate: "",
//             diagnosis: "",
//             doctor: "",
//             contact: profile?.phone_number || patient.emergency_contact_number,
//             emergencyContact: `${patient.emergency_contact_name} (${patient.emergency_contact_number})`,
//             bloodGroup: patient.blood_group,
//             allergies: patient.known_allergies
//               ? patient.known_allergies
//                   .split(",")
//                   .map((a) => a.trim())
//                   .filter(Boolean)
//               : [],
//             status: "Pending" as const,
//             priority: "medium" as const,
//             insurance: "Not specified",
//             roomPreferences: [],
//             profile,
//           };
//         }) || [];

//       // Create patient lookup map
//       const patientMap = new Map();
//       processedPatients.forEach((patient) => {
//         patientMap.set(patient.id, patient);
//       });

//       // Create bed lookup map
//       const bedMap = new Map();
//       bedsData?.forEach((bed) => {
//         bedMap.set(bed.id, bed);
//       });

//       // Create ward lookup map
//       const wardMap = new Map();
//       wardsData?.forEach((ward) => {
//         wardMap.set(ward.id, ward);
//       });

//       // Process bookings with joined data
//       const processedBookings: BedBooking[] =
//         bookingsData?.map((booking) => {
//           const patient = patientMap.get(booking.patient_id);
//           const bed = bedMap.get(booking.assigned_bed_id);
//           const ward = wardMap.get(booking.assigned_ward_id);

//           // Update patient status based on booking
//           if (patient) {
//             patient.admissionDate = booking.expected_admission_date || "";
//             patient.diagnosis = booking.primary_diagnosis || "Not specified";
//             patient.insurance = booking.insurance_provider || "Not specified";
//             patient.roomPreferences = booking.special_requirements || [];

//             // Set priority
//             const priorityMap = {
//               CRITICAL: "emergency",
//               HIGH: "high",
//               MEDIUM: "medium",
//               LOW: "low",
//             } as const;
//             patient.priority = priorityMap[booking.priority] || "medium";

//             // Set status
//             if (booking.status === "CHECKED_IN") {
//               patient.status = "Admitted";
//             } else if (
//               booking.status === "CHECKED_OUT" ||
//               booking.status === "CANCELLED"
//             ) {
//               patient.status = "Discharged";
//             } else if (booking.priority === "CRITICAL") {
//               patient.status = "Critical";
//             } else if (
//               booking.status === "AVAILABLE" ||
//               booking.status === "PENDING" ||
//               booking.status === "RESERVED"
//             ) {
//               patient.status = "Pending";
//             } else {
//               patient.status = "Pending";
//             }
//           }

//           return {
//             ...booking,
//             patient,
//             bed,
//             ward,
//             referring_doctor: null,
//             attending_doctor: null,
//             primary_nurse: null,
//           };
//         }) || [];

//       // Process wards with statistics
//       const processedWards =
//         wardsData?.map((ward) => {
//           const wardBeds =
//             bedsData?.filter((bed) => bed.ward_id === ward.id) || [];
//           const occupiedBeds = wardBeds.filter(
//             (bed) => bed.current_status === "OCCUPIED"
//           ).length;
//           const maintenanceBeds = wardBeds.filter(
//             (bed) =>
//               bed.current_status === "MAINTENANCE" ||
//               bed.current_status === "OUT_OF_SERVICE"
//           ).length;
//           const availableBeds = wardBeds.filter(
//             (bed) => bed.current_status === "AVAILABLE"
//           ).length;
//           const occupancyRate =
//             ward.total_beds > 0 ? (occupiedBeds / ward.total_beds) * 100 : 0;

//           // Get head nurse profile if exists
//           let headNurse = null;
//           if (ward.head_nurse_id) {
//             headNurse = profileMap.get(ward.head_nurse_id);
//           }

//           return {
//             ...ward,
//             available_beds: availableBeds,
//             occupancyRate,
//             operatingHours: { start: "08:00", end: "20:00" },
//             cleaningSchedule: "",
//             head_nurse: headNurse,
//           };
//         }) || [];

//       // Process beds with patient and booking data
//       const processedBeds: Bed[] =
//         bedsData?.map((bed) => {
//           // Find active booking for this bed
//           const activeBooking = processedBookings.find(
//             (booking) =>
//               booking.assigned_bed_id === bed.id &&
//               ["PENDING", "AVAILABLE", "CHECKED_IN", "RESERVED"].includes(
//                 booking.status
//               )
//           );

//           const patient = activeBooking?.patient;
//           const ward = processedWards.find((w) => w.id === bed.ward_id);

//           return {
//             ...bed,
//             isOccupied: bed.current_status === "OCCUPIED",
//             maintenance:
//               bed.current_status === "MAINTENANCE" ||
//               bed.current_status === "OUT_OF_SERVICE",
//             equipment: [
//               bed.has_oxygen && "Oxygen",
//               bed.has_suction && "Suction",
//               bed.has_monitor && "Monitor",
//               bed.has_ventilator && "Ventilator",
//               bed.has_cpip && "CPIP",
//               bed.has_infusion_pump && "Infusion Pump",
//             ].filter(Boolean) as string[],
//             restrictions: bed.is_isolation ? ["Isolation Required"] : [],
//             lastCleaned: bed.last_maintenance_date || new Date().toISOString(),
//             patient,
//             booking: activeBooking,
//             ward,
//           };
//         }) || [];

//       // Update bed status based on booking
//       const updatedBeds = processedBeds.map((bed) => {
//         if (
//           bed.booking &&
//           ["PENDING", "AVAILABLE", "CHECKED_IN", "RESERVED"].includes(
//             bed.booking.status
//           )
//         ) {
//           return {
//             ...bed,
//             current_status: "OCCUPIED" as BedStatus,
//           };
//         }
//         return bed;
//       });

//       // Filter current bookings
//       const currentBookings = processedBookings.filter(
//         (booking) =>
//           booking.status !== "CHECKED_OUT" &&
//           booking.status !== "CANCELLED" &&
//           booking.status !== "NO_SHOW"
//       );

//       setWards(processedWards);
//       setPatients(processedPatients);
//       setBeds(updatedBeds);
//       setBookings(currentBookings);
//       setFacility(facilityData);

//       console.log("Data loaded successfully:");
//       console.log("- Wards:", processedWards.length);
//       console.log("- Patients:", processedPatients.length);
//       console.log("- Beds:", updatedBeds.length);
//       console.log("- Bookings:", currentBookings.length);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to load data. Please try again.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Statistics Calculations
//   const totalWards = wards.length;
//   const totalBeds = wards.reduce(
//     (sum, ward) => sum + (ward.total_beds || 0),
//     0
//   );
//   const totalAvailableBeds = beds.filter(
//     (bed) => bed.current_status === "AVAILABLE"
//   ).length;
//   const totalOccupiedBeds = beds.filter(
//     (bed) => bed.current_status === "OCCUPIED"
//   ).length;
//   const overallOccupancyRate =
//     totalBeds > 0 ? ((totalOccupiedBeds / totalBeds) * 100).toFixed(1) : "0";
//   const bedsUnderMaintenance = beds.filter(
//     (bed) =>
//       bed.current_status === "MAINTENANCE" ||
//       bed.current_status === "OUT_OF_SERVICE"
//   ).length;
//   const criticalPatients = patients.filter(
//     (p) => p.priority === "emergency" && p.status === "Admitted"
//   ).length;
//   const admittedPatients = patients.filter(
//     (p) => p.status === "Admitted"
//   ).length;

//   // Filter wards based on search and type
//   const filteredWards = wards.filter((ward) => {
//     const matchesSearch =
//       ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ward.ward_type.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType =
//       wardTypeFilter === "all" || ward.ward_type === wardTypeFilter;
//     return matchesSearch && matchesType;
//   });

//   // Handler for action confirmation
//   const handleActionConfirmation = (action: ActionType, bed: Bed) => {
//     // First, find the booking for this bed
//     const bookingForBed = bookings.find(
//       (booking) =>
//         booking.assigned_bed_id === bed.id &&
//         ["PENDING", "AVAILABLE", "RESERVED", "CHECKED_IN"].includes(
//           booking.status
//         )
//     );

//     if (!bookingForBed) {
//       // Show error message - no booking found for this bed
//       showNotification(
//         `No active booking found for Bed ${bed.bed_number}.`,
//         "error"
//       );
//       return;
//     }

//     setCurrentAction(action);
//     setCurrentBed(bed);
//     setCurrentBooking(bookingForBed);
//     // Show Booking Details Modal first
//     setSelectedBookingForDetails(bookingForBed);
//     setShowBookingDetailsModal(true);
//   };

//   const handleProceedToAction = () => {
//     if (!selectedBookingForDetails || !currentBed || !currentAction) {
//       showNotification("Cannot proceed to action", "error");
//       return;
//     }

//     // Reset action data with initial values
//     const initialActionData: ActionData = {
//       booking_id: selectedBookingForDetails.id,
//       admission_diagnosis: selectedBookingForDetails.primary_diagnosis || "",
//       notes: selectedBookingForDetails.special_instructions || "",
//       discharge_diagnosis: "",
//       discharge_summary: "",
//       new_bed_id: "",
//       new_ward_id: "",
//       transfer_reason: "",
//       clinical_notes: "",
//       administrative_notes: "",
//     };

//     setActionData(initialActionData);

//     // Close Booking Details Modal
//     setShowBookingDetailsModal(false);

//     // Show Action Confirmation Modal after a brief delay
//     setTimeout(() => {
//       setShowActionModal(true);
//     }, 100);
//   };

//   // Handler to view booking details
//   const handleViewBookingDetails = (bed: Bed) => {
//     // Find booking for this bed
//     const bookingForBed = bookings.find(
//       (booking) =>
//         booking.assigned_bed_id === bed.id &&
//         [
//           "PENDING",
//           "AVAILABLE",
//           "RESERVED",
//           "CHECKED_IN",
//           "CHECKED_OUT",
//         ].includes(booking.status)
//     );

//     if (bookingForBed) {
//       setSelectedBookingForDetails(bookingForBed);
//       setShowBookingDetailsModal(true);
//     } else {
//       // If no booking, show bed details instead
//       handleViewBedDetails(bed);
//     }
//   };

//   const handleExecuteAction = async () => {
//     if (!currentAction || !currentBed || !currentBooking) {
//       showNotification("Missing required information for action", "error");
//       return;
//     }

//     try {
//       // ✅ Get user
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         showNotification("User not authenticated", "error");
//         return;
//       }

//       // ✅ Get session separately
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session?.access_token) {
//         showNotification("Session expired. Please login again.", "error");
//         return;
//       }

//       const facilityId = user.user_metadata?.facility_id;
//       if (!facilityId) {
//         showNotification("Facility ID not found in user metadata", "error");
//         return;
//       }

//       let apiUrl = "";
//       let requestBody: any = {};
//       let newBookingStatus = "";
//       let newBedStatus: BedStatus = "AVAILABLE";

//       switch (currentAction) {
//         case "admit":
//           apiUrl =
//             "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/admit-patient";
//           newBookingStatus = "CHECKED_IN";
//           newBedStatus = "OCCUPIED";

//           requestBody = {
//             booking_id: actionData.booking_id || currentBooking.id,
//             bed_id: currentBed.id,
//             ward_id: currentBed.ward_id,
//             admission_diagnosis:
//               actionData.admission_diagnosis ||
//               currentBooking.primary_diagnosis ||
//               "",
//             notes: actionData.notes || "",
//             ip_address: "",
//             user_agent: "",
//             application_version: "",
//           };
//           break;

//         case "discharge":
//           apiUrl =
//             "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/discharge-patient";
//           newBookingStatus = "CHECKED_OUT";
//           newBedStatus = "AVAILABLE";
//           requestBody = {
//             booking_id: actionData.booking_id || currentBooking.id,
//             discharge_diagnosis: actionData.discharge_diagnosis || "",
//             discharge_summary: actionData.discharge_summary || "",
//             notes: actionData.notes || "",
//             ip_address: "",
//             user_agent: "",
//             application_version: "",
//           };
//           break;

//         case "transfer":
//           apiUrl =
//             "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/transfer-patient";
//           newBookingStatus = "TRANSFERRED";
//           requestBody = {
//             booking_id: actionData.booking_id || currentBooking.id,
//             new_bed_id: actionData.new_bed_id || "",
//             new_ward_id: actionData.new_ward_id || "",
//             transfer_reason: actionData.transfer_reason || "",
//             clinical_notes: actionData.clinical_notes || "",
//             administrative_notes: actionData.administrative_notes || "",
//             ip_address: "",
//             user_agent: "",
//             application_version: "",
//           };
//           break;

//         case "cancelled":
//           newBookingStatus = "CANCELLED";
//           newBedStatus = "AVAILABLE";
//           break;

//         default:
//           showNotification("Invalid action type", "error");
//           return;
//       }

//       console.log("API Request Details:", {
//         action: currentAction,
//         apiUrl,
//         requestBody,
//         tokenPresent: !!session.access_token,
//         facilityId,
//         bookingId: currentBooking.id,
//         bedId: currentBed.id,
//         bedNumber: currentBed.bed_number,
//       });

//       if (currentAction === "cancelled") {
//         const { error } = await supabase
//           .from("bed_bookings")
//           .update({
//             status: newBookingStatus as BookingStatus,
//             cancellation_reason:
//               actionData.notes || "Cancelled by facility staff",
//             updated_at: new Date().toISOString(),
//             updated_by: user.id,
//           })
//           .eq("id", currentBooking.id);

//         if (error) throw error;

//         await supabase
//           .from("beds")
//           .update({
//             current_status: newBedStatus,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("id", currentBed.id);
//       } else {
//         const response = await fetch(apiUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.access_token}`,
//           },
//           body: JSON.stringify(requestBody),
//         });

//         console.log("Response status:", response.status);
//         console.log("Response status text:", response.statusText);

//         if (!response.ok) {
//           let errorMessage = `Action failed: ${response.status} ${response.statusText}`;
//           try {
//             const errorData = await response.json();
//             console.log("Error response data:", errorData);
//             errorMessage = errorData.message || errorData.error || errorMessage;
//           } catch (e) {
//             console.log("Could not parse error response as JSON");
//           }
//           throw new Error(errorMessage);
//         }

//         // Log successful response
//         try {
//           const responseData = await response.json();
//           console.log("Success response:", responseData);
//         } catch (e) {
//           console.log("No JSON response body");
//         }
//       }

//       // Update local state
//       if (newBookingStatus) {
//         setBedActionStatus((prev) => ({
//           ...prev,
//           [currentBed.id]: newBookingStatus,
//         }));
//       }

//       // Update booking status in local state
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.id === currentBooking.id
//             ? {
//                 ...booking,
//                 status: newBookingStatus as BookingStatus,
//               }
//             : booking
//         )
//       );

//       // Update bed status in local state
//       setBeds((prevBeds) =>
//         prevBeds.map((bed) =>
//           bed.id === currentBed.id
//             ? { ...bed, current_status: newBedStatus }
//             : bed
//         )
//       );

//       showNotification(
//         `${currentAction} action completed successfully!`,
//         "success"
//       );

//       setShowActionModal(false);
//       fetchData(); // Refresh data from server
//     } catch (error: any) {
//       console.error(`Failed to ${currentAction} patient:`, error);
//       console.error("Full error:", error);
//       showNotification(
//         `Failed to ${currentAction} patient: ${
//           error.message || "Unknown error"
//         }`,
//         "error"
//       );
//     }
//   };

//   // Handlers
//   const handleAddWard = async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         alert("User not authenticated");
//         return;
//       }

//       const facilityId = user?.user_metadata?.facility_id;
//       if (!facilityId) {
//         alert("Facility ID not found");
//         return;
//       }

//       const { data: newWardData, error } = await supabase
//         .from("wards")
//         .insert([
//           {
//             name: newWard.name,
//             ward_type: newWard.ward_type,
//             total_beds: newWard.total_beds,
//             available_beds: newWard.total_beds,
//             floor_number: newWard.floor_number,
//             wing: newWard.wing,
//             phone_extension: newWard.phone_extension,
//             head_nurse_id: newWard.head_nurse_id,
//             emergency_contact: newWard.emergency_contact,
//             description: newWard.description,
//             is_active: true,
//             is_operational: true,
//             facility_id: facilityId,
//             created_by: user.id,
//             updated_by: user.id,
//             ward_code: `${newWard.ward_type
//               .substring(0, 3)
//               .toUpperCase()}${Math.floor(Math.random() * 1000)}`,
//           },
//         ])
//         .select()
//         .single();

//       if (error) throw error;

//       // Create beds for the new ward
//       const bedPromises = Array.from({ length: newWard.total_beds }, (_, i) => {
//         const bedNumber = `${newWard.ward_type.substring(0, 3).toUpperCase()}-${
//           i + 1
//         }`;
//         return supabase.from("beds").insert([
//           {
//             bed_number: bedNumber,
//             bed_label: `Bed ${bedNumber}`,
//             ward_id: newWardData.id,
//             facility_id: facilityId,
//             bed_type: "GENERAL" as BedType,
//             floor_number: newWard.floor_number,
//             wing: newWard.wing,
//             room_number: `Room ${Math.floor(i / 4) + 1}`,
//             current_status: "AVAILABLE" as BedStatus,
//             is_active: true,
//             created_by: user.id,
//             updated_by: user.id,
//           },
//         ]);
//       });

//       await Promise.all(bedPromises);

//       await fetchData();

//       setShowAddModal(false);
//       setNewWard({
//         name: "",
//         ward_type: "GENERAL",
//         total_beds: 10,
//         operating_hours: { start: "08:00", end: "20:00" },
//         description: "",
//         head_nurse_id: "",
//         phone_extension: "",
//         floor_number: 1,
//         wing: "",
//         emergency_contact: "",
//       });
//     } catch (error) {
//       console.error("Error adding ward:", error);
//       alert("Failed to add ward. Please try again.");
//     }
//   };

//   const handleBookBed = async (bedId: string) => {
//     try {
//       const bed = beds.find((b) => b.id === bedId);
//       if (!bed) return;

//       let newStatus: BedStatus;
//       if (bed.current_status === "OCCUPIED") {
//         newStatus = "AVAILABLE";
//         // If there's a booking for this bed, update it to CHECKED_OUT
//         const booking = bookings.find(
//           (b) => b.assigned_bed_id === bedId && b.status === "CHECKED_IN"
//         );
//         if (booking) {
//           await supabase
//             .from("bed_bookings")
//             .update({
//               status: "CHECKED_OUT",
//               actual_discharge_time: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//             })
//             .eq("id", booking.id);
//         }
//       } else if (bed.current_status === "AVAILABLE") {
//         newStatus = "OCCUPIED";
//       } else {
//         // For other statuses
//         newStatus = bed.current_status;
//       }

//       const { error } = await supabase
//         .from("beds")
//         .update({
//           current_status: newStatus,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", bedId);

//       if (error) throw error;

//       await fetchData();
//     } catch (error) {
//       console.error("Error updating bed status:", error);
//       alert("Failed to update bed status. Please try again.");
//     }
//   };

//   const handleViewBedDetails = (bed: Bed) => {
//     setSelectedBed(bed);
//     setSelectedPatient(bed.patient || null);
//     setSelectedBooking(bed.booking || null);
//     setShowBedDetailsModal(true);
//   };

//   const getWardStats = (ward: Ward) => {
//     const wardBeds = beds.filter((b) => b.ward_id === ward.id);

//     const occupiedBeds = wardBeds.filter(
//       (b) => b.current_status === "OCCUPIED"
//     ).length;

//     const freeBeds = wardBeds.filter(
//       (b) => b.current_status === "AVAILABLE"
//     ).length;

//     const maintenanceBeds = wardBeds.filter(
//       (b) =>
//         b.current_status === "MAINTENANCE" ||
//         b.current_status === "OUT_OF_SERVICE"
//     ).length;

//     const occupancyRate =
//       ward.total_beds > 0
//         ? ((occupiedBeds / ward.total_beds) * 100).toFixed(1)
//         : "0";

//     return { occupiedBeds, freeBeds, occupancyRate, maintenanceBeds };
//   };

//   const getBedStatusColor = (bed: Bed) => {
//     switch (bed.current_status) {
//       case "MAINTENANCE":
//       case "OUT_OF_SERVICE":
//         return "warning";
//       case "OCCUPIED":
//         return "danger";
//       case "RESERVED":
//         return "info";
//       case "CLEANING":
//         return "primary";
//       case "AVAILABLE":
//         return "success";
//       default:
//         return "secondary";
//     }
//   };

//   const getBedStatusText = (bed: Bed) => {
//     switch (bed.current_status) {
//       case "MAINTENANCE":
//         return "Under Maintenance";
//       case "OCCUPIED":
//         return "Occupied";
//       case "RESERVED":
//         return "Reserved";
//       case "AVAILABLE":
//         return "Available";
//       case "CLEANING":
//         return "Cleaning";
//       case "OUT_OF_SERVICE":
//         return "Out of Service";
//       default:
//         return bed.current_status;
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     switch (priority) {
//       case "emergency":
//         return (
//           <Badge bg="danger" className="px-2 py-1">
//             <Activity size={12} className="me-1" /> Emergency
//           </Badge>
//         );
//       case "high":
//         return (
//           <Badge bg="warning" className="px-2 py-1">
//             <AlertCircle size={12} className="me-1" /> High
//           </Badge>
//         );
//       case "medium":
//         return (
//           <Badge bg="info" className="px-2 py-1">
//             <Info size={12} className="me-1" /> Medium
//           </Badge>
//         );
//       default:
//         return (
//           <Badge bg="success" className="px-2 py-1">
//             <CheckCircle size={12} className="me-1" /> Low
//           </Badge>
//         );
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "Admitted":
//         return <Badge bg="info">Admitted</Badge>;
//       case "Critical":
//         return <Badge bg="danger">Critical</Badge>;
//       case "Discharged":
//         return <Badge bg="success">Discharged</Badge>;
//       default:
//         return <Badge bg="secondary">Pending</Badge>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout userType="facility">
//         <Container
//           fluid
//           className="d-flex justify-content-center align-items-center"
//           style={{ height: "80vh" }}
//         >
//           <div className="text-center">
//             <Spinner animation="border" variant="primary" />
//             <p className="mt-3">Loading facility data...</p>
//           </div>
//         </Container>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout userType="facility">
//         <Container
//           fluid
//           className="d-flex justify-content-center align-items-center"
//           style={{ height: "80vh" }}
//         >
//           <div className="text-center">
//             <Alert variant="danger">
//               <Alert.Heading>Error Loading Data</Alert.Heading>
//               <p>{error}</p>
//               <Button onClick={fetchData} variant="outline-danger">
//                 Retry
//               </Button>
//             </Alert>
//           </div>
//         </Container>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout userType="facility">
//       <div className="view-facility-page">
//         {/* Action Confirmation Modal */}
//         <Modal
//           show={showActionModal}
//           onHide={() => setShowActionModal(false)}
//           centered
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {currentAction === "admit" && "Confirm Patient Admission"}
//               {currentAction === "discharge" && "Confirm Patient Discharge"}
//               {currentAction === "transfer" && "Confirm Patient Transfer"}
//               {currentAction === "cancelled" && "Confirm Booking Cancellation"}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="mb-4">
//               <Alert variant="success">
//                 <div className="d-flex">
//                   <CheckCircle size={20} className="me-2" />
//                   <div>
//                     <strong>Review Completed</strong>
//                     <p className="mb-0 mt-1">
//                       You have reviewed the booking details. Please confirm the{" "}
//                       {currentAction} action.
//                     </p>
//                   </div>
//                 </div>
//               </Alert>
//             </div>

//             <div className="mb-4">
//               <Alert variant="info">
//                 <div className="d-flex">
//                   <Info size={20} className="me-2" />
//                   <div>
//                     <strong>Patient Summary</strong>
//                     <p className="mb-0 mt-1">
//                       <strong>Current Bed:</strong> {currentBed?.bed_number} •{" "}
//                       {currentBed?.bed_type} •<strong> Current Ward:</strong>{" "}
//                       {currentBed?.ward?.name || "N/A"} •
//                       <strong> Patient:</strong>{" "}
//                       {currentBooking?.patient?.name || "N/A"} •
//                       <strong> Booking Ref:</strong>{" "}
//                       {currentBooking?.booking_reference}
//                     </p>
//                   </div>
//                 </div>
//               </Alert>
//             </div>

//             <Form>
//               {currentAction === "admit" && (
//                 <>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Admission Diagnosis *</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Enter admission diagnosis"
//                       value={actionData?.admission_diagnosis || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           admission_diagnosis: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Additional Notes</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Any additional notes..."
//                       value={actionData?.notes || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           notes: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                 </>
//               )}

//               {currentAction === "discharge" && (
//                 <>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Discharge Diagnosis *</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Enter discharge diagnosis"
//                       value={actionData?.discharge_diagnosis || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           discharge_diagnosis: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Discharge Summary</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       placeholder="Enter discharge summary..."
//                       value={actionData?.discharge_summary || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           discharge_summary: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Additional Notes</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Any additional notes..."
//                       value={actionData?.notes || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           notes: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                 </>
//               )}

//               {currentAction === "transfer" && (
//                 <>
//                   <div className="mb-4">
//                     <Alert variant="warning">
//                       <div className="d-flex">
//                         <AlertCircle size={20} className="me-2" />
//                         <div>
//                           <strong>Transfer Patient</strong>
//                           <p className="mb-0 mt-1">
//                             Transfer patient from current location to a new
//                             bed/ward
//                           </p>
//                         </div>
//                       </div>
//                     </Alert>
//                   </div>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Select New Ward</Form.Label>
//                     <Form.Select
//                       value={actionData?.new_ward_id || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           new_ward_id: e.target.value,
//                           new_bed_id: "", // Reset bed when ward changes
//                         })
//                       }
//                       required
//                     >
//                       <option value="">Select Ward</option>
//                       {wards
//                         .filter((ward) => ward.id !== currentBed?.ward_id) // Exclude current ward
//                         .map((ward) => (
//                           <option key={ward.id} value={ward.id}>
//                             {ward.name} ({ward.ward_type}) -{" "}
//                             {ward.available_beds} beds available
//                           </option>
//                         ))}
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Select New Bed</Form.Label>
//                     <Form.Select
//                       value={actionData?.new_bed_id || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           new_bed_id: e.target.value,
//                         })
//                       }
//                       required
//                       disabled={!actionData?.new_ward_id}
//                     >
//                       <option value="">Select Bed</option>
//                       {actionData?.new_ward_id &&
//                         beds
//                           .filter(
//                             (bed) =>
//                               bed.ward_id === actionData.new_ward_id &&
//                               bed.current_status === "AVAILABLE" &&
//                               bed.id !== currentBed?.id
//                           )
//                           .map((bed) => (
//                             <option key={bed.id} value={bed.id}>
//                               {bed.bed_number} ({bed.bed_type}) - Room{" "}
//                               {bed.room_number}
//                             </option>
//                           ))}
//                     </Form.Select>
//                     {actionData?.new_ward_id &&
//                       beds.filter(
//                         (bed) =>
//                           bed.ward_id === actionData.new_ward_id &&
//                           bed.current_status === "AVAILABLE"
//                       ).length === 0 && (
//                         <small className="text-danger">
//                           No available beds in selected ward
//                         </small>
//                       )}
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Transfer Reason *</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Why is this transfer necessary? (e.g., patient condition change, ward specialization needed)"
//                       value={actionData?.transfer_reason || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           transfer_reason: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Clinical Notes</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Clinical observations and notes for transfer..."
//                       value={actionData?.clinical_notes || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           clinical_notes: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Administrative Notes</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       placeholder="Administrative/logistical notes..."
//                       value={actionData?.administrative_notes || ""}
//                       onChange={(e) =>
//                         setActionData({
//                           ...actionData,
//                           administrative_notes: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>

//                   {actionData?.new_bed_id && (
//                     <div className="mb-3 p-3 bg-light rounded">
//                       <h6>Transfer Summary</h6>
//                       <p className="mb-1">
//                         <strong>From:</strong> Bed {currentBed?.bed_number} (
//                         {currentBed?.bed_type}) in {currentBed?.ward?.name}
//                       </p>
//                       <p className="mb-0">
//                         <strong>To:</strong> Bed{" "}
//                         {
//                           beds.find((b) => b.id === actionData.new_bed_id)
//                             ?.bed_number
//                         }{" "}
//                         (
//                         {
//                           beds.find((b) => b.id === actionData.new_bed_id)
//                             ?.bed_type
//                         }
//                         ) in{" "}
//                         {
//                           wards.find((w) => w.id === actionData.new_ward_id)
//                             ?.name
//                         }
//                       </p>
//                     </div>
//                   )}
//                 </>
//               )}

//               {currentAction === "cancelled" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Cancellation Reason *</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     placeholder="Please specify the reason for cancellation..."
//                     value={actionData?.notes || ""}
//                     onChange={(e) =>
//                       setActionData({
//                         ...actionData,
//                         notes: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                   <Form.Text className="text-muted">
//                     This information will be recorded in the booking history.
//                   </Form.Text>
//                 </Form.Group>
//               )}
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setShowActionModal(false);
//                 // Optionally, go back to booking details
//                 setTimeout(() => {
//                   setSelectedBookingForDetails(currentBooking);
//                   setShowBookingDetailsModal(true);
//                 }, 100);
//               }}
//             >
//               Back to Details
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleExecuteAction}
//               disabled={
//                 currentAction === "transfer" &&
//                 (!actionData?.new_ward_id ||
//                   !actionData?.new_bed_id ||
//                   !actionData?.transfer_reason)
//               }
//             >
//               Confirm {currentAction}
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         {/* Booking Details Modal */}
//         <Modal
//           show={showBookingDetailsModal}
//           onHide={() => setShowBookingDetailsModal(false)}
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Booking Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedBookingForDetails && (
//               <div>
//                 <div className="mb-4">
//                   <Alert variant="info">
//                     <div className="d-flex">
//                       <Info size={20} className="me-2" />
//                       <div>
//                         <h6 className="mb-2">
//                           Ready to {currentAction} Patient
//                         </h6>
//                         <p className="mb-0">
//                           Review the booking details below before proceeding to{" "}
//                           {currentAction}.
//                         </p>
//                       </div>
//                     </div>
//                   </Alert>
//                 </div>

//                 <div className="mb-4">
//                   <h5>Booking Information</h5>
//                   <Row>
//                     <Col md={6}>
//                       <p>
//                         <strong>Reference:</strong>{" "}
//                         {selectedBookingForDetails.booking_reference}
//                       </p>
//                       <p>
//                         <strong>Status:</strong>
//                         <Badge
//                           bg={
//                             selectedBookingForDetails.status === "RESERVED"
//                               ? "info"
//                               : selectedBookingForDetails.status === "AVAILABLE"
//                               ? "success"
//                               : selectedBookingForDetails.status ===
//                                 "CHECKED_IN"
//                               ? "primary"
//                               : selectedBookingForDetails.status ===
//                                 "CHECKED_OUT"
//                               ? "secondary"
//                               : selectedBookingForDetails.status === "CANCELLED"
//                               ? "danger"
//                               : "warning"
//                           }
//                           className="ms-2"
//                         >
//                           {selectedBookingForDetails.status}
//                         </Badge>
//                       </p>
//                       <p>
//                         <strong>Admission Type:</strong>{" "}
//                         {selectedBookingForDetails.admission_type}
//                       </p>
//                       <p>
//                         <strong>Patient Type:</strong>{" "}
//                         {selectedBookingForDetails.patient_type}
//                       </p>
//                     </Col>
//                     <Col md={6}>
//                       <p>
//                         <strong>Priority:</strong>
//                         <Badge
//                           bg={
//                             selectedBookingForDetails.priority === "CRITICAL"
//                               ? "danger"
//                               : selectedBookingForDetails.priority === "HIGH"
//                               ? "warning"
//                               : selectedBookingForDetails.priority === "MEDIUM"
//                               ? "info"
//                               : "success"
//                           }
//                           className="ms-2"
//                         >
//                           {selectedBookingForDetails.priority}
//                         </Badge>
//                       </p>
//                       <p>
//                         <strong>Required Bed Type:</strong>{" "}
//                         {selectedBookingForDetails.required_bed_type}
//                       </p>
//                       <p>
//                         <strong>Expected Stay:</strong>{" "}
//                         {formatDate(
//                           selectedBookingForDetails.expected_admission_date
//                         )}{" "}
//                         to{" "}
//                         {formatDate(
//                           selectedBookingForDetails.expected_discharge_date
//                         )}
//                       </p>
//                     </Col>
//                   </Row>
//                 </div>

//                 <div className="mb-4">
//                   <h5>Medical Information</h5>
//                   <Row>
//                     <Col md={6}>
//                       <p>
//                         <strong>Primary Diagnosis:</strong>{" "}
//                         {selectedBookingForDetails.primary_diagnosis || "N/A"}
//                       </p>
//                       <p>
//                         <strong>Secondary Diagnosis:</strong>{" "}
//                         {selectedBookingForDetails.secondary_diagnosis || "N/A"}
//                       </p>
//                     </Col>
//                     <Col md={6}>
//                       <p>
//                         <strong>Allergies:</strong>{" "}
//                         {selectedBookingForDetails.allergies || "None reported"}
//                       </p>
//                       <p>
//                         <strong>Special Instructions:</strong>{" "}
//                         {selectedBookingForDetails.special_instructions ||
//                           "N/A"}
//                       </p>
//                     </Col>
//                   </Row>
//                 </div>

//                 {selectedBookingForDetails.special_requirements &&
//                   selectedBookingForDetails.special_requirements.length > 0 && (
//                     <div className="mb-4">
//                       <h5>Special Requirements</h5>
//                       <div className="d-flex flex-wrap gap-2">
//                         {selectedBookingForDetails.special_requirements.map(
//                           (req, idx) => (
//                             <Badge key={idx} bg="info" className="px-3 py-2">
//                               {req}
//                             </Badge>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   )}

//                 {selectedBookingForDetails.patient && (
//                   <div className="mb-4">
//                     <h5>Patient Information</h5>
//                     <Row>
//                       <Col md={6}>
//                         <p>
//                           <strong>Name:</strong>{" "}
//                           {selectedBookingForDetails.patient.name}
//                         </p>
//                         <p>
//                           <strong>Age:</strong>{" "}
//                           {selectedBookingForDetails.patient.age} years
//                         </p>
//                         <p>
//                           <strong>Gender:</strong>{" "}
//                           {selectedBookingForDetails.patient.gender}
//                         </p>
//                         <p>
//                           <strong>Blood Group:</strong>{" "}
//                           {selectedBookingForDetails.patient.bloodGroup}
//                         </p>
//                       </Col>
//                       <Col md={6}>
//                         <p>
//                           <strong>Contact:</strong>{" "}
//                           {selectedBookingForDetails.patient.contact}
//                         </p>
//                         <p>
//                           <strong>Emergency Contact:</strong>{" "}
//                           {selectedBookingForDetails.patient.emergencyContact}
//                         </p>
//                         {selectedBookingForDetails.patient.allergies &&
//                           selectedBookingForDetails.patient.allergies.length >
//                             0 && (
//                             <p>
//                               <strong>Allergies:</strong>{" "}
//                               {selectedBookingForDetails.patient.allergies.join(
//                                 ", "
//                               )}
//                             </p>
//                           )}
//                       </Col>
//                     </Row>
//                   </div>
//                 )}

//                 <div className="mt-4 pt-3 border-top">
//                   <small className="text-muted">
//                     <strong>Created:</strong>{" "}
//                     {formatDate(selectedBookingForDetails.created_at)} •
//                     <strong>Last Updated:</strong>{" "}
//                     {formatDate(selectedBookingForDetails.updated_at)}
//                   </small>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button
//               variant="secondary"
//               onClick={() => setShowBookingDetailsModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleProceedToAction}>
//               Proceed to {currentAction}
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         {/* Header Section */}
//         <div className="page-header bg-gradient-primary mb-4">
//           <Container fluid>
//             <Row className="align-items-center py-4">
//               <Col>
//                 <div className="d-flex align-items-center">
//                   <div className="header-icon-wrapper bg-white p-3 rounded-circle me-3">
//                     <Building size={32} className="text-primary" />
//                   </div>
//                   <div>
//                     <h1 className="h2 text-white mb-1">Bed Bookings</h1>
//                     <p className="text-white-50 mb-0">
//                       Manage wards, monitor bed availability, and handle patient
//                       bookings
//                     </p>
//                   </div>
//                 </div>
//               </Col>
//               <Col xs="auto">
//                 <div className="d-flex gap-3">
//                   <Button
//                     variant="light"
//                     className="d-flex align-items-center"
//                     onClick={fetchData}
//                     disabled={refreshing}
//                   >
//                     <RefreshCw
//                       size={18}
//                       className={`me-2 ${refreshing ? "spin" : ""}`}
//                     />
//                     {refreshing ? "Refreshing..." : "Refresh Data"}
//                   </Button>
//                   <Button variant="light" className="d-flex align-items-center">
//                     <Download size={18} className="me-2" />
//                     Export Report
//                   </Button>
//                   <Button
//                     variant="light"
//                     className="d-flex align-items-center"
//                     onClick={() => setShowAddModal(true)}
//                   >
//                     <PlusCircle size={18} className="me-2" />
//                     Add New Ward
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </div>

//         <Container fluid>
//           {/* Quick Stats Row */}
//           <Row className="mb-4 g-4">
//             <Col xl={3} lg={6}>
//               <Card className="border-0 shadow-sm h-100 hover-lift">
//                 <Card.Body className="py-4">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
//                       <Building size={24} className="text-primary" />
//                     </div>
//                     <div>
//                       <div className="text-muted small">Total Wards</div>
//                       <h3 className="mb-0">{totalWards}</h3>
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <small className="text-muted">
//                       Across {new Set(wards.map((w) => w.ward_type)).size}{" "}
//                       department types
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col xl={3} lg={6}>
//               <Card className="border-0 shadow-sm h-100 hover-lift">
//                 <Card.Body className="py-4">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
//                       <BedIcon size={24} className="text-success" />
//                     </div>
//                     <div>
//                       <div className="text-muted small">Total Beds</div>
//                       <h3 className="mb-0">{totalBeds}</h3>
//                     </div>
//                   </div>
//                   <div className="mt-3 d-flex justify-content-between">
//                     <div>
//                       <Badge bg="success" className="px-2">
//                         {totalAvailableBeds} Available
//                       </Badge>
//                     </div>
//                     <div>
//                       <Badge bg="danger" className="px-2">
//                         {totalOccupiedBeds} Occupied
//                       </Badge>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col xl={3} lg={6}>
//               <Card className="border-0 shadow-sm h-100 hover-lift">
//                 <Card.Body className="py-4">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
//                       <Percent size={24} className="text-warning" />
//                     </div>
//                     <div>
//                       <div className="text-muted small">Occupancy Rate</div>
//                       <h3 className="mb-0">{overallOccupancyRate}%</h3>
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <ProgressBar
//                       now={parseFloat(overallOccupancyRate)}
//                       variant={
//                         parseFloat(overallOccupancyRate) > 85
//                           ? "danger"
//                           : parseFloat(overallOccupancyRate) > 70
//                           ? "warning"
//                           : "success"
//                       }
//                       className="rounded-pill"
//                       style={{ height: "6px" }}
//                     />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col xl={3} lg={6}>
//               <Card className="border-0 shadow-sm h-100 hover-lift">
//                 <Card.Body className="py-4">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
//                       <Users size={24} className="text-danger" />
//                     </div>
//                     <div>
//                       <div className="text-muted small">Admitted Patients</div>
//                       <h3 className="mb-0">{admittedPatients}</h3>
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <small className="text-muted">
//                       {criticalPatients} in critical condition
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Search and Filter Bar */}
//           <Card className="border-0 shadow-sm mb-4">
//             <Card.Body className="py-3">
//               <Row className="align-items-center">
//                 <Col md={6}>
//                   <InputGroup>
//                     <InputGroup.Text className="bg-light border-end-0">
//                       <Search size={18} />
//                     </InputGroup.Text>
//                     <Form.Control
//                       placeholder="Search wards, beds, or patients..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="border-start-0"
//                     />
//                   </InputGroup>
//                 </Col>
//                 <Col md={6}>
//                   <div className="d-flex gap-3 justify-content-md-end mt-3 mt-md-0">
//                     <div className="d-flex align-items-center">
//                       <Filter size={18} className="me-2 text-muted" />
//                       <Form.Select
//                         size="sm"
//                         style={{ width: "150px" }}
//                         value={wardTypeFilter}
//                         onChange={(e) => setWardTypeFilter(e.target.value)}
//                       >
//                         <option value="all">All Types</option>
//                         <option value="General">General</option>
//                         <option value="ICU">ICU</option>
//                         <option value="Pediatric">Pediatric</option>
//                         <option value="Maternity">Maternity</option>
//                         <option value="Surgical">Surgical</option>
//                         <option value="Isolation">Isolation</option>
//                       </Form.Select>
//                     </div>
//                     <Button variant="outline-primary" size="sm">
//                       <CalendarDays className="me-1" />
//                       View Schedule
//                     </Button>
//                   </div>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>

//           {/* Tabs Navigation */}
//           <Tab.Container
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k || "overview")}
//           >
//             <Card className="border-0 shadow-sm mb-4">
//               <Card.Header className="bg-white border-bottom-0 pt-3">
//                 <Nav variant="tabs" className="border-bottom-0">
//                   <Nav.Item>
//                     <Nav.Link
//                       eventKey="overview"
//                       className="d-flex align-items-center"
//                     >
//                       <Building size={18} className="me-2" />
//                       Ward Overview
//                     </Nav.Link>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <Nav.Link
//                       eventKey="beds"
//                       className="d-flex align-items-center"
//                     >
//                       <BedIcon size={18} className="me-2" />
//                       Bed Management
//                     </Nav.Link>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <Nav.Link
//                       eventKey="bed-bookings"
//                       className="d-flex align-items-center"
//                     >
//                       <BedIcon size={18} className="me-2" />
//                       Bed Booking Management
//                     </Nav.Link>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <Nav.Link
//                       eventKey="patients"
//                       className="d-flex align-items-center"
//                     >
//                       <Users size={18} className="me-2" />
//                       Patient Bookings
//                     </Nav.Link>
//                   </Nav.Item>
//                   <Nav.Item>
//                     <Nav.Link
//                       eventKey="reports"
//                       className="d-flex align-items-center"
//                     >
//                       <Activity size={18} className="me-2" />
//                       Analytics & Reports
//                     </Nav.Link>
//                   </Nav.Item>
//                 </Nav>
//               </Card.Header>

//               <Card.Body className="pt-4">
//                 <Tab.Content>
//                   {/* Tab 1: Ward Overview */}
//                   <Tab.Pane eventKey="overview">
//                     {filteredWards.length === 0 ? (
//                       <Alert variant="info">
//                         No wards found. Create your first ward to get started.
//                       </Alert>
//                     ) : (
//                       <Row className="g-4">
//                         {filteredWards.map((ward) => {
//                           const stats = getWardStats(ward);
//                           return (
//                             <Col xl={4} lg={6} key={ward.id}>
//                               <Card className="border-0 shadow-sm h-100 hover-lift">
//                                 <Card.Header className="bg-white border-bottom pb-3">
//                                   <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                       <h5 className="mb-1">{ward.name}</h5>
//                                       <div className="d-flex align-items-center gap-2">
//                                         <Badge
//                                           bg={
//                                             ward.ward_type === "ICU"
//                                               ? "danger"
//                                               : ward.ward_type === "Pediatric"
//                                               ? "info"
//                                               : ward.ward_type === "Maternity"
//                                               ? "pink"
//                                               : "secondary"
//                                           }
//                                           className="px-2 py-1"
//                                         >
//                                           {ward.ward_type}
//                                         </Badge>
//                                         <Badge
//                                           bg="light"
//                                           text="dark"
//                                           className="px-2 py-1"
//                                         >
//                                           <Clock size={12} className="me-1" />
//                                           {ward.operatingHours?.start ||
//                                             "08:00"}{" "}
//                                           -{" "}
//                                           {ward.operatingHours?.end || "20:00"}
//                                         </Badge>
//                                       </div>
//                                     </div>
//                                     <Button
//                                       variant="link"
//                                       className="p-0"
//                                       onClick={() => setSelectedWard(ward)}
//                                     >
//                                       <ChevronRight size={20} />
//                                     </Button>
//                                   </div>
//                                 </Card.Header>
//                                 <Card.Body>
//                                   <p className="text-muted mb-3">
//                                     {ward.description ||
//                                       "No description available"}
//                                   </p>

//                                   <div className="mb-4">
//                                     <div className="d-flex justify-content-between mb-1">
//                                       <span className="small">
//                                         Bed Occupancy
//                                       </span>
//                                       <span className="small fw-bold">
//                                         {stats.occupancyRate}%
//                                       </span>
//                                     </div>
//                                     <ProgressBar
//                                       now={parseFloat(stats.occupancyRate)}
//                                       variant={
//                                         parseFloat(stats.occupancyRate) > 85
//                                           ? "danger"
//                                           : parseFloat(stats.occupancyRate) > 70
//                                           ? "warning"
//                                           : "success"
//                                       }
//                                       className="rounded-pill"
//                                       style={{ height: "8px" }}
//                                     />
//                                   </div>

//                                   <Row className="text-center g-2 mb-3">
//                                     <Col>
//                                       <div className="p-2 bg-light rounded">
//                                         <div className="h4 mb-1">
//                                           {ward.total_beds}
//                                         </div>
//                                         <small className="text-muted">
//                                           Total
//                                         </small>
//                                       </div>
//                                     </Col>
//                                     <Col>
//                                       <div className="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded">
//                                         <div className="h4 mb-1 text-success">
//                                           {stats.freeBeds}
//                                         </div>
//                                         <small className="text-muted">
//                                           Available
//                                         </small>
//                                       </div>
//                                     </Col>
//                                     <Col>
//                                       <div className="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded">
//                                         <div className="h4 mb-1 text-danger">
//                                           {stats.occupiedBeds}
//                                         </div>
//                                         <small className="text-muted">
//                                           Occupied
//                                         </small>
//                                       </div>
//                                     </Col>
//                                     <Col>
//                                       <div className="p-2 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded">
//                                         <div className="h4 mb-1 text-warning">
//                                           {stats.maintenanceBeds}
//                                         </div>
//                                         <small className="text-muted">
//                                           Maintenance
//                                         </small>
//                                       </div>
//                                     </Col>
//                                   </Row>

//                                   <div className="border-top pt-3">
//                                     <div className="d-flex justify-content-between align-items-center">
//                                       <div>
//                                         <small className="text-muted">
//                                           Head Nurse:
//                                         </small>
//                                         <div className="fw-medium">
//                                           {ward.head_nurse?.full_name ||
//                                             "Not assigned"}
//                                         </div>
//                                       </div>
//                                       <div className="text-end">
//                                         <small className="text-muted">
//                                           Floor:
//                                         </small>
//                                         <div className="fw-medium">
//                                           Floor {ward.floor_number}{" "}
//                                           {ward.wing ? `- ${ward.wing}` : ""}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Card.Body>
//                                 <Card.Footer className="bg-white border-top-0">
//                                   <Button
//                                     variant="outline-primary"
//                                     size="sm"
//                                     className="w-100"
//                                     onClick={() => setSelectedWard(ward)}
//                                   >
//                                     View Ward Details
//                                   </Button>
//                                 </Card.Footer>
//                               </Card>
//                             </Col>
//                           );
//                         })}
//                       </Row>
//                     )}
//                   </Tab.Pane>

//                   {/* Tab 2: Bed Management */}
//                   <Tab.Pane eventKey="beds">
//   <Row>
//     <Col lg={4} xl={3}>
//       <Card>
//         <Card.Header>
//           <Card.Title className="flex items-center gap-2">
//             <CalendarDays className="h-5 w-5" />
//             Bed Management
//           </Card.Title>
//           <Card.Title className="text-muted" style={{ fontSize: '0.9rem' }}>
//             Select date to view bed status & maintenance
//           </Card.Title>
//         </Card.Header>
//         <Card.Body>
//           <div className="mb-4">
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={setSelectedDate}
//               className="rounded-md border"
//             />
//           </div>
          
//           {/* Bed Statistics Summary */}
//           <div className="mt-4">
//             <h6 className="mb-3">Bed Status Summary</h6>
//             <div className="d-flex flex-column gap-2">
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted">Total Beds</span>
//                 <Badge bg="secondary">{beds.length}</Badge>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted">Occupied</span>
//                 <Badge bg="danger">
//                   {beds.filter(b => b.current_status === 'OCCUPIED' || b.isOccupied).length}
//                 </Badge>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted">Available</span>
//                 <Badge bg="success">
//                   {beds.filter(b => b.current_status === 'AVAILABLE' && !b.isOccupied).length}
//                 </Badge>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted">Maintenance</span>
//                 <Badge bg="warning">
//                   {beds.filter(b => b.maintenance || b.current_status === 'MAINTENANCE').length}
//                 </Badge>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted">Active Status</span>
//                 <Badge bg={beds.filter(b => b.is_active).length > 0 ? "success" : "danger"}>
//                   {beds.filter(b => b.is_active).length} Active
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     </Col>

//     <Col lg={8} xl={9}>
//       <Card className="border-0 shadow-sm">
//         <Card.Header className="bg-white border-bottom">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">Bed Details & Management</h5>
//             <div className="text-muted">
//               <small>
//                 Last Updated: {new Date().toLocaleDateString()} | 
//                 Showing {beds.length} beds
//               </small>
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body>
//           {beds.length === 0 ? (
//             <Alert variant="info">
//               No beds available. Add beds to the system to start management.
//             </Alert>
//           ) : (
//             <div className="row g-3">
//               {beds.map((bed) => {
//                 const bedBooking = bookings.find(
//                   (booking) => booking.assigned_bed_id === bed.id
//                 );
//                 const actionStatus = bedActionStatus[bed.id];

//                 return (
//                   <Col>
//                     <Card className="border hover-lift">
//                       <Card.Body>
//                         {/* Bed Header with Status */}
//                         <div className="d-flex justify-content-between align-items-start mb-3">
//                           <div>
//                             <h6 className="mb-1">
//                               <strong>Bed #{bed.bed_number}</strong>
//                               {bed.bed_label && ` (${bed.bed_label})`}
//                             </h6>
//                             <div className="d-flex align-items-center gap-2">
//                               <Badge 
//                                 bg={getBedStatusColor(bed)}
//                                 className="px-2 py-1"
//                               >
//                                 {bed.current_status}
//                               </Badge>
//                               <Badge 
//                                 bg={bed.is_active ? "success" : "danger"}
//                                 className="px-2 py-1"
//                               >
//                                 {bed.is_active ? "Active" : "Inactive"}
//                               </Badge>
//                             </div>
//                           </div>
//                           <div>
//                             <Button
//                               variant="link"
//                               size="sm"
//                               className="p-0 me-1"
//                               onClick={() => handleViewBedDetails(bed)}
//                               title="View bed details"
//                             >
//                               <Info size={16} />
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Bed Basic Information */}
//                         <div className="mb-3">
//                           <Row className="g-2">
//                             <Col xs={6}>
//                               <small className="text-muted d-block">Ward</small>
//                               <span className="fw-medium">
//                                 {bed.ward?.name || `Ward ${bed.ward_id}`}
//                               </span>
//                             </Col>
//                             <Col xs={6}>
//                               <small className="text-muted d-block">Room</small>
//                               <span className="fw-medium">
//                                 {bed.room_number || "N/A"}
//                               </span>
//                             </Col>
//                             <Col xs={6}>
//                               <small className="text-muted d-block">Floor</small>
//                               <span className="fw-medium">
//                                 {bed.floor_number || "N/A"}
//                               </span>
//                             </Col>
//                             <Col xs={6}>
//                               <small className="text-muted d-block">Wing</small>
//                               <span className="fw-medium">
//                                 {bed.wing || "N/A"}
//                               </span>
//                             </Col>
//                           </Row>
//                         </div>

//                         {/* Bed Type and Specifications */}
//                         <div className="mb-3">
//                           <small className="text-muted d-block">Bed Type & Specs</small>
//                           <div className="d-flex flex-wrap gap-1 mt-1">
//                             <Badge bg="info" className="px-2 py-1">
//                               {bed.bed_type}
//                             </Badge>
//                             {bed.is_bariatric && (
//                               <Badge bg="warning" text="dark" className="px-2 py-1">
//                                 Bariatric
//                               </Badge>
//                             )}
//                             {bed.is_isolation && (
//                               <Badge bg="danger" className="px-2 py-1">
//                                 Isolation
//                               </Badge>
//                             )}
//                           </div>
//                           <div className="mt-2 small">
//                             <span className="text-muted">Size: </span>
//                             {bed.width_cm}×{bed.length_cm}cm | 
//                             <span className="text-muted ms-2">Max: </span>
//                             {bed.max_weight_kg}kg
//                           </div>
//                         </div>

//                         {/* Equipment Status */}
//                         <div className="mb-3">
//                           <small className="text-muted d-block">Equipment</small>
//                           <div className="d-flex flex-wrap gap-1 mt-1">
//                             {bed.has_oxygen && (
//                               <Badge bg="primary" className="px-2 py-1">
//                                 O₂
//                               </Badge>
//                             )}
//                             {bed.has_suction && (
//                               <Badge bg="secondary" className="px-2 py-1">
//                                 Suction
//                               </Badge>
//                             )}
//                             {bed.has_monitor && (
//                               <Badge bg="success" className="px-2 py-1">
//                                 Monitor
//                               </Badge>
//                             )}
//                             {bed.has_ventilator && (
//                               <Badge bg="danger" className="px-2 py-1">
//                                 Ventilator
//                               </Badge>
//                             )}
//                             {bed.equipment && bed.equipment.length > 0 && (
//                               <Badge bg="light" text="dark" className="px-2 py-1">
//                                 +{bed.equipment.length}
//                               </Badge>
//                             )}
//                           </div>
//                         </div>

//                         {/* Patient Information */}
//                         {bed.patient && (
//                           <div className="mb-3 border-top pt-3">
//                             <small className="text-muted d-block">Current Patient</small>
//                             <div className="d-flex align-items-center mt-1">
//                               <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//                                 <User size={14} />
//                               </div>
//                               <div>
//                                 <div className="fw-medium">{bed.patient.name}</div>
//                                 <small className="text-muted">
//                                   {bed.booking?.primary_diagnosis || "Diagnosis not specified"}
//                                 </small>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* Restrictions */}
//                         {bed.restrictions && bed.restrictions.length > 0 && (
//                           <div className="mb-3">
//                             <small className="text-muted d-block">Restrictions</small>
//                             <div className="d-flex flex-wrap gap-1 mt-1">
//                               {bed.restrictions.slice(0, 3).map((rest, idx) => (
//                                 <Badge key={idx} bg="warning" text="dark" className="px-2 py-1">
//                                   {rest}
//                                 </Badge>
//                               ))}
//                               {bed.restrictions.length > 3 && (
//                                 <Badge bg="light" text="dark" className="px-2 py-1">
//                                   +{bed.restrictions.length - 3}
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Maintenance Information */}
//                         <div className="border-top pt-3">
//                           <div className="d-flex justify-content-between align-items-center">
//                             <div className="small">
//                               <div>
//                                 <span className="text-muted">Last Maintenance: </span>
//                                 <span>{formatDate(bed.last_maintenance_date)}</span>
//                               </div>
//                               <div>
//                                 <span className="text-muted">Next Due: </span>
//                                 <span className="fw-medium">{formatDate(bed.next_maintenance_date)}</span>
//                               </div>
//                             </div>
//                             {bed.maintenance && (
//                               <Badge bg="warning" className="px-2 py-1">
//                                 Maintenance Due
//                               </Badge>
//                             )}
//                           </div>
//                         </div>

//                         {/* System Information */}
//                         <div className="border-top pt-3 mt-3">
//                           <div className="small text-muted">
//                             <div className="d-flex justify-content-between">
//                               <span>Created:</span>
//                               <span>{formatDate(bed.created_at)}</span>
//                             </div>
//                             <div className="d-flex justify-content-between">
//                               <span>Last Updated:</span>
//                               <span>{formatDate(bed.updated_at)}</span>
//                             </div>
//                             {bed.created_by && (
//                               <div className="d-flex justify-content-between">
//                                 <span>Created By:</span>
//                                 <span>{bed.created_by}</span>
//                               </div>
//                             )}
//                             {bed.updated_by && (
//                               <div className="d-flex justify-content-between">
//                                 <span>Updated By:</span>
//                                 <span>{bed.updated_by}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="mt-3 pt-3 border-top">
//                           <div className="d-flex flex-wrap gap-2">
//                             {bedBooking ? (
//                               <>
//                                 {!actionStatus && (
//                                   <>
//                                     <Button
//                                       size="sm"
//                                       variant="success"
//                                       onClick={() => handleActionConfirmation("admit", bed)}
//                                     >
//                                       Admit
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="outline-danger"
//                                       onClick={() => handleActionConfirmation("cancelled", bed)}
//                                     >
//                                       Cancel
//                                     </Button>
//                                   </>
//                                 )}
//                                 {(bed.current_status === 'OCCUPIED' || bed.isOccupied) && (
//                                   <>
//                                     <Button
//                                       size="sm"
//                                       variant="warning"
//                                       onClick={() => handleActionConfirmation("transfer", bed)}
//                                     >
//                                       Transfer
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="danger"
//                                       onClick={() => handleActionConfirmation("discharge", bed)}
//                                     >
//                                       Discharge
//                                     </Button>
//                                   </>
//                                 )}
//                               </>
//                             ) : (
//                               <Button
//                                 size="sm"
//                                 variant="primary"
//                                 // onClick={() => handleAssignPatient(bed)}
//                               >
//                                 Assign Patient
//                               </Button>
//                             )}
                            
//                             <Button
//                               size="sm"
//                               variant="outline-secondary"
//                               // onClick={() => handleMaintenanceRequest(bed)}
//                             >
//                               Maintenance
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </div>
//           )}
//         </Card.Body>
//       </Card>
//     </Col>
//   </Row>
// </Tab.Pane>
//                   {/* Tab 3: Bed Management */}
//                   <Tab.Pane eventKey="bed-bookings">
//                     <Row>
//                       <Col lg={4} xl={3}>
//                         <Card>
//                           <Card.Header>
//                             <Card.Title className="flex items-center gap-2">
//                               <CalendarDays className="h-5 w-5" />
//                               Select Date
//                             </Card.Title>
//                             <Card.Title>
//                               Choose a date to view available seminars
//                             </Card.Title>
//                           </Card.Header>
//                           <Card.Text>
//                             <Calendar
//                               mode="single"
//                               selected={selectedDate}
//                               onSelect={setSelectedDate}
//                               className="rounded-md border"
//                             />
//                           </Card.Text>
//                         </Card>
//                       </Col>

//                       <Col lg={8} xl={9}>
//                         <Card className="border-0 shadow-sm">
//                           <Card.Header className="bg-white border-bottom">
//                             <h5 className="mb-0">Hospital Bed Status</h5>
//                           </Card.Header>
//                           <Card.Body>
//                             {wards.length === 0 ? (
//                               <Alert variant="info">
//                                 No wards available. Add a ward to see beds.
//                               </Alert>
//                             ) : (
//                               wards.map((ward) => {
//                                 const wardBeds = beds.filter(
//                                   (bed) => bed.ward_id === ward.id
//                                 );
//                                 if (wardBeds.length === 0) return null;

//                                 return (
//                                   <div key={ward.id} className="mb-5">
//                                     <div className="d-flex justify-content-between align-items-center mb-3">
//                                       <div>
//                                         <h5 className="mb-1">{ward.name}</h5>
//                                         <div className="d-flex align-items-center gap-2">
//                                           <Badge
//                                             bg="light"
//                                             text="dark"
//                                             className="px-2 py-1"
//                                           >
//                                             <Building
//                                               size={12}
//                                               className="me-1"
//                                             />
//                                             Floor {ward.floor_number}
//                                           </Badge>
//                                         </div>
//                                       </div>
                                     
//                                     </div>

//                                     <div className="row g-3">
//                                       {wardBeds.map((bed) => {
//                                         // Find booking for this bed
//                                         const bedBooking = bookings.find(
//                                           (booking) =>
//                                             booking.assigned_bed_id === bed.id
//                                         );

//                                         // Get current action status
//                                         const actionStatus =
//                                           bedActionStatus[bed.id];

//                                         // Determine which buttons to show
//                                         const showAdmitButton =
//                                           bedBooking &&
//                                           (bedBooking.status === "RESERVED" ||
//                                             bedBooking.status ===
//                                               "AVAILABLE") &&
//                                           !actionStatus;

//                                         const showCancelledButton =
//                                           bedBooking &&
//                                           (bedBooking.status === "RESERVED" ||
//                                             bedBooking.status === "AVAILABLE" ||
//                                             bedBooking.status === "PENDING") &&
//                                           !actionStatus;

//                                         const showTransferButton =
//                                           actionStatus === "AVAILABLE" ||
//                                           (bedBooking &&
//                                             bedBooking.status === "OCCUPIED");

//                                         const showDischargeButton =
//                                           actionStatus === "AVAILABLE" ||
//                                           (bedBooking &&
//                                             bedBooking.status === "OCCUPIED");

//                                         return (
//                                           <Col key={bed.id}>
//                                             <Card
//                                               className={`border hover-lift ${
//                                                 getBedStatusColor(bed) ===
//                                                 "warning"
//                                                   ? "border-warning"
//                                                   : getBedStatusColor(bed) ===
//                                                     "danger"
//                                                   ? "border-danger"
//                                                   : "border-success"
//                                               }`}
//                                             >
//                                               <Card.Body>
//                                                 <div className="d-flex justify-content-between align-items-start mb-3">
//                                                   <div>
//                                                     <h6 className="mb-1">
//                                                       Bed Number:{" "}
//                                                       {bed.bed_number}
//                                                     </h6>
//                                                     <Badge
//                                                       bg={getBedStatusColor(
//                                                         bed
//                                                       )}
//                                                       className="px-2 py-1"
//                                                     >
//                                                       {getBedStatusText(bed)}
//                                                     </Badge>
//                                                     {bedBooking && (
//                                                       <div className="mt-1">
//                                                         <Badge
//                                                           bg="info"
//                                                           className="px-2 py-1"
//                                                         >
//                                                           {bedBooking.status}
//                                                         </Badge>
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                   <div>
//                                                     <Button
//                                                       variant="link"
//                                                       size="sm"
//                                                       className="p-0 me-1"
//                                                       onClick={() =>
//                                                         handleViewBookingDetails(
//                                                           bed
//                                                         )
//                                                       }
//                                                       title="View booking details"
//                                                     >
//                                                       <Eye size={16} />
//                                                     </Button>
//                                                     <Button
//                                                       variant="link"
//                                                       size="sm"
//                                                       className="p-0"
//                                                       onClick={() =>
//                                                         handleViewBedDetails(
//                                                           bed
//                                                         )
//                                                       }
//                                                       title="View bed details"
//                                                     >
//                                                       <Info size={16} />
//                                                     </Button>
//                                                   </div>
//                                                 </div>

//                                                 <div className="mb-3">
//                                                   <small className="text-muted d-block">
//                                                     Bed Type
//                                                   </small>
//                                                   <span className="fw-medium">
//                                                     {bed.bed_type}
//                                                   </span>
//                                                 </div>

//                                                 {bed.patient && (
//                                                   <div className="mb-3">
//                                                     <small className="text-muted d-block">
//                                                       Current Patient
//                                                     </small>
//                                                     <div className="d-flex align-items-center">
//                                                       <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//                                                         <User size={14} />
//                                                       </div>
//                                                       <div>
//                                                         <div className="fw-medium">
//                                                           {bed.patient.name}
//                                                         </div>
//                                                         <small className="text-muted">
//                                                           {bed.booking
//                                                             ?.primary_diagnosis ||
//                                                             "Not specified"}
//                                                         </small>
//                                                       </div>
//                                                     </div>
//                                                   </div>
//                                                 )}

//                                                 {bed.restrictions &&
//                                                   bed.restrictions.length >
//                                                     0 && (
//                                                     <div className="mb-3">
//                                                       <small className="text-muted d-block">
//                                                         Restrictions
//                                                       </small>
//                                                       <div className="d-flex flex-wrap gap-1">
//                                                         {bed.restrictions
//                                                           .slice(0, 2)
//                                                           .map((rest, idx) => (
//                                                             <Badge
//                                                               key={idx}
//                                                               bg="warning"
//                                                               text="dark"
//                                                               className="px-2 py-1"
//                                                             >
//                                                               {rest}
//                                                             </Badge>
//                                                           ))}
//                                                         {bed.restrictions
//                                                           .length > 2 && (
//                                                           <Badge
//                                                             bg="light"
//                                                             text="dark"
//                                                             className="px-2 py-1"
//                                                           >
//                                                             +
//                                                             {bed.restrictions
//                                                               .length - 2}
//                                                           </Badge>
//                                                         )}
//                                                       </div>
//                                                     </div>
//                                                   )}

//                                                 <div className="border-top pt-3">
//                                                   <div className="d-flex justify-content-between align-items-center">
//                                                     <div className="d-flex flex-wrap gap-2">
//                                                       {/* Show booking status if exists */}
//                                                       {bedBooking ? (
//                                                         <>
//                                                           {showAdmitButton && (
//                                                             <Button
//                                                               size="sm"
//                                                               variant="success"
//                                                               onClick={() =>
//                                                                 handleActionConfirmation(
//                                                                   "admit",
//                                                                   bed
//                                                                 )
//                                                               }
//                                                             >
//                                                               Admit
//                                                             </Button>
//                                                           )}

//                                                           {showCancelledButton && (
//                                                             <Button
//                                                               size="sm"
//                                                               variant="outline-danger"
//                                                               onClick={() =>
//                                                                 handleActionConfirmation(
//                                                                   "cancelled",
//                                                                   bed
//                                                                 )
//                                                               }
//                                                             >
//                                                               Cancel
//                                                             </Button>
//                                                           )}

//                                                           {showTransferButton && (
//                                                             <Button
//                                                               size="sm"
//                                                               variant="warning"
//                                                               onClick={() =>
//                                                                 handleActionConfirmation(
//                                                                   "transfer",
//                                                                   bed
//                                                                 )
//                                                               }
//                                                             >
//                                                               Transfer
//                                                             </Button>
//                                                           )}

//                                                           {showDischargeButton && (
//                                                             <Button
//                                                               size="sm"
//                                                               variant="danger"
//                                                               onClick={() =>
//                                                                 handleActionConfirmation(
//                                                                   "discharge",
//                                                                   bed
//                                                                 )
//                                                               }
//                                                             >
//                                                               Discharge
//                                                             </Button>
//                                                           )}

//                                                           {actionStatus && (
//                                                             <Badge
//                                                               bg="info"
//                                                               className="ms-2"
//                                                             >
//                                                               {actionStatus}
//                                                             </Badge>
//                                                           )}
//                                                         </>
//                                                       ) : (
//                                                         <Badge bg="secondary">
//                                                           No Active Booking
//                                                         </Badge>
//                                                       )}
//                                                     </div>

//                                                     <div className="text-end">
//                                                       <small className="text-muted d-block">
//                                                         Last Maintenance
//                                                       </small>
//                                                       <small>
//                                                         {formatDate(
//                                                           bed.last_maintenance_date
//                                                         )}
//                                                       </small>
//                                                     </div>
//                                                   </div>
//                                                 </div>
//                                               </Card.Body>
//                                             </Card>
//                                           </Col>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 );
//                               })
//                             )}
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     </Row>
//                   </Tab.Pane>

//                   {/* Tab 4: Patient Bookings */}
//                   <Tab.Pane eventKey="patients">
//                     <Row>
//                       <Col>
//                         <Card className="border-0 shadow-sm">
//                           <Card.Header className="bg-white border-bottom">
//                             <div className="d-flex justify-content-between align-items-center">
//                               <h5 className="mb-0">
//                                 Current Patient Admissions
//                               </h5>
//                               <div className="d-flex gap-2">
//                                 <Button variant="outline-primary" size="sm">
//                                   <CalendarDays size={16} className="me-1" />
//                                   Admission Calendar
//                                 </Button>
//                                 <Button variant="primary" size="sm">
//                                   <PlusCircle size={16} className="me-1" />
//                                   New Admission
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Header>
//                           <Card.Body>
//                             {bookings.length === 0 ? (
//                               <Alert variant="info">
//                                 No patient bookings found.
//                               </Alert>
//                             ) : (
//                               <>
//                                 <Table
//                                   responsive
//                                   hover
//                                   className="align-middle"
//                                 >
//                                   <thead className="bg-light">
//                                     <tr>
//                                       <th>Booking Reference</th>
//                                       <th>Patient Details</th>
//                                       <th>Medical Info</th>
//                                       <th>Bed/Ward</th>
//                                       <th>Admission Details</th>
//                                       <th>Status</th>
//                                       <th>Actions</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {bookings.map((booking) => {
//                                       const patient = booking.patient;

//                                       // If no patient data, show placeholder row
//                                       if (!patient) {
//                                         return (
//                                           <tr key={booking.id}>
//                                             <td>
//                                               <div className="fw-medium">
//                                                 {booking.booking_reference}
//                                               </div>
//                                               <small className="text-muted">
//                                                 {booking.admission_type}
//                                               </small>
//                                             </td>
//                                             <td>
//                                               <div className="d-flex align-items-center">
//                                                 <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
//                                                   <AlertCircle
//                                                     size={20}
//                                                     className="text-warning"
//                                                   />
//                                                 </div>
//                                                 <div>
//                                                   <div className="fw-bold text-warning">
//                                                     Patient Data Missing
//                                                   </div>
//                                                   <small className="text-muted">
//                                                     Patient ID:{" "}
//                                                     {booking.patient_id?.substring(
//                                                       0,
//                                                       8
//                                                     )}
//                                                     ...
//                                                   </small>
//                                                   <div className="mt-1">
//                                                     <Phone
//                                                       size={12}
//                                                       className="me-1 text-muted"
//                                                     />
//                                                     <small>
//                                                       Contact information
//                                                       unavailable
//                                                     </small>
//                                                   </div>
//                                                 </div>
//                                               </div>
//                                             </td>
//                                             <td>
//                                               <div>
//                                                 <div className="fw-medium">
//                                                   {booking.primary_diagnosis ||
//                                                     "Not specified"}
//                                                 </div>
//                                                 {booking.secondary_diagnosis && (
//                                                   <small className="text-muted">
//                                                     Secondary:{" "}
//                                                     {
//                                                       booking.secondary_diagnosis
//                                                     }
//                                                   </small>
//                                                 )}
//                                               </div>
//                                             </td>
//                                             <td>
//                                               {booking.bed && booking.ward ? (
//                                                 <div>
//                                                   <Badge
//                                                     bg="primary"
//                                                     className="mb-1"
//                                                   >
//                                                     {booking.bed.bed_number}
//                                                   </Badge>
//                                                   <div className="small text-muted">
//                                                     {booking.ward.name}
//                                                   </div>
//                                                   <div className="small">
//                                                     Floor{" "}
//                                                     {booking.ward.floor_number}
//                                                   </div>
//                                                 </div>
//                                               ) : (
//                                                 <Badge bg="secondary">
//                                                   Not Assigned
//                                                 </Badge>
//                                               )}
//                                             </td>
//                                             <td>
//                                               <div>
//                                                 <div className="fw-medium">
//                                                   {formatDate(
//                                                     booking.expected_admission_date
//                                                   )}
//                                                 </div>
//                                                 <small className="text-muted">
//                                                   Expected Admission
//                                                 </small>
//                                                 <div className="mt-2">
//                                                   <Badge
//                                                     bg={
//                                                       booking.priority ===
//                                                       "CRITICAL"
//                                                         ? "danger"
//                                                         : booking.priority ===
//                                                           "HIGH"
//                                                         ? "warning"
//                                                         : booking.priority ===
//                                                           "MEDIUM"
//                                                         ? "info"
//                                                         : "success"
//                                                     }
//                                                     className="px-2 py-1"
//                                                   >
//                                                     {booking.priority}
//                                                   </Badge>
//                                                 </div>
//                                                 {booking.expected_discharge_date && (
//                                                   <div className="mt-1">
//                                                     <small className="text-muted d-block">
//                                                       Expected Discharge
//                                                     </small>
//                                                     <div className="fw-medium small">
//                                                       {formatDate(
//                                                         booking.expected_discharge_date
//                                                       )}
//                                                     </div>
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             </td>
//                                             <td>
//                                               <Badge
//                                                 bg={
//                                                   booking.status ===
//                                                   "CHECKED_IN"
//                                                     ? "success"
//                                                     : booking.status ===
//                                                       "AVAILABLE"
//                                                     ? "info"
//                                                     : booking.status ===
//                                                       "PENDING"
//                                                     ? "warning"
//                                                     : booking.status ===
//                                                         "CHECKED_OUT" ||
//                                                       booking.status ===
//                                                         "CANCELLED" ||
//                                                       booking.status ===
//                                                         "NO_SHOW"
//                                                     ? "secondary"
//                                                     : "danger"
//                                                 }
//                                               >
//                                                 {booking.status}
//                                               </Badge>
//                                             </td>
//                                             <td>
//                                               <div className="d-flex gap-2">
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline-warning"
//                                                   onClick={() => {
//                                                     setSelectedPatient(null);
//                                                     setSelectedBooking(booking);
//                                                     setSelectedBed(
//                                                       booking.bed || null
//                                                     );
//                                                     setShowDetailsModal(true);
//                                                   }}
//                                                   title="View booking details (patient data missing)"
//                                                 >
//                                                   <Eye size={14} />
//                                                 </Button>
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline-success"
//                                                   disabled
//                                                 >
//                                                   <Edit size={14} />
//                                                 </Button>
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline-danger"
//                                                 >
//                                                   <Trash2 size={14} />
//                                                 </Button>
//                                               </div>
//                                             </td>
//                                           </tr>
//                                         );
//                                       }

//                                       // Normal rendering with patient data
//                                       return (
//                                         <tr key={booking.id}>
//                                           <td>
//                                             <div className="fw-medium">
//                                               {booking.booking_reference}
//                                             </div>
//                                             <small className="text-muted">
//                                               {booking.admission_type}
//                                             </small>
//                                           </td>
//                                           <td>
//                                             <div className="d-flex align-items-center">
//                                               <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
//                                                 <User
//                                                   size={20}
//                                                   className="text-primary"
//                                                 />
//                                               </div>
//                                               <div>
//                                                 <div className="fw-bold">
//                                                   {patient.name}
//                                                 </div>
//                                                 <small className="text-muted">
//                                                   {patient.age}y •{" "}
//                                                   {patient.gender} •{" "}
//                                                   {patient.bloodGroup}
//                                                 </small>
//                                                 <div className="mt-1">
//                                                   <Phone
//                                                     size={12}
//                                                     className="me-1 text-muted"
//                                                   />
//                                                   <small>
//                                                     {patient.contact}
//                                                   </small>
//                                                 </div>
//                                               </div>
//                                             </div>
//                                           </td>
//                                           <td>
//                                             <div>
//                                               <div className="fw-medium">
//                                                 {booking.primary_diagnosis ||
//                                                   "Not specified"}
//                                               </div>
//                                               {booking.secondary_diagnosis && (
//                                                 <small className="text-muted">
//                                                   Secondary:{" "}
//                                                   {booking.secondary_diagnosis}
//                                                 </small>
//                                               )}
//                                               {patient.allergies &&
//                                                 patient.allergies.length >
//                                                   0 && (
//                                                   <div className="mt-1">
//                                                     <AlertCircle
//                                                       size={12}
//                                                       className="me-1 text-warning"
//                                                     />
//                                                     <small className="text-warning">
//                                                       Allergies:{" "}
//                                                       {patient.allergies.join(
//                                                         ", "
//                                                       )}
//                                                     </small>
//                                                   </div>
//                                                 )}
//                                             </div>
//                                           </td>
//                                           <td>
//                                             {booking.bed && booking.ward ? (
//                                               <div>
//                                                 <Badge
//                                                   bg="primary"
//                                                   className="mb-1"
//                                                 >
//                                                   {booking.bed.bed_number}
//                                                 </Badge>
//                                                 <div className="small text-muted">
//                                                   {booking.ward.name}
//                                                 </div>
//                                                 <div className="small">
//                                                   Floor{" "}
//                                                   {booking.ward.floor_number}
//                                                 </div>
//                                               </div>
//                                             ) : (
//                                               <Badge bg="secondary">
//                                                 Not Assigned
//                                               </Badge>
//                                             )}
//                                           </td>
//                                           <td>
//                                             <div>
//                                               <div className="fw-medium">
//                                                 {formatDate(
//                                                   booking.expected_admission_date
//                                                 )}
//                                               </div>
//                                               <small className="text-muted">
//                                                 Expected Admission
//                                               </small>
//                                               <div className="mt-2">
//                                                 <Badge
//                                                   bg={
//                                                     booking.priority ===
//                                                     "CRITICAL"
//                                                       ? "danger"
//                                                       : booking.priority ===
//                                                         "HIGH"
//                                                       ? "warning"
//                                                       : booking.priority ===
//                                                         "MEDIUM"
//                                                       ? "info"
//                                                       : "success"
//                                                   }
//                                                   className="px-2 py-1"
//                                                 >
//                                                   {booking.priority}
//                                                 </Badge>
//                                               </div>
//                                               {booking.expected_discharge_date && (
//                                                 <div className="mt-1">
//                                                   <small className="text-muted d-block">
//                                                     Expected Discharge
//                                                   </small>
//                                                   <div className="fw-medium small">
//                                                     {formatDate(
//                                                       booking.expected_discharge_date
//                                                     )}
//                                                   </div>
//                                                 </div>
//                                               )}
//                                             </div>
//                                           </td>
//                                           <td>
//                                             <Badge
//                                               bg={
//                                                 booking.status === "CHECKED_IN"
//                                                   ? "success"
//                                                   : booking.status ===
//                                                     "AVAILABLE"
//                                                   ? "info"
//                                                   : booking.status === "PENDING"
//                                                   ? "warning"
//                                                   : booking.status ===
//                                                     "CHECKED_OUT"
//                                                   ? "secondary"
//                                                   : "danger"
//                                               }
//                                             >
//                                               {booking.status}
//                                             </Badge>
//                                           </td>
//                                           <td>
//                                             <div className="d-flex gap-2">
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline-primary"
//                                                 onClick={() => {
//                                                   setSelectedPatient(patient);
//                                                   setSelectedBooking(booking);
//                                                   setSelectedBed(
//                                                     booking.bed || null
//                                                   );
//                                                   setShowDetailsModal(true);
//                                                 }}
//                                               >
//                                                 <Eye size={14} />
//                                               </Button>
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline-success"
//                                               >
//                                                 <Edit size={14} />
//                                               </Button>
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline-danger"
//                                               >
//                                                 <Trash2 size={14} />
//                                               </Button>
//                                             </div>
//                                           </td>
//                                         </tr>
//                                       );
//                                     })}
//                                   </tbody>
//                                 </Table>

//                                 {/* Recent Discharges */}
//                                 <div className="mt-5">
//                                   <h6 className="mb-3">Recent Discharges</h6>
//                                   <Card className="border">
//                                     <Card.Body>
//                                       <Table responsive size="sm">
//                                         <thead>
//                                           <tr>
//                                             <th>Patient</th>
//                                             <th>Bed</th>
//                                             <th>Ward</th>
//                                             <th>Admission Date</th>
//                                             <th>Discharge Date</th>
//                                             <th>Status</th>
//                                             <th>Length of Stay</th>
//                                           </tr>
//                                         </thead>
//                                         <tbody>
//                                           {bookings
//                                             .filter(
//                                               (b) =>
//                                                 b.status === "CANCELLED" ||
//                                                 b.status === "CHECKED_OUT"
//                                             )
//                                             .sort(
//                                               (a, b) =>
//                                                 new Date(
//                                                   b.actual_discharge_time ||
//                                                     b.expected_discharge_date
//                                                 ).getTime() -
//                                                 new Date(
//                                                   a.actual_discharge_time ||
//                                                     a.expected_discharge_date
//                                                 ).getTime()
//                                             )
//                                             .slice(0, 5)
//                                             .map((booking) => {
//                                               const bed = booking.bed;
//                                               const ward = booking.ward;
//                                               const patient = booking.patient;

//                                               if (!patient) return null;

//                                               const admissionDate = new Date(
//                                                 booking.expected_admission_date
//                                               );
//                                               const dischargeDate = new Date(
//                                                 booking.actual_discharge_time ||
//                                                   booking.expected_discharge_date
//                                               );
//                                               const lengthOfStay = Math.ceil(
//                                                 (dischargeDate.getTime() -
//                                                   admissionDate.getTime()) /
//                                                   (1000 * 3600 * 24)
//                                               );

//                                               return (
//                                                 <tr key={booking.id}>
//                                                   <td>
//                                                     <div className="fw-medium">
//                                                       {patient.name}
//                                                     </div>
//                                                     <small className="text-muted">
//                                                       {patient.age}y •{" "}
//                                                       {patient.gender}
//                                                     </small>
//                                                   </td>
//                                                   <td>
//                                                     <Badge
//                                                       bg={
//                                                         booking.status ===
//                                                         "CHECKED_OUT"
//                                                           ? "secondary"
//                                                           : "info"
//                                                       }
//                                                       className="mb-1"
//                                                     >
//                                                       {bed?.bed_number || "N/A"}
//                                                     </Badge>
//                                                   </td>
//                                                   <td>
//                                                     <div>
//                                                       {ward?.name || "N/A"}
//                                                     </div>
//                                                     <small className="text-muted">
//                                                       Floor {ward?.floor_number}
//                                                     </small>
//                                                   </td>
//                                                   <td>
//                                                     {formatDate(
//                                                       booking.expected_admission_date
//                                                     )}
//                                                   </td>
//                                                   <td>
//                                                     <div>
//                                                       {formatDate(
//                                                         booking.actual_discharge_time ||
//                                                           booking.expected_discharge_date
//                                                       )}
//                                                     </div>
//                                                     <small className="text-muted">
//                                                       {booking.actual_discharge_time
//                                                         ? "Actual"
//                                                         : "Expected"}
//                                                     </small>
//                                                   </td>
//                                                   <td>
//                                                     <Badge
//                                                       bg={
//                                                         booking.status ===
//                                                         "CHECKED_OUT"
//                                                           ? "secondary"
//                                                           : "success"
//                                                       }
//                                                     >
//                                                       {booking.status ===
//                                                       "CHECKED_OUT"
//                                                         ? "Checked Out"
//                                                         : "Discharged"}
//                                                     </Badge>
//                                                   </td>
//                                                   <td>
//                                                     <div className="fw-medium">
//                                                       {lengthOfStay} days
//                                                     </div>
//                                                     <small className="text-muted">
//                                                       Stay duration
//                                                     </small>
//                                                   </td>
//                                                 </tr>
//                                               );
//                                             })}
//                                           {bookings.filter(
//                                             (b) =>
//                                               b.status === "CANCELLED" ||
//                                               b.status === "CHECKED_OUT"
//                                           ).length === 0 && (
//                                             <tr>
//                                               <td
//                                                 colSpan={7}
//                                                 className="text-center text-muted py-4"
//                                               >
//                                                 No discharge or check-out
//                                                 records found
//                                               </td>
//                                             </tr>
//                                           )}
//                                         </tbody>
//                                       </Table>
//                                     </Card.Body>
//                                   </Card>
//                                 </div>
//                               </>
//                             )}
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     </Row>
//                   </Tab.Pane>

//                   {/* Tab 5: Analytics & Reports */}
//                   <Tab.Pane eventKey="reports">
//                     <Row className="g-4">
//                       <Col xl={8}>
//                         <Card className="border-0 shadow-sm h-100">
//                           <Card.Header className="bg-white border-bottom">
//                             <h5 className="mb-0">Occupancy Analytics</h5>
//                           </Card.Header>
//                           <Card.Body>
//                             <div className="p-4 text-center">
//                               <Activity
//                                 size={48}
//                                 className="text-primary mb-3"
//                               />
//                               <h4>Real-time Bed Occupancy</h4>
//                               <p className="text-muted mb-4">
//                                 Data loaded from {wards.length} wards with{" "}
//                                 {totalBeds} total beds
//                               </p>

//                               <Row className="text-center">
//                                 <Col md={4}>
//                                   <div className="p-3">
//                                     <div className="h2 text-success">
//                                       {totalAvailableBeds}
//                                     </div>
//                                     <div className="text-muted">
//                                       Available Beds
//                                     </div>
//                                   </div>
//                                 </Col>
//                                 <Col md={4}>
//                                   <div className="p-3">
//                                     <div className="h2 text-danger">
//                                       {totalOccupiedBeds}
//                                     </div>
//                                     <div className="text-muted">
//                                       Occupied Beds
//                                     </div>
//                                   </div>
//                                 </Col>
//                                 <Col md={4}>
//                                   <div className="p-3">
//                                     <div className="h2 text-warning">
//                                       {bedsUnderMaintenance}
//                                     </div>
//                                     <div className="text-muted">
//                                       Under Maintenance
//                                     </div>
//                                   </div>
//                                 </Col>
//                               </Row>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                       <Col xl={4}>
//                         <Card className="border-0 shadow-sm">
//                           <Card.Header className="bg-white border-bottom">
//                             <h5 className="mb-0">Quick Stats</h5>
//                           </Card.Header>
//                           <Card.Body>
//                             <div className="mb-4">
//                               <h6 className="text-muted mb-2">
//                                 Bed Utilization
//                               </h6>
//                               <ProgressBar className="mb-2">
//                                 <ProgressBar
//                                   variant="success"
//                                   now={(totalAvailableBeds / totalBeds) * 100}
//                                   label={`${totalAvailableBeds}`}
//                                 />
//                                 <ProgressBar
//                                   variant="danger"
//                                   now={(totalOccupiedBeds / totalBeds) * 100}
//                                   label={`${totalOccupiedBeds}`}
//                                 />
//                                 <ProgressBar
//                                   variant="warning"
//                                   now={(bedsUnderMaintenance / totalBeds) * 100}
//                                   label={`${bedsUnderMaintenance}`}
//                                 />
//                               </ProgressBar>
//                             </div>
//                             <div className="mb-4">
//                               <h6 className="text-muted mb-2">
//                                 Patient Status
//                               </h6>
//                               <div className="d-flex justify-content-between mb-1">
//                                 <span>Admitted</span>
//                                 <span className="fw-bold">
//                                   {admittedPatients}
//                                 </span>
//                               </div>
//                               <div className="d-flex justify-content-between mb-1">
//                                 <span>Critical</span>
//                                 <span className="fw-bold text-danger">
//                                   {criticalPatients}
//                                 </span>
//                               </div>
//                               <div className="d-flex justify-content-between">
//                                 <span>Discharged (Today)</span>
//                                 <span className="fw-bold text-success">
//                                   {
//                                     bookings.filter(
//                                       (b) =>
//                                         b.status === "CHECKED_OUT" &&
//                                         new Date(
//                                           b.actual_discharge_time
//                                         ).toDateString() ===
//                                           new Date().toDateString()
//                                     ).length
//                                   }
//                                 </span>
//                               </div>
//                             </div>
//                             <div>
//                               <h6 className="text-muted mb-2">
//                                 Ward Performance
//                               </h6>
//                               {wards.slice(0, 5).map((ward) => (
//                                 <div
//                                   key={ward.id}
//                                   className="d-flex justify-content-between align-items-center mb-2"
//                                 >
//                                   <span
//                                     className="text-truncate"
//                                     style={{ maxWidth: "150px" }}
//                                   >
//                                     {ward.name}
//                                   </span>
//                                   <Badge
//                                     bg={
//                                       (ward.occupancyRate || 0) > 85
//                                         ? "danger"
//                                         : (ward.occupancyRate || 0) > 70
//                                         ? "warning"
//                                         : "success"
//                                     }
//                                   >
//                                     {(ward.occupancyRate || 0).toFixed(1)}%
//                                   </Badge>
//                                 </div>
//                               ))}
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     </Row>
//                   </Tab.Pane>
//                 </Tab.Content>
//               </Card.Body>
//             </Card>
//           </Tab.Container>
//         </Container>

//         {/* Modals */}

//         {/* Add Ward Modal */}
//         <Modal
//           show={showAddModal}
//           onHide={() => setShowAddModal(false)}
//           size="lg"
//         >
//           <Modal.Header closeButton className="border-bottom">
//             <Modal.Title>Add New Ward</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Row className="g-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Ward Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="e.g., Cardiology Ward"
//                       value={newWard.name}
//                       onChange={(e) =>
//                         setNewWard({ ...newWard, name: e.target.value })
//                       }
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Ward Type *</Form.Label>
//                     <Form.Select
//                       value={newWard.ward_type}
//                       onChange={(e) =>
//                         setNewWard({ ...newWard, ward_type: e.target.value })
//                       }
//                       required
//                     >
//                       <option value="GENERAL">General</option>
//                       <option value="ICU">Intensive Care Unit (ICU)</option>
//                       <option value="PEDIATRIC">Pediatric</option>
//                       <option value="MATERNITY">Maternity</option>
//                       <option value="SURGICAL">Surgical</option>
//                       <option value="PSYCHIATRIC">Psychiatric</option>
//                       <option value="ISOLATION">Isolation</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Total Beds *</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="1"
//                       max="100"
//                       value={newWard.total_beds}
//                       onChange={(e) =>
//                         setNewWard({
//                           ...newWard,
//                           total_beds: parseInt(e.target.value) || 1,
//                         })
//                       }
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Floor Number *</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="1"
//                       max="20"
//                       value={newWard.floor_number}
//                       onChange={(e) =>
//                         setNewWard({
//                           ...newWard,
//                           floor_number: parseInt(e.target.value) || 1,
//                         })
//                       }
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Wing/Section</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="e.g., Wing A, North Section"
//                       value={newWard.wing}
//                       onChange={(e) =>
//                         setNewWard({ ...newWard, wing: e.target.value })
//                       }
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Phone Extension</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="e.g., ext-201"
//                       value={newWard.phone_extension}
//                       onChange={(e) =>
//                         setNewWard({
//                           ...newWard,
//                           phone_extension: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Head Nurse ID</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Nurse UUID (optional)"
//                       value={newWard.head_nurse_id}
//                       onChange={(e) =>
//                         setNewWard({
//                           ...newWard,
//                           head_nurse_id: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Emergency Contact</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Emergency contact number"
//                       value={newWard.emergency_contact}
//                       onChange={(e) =>
//                         setNewWard({
//                           ...newWard,
//                           emergency_contact: e.target.value,
//                         })
//                       }
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={12}>
//                   <Form.Group>
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       placeholder="Describe the ward purpose, facilities, specialties..."
//                       value={newWard.description}
//                       onChange={(e) =>
//                         setNewWard({ ...newWard, description: e.target.value })
//                       }
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer className="border-top">
//             <Button
//               variant="outline-secondary"
//               onClick={() => setShowAddModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleAddWard}>
//               Create Ward
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         {/* Patient Details Modal */}
//         <Modal
//           show={showDetailsModal}
//           onHide={() => setShowDetailsModal(false)}
//           size="lg"
//         >
//           <Modal.Header closeButton className="border-bottom">
//             <div className="d-flex align-items-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
//                 <User size={24} className="text-primary" />
//               </div>
//               <div>
//                 <Modal.Title>Patient Details</Modal.Title>
//                 <small className="text-muted">
//                   Complete medical and personal information
//                 </small>
//               </div>
//             </div>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedPatient && (
//               <>
//                 <Row className="mb-4">
//                   <Col md={8}>
//                     <h4>{selectedPatient.name}</h4>
//                     <div className="d-flex gap-2 mb-3">
//                       <Badge bg="info" className="px-3 py-2">
//                         {selectedPatient.age} years
//                       </Badge>
//                       <Badge bg="secondary" className="px-3 py-2">
//                         {selectedPatient.gender}
//                       </Badge>
//                       <Badge bg="danger" className="px-3 py-2">
//                         <Heart size={12} className="me-1" />
//                         {selectedPatient.blood_group}
//                       </Badge>
//                       {getPriorityBadge(selectedPatient.priority)}
//                     </div>
//                     <div className="d-flex align-items-center text-muted">
//                       <CalendarDays size={16} className="me-2" />
//                       Patient ID: {selectedPatient.patient_profile_id}
//                     </div>
//                   </Col>
//                   <Col md={4} className="text-end">
//                     {selectedBed && (
//                       <>
//                         <h5 className="text-primary">
//                           Bed {selectedBed.bed_number}
//                         </h5>
//                         <Badge bg="primary" className="px-3 py-2">
//                           {selectedBed.ward?.name || "Unknown Ward"}
//                         </Badge>
//                         <div className="mt-2">
//                           <small className="text-muted">Bed Type:</small>
//                           <div className="fw-medium">
//                             {selectedBed.bed_type}
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </Col>
//                 </Row>

//                 <Row className="g-4">
//                   <Col md={6}>
//                     <Card className="border">
//                       <Card.Header className="bg-light">
//                         <div className="d-flex align-items-center">
//                           <Thermometer size={18} className="me-2" />
//                           <strong>Medical Information</strong>
//                         </div>
//                       </Card.Header>
//                       <Card.Body>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Diagnosis
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBooking?.primary_diagnosis ||
//                               selectedPatient.diagnosis ||
//                               "Not specified"}
//                           </div>
//                           {selectedBooking?.secondary_diagnosis && (
//                             <div className="text-muted small">
//                               Secondary: {selectedBooking.secondary_diagnosis}
//                             </div>
//                           )}
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Attending Doctor
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBooking?.attending_doctor?.full_name ||
//                               "Dr. " + selectedPatient.doctor}
//                           </div>
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Insurance
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBooking?.insurance_provider ||
//                               selectedPatient.insurance ||
//                               "Not specified"}
//                             {selectedBooking?.insurance_policy_number && (
//                               <div className="small text-muted">
//                                 Policy:{" "}
//                                 {selectedBooking.insurance_policy_number}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div>
//                           <small className="text-muted d-block">
//                             Allergies & Restrictions
//                           </small>
//                           {selectedPatient.allergies.length > 0 ? (
//                             <div className="d-flex flex-wrap gap-1 mt-1">
//                               {selectedPatient.allergies.map((allergy, idx) => (
//                                 <Badge
//                                   key={idx}
//                                   bg="warning"
//                                   text="dark"
//                                   className="px-2 py-1"
//                                 >
//                                   {allergy}
//                                 </Badge>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-muted">None reported</span>
//                           )}
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>

//                   <Col md={6}>
//                     <Card className="border">
//                       <Card.Header className="bg-light">
//                         <div className="d-flex align-items-center">
//                           <Phone size={18} className="me-2" />
//                           <strong>Contact Information</strong>
//                         </div>
//                       </Card.Header>
//                       <Card.Body>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Primary Contact
//                           </small>
//                           <div className="fw-medium">
//                             {selectedPatient.profile?.phone_number ||
//                               selectedPatient.contact}
//                           </div>
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Emergency Contact
//                           </small>
//                           <div className="fw-medium">
//                             {selectedPatient.emergency_contact_name}
//                             <div className="small text-muted">
//                               {selectedPatient.emergency_contact_number}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">Email</small>
//                           <div className="fw-medium">
//                             {selectedPatient.profile?.email || "Not available"}
//                           </div>
//                         </div>
//                         <div>
//                           <small className="text-muted d-block">
//                             Current Medications
//                           </small>
//                           <span className="fw-medium">
//                             {selectedPatient.current_medications ||
//                               "None specified"}
//                           </span>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 </Row>

//                 {selectedBooking && (
//                   <Card className="border mt-4">
//                     <Card.Header className="bg-light">
//                       <div className="d-flex align-items-center">
//                         <Shield size={18} className="me-2" />
//                         <strong>Booking Information</strong>
//                       </div>
//                     </Card.Header>
//                     <Card.Body>
//                       <Row>
//                         <Col md={6}>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">
//                               Booking Reference
//                             </small>
//                             <div className="fw-medium">
//                               {selectedBooking.booking_reference}
//                             </div>
//                           </div>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">
//                               Admission Type
//                             </small>
//                             <div className="fw-medium">
//                               {selectedBooking.admission_type}
//                             </div>
//                           </div>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">
//                               Patient Type
//                             </small>
//                             <Badge bg="info">
//                               {selectedBooking.patient_type}
//                             </Badge>
//                           </div>
//                         </Col>
//                         <Col md={6}>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">
//                               Expected Stay
//                             </small>
//                             <div className="fw-medium">
//                               {formatDate(
//                                 selectedBooking.expected_admission_date
//                               )}{" "}
//                               -{" "}
//                               {formatDate(
//                                 selectedBooking.expected_discharge_date
//                               )}
//                             </div>
//                           </div>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">Status</small>
//                             <Badge
//                               bg={
//                                 selectedBooking?.status === "CHECKED_IN"
//                                   ? "success"
//                                   : selectedBooking?.status === "AVAILABLE"
//                                   ? "info"
//                                   : selectedBooking?.status === "PENDING"
//                                   ? "warning"
//                                   : "secondary"
//                               }
//                             >
//                               {selectedBooking?.status?.toUpperCase() ||
//                                 "UNKNOWN"}
//                             </Badge>
//                           </div>
//                           <div className="mb-2">
//                             <small className="text-muted d-block">
//                               Estimated Cost
//                             </small>
//                             <div className="fw-medium">
//                               $
//                               {selectedBooking.estimated_cost?.toFixed(2) ||
//                                 "0.00"}
//                             </div>
//                           </div>
//                         </Col>
//                       </Row>
//                       {selectedBooking.special_instructions && (
//                         <div className="mt-3">
//                           <small className="text-muted d-block">
//                             Special Instructions
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBooking.special_instructions}
//                           </div>
//                         </div>
//                       )}
//                     </Card.Body>
//                   </Card>
//                 )}
//               </>
//             )}
//           </Modal.Body>
//           <Modal.Footer className="border-top">
//             <Button
//               variant="outline-secondary"
//               onClick={() => setShowDetailsModal(false)}
//             >
//               Close
//             </Button>
//             <div className="d-flex gap-2">
//               <Button variant="outline-primary">
//                 <Edit size={16} className="me-2" />
//                 Edit Details
//               </Button>
//               <Button variant="primary">
//                 <Printer size={16} className="me-2" />
//                 Print Report
//               </Button>
//             </div>
//           </Modal.Footer>
//         </Modal>

//         {/* Bed Details Modal */}
//         <Modal
//           show={showBedDetailsModal}
//           onHide={() => setShowBedDetailsModal(false)}
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Bed Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedBed && (
//               <div>
//                 <div className="text-center mb-4">
//                   <div
//                     className={`p-4 rounded-circle d-inline-flex mb-3 ${
//                       selectedBed.current_status === "MAINTENANCE" ||
//                       selectedBed.current_status === "OUT_OF_SERVICE"
//                         ? "bg-warning bg-opacity-10"
//                         : selectedBed.current_status === "OCCUPIED"
//                         ? "bg-danger bg-opacity-10"
//                         : "bg-success bg-opacity-10"
//                     }`}
//                   >
//                     <BedIcon
//                       size={48}
//                       className={
//                         selectedBed.current_status === "MAINTENANCE" ||
//                         selectedBed.current_status === "OUT_OF_SERVICE"
//                           ? "text-warning"
//                           : selectedBed.current_status === "OCCUPIED"
//                           ? "text-danger"
//                           : "text-success"
//                       }
//                     />
//                   </div>
//                   <h3>Bed {selectedBed.bed_number}</h3>
//                   <Badge
//                     bg={getBedStatusColor(selectedBed)}
//                     className="px-3 py-2 mb-3"
//                   >
//                     {getBedStatusText(selectedBed)}
//                   </Badge>
//                   {selectedBed.ward && (
//                     <div className="mt-2">
//                       <span className="text-muted">Located in: </span>
//                       <strong>{selectedBed.ward.name}</strong>
//                       <div className="small text-muted">
//                         Floor {selectedBed.ward.floor_number} • Room{" "}
//                         {selectedBed.room_number}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <Row>
//                   <Col md={6}>
//                     <div className="mb-4">
//                       <h6 className="text-muted mb-2">Equipment & Features</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {selectedBed.equipment?.map((item, idx) => (
//                           <Badge
//                             key={idx}
//                             bg="light"
//                             text="dark"
//                             className="px-3 py-2"
//                           >
//                             {item}
//                           </Badge>
//                         ))}
//                         {selectedBed.is_isolation && (
//                           <Badge bg="warning" text="dark" className="px-3 py-2">
//                             Isolation Room
//                           </Badge>
//                         )}
//                         {selectedBed.is_wheelchair_accessible && (
//                           <Badge bg="info" className="px-3 py-2">
//                             Wheelchair Accessible
//                           </Badge>
//                         )}
//                         {selectedBed.is_bariatric && (
//                           <Badge bg="secondary" className="px-3 py-2">
//                             Bariatric Bed
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="text-muted mb-2">Bed Specifications</h6>
//                       <div className="row">
//                         <div className="col-6">
//                           <small className="text-muted d-block">
//                             Dimensions
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBed.width_cm} × {selectedBed.length_cm} cm
//                           </div>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block">
//                             Max Weight
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBed.max_weight_kg} kg
//                           </div>
//                         </div>
//                         <div className="col-6 mt-2">
//                           <small className="text-muted d-block">
//                             Electrical Outlets
//                           </small>
//                           <div className="fw-medium">
//                             {selectedBed.electrical_outlets}
//                           </div>
//                         </div>
//                         <div className="col-6 mt-2">
//                           <small className="text-muted d-block">
//                             Purchase Date
//                           </small>
//                           <div className="fw-medium">
//                             {formatDate(selectedBed.purchase_date)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Col>

//                   <Col md={6}>
//                     <div className="mb-4">
//                       <h6 className="text-muted mb-2">
//                         Maintenance Information
//                       </h6>
//                       <div className="row">
//                         <div className="col-6">
//                           <small className="text-muted d-block">
//                             Last Maintenance
//                           </small>
//                           <div className="fw-medium">
//                             {formatDate(selectedBed.last_maintenance_date)}
//                           </div>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block">
//                             Next Maintenance
//                           </small>
//                           <div className="fw-medium">
//                             {formatDate(selectedBed.next_maintenance_date)}
//                           </div>
//                         </div>
//                       </div>
//                       {selectedBed.maintenance_notes && (
//                         <div className="mt-2">
//                           <small className="text-muted d-block">
//                             Maintenance Notes
//                           </small>
//                           <div className="fw-medium small">
//                             {selectedBed.maintenance_notes}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {selectedBed.patient && (
//                       <div>
//                         <h6 className="text-muted mb-2">Current Occupant</h6>
//                         <Card className="border">
//                           <Card.Body>
//                             <div className="d-flex align-items-center">
//                               <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
//                                 <User size={20} />
//                               </div>
//                               <div>
//                                 <div className="fw-bold">
//                                   {selectedBed.patient.name}
//                                 </div>
//                                 <small className="text-muted">
//                                   {selectedBed.patient.age}y •{" "}
//                                   {selectedBed.patient.gender} •{" "}
//                                   {selectedBed.patient.blood_group}
//                                 </small>
//                                 <div className="mt-1">
//                                   <small className="text-muted">
//                                     Diagnosis: {selectedBed.patient.diagnosis}
//                                   </small>
//                                 </div>
//                               </div>
//                             </div>
//                             {selectedBooking && (
//                               <div className="mt-2">
//                                 <small className="text-muted d-block">
//                                   Admission Date
//                                 </small>
//                                 <div className="fw-medium">
//                                   {formatDate(
//                                     selectedBooking.expected_admission_date
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </Card.Body>
//                         </Card>
//                       </div>
//                     )}
//                   </Col>
//                 </Row>

//                 {selectedBed.status_notes && (
//                   <div className="mt-4">
//                     <h6 className="text-muted mb-2">Status Notes</h6>
//                     <div className="alert alert-light">
//                       {selectedBed.status_notes}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button
//               variant="secondary"
//               onClick={() => setShowBedDetailsModal(false)}
//             >
//               Close
//             </Button>
//             <Button
//               variant={
//                 selectedBed?.current_status === "OCCUPIED"
//                   ? "success"
//                   : "danger"
//               }
//               onClick={() => {
//                 if (selectedBed) {
//                   handleBookBed(selectedBed.id);
//                   setShowBedDetailsModal(false);
//                 }
//               }}
//               disabled={
//                 selectedBed?.current_status === "MAINTENANCE" ||
//                 selectedBed?.current_status === "OUT_OF_SERVICE"
//               }
//             >
//               {selectedBed?.current_status === "OCCUPIED"
//                 ? "Check Out Patient"
//                 : "Book This Bed"}
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         {/* Selected Ward Modal */}
//         {selectedWard && (
//           <Modal
//             show={!!selectedWard}
//             onHide={() => setSelectedWard(null)}
//             size="xl"
//           >
//             <Modal.Header closeButton className="border-bottom">
//               <Modal.Title>{selectedWard.name} - Detailed Overview</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Row className="g-4">
//                 <Col md={8}>
//                   <Card className="border-0 shadow-sm">
//                     <Card.Body>
//                       <h5 className="mb-3">Bed Grid View</h5>
//                       <div className="d-flex flex-wrap gap-3">
//                         {beds
//                           .filter((bed) => bed.ward_id === selectedWard.id)
//                           .map((bed) => (
//                             <div key={bed.id} className="position-relative">
//                               <Card
//                                 className={`border hover-lift ${
//                                   getBedStatusColor(bed) === "warning"
//                                     ? "border-warning"
//                                     : getBedStatusColor(bed) === "danger"
//                                     ? "border-danger"
//                                     : "border-success"
//                                 }`}
//                                 style={{ width: "120px" }}
//                               >
//                                 <Card.Body className="text-center p-3">
//                                   <div
//                                     className={`p-2 rounded-circle mb-2 mx-auto ${
//                                       getBedStatusColor(bed) === "warning"
//                                         ? "bg-warning bg-opacity-10"
//                                         : getBedStatusColor(bed) === "danger"
//                                         ? "bg-danger bg-opacity-10"
//                                         : "bg-success bg-opacity-10"
//                                     }`}
//                                   >
//                                     <BedIcon
//                                       size={24}
//                                       className={
//                                         getBedStatusColor(bed) === "warning"
//                                           ? "text-warning"
//                                           : getBedStatusColor(bed) === "danger"
//                                           ? "text-danger"
//                                           : "text-success"
//                                       }
//                                     />
//                                   </div>
//                                   <h6 className="mb-1">{bed.bed_number}</h6>
//                                   <Badge
//                                     bg={getBedStatusColor(bed)}
//                                     className="px-2 py-1"
//                                   >
//                                     {bed.current_status === "MAINTENANCE" ||
//                                     bed.current_status === "OUT_OF_SERVICE"
//                                       ? "Maint"
//                                       : bed.current_status === "OCCUPIED"
//                                       ? "Occupied"
//                                       : "Free"}
//                                   </Badge>
//                                   {bed.patient && (
//                                     <div className="mt-2 small text-truncate">
//                                       {bed.patient.name.split(" ")[0]}
//                                     </div>
//                                   )}
//                                 </Card.Body>
//                               </Card>
//                               {(bed.current_status === "MAINTENANCE" ||
//                                 bed.current_status === "OUT_OF_SERVICE") && (
//                                 <div className="position-absolute top-0 start-0">
//                                   <Badge bg="warning" pill>
//                                     <AlertCircle size={10} />
//                                   </Badge>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//                 <Col md={4}>
//                   <Card className="border-0 shadow-sm">
//                     <Card.Body>
//                       <h5 className="mb-3">Ward Information</h5>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">Ward Code</small>
//                         <div className="fw-medium">
//                           {selectedWard.ward_code}
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">Head Nurse</small>
//                         <div className="fw-medium">
//                           {selectedWard.head_nurse?.full_name || "Not assigned"}
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">Contact</small>
//                         <div className="fw-medium">
//                           Ext: {selectedWard.phone_extension}
//                           {selectedWard.emergency_contact && (
//                             <div className="small text-muted">
//                               Emergency: {selectedWard.emergency_contact}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">Location</small>
//                         <div className="fw-medium">
//                           Floor {selectedWard.floor_number}
//                           {selectedWard.wing && ` • ${selectedWard.wing}`}
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">
//                           Operating Hours
//                         </small>
//                         <div className="fw-medium">
//                           {selectedWard.operatingHours?.start || "08:00"} -{" "}
//                           {selectedWard.operatingHours?.end || "20:00"}
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <small className="text-muted d-block">
//                           Bed Statistics
//                         </small>
//                         {(() => {
//                           const wardStats = getWardStats(selectedWard);
//                           return (
//                             <div className="row text-center">
//                               <div className="col-4">
//                                 <div className="h5">
//                                   {selectedWard.total_beds}
//                                 </div>
//                                 <small className="text-muted">Total</small>
//                               </div>
//                               <div className="col-4">
//                                 <div className="h5 text-success">
//                                   {wardStats.freeBeds}
//                                 </div>
//                                 <small className="text-muted">Available</small>
//                               </div>
//                               <div className="col-4">
//                                 <div className="h5 text-danger">
//                                   {wardStats.occupiedBeds}
//                                 </div>
//                                 <small className="text-muted">Occupied</small>
//                               </div>
//                             </div>
//                           );
//                         })()}
//                       </div>
//                       <div>
//                         <small className="text-muted d-block">
//                           Operational Status
//                         </small>
//                         <div className="fw-medium">
//                           <Badge
//                             bg={
//                               selectedWard.is_operational ? "success" : "danger"
//                             }
//                           >
//                             {selectedWard.is_operational
//                               ? "Operational"
//                               : "Non-operational"}
//                           </Badge>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={() => setSelectedWard(null)}>
//                 Close
//               </Button>
//               <Button variant="primary">
//                 <Printer size={16} className="me-2" />
//                 Print Ward Report
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         )}
//       </div>

//       {/* Add custom CSS for enhancements */}
//       <style>{`
//         .hover-lift {
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .hover-lift:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
//         }
//         .bg-gradient-primary {
//           background: linear-gradient(135deg, #4a6bff 0%, #6a11cb 100%);
//         }
//         .header-icon-wrapper {
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//         .success-border {
//           border-color: #198754 !important;
//         }
//         .danger-border {
//           border-color: #dc3545 !important;
//         }
//         .warning-border {
//           border-color: #ffc107 !important;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         .badge.pink {
//           background-color: #e83e8c;
//           color: white;
//         }
//       `}</style>
//     </DashboardLayout>
//   );
// };

// export default ViewFacility;


// ViewFacility.tsx
import DashboardLayout from "@/components/layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Nav, Tab, Alert, Spinner, Badge } from "react-bootstrap";
import { 
  Building, 
  BedIcon, 
  Users, 
  Activity, 
  RefreshCw,
  Download,
  PlusCircle,
  Building as BuildingIcon
} from "lucide-react";

// Import separate page components
import WardOverviewPage from "@/components/facility/WardOverviewPage";
import BedManagementPage from "@/components/facility/BedManagementPage";
import BedBookingManagementPage from "@/components/facility/BedBookingManagementPage";
import PatientBookingsPage from "@/components/facility/PatientBookingsPage";
import AnalyticsReportsPage from "@/components/facility/AnalyticsReportsPage";
import { supabase } from "@/integrations/supabase/client";

const ViewFacility: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalWards: 0,
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds:0,
    occupancyRate: 0,
    admittedPatients: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      const facilityId = user?.user_metadata?.facility_id;

      // Fetch wards
      const { data: wardsData } = await supabase
        .from("wards")
        .select("id, total_beds")
        .eq("facility_id", facilityId)
        .eq("is_active", true);

      // Fetch beds
      const { data: bedsData } = await supabase
        .from("beds")
        .select("id, current_status")
        .eq("facility_id", facilityId)
        .eq("is_active", true);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from("bed_bookings")
        .select("id, status")
        .eq("facility_id", facilityId)
        .in("status", ["OCCUPIED"]);
        // .in("status", ["CHECKED_IN", "RESERVED"]);

      const totalWards = wardsData?.length || 0;
      const totalBeds = bedsData?.length || 0;
      const availableBeds = bedsData?.filter(b => b.current_status === "AVAILABLE").length || 0;
      const occupiedBeds = bedsData?.filter(b => b.current_status === "OCCUPIED").length || 0;
      const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100) : 0;
      const admittedPatients = bookingsData?.length || 0;

      console.log("fff",availableBeds);
      console.log("dddd",occupiedBeds);

      setStats({
        totalWards,
        totalBeds,
        availableBeds,
        occupiedBeds,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        admittedPatients,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load facility statistics");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshData = () => {
    fetchStats();
    // Dispatch event to notify child components to refresh
    window.dispatchEvent(new Event('refreshData'));
  };

  const handleAddWard = () => {
    // Implement add ward functionality
    console.log("Add new ward");
  };

  if (loading) {
    return (
      <DashboardLayout userType="facility">
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading facility data...</p>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="facility">
      <div className="view-facility-page">
        {/* Header Section */}
        <div className="page-header bg-gradient-primary mb-4">
          <Container fluid>
            <Row className="align-items-center py-4">
              <Col>
                <div className="d-flex align-items-center">
                  <div className="header-icon-wrapper bg-white p-3 rounded-circle me-3">
                    <BuildingIcon size={32} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="h2 text-white mb-1">Facility Management</h1>
                    <p className="text-white-50 mb-0">
                      Manage all facility operations from a single dashboard
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs="auto">
                <div className="d-flex gap-3">
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    onClick={refreshData}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      size={18}
                      className={`me-2 ${refreshing ? "spin" : ""}`}
                    />
                    {refreshing ? "Refreshing..." : "Refresh Data"}
                  </Button>
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    onClick={() => {
                      // Implement export functionality
                      console.log("Export report");
                    }}
                  >
                    <Download size={18} className="me-2" />
                    Export Report
                  </Button>
                  <Button
                    variant="light"
                    className="d-flex align-items-center"
                    onClick={handleAddWard}
                  >
                    <PlusCircle size={18} className="me-2" />
                    Add New Ward
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {error && (
          <Container fluid className="mb-4">
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              <Button onClick={fetchStats} variant="outline-danger" size="sm">
                Retry
              </Button>
            </Alert>
          </Container>
        )}

        {/* Quick Stats Row */}
        <Container fluid className="mb-4">
          <Row className="g-4">
            <Col xl={3} lg={6}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body className="py-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <Building size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-muted small">Total Wards</div>
                      <h3 className="mb-0">{stats.totalWards}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body className="py-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                      <BedIcon size={24} className="text-success" />
                    </div>
                    <div>
                      <div className="text-muted small">Total Beds</div>
                      <h3 className="mb-0">{stats.totalBeds}</h3>
                    </div>
                  </div>
                  <div className="mt-3 d-flex justify-content-between">
                    <div>
                      <Badge bg="success" className="px-2">
                        {stats.availableBeds} Available
                      </Badge>
                    </div>
                    <div>
                      <Badge bg="danger" className="px-2">
                        {stats.occupiedBeds} Occupied
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body className="py-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                      <Activity size={24} className="text-warning" />
                    </div>
                    <div>
                      <div className="text-muted small">Occupancy Rate</div>
                      <h3 className="mb-0">{stats.occupancyRate}%</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body className="py-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                      <Users size={24} className="text-danger" />
                    </div>
                    <div>
                      <div className="text-muted small">Admitted Patients</div>
                      <h3 className="mb-0">{stats.admittedPatients}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Navigation Tabs */}
        <Container fluid>
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "overview")}
          >
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom-0 pt-3">
                <Nav variant="tabs" className="border-bottom-0">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="overview"
                      className="d-flex align-items-center"
                    >
                      <Building size={18} className="me-2" />
                      Ward Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="beds"
                      className="d-flex align-items-center"
                    >
                      <BedIcon size={18} className="me-2" />
                      Bed Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="bed-bookings"
                      className="d-flex align-items-center"
                    >
                      <BedIcon size={18} className="me-2" />
                      Bed Booking Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="patients"
                      className="d-flex align-items-center"
                    >
                      <Users size={18} className="me-2" />
                      Patient Bookings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="reports"
                      className="d-flex align-items-center"
                    >
                      <Activity size={18} className="me-2" />
                      Analytics & Reports
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body className="pt-4">
                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <WardOverviewPage />
                  </Tab.Pane>
                  <Tab.Pane eventKey="beds">
                    <BedManagementPage />
                  </Tab.Pane>
                  <Tab.Pane eventKey="bed-bookings">
                    <BedBookingManagementPage />
                  </Tab.Pane>
                  <Tab.Pane eventKey="patients">
                    <PatientBookingsPage />
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports">
                    <AnalyticsReportsPage />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Container>
      </div>

      <style>{`
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #4a6bff 0%, #6a11cb 100%);
        }
        .header-icon-wrapper {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ViewFacility;