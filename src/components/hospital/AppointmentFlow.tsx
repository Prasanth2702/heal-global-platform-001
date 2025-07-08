import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, User, Calendar, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AppointmentFlow {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  doctor: string;
  appointmentTime: Date;
  status: "scheduled" | "checked_in" | "in_consultation" | "completed" | "no_show" | "cancelled";
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  waitingTime?: number; // in minutes
  consultationDuration?: number; // in minutes
  priority: "normal" | "urgent" | "emergency";
  notes?: string;
}

const AppointmentFlow = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentFlow[]>([
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      department: "General OPD",
      doctor: "Dr. Rajesh Kumar",
      appointmentTime: new Date(2024, 6, 8, 9, 0),
      status: "checked_in",
      checkInTime: new Date(2024, 6, 8, 8, 45),
      priority: "normal",
      waitingTime: 15
    },
    {
      id: "2",
      patientName: "Sarah Wilson",
      patientId: "P002",
      department: "Cardiology",
      doctor: "Dr. Priya Sharma",
      appointmentTime: new Date(2024, 6, 8, 9, 30),
      status: "in_consultation",
      checkInTime: new Date(2024, 6, 8, 9, 15),
      consultationStartTime: new Date(2024, 6, 8, 9, 25),
      priority: "urgent",
      waitingTime: 10
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientId: "P003",
      department: "Emergency",
      doctor: "Dr. Amit Singh",
      appointmentTime: new Date(2024, 6, 8, 10, 0),
      status: "scheduled",
      priority: "emergency"
    },
    {
      id: "4",
      patientName: "Emily Davis",
      patientId: "P004",
      department: "General OPD",
      doctor: "Dr. Rajesh Kumar",
      appointmentTime: new Date(2024, 6, 8, 8, 30),
      status: "completed",
      checkInTime: new Date(2024, 6, 8, 8, 20),
      consultationStartTime: new Date(2024, 6, 8, 8, 35),
      consultationEndTime: new Date(2024, 6, 8, 9, 0),
      priority: "normal",
      waitingTime: 15,
      consultationDuration: 25
    }
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || apt.department === departmentFilter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const handleStatusUpdate = (appointmentId: string, newStatus: AppointmentFlow["status"]) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const updatedApt = { ...apt, status: newStatus };
        
        // Update timestamps based on status
        const now = new Date();
        switch (newStatus) {
          case "checked_in":
            updatedApt.checkInTime = now;
            break;
          case "in_consultation":
            updatedApt.consultationStartTime = now;
            if (apt.checkInTime) {
              updatedApt.waitingTime = Math.round((now.getTime() - apt.checkInTime.getTime()) / (1000 * 60));
            }
            break;
          case "completed":
            updatedApt.consultationEndTime = now;
            if (apt.consultationStartTime) {
              updatedApt.consultationDuration = Math.round((now.getTime() - apt.consultationStartTime.getTime()) / (1000 * 60));
            }
            break;
        }
        
        return updatedApt;
      }
      return apt;
    }));

    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus.replace("_", " ")}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "checked_in":
        return "bg-yellow-100 text-yellow-800";
      case "in_consultation":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "no_show":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "checked_in":
        return <User className="h-4 w-4" />;
      case "in_consultation":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "no_show":
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const departments = ["General OPD", "Cardiology", "Emergency", "Radiology", "Pathology Lab"];
  const statuses = ["scheduled", "checked_in", "in_consultation", "completed", "no_show", "cancelled"];

  // Calculate statistics
  const totalAppointments = appointments.length;
  const checkedInCount = appointments.filter(apt => apt.status === "checked_in").length;
  const inConsultationCount = appointments.filter(apt => apt.status === "in_consultation").length;
  const completedCount = appointments.filter(apt => apt.status === "completed").length;
  const averageWaitTime = appointments.filter(apt => apt.waitingTime).reduce((sum, apt) => sum + (apt.waitingTime || 0), 0) / 
                         appointments.filter(apt => apt.waitingTime).length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Today's schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInCount}</div>
            <p className="text-xs text-muted-foreground">Waiting for consultation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inConsultationCount}</div>
            <p className="text-xs text-muted-foreground">Currently with doctor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageWaitTime)}min</div>
            <p className="text-xs text-muted-foreground">Average waiting time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Patient Flow & Check-ins
          </CardTitle>
          <CardDescription>
            Real-time appointment tracking and patient flow management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Info</TableHead>
                <TableHead>Department & Doctor</TableHead>
                <TableHead>Appointment Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.department}</p>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(appointment.appointmentTime, "HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(appointment.priority)} variant="outline">
                      {appointment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {appointment.checkInTime && (
                        <p>Check-in: {format(appointment.checkInTime, "HH:mm")}</p>
                      )}
                      {appointment.waitingTime && (
                        <p>Wait: {appointment.waitingTime}min</p>
                      )}
                      {appointment.consultationDuration && (
                        <p>Duration: {appointment.consultationDuration}min</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {appointment.status === "scheduled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, "checked_in")}
                        >
                          Check In
                        </Button>
                      )}
                      {appointment.status === "checked_in" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, "in_consultation")}
                        >
                          Start
                        </Button>
                      )}
                      {appointment.status === "in_consultation" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                      {(appointment.status === "scheduled" || appointment.status === "checked_in") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentFlow;