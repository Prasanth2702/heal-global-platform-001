import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Clock, DollarSign, Video, MapPin, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import WeeklyScheduleGrid from "./WeeklyScheduleGrid";

type SlotType = "clinic" | "tele" | null;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

interface ConsultationFees {
  inPerson: number;
  teleconsultation: number;
  followUp: number;
  emergency: number;
}

interface AvailabilityManagementProps {
  onBack: () => void;
}

const AvailabilityManagement: React.FC<AvailabilityManagementProps> = ({ onBack }) => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // State for slot types by day and time
  const [slotsByDay, setSlotsByDay] = useState<{ [day: string]: { [slot: string]: SlotType } }>(() => {
    const init: { [day: string]: { [slot: string]: SlotType } } = {};
    daysOfWeek.forEach(day => {
      init[day] = {};
      timeSlots.forEach(slot => {
        init[day][slot] = null;
      });
    });
    return init;
  });

  // State for slot IDs by day and time
  const [slotsById, setSlotsById] = useState<{ [day: string]: { [slot: string]: string | null } }>(() => {
    const init: { [day: string]: { [slot: string]: string | null } } = {};
    daysOfWeek.forEach(day => {
      init[day] = {};
      timeSlots.forEach(slot => {
        init[day][slot] = null;
      });
    });
    return init;
  });

  // To track original slot types for change detection
  const [originalSlotsByDay, setOriginalSlotsByDay] = useState<{ [day: string]: { [slot: string]: SlotType } }>({});

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

  // Extracted fetchSlots for reuse after save
  const fetchSlots = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        toast({ title: "Error", description: "Unable to get user info.", variant: "destructive" });
        navigate("/login/doctor");
        return;
      }
      if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to manage availability", variant: 'destructive' });
        navigate("/login/doctor");
        return;
      }

      const { data, error } = await supabase
        .from("time_slots")
        .select("id, day_of_week, start_time, slot_type")
        .eq("doctor_id", user.id)
        .eq("is_available", true);

      if (error) {
        toast({ title: "Failed to load time slots", description: error.message, variant: "destructive" });
        return;
      }

      const loadedSlots: { [day: string]: { [slot: string]: SlotType } } = {};
      const loadedIds: { [day: string]: { [slot: string]: string | null } } = {};

      daysOfWeek.forEach(day => {
        loadedSlots[day] = {};
        loadedIds[day] = {};
        timeSlots.forEach(slot => {
          loadedSlots[day][slot] = null;
          loadedIds[day][slot] = null;
        });
      });

      data?.forEach(slot => {
        if (slot.day_of_week && slot.start_time && slot.slot_type) {
          const normalizedTime = slot.start_time.length > 5 ? slot.start_time.substring(0, 5) : slot.start_time;
          loadedSlots[slot.day_of_week][normalizedTime] = slot.slot_type as SlotType;
          loadedIds[slot.day_of_week][normalizedTime] = slot.id || null;
        }
      });

      setSlotsByDay(loadedSlots);
      setSlotsById(loadedIds);
      setOriginalSlotsByDay(loadedSlots);
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong loading slots.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [navigate, toast]);

  const updateSlotType = (day: string, slot: string, type: SlotType) => {
    setSlotsByDay(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: type,
      }
    }));
  };

  const padHour = (hour: number) => hour.toString().padStart(2, "0");


  const handleSaveSchedule = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Not authenticated", description: "Please login", variant: "destructive" });
      setSaving(false);
      return;
    }

    const slotsToInsertOrUpdate: any[] = [];
    const slotsToDelete: string[] = [];

    for (const day in slotsByDay) {
      for (const slot in slotsByDay[day]) {
        const currentType = slotsByDay[day][slot];
        const originalType = originalSlotsByDay[day]?.[slot];
        const slotId = slotsById[day]?.[slot];

        if (currentType !== originalType) {
          if (currentType === null && originalType !== null && slotId) {
            // Schedule slot deleted - mark for delete by id
            slotsToDelete.push(slotId);
          } else if (currentType !== null) {
            // Schedule slot inserted or changed - build data for upsert
            const slotData: any = {
              doctor_id: user.id,
              day_of_week: day,
              start_time: slot,
              end_time: padHour(parseInt(slot.split(":")[0]) + 1) + ":" + slot.split(":")[1],
              slot_type: currentType,
              is_available: true,
            };
            if (typeof slotId === "string" && slotId.trim() !== "") {
              slotData.id = slotId;
            }
            slotsToInsertOrUpdate.push(slotData);
          }
        }
      }
    }

    // Delete slots by id
    for (const id of slotsToDelete) {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) {
        toast({ title: "Error deleting slots", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    if (slotsToInsertOrUpdate.length > 0) {
      const { error } = await supabase
        .from('time_slots')
        .upsert(slotsToInsertOrUpdate, { onConflict: 'id' });

      if (error) {
        toast({ title: "Error saving slots", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    toast({ title: "Schedule saved", description: "Availability updated successfully." });
    setSaving(false);
    setIsEditing(false);

    await fetchSlots();
  };


  const handleSaveFees = () => {
    toast({
      title: "Consultation Fees Updated",
      description: "Your consultation fees have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 m-2">
         <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </Button>
          </div>
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
            <Button variant="doctor" onClick={handleSaveSchedule} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="view-weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view-weekly">Edit Weekly Schedule</TabsTrigger>
          <TabsTrigger value="fees">Consultation Fees</TabsTrigger>
          <TabsTrigger value="preferences">Booking Preferences</TabsTrigger>
        </TabsList>


        <TabsContent value="view-weekly" className="space-y-6 p-4">
          <WeeklyScheduleGrid
            slotsByDay={slotsByDay}
            updateSlotType={updateSlotType}
            isEditing={isEditing}
          />

          {isEditing && (
            <Button
              variant="doctor"
              onClick={handleSaveSchedule}
              disabled={saving}
              className="mt-4"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
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
