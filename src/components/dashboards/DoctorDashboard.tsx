import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, FileText, TrendingUp } from "lucide-react";

const DoctorDashboard = () => {
  const todayAppointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "9:00 AM",
      type: "In-person",
      status: "Confirmed"
    },
    {
      id: 2,
      patient: "Sarah Wilson",
      time: "10:30 AM", 
      type: "Teleconsultation",
      status: "Confirmed"
    },
    {
      id: 3,
      patient: "Mike Johnson",
      time: "2:00 PM",
      type: "Follow-up",
      status: "Pending"
    }
  ];

  const recentPatients = [
    { id: 1, name: "Emily Davis", lastVisit: "2024-01-12", condition: "Hypertension" },
    { id: 2, name: "Robert Brown", lastVisit: "2024-01-11", condition: "Diabetes Follow-up" },
    { id: 3, name: "Lisa Garcia", lastVisit: "2024-01-10", condition: "Routine Checkup" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your practice and patients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="doctor" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline" size="lg">
            <User className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">
              {todayAppointments.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month's Patients</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">127</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (This Month)</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">₹45,200</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="doctor">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patient Rating</CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">4.8/5</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} • {appointment.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-doctor/10 text-doctor' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="doctor" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Record
                  </Button>
                </div>
              ))}
              <Button variant="doctor" className="w-full">
                <User className="mr-2 h-4 w-4" />
                View All Patients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features for your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button variant="doctor" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">e-Prescription</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col">
              <User className="h-6 w-6 mb-2" />
              <span className="text-sm">Patient Records</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="doctor" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm">Teleconsult</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;