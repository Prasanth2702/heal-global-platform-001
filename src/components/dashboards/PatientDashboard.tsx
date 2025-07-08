import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Search, Clock, FileText, Star, Heart, Shield, Plus } from "lucide-react";
import DoctorSearch from "@/components/patient/DoctorSearch";
import AppointmentManagement from "@/components/patient/AppointmentManagement";
import DocumentVault from "@/components/patient/DocumentVault";
import RecordSharing from "@/components/patient/RecordSharing";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "search" | "appointments" | "documents" | "sharing">("overview");

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

  const carePlans = [
    {
      id: 1,
      name: "Cardiac Care Plus",
      description: "Comprehensive heart health monitoring",
      price: "₹2,999/month",
      features: ["Monthly doctor consultations", "Heart rate monitoring", "Diet planning", "Emergency support"]
    },
    {
      id: 2,
      name: "Diabetes Management",
      description: "Complete diabetes care and monitoring",
      price: "₹1,999/month",
      features: ["Blood sugar tracking", "Dietician consultations", "Medication reminders", "Regular check-ups"]
    }
  ];

  if (activeTab !== "overview") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("search")}
            >
              Find Doctors
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("documents")}
            >
              Medical Vault
            </Button>
            <Button
              variant={activeTab === "sharing" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sharing")}
            >
              Share Records
            </Button>
          </div>
        </div>

        {activeTab === "search" && <DoctorSearch />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "documents" && <DocumentVault />}
        {activeTab === "sharing" && <RecordSharing />}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground">Manage your health and appointments</p>
        </div>
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <Button
            variant="default"
            size="sm"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("search")}
          >
            Find Doctors
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("documents")}
          >
            Medical Vault
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("sharing")}
          >
            Share Records
          </Button>
        </div>
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
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="patient" 
                className="w-full"
                onClick={() => setActiveTab("search")}
              >
                <Search className="mr-2 h-4 w-4" />
                Find & Book Doctors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Medical Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.slice(0, 3).map((report) => (
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
              <Button 
                variant="patient" 
                className="w-full"
                onClick={() => setActiveTab("documents")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Recommended Care Plans
          </CardTitle>
          <CardDescription>
            Subscribe to specialized care packages for chronic conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {carePlans.map((plan) => (
              <Card key={plan.id} variant="patient">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-patient">{plan.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-patient mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="patient" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              variant="patient" 
              className="h-20 flex-col"
              onClick={() => setActiveTab("search")}
            >
              <Search className="h-6 w-6 mb-2" />
              <span className="text-sm">Find Doctors</span>
            </Button>
            <Button 
              variant="patient" 
              className="h-20 flex-col"
              onClick={() => setActiveTab("appointments")}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Appointments</span>
            </Button>
            <Button 
              variant="patient" 
              className="h-20 flex-col"
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Medical Vault</span>
            </Button>
            <Button 
              variant="patient" 
              className="h-20 flex-col"
              onClick={() => setActiveTab("sharing")}
            >
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Share Records</span>
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