// pages/facility/PatientBookingsPage.tsx
import React, { useState, useEffect } from "react";
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
  Search,
  Filter,
  CalendarDays,
  PlusCircle,
  Download,
  User,
  Phone,
  Mail,
  Clock,
  Bed,
  Home,
  Stethoscope,
  AlertCircle,
  Heart,
  Thermometer,
  Shield,
  Edit,
  Printer,
  Thermometer as ThermometerIcon,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";



// Define interfaces based on your database structure
export interface BedBooking {
  id: string;
  booking_reference: string;
  facility_id: string;
  patient_id: string;
  patient_type: "INPATIENT" | "OUTPATIENT" | "DAY_CARE" | "EMERGENCY";
  admission_type: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  allergies: string;
  special_instructions: string;
  required_bed_type:
    | "ICU"
    | "CCU"
    | "NICU"
    | "PICU"
    | "GENERAL"
    | "PRIVATE"
    | "SEMI_PRIVATE"
    | "ISOLATION"
    | "BURN_UNIT"
    | "CARDIAC"
    | "NEURO"
    | "MATERNITY"
    | "PEDIATRIC"
    | "PSYCHIATRIC"
    | "REHABILITATION"
    | "STEP_DOWN"
    | "EMERGENCY";
  special_requirements: string[];
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  referring_doctor_id: string;
  attending_doctor_id: string;
  primary_nurse_id: string;
  assigned_bed_id: string;
  assigned_ward_id: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  actual_admission_time: string;
  actual_discharge_time: string;
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "MAINTENANCE"
    | "CLEANING"
    | "RESERVED"
    | "OUT_OF_SERVICE";
  cancellation_reason: string;
  insurance_provider: string;
  insurance_policy_number: string;
  insurance_verified_by: string;
  insurance_verified_at: string;
  estimated_cost: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  bed?: {
    id: string;
    bed_number: string;
    bed_type: string;
    status?: string;
  };
  ward?: {
    id: string;
    name: string;
    floor_number: number;
  };
}

export interface Patient {
  id: string;
  user_id: string;
  patient_profile_id: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height: number;
  weight: number;
  known_allergies: string;
  emergency_contact_number: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  medical_history: string;
  current_medications: string;
  created_at: string;
  updated_at: string;
  age: number;
  name: string;
  contact: string;
  diagnosis: string;
  status: string;
  priority: string;
  allergies: string[];
  profile?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  booking?: BedBooking;
  bed?: {
    id: string;
    bed_number: string;
    bed_type: string;
    status?: string;
  };
  ward?: {
    id: string;
    name: string;
    floor_number: number;
  };
}
type BadgeVariant = "secondary" | "destructive" | "outline" | "default";


const PatientBookingsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<BedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedBed, setSelectedBed] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BedBooking | null>(
    null
  );
  const [bedsData, setBedsData] = useState<any[]>([]);
  const [wardsData, setWardsData] = useState<any[]>([]);
  const [profilesData, setProfilesData] = useState<any[]>([]);

  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get priority badge variant
 const getPriorityBadgeVariant = (priority?: string): BadgeVariant => {
   if (!priority) return "secondary";

   const priorityMap: Record<string, BadgeVariant> = {
     emergency: "destructive",
     high: "destructive",
     CRITICAL: "destructive",
     HIGH: "destructive",
     medium: "default",
     MEDIUM: "default",
     low: "secondary",
     LOW: "secondary",
   };

   return priorityMap[priority] ?? "secondary";
 };


  // Helper function to get status badge variant
 const getStatusBadgeVariant = (status?: string): BadgeVariant => {
   if (!status) return "secondary";

   const statusMap: Record<string, BadgeVariant> = {
     Admitted: "default",
     Critical: "destructive",
     Reserved: "outline",
     Cleaning: "secondary",
     Maintenance: "secondary",
     "Out of Service": "secondary",

     OCCUPIED: "default",
     AVAILABLE: "outline",
     RESERVED: "outline",
     CLEANING: "secondary",
     MAINTENANCE: "secondary",
     OUT_OF_SERVICE: "secondary",
   };

   return statusMap[status] ?? "secondary";
 };

  

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      const facilityId = user?.user_metadata?.facility_id;

      // Fetch all data with joins for better performance
      const { data: allBeds, error: allBedsError } = await supabase
        .from("beds")
        .select("*")
        .eq("facility_id", facilityId);

      if (allBedsError) throw allBedsError;
      setBedsData(allBeds || []);

      const { data: allWards, error: allWardsError } = await supabase
        .from("wards")
        .select("*")
        .eq("facility_id", facilityId);

      if (allWardsError) throw allWardsError;
      setWardsData(allWards || []);

      // Fetch bed bookings with related data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bed_bookings")
        .select(
          `
          *,
          bed:beds(id, bed_number, bed_type),
          ward:wards(id, name, floor_number)
        `
        )
        .eq("facility_id", facilityId)
        .eq("status", "OCCUPIED")
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch patients with profiles
      const { data: patientsData, error: patientsError } = await supabase.from(
        "patients"
      ).select(`*`);

      // const { data: patientsData, error: patientsError } = await supabase.from(
      //   "patients"
      // ).select(`
      //     *,
      //     profile:profiles(user_id, first_name, last_name, email, phone_number)
      //   `);

      if (patientsError) throw patientsError;

      // Process patients data
      const processedPatients: Patient[] = (patientsData || []).map(
        (patient: any) => {
          const booking = bookingsData?.find(
            (b: any) => b.patient_id === patient.id
          );

          // Calculate age
          let age = 0;
          if (patient.date_of_birth) {
            const dob = new Date(patient.date_of_birth);
            const today = new Date();
            age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < dob.getDate())
            ) {
              age--;
            }
          }

          // Determine status based on booking status
          let patientStatus = "Pending";
          if (booking) {
            switch (booking.status) {
              case "OCCUPIED":
                patientStatus = "Admitted";
                break;
              case "RESERVED":
                patientStatus = "Reserved";
                break;
              case "CLEANING":
                patientStatus = "Cleaning";
                break;
              case "MAINTENANCE":
                patientStatus = "Maintenance";
                break;
              case "OUT_OF_SERVICE":
                patientStatus = "Out of Service";
                break;
              case "AVAILABLE":
                patientStatus = "Available";
                break;
              default:
                patientStatus = "Pending";
            }
          }

          // Determine priority
          let priority = "low";
          if (booking) {
            switch (booking.priority) {
              case "CRITICAL":
                priority = "emergency";
                break;
              case "HIGH":
                priority = "high";
                break;
              case "MEDIUM":
                priority = "medium";
                break;
              case "LOW":
                priority = "low";
                break;
            }
          }

          return {
            ...patient,
            age,
            name: patient.profile
              ? `${patient.profile.first_name} ${patient.profile.last_name}`.trim()
              : `Patient ${patient.patient_profile_id}`,
            contact:
              patient.profile?.phone_number || patient.emergency_contact_number,
            diagnosis: booking?.primary_diagnosis || "",
            status: patientStatus,
            priority: priority,
            allergies: patient.known_allergies
              ? patient.known_allergies
                  .split(",")
                  .map((a: string) => a.trim())
                  .filter(Boolean)
              : [],
            profile: patient.profile || null,
            booking: booking || null,
            bed: booking?.bed || null,
            ward: booking?.ward || null,
          };
        }
      );

      setPatients(processedPatients);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

// const fetchData = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     const { data: { user }, error: authError } = await supabase.auth.getUser();
    
//     if (authError) throw authError;
//     if (!user) {
//       setError("User not authenticated");
//       setLoading(false);
//       return;
//     }

//     const facilityId = user.user_metadata?.facility_id;
    
//     if (!facilityId) {
//       setError("Facility ID not found in user metadata");
//       setLoading(false);
//       return;
//     }

//     // Fetch beds and wards in parallel
//     const [
//       { data: allBeds, error: bedsError },
//       { data: allWards, error: wardsError }
//     ] = await Promise.all([
//       supabase
//         .from("beds")
//         .select("*")
//         .eq("facility_id", facilityId),
      
//       supabase
//         .from("wards")
//         .select("*")
//         .eq("facility_id", facilityId)
//     ]);

//     // Handle errors
//     if (bedsError) throw bedsError;
//     if (wardsError) throw wardsError;

//     // Set basic data
//     setBedsData(allBeds || []);
//     setWardsData(allWards || []);

//     // Fetch bookings for this facility
//     const { data: bookingsData, error: bookingsError } = await supabase
//       .from("bed_bookings")
//       .select(`
//         *,
//         bed:beds!inner(id, bed_number, bed_type),
//         ward:wards!inner(id, name, floor_number)
//       `)
//       .eq("facility_id", facilityId)
//       .eq("status", "OCCUPIED")
//       .order("created_at", { ascending: false });

//     if (bookingsError) throw bookingsError;
//     setBookings(bookingsData || []);

//     // If no bookings, set empty patients and return
//     if (!bookingsData || bookingsData.length === 0) {
//       setPatients([]);
//       setLoading(false);
//       return;
//     }

//     // Get unique patient IDs from bookings
//     const patientIds = [...new Set(
//       bookingsData
//         .filter(booking => booking.patient_id)
//         .map(booking => booking.patient_id)
//     )];

//     // Fetch patients for these patient IDs
//     const { data: patientsData, error: patientsError } = await supabase
//       .from("patients")
//       .select("*")
//       .in("id", patientIds);

//     if (patientsError) throw patientsError;

//     // Get user IDs from patients
//     const userIds = [...new Set(
//       (patientsData || [])
//         .filter(patient => patient.user_id)
//         .map(patient => patient.user_id)
//     )];

//     // Fetch profiles for these user IDs (if any)
//     let profilesData: any[] = [];
//     if (userIds.length > 0) {
//       const { data: profiles, error: profilesError } = await supabase
//         .from("profiles")
//         .select("user_id, first_name, last_name, email, phone_number")
//         .in("user_id", userIds);

//       if (profilesError) throw profilesError;
//       profilesData = profiles || [];
//     }

//     // Create maps for quick lookups
//     const profilesMap = profilesData.reduce((acc, profile) => {
//       acc[profile.user_id] = profile;
//       return acc;
//     }, {} as Record<string, any>);

//     const bookingsByPatientId = bookingsData.reduce((acc, booking) => {
//       if (booking.patient_id) {
//         acc[booking.patient_id] = booking;
//       }
//       return acc;
//     }, {} as Record<string, any>);

//     // Process patients data
//     const processedPatients: Patient[] = (patientsData || []).map((patient: any) => {
//       const booking = bookingsByPatientId[patient.id];
//       const profile = patient.user_id ? profilesMap[patient.user_id] : null;
      
//       // Calculate age
//       let age = 0;
//       if (patient.date_of_birth) {
//         const dob = new Date(patient.date_of_birth);
//         const today = new Date();
//         age = today.getFullYear() - dob.getFullYear();
//         const monthDiff = today.getMonth() - dob.getMonth();
//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//           age--;
//         }
//       }

//       // Determine patient status
//       let patientStatus = "Pending";
//       if (booking) {
//         switch (booking.status) {
//           case "OCCUPIED":
//             patientStatus = "Admitted";
//             break;
//           case "RESERVED":
//             patientStatus = "Reserved";
//             break;
//           case "CLEANING":
//             patientStatus = "Cleaning";
//             break;
//           case "MAINTENANCE":
//             patientStatus = "Maintenance";
//             break;
//           case "OUT_OF_SERVICE":
//             patientStatus = "Out of Service";
//             break;
//           case "AVAILABLE":
//             patientStatus = "Available";
//             break;
//           default:
//             patientStatus = "Pending";
//         }
//       }

//       // Determine priority
//       let priority = "low";
//       if (booking) {
//         switch (booking.priority) {
//           case "CRITICAL":
//             priority = "emergency";
//             break;
//           case "HIGH":
//             priority = "high";
//             break;
//           case "MEDIUM":
//             priority = "medium";
//             break;
//           case "LOW":
//             priority = "low";
//             break;
//           default:
//             priority = "low";
//         }
//       }

//       // Process allergies
//       const allergies = patient.known_allergies
//         ? patient.known_allergies
//             .split(",")
//             .map((a: string) => a.trim())
//             .filter(Boolean)
//         : [];

//       return {
//         ...patient,
//         age,
//         name: profile
//           ? `${profile.first_name} ${profile.last_name}`.trim()
//           : `Patient ${patient.patient_profile_id || patient.id}`,
//         contact: profile?.phone_number || patient.emergency_contact_number || "",
//         diagnosis: booking?.primary_diagnosis || "",
//         status: patientStatus,
//         priority: priority,
//         allergies: allergies,
//         profile: profile,
//         booking: booking || null,
//         bed: booking?.bed || null,
//         ward: booking?.ward || null,
//       };
//     });

//     setPatients(processedPatients);
//   } catch (error) {
//     console.error("Error fetching patient data:", error);
//     setError(error instanceof Error ? error.message : "Failed to load patient data");
//   } finally {
//     setLoading(false);
//   }
// };

  useEffect(() => {
    fetchData();

    // Listen for refresh events from parent
    const handleRefresh = () => fetchData();
    window.addEventListener("refreshData", handleRefresh);

    return () => {
      window.removeEventListener("refreshData", handleRefresh);
    };
  }, []);

  // Filter patients based on search and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact?.includes(searchTerm) ||
      patient.profile?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.booking?.booking_reference
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      patient.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics from actual data
  const stats = {
    totalWards: wardsData.length,
    totalBeds: bedsData.length,
    availableBeds: bedsData.filter((bed) => bed.status === "AVAILABLE").length,
    occupiedBeds: bedsData.filter((bed) => bed.status === "OCCUPIED").length,
    maintenanceBeds: bedsData.filter((bed) => bed.status === "MAINTENANCE")
      .length,
    cleaningBeds: bedsData.filter((bed) => bed.status === "CLEANING").length,
    reservedBeds: bedsData.filter((bed) => bed.status === "RESERVED").length,
    outOfServiceBeds: bedsData.filter((bed) => bed.status === "OUT_OF_SERVICE")
      .length,
    occupancyRate:
      bedsData.length > 0
        ? Math.round(
            (bedsData.filter((bed) => bed.status === "OCCUPIED").length /
              bedsData.length) *
              100
          )
        : 0,
    admittedPatients: patients.filter((p) => p.status === "Admitted").length,
    criticalPatients: patients.filter((p) => p.priority === "emergency").length,
    averageStay: calculateAverageStay(),
    dailyAdmissions: calculateDailyAdmissions(),
  };

  function calculateAverageStay(): number {
    const dischargedPatients = bookings.filter(
      (b) => b.status === "AVAILABLE" && b.actual_discharge_time
    );
    if (dischargedPatients.length === 0) return 0;

    const totalDays = dischargedPatients.reduce((sum, booking) => {
      const admission = new Date(booking.actual_admission_time);
      const discharge = new Date(booking.actual_discharge_time);
      const diffTime = Math.abs(discharge.getTime() - admission.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);

    return Math.round(totalDays / dischargedPatients.length);
  }

  function calculateDailyAdmissions(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const admissionDate = new Date(booking.actual_admission_time);
      admissionDate.setHours(0, 0, 0, 0);
      return (
        admissionDate.getTime() === today.getTime() &&
        booking.status === "OCCUPIED"
      );
    }).length;
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedBed(patient.bed);
    setSelectedBooking(patient.booking || null);
    setShowDetailsModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    console.log("Edit patient:", patient);
    // Implement edit functionality
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      console.log("Delete patient:", patientId);
      // Implement delete functionality
    }
  };

  const handleAdmitPatient = async (formData: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Generate booking reference
      const bookingReference = `BKG-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      // Create new bed booking
      const { data: booking, error } = await supabase
        .from("bed_bookings")
        .insert({
          booking_reference: bookingReference,
          facility_id: user?.user_metadata?.facility_id,
          patient_id: formData.patientId,
          patient_type: formData.patientType || "INPATIENT",
          admission_type: formData.admissionType,
          primary_diagnosis: formData.primaryDiagnosis,
          secondary_diagnosis: formData.secondaryDiagnosis,
          allergies: formData.allergies,
          special_instructions: formData.specialInstructions,
          required_bed_type: formData.requiredBedType,
          special_requirements: formData.specialRequirements
            ?.split(",")
            .map((req: string) => req.trim()),
          priority: formData.priority,
          referring_doctor_id: formData.referringDoctorId,
          attending_doctor_id: formData.attendingDoctorId,
          primary_nurse_id: formData.primaryNurseId,
          assigned_bed_id: formData.assignedBedId,
          assigned_ward_id: formData.assignedWardId,
          expected_admission_date: formData.expectedAdmissionDate,
          expected_discharge_date: formData.expectedDischargeDate,
          actual_admission_time: new Date().toISOString(),
          status: "OCCUPIED",
          insurance_provider: formData.insuranceProvider,
          insurance_policy_number: formData.insurancePolicyNumber,
          estimated_cost: formData.estimatedCost,
          created_by: user?.id,
          updated_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update bed status to OCCUPIED
      await supabase
        .from("beds")
        .update({ status: "OCCUPIED" })
        .eq("id", formData.assignedBedId);

      alert(
        `Patient admitted successfully! Booking Reference: ${bookingReference}`
      );
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error("Error admitting patient:", error);
      alert("Failed to admit patient. Please try again.");
    }
  };

  const handleDischargePatient = async (
    patientId: string,
    bookingId: string,
    bedId: string
  ) => {
    if (window.confirm("Are you sure you want to discharge this patient?")) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Update bed booking status
        const { error: bookingError } = await supabase
          .from("bed_bookings")
          .update({
            status: "AVAILABLE",
            actual_discharge_time: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq("id", bookingId);

        if (bookingError) throw bookingError;

        // Update bed status to CLEANING
        const { error: bedError } = await supabase
          .from("beds")
          .update({ status: "CLEANING" })
          .eq("id", bedId);

        if (bedError) throw bedError;

        alert("Patient discharged successfully!");
        fetchData();
      } catch (error) {
        console.error("Error discharging patient:", error);
        alert("Failed to discharge patient. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={fetchData} variant="outline" className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="patient-bookings-page space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <Bed className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {stats.occupiedBeds}/{stats.totalBeds}
                </div>
                <p className="text-sm text-muted-foreground">Beds Occupied</p>
                <div className="mt-2">
                  <Progress value={stats.occupancyRate} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-warning/10 rounded-full p-3 mr-4">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {stats.criticalPatients}
                </div>
                <p className="text-sm text-muted-foreground">
                  Critical Patients
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-success/10 rounded-full p-3 mr-4">
                <Home className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.availableBeds}</div>
                <p className="text-sm text-muted-foreground">Available Beds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-info/10 rounded-full p-3 mr-4">
                <Clock className="h-6 w-6 text-info" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.averageStay}</div>
                <p className="text-sm text-muted-foreground">Avg Stay (Days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, contact, email, or booking reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out of service">
                      Out of Service
                    </SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule
              </Button>

              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Admission
              </Button>

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Patient Admissions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Current Patient Admissions</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Patients: {filteredPatients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Bed/Ward</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age}y • {patient.gender} •{" "}
                          {patient.blood_group}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                      {patient.booking?.booking_reference || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    {patient.bed && patient.ward ? (
                      <div>
                        <div className="font-medium flex items-center">
                          <Bed className="mr-1 h-3 w-3" />
                          {patient.bed.bed_number} ({patient.bed.bed_type})
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Home className="mr-1 h-3 w-3" />
                          {patient.ward.name}, Floor {patient.ward.floor_number}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Not assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {patient.diagnosis||"N/A"}
                  </TableCell>
                  <TableCell>
                    {patient.booking?.actual_admission_time
                      ? new Date(
                          patient.booking.actual_admission_time
                        ).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(patient.priority)}>
                      {patient.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(patient)}
                      >
                        View
                      </Button>
                      {patient.booking?.status === "OCCUPIED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                          onClick={() =>
                            handleDischargePatient(
                              patient.id,
                              patient.booking?.id || "",
                              patient.bed?.id || ""
                            )
                          }
                        >
                          Discharge
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPatients.length === 0 && (
            <div className="text-center py-10">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bed Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Bed Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="bg-success/25 rounded-lg p-3 mr-4">
                <Bed className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.availableBeds}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-primary/25 rounded-lg p-3 mr-4">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.occupiedBeds}</div>
                <div className="text-sm text-muted-foreground">Occupied</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-info/25 rounded-lg p-3 mr-4">
                <Bed className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.cleaningBeds}</div>
                <div className="text-sm text-muted-foreground">Cleaning</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-warning/25 rounded-lg p-3 mr-4">
                <Bed className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.maintenanceBeds}
                </div>
                <div className="text-sm text-muted-foreground">Maintenance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Patient Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Patient Admission</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData);
              handleAdmitPatient(data);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="tel"
                  placeholder="Emergency contact number"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="primaryDiagnosis">Primary Diagnosis *</Label>
                <Textarea
                  id="primaryDiagnosis"
                  name="primaryDiagnosis"
                  placeholder="Enter primary diagnosis"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredBedType">Required Bed Type *</Label>
                <Select name="requiredBedType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="CCU">CCU</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="ISOLATION">Isolation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select name="priority" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Admit Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                Patient Details
                <DialogDescription className="text-sm">
                  Complete medical and personal information
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      {selectedPatient.age} years
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {selectedPatient.gender}
                    </Badge>
                    <Badge variant="destructive" className="px-3 py-1">
                      <Heart className="mr-1 h-3 w-3" />
                      {selectedPatient.blood_group}
                    </Badge>
                    <Badge
                      variant={getPriorityBadgeVariant(
                        selectedPatient.priority
                      )}
                      className="px-3 py-1"
                    >
                      {selectedPatient.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground mt-3">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Patient ID: {selectedPatient.patient_profile_id}
                  </div>
                </div>

                {selectedBed && (
                  <div className="text-right">
                    <h4 className="text-lg font-semibold text-primary">
                      Bed {selectedBed.bed_number}
                    </h4>
                    <Badge variant="default" className="mt-2 px-3 py-1">
                      {selectedPatient.ward?.name || "Unknown Ward"}
                    </Badge>
                    <div className="mt-3">
                      <div className="text-sm text-muted-foreground">
                        Bed Type:
                      </div>
                      <div className="font-medium">{selectedBed.bed_type}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <ThermometerIcon className="mr-2 h-4 w-4" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Diagnosis
                      </div>
                      <div className="font-medium">
                        {selectedBooking?.primary_diagnosis ||
                          selectedPatient.diagnosis ||
                          "Not specified"}
                      </div>
                      {selectedBooking?.secondary_diagnosis && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Secondary: {selectedBooking.secondary_diagnosis}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Insurance
                      </div>
                      <div className="font-medium">
                        {selectedBooking?.insurance_provider || "Not specified"}
                        {selectedBooking?.insurance_policy_number && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Policy: {selectedBooking.insurance_policy_number}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Allergies & Restrictions
                      </div>
                      {selectedPatient.allergies &&
                      selectedPatient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.allergies.map((allergy, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="px-2 py-1"
                            >
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          None reported
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Primary Contact
                      </div>
                      <div className="font-medium">
                        {selectedPatient.profile?.phone_number ||
                          selectedPatient.contact}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Emergency Contact
                      </div>
                      <div className="font-medium">
                        {selectedPatient.emergency_contact_name}
                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedPatient.emergency_contact_number}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Email
                      </div>
                      <div className="font-medium">
                        {selectedPatient.profile?.email || "Not available"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Current Medications
                      </div>
                      <div className="font-medium">
                        {selectedPatient.current_medications ||
                          "None specified"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedBooking && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Booking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Booking Reference
                          </div>
                          <div className="font-medium">
                            {selectedBooking.booking_reference}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Admission Type
                          </div>
                          <div className="font-medium">
                            {selectedBooking.admission_type}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Patient Type
                          </div>
                          <Badge variant="secondary">
                            {selectedBooking.patient_type}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Expected Stay
                          </div>
                          <div className="font-medium">
                            {formatDate(
                              selectedBooking.expected_admission_date
                            )}{" "}
                            -{" "}
                            {formatDate(
                              selectedBooking.expected_discharge_date
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Status
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(
                              selectedBooking.status
                            )}
                          >
                            {selectedBooking?.status?.toUpperCase() ||
                              "UNKNOWN"}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Estimated Cost
                          </div>
                          <div className="font-medium">
                            $
                            {selectedBooking.estimated_cost?.toFixed(2) ||
                              "0.00"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.special_instructions && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Special Instructions
                        </div>
                        <div className="font-medium">
                          {selectedBooking.special_instructions}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientBookingsPage;
