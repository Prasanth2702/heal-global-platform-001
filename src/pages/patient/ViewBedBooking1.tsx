import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react"; // You can use any icon library or text

interface Ward {
  id: string;
  facility_id: string;
  ward_code: string;
  name: string;
  ward_type: string;
  floor_number: number;
  total_beds: number;
  available_beds: number;
  is_active: boolean;
  is_operational: boolean;
}

interface Bed {
  id: string;
  facility_id: string;
  ward_id: string;
  bed_number: string;
  bed_label: string;
  bed_type: string;
  current_status: string;
  has_oxygen: boolean;
  has_ventilator: boolean;
  is_active: boolean;
}

const ViewBedBooking1 = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate(); // Add useNavigate for navigation
  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bedLoading, setBedLoading] = useState(false);
  const [bookedBedIds, setBookedBedIds] = useState<string[]>([]);

  useEffect(() => {
    if (facilityId) {
      fetchWards();
    } else {
      setError("Facility ID is missing");
      setLoading(false);
    }
  }, [facilityId]);

  // Function to go back to previous page
  const handleGoBack = () => {
    navigate(-1); // Go back one step in history
  };

  // Alternative: Go to specific route
  // const handleGoBack = () => {
  //   navigate("/facilities"); // Replace with your actual route
  // };

  const fetchWards = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("wards")
        .select("*")
        .eq("facility_id", facilityId)
        .eq("is_active", true)
        .eq("is_operational", true)
        .order("floor_number", { ascending: true });

      if (error) {
        console.error("Error fetching wards:", error);
        setError("Failed to load wards. Please try again.");
      } else if (data) {
        // Filter wards to only show those with available beds
        const wardsWithAvailableBeds = data.filter(
          (ward) => ward.available_beds > 0
        );
        setWards(wardsWithAvailableBeds);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async (wardId: string) => {
    setSelectedWard(wardId);
    setBedLoading(true);
    setError(null);

    try {
      const { data: bookings } = await supabase
        .from("bed_bookings")
        .select("assigned_bed_id")
        .eq("assigned_ward_id", wardId)
        .in("status", [ "RESERVED"]);

      const bookedIds = bookings?.map((b) => b.assigned_bed_id) || [];
      setBookedBedIds(bookedIds);

      const { data, error } = await supabase
        .from("beds")
        .select("*")
        .eq("facility_id", facilityId)
        .eq("ward_id", wardId)
        .eq("is_active", true)
        .eq("current_status", "AVAILABLE")
        .order("bed_number", { ascending: true });

      if (error) {
        console.error("Error fetching beds:", error);
        setError("Failed to load beds. Please try again.");
        setBeds([]);
      } else if (data) {
        setBeds(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
      setBeds([]);
    } finally {
      setBedLoading(false);
    }
  };

  const handleBookBed = async (bedId: string) => {
    try {
      if (!selectedWard) {
        alert("Please select a ward first");
        return;
      }

      navigate(
        `/dashboard/patient/bookregister/${facilityId}/${selectedWard}/${bedId}`
      );
    } catch (err) {
      console.error("Error booking bed:", err);
      alert("Failed to book bed. Please try again.");
    }
  };

  const getSelectedWardName = () => {
    return (
      wards.find((ward) => ward.id === selectedWard)?.name || "Selected Ward"
    );
  };

  return (
    <DashboardLayout userType="patient">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button at the top */}
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>

        {/* Alternative back button with more styling */}
        {/* <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Previous Page</span>
        </button> */}

        <h1 className="text-2xl font-bold mb-6">Select Ward & Bed</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* WARDS SECTION */}
        <h2 className="text-xl font-semibold mb-4">Available Wards</h2>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading wards...</span>
          </div>
        ) : wards.length === 0 ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              No wards with available beds found for this facility.
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              All wards are currently full or under maintenance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wards.map((ward) => (
              <div
                key={ward.id}
                onClick={() => fetchBeds(ward.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                  ${
                    selectedWard === ward.id
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{ward.name}</h3>
                    <p className="text-sm text-gray-600">
                      {ward.ward_type} • Floor {ward.floor_number}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {ward.available_beds} available
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    Total beds: {ward.total_beds} • Code: {ward.ward_code}
                  </p>
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    Click to view available beds →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BEDS SECTION */}
        {selectedWard && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Available Beds in {getSelectedWardName()}
              </h2>
              <button
                onClick={() => setSelectedWard(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to wards
              </button>
            </div>

            {bedLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3">Loading beds...</span>
              </div>
            ) : beds.length === 0 ? (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600">
                  No available beds found in this ward.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  All beds are currently occupied or reserved.
                </p>
                <button
                  onClick={() => fetchBeds(selectedWard)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh list
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {beds.length} available bed
                  {beds.length !== 1 ? "s" : ""}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beds.map((bed) => (
                    <div
                      key={bed.id}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">
                            Bed {bed.bed_number}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {bed.bed_label} • {bed.bed_type}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          AVAILABLE
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {bed.has_oxygen && (
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Oxygen supply available</span>
                          </div>
                        )}
                        {bed.has_ventilator && (
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Ventilator available</span>
                          </div>
                        )}
                        {!bed.has_oxygen && !bed.has_ventilator && (
                          <div className="text-sm text-gray-500">
                            Standard care bed
                          </div>
                        )}
                      </div>

                      <button
                        disabled={bookedBedIds.includes(bed.id)}
                        onClick={() => handleBookBed(bed.id)}
                        className={`mt-6 w-full py-2 rounded-lg font-medium transition-colors
    ${
      bookedBedIds.includes(bed.id)
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
                      >
                        {bookedBedIds.includes(bed.id)
                          ? "Already Booked"
                          : "Book This Bed"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default ViewBedBooking1;
