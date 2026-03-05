// components/facility/shared/PatientTable.tsx
import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  CalendarDays,
  AlertCircle,
  User,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BedBooking, Patient } from "../facility";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientTableProps {
  patients: Patient[];
  bookings: BedBooking[];
  onViewDetails?: (patient: Patient, booking?: BedBooking) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
  onFilterChange?: (filter: any) => void;
  showActions?: boolean;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  bookings,
  onViewDetails,
  onEdit,
  onDelete,
  onFilterChange,
  showActions = true,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Admitted":
        return <Badge variant="default">Admitted</Badge>;
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "Discharged":
        return <Badge variant="success">Discharged</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "emergency":
        return (
          <Badge variant="destructive" className="px-2 py-1">
            Emergency
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="default" className="px-2 py-1">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="success" className="px-2 py-1">
            Low
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getBookingForPatient = (patientId: string) => {
    return bookings.find((booking) => booking.patient_id === patientId);
  };

  return (
    <div className="patient-table">
      {/* Table Header with Filters */}
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold">Patient Admissions</h5>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Patients</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All Patients</DropdownMenuItem>
              <DropdownMenuItem>Admitted Only</DropdownMenuItem>
              <DropdownMenuItem>Discharged Only</DropdownMenuItem>
              <DropdownMenuItem>Critical Only</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Admission Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Details</TableHead>
              <TableHead>Medical Info</TableHead>
              <TableHead>Bed/Ward</TableHead>
              <TableHead>Admission Details</TableHead>
              <TableHead>Status</TableHead>
              {showActions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const booking = getBookingForPatient(patient.id);

              return (
                <TableRow key={patient.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age}y • {patient.gender} •{" "}
                          {patient.blood_group}
                        </div>
                        <div className="mt-1 flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{patient.contact}</span>
                        </div>
                        {patient.profile?.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">
                              {patient.profile.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking?.primary_diagnosis ||
                          patient.diagnosis ||
                          "Not specified"}
                      </div>
                      {booking?.secondary_diagnosis && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Secondary: {booking.secondary_diagnosis}
                        </div>
                      )}
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="mt-2 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                          <span className="text-sm text-yellow-600">
                            Allergies: {patient.allergies.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {booking?.bed && booking?.ward ? (
                      <div>
                        <Badge variant="default" className="mb-1">
                          {booking.bed.bed_number}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {booking.ward.name}
                        </div>
                        <div className="text-sm">
                          Floor {booking.ward.floor_number}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Not Assigned</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking
                          ? formatDate(booking.expected_admission_date)
                          : "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Admission Date
                      </div>
                      <div className="mt-2">
                        {getPriorityBadge(patient.priority)}
                      </div>
                      {booking?.expected_discharge_date && (
                        <div className="mt-2">
                          <div className="text-sm text-muted-foreground">
                            Expected Discharge
                          </div>
                          <div className="font-medium text-sm">
                            {formatDate(booking.expected_discharge_date)}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(patient.status)}</TableCell>

                  {showActions && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {onViewDetails && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDetails(patient, booking)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(patient)}
                            title="Edit patient"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(patient.id)}
                            title="Delete patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {patients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 6 : 5}
                  className="text-center py-8"
                >
                  <div className="text-muted-foreground">
                    No patients found. Add patients to get started.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {patients.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {patients.length} of {patients.length} patients
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
