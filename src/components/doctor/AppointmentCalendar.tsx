import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isSameDay } from "date-fns";
import { CalendarIcon, Clock, User, Video, MapPin, Phone, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: "teleconsultation" | "in-person" | "follow-up";
  date: Date;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  consultationFee: number;
  notes?: string;
  patientPhone?: string;
  reasonForVisit: string;
}

const AppointmentCalendar = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<"day" | "week" | "month">("day");

  // Mock appointment data
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      type: "in-person",
      date: new Date(),
      time: "9:00 AM",
      duration: 30,
      status: "confirmed",
      consultationFee: 800,
      reasonForVisit: "Chest pain and shortness of breath",
      patientPhone: "+91-9876543210"
    },
    {
      id: "2",
      patientName: "Sarah Wilson",
      patientId: "P002",
      type: "teleconsultation",
      date: new Date(),
      time: "10:30 AM",
      duration: 20,
      status: "confirmed",
      consultationFee: 600,
      reasonForVisit: "Follow-up for hypertension",
      patientPhone: "+91-9876543211"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientId: "P003",
      type: "follow-up",
      date: addDays(new Date(), 1),
      time: "2:00 PM",
      duration: 20,
      status: "pending",
      consultationFee: 500,
      reasonForVisit: "Post-surgery follow-up",
      patientPhone: "+91-9876543212"
    },
    {
      id: "4",
      patientName: "Emily Davis",
      patientId: "P004",
      type: "in-person",
      date: addDays(new Date(), -1),
      time: "11:00 AM",
      duration: 45,
      status: "completed",
      consultationFee: 1000,
      reasonForVisit: "Annual health checkup",
      patientPhone: "+91-9876543213"
    }
  ];

  const selectedDateAppointments = appointments.filter(apt => 
    isSameDay(apt.date, selectedDate)
  );

  const upcomingAppointments = appointments.filter(apt => 
    apt.date >= new Date() && apt.status !== "completed"
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleAppointmentAction = (appointmentId: string, action: "accept" | "reject" | "reschedule" | "complete" | "start") => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    switch (action) {
      case "accept":
        toast({
          title: "Appointment Confirmed",
          description: `Appointment with ${appointment.patientName} has been confirmed.`,
        });
        break;
      case "reject":
        toast({
          title: "Appointment Cancelled",
          description: `Appointment with ${appointment.patientName} has been cancelled.`,
        });
        break;
      case "start":
        if (appointment.type === "teleconsultation") {
          toast({
            title: "Starting Video Call",
            description: "Launching teleconsultation session...",
          });
        } else {
          toast({
            title: "Patient Check-in",
            description: "Mark patient as checked in for consultation.",
          });
        }
        break;
      case "complete":
        toast({
          title: "Consultation Completed",
          description: "Appointment marked as completed. Please add notes if needed.",
        });
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "teleconsultation":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "follow-up":
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointment Calendar</h2>
          <p className="text-muted-foreground">
            Manage your appointments and schedule
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("w-full pointer-events-auto")}
              modifiers={{
                hasAppointments: appointments.map(apt => apt.date)
              }}
              modifiersStyles={{
                hasAppointments: { 
                  backgroundColor: 'hsl(var(--primary))', 
                  color: 'white',
                  borderRadius: '4px'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardTitle>
            <CardDescription>
              {selectedDateAppointments.length} appointment(s) scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-doctor/10">
                        {getTypeIcon(appointment.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.reasonForVisit}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm">{appointment.time}</span>
                          <span className="text-sm">₹{appointment.consultationFee}</span>
                          <Badge variant="outline" className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAppointmentAction(appointment.id, "accept")}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAppointmentAction(appointment.id, "reject")}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="doctor"
                          onClick={() => handleAppointmentAction(appointment.id, "start")}
                        >
                          {appointment.type === "teleconsultation" ? (
                            <>
                              <Video className="mr-1 h-3 w-3" />
                              Start Call
                            </>
                          ) : (
                            <>
                              <User className="mr-1 h-3 w-3" />
                              Check In
                            </>
                          )}
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="mr-1 h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                  <p className="text-muted-foreground">
                    No appointments found for {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Next {upcomingAppointments.length} appointments in your schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(appointment.type)}
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(appointment.date, "MMM d")} at {appointment.time} • ₹{appointment.consultationFee}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming appointments
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;