import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Search, Clock, FileText } from "lucide-react";

const PatientDashboard = () => {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "In-person"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist", 
      date: "2024-01-18",
      time: "2:30 PM",
      type: "Teleconsultation"
    }
  ];

  const recentReports = [
    { id: 1, name: "Blood Test Report", date: "2024-01-10", doctor: "Dr. Sarah Johnson" },
    { id: 2, name: "ECG Report", date: "2024-01-08", doctor: "Dr. Sarah Johnson" },
    { id: 3, name: "X-Ray Chest", date: "2024-01-05", doctor: "Dr. Michael Chen" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground">Manage your health and appointments</p>
        </div>
        <Button variant="patient" size="lg">
          <Search className="mr-2 h-4 w-4" />
          Find Doctors
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="patient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
            <CardDescription className="text-2xl font-bold text-patient">
              {upcomingAppointments.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="patient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medical Reports</CardTitle>
            <CardDescription className="text-2xl font-bold text-patient">
              {recentReports.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="patient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Prescriptions</CardTitle>
            <CardDescription className="text-2xl font-bold text-patient">3</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="patient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            <CardDescription className="text-2xl font-bold text-patient">85%</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-patient/10 text-patient px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="patient" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Medical Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">By {report.doctor}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
              <Button variant="patient" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Upload New Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="patient" className="h-20 flex-col">
              <User className="h-6 w-6 mb-2" />
              <span className="text-sm">Update Profile</span>
            </Button>
            <Button variant="patient" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Book Appointment</span>
            </Button>
            <Button variant="patient" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Medical History</span>
            </Button>
            <Button variant="patient" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm">Emergency SOS</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;