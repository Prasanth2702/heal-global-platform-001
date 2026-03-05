import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const BedBookingRegister = () => {
  const { facilityId, wardId, bedId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [formData, setFormData] = useState({
    admission_type: "",
    primary_diagnosis: "",
    secondary_diagnosis: "",
    allergies: "",
    special_instructions: "",
    expected_admission_date: "",
    expected_discharge_date: "",
    priority: "medium",
    insurance_provider: "",
    insurance_policy_number: "",
    referring_doctor_name: "",
    referring_doctor_contact: "",
    special_requirements: [] as string[],
  });

  const specialRequirementsOptions = [
    "Oxygen Required",
    "Ventilator Required",
    "Isolation Room",
    "Bariatric Equipment",
    "ICU Level Monitoring",
    "Special Diet",
    "Physical Therapy",
    "Wheelchair Accessible",
  ];
  

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecialRequirementsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        special_requirements: [...formData.special_requirements, value],
      });
    } else {
      setFormData({
        ...formData,
        special_requirements: formData.special_requirements.filter(
          (req) => req !== value
        ),
      });
    }
  };

  // Fetch patient data when component mounts
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("No user found");
          return;
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Fetch patient-specific data from patients table
        const { data: patientRow, error: patientError } = await supabase
          .from("patients")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        // Merge both data sources with correct field names
        const mergedPatientData = {
          ...profileData,
          date_of_birth: patientRow?.date_of_birth || profileData.date_of_birth,
          phone_number: patientRow?.phone_number || profileData.phone_number,
          ...patientRow,
        };

        setPatientData(mergedPatientData);
      } catch (err) {
        console.error("Error in fetchPatientData:", err);
      }
    };

    fetchPatientData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please login to book a bed");
      }

      /* ---------------- BED ---------------- */
      const { data: bedData, error: bedError } = await supabase
        .from("beds")
        .select("*")
        .eq("id", bedId)
        .single();

      if (bedError || !bedData) {
        throw new Error("Could not load bed information");
      }

      /* ---------------- FACILITY ---------------- */
      const { data: facilityData, error: facilityError } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .single();

      if (facilityError || !facilityData) {
        throw new Error("Could not load facility information");
      }

         const { data: patientData, error: patientError } = await supabase
           .from("patients")
           .select("id")
           .eq("user_id", user.id) // Find patient record by user_id
           .single();

         if (patientError || !patientData) {
           throw new Error(
             "Please complete your patient profile before booking"
           );
         }

      /* ---------------- BOOKING DATA ---------------- */
      const bookingData = {
        facility_id: facilityId,
        patient_id: user.id,
        admission_type: formData.admission_type,
        required_bed_type: bedData.bed_type ?? bedData.type,
        assigned_bed_id: bedId,
        assigned_ward_id: wardId,
        expected_admission_date: formData.expected_admission_date,
        priority: formData.priority.toUpperCase(),
        primary_diagnosis: formData.primary_diagnosis,
        status: "AVAILABLE",
        created_by: user.id,
      };
      // expected_discharge_date: formData.expected_discharge_date || null,
      // secondary_diagnosis: formData.secondary_diagnosis || null,
      // special_requirements: formData.special_requirements,
      // allergies: formData.allergies || null,
      // special_instructions: formData.special_instructions || null,
      // insurance_provider: formData.insurance_provider || null,
      // insurance_policy_number: formData.insurance_policy_number || null,
      // referring_doctor_name: formData.referring_doctor_name || null,
      // referring_doctor_contact: formData.referring_doctor_contact || null,

      console.log("kkkkkkk",bookingData)

      /* ---------------- PATIENT PROFILE ---------------- */
      let currentPatientData = patientData;

      // Fetch fresh patient data if not already loaded
      if (!currentPatientData) {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError || !profileData) {
          throw new Error("Patient profile not found");
        }

        // Fetch patient-specific data including date_of_birth
        const { data: patientRow, error: patientError } = await supabase
          .from("patients")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Merge both data sources with correct field names
        currentPatientData = {
          ...profileData,
          // date_of_birth: patientRow?.date_of_birth || null,
          // phone_number: patientRow?.phone_number || profileData.phone_number,
          ...patientRow,
        };
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;

      /* ---------------- EDGE FUNCTION ---------------- */
      const { data, error } = await supabase.functions.invoke(
        "create-bed-booking",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            booking: bookingData, // Changed from bookingData to booking
            patient: currentPatientData, // Changed from patientInfo to patient
            bed: bedData, // Changed from bedInfo to bed
            facility: facilityData, // Changed from facilityId to facility
          },
        }
      );

      // const { data :bedUpdateData, error: bedUpdateError } = await supabase
      //   .from("beds")
      //   .update({
      //     current_status: "OCCUPIED",
      //   })
      //   .eq("id", bedId);
      //   console.log("kkk", bedUpdateData);

      // if (bedUpdateError) {
      //   throw new Error("Booking succeeded but failed to update bed status");
      // }

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Booking failed");
      }

      navigate("/dashboard/patient/my_bed_bookings", {
        state: {
          success: true,
          bookingReference: data.booking_reference,
          message:
            "Booking created successfully! Check your email for confirmation.",
        },
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userType="patient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">←</span>
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-2">Bed Booking Registration</h1>
        <p className="text-gray-600 mb-6">
          Please fill in the required information to book the selected bed
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          {/* Patient Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
            {patientData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-gray-700">
                    {patientData.first_name} {patientData.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-700">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-gray-700">
                    {patientData.phone_number  || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-gray-700">
                    {patientData.date_of_birth
                      ? new Date(patientData.date_of_birth).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Loading patient information...
              </p>
            )}
          </div>

          {/* Medical Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Medical Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Admission Type *
                </label>
                <select
                  name="admission_type"
                  required
                  onChange={handleChange}
                  value={formData.admission_type}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select admission type</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="PLANNED">Planned</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="OUTPATIENT">Outpatient</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority Level *
                </label>
                <select
                  name="priority"
                  required
                  onChange={handleChange}
                  value={formData.priority}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Primary Diagnosis *
              </label>
              <input
                name="primary_diagnosis"
                required
                onChange={handleChange}
                value={formData.primary_diagnosis}
                placeholder="Enter primary diagnosis"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Secondary Diagnosis
              </label>
              <input
                name="secondary_diagnosis"
                onChange={handleChange}
                value={formData.secondary_diagnosis}
                placeholder="Enter secondary diagnosis (if any)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Allergies
              </label>
              <textarea
                name="allergies"
                rows={2}
                onChange={handleChange}
                value={formData.allergies}
                placeholder="List any allergies (e.g., medications, food, environmental)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Special Instructions
              </label>
              <textarea
                name="special_instructions"
                rows={3}
                onChange={handleChange}
                value={formData.special_instructions}
                placeholder="Any special care instructions or requirements"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Special Requirements Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Special Requirements</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select any special requirements for the patient's care
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specialRequirementsOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    value={option}
                    checked={formData.special_requirements.includes(option)}
                    onChange={handleSpecialRequirementsChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor={option}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Dates Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Admission Dates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expected Admission Date *
                </label>
                <input
                  type="date"
                  name="expected_admission_date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  value={formData.expected_admission_date}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Expected Discharge Date
                </label>
                <input
                  type="date"
                  name="expected_discharge_date"
                  min={formData.expected_admission_date}
                  onChange={handleChange}
                  value={formData.expected_discharge_date}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information Section */}
          {/* <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">
              Insurance Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Insurance Provider
                </label>
                <input
                  name="insurance_provider"
                  onChange={handleChange}
                  value={formData.insurance_provider}
                  placeholder="Enter insurance provider"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Policy Number
                </label>
                <input
                  name="insurance_policy_number"
                  onChange={handleChange}
                  value={formData.insurance_policy_number}
                  placeholder="Enter policy number"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div> */}

          {/* Referring Doctor Section */}
          {/* <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Referring Doctor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Doctor Name
                </label>
                <input
                  name="referring_doctor_name"
                  onChange={handleChange}
                  value={formData.referring_doctor_name}
                  placeholder="Enter doctor's name"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Information
                </label>
                <input
                  name="referring_doctor_contact"
                  onChange={handleChange}
                  value={formData.referring_doctor_contact}
                  placeholder="Enter doctor's contact"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div> */}

          {/* Terms and Conditions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I confirm that all information provided is accurate and
                complete. I understand that submitting this request does not
                guarantee bed availability and that the booking is subject to
                facility approval.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Booking...
              </span>
            ) : (
              "Submit Booking Request"
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            You will receive an email confirmation once your booking request is
            submitted
          </p>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BedBookingRegister;
