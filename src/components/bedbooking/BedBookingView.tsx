// components/bedbooking/BedBookingView.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Bed,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { mixpanelInstance } from "@/utils/mixpanel";

// Define types
interface BedType {
  id: string;
  bed_type: string;
  price_per_day: number;
  description?: string;
}

interface Bed {
  id: string;
  bed_number: string;
  bed_type_id: string;
  facility_id: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  created_at: string;
  bed_types: BedType;
}

interface BedBookingViewProps {
  facilityId: string;
  patientId: string;
  onBookingSuccess: (booking: any) => void;
  onSuccess?: () => void;
}

interface BookingFormData {
  admissionDate: string;
  expectedDischargeDate: string;
  bookingReason: string;
  selectedBedId: string | null;
}

const BedBookingView: React.FC<BedBookingViewProps> = ({
  facilityId,
  patientId,
  onBookingSuccess,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    admissionDate: "",
    expectedDischargeDate: "",
    bookingReason: "",
    selectedBedId: null,
  });
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [facilityDetails, setFacilityDetails] = useState<any>(null);

  // Calculate min and max dates for date inputs
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Load beds and patient/facility data
  useEffect(() => {
    loadData();
  }, [facilityId, patientId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load facility details
      const { data: facilityData } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .single();

      setFacilityDetails(facilityData);

      // Load patient details
      const { data: patientData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", patientId)
        .single();

      setPatientDetails(patientData);

      // Load beds for this facility
      const { data: bedsData, error: bedsError } = await supabase
        .from("beds")
        .select(
          `
          *,
          bed_types (*)
        `
        )
        .eq("facility_id", facilityId)
        .eq("status", "available");

      if (bedsError) throw bedsError;

      setBeds(bedsData || []);
      setAvailableBeds(
        bedsData?.filter((bed) => bed.status === "available") || []
      );
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load bed information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBedSelection = (bedId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBedId: prev.selectedBedId === bedId ? null : bedId,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.admissionDate) {
      toast.error("Please select admission date");
      return false;
    }

    if (!formData.expectedDischargeDate) {
      toast.error("Please select expected discharge date");
      return false;
    }

    if (new Date(formData.admissionDate) < new Date(today)) {
      toast.error("Admission date cannot be in the past");
      return false;
    }

    if (
      new Date(formData.expectedDischargeDate) <=
      new Date(formData.admissionDate)
    ) {
      toast.error("Discharge date must be after admission date");
      return false;
    }

    if (!formData.bookingReason.trim()) {
      toast.error("Please provide a reason for booking");
      return false;
    }

    if (!formData.selectedBedId) {
      toast.error("Please select a bed");
      return false;
    }

    return true;
  };

  const handleSubmitBooking = async () => {
    if (!validateForm()) return;

    try {
      setBookingLoading(true);
        // Get selected bed details for tracking
    const selectedBed = availableBeds.find(b => b.id === formData.selectedBedId);
    
    // Calculate stay duration
    const start = new Date(formData.admissionDate);
    const end = new Date(formData.expectedDischargeDate);
    const stayDuration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    const estimatedTotal = stayDuration * (selectedBed?.bed_types?.price_per_day || 0);

      mixpanelInstance.track('Bed Booking Attempt', {
        facility_id: facilityId,
        facility_name: facilityDetails?.facility_name,
        bed_id: formData.selectedBedId,
        bed_number: selectedBed?.bed_number,
        bed_type: selectedBed?.bed_types?.bed_type,
        price_per_day: selectedBed?.bed_types?.price_per_day,
        admission_date: formData.admissionDate,
        expected_discharge_date: formData.expectedDischargeDate,
        stay_duration_days: stayDuration,
        estimated_total: estimatedTotal,
        patient_id: patientId,
        booking_reason_length: formData.bookingReason.length,
      });

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          bed_id: formData.selectedBedId,
          patient_id: patientId,
          facility_id: facilityId,
          admission_date: formData.admissionDate,
          expected_discharge_date: formData.expectedDischargeDate,
          booking_reason: formData.bookingReason,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

       mixpanelInstance.track('Bed Booking Success', {
        booking_id: booking.id,
        facility_id: facilityId,
        facility_name: facilityDetails?.facility_name,
        bed_id: formData.selectedBedId,
        bed_number: selectedBed?.bed_number,
        bed_type: selectedBed?.bed_types?.bed_type,
        price_per_day: selectedBed?.bed_types?.price_per_day,
        admission_date: formData.admissionDate,
        expected_discharge_date: formData.expectedDischargeDate,
        stay_duration_days: stayDuration,
        estimated_total: estimatedTotal,
        patient_id: patientId,
        status: 'pending',
      });

      // Update bed status to reserved
      const { error: bedUpdateError } = await supabase
        .from("beds")
        .update({ status: "reserved" })
        .eq("id", formData.selectedBedId);

      if (bedUpdateError) throw bedUpdateError;

      toast.success("Bed booking request submitted successfully!");

      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        admissionDate: "",
        expectedDischargeDate: "",
        bookingReason: "",
        selectedBedId: null,
      });

      // Refresh beds
      await loadData();
    } catch (error: any) {
      console.error("Booking error:", error);
      mixpanelInstance.track('Bed Booking Error', {
        facility_id: facilityId,
        bed_id: formData.selectedBedId,
        patient_id: patientId,
        error_message: error.message,
        error_code: error.code,
      });
      toast.error(`Failed to book bed: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Bed className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">
            Loading beds and facility information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Patient Info & Booking Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Patient Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
            <CardDescription>Your details for the booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-lg font-semibold mt-1">
                  {patientDetails?.full_name || "Not provided"}
                </p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-lg font-semibold mt-1">
                  {patientDetails?.email || "Not provided"}
                </p>
              </div>
              {patientDetails?.phone && (
                <div>
                  <Label>Phone</Label>
                  <p className="text-lg font-semibold mt-1">
                    {patientDetails.phone}
                  </p>
                </div>
              )}
              {patientDetails?.date_of_birth && (
                <div>
                  <Label>Date of Birth</Label>
                  <p className="text-lg font-semibold mt-1">
                    {new Date(
                      patientDetails.date_of_birth
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Details
            </CardTitle>
            <CardDescription>
              Provide admission details for your booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="admissionDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Admission Date *
                </Label>
                <input
                  type="date"
                  id="admissionDate"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  min={today}
                  max={maxDateString}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <p className="text-sm text-gray-500">
                  Date you plan to be admitted
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="expectedDischargeDate"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Expected Discharge Date *
                </Label>
                <input
                  type="date"
                  id="expectedDischargeDate"
                  name="expectedDischargeDate"
                  value={formData.expectedDischargeDate}
                  onChange={handleInputChange}
                  min={formData.admissionDate || today}
                  max={maxDateString}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <p className="text-sm text-gray-500">
                  Estimated date of discharge
                </p>
              </div>
            </div>

            {/* Booking Reason */}
            <div className="space-y-2">
              <Label
                htmlFor="bookingReason"
                className="flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Reason for Booking *
              </Label>
              <Textarea
                id="bookingReason"
                name="bookingReason"
                value={formData.bookingReason}
                onChange={handleInputChange}
                placeholder="Please describe the medical reason for booking this bed..."
                rows={4}
                className="w-full"
                required
              />
              <p className="text-sm text-gray-500">
                Provide details about your medical condition or treatment plan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Beds Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              Available Beds
            </CardTitle>
            <CardDescription>
              Select a bed type and specific bed for your stay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableBeds.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Beds Available
                </h3>
                <p className="text-gray-600 mb-4">
                  All beds in this facility are currently occupied or under
                  maintenance.
                </p>
                <Button variant="outline" onClick={loadData}>
                  Refresh Availability
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableBeds.map((bed) => (
                    <div
                      key={bed.id}
                      onClick={() => handleBedSelection(bed.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.selectedBedId === bed.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold">
                            Bed {bed.bed_number}
                          </span>
                        </div>
                        {formData.selectedBedId === bed.id && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {bed.bed_types?.bed_type}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per day:</span>
                          <span className="font-semibold">
                            {formatCurrency(bed.bed_types?.price_per_day || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold text-green-600">
                            Available
                          </span>
                        </div>
                      </div>

                      {bed.bed_types?.description && (
                        <p className="mt-2 text-sm text-gray-500">
                          {bed.bed_types.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Important Notes
                      </h4>
                      <ul className="mt-2 text-sm text-blue-800 space-y-1">
                        <li>
                          • Booking confirmation is subject to facility approval
                        </li>
                        <li>
                          • Rates are per day and may vary based on services
                          used
                        </li>
                        <li>
                          • Early check-in or late check-out may incur
                          additional charges
                        </li>
                        <li>
                          • Contact the facility for specific medical equipment
                          availability
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Summary & Action */}
      <div className="space-y-6">
        {/* Facility Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {facilityDetails?.facility_name}
              </h3>
              <p className="text-gray-600">
                {facilityDetails?.city}, {facilityDetails?.state}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Bed className="w-4 h-4 text-gray-500" />
                <span>Total Beds: {facilityDetails?.total_beds || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <span>Verified Facility</span>
              </div>
              {facilityDetails?.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <span>⭐ {facilityDetails.rating}/5</span>
                  <span className="text-gray-500">
                    ({facilityDetails.total_reviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Contact Information</h4>
              {facilityDetails?.phone && (
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Phone className="w-4 h-4" />
                  <span>{facilityDetails.phone}</span>
                </div>
              )}
              {facilityDetails?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{facilityDetails.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary & Action */}
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.selectedBedId && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Bed:</span>
                    <span className="font-semibold">
                      Bed{" "}
                      {
                        availableBeds.find(
                          (b) => b.id === formData.selectedBedId
                        )?.bed_number
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bed Type:</span>
                    <span className="font-semibold">
                      {
                        availableBeds.find(
                          (b) => b.id === formData.selectedBedId
                        )?.bed_types?.bed_type
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        availableBeds.find(
                          (b) => b.id === formData.selectedBedId
                        )?.bed_types?.price_per_day || 0
                      )}
                    </span>
                  </div>
                  {formData.admissionDate && formData.expectedDischargeDate && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Estimated Total:</span>
                        <span>
                          {(() => {
                            const start = new Date(formData.admissionDate);
                            const end = new Date(
                              formData.expectedDischargeDate
                            );
                            const days = Math.ceil(
                              (end.getTime() - start.getTime()) /
                                (1000 * 3600 * 24)
                            );
                            const dailyRate =
                              availableBeds.find(
                                (b) => b.id === formData.selectedBedId
                              )?.bed_types?.price_per_day || 0;
                            return formatCurrency(days * dailyRate);
                          })()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on{" "}
                        {(() => {
                          const start = new Date(formData.admissionDate);
                          const end = new Date(formData.expectedDischargeDate);
                          return Math.ceil(
                            (end.getTime() - start.getTime()) /
                              (1000 * 3600 * 24)
                          );
                        })()}{" "}
                        day stay
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={e => {
                    mixpanelInstance.track('Bed Booking Main Button Clicked', {
                      facility_id: facilityId,
                      patient_id: patientId,
                      ...formData,
                    });
                    handleSubmitBooking();
                  }}
                  disabled={bookingLoading}
                  className="w-full"
                  size="lg"
                >
                  {bookingLoading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking Request"
                  )}
                </Button>
              </>
            )}

            {!formData.selectedBedId && (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Select a bed to see booking summary
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                By confirming, you agree to the facility's terms and conditions.
                A confirmation email will be sent upon approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BedBookingView;
