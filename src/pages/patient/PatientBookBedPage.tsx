// // pages/patient/PatientBookBedPage.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import BedBookingView from "@/components/bedbooking/BedBookingView";
// import { Loader2, ArrowLeft, Shield, Calendar } from "lucide-react";
// import DashboardLayout from "@/components/layouts/DashboardLayout";

// // Define types
// interface Facility {
//   id: string;
//   facility_name: string;
//   city: string;
//   state: string;
//   phone?: string;
//   address?: string;
//   email?: string;
// }

// interface Profile {
//   id?: string;
//   user_id: string;
//   role: string;
//   full_name?: string;
// }

// interface Booking {
//   id: string;
//   bed_id: string;
//   patient_id: string;
//   facility_id: string;
//   admission_date: string;
//   expected_discharge_date: string;
//   booking_reason: string;
//   status: string;
//   created_at: string;
// }

// const PatientBookBedPage = () => {
//   // UseParams returns a generic Record<string, string | undefined>
//   const params = useParams();
//   const facilityId = params.facilityId || "";

//   const navigate = useNavigate();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [patientId, setPatientId] = useState<string>("");
//   const [facility, setFacility] = useState<Facility | null>(null);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     checkAuthAndLoadData();
//   }, [facilityId]);

//   const checkAuthAndLoadData = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       setError("");

//       // Check if user is authenticated
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         navigate("/login/patient", {
//           state: { returnTo: `/dashboard/patient/book` },
//         });
//         return;
//       }

//       // Check if user has patient role
//       const { data: profile, error: profileError } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("user_id", user.id)
//         .single();

//       if (profileError) {
//         console.error("Profile error:", profileError);
//         setError("Error loading user profile. Please try again.");
//         return;
//       }

//       if (!profile || profile.role !== "patient") {
//         setError(
//           "Only patients can book beds. Please login with a patient account."
//         );
//         return;
//       }

//       setPatientId(user.id);

//       // Load facility details
//       if (!facilityId) {
//         setError("No facility ID provided");
//         return;
//       }

//       const { data: facilityData, error: facilityError } = await supabase
//         .from("facilities")
//         .select("*")
//         .eq("id", facilityId)
//         .single();

//       if (facilityError) {
//         console.error("Facility error:", facilityError);
//         if (facilityError.code === "PGRST116") {
//           setError(
//             `Facility not found. Please check the facility ID: ${facilityId}`
//           );
//         } else {
//           setError("Error loading facility information. Please try again.");
//         }
//         return;
//       }

//       if (facilityData) {
//         setFacility(facilityData);
//       } else {
//         setError("Facility not found in the database.");
//       }
//     } catch (error: any) {
//       console.error("Error loading data:", error);
//       setError(
//         `Failed to load booking page: ${error.message || "Unknown error"}`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookingSuccess = (booking: Booking): void => {
//     console.log("Booking successful:", booking);
//     // You could redirect to a success page or show a toast notification
//     navigate("/dashboard/patient", {
//       state: {
//         message: "Bed booking successful!",
//         bookingId: booking.id,
//       },
//     });
//   };

//   const handleBookingComplete = (): void => {
//     navigate("/dashboard/patient");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//         <span className="ml-2 text-gray-600">Loading bed booking...</span>
//       </div>
//     );
//   }

 
// if (error) {
//   return (
//     <DashboardLayout userType="patient">
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//           <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="space-y-3">
//             <button
//               onClick={() => navigate("/dashboard/patient")}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Return to Dashboard
//             </button>
//             <button
//               onClick={() => navigate("/")}
//               className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//             >
//               Return Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

//   return (
//     <DashboardLayout userType="patient">
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between py-4">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   aria-label="Go back"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     Book a Hospital Bed
//                   </h1>
//                   {facility && (
//                     <p className="text-gray-600">
//                       {facility.facility_name} • {facility.city},{" "}
//                       {facility.state}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 <Calendar className="w-4 h-4" />
//                 <span>{new Date().toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {facility && patientId && facilityId ? (
//             <BedBookingView
//               facilityId={facilityId}
//               patientId={patientId}
//               onBookingSuccess={handleBookingSuccess}
//               onSuccess={handleBookingComplete}
//             />
//           ) : (
//             <div className="text-center py-12">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//               <p className="text-gray-600">Loading booking interface...</p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-white border-t border-gray-200 py-6">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center text-sm text-gray-500">
//               <p>
//                 Need help? Contact facility at{" "}
//                 <span className="font-medium">
//                   {facility?.phone || "phone number not available"}
//                 </span>
//               </p>
//               {facility?.email && (
//                 <p className="mt-1">
//                   Email: <span className="font-medium">{facility.email}</span>
//                 </p>
//               )}
//               <p className="mt-2 text-red-600 font-medium">
//                 ⚠️ Emergency? Call 911 or visit the nearest emergency room
//                 immediately.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default PatientBookBedPage;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, Shield, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BedBookingView from "@/components/bedbooking/BedBookingView";

/* ---------------- Facility Type ---------------- */
interface Facility {
  id: string;
  admin_user_id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  address: Record<string, any>;
  additional_services: Record<string, any>;
  operating_hours: Record<string, any>;
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



const PatientBookBedPage: React.FC = () => {
  const navigate = useNavigate();
  const { facilityId } = useParams<{ facilityId?: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [error, setError] = useState<string>("");

  const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

  useEffect(() => {
    if (facilityId) {
      checkAuthAndLoadData(facilityId);
    } else {
      setError("Invalid facility");
      setLoading(false);
    }
  }, [facilityId]);

  const checkAuthAndLoadData = async (facilityId: string) => {
    try {
      setLoading(true);
      setError("");

      /* -------- Auth Check -------- */
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login", {
          state: { returnTo: `/patient/book/${createSlug(facility?.facility_name || "")}/${facilityId}` },
        });
        return;
      }

      /* -------- Role Check -------- */
    //   const { data: profile, error: profileError } = await supabase
    //     .from("profiles")
    //     .select("role")
    //     .eq("user_id", user.id)
    //     .single();

    //   if (profileError || profile?.role !== "patient") {
    //     setError("Only patients can book beds.");
    //     return;
    //   }

    //   setPatientId(user.id);

      /* -------- Facility Data -------- */
      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .single<Facility>();

      if (facilityError || !facilityData) {
        setError("Facility not found");
        return;
      }

      setFacility(facilityData);
    } catch (err) {
      console.error("Booking page error:", err);
      setError("Failed to load booking page");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = (booking: unknown) => {
    console.log("Booking successful:", booking);
    // navigate("/patient/bookings");
  };

  /* -------- Loading -------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* -------- Error -------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Error
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  /* -------- UI -------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold">Book a Hospital Bed</h1>
              {facility && (
                <p className="text-gray-600">
                  {facility.facility_name} • {facility.city}, {facility.state}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {facility && patientId ? (
          <BedBookingView
            facilityId={facility.id}
            patientId={patientId}
            onBookingSuccess={handleBookingSuccess}
          />
        ) : (
          <p className="text-center text-gray-600">
            Loading booking interface...
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-6 text-center text-sm text-gray-500">
        <p>
          Need help? Contact facility at{" "}
          {facility?.website ?? "contact not available"}
        </p>
        <p className="mt-1 text-red-500 font-medium">
          Emergency? Call 911 or visit nearest ER
        </p>
      </div>
    </div>
  );
};

export default PatientBookBedPage;
