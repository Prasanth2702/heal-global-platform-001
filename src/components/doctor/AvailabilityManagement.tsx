import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, DollarSign, Video, MapPin, Plus, Edit, Save, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  slotType: "consultation" | "emergency" | "break";
}

interface DaySchedule {
  day: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

interface ConsultationFees {
  inPerson: number;
  teleconsultation: number;
  followUp: number;
  emergency: number;
}

const AvailabilityManagement = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for schedule
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      isActive: true,
      timeSlots: [
        { id: "mon-1", startTime: "09:00", endTime: "12:00", isAvailable: true, slotType: "consultation" },
        { id: "mon-2", startTime: "14:00", endTime: "18:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Tuesday",
      isActive: true,
      timeSlots: [
        { id: "tue-1", startTime: "09:00", endTime: "12:00", isAvailable: true, slotType: "consultation" },
        { id: "tue-2", startTime: "14:00", endTime: "17:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Wednesday",
      isActive: true,
      timeSlots: [
        { id: "wed-1", startTime: "10:00", endTime: "13:00", isAvailable: true, slotType: "consultation" },
        { id: "wed-2", startTime: "15:00", endTime: "18:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Thursday",
      isActive: true,
      timeSlots: [
        { id: "thu-1", startTime: "09:00", endTime: "12:00", isAvailable: true, slotType: "consultation" },
        { id: "thu-2", startTime: "14:00", endTime: "17:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Friday",
      isActive: true,
      timeSlots: [
        { id: "fri-1", startTime: "09:00", endTime: "12:00", isAvailable: true, slotType: "consultation" },
        { id: "fri-2", startTime: "14:00", endTime: "16:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Saturday",
      isActive: true,
      timeSlots: [
        { id: "sat-1", startTime: "10:00", endTime: "14:00", isAvailable: true, slotType: "consultation" },
      ]
    },
    {
      day: "Sunday",
      isActive: false,
      timeSlots: []
    }
  ]);

  const [consultationFees, setConsultationFees] = useState<ConsultationFees>({
    inPerson: 800,
    teleconsultation: 600,
    followUp: 500,
    emergency: 1200
  });

  const [preferences, setPreferences] = useState({
    maxPatientsPerDay: 20,
    slotDuration: 30,
    breakDuration: 15,
    advanceBookingDays: 30,
    allowEmergencySlots: true,
    autoAcceptBookings: false,
    teleconsultationEnabled: true,
    inPersonEnabled: true
  });

  const handleSaveSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "Your availability and timings have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleSaveFees = () => {
    toast({
      title: "Consultation Fees Updated",
      description: "Your consultation fees have been updated successfully.",
    });
  };

  const toggleDayAvailability = (dayIndex: number) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].isActive = !updatedSchedule[dayIndex].isActive;
    setWeeklySchedule(updatedSchedule);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: `${weeklySchedule[dayIndex].day.toLowerCase()}-${Date.now()}`,
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
      slotType: "consultation"
    };
    
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].timeSlots.push(newSlot);
    setWeeklySchedule(updatedSchedule);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability & Timings</h2>
          <p className="text-muted-foreground">
            Manage your schedule, consultation fees, and booking preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "Cancel" : "Edit Schedule"}
          </Button>
          {isEditing && (
            <Button variant="doctor" onClick={handleSaveSchedule}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="fees">Consultation Fees</TabsTrigger>
          <TabsTrigger value="preferences">Booking Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Weekly Schedule */}
          <div className="grid gap-4">
            {weeklySchedule.map((daySchedule, dayIndex) => (
              <Card key={daySchedule.day} className={!daySchedule.isActive ? "opacity-50" : ""}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{daySchedule.day}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${daySchedule.day}-active`} className="text-sm">
                        Available
                      </Label>
                      <Switch
                        id={`${daySchedule.day}-active`}
                        checked={daySchedule.isActive}
                        onCheckedChange={() => toggleDayAvailability(dayIndex)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardHeader>
                {daySchedule.isActive && (
                  <CardContent>
                    <div className="space-y-3">
                      {daySchedule.timeSlots.map((slot, slotIndex) => (
                        <div key={slot.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={slot.startTime}
                              disabled={!isEditing}
                              className="w-24"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              disabled={!isEditing}
                              className="w-24"
                            />
                          </div>
                          <Select value={slot.slotType} disabled={!isEditing}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">Consultation</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="break">Break</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant={slot.isAvailable ? "secondary" : "destructive"}>
                            {slot.isAvailable ? "Available" : "Blocked"}
                          </Badge>
                          {isEditing && (
                            <Button size="sm" variant="outline">
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(dayIndex)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Time Slot
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          {/* Consultation Fees */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  In-Person Consultation
                </CardTitle>
                <CardDescription>
                  Fee for face-to-face consultations at your clinic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="in-person-fee">Consultation Fee (₹)</Label>
                    <Input
                      id="in-person-fee"
                      type="number"
                      value={consultationFees.inPerson}
                      onChange={(e) => setConsultationFees({
                        ...consultationFees,
                        inPerson: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <Button onClick={handleSaveFees} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Fee
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Teleconsultation
                </CardTitle>
                <CardDescription>
                  Fee for online video consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tele-fee">Consultation Fee (₹)</Label>
                    <Input
                      id="tele-fee"
                      type="number"
                      value={consultationFees.teleconsultation}
                      onChange={(e) => setConsultationFees({
                        ...consultationFees,
                        teleconsultation: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <Button onClick={handleSaveFees} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Fee
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Follow-up Consultation
                </CardTitle>
                <CardDescription>
                  Fee for follow-up visits within 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="followup-fee">Consultation Fee (₹)</Label>
                    <Input
                      id="followup-fee"
                      type="number"
                      value={consultationFees.followUp}
                      onChange={(e) => setConsultationFees({
                        ...consultationFees,
                        followUp: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <Button onClick={handleSaveFees} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Fee
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Emergency Consultation
                </CardTitle>
                <CardDescription>
                  Fee for urgent/emergency consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergency-fee">Consultation Fee (₹)</Label>
                    <Input
                      id="emergency-fee"
                      type="number"
                      value={consultationFees.emergency}
                      onChange={(e) => setConsultationFees({
                        ...consultationFees,
                        emergency: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <Button onClick={handleSaveFees} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Fee
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          {/* Booking Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your booking and consultation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max-patients">Maximum Patients Per Day</Label>
                  <Input
                    id="max-patients"
                    type="number"
                    value={preferences.maxPatientsPerDay}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      maxPatientsPerDay: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="slot-duration">Slot Duration (minutes)</Label>
                  <Input
                    id="slot-duration"
                    type="number"
                    value={preferences.slotDuration}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      slotDuration: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="advance-booking">Advance Booking (days)</Label>
                  <Input
                    id="advance-booking"
                    type="number"
                    value={preferences.advanceBookingDays}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      advanceBookingDays: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consultation Options</CardTitle>
                <CardDescription>
                  Enable or disable different consultation types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tele-enabled">Teleconsultation</Label>
                  <Switch
                    id="tele-enabled"
                    checked={preferences.teleconsultationEnabled}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      teleconsultationEnabled: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-person-enabled">In-Person Consultation</Label>
                  <Switch
                    id="in-person-enabled"
                    checked={preferences.inPersonEnabled}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      inPersonEnabled: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-slots">Emergency Slots</Label>
                  <Switch
                    id="emergency-slots"
                    checked={preferences.allowEmergencySlots}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      allowEmergencySlots: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-accept">Auto Accept Bookings</Label>
                  <Switch
                    id="auto-accept"
                    checked={preferences.autoAcceptBookings}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      autoAcceptBookings: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
              <CardDescription>
                Add any special instructions for patients booking appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter special instructions for patients (e.g., bring previous reports, fast for 12 hours before blood test, etc.)"
                rows={4}
              />
              <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Instructions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManagement;