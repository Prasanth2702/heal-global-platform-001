import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video, 
  Phone, 
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const appointments = [
    {
      id: "1",
      patientName: "John Doe",
      time: "09:00 AM",
      duration: 30,
      type: "video",
      status: "confirmed",
      phone: "+91 9876543210",
      email: "john@example.com",
      symptoms: "Regular checkup",
      fee: 800,
      paymentStatus: "paid"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      time: "10:30 AM",
      duration: 45,
      type: "in-person",
      status: "pending",
      phone: "+91 9876543211",
      email: "jane@example.com",
      symptoms: "Chest pain, breathing difficulty",
      fee: 1200,
      paymentStatus: "pending"
    },
    {
      id: "3",
      patientName: "Mike Wilson",
      time: "02:00 PM",
      duration: 30,
      type: "group-video",
      status: "completed",
      phone: "+91 9876543212",
      email: "mike@example.com",
      symptoms: "Follow-up consultation",
      fee: 1000,
      paymentStatus: "paid"
    }
  ];

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-600" />;
      case "group-video":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "in-person":
        return <MapPin className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4" />;
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
        <h2 className="text-2xl font-bold">Appointment Calendar</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Sync Google Calendar</Button>
          <Button>New Appointment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Appointment List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Appointments for {format(selectedDate, "PPP")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="in-person">In-Person</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:bg-accent">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getTypeIcon(appointment.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <Badge variant={getStatusColor(appointment.status) as any}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.time} ({appointment.duration} min)</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{appointment.phone}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{appointment.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>₹{appointment.fee} - {appointment.paymentStatus}</span>
                                </div>
                              </div>
                              <p className="text-sm mt-2 text-muted-foreground">
                                <strong>Symptoms:</strong> {appointment.symptoms}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
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
                            <>
                              {appointment.type.includes("video") && (
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  <Video className="h-3 w-3 mr-1" />
                                  Start Video Call
                                </Button>
                              )}
                              <Button variant="outline" size="sm">Send Reminder</Button>
                              <Button variant="outline" size="sm">Reschedule</Button>
                            </>
                          )}
                          {appointment.status === "completed" && (
                            <>
                              <Button variant="outline" size="sm">View Notes</Button>
                              <Button variant="outline" size="sm">Generate Prescription</Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">More</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Add filtered views for other tabs */}
                <TabsContent value="video">
                  <div className="text-center text-muted-foreground py-8">
                    Video appointments will be filtered here
                  </div>
                </TabsContent>

                <TabsContent value="in-person">
                  <div className="text-center text-muted-foreground py-8">
                    In-person appointments will be filtered here
                  </div>
                </TabsContent>

                <TabsContent value="pending">
                  <div className="text-center text-muted-foreground py-8">
                    Pending appointments will be filtered here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;