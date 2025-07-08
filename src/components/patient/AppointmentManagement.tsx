import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, Video, User, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "teleconsultation";
  status: "upcoming" | "completed" | "cancelled";
  location: string;
  consultationFee: number;
  doctorImage: string;
}

const AppointmentManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Mock data - will be replaced with real data from Supabase
  const appointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "in-person",
      status: "upcoming",
      location: "Apollo Hospital, Sector 26",
      consultationFee: 800,
      doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-01-18",
      time: "2:30 PM",
      type: "teleconsultation",
      status: "upcoming",
      location: "Online Consultation",
      consultationFee: 600,
      doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      doctorName: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      date: "2024-01-10",
      time: "11:00 AM",
      type: "in-person",
      status: "completed",
      location: "Max Hospital, Sector 19",
      consultationFee: 700,
      doctorImage: "https://images.unsplash.com/photo-1594824275948-b1ad70b45c6b?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "4",
      doctorName: "Dr. Rajesh Kumar",
      specialty: "Orthopedic",
      date: "2024-01-08",
      time: "4:00 PM",
      type: "in-person",
      status: "cancelled",
      location: "Fortis Hospital, Sector 62",
      consultationFee: 900,
      doctorImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming");
  const pastAppointments = appointments.filter(apt => apt.status !== "upcoming");

  const handleReschedule = (appointmentId: string) => {
    toast({
      title: "Reschedule Appointment",
      description: "Opening calendar to select new date and time...",
    });
    // Navigate to reschedule page
  };

  const handleCancel = (appointmentId: string) => {
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled. Refund will be processed within 3-5 business days.",
    });
    // Handle cancellation
  };

  const handleJoinCall = (appointmentId: string) => {
    toast({
      title: "Joining Video Call",
      description: "Starting video consultation...",
    });
    // Navigate to video call interface
  };

  const handleViewPrescription = (appointmentId: string) => {
    toast({
      title: "Opening Prescription",
      description: "Loading your prescription and medical notes...",
    });
    // Navigate to prescription view
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card key={appointment.id} className="hover:shadow-medium transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Doctor Image */}
          <div className="flex-shrink-0">
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          {/* Appointment Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-semibold">{appointment.doctorName}</h4>
                <p className="text-muted-foreground">{appointment.specialty}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(appointment.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {appointment.time}
              </div>
              <div className="flex items-center">
                {appointment.type === "teleconsultation" ? (
                  <Video className="h-4 w-4 mr-2" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {appointment.location}
              </div>
              <div className="flex items-center">
                <span className="font-medium text-green-600">
                  ₹{appointment.consultationFee}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {appointment.status === "upcoming" && (
                <>
                  {appointment.type === "teleconsultation" && (
                    <Button 
                      size="sm" 
                      variant="patient"
                      onClick={() => handleJoinCall(appointment.id)}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Join Call
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReschedule(appointment.id)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {appointment.status === "completed" && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewPrescription(appointment.id)}
                  >
                    View Prescription
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Doctor
                  </Button>
                  <Button size="sm" variant="patient">
                    Book Again
                  </Button>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                  <DropdownMenuItem>Rate & Review</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <Button variant="patient">
          <Calendar className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={activeTab === "upcoming" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingAppointments.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("past")}
        >
          Past Appointments ({pastAppointments.length})
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {activeTab === "upcoming" && (
          <>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled appointments.
                  </p>
                  <Button variant="patient">
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
                  <p className="text-muted-foreground">
                    Your appointment history will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;