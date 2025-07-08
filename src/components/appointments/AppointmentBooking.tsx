import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, User, Video, CreditCard, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [paymentOption, setPaymentOption] = useState("");

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM"
  ];

  const doctors = [
    { id: "1", name: "Dr. Smith", specialty: "Cardiology", fee: 1200 },
    { id: "2", name: "Dr. Johnson", specialty: "General Medicine", fee: 800 },
    { id: "3", name: "Dr. Brown", specialty: "Orthopedics", fee: 1000 }
  ];

  const [selectedDoctor, setSelectedDoctor] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Book Appointment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                        <Badge variant="secondary">₹{doctor.fee}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>In-Person Consultation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>Video Consultation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="group-video">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>3-Way Video Conference</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot(slot)}
                    className="justify-start"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Patient Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" placeholder="Enter patient name" />
              </div>
              <div>
                <Label htmlFor="patient-phone">Phone Number</Label>
                <Input id="patient-phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="patient-email">Email Address</Label>
                <Input id="patient-email" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="patient-age">Age</Label>
                <Input id="patient-age" type="number" placeholder="Enter age" />
              </div>
            </div>
            <div>
              <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
              <Textarea 
                id="symptoms" 
                placeholder="Describe symptoms or reason for consultation"
                rows={3}
              />
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <Label className="text-base font-medium">Payment Option</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Button
                variant={paymentOption === "pre-payment" ? "default" : "outline"}
                onClick={() => setPaymentOption("pre-payment")}
                className="justify-start h-auto p-4"
              >
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <p className="font-medium">Pre-Payment</p>
                    <p className="text-sm text-muted-foreground">Pay now to confirm appointment</p>
                  </div>
                </div>
              </Button>
              <Button
                variant={paymentOption === "post-payment" ? "default" : "outline"}
                onClick={() => setPaymentOption("post-payment")}
                className="justify-start h-auto p-4"
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <p className="font-medium">Post-Payment</p>
                    <p className="text-sm text-muted-foreground">Pay after consultation</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Appointment Summary */}
          {selectedDate && selectedSlot && selectedDoctor && (
            <Card className="bg-accent">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-3">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                  <p><strong>Date:</strong> {format(selectedDate, "PPP")}</p>
                  <p><strong>Time:</strong> {selectedSlot}</p>
                  <p><strong>Type:</strong> {appointmentType.replace("-", " ").toUpperCase()}</p>
                  <p><strong>Fee:</strong> ₹{doctors.find(d => d.id === selectedDoctor)?.fee}</p>
                  <p><strong>Payment:</strong> {paymentOption.replace("-", " ").toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button size="lg" className="flex-1">
              {paymentOption === "pre-payment" ? "Book & Pay Now" : "Book Appointment"}
            </Button>
            <Button variant="outline" size="lg">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;