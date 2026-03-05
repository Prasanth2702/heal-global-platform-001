// // pages/patient/PatientDetailsPage.tsx
// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { supabase } from "@/integrations/supabase/client";

// const PatientDetailsPage = () => {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPatientBookings = async () => {
//       try {
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError || !user) {
//           throw new Error("User not authenticated");
//         }

//         // First, let's check what tables are available and what relationships exist
//         console.log("Fetching patient bookings for user:", user.id);

//         // Since the error says facilities table doesn't exist in the relationship,
//         // let's fetch the basic booking data first
//         const { data: basicBookings, error: basicError } = await supabase
//           .from("bed_bookings")
//           .select("*")
//           .eq("patient_id", user.id)
//           .order("created_at", { ascending: false });

//         if (basicError) {
//           throw basicError;
//         }

//         console.log("Basic bookings fetched:", basicBookings);

//         // If we have bookings, let's fetch related data separately
//         const enrichedBookings = await Promise.all(
//           basicBookings.map(async (booking) => {
//             let facilityData = null;
//             let bedData = null;
//             let wardData = null;

//             // Try to fetch facility data if facility_id exists
//             if (booking.facility_id) {
//               const { data: facility } = await supabase
//                 .from("facilities")
//                 .select("name")
//                 .eq("id", booking.facility_id)
//                 .single();
//               facilityData = facility;
//             }

//             // Try to fetch bed data if assigned_bed_id exists
//             if (booking.assigned_bed_id) {
//               const { data: bed } = await supabase
//                 .from("beds")
//                 .select("bed_number, ward_id")
//                 .eq("id", booking.assigned_bed_id)
//                 .single();
//               bedData = bed;

//               // If bed has ward_id, fetch ward data
//               if (bed?.ward_id) {
//                 const { data: ward } = await supabase
//                   .from("wards")
//                   .select("ward_name")
//                   .eq("id", bed.ward_id)
//                   .single();
//                 wardData = ward;
//               }
//             }

//             // Also try direct ward reference if assigned_ward_id exists
//             if (booking.assigned_ward_id && !wardData) {
//               const { data: ward } = await supabase
//                 .from("wards")
//                 .select("ward_name")
//                 .eq("id", booking.assigned_ward_id)
//                 .single();
//               wardData = ward;
//             }

//             return {
//               ...booking,
//               facility_name: facilityData?.name,
//               bed_number: bedData?.bed_number,
//               ward_name: wardData?.ward_name,
//             };
//           })
//         );

//         setBookings(enrichedBookings);
//       } catch (err: any) {
//         console.error("Error fetching patient bookings:", err);
//         setError(err.message || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatientBookings();
//   }, []);

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <DashboardLayout userType="patient">
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">My Bed Booking Details</h1>

//         {loading && (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700 mb-6">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {!loading && bookings.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No bookings found.</p>
//             <p className="text-gray-400 mt-2">
//               You don't have any bed bookings yet.
//             </p>
//           </div>
//         )}

//         <div className="grid gap-6">
//           {bookings.map((booking) => (
//             <div
//               key={booking.id}
//               className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
//             >
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//                 <div>
//                   <h2 className="font-semibold text-lg">
//                     Booking Ref: {booking.booking_reference}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Created: {formatDate(booking.created_at)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       booking.status === "confirmed"
//                         ? "bg-green-100 text-green-700"
//                         : booking.status === "pending"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : booking.status === "cancelled"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-blue-100 text-blue-700"
//                     }`}
//                   >
//                     {booking.status?.toUpperCase()}
//                   </span>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       booking.priority === "high"
//                         ? "bg-red-100 text-red-700"
//                         : booking.priority === "medium"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-green-100 text-green-700"
//                     }`}
//                   >
//                     {booking.priority?.toUpperCase()} PRIORITY
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Left Column - Patient & Facility Info */}
//                 <div className="space-y-4">
//                   <div className="bg-blue-50 p-4 rounded-lg">
//                     <h3 className="font-medium text-blue-800 mb-2">
//                       Facility Information
//                     </h3>
//                     <p>
//                       <strong>Facility:</strong> {booking.facility_name || "-"}
//                     </p>
//                     <p>
//                       <strong>Ward:</strong> {booking.ward_name || "-"}
//                     </p>
//                     <p>
//                       <strong>Bed:</strong> {booking.bed_number || "-"}
//                     </p>
//                   </div>

//                   <div className="p-4 border rounded-lg">
//                     <h3 className="font-medium text-gray-800 mb-2">
//                       Dates & Timing
//                     </h3>
//                     <p>
//                       <strong>Admission Type:</strong>{" "}
//                       {booking.admission_type || "-"}
//                     </p>
//                     <p>
//                       <strong>Expected Admission:</strong>{" "}
//                       {formatDate(booking.expected_admission_date)}
//                     </p>
//                     <p>
//                       <strong>Expected Discharge:</strong>{" "}
//                       {formatDate(booking.expected_discharge_date) || "—"}
//                     </p>
//                     {booking.actual_admission_time && (
//                       <p>
//                         <strong>Actual Admission:</strong>{" "}
//                         {formatDate(booking.actual_admission_time)}
//                       </p>
//                     )}
//                     {booking.actual_discharge_time && (
//                       <p>
//                         <strong>Actual Discharge:</strong>{" "}
//                         {formatDate(booking.actual_discharge_time)}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Middle Column - Medical Information */}
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium text-gray-800 mb-2">
//                       Medical Information
//                     </h3>
//                     <p>
//                       <strong>Required Bed Type:</strong>{" "}
//                       {booking.required_bed_type || "-"}
//                     </p>
//                     <p>
//                       <strong>Primary Diagnosis:</strong>{" "}
//                       {booking.primary_diagnosis || "-"}
//                     </p>
//                     <p>
//                       <strong>Secondary Diagnosis:</strong>{" "}
//                       {booking.secondary_diagnosis || "-"}
//                     </p>
//                   </div>

//                   {booking.allergies && (
//                     <div className="bg-red-50 p-4 rounded-lg">
//                       <h3 className="font-medium text-red-800 mb-2">
//                         Allergies & Special Notes
//                       </h3>
//                       <p>
//                         <strong>Allergies:</strong> {booking.allergies}
//                       </p>
//                       {booking.special_instructions && (
//                         <p className="mt-2">
//                           <strong>Special Instructions:</strong>{" "}
//                           {booking.special_instructions}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Right Column - Additional Details */}
//                 <div className="space-y-4">
//                   {booking.special_requirements &&
//                     booking.special_requirements.length > 0 && (
//                       <div className="p-4 border rounded-lg">
//                         <h3 className="font-medium text-gray-800 mb-2">
//                           Special Requirements
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {booking.special_requirements.map(
//                             (req: string, index: number) => (
//                               <span
//                                 key={index}
//                                 className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
//                               >
//                                 {req}
//                               </span>
//                             )
//                           )}
//                         </div>
//                       </div>
//                     )}

//                   <div className="p-4 border rounded-lg">
//                     <h3 className="font-medium text-gray-800 mb-2">
//                       Insurance Information
//                     </h3>
//                     <p>
//                       <strong>Provider:</strong>{" "}
//                       {booking.insurance_provider || "-"}
//                     </p>
//                     <p>
//                       <strong>Policy No:</strong>{" "}
//                       {booking.insurance_policy_number || "-"}
//                     </p>
//                     {booking.insurance_verified_at && (
//                       <p className="text-green-600 text-sm mt-2">
//                         ✓ Verified on{" "}
//                         {formatDate(booking.insurance_verified_at)}
//                       </p>
//                     )}
//                   </div>

//                   {booking.estimated_cost && (
//                     <div className="bg-green-50 p-4 rounded-lg">
//                       <h3 className="font-medium text-green-800 mb-2">
//                         Estimated Cost
//                       </h3>
//                       <p className="text-lg font-bold">
//                         ${parseFloat(booking.estimated_cost).toLocaleString()}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Special Instructions if not already shown */}
//               {booking.special_instructions && !booking.allergies && (
//                 <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <strong>Special Instructions:</strong>{" "}
//                   {booking.special_instructions}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default PatientDetailsPage;


// // pages/patient/PatientDetailsPage.tsx
// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { supabase } from "@/integrations/supabase/client";
// import {
//   Calendar,
//   User,
//   Bed,
//   Shield,
//   Stethoscope,
//   AlertCircle,
//   Clock,
//   DollarSign,
//   FileText,
//   Home,
//   Phone,
//   Activity,
//   CheckCircle,
//   XCircle,
//   Clock3,
//   MapPin,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// interface BedBooking {
//   id: string;
//   booking_reference: string;
//   patient_id: string;
//   patient_type: "inpatient" | "outpatient" | "emergency";
//   admission_type: string;
//   primary_diagnosis: string;
//   secondary_diagnosis?: string;
//   allergies?: string;
//   special_instructions?: string;
//   required_bed_type:
//     | "general"
//     | "icu"
//     | "hdu"
//     | "nicu"
//     | "picu"
//     | "private"
//     | "semi_private";
//   special_requirements?: string[];
//   priority: "low" | "medium" | "high" | "emergency";
//   status:
//     | "pending"
//     | "confirmed"
//     | "admitted"
//     | "discharged"
//     | "cancelled"
//     | "transferred";
//   expected_admission_date: string;
//   expected_discharge_date?: string;
//   actual_admission_time?: string;
//   actual_discharge_time?: string;
//   insurance_provider?: string;
//   insurance_policy_number?: string;
//   insurance_verified_at?: string;
//   estimated_cost?: number;
//   created_at: string;
//   updated_at: string;

//   // Enriched data
//   facility_name?: string;
//   bed_number?: string;
//   ward_name?: string;
//   facility_type?: string;
//   facility_address?: any; // JSON object
//   ward_type?: string; // ✅ FIX
//   floor_number?: number;
// }

// const PatientDetailsPage = () => {
//   const [bookings, setBookings] = useState<BedBooking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState("current");

//   useEffect(() => {
//     const fetchPatientBookings = async () => {
//       try {
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError || !user) {
//           throw new Error("User not authenticated");
//         }

//         // Fetch basic booking data
//         const { data: basicBookings, error: basicError } = await supabase
//           .from("bed_bookings")
//           .select("*")
//           .eq("patient_id", user.id)
//           .order("created_at", { ascending: false });

//         if (basicError) {
//           throw basicError;
//         }

//         // Enrich booking data with related information
//         const enrichedBookings = await Promise.all(
//           basicBookings.map(async (booking) => {
//             let facilityData = null;
//             let bedData = null;
//             let wardData = null;

//             if (booking.facility_id) {
//               const { data: facility } = await supabase
//                 .from("facilities")
//                 .select("facility_name, facility_type, address")
//                 .eq("id", booking.facility_id)
//                 .single();
//               facilityData = facility;
//             }

//             if (booking.assigned_bed_id) {
//               const { data: bed } = await supabase
//                 .from("beds")
//                 .select("bed_number, ward_id")
//                 .eq("id", booking.assigned_bed_id)
//                 .single();
//               bedData = bed;

//               if (bed?.ward_id) {
//                 const { data: ward } = await supabase
//                   .from("wards")
//                   .select("name, ward_type, floor_number")
//                   .eq("id", bed.ward_id)
//                   .single();
//                 wardData = ward;
//               }
//             }

//             if (booking.assigned_ward_id && !wardData) {
//               const { data: ward } = await supabase
//                 .from("wards")
//                 .select("name, ward_type, floor_number")
//                 .eq("id", booking.assigned_ward_id)
//                 .single();
//               wardData = ward;
//             }

//             return {
//               ...booking,
//               facility_name: facilityData?.facility_name,
//               facility_type: facilityData?.facility_type,
//               facility_address: facilityData?.address,
//               bed_number: bedData?.bed_number,
//               ward_name: wardData?.name,
//               ward_type: wardData?.ward_type,
//               floor_number: wardData?.floor_number,
//             };
//           })
//         );

//         setBookings(enrichedBookings);
//       } catch (err: any) {
//         console.error("Error fetching patient bookings:", err);
//         setError(err.message || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatientBookings();
//   }, []);

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatShortDate = (dateString: string) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Format address from JSON object
//   const formatAddress = (address: any) => {
//     if (!address) return "Not available";
    
//     try {
//       if (typeof address === 'string') {
//         return address;
//       }
      
//       const addr = address;
//       const parts = [];
//       if (addr.street) parts.push(addr.street);
//       if (addr.city) parts.push(addr.city);
//       if (addr.state) parts.push(addr.state);
//       if (addr.pincode) parts.push(addr.pincode);
      
//       return parts.join(", ") || "Address not specified";
//     } catch (err) {
//       return "Address format error";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return <CheckCircle className="h-4 w-4" />;
//       case "pending":
//         return <Clock3 className="h-4 w-4" />;
//       case "admitted":
//         return <Activity className="h-4 w-4" />;
//       case "discharged":
//         return <CheckCircle className="h-4 w-4" />;
//       case "cancelled":
//         return <XCircle className="h-4 w-4" />;
//       default:
//         return <FileText className="h-4 w-4" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "admitted":
//         return "bg-green-100 text-green-700 border-green-200";
//       case "discharged":
//         return "bg-gray-100 text-gray-700 border-gray-200";
//       case "cancelled":
//         return "bg-red-100 text-red-700 border-red-200";
//       case "transferred":
//         return "bg-purple-100 text-purple-700 border-purple-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "emergency":
//         return "bg-red-100 text-red-700";
//       case "high":
//         return "bg-orange-100 text-orange-700";
//       case "medium":
//         return "bg-yellow-100 text-yellow-700";
//       case "low":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getBedTypeColor = (bedType: string) => {
//     switch (bedType) {
//       case "icu":
//         return "bg-red-50 text-red-600";
//       case "hdu":
//         return "bg-orange-50 text-orange-600";
//       case "nicu":
//         return "bg-pink-50 text-pink-600";
//       case "picu":
//         return "bg-purple-50 text-purple-600";
//       case "private":
//         return "bg-blue-50 text-blue-600";
//       case "semi_private":
//         return "bg-green-50 text-green-600";
//       default:
//         return "bg-gray-50 text-gray-600";
//     }
//   };

//   // Filter bookings based on active tab
//   const currentBookings = bookings.filter(
//     (booking) => booking.status === "pending" || booking.status === "confirmed" || booking.status === "admitted"
//   );
  
//   const pastBookings = bookings.filter(
//     (booking) => booking.status === "discharged" || booking.status === "cancelled"
//   );

//   const displayedBookings = activeTab === "current" ? currentBookings : pastBookings;

//   if (loading) {
//     return (
//       <DashboardLayout userType="patient">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading your bookings...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout userType="patient">
//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//         {/* Header Section */}
//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight">My Bed Bookings</h1>
//           <p className="text-gray-600">
//             View and manage all your hospital bed booking details and history
//           </p>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <AlertCircle className="h-5 w-5 text-red-600" />
//                 <div>
//                   <p className="font-medium text-red-800">Error Loading Bookings</p>
//                   <p className="text-sm text-red-600">{error}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Bed className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{currentBookings.length}</p>
//                   <p className="text-sm text-gray-500">Active Bookings</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {bookings.filter(b => b.status === "confirmed").length}
//                   </p>
//                   <p className="text-sm text-gray-500">Confirmed</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock3 className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {bookings.filter(b => b.status === "pending").length}
//                   </p>
//                   <p className="text-sm text-gray-500">Pending</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <FileText className="h-5 w-5 text-gray-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{bookings.length}</p>
//                   <p className="text-sm text-gray-500">Total Bookings</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tab Navigation */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
//             <TabsTrigger value="current" className="space-x-2">
//               <Activity className="h-4 w-4" />
//               <span>Current Bookings ({currentBookings.length})</span>
//             </TabsTrigger>
//             <TabsTrigger value="past" className="space-x-2">
//               <Clock className="h-4 w-4" />
//               <span>Booking History ({pastBookings.length})</span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value={activeTab} className="space-y-6">
//             {displayedBookings.length === 0 ? (
//               <Card>
//                 <CardContent className="pt-6 text-center py-12">
//                   <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">
//                     No {activeTab === "current" ? "Current" : "Past"} Bookings
//                   </h3>
//                   <p className="text-gray-500">
//                     {activeTab === "current"
//                       ? "You don't have any active bed bookings at the moment."
//                       : "Your booking history will appear here."}
//                   </p>
//                 </CardContent>
//               </Card>
//             ) : (
//               displayedBookings.map((booking) => (
//                 <Card key={booking.id} className="overflow-hidden">
//                   <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       <div>
//                         <div className="flex items-center space-x-3 mb-2">
//                           <CardTitle className="text-xl">
//                             Booking #{booking.booking_reference}
//                           </CardTitle>
//                           <Badge className={getStatusColor(booking.status)} variant="outline">
//                             <span className="flex items-center space-x-1">
//                               {getStatusIcon(booking.status)}
//                               <span>
//                                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                               </span>
//                             </span>
//                           </Badge>
//                         </div>
//                         <CardDescription>
//                           Created on {formatDate(booking.created_at)}
//                           {booking.patient_type && ` • ${booking.patient_type.toUpperCase()}`}
//                         </CardDescription>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         <Badge className={getPriorityColor(booking.priority)}>
//                           {booking.priority.toUpperCase()} PRIORITY
//                         </Badge>
//                         <Badge className={getBedTypeColor(booking.required_bed_type)} variant="outline">
//                           {booking.required_bed_type.toUpperCase()} BED
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardHeader>
                  
//                   <CardContent className="pt-6">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                       {/* Facility & Timeline Column */}
//                       <div className="space-y-4">
//                         <div className="space-y-3">
//                           <div className="flex items-start space-x-3">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                               <Home className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-800">Facility Details</h4>
//                               <div className="mt-1 space-y-1">
//                                 <p className="text-sm">
//                                   <span className="text-gray-500">Facility:</span>{" "}
//                                   <span className="font-medium">{booking.facility_name || "Not assigned"}</span>
//                                 </p>
//                                 {booking.facility_type && (
//                                   <p className="text-sm">
//                                     <span className="text-gray-500">Type:</span>{" "}
//                                     <span className="font-medium">{booking.facility_type}</span>
//                                   </p>
//                                 )}
//                                 {booking.facility_address && (
//                                   <div className="flex items-start space-x-2 mt-1">
//                                     <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
//                                     <p className="text-xs text-gray-500">
//                                       {formatAddress(booking.facility_address)}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           <Separator />

//                           <div className="flex items-start space-x-3">
//                             <div className="p-2 bg-indigo-100 rounded-lg">
//                               <Bed className="h-5 w-5 text-indigo-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-800">Ward & Bed Details</h4>
//                               <div className="mt-1 space-y-1">
//                                 <p className="text-sm">
//                                   <span className="text-gray-500">Ward:</span>{" "}
//                                   <span className="font-medium">{booking.ward_name || "Not assigned"}</span>
//                                   {booking.ward_type && (
//                                     <span className="ml-2 text-xs text-gray-500">({booking.ward_type})</span>
//                                   )}
//                                 </p>
//                                 <p className="text-sm">
//                                   <span className="text-gray-500">Bed:</span>{" "}
//                                   <span className="font-medium">{booking.bed_number || "Not assigned"}</span>
//                                 </p>
//                                 {booking.floor_number && (
//                                   <p className="text-sm">
//                                     <span className="text-gray-500">Floor:</span>{" "}
//                                     <span className="font-medium">{booking.floor_number}</span>
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           <Separator />

//                           <div className="flex items-start space-x-3">
//                             <div className="p-2 bg-purple-100 rounded-lg">
//                               <Calendar className="h-5 w-5 text-purple-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-800">Timeline</h4>
//                               <div className="mt-1 space-y-2">
//                                 <div>
//                                   <p className="text-sm text-gray-500">Expected Admission</p>
//                                   <p className="font-medium">{formatDate(booking.expected_admission_date)}</p>
//                                 </div>
//                                 {booking.expected_discharge_date && (
//                                   <div>
//                                     <p className="text-sm text-gray-500">Expected Discharge</p>
//                                     <p className="font-medium">{formatDate(booking.expected_discharge_date)}</p>
//                                   </div>
//                                 )}
//                                 {booking.actual_admission_time && (
//                                   <div>
//                                     <p className="text-sm text-gray-500">Actual Admission</p>
//                                     <p className="font-medium text-green-600">{formatDate(booking.actual_admission_time)}</p>
//                                   </div>
//                                 )}
//                                 {booking.actual_discharge_time && (
//                                   <div>
//                                     <p className="text-sm text-gray-500">Actual Discharge</p>
//                                     <p className="font-medium text-gray-600">{formatDate(booking.actual_discharge_time)}</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Medical Information Column */}
//                       <div className="space-y-4">
//                         <div className="space-y-3">
//                           <div className="flex items-start space-x-3">
//                             <div className="p-2 bg-red-100 rounded-lg">
//                               <Stethoscope className="h-5 w-5 text-red-600" />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-800">Medical Information</h4>
//                               <div className="mt-1 space-y-3">
//                                 <div>
//                                   <p className="text-sm text-gray-500">Admission Type</p>
//                                   <p className="font-medium">{booking.admission_type || "Not specified"}</p>
//                                 </div>
//                                 <div>
//                                   <p className="text-sm text-gray-500">Primary Diagnosis</p>
//                                   <p className="font-medium">{booking.primary_diagnosis}</p>
//                                 </div>
//                                 {booking.secondary_diagnosis && (
//                                   <div>
//                                     <p className="text-sm text-gray-500">Secondary Diagnosis</p>
//                                     <p className="text-sm">{booking.secondary_diagnosis}</p>
//                                   </div>
//                                 )}
//                                 {booking.allergies && (
//                                   <div>
//                                     <p className="text-sm text-gray-500">Allergies & Sensitivities</p>
//                                     <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
//                                       {booking.allergies}
//                                     </Badge>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {booking.special_instructions && (
//                             <>
//                               <Separator />
//                               <div>
//                                 <p className="text-sm text-gray-500 mb-1">Special Instructions</p>
//                                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                                   <p className="text-sm">{booking.special_instructions}</p>
//                                 </div>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {/* Insurance & Details Column */}
//                       <div className="space-y-4">
//                         <div className="space-y-3">
//                           <div className="flex items-start space-x-3">
//                             <div className="p-2 bg-green-100 rounded-lg">
//                               <Shield className="h-5 w-5 text-green-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-800">Insurance Details</h4>
//                               <div className="mt-1 space-y-2">
//                                 {booking.insurance_provider ? (
//                                   <>
//                                     <div>
//                                       <p className="text-sm text-gray-500">Provider</p>
//                                       <p className="font-medium">{booking.insurance_provider}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-sm text-gray-500">Policy Number</p>
//                                       <p className="font-mono text-sm">{booking.insurance_policy_number}</p>
//                                     </div>
//                                     {booking.insurance_verified_at && (
//                                       <div>
//                                         <p className="text-sm text-gray-500">Verification Status</p>
//                                         <Badge className="bg-green-100 text-green-700 border-green-200">
//                                           <CheckCircle className="h-3 w-3 mr-1" />
//                                           Verified {formatShortDate(booking.insurance_verified_at)}
//                                         </Badge>
//                                       </div>
//                                     )}
//                                   </>
//                                 ) : (
//                                   <p className="text-sm text-gray-500">No insurance information provided</p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           <Separator />

//                           <div className="space-y-3">
//                             <div className="flex items-start space-x-3">
//                               <div className="p-2 bg-amber-100 rounded-lg">
//                                 <DollarSign className="h-5 w-5 text-amber-600" />
//                               </div>
//                               <div>
//                                 <h4 className="font-medium text-gray-800">Cost Estimate</h4>
//                                 <div className="mt-1">
//                                   {booking.estimated_cost ? (
//                                     <div>
//                                       <p className="text-sm text-gray-500">Estimated Cost</p>
//                                       <p className="text-2xl font-bold text-gray-900">
//                                         ₹{parseFloat(booking.estimated_cost.toString()).toLocaleString('en-IN')}
//                                       </p>
//                                     </div>
//                                   ) : (
//                                     <p className="text-sm text-gray-500">Cost estimate not available</p>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {booking.special_requirements && booking.special_requirements.length > 0 && (
//                             <>
//                               <Separator />
//                               <div>
//                                 <h4 className="font-medium text-gray-800 mb-2">Special Requirements</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                   {booking.special_requirements.map((req: string, index: number) => (
//                                     <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700">
//                                       {req}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default PatientDetailsPage;

// pages/patient/PatientDetailsPage.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  User,
  Bed,
  Shield,
  Stethoscope,
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Home,
  Phone,
  Activity,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface BedBooking {
  id: string;
  booking_reference: string;
  patient_id: string;
  patient_type: string; // Changed from enum to string
  admission_type: string;
  primary_diagnosis: string;
  secondary_diagnosis?: string;
  allergies?: string;
  special_instructions?: string;
  required_bed_type: string; // Changed from enum to string
  special_requirements?: string[];
  priority: string; // Changed from enum to string
  status: string; // Changed from enum to string
  expected_admission_date: string;
  expected_discharge_date?: string;
  actual_admission_time?: string;
  actual_discharge_time?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_verified_at?: string;
  estimated_cost?: number;
  created_at: string;
  updated_at: string;

  // Enriched data
  facility_id?: string;
  facility_name?: string;
  bed_number?: string;
  ward_name?: string;
  facility_type?: string;
  facility_address?: any;
  ward_type?: string;
  floor_number?: number;
  assigned_bed_id?: string;
  assigned_ward_id?: string;
}

const PatientDetailsPage = () => {
  const [bookings, setBookings] = useState<BedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const fetchPatientBookings = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        // Fetch basic booking data
        const { data: basicBookings, error: basicError } = await supabase
          .from("bed_bookings")
          .select("*")
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (basicError) {
          throw basicError;
        }

        console.log("Basic bookings:", basicBookings);

        // Enrich booking data with related information
        const enrichedBookings = await Promise.all(
          basicBookings.map(async (booking) => {
            let facilityData = null;
            let bedData = null;
            let wardData = null;

            if (booking.facility_id) {
              const { data: facility } = await supabase
                .from("facilities")
                .select("facility_name, facility_type, address")
                .eq("id", booking.facility_id)
                .single();
              facilityData = facility;
            }

            if (booking.assigned_bed_id) {
              const { data: bed } = await supabase
                .from("beds")
                .select("bed_number, ward_id")
                .eq("id", booking.assigned_bed_id)
                .single();
              bedData = bed;

              if (bed?.ward_id) {
                const { data: ward } = await supabase
                  .from("wards")
                  .select("name, ward_type, floor_number")
                  .eq("id", bed.ward_id)
                  .single();
                wardData = ward;
              }
            }

            if (booking.assigned_ward_id && !wardData) {
              const { data: ward } = await supabase
                .from("wards")
                .select("name, ward_type, floor_number")
                .eq("id", booking.assigned_ward_id)
                .single();
              wardData = ward;
            }

            return {
              ...booking,
              facility_name: facilityData?.facility_name,
              facility_type: facilityData?.facility_type,
              facility_address: facilityData?.address,
              bed_number: bedData?.bed_number,
              ward_name: wardData?.name,
              ward_type: wardData?.ward_type,
              floor_number: wardData?.floor_number,
            };
          })
        );

        console.log("Enriched bookings:", enrichedBookings);
        setBookings(enrichedBookings);
      } catch (err: any) {
        console.error("Error fetching patient bookings:", err);
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientBookings();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format address from JSON object
  const formatAddress = (address: any) => {
    if (!address) return "Not available";
    
    try {
      if (typeof address === 'string') {
        return address;
      }
      
      const addr = address;
      const parts = [];
      if (addr.street) parts.push(addr.street);
      if (addr.city) parts.push(addr.city);
      if (addr.state) parts.push(addr.state);
      if (addr.pincode) parts.push(addr.pincode);
      
      return parts.join(", ") || "Address not specified";
    } catch (err) {
      return "Address format error";
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock3 className="h-4 w-4" />;
      case "admitted":
        return <Activity className="h-4 w-4" />;
      case "discharged":
        return <CheckCircle className="h-4 w-4" />;
      case "checked_out":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "admitted":
        return "bg-green-100 text-green-700 border-green-200";
      case "discharged":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "checked_out":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "transferred":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    switch (priorityLower) {
      case "emergency":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBedTypeColor = (bedType: string) => {
    const bedTypeLower = bedType.toLowerCase();
    switch (bedTypeLower) {
      case "icu":
        return "bg-red-50 text-red-600";
      case "hdu":
        return "bg-orange-50 text-orange-600";
      case "nicu":
        return "bg-pink-50 text-pink-600";
      case "picu":
        return "bg-purple-50 text-purple-600";
      case "private":
        return "bg-blue-50 text-blue-600";
      case "semi_private":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // Helper function to format status/priority/bed type for display
  const formatForDisplay = (value: string): string => {
    if (!value) return "";
    // Convert to lowercase and capitalize first letter of each word
    return value.toLowerCase().split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Filter bookings based on active tab
  const currentBookings = bookings.filter(
    (booking) => {
      const statusLower = booking.status.toLowerCase();
      return (
        statusLower === "pending" ||
        statusLower === "confirmed" ||
        statusLower === "admitted" ||
        statusLower === "reserved"
      );
    }
  );
  
  const pastBookings = bookings.filter(
    (booking) => {
      const statusLower = booking.status.toLowerCase();
      return statusLower === "checked_out" || statusLower === "cancelled";
    }
  );

  const displayedBookings = activeTab === "current" ? currentBookings : pastBookings;

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Bed Bookings</h1>
          <p className="text-gray-600">
            View and manage all your hospital bed booking details and history
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Error Loading Bookings</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bed className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentBookings.length}</p>
                  <p className="text-sm text-gray-500">Active Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status.toLowerCase() === "confirmed").length}
                  </p>
                  <p className="text-sm text-gray-500">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock3 className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status.toLowerCase() === "pending").length}
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="current" className="space-x-2">
              <Activity className="h-4 w-4" />
              <span>Current Bookings ({currentBookings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="space-x-2">
              <Clock className="h-4 w-4" />
              <span>Booking History ({pastBookings.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {displayedBookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No {activeTab === "current" ? "Current" : "Past"} Bookings
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === "current"
                      ? "You don't have any active bed bookings at the moment."
                      : "Your booking history will appear here."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              displayedBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">
                            Booking #{booking.booking_reference}
                          </CardTitle>
                          <Badge className={getStatusColor(booking.status)} variant="outline">
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(booking.status)}
                              <span>
                                {formatForDisplay(booking.status)}
                              </span>
                            </span>
                          </Badge>
                        </div>
                        <CardDescription>
                          Created on {formatDate(booking.created_at)}
                          {booking.patient_type && ` • ${formatForDisplay(booking.patient_type)}`}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getPriorityColor(booking.priority)}>
                          {formatForDisplay(booking.priority)} PRIORITY
                        </Badge>
                        <Badge className={getBedTypeColor(booking.required_bed_type)} variant="outline">
                          {formatForDisplay(booking.required_bed_type)} BED
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Facility & Timeline Column */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Home className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Facility Details</h4>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm">
                                  <span className="text-gray-500">Facility:</span>{" "}
                                  <span className="font-medium">{booking.facility_name || "Not assigned"}</span>
                                </p>
                                {booking.facility_type && (
                                  <p className="text-sm">
                                    <span className="text-gray-500">Type:</span>{" "}
                                    <span className="font-medium">{formatForDisplay(booking.facility_type)}</span>
                                  </p>
                                )}
                                {booking.facility_address && (
                                  <div className="flex items-start space-x-2 mt-1">
                                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                      {formatAddress(booking.facility_address)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Bed className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Ward & Bed Details</h4>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm">
                                  <span className="text-gray-500">Ward:</span>{" "}
                                  <span className="font-medium">{booking.ward_name || "Not assigned"}</span>
                                  {booking.ward_type && (
                                    <span className="ml-2 text-xs text-gray-500">({formatForDisplay(booking.ward_type)})</span>
                                  )}
                                </p>
                                <p className="text-sm">
                                  <span className="text-gray-500">Bed:</span>{" "}
                                  <span className="font-medium">{booking.bed_number || "Not assigned"}</span>
                                </p>
                                {booking.floor_number && (
                                  <p className="text-sm">
                                    <span className="text-gray-500">Floor:</span>{" "}
                                    <span className="font-medium">{booking.floor_number}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Timeline</h4>
                              <div className="mt-1 space-y-2">
                                <div>
                                  <p className="text-sm text-gray-500">Expected Admission</p>
                                  <p className="font-medium">{formatDate(booking.expected_admission_date)}</p>
                                </div>
                                {booking.expected_discharge_date && (
                                  <div>
                                    <p className="text-sm text-gray-500">Expected Discharge</p>
                                    <p className="font-medium">{formatDate(booking.expected_discharge_date)}</p>
                                  </div>
                                )}
                                {booking.actual_admission_time && (
                                  <div>
                                    <p className="text-sm text-gray-500">Actual Admission</p>
                                    <p className="font-medium text-green-600">{formatDate(booking.actual_admission_time)}</p>
                                  </div>
                                )}
                                {booking.actual_discharge_time && (
                                  <div>
                                    <p className="text-sm text-gray-500">Actual Discharge</p>
                                    <p className="font-medium text-gray-600">{formatDate(booking.actual_discharge_time)}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Medical Information Column */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Stethoscope className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">Medical Information</h4>
                              <div className="mt-1 space-y-3">
                                <div>
                                  <p className="text-sm text-gray-500">Admission Type</p>
                                  <p className="font-medium">{booking.admission_type || "Not specified"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Primary Diagnosis</p>
                                  <p className="font-medium">{booking.primary_diagnosis}</p>
                                </div>
                                {booking.secondary_diagnosis && (
                                  <div>
                                    <p className="text-sm text-gray-500">Secondary Diagnosis</p>
                                    <p className="text-sm">{booking.secondary_diagnosis}</p>
                                  </div>
                                )}
                                {booking.allergies && (
                                  <div>
                                    <p className="text-sm text-gray-500">Allergies & Sensitivities</p>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      {booking.allergies}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {booking.special_instructions && (
                            <>
                              <Separator />
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Special Instructions</p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm">{booking.special_instructions}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Insurance & Details Column */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Insurance Details</h4>
                              <div className="mt-1 space-y-2">
                                {booking.insurance_provider ? (
                                  <>
                                    <div>
                                      <p className="text-sm text-gray-500">Provider</p>
                                      <p className="font-medium">{booking.insurance_provider}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Policy Number</p>
                                      <p className="font-mono text-sm">{booking.insurance_policy_number}</p>
                                    </div>
                                    {booking.insurance_verified_at && (
                                      <div>
                                        <p className="text-sm text-gray-500">Verification Status</p>
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Verified {formatShortDate(booking.insurance_verified_at)}
                                        </Badge>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-500">No insurance information provided</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">Cost Estimate</h4>
                                <div className="mt-1">
                                  {booking.estimated_cost ? (
                                    <div>
                                      <p className="text-sm text-gray-500">Estimated Cost</p>
                                      <p className="text-2xl font-bold text-gray-900">
                                        ₹{parseFloat(booking.estimated_cost.toString()).toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">Cost estimate not available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {booking.special_requirements && booking.special_requirements.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Special Requirements</h4>
                                <div className="flex flex-wrap gap-2">
                                  {booking.special_requirements.map((req: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default PatientDetailsPage;