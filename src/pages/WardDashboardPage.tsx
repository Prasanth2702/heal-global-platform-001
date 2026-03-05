import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import WardBedManagement from "@/components/ward-management/WardBedManagement";

const WardDashboardPage = () => {
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user || null;
      
      if (user) {
        // Try to get facility_id from multiple possible sources
        const facilityIdFromMeta = user.user_metadata?.facility_id;
        
        if (facilityIdFromMeta) {
          setFacilityId(facilityIdFromMeta);
        } else {
          // If not in metadata, try to fetch from facilities table
          await fetchFacilityFromDb(user.id);
        }
      }
      
      setLoading(false);
      console.log("User session:", session);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      if (user?.user_metadata?.facility_id) {
        setFacilityId(user.user_metadata.facility_id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch facility from database based on user ID
  const fetchFacilityFromDb = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Facility fetch error:", error);
        return;
      }

      if (data) {
        console.log("Found facility from DB:", data);
        setFacilityId(data.id);
        
        // Optionally update user metadata
        await supabase.auth.updateUser({
          data: { facility_id: data.id }
        });
      } else {
        console.log("No facility found for this user");
        // Check if user is assigned to any facility as admin/staff
        await checkUserFacilityAssignment(userId);
      }
    } catch (error) {
      console.error("Error fetching facility:", error);
    }
  };

  // Check if user is assigned to a facility in facility_staff table
  const checkUserFacilityAssignment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("facility_staff")
        .select("facility_id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Facility staff fetch error:", error);
        return;
      }

      if (data) {
        console.log("Found facility from staff assignment:", data);
        setFacilityId(data.facility_id);
        
        // Update user metadata
        await supabase.auth.updateUser({
          data: { facility_id: data.facility_id }
        });
      }
    } catch (error) {
      console.error("Error checking facility assignment:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="facility">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading facility information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!facilityId) {
    return (
      <DashboardLayout userType="facility">
        <div className="p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                No Facility Assigned
              </h3>
              <p className="text-yellow-700 mb-4">
                Your account is not associated with any hospital facility. 
                Please contact your system administrator.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="facility">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Ward & Bed Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage wards and beds for Facility ID: {facilityId}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <WardBedManagement
            facilityId={facilityId}
            onSuccess={() => {
              console.log("Ward/Bed operation completed successfully!");
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WardDashboardPage;