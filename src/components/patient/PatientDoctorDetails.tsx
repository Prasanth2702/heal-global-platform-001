import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
interface Department {
  id: string;
  facility_id: string;
  name: string;
  description: string;
  head_doctor_id?: string;
  services?: any;
  equipment?: any;
  bed_capacity?: number;
  available_beds?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Facility {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  city: string;
  state: string;
  pincode: number;
  total_beds: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  established_year: number;
  website: string;
  insurance_partners: string;
  about_facility: string;
}

const PatientDoctorDetails = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptOpen, setDeptOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [expandedFacilityId, setExpandedFacilityId] = useState<string | null>(null);
const [hasSearched, setHasSearched] = useState(false);
//   const handleViewDepartment = async (facility: Facility) => {
//     setSelectedFacility(facility);
//     setDeptOpen(true);
//     const { data, error } = await supabase
//       .from("departments")
//       .select("*")
//       .eq("facility_id", facility.id);
//     if (!error && data) {
//       setDepartments(data);
//     } else {
//       setDepartments([]);
//     }
//   };
const handleViewDepartment = async (facility: Facility) => {
  // Toggle open / close
  if (expandedFacilityId === facility.id) {
    setExpandedFacilityId(null);
    setDepartments([]);
    return;
  }

  setExpandedFacilityId(facility.id);

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("facility_id", facility.id);

  if (!error && data) {
    setDepartments(data);
  } else {
    setDepartments([]);
  }
};

  useEffect(() => {
    fetchFacilityDetails();
  }, []);

  const fetchFacilityDetails = async () => {
    const { data, error } = await supabase
      .from("facilities")
      .select(`
        id,
        facility_name,
        facility_type,
        license_number,
        city,
        state,
        pincode,
        total_beds,
        rating,
        total_reviews,
        is_verified,
        established_year,
        website,
        insurance_partners,
        about_facility
      `);

    if (!error && data) {
      setFacilities(data);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading facility details...</p>;
  if (!facilities.length) return <p>No facility data found</p>;

  return (
    <div className="space-y-10">
      {facilities.map((facility) => (
        <Card key={facility.id} className=" mx-auto shadow-lg border-2 border-blue-100">
          {/* Header */}
          <div className="bg-blue-600 rounded-t-xl px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{facility.facility_name}</h2>
              <span className="text-blue-100 text-sm font-medium">{facility.facility_type}</span>
               <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-4 w-4 text-white" />
                  <span>{facility.city}, {facility.state} - {facility.pincode}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 text-white">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{facility.rating}</span>
                  <span className="text-xs text-white">({facility.total_reviews} reviews)</span>
                </div>
              {facility.is_verified && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Verified</span>
              )}
            </div>
          </div>
          <CardContent className="space-y-4 p-6 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Main Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">License No:</span>
                  <span>{facility.license_number}</span>
                </div>
               
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Established:</span>
                  <span>{facility.established_year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Beds:</span>
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">{facility.total_beds}</span>
                </div>
               
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Status:</span>
                  {facility.is_verified ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">Verified</span>
                  ) : (
                    <span className="text-red-500 font-semibold flex items-center gap-1">Not Verified</span>
                  )}
                </div>
                {/* <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Website:</span>
                  <a
                    href={facility.website}
                    target="_blank"
                    className="text-blue-600 underline"
                    rel="noopener noreferrer"
                  >
                    {facility.website}
                  </a>
                </div> */}
              </div>
              {/* Right: Insurance & About */}
              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Insurance Partners:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {facility.insurance_partners
                      ? facility.insurance_partners.split(',').map((partner, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {partner.trim()}
                          </span>
                        ))
                      : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold text-gray-700">About Facility:</span>
                  <p className="text-gray-600 mt-1 text-sm whitespace-pre-line">
                    {facility.about_facility || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

              <Button
                variant="outline"
                onClick={() => handleViewDepartment(facility)}
              >
                {expandedFacilityId === facility.id ? "Hide Departments" : "View Departments"}
              </Button>
              {/* Department details for expanded facility */}
              {expandedFacilityId === facility.id && (
                <div className="mt-6 border-t pt-4 space-y-4">
                  <h3 className="text-lg font-bold text-blue-700">
                    Departments
                  </h3>
                  {departments.length === 0 ? (
                    <p className="text-gray-500">No departments found for this facility.</p>
                  ) : (
                    departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                      >
                        <h4 className="font-semibold text-md text-blue-600 mb-1">
                          {dept.name}
                        </h4>
                        <p className="text-gray-700 text-sm mb-2">
                          {dept.description || "No description provided."}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                          <span>
                            <strong>Bed Capacity:</strong> {dept.bed_capacity ?? "N/A"}
                          </span>
                          <span>
                            <strong>Available Beds:</strong> {dept.available_beds ?? "N/A"}
                          </span>
                          <span>
                            <strong>Status:</strong>{" "}
                            {dept.is_active ? (
                              <span className="text-green-600 font-semibold">Active</span>
                            ) : (
                              <span className="text-red-500 font-semibold">Inactive</span>
                            )}
                          </span>
                        </div>
                        {dept.services && (
                          <div className="mt-2 text-sm">
                            <strong>Services:</strong>{" "}
                            {Array.isArray(dept.services)
                              ? dept.services.join(", ")
                              : JSON.stringify(dept.services)}
                          </div>
                        )}
                        {dept.equipment && (
                          <div className="mt-2 text-sm">
                            <strong>Equipment:</strong>{" "}
                            {Array.isArray(dept.equipment)
                              ? dept.equipment.join(", ")
                              : JSON.stringify(dept.equipment)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            {/* End department details for expanded facility */}
          </CardContent>
        </Card>
      ))}

    </div>
  );
};

export default PatientDoctorDetails;
