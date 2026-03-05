// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { toast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface Facility {
//   id: string;
//   admin_user_id: string;
//   facility_name: string;
//   facility_type: string;
//   license_number: string;
//   address: Record<string, any>;
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
// }

// const PatientFacilities: React.FC = () => {
//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//    const [user, setUser] = useState<any>(null);

//  useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) throw error;
        
//         if (!session) {
//           // Show toast notification
//           toast({
//             title: "Authentication Required",
//             description: "Please log in to access the dashboard",
//             variant: "destructive",
//           });
          
//           // Redirect to home page
//           navigate("/homelogin", { replace: true });
//           return;
//         }
        
//         setUser(session.user);
//       } catch (error) {
//         console.error("Auth check error:", error);
//         toast({
//           title: "Error",
//           description: "An error occurred. Please try again.",
//           variant: "destructive",
//         });
//         navigate("/homelogin", { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();

//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) {
//         toast({
//           title: "Session Expired",
//           description: "Please log in again",
//           variant: "destructive",
//         });
//         navigate("/homelogin", { replace: true });
//       } else {
//         setUser(session.user);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [navigate, toast]);

//   useEffect(() => {
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
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch facilities");
//       console.error("Error fetching facilities:", err);
//     } finally {
//       setLoading(false);
//     }
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
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">Find Bed Booking</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {facilities.map((facility) => (
//             <div
//               key={facility.id}
//               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {facility.facility_name}
//                   </h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {facility.facility_type} • {facility.city}, {facility.state}
//                   </p>
//                 </div>
//                 {facility.is_verified && (
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                     Verified
//                   </span>
//                 )}
//               </div>

//               {/* Rating */}
//               <div className="flex items-center mb-3">
//                 {facility.rating !== null && (
//                   <>
//                     <span className="text-yellow-500">★</span>
//                     <span className="ml-1 font-medium">
//                       {facility.rating.toFixed(1)}
//                     </span>
//                     <span className="text-gray-500 text-sm ml-1">
//                       ({facility.total_reviews || 0} reviews)
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Address */}
//               <div className="mb-4">
//                 <h3 className="text-sm font-medium text-gray-700 mb-1">
//                   Address:
//                 </h3>
//                 <p className="text-gray-600">
//                   {typeof facility.address === "object"
//                     ? `${facility.address.street || ""}, ${facility.city}, ${
//                         facility.state
//                       } - ${facility.pincode}`
//                     : "Address not available"}
//                 </p>
//               </div>

//               {/* Facility Details */}
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div>
//                   <span className="text-sm text-gray-500">Total Beds:</span>
//                   <p className="font-medium">{facility.total_beds}</p>
//                 </div>
//                 {facility.established_year && (
//                   <div>
//                     <span className="text-sm text-gray-500">Established:</span>
//                     <p className="font-medium">{facility.established_year}</p>
//                   </div>
//                 )}
//                 {facility.license_number && (
//                   <div>
//                     <span className="text-sm text-gray-500">License:</span>
//                     <p className="font-medium text-sm">
//                       {facility.license_number}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Additional Services */}
//               {facility.additional_services &&
//                 Object.keys(facility.additional_services).length > 0 && (
//                   <div className="mb-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-1">
//                       Services:
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {Object.keys(facility.additional_services).map(
//                         (service) => (
//                           <span
//                             key={service}
//                             className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                           >
//                             {service}
//                           </span>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}

//               {/* Website & Contact */}
//               <div className="flex justify-between items-center pt-4 border-t">
//                 {facility.website && (
//                   <a
//                     href={facility.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     Visit Website →
//                   </a>
//                 )}
//                 <button
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   onClick={() =>
//                     navigate(`/dashboard/patient/booking/${facility.id}`)
//                   }
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {facilities.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No facilities found.</p>
//           </div>
//         )}
//       </div>
//   );
// };

// export default PatientFacilities;

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Add this import

interface Facility {
  id: string;
  admin_user_id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: Record<string, any>;
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
}

const PatientFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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

    // Set up auth state listener
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

      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*");

      if (facilityError) {
        throw facilityError;
      }

      if (facilityData) {
        setFacilities(facilityData);
      }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Find Bed Booking</h1>
        
        {/* Conditional Login Button */}
        {!user && (
          <Button 
            onClick={() => facilities.map((facility) => handleLogin(facility.id, facility.facility_name))}
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
                  {facility.facility_type} • {facility.city}, {facility.state}
                </p>
              </div>
              {facility.is_verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center mb-3">
              {facility.rating !== null && (
                <>
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-medium">
                    {facility.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({facility.total_reviews || 0} reviews)
                  </span>
                </>
              )}
            </div>

            {/* Address */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Address:
              </h3>
              <p className="text-gray-600">
                {typeof facility.address === "object"
                  ? `${facility.address.street || ""}, ${facility.city}, ${
                      facility.state
                    } - ${facility.pincode}`
                  : "Address not available"}
              </p>
            </div>

            {/* Facility Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <span className="text-sm text-gray-500">Total Beds:</span>
                <p className="font-medium">{facility.total_beds}</p>
              </div>
              {facility.established_year && (
                <div>
                  <span className="text-sm text-gray-500">Established:</span>
                  <p className="font-medium">{facility.established_year}</p>
                </div>
              )}
              {facility.license_number && (
                <div>
                  <span className="text-sm text-gray-500">License:</span>
                  <p className="font-medium text-sm">
                    {facility.license_number}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Services */}
            {facility.additional_services &&
              Object.keys(facility.additional_services).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Services:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(facility.additional_services).map(
                      (service) => (
                        <span
                          key={service}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Website & Contact */}
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
                    navigate(`/login/patient/${facility.id}`, { state: { from: `/dashboard/patient/booking/${facility.id}` } });
                  }
                }}
              >
                View Details
              </button> */}
              <button
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
</button>
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