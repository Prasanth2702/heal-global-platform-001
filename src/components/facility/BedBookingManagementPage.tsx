// components/facility/BedBookingManagementPage.tsx
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Import the components you mentioned
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
import { mixpanelInstance } from "@/utils/mixpanel";

// Define types (these should be in a separate types file or at the top)
type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "TRANSFERRED"
  | "AVAILABLE"
  | "RESERVED"
  | "COMPLETED";
type ActionType = "admit" | "discharge" | "transfer" | "cancelled";

interface Bed {
  id: string;
  bed_number: string;
  bed_type: string;
  current_status: BedStatus;
  ward_id: string;
  room_number?: string;
  facility_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  ward?: {
    name: string;
  };
  isOccupied?: boolean;
}

interface BedBooking {
  id: string;
  booking_reference: string;
  status: BookingStatus;
  admission_type: string;
  patient_type: string;
  priority: string;
  required_bed_type: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  allergies?: string;
  special_instructions?: string;
  special_requirements?: string[];
  assigned_bed_id: string;
  facility_id: string;
  created_at: string;
  updated_at: string;
  cancellation_reason?: string;
  patient?: {
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    contact: string;
    emergencyContact: string;
    allergies?: string[];
  };
}

interface ActionData {
  booking_id: string;
  admission_diagnosis: string;
  notes: string;
  discharge_diagnosis: string;
  discharge_summary: string;
  new_bed_id: string;
  new_ward_id: string;
  transfer_reason: string;
  clinical_notes: string;
  administrative_notes: string;
  cancellation_reason: string;
}

interface Ward {
  id: string;
  name: string;
  floor_number: string;
  ward_type: string;
  available_beds: number;
}

const BedBookingManagementPage: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bookings, setBookings] = useState<BedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Dialog states
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showBookingDetailsDialog, setShowBookingDetailsDialog] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BedBooking | null>(null);

  // Action states
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [currentBed, setCurrentBed] = useState<Bed | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BedBooking | null>(null);
  const [actionData, setActionData] = useState<ActionData>({
    booking_id: "",
    admission_diagnosis: "",
    notes: "",
    discharge_diagnosis: "",
    discharge_summary: "",
    new_bed_id: "",
    new_ward_id: "",
    transfer_reason: "",
    clinical_notes: "",
    administrative_notes: "",
    cancellation_reason:"",
  });
  const [bedActionStatus, setBedActionStatus] = useState<
    Record<string, string>
  >({});

  // Helper function for notifications
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

  // Helper function for date formatting
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const handleActionConfirmation = (action: ActionType, bed: Bed) => {
    const bookingForBed = bookings.find(
      (booking) =>
        booking.assigned_bed_id === bed.id &&
        ["PENDING", "AVAILABLE", "RESERVED", "CHECKED_IN", "OCCUPIED"].includes(
          booking.status
        )
    );

    if (!bookingForBed) {
      showNotification(
        `No active booking found for Bed ${bed.bed_number}.`,
        "error"
      );
      return;
    }

    setCurrentAction(action);
    setCurrentBed(bed);
    setCurrentBooking(bookingForBed);
    setSelectedBookingForDetails(bookingForBed);
    setShowBookingDetailsDialog(true);
  };

  const handleProceedToAction = () => {
    if (!selectedBookingForDetails || !currentBed || !currentAction) {
      showNotification("Cannot proceed to action", "error");
      return;
    }

    const initialActionData: ActionData = {
      booking_id: selectedBookingForDetails.id,
      admission_diagnosis: selectedBookingForDetails.primary_diagnosis || "",
      notes: selectedBookingForDetails.special_instructions || "",
      discharge_diagnosis: "",
      discharge_summary: "",
      new_bed_id: "",
      new_ward_id: "",
      transfer_reason: "",
      clinical_notes: "",
      administrative_notes: "",
      cancellation_reason:"",
    };

    setActionData(initialActionData);
    setShowBookingDetailsDialog(false);
    setShowActionDialog(true);
  };

  const handleViewBookingDetails = (bed: Bed) => {
    const bookingForBed = bookings.find(
      (booking) =>
        booking.assigned_bed_id === bed.id &&
        [
          "PENDING",
          "AVAILABLE",
          "RESERVED",
          "CHECKED_IN",
          "CHECKED_OUT",
        ].includes(booking.status)
    );

    if (bookingForBed) {
      setSelectedBookingForDetails(bookingForBed);
      setShowBookingDetailsDialog(true);
    } else {
      showNotification(`No booking found for Bed ${bed.bed_number}`, "info");
    }
  };

  const handleExecuteAction = async () => {
    if (!currentAction || !currentBed || !currentBooking) {
      showNotification("Missing required information for action", "error");
      mixpanelInstance.track('Bed Action Confirmed', {
  action: currentAction,
  bedId: currentBed.id,
  bookingId: currentBooking.id,
  facilityId: currentBed.facility_id,
  user: currentBooking.patient?.name || 'Unknown',
  page: 'BedBookingManagementPage',
  actionData,
});
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showNotification("User not authenticated", "error");
        return;
      }
      
 const { data: staffData } = await supabase
      .from("staff")
      .select("department_id,user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    // If user is staff (not admin), check if they have access to this booking
    // if (staffData) {
    //   // Check if the booking belongs to the staff's department
    //   // You need to have department_id in your bookings table or fetch it
    //   const { data: bookingDept } = await supabase
    //     .from("bed_bookings")
    //     .select("department_id")
    //     .eq("id", currentBooking.id)
    //     .single();

    //   if (bookingDept && bookingDept.department_id !== staffData.department_id) {
    //     showNotification("You don't have permission to perform this action", "error");
    //     return;
    //   }
    // }
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        showNotification("Session expired. Please login again.", "error");
        return;
      }
      
const facilityId = await getUserFacilityId();
      // const facilityId = user.user_metadata?.facility_id;
      if (!facilityId) {
        showNotification("Facility ID not found in user metadata", "error");
        return;
      }

      let apiUrl = "";
      let requestBody: any = {};
      let newBookingStatus = "";
      let newBedStatus: BedStatus = "AVAILABLE";

      switch (currentAction) {
        case "admit":
          apiUrl =
            "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/admit-patient";
          newBookingStatus = "CHECKED_IN";
          newBedStatus = "OCCUPIED";

          requestBody = {
            booking_id: actionData.booking_id || currentBooking.id,
            bed_id: currentBed.id,
            ward_id: currentBed.ward_id,
            admission_diagnosis:
              actionData.admission_diagnosis ||
              currentBooking.primary_diagnosis ||
              "",
            notes: actionData.notes || "",
            ip_address: "",
            user_agent: "",
            application_version: "",
          };
          break;

        case "discharge":
          apiUrl =
            "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/discharge-patient";
          newBookingStatus = "CHECKED_OUT";
          newBedStatus = "AVAILABLE";
          requestBody = {
            booking_id: actionData.booking_id || currentBooking.id,
            discharge_diagnosis: actionData.discharge_diagnosis || "",
            discharge_summary: actionData.discharge_summary || "",
            notes: actionData.notes || "",
            ip_address: "",
            user_agent: "",
            application_version: "",
          };
          break;

        case "transfer":
          apiUrl =
            "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/transfer-patient";
          newBookingStatus = "TRANSFERRED";
          requestBody = {
            booking_id: actionData.booking_id || currentBooking.id,
            new_bed_id: actionData.new_bed_id || "",
            new_ward_id: actionData.new_ward_id || "",
            transfer_reason: actionData.transfer_reason || "",
            clinical_notes: actionData.clinical_notes || "",
            administrative_notes: actionData.administrative_notes || "",
            ip_address: "",
            user_agent: "",
            application_version: "",
          };
          break;

        case "cancelled":
          apiUrl =
            "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cancel-booking";
          newBookingStatus = "CANCELLED";
          newBedStatus = "AVAILABLE";
          requestBody = {
            booking_id: actionData.booking_id || currentBooking.id,
            cancellation_reason: actionData.cancellation_reason || "",
          };

          //   newBookingStatus = "CANCELLED";
          //   newBedStatus = "AVAILABLE";
          break;

        default:
          showNotification("Invalid action type", "error");
          return;
      }

      //   if (currentAction === "cancelled") {
      //     const { error } = await supabase
      //       .from("bed_bookings")
      //       .update({
      //         status: newBookingStatus as BookingStatus,
      //         cancellation_reason:
      //           actionData.notes || "Cancelled by facility staff",
      //         updated_at: new Date().toISOString(),
      //         updated_by: user.id,
      //       })
      //       .eq("id", currentBooking.id);

      //     if (error) throw error;

      //     await supabase
      //       .from("beds")
      //       .update({
      //         current_status: newBedStatus,
      //         updated_at: new Date().toISOString(),
      //       })
      //       .eq("id", currentBed.id);
      //   } else {

      // Update this part after the API call:
      setBeds((prevBeds) =>
        prevBeds.map((bed) =>
          bed.id === currentBed.id
            ? {
                ...bed,
                current_status: newBedStatus,
                // Ensure bed status is updated properly
                ...(currentAction === "cancelled" && {
                  current_status: "AVAILABLE",
                }),
              }
            : bed
        )
      );
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `Action failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.log("Could not parse error response as JSON");
        }
        throw new Error(errorMessage);
      }
      //   }

      if (newBookingStatus) {
        setBedActionStatus((prev) => ({
          ...prev,
          [currentBed.id]: newBookingStatus,
        }));
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === currentBooking.id
            ? {
                ...booking,
                status: newBookingStatus as BookingStatus,
              }
            : booking
        )
      );

      setBeds((prevBeds) =>
        prevBeds.map((bed) =>
          bed.id === currentBed.id
            ? { ...bed, current_status: newBedStatus }
            : bed
        )
      );

      showNotification(
        `${currentAction} action completed successfully!`,
        "success"
      );

      setShowActionDialog(false);
      fetchData(selectedDate);
    } catch (error: any) {
      showNotification(
        `Failed to ${currentAction} patient: ${
          error.message || "Unknown error"
        }`,
        "error"
      );
    }
  };
//   const getUserFacilityId = async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return null;

//   console.log("USER ID:", user.id);

//   // ✅ Check ADMIN
//   const { data: adminFacility, error: adminError } = await supabase
//     .from("facilities")
//     .select("id")
//     .eq("admin_user_id", user.id)
//     .maybeSingle();

//   if (adminError) {
//     console.error("Admin fetch error:", adminError);
//   }

//   if (adminFacility) {
//     console.log("ADMIN FACILITY:", adminFacility.id);
//     return adminFacility.id;
//   }

//   // ✅ Check STAFF
//   const { data: staff, error: staffError } = await supabase
//     .from("staff")
//     .select("facility_id")
//     .eq("user_id", user.id)
//     .maybeSingle();

//   if (staffError) {
//     console.error("Staff fetch error:", staffError);
//   }

//   if (staff) {
//     console.log("STAFF FACILITY:", staff.facility_id);
//     return staff.facility_id;
//   }

//   return null;
// };

  // const fetchData = async (date: Date) => {
  //   try {
  //     setLoading(true);
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) return;

  //     // const facilityId = user?.user_metadata?.facility_id;
  //     const facilityId = await getUserFacilityId();
  //     const startDate = startOfDay(date);
  //     const endDate = endOfDay(date);

  //     const { data: wardsData } = await supabase
  //       .from("wards")
  //       .select("*")
  //       .eq("facility_id", facilityId)
  //       .eq("is_active", true);

  //     const { data: bedsData } = await supabase
  //       .from("beds")
  //       .select("*")
  //       .eq("facility_id", facilityId)
  //       .gte("updated_at", startDate.toISOString())
  //       .lte("updated_at", endDate.toISOString())
  //       .eq("is_active", true);

  //     const { data: bookingsData } = await supabase
  //       .from("bed_bookings")
  //       .select("*")
  //       .eq("facility_id", facilityId)
  //       .gte("updated_at", startDate.toISOString())
  //       .lte("updated_at", endDate.toISOString())
  //       .order("updated_at", { ascending: false });

  //     setWards(wardsData || []);
  //     setBeds(bedsData || []);
  //     setBookings(bookingsData || []);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setWards([]);
  //     setBeds([]);
  //     setBookings([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getUserFacilityId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  console.log("USER ID:", user.id);

  // ✅ Check ADMIN
  const { data: adminFacility, error: adminError } = await supabase
    .from("facilities")
    .select("id")
    .eq("admin_user_id", user.id)
    .maybeSingle();


  if (adminFacility) {
    return adminFacility.id;
  }

  // ✅ Check STAFF (includes department staff)
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select("facility_id, department_id,user_id")
    .eq("user_id", user.id)
    .maybeSingle();


  if (staff) {
    return staff.facility_id;
  }

  return null;
};

const fetchData = async (date: Date) => {
  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const facilityId = await getUserFacilityId();
    
    // Also get staff details if needed for department filtering
    const { data: staffData } = await supabase
      .from("staff")
      .select("department_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    // Fetch wards (optionally filter by department if needed)
    let wardsQuery = supabase
      .from("wards")
      .select("*")
      .eq("facility_id", facilityId)
      .eq("is_active", true);
    
    // If staff has a specific department, you might want to filter wards
    // if (staffData?.department_id) {
    //   wardsQuery = wardsQuery.eq("department_id", staffData.department_id);
    // }

    const { data: wardsData } = await wardsQuery;

    // Fetch beds
    const { data: bedsData } = await supabase
      .from("beds")
      .select("*")
      .eq("facility_id", facilityId)
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString())
      .eq("is_active", true);

    // Fetch bookings
    const { data: bookingsData } = await supabase
      .from("bed_bookings")
      .select("*")
      .eq("facility_id", facilityId)
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString())
      .order("updated_at", { ascending: false });

    setWards(wardsData || []);
    setBeds(bedsData || []);
    setBookings(bookingsData || []);
  } catch (error) {
    console.error("Error fetching data:", error);
    setWards([]);
    setBeds([]);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchData(selectedDate);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  const getBedsWithBookingsOnDate = (wardId: string) => {
    const wardBeds = beds.filter((bed) => bed.ward_id === wardId);

    return wardBeds.map((bed) => {
      const bedBooking = bookings.find(
        (booking) => booking.assigned_bed_id === bed.id
      );
      return {
        ...bed,
        booking: bedBooking || null,
      };
    });
  };

  // Get modal title based on action
  const getActionDialogTitle = () => {
    switch (currentAction) {
      case "admit":
        return "Patient Admission";
      case "discharge":
        return "Patient Discharge";
      case "transfer":
        return "Patient Transfer";
      case "cancelled":
        return "Booking Cancellation";
      default:
        return "Action";
    }
  };

  // Get modal icon based on action
  const getActionDialogIcon = () => {
    switch (currentAction) {
      case "admit":
        return <User className="h-5 w-5 text-blue-500" />;
      case "discharge":
        return <User className="h-5 w-5 text-green-500" />;
      case "transfer":
        return <Bed className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "CHECKED_IN":
      case "AVAILABLE":
        return "default";
      case "PENDING":
      case "RESERVED":
        return "secondary";
      case "CANCELLED":
      case "OCCUPIED":
        return "destructive";
      case "COMPLETED":
      case "CHECKED_OUT":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription className="mt-1">
              Choose a date to view booking updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </div>

            <div className="mb-4">
              <h6 className="mb-2 font-medium">Selected Date:</h6>
              <div className="bg-gray-50 p-3 rounded-md">
                <strong>
                  {selectedDate
                    ? format(selectedDate, "PPPP")
                    : "Select a date"}
                </strong>
              </div>
            </div>

            <div className="mt-4">
              <h6 className="mb-3 font-medium">Booking Updates Summary</h6>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Updates</span>
                  <Badge variant="secondary">{bookingStats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Confirmed</span>
                  <Badge variant="default">{bookingStats.confirmed}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <Badge variant="secondary">{bookingStats.pending}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cancelled</span>
                  <Badge variant="destructive">{bookingStats.cancelled}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <Badge variant="outline">{bookingStats.completed}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
  handleDateSelect(new Date());
  mixpanelInstance.track('View Todays Booking Updates', {
    selectedDate: new Date(),
    page: 'BedBookingManagementPage',
  });
}}
              >
                View Today's Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Hospital Bed Booking Updates</CardTitle>
              <div className="text-muted-foreground">
                <small>
                  Showing booking updates on:{" "}
                  <strong>
                    {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : ""}
                  </strong>{" "}
                  | {bookings.length} update{bookings.length !== 1 ? "s" : ""}{" "}
                  found
                </small>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="mt-3 text-muted-foreground">
                  Loading booking data...
                </p>
              </div>
            ) : bookings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Booking Updates Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No booking updates were made on{" "}
                      <strong>
                        {selectedDate
                          ? format(selectedDate, "MMMM dd, yyyy")
                          : "this date"}
                      </strong>
                      . Try selecting a different date or view today's updates.
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
  handleDateSelect(new Date());
  mixpanelInstance.track('View Todays Booking Updates', {
    selectedDate: new Date(),
    page: 'BedBookingManagementPage',
  });
}}
                    >
                      View Today's Updates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : wards.length === 0 ? (
              <Card className="border-dashed border-yellow-200">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Wards Available
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No wards are configured in the system. Please add wards
                      first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              wards.map((ward) => {
                const bedsWithBookings = getBedsWithBookingsOnDate(ward.id);

                if (bedsWithBookings.length === 0) return null;

                return (
                  <div key={ward.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h5 className="text-lg font-semibold mb-1">
                          {ward.name}
                        </h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="px-2 py-1">
                            Floor {ward.floor_number}
                          </Badge>
                          <Badge variant="default" className="px-2 py-1">
                            {bedsWithBookings.length} bed
                            {bedsWithBookings.length !== 1 ? "s" : ""} updated
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
                      {bedsWithBookings.map((bed) => {
                        const bedBooking = bed.booking;
                        const actionStatus = bedActionStatus[bed.id];

                        return (
                          <Card
                            key={bed.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="mb-4">
                                  <h6 className="font-semibold">
                                    Bed {bed.bed_number}
                                  </h6>
                                  <Badge
                                    variant={getStatusBadgeVariant(
                                      actionStatus || bed.current_status
                                    )}
                                    className="mt-2"
                                  >
                                    {actionStatus || bed.current_status}
                                  </Badge>
                                </div>

                                {bedBooking && (
                                  <>
                                    <div className="mb-4">
                                      <small className="text-muted-foreground block">
                                        Booking Status
                                      </small>
                                      <Badge
                                        variant={getStatusBadgeVariant(
                                          bedBooking.status
                                        )}
                                        className="mt-1"
                                      >
                                        {bedBooking.status}
                                      </Badge>
                                    </div>

                                    <div className="mb-4">
                                      <small className="text-muted-foreground block">
                                        Updated At
                                      </small>
                                      <small className="text-primary">
                                        {format(
                                          new Date(bedBooking.updated_at),
                                          "hh:mm a"
                                        )}
                                      </small>
                                    </div>
                                  </>
                                )}

                                <div className="flex justify-center gap-2 mb-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    title="View details"
                                    onClick={() =>
                                      handleViewBookingDetails(bed)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    title="More info"
                                    onClick={() =>
                                      handleViewBookingDetails(bed)
                                    }
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {bedBooking ? (
                                      <>
                                        {/* RESERVED status - Show Admit and Cancel buttons */}
                                        {bedBooking.status === "RESERVED" &&
                                          !actionStatus && (
                                            <>
                                              <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => {
                                                  mixpanelInstance.track('Bed Booking Main Button Clicked', {
                                                    action: 'Admit',
                                                    bed_id: bed.id,
                                                    booking_id: bedBooking.id,
                                                    ward_id: bed.ward_id,
                                                    status: bedBooking.status,
                                                  });
                                                  handleActionConfirmation("admit", bed);
                                                }}
                                              >
                                                Admit
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                  mixpanelInstance.track('Bed Booking Main Button Clicked', {
                                                    action: 'Cancel',
                                                    bed_id: bed.id,
                                                    booking_id: bedBooking.id,
                                                    ward_id: bed.ward_id,
                                                    status: bedBooking.status,
                                                  });
                                                  handleActionConfirmation("cancelled", bed);
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </>
                                          )}

                                        {/* OCCUPIED or CHECKED_IN status - Show Transfer and Discharge buttons */}
                                        {(bed.current_status === "OCCUPIED" ||
                                          bedBooking.status === "CHECKED_IN" ||
                                          bed.isOccupied) && (
                                          <>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                mixpanelInstance.track('Bed Booking Main Button Clicked', {
                                                  action: 'Transfer',
                                                  bed_id: bed.id,
                                                  booking_id: bedBooking.id,
                                                  ward_id: bed.ward_id,
                                                  status: bedBooking.status,
                                                });
                                                handleActionConfirmation("transfer", bed);
                                              }}
                                            >
                                              Transfer
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="default"
                                              onClick={() => {
                                                mixpanelInstance.track('Bed Booking Main Button Clicked', {
                                                  action: 'Discharge',
                                                  bed_id: bed.id,
                                                  booking_id: bedBooking.id,
                                                  ward_id: bed.ward_id,
                                                  status: bedBooking.status,
                                                });
                                                handleActionConfirmation("discharge", bed);
                                              }}
                                            >
                                              Discharge
                                            </Button>
                                          </>
                                        )}

                                        {/* PENDING status - Show only Cancel button */}
                                        {bedBooking.status === "PENDING" &&
                                          !actionStatus && (
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() =>
                                                handleActionConfirmation(
                                                  "cancelled",
                                                  bed
                                                )
                                              }
                                            >
                                              Cancel
                                            </Button>
                                          )}

                                        {/* CONFIRMED status - Show Admit and Cancel buttons */}
                                        {bedBooking.status === "CONFIRMED" &&
                                          !actionStatus && (
                                            <>
                                              <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() =>
                                                  handleActionConfirmation(
                                                    "admit",
                                                    bed
                                                  )
                                                }
                                              >
                                                Admit
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                  handleActionConfirmation(
                                                    "cancelled",
                                                    bed
                                                  )
                                                }
                                              >
                                                Cancel
                                              </Button>
                                            </>
                                          )}
                                      </>
                                    ) : (
                                      <Button size="sm" variant="default">
                                        Assign Patient
                                      </Button>
                                    )}

                                    <Button size="sm" variant="outline">
                                      Maintenance
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Confirmation Dialog */}
      {/* <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        {/* <DialogContent className="max-w-2xl"> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getActionDialogIcon()}
              {getActionDialogTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Section 
            <div className="p-4 bg-gray-50 rounded-md">
              <h6 className="mb-3 flex items-center gap-2 font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Summary
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-3">
                    <Label className="text-muted-foreground text-sm">
                      Current Bed
                    </Label>
                    <p className="font-medium">
                      {currentBed?.bed_number} ({currentBed?.bed_type})
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Current Ward
                    </Label>
                    <p className="font-medium">
                      {currentBed?.ward?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-3">
                    <Label className="text-muted-foreground text-sm">
                      Patient
                    </Label>
                    <p className="font-medium">
                      {currentBooking?.patient?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Booking Reference
                    </Label>
                    <p className="font-medium">
                      {currentBooking?.booking_reference}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Form 
            {currentAction === "admit" && (
              <>
                <h6 className="flex items-center gap-2 font-medium">
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                  Admission Details
                </h6>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admission-diagnosis">
                      Admission Diagnosis *
                    </Label>
                    <Textarea
                      id="admission-diagnosis"
                      placeholder="Enter admission diagnosis"
                      value={actionData?.admission_diagnosis || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          admission_diagnosis: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admission-notes">Additional Notes</Label>
                    <Textarea
                      id="admission-notes"
                      placeholder="Any additional notes..."
                      value={actionData?.notes || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {currentAction === "discharge" && (
              <>
                <h6 className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4 text-green-500" />
                  Discharge Details
                </h6>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="discharge-diagnosis">
                      Discharge Diagnosis *
                    </Label>
                    <Textarea
                      id="discharge-diagnosis"
                      placeholder="Enter discharge diagnosis"
                      value={actionData?.discharge_diagnosis || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          discharge_diagnosis: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discharge-summary">Discharge Summary</Label>
                    <Textarea
                      id="discharge-summary"
                      placeholder="Enter discharge summary..."
                      value={actionData?.discharge_summary || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          discharge_summary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="discharge-notes">Additional Notes</Label>
                    <Textarea
                      id="discharge-notes"
                      placeholder="Any additional notes..."
                      value={actionData?.notes || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
<div className="space-y-6 overflow-y-auto pr-2">
            {currentAction === "transfer" && (
              <>
                <h6 className="flex items-center gap-2 font-medium">
                  <Bed className="h-4 w-4 text-yellow-500" />
                  Transfer Details
                </h6>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-ward">Select New Ward *</Label>
                    <Select
                      value={actionData?.new_ward_id || ""}
                      onValueChange={(value) =>
                        setActionData({
                          ...actionData,
                          new_ward_id: value,
                          new_bed_id: "",
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* {wards
                          .filter((ward) => ward.id !== currentBed?.ward_id)
                          .map((ward) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              {ward.name} ({ward.ward_type}) -{" "}
                              {ward.available_beds} beds available
                            </SelectItem>
                          ))} 
                           {wards
              // ✅ FIX: Allow same ward or different wards
              .map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name} ({ward.ward_type}) - {ward.available_beds} beds available
                  {ward.id === currentBed?.ward_id }
                </SelectItem>
              ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="new-bed">Select New Bed *</Label>
                    <Select
                      value={actionData?.new_bed_id || ""}
                      onValueChange={(value) =>
                        setActionData({
                          ...actionData,
                          new_bed_id: value,
                        })
                      }
                      required
                      disabled={!actionData?.new_ward_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bed" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionData?.new_ward_id &&
                          beds
                            .filter(
                              (bed) =>
                                bed.ward_id === actionData.new_ward_id &&
                                bed.current_status === "AVAILABLE" &&
                                bed.id !== currentBed?.id
                            )
                            .map((bed) => (
                              <SelectItem key={bed.id} value={bed.id}>
                                {bed.bed_number} ({bed.bed_type}) - Room{" "}
                                {bed.room_number}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    {actionData?.new_ward_id &&
                      beds.filter(
                        (bed) =>
                          bed.ward_id === actionData.new_ward_id &&
                          bed.current_status === "AVAILABLE"
                      ).length === 0 && (
                        <small className="text-red-500 text-sm">
                          No available beds in selected ward
                        </small>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="transfer-reason">Transfer Reason *</Label>
                    <Textarea
                      id="transfer-reason"
                      placeholder="Why is this transfer necessary?"
                      value={actionData?.transfer_reason || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          transfer_reason: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinical-notes">Clinical Notes</Label>
                    <Textarea
                      id="clinical-notes"
                      placeholder="Clinical observations and notes..."
                      value={actionData?.clinical_notes || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          clinical_notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="admin-notes">Administrative Notes</Label>
                    <Textarea
                      id="admin-notes"
                      placeholder="Administrative/logistical notes..."
                      value={actionData?.administrative_notes || ""}
                      onChange={(e) =>
                        setActionData({
                          ...actionData,
                          administrative_notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  {actionData?.new_bed_id && (
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h6 className="mb-2 font-medium">Transfer Summary</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            From
                          </Label>
                          <p className="font-medium">
                            Bed {currentBed?.bed_number} ({currentBed?.bed_type}
                            )
                          </p>
                          <div className="text-muted-foreground text-sm">
                            {currentBed?.ward?.name}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            To
                          </Label>
                          <p className="font-medium">
                            Bed{" "}
                            {
                              beds.find((b) => b.id === actionData.new_bed_id)
                                ?.bed_number
                            }{" "}
                            (
                            {
                              beds.find((b) => b.id === actionData.new_bed_id)
                                ?.bed_type
                            }
                            )
                          </p>
                          <div className="text-muted-foreground text-sm">
                            {
                              wards.find((w) => w.id === actionData.new_ward_id)
                                ?.name
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
</div>
            {currentAction === "cancelled" && (
              <>
                <h6 className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Cancellation Details
                </h6>
                <div>
                  <Label htmlFor="cancellation-reason">
                    Cancellation Reason *
                  </Label>
                  <Textarea
                    id="cancellation-reason"
                    placeholder="Please specify the reason for cancellation..."
                    value={actionData?.cancellation_reason || ""}
                    onChange={(e) =>
                      setActionData({
                        ...actionData,
                        cancellation_reason : e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-muted-foreground text-sm mt-2">
                    This information will be recorded in the booking history.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActionDialog(false);
                setSelectedBookingForDetails(currentBooking);
                setShowBookingDetailsDialog(true);
              }}
            >
              Back
            </Button>
            <Button
              variant={
                currentAction === "discharge" || currentAction === "cancelled"
                  ? "destructive"
                  : "default"
              }
              onClick={handleExecuteAction}
              disabled={
                currentAction === "transfer" &&
                (!actionData?.new_ward_id ||
                  !actionData?.new_bed_id ||
                  !actionData?.transfer_reason)
              }
            >
              Confirm {currentAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
  <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
    <DialogHeader className="flex-shrink-0">
      <DialogTitle className="flex items-center gap-2">
        {getActionDialogIcon()}
        {getActionDialogTitle()}
      </DialogTitle>
    </DialogHeader>

    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto px-1 py-2">
      <div className="space-y-6">
        {/* Summary Section */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h6 className="mb-3 flex items-center gap-2 font-medium">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Summary
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <Label className="text-muted-foreground text-sm">
                  Current Bed
                </Label>
                <p className="font-medium">
                  {currentBed?.bed_number} ({currentBed?.bed_type})
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Current Ward
                </Label>
                <p className="font-medium">
                  {currentBed?.ward?.name || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <Label className="text-muted-foreground text-sm">
                  Patient
                </Label>
                <p className="font-medium">
                  {currentBooking?.patient?.name || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Booking Reference
                </Label>
                <p className="font-medium">
                  {currentBooking?.booking_reference}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Form */}
        {currentAction === "admit" && (
          <>
            <h6 className="flex items-center gap-2 font-medium">
              <Stethoscope className="h-4 w-4 text-blue-500" />
              Admission Details
            </h6>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admission-diagnosis">
                  Admission Diagnosis *
                </Label>
                <Textarea
                  id="admission-diagnosis"
                  placeholder="Enter admission diagnosis"
                  value={actionData?.admission_diagnosis || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      admission_diagnosis: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="admission-notes">Additional Notes</Label>
                <Textarea
                  id="admission-notes"
                  placeholder="Any additional notes..."
                  value={actionData?.notes || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </>
        )}

        {currentAction === "discharge" && (
          <>
            <h6 className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4 text-green-500" />
              Discharge Details
            </h6>
            <div className="space-y-4">
              <div>
                <Label htmlFor="discharge-diagnosis">
                  Discharge Diagnosis *
                </Label>
                <Textarea
                  id="discharge-diagnosis"
                  placeholder="Enter discharge diagnosis"
                  value={actionData?.discharge_diagnosis || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      discharge_diagnosis: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="discharge-summary">Discharge Summary</Label>
                <Textarea
                  id="discharge-summary"
                  placeholder="Enter discharge summary..."
                  value={actionData?.discharge_summary || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      discharge_summary: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="discharge-notes">Additional Notes</Label>
                <Textarea
                  id="discharge-notes"
                  placeholder="Any additional notes..."
                  value={actionData?.notes || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </>
        )}

        {currentAction === "transfer" && (
          <>
            <h6 className="flex items-center gap-2 font-medium">
              <Bed className="h-4 w-4 text-yellow-500" />
              Transfer Details
            </h6>

            <div className="space-y-4">
              <div>
                <Label htmlFor="new-ward">Select New Ward *</Label>
                <Select
                  value={actionData?.new_ward_id || ""}
                  onValueChange={(value) =>
                    setActionData({
                      ...actionData,
                      new_ward_id: value,
                      new_bed_id: "",
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name} ({ward.ward_type}) - {ward.available_beds} beds available
                        {ward.id === currentBed?.ward_id && " (Current Ward)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-bed">Select New Bed *</Label>
                <Select
                  value={actionData?.new_bed_id || ""}
                  onValueChange={(value) =>
                    setActionData({
                      ...actionData,
                      new_bed_id: value,
                    })
                  }
                  required
                  disabled={!actionData?.new_ward_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionData?.new_ward_id &&
                      beds
                        .filter(
                          (bed) =>
                            bed.ward_id === actionData.new_ward_id &&
                            bed.current_status === "AVAILABLE" &&
                            bed.id !== currentBed?.id
                        )
                        .map((bed) => (
                          <SelectItem key={bed.id} value={bed.id}>
                            {bed.bed_number} ({bed.bed_type}) - Room{" "}
                            {bed.room_number}
                            {bed.ward_id === currentBed?.ward_id && " (Same Ward)"}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                {actionData?.new_ward_id &&
                  beds.filter(
                    (bed) =>
                      bed.ward_id === actionData.new_ward_id &&
                      bed.current_status === "AVAILABLE" &&
                      bed.id !== currentBed?.id
                  ).length === 0 && (
                    <small className="text-red-500 text-sm">
                      No available beds in selected ward (excluding current bed)
                    </small>
                  )}
              </div>

              <div>
                <Label htmlFor="transfer-reason">Transfer Reason *</Label>
                <Textarea
                  id="transfer-reason"
                  placeholder="Why is this transfer necessary?"
                  value={actionData?.transfer_reason || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      transfer_reason: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="clinical-notes">Clinical Notes</Label>
                <Textarea
                  id="clinical-notes"
                  placeholder="Clinical observations and notes..."
                  value={actionData?.clinical_notes || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      clinical_notes: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="admin-notes">Administrative Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Administrative/logistical notes..."
                  value={actionData?.administrative_notes || ""}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      administrative_notes: e.target.value,
                    })
                  }
                />
              </div>

              {actionData?.new_bed_id && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h6 className="mb-2 font-medium">Transfer Summary</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        From
                      </Label>
                      <p className="font-medium">
                        Bed {currentBed?.bed_number} ({currentBed?.bed_type})
                      </p>
                      <div className="text-muted-foreground text-sm">
                        {currentBed?.ward?.name}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        To
                      </Label>
                      <p className="font-medium">
                        Bed{" "}
                        {
                          beds.find((b) => b.id === actionData.new_bed_id)
                            ?.bed_number
                        }{" "}
                        (
                        {
                          beds.find((b) => b.id === actionData.new_bed_id)
                            ?.bed_type
                        }
                        )
                      </p>
                      <div className="text-muted-foreground text-sm">
                        {
                          wards.find((w) => w.id === actionData.new_ward_id)
                            ?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {currentAction === "cancelled" && (
          <>
            <h6 className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Cancellation Details
            </h6>
            <div>
              <Label htmlFor="cancellation-reason">
                Cancellation Reason *
              </Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Please specify the reason for cancellation..."
                value={actionData?.cancellation_reason || ""}
                onChange={(e) =>
                  setActionData({
                    ...actionData,
                    cancellation_reason: e.target.value,
                  })
                }
                required
              />
              <p className="text-muted-foreground text-sm mt-2">
                This information will be recorded in the booking history.
              </p>
            </div>
          </>
        )}
      </div>
    </div>

    <DialogFooter className="flex-shrink-0 border-t pt-4 mt-2">
      <Button
        variant="outline"
        onClick={() => {
          setShowActionDialog(false);
          setSelectedBookingForDetails(currentBooking);
          setShowBookingDetailsDialog(true);
        }}
      >
        Back
      </Button>
      <Button
        variant={
          currentAction === "discharge" || currentAction === "cancelled"
            ? "destructive"
            : "default"
        }
        onClick={handleExecuteAction}
        disabled={
          currentAction === "transfer" &&
          (!actionData?.new_ward_id ||
            !actionData?.new_bed_id ||
            !actionData?.transfer_reason)
        }
      >
        Confirm {currentAction}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Booking Details Dialog */}
      <Dialog
        open={showBookingDetailsDialog}
        onOpenChange={setShowBookingDetailsDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Booking Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto pr-2">
            {selectedBookingForDetails && (
              <>
                {/* Action Header */}
                {currentAction && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h6 className="mb-2 flex items-center gap-2 font-medium">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Ready to {currentAction} Patient
                    </h6>
                    <p className="text-muted-foreground">
                      Review the booking details below before proceeding.
                    </p>
                  </div>
                )}

                {/* Booking Information */}
                <div>
                  <h6 className="mb-3 flex items-center gap-2 font-medium">
                    <ClipboardList className="h-4 w-4 text-blue-500" />
                    Booking Information
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Reference
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.booking_reference}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Status
                        </Label>
                        <Badge
                          variant={getStatusBadgeVariant(
                            selectedBookingForDetails.status
                          )}
                          className="mt-1"
                        >
                          {selectedBookingForDetails.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Admission Type
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.admission_type}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Priority
                        </Label>
                        <Badge
                          variant={
                            selectedBookingForDetails.priority === "CRITICAL"
                              ? "destructive"
                              : selectedBookingForDetails.priority === "HIGH"
                              ? "secondary"
                              : selectedBookingForDetails.priority === "MEDIUM"
                              ? "default"
                              : "outline"
                          }
                          className="mt-1"
                        >
                          {selectedBookingForDetails.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Required Bed Type
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.required_bed_type}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Expected Stay
                        </Label>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatDate(
                              selectedBookingForDetails.expected_admission_date
                            )}
                          </p>
                          <div className="text-muted-foreground text-sm text-center">
                            to
                          </div>
                          <p className="font-medium">
                            {formatDate(
                              selectedBookingForDetails.expected_discharge_date
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h6 className="mb-3 flex items-center gap-2 font-medium">
                    <Stethoscope className="h-4 w-4 text-blue-500" />
                    Medical Information
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Primary Diagnosis
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.primary_diagnosis || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Secondary Diagnosis
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.secondary_diagnosis ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Allergies
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.allergies ||
                            "None reported"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">
                          Special Instructions
                        </Label>
                        <p className="font-medium">
                          {selectedBookingForDetails.special_instructions ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                {selectedBookingForDetails.special_requirements &&
                  selectedBookingForDetails.special_requirements.length > 0 && (
                    <div>
                      <h6 className="mb-3 font-medium">Special Requirements</h6>
                      <div className="flex flex-wrap gap-2">
                        {selectedBookingForDetails.special_requirements.map(
                          (req, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="px-3 py-2"
                            >
                              {req}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Patient Information */}
                {selectedBookingForDetails.patient && (
                  <div>
                    <h6 className="mb-3 flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-blue-500" />
                      Patient Information
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Name
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Age
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.age} years
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Gender
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.gender}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Blood Group
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.bloodGroup}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Contact
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.contact}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">
                            Emergency Contact
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.emergencyContact}
                          </p>
                        </div>
                      </div>
                    </div>
                    {selectedBookingForDetails.patient.allergies &&
                      selectedBookingForDetails.patient.allergies.length >
                        0 && (
                        <div className="mt-4">
                          <Label className="text-muted-foreground text-sm">
                            Patient Allergies
                          </Label>
                          <p className="font-medium">
                            {selectedBookingForDetails.patient.allergies.join(
                              ", "
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Created
                      </Label>
                      <p className="text-sm">
                        {formatDate(selectedBookingForDetails.created_at)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Last Updated
                      </Label>
                      <p className="text-sm">
                        {formatDate(selectedBookingForDetails.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingDetailsDialog(false)}
            >
              Cancel
            </Button>
            {currentAction && (
              <Button variant="default" onClick={handleProceedToAction}>
                Proceed to {currentAction}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedBookingManagementPage;