import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentBooking from "@/components/appointments/AppointmentBooking";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import VideoConsultation from "@/components/consultations/VideoConsultation";
import PatientNotes from "@/components/consultations/PatientNotes";
import PrescriptionGenerator from "@/components/prescriptions/PrescriptionGenerator";
import AppointmentReminders from "@/components/appointments/AppointmentReminders";
import IntegrationSettings from "@/components/settings/IntegrationSettings";

const AppointmentSystemPage = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appointment & Consultation System</h1>
          <p className="text-muted-foreground">
            Complete appointment management with teleconsultation and prescription system
          </p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="booking">Book Appointment</TabsTrigger>
            <TabsTrigger value="video">Video Consultation</TabsTrigger>
            <TabsTrigger value="notes">Patient Notes</TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="integrations">API Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <AppointmentCalendar />
          </TabsContent>

          <TabsContent value="booking">
            <AppointmentBooking />
          </TabsContent>

          <TabsContent value="video">
            <VideoConsultation 
              appointmentId="APT-001" 
              patientName="John Doe" 
              consultationType="three-way"
            />
          </TabsContent>

          <TabsContent value="notes">
            <PatientNotes 
              patientId="PAT-001" 
              appointmentId="APT-001" 
              patientName="John Doe"
            />
          </TabsContent>

          <TabsContent value="prescription">
            <PrescriptionGenerator 
              patientId="PAT-001" 
              patientName="John Doe" 
              doctorName="Dr. Smith"
              appointmentId="APT-001"
            />
          </TabsContent>

          <TabsContent value="reminders">
            <AppointmentReminders />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentSystemPage;