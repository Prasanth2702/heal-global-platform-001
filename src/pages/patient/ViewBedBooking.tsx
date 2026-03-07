import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Eye,
  Info,
  CheckCircle,
  AlertCircle,
  User,
  Bed,
  Stethoscope,
  ClipboardList,
  Filter,
  Search,
  PlusCircle,
  Calendar,
  Users,
  Building,
  Clock,
  ChevronRight,
  X,
  Download,
  RefreshCw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Grid,
  CalendarIcon,
  Check,
  Building2,
  LucideStethoscope,
  LucideALargeSmall,
  LoaderCircle,
  Loader,
  Database,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import {
  format,
  addDays,
  isBefore,
  startOfDay,
  parseISO,
  differenceInDays,
  isAfter,
  isWithinInterval,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  subMonths,
  addMonths,
  getDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  bedId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  agencyName: string;
  doctorName: string;
  diagnosis: string;
  startDate: string;
  endDate: string;
  status: "booked" | "processing" | "available" | "maintenance";
  notes: string;
  createdAt: string;
}

interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  bedType: "standard" | "icu" | "private" | "semi-private";
  isBooked: boolean;
  currentBookingId?: string;
}

interface Ward {
  id: string;
  name: string;
  floor: number;
  specialty: string;
  totalBeds: number;
  occupiedBeds: number;
}

// Database interfaces
interface DBBed {
  id: string;
  facility_id: string;
  ward_id: string;
  bed_number: string;
  bed_label: string;
  bed_type: string;
  room_number: string;
  floor_number: number;
  wing: string;
  current_status: string;
  status_notes: string | null;
  has_oxygen: boolean;
  has_suction: boolean;
  has_monitor: boolean;
  has_ventilator: boolean;
  has_cpip: boolean;
  has_infusion_pump: boolean;
  is_bariatric: boolean;
  is_isolation: boolean;
  is_negative_pressure: boolean;
  is_wheelchair_accessible: boolean;
  width_cm: number;
  length_cm: number;
  max_weight_kg: number;
  electrical_outlets: number;
  is_active: boolean;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_notes: string | null;
  purchase_date: string | null;
  updated_at: string | null;
  created_at: string | null;
}

interface DBWard {
  id: string;
  facility_id: string;
  ward_code: string;
  name: string;
  description: string | null;
  ward_type: string;
  floor_number: number;
  wing: string;
  phone_extension: string;
  head_nurse_id: string | null;
  total_beds: number;
  available_beds: number;
  reserved_beds: number;
  is_active: boolean;
  is_operational: boolean;
  emergency_contact: string | null;
}

interface DBBedBooking {
  id: string;
  booking_reference: string;
  facility_id: string;
  patient_id: string;
  patient_type: string;
  admission_type: string;
  primary_diagnosis: string;
  secondary_diagnosis: string | null;
  allergies: string | null;
  special_instructions: string | null;
  required_bed_type: string;
  special_requirements: string[] | null;
  priority: string;
  referring_doctor_id: string | null;
  attending_doctor_id: string | null;
  primary_nurse_id: string | null;
  assigned_bed_id: string | null;
  assigned_ward_id: string | null;
  expected_admission_date: string;
  expected_discharge_date: string;
  actual_admission_time: string | null;
  actual_discharge_time: string | null;
  status: string;
  cancellation_reason: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  insurance_verified_by: string | null;
  insurance_verified_at: string | null;
  estimated_cost: number | null;
}

interface PatientProfile {
  id: string;
  user_id: string;
  email: string;
  phone_number: string;
  role: string;
  avatar_url: string | null;
  first_name: string;
  last_name: string;
}

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export default function ViewBedBooking() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for filters
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bedTypeFilter, setBedTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("availability");

  // Calendar view states
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(
    "month"
  );
const [dataLastUpdated, setDataLastUpdated] = useState<Date | null>(null);
  // State for bookings and beds
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [dbBeds, setDbBeds] = useState<DBBed[]>([]);
  const [dbWards, setDbWards] = useState<DBWard[]>([]);
  const [dbBookings, setDbBookings] = useState<DBBedBooking[]>([]);
// Add this near your other state declarations
const [facilityName, setFacilityName] = useState<string>("");

// Add this useEffect
useEffect(() => {
  if (facilityId) {
    fetchFacilityName();
  }
}, [facilityId]);

// Add this function
const fetchFacilityName = async () => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('facility_name')
      .eq('id', facilityId)
      .single();

    if (error) {
      console.error('Error fetching facility name:', error);
      return;
    }

    if (data) {
      setFacilityName(data.facility_name);
    }
  } catch (err) {
    console.error('Error fetching facility name:', err);
  }
};
  // Bed details modal state
  const [showBedDetailsModal, setShowBedDetailsModal] = useState(false);
  const [selectedBedForDetails, setSelectedBedForDetails] =
    useState<DBBed | null>(null);

  // New booking state
  const [newBooking, setNewBooking] = useState({
    bedId: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    agencyName: "",
    doctorName: "",
    diagnosis: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    notes: "",
    expectedAdmissionDate: format(new Date(), "yyyy-MM-dd"),
    expectedDischargeDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
  });

  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bedLoading, setBedLoading] = useState(false);
  const [bookedBedIds, setBookedBedIds] = useState<string[]>([]);
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
  // Fetch beds when component loads or ward changes
// Update this useEffect to fetch beds when selectedDate changes
// useEffect(() => {
//   if (facilityId && selectedDate) {
//     if (selectedWard === "all") {
//       fetchAllBeds(selectedDate);
//     } else {
//       fetchBeds(selectedWard, selectedDate);
//     }
//   }
// }, [selectedDate, selectedWard, facilityId]);

// useEffect(() => {
//   if (facilityId ) {
//     if (selectedWard === "all") {
//       fetchAllBedsView();
//     } else {
//       fetchBedsView(selectedWard);
//     }
//   }
// }, [ selectedWard, facilityId]);
// Effect for Bed Availability Tab
useEffect(() => {
  if (facilityId && selectedDate && activeTab === "availability") {
    if (selectedWard === "all") {
      fetchAllBeds(selectedDate);
    } else {
      fetchBeds(selectedWard, selectedDate);
    }
  }
}, [selectedDate, selectedWard, facilityId, activeTab]);

// Effect for Bookings Tab
useEffect(() => {
  if (facilityId && activeTab === "bookings") {
    if (selectedWard === "all") {
      fetchAllBedsView();
    } else {
      fetchBedsView(selectedWard);
    }
  }
}, [selectedWard, facilityId, activeTab]);

// Add this helper function
const isBedDataCurrentForDate = (bedUpdatedAt: string, targetDate: Date) => {
  if (!bedUpdatedAt) return false;
  
  const bedDate = parseISO(bedUpdatedAt);
  const checkDate = startOfDay(targetDate);
  
  return isSameDay(bedDate, checkDate);
};

// Add this new function to fetch all beds
const fetchAllBeds = async (targetDate?: Date) => {
  setBedLoading(true);
  setError(null);

  // Use selectedDate if no targetDate provided
  const filterDate = targetDate || selectedDate;
  const dateStr = format(filterDate, "yyyy-MM-dd");

  try {
    // First, get all booked bed IDs
    const { data: bookings } = await supabase
      .from("bed_bookings")
      .select("assigned_bed_id")
      .eq("facility_id", facilityId)
      .in("status", ["AVAILABLE"]);

    const bookedIds =
      bookings?.map((b) => b.assigned_bed_id).filter(Boolean) || [];
    setBookedBedIds(bookedIds);

    // Fetch all beds for the facility that were updated on or after the selected date
    const { data, error } = await supabase
      .from("beds")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("is_active", true)
      .eq("current_status", "AVAILABLE")
      // Filter by updated_at date (only show beds updated for the current/selected date)
      .gte("updated_at", `${dateStr}T00:00:00`)
      .lte("updated_at", `${dateStr}T23:59:59`)
      .order("ward_id", { ascending: true })
      .order("bed_number", { ascending: true });

    if (error) {
      console.error("Error fetching all beds:", error);
      showNotification("Failed to load beds. Please try again.", "error");
      setError("Failed to load beds. Please try again.");
      setDbBeds([]);
      setBeds([]);
    } else if (data) {
      setDbBeds(data);
      setDataLastUpdated(new Date());

      // Map to UI beds
      const uiBeds = data.map((bed) => {
        const isBooked = bookedIds.includes(bed.id);
        const ward = dbWards.find((w) => w.id === bed.ward_id);

        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          wardId: bed.ward_id,
          wardName: ward?.name || "Unknown Ward",
          bedType: mapBedType(bed.bed_type),
          isBooked,
          currentBookingId: isBooked
            ? bookedIds.find((id) => id === bed.id)
            : undefined,
          updatedAt: bed.updated_at, // Add this for tracking
        };
      });
      setBeds(uiBeds);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    showNotification("An unexpected error occurred.", "error");
    setError("An unexpected error occurred.");
    setDbBeds([]);
    setBeds([]);
  } finally {
    setBedLoading(false);
  }
};
const fetchBeds = async (wardId: string, targetDate?: Date) => {
  setBedLoading(true);
  setError(null);
  
  // Use selectedDate if no targetDate provided
  const filterDate = targetDate || selectedDate;
  const dateStr = format(filterDate, 'yyyy-MM-dd');

  try {
    // First, get booked bed IDs for this ward
    const { data: bookings } = await supabase
      .from("bed_bookings")
      .select("assigned_bed_id")
      .eq("assigned_ward_id", wardId)
      .in("status", ["AVAILABLE"]);

    const bookedIds = bookings?.map((b) => b.assigned_bed_id).filter(Boolean) || [];
    setBookedBedIds(bookedIds);

    // Fetch all beds for this ward with date filter
    const { data, error } = await supabase
      .from("beds")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("ward_id", wardId)
      .eq("is_active", true)
      .eq("current_status", "AVAILABLE")
      // Add date filter for updated_at
      .gte('updated_at', `${dateStr}T00:00:00`)
      .lte('updated_at', `${dateStr}T23:59:59`)
      .order("bed_number", { ascending: true });

    if (error) {
      console.error("Error fetching beds:", error);
      showNotification("Failed to load beds. Please try again.", "error");
      setError("Failed to load beds. Please try again.");
      setDbBeds([]);
      setBeds([]);
    } else if (data) {
      setDbBeds(data);
      setDataLastUpdated(new Date());

      // Map to UI beds
      const uiBeds = data.map((bed) => {
        const isBooked = bookedIds.includes(bed.id);
        const ward = dbWards.find((w) => w.id === bed.ward_id);

        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          wardId: bed.ward_id,
          wardName: ward?.name || "Unknown Ward",
          bedType: mapBedType(bed.bed_type),
          isBooked,
          currentBookingId: isBooked
            ? bookedIds.find((id) => id === bed.id)
            : undefined,
          updatedAt: bed.updated_at
        };
      });
      setBeds(uiBeds);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    showNotification("An unexpected error occurred.", "error");
    setError("An unexpected error occurred.");
    setDbBeds([]);
    setBeds([]);
  } finally {
    setBedLoading(false);
  }
};
const fetchAllBedsView = async () => {
  setBedLoading(true);
  setError(null);

  try {
    // First, get all booked bed IDs
    const { data: bookings } = await supabase
      .from("bed_bookings")
      .select("assigned_bed_id")
      .eq("facility_id", facilityId)
      .in("status", ["AVAILABLE"]);

    const bookedIds =
      bookings?.map((b) => b.assigned_bed_id).filter(Boolean) || [];
    setBookedBedIds(bookedIds);

    // Fetch all beds for the facility that were updated on or after the selected date
    const { data, error } = await supabase
      .from("beds")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("is_active", true)
      .eq("current_status", "AVAILABLE")
      .order("ward_id", { ascending: true })
      .order("bed_number", { ascending: true });

    if (error) {
      console.error("Error fetching all beds:", error);
      showNotification("Failed to load beds. Please try again.", "error");
      setError("Failed to load beds. Please try again.");
      setDbBeds([]);
      setBeds([]);
    } else if (data) {
      setDbBeds(data);
      setDataLastUpdated(new Date());

      // Map to UI beds
      const uiBeds = data.map((bed) => {
        const isBooked = bookedIds.includes(bed.id);
        const ward = dbWards.find((w) => w.id === bed.ward_id);

        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          wardId: bed.ward_id,
          wardName: ward?.name || "Unknown Ward",
          bedType: mapBedType(bed.bed_type),
          isBooked,
          currentBookingId: isBooked
            ? bookedIds.find((id) => id === bed.id)
            : undefined,
        };
      });
      setBeds(uiBeds);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    showNotification("An unexpected error occurred.", "error");
    setError("An unexpected error occurred.");
    setDbBeds([]);
    setBeds([]);
  } finally {
    setBedLoading(false);
  }
};
const fetchBedsView = async (wardId: string) => {
  setBedLoading(true);
  setError(null);
  

  try {
    // First, get booked bed IDs for this ward
    const { data: bookings } = await supabase
      .from("bed_bookings")
      .select("assigned_bed_id")
      .eq("assigned_ward_id", wardId)
      .in("status", ["AVAILABLE"]);

    const bookedIds = bookings?.map((b) => b.assigned_bed_id).filter(Boolean) || [];
    setBookedBedIds(bookedIds);

    // Fetch all beds for this ward with date filter
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
      showNotification("Failed to load beds. Please try again.", "error");
      setError("Failed to load beds. Please try again.");
      setDbBeds([]);
      setBeds([]);
    } else if (data) {
      setDbBeds(data);
      setDataLastUpdated(new Date());

      // Map to UI beds
      const uiBeds = data.map((bed) => {
        const isBooked = bookedIds.includes(bed.id);
        const ward = dbWards.find((w) => w.id === bed.ward_id);

        return {
          id: bed.id,
          bedNumber: bed.bed_number,
          wardId: bed.ward_id,
          wardName: ward?.name || "Unknown Ward",
          bedType: mapBedType(bed.bed_type),
          isBooked,
          currentBookingId: isBooked
            ? bookedIds.find((id) => id === bed.id)
            : undefined,
        };
      });
      setBeds(uiBeds);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    showNotification("An unexpected error occurred.", "error");
    setError("An unexpected error occurred.");
    setDbBeds([]);
    setBeds([]);
  } finally {
    setBedLoading(false);
  }
};

  // Generate calendar dates for the current month
  const generateCalendarDates = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    // Add padding days from previous month
    const startDay = getDay(start);
    const paddedDays: CalendarDate[] = [];

    // Add previous month's days
    for (let i = 0; i < startDay; i++) {
      const date = addDays(start, -(startDay - i));
      paddedDays.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
      });
    }

    // Add current month's days
    days.forEach((day) => {
      paddedDays.push({
        date: day,
        isCurrentMonth: true,
        isToday: isToday(day),
        isSelected: isSameDay(day, selectedDate),
      });
    });

    // Add next month's days to complete the grid (42 cells total)
    const totalCells = 42;
    const remaining = totalCells - paddedDays.length;
    for (let i = 1; i <= remaining; i++) {
      const date = addDays(end, i);
      paddedDays.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
      });
    }

    return paddedDays;
  };

  // Initialize calendar
  useEffect(() => {
    setCalendarDates(generateCalendarDates(currentMonth));
  }, [currentMonth, selectedDate]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Navigate to previous week
  const prevWeek = () => {
    setCurrentMonth(subWeeks(currentMonth, 1));
  };

  // Navigate to next week
  const nextWeek = () => {
    setCurrentMonth(addWeeks(currentMonth, 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // If a bed is selected, show its details for this date
    if (selectedBedForDetails) {
      fetchBedDetailsForDate(selectedBedForDetails.id, date);
    }
  };

  // Fetch bed details for a specific date
  const fetchBedDetailsForDate = async (bedId: string, date: Date) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd");

      // Fetch bookings for this bed on the selected date
      const { data: bookingsOnDate, error } = await supabase
        .from("bed_bookings")
        .select("*")
        .eq("assigned_bed_id", bedId)
        .eq("current_status", ["AVAILABLE"])
        .lte("expected_admission_date", dateStr)
        .gte("expected_discharge_date", dateStr);

      if (error) {
        console.error("Error fetching bookings for date:", error);
      } else {
        // Update bed details with booking info for this date
        console.log("Bookings for selected date:", bookingsOnDate);
      }
    } catch (err) {
      console.error("Error fetching bed details for date:", err);
    }
  };

  // Get bed availability status for a specific date
  const getBedStatusForDate = (bedId: string, date: Date) => {
    const booking = dbBookings.find((b) => {
      if (b.assigned_bed_id !== bedId) return false;
      if (!b.expected_admission_date || !b.expected_discharge_date) return false;
      let startDate: Date, endDate: Date;
      try {
        startDate = parseISO(b.expected_admission_date);
        endDate = parseISO(b.expected_discharge_date);
      } catch {
        return false;
      }
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
    return booking ? booking.status : "AVAILABLE";
  };

  // Get color for availability status
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OCCUPIED":
        return "bg-red-100 text-red-800 border-red-200";
      case "MAINTENANCE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CLEANING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OUT_OF_SERVICE":
        return "bg-gray-300 text-gray-800 border-gray-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get bed status text
  const getBedStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "RESERVED":
        return "Reserved";
      case "OCCUPIED":
        return "Occupied";
      case "MAINTENANCE":
        return "Maintenance";
      case "CLEANING":
        return "Cleaning";
      case "OUT_OF_SERVICE":
        return "Out of Service";
      default:
        return "Unknown";
    }
  };

  // Open bed details modal
  const openBedDetailsModal = async (bed: DBBed, date?: Date) => {
    setSelectedBedForDetails(bed);
    if (date) {
      setSelectedDate(date);
      await fetchBedDetailsForDate(bed.id, date);
    }
    setShowBedDetailsModal(true);
  };
  const openBedDetailsModalBed = async (bed: DBBed) => {
    setSelectedBedForDetails(bed);
    setShowBedDetailsModal(true);
  };

  // Notification function
  const showNotification = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      variant: type === "error" ? "destructive" : "default",
    });
  };

  // Fetch wards on component mount
  useEffect(() => {
    if (facilityId) {
      fetchWards();
    } else {
      setError("Facility ID is missing");
      setLoading(false);
    }
  }, [facilityId]);

  // Fetch beds when ward is selected
  useEffect(() => {
    if (selectedWard !== "all") {
      fetchBeds(selectedWard);
    }
  }, [selectedWard]);

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
        showNotification("Failed to load wards. Please try again.", "error");
        setError("Failed to load wards. Please try again.");
      } else if (data) {
        // Filter wards to only show those with available beds
        const wardsWithAvailableBeds = data.filter(
          (ward) => ward.available_beds > 0
        );
        setDbWards(wardsWithAvailableBeds);

        // Map to UI wards
        const uiWards = wardsWithAvailableBeds.map((ward) => ({
          id: ward.id,
          name: ward.name,
          floor: ward.floor_number,
          specialty: ward.ward_type,
          totalBeds: ward.total_beds,
          occupiedBeds: ward.total_beds - ward.available_beds,
        }));
        setWards(uiWards);

        // Also fetch active bookings for date validation
        fetchBookings();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      showNotification("An unexpected error occurred.", "error");
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bed_bookings")
        .select("*")
        .eq("facility_id", facilityId)
        .in("status", ["AVAILABLE"]);

      if (error) {
        console.error("Error fetching bookings:", error);
      } else if (data) {
        setDbBookings(data);

        // Map to UI bookings
        const uiBookings = data.map((booking) => ({
          id: booking.id,
          bedId: booking.assigned_bed_id || "",
          patientName: "Patient", // We'll need to fetch patient names separately
          patientAge: 0,
          patientGender: "",
          agencyName: booking.insurance_provider || "",
          doctorName: "",
          diagnosis: booking.primary_diagnosis,
          startDate: booking.expected_admission_date,
          endDate: booking.expected_discharge_date,
          status: mapBookingStatus(booking.status),
          notes: booking.special_instructions || "",
          createdAt: booking.expected_admission_date,
        }));
        setBookings(uiBookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

 const mapBedType = (
    dbType: string
  ): "standard" | "icu" | "private" | "semi-private" => {
    switch (dbType) {
      case "ICU":
      case "CCU":
      case "NICU":
      case "PICU":
        return "icu";
      case "PRIVATE":
        return "private";
      case "SEMI_PRIVATE":
        return "semi-private";
      default:
        return "standard";
    }
  };

  // Helper function to map database booking status to UI status
  const mapBookingStatus = (
    dbStatus: string
  ): "booked" | "processing" | "available" | "maintenance" => {
    switch (dbStatus) {
      case "CONFIRMED":
      case "CHECKED_IN":
      case "RESERVED":
        return "booked";
      case "AVAILABLE":
        return "available";
      default:
        return "available";
    }
  };

  // Filter beds based on selected ward
  const filteredBeds = beds.filter((bed) => {
    const matchesWard = selectedWard === "all" || bed.wardId === selectedWard;
    const matchesType =
      bedTypeFilter === "all" || bed.bedType === bedTypeFilter;
    const matchesSearch =
      !searchTerm ||
      bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.wardName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesWard && matchesType && matchesSearch;
  });

  // Calculate occupancy rate
  const getOccupancyRate = (wardId: string) => {
    const ward = wards.find((w) => w.id === wardId);
    if (!ward) return 0;
    return Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
  };

  // Check if a bed is booked for the selected date range
  const isBedBookedForDateRange = (bedId: string, start: Date, end: Date) => {
    const bedBookings = dbBookings.filter(
      (booking) =>
        booking.assigned_bed_id === bedId &&
        ["AVAILABLE", "RESERVED"].includes(booking.status)
    );

    return bedBookings.some((booking) => {
      if (!booking.expected_admission_date || !booking.expected_discharge_date) return false;
      let bookingStart: Date, bookingEnd: Date;
      try {
        bookingStart = parseISO(booking.expected_admission_date);
        bookingEnd = parseISO(booking.expected_discharge_date);
      } catch {
        return false;
      }
      // Check for date overlap
      return (
        (start <= bookingEnd && end >= bookingStart) ||
        (start >= bookingStart && start <= bookingEnd) ||
        (end >= bookingStart && end <= bookingEnd)
      );
    });
  };

  // Check if bed is available for the expected admission and discharge dates
  const isBedAvailableForDates = (
    bedId: string,
    admissionDate: string,
    dischargeDate: string
  ) => {
    const admission = parseISO(admissionDate);
    const discharge = parseISO(dischargeDate);

    return !isBedBookedForDateRange(bedId, admission, discharge);
  };

  // Get booking details for a specific bed and date
  const getBookingForBedAndDate = (bedId: string, date: Date) => {
    return dbBookings.find((booking) => {
      if (booking.assigned_bed_id !== bedId) return false;
      if (!booking.expected_admission_date || !booking.expected_discharge_date) return false;
      let bookingStart: Date, bookingEnd: Date;
      try {
        bookingStart = parseISO(booking.expected_admission_date);
        bookingEnd = parseISO(booking.expected_discharge_date);
      } catch {
        return false;
      }
      const checkDate = startOfDay(date);
      return (
        checkDate >= startOfDay(bookingStart) &&
        checkDate <= startOfDay(bookingEnd)
      );
    });
  };



const handleBookBed = async ( bedId: string,wardId:string ,facilityName: string) => {
  try {
    if (!selectedWard) {
      showNotification("Please select a ward first", "warning"); // Added second argument
      return;
    }

    navigate(
      `/dashboard/patient/bookregister/${createSlug(facilityName)}/${facilityId}/${wardId}/${bedId}`
    );
  } catch (err) {
    console.error("Error booking bed:", err);
    showNotification("Failed to book bed. Please try again.", "error"); // Added second argument
  }
};

  // Initialize booking with selected bed
  const openBookingDialog = (bed: Bed) => {
    setSelectedBed(bed);
    setNewBooking({
      ...newBooking,
      bedId: bed.id,
      startDate: format(selectedDate, "yyyy-MM-dd"),
      endDate: format(addDays(selectedDate, 3), "yyyy-MM-dd"),
      expectedAdmissionDate: format(selectedDate, "yyyy-MM-dd"),
      expectedDischargeDate: format(addDays(selectedDate, 3), "yyyy-MM-dd"),
    });
    setShowBookingDialog(true);
  };

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "booked":
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: "Booked",
        };
      case "processing":
        return {
          variant: "secondary" as const,
          icon: <ClipboardList className="h-3 w-3 mr-1" />,
          label: "Processing",
        };
      case "available":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Available",
        };
      case "maintenance":
        return {
          variant: "outline" as const,
          icon: <Info className="h-3 w-3 mr-1" />,
          label: "Maintenance",
        };
      default:
        return {
          variant: "outline" as const,
          icon: <Info className="h-3 w-3 mr-1" />,
          label: "Unknown",
        };
    }
  };

  // Get bed type badge color
  const getBedTypeInfo = (type: string) => {
    switch (type) {
      case "icu":
        return {
          color: "bg-purple-500/10 text-purple-700 border-purple-200",
          icon: "⚕️",
          label: "ICU",
        };
      case "private":
        return {
          color: "bg-blue-500/10 text-blue-700 border-blue-200",
          icon: "👑",
          label: "Private",
        };
      case "semi-private":
        return {
          color: "bg-teal-500/10 text-teal-700 border-teal-200",
          icon: "👥",
          label: "Semi-Private",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-700 border-gray-200",
          icon: "🛏️",
          label: "Standard",
        };
    }
  };

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <DashboardLayout userType="patient">
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto p-4 lg:p-6">
          {/* Header with Back Button */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bed Bookings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage bed availability, view bookings, and schedule
                  reservations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">
                  {format(new Date(), "MMM dd, yyyy")}
                </span>
              </div>
             <Button
  variant="outline"
  className="gap-2"
  onClick={() => {
    // Force refresh for current selected date
    if (selectedWard === "all") {
      fetchAllBeds(selectedDate);
      fetchAllBedsView();
    } else {
      fetchBeds(selectedWard, selectedDate);
      fetchBedsView(selectedWard);
    }
    showNotification(`Refreshed bed data for ${format(selectedDate, "MMM dd")}`, "info");
  }}
>
  <RefreshCw className="h-4 w-4" />
  Refresh Current Date
</Button>
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading wards...</p>
              </CardContent>
            </Card>
          )}

          {error && !loading && (
            <Card className="mb-6 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => facilityId && fetchWards()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Total Beds
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {beds.length}
                        </h3>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Bed className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Available</span>
                        <span className="font-medium text-gray-900">
                          {beds.filter((b) => !b.isBooked).length} beds
                        </span>
                      </div>
                      <Progress
                        value={
                          (beds.filter((b) => !b.isBooked).length /
                            beds.length) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">
                          Active Bookings
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {bookings.length}
                        </h3>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600">
                          {bookings.filter((b) => b.status === "booked").length}{" "}
                          Confirmed
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-gray-600">
                          {
                            bookings.filter((b) => b.status === "processing")
                              .length
                          }{" "}
                          Processing
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">
                          Wards
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {wards.length}
                        </h3>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Building className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Highest Occupancy
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {wards.length > 0
                            ? wards.reduce((prev, current) =>
                                prev.occupiedBeds / prev.totalBeds >
                                current.occupiedBeds / current.totalBeds
                                  ? prev
                                  : current
                              ).name
                            : "No wards"}
                        </span>
                        {wards.length > 0 && (
                          <Badge variant="outline" className="bg-white">
                            {Math.max(
                              ...wards.map((w) => getOccupancyRate(w.id))
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-700">
                          Today's Bookings
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {
                            bookings.filter(
                              (b) =>
                                format(parseISO(b.createdAt), "yyyy-MM-dd") ===
                                format(new Date(), "yyyy-MM-dd")
                            ).length
                          }
                        </h3>
                      </div>
                      <div className="p-3 bg-amber-100 rounded-full">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                        onClick={() => setActiveTab("calendar")}
                      >
                        <span>View Calendar</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
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
                        <Label>Search Beds</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search by bed number or ward..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Ward Selection</Label>
                        <Select
                          value={selectedWard}
                          onValueChange={setSelectedWard}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Ward" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Wards</SelectItem>
                            {dbWards.map((ward) => (
                              <SelectItem key={ward.id} value={ward.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{ward.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {ward.available_beds}/{ward.total_beds}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

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

                      <div className="space-y-2">
                        <Label>Bed Type</Label>
                        <Select
                          value={bedTypeFilter}
                          onValueChange={setBedTypeFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="icu">ICU</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="semi-private">
                              Semi-Private
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">From</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(startDate, "MMM dd")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={startDate}
                                  onSelect={(date) =>
                                    date && setStartDate(date)
                                  }
                                  disabled={(date) =>
                                    isBefore(date, startOfDay(new Date()))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">To</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {format(endDate, "MMM dd")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={endDate}
                                  onSelect={(date) => date && setEndDate(date)}
                                  disabled={(date) => isBefore(date, startDate)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedWard("all");
                          setBedTypeFilter("all");
                          setSearchTerm("");
                          setStartDate(new Date());
                          setEndDate(addDays(new Date(), 7));
                          setSelectedDate(new Date());
                          setCurrentMonth(new Date());
                          showNotification("Filters cleared", "info");
                        }}
                      >
                        Clear Filters
                      </Button>
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
                        <TabsTrigger value="booking">
                          Active Bookings
                        </TabsTrigger>
                        <TabsTrigger value="calendar">
                          Calendar View
                        </TabsTrigger>
                      </TabsList>

                      <Button
                        className="gap-2"
                        onClick={() => {
                          // Find first available bed
                          setActiveTab("bookings");
                          const availableBed = beds.find((b) => !b.isBooked);
                          if (availableBed) {
                            openBookingDialog(availableBed);
                          } else {
                            showNotification(
                              "No available beds at the moment",
                              "warning"
                            );
                          }
                        }}
                      >
                        <PlusCircle className="h-4 w-4" />
                        Quick Book
                      </Button>
                    </div>

                    {/* Bed Availability Tab */}
                    {/* <TabsContent value="availability" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Available Beds</CardTitle>
                          <CardDescription>
                            {bedLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                Loading beds...
                              </div>
                            ) : (
                              `Showing ${filteredBeds.length} beds for selected criteria`
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {filteredBeds.length === 0 ? (
                            <div className="text-center py-8">
                              <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="font-semibold text-gray-700">
                                No beds found
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                Try adjusting your filters or select a different
                                ward
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {filteredBeds.map((bed) => {
                                const bookingForSelectedDate =
                                  getBookingForBedAndDate(bed.id, selectedDate);
                                const isBookedForRange =
                                  isBedBookedForDateRange(
                                    bed.id,
                                    startDate,
                                    endDate
                                  );
                                const statusInfo = getStatusInfo(
                                  bookingForSelectedDate
                                    ? mapBookingStatus(
                                        bookingForSelectedDate.status
                                      )
                                    : isBookedForRange
                                    ? "booked"
                                    : "available"
                                );
                                const bedTypeInfo = getBedTypeInfo(bed.bedType);
                                const dbBed = dbBeds.find(
                                  (b) => b.id === bed.id
                                );
                                const ward = dbWards.find(
                                  (w) => w.id === bed.wardId
                                );

                                return (
                                  <Card
                                    key={bed.id}
                                    className={`overflow-hidden border ${
                                      bed.isBooked || isBookedForRange
                                        ? "border-red-200"
                                        : "border-green-200"
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <div
                                              className={`p-2 rounded-lg ${bedTypeInfo.color}`}
                                            >
                                              <span>{bedTypeInfo.icon}</span>
                                            </div>
                                            <div>
                                              <h3 className="font-bold text-lg">
                                                Bed {bed.bedNumber}
                                              </h3>
                                              <p className="text-sm text-gray-600">
                                                {bed.wardName}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="space-y-1 mb-3">
                                            <div className="flex items-center text-sm">
                                              <Building className="h-3 w-3 mr-2 text-gray-400" />
                                              <span>
                                                Floor{" "}
                                                {ward?.floor_number ||
                                                  bed.wardId}{" "}
                                                • {ward?.ward_type || "General"}
                                              </span>
                                            </div>
                                            {dbBed && (
                                              <>
                                                <div className="flex items-center text-sm">
                                                  <Stethoscope className="h-3 w-3 mr-2 text-gray-400" />
                                                  <span>
                                                    {dbBed.room_number &&
                                                      `Room ${dbBed.room_number}`}
                                                    {dbBed.wing &&
                                                      ` • ${dbBed.wing} Wing`}
                                                  </span>
                                                </div>
                                                {dbBed.has_oxygen && (
                                                  <div className="flex items-center text-sm">
                                                    <Info className="h-3 w-3 mr-2 text-blue-400" />
                                                    <span className="text-blue-600">
                                                      Oxygen Available
                                                    </span>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <Badge
                                          variant={statusInfo.variant}
                                          className="gap-1"
                                        >
                                          {statusInfo.icon}
                                          {statusInfo.label}
                                        </Badge>
                                      </div>

                                      {bookingForSelectedDate ? (
                                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                          <div className="flex items-center gap-2 mb-1">
                                            <User className="h-3 w-3 text-yellow-600" />
                                            <span className="text-sm font-medium">
                                              Booked
                                            </span>
                                          </div>
                                          <div className="text-xs text-yellow-700">
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_admission_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}{" "}
                                            -{" "}
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_discharge_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="mt-2 text-xs"
                                          >
                                            {bookingForSelectedDate.status}
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="text-sm font-medium text-green-700 mb-1">
                                            Available for booking
                                          </div>
                                          <div className="text-xs text-green-600">
                                            No conflicts for selected dates
                                          </div>
                                        </div>
                                      )}

                                      <div className="mt-4 flex gap-2">
                                        <Button
                                          size="sm"
                                          className="flex-1"
                                          onClick={() => openBookingDialog(bed)}
                                          disabled={
                                            isBookedForRange ||
                                            bed.isBooked ||
                                            isBefore(
                                              selectedDate,
                                              startOfDay(new Date())
                                            )
                                          }
                                        >
                                          {bed.isBooked
                                            ? "Already Booked"
                                            : "Book Now"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            dbBed &&
                                            openBedDetailsModal(
                                              dbBed,
                                              selectedDate
                                            )
                                          }
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent> */}
                    {/* Bed Availability Tab */}
                    <TabsContent value="availability" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Bed Availability</CardTitle>
                          <CardDescription>
                            {bedLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                Loading beds...
                              </div>
                            ) : (
                              `Showing ${filteredBeds.length} beds for selected criteria`
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {filteredBeds.length === 0 ? (
                            <div className="text-center py-8">
                              <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="font-semibold text-gray-700">
                                No beds found
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                Try adjusting your filters or select a different
                                ward
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {filteredBeds.map((bed) => {
                                const bookingForSelectedDate =
                                  getBookingForBedAndDate(bed.id, selectedDate);
                                const isBookedForRange =
                                  isBedBookedForDateRange(
                                    bed.id,
                                    startDate,
                                    endDate
                                  );
                                const statusInfo = getStatusInfo(
                                  bookingForSelectedDate
                                    ? mapBookingStatus(
                                        bookingForSelectedDate.status
                                      )
                                    : isBookedForRange
                                    // ? "booked"
                                    ? "available"
                                    : "available"
                                );
                                const bedTypeInfo = getBedTypeInfo(bed.bedType);
                                const dbBed = dbBeds.find(
                                  (b) => b.id === bed.id
                                );
                                const ward = dbWards.find(
                                  (w) => w.id === bed.wardId
                                );

                                return (
                                  <Card
                                    key={bed.id}
                                    className={`overflow-hidden border ${
                                      bed.isBooked || isBookedForRange
                                        ? "border-red-200"
                                        : "border-green-200"
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <div
                                              className={`p-2 rounded-lg ${bedTypeInfo.color}`}
                                            >
                                              <span>{bedTypeInfo.icon}</span>
                                            </div>
                                            <div>
                                              <h3 className="font-bold text-lg">
                                                Bed {bed.bedNumber}
                                              </h3>
                                              <p className="text-sm text-gray-600">
                                                {bed.wardName}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="space-y-1 mb-3">
                                            <div className="flex items-center text-sm">
                                              <Building className="h-3 w-3 mr-2 text-gray-400" />
                                              <span>
                                                Floor{" "}
                                                {ward?.floor_number ||
                                                  bed.wardId}{" "}
                                              </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                              <Building2 className="h-3 w-3 mr-2 text-gray-400" />
                                              <span>
                                                {ward?.ward_type || "General"}
                                              </span>
                                            </div>
                                            {dbBed && (
                                              <>
                                                <div className="flex items-center text-sm">
                                                  <Stethoscope className="h-3 w-3 mr-2 text-gray-400" />
                                                  <span>
                                                    {dbBed.room_number &&
                                                      `Room Number : ${dbBed.room_number}`}
                                                  </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                  <Loader className="h-3 w-3 mr-2 text-gray-400" />
                                                  <span>
                                                    {dbBed.wing &&
                                                      `Wing : ${dbBed.wing} `}
                                                  </span>
                                                </div>
                                                {dbBed.has_oxygen && (
                                                  <div className="flex items-center text-sm">
                                                    <Info className="h-3 w-3 mr-2 text-blue-400" />
                                                    <span className="text-blue-600">
                                                      Oxygen Available
                                                    </span>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <Badge
                                          variant={statusInfo.variant}
                                          className="gap-1"
                                        >
                                          {statusInfo.icon}
                                          {statusInfo.label}
                                        </Badge>
                                      </div>

                                      {bookingForSelectedDate ? (
                                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                          <div className="flex items-center gap-2 mb-1">
                                            <User className="h-3 w-3 text-yellow-600" />
                                            <span className="text-sm font-medium">
                                              Booked
                                            </span>
                                          </div>
                                          <div className="text-xs text-yellow-700">
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_admission_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}{" "}
                                            -{" "}
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_discharge_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="mt-2 text-xs"
                                          >
                                            {bookingForSelectedDate.status}
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="text-sm font-medium text-green-700 mb-1">
                                            Available for booking
                                          </div>
                                          <div className="text-xs text-green-600">
                                            No conflicts for selected dates
                                          </div>
                                        </div>
                                      )}

                                      <div className="mt-4 flex gap-2">
                                        <Button
                                          size="sm"
                                          className="flex-1"
                                          // onClick={() => openBookingDialog(bed)}
                                            onClick={() => handleBookBed(bed.id, ward.id, facilityName)}
                                          // disabled={
                                          //   isBookedForRange ||
                                          //   bed.isBooked ||
                                          //   isBefore(
                                          //     selectedDate,
                                          //     startOfDay(new Date())
                                          //   )
                                          // }
                                        >
                                          {bed.isBooked
                                            ? "Already Booked"
                                            : "Book Now"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            dbBed &&
                                            openBedDetailsModal(
                                              dbBed,
                                              selectedDate
                                            )
                                          }
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="bookings" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Bed Bookings</CardTitle>
                          <CardDescription>
                            {bedLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                Loading beds...
                              </div>
                            ) : (
                              `Showing ${filteredBeds.length} beds for selected criteria`
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {filteredBeds.length === 0 ? (
                            <div className="text-center py-8">
                              <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="font-semibold text-gray-700">
                                No beds found
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                Try adjusting your filters or select a different
                                ward
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {filteredBeds.map((bed) => {
                                const bookingForSelectedDate =
                                  getBookingForBedAndDate(bed.id, selectedDate);
                                const isBookedForRange =
                                  isBedBookedForDateRange(
                                    bed.id,
                                    startDate,
                                    endDate
                                  );
                                const statusInfo = getStatusInfo(
                                  bookingForSelectedDate
                                    ? mapBookingStatus(
                                        bookingForSelectedDate.status
                                      )
                                    : isBookedForRange
                                    // ? "booked"
                                    ? "available"
                                    : "available"
                                );
                                const bedTypeInfo = getBedTypeInfo(bed.bedType);
                                const dbBed = dbBeds.find(
                                  (b) => b.id === bed.id
                                );
                                const ward = dbWards.find(
                                  (w) => w.id === bed.wardId
                                );

                                return (
                                  <Card
                                    key={bed.id}
                                    className={`overflow-hidden border ${
                                      bed.isBooked || isBookedForRange
                                        ? "border-red-200"
                                        : "border-green-200"
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <div
                                              className={`p-2 rounded-lg ${bedTypeInfo.color}`}
                                            >
                                              <span>{bedTypeInfo.icon}</span>
                                            </div>
                                            <div>
                                              <h3 className="font-bold text-lg">
                                                Bed {bed.bedNumber}
                                              </h3>
                                              <p className="text-sm text-gray-600">
                                                {bed.wardName}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="space-y-1 mb-3">
                                            <div className="flex items-center text-sm">
                                              <Building className="h-3 w-3 mr-2 text-gray-400" />
                                              <span>
                                                Floor{" "}
                                                {ward?.floor_number ||
                                                  bed.wardId}{" "}
                                              </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                              <Building2 className="h-3 w-3 mr-2 text-gray-400" />
                                              <span>
                                                {ward?.ward_type || "General"}
                                              </span>
                                            </div>
                                            {dbBed && (
                                              <>
                                                <div className="flex items-center text-sm">
                                                  <Stethoscope className="h-3 w-3 mr-2 text-gray-400" />
                                                  <span>
                                                    {dbBed.room_number &&
                                                      `Room Number : ${dbBed.room_number}`}
                                                  </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                  <Loader className="h-3 w-3 mr-2 text-gray-400" />
                                                  <span>
                                                    {dbBed.wing &&
                                                      `Wing : ${dbBed.wing} `}
                                                  </span>
                                                </div>
                                                <div className="flex items-center text-sm">
  <Database className="h-3 w-3 mr-2 text-gray-400" />
  <span>
    {dbBed.created_at 
      ? `Date : ${format(parseISO(dbBed.created_at), "MMM dd, yyyy")}` 
      : "Date : Not available"}
  </span>
</div>
                                                {dbBed.has_oxygen && (
                                                  <div className="flex items-center text-sm">
                                                    <Info className="h-3 w-3 mr-2 text-blue-400" />
                                                    <span className="text-blue-600">
                                                      Oxygen Available
                                                    </span>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <Badge
                                          variant={statusInfo.variant}
                                          className="gap-1"
                                        >
                                          {statusInfo.icon}
                                          {statusInfo.label}
                                        </Badge>
                                      </div>

                                      {bookingForSelectedDate ? (
                                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                          <div className="flex items-center gap-2 mb-1">
                                            <User className="h-3 w-3 text-yellow-600" />
                                            <span className="text-sm font-medium">
                                              Booked
                                            </span>
                                          </div>
                                          <div className="text-xs text-yellow-700">
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_admission_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}{" "}
                                            -{" "}
                                            {format(
                                              parseISO(
                                                bookingForSelectedDate.expected_discharge_date
                                              ),
                                              "MMM dd, yyyy"
                                            )}
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="mt-2 text-xs"
                                          >
                                            {bookingForSelectedDate.status}
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="text-sm font-medium text-green-700 mb-1">
                                            Available for booking
                                          </div>
                                          <div className="text-xs text-green-600">
                                            No conflicts for selected dates
                                          </div>
                                        </div>
                                      )}

                                      <div className="mt-4 flex gap-2">
                                        <Button
                                          size="sm"
                                          className="flex-1"
                                          // onClick={() => openBookingDialog(bed)}
                                            onClick={() => handleBookBed(bed.id, ward.id, facilityName)}
                                          // disabled={
                                          //   isBookedForRange ||
                                          //   bed.isBooked ||
                                          //   isBefore(
                                          //     selectedDate,
                                          //     startOfDay(new Date())
                                          //   )
                                          // }
                                        >
                                          {bed.isBooked
                                            ? "Already Booked"
                                            : "Book Now"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            dbBed &&
                                            openBedDetailsModal(
                                              dbBed,
                                              selectedDate
                                            )
                                          }
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    

                    {/* Calendar View Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>Bed Calendar View</CardTitle>
                              <CardDescription>
                                Click on a date to view bed availability for
                                that day
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span className="text-xs">Available</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <span className="text-xs">Occupied</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <span className="text-xs">Reserved</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Calendar Navigation */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={prevMonth}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <h2 className="text-xl font-bold">
                                {format(currentMonth, "MMMM yyyy")}
                              </h2>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={nextMonth}
                              >
                                <ChevronRightIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={
                                  selectedDate && isToday(selectedDate)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  const today = new Date();
                                  setSelectedDate(today);
                                  setCurrentMonth(today);
                                }}
                              >
                                Today
                              </Button>
                            </div>
                          </div>

                          {/* Calendar Grid */}
                          <div className="border rounded-lg overflow-hidden">
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 bg-gray-50 border-b">
                              {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                              ].map((day) => (
                                <div
                                  key={day}
                                  className="p-3 text-center text-sm font-medium text-gray-600"
                                >
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7">
                              {calendarDates.map((dateObj, index) => {
                                // Get beds for this date
                                const bedsForDate = dbBeds.map((bed) => {
                                  const status = getBedStatusForDate(
                                    bed.id,
                                    dateObj.date
                                  );
                                  return {
                                    bed,
                                    status,
                                  };
                                });

                                const availableBeds = bedsForDate.filter(
                                  (b) => b.status === "AVAILABLE"
                                ).length;
                                const occupiedBeds = bedsForDate.filter(
                                  (b) => b.status === "OCCUPIED"
                                ).length;
                                const reservedBeds = bedsForDate.filter(
                                  (b) => b.status === "RESERVED"
                                ).length;
                                const totalBeds = bedsForDate.length;

                                return (
                                  <div
                                    key={index}
                                    className={`
                                      min-h-[100px] border p-2 cursor-pointer transition-all
                                      ${
                                        dateObj.isCurrentMonth
                                          ? "bg-white"
                                          : "bg-gray-50"
                                      }
                                      ${
                                        dateObj.isToday
                                          ? "border-blue-300"
                                          : "border-gray-200"
                                      }
                                      ${
                                        dateObj.isSelected
                                          ? "bg-blue-50 border-blue-400"
                                          : ""
                                      }
                                      hover:bg-gray-50
                                    `}
                                    onClick={() =>
                                      handleDateSelect(dateObj.date)
                                    }
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span
                                        className={`
                                        text-sm font-medium
                                        ${
                                          dateObj.isToday
                                            ? "text-blue-600"
                                            : "text-gray-700"
                                        }
                                        ${
                                          !dateObj.isCurrentMonth
                                            ? "text-gray-400"
                                            : ""
                                        }
                                        ${dateObj.isSelected ? "font-bold" : ""}
                                      `}
                                      >
                                        {format(dateObj.date, "d")}
                                      </span>
                                      {dateObj.isToday && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                      )}
                                    </div>

                                    {/* Bed Status Indicators */}
                                    {dateObj.isCurrentMonth &&
                                      totalBeds > 0 && (
                                        <div className="space-y-1 mt-2">
                                          <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1">
                                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                              <span>{availableBeds}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                              <span>{occupiedBeds}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                              <span>{reservedBeds}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    {/* Quick bed list for selected date */}
                                    {dateObj.isSelected &&
                                      dateObj.isCurrentMonth && (
                                        <div className="mt-3 space-y-1 max-h-20 overflow-y-auto">
                                          {bedsForDate
                                            .slice(0, 3)
                                            .map((bedStatus, idx) => (
                                              <div
                                                key={idx}
                                                className={`text-xs px-2 py-1 rounded truncate ${getAvailabilityColor(
                                                  bedStatus.status
                                                )}`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  openBedDetailsModal(
                                                    bedStatus.bed,
                                                    dateObj.date
                                                  );
                                                }}
                                              >
                                                Bed {bedStatus.bed.bed_number}:{" "}
                                                {getBedStatusText(
                                                  bedStatus.status
                                                )}
                                              </div>
                                            ))}
                                          {bedsForDate.length > 3 && (
                                            <div className="text-xs text-gray-500 text-center">
                                              +{bedsForDate.length - 3} more
                                            </div>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Selected Date Details */}
                          {selectedDate && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">
                                  Bed Availability for{" "}
                                  {format(selectedDate, "MMMM d, yyyy")}
                                </h3>
                                <Badge variant="outline">
                                  {format(selectedDate, "EEEE")}
                                </Badge>
                              </div>

                              {dbBeds.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {dbBeds.map((bed) => {
                                    const status = getBedStatusForDate(
                                      bed.id,
                                      selectedDate
                                    );
                                    const ward = dbWards.find(
                                      (w) => w.id === bed.ward_id
                                    );
                                    return (
                                      <div
                                        key={bed.id}
                                        className={`p-3 rounded-lg border ${getAvailabilityColor(
                                          status
                                        )} flex items-center justify-between cursor-pointer hover:opacity-90`}
                                        onClick={() =>
                                          openBedDetailsModal(bed, selectedDate)
                                        }
                                      >
                                        <div>
                                          <div className="font-medium">
                                            Bed {bed.bed_number}
                                            {bed.room_number &&
                                              ` • Room ${bed.room_number}`}
                                          </div>
                                          <div className="text-sm opacity-80">
                                            {ward?.name || "Unknown Ward"} •
                                            Floor {bed.floor_number}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className={
                                              status === "AVAILABLE"
                                                ? "bg-green-100"
                                                : "bg-white"
                                            }
                                          >
                                            {getBedStatusText(status)}
                                          </Badge>
                                          <ChevronRightIcon className="h-4 w-4" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  No beds found for selected filters
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </div>

        
        {/* Bed Details Modal */}
        <Dialog
          open={showBedDetailsModal}
          onOpenChange={setShowBedDetailsModal}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Bed Details - {selectedBedForDetails?.bed_number}
              </DialogTitle>
              <DialogDescription>
                Complete bed information and availability for{" "}
                {format(selectedDate, "MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 overflow-y-auto pr-2">
              {/* Bed Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Bed Information
                    </div>
                    <div className="font-bold text-lg mt-1">
                      Bed {selectedBedForDetails?.bed_number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedBedForDetails?.bed_label}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Room & Floor
                    </div>
                    <div className="font-bold text-lg mt-1">
                      Room {selectedBedForDetails?.room_number || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Floor {selectedBedForDetails?.floor_number}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Current Status
                    </div>
                    <div className="font-bold text-lg mt-1">
                      <Badge
                        className={`${getAvailabilityColor(
                          getBedStatusForDate(
                            selectedBedForDetails?.id || "",
                            selectedDate
                          )
                        )}`}
                      >
                        {getBedStatusText(
                          getBedStatusForDate(
                            selectedBedForDetails?.id || "",
                            selectedDate
                          )
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Equipment & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedBedForDetails?.has_oxygen && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-green-700">Oxygen</div>
                      <div className="text-sm text-green-600">Available</div>
                    </div>
                  )}
                  {selectedBedForDetails?.has_monitor && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-700">Monitor</div>
                      <div className="text-sm text-blue-600">Available</div>
                    </div>
                  )}
                  {selectedBedForDetails?.has_ventilator && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="font-medium text-purple-700">
                        Ventilator
                      </div>
                      <div className="text-sm text-purple-600">Available</div>
                    </div>
                  )}
                  {selectedBedForDetails?.is_wheelchair_accessible && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="font-medium text-amber-700">
                        Wheelchair Access
                      </div>
                      <div className="text-sm text-amber-600">Available</div>
                    </div>
                  )}
                  {selectedBedForDetails?.has_suction && (
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="font-medium text-teal-700">Suction</div>
                      <div className="text-sm text-teal-600">Available</div>
                    </div>
                  )}
                  {selectedBedForDetails?.has_infusion_pump && (
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="font-medium text-indigo-700">
                        Infusion Pump
                      </div>
                      <div className="text-sm text-indigo-600">Available</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking History for Selected Date */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  Bookings for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <div className="space-y-2">
                  {dbBookings
                    .filter(
                      (booking) =>
                        booking.assigned_bed_id === selectedBedForDetails?.id &&
                        isWithinInterval(selectedDate, {
                          start: parseISO(booking.expected_admission_date),
                          end: parseISO(booking.expected_discharge_date),
                        })
                    )
                    .map((booking, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              Booking: {booking.booking_reference}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(
                                parseISO(booking.expected_admission_date),
                                "MMM dd"
                              )}{" "}
                              -
                              {format(
                                parseISO(booking.expected_discharge_date),
                                "MMM dd, yyyy"
                              )}
                            </div>
                            <div className="text-sm mt-1">
                              Status:{" "}
                              <Badge variant="outline">{booking.status}</Badge>
                            </div>
                          </div>
                          <Badge
                            className={`${getAvailabilityColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        {booking.primary_diagnosis && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Diagnosis:</span>{" "}
                            {booking.primary_diagnosis}
                          </div>
                        )}
                      </div>
                    ))}

                  {dbBookings.filter(
                    (booking) =>
                      booking.assigned_bed_id === selectedBedForDetails?.id &&
                      isWithinInterval(selectedDate, {
                        start: parseISO(booking.expected_admission_date),
                        end: parseISO(booking.expected_discharge_date),
                      })
                  ).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No bookings for this date
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (selectedBedForDetails) {
                      const bed = beds.find(
                        (b) => b.id === selectedBedForDetails.id
                      );
                       const ward = dbWards.find(
                                  (w) => w.id === bed.wardId
                                );
                      if (bed) {
                        setShowBedDetailsModal(false);
                        // openBookingDialog(bed);
                       handleBookBed(bed.id,ward.id, facilityName || "")
                      }
                    }
                  }}
                  disabled={
                    getBedStatusForDate(
                      selectedBedForDetails?.id || "",
                      selectedDate
                    ) !== "AVAILABLE"
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Book This Bed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Navigate to tomorrow
                    const tomorrow = addDays(selectedDate, 1);
                    setSelectedDate(tomorrow);
                    if (selectedBedForDetails) {
                      fetchBedDetailsForDate(
                        selectedBedForDetails.id,
                        tomorrow
                      );
                    }
                  }}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                  Next Day
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBedDetailsModal(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
