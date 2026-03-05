import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Bed,
  Building,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Users,
  Shield,
  Thermometer,
  Heart,
  Brain,
  Baby,
  Hash,
  Tag,
  Layers,
  Navigation,
  Compass,
  Phone,
  Search,
  ArrowRight,
  Settings,
  Wind,
  Activity,
  Monitor,
  Scale,
  Accessibility,
  DoorOpen,
  FileText,
  MapPin,
  Save,
  Zap,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Ban,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Zod schemas for validation
const wardSchema = z.object({
  ward_code: z
    .string()
    .min(2, "Ward code must be at least 2 characters")
    .max(20, "Ward code cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9\-_]+$/,
      "Only uppercase letters, numbers, hyphens and underscores allowed"
    ),
  name: z
    .string()
    .min(3, "Ward name must be at least 3 characters")
    .max(100, "Ward name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  ward_type: z.enum([
    "ICU",
    "CCU",
    "NICU",
    "PICU",
    "GENERAL",
    "MATERNITY",
    "PEDIATRIC",
    "PSYCHIATRIC",
    "REHABILITATION",
    "EMERGENCY",
    "CARDIAC",
    "NEURO",
    "BURN_UNIT",
    "ISOLATION",
    "STEP_DOWN",
  ]),
  floor_number: z.number().int().min(-5).max(100).optional(),
  wing: z.string().max(20).optional(),
  phone_extension: z.string().max(10).optional(),
  emergency_contact: z.string().max(20).optional(),
  is_operational: z.boolean().default(true),
});

const bedSchema = z.object({
  bed_number: z
    .string()
    .min(2, "Bed number must be at least 2 characters")
    .max(20, "Bed number cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9\-_]+$/,
      "Only uppercase letters, numbers, hyphens and underscores allowed"
    ),
  bed_label: z.string().max(50).optional().nullable(),
  bed_type: z.enum([
    "ICU",
    "CCU",
    "NICU",
    "PICU",
    "GENERAL",
    "PRIVATE",
    "SEMI_PRIVATE",
    "ISOLATION",
    "BURN_UNIT",
    "CARDIAC",
    "NEURO",
    "MATERNITY",
    "PEDIATRIC",
    "PSYCHIATRIC",
    "REHABILITATION",
    "STEP_DOWN",
    "EMERGENCY",
  ]),
  room_number: z.string().max(20).optional().nullable(),
  floor_number: z.number().int().min(-5).max(100).optional().nullable(),
  wing: z.string().max(20).optional().nullable(),
  has_oxygen: z.boolean().default(false),
  has_suction: z.boolean().default(false),
  has_monitor: z.boolean().default(false),
  has_ventilator: z.boolean().default(false),
  has_cpip: z.boolean().default(false),
  has_infusion_pump: z.boolean().default(false),
  is_bariatric: z.boolean().default(false),
  is_isolation: z.boolean().default(false),
  is_negative_pressure: z.boolean().default(false),
  is_wheelchair_accessible: z.boolean().default(false),
  width_cm: z.number().int().min(80).max(300).optional().default(100),
  length_cm: z.number().int().min(180).max(300).optional().default(200),
  max_weight_kg: z.number().int().min(50).max(500).optional().default(150),
  electrical_outlets: z.number().int().min(0).max(10).default(2),
  next_maintenance_date: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});

// Define bed status types
type BedStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "CLEANING"
  | "RESERVED"
  | "OUT_OF_SERVICE";

// Popup Modal Component
const PopupModal = ({
  show,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      default:
        return "bg-blue-50";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      default:
        return "text-blue-800";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "error":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className={`p-4 rounded-full ${getBgColor()} mb-4`}>
              {getIcon()}
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-2`}>
              {title}
            </h3>

            {/* Message */}
            <div className="mt-2">
              <p className="text-sm text-gray-600 text-center">{message}</p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex space-x-3 w-full">
              {showCancel && (
                <button
                  type="button"
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                className={`flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
                onClick={onConfirm || onClose}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WardBedManagement = ({ facilityId, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("wards");
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [editingBed, setEditingBed] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [bookedBedIds, setBookedBedIds] = useState<string[]>([]); // Track booked bed IDs
  const [errors, setErrors] = useState<{
    fetch?: string;
    submit?: string;
    delete?: string;
  }>({});

  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [showWardForm, setShowWardForm] = useState(false);
  const [showBedForm, setShowBedForm] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: "",
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  });

  // States for delete operations
  const [itemToDelete, setItemToDelete] = useState<{
    type: "ward" | "bed";
    id: string;
    name: string;
    bedCount?: number;
  } | null>(null);

  const {
    register: registerWard,
    handleSubmit: handleSubmitWard,
    reset: resetWard,
    control: controlWard,
    formState: { errors: wardErrors },
    setValue: setWardValue,
    watch: watchWard,
  } = useForm({
    resolver: zodResolver(wardSchema),
    defaultValues: {
      ward_code: "",
      name: "",
      description: "",
      ward_type: "GENERAL",
      floor_number: 1,
      wing: "",
      phone_extension: "",
      emergency_contact: "",
      is_operational: true,
    },
  });

  const {
    register: registerBed,
    handleSubmit: handleSubmitBed,
    reset: resetBed,
    control: controlBed,
    formState: { errors: bedErrors },
    setValue: setBedValue,
    watch: watchBed,
  } = useForm({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      bed_number: "",
      bed_label: "",
      bed_type: "GENERAL",
      room_number: "",
      floor_number: undefined,
      wing: "",
      has_oxygen: false,
      has_suction: false,
      has_monitor: false,
      has_ventilator: false,
      has_cpip: false,
      has_infusion_pump: false,
      is_bariatric: false,
      is_isolation: false,
      is_negative_pressure: false,
      is_wheelchair_accessible: false,
      width_cm: 100,
      length_cm: 200,
      max_weight_kg: 150,
      electrical_outlets: 2,
      next_maintenance_date: "",
    },
  });

  const currentBedType = watchBed("bed_type");

  // Fetch wards and beds
  useEffect(() => {
    fetchWardsAndBeds();
  }, [facilityId]);

  // Function to fetch booked bed IDs for a specific ward
  const fetchBookedBeds = async (wardId: string) => {
    try {
      const { data: bookings, error } = await supabase
        .from("bed_bookings")
        .select("assigned_bed_id")
        .eq("assigned_ward_id", wardId)
        .in("status", ["CONFIRMED", "CHECKED_IN"])
        .eq("is_active", true);

      if (error) throw error;

      const bookedIds = bookings?.map((b) => b.assigned_bed_id) || [];
      return bookedIds;
    } catch (error) {
      console.error("Error fetching booked beds:", error);
      return [];
    }
  };

  // Function to check if a bed is booked
  const checkBedBookingStatus = async (bedId: string, wardId: string) => {
    try {
      const { data: booking, error } = await supabase
        .from("bed_bookings")
        .select("id, status")
        .eq("assigned_bed_id", bedId)
        .eq("assigned_ward_id", wardId)
        .in("status", ["CONFIRMED", "CHECKED_IN"])
        .eq("is_active", true)
        .limit(1);

      if (error) throw error;

      return booking && booking.length > 0; // Returns true if there's an active booking
    } catch (error) {
      console.error("Error checking bed booking status:", error);
      return false;
    }
  };

  // Function to get bed status with booking priority
  const getBedStatusWithBooking = (bed: any, isBooked: boolean): BedStatus => {
    // If bed has active booking, it should be considered OCCUPIED
    if (isBooked) {
      return "OCCUPIED";
    }

    // Otherwise use the bed's current_status
    return bed.current_status || "AVAILABLE";
  };

  const fetchWardsAndBeds = async () => {
    try {
      setLoading(true);

      // Fetch wards
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .select("*")
        .eq("facility_id", facilityId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (wardsError) throw wardsError;

      // For each ward, fetch booked bed IDs and calculate occupied beds
      const wardsWithAccurateCounts = await Promise.all(
        (wardsData || []).map(async (ward) => {
          // Fetch booked bed IDs for this ward
          const bookedBedIds = await fetchBookedBeds(ward.id);

          // Count beds that are occupied (either in beds table or through bookings)
          const { data: wardBeds, error: bedsError } = await supabase
            .from("beds")
            .select("id, current_status")
            .eq("ward_id", ward.id)
            .eq("is_active", true);

          if (bedsError) throw bedsError;

          // Count occupied beds based on status AND bookings
          let occupiedCount = 0;
          if (wardBeds) {
            // For each bed, check if it's booked
            for (const bed of wardBeds) {
              const isBooked = await checkBedBookingStatus(bed.id, ward.id);
              if (isBooked || bed.current_status === "OCCUPIED") {
                occupiedCount++;
              }
            }
          }

          return {
            ...ward,
            occupied_beds: occupiedCount,
            available_beds: Math.max(0, (ward.total_beds || 0) - occupiedCount),
          };
        })
      );

      setWards(wardsWithAccurateCounts);

      // Fetch beds
      const { data: bedsData, error: bedsError } = await supabase
        .from("beds")
        .select("*, wards(name, ward_code)")
        .eq("facility_id", facilityId)
        .eq("is_active", true)
        .order("ward_id, bed_number", { ascending: true });

      if (bedsError) throw bedsError;

      // For each bed, check if it's booked and get correct status
      const bedsWithBookingStatus = await Promise.all(
        (bedsData || []).map(async (bed) => {
          const isBooked = await checkBedBookingStatus(bed.id, bed.ward_id);
          const displayStatus = getBedStatusWithBooking(bed, isBooked);

          return {
            ...bed,
            is_booked: isBooked,
            display_status: displayStatus,
          };
        })
      );

      setBeds(bedsWithBookingStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
      showPopup("Error", "Failed to load wards and beds", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show popups
  const showPopup = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setPopupConfig({ title, message, type });

    switch (type) {
      case "success":
        setShowSuccessPopup(true);
        break;
      case "error":
        setShowErrorPopup(true);
        break;
      case "warning":
        setShowAlertPopup(true);
        break;
      default:
        setShowAlertPopup(true);
    }
  };
// Handle ward form submission
const onSubmitWard = async (data) => {
  try {
    setSubmitting(true);
    setErrors({});

    // Enhanced duplicate ward code checking
    const normalizedWardCode = data.ward_code.toUpperCase().trim();
    
    // Check if ward_code already exists for this facility
    const { data: existingWards, error: checkError } = await supabase
      .from("wards")
      .select("id, ward_code")
      // .eq("facility_id", facilityId)
      .eq("is_active", true);

    if (checkError) throw checkError;

    if (existingWards) {
      // Check for duplicate ward code (case-insensitive)
      const duplicateWard = existingWards.find(
        (ward) => 
          ward.ward_code.toUpperCase() === normalizedWardCode &&
          (editingWard ? ward.id !== editingWard.id : true) // Skip current ward if editing
      );

      if (duplicateWard) {
        showPopup(
          "Duplicate Ward Code",
          `Ward code "${data.ward_code}" already exists in this facility. Please use a unique ward code.`,
          "error"
        );
        return;
      }
    }

    const wardData = {
      ...data,
      ward_code: normalizedWardCode, // Store in uppercase
      facility_id: facilityId,
      total_beds: 0,
      available_beds: 0,
      reserved_beds: 0,
    };

    let result;
    if (editingWard) {
      result = await supabase
        .from("wards")
        .update(wardData)
        .eq("id", editingWard.id)
        .select();
    } else {
      result = await supabase
        .from("wards")
        .insert(wardData)
        .select()
        .single();
    }

    if (result.error) {
      // Check for PostgreSQL unique constraint violation
      if (result.error.code === "23505") {
        showPopup(
          "Duplicate Ward Code",
          `Ward code "${data.ward_code}" already exists in this facility. Please use a unique ward code.`,
          "error"
        );
        return;
      }
      throw result.error;
    }

    // Show success popup
    showPopup(
      editingWard ? "Ward Updated!" : "Ward Created!",
      editingWard
        ? "Ward has been successfully updated."
        : "New ward has been successfully created.",
      "success"
    );

    resetWard();
    setEditingWard(null);
    setShowWardForm(false);
    fetchWardsAndBeds();

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error saving ward:", error);
    
    // Handle specific error types
    if (error.code === "23505") {
      showPopup(
        "Duplicate Ward Code",
        `Ward code "${data.ward_code}" already exists in this facility. Please use a unique ward code.`,
        "error"
      );
    } else {
      showPopup("Error", error.message || "Failed to save ward", "error");
    }
  } finally {
    setSubmitting(false);
  }
};

// Handle bed form submission
const onSubmitBed = async (data) => {
  try {
    setSubmitting(true);
    setErrors({});

    if (!selectedWard && !editingBed?.ward_id) {
      throw new Error("Please select a ward first");
    }

    const wardId = editingBed?.ward_id || selectedWard?.id;
    const normalizedBedNumber = data.bed_number.toUpperCase().trim();

    // Check if bed_number already exists in the same ward
    const { data: existingBeds, error: checkError } = await supabase
      .from("beds")
      .select("id, bed_number, ward_id")
      .eq("is_active", true);

    if (checkError) throw checkError;

    if (existingBeds) {
      // Check for duplicate bed number in the same ward (case-insensitive)
      const duplicateBed = existingBeds.find(
        (bed) => 
          bed.bed_number.toUpperCase() === normalizedBedNumber &&
          bed.ward_id === wardId &&
          (editingBed ? bed.id !== editingBed.id : true) // Skip current bed if editing
      );

      if (duplicateBed) {
        showPopup(
          "Duplicate Bed Number",
          `Bed number "${data.bed_number}" already exists in this ward. Please use a unique bed number.`,
          "error"
        );
        return;
      }
    }

    const { data: userData, error: userError } =
      await supabase.auth.getUser();
    if (userError) throw userError;

    const bedData = {
      ...data,
      bed_number: normalizedBedNumber, // Store in uppercase
      next_maintenance_date: data.next_maintenance_date || null,
      floor_number: data.floor_number || null,
      width_cm: data.width_cm || 100,
      length_cm: data.length_cm || 200,
      max_weight_kg: data.max_weight_kg || 150,
      electrical_outlets: data.electrical_outlets || 2,
      facility_id: facilityId,
      ward_id: wardId,
      current_status: "AVAILABLE",
      is_active: true,
      created_by: userData.user.id,
      bed_label: data.bed_label || null,
      room_number: data.room_number || null,
      wing: data.wing || null,
    };

    let result;
    if (editingBed) {
      result = await supabase
        .from("beds")
        .update(bedData)
        .eq("id", editingBed.id)
        .select()
        .single();
    } else {
      result = await supabase.from("beds").insert(bedData).select().single();
    }

    if (result.error) {
      console.error("Supabase error:", result.error);
      
      // Check for duplicate bed number error
      if (result.error.code === "23505") {
        showPopup(
          "Duplicate Bed Number",
          `Bed number "${data.bed_number}" already exists in this ward. Please use a unique bed number.`,
          "error"
        );
        return;
      }
      throw result.error;
    }

    // Show success popup
    showPopup(
      editingBed ? "Bed Updated!" : "Bed Created!",
      editingBed
        ? "Bed has been successfully updated."
        : "New bed has been successfully created.",
      "success"
    );

    // Reset form and state
    resetBed({
      bed_number: "",
      bed_label: "",
      bed_type: "GENERAL",
      room_number: "",
      floor_number: undefined,
      wing: "",
      has_oxygen: false,
      has_suction: false,
      has_monitor: false,
      has_ventilator: false,
      has_cpip: false,
      has_infusion_pump: false,
      is_bariatric: false,
      is_isolation: false,
      is_negative_pressure: false,
      is_wheelchair_accessible: false,
      width_cm: 100,
      length_cm: 200,
      max_weight_kg: 150,
      electrical_outlets: 2,
      next_maintenance_date: null,
    });

    setEditingBed(null);
    setSelectedWard(null);
    setShowBedForm(false);
    fetchWardsAndBeds();

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error saving bed:", error);
    
    // Handle specific error types
    if (error.code === "23505") {
      showPopup(
        "Duplicate Bed Number",
        `Bed number "${data.bed_number}" already exists in this ward. Please use a unique bed number.`,
        "error"
      );
    } else {
      showPopup(
        "Error",
        error.message ||
          "Failed to save bed. Please check all required fields.",
        "error"
      );
    }
  } finally {
    setSubmitting(false);
  }
};
  // Handle ward form submission
// const onSubmitWard = async (data) => {
//   try {
//     setSubmitting(true);
//     setErrors({});

//     // Check if ward_code already exists for this facility (except when editing the same ward)
//     if (!editingWard || editingWard.ward_code !== data.ward_code) {
//       const { data: existingWard, error: checkError } = await supabase
//         .from("wards")
//         .select("id")
//         .eq("facility_id", facilityId)
//         .eq("ward_code", data.ward_code)
//         .eq("is_active", true)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       if (existingWard) {
//         // If editing a different ward with the same code
//         if (editingWard && existingWard.id !== editingWard.id) {
//           showPopup(
//             "Duplicate Ward Code",
//             `Ward code "${data.ward_code}" already exists for another ward in this facility. Please use a unique code.`,
//             "error"
//           );
//           return;
//         }
//         // If creating a new ward with existing code
//         else if (!editingWard) {
//           showPopup(
//             "Duplicate Ward Code",
//             `Ward code "${data.ward_code}" already exists in this facility. Please use a unique code.`,
//             "error"
//           );
//           return;
//         }
//       }
//     }

//     const wardData = {
//       ...data,
//       facility_id: facilityId,
//       total_beds: 0,
//       available_beds: 0,
//       // occupied_beds: 0,
//       reserved_beds: 0,
//     };

//     let result;
//     if (editingWard) {
//       result = await supabase
//         .from("wards")
//         .update(wardData)
//         .eq("id", editingWard.id)
//         .select();
//     } else {
//       result = await supabase
//         .from("wards")
//         .insert(wardData)
//         .select()
//         .single();
//     }

//     if (result.error) throw result.error;

//     // Show success popup
//     showPopup(
//       editingWard ? "Ward Updated!" : "Ward Created!",
//       editingWard
//         ? "Ward has been successfully updated."
//         : "New ward has been successfully created.",
//       "success"
//     );

//     resetWard();
//     setEditingWard(null);
//     setShowWardForm(false);
//     fetchWardsAndBeds();

//     if (onSuccess) onSuccess();
//   } catch (error) {
//     console.error("Error saving ward:", error);
    
//     // Check specifically for duplicate key error
//     if (error.code === "23505") {
//       showPopup(
//         "Duplicate Ward Code",
//         `Ward code "${data.ward_code}" already exists in this facility. Please use a unique code.`,
//         "error"
//       );
//     } else {
//       showPopup("Error", error.message || "Failed to save ward", "error");
//     }
//   } finally {
//     setSubmitting(false);
//   }
// };


//   // Handle bed form submission
// const onSubmitBed = async (data) => {
//   try {
//     setSubmitting(true);
//     setErrors({});

//     if (!selectedWard && !editingBed?.ward_id) {
//       throw new Error("Please select a ward first");
//     }

//     // Check if bed_number already exists in the same ward (except when editing the same bed)
//     if (!editingBed || editingBed.bed_number !== data.bed_number) {
//       const { data: existingBed, error: checkError } = await supabase
//         .from("beds")
//         .select("id")
//         .eq("ward_id", editingBed?.ward_id || selectedWard?.id)
//         .eq("bed_number", data.bed_number)
//         .eq("is_active", true)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       if (existingBed) {
//         // If editing a different bed with the same number
//         if (editingBed && existingBed.id !== editingBed.id) {
//           showPopup(
//             "Duplicate Bed Number",
//             `Bed number "${data.bed_number}" already exists in this ward. Please use a unique number.`,
//             "error"
//           );
//           return;
//         }
//         // If creating a new bed with existing number
//         else if (!editingBed) {
//           showPopup(
//             "Duplicate Bed Number",
//             `Bed number "${data.bed_number}" already exists in this ward. Please use a unique number.`,
//             "error"
//           );
//           return;
//         }
//       }
//     }

//     const { data: userData, error: userError } =
//       await supabase.auth.getUser();
//     if (userError) throw userError;

//     const bedData = {
//       ...data,
//       next_maintenance_date: data.next_maintenance_date || null,
//       floor_number: data.floor_number || null,
//       width_cm: data.width_cm || 100,
//       length_cm: data.length_cm || 200,
//       max_weight_kg: data.max_weight_kg || 150,
//       electrical_outlets: data.electrical_outlets || 2,
//       facility_id: facilityId,
//       ward_id: editingBed?.ward_id || selectedWard?.id,
//       current_status: "AVAILABLE",
//       is_active: true,
//       created_by: userData.user.id,
//       bed_label: data.bed_label || null,
//       room_number: data.room_number || null,
//       wing: data.wing || null,
//     };

//     let result;
//     if (editingBed) {
//       result = await supabase
//         .from("beds")
//         .update(bedData)
//         .eq("id", editingBed.id)
//         .select()
//         .single();
//     } else {
//       result = await supabase.from("beds").insert(bedData).select().single();
//     }

//     if (result.error) {
//       console.error("Supabase error:", result.error);
      
//       // Check for duplicate bed number error
//       if (result.error.code === "23505") {
//         showPopup(
//           "Duplicate Bed Number",
//           `Bed number "${data.bed_number}" already exists in this ward. Please use a unique number.`,
//           "error"
//         );
//         return;
//       }
//       throw result.error;
//     }

//     // Show success popup
//     showPopup(
//       editingBed ? "Bed Updated!" : "Bed Created!",
//       editingBed
//         ? "Bed has been successfully updated."
//         : "New bed has been successfully created.",
//       "success"
//     );

//     // Reset form and state
//     resetBed({
//       bed_number: "",
//       bed_label: "",
//       bed_type: "GENERAL",
//       room_number: "",
//       floor_number: undefined,
//       wing: "",
//       has_oxygen: false,
//       has_suction: false,
//       has_monitor: false,
//       has_ventilator: false,
//       has_cpip: false,
//       has_infusion_pump: false,
//       is_bariatric: false,
//       is_isolation: false,
//       is_negative_pressure: false,
//       is_wheelchair_accessible: false,
//       width_cm: 100,
//       length_cm: 200,
//       max_weight_kg: 150,
//       electrical_outlets: 2,
//       next_maintenance_date: null,
//     });

//     setEditingBed(null);
//     setSelectedWard(null);
//     setShowBedForm(false);
//     fetchWardsAndBeds();

//     if (onSuccess) onSuccess();
//   } catch (error) {
//     console.error("Error saving bed:", error);
    
//     // Handle specific error types
//     if (error.code === "23505") {
//       showPopup(
//         "Duplicate Bed Number",
//         `Bed number "${data.bed_number}" already exists in this ward. Please use a unique number.`,
//         "error"
//       );
//     } else {
//       showPopup(
//         "Error",
//         error.message ||
//           "Failed to save bed. Please check all required fields.",
//         "error"
//       );
//     }
//   } finally {
//     setSubmitting(false);
//   }
// };
  // Handle bed form submission
  // const onSubmitBed = async (data) => {
  //   try {
  //     setSubmitting(true);
  //     setErrors({});

  //     if (!selectedWard && !editingBed?.ward_id) {
  //       throw new Error("Please select a ward first");
  //     }

  //     const { data: userData, error: userError } =
  //       await supabase.auth.getUser();
  //     if (userError) throw userError;

  //     const bedData = {
  //       ...data,
  //       next_maintenance_date: data.next_maintenance_date || null,
  //       floor_number: data.floor_number || null,
  //       width_cm: data.width_cm || 100,
  //       length_cm: data.length_cm || 200,
  //       max_weight_kg: data.max_weight_kg || 150,
  //       electrical_outlets: data.electrical_outlets || 2,
  //       facility_id: facilityId,
  //       ward_id: editingBed?.ward_id || selectedWard?.id,
  //       current_status: "AVAILABLE",
  //       is_active: true,
  //       created_by: userData.user.id,
  //       bed_label: data.bed_label || null,
  //       room_number: data.room_number || null,
  //       wing: data.wing || null,
  //     };

  //     let result;
  //     if (editingBed) {
  //       result = await supabase
  //         .from("beds")
  //         .update(bedData)
  //         .eq("id", editingBed.id)
  //         .select()
  //         .single();
  //     } else {
  //       result = await supabase.from("beds").insert(bedData).select().single();
  //     }

  //     if (result.error) {
  //       console.error("Supabase error:", result.error);
  //       throw result.error;
  //     }

  //     // Show success popup
  //     showPopup(
  //       editingBed ? "Bed Updated!" : "Bed Created!",
  //       editingBed
  //         ? "Bed has been successfully updated."
  //         : "New bed has been successfully created.",
  //       "success"
  //     );

  //     // Reset form and state
  //     resetBed({
  //       bed_number: "",
  //       bed_label: "",
  //       bed_type: "GENERAL",
  //       room_number: "",
  //       floor_number: undefined,
  //       wing: "",
  //       has_oxygen: false,
  //       has_suction: false,
  //       has_monitor: false,
  //       has_ventilator: false,
  //       has_cpip: false,
  //       has_infusion_pump: false,
  //       is_bariatric: false,
  //       is_isolation: false,
  //       is_negative_pressure: false,
  //       is_wheelchair_accessible: false,
  //       width_cm: 100,
  //       length_cm: 200,
  //       max_weight_kg: 150,
  //       electrical_outlets: 2,
  //       next_maintenance_date: null,
  //     });

  //     setEditingBed(null);
  //     setSelectedWard(null);
  //     setShowBedForm(false);
  //     fetchWardsAndBeds();

  //     if (onSuccess) onSuccess();
  //   } catch (error) {
  //     console.error("Error saving bed:", error);
  //     showPopup(
  //       "Error",
  //       error.message ||
  //         "Failed to save bed. Please check all required fields.",
  //       "error"
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  

  // Handle ward form submission
  // const onSubmitWard = async (data) => {
  //   try {
  //     setSubmitting(true);
  //     setErrors({});

  //     const wardData = {
  //       ...data,
  //       facility_id: facilityId,
  //       total_beds: 0,
  //       available_beds: 0,
  //       // occupied_beds: 0,
  //       reserved_beds: 0,
  //     };

  //     let result;
  //     if (editingWard) {
  //       result = await supabase
  //         .from("wards")
  //         .update(wardData)
  //         .eq("id", editingWard.id)
  //         .select();
  //     } else {
  //       result = await supabase
  //         .from("wards")
  //         .insert(wardData)
  //         .select()
  //         .single();
  //     }

  //     if (result.error) throw result.error;

  //     // Show success popup
  //     showPopup(
  //       editingWard ? "Ward Updated!" : "Ward Created!",
  //       editingWard
  //         ? "Ward has been successfully updated."
  //         : "New ward has been successfully created.",
  //       "success"
  //     );

  //     resetWard();
  //     setEditingWard(null);
  //     setShowWardForm(false);
  //     fetchWardsAndBeds();

  //     if (onSuccess) onSuccess();
  //   } catch (error) {
  //     console.error("Error saving ward:", error);
  //     showPopup("Error", error.message || "Failed to save ward", "error");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // Edit ward
  const handleEditWard = (ward) => {
    setEditingWard(ward);
    setWardValue("ward_code", ward.ward_code);
    setWardValue("name", ward.name);
    setWardValue("description", ward.description || "");
    setWardValue("ward_type", ward.ward_type);
    setWardValue("floor_number", ward.floor_number || 1);
    setWardValue("wing", ward.wing || "");
    setWardValue("phone_extension", ward.phone_extension || "");
    setWardValue("emergency_contact", ward.emergency_contact || "");
    setWardValue("is_operational", ward.is_operational);
    setActiveTab("wards");
  };

  // Edit bed
  const handleEditBed = (bed) => {
    setEditingBed(bed);
    const bedFormValues = {
      bed_number: bed.bed_number || "",
      bed_label: bed.bed_label || "",
      bed_type: bed.bed_type || "GENERAL",
      room_number: bed.room_number || "",
      floor_number: bed.floor_number || undefined,
      wing: bed.wing || "",
      has_oxygen: bed.has_oxygen || false,
      has_suction: bed.has_suction || false,
      has_monitor: bed.has_monitor || false,
      has_ventilator: bed.has_ventilator || false,
      has_cpip: bed.has_cpip || false,
      has_infusion_pump: bed.has_infusion_pump || false,
      is_bariatric: bed.is_bariatric || false,
      is_isolation: bed.is_isolation || false,
      is_negative_pressure: bed.is_negative_pressure || false,
      is_wheelchair_accessible: bed.is_wheelchair_accessible || false,
      width_cm: bed.width_cm || 100,
      length_cm: bed.length_cm || 200,
      max_weight_kg: bed.max_weight_kg || 150,
      electrical_outlets: bed.electrical_outlets || 2,
      next_maintenance_date: bed.next_maintenance_date || "",
    };
    resetBed(bedFormValues);
    setSelectedWard(wards.find((w) => w.id === bed.ward_id));
    setActiveTab("beds");
  };

  // Handle delete confirmation for bed
  const confirmDeleteBed = async (bedId, bedNumber) => {
    try {
      // Check if bed has active bookings
      const { data: bookings } = await supabase
        .from("bed_bookings")
        .select("id")
        .eq("assigned_bed_id", bedId)
        .in("status", ["CONFIRMED", "CHECKED_IN"])
        .eq("is_active", true)
        .limit(1);

      setItemToDelete({
        type: "bed",
        id: bedId,
        name: bedNumber,
      });

      if (bookings && bookings.length > 0) {
        showPopup(
          "Cannot Delete Bed",
          "This bed has active bookings and cannot be deleted. Please cancel the bookings first.",
          "warning"
        );
        return;
      }

      // Check if bed is occupied in bed_occupancy_history
      const { data: occupancy } = await supabase
        .from("bed_occupancy_history")
        .select("id")
        .eq("bed_id", bedId)
        .is("check_out_time", null)
        .single();

      if (occupancy) {
        showPopup(
          "Cannot Delete Bed",
          "This bed is currently occupied and cannot be deleted. Please check out the patient first.",
          "warning"
        );
        return;
      }

      showPopup(
        "Delete Bed",
        `Are you sure you want to delete bed "${bedNumber}"?`,
        "warning"
      );
    } catch (error) {
      console.error("Error checking bed status:", error);
      showPopup("Error", "Failed to check bed status", "error");
    }
  };

  // Execute delete operation
  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "ward") {
        // Check if ward has any beds with active bookings
        const { data: wardBeds } = await supabase
          .from("beds")
          .select("id")
          .eq("ward_id", itemToDelete.id);

        if (wardBeds && wardBeds.length > 0) {
          // Check for active bookings in these beds
          const bedIds = wardBeds.map((b) => b.id);
          const { data: activeBookings } = await supabase
            .from("bed_bookings")
            .select("id")
            .in("assigned_bed_id", bedIds)
            .in("status", ["CONFIRMED", "CHECKED_IN"])
            .eq("is_active", true)
            .limit(1);

          if (activeBookings && activeBookings.length > 0) {
            showPopup(
              "Cannot Delete Ward",
              "This ward has beds with active bookings. Please cancel all bookings first.",
              "error"
            );
            return;
          }
        }

        const { error } = await supabase
          .from("wards")
          .delete()
          .eq("id", itemToDelete.id);

        if (error) throw error;

        showPopup(
          "Ward Deleted!",
          `Ward "${itemToDelete.name}" has been successfully deleted.`,
          "success"
        );
      } else {
        const { error } = await supabase
          .from("beds")
          .update({ is_active: false })
          .eq("id", itemToDelete.id);

        if (error) throw error;

        showPopup(
          "Bed Deactivated!",
          `Bed "${itemToDelete.name}" has been successfully deactivated.`,
          "success"
        );
      }

      fetchWardsAndBeds();
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      showPopup(
        "Error",
        error.message || `Failed to delete ${itemToDelete.type}`,
        "error"
      );
    }
  };

  // Get bed status display color and text
  const getBedStatusDisplay = (status: BedStatus, isBooked: boolean) => {
    if (isBooked) {
      return {
        text: "BOOKED",
        color: "bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800",
        dotColor: "bg-purple-500",
      };
    }

    switch (status) {
      case "OCCUPIED":
        return {
          text: "OCCUPIED",
          color: "bg-gradient-to-r from-red-100 to-rose-200 text-red-800",
          dotColor: "bg-red-500",
        };
      case "AVAILABLE":
        return {
          text: "AVAILABLE",
          color:
            "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800",
          dotColor: "bg-green-500",
        };
      case "MAINTENANCE":
        return {
          text: "MAINTENANCE",
          color:
            "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800",
          dotColor: "bg-yellow-500",
        };
      case "CLEANING":
        return {
          text: "CLEANING",
          color: "bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800",
          dotColor: "bg-blue-500",
        };
      case "RESERVED":
        return {
          text: "RESERVED",
          color:
            "bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800",
          dotColor: "bg-orange-500",
        };
      case "OUT_OF_SERVICE":
        return {
          text: "OUT OF SERVICE",
          color: "bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800",
          dotColor: "bg-gray-500",
        };
      default:
        return {
          text: status || "UNKNOWN",
          color: "bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800",
          dotColor: "bg-gray-500",
        };
    }
  };

  // Get bed type icon
  const getBedTypeIcon = (type) => {
    const icons = {
      ICU: <Thermometer className="w-4 h-4" />,
      CCU: <Heart className="w-4 h-4" />,
      NICU: <Baby className="w-4 h-4" />,
      PICU: <Baby className="w-4 h-4" />,
      CARDIAC: <Heart className="w-4 h-4" />,
      NEURO: <Brain className="w-4 h-4" />,
      GENERAL: <Bed className="w-4 h-4" />,
      PRIVATE: <Shield className="w-4 h-4" />,
      EMERGENCY: <AlertCircle className="w-4 h-4" />,
      MATERNITY: <Users className="w-4 h-4" />,
    };
    return icons[type] || <Bed className="w-4 h-4" />;
  };

  // Get bed type color
  const getBedTypeColor = (type) => {
    const colors = {
      ICU: "bg-red-100 text-red-800",
      CCU: "bg-purple-100 text-purple-800",
      NICU: "bg-pink-100 text-pink-800",
      PICU: "bg-pink-100 text-pink-800",
      CARDIAC: "bg-red-100 text-red-800",
      NEURO: "bg-indigo-100 text-indigo-800",
      GENERAL: "bg-blue-100 text-blue-800",
      PRIVATE: "bg-green-100 text-green-800",
      EMERGENCY: "bg-orange-100 text-orange-800",
      MATERNITY: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Handle popup actions
  const handlePopupAction = () => {
    if (popupConfig.type === "warning" && itemToDelete) {
      executeDelete();
    }

    // Close all popups
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowAlertPopup(false);
    setShowConfirmDelete(false);
  };

  // Determine which popup to show
  const activePopup = showSuccessPopup || showErrorPopup || showAlertPopup;

  // Calculate capacity usage
  const calculateCapacityUsage = () => {
    if (beds.length === 0) return 0;

    const occupiedBeds = beds.filter((bed) => {
      return bed.display_status === "OCCUPIED" || bed.is_booked;
    }).length;

    return Math.round((occupiedBeds / beds.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading wards and beds...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Ward & Bed Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage hospital wards, beds, and their configurations
          </p>
        </div>

        {/* Popup Modals */}
        {activePopup && (
          <PopupModal
            show={activePopup}
            onClose={() => {
              setShowSuccessPopup(false);
              setShowErrorPopup(false);
              setShowAlertPopup(false);
            }}
            title={popupConfig.title}
            message={popupConfig.message}
            type={popupConfig.type}
            onConfirm={handlePopupAction}
            confirmText={popupConfig.type === "warning" ? "Confirm" : "OK"}
            showCancel={popupConfig.type === "warning"}
            cancelText="Cancel"
          />
        )}

        {/* Summary Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Wards</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wards.length}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-semibold">
                {wards.filter((w) => w.is_operational).length}
              </span>
              <span className="text-gray-600 ml-1">operational</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Beds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {beds.length}
                </p>
              </div>
              <Bed className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-blue-600 font-semibold">
                {
                  beds.filter(
                    (b) => b.display_status === "AVAILABLE" && !b.is_booked
                  ).length
                }
              </span>
              <span className="text-gray-600 ml-1">available now</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacity Usage</p>
                <p className="text-2xl font-bold text-gray-90">
                  {calculateCapacityUsage()}%
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {
                beds.filter(
                  (b) => b.display_status === "OCCUPIED" || b.is_booked
                ).length
              }{" "}
              beds occupied
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="px-4 md:px-6">
              <nav className="flex space-x-1 md:space-x-2" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("wards")}
                  className={`
                    relative py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-200
                    ${
                      activeTab === "wards"
                        ? "text-blue-700 bg-blue-50 border-t-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Building
                      className={`w-5 h-5 ${
                        activeTab === "wards"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Wards</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {wards.length}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("beds")}
                  className={`
                    relative py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-200
                    ${
                      activeTab === "beds"
                        ? "text-blue-700 bg-blue-50 border-t-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Bed
                      className={`w-5 h-5 ${
                        activeTab === "beds" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span>Beds</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {beds.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {/* Wards Tab */}
            {activeTab === "wards" && (
              <div className="animate-slide-in">
                <div className="grid  gap-6">
                  {/* Ward Form Card */}
                  {editingWard || showWardForm ? (
                    <div
                      className={`rounded-xl border p-5 shadow-sm sticky top-6 ${
                        editingWard
                          ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200"
                          : "bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div className="mb-6">
                        <h3
                          className={`text-lg font-bold flex items-center ${
                            editingWard ? "text-amber-900" : "text-emerald-900"
                          }`}
                        >
                          {editingWard ? (
                            <>
                              <Edit2 className="w-5 h-5 text-amber-600 mr-2" />
                              Edit Ward
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5 text-emerald-600 mr-2" />
                              Create New Ward
                            </>
                          )}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            editingWard ? "text-amber-700" : "text-emerald-700"
                          }`}
                        >
                          {editingWard
                            ? "Update ward details"
                            : "Add a new ward to your facility"}
                        </p>
                      </div>

                      <form
                        onSubmit={handleSubmitWard(onSubmitWard)}
                        className="space-y-4"
                      >
                        {/* Form Grid */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Hash className="w-4 h-4 mr-1 text-gray-400" />
                                Ward Code *
                              </label>
                              <input
                                {...registerWard("ward_code")}
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  wardErrors.ward_code
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="e.g., ICU-01"
                                disabled={submitting}
                              />
                              {wardErrors.ward_code && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {wardErrors.ward_code.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Building className="w-4 h-4 mr-1 text-gray-400" />
                                Ward Name *
                              </label>
                              <input
                                {...registerWard("name")}
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  wardErrors.name
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="e.g., Intensive Care Unit"
                                disabled={submitting}
                              />
                              {wardErrors.name && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {wardErrors.name.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Tag className="w-4 h-4 mr-1 text-gray-400" />
                              Ward Type *
                            </label>
                            <Controller
                              name="ward_type"
                              control={controlWard}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                                    wardErrors.ward_type
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                  disabled={submitting}
                                >
                                  <option value="">Select ward type...</option>
                                  <option value="GENERAL">
                                    🏥 General Ward
                                  </option>
                                  <option value="ICU">
                                    💙 Intensive Care Unit (ICU)
                                  </option>
                                  <option value="CCU">
                                    ❤️ Cardiac Care Unit (CCU)
                                  </option>
                                  <option value="NICU">
                                    👶 Neonatal ICU (NICU)
                                  </option>
                                  <option value="MATERNITY">
                                    🤰 Maternity Ward
                                  </option>
                                  <option value="EMERGENCY">
                                    🚨 Emergency Department
                                  </option>
                                </select>
                              )}
                            />
                            {wardErrors.ward_type && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {wardErrors.ward_type.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FileText className="w-4 h-4 mr-1 text-gray-400" />
                              Description
                            </label>
                            <textarea
                              {...registerWard("description" as any)}
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                              placeholder="Describe this ward's purpose and features..."
                              disabled={submitting}
                            />
                          </div>

                          {/* Location Information */}
                          <div
                            className={`p-4 rounded-lg border ${
                              editingWard
                                ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200"
                                : "bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-200"
                            }`}
                          >
                            <h4
                              className={`text-sm font-semibold mb-3 flex items-center ${
                                editingWard
                                  ? "text-amber-800"
                                  : "text-emerald-800"
                              }`}
                            >
                              <MapPin
                                className={`w-4 h-4 mr-2 ${
                                  editingWard
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              />
                              Location Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Floor Number
                                </label>
                                <div className="relative">
                                  <input
                                    {...registerWard("floor_number", {
                                      valueAsNumber: true,
                                    })}
                                    type="number"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                    disabled={submitting}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Wing
                                </label>
                                <input
                                  {...registerWard("wing")}
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="e.g., East"
                                  disabled={submitting}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Operational Status */}
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              editingWard
                                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                                : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    watchWard("is_operational")
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  } mr-3`}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {watchWard("is_operational")
                                    ? "Operational"
                                    : "Non-Operational"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {watchWard("is_operational")
                                    ? "Ward is active and accepting patients"
                                    : "Ward is temporarily unavailable"}
                                </p>
                              </div>
                            </div>
                            <Controller
                              name="is_operational"
                              control={controlWard}
                              render={({ field }) => (
                                <button
                                  type="button"
                                  onClick={() => field.onChange(!field.value)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    field.value ? "bg-green-600" : "bg-gray-300"
                                  }`}
                                  disabled={submitting}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      field.value
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              )}
                            />
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div
                          className={`flex space-x-3 pt-4 border-t ${
                            editingWard
                              ? "border-amber-200"
                              : "border-emerald-200"
                          }`}
                        >
                          <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 text-white py-3 px-4 rounded-lg font-medium hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm ${
                              editingWard
                                ? "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 focus:ring-amber-500"
                                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500"
                            }`}
                          >
                            {submitting ? (
                              <div className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                {editingWard ? "Updating..." : "Creating..."}
                              </div>
                            ) : editingWard ? (
                              <div className="flex items-center justify-center">
                                <Save className="w-5 h-5 mr-2" />
                                Update Ward
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Ward
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              resetWard();
                              setEditingWard(null);
                              setShowWardForm(false);
                            }}
                            disabled={submitting}
                            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div
                      className={`rounded-xl border shadow-sm ${
                        editingWard
                          ? "bg-gradient-to-br from-orange-50 to-pink-50 border-pink-200"
                          : "bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200"
                      }`}
                    >
                      <div
                        className={`p-5 border-b ${
                          editingWard ? "border-amber-200" : "border-blue-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3
                              className={`text-lg font-bold flex items-center ${
                                editingWard ? "text-amber-900" : "text-blue-900"
                              }`}
                            >
                              {editingWard ? (
                                <>
                                  <Edit2 className="w-5 h-5 text-amber-600 mr-2" />
                                  Edit Ward Mode
                                </>
                              ) : (
                                <>
                                  <Building className="w-5 h-5 text-blue-600 mr-2" />
                                  All Wards
                                </>
                              )}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                editingWard ? "text-amber-700" : "text-blue-700"
                              }`}
                            >
                              {editingWard
                                ? "Currently editing a ward. Click cancel to exit edit mode."
                                : "Manage your facility's wards and their configurations"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-gray-500">
                              <span className="font-semibold text-green-600">
                                {wards.filter((w) => w.is_operational).length}
                              </span>{" "}
                              operational •
                              <span
                                className={`font-semibold ml-2 ${
                                  editingWard
                                    ? "text-amber-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {" "}
                                {wards.reduce(
                                  (acc, w) => acc + w.total_beds,
                                  0
                                )}
                              </span>{" "}
                              total beds
                            </div>
                            {/* Create Ward Button */}
                            <button
                              onClick={() => {
                                resetWard();
                                setEditingWard(null);
                                setShowWardForm(true);
                              }}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm text-sm font-medium"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Ward
                            </button>
                          </div>
                        </div>
                      </div>

                      {wards.length === 0 ? (
                        <div className="p-8 text-center">
                          <div
                            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                              editingWard
                                ? "bg-gradient-to-br from-amber-100 to-yellow-100"
                                : "bg-gradient-to-br from-blue-100 to-cyan-100"
                            }`}
                          >
                            <Building
                              className={`w-8 h-8 ${
                                editingWard ? "text-amber-400" : "text-blue-400"
                              }`}
                            />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            No wards created yet
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Create your first ward to start adding beds and
                            managing patient accommodations
                          </p>
                          <button
                            onClick={() => {
                              resetWard();
                              setShowWardForm(true);
                            }}
                            className={`inline-flex items-center px-4 py-2 text-white rounded-lg hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 shadow-sm ${
                              editingWard
                                ? "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 focus:ring-amber-500"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:ring-blue-500"
                            }`}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Ward
                          </button>
                        </div>
                      ) : (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                            {wards.map((ward) => (
                              <div
                                key={ward.id}
                                className={`rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                                  editingWard?.id === ward.id
                                    ? "bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-300 ring-2 ring-amber-500 ring-opacity-50"
                                    : editingWard
                                    ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300"
                                    : "bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:border-blue-300"
                                }`}
                              >
                                <div className="p-5">
                                  {/* Ward Header */}
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span
                                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                            editingWard
                                              ? "bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800"
                                              : "bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800"
                                          }`}
                                        >
                                          {ward.ward_code}
                                        </span>
                                        <span
                                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                            ward.is_operational
                                              ? "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800"
                                              : "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800"
                                          }`}
                                        >
                                          <div
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                              ward.is_operational
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                            }`}
                                          />
                                          {ward.is_operational
                                            ? "Operational"
                                            : "Non-Op"}
                                        </span>
                                      </div>
                                      <h4
                                        className={`text-lg font-bold mb-1 ${
                                          editingWard
                                            ? "text-amber-900"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {ward.name}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {ward.ward_type} • Floor{" "}
                                        {ward.floor_number || "N/A"}
                                        {ward.wing && ` • ${ward.wing} Wing`}
                                      </p>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => handleEditWard(ward)}
                                        className={`p-2 rounded-lg transition-colors duration-200 ${
                                          editingWard
                                            ? "text-amber-600 hover:bg-amber-100"
                                            : "text-blue-600 hover:bg-blue-100"
                                        }`}
                                        title="Edit ward"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={async () => {
                                          // Check for active bookings in this ward
                                          const bookedBedIds =
                                            await fetchBookedBeds(ward.id);
                                          if (bookedBedIds.length > 0) {
                                            showPopup(
                                              "Cannot Delete Ward",
                                              "This ward has beds with active bookings. Please cancel all bookings first.",
                                              "error"
                                            );
                                          } else {
                                            // Check if ward has any beds
                                            const { data: wardBeds } =
                                              await supabase
                                                .from("beds")
                                                .select("id")
                                                .eq("ward_id", ward.id);

                                            setItemToDelete({
                                              type: "ward",
                                              id: ward.id,
                                              name: ward.name,
                                              bedCount: wardBeds?.length || 0,
                                            });

                                            if (
                                              wardBeds &&
                                              wardBeds.length > 0
                                            ) {
                                              showPopup(
                                                "Delete Ward with Beds",
                                                `This ward has ${wardBeds.length} bed(s). Deleting will remove all beds. Are you sure you want to proceed?`,
                                                "warning"
                                              );
                                            } else {
                                              showPopup(
                                                "Delete Ward",
                                                `Are you sure you want to delete "${ward.name}"?`,
                                                "warning"
                                              );
                                            }
                                          }
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                        title="Delete ward"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Ward Description */}
                                  {ward.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                      {ward.description}
                                    </p>
                                  )}

                                  {/* Stats Section */}
                                  <div
                                    className={`p-3 rounded-lg mb-4 ${
                                      editingWard
                                        ? "bg-gradient-to-r from-amber-50 to-yellow-50"
                                        : "bg-gradient-to-r from-blue-50 to-cyan-50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="text-center">
                                        <div
                                          className={`text-2xl font-bold ${
                                            editingWard
                                              ? "text-amber-700"
                                              : "text-blue-700"
                                          }`}
                                        >
                                          {ward.total_beds || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Total Beds
                                        </div>
                                      </div>
                                      <div className="h-10 w-px bg-gray-300"></div>
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                          {ward.available_beds || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Available
                                        </div>
                                      </div>
                                      <div className="h-10 w-px bg-gray-300"></div>
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-700">
                                          {ward.occupied_beds || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Occupied
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Ward Details */}
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin
                                        className={`w-4 h-4 mr-2 ${
                                          editingWard
                                            ? "text-amber-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                      <span>
                                        Floor {ward.floor_number || "N/A"}
                                        {ward.wing && ` • ${ward.wing} Wing`}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock
                                        className={`w-4 h-4 mr-2 ${
                                          editingWard
                                            ? "text-amber-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                      <span>
                                        Updated:{" "}
                                        {new Date(
                                          ward.updated_at
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* View Beds Button */}
                                  <button
                                    onClick={() => {
                                      setSelectedWard(ward);
                                      setActiveTab("beds");
                                    }}
                                    className={`w-full mt-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                                      editingWard
                                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700"
                                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center">
                                      <Bed className="w-4 h-4 mr-2" />
                                      View Beds ({ward.total_beds || 0})
                                    </div>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Beds Tab */}
            {activeTab === "beds" && (
              <div className="animate-slide-in">
                {editingBed || showBedForm ? (
                  <div
                    className={`rounded-xl border p-5 shadow-sm sticky top-6 ${
                      editingBed
                        ? "bg-gradient-to-br from-orange-50 to-amber-50 border-amber-200"
                        : "bg-gradient-to-br from-teal-50 to-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      {/* LEFT SIDE – Title & Description */}
                      <div>
                        <h3
                          className={`text-lg font-bold flex items-center ${
                            editingBed ? "text-amber-900" : "text-emerald-900"
                          }`}
                        >
                          {editingBed ? (
                            <>
                              <Edit2 className="w-5 h-5 text-amber-600 mr-2" />
                              Edit Bed
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5 text-emerald-600 mr-2" />
                              Create New Bed
                            </>
                          )}
                        </h3>

                        <p
                          className={`text-sm mt-1 ${
                            editingBed ? "text-amber-700" : "text-emerald-700"
                          }`}
                        >
                          {editingBed
                            ? "Update bed details and features"
                            : "Add a new bed to selected ward"}
                        </p>
                      </div>

                      {/* RIGHT SIDE – Cancel Button */}
                      {!editingBed && (
                        <button
                          type="button"
                          onClick={() => {
                            resetBed();
                            setEditingBed(null);
                            setSelectedWard(null);
                            setShowBedForm(false);
                          }}
                          disabled={submitting}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Ward Selection */}
                    <div
                      className={`mb-6 p-4 rounded-xl border ${
                        editingBed
                          ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200"
                          : "bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200"
                      }`}
                    >
                      <label
                        className={`block text-sm font-semibold mb-2 flex items-center ${
                          editingBed ? "text-amber-800" : "text-emerald-800"
                        }`}
                      >
                        <Building
                          className={`w-4 h-4 mr-2 ${
                            editingBed ? "text-amber-600" : "text-emerald-600"
                          }`}
                        />
                        Select Ward *
                      </label>
                      {wards.length === 0 ? (
                        <div className="text-center py-4">
                          <AlertCircle
                            className={`w-8 h-8 mx-auto mb-2 ${
                              editingBed ? "text-amber-500" : "text-emerald-500"
                            }`}
                          />
                          <p className="text-sm text-gray-600 mb-2">
                            No wards available. Create a ward first.
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab("wards")}
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              editingBed
                                ? "text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                                : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                            }`}
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Go to Wards
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <select
                            value={selectedWard?.id || ""}
                            onChange={(e) => {
                              const ward = wards.find(
                                (w) => w.id === e.target.value
                              );
                              setSelectedWard(ward);
                              if (!editingBed && ward) {
                                setBedValue("floor_number", ward.floor_number);
                                setBedValue("wing", ward.wing);
                              }
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={!!editingBed || submitting}
                          >
                            <option value="">Select a ward...</option>
                            {wards
                              .filter((w) => w.is_operational)
                              .map((ward) => (
                                <option key={ward.id} value={ward.id}>
                                  {ward.ward_code} - {ward.name} (
                                  {ward.available_beds}/{ward.total_beds} beds)
                                </option>
                              ))}
                          </select>

                          {selectedWard && (
                            <div
                              className={`p-3 rounded-lg border ${
                                editingBed
                                  ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                                  : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {selectedWard.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {selectedWard.ward_code} •{" "}
                                    {selectedWard.floor_number
                                      ? `Floor ${selectedWard.floor_number}`
                                      : "No floor"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-sm font-semibold ${
                                      editingBed
                                        ? "text-amber-600"
                                        : "text-emerald-600"
                                    }`}
                                  >
                                    {selectedWard.available_beds}/
                                    {selectedWard.total_beds}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    beds available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedWard || editingBed ? (
                      <form
                        onSubmit={handleSubmitBed(onSubmitBed)}
                        className="space-y-4"
                      >
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bed Number *
                              </label>
                              <input
                                {...registerBed("bed_number")}
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  bedErrors.bed_number
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="e.g., BED-001"
                                disabled={submitting}
                              />
                              {bedErrors.bed_number && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {bedErrors.bed_number.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bed Label
                              </label>
                              <input
                                {...registerBed("bed_label")}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="e.g., Near Window"
                                disabled={submitting}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Bed Type *
                            </label>
                            <Controller
                              name="bed_type"
                              control={controlBed}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    bedErrors.bed_type
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                  disabled={submitting}
                                >
                                  <option value="">Select bed type...</option>
                                  <option value="GENERAL">
                                    🛏️ General Bed
                                  </option>
                                  <option value="ICU">💙 ICU Bed</option>
                                  <option value="PRIVATE">
                                    🚪 Private Room
                                  </option>
                                  <option value="ISOLATION">
                                    🦠 Isolation Room
                                  </option>
                                  <option value="MATERNITY">
                                    🤰 Maternity Bed
                                  </option>
                                  <option value="PEDIATRIC">
                                    👶 Pediatric Bed
                                  </option>
                                </select>
                              )}
                            />
                            {bedErrors.bed_type && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {bedErrors.bed_type.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Number
                              </label>
                              <input
                                {...registerBed("room_number")}
                                type="text"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Room-101"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Floor
                              </label>
                              <input
                                {...registerBed("floor_number", {
                                  valueAsNumber: true,
                                })}
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Wing
                              </label>
                              <input
                                {...registerBed("wing")}
                                type="text"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="East"
                                disabled={submitting}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Equipment & Features */}
                        <div className="space-y-4">
                          <div
                            className={`p-4 rounded-xl border ${
                              editingBed
                                ? "bg-gradient-to-r from-orange-50 to-amber-100 border-amber-200"
                                : "bg-gradient-to-r from-teal-50 to-emerald-100 border-emerald-200"
                            }`}
                          >
                            <h4
                              className={`text-sm font-semibold mb-3 flex items-center ${
                                editingBed
                                  ? "text-amber-800"
                                  : "text-emerald-800"
                              }`}
                            >
                              <Zap
                                className={`w-4 h-4 mr-2 ${
                                  editingBed
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              />
                              Equipment Capabilities
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                {
                                  field: "has_oxygen",
                                  label: "Oxygen",
                                  icon: "💨",
                                },
                                {
                                  field: "has_suction",
                                  label: "Suction",
                                  icon: "🌀",
                                },
                                {
                                  field: "has_monitor",
                                  label: "Monitor",
                                  icon: "📊",
                                },
                                {
                                  field: "has_ventilator",
                                  label: "Ventilator",
                                  icon: "🫁",
                                },
                                {
                                  field: "has_infusion_pump",
                                  label: "Infusion Pump",
                                  icon: "💉",
                                },
                              ].map(({ field, label, icon }) => (
                                <div key={field} className="flex items-center">
                                  <Controller
                                    name={field as keyof typeof bedSchema._type}
                                    control={controlBed}
                                    render={({ field: controllerField }) => (
                                      <input
                                        type="checkbox"
                                        checked={controllerField.value}
                                        onChange={controllerField.onChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={submitting}
                                        id={field}
                                      />
                                    )}
                                  />
                                  <label
                                    htmlFor={field}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
                                  >
                                    <span className="mr-1">{icon}</span>
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div
                            className={`p-4 rounded-xl border ${
                              editingBed
                                ? "bg-gradient-to-r from-yellow-50 to-orange-100 border-amber-200"
                                : "bg-gradient-to-r from-cyan-50 to-teal-100 border-emerald-200"
                            }`}
                          >
                            <h4
                              className={`text-sm font-semibold mb-3 flex items-center ${
                                editingBed
                                  ? "text-amber-800"
                                  : "text-emerald-800"
                              }`}
                            >
                              <Star
                                className={`w-4 h-4 mr-2 ${
                                  editingBed
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              />
                              Special Features
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                              {[
                                {
                                  field: "is_bariatric",
                                  label: "Bariatric",
                                  icon: "⚖️",
                                },
                                {
                                  field: "is_isolation",
                                  label: "Isolation",
                                  icon: "🦠",
                                },
                                {
                                  field: "is_negative_pressure",
                                  label: "Negative Pressure",
                                  icon: "🌬️",
                                },
                                {
                                  field: "is_wheelchair_accessible",
                                  label: "Accessible",
                                  icon: "♿",
                                },
                              ].map(({ field, label, icon }) => (
                                <div key={field} className="flex items-center">
                                  <Controller
                                    name={field as keyof typeof bedSchema._type}
                                    control={controlBed}
                                    render={({ field: controllerField }) => (
                                      <input
                                        type="checkbox"
                                        checked={controllerField.value}
                                        onChange={controllerField.onChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={submitting}
                                        id={`feature-${field}`}
                                      />
                                    )}
                                  />
                                  <label
                                    htmlFor={`feature-${field}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
                                  >
                                    <span className="mr-1">{icon}</span>
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div
                          className={`flex space-x-3 pt-4 border-t ${
                            editingBed
                              ? "border-amber-200"
                              : "border-emerald-200"
                          }`}
                        >
                          <button
                            type="submit"
                            disabled={
                              submitting || (!selectedWard && !editingBed)
                            }
                            className={`flex-1 text-white py-3 px-4 rounded-lg font-medium hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm ${
                              editingBed
                                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:ring-amber-500"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-emerald-500"
                            }`}
                          >
                            {submitting ? (
                              <div className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                {editingBed ? "Updating..." : "Creating..."}
                              </div>
                            ) : editingBed ? (
                              <div className="flex items-center justify-center">
                                <Save className="w-5 h-5 mr-2" />
                                Update Bed
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Bed
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              resetBed();
                              setEditingBed(null);
                              setSelectedWard(null);
                              setShowBedForm(false);
                            }}
                            disabled={submitting}
                            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-8">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            editingBed
                              ? "bg-gradient-to-br from-amber-100 to-yellow-100"
                              : "bg-gradient-to-br from-emerald-100 to-teal-100"
                          }`}
                        >
                          <Bed
                            className={`w-8 h-8 ${
                              editingBed ? "text-amber-400" : "text-emerald-400"
                            }`}
                          />
                        </div>
                        <p className="text-gray-600 font-medium">
                          Please select a ward to create beds
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`rounded-xl border shadow-sm ${
                      editingBed
                        ? "bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200"
                        : "bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200"
                    }`}
                  >
                    <div
                      className={`p-5 border-b ${
                        editingBed ? "border-sky-200" : "border-blue-200"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3
                            className={`text-lg font-bold flex items-center ${
                              editingBed ? "text-sky-900" : "text-blue-900"
                            }`}
                          >
                            {editingBed ? (
                              <>
                                <Edit2 className="w-5 h-5 text-sky-600 mr-2" />
                                Edit Bed Mode
                              </>
                            ) : (
                              <>
                                <Bed className="w-5 h-5 text-blue-600 mr-2" />
                                All Beds
                              </>
                            )}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              editingBed ? "text-sky-700" : "text-blue-700"
                            }`}
                          >
                            {selectedWard
                              ? `Beds in ${selectedWard.name}`
                              : "All beds across all wards"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Ward Filter Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedWard(null)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                !selectedWard
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                              }`}
                            >
                              All Wards
                            </button>
                            {wards
                              .filter((w) => w.is_operational)
                              .slice(0, 3)
                              .map((ward) => (
                                <button
                                  key={ward.id}
                                  onClick={() => setSelectedWard(ward)}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    selectedWard?.id === ward.id
                                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                                      : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                                  }`}
                                >
                                  {ward.ward_code}
                                </button>
                              ))}
                            {wards.filter((w) => w.is_operational).length >
                              3 && (
                              <div className="relative group">
                                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-lg">
                                  +
                                  {wards.filter((w) => w.is_operational)
                                    .length - 3}{" "}
                                  more
                                </button>
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                                  {wards
                                    .filter((w) => w.is_operational)
                                    .slice(3)
                                    .map((ward) => (
                                      <button
                                        key={ward.id}
                                        onClick={() => setSelectedWard(ward)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        {ward.ward_code} - {ward.name}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Create Bed Button - Only show when not editing */}

                          <button
                            onClick={() => {
                              resetBed();
                              setEditingBed(null);
                              setShowBedForm(true);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm text-sm font-medium"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Bed
                          </button>
                        </div>
                      </div>
                    </div>

                    {beds.filter(
                      (bed) => !selectedWard || bed.ward_id === selectedWard.id
                    ).length === 0 ? (
                      <div className="p-8 text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            editingBed
                              ? "bg-gradient-to-br from-sky-100 to-cyan-100"
                              : "bg-gradient-to-br from-blue-100 to-cyan-100"
                          }`}
                        >
                          <Bed
                            className={`w-8 h-8 ${
                              editingBed ? "text-sky-400" : "text-blue-400"
                            }`}
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          No beds found
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {selectedWard
                            ? `No beds in ${selectedWard.name}. Create the first bed for this ward.`
                            : "No beds available. Create beds by selecting a ward."}
                        </p>
                        {selectedWard && (
                          <button
                            onClick={() => {
                              resetBed();
                              setShowBedForm(true);
                            }}
                            className={`inline-flex items-center px-4 py-2 text-white rounded-lg hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 shadow-sm ${
                              editingBed
                                ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 focus:ring-sky-500"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:ring-blue-500"
                            }`}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Bed
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
                          {beds
                            .filter(
                              (bed) =>
                                !selectedWard || bed.ward_id === selectedWard.id
                            )
                            .map((bed) => {
                              const statusDisplay = getBedStatusDisplay(
                                bed.display_status,
                                bed.is_booked
                              );

                              return (
                                <div
                                  key={bed.id}
                                  className={`rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                                    editingBed?.id === bed.id
                                      ? "bg-gradient-to-br from-sky-100 to-cyan-100 border-sky-300 ring-2 ring-sky-500 ring-opacity-50"
                                      : editingBed
                                      ? "bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200 hover:border-sky-300"
                                      : "bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:border-blue-300"
                                  }`}
                                >
                                  <div className="p-5">
                                    {/* Bed Header */}
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <div className="flex items-center flex-wrap gap-2 mb-2">
                                          <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getBedTypeColor(
                                              bed.bed_type
                                            )}`}
                                          >
                                            {getBedTypeIcon(bed.bed_type)}
                                            <span className="ml-1">
                                              {bed.bed_type.replace("_", " ")}
                                            </span>
                                          </span>
                                          <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusDisplay.color}`}
                                          >
                                            <div
                                              className={`w-2 h-2 rounded-full mr-2 ${statusDisplay.dotColor}`}
                                            />
                                            {statusDisplay.text}
                                          </span>
                                        </div>

                                        <div className="flex items-baseline space-x-2 mb-3">
                                          <h4
                                            className={`text-xl font-bold ${
                                              editingBed
                                                ? "text-sky-900"
                                                : "text-gray-900"
                                            }`}
                                          >
                                            {bed.bed_number}
                                          </h4>
                                          {bed.bed_label && (
                                            <span className="text-gray-600 font-medium">
                                              {bed.bed_label}
                                            </span>
                                          )}
                                        </div>

                                        {/* Ward Info */}
                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                          <Building
                                            className={`w-4 h-4 mr-2 ${
                                              editingBed
                                                ? "text-sky-500"
                                                : "text-gray-400"
                                            }`}
                                          />
                                          <span className="font-medium">
                                            {bed.wards?.name || "Unknown Ward"}
                                          </span>
                                          {bed.room_number && (
                                            <span className="mx-2">•</span>
                                          )}
                                          {bed.room_number && (
                                            <span>Room {bed.room_number}</span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => handleEditBed(bed)}
                                          className={`p-2 rounded-lg transition-colors duration-200 ${
                                            editingBed
                                              ? "text-sky-600 hover:bg-sky-100"
                                              : "text-blue-600 hover:bg-blue-100"
                                          }`}
                                          title="Edit bed"
                                          disabled={bed.is_booked}
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            confirmDeleteBed(
                                              bed.id,
                                              bed.bed_number
                                            )
                                          }
                                          className={`p-2 rounded-lg transition-colors duration-200 ${
                                            bed.is_booked
                                              ? "text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                                              : "text-red-600 hover:bg-red-100"
                                          }`}
                                          title={
                                            bed.is_booked
                                              ? "Cannot delete booked bed"
                                              : "Delete bed"
                                          }
                                          disabled={bed.is_booked}
                                        >
                                          {bed.is_booked ? (
                                            <Ban className="w-4 h-4" />
                                          ) : (
                                            <Trash2 className="w-4 h-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div
                                      className={`p-3 rounded-lg mb-4 ${
                                        editingBed
                                          ? "bg-gradient-to-r from-sky-50 to-cyan-50"
                                          : "bg-gradient-to-r from-blue-50 to-cyan-50"
                                      }`}
                                    >
                                      <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center">
                                          <div
                                            className={`text-lg font-bold ${
                                              editingBed
                                                ? "text-sky-700"
                                                : "text-blue-700"
                                            }`}
                                          >
                                            {bed.floor_number || "N/A"}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            Floor
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-lg font-bold text-gray-700">
                                            {bed.wing || "N/A"}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            Wing
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div
                                            className={`text-lg font-bold px-2 py-1 rounded ${
                                              bed.is_active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            {bed.is_active
                                              ? "Active"
                                              : "Inactive"}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            Status
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Booked Message */}
                                    {bed.is_booked && (
                                      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg">
                                        <div className="flex items-center text-sm text-purple-800">
                                          <AlertCircle className="w-4 h-4 mr-2 text-purple-600" />
                                          <span className="font-medium">
                                            This bed is booked
                                          </span>
                                        </div>
                                        <p className="text-xs text-purple-600 mt-1">
                                          Cannot edit or delete until booking is
                                          cancelled.
                                        </p>
                                      </div>
                                    )}

                                    {/* Footer */}
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                      <div className="text-xs text-gray-500">
                                        <span>ID: {bed.id.slice(0, 8)}...</span>
                                        {bed.last_maintenance && (
                                          <span className="ml-3">
                                            Last maintenance:{" "}
                                            {new Date(
                                              bed.last_maintenance
                                            ).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      <div
                                        className={`text-xs px-2 py-1 rounded ${
                                          editingBed
                                            ? "bg-sky-100 text-sky-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {bed.wards?.ward_code || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardBedManagement;