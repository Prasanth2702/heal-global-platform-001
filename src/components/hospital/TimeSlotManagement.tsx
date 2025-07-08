import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Clock, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  department: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  slotDuration: number; // in minutes
  breakTime: number; // in minutes
  isActive: boolean;
  appointmentType: "consultation" | "procedure" | "emergency" | "followup";
}

const TimeSlotManagement = () => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      department: "General OPD",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      maxAppointments: 16,
      slotDuration: 30,
      breakTime: 0,
      isActive: true,
      appointmentType: "consultation"
    },
    {
      id: "2",
      department: "Radiology",
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "20:00",
      maxAppointments: 24,
      slotDuration: 30,
      breakTime: 15,
      isActive: true,
      appointmentType: "procedure"
    },
    {
      id: "3",
      department: "Pathology Lab",
      dayOfWeek: "Monday",
      startTime: "06:00",
      endTime: "22:00",
      maxAppointments: 32,
      slotDuration: 15,
      breakTime: 0,
      isActive: true,
      appointmentType: "procedure"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [formData, setFormData] = useState({
    department: "",
    startTime: "",
    endTime: "",
    maxAppointments: 10,
    slotDuration: 30,
    breakTime: 0,
    appointmentType: "consultation" as TimeSlot["appointmentType"],
    selectedDays: [] as string[]
  });

  const departments = ["General OPD", "Radiology", "Pathology Lab", "In-house Pharmacy", "Emergency", "Surgery", "ICU"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const appointmentTypes = ["consultation", "procedure", "emergency", "followup"];

  const filteredSlots = selectedDepartment === "all" 
    ? timeSlots 
    : timeSlots.filter(slot => slot.department === selectedDepartment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSlot) {
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingSlot.id 
          ? { ...slot, ...formData, dayOfWeek: slot.dayOfWeek, isActive: slot.isActive }
          : slot
      ));
      toast({
        title: "Time Slot Updated",
        description: `Time slot for ${formData.department} has been updated.`,
      });
      setEditingSlot(null);
    } else {
      // Create time slots for selected days
      const newSlots = formData.selectedDays.map(day => ({
        id: `${Date.now()}-${day}`,
        ...formData,
        dayOfWeek: day,
        isActive: true,
        selectedDays: undefined
      }));
      
      setTimeSlots(prev => [...prev, ...newSlots]);
      toast({
        title: "Time Slots Added",
        description: `Time slots created for ${formData.selectedDays.length} days.`,
      });
    }
    
    setFormData({
      department: "",
      startTime: "",
      endTime: "",
      maxAppointments: 10,
      slotDuration: 30,
      breakTime: 0,
      appointmentType: "consultation",
      selectedDays: []
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      department: slot.department,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxAppointments: slot.maxAppointments,
      slotDuration: slot.slotDuration,
      breakTime: slot.breakTime,
      appointmentType: slot.appointmentType,
      selectedDays: [slot.dayOfWeek]
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const slot = timeSlots.find(s => s.id === id);
    setTimeSlots(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Time Slot Deleted",
      description: `Time slot for ${slot?.department} on ${slot?.dayOfWeek} has been removed.`,
    });
  };

  const toggleSlotStatus = (id: string) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800";
      case "procedure":
        return "bg-purple-100 text-purple-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "followup":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDaySelection = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: checked 
        ? [...prev.selectedDays, day]
        : prev.selectedDays.filter(d => d !== day)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Slot Management</h2>
          <p className="text-muted-foreground">
            Configure appointment time slots for different departments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSlot(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slots
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlot ? "Edit Time Slot" : "Add New Time Slots"}
              </DialogTitle>
              <DialogDescription>
                {editingSlot ? "Update time slot configuration" : "Create new time slots for departments"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    disabled={!!editingSlot}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!editingSlot && (
                  <div className="grid gap-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={formData.selectedDays.includes(day)}
                            onCheckedChange={(checked) => handleDaySelection(day, !!checked)}
                          />
                          <Label htmlFor={day} className="text-sm">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                    <Input
                      id="slotDuration"
                      type="number"
                      value={formData.slotDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, slotDuration: parseInt(e.target.value) || 30 }))}
                      placeholder="30"
                      min="15"
                      step="15"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="breakTime">Break Time (minutes)</Label>
                    <Input
                      id="breakTime"
                      type="number"
                      value={formData.breakTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, breakTime: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      min="0"
                      step="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="maxAppointments">Max Appointments</Label>
                    <Input
                      id="maxAppointments"
                      type="number"
                      value={formData.maxAppointments}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxAppointments: parseInt(e.target.value) || 10 }))}
                      placeholder="10"
                      min="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select 
                      value={formData.appointmentType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value as TimeSlot["appointmentType"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingSlot ? "Update Time Slot" : "Create Time Slots"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="department-filter">Filter by Department:</Label>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Time Slots Configuration
          </CardTitle>
          <CardDescription>
            {filteredSlots.length} time slots configured
            {selectedDepartment !== "all" && ` for ${selectedDepartment}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Slot Duration</TableHead>
                <TableHead>Max Appointments</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium">{slot.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {slot.dayOfWeek}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    {slot.slotDuration} min
                    {slot.breakTime > 0 && (
                      <span className="text-muted-foreground text-xs ml-1">
                        (+{slot.breakTime}min break)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {slot.maxAppointments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(slot.appointmentType)} variant="outline">
                      {slot.appointmentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={slot.isActive ? "default" : "outline"}
                      onClick={() => toggleSlotStatus(slot.id)}
                      className="w-16"
                    >
                      {slot.isActive ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slot)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(slot.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotManagement;