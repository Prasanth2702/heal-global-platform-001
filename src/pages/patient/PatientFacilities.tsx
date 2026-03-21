// // // import DashboardLayout from "@/components/layouts/DashboardLayout";
// // // import { toast } from "@/hooks/use-toast";
// // // import { supabase } from "@/integrations/supabase/client";
// // // import React, { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";

// // // interface Facility {
// // //   id: string;
// // //   admin_user_id: string;
// // //   facility_name: string;
// // //   facility_type: string;
// // //   license_number: string;
// // //   address: Record<string, any>;
// // //   additional_services: Record<string, any>;
// // //   rating: number | null;
// // //   total_reviews: number | null;
// // //   is_verified: boolean;
// // //   created_at: string;
// // //   updated_at: string;
// // //   latitude: number | null;
// // //   longitude: number | null;
// // //   established_year: number | null;
// // //   website: string | null;
// // //   insurance_partners: string | null;
// // //   departments: Record<string, any>;
// // //   total_beds: number;
// // //   about_facility: string | null;
// // //   city: string;
// // //   state: string;
// // //   pincode: number;
// // // }

// // // const PatientFacilities: React.FC = () => {
// // //   const [facilities, setFacilities] = useState<Facility[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const navigate = useNavigate();
// // //    const [user, setUser] = useState<any>(null);

// // //  useEffect(() => {
// // //     const checkAuth = async () => {
// // //       try {
// // //         const { data: { session }, error } = await supabase.auth.getSession();
        
// // //         if (error) throw error;
        
// // //         if (!session) {
// // //           // Show toast notification
// // //           toast({
// // //             title: "Authentication Required",
// // //             description: "Please log in to access the dashboard",
// // //             variant: "destructive",
// // //           });
          
// // //           // Redirect to home page
// // //           navigate("/homelogin", { replace: true });
// // //           return;
// // //         }
        
// // //         setUser(session.user);
// // //       } catch (error) {
// // //         console.error("Auth check error:", error);
// // //         toast({
// // //           title: "Error",
// // //           description: "An error occurred. Please try again.",
// // //           variant: "destructive",
// // //         });
// // //         navigate("/homelogin", { replace: true });
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     checkAuth();

// // //     // Set up auth state listener
// // //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// // //       if (!session) {
// // //         toast({
// // //           title: "Session Expired",
// // //           description: "Please log in again",
// // //           variant: "destructive",
// // //         });
// // //         navigate("/homelogin", { replace: true });
// // //       } else {
// // //         setUser(session.user);
// // //       }
// // //     });

// // //     return () => subscription.unsubscribe();
// // //   }, [navigate, toast]);

// // //   useEffect(() => {
// // //     fetchFacilities();
// // //   }, []);

// // //   const fetchFacilities = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const { data: facilityData, error: facilityError } = await supabase
// // //         .from("facilities")
// // //         .select("*");

// // //       if (facilityError) {
// // //         throw facilityError;
// // //       }

// // //       if (facilityData) {
// // //         setFacilities(facilityData);
// // //       }
// // //     } catch (err: any) {
// // //       setError(err.message || "Failed to fetch facilities");
// // //       console.error("Error fetching facilities:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center h-64">
// // //         <div className="text-lg">Loading facilities...</div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
// // //         <strong>Error:</strong> {error}
// // //         <button
// // //           onClick={fetchFacilities}
// // //           className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
// // //         >
// // //           Retry
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //       <div className="container mx-auto px-4 py-8">
// // //         <h1 className="text-3xl font-bold mb-6"></h1>

// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //           {facilities.map((facility) => (
// // //             <div
// // //               key={facility.id}
// // //               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
// // //             >
// // //               <div className="flex justify-between items-start mb-4">
// // //                 <div>
// // //                   <h2 className="text-xl font-semibold text-gray-800">
// // //                     {facility.facility_name}
// // //                   </h2>
// // //                   <p className="text-sm text-gray-600 mt-1">
// // //                     {facility.facility_type} • {facility.city}, {facility.state}
// // //                   </p>
// // //                 </div>
// // //                 {facility.is_verified && (
// // //                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
// // //                     Verified
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               {/* Rating */}
// // //               <div className="flex items-center mb-3">
// // //                 {facility.rating !== null && (
// // //                   <>
// // //                     <span className="text-yellow-500">★</span>
// // //                     <span className="ml-1 font-medium">
// // //                       {facility.rating.toFixed(1)}
// // //                     </span>
// // //                     <span className="text-gray-500 text-sm ml-1">
// // //                       ({facility.total_reviews || 0} reviews)
// // //                     </span>
// // //                   </>
// // //                 )}
// // //               </div>

// // //               {/* Address */}
// // //               <div className="mb-4">
// // //                 <h3 className="text-sm font-medium text-gray-700 mb-1">
// // //                   Address:
// // //                 </h3>
// // //                 <p className="text-gray-600">
// // //                   {typeof facility.address === "object"
// // //                     ? `${facility.address.street || ""}, ${facility.city}, ${
// // //                         facility.state
// // //                       } - ${facility.pincode}`
// // //                     : "Address not available"}
// // //                 </p>
// // //               </div>

// // //               {/* Facility Details */}
// // //               <div className="grid grid-cols-2 gap-3 mb-4">
// // //                 <div>
// // //                   <span className="text-sm text-gray-500">Total Beds:</span>
// // //                   <p className="font-medium">{facility.total_beds}</p>
// // //                 </div>
// // //                 {facility.established_year && (
// // //                   <div>
// // //                     <span className="text-sm text-gray-500">Established:</span>
// // //                     <p className="font-medium">{facility.established_year}</p>
// // //                   </div>
// // //                 )}
// // //                 {facility.license_number && (
// // //                   <div>
// // //                     <span className="text-sm text-gray-500">License:</span>
// // //                     <p className="font-medium text-sm">
// // //                       {facility.license_number}
// // //                     </p>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* Additional Services */}
// // //               {facility.additional_services &&
// // //                 Object.keys(facility.additional_services).length > 0 && (
// // //                   <div className="mb-4">
// // //                     <h3 className="text-sm font-medium text-gray-700 mb-1">
// // //                       Services:
// // //                     </h3>
// // //                     <div className="flex flex-wrap gap-2">
// // //                       {Object.keys(facility.additional_services).map(
// // //                         (service) => (
// // //                           <span
// // //                             key={service}
// // //                             className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
// // //                           >
// // //                             {service}
// // //                           </span>
// // //                         )
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //               {/* Website & Contact */}
// // //               <div className="flex justify-between items-center pt-4 border-t">
// // //                 {facility.website && (
// // //                   <a
// // //                     href={facility.website}
// // //                     target="_blank"
// // //                     rel="noopener noreferrer"
// // //                     className="text-blue-600 hover:text-blue-800 text-sm"
// // //                   >
// // //                     Visit Website →
// // //                   </a>
// // //                 )}
// // //                 <button
// // //                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// // //                   onClick={() =>
// // //                     navigate(`/dashboard/patient/booking/${facility.id}`)
// // //                   }
// // //                 >
// // //                   View Details
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {facilities.length === 0 && (
// // //           <div className="text-center py-12">
// // //             <p className="text-gray-500 text-lg">No facilities found.</p>
// // //           </div>
// // //         )}
// // //       </div>
// // //   );
// // // };

// // // export default PatientFacilities;

// // import DashboardLayout from "@/components/layouts/DashboardLayout";
// // import { toast } from "@/hooks/use-toast";
// // import { supabase } from "@/integrations/supabase/client";
// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button"; // Add this import

// // interface Facility {
// //   id: string;
// //   admin_user_id: string;
// //   facility_name: string;
// //   facility_type: string;
// //   license_number: string;
// //   address: string;
// //   additional_services: Record<string, any>;
// //   rating: number | null;
// //   total_reviews: number | null;
// //   is_verified: boolean;
// //   created_at: string;
// //   updated_at: string;
// //   latitude: number | null;
// //   longitude: number | null;
// //   established_year: number | null;
// //   website: string | null;
// //   insurance_partners: string | null;
// //   departments: Record<string, any>;
// //   total_beds: number;
// //   about_facility: string | null;
// //   city: string;
// //   state: string;
// //   pincode: number;
// //   available_beds?: number;
// // }
// // interface PatientFacilitiesProps {
// //   view: "all" | "beds";
// // }

// // const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
// //   const [facilities, setFacilities] = useState<Facility[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState<any>(null);
// //   const createSlug = (text: string) => {
// //   return text
// //     .toLowerCase()
// //     .replace(/[^a-z0-9]+/g, '-')
// //     .replace(/^-+|-+$/g, '');
// // };
// // const [wards, setWards] = useState<any[]>([]);
// //   const [beds, setBeds] = useState<any[]>([]);
// //   const [bookings, setBookings] = useState<any[]>([]);
  
 
// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const { data: { session }, error } = await supabase.auth.getSession();
        
// //         if (error) throw error;
        
// //         if (session) {
// //           setUser(session.user);
// //         } else {
// //           setUser(null);
// //         }
// //       } catch (error) {
// //         console.error("Auth check error:", error);
// //         setUser(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     checkAuth();

// //     // Set up auth state listener
// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       if (session) {
// //         setUser(session.user);
// //       } else {
// //         setUser(null);
// //       }
// //     });

// //     return () => subscription.unsubscribe();
// //   }, []);

    
// //     useEffect(() => {
// //     fetchFacilities();
// //   }, []);

// //   const fetchFacilities = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const { data: facilityData, error: facilityError } = await supabase
// //         .from("facilities")
// //         .select("*");
        

// //       if (facilityError) {
// //         throw facilityError;
// //       }

// //       if (facilityData) {
// //         setFacilities(facilityData);
// //       }

// //       // Fetch all available beds
// //     const { data: bedsData } = await supabase
// //       .from("beds")
// //       .select("facility_id")
// //       .eq("current_status", "AVAILABLE")
// //       .eq("is_active", true);

// //     // Count available beds per facility
// //     const bedCountByFacility = (bedsData || []).reduce((acc: Record<string, number>, bed) => {
// //       acc[bed.facility_id] = (acc[bed.facility_id] || 0) + 1;
// //       return acc;
// //     }, {});

// //     setBeds(bedsData || []);
    
// //     // Update facilities with available bed counts
// //     setFacilities(prevFacilities => 
// //       prevFacilities.map(facility => ({
// //         ...facility,
// //         available_beds: bedCountByFacility[facility.id] || 0
// //       }))
// //     );
// //     } catch (err: any) {
// //       setError(err.message || "Failed to fetch facilities");
// //       console.error("Error fetching facilities:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogin = (facilityId: string, facilityName: string) => {
// //      navigate(`/login/patient`, { 
// //         state: { from: `/dashboard/patient/booking/${createSlug(facilityName)}/${facilityId}` } 
// //       });
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="text-lg">Loading facilities...</div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
// //         <strong>Error:</strong> {error}
// //         <button
// //           onClick={fetchFacilities}
// //           className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
// //         >
// //           Retry
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold"></h1>
        
// //         {/* Conditional Login Button */}
// //         {!user && (
// //           <Button 
// //             onClick={() => facilities.map((facility) => handleLogin(facility.id, facility.facility_name))}
// //             className="bg-blue-600 hover:bg-blue-700"
// //           >
// //             Login to Book
// //           </Button>
// //         )}
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {facilities.map((facility) => (
// //           <div
// //             key={facility.id}
// //             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
// //           >
// //             {/* <div className="flex justify-between items-start mb-4">
// //               <div>
// //                 <h2 className="text-xl font-semibold text-gray-800">
// //                   {facility.facility_name}
// //                 </h2>
// //                 <p className="text-sm text-gray-600 mt-1">
// //                   {facility.facility_type}
// //                 </p>
// //               </div>
// //               <div>
// //               {facility.is_verified && (
// //                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
// //                   Verified
// //                 </span>
// //               )}
              
// //               {facility.rating !== null && (
// //                 <>
// //                   <span className="text-yellow-500">★</span>
// //                   <span className="ml-1 font-medium">
// //                     {facility.rating.toFixed(1)}
// //                   </span>
// //                   <span className="text-gray-500 text-sm ml-1">
// //                     ({facility.total_reviews || 0} reviews)
// //                   </span>
// //                 </>
// //               )}
// //               </div>
// //             </div> */}
// // <div className="flex justify-between items-start mb-4">
// //   <div>
// //     <h2 className="text-xl font-semibold text-gray-800">
// //       {facility.facility_name}
// //     </h2>
// //     <p className="text-sm text-gray-600 mt-1">
// //       {facility.facility_type}
// //     </p>
// //   </div>
  
// //   {/* Top Section - Verified Badge and Rating */}
// //   <div className="flex flex-col items-end gap-1">
// //     {facility.is_verified && (
// //       <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
// //         Verified
// //       </span>
// //     )}
    
// //     {facility.rating !== null && (
// //       <div className="flex items-center">
// //         <span className="text-yellow-500">★</span>
// //         <span className="ml-1 font-medium">
// //           {facility.rating.toFixed(1)}
// //         </span>
// //         <span className="text-gray-500 text-sm ml-1">
// //           ({facility.total_reviews || 0} reviews)
// //         </span>
// //       </div>
// //     )}
// //   </div>
// // </div>


// //             {/* Address */}
// //             <div className="mb-4">
// //               <h3 className="text-sm font-medium text-gray-700 mb-1">
// //                 Address:
// //               </h3>
// //               <p className="text-gray-600">
// //       {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
// //               </p>
// //             </div>

// //             {/* Facility Details */}
// //             <div className="grid grid-cols-3 gap-3 mb-4">
// //               <div>
// //                 <span className="text-sm text-gray-500">Total Beds:</span>
// //                  <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
// //               </div>
// //               {facility.established_year && (
// //                 <div>
// //                   <span className="text-sm text-gray-500">Established:</span>
// //                   <p className="font-medium">{facility.established_year}</p>
// //                 </div>
// //               )}
// //               {facility.license_number && (
// //                 <div>
// //                   <span className="text-sm text-gray-500">License:</span>
// //                   <p className="font-medium text-sm">
// //                     {facility.license_number}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Additional Services */}
// //             {/* {facility.additional_services &&
// //               Object.keys(facility.additional_services).length > 0 && (
// //                 <div className="mb-4">
// //                   <h3 className="text-sm font-medium text-gray-700 mb-1">
// //                     Services:
// //                   </h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {Object.keys(facility.additional_services).map(
// //                       (service) => (
// //                         <span
// //                           key={service}
// //                           className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
// //                         >
// //                           {service}
// //                         </span>
// //                       )
// //                     )}
// //                   </div>
// //                 </div>
// //               )} */}

// //             {/* Website & Contact */}
// //             <div className="flex justify-between items-center pt-4 border-t">
// //               {facility.website && (
// //                 <a
// //                   href={facility.website}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="text-blue-600 hover:text-blue-800 text-sm"
// //                 >
// //                   Visit Website →
// //                 </a>
// //               )}
// //               {/* <button
// //                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// //                 onClick={() => {
// //                   if (user) {
// //                     navigate(`/dashboard/patient/booking/${facility.id}`);
// //                   } else {
// //                     toast({
// //                       title: "Login Required",
// //                       description: "Please login to view facility details and book beds",
// //                       variant: "destructive",
// //                     });
// //                     navigate(`/login/patient/${facility.id}`, { state: { from: `/dashboard/patient/booking/${facility.id}` } });
// //                   }
// //                 }}
// //               >
// //                 View Details
// //               </button> */}
// //               <button
// //   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// //   onClick={() => {
// //     if (user) {
// //       navigate(`/dashboard/patient/booking/${facility.id}`);
// //     } else {
// //       toast({
// //         title: "Login Required",
// //         description: "Please login to view facility details and book beds",
// //         variant: "destructive",
// //       });
// //       // Fixed: Remove facility ID from login path
// //       navigate(`/login/patient`, { 
// //         state: { from: `/dashboard/patient/booking/${createSlug(facility.facility_name)}/${facility.id}` } 
// //       });
// //     }
// //   }}
// // >
// //   View Details
// // </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {facilities.length === 0 && (
// //         <div className="text-center py-12">
// //           <p className="text-gray-500 text-lg">No facilities found.</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PatientFacilities;

// // export default PatientFacilities;

// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { toast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Bed, Home, MapPin, ChevronRight, Activity, Wind, Shield, Users, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

// interface Facility {
//   id: string;
//   admin_user_id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   address: string;
//   additional_services: Record<string, any>;
//   rating: number | null;
//   total_reviews: number | null;
//   is_verified: boolean;
//   created_at: string;
//   updated_at: string;
//   latitude: number | null;
//   longitude: number | null;
//   established_year: number | null;
//   website: string | null;
//   insurance_partners: string | null;
//   departments: Record<string, any>;
//   total_beds: number;
//   about_facility: string | null;
//   city: string;
//   state: string;
//   pincode: number;
//   available_beds?: number;
//   wards?: Ward[];
// }

// interface Ward {
//   id: string;
//   name: string;
//   ward_code: string;
//   ward_type: string;
//   floor_number: number;
//   wing: string;
//   facility_id: string;
//   total_beds: number;
//   available_beds?: number;
//   beds?: Bed[];
// }

// interface Bed {
//   id: string;
//   bed_number: string;
//   bed_type: string;
//   room_number: string;
//   floor_number: number;
//   wing: string;
//   current_status: string;
//   has_oxygen: boolean;
//   has_ventilator: boolean;
//   is_isolation: boolean;
//   price_per_day?: number;
//   ward_id: string;
// }

// interface BedBooking {
//   id: string;
//   bedNumber: string;
//   bedType: string;
//   roomNumber: string;
//   floorNumber: number;
//   wing: string;
//   status: string;
//   availability: string;
//   hasOxygen: boolean;
//   hasVentilator: boolean;
//   isIsolation: boolean;
//   wardId: string;
//   wardName: string;
//   wardCode: string;
//   wardType: string;
//   facilityId: string;
//   facilityName: string;
//   city: string;
//   state: string;
//   facilityType: string;
//   patientName?: string;
//   patientAge?: number;
//   doctor?: string;
//   department?: string;
//   pricePerDay?: number;
//   bookingDate?: string;
//   dischargeDate?: string;
// }
// interface SearchFilters {
//   city: string;
//   hospitalName: string;
//   department: string;
//   bedType: string;
//   hasOxygen: boolean;
//   hasVentilator: boolean;
//   isIsolation: boolean;
//   minPrice?: number;
//   maxPrice?: number;
// }


// interface PatientFacilitiesProps {
//   view: "all" | "beds";
// }

// const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
//   const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
//   const [showWardDetails, setShowWardDetails] = useState(false);
//   const [showBedDetails, setShowBedDetails] = useState(false);
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);
//   const [loadingBookings, setLoadingBookings] = useState(false);
//   const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
//   const [searchFilters, setSearchFilters] = useState<SearchFilters>({
//   city: '',
//   hospitalName: '',
//   department: '',
//   bedType: '',
//   hasOxygen: false,
//   hasVentilator: false,
//   isIsolation: false
// });
// const [cities, setCities] = useState<string[]>([]);
// const [departments, setDepartments] = useState<string[]>([]);
// const [bedTypes, setBedTypes] = useState<string[]>([]);
// const [showFilters, setShowFilters] = useState(false);
// const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
//   const createSlug = (text: string) => {
//     return text
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   };
  

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) throw error;
        
//         if (session) {
//           setUser(session.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setUser(session.user);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     fetchFacilities();
//   }, []);

//   const fetchFacilities = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch facilities
//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("*");

//       if (facilityError) throw facilityError;

//       if (!facilityData) {
//         setFacilities([]);
//         return;
//       }

//       // Fetch wards for all facilities
//       const facilityIds = facilityData.map(f => f.id);
//       const { data: wardsData, error: wardsError } = await supabase
//         .from("wards")
//         .select("*")
//         .in("facility_id", facilityIds);

//       if (wardsError) throw wardsError;

//       // Fetch beds for all wards
//       const wardIds = wardsData?.map(w => w.id) || [];
//       let bedsData: any[] = [];
      
//       if (wardIds.length > 0) {
//         const { data: bedsResult, error: bedsError } = await supabase
//           .from("beds")
//           .select("*")
//           .in("ward_id", wardIds)
//           .eq("is_active", true);

//         if (bedsError) throw bedsError;
//         bedsData = bedsResult || [];
//       }

//       // Organize beds by ward
//       const bedsByWard: Record<string, Bed[]> = {};
//       bedsData.forEach(bed => {
//         if (!bedsByWard[bed.ward_id]) {
//           bedsByWard[bed.ward_id] = [];
//         }
//         bedsByWard[bed.ward_id].push({
//           ...bed,
//           bed_number: bed.bed_number,
//           bed_type: bed.bed_type,
//           room_number: bed.room_number,
//           floor_number: bed.floor_number,
//           wing: bed.wing,
//           current_status: bed.current_status,
//           has_oxygen: bed.has_oxygen,
//           has_ventilator: bed.has_ventilator,
//           is_isolation: bed.is_isolation,
//           price_per_day: Math.floor(Math.random() * 500) + 100 // Mock price
//         });
//       });

//       // Calculate available beds per ward
//       const wardsWithBeds: Ward[] = (wardsData || []).map(ward => {
//         const wardBeds = bedsByWard[ward.id] || [];
//         const availableBeds = wardBeds.filter(bed => bed.current_status === 'AVAILABLE').length;
        
//         return {
//           ...ward,
//           beds: wardBeds,
//           total_beds: wardBeds.length,
//           available_beds: availableBeds
//         };
//       });

//       // Group wards by facility
//       const wardsByFacility: Record<string, Ward[]> = {};
//       wardsWithBeds.forEach(ward => {
//         if (!wardsByFacility[ward.facility_id]) {
//           wardsByFacility[ward.facility_id] = [];
//         }
//         wardsByFacility[ward.facility_id].push(ward);
//       });

//       // Calculate available beds per facility
//       const facilitiesWithDetails = facilityData.map(facility => {
//         const facilityWards = wardsByFacility[facility.id] || [];
//         const totalAvailableBeds = facilityWards.reduce((sum, ward) => sum + (ward.available_beds || 0), 0);
//         const totalBeds = facilityWards.reduce((sum, ward) => sum + (ward.total_beds || 0), 0);
        
//         return {
//           ...facility,
//           wards: facilityWards,
//           available_beds: totalAvailableBeds,
//           total_beds: totalBeds || facility.total_beds
//         };
//       });

//       setFacilities(facilitiesWithDetails);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch facilities");
//       console.error("Error fetching facilities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Extract unique cities, departments, and bed types
// useEffect(() => {
//   if (facilities.length > 0) {
//     // Extract unique cities
//     const uniqueCities = [...new Set(facilities.map(f => f.city).filter(Boolean))];
//     setCities(uniqueCities);

//     // Extract unique departments from all facilities
//     const allDepartments = facilities.flatMap(f => {
//       if (f.departments && typeof f.departments === 'object') {
//         return Object.keys(f.departments);
//       }
//       return [];
//     });
//     const uniqueDepartments = [...new Set(allDepartments)];
//     setDepartments(uniqueDepartments);

//     // Extract unique bed types from all beds
//     const allBedTypes = facilities.flatMap(f => 
//       f.wards?.flatMap(w => 
//         w.beds?.map(b => b.bed_type).filter(Boolean)
//       ) || []
//     );
//     const uniqueBedTypes = [...new Set(allBedTypes)];
//     setBedTypes(uniqueBedTypes);
//   }
// }, [facilities]);
// // Filter facilities based on search criteria
// useEffect(() => {
//   if (!facilities.length) {
//     setFilteredFacilities([]);
//     return;
//   }

//   const filtered = facilities.filter(facility => {
//     // City filter
//     if (searchFilters.city && facility.city !== searchFilters.city) {
//       return false;
//     }

//     // Hospital name filter
//     if (searchFilters.hospitalName && 
//         !facility.facility_name.toLowerCase().includes(searchFilters.hospitalName.toLowerCase())) {
//       return false;
//     }

//     // Department filter - check if facility has this department
//     if (searchFilters.department) {
//       const hasDepartment = facility.departments && 
//         Object.keys(facility.departments).some(dept => 
//           dept.toLowerCase().includes(searchFilters.department.toLowerCase())
//         );
//       if (!hasDepartment) return false;
//     }

//     // Bed type filter - check if any bed matches the bed type
//     if (searchFilters.bedType) {
//       const hasBedType = facility.wards?.some(ward =>
//         ward.beds?.some(bed => 
//           bed.bed_type.toLowerCase() === searchFilters.bedType.toLowerCase()
//         )
//       );
//       if (!hasBedType) return false;
//     }

//     // Check for specific facilities
//     if (searchFilters.hasOxygen || searchFilters.hasVentilator || searchFilters.isIsolation) {
//       const hasRequiredFeatures = facility.wards?.some(ward =>
//         ward.beds?.some(bed => {
//           if (searchFilters.hasOxygen && !bed.has_oxygen) return false;
//           if (searchFilters.hasVentilator && !bed.has_ventilator) return false;
//           if (searchFilters.isIsolation && !bed.is_isolation) return false;
//           return true;
//         })
//       );
//       if (!hasRequiredFeatures) return false;
//     }

//     return true;
//   });

//   setFilteredFacilities(filtered);
// }, [facilities, searchFilters]);

//   const handleLogin = (facilityId: string, facilityName: string) => {
//     navigate(`/login/patient`, { 
//       state: { from: `/dashboard/patient/booking/${createSlug(facilityName)}/${facilityId}` } 
//     });
//   };

//   const handleViewWards = (facility: Facility) => {
//     setSelectedFacility(facility);
//     setShowWardDetails(true);
//     setShowBedDetails(false);
//   };

//   const handleViewBeds = (ward: Ward) => {
//     setSelectedWard(ward);
//     setShowBedDetails(true);
//   };

//   const handleBack = () => {
//     if (showBedDetails) {
//       setShowBedDetails(false);
//     } else if (showWardDetails) {
//       setShowWardDetails(false);
//       setSelectedFacility(null);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, { class: string; icon: any }> = {
//       available: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
//       occupied: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
//       maintenance: { class: 'bg-red-100 text-red-800', icon: XCircle },
//       reserved: { class: 'bg-blue-100 text-blue-800', icon: Clock },
//       confirmed: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
//       pending: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
//       cancelled: { class: 'bg-red-100 text-red-800', icon: XCircle },
//       AVAILABLE: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
//       OCCUPIED: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
//       MAINTENANCE: { class: 'bg-red-100 text-red-800', icon: XCircle }
//     };
    
//     const badge = badges[status?.toLowerCase()] || { class: 'bg-gray-100 text-gray-800', icon: AlertCircle };
//     return badge;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg">Loading facilities...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         <strong>Error:</strong> {error}
//         <button
//           onClick={fetchFacilities}
//           className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }
  
//   const getAvailabilityColor = (availability: string) => {
//     return availability?.toLowerCase() === 'available' ? 'text-green-600' : 'text-red-600';
//   };
  
//   const checkIfPatient = async (userId: string) => {
//     try {
//       // Check if user exists in patients table
//       const { data, error } = await supabase
//         .from('patients')
//         .select('id')
//         .eq('user_id', userId)
//         .maybeSingle(); 
      
//       return !!data; // Returns true if patient exists
//     } catch (error) {
//       console.error('Error checking patient status:', error);
//       return false;
//     }
//   };

//   const handleNavigation = async (path: string, requiresAuth: boolean = true) => {
//     if (requiresAuth) {
//       if (!user) {
//         if (path) {
//           navigate(path);
//         } else {
//           navigate('/appointment');
//         }
//         return;
//       }
//       // Check if user is a patient for booking-related paths
//       if (path.includes('book') || path.includes('bed') || path.includes('doctor/')) {
//         const isPatient = await checkIfPatient(user.id);
//         if (!isPatient) {
//           toast({
//             title: "Access Denied",
//             description: "Only patients can book appointments and beds. Please login with a patient account."
//           });
//           return;
//         }
//       }
//     }
    
//     navigate(path);
//   };
  
//   const PatientProtectedButton: React.FC<{
//     onClick: () => void;
//     children: React.ReactNode;
//     className?: string;
//     path?: string;
//   }> = ({ onClick, children, className, path }) => {
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
  
//     const handleClick = async () => {
//       if (!user) {
//         if (path) {
//           navigate(path);
//         } else {
//           navigate('/appointment');
//         }
//         return;
//       }
  
//       setLoading(true);
//       try {
//         const { data } = await supabase
//           .from('patients')
//           .select('id')
//           .eq('user_id', user.id)
//           .single();
        
//         if (data) {
//           onClick(); // Patient can proceed
//         } else {
//           if (path) {
//             navigate(path);
//           } else {
//             navigate('/appointment');
//           }
//         }
//       } catch (error) {
//         console.error('Error verifying patient:', error);
//         toast({
//           title: "Unable to verify account type",
//           description: "Please try again."
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     return (
//       <button 
//         className={className} 
//         onClick={handleClick}
//         disabled={loading}
//       >
//         {loading ? 'Verifying...' : children}
//       </button>
//     );
//   };

//   // Ward Details View
// //   if (showWardDetails && selectedFacility) {
// //     // Flatten all beds from all wards for display
// //     const allBeds = selectedFacility.wards?.flatMap(ward => 
// //       ward.beds?.map(bed => ({
// //         id: bed.id,
// //         bedNumber: bed.bed_number,
// //         bedType: bed.bed_type,
// //         roomNumber: bed.room_number,
// //         floorNumber: bed.floor_number,
// //         wing: bed.wing,
// //         status: bed.current_status,
// //         availability: bed.current_status === 'AVAILABLE' ? 'Available' : 'Not Available',
// //         hasOxygen: bed.has_oxygen,
// //         hasVentilator: bed.has_ventilator,
// //         isIsolation: bed.is_isolation,
// //         wardId: ward.id,
// //         wardName: ward.name,
// //         wardCode: ward.ward_code,
// //         wardType: ward.ward_type,
// //         facilityId: selectedFacility.id,
// //         facilityName: selectedFacility.facility_name,
// //         city: selectedFacility.city,
// //         state: selectedFacility.state,
// //         facilityType: selectedFacility.facility_type,
// //         pricePerDay: bed.price_per_day
// //       })) || []
// //     ) || [];

// //     return (
// //       <div className="container mx-auto px-4 py-8">
// //         <button
// //           onClick={handleBack}
// //           className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
// //         >
// //           ← Back to Facilities
// //         </button>
        
// //         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// //           <h2 className="text-2xl font-bold mb-2">{selectedFacility.facility_name}</h2>
// //           <p className="text-gray-600 mb-4">{selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} - {selectedFacility.pincode}</p>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="bg-blue-50 p-4 rounded-lg">
// //               <p className="text-sm text-gray-600">Total Beds</p>
// //               <p className="text-2xl font-bold">{selectedFacility.total_beds}</p>
// //             </div>
// //             <div className="bg-green-50 p-4 rounded-lg">
// //               <p className="text-sm text-gray-600">Available Beds</p>
// //               <p className="text-2xl font-bold text-green-600">{selectedFacility.available_beds || 0}</p>
// //             </div>
// //             {/* <div className="bg-purple-50 p-4 rounded-lg">
// //               <p className="text-sm text-gray-600">Total Wards</p>
// //               <p className="text-2xl font-bold">{selectedFacility.wards?.length || 0}</p>
// //             </div> */}
// //           </div>
// //         </div>

// //         <h3 className="text-xl font-semibold mb-4">Beds in this Facility</h3>
// //         {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">City</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Hospital</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Department/Ward</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Bed Details</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Ward Details</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Room Number</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Status</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {allBeds.length > 0 ? (
// //                   allBeds.map((bed) => {
// //                     const statusBadge = getStatusBadge(bed.status);
// //                     const StatusIcon = statusBadge.icon;
                    
// //                     return (
// //                       <tr key={bed.id} className="hover:bg-gray-50">
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="flex items-center">
// //                             <MapPin size={16} className="text-gray-400 mr-2" />
// //                             <span className="text-sm text-gray-900">{bed.city || 'N/A'}</span>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="text-sm font-medium text-gray-900">{bed.facilityName}</div>
// //                           <div className="text-sm text-gray-500">{bed.facilityType}</div>
// //                         </td>
// //                         <td className="px-6 py-4">
// //                           <div>
// //                             <div className="text-sm font-medium text-gray-900">{bed.wardName || 'General Ward'}</div>
// //                             <div className="text-xs text-gray-500">
// //                               {bed.wardType} • Code: {bed.wardCode}
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4">
// //                           <div>
// //                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
// //                               {bed.bedType}
// //                             </span>
// //                             <div className="text-xs text-gray-500 mt-1">
// //                               Bed: {bed.bedNumber}
// //                               {bed.hasVentilator && ' • Ventilator'}
// //                               {bed.hasOxygen && ' • O2'}
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4">
// //                           <div>
// //                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
// //                               Floor {bed.floorNumber}
// //                             </span>
// //                             <div className="text-xs text-gray-500 mt-1">
// //                               Wing: {bed.wing || 'Main'}
// //                               {bed.isIsolation && ' • Isolation'}
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="text-sm font-medium text-gray-900">{bed.roomNumber || 'N/A'}</div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class} items-center gap-1`}>
// //                             <StatusIcon size={12} />
// //                             {bed.status}
// //                           </span>
// //                           <div className={`text-xs mt-1 ${getAvailabilityColor(bed.availability)}`}>
// //                             {bed.availability}
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <PatientProtectedButton 
// //                             className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //                             onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
// //                             path="/appointment"
// //                           >
// //                             <Bed size={16} className="mr-2" />
// //                             <span>View Bed</span>
// //                           </PatientProtectedButton>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })
// //                 ) : (
// //                   <tr>
// //                     <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
// //                       No beds found in this facility
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div> */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //   {allBeds.length > 0 ? (
// //     allBeds.map((bed) => {
// //       const statusBadge = getStatusBadge(bed.status);
// //       const StatusIcon = statusBadge.icon;
      
// //       return (
// //         <div key={bed.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
// //           {/* Header with City and Hospital */}
// //           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center space-x-2">
// //                 <MapPin size={16} className="text-blue-600" />
// //                 <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
// //               </div>
// //               {bed.facilityType && (
// //                 <span className="text-xs bg-white px-2 py-1 rounded-full text-blue-600 font-medium">
// //                   {bed.facilityType}
// //                 </span>
// //               )}
// //             </div>
// //             <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
// //           </div>

// //           {/* Ward Information */}
// //           <div className="px-4 py-3 border-b bg-gray-50">
// //             <div className="flex justify-between items-center">
// //               <div>
// //                 <p className="text-sm text-gray-600">Ward</p>
// //                 <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-sm text-gray-600">Ward Code</p>
// //                 <p className="font-mono text-sm font-medium text-gray-700">{bed.wardCode}</p>
// //               </div>
// //             </div>
// //             <div className="mt-1 text-xs text-gray-500">
// //               {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
// //             </div>
// //           </div>

// //           {/* Bed Details */}
// //           <div className="px-4 py-3">
// //             <div className="flex justify-between items-start mb-3">
// //               <div>
// //                 <span className="text-sm text-gray-600">Bed</span>
// //                 <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
// //               </div>
// //               <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
// //                 <StatusIcon size={12} />
// //                 {bed.status}
// //               </span>
// //             </div>

// //             <div className="grid grid-cols-2 gap-3 mb-3">
// //               <div>
// //                 <p className="text-xs text-gray-500">Bed Type</p>
// //                 <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
// //                   {bed.bedType}
// //                 </span>
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500">Room</p>
// //                 <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
// //               </div>
// //             </div>

// //             {/* Features */}
// //             <div className="flex flex-wrap gap-2 mb-3">
// //               {bed.hasOxygen && (
// //                 <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
// //                   <Wind size={12} className="mr-1" />
// //                   Oxygen
// //                 </span>
// //               )}
// //               {bed.hasVentilator && (
// //                 <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
// //                   <Activity size={12} className="mr-1" />
// //                   Ventilator
// //                 </span>
// //               )}
// //               {bed.isIsolation && (
// //                 <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
// //                   <Shield size={12} className="mr-1" />
// //                   Isolation
// //                 </span>
// //               )}
// //             </div>

// //             {/* Price and Availability */}
// //             <div className="flex justify-between items-center pt-2 border-t">
// //               <div>
// //                 <p className={`text-xs ${getAvailabilityColor(bed.availability)}`}>
// //                   {bed.availability}
// //                 </p>
// //               </div>
              
// //               {/* Action Button */}
// //               <PatientProtectedButton 
// //                 className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //                 onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
// //                 path="/appointment"
// //               >
// //                 <Bed size={16} className="mr-2" />
// //                 <span>Book Now</span>
// //               </PatientProtectedButton>
// //             </div>
// //           </div>
// //         </div>
// //       );
// //     })
// //   ) : (
// //     <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
// //       <Bed size={48} className="mx-auto text-gray-400 mb-3" />
// //       <p className="text-gray-500 text-lg">No beds found in this facility</p>
// //     </div>
// //   )}
// // </div>
// //       </div>
// //     );
// //   }

// if (showWardDetails && selectedFacility) {
//     // Flatten all beds from all wards for display
//     const allBeds = selectedFacility.wards?.flatMap(ward => 
//       ward.beds?.map(bed => ({
//         id: bed.id,
//         bedNumber: bed.bed_number,
//         bedType: bed.bed_type,
//         roomNumber: bed.room_number,
//         floorNumber: bed.floor_number,
//         wing: bed.wing,
//         status: bed.current_status,
//         availability: bed.current_status === 'AVAILABLE' ? 'Available' : 'Not Available',
//         hasOxygen: bed.has_oxygen,
//         hasVentilator: bed.has_ventilator,
//         isIsolation: bed.is_isolation,
//         wardId: ward.id,
//         wardName: ward.name,
//         wardCode: ward.ward_code,
//         wardType: ward.ward_type,
//         facilityId: selectedFacility.id,
//         facilityName: selectedFacility.facility_name,
//         city: selectedFacility.city,
//         state: selectedFacility.state,
//         facilityType: selectedFacility.facility_type,
//         pricePerDay: bed.price_per_day
//       })) || []
//     ) || [];

//     // Filter available beds
//     const availableBeds = allBeds.filter(bed => bed.status === 'AVAILABLE');
//     const unavailableBeds = allBeds.filter(bed => bed.status !== 'AVAILABLE');

//     return (
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={handleBack}
//           className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
//         >
//           ← Back to Facilities
//         </button>
        
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-2xl font-bold mb-2">{selectedFacility.facility_name}</h2>
//           <p className="text-gray-600 mb-4">{selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} - {selectedFacility.pincode}</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Total Beds</p>
//               <p className="text-2xl font-bold">{selectedFacility.total_beds}</p>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
//               <p className="text-sm text-gray-600">Available Beds</p>
//               <p className="text-3xl font-bold text-green-600">{selectedFacility.available_beds || 0}</p>
//             </div>
//             <div className="bg-red-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Occupied Beds</p>
//               <p className="text-2xl font-bold text-red-600">
//                 {(selectedFacility.total_beds || 0) - (selectedFacility.available_beds || 0)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Available Beds Section */}
//         {availableBeds.length > 0 && (
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-semibold text-green-700 flex items-center">
//                 <span className="bg-green-100 p-1 rounded-full mr-2">
//                   <CheckCircle size={20} className="text-green-600" />
//                 </span>
//                 Available Beds ({availableBeds.length})
//               </h3>
//               <span className="text-sm text-gray-500">Ready for immediate booking</span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {availableBeds.map((bed) => {
//                 const statusBadge = getStatusBadge(bed.status);
//                 const StatusIcon = statusBadge.icon;
                
//                 return (
//                   <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
//                     {/* Available Badge */}
//                     {/* <div className="absolute top-2 right-2">
//                       <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
//                         <CheckCircle size={12} className="mr-1" />
//                         AVAILABLE NOW
//                       </span>
//                     </div> */}

//                     {/* Header with City and Hospital */}
//                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <MapPin size={16} className="text-green-600" />
//                           <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
//                         </div>
//                         {bed.facilityType && (
//                           <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 font-medium">
//                             {bed.facilityType}
//                           </span>
//                         )}
//                       </div>
//                       <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
//                     </div>

//                     {/* Ward Information */}
//                     <div className="px-4 py-3 border-b bg-gray-50">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-sm text-gray-600">Ward</p>
//                           <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm text-gray-600">Ward Code</p>
//                           <p className="font-mono text-sm font-medium text-gray-700">{bed.wardCode}</p>
//                         </div>
//                       </div>
//                       <div className="mt-1 text-xs text-gray-500">
//                         {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
//                       </div>
//                     </div>

//                     {/* Bed Details */}
//                     <div className="px-4 py-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <span className="text-sm text-gray-600">Bed</span>
//                           <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
//                         </div>
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
//                           <StatusIcon size={12} />
//                           {bed.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 mb-3">
//                         <div>
//                           <p className="text-xs text-gray-500">Bed Type</p>
//                           <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
//                             {bed.bedType}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Room</p>
//                           <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
//                         </div>
//                       </div>

//                       {/* Features */}
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {bed.hasOxygen && (
//                           <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                             <Wind size={12} className="mr-1" />
//                             Oxygen
//                           </span>
//                         )}
//                         {bed.hasVentilator && (
//                           <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
//                             <Activity size={12} className="mr-1" />
//                             Ventilator
//                           </span>
//                         )}
//                         {bed.isIsolation && (
//                           <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
//                             <Shield size={12} className="mr-1" />
//                             Isolation
//                           </span>
//                         )}
//                       </div>

//                       {/* Price and Action */}
//                       <div className="flex justify-between items-center pt-2 border-t">
//                         <div>
//                          {bed.pricePerDay && bed.pricePerDay > 0 ? (
//   <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
// ) : (
//   <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
// )}
//                             {/* <div className="absolute top-2 right-2">  */}
//                       <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
//                         <CheckCircle size={12} className="mr-1" />
//                         AVAILABLE NOW
//                       </span>
//                       {/* </div> 
//                           <p className="text-xs text-green-600 flex items-center">
//                             <CheckCircle size={10} className="mr-1" />
//                             Ready to book
//                           </p> */}
//                         </div>
                        
//                         {/* Action Button */}
//                             {!user ? (
//    <Button
//       variant="default"
//       size="sm"
//       onClick={() => navigate("/login/patient", { 
//         state: { 
//           from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`,
//           bedData: {
//             facilityName: bed.facilityName,
//             facilityId: bed.facilityId,
//             wardId: bed.wardId,
//             bedId: bed.id,
//             bedNumber: bed.bedNumber,
//             wardName: bed.wardName,
//             bedType: bed.bedType,
//             pricePerDay: bed.pricePerDay
//           }
//         } 
//       })}
//       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//     >
//       <Bed size={16} className="mr-2" />
//       <span>Login to Book</span>
//     </Button>
// ) : (
//                             <>
//                         <PatientProtectedButton 
//                           className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                           onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
//                           path="/appointment"
//                         >
//                           <Bed size={16} className="mr-2" />
//                           <span>Book Now</span>
//                         </PatientProtectedButton>
//                         </>)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Other Beds Section */}
//         {/* {unavailableBeds.length > 0 && (
//           <div className="mt-8">
//             <div className="flex items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-700">Other Beds ({unavailableBeds.length})</h3>
//               <span className="ml-2 text-sm text-gray-500">Currently not available</span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {unavailableBeds.map((bed) => {
//                 const statusBadge = getStatusBadge(bed.status);
//                 const StatusIcon = statusBadge.icon;
                
//                 return (
//                   <div key={bed.id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75 hover:shadow-lg transition-shadow">
//                     {/* Header with City and Hospital 
//                     <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <MapPin size={16} className="text-gray-400" />
//                           <span className="text-sm font-medium text-gray-600">{bed.city || 'N/A'}</span>
//                         </div>
//                         {bed.facilityType && (
//                           <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
//                             {bed.facilityType}
//                           </span>
//                         )}
//                       </div>
//                       <h3 className="text-lg font-bold text-gray-700 mt-1">{bed.facilityName}</h3>
//                     </div>

//                     {/* Ward Information 
//                     <div className="px-4 py-3 border-b bg-gray-50">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-sm text-gray-500">Ward</p>
//                           <p className="font-semibold text-gray-700">{bed.wardName || 'General Ward'}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm text-gray-500">Ward Code</p>
//                           <p className="font-mono text-sm font-medium text-gray-600">{bed.wardCode}</p>
//                         </div>
//                       </div>
//                       <div className="mt-1 text-xs text-gray-400">
//                         {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
//                       </div>
//                     </div>

//                     {/* Bed Details 
//                     <div className="px-4 py-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <span className="text-sm text-gray-500">Bed</span>
//                           <p className="text-xl font-bold text-gray-700">{bed.bedNumber}</p>
//                         </div>
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
//                           <StatusIcon size={12} />
//                           {bed.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 mb-3">
//                         <div>
//                           <p className="text-xs text-gray-500">Bed Type</p>
//                           <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                             {bed.bedType}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Room</p>
//                           <p className="text-sm font-medium text-gray-600">{bed.roomNumber || 'N/A'}</p>
//                         </div>
//                       </div>

//                       {/* Features - Grayed out 
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {bed.hasOxygen && (
//                           <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
//                             <Wind size={12} className="mr-1" />
//                             Oxygen
//                           </span>
//                         )}
//                         {bed.hasVentilator && (
//                           <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
//                             <Activity size={12} className="mr-1" />
//                             Ventilator
//                           </span>
//                         )}
//                         {bed.isIsolation && (
//                           <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
//                             <Shield size={12} className="mr-1" />
//                             Isolation
//                           </span>
//                         )}
//                       </div>

//                       {/* Status Message 
//                       <div className="flex justify-between items-center pt-2 border-t">
//                         <div>
//                           {bed.pricePerDay && (
//                             <p className="text-sm text-gray-400">${bed.pricePerDay}/day</p>
//                           )}
//                           <p className="text-xs text-red-500 flex items-center">
//                             <XCircle size={10} className="mr-1" />
//                             Currently unavailable
//                           </p>
//                         </div>
                        
//                         {/* Disabled Button 
//                         <button
//                           disabled
//                           className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
//                         >
//                           <Bed size={16} className="mr-2" />
//                           <span>Not Available</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )} */}

//         {allBeds.length === 0 && (
//           <div className="text-center py-12 bg-gray-50 rounded-lg">
//             <Bed size={48} className="mx-auto text-gray-400 mb-3" />
//             <p className="text-gray-500 text-lg">No beds found in this facility</p>
//           </div>
//         )}
//       </div>
//     );
//   }
//   // Main Facilities View
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Find Bed Booking</h1>
        
//         {/* Conditional Login Button */}
//         {!user && (
//           <Button 
//             onClick={() => navigate('/login/patient')}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Login to Book
//           </Button>
//         )}
//       </div>

//       {/* Search and Filter Section */}
// <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//   <div className="flex items-center justify-between mb-4">
//     <h2 className="text-xl font-semibold">Search Hospitals & Beds</h2>
//     <Button 
//       variant="outline" 
//       onClick={() => setShowFilters(!showFilters)}
//       className="flex items-center gap-2"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/>
//       </svg>
//       {showFilters ? 'Hide Filters' : 'Show Filters'}
//     </Button>
//   </div>

//   {/* Quick Search Row */}
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">Search Hospital Name</label>
//       <input
//         type="text"
//         placeholder="Enter hospital name..."
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         value={searchFilters.hospitalName}
//         onChange={(e) => setSearchFilters({...searchFilters, hospitalName: e.target.value})}
//       />
//     </div>
    
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
//       <select
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         value={searchFilters.city}
//         onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
//       >
//         <option value="">All Cities</option>
//         {cities.map(city => (
//           <option key={city} value={city}>{city}</option>
//         ))}
//       </select>
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
//       <select
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         value={searchFilters.department}
//         onChange={(e) => setSearchFilters({...searchFilters, department: e.target.value})}
//       >
//         <option value="">All Departments</option>
//         {departments.map(dept => (
//           <option key={dept} value={dept}>{dept}</option>
//         ))}
//       </select>
//     </div>
//   </div>

//   {/* Advanced Filters */}
//   {showFilters && (
//     <div className="border-t pt-4 mt-2">
//       <h3 className="text-lg font-medium mb-3">Advanced Filters</h3>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Bed Type Filter */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchFilters.bedType}
//             onChange={(e) => setSearchFilters({...searchFilters, bedType: e.target.value})}
//           >
//             <option value="">All Bed Types</option>
//             {bedTypes.map(type => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>

//         {/* Facilities Checkboxes */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Required Facilities</label>
//           <div className="space-y-2">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 checked={searchFilters.hasOxygen}
//                 onChange={(e) => setSearchFilters({...searchFilters, hasOxygen: e.target.checked})}
//               />
//               <span className="ml-2 text-sm text-gray-700">Oxygen Support</span>
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 checked={searchFilters.hasVentilator}
//                 onChange={(e) => setSearchFilters({...searchFilters, hasVentilator: e.target.checked})}
//               />
//               <span className="ml-2 text-sm text-gray-700">Ventilator</span>
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 checked={searchFilters.isIsolation}
//                 onChange={(e) => setSearchFilters({...searchFilters, isIsolation: e.target.checked})}
//               />
//               <span className="ml-2 text-sm text-gray-700">Isolation Room</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Search Button */}
//   <div className="mt-4 flex justify-end">
//     <Button 
//       onClick={() => {
//         // Trigger search - already handled by useEffect
//         console.log('Searching with filters:', searchFilters);
//       }}
//       className="bg-blue-600 hover:bg-blue-700 text-white px-6"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//         <circle cx="11" cy="11" r="8"/>
//         <line x1="21" y1="21" x2="16.65" y2="16.65"/>
//       </svg>
//       Search Hospitals
//     </Button>
//   </div>

//   {/* Results Count */}
//   <div className="mt-4 text-sm text-gray-600">
//     Found <span className="font-semibold">{filteredFacilities.length}</span> hospitals matching your criteria
//   </div>
// </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {facilities.map((facility) => (
//           <div
//             key={facility.id}
//             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {facility.facility_name}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {facility.facility_type}
//                 </p>
//               </div>
              
//               {/* Top Section - Verified Badge and Rating */}
//               <div className="flex flex-col items-end gap-1">
//                 {facility.is_verified && (
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                     Verified
//                   </span>
//                 )}
                
//                 {facility.rating !== null && (
//                   <div className="flex items-center">
//                     <span className="text-yellow-500">★</span>
//                     <span className="ml-1 font-medium">
//                       {facility.rating.toFixed(1)}
//                     </span>
//                     <span className="text-gray-500 text-sm ml-1">
//                       ({facility.total_reviews || 0} reviews)
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Address */}
//             <div className="mb-4">
//               <h3 className="text-sm font-medium text-gray-700 mb-1">
//                 Address:
//               </h3>
//               <p className="text-gray-600">
//                 {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
//               </p>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <div className="bg-blue-50 p-2 rounded">
//                 <span className="text-xs text-gray-500">Total Beds</span>
//                 <p className="font-medium">{facility.total_beds}</p>
//               </div>
//               <div className="bg-green-50 p-2 rounded">
//                 <span className="text-xs text-gray-500">Available Beds</span>
//                 <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
//               </div>
//               {/* Total Wards */}
//               {/* <div className="bg-blue-100 p-2 rounded">
//                 <span className="text-xs text-gray-500">Total Wards:</span>
//                 <p className="font-medium">{facility.wards?.length || 0}</p>
//               </div> */}
//             </div>

//             {/* Facility Details */}
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               {facility.established_year && (
//                 <div>
//                   <span className="text-xs text-gray-500">Established:</span>
//                   <p className="font-medium text-sm">{facility.established_year}</p>
//                 </div>
//               )}
//               {facility.license_number && (
//                 <div>
//                   <span className="text-xs text-gray-500">License:</span>
//                   <p className="font-medium text-xs truncate">
//                     {facility.license_number}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Website & Actions */}
//             <div className="flex justify-between items-center pt-4 border-t">
//               {facility.website && (
//                 <a
//                   href={facility.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 text-sm"
//                 >
//                   Visit Website →
//                 </a>
//               )}
              
//               <div className="flex gap-2">
//                           {/* <button
//   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//   onClick={() => {
//     if (user) {
//       navigate(`/dashboard/patient/booking/${facility.id}`);
//     } else {
//       toast({
//         title: "Login Required",
//         description: "Please login to view facility details and book beds",
//         variant: "destructive",
//       });
//       // Fixed: Remove facility ID from login path
//       navigate(`/login/patient`, { 
//         state: { from: `/dashboard/patient/booking/${createSlug(facility.facility_name)}/${facility.id}` } 
//       });
//     }
//   }}
// >
//   View Details
//  </button>  */}
//                 <div className="relative group">
//   <button
//     className={`px-3 py-2 rounded-lg transition-colors text-sm ${
//       facility.available_beds && facility.available_beds > 0
//         ? 'bg-green-600 hover:bg-green-700 text-white'
//         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }`}
//     onClick={() => facility.available_beds && facility.available_beds > 0 && handleViewWards(facility)}
//     disabled={!facility.available_beds || facility.available_beds === 0}
//   >
//     {facility.available_beds && facility.available_beds > 0 
//       ? `View Beds (${facility.available_beds} Available)` 
//       : 'No Beds Available'}
//   </button>
  
//   {/* Optional tooltip for disabled state */}
//   {(!facility.available_beds || facility.available_beds === 0) && (
//     <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
//       No beds currently available in this facility
//     </div>
//   )}
// </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {facilities.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No facilities found.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientFacilities;

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bed, 
  Home, 
  MapPin, 
  ChevronRight, 
  Activity, 
  Wind, 
  Shield, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Building2,
  Stethoscope,
  Pill,
  Ambulance,
  HeartPulse,
  Syringe,
  Microscope,
  Bone,
  Brain,
  Eye,
  Ear,
  Baby,
  Droplet,
  PlusCircle,
  X,
  CalendarIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Country, State, City } from "country-state-city";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";

interface Facility {
  id: string;
  admin_user_id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: string;
  additional_services: Record<string, any>;
  rating: number | null;
  total_reviews: number | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
  established_year: number | null;
  website: string | null;
  insurance_partners: string | null;
  departments: Record<string, any>;
  total_beds: number;
  about_facility: string | null;
  city: string;
  state: string;
  pincode: number;
  available_beds?: number;
  wards?: Ward[];
  unique_ward_types?: string[];
}

interface Ward {
  id: string;
  name: string;
  ward_code: string;
  ward_type: string;
  floor_number: number;
  wing: string;
  facility_id: string;
  total_beds: number;
  available_beds?: number;
  beds?: Bed[];
}

interface Bed {
  id: string;
  bed_number: string;
  bed_type: string;
  room_number: string;
  floor_number: number;
  wing: string;
  current_status: string;
  has_oxygen: boolean;
  has_ventilator: boolean;
  is_isolation: boolean;
  price_per_day?: number;
  ward_id: string;
  created_at: string;
  
  actual_admission_time?: string;  // Add this
  actual_discharge_time?: string;  // Add this
}

interface BedBooking {
  id: string;
  bedNumber: string;
  bedType: string;
  roomNumber: string;
  floorNumber: number;
  wing: string;
  status: string;
  availability: string;
  hasOxygen: boolean;
  hasVentilator: boolean;
  isIsolation: boolean;
  wardId: string;
  wardName: string;
  wardCode: string;
  wardType: string;
  facilityId: string;
  facilityName: string;
  city: string;
  state: string;
  facilityType: string;
  patientName?: string;
  patientAge?: number;
  doctor?: string;
  department?: string;
  pricePerDay?: number;
  bookingDate?: string;
  dischargeDate?: string;
}

interface FilterState {
  searchText: string;
  city: string;
  department: string;
  facilityType: string;
  hasOxygen: boolean;
  hasVentilator: boolean;
  isIsolation: boolean;
}

interface PatientFacilitiesProps {
  view: "all" | "beds";
}

const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [showWardDetails, setShowWardDetails] = useState(false);
  const [showBedDetails, setShowBedDetails] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bedBookings, setBedBookings] = useState<BedBooking[]>([]);
  // const [locationFilter, setLocationFilter] = useState<string>("all");
 const [indianCities, setIndianCities] = useState<string[]>([]);
 
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    city: '',
    department: '',
    facilityType: '',
    hasOxygen: false,
    hasVentilator: false,
    isIsolation: false
  });
  
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [availableFacilityTypes, setAvailableFacilityTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
// Add these with your other useState declarations
const [searchTerm, setSearchTerm] = useState("");
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [startDate, setStartDate] = useState<Date>(new Date());
const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
const [bedTypeFilter, setBedTypeFilter] = useState("all");
const [activeTab, setActiveTab] = useState("availability");
const [currentMonth, setCurrentMonth] = useState(new Date());
const [dbWards, setDbWards] = useState<Ward[]>([]);
const [dbBeds, setDbBeds] = useState<Bed[]>([]);
  // Common department types in hospitals
  const commonDepartments = [
    'General Ward',
    'ICU',
    'CCU',
    'NICU',
    'PICU',
    'Emergency',
    'Operation Theatre',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Oncology',
    'Nephrology',
    'Pulmonology',
    'Gastroenterology',
    'Dermatology',
    'Psychiatry',
    'ENT',
    'Ophthalmology',
    'Dental',
    'Physiotherapy',
    'Radiology',
    'Laboratory'
  ];

  const facilityTypeIcons: Record<string, any> = {
    'Hospital': Building2,
    'Clinic': Stethoscope,
    'Nursing Home': Home,
    'Diagnostic Center': Microscope,
    'Rehabilitation Center': HeartPulse,
    'Mental Health Facility': Brain,
    'Maternity Home': Baby,
    'Hospice': HeartPulse,
    'Emergency Center': Ambulance,
    'Surgical Center': Syringe
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // useEffect(() => {
  //   fetchFacilities();
  // }, []);

  // useEffect(() => {
  //   // Apply filters whenever facilities or filters change
  //   applyFilters();
  // }, [facilities, filters]);
  useEffect(() => {
  fetchFacilities();
}, []);

// 👇 MOVE THIS useEffect UP HERE
useEffect(() => {
  const india = Country.getAllCountries().find(country => country.isoCode === 'IN');
  if (india) {
    const allIndianCities = City.getCitiesOfCountry('IN') || [];
    const cityNames = allIndianCities.map(city => city.name).sort();
    setIndianCities(cityNames);
  }
}, []);

useEffect(() => {
  applyFilters();
}, [facilities, filters]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch facilities
      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*");

      if (facilityError) throw facilityError;

      if (!facilityData) {
        setFacilities([]);
        setFilteredFacilities([]);
        return;
      }

      // Fetch wards for all facilities
      const facilityIds = facilityData.map(f => f.id);
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .select("*")
        .in("facility_id", facilityIds);

      if (wardsError) throw wardsError;

      // Fetch beds for all wards
      const wardIds = wardsData?.map(w => w.id) || [];
      let bedsData: any[] = [];
      
      if (wardIds.length > 0) {
        const { data: bedsResult, error: bedsError } = await supabase
          .from("beds")
          .select("*")
          .in("ward_id", wardIds)
          .eq("is_active", true);

        if (bedsError) throw bedsError;
        bedsData = bedsResult || [];
      }

      // Organize beds by ward
      const bedsByWard: Record<string, Bed[]> = {};
      bedsData.forEach(bed => {
        if (!bedsByWard[bed.ward_id]) {
          bedsByWard[bed.ward_id] = [];
        }
        bedsByWard[bed.ward_id].push({
          ...bed,
          bed_number: bed.bed_number,
          bed_type: bed.bed_type,
          room_number: bed.room_number,
          floor_number: bed.floor_number,
          wing: bed.wing,
          current_status: bed.current_status,
          created_at:bed.created_at,
          has_oxygen: bed.has_oxygen,
          has_ventilator: bed.has_ventilator,
          is_isolation: bed.is_isolation,
          price_per_day: Math.floor(Math.random() * 500) + 100 // Mock price
        });
      });

      // Calculate available beds per ward
      const wardsWithBeds: Ward[] = (wardsData || []).map(ward => {
        const wardBeds = bedsByWard[ward.id] || [];
        const availableBeds = wardBeds.filter(bed => bed.current_status === 'AVAILABLE').length;
        
        return {
          ...ward,
          beds: wardBeds,
          total_beds: wardBeds.length,
          available_beds: availableBeds
        };
      });

      // Group wards by facility
      const wardsByFacility: Record<string, Ward[]> = {};
      wardsWithBeds.forEach(ward => {
        if (!wardsByFacility[ward.facility_id]) {
          wardsByFacility[ward.facility_id] = [];
        }
        wardsByFacility[ward.facility_id].push(ward);
      });

      // Calculate available beds per facility and collect unique ward types
      const facilitiesWithDetails = facilityData.map(facility => {
        const facilityWards = wardsByFacility[facility.id] || [];
        const totalAvailableBeds = facilityWards.reduce((sum, ward) => sum + (ward.available_beds || 0), 0);
        const totalBeds = facilityWards.reduce((sum, ward) => sum + (ward.total_beds || 0), 0);
        
        // Get unique ward types for this facility
        const uniqueWardTypes = [...new Set(facilityWards.map(ward => ward.ward_type))];
        
        return {
          ...facility,
          wards: facilityWards,
          available_beds: totalAvailableBeds,
          total_beds: totalBeds || facility.total_beds,
          unique_ward_types: uniqueWardTypes
        };
      });

      setFacilities(facilitiesWithDetails);
      
      // Extract filter options
      const cities = [...new Set(facilitiesWithDetails.map(f => f.city).filter(Boolean))];
      const facilityTypes = [...new Set(facilitiesWithDetails.map(f => f.facility_type).filter(Boolean))];
      const departments = [...new Set(facilitiesWithDetails.flatMap(f => f.unique_ward_types || []))];
      
      setAvailableCities(cities.sort());
      setAvailableFacilityTypes(facilityTypes.sort());
      setAvailableDepartments(departments.sort());
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch facilities");
      console.error("Error fetching facilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...facilities];

    // Filter by search text (hospital name, address, city)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(facility => 
        facility.facility_name.toLowerCase().includes(searchLower) ||
        facility.address?.toLowerCase().includes(searchLower) ||
        facility.city?.toLowerCase().includes(searchLower) ||
        facility.state?.toLowerCase().includes(searchLower) ||
        facility.facility_type?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(facility => 
        facility.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Filter by facility type
    if (filters.facilityType) {
      filtered = filtered.filter(facility => 
        facility.facility_type?.toLowerCase() === filters.facilityType.toLowerCase()
      );
    }

    // Filter by department/ward type
    if (filters.department) {
      filtered = filtered.filter(facility => 
        facility.unique_ward_types?.some(type => 
          type.toLowerCase().includes(filters.department.toLowerCase())
        )
      );
    }

    // Filter by bed facilities
    if (filters.hasOxygen || filters.hasVentilator || filters.isIsolation) {
      filtered = filtered.filter(facility => {
        // Check if any bed in the facility has the required facilities
        return facility.wards?.some(ward => 
          ward.beds?.some(bed => 
            (!filters.hasOxygen || bed.has_oxygen) &&
            (!filters.hasVentilator || bed.has_ventilator) &&
            (!filters.isIsolation || bed.is_isolation)
          )
        );
      });
    }

    setFilteredFacilities(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      city: '',
      department: '',
      facilityType: '',
      hasOxygen: false,
      hasVentilator: false,
      isIsolation: false
    });
  };

  const handleLogin = (facilityId: string, facilityName: string) => {
    navigate(`/login/patient`, { 
      state: { from: `/dashboard/patient/booking/${createSlug(facilityName)}/${facilityId}` } 
    });
  };

  const handleViewWards = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowWardDetails(true);
    setShowBedDetails(false);
  };

  const handleViewBeds = (ward: Ward) => {
    setSelectedWard(ward);
    setShowBedDetails(true);
  };

  const handleBack = () => {
    if (showBedDetails) {
      setShowBedDetails(false);
    } else if (showWardDetails) {
      setShowWardDetails(false);
      setSelectedFacility(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: any }> = {
      available: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      occupied: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      maintenance: { class: 'bg-red-100 text-red-800', icon: XCircle },
      reserved: { class: 'bg-blue-100 text-blue-800', icon: Clock },
      confirmed: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      cancelled: { class: 'bg-red-100 text-red-800', icon: XCircle },
      AVAILABLE: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      OCCUPIED: { class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      MAINTENANCE: { class: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const badge = badges[status?.toLowerCase()] || { class: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    return badge;
  };

  const checkIfPatient = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle(); 
      
      return !!data;
    } catch (error) {
      console.error('Error checking patient status:', error);
      return false;
    }
  };

  const handleNavigation = async (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth) {
      if (!user) {
        if (path) {
          navigate(path);
        } else {
          navigate('/appointment');
        }
        return;
      }
      if (path.includes('book') || path.includes('bed') || path.includes('doctor/')) {
        const isPatient = await checkIfPatient(user.id);
        if (!isPatient) {
          toast({
            title: "Access Denied",
            description: "Only patients can book appointments and beds. Please login with a patient account."
          });
          return;
        }
      }
    }
    navigate(path);
  };
  
  const PatientProtectedButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    path?: string;
  }> = ({ onClick, children, className, path }) => {
    const [loading, setLoading] = useState(false);
  
    const handleClick = async () => {
      if (!user) {
        if (path) {
          navigate(path);
        } else {
          navigate('/appointment');
        }
        return;
      }
  
      setLoading(true);
      try {
        const { data } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          onClick();
        } else {
          if (path) {
            navigate(path);
          } else {
            navigate('/appointment');
          }
        }
      } catch (error) {
        console.error('Error verifying patient:', error);
        toast({
          title: "Unable to verify account type",
          description: "Please try again."
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button 
        className={className} 
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Verifying...' : children}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading facilities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
        <button
          onClick={fetchFacilities}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }
if (showWardDetails && selectedFacility) {
    // Flatten all beds from all wards for display
    const allBeds = selectedFacility.wards?.flatMap(ward => 
      ward.beds?.map(bed => ({
        id: bed.id,
        bedNumber: bed.bed_number,
        bedType: bed.bed_type,
        roomNumber: bed.room_number,
        floorNumber: bed.floor_number,
        wing: bed.wing,
        status: bed.current_status,
        availability: bed.current_status === 'AVAILABLE' ? 'Available' : 'Not Available',
        hasOxygen: bed.has_oxygen,
        hasVentilator: bed.has_ventilator,
        isIsolation: bed.is_isolation,
        wardId: ward.id,
        wardName: ward.name,
        wardCode: ward.ward_code,
        wardType: ward.ward_type,
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.facility_name,
        city: selectedFacility.city,
        state: selectedFacility.state,
        facilityType: selectedFacility.facility_type,
        pricePerDay: bed.price_per_day,
        created_at: bed.created_at,
        actual_admission_time: bed.actual_admission_time,  // Add this
    actual_discharge_time: bed.actual_discharge_time 
      })) || []
    ) || [];

    // Filter available beds
    const availableBeds = allBeds.filter(bed => bed.status === 'AVAILABLE');
    const unavailableBeds = allBeds.filter(bed => bed.status !== 'AVAILABLE');

    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
        >
          ← Back to Facilities
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">{selectedFacility.facility_name}</h2>
          <p className="text-gray-600 mb-4">{selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} - {selectedFacility.pincode}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold">{selectedFacility.total_beds}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600">Available Beds</p>
              <p className="text-3xl font-bold text-green-600">{selectedFacility.available_beds || 0}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Occupied Beds</p>
              <p className="text-2xl font-bold text-red-600">
                {(selectedFacility.total_beds || 0) - (selectedFacility.available_beds || 0)}
              </p>
            </div>
          </div>

          {/* Available Departments/Wards */}
          {selectedFacility.unique_ward_types && selectedFacility.unique_ward_types.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Departments/Wards:</p>
              <div className="flex flex-wrap gap-2">
                {selectedFacility.unique_ward_types.map((type, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Beds Section */}
        {availableBeds.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-700 flex items-center">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <CheckCircle size={20} className="text-green-600" />
                </span>
                Available Beds ({availableBeds.length})
              </h3>
              <span className="text-sm text-gray-500">Ready for immediate booking</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Filters and Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Filters Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Quick Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                   
              
                    <div className="space-y-2">
                      <Label>Selected Date</Label>
                      <div className="border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) =>
                            isBefore(date, startOfDay(new Date()))
                          }
                          className="rounded-md"
                        />
                      </div>
                    </div>
              
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Beds and Bookings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tabs Navigation */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="availability">
                        Bed Availability
                      </TabsTrigger>
                      <TabsTrigger value="bookings">
                        All Bed Bookings
                      </TabsTrigger>
                    </TabsList>
              
                    <Button
                      className="gap-2"
                      onClick={() => {
                        // Find first available bed
                        setActiveTab("bookings");
                        const availableBed = availableBeds[0];
                        if (availableBed) {
                          // Replace with your booking dialog function
                          console.log("Quick book:", availableBed);
                          toast({
                            title: "Quick Book",
                            description: `Booking bed ${availableBed.bedNumber}`
                          });
                        } else {
                          toast({
                            title: "No available beds",
                            description: "No available beds at the moment",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Quick Book
                    </Button>
                  </div>

                  {/* <TabsContent value="availability" className="space-y-4">
                    {availableBeds.map((bed) => {
                      const statusBadge = getStatusBadge(bed.status);
                      const StatusIcon = statusBadge.icon;
                      
                      return ( */}
                      <TabsContent value="availability" className="space-y-4">
  {(() => {
    // Filter beds to show only those created today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const todayAvailableBeds = availableBeds.filter(bed => {
      if (!bed.created_at) return false;
      const bedDate = new Date(bed.created_at);
      bedDate.setHours(0, 0, 0, 0); // Start of bed's date
      return bedDate.getTime() === today.getTime();
    });

    return todayAvailableBeds.map((bed) => {
      const statusBadge = getStatusBadge(bed.status);
      const StatusIcon = statusBadge.icon;
      
      return (
                        <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              AVAILABLE NOW
                            </span>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-green-600" />
                                <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
                              </div>
                              {bed.facilityType && (
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 font-medium">
                                  {bed.facilityType}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
                          </div>

                          <div className="px-4 py-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">Ward/Department</p>
                                <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Ward Type</p>
                                <p className="font-medium text-sm text-gray-700">{bed.wardType}</p>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'} • Code: {bed.wardCode}
                            </div>
                          </div>

                          <div className="px-4 py-3">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="text-sm text-gray-600">Bed</span>
                                <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                                <StatusIcon size={12} />
                                {bed.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Bed Type</p>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  {bed.bedType}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Room</p>
                                <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {bed.hasOxygen && (
                                <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  <Wind size={12} className="mr-1" />
                                  Oxygen
                                </span>
                              )}
                              {bed.hasVentilator && (
                                <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  <Activity size={12} className="mr-1" />
                                  Ventilator
                                </span>
                              )}
                              {bed.isIsolation && (
                                <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  <Shield size={12} className="mr-1" />
                                  Isolation
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                              <div>
                                {bed.pricePerDay && bed.pricePerDay > 0 ? (
                                  <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
                                ) : (
                                  <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
                                )}
                              </div>
                              
                              {!user ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate("/login/patient", { 
                                    state: { 
                                      from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`,
                                      bedData: {
                                        facilityName: bed.facilityName,
                                        facilityId: bed.facilityId,
                                        wardId: bed.wardId,
                                        bedId: bed.id,
                                        bedNumber: bed.bedNumber,
                                        wardName: bed.wardName,
                                        bedType: bed.bedType,
                                        pricePerDay: bed.pricePerDay
                                      }
                                    } 
                                  })}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  <Bed size={16} className="mr-2" />
                                  <span>Login to Book</span>
                                </Button>
                              ) : (
                                <PatientProtectedButton 
                                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
                                  path="/appointment"
                                >
                                  <Bed size={16} className="mr-2" />
                                  <span>Book Now</span>
                                </PatientProtectedButton>
                              )}
                            </div>
                          </div>
                        </div>
                         );
    });
  })()}
  
  {availableBeds.length > 0 && (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAvailableBeds = availableBeds.filter(bed => {
      if (!bed.created_at) return false;
      const bedDate = new Date(bed.created_at);
      bedDate.setHours(0, 0, 0, 0);
      return bedDate.getTime() === today.getTime();
    });
    
    return todayAvailableBeds.length === 0 && (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Bed className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No beds available for today</p>
        <p className="text-sm text-gray-500 mt-1">Check back tomorrow or try different filters</p>
      </div>
    );
  })()}
</TabsContent>
                  {/* //     );
                  //   })}
                  // </TabsContent> */}
                  {/* <TabsContent value="availability" className="space-y-4">
  {(() => {
    // Use the selected date from your filter
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(0, 0, 0, 0);
    
    // Filter beds that are available on the selected date
    const bedsAvailableOnDate = availableBeds.filter(bed => {
      // If bed has no admission/discharge records, it's available
      if (!bed.actual_admission_time && !bed.actual_discharge_time) {
        return true;
      }
      
      // Check if bed is occupied during the selected date
      if (bed.actual_admission_time && bed.actual_discharge_time) {
        const admissionDate = new Date(bed.actual_admission_time);
        admissionDate.setHours(0, 0, 0, 0);
        
        const dischargeDate = new Date(bed.actual_discharge_time);
        dischargeDate.setHours(0, 0, 0, 0);
        
        // Bed is occupied if selected date is between admission and discharge
        const isOccupied = selectedDateTime >= admissionDate && selectedDateTime <= dischargeDate;
        return !isOccupied;
      }
      
      // If only admission time exists and it's in the past, bed might be occupied
      if (bed.actual_admission_time && !bed.actual_discharge_time) {
        const admissionDate = new Date(bed.actual_admission_time);
        admissionDate.setHours(0, 0, 0, 0);
        return selectedDateTime < admissionDate;
      }
      
      return true;
    });

    if (bedsAvailableOnDate.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bed size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="font-semibold text-gray-700">
            No beds available for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Try selecting a different date
          </p>
        </div>
      );
    }

    return bedsAvailableOnDate.map((bed) => {
      const statusBadge = getStatusBadge(bed.status);
      const StatusIcon = statusBadge.icon;
      
      return (
        <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <CheckCircle size={12} className="mr-1" />
              AVAILABLE ON {format(selectedDate, 'MMM d')}
            </span>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
              </div>
              {bed.facilityType && (
                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 font-medium">
                  {bed.facilityType}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
          </div>

          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Ward/Department</p>
                <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Ward Type</p>
                <p className="font-medium text-sm text-gray-700">{bed.wardType}</p>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'} • Code: {bed.wardCode}
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-sm text-gray-600">Bed</span>
                <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                <StatusIcon size={12} />
                {bed.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Bed Type</p>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {bed.bedType}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Room</p>
                <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {bed.hasOxygen && (
                <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <Wind size={12} className="mr-1" />
                  Oxygen
                </span>
              )}
              {bed.hasVentilator && (
                <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  <Activity size={12} className="mr-1" />
                  Ventilator
                </span>
              )}
              {bed.isIsolation && (
                <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  <Shield size={12} className="mr-1" />
                  Isolation
                </span>
              )}
            </div>

            {bed.actual_admission_time && bed.actual_discharge_time && (
              <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                <p className="text-blue-700">
                  Next available from: {format(new Date(bed.actual_discharge_time), 'MMM d, yyyy')}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                {bed.pricePerDay && bed.pricePerDay > 0 ? (
                  <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
                ) : (
                  <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
                )}
              </div>
              
              {!user ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/login/patient", { 
                    state: { 
                      from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`,
                      bedData: {
                        facilityName: bed.facilityName,
                        facilityId: bed.facilityId,
                        wardId: bed.wardId,
                        bedId: bed.id,
                        bedNumber: bed.bedNumber,
                        wardName: bed.wardName,
                        bedType: bed.bedType,
                        pricePerDay: bed.pricePerDay
                      }
                    } 
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Bed size={16} className="mr-2" />
                  <span>Login to Book</span>
                </Button>
              ) : (
                <PatientProtectedButton 
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
                  path="/appointment"
                >
                  <Bed size={16} className="mr-2" />
                  <span>Book Now</span>
                </PatientProtectedButton>
              )}
            </div>
          </div>
        </div>
      );
    });
  })()}
</TabsContent> */}

                  <TabsContent value="bookings" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Bed Bookings</CardTitle>
                        <CardDescription>
                          {loadingBookings ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              Loading beds...
                            </div>
                          ) : (
                            `Showing ${availableBeds.length} beds available`
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {availableBeds.length === 0 ? (
                          <div className="text-center py-8">
                            <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-700">No beds found</h3>
                            <p className="text-gray-500 text-sm mt-1">
                              No beds currently available in this facility
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableBeds.map((bed) => (
                               <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              AVAILABLE NOW
                            </span>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-green-600" />
                                <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
                              </div>
                              {bed.facilityType && (
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 font-medium">
                                  {bed.facilityType}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
                          </div>

                          <div className="px-4 py-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">Ward/Department</p>
                                <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Ward Type</p>
                                <p className="font-medium text-sm text-gray-700">{bed.wardType}</p>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'} • Code: {bed.wardCode}
                            </div>
                          </div>

                          <div className="px-4 py-3">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="text-sm text-gray-600">Bed</span>
                                <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
                              </div>
                            
                            </div>
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-medium text-sm text-gray-700">{bed.created_at ? new Date(bed.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A'}

                                </p>
                              </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Bed Type</p>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  {bed.bedType}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Room</p>
                                <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {bed.hasOxygen && (
                                <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  <Wind size={12} className="mr-1" />
                                  Oxygen
                                </span>
                              )}
                              {bed.hasVentilator && (
                                <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  <Activity size={12} className="mr-1" />
                                  Ventilator
                                </span>
                              )}
                              {bed.isIsolation && (
                                <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  <Shield size={12} className="mr-1" />
                                  Isolation
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                              <div>
                                {bed.pricePerDay && bed.pricePerDay > 0 ? (
                                  <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
                                ) : (
                                  <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
                                )}
                              </div>
                              
                              {!user ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate("/login/patient", { 
                                    state: { 
                                      from: `/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`,
                                      bedData: {
                                        facilityName: bed.facilityName,
                                        facilityId: bed.facilityId,
                                        wardId: bed.wardId,
                                        bedId: bed.id,
                                        bedNumber: bed.bedNumber,
                                        wardName: bed.wardName,
                                        bedType: bed.bedType,
                                        pricePerDay: bed.pricePerDay
                                      }
                                    } 
                                  })}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  <Bed size={16} className="mr-2" />
                                  <span>Login to Book</span>
                                </Button>
                              ) : (
                                <PatientProtectedButton 
                                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
                                  path="/appointment"
                                >
                                  <Bed size={16} className="mr-2" />
                                  <span>Book Now</span>
                                </PatientProtectedButton>
                              )}
                            </div>
                          </div>
                        </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {allBeds.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bed size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">No beds found in this facility</p>
          </div>
        )}
      </div>
    );
  }

  // Main Facilities View with Search and Filters
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Find Bed</h1>
        
        {!user && (
          <Button 
            onClick={() => navigate('/login/patient')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login to Book
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
  {/* Search Row with Button */}
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="text"
        placeholder="Search by hospital name, city, address, or facility type..."
        value={filters.searchText}
        onChange={(e) => handleFilterChange('searchText', e.target.value)}
        className="pl-10 w-full"
      />
    </div>
    
    <Button 
      onClick={() => applyFilters()} 
      className="bg-blue-600 hover:bg-blue-700 text-white px-8"
    >
      <Search size={16} className="mr-2" />
      Search
    </Button>
    
    
  </div>

  {/* Single Column Filter Grid */}
  <div className="grid grid-cols-3 gap-4 pt-4 ">
    {/* City Filter */}
    {/* <div className="w-full max-w-md">
      <Label className="text-sm font-semibold">City</Label>
      <Select 
        value={filters.city || "all"} 
        onValueChange={(value) => handleFilterChange('city', value === "all" ? "" : value)}
      >
        <SelectTrigger className="mt-2 w-full">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent className="p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandItem onSelect={() => handleFilterChange('city', "")}>
                All Cities
              </CommandItem>
             {indianCities.map((city) => (
  <CommandItem
    key={city}
    value={city}
    onSelect={() => handleFilterChange('city', city)} // Changed from setLocationFilter
  >
    {city}
  </CommandItem>
))}
            </CommandList>
          </Command>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Showing available cities
      </p>
    </div> */}
    {/* Single Column Filter Grid */}

  {/* City Filter */}
  <div className="w-full max-w-md">
    <Label className="text-sm font-semibold">City</Label>
    <Select 
      value={filters.city || "all"} 
      onValueChange={(value) => handleFilterChange('city', value === "all" ? "" : value)}
    >
      <SelectTrigger className="mt-2 w-full">
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Cities</SelectItem>
        {indianCities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <p className="text-xs text-muted-foreground mt-1">
      Showing Indian cities
    </p>
  </div>

  {/* Department/Ward Type Filter */}
  <div className="w-full max-w-md">
    <Label className="text-sm font-semibold">Find Beds</Label>
    <Select 
      value={filters.department || "all"} 
      onValueChange={(value) => handleFilterChange('department', value === "all" ? "" : value)}
    >
      <SelectTrigger className="mt-2 w-full">
        <SelectValue placeholder="Select department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Beds</SelectItem>
        
        {/* Common Departments */}
        {commonDepartments.map((dept) => (
          <SelectItem key={dept} value={dept}>
            {dept}
          </SelectItem>
        ))}

        {/* Dynamic Departments from facilities */}
        {availableDepartments
          .filter(dept => !commonDepartments.includes(dept))
          .map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
    <p className="text-xs text-muted-foreground mt-1">
      Select a department or ward type
    </p>
  </div>


    {/* Facility Type Filter */}
    {/* <div className="w-full max-w-md">
      <Label className="text-sm font-semibold">Facility Type</Label>
      <Select
        value={filters.facilityType || "all"}
        onValueChange={(value) => handleFilterChange('facilityType', value === "all" ? "" : value)}
      >
        <SelectTrigger className="mt-2 w-full">
          <SelectValue placeholder="Select facility type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {availableFacilityTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div> */}

    {/* Department/Ward Type Filter */}
    {/* <div className="w-full max-w-md">
      <Label className="text-sm font-semibold">Find Bed</Label>
      <Select 
        value={filters.department || "all"} 
        onValueChange={(value) => handleFilterChange('department', value === "all" ? "" : value)}
      >
        <SelectTrigger className="mt-2 w-full">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        {/* <SelectContent className="p-0">
          <Command>
            <CommandInput placeholder="Search department..." />
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandItem onSelect={() => handleFilterChange('department', "")}>
                All Departments
              </CommandItem>
              
              {commonDepartments.map((dept) => (
                <CommandItem
                  key={dept}
                  value={dept}
                  onSelect={() => handleFilterChange('department', dept)}
                >
                  {dept}
                </CommandItem>
              ))}

              {availableDepartments
                .filter(dept => !commonDepartments.includes(dept))
                .map((dept) => (
                  <CommandItem
                    key={dept}
                    value={dept}
                    onSelect={() => handleFilterChange('department', dept)}
                  >
                    {dept}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </SelectContent>
        <SelectContent className="p-0 z-50 max-h-72 overflow-hidden">
  <Command className="w-full">
    
    {/* 🔍 Search 
    <CommandInput 
      placeholder="Search department..." 
      className="h-9"
    />

    <CommandList className="max-h-60 overflow-y-auto">
      <CommandEmpty>No department found.</CommandEmpty>

      
      <CommandItem
        value="all"
        onSelect={() => handleFilterChange('department', "")}
      >
        All Departments
      </CommandItem>

      
      {commonDepartments.map((dept) => (
        <CommandItem
          key={dept}
          value={dept}
          onSelect={() => handleFilterChange('department', dept)}
        >
          {dept}
        </CommandItem>
      ))}

      
      {availableDepartments
        .filter(dept => !commonDepartments.includes(dept))
        .map((dept) => (
          <CommandItem
            key={dept}
            value={dept}
            onSelect={() => handleFilterChange('department', dept)}
          >
            {dept}
          </CommandItem>
        ))}
    </CommandList>

  </Command>
</SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Select a department or ward type
      </p>
    </div> */}

    {/* Bed Facilities Filters */}
   

    {/* Apply Filters Button */}
    
  </div>
</div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Found {filteredFacilities.length} facilities matching your criteria
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {filteredFacilities.map((facility) => {
          const FacilityTypeIcon = facilityTypeIcons[facility.facility_type] || Building2;
           */}
            {filteredFacilities
    .filter(facility => facility.available_beds && facility.available_beds > 0)
    .map((facility) => {
      const FacilityTypeIcon = facilityTypeIcons[facility.facility_type] || Building2;
          return (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-2">
                  <FacilityTypeIcon size={24} className="text-blue-600 mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {facility.facility_name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {facility.facility_type}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  {facility.is_verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                  
                  {facility.rating !== null && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-medium">
                        {facility.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({facility.total_reviews || 0})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-start gap-1 text-gray-600">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <p className="text-sm">
                    {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Total Beds</span>
                  <p className="font-medium">{facility.total_beds}</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Available Beds</span>
                  <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
                </div>
              </div>
<div className="grid grid-cols-2 gap-3">
              {/* Available Departments/Wards */}
              {facility.unique_ward_types && facility.unique_ward_types.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Departments/Wards:</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.unique_ward_types.slice(0, 3).map((type, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                    {facility.unique_ward_types.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{facility.unique_ward_types.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
                {facility.city && (
                  <div>
                    <span className="text-xs text-gray-500">City:</span>
                    <p className="font-medium text-xs truncate">
                      {facility.city}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {facility.established_year && (
                  <div>
                    <span className="text-xs text-gray-500">Established:</span>
                    <p className="font-medium text-sm">{facility.established_year}</p>
                  </div>
                )}
                {facility.license_number && (
                  <div>
                    <span className="text-xs text-gray-500">License:</span>
                    <p className="font-medium text-xs truncate">
                      {facility.license_number}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                {facility.website && (
                  <a
                    href={facility.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Website →
                  </a>
                )}
                
                <div className="flex gap-2 ml-auto">
                  <div className="relative group">
                    <button
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        facility.available_beds && facility.available_beds > 0
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => facility.available_beds && facility.available_beds > 0 && handleViewWards(facility)}
                      disabled={!facility.available_beds || facility.available_beds === 0}
                    >
                      {facility.available_beds && facility.available_beds > 0 
                        ? `View Beds (${facility.available_beds} Available)` 
                        : 'No Beds Available'}
                    </button>
                    
                    {(!facility.available_beds || facility.available_beds === 0) && (
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        No beds currently available in this facility
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No facilities found matching your criteria.</p>
          <Button
            variant="link"
            onClick={clearFilters}
            className="mt-2 text-blue-600"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientFacilities;