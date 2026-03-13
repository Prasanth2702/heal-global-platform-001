// // import DashboardLayout from "@/components/layouts/DashboardLayout";
// // import { toast } from "@/hooks/use-toast";
// // import { supabase } from "@/integrations/supabase/client";
// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // interface Facility {
// //   id: string;
// //   admin_user_id: string;
// //   facility_name: string;
// //   facility_type: string;
// //   license_number: string;
// //   address: Record<string, any>;
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
// // }

// // const PatientFacilities: React.FC = () => {
// //   const [facilities, setFacilities] = useState<Facility[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const navigate = useNavigate();
// //    const [user, setUser] = useState<any>(null);

// //  useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const { data: { session }, error } = await supabase.auth.getSession();
        
// //         if (error) throw error;
        
// //         if (!session) {
// //           // Show toast notification
// //           toast({
// //             title: "Authentication Required",
// //             description: "Please log in to access the dashboard",
// //             variant: "destructive",
// //           });
          
// //           // Redirect to home page
// //           navigate("/homelogin", { replace: true });
// //           return;
// //         }
        
// //         setUser(session.user);
// //       } catch (error) {
// //         console.error("Auth check error:", error);
// //         toast({
// //           title: "Error",
// //           description: "An error occurred. Please try again.",
// //           variant: "destructive",
// //         });
// //         navigate("/homelogin", { replace: true });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     checkAuth();

// //     // Set up auth state listener
// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       if (!session) {
// //         toast({
// //           title: "Session Expired",
// //           description: "Please log in again",
// //           variant: "destructive",
// //         });
// //         navigate("/homelogin", { replace: true });
// //       } else {
// //         setUser(session.user);
// //       }
// //     });

// //     return () => subscription.unsubscribe();
// //   }, [navigate, toast]);

// //   useEffect(() => {
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
// //     } catch (err: any) {
// //       setError(err.message || "Failed to fetch facilities");
// //       console.error("Error fetching facilities:", err);
// //     } finally {
// //       setLoading(false);
// //     }
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
// //       <div className="container mx-auto px-4 py-8">
// //         <h1 className="text-3xl font-bold mb-6">Find Bed Booking</h1>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {facilities.map((facility) => (
// //             <div
// //               key={facility.id}
// //               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
// //             >
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h2 className="text-xl font-semibold text-gray-800">
// //                     {facility.facility_name}
// //                   </h2>
// //                   <p className="text-sm text-gray-600 mt-1">
// //                     {facility.facility_type} • {facility.city}, {facility.state}
// //                   </p>
// //                 </div>
// //                 {facility.is_verified && (
// //                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
// //                     Verified
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Rating */}
// //               <div className="flex items-center mb-3">
// //                 {facility.rating !== null && (
// //                   <>
// //                     <span className="text-yellow-500">★</span>
// //                     <span className="ml-1 font-medium">
// //                       {facility.rating.toFixed(1)}
// //                     </span>
// //                     <span className="text-gray-500 text-sm ml-1">
// //                       ({facility.total_reviews || 0} reviews)
// //                     </span>
// //                   </>
// //                 )}
// //               </div>

// //               {/* Address */}
// //               <div className="mb-4">
// //                 <h3 className="text-sm font-medium text-gray-700 mb-1">
// //                   Address:
// //                 </h3>
// //                 <p className="text-gray-600">
// //                   {typeof facility.address === "object"
// //                     ? `${facility.address.street || ""}, ${facility.city}, ${
// //                         facility.state
// //                       } - ${facility.pincode}`
// //                     : "Address not available"}
// //                 </p>
// //               </div>

// //               {/* Facility Details */}
// //               <div className="grid grid-cols-2 gap-3 mb-4">
// //                 <div>
// //                   <span className="text-sm text-gray-500">Total Beds:</span>
// //                   <p className="font-medium">{facility.total_beds}</p>
// //                 </div>
// //                 {facility.established_year && (
// //                   <div>
// //                     <span className="text-sm text-gray-500">Established:</span>
// //                     <p className="font-medium">{facility.established_year}</p>
// //                   </div>
// //                 )}
// //                 {facility.license_number && (
// //                   <div>
// //                     <span className="text-sm text-gray-500">License:</span>
// //                     <p className="font-medium text-sm">
// //                       {facility.license_number}
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Additional Services */}
// //               {facility.additional_services &&
// //                 Object.keys(facility.additional_services).length > 0 && (
// //                   <div className="mb-4">
// //                     <h3 className="text-sm font-medium text-gray-700 mb-1">
// //                       Services:
// //                     </h3>
// //                     <div className="flex flex-wrap gap-2">
// //                       {Object.keys(facility.additional_services).map(
// //                         (service) => (
// //                           <span
// //                             key={service}
// //                             className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
// //                           >
// //                             {service}
// //                           </span>
// //                         )
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}

// //               {/* Website & Contact */}
// //               <div className="flex justify-between items-center pt-4 border-t">
// //                 {facility.website && (
// //                   <a
// //                     href={facility.website}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="text-blue-600 hover:text-blue-800 text-sm"
// //                   >
// //                     Visit Website →
// //                   </a>
// //                 )}
// //                 <button
// //                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// //                   onClick={() =>
// //                     navigate(`/dashboard/patient/booking/${facility.id}`)
// //                   }
// //                 >
// //                   View Details
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {facilities.length === 0 && (
// //           <div className="text-center py-12">
// //             <p className="text-gray-500 text-lg">No facilities found.</p>
// //           </div>
// //         )}
// //       </div>
// //   );
// // };

// // export default PatientFacilities;

// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { toast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button"; // Add this import

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
// }
// interface PatientFacilitiesProps {
//   view: "all" | "beds";
// }

// const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const [user, setUser] = useState<any>(null);
//   const createSlug = (text: string) => {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// };
// const [wards, setWards] = useState<any[]>([]);
//   const [beds, setBeds] = useState<any[]>([]);
//   const [bookings, setBookings] = useState<any[]>([]);
  
 
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

//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setUser(session.user);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

    
//     useEffect(() => {
//     fetchFacilities();
//   }, []);

//   const fetchFacilities = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("*");
        

//       if (facilityError) {
//         throw facilityError;
//       }

//       if (facilityData) {
//         setFacilities(facilityData);
//       }

//       // Fetch all available beds
//     const { data: bedsData } = await supabase
//       .from("beds")
//       .select("facility_id")
//       .eq("current_status", "AVAILABLE")
//       .eq("is_active", true);

//     // Count available beds per facility
//     const bedCountByFacility = (bedsData || []).reduce((acc: Record<string, number>, bed) => {
//       acc[bed.facility_id] = (acc[bed.facility_id] || 0) + 1;
//       return acc;
//     }, {});

//     setBeds(bedsData || []);
    
//     // Update facilities with available bed counts
//     setFacilities(prevFacilities => 
//       prevFacilities.map(facility => ({
//         ...facility,
//         available_beds: bedCountByFacility[facility.id] || 0
//       }))
//     );
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch facilities");
//       console.error("Error fetching facilities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (facilityId: string, facilityName: string) => {
//      navigate(`/login/patient`, { 
//         state: { from: `/dashboard/patient/booking/${createSlug(facilityName)}/${facilityId}` } 
//       });
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

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Find Bed Booking</h1>
        
//         {/* Conditional Login Button */}
//         {!user && (
//           <Button 
//             onClick={() => facilities.map((facility) => handleLogin(facility.id, facility.facility_name))}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Login to Book
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {facilities.map((facility) => (
//           <div
//             key={facility.id}
//             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//           >
//             {/* <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {facility.facility_name}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {facility.facility_type}
//                 </p>
//               </div>
//               <div>
//               {facility.is_verified && (
//                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                   Verified
//                 </span>
//               )}
              
//               {facility.rating !== null && (
//                 <>
//                   <span className="text-yellow-500">★</span>
//                   <span className="ml-1 font-medium">
//                     {facility.rating.toFixed(1)}
//                   </span>
//                   <span className="text-gray-500 text-sm ml-1">
//                     ({facility.total_reviews || 0} reviews)
//                   </span>
//                 </>
//               )}
//               </div>
//             </div> */}
// <div className="flex justify-between items-start mb-4">
//   <div>
//     <h2 className="text-xl font-semibold text-gray-800">
//       {facility.facility_name}
//     </h2>
//     <p className="text-sm text-gray-600 mt-1">
//       {facility.facility_type}
//     </p>
//   </div>
  
//   {/* Top Section - Verified Badge and Rating */}
//   <div className="flex flex-col items-end gap-1">
//     {facility.is_verified && (
//       <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//         Verified
//       </span>
//     )}
    
//     {facility.rating !== null && (
//       <div className="flex items-center">
//         <span className="text-yellow-500">★</span>
//         <span className="ml-1 font-medium">
//           {facility.rating.toFixed(1)}
//         </span>
//         <span className="text-gray-500 text-sm ml-1">
//           ({facility.total_reviews || 0} reviews)
//         </span>
//       </div>
//     )}
//   </div>
// </div>


//             {/* Address */}
//             <div className="mb-4">
//               <h3 className="text-sm font-medium text-gray-700 mb-1">
//                 Address:
//               </h3>
//               <p className="text-gray-600">
//       {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
//               </p>
//             </div>

//             {/* Facility Details */}
//             <div className="grid grid-cols-3 gap-3 mb-4">
//               <div>
//                 <span className="text-sm text-gray-500">Total Beds:</span>
//                  <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
//               </div>
//               {facility.established_year && (
//                 <div>
//                   <span className="text-sm text-gray-500">Established:</span>
//                   <p className="font-medium">{facility.established_year}</p>
//                 </div>
//               )}
//               {facility.license_number && (
//                 <div>
//                   <span className="text-sm text-gray-500">License:</span>
//                   <p className="font-medium text-sm">
//                     {facility.license_number}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Additional Services */}
//             {/* {facility.additional_services &&
//               Object.keys(facility.additional_services).length > 0 && (
//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-1">
//                     Services:
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {Object.keys(facility.additional_services).map(
//                       (service) => (
//                         <span
//                           key={service}
//                           className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                         >
//                           {service}
//                         </span>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )} */}

//             {/* Website & Contact */}
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
//               {/* <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 onClick={() => {
//                   if (user) {
//                     navigate(`/dashboard/patient/booking/${facility.id}`);
//                   } else {
//                     toast({
//                       title: "Login Required",
//                       description: "Please login to view facility details and book beds",
//                       variant: "destructive",
//                     });
//                     navigate(`/login/patient/${facility.id}`, { state: { from: `/dashboard/patient/booking/${facility.id}` } });
//                   }
//                 }}
//               >
//                 View Details
//               </button> */}
//               <button
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
// </button>
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

// export default PatientFacilities;

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bed, Home, MapPin, ChevronRight, Activity, Wind, Shield, Users, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

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


interface PatientFacilitiesProps {
  view: "all" | "beds";
}

const PatientFacilities: React.FC<PatientFacilitiesProps> = ({ view }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
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

  useEffect(() => {
    fetchFacilities();
  }, []);

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

      // Calculate available beds per facility
      const facilitiesWithDetails = facilityData.map(facility => {
        const facilityWards = wardsByFacility[facility.id] || [];
        const totalAvailableBeds = facilityWards.reduce((sum, ward) => sum + (ward.available_beds || 0), 0);
        const totalBeds = facilityWards.reduce((sum, ward) => sum + (ward.total_beds || 0), 0);
        
        return {
          ...facility,
          wards: facilityWards,
          available_beds: totalAvailableBeds,
          total_beds: totalBeds || facility.total_beds
        };
      });

      setFacilities(facilitiesWithDetails);
    } catch (err: any) {
      setError(err.message || "Failed to fetch facilities");
      console.error("Error fetching facilities:", err);
    } finally {
      setLoading(false);
    }
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
  
  const getAvailabilityColor = (availability: string) => {
    return availability?.toLowerCase() === 'available' ? 'text-green-600' : 'text-red-600';
  };
  
  const checkIfPatient = async (userId: string) => {
    try {
      // Check if user exists in patients table
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle(); 
      
      return !!data; // Returns true if patient exists
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
      // Check if user is a patient for booking-related paths
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
    const navigate = useNavigate();
  
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
          onClick(); // Patient can proceed
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

  // Ward Details View
//   if (showWardDetails && selectedFacility) {
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
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Total Beds</p>
//               <p className="text-2xl font-bold">{selectedFacility.total_beds}</p>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Available Beds</p>
//               <p className="text-2xl font-bold text-green-600">{selectedFacility.available_beds || 0}</p>
//             </div>
//             {/* <div className="bg-purple-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Total Wards</p>
//               <p className="text-2xl font-bold">{selectedFacility.wards?.length || 0}</p>
//             </div> */}
//           </div>
//         </div>

//         <h3 className="text-xl font-semibold mb-4">Beds in this Facility</h3>
//         {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">City</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Hospital</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Department/Ward</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Bed Details</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Ward Details</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Room Number</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {allBeds.length > 0 ? (
//                   allBeds.map((bed) => {
//                     const statusBadge = getStatusBadge(bed.status);
//                     const StatusIcon = statusBadge.icon;
                    
//                     return (
//                       <tr key={bed.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <MapPin size={16} className="text-gray-400 mr-2" />
//                             <span className="text-sm text-gray-900">{bed.city || 'N/A'}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{bed.facilityName}</div>
//                           <div className="text-sm text-gray-500">{bed.facilityType}</div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{bed.wardName || 'General Ward'}</div>
//                             <div className="text-xs text-gray-500">
//                               {bed.wardType} • Code: {bed.wardCode}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div>
//                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                               {bed.bedType}
//                             </span>
//                             <div className="text-xs text-gray-500 mt-1">
//                               Bed: {bed.bedNumber}
//                               {bed.hasVentilator && ' • Ventilator'}
//                               {bed.hasOxygen && ' • O2'}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div>
//                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                               Floor {bed.floorNumber}
//                             </span>
//                             <div className="text-xs text-gray-500 mt-1">
//                               Wing: {bed.wing || 'Main'}
//                               {bed.isIsolation && ' • Isolation'}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{bed.roomNumber || 'N/A'}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class} items-center gap-1`}>
//                             <StatusIcon size={12} />
//                             {bed.status}
//                           </span>
//                           <div className={`text-xs mt-1 ${getAvailabilityColor(bed.availability)}`}>
//                             {bed.availability}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <PatientProtectedButton 
//                             className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
//                             path="/appointment"
//                           >
//                             <Bed size={16} className="mr-2" />
//                             <span>View Bed</span>
//                           </PatientProtectedButton>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
//                       No beds found in this facility
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div> */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//   {allBeds.length > 0 ? (
//     allBeds.map((bed) => {
//       const statusBadge = getStatusBadge(bed.status);
//       const StatusIcon = statusBadge.icon;
      
//       return (
//         <div key={bed.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//           {/* Header with City and Hospital */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <MapPin size={16} className="text-blue-600" />
//                 <span className="text-sm font-medium text-gray-700">{bed.city || 'N/A'}</span>
//               </div>
//               {bed.facilityType && (
//                 <span className="text-xs bg-white px-2 py-1 rounded-full text-blue-600 font-medium">
//                   {bed.facilityType}
//                 </span>
//               )}
//             </div>
//             <h3 className="text-lg font-bold text-gray-800 mt-1">{bed.facilityName}</h3>
//           </div>

//           {/* Ward Information */}
//           <div className="px-4 py-3 border-b bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-600">Ward</p>
//                 <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-600">Ward Code</p>
//                 <p className="font-mono text-sm font-medium text-gray-700">{bed.wardCode}</p>
//               </div>
//             </div>
//             <div className="mt-1 text-xs text-gray-500">
//               {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
//             </div>
//           </div>

//           {/* Bed Details */}
//           <div className="px-4 py-3">
//             <div className="flex justify-between items-start mb-3">
//               <div>
//                 <span className="text-sm text-gray-600">Bed</span>
//                 <p className="text-xl font-bold text-gray-900">{bed.bedNumber}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
//                 <StatusIcon size={12} />
//                 {bed.status}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <p className="text-xs text-gray-500">Bed Type</p>
//                 <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                   {bed.bedType}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Room</p>
//                 <p className="text-sm font-medium">{bed.roomNumber || 'N/A'}</p>
//               </div>
//             </div>

//             {/* Features */}
//             <div className="flex flex-wrap gap-2 mb-3">
//               {bed.hasOxygen && (
//                 <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                   <Wind size={12} className="mr-1" />
//                   Oxygen
//                 </span>
//               )}
//               {bed.hasVentilator && (
//                 <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
//                   <Activity size={12} className="mr-1" />
//                   Ventilator
//                 </span>
//               )}
//               {bed.isIsolation && (
//                 <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
//                   <Shield size={12} className="mr-1" />
//                   Isolation
//                 </span>
//               )}
//             </div>

//             {/* Price and Availability */}
//             <div className="flex justify-between items-center pt-2 border-t">
//               <div>
//                 <p className={`text-xs ${getAvailabilityColor(bed.availability)}`}>
//                   {bed.availability}
//                 </p>
//               </div>
              
//               {/* Action Button */}
//               <PatientProtectedButton 
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
//                 path="/appointment"
//               >
//                 <Bed size={16} className="mr-2" />
//                 <span>Book Now</span>
//               </PatientProtectedButton>
//             </div>
//           </div>
//         </div>
//       );
//     })
//   ) : (
//     <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
//       <Bed size={48} className="mx-auto text-gray-400 mb-3" />
//       <p className="text-gray-500 text-lg">No beds found in this facility</p>
//     </div>
//   )}
// </div>
//       </div>
//     );
//   }

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
        pricePerDay: bed.price_per_day
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBeds.map((bed) => {
                const statusBadge = getStatusBadge(bed.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <div key={bed.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-200 relative">
                    {/* Available Badge */}
                    {/* <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        AVAILABLE NOW
                      </span>
                    </div> */}

                    {/* Header with City and Hospital */}
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

                    {/* Ward Information */}
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Ward</p>
                          <p className="font-semibold text-gray-800">{bed.wardName || 'General Ward'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Ward Code</p>
                          <p className="font-mono text-sm font-medium text-gray-700">{bed.wardCode}</p>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
                      </div>
                    </div>

                    {/* Bed Details */}
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

                      {/* Features */}
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

                      {/* Price and Action */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div>
                         {bed.pricePerDay && bed.pricePerDay > 0 ? (
  <p className="text-sm font-semibold text-green-600">${bed.pricePerDay}/day</p>
) : (
  <p className="text-sm font-semibold text-blue-600">Contact for Facilities</p>
)}
                            {/* <div className="absolute top-2 right-2">  */}
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        AVAILABLE NOW
                      </span>
                      {/* </div> 
                          <p className="text-xs text-green-600 flex items-center">
                            <CheckCircle size={10} className="mr-1" />
                            Ready to book
                          </p> */}
                        </div>
                        
                        {/* Action Button */}
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
                            <>
                        <PatientProtectedButton 
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => handleNavigation(`/dashboard/patient/bookregister/${createSlug(bed.facilityName)}/${bed.facilityId}/${bed.wardId}/${bed.id}`, true)}
                          path="/appointment"
                        >
                          <Bed size={16} className="mr-2" />
                          <span>Book Now</span>
                        </PatientProtectedButton>
                        </>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Beds Section */}
        {/* {unavailableBeds.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Other Beds ({unavailableBeds.length})</h3>
              <span className="ml-2 text-sm text-gray-500">Currently not available</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unavailableBeds.map((bed) => {
                const statusBadge = getStatusBadge(bed.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <div key={bed.id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75 hover:shadow-lg transition-shadow">
                    {/* Header with City and Hospital 
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">{bed.city || 'N/A'}</span>
                        </div>
                        {bed.facilityType && (
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                            {bed.facilityType}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mt-1">{bed.facilityName}</h3>
                    </div>

                    {/* Ward Information 
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Ward</p>
                          <p className="font-semibold text-gray-700">{bed.wardName || 'General Ward'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Ward Code</p>
                          <p className="font-mono text-sm font-medium text-gray-600">{bed.wardCode}</p>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {bed.wardType} • Floor {bed.floorNumber} • Wing: {bed.wing || 'Main'}
                      </div>
                    </div>

                    {/* Bed Details 
                    <div className="px-4 py-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-sm text-gray-500">Bed</span>
                          <p className="text-xl font-bold text-gray-700">{bed.bedNumber}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                          <StatusIcon size={12} />
                          {bed.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Bed Type</p>
                          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {bed.bedType}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Room</p>
                          <p className="text-sm font-medium text-gray-600">{bed.roomNumber || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Features - Grayed out 
                      <div className="flex flex-wrap gap-2 mb-3">
                        {bed.hasOxygen && (
                          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            <Wind size={12} className="mr-1" />
                            Oxygen
                          </span>
                        )}
                        {bed.hasVentilator && (
                          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            <Activity size={12} className="mr-1" />
                            Ventilator
                          </span>
                        )}
                        {bed.isIsolation && (
                          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            <Shield size={12} className="mr-1" />
                            Isolation
                          </span>
                        )}
                      </div>

                      {/* Status Message 
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div>
                          {bed.pricePerDay && (
                            <p className="text-sm text-gray-400">${bed.pricePerDay}/day</p>
                          )}
                          <p className="text-xs text-red-500 flex items-center">
                            <XCircle size={10} className="mr-1" />
                            Currently unavailable
                          </p>
                        </div>
                        
                        {/* Disabled Button 
                        <button
                          disabled
                          className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                        >
                          <Bed size={16} className="mr-2" />
                          <span>Not Available</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}

        {allBeds.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bed size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">No beds found in this facility</p>
          </div>
        )}
      </div>
    );
  }
  // Main Facilities View
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Find Bed Booking</h1>
        
        {/* Conditional Login Button */}
        {!user && (
          <Button 
            onClick={() => navigate('/login/patient')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login to Book
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {facility.facility_name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {facility.facility_type}
                </p>
              </div>
              
              {/* Top Section - Verified Badge and Rating */}
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
                      ({facility.total_reviews || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Address:
              </h3>
              <p className="text-gray-600">
                {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded">
                <span className="text-xs text-gray-500">Total Beds</span>
                <p className="font-medium">{facility.total_beds}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <span className="text-xs text-gray-500">Available Beds</span>
                <p className="font-medium text-green-600">{facility.available_beds || 0}</p>
              </div>
              {/* Total Wards */}
              {/* <div className="bg-blue-100 p-2 rounded">
                <span className="text-xs text-gray-500">Total Wards:</span>
                <p className="font-medium">{facility.wards?.length || 0}</p>
              </div> */}
            </div>

            {/* Facility Details */}
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

            {/* Website & Actions */}
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
              
              <div className="flex gap-2">
                          {/* <button
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
  onClick={() => {
    if (user) {
      navigate(`/dashboard/patient/booking/${facility.id}`);
    } else {
      toast({
        title: "Login Required",
        description: "Please login to view facility details and book beds",
        variant: "destructive",
      });
      // Fixed: Remove facility ID from login path
      navigate(`/login/patient`, { 
        state: { from: `/dashboard/patient/booking/${createSlug(facility.facility_name)}/${facility.id}` } 
      });
    }
  }}
>
  View Details
 </button>  */}
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
  
  {/* Optional tooltip for disabled state */}
  {(!facility.available_beds || facility.available_beds === 0) && (
    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
      No beds currently available in this facility
    </div>
  )}
</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {facilities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No facilities found.</p>
        </div>
      )}
    </div>
  );
};

export default PatientFacilities;