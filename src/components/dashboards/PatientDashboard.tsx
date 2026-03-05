import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, Search, Clock, FileText, Star, Heart, Shield, Plus, DollarSign, Settings, Bed } from "lucide-react";
import DoctorSearch from "@/components/patient/DoctorSearch";
import AppointmentManagement from "@/components/patient/AppointmentManagement";
import DocumentVault from "@/components/patient/DocumentVault";
import RecordSharing from "@/components/patient/RecordSharing";
import PaymentManagement from "@/components/patient/PaymentManagement";
import PatientProfile from "@/components/patient/PatientProfile";
import PatientDetailsPage from "@/pages/patient/PatientDetailsPage";

interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location?: string;
  distance?: string;
  consultationFee: number;
  availability: string;
  hospital?: string;
  image?: string;
  description?: string;
}
const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "search" | "appointments" | "documents" | "sharing" | "payments" | "profile"|"bookings">("overview");
 const [doctors, setDoctors] = useState<Doctor[]>([]);
  // Update tab based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/search')) setActiveTab('search');
    else if (path.includes('/appointments')) setActiveTab('appointments');
    else if (path.includes('/records')) setActiveTab('documents');
    else if (path.includes('/sharing')) setActiveTab('sharing');
    else if (path.includes('/my_bed_bookings')) setActiveTab('bookings');
    else if (path.includes('/payments')) setActiveTab('payments');
    else setActiveTab('overview');
  }, [location.pathname]);

  // Update URL when tab changes
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const basePath = '/dashboard/patient';
    switch (tab) {
      case 'overview': navigate(basePath); break;
      case 'profile': navigate(`${basePath}/profile`); break;
      case 'search': navigate(`${basePath}/search`); break;
      case 'appointments': navigate(`${basePath}/appointments`); break;
      case 'documents': navigate(`${basePath}/records`); break;
      case 'sharing': navigate(`${basePath}/sharing`); break;
      case 'bookings': navigate(`${basePath}/my_bed_bookings`); break;
      case 'payments': navigate(`${basePath}/payments`); break;
    }
  };

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

  if (activeTab === "profile") {
    return <PatientProfile onBack={() => handleTabChange("overview")} />;
  }

  if (activeTab !== "overview") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("overview")}
              className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("search")}
              className={activeTab === "search" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}
            >
              <Search className="h-4 w-4 mr-1" />
              Find Doctors
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("appointments")}
              className={activeTab === "appointments" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Appointments
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("bookings")}
              className={activeTab === "bookings" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <Bed className="h-4 w-4 mr-1" />
              My Bed Bookings
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("documents")}
              className={activeTab === "documents" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"}
            >
              <FileText className="h-4 w-4 mr-1" />
              Medical Vault
            </Button>
            <Button
              variant={activeTab === "sharing" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("sharing")}
              className={activeTab === "sharing" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"}
            >
              <Shield className="h-4 w-4 mr-1" />
              Share Records
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("payments")}
              className={activeTab === "payments" ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button>
          </div>
        </div>

        {activeTab === "search" && <DoctorSearch  view="all"/>}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "bookings" && <PatientDetailsPage />}
        {activeTab === "documents" && <DocumentVault />}
        {activeTab === "sharing" && <RecordSharing />}
        {activeTab === "payments" && <PaymentManagement />}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Patient Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">✨ Manage your health and appointments with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => handleTabChange("profile")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            My Profile
          </Button>
        </div>
      </div>
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleTabChange("overview")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              Overview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("search")}
              className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
            >
              <Search className="h-4 w-4 mr-1" />
              Find Doctors
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("appointments")}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Appointments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("bookings")}
              className="hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100"
            >
              <Bed className="h-4 w-4 mr-1" />
              My Bed Bookings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("documents")}
              className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100"
            >
              <FileText className="h-4 w-4 mr-1" />
              Medical Vault
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("sharing")}
              className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"
            >
              <Shield className="h-4 w-4 mr-1" />
              Share Records
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange("payments")}
              className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Payments
            </Button>
          </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Upcoming Appointments</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              {upcomingAppointments.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Medical Reports</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              {recentReports.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Active Prescriptions</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Heart className="h-6 w-6 mr-2" />
              3
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Health Score</CardTitle>
            <CardDescription className="text-3xl font-bold text-white flex items-center">
              <Star className="h-6 w-6 mr-2" />
              85%
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Calendar className="mr-2 h-6 w-6" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
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
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={() => handleTabChange("search")}
              >
                <Search className="mr-2 h-4 w-4" />
                Find & Book Doctors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Reports */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-6 w-6" />
              Medical Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
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
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                onClick={() => handleTabChange("documents")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Plans */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <Heart className="mr-2 h-6 w-6" />
            💎 Recommended Care Plans
          </CardTitle>
          <CardDescription className="text-purple-100">
            Subscribe to specialized care packages for chronic conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {carePlans.map((plan) => (
              <Card key={plan.id} className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{plan.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl">🚀 Quick Actions</CardTitle>
          <CardDescription className="text-indigo-100">Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button
              className="h-24 flex-col bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("search")}
            >
              <Search className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Find Doctors</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("appointments")}
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Appointments</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("documents")}
            >
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Medical Vault</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("sharing")}
            >
              <Shield className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Share Records</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("payments")}
            >
              <DollarSign className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Payments</span>
            </Button>
            <Button
              className="h-24 flex-col bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
            >
              <Clock className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">Emergency SOS</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;