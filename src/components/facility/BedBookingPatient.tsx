// components/facility/BedBookingPatient.tsx
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
  Eye,
  AlertCircle,
  User,
  Bed,
  Home,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import mixpanelInstance from "@/utils/mixpanel";

// Types
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT";
type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";

interface Bed {
  id: string;
  bed_number: string;
  bed_type: string;
  current_status: BedStatus;
  ward_id: string;
  room_number?: string;
  facility_id: string;
  is_active: boolean;
}

interface Ward {
  id: string;
  name: string;
  floor_number: string;
  ward_type: string;
  available_beds: number;
}

interface Patient {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  contact: string;
  email?: string;
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
  actual_admission_time?: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  allergies?: string;
  special_instructions?: string;
  assigned_bed_id: string;
  facility_id: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  bed?: Bed;
  ward?: Ward;
}

const BedBookingPatient: React.FC = () => {
  const [bookings, setBookings] = useState<BedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BedBooking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  // Helper: format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Helper: get badge variant for status
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      case "CHECKED_IN":
        return "default";
      case "CHECKED_OUT":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority?: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Get facility ID from admin or staff
  const getUserFacilityId = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Admin
    const { data: adminFacility } = await supabase
      .from("facilities")
      .select("id")
      .eq("admin_user_id", user.id)
      .maybeSingle();
    if (adminFacility) return adminFacility.id;

    // Staff
    const { data: staff } = await supabase
      .from("staff")
      .select("facility_id")
      .eq("user_id", user.id)
      .maybeSingle();
    return staff?.facility_id || null;
  };

  // Fetch bookings with status PENDING or CONFIRMED
  const fetchData = async () => {
    try {
      setLoading(true);
      const facilityId = await getUserFacilityId();
      if (!facilityId) {
        setBookings([]);
        return;
      }

      // Fetch bed bookings with patient, bed and ward details
      const { data: bookingsData, error } = await supabase
        .from("bed_bookings")
        .select(`
          *,
          bed:beds(
            id,
            bed_number,
            bed_type,
            current_status,
            room_number,
            ward_id
          ),
          ward:wards(
            id,
            name,
            floor_number,
            ward_type
          )
        `)
        .eq("facility_id", facilityId)
        // .in("status", ["PENDING", "CONFIRMED"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        setBookings([]);
        return;
      }

      // Extract unique patient_ids (user_id links to patients table)
      const patientUserIds = bookingsData
        .map(b => b.patient_id)
        .filter((id): id is string => !!id);

      let patientsMap: Record<string, Patient> = {};
      if (patientUserIds.length > 0) {
        const { data: patientsData } = await supabase
          .from("patients")
          .select("id, user_id, date_of_birth, gender, blood_group, emergency_contact_number, known_allergies, patient_profile_id")
          .in("user_id", patientUserIds);

        if (patientsData) {
          // Also fetch profiles to get name, email, phone
          const profileUserIds = patientsData.map(p => p.user_id).filter((id): id is string => !!id);
          let profilesMap: Record<string, any> = {};
          if (profileUserIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, first_name, last_name, email, phone_number")
              .in("user_id", profileUserIds);
            if (profiles) {
              profiles.forEach(prof => {
                profilesMap[prof.user_id] = prof;
              });
            }
          }

          patientsMap = patientsData.reduce((map, patient) => {
            const profile = patient.user_id ? profilesMap[patient.user_id] : null;
            let age = 0;
            if (patient.date_of_birth) {
              const dob = new Date(patient.date_of_birth);
              const today = new Date();
              age = today.getFullYear() - dob.getFullYear();
              const monthDiff = today.getMonth() - dob.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
            }
            const name = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : `Patient ${patient.patient_profile_id || patient.id.substring(0, 8)}`;
            map[patient.user_id] = {
              id: patient.id,
              user_id: patient.user_id,
              name: name,
              age,
              gender: patient.gender || "Not specified",
              blood_group: patient.blood_group || "Unknown",
              contact: profile?.phone_number || patient.emergency_contact_number || "N/A",
              email: profile?.email || "N/A",
            };
            return map;
          }, {} as Record<string, Patient>);
        }
      }

      // Map bookings with patient, bed, ward
      const enrichedBookings: BedBooking[] = bookingsData.map(booking => ({
        ...booking,
        patient: booking.patient_id ? patientsMap[booking.patient_id] : undefined,
        bed: booking.bed ? {
          ...booking.bed,
          current_status: booking.bed.current_status as BedStatus,
        } : undefined,
        ward: booking.ward || undefined,
      }));

      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Error fetching pending/confirmed bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load booking data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.primary_diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bed?.bed_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action handlers
  const handleViewDetails = (booking: BedBooking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
    mixpanelInstance.track("View Booking Details", { bookingId: booking.id, status: booking.status });
  };

  const handleCancelBooking = async (booking: BedBooking) => {
    if (!confirm(`Cancel booking ${booking.booking_reference}?`)) return;
    try {
      const { error } = await supabase
        .from("bed_bookings")
        .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
        .eq("id", booking.id);
      if (error) throw error;
      toast({ title: "Booking cancelled", description: `Booking ${booking.booking_reference} has been cancelled.` });
      fetchData(); // refresh
      mixpanelInstance.track("Cancel Booking", { bookingId: booking.id });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" });
    }
  };

  const handleAdmitPatient = async (booking: BedBooking) => {
    if (!booking.assigned_bed_id) {
      toast({ title: "Error", description: "No bed assigned to this booking.", variant: "destructive" });
      return;
    }
    if (!confirm(`Admit patient ${booking.patient?.name} to bed ${booking.bed?.bed_number}?`)) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("No session");

      const response = await fetch(
        "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/admit-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            booking_id: booking.id,
            bed_id: booking.assigned_bed_id,
            ward_id: booking.bed?.ward_id,
            admission_diagnosis: booking.primary_diagnosis || "",
            notes: "",
          }),
        }
      );
      if (!response.ok) throw new Error("Admission failed");
      toast({ title: "Patient admitted", description: `${booking.patient?.name} has been admitted.` });
      fetchData();
      mixpanelInstance.track("Admit Patient", { bookingId: booking.id });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to admit patient.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pending & Confirmed Bed Bookings</CardTitle>
          <CardDescription>
            Manage patient admissions, cancel bookings, or view detailed information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, booking ref, diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Booking Period</TableHead>
                <TableHead>Bed / Ward</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending or confirmed bookings found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.patient?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.patient?.age}y • {booking.patient?.gender}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {booking.booking_reference}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(booking.expected_admission_date)}
                      </div>
                      <div className="text-xs text-muted-foreground">→</div>
                      <div className="text-sm">
                        {formatDate(booking.expected_discharge_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.bed ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3" /> {booking.bed.bed_number} ({booking.bed.bed_type})
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Home className="h-3 w-3" /> {booking.ward?.name || "Unknown Ward"}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {booking.primary_diagnosis || "N/A"}
                    </TableCell>
                    <TableCell>
                      {booking.actual_admission_time
                        ? formatDate(booking.actual_admission_time)
                        : "Not admitted"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(booking.priority)}>
                        {booking.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(booking)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking)}
                            title="Cancel Booking"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAdmitPatient(booking)}
                              title="Admit Patient"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Admit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking)}
                              title="Cancel Booking"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking {selectedBooking?.booking_reference}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Patient</h4>
                  <p className="font-medium">{selectedBooking.patient?.name || "N/A"}</p>
                  <p className="text-sm">
                    {selectedBooking.patient?.age} years, {selectedBooking.patient?.gender}
                  </p>
                  <p className="text-sm">Blood: {selectedBooking.patient?.blood_group}</p>
                  <p className="text-sm">Contact: {selectedBooking.patient?.contact}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Booking Reference</h4>
                  <p className="font-mono">{selectedBooking.booking_reference}</p>
                  <h4 className="text-sm font-medium text-muted-foreground mt-2">Status</h4>
                  <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                  <h4 className="text-sm font-medium text-muted-foreground mt-2">Priority</h4>
                  <Badge variant={getPriorityBadgeVariant(selectedBooking.priority)}>
                    {selectedBooking.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Expected Stay</h4>
                <p>
                  {formatDateTime(selectedBooking.expected_admission_date)} →{" "}
                  {formatDateTime(selectedBooking.expected_discharge_date)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Bed</h4>
                  {selectedBooking.bed ? (
                    <p>
                      {selectedBooking.bed.bed_number} ({selectedBooking.bed.bed_type})<br />
                      Room: {selectedBooking.bed.room_number || "N/A"}<br />
                      Status: {selectedBooking.bed.current_status}
                    </p>
                  ) : (
                    <p>Not assigned</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Ward</h4>
                  {selectedBooking.ward ? (
                    <p>
                      {selectedBooking.ward.name}<br />
                      Floor {selectedBooking.ward.floor_number}<br />
                      Type: {selectedBooking.ward.ward_type}
                    </p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Diagnosis</h4>
                <p className="whitespace-pre-wrap">
                  {selectedBooking.primary_diagnosis || "None"}<br />
                  {selectedBooking.secondary_diagnosis && (
                    <span className="text-sm text-muted-foreground">
                      Secondary: {selectedBooking.secondary_diagnosis}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Allergies & Special Instructions</h4>
                <p>{selectedBooking.allergies || "None reported"}</p>
                <p className="mt-1">{selectedBooking.special_instructions || "No special instructions"}</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                {selectedBooking.status === "CONFIRMED" && (
                  <Button onClick={() => handleAdmitPatient(selectedBooking)}>Admit Patient</Button>
                )}
                {selectedBooking.status === "PENDING" && (
                  <Button variant="destructive" onClick={() => handleCancelBooking(selectedBooking)}>
                    Cancel Booking
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedBookingPatient;