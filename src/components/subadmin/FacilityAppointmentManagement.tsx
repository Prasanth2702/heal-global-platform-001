import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface FacilityAppointmentManagementProps {
  facilityId: string;
}

const FacilityAppointmentManagement = ({ facilityId }: FacilityAppointmentManagementProps) => {
  const [appointments] = useState([
    {
      id: "1",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      department: "Cardiology",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed",
      phone: "+91 9876543210",
      type: "consultation"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      doctorName: "Dr. Johnson",
      department: "General Medicine",
      date: "2024-01-15",
      time: "11:30 AM",
      status: "pending",
      phone: "+91 9876543211",
      type: "checkup"
    },
    {
      id: "3",
      patientName: "Mike Wilson",
      doctorName: "Dr. Brown",
      department: "Orthopedics",
      date: "2024-01-15",
      time: "02:00 PM",
      status: "completed",
      phone: "+91 9876543212",
      type: "follow-up"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointment Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button>New Appointment</Button>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(appointment.status)}
                    <div>
                      <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctorName} • {appointment.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(appointment.status) as any}>
                    {appointment.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    {appointment.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">Confirm</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button variant="outline" size="sm">Mark Complete</Button>
                    )}
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                No upcoming appointments found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Appointment history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Department-wise appointment breakdown coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityAppointmentManagement;